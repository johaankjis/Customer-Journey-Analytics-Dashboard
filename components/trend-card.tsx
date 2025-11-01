"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown, Minus } from "lucide-react"
import type { TrendData } from "@/lib/analytics-engine"

interface TrendCardProps {
  data: TrendData
}

export function TrendCard({ data }: TrendCardProps) {
  const getTrendIcon = () => {
    switch (data.trend) {
      case "up":
        return <TrendingUp className="h-5 w-5 text-green-600" />
      case "down":
        return <TrendingDown className="h-5 w-5 text-red-600" />
      default:
        return <Minus className="h-5 w-5 text-muted-foreground" />
    }
  }

  const getTrendColor = () => {
    switch (data.trend) {
      case "up":
        return "text-green-600"
      case "down":
        return "text-red-600"
      default:
        return "text-muted-foreground"
    }
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium text-muted-foreground">{data.metric}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-foreground">{data.current.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground mt-1">Current period</p>
            </div>
            {getTrendIcon()}
          </div>
          <div className="flex items-center gap-2 pt-2 border-t border-border">
            <span className={`text-sm font-semibold ${getTrendColor()}`}>
              {data.change > 0 ? "+" : ""}
              {data.change.toLocaleString()} ({data.changePercent > 0 ? "+" : ""}
              {data.changePercent.toFixed(1)}%)
            </span>
            <span className="text-xs text-muted-foreground">vs previous period</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
