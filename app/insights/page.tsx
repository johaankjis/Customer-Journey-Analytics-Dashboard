"use client"

import { DashboardHeader } from "@/components/dashboard-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { analyticsEngine } from "@/lib/analytics-engine"
import {
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  TrendingDown,
  Lightbulb,
  Target,
  Zap,
  Users,
  DollarSign,
  BarChart3,
  ArrowRight,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"

export default function InsightsPage() {
  const funnel = analyticsEngine.computeFunnel()
  const kpis = analyticsEngine.computeKPIs()
  const trends = analyticsEngine.computeTrends(7, 7)
  const featureUsage = analyticsEngine.computeFeatureUsage()
  const cohorts = analyticsEngine.computeCohorts()
  const channelSegments = analyticsEngine.computeSegmentation("channel")

  // Find onboarding drop-off
  const onboardingStage = funnel.find((s) => s.stage === "Onboarding Complete")
  const onboardingDropOff = onboardingStage?.dropOffRate || 0

  const activationStage = funnel.find((s) => s.stage === "Activation")
  const activationDropOff = activationStage?.dropOffRate || 0
  const avgCohortRetention = cohorts.reduce((sum, c) => sum + c.week4, 0) / cohorts.length
  const bestChannel = channelSegments.reduce(
    (best, seg) => (seg.activationRate > best.activationRate ? seg : best),
    channelSegments[0],
  )
  const worstChannel = channelSegments.reduce(
    (worst, seg) => (seg.activationRate < worst.activationRate ? seg : worst),
    channelSegments[0],
  )

  const totalUsers = funnel[0]?.users || 0
  const potentialOnboardingUsers = Math.floor((onboardingDropOff / 2 / 100) * totalUsers)
  const potentialActivationUsers = Math.floor((activationDropOff / 2 / 100) * totalUsers)
  const estimatedValuePerUser = 50 // Average LTV estimate
  const totalPotentialRevenue = (potentialOnboardingUsers + potentialActivationUsers) * estimatedValuePerUser

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          <div>
            <h2 className="text-3xl font-bold text-foreground">Insights & Recommendations</h2>
            <p className="text-muted-foreground mt-2">
              Data-driven insights and actionable recommendations to improve product adoption and retention
            </p>
          </div>

          <Card className="border-primary/50 bg-primary/5">
            <CardHeader>
              <div className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                <CardTitle>Executive Summary</CardTitle>
              </div>
              <CardDescription>Key findings and potential business impact</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="border-l-4 border-primary pl-4">
                  <p className="text-sm text-muted-foreground mb-1">Total Opportunity</p>
                  <p className="text-2xl font-bold text-foreground">
                    {(potentialOnboardingUsers + potentialActivationUsers).toLocaleString()} users
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">Recoverable through optimization</p>
                </div>
                <div className="border-l-4 border-primary pl-4">
                  <p className="text-sm text-muted-foreground mb-1">Revenue Impact</p>
                  <p className="text-2xl font-bold text-primary">${(totalPotentialRevenue / 1000).toFixed(0)}K+</p>
                  <p className="text-xs text-muted-foreground mt-1">Estimated annual value</p>
                </div>
                <div className="border-l-4 border-primary pl-4">
                  <p className="text-sm text-muted-foreground mb-1">Priority Actions</p>
                  <p className="text-2xl font-bold text-foreground">4</p>
                  <p className="text-xs text-muted-foreground mt-1">High-impact recommendations</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Critical Issues */}
          <Card className="border-destructive/50">
            <CardHeader>
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-destructive" />
                <CardTitle className="text-destructive">Critical Issues Identified</CardTitle>
              </div>
              <CardDescription>High-priority problems requiring immediate attention</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-l-4 border-destructive pl-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-foreground">{onboardingDropOff.toFixed(1)}% Onboarding Drop-Off</h3>
                  <Badge variant="destructive">CRITICAL</Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  A significant portion of users who start onboarding fail to complete it. This represents a major
                  friction point in the user journey.
                </p>
                <div className="bg-destructive/10 rounded-lg p-3">
                  <p className="text-sm font-medium text-foreground mb-2">Estimated Impact:</p>
                  <p className="text-sm text-muted-foreground">
                    Reducing this drop-off by 50% could result in{" "}
                    <strong className="text-foreground">
                      {potentialOnboardingUsers.toLocaleString()} additional activated users
                    </strong>
                    , potentially generating{" "}
                    <strong className="text-foreground">
                      ${((potentialOnboardingUsers * estimatedValuePerUser) / 1000).toFixed(0)}K+ in additional
                      retention value
                    </strong>
                    .
                  </p>
                </div>
              </div>

              {activationDropOff > 15 && (
                <div className="border-l-4 border-destructive pl-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-foreground">
                      {activationDropOff.toFixed(1)}% Activation Drop-Off
                    </h3>
                    <Badge variant="destructive">HIGH</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    Users complete onboarding but fail to reach activation. This indicates a gap between setup and value
                    realization.
                  </p>
                  <div className="bg-destructive/10 rounded-lg p-3">
                    <p className="text-sm font-medium text-foreground mb-2">Estimated Impact:</p>
                    <p className="text-sm text-muted-foreground">
                      Improving activation by 50% could add{" "}
                      <strong className="text-foreground">{potentialActivationUsers.toLocaleString()} users</strong>,
                      worth approximately{" "}
                      <strong className="text-foreground">
                        ${((potentialActivationUsers * estimatedValuePerUser) / 1000).toFixed(0)}K+
                      </strong>
                      .
                    </p>
                  </div>
                </div>
              )}

              {avgCohortRetention < 40 && (
                <div className="border-l-4 border-orange-500 pl-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-foreground">
                      Low 4-Week Retention ({avgCohortRetention.toFixed(1)}%)
                    </h3>
                    <Badge className="bg-orange-500">MEDIUM</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    Users are not forming lasting habits with the product. Long-term retention is below industry
                    benchmarks.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                <CardTitle>Trend Analysis</CardTitle>
              </div>
              <CardDescription>7-day performance trends and momentum indicators</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                {trends.map((trend) => (
                  <div key={trend.metric} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-foreground">{trend.metric}</h4>
                      {trend.trend === "up" ? (
                        <TrendingUp className="h-5 w-5 text-green-600" />
                      ) : trend.trend === "down" ? (
                        <TrendingDown className="h-5 w-5 text-red-600" />
                      ) : (
                        <ArrowRight className="h-5 w-5 text-muted-foreground" />
                      )}
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-bold text-foreground">{trend.current.toLocaleString()}</span>
                      <span
                        className={`text-sm font-semibold ${
                          trend.changePercent > 0
                            ? "text-green-600"
                            : trend.changePercent < 0
                              ? "text-red-600"
                              : "text-muted-foreground"
                        }`}
                      >
                        {trend.changePercent > 0 ? "+" : ""}
                        {trend.changePercent.toFixed(1)}%
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">vs previous 7 days</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-primary" />
                <CardTitle>Feature Usage Insights</CardTitle>
              </div>
              <CardDescription>Optimize feature adoption and engagement</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border-l-4 border-primary pl-4">
                  <h4 className="font-semibold text-foreground mb-2">Top Performing Features</h4>
                  <div className="space-y-2">
                    {featureUsage.slice(0, 3).map((feature, index) => (
                      <div key={feature.feature} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-xs">
                            {index + 1}
                          </span>
                          <span className="font-medium text-foreground capitalize">{feature.feature}</span>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-semibold text-foreground">{feature.uses.toLocaleString()} uses</p>
                          <p className="text-xs text-muted-foreground">{feature.uniqueUsers.toLocaleString()} users</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-muted rounded-lg p-4">
                  <p className="text-sm font-medium text-foreground mb-2">Recommendations:</p>
                  <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                    <li>• Promote top features in onboarding to accelerate time-to-value</li>
                    <li>• Create feature spotlight campaigns for underutilized capabilities</li>
                    <li>• Build use-case templates around most popular features</li>
                    <li>• Track feature adoption as a leading indicator of retention</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                <CardTitle>Segment Performance Insights</CardTitle>
              </div>
              <CardDescription>Channel-specific opportunities and challenges</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="border-l-4 border-green-500 pl-4">
                    <h4 className="font-semibold text-foreground mb-2">Best Performing Channel</h4>
                    <p className="text-2xl font-bold text-green-600 capitalize">{bestChannel?.value}</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {bestChannel?.activationRate.toFixed(1)}% activation rate • {bestChannel?.users.toLocaleString()}{" "}
                      users
                    </p>
                    <div className="mt-3 bg-green-500/10 rounded-lg p-3">
                      <p className="text-sm text-muted-foreground">
                        <strong className="text-foreground">Action:</strong> Increase investment in {bestChannel?.value}{" "}
                        channel and replicate successful tactics across other channels.
                      </p>
                    </div>
                  </div>

                  <div className="border-l-4 border-orange-500 pl-4">
                    <h4 className="font-semibold text-foreground mb-2">Needs Improvement</h4>
                    <p className="text-2xl font-bold text-orange-600 capitalize">{worstChannel?.value}</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {worstChannel?.activationRate.toFixed(1)}% activation rate •{" "}
                      {worstChannel?.users.toLocaleString()} users
                    </p>
                    <div className="mt-3 bg-orange-500/10 rounded-lg p-3">
                      <p className="text-sm text-muted-foreground">
                        <strong className="text-foreground">Action:</strong> Optimize {worstChannel?.value} channel
                        messaging and targeting, or consider reallocating budget.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recommendations */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-primary" />
                <CardTitle>Prioritized Action Plan</CardTitle>
              </div>
              <CardDescription>Ranked recommendations by impact and effort</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Recommendation 1 */}
                <div className="border-l-4 border-primary pl-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">
                        1
                      </span>
                      <h3 className="font-semibold text-foreground">Simplify Onboarding Flow</h3>
                    </div>
                    <div className="flex gap-2">
                      <Badge variant="destructive">HIGH IMPACT</Badge>
                      <Badge variant="outline">MEDIUM EFFORT</Badge>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3 ml-10">
                    The {onboardingDropOff.toFixed(1)}% drop-off during onboarding suggests the process is too complex
                    or time-consuming.
                  </p>
                  <div className="bg-muted rounded-lg p-3 ml-10 space-y-2">
                    <p className="text-sm font-medium text-foreground">Suggested Actions:</p>
                    <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                      <li>• Reduce onboarding steps from 5+ to 3 core steps</li>
                      <li>• Add progress indicators to show completion status</li>
                      <li>• Implement "skip for now" options for non-critical fields</li>
                      <li>• Add contextual help tooltips at each step</li>
                    </ul>
                    <div className="flex items-center gap-2 pt-2 border-t border-border">
                      <DollarSign className="h-4 w-4 text-primary" />
                      <span className="text-sm font-semibold text-foreground">
                        Potential Value: ${((potentialOnboardingUsers * estimatedValuePerUser) / 1000).toFixed(0)}K+
                      </span>
                    </div>
                  </div>
                </div>

                {/* Recommendation 2 */}
                <div className="border-l-4 border-accent pl-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-accent text-accent-foreground font-bold">
                        2
                      </span>
                      <h3 className="font-semibold text-foreground">Improve Time-to-Value</h3>
                    </div>
                    <div className="flex gap-2">
                      <Badge className="bg-primary">HIGH IMPACT</Badge>
                      <Badge variant="outline">LOW EFFORT</Badge>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3 ml-10">
                    Average time to activation is {kpis.avgTimeToActivation.toFixed(1)} hours. Faster activation
                    correlates with higher retention.
                  </p>
                  <div className="bg-muted rounded-lg p-3 ml-10 space-y-2">
                    <p className="text-sm font-medium text-foreground">Suggested Actions:</p>
                    <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                      <li>• Show immediate value with pre-populated demo data</li>
                      <li>• Create quick-start templates for common use cases</li>
                      <li>• Add interactive product tours highlighting key features</li>
                      <li>• Send timely email nudges for incomplete activations</li>
                    </ul>
                    <div className="flex items-center gap-2 pt-2 border-t border-border">
                      <Target className="h-4 w-4 text-primary" />
                      <span className="text-sm font-semibold text-foreground">
                        Target: Reduce to {(kpis.avgTimeToActivation * 0.6).toFixed(1)} hours (40% improvement)
                      </span>
                    </div>
                  </div>
                </div>

                {/* Recommendation 3 */}
                <div className="border-l-4 border-chart-2 pl-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-chart-2 text-white font-bold">
                        3
                      </span>
                      <h3 className="font-semibold text-foreground">Enhance Feature Discovery</h3>
                    </div>
                    <div className="flex gap-2">
                      <Badge className="bg-primary">MEDIUM IMPACT</Badge>
                      <Badge variant="outline">LOW EFFORT</Badge>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3 ml-10">
                    Top feature "{kpis.topFeature}" is heavily used, but other features may be underutilized due to poor
                    discoverability.
                  </p>
                  <div className="bg-muted rounded-lg p-3 ml-10 space-y-2">
                    <p className="text-sm font-medium text-foreground">Suggested Actions:</p>
                    <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                      <li>• Add feature spotlight notifications for new users</li>
                      <li>• Create use-case-based navigation paths</li>
                      <li>• Implement in-app feature announcements</li>
                      <li>• Track and optimize feature adoption metrics</li>
                    </ul>
                  </div>
                </div>

                {/* Recommendation 4 */}
                <div className="border-l-4 border-chart-3 pl-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-chart-3 text-white font-bold">
                        4
                      </span>
                      <h3 className="font-semibold text-foreground">Boost Long-Term Retention</h3>
                    </div>
                    <div className="flex gap-2">
                      <Badge className="bg-primary">MEDIUM IMPACT</Badge>
                      <Badge variant="outline">HIGH EFFORT</Badge>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3 ml-10">
                    {((kpis.retainedUsers7Day / kpis.totalUsers) * 100).toFixed(1)}% of users return after 7 days.
                    Improving this metric drives long-term value.
                  </p>
                  <div className="bg-muted rounded-lg p-3 ml-10 space-y-2">
                    <p className="text-sm font-medium text-foreground">Suggested Actions:</p>
                    <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                      <li>• Implement weekly digest emails with personalized insights</li>
                      <li>• Add push notifications for relevant activity</li>
                      <li>• Create habit-forming features (daily streaks, goals)</li>
                      <li>• Offer incentives for consistent weekly usage</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Success Metrics */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                <CardTitle>Success Metrics & Goals</CardTitle>
              </div>
              <CardDescription>Target KPIs after implementing recommendations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="border rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    <h4 className="font-semibold text-foreground">Onboarding Completion</h4>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-muted-foreground">
                      {(100 - onboardingDropOff).toFixed(1)}%
                    </span>
                    <span className="text-sm text-muted-foreground">→</span>
                    <span className="text-2xl font-bold text-primary">{(100 - onboardingDropOff / 2).toFixed(1)}%</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Target: 50% reduction in drop-off</p>
                </div>

                <div className="border rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="h-4 w-4 text-primary" />
                    <h4 className="font-semibold text-foreground">Time to Activation</h4>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-muted-foreground">
                      {kpis.avgTimeToActivation.toFixed(1)}h
                    </span>
                    <span className="text-sm text-muted-foreground">→</span>
                    <span className="text-2xl font-bold text-primary">
                      {(kpis.avgTimeToActivation * 0.6).toFixed(1)}h
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Target: 40% reduction</p>
                </div>

                <div className="border rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="h-4 w-4 text-primary" />
                    <h4 className="font-semibold text-foreground">7-Day Retention</h4>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-muted-foreground">
                      {((kpis.retainedUsers7Day / kpis.totalUsers) * 100).toFixed(1)}%
                    </span>
                    <span className="text-sm text-muted-foreground">→</span>
                    <span className="text-2xl font-bold text-primary">
                      {((kpis.retainedUsers7Day / kpis.totalUsers) * 100 * 1.25).toFixed(1)}%
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Target: 25% improvement</p>
                </div>

                <div className="border rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="h-4 w-4 text-primary" />
                    <h4 className="font-semibold text-foreground">Projected Impact</h4>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-primary">
                      ${(totalPotentialRevenue / 1000).toFixed(0)}K+
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Estimated annual retention value increase</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
