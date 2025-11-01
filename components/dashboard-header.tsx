"use client"

import { BarChart3, TrendingUp, Users, Activity } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { usePathname } from "next/navigation"

export function DashboardHeader() {
  const pathname = usePathname()

  const navItems = [
    { href: "/", label: "Overview", icon: BarChart3 },
    { href: "/funnel", label: "Funnel Analysis", icon: TrendingUp },
    { href: "/cohorts", label: "Cohort Analysis", icon: Users },
    { href: "/insights", label: "Insights", icon: Activity },
  ]

  return (
    <header className="border-b border-border bg-card">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
              <BarChart3 className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">Customer Journey Analytics</h1>
              <p className="text-sm text-muted-foreground">End-to-end lifecycle insights</p>
            </div>
          </div>
        </div>
        <nav className="mt-4 flex gap-2">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link key={item.href} href={item.href}>
                <Button variant={isActive ? "default" : "ghost"} className="gap-2">
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Button>
              </Link>
            )
          })}
        </nav>
      </div>
    </header>
  )
}
