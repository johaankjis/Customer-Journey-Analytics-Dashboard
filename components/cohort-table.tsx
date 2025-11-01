"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { CohortData } from "@/lib/analytics-engine"

interface CohortTableProps {
  data: CohortData[]
}

export function CohortTable({ data }: CohortTableProps) {
  const getColorClass = (value: number) => {
    if (value >= 80) return "bg-green-500/20 text-green-700 dark:text-green-400"
    if (value >= 60) return "bg-blue-500/20 text-blue-700 dark:text-blue-400"
    if (value >= 40) return "bg-yellow-500/20 text-yellow-700 dark:text-yellow-400"
    if (value >= 20) return "bg-orange-500/20 text-orange-700 dark:text-orange-400"
    return "bg-red-500/20 text-red-700 dark:text-red-400"
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cohort Retention Analysis</CardTitle>
        <CardDescription>Weekly retention rates by signup cohort</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Cohort</th>
                <th className="text-center py-3 px-4 font-medium text-muted-foreground">Week 0</th>
                <th className="text-center py-3 px-4 font-medium text-muted-foreground">Week 1</th>
                <th className="text-center py-3 px-4 font-medium text-muted-foreground">Week 2</th>
                <th className="text-center py-3 px-4 font-medium text-muted-foreground">Week 3</th>
                <th className="text-center py-3 px-4 font-medium text-muted-foreground">Week 4</th>
              </tr>
            </thead>
            <tbody>
              {data.map((cohort) => (
                <tr key={cohort.cohort} className="border-b border-border">
                  <td className="py-3 px-4 font-medium text-foreground">{cohort.cohort}</td>
                  <td className="py-3 px-4">
                    <div className={`text-center py-1 px-2 rounded ${getColorClass(cohort.week0)}`}>
                      {cohort.week0.toFixed(0)}%
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className={`text-center py-1 px-2 rounded ${getColorClass(cohort.week1)}`}>
                      {cohort.week1.toFixed(0)}%
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className={`text-center py-1 px-2 rounded ${getColorClass(cohort.week2)}`}>
                      {cohort.week2.toFixed(0)}%
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className={`text-center py-1 px-2 rounded ${getColorClass(cohort.week3)}`}>
                      {cohort.week3.toFixed(0)}%
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className={`text-center py-1 px-2 rounded ${getColorClass(cohort.week4)}`}>
                      {cohort.week4.toFixed(0)}%
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
