"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { FeatureUsageData } from "@/lib/analytics-engine"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from "recharts"

interface FeatureUsageChartProps {
  data: FeatureUsageData[]
}

const COLORS = [
  "hsl(var(--primary))",
  "hsl(var(--accent))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
]

export function FeatureUsageChart({ data }: FeatureUsageChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Feature Usage Analysis</CardTitle>
        <CardDescription>Top features by total usage and unique users</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis type="number" stroke="hsl(var(--muted-foreground))" />
              <YAxis dataKey="feature" type="category" stroke="hsl(var(--muted-foreground))" width={100} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
              />
              <Legend />
              <Bar dataKey="uses" fill="hsl(var(--primary))" name="Total Uses" radius={[0, 4, 4, 0]}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>

          <div className="grid gap-3">
            <h4 className="text-sm font-semibold text-foreground">Feature Details</h4>
            {data.map((feature, index) => (
              <div
                key={feature.feature}
                className="flex items-center justify-between border-l-4 pl-3 py-2"
                style={{ borderColor: COLORS[index % COLORS.length] }}
              >
                <div>
                  <p className="font-medium text-foreground capitalize">{feature.feature}</p>
                  <p className="text-xs text-muted-foreground">{feature.uniqueUsers.toLocaleString()} unique users</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-foreground">{feature.uses.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">{feature.avgUsesPerUser.toFixed(1)} avg/user</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
