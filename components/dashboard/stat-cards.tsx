"use client"

import { Card, CardContent } from "@/components/ui/card"
import { ShoppingCart, DollarSign, IceCream, Star } from "lucide-react"
import { useState, useEffect } from "react"
import { useSupabase } from "@/hooks/use-supabase"

type Stat = {
  title: string
  value: string
  change: string
  changeType: 'positive' | 'negative' | 'neutral'
  icon: React.ComponentType<{ className: string }>
}

/* Each card: gradient background + icon color */
const cardStyles = [
  { card: "from-[oklch(0.68_0.28_25)] to-[oklch(0.78_0.22_55)]",   icon: "rb-icon-red"    },
  { card: "from-[oklch(0.78_0.22_55)] to-[oklch(0.88_0.18_90)]",   icon: "rb-icon-orange" },
  { card: "from-[oklch(0.72_0.22_145)] to-[oklch(0.65_0.22_230)]", icon: "rb-icon-green"  },
  { card: "from-[oklch(0.68_0.26_310)] to-[oklch(0.72_0.28_350)]", icon: "rb-icon-violet" },
]

export function StatCards() {
  const [stats, setStats] = useState<Stat[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = useSupabase()

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data: orders } = await supabase
          .from('orders')
          .select('*')

        const { data: products } = await supabase
          .from('products')
          .select('id, name, price, rating')

        const totalOrders = (orders || []).length
        const totalRevenue = (orders || []).reduce((sum: number, order: any) => sum + (order.total || 0), 0)
        const avgRating = products && products.length > 0
          ? (products.reduce((sum: number, p: any) => sum + (p.rating || 0), 0) / products.length).toFixed(1)
          : '0.0'

        let topFlavorName = "N/A"
        let topFlavorCount = 0

        if (orders && orders.length > 0 && products && products.length > 0) {
          const productMap = new Map()
          products.forEach((p: any) => { productMap.set(p.id, p.name) })

          const flavorCounts: Record<number, number> = {}
          orders.forEach((order: any) => {
            if (order.items && Array.isArray(order.items)) {
              order.items.forEach((item: any) => {
                flavorCounts[item.product_id] = (flavorCounts[item.product_id] || 0) + item.quantity
              })
            }
          })

          let maxCount = 0
          let topProductId = 0
          for (const [productId, count] of Object.entries(flavorCounts)) {
            if (count > maxCount) {
              maxCount = count
              topProductId = parseInt(productId)
            }
          }

          if (topProductId > 0) {
            topFlavorName = productMap.get(topProductId) || "N/A"
            topFlavorCount = maxCount
          }
        }

        setStats([
          { title: "Total Orders",       value: totalOrders.toLocaleString(), change: totalOrders > 0 ? "+5%" : "0%", changeType: totalOrders > 0 ? "positive" : "neutral", icon: ShoppingCart },
          { title: "Total Revenue",      value: `Rs${totalRevenue.toLocaleString()}`, change: totalRevenue > 0 ? "+5%" : "0%", changeType: totalRevenue > 0 ? "positive" : "neutral", icon: DollarSign },
          { title: "Top Selling Flavor", value: topFlavorName, change: `${topFlavorCount} units`, changeType: "neutral", icon: IceCream },
          { title: "Average Rating",     value: avgRating, change: parseFloat(avgRating) > 4.5 ? "+0.3" : "0", changeType: parseFloat(avgRating) > 4.5 ? "positive" : "neutral", icon: Star },
        ])
      } catch {
        setStats([
          { title: "Total Orders",       value: "0",   change: "+0%",     changeType: "neutral", icon: ShoppingCart },
          { title: "Total Revenue",      value: "Rs0", change: "+0%",     changeType: "neutral", icon: DollarSign },
          { title: "Top Selling Flavor", value: "N/A", change: "0 units", changeType: "neutral", icon: IceCream },
          { title: "Average Rating",     value: "0.0", change: "+0",      changeType: "neutral", icon: Star },
        ])
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, i) => {
        const style = cardStyles[i % cardStyles.length]
        return (
          <Card key={stat.title} className={`border-0 bg-gradient-to-br ${style.card} shadow-lg overflow-hidden relative`}>
            {/* glassy inner surface */}
            <div className="absolute inset-[1px] rounded-[calc(var(--radius)-1px)] bg-background/75 backdrop-blur-sm" />
            <CardContent className="relative z-10 p-6">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-black rb-text">
                    {loading ? "..." : stat.value}
                  </p>
                  <p className={`text-xs font-semibold ${
                    stat.changeType === "positive" ? "text-[oklch(0.72_0.22_145)]" :
                    stat.changeType === "negative" ? "text-destructive" :
                    "text-muted-foreground"
                  }`}>
                    {stat.change}
                  </p>
                </div>
                <div className={`flex h-11 w-11 items-center justify-center rounded-xl shadow-md ${style.icon}`}>
                  <stat.icon className="h-5 w-5" />
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
