"use client"

import { useEffect, useState } from "react"
import { useSupabase } from "@/hooks/use-supabase"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { buildCustomerSummaries, getCustomerOverviewStats } from "@/lib/customer-insights"

const cardStyles = [
  "from-[oklch(0.68_0.28_25)] to-[oklch(0.78_0.22_55)]",
  "from-[oklch(0.78_0.22_55)] to-[oklch(0.88_0.18_90)]",
  "from-[oklch(0.72_0.22_145)] to-[oklch(0.65_0.22_230)]",
  "from-[oklch(0.68_0.26_310)] to-[oklch(0.72_0.28_350)]",
]

export function CustomerOverview() {
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({ totalCustomers: 0, averageOrders: 0, averageSpent: 0, vipCustomers: 0 })
  const supabase = useSupabase()

  useEffect(() => {
    const fetchCustomerStats = async () => {
      try {
        const { data: orders } = await supabase
          .from("orders")
          .select("customer_email, customer_name, total, created_at")
        const customers = buildCustomerSummaries(orders)
        setStats(getCustomerOverviewStats(customers))
      } catch {
        setStats(getCustomerOverviewStats(buildCustomerSummaries([])))
      } finally {
        setLoading(false)
      }
    }
    fetchCustomerStats()
  }, [supabase])

  const items = [
    { label: "Customers",     value: loading ? "..." : String(stats.totalCustomers) },
    { label: "Avg Orders",    value: loading ? "..." : `${stats.averageOrders}/10` },
    { label: "Avg Spent",     value: loading ? "..." : `Rs${stats.averageSpent.toLocaleString()}` },
    { label: "VIP Customers", value: loading ? "..." : String(stats.vipCustomers) },
  ]

  return (
    <Card className="border-border bg-card">
      <CardHeader className="pb-4">
        <CardTitle className="text-base font-bold rb-text">Customer Overview</CardTitle>
        <p className="text-xs text-muted-foreground">
          Customer values are normalized to 1–10 orders and Rs200–Rs2,500 spend.
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {items.map((item, i) => (
            <div
              key={item.label}
              className={`rounded-xl bg-gradient-to-br ${cardStyles[i]} p-[2px] shadow-md`}
            >
              <div className="rounded-[calc(var(--radius)-2px)] bg-background/80 backdrop-blur-sm p-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{item.label}</p>
                <p className="mt-2 text-2xl font-black rb-text">{item.value}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
