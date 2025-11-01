"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { CohortData } from "@/lib/analytics-engine"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

interface CohortComparisonChartProps {
  cohorts: CohortData[]
}

const COLORS = [
  "hsl(var(--primary))",
  "hsl(var(--accent))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
]

export function CohortComparisonChart({ cohorts }: CohortComparisonChartProps) {
  // Transform data for line chart
  const weeks = ["Week 0", "Week 1", "Week 2", "Week 3", "Week 4"]
  const chartData = weeks.map((week, index) => {
    const dataPoint: any = { week }
    cohorts.forEach((cohort) => {
      const weekKey = `week${index}` as keyof CohortData
      dataPoint[cohort.cohort] = cohort[weekKey]
    })
    return dataPoint
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cohort Comparison</CardTitle>
        <CardDescription>Compare retention curves across recent cohorts</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="week" stroke="hsl(var(--muted-foreground))" />
            <YAxis
              stroke="hsl(var(--muted-foreground))"
              label={{ value: "Retention %", angle: -90, position: "insideLeft" }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
              }}
              formatter={(value: number) => `${value.toFixed(1)}%`}
            />
            <Legend />
            {cohorts.map((cohort, index) => (
              <Line
                key={cohort.cohort}
                type="monotone"
                dataKey={cohort.cohort}
                stroke={COLORS[index % COLORS.length]}
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
        <div className="mt-4 p-3 bg-muted rounded-lg">
          <p className="text-sm font-medium text-foreground mb-2">Key Observations:</p>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Compare how different cohorts retain users over their first 4 weeks</li>
            <li>• Identify which cohorts have stronger retention patterns</li>
            <li>• Look for seasonal trends or product changes that impact retention</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
