"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts"

interface RetentionCurveChartProps {
  data: { day: number; retentionRate: number }[]
}

export function RetentionCurveChart({ data }: RetentionCurveChartProps) {
  // Sample every 3 days for cleaner visualization
  const sampledData = data.filter((_, index) => index % 3 === 0 || index === data.length - 1)

  return (
    <Card>
      <CardHeader>
        <CardTitle>30-Day Retention Curve</CardTitle>
        <CardDescription>User retention decay over time from first activity</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={sampledData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis
              dataKey="day"
              stroke="hsl(var(--muted-foreground))"
              label={{ value: "Days Since First Activity", position: "insideBottom", offset: -5 }}
            />
            <YAxis
              stroke="hsl(var(--muted-foreground))"
              label={{ value: "Retention Rate (%)", angle: -90, position: "insideLeft" }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
              }}
              formatter={(value: number) => [`${value.toFixed(1)}%`, "Retention Rate"]}
              labelFormatter={(label) => `Day ${label}`}
            />
            <ReferenceLine y={50} stroke="hsl(var(--destructive))" strokeDasharray="3 3" label="50% Threshold" />
            <Line
              type="monotone"
              dataKey="retentionRate"
              stroke="hsl(var(--primary))"
              strokeWidth={3}
              dot={{ r: 4, fill: "hsl(var(--primary))" }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <div className="border rounded-lg p-3">
            <p className="text-xs text-muted-foreground">Day 7 Retention</p>
            <p className="text-xl font-bold text-foreground">{data[7]?.retentionRate.toFixed(1)}%</p>
          </div>
          <div className="border rounded-lg p-3">
            <p className="text-xs text-muted-foreground">Day 14 Retention</p>
            <p className="text-xl font-bold text-foreground">{data[14]?.retentionRate.toFixed(1)}%</p>
          </div>
          <div className="border rounded-lg p-3">
            <p className="text-xs text-muted-foreground">Day 30 Retention</p>
            <p className="text-xl font-bold text-foreground">{data[30]?.retentionRate.toFixed(1)}%</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
