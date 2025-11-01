"use client"

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts"

interface SegmentFunnelChartProps {
  data: Map<string, number>
  overall: number
  segmentType: string
}

export function SegmentFunnelChart({ data, overall, segmentType }: SegmentFunnelChartProps) {
  const chartData = Array.from(data.entries())
    .map(([segment, rate]) => ({
      segment,
      conversionRate: Number.parseFloat(rate.toFixed(1)),
      vsOverall: Number.parseFloat((rate - overall).toFixed(1)),
    }))
    .sort((a, b) => b.conversionRate - a.conversionRate)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">Overall Conversion Rate</p>
          <p className="text-2xl font-bold text-foreground">{overall.toFixed(1)}%</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-muted-foreground">Best Performing</p>
          <p className="text-lg font-semibold text-primary capitalize">{chartData[0]?.segment}</p>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis dataKey="segment" stroke="hsl(var(--muted-foreground))" tick={{ fontSize: 12 }} />
          <YAxis stroke="hsl(var(--muted-foreground))" />
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "8px",
            }}
          />
          <Legend />
          <ReferenceLine y={overall} stroke="hsl(var(--destructive))" strokeDasharray="3 3" label="Overall Avg" />
          <Bar dataKey="conversionRate" fill="hsl(var(--primary))" name="Conversion Rate %" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>

      <div className="grid gap-2">
        {chartData.map((item) => (
          <div key={item.segment} className="flex items-center justify-between border-l-4 border-primary pl-3 py-2">
            <span className="font-medium text-foreground capitalize">{item.segment}</span>
            <div className="flex items-center gap-4">
              <span className="text-sm font-semibold text-foreground">{item.conversionRate}%</span>
              <span className={`text-xs font-medium ${item.vsOverall >= 0 ? "text-green-600" : "text-red-600"}`}>
                {item.vsOverall > 0 ? "+" : ""}
                {item.vsOverall}% vs avg
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
