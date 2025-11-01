"use client"

import { DashboardHeader } from "@/components/dashboard-header"
import { FunnelChart } from "@/components/funnel-chart"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { analyticsEngine } from "@/lib/analytics-engine"
import { AlertCircle, TrendingDown, Target, Lightbulb, Users, Smartphone, Globe, CreditCard } from "lucide-react"
import { SegmentFunnelChart } from "@/components/segment-funnel-chart"

export default function FunnelPage() {
  const funnel = analyticsEngine.computeFunnel()
  const channelConversion = analyticsEngine.computeConversionRates("channel")
  const deviceConversion = analyticsEngine.computeConversionRates("device")
  const regionConversion = analyticsEngine.computeConversionRates("region")
  const planConversion = analyticsEngine.computeConversionRates("plan")

  // Find the biggest drop-off
  const biggestDropOff = funnel.reduce((max, stage) => (stage.dropOffRate > max.dropOffRate ? stage : max), funnel[0])

  const totalUsers = funnel[0]?.users || 0
  const potentialUsers = Math.floor((biggestDropOff.dropOffRate / 2 / 100) * totalUsers)

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          <div>
            <h2 className="text-3xl font-bold text-foreground">Funnel Analysis</h2>
            <p className="text-muted-foreground mt-2">
              Detailed breakdown of user progression through lifecycle stages
            </p>
          </div>

          {/* Alert for biggest drop-off */}
          <Card className="border-destructive/50 bg-destructive/5">
            <CardHeader>
              <div className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-destructive" />
                <CardTitle className="text-destructive">Critical Drop-Off Detected</CardTitle>
              </div>
              <CardDescription>Highest user loss identified in the funnel</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <TrendingDown className="h-8 w-8 text-destructive" />
                <div className="flex-1">
                  <p className="text-lg font-semibold text-foreground">
                    {biggestDropOff.dropOffRate.toFixed(1)}% drop-off at {biggestDropOff.stage}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    This represents the largest conversion loss in your funnel and should be prioritized for
                    optimization.
                  </p>
                  <div className="mt-3 p-3 bg-background rounded-lg border border-border">
                    <p className="text-sm font-medium text-foreground">Potential Impact:</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Reducing this drop-off by 50% could recover{" "}
                      <strong className="text-foreground">{potentialUsers.toLocaleString()} users</strong> and
                      significantly improve overall conversion rates.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Funnel Visualization */}
          <FunnelChart data={funnel} />

          <Card>
            <CardHeader>
              <CardTitle>Conversion Rates by Segment</CardTitle>
              <CardDescription>Compare activation rates across different user segments</CardDescription>
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
                  <SegmentFunnelChart
                    data={channelConversion.bySegment!}
                    overall={channelConversion.overall}
                    segmentType="channel"
                  />
                </TabsContent>
                <TabsContent value="device" className="mt-6">
                  <SegmentFunnelChart
                    data={deviceConversion.bySegment!}
                    overall={deviceConversion.overall}
                    segmentType="device"
                  />
                </TabsContent>
                <TabsContent value="region" className="mt-6">
                  <SegmentFunnelChart
                    data={regionConversion.bySegment!}
                    overall={regionConversion.overall}
                    segmentType="region"
                  />
                </TabsContent>
                <TabsContent value="plan" className="mt-6">
                  <SegmentFunnelChart
                    data={planConversion.bySegment!}
                    overall={planConversion.overall}
                    segmentType="plan"
                  />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Detailed Metrics */}
          <Card>
            <CardHeader>
              <CardTitle>Stage-by-Stage Breakdown</CardTitle>
              <CardDescription>Detailed metrics for each funnel stage</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {funnel.map((stage, index) => (
                  <div key={stage.stage} className="border-l-4 border-primary pl-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-semibold text-foreground">{stage.stage}</h3>
                      <span className="text-2xl font-bold text-primary">{stage.conversionRate.toFixed(1)}%</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Users at this stage</p>
                        <p className="text-lg font-semibold text-foreground">{stage.users.toLocaleString()}</p>
                      </div>
                      {index > 0 && (
                        <div>
                          <p className="text-muted-foreground">Drop-off from previous</p>
                          <p className="text-lg font-semibold text-destructive">{stage.dropOffRate.toFixed(1)}%</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-primary" />
                <CardTitle>Optimization Recommendations</CardTitle>
              </div>
              <CardDescription>Actionable steps to improve funnel conversion</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {funnel.slice(1).map((stage, index) => {
                  if (stage.dropOffRate < 10) return null
                  return (
                    <div key={stage.stage} className="border rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-sm">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-foreground mb-1">{stage.stage}</h4>
                          <p className="text-sm text-muted-foreground mb-3">
                            Current drop-off:{" "}
                            <strong className="text-destructive">{stage.dropOffRate.toFixed(1)}%</strong>
                          </p>
                          <div className="bg-muted rounded-lg p-3">
                            <p className="text-sm font-medium text-foreground mb-2">Suggested Actions:</p>
                            <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                              {getRecommendations(stage.stage).map((rec, i) => (
                                <li key={i}>• {rec}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                <CardTitle>Target Conversion Goals</CardTitle>
              </div>
              <CardDescription>Benchmark targets for each funnel stage</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {funnel.slice(1).map((stage) => (
                  <div key={stage.stage} className="border rounded-lg p-4">
                    <h4 className="font-medium text-foreground mb-2">{stage.stage}</h4>
                    <div className="flex items-baseline gap-2">
                      <span className="text-xl font-bold text-muted-foreground">
                        {stage.conversionRate.toFixed(1)}%
                      </span>
                      <span className="text-sm text-muted-foreground">→</span>
                      <span className="text-xl font-bold text-primary">
                        {Math.min(100, stage.conversionRate * 1.2).toFixed(1)}%
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">Target: +20% improvement</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

function getRecommendations(stage: string): string[] {
  const recommendations: Record<string, string[]> = {
    "Onboarding Start": [
      "Send immediate welcome email with clear next steps",
      "Add progress indicators to show completion status",
      "Reduce friction by minimizing required fields",
      "Implement exit-intent popups to prevent abandonment",
    ],
    "Onboarding Complete": [
      "Break onboarding into smaller, digestible steps",
      "Add contextual help and tooltips at each step",
      "Allow users to skip non-critical information",
      "Show value proposition throughout the process",
    ],
    Activation: [
      "Provide pre-populated demo data for immediate value",
      "Create quick-start templates for common use cases",
      "Add interactive product tours highlighting key features",
      "Reduce time-to-first-value with guided workflows",
    ],
    "7-Day Retention": [
      "Send personalized email reminders on day 3 and 5",
      "Implement push notifications for relevant activity",
      "Create habit-forming features (streaks, daily goals)",
      "Offer incentives for consistent usage",
    ],
    "30-Day Retention": [
      "Launch weekly digest emails with personalized insights",
      "Add social features to increase engagement",
      "Implement loyalty rewards program",
      "Provide advanced features for power users",
    ],
  }

  return (
    recommendations[stage] || [
      "Analyze user behavior at this stage",
      "Conduct user interviews to identify pain points",
      "A/B test different approaches",
      "Monitor metrics closely for improvements",
    ]
  )
}
