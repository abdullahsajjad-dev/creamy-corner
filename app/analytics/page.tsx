'use client'

import { useEffect, useState } from 'react'
import { Sidebar } from "@/components/dashboard/sidebar"
import { Header } from "@/components/dashboard/header"
import { SalesChart } from "@/components/dashboard/sales-chart"
import { FlavorsChart } from "@/components/dashboard/flavors-chart"
import { RatingsChart } from "@/components/dashboard/ratings-chart"
import { StatCards } from "@/components/dashboard/stat-cards"
import { CustomerOverview } from "@/components/dashboard/customer-overview"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useSupabase } from "@/hooks/use-supabase"
import { TrendingUp, TrendingDown, Minus } from "lucide-react"

function getTrendIcon(trend: "up" | "down" | "neutral") {
  switch (trend) {
    case "up":
      return <TrendingUp className="h-4 w-4 text-primary" />
    case "down":
      return <TrendingDown className="h-4 w-4 text-destructive" />
    default:
      return <Minus className="h-4 w-4 text-muted-foreground" />
  }
}

export default function AnalyticsPage() {
  const [averageProductPrice, setAverageProductPrice] = useState<number>(1250)
  const supabase = useSupabase()

  useEffect(() => {
    const fetchAveragePrice = async () => {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('price')

        if (!error && data && data.length > 0) {
          const avg = Math.round(
            data.reduce((sum: number, p: any) => sum + p.price, 0) / data.length
          )
          setAverageProductPrice(avg)
        }
      } catch (err) {
        console.error('Failed to fetch average price:', err)
      }
    }

    fetchAveragePrice()
  }, [supabase])

  const saturdayAverageRevenue = Math.round(averageProductPrice * 12.8)

  const metrics = [
    {
      title: "Conversion Rate",
      value: "3.2%",
      change: "+0.4%",
      trend: "up" as const,
      description: "Visitors who made a purchase",
    },
    {
      title: "Avg. Order Value",
      value: `Rs${Math.round(averageProductPrice).toLocaleString()}`,
      change: "+Rs230",
      trend: "up" as const,
      description: "Average transaction amount",
    },
    {
      title: "Customer Retention",
      value: "68%",
      change: "-2%",
      trend: "down" as const,
      description: "Returning customers this month",
    },
    {
      title: "Inventory Turnover",
      value: "4.2x",
      change: "0%",
      trend: "neutral" as const,
      description: "Monthly inventory cycles",
    },
  ]
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div className="md:pl-64">
        <Header />
        <main className="p-4 md:p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-black rb-text">📊 Analytics</h1>
            <p className="text-sm text-muted-foreground">
              Detailed business performance insights
            </p>
          </div>

          <StatCards />

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {metrics.map((metric, i) => {
              const grads = [
                "from-[oklch(0.68_0.28_25)] to-[oklch(0.78_0.22_55)]",
                "from-[oklch(0.78_0.22_55)] to-[oklch(0.88_0.18_90)]",
                "from-[oklch(0.72_0.22_145)] to-[oklch(0.65_0.22_230)]",
                "from-[oklch(0.68_0.26_310)] to-[oklch(0.72_0.28_350)]",
              ]
              return (
                <Card key={metric.title} className={`border-0 bg-gradient-to-br ${grads[i % grads.length]} shadow-lg overflow-hidden relative`}>
                  <div className="absolute inset-[1px] rounded-[calc(var(--radius)-1px)] bg-background/75 backdrop-blur-sm" />
                  <CardContent className="relative z-10 p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{metric.title}</p>
                        <p className="mt-1 text-xl font-black rb-text">{metric.value}</p>
                      </div>
                      <div className="flex items-center gap-1 rounded-full bg-secondary px-2 py-1">
                        {getTrendIcon(metric.trend)}
                        <span className={`text-xs font-semibold ${metric.trend === "up" ? "text-[oklch(0.72_0.22_145)]" : metric.trend === "down" ? "text-destructive" : "text-muted-foreground"}`}>
                          {metric.change}
                        </span>
                      </div>
                    </div>
                    <p className="mt-2 text-xs text-muted-foreground">{metric.description}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
            <SalesChart />
            <FlavorsChart />
            <RatingsChart />
          </div>

          <div className="mt-6">
            <CustomerOverview />
          </div>

          <Card className="mt-6 border-0 bg-card rb-card overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-bold rb-text">🏆 Performance Summary</CardTitle>
              <p className="text-xs text-muted-foreground">
                Key insights from your business data
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-xl border-0 bg-gradient-to-br from-[oklch(0.68_0.28_25)] to-[oklch(0.78_0.22_55)] p-[2px] shadow-md">
                  <div className="rounded-[calc(var(--radius)-2px)] bg-background/80 backdrop-blur-sm p-4">
                    <p className="text-sm font-semibold text-card-foreground">Best Performing Day</p>
                    <p className="mt-1 text-2xl font-black rb-text">Saturday</p>
                    <p className="mt-1 text-xs text-muted-foreground">{`Rs${saturdayAverageRevenue.toLocaleString()} average revenue`}</p>
                  </div>
                </div>
                <div className="rounded-xl border-0 bg-gradient-to-br from-[oklch(0.72_0.22_145)] to-[oklch(0.65_0.22_230)] p-[2px] shadow-md">
                  <div className="rounded-[calc(var(--radius)-2px)] bg-background/80 backdrop-blur-sm p-4">
                    <p className="text-sm font-semibold text-card-foreground">Most Popular Time</p>
                    <p className="mt-1 text-2xl font-black rb-text">2-4 PM</p>
                    <p className="mt-1 text-xs text-muted-foreground">Peak ordering hours</p>
                  </div>
                </div>
                <div className="rounded-xl border-0 bg-gradient-to-br from-[oklch(0.68_0.26_310)] to-[oklch(0.72_0.28_350)] p-[2px] shadow-md">
                  <div className="rounded-[calc(var(--radius)-2px)] bg-background/80 backdrop-blur-sm p-4">
                    <p className="text-sm font-semibold text-card-foreground">Growth Rate</p>
                    <p className="mt-1 text-2xl font-black rb-text">+12.5%</p>
                    <p className="mt-1 text-xs text-muted-foreground">Month over month</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  )
}
