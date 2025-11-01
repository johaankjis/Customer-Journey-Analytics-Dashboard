import { DashboardHeader } from "@/components/dashboard-header"
import { KPICard } from "@/components/kpi-card"
import { FunnelChart } from "@/components/funnel-chart"
import { SegmentChart } from "@/components/segment-chart"
import { TimeSeriesChart } from "@/components/time-series-chart"
import { TrendCard } from "@/components/trend-card"
import { FeatureUsageChart } from "@/components/feature-usage-chart"
import { analyticsEngine } from "@/lib/analytics-engine"
import { Users, UserCheck, TrendingUp, Clock, Zap, Activity } from "lucide-react"

export default function DashboardPage() {
  const kpis = analyticsEngine.computeKPIs()
  const funnel = analyticsEngine.computeFunnel()
  const channelSegments = analyticsEngine.computeSegmentation("channel")
  const deviceSegments = analyticsEngine.computeSegmentation("device")
  const trends = analyticsEngine.computeTrends(7, 7)
  const timeSeries = analyticsEngine.computeTimeSeries(30)
  const featureUsage = analyticsEngine.computeFeatureUsage()

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          <div>
            <h2 className="text-3xl font-bold text-foreground">Dashboard Overview</h2>
            <p className="text-muted-foreground mt-2">
              Comprehensive view of your customer journey analytics and key metrics
            </p>
          </div>

          {/* KPI Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            <KPICard title="Total Users" value={kpis.totalUsers.toLocaleString()} icon={Users} subtitle="All signups" />
            <KPICard
              title="Activated Users"
              value={kpis.activatedUsers.toLocaleString()}
              icon={UserCheck}
              subtitle={`${((kpis.activatedUsers / kpis.totalUsers) * 100).toFixed(1)}% activation rate`}
            />
            <KPICard
              title="7-Day Retention"
              value={kpis.retainedUsers7Day.toLocaleString()}
              icon={TrendingUp}
              subtitle={`${((kpis.retainedUsers7Day / kpis.totalUsers) * 100).toFixed(1)}% retained`}
            />
            <KPICard
              title="30-Day Retention"
              value={kpis.retainedUsers30Day.toLocaleString()}
              icon={Activity}
              subtitle={`${((kpis.retainedUsers30Day / kpis.totalUsers) * 100).toFixed(1)}% retained`}
            />
            <KPICard
              title="Avg Time to Activate"
              value={`${kpis.avgTimeToActivation.toFixed(1)}h`}
              icon={Clock}
              subtitle="From signup"
            />
            <KPICard title="Top Feature" value={kpis.topFeature} icon={Zap} subtitle="Most used" />
          </div>

          <div>
            <h3 className="text-xl font-semibold text-foreground mb-4">7-Day Trends</h3>
            <div className="grid gap-4 md:grid-cols-3">
              {trends.map((trend) => (
                <TrendCard key={trend.metric} data={trend} />
              ))}
            </div>
          </div>

          <TimeSeriesChart data={timeSeries} />

          {/* Funnel Chart */}
          <FunnelChart data={funnel} />

          {/* Segmentation Charts */}
          <div className="grid gap-6 lg:grid-cols-2">
            <SegmentChart data={channelSegments} title="Performance by Channel" />
            <SegmentChart data={deviceSegments} title="Performance by Device" />
          </div>

          <FeatureUsageChart data={featureUsage.slice(0, 6)} />
        </div>
      </main>
    </div>
  )
}
