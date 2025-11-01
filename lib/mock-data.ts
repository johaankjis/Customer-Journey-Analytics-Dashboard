// Mock data generator for customer journey analytics

export interface UserEvent {
  userId: string
  eventType:
    | "signup"
    | "onboarding_start"
    | "onboarding_complete"
    | "activation"
    | "feature_use"
    | "retention_day_7"
    | "retention_day_30"
  timestamp: Date
  metadata: {
    channel?: string
    device?: string
    region?: string
    plan?: string
    feature?: string
  }
}

export interface User {
  userId: string
  signupDate: Date
  channel: string
  device: string
  region: string
  plan: string
  cohort: string
}

const channels = ["organic", "paid_search", "social", "referral", "email"]
const devices = ["desktop", "mobile", "tablet"]
const regions = ["North America", "Europe", "Asia", "South America", "Other"]
const plans = ["free", "starter", "pro", "enterprise"]
const features = ["dashboard", "reports", "integrations", "api", "analytics", "export"]

function randomChoice<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

function randomDate(start: Date, end: Date): Date {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
}

function getCohortWeek(date: Date): string {
  const weekStart = new Date(date)
  weekStart.setDate(date.getDate() - date.getDay())
  return weekStart.toISOString().split("T")[0]
}

export function generateMockUsers(count = 10000): User[] {
  const users: User[] = []
  const endDate = new Date()
  const startDate = new Date(endDate.getTime() - 90 * 86400000) // Last 90 days

  for (let i = 0; i < count; i++) {
    const signupDate = randomDate(startDate, endDate)
    users.push({
      userId: `user_${i + 1}`,
      signupDate,
      channel: randomChoice(channels),
      device: randomChoice(devices),
      region: randomChoice(regions),
      plan: randomChoice(plans),
      cohort: getCohortWeek(signupDate),
    })
  }

  return users
}

export function generateMockEvents(users: User[]): UserEvent[] {
  const events: UserEvent[] = []

  users.forEach((user) => {
    // Signup event (100%)
    events.push({
      userId: user.userId,
      eventType: "signup",
      timestamp: user.signupDate,
      metadata: {
        channel: user.channel,
        device: user.device,
        region: user.region,
        plan: user.plan,
      },
    })

    // Onboarding start (95% conversion)
    if (Math.random() < 0.95) {
      const onboardingStart = new Date(user.signupDate.getTime() + Math.random() * 3600000) // Within 1 hour
      events.push({
        userId: user.userId,
        eventType: "onboarding_start",
        timestamp: onboardingStart,
        metadata: { device: user.device },
      })

      // Onboarding complete (85% of those who started - 15% drop-off)
      if (Math.random() < 0.85) {
        const onboardingComplete = new Date(onboardingStart.getTime() + Math.random() * 7200000) // Within 2 hours
        events.push({
          userId: user.userId,
          eventType: "onboarding_complete",
          timestamp: onboardingComplete,
          metadata: { device: user.device },
        })

        // Activation (70% of those who completed onboarding)
        if (Math.random() < 0.7) {
          const activation = new Date(onboardingComplete.getTime() + Math.random() * 86400000) // Within 1 day
          events.push({
            userId: user.userId,
            eventType: "activation",
            timestamp: activation,
            metadata: { device: user.device },
          })

          // Feature usage (multiple events)
          const featureCount = Math.floor(Math.random() * 5) + 1
          for (let i = 0; i < featureCount; i++) {
            const featureUse = new Date(activation.getTime() + Math.random() * 604800000) // Within 1 week
            events.push({
              userId: user.userId,
              eventType: "feature_use",
              timestamp: featureUse,
              metadata: {
                device: user.device,
                feature: randomChoice(features),
              },
            })
          }

          // 7-day retention (60% of activated users)
          if (Math.random() < 0.6) {
            const retention7 = new Date(activation.getTime() + 7 * 86400000)
            if (retention7 <= new Date()) {
              events.push({
                userId: user.userId,
                eventType: "retention_day_7",
                timestamp: retention7,
                metadata: { device: user.device },
              })

              // 30-day retention (40% of 7-day retained users)
              if (Math.random() < 0.4) {
                const retention30 = new Date(activation.getTime() + 30 * 86400000)
                if (retention30 <= new Date()) {
                  events.push({
                    userId: user.userId,
                    eventType: "retention_day_30",
                    timestamp: retention30,
                    metadata: { device: user.device },
                  })
                }
              }
            }
          }
        }
      }
    }
  })

  return events.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime())
}

// Generate data on module load
export const mockUsers = generateMockUsers(10000)
export const mockEvents = generateMockEvents(mockUsers)
