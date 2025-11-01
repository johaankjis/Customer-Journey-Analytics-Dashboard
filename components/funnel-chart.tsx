"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { FunnelStage } from "@/lib/analytics-engine"

interface FunnelChartProps {
  data: FunnelStage[]
}

export function FunnelChart({ data }: FunnelChartProps) {
  const maxUsers = data[0]?.users || 1

  return (
    <Card>
      <CardHeader>
        <CardTitle>Conversion Funnel</CardTitle>
        <CardDescription>User progression through lifecycle stages</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {data.map((stage, index) => {
            const widthPercent = (stage.users / maxUsers) * 100
            return (
              <div key={stage.stage} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-foreground">{stage.stage}</span>
                  <div className="flex items-center gap-4">
                    <span className="text-muted-foreground">{stage.users.toLocaleString()} users</span>
                    <span className="font-semibold text-primary">{stage.conversionRate.toFixed(1)}%</span>
                  </div>
                </div>
                <div className="relative h-12 bg-muted rounded-lg overflow-hidden">
                  <div
                    className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary to-accent transition-all duration-500 flex items-center justify-center"
                    style={{ width: `${widthPercent}%` }}
                  >
                    <span className="text-xs font-medium text-primary-foreground">
                      {stage.conversionRate.toFixed(1)}%
                    </span>
                  </div>
                </div>
                {index < data.length - 1 && stage.dropOffRate > 0 && (
                  <div className="text-xs text-destructive pl-2">
                    ↓ {stage.dropOffRate.toFixed(1)}% drop-off to next stage
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
