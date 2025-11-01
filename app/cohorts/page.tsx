"use client"

import { DashboardHeader } from "@/components/dashboard-header"
import { CohortTable } from "@/components/cohort-table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { analyticsEngine } from "@/lib/analytics-engine"
import { TrendingUp, TrendingDown, Minus, Users, Smartphone, Globe, CreditCard, Activity } from "lucide-react"
import { RetentionCurveChart } from "@/components/retention-curve-chart"
import { CohortComparisonChart } from "@/components/cohort-comparison-chart"

export default function CohortsPage() {
  const cohorts = analyticsEngine.computeCohorts()
  const retentionCurve = analyticsEngine.computeRetentionCurve(30)

  const channelSegments = analyticsEngine.computeSegmentation("channel")
  const deviceSegments = analyticsEngine.computeSegmentation("device")
  const regionSegments = analyticsEngine.computeSegmentation("region")
  const planSegments = analyticsEngine.computeSegmentation("plan")

  // Calculate average retention rates
  const avgWeek1 = cohorts.reduce((sum, c) => sum + c.week1, 0) / cohorts.length
  const avgWeek4 = cohorts.reduce((sum, c) => sum + c.week4, 0) / cohorts.length
  const retentionTrend = avgWeek4 - avgWeek1

  const bestCohort = cohorts.reduce((best, c) => (c.week4 > best.week4 ? c : best), cohorts[0])
  const worstCohort = cohorts.reduce((worst, c) => (c.week4 < worst.week4 ? c : worst), cohorts[0])

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          <div>
            <h2 className="text-3xl font-bold text-foreground">Cohort Analysis</h2>
            <p className="text-muted-foreground mt-2">Track user retention patterns across different signup cohorts</p>
          </div>

          {/* Retention Summary */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Avg Week 1 Retention</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{avgWeek1.toFixed(1)}%</div>
                <p className="text-xs text-muted-foreground mt-1">Across all cohorts</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Avg Week 4 Retention</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{avgWeek4.toFixed(1)}%</div>
                <p className="text-xs text-muted-foreground mt-1">Across all cohorts</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Retention Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  {retentionTrend > 0 ? (
                    <TrendingUp className="h-5 w-5 text-green-600" />
                  ) : retentionTrend < 0 ? (
                    <TrendingDown className="h-5 w-5 text-red-600" />
                  ) : (
                    <Minus className="h-5 w-5 text-muted-foreground" />
                  )}
                  <span
                    className={`text-2xl font-bold ${retentionTrend > 0 ? "text-green-600" : retentionTrend < 0 ? "text-red-600" : "text-muted-foreground"}`}
                  >
                    {retentionTrend > 0 ? "+" : ""}
                    {retentionTrend.toFixed(1)}%
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">Week 1 to Week 4</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Best Cohort</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-lg font-bold text-primary">{bestCohort?.cohort}</div>
                <p className="text-xs text-muted-foreground mt-1">{bestCohort?.week4.toFixed(1)}% Week 4 retention</p>
              </CardContent>
            </Card>
          </div>

          <RetentionCurveChart data={retentionCurve} />

          {/* Cohort Table */}
          <CohortTable data={cohorts} />

          <CohortComparisonChart cohorts={cohorts.slice(0, 5)} />

          <Card>
            <CardHeader>
              <CardTitle>Retention by Segment</CardTitle>
              <CardDescription>Compare retention rates across different user segments</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="channel" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="channel" className="gap-2">
                    <Users className="h-4 w-4" />
                    Channel
                  </TabsTrigger>
                  <TabsTrigger value="device" className="gap-2">
                    <Smartphone className="h-4 w-4" />
                    Device
                  </TabsTrigger>
                  <TabsTrigger value="region" className="gap-2">
                    <Globe className="h-4 w-4" />
                    Region
                  </TabsTrigger>
                  <TabsTrigger value="plan" className="gap-2">
                    <CreditCard className="h-4 w-4" />
                    Plan
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="channel" className="mt-6">
                  <SegmentRetentionView data={channelSegments} />
                </TabsContent>
                <TabsContent value="device" className="mt-6">
                  <SegmentRetentionView data={deviceSegments} />
                </TabsContent>
                <TabsContent value="region" className="mt-6">
                  <SegmentRetentionView data={regionSegments} />
                </TabsContent>
                <TabsContent value="plan" className="mt-6">
                  <SegmentRetentionView data={planSegments} />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Insights */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary" />
                <CardTitle>Cohort Insights & Recommendations</CardTitle>
              </div>
              <CardDescription>Key observations and actionable recommendations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border-l-4 border-primary pl-4">
                  <h4 className="font-semibold text-foreground mb-2">Retention Performance</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="text-primary font-bold">•</span>
                      <span>
                        <strong className="text-foreground">Week 1 retention averages {avgWeek1.toFixed(1)}%</strong> -
                        This indicates how many users return after their first week. Industry benchmark is typically
                        40-60%.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary font-bold">•</span>
                      <span>
                        <strong className="text-foreground">Week 4 retention drops to {avgWeek4.toFixed(1)}%</strong> -
                        The {Math.abs(retentionTrend).toFixed(1)}% decline suggests opportunities for engagement
                        improvements.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary font-bold">•</span>
                      <span>
                        <strong className="text-foreground">Best performing cohort: {bestCohort?.cohort}</strong> -
                        Analyze what made this cohort successful and replicate those conditions.
                      </span>
                    </li>
                  </ul>
                </div>

                <div className="border-l-4 border-accent pl-4">
                  <h4 className="font-semibold text-foreground mb-2">Recommended Actions</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="text-accent font-bold">1.</span>
                      <span>
                        <strong className="text-foreground">Implement re-engagement campaigns</strong> - Target users
                        who haven't returned in 3-5 days with personalized content and value reminders.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-accent font-bold">2.</span>
                      <span>
                        <strong className="text-foreground">Create habit-forming features</strong> - Add daily streaks,
                        goals, or notifications to encourage regular usage patterns.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-accent font-bold">3.</span>
                      <span>
                        <strong className="text-foreground">Analyze drop-off patterns</strong> - Identify specific days
                        when users typically churn and intervene proactively.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-accent font-bold">4.</span>
                      <span>
                        <strong className="text-foreground">Segment-specific strategies</strong> - Tailor retention
                        tactics based on user channel, device, and plan type for maximum impact.
                      </span>
                    </li>
                  </ul>
                </div>

                <div className="bg-muted rounded-lg p-4">
                  <p className="text-sm font-medium text-foreground mb-2">Color Coding Guide:</p>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-xs">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded bg-green-500/20 border-2 border-green-500" />
                      <span className="text-muted-foreground">80%+ Excellent</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded bg-blue-500/20 border-2 border-blue-500" />
                      <span className="text-muted-foreground">60-80% Good</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded bg-yellow-500/20 border-2 border-yellow-500" />
                      <span className="text-muted-foreground">40-60% Fair</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded bg-orange-500/20 border-2 border-orange-500" />
                      <span className="text-muted-foreground">20-40% Poor</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded bg-red-500/20 border-2 border-red-500" />
                      <span className="text-muted-foreground">&lt;20% Critical</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

function SegmentRetentionView({ data }: { data: any[] }) {
  const sortedData = [...data].sort((a, b) => b.retentionRate - a.retentionRate)

  return (
    <div className="space-y-3">
      {sortedData.map((segment) => (
        <div key={segment.value} className="flex items-center justify-between border-l-4 border-primary pl-3 py-2">
          <div>
            <p className="font-medium text-foreground capitalize">{segment.value}</p>
            <p className="text-xs text-muted-foreground">{segment.users.toLocaleString()} users</p>
          </div>
          <div className="text-right">
            <p className="text-lg font-bold text-foreground">{segment.retentionRate.toFixed(1)}%</p>
            <p className="text-xs text-muted-foreground">7-day retention</p>
          </div>
        </div>
      ))}
    </div>
  )
}
