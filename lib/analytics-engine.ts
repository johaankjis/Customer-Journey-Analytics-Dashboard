// Analytics computation engine for funnel and cohort analysis

import { type UserEvent, type User, mockUsers, mockEvents } from "./mock-data"

export interface FunnelStage {
  stage: string
  users: number
  conversionRate: number
  dropOffRate: number
}

export interface CohortData {
  cohort: string
  week0: number
  week1: number
  week2: number
  week3: number
  week4: number
}

export interface SegmentData {
  segment: string
  value: string
  users: number
  activationRate: number
  retentionRate: number
}

export interface KPIMetrics {
  totalUsers: number
  activatedUsers: number
  retainedUsers7Day: number
  retainedUsers30Day: number
  avgTimeToActivation: number
  topFeature: string
}

export interface TimeSeriesData {
  date: string
  signups: number
  activations: number
  retentions: number
}

export interface TrendData {
  metric: string
  current: number
  previous: number
  change: number
  changePercent: number
  trend: "up" | "down" | "stable"
}

export interface FeatureUsageData {
  feature: string
  uses: number
  uniqueUsers: number
  avgUsesPerUser: number
}

export class AnalyticsEngine {
  private users: User[]
  private events: UserEvent[]
  private cache: Map<string, { data: any; timestamp: number }>

  constructor(users: User[], events: UserEvent[]) {
    this.users = users
    this.events = events
    this.cache = new Map()
  }

  private getCached<T>(key: string, ttl = 300000): T | null {
    const cached = this.cache.get(key)
    if (cached && Date.now() - cached.timestamp < ttl) {
      return cached.data as T
    }
    return null
  }

  private setCache(key: string, data: any): void {
    this.cache.set(key, { data, timestamp: Date.now() })
  }

  private clearCache(): void {
    this.cache.clear()
  }

  // Compute funnel metrics
  computeFunnel(): FunnelStage[] {
    const userEventMap = new Map<string, Set<string>>()

    this.events.forEach((event) => {
      if (!userEventMap.has(event.userId)) {
        userEventMap.set(event.userId, new Set())
      }
      userEventMap.get(event.userId)!.add(event.eventType)
    })

    const signups = this.users.length
    const onboardingStarts = Array.from(userEventMap.values()).filter((events) => events.has("onboarding_start")).length
    const onboardingCompletes = Array.from(userEventMap.values()).filter((events) =>
      events.has("onboarding_complete"),
    ).length
    const activations = Array.from(userEventMap.values()).filter((events) => events.has("activation")).length
    const retention7 = Array.from(userEventMap.values()).filter((events) => events.has("retention_day_7")).length
    const retention30 = Array.from(userEventMap.values()).filter((events) => events.has("retention_day_30")).length

    return [
      {
        stage: "Sign Up",
        users: signups,
        conversionRate: 100,
        dropOffRate: 0,
      },
      {
        stage: "Onboarding Start",
        users: onboardingStarts,
        conversionRate: (onboardingStarts / signups) * 100,
        dropOffRate: ((signups - onboardingStarts) / signups) * 100,
      },
      {
        stage: "Onboarding Complete",
        users: onboardingCompletes,
        conversionRate: (onboardingCompletes / signups) * 100,
        dropOffRate: ((onboardingStarts - onboardingCompletes) / onboardingStarts) * 100,
      },
      {
        stage: "Activation",
        users: activations,
        conversionRate: (activations / signups) * 100,
        dropOffRate: ((onboardingCompletes - activations) / onboardingCompletes) * 100,
      },
      {
        stage: "7-Day Retention",
        users: retention7,
        conversionRate: (retention7 / signups) * 100,
        dropOffRate: ((activations - retention7) / activations) * 100,
      },
      {
        stage: "30-Day Retention",
        users: retention30,
        conversionRate: (retention30 / signups) * 100,
        dropOffRate: ((retention7 - retention30) / retention7) * 100,
      },
    ]
  }

  // Compute cohort analysis
  computeCohorts(): CohortData[] {
    const cohortMap = new Map<string, Map<string, Set<string>>>()

    // Group users by cohort
    this.users.forEach((user) => {
      if (!cohortMap.has(user.cohort)) {
        cohortMap.set(user.cohort, new Map())
      }
    })

    // Track retention by week
    this.events.forEach((event) => {
      const user = this.users.find((u) => u.userId === event.userId)
      if (!user) return

      const cohort = user.cohort
      const weeksSinceSignup = Math.floor((event.timestamp.getTime() - user.signupDate.getTime()) / (7 * 86400000))

      if (weeksSinceSignup >= 0 && weeksSinceSignup <= 4) {
        const weekKey = `week${weeksSinceSignup}`
        if (!cohortMap.get(cohort)!.has(weekKey)) {
          cohortMap.get(cohort)!.set(weekKey, new Set())
        }
        cohortMap.get(cohort)!.get(weekKey)!.add(user.userId)
      }
    })

    // Convert to array format
    const cohorts: CohortData[] = []
    cohortMap.forEach((weeks, cohort) => {
      const week0Size = weeks.get("week0")?.size || 0
      cohorts.push({
        cohort,
        week0: 100,
        week1: week0Size > 0 ? ((weeks.get("week1")?.size || 0) / week0Size) * 100 : 0,
        week2: week0Size > 0 ? ((weeks.get("week2")?.size || 0) / week0Size) * 100 : 0,
        week3: week0Size > 0 ? ((weeks.get("week3")?.size || 0) / week0Size) * 100 : 0,
        week4: week0Size > 0 ? ((weeks.get("week4")?.size || 0) / week0Size) * 100 : 0,
      })
    })

    return cohorts.sort((a, b) => a.cohort.localeCompare(b.cohort)).slice(0, 10)
  }

  // Compute segmentation analysis
  computeSegmentation(segmentBy: "channel" | "device" | "region" | "plan"): SegmentData[] {
    const segmentMap = new Map<string, { users: Set<string>; activated: Set<string>; retained: Set<string> }>()

    this.users.forEach((user) => {
      const segmentValue = user[segmentBy]
      if (!segmentMap.has(segmentValue)) {
        segmentMap.set(segmentValue, {
          users: new Set(),
          activated: new Set(),
          retained: new Set(),
        })
      }
      segmentMap.get(segmentValue)!.users.add(user.userId)
    })

    this.events.forEach((event) => {
      const user = this.users.find((u) => u.userId === event.userId)
      if (!user) return

      const segmentValue = user[segmentBy]
      const segment = segmentMap.get(segmentValue)
      if (!segment) return

      if (event.eventType === "activation") {
        segment.activated.add(event.userId)
      }
      if (event.eventType === "retention_day_7") {
        segment.retained.add(event.userId)
      }
    })

    const segments: SegmentData[] = []
    segmentMap.forEach((data, value) => {
      segments.push({
        segment: segmentBy,
        value,
        users: data.users.size,
        activationRate: (data.activated.size / data.users.size) * 100,
        retentionRate: (data.retained.size / data.users.size) * 100,
      })
    })

    return segments.sort((a, b) => b.users - a.users)
  }

  // Compute KPI metrics
  computeKPIs(): KPIMetrics {
    const userEventMap = new Map<string, UserEvent[]>()
    this.events.forEach((event) => {
      if (!userEventMap.has(event.userId)) {
        userEventMap.set(event.userId, [])
      }
      userEventMap.get(event.userId)!.push(event)
    })

    const activatedUsers = Array.from(userEventMap.values()).filter((events) =>
      events.some((e) => e.eventType === "activation"),
    )

    const retainedUsers7 = Array.from(userEventMap.values()).filter((events) =>
      events.some((e) => e.eventType === "retention_day_7"),
    )

    const retainedUsers30 = Array.from(userEventMap.values()).filter((events) =>
      events.some((e) => e.eventType === "retention_day_30"),
    )

    // Calculate average time to activation
    let totalActivationTime = 0
    let activationCount = 0
    userEventMap.forEach((events, userId) => {
      const signup = events.find((e) => e.eventType === "signup")
      const activation = events.find((e) => e.eventType === "activation")
      if (signup && activation) {
        totalActivationTime += activation.timestamp.getTime() - signup.timestamp.getTime()
        activationCount++
      }
    })

    // Find top feature
    const featureCount = new Map<string, number>()
    this.events
      .filter((e) => e.eventType === "feature_use")
      .forEach((e) => {
        const feature = e.metadata.feature || "unknown"
        featureCount.set(feature, (featureCount.get(feature) || 0) + 1)
      })

    const topFeature = Array.from(featureCount.entries()).sort((a, b) => b[1] - a[1])[0]?.[0] || "dashboard"

    return {
      totalUsers: this.users.length,
      activatedUsers: activatedUsers.length,
      retainedUsers7Day: retainedUsers7.length,
      retainedUsers30Day: retainedUsers30.length,
      avgTimeToActivation: activationCount > 0 ? totalActivationTime / activationCount / 3600000 : 0, // in hours
      topFeature,
    }
  }

  computeTimeSeries(days = 30): TimeSeriesData[] {
    const cacheKey = `timeseries_${days}`
    const cached = this.getCached<TimeSeriesData[]>(cacheKey)
    if (cached) return cached

    const endDate = new Date()
    const startDate = new Date(endDate.getTime() - days * 86400000)
    const dateMap = new Map<string, { signups: Set<string>; activations: Set<string>; retentions: Set<string> }>()

    // Initialize date buckets
    for (let i = 0; i < days; i++) {
      const date = new Date(startDate.getTime() + i * 86400000)
      const dateKey = date.toISOString().split("T")[0]
      dateMap.set(dateKey, {
        signups: new Set(),
        activations: new Set(),
        retentions: new Set(),
      })
    }

    // Aggregate events by date
    this.events.forEach((event) => {
      const dateKey = event.timestamp.toISOString().split("T")[0]
      const bucket = dateMap.get(dateKey)
      if (!bucket) return

      if (event.eventType === "signup") {
        bucket.signups.add(event.userId)
      } else if (event.eventType === "activation") {
        bucket.activations.add(event.userId)
      } else if (event.eventType === "retention_day_7" || event.eventType === "retention_day_30") {
        bucket.retentions.add(event.userId)
      }
    })

    const result = Array.from(dateMap.entries())
      .map(([date, data]) => ({
        date,
        signups: data.signups.size,
        activations: data.activations.size,
        retentions: data.retentions.size,
      }))
      .sort((a, b) => a.date.localeCompare(b.date))

    this.setCache(cacheKey, result)
    return result
  }

  computeTrends(currentPeriodDays = 7, previousPeriodDays = 7): TrendData[] {
    const now = new Date()
    const currentStart = new Date(now.getTime() - currentPeriodDays * 86400000)
    const previousStart = new Date(currentStart.getTime() - previousPeriodDays * 86400000)

    const currentEvents = this.events.filter((e) => e.timestamp >= currentStart && e.timestamp < now)
    const previousEvents = this.events.filter((e) => e.timestamp >= previousStart && e.timestamp < currentStart)

    const currentSignups = new Set(currentEvents.filter((e) => e.eventType === "signup").map((e) => e.userId)).size
    const previousSignups = new Set(previousEvents.filter((e) => e.eventType === "signup").map((e) => e.userId)).size

    const currentActivations = new Set(currentEvents.filter((e) => e.eventType === "activation").map((e) => e.userId))
      .size
    const previousActivations = new Set(previousEvents.filter((e) => e.eventType === "activation").map((e) => e.userId))
      .size

    const currentRetentions = new Set(
      currentEvents.filter((e) => e.eventType === "retention_day_7").map((e) => e.userId),
    ).size
    const previousRetentions = new Set(
      previousEvents.filter((e) => e.eventType === "retention_day_7").map((e) => e.userId),
    ).size

    const calculateTrend = (current: number, previous: number): TrendData["trend"] => {
      const change = ((current - previous) / (previous || 1)) * 100
      if (Math.abs(change) < 5) return "stable"
      return change > 0 ? "up" : "down"
    }

    return [
      {
        metric: "Signups",
        current: currentSignups,
        previous: previousSignups,
        change: currentSignups - previousSignups,
        changePercent: ((currentSignups - previousSignups) / (previousSignups || 1)) * 100,
        trend: calculateTrend(currentSignups, previousSignups),
      },
      {
        metric: "Activations",
        current: currentActivations,
        previous: previousActivations,
        change: currentActivations - previousActivations,
        changePercent: ((currentActivations - previousActivations) / (previousActivations || 1)) * 100,
        trend: calculateTrend(currentActivations, previousActivations),
      },
      {
        metric: "7-Day Retentions",
        current: currentRetentions,
        previous: previousRetentions,
        change: currentRetentions - previousRetentions,
        changePercent: ((currentRetentions - previousRetentions) / (previousRetentions || 1)) * 100,
        trend: calculateTrend(currentRetentions, previousRetentions),
      },
    ]
  }

  computeFeatureUsage(): FeatureUsageData[] {
    const cacheKey = "feature_usage"
    const cached = this.getCached<FeatureUsageData[]>(cacheKey)
    if (cached) return cached

    const featureMap = new Map<string, { uses: number; users: Set<string> }>()

    this.events
      .filter((e) => e.eventType === "feature_use")
      .forEach((event) => {
        const feature = event.metadata.feature || "unknown"
        if (!featureMap.has(feature)) {
          featureMap.set(feature, { uses: 0, users: new Set() })
        }
        const data = featureMap.get(feature)!
        data.uses++
        data.users.add(event.userId)
      })

    const result = Array.from(featureMap.entries())
      .map(([feature, data]) => ({
        feature,
        uses: data.uses,
        uniqueUsers: data.users.size,
        avgUsesPerUser: data.uses / data.users.size,
      }))
      .sort((a, b) => b.uses - a.uses)

    this.setCache(cacheKey, result)
    return result
  }

  computeConversionRates(segmentBy?: "channel" | "device" | "region" | "plan"): {
    overall: number
    bySegment?: Map<string, number>
  } {
    const activatedUsers = new Set(this.events.filter((e) => e.eventType === "activation").map((e) => e.userId))
    const overall = (activatedUsers.size / this.users.length) * 100

    if (!segmentBy) {
      return { overall }
    }

    const bySegment = new Map<string, number>()
    const segmentUserMap = new Map<string, Set<string>>()
    const segmentActivatedMap = new Map<string, Set<string>>()

    this.users.forEach((user) => {
      const segmentValue = user[segmentBy]
      if (!segmentUserMap.has(segmentValue)) {
        segmentUserMap.set(segmentValue, new Set())
        segmentActivatedMap.set(segmentValue, new Set())
      }
      segmentUserMap.get(segmentValue)!.add(user.userId)
      if (activatedUsers.has(user.userId)) {
        segmentActivatedMap.get(segmentValue)!.add(user.userId)
      }
    })

    segmentUserMap.forEach((users, segment) => {
      const activated = segmentActivatedMap.get(segment)?.size || 0
      bySegment.set(segment, (activated / users.size) * 100)
    })

    return { overall, bySegment }
  }

  computeRetentionCurve(maxDays = 30): { day: number; retentionRate: number }[] {
    const userFirstActivity = new Map<string, Date>()
    const userActivityByDay = new Map<string, Set<number>>()

    // Find first activity for each user
    this.events.forEach((event) => {
      if (!userFirstActivity.has(event.userId)) {
        userFirstActivity.set(event.userId, event.timestamp)
      }
    })

    // Track activity days relative to first activity
    this.events.forEach((event) => {
      const firstActivity = userFirstActivity.get(event.userId)
      if (!firstActivity) return

      const daysSinceFirst = Math.floor((event.timestamp.getTime() - firstActivity.getTime()) / 86400000)
      if (daysSinceFirst >= 0 && daysSinceFirst <= maxDays) {
        if (!userActivityByDay.has(event.userId)) {
          userActivityByDay.set(event.userId, new Set())
        }
        userActivityByDay.get(event.userId)!.add(daysSinceFirst)
      }
    })

    const totalUsers = userFirstActivity.size
    const curve: { day: number; retentionRate: number }[] = []

    for (let day = 0; day <= maxDays; day++) {
      let activeUsers = 0
      userActivityByDay.forEach((days) => {
        if (days.has(day)) activeUsers++
      })
      curve.push({
        day,
        retentionRate: (activeUsers / totalUsers) * 100,
      })
    }

    return curve
  }

  filterEventsByDateRange(startDate: Date, endDate: Date): UserEvent[] {
    return this.events.filter((e) => e.timestamp >= startDate && e.timestamp <= endDate)
  }

  filterUsersBySegment(segmentBy: "channel" | "device" | "region" | "plan", value: string): User[] {
    return this.users.filter((u) => u[segmentBy] === value)
  }

  aggregateEventsByType(): Map<string, number> {
    const aggregation = new Map<string, number>()
    this.events.forEach((event) => {
      aggregation.set(event.eventType, (aggregation.get(event.eventType) || 0) + 1)
    })
    return aggregation
  }
}

// Export singleton instance
export const analyticsEngine = new AnalyticsEngine(mockUsers, mockEvents)
