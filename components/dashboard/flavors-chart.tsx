"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { useState, useEffect } from "react"
import { useSupabase } from "@/hooks/use-supabase"
import { Bar, BarChart, XAxis, YAxis } from "recharts"

const chartConfig = {
  sales: {
    label: "Units Sold",
  },
} satisfies ChartConfig

export function FlavorsChart() {
  const [flavorsData, setFlavorsData] = useState<any[]>([])
  const supabase = useSupabase()

  useEffect(() => {
    const fetchFlavorsData = async () => {
      try {
        // Fetch orders and products
        const { data: orders } = await supabase
          .from('orders')
          .select('items')

        const { data: products } = await supabase
          .from('products')
          .select('id, name')

        // Build product name map
        const productMap = new Map()
        if (products) {
          products.forEach((p: any) => {
            productMap.set(p.id, p.name)
          })
        }

        // Calculate flavor sales
        const flavorSales: Record<string, { name: string; sales: number }> = {}

        if (orders) {
          orders.forEach((order: any) => {
            if (order.items && Array.isArray(order.items)) {
              order.items.forEach((item: any) => {
                const productId = item.product_id
                const productName = productMap.get(productId) || `Product ${productId}`

                if (!flavorSales[productId]) {
                  flavorSales[productId] = {
                    name: productName,
                    sales: 0,
                  }
                }
                flavorSales[productId].sales += item.quantity || 1
              })
            }
          })
        }

        // Sort and get top 5
        const topFlavors = Object.values(flavorSales)
          .sort((a, b) => b.sales - a.sales)
          .slice(0, 5)
          .map((f, index) => ({
            flavor: f.name,
            sales: f.sales,
            fill: [
              "var(--chart-1)",
              "var(--chart-2)",
              "var(--chart-3)",
              "var(--chart-4)",
              "var(--chart-5)",
            ][index],
          }))

        if (topFlavors.length === 0) {
          // Placeholder data if no orders
          setFlavorsData([
            { flavor: "No data yet", sales: 0, fill: "var(--chart-1)" },
          ])
        } else {
          setFlavorsData(topFlavors)
        }
      } catch (error) {
        console.error('Error fetching flavors data:', error)
        setFlavorsData([
          { flavor: "Error loading data", sales: 0, fill: "var(--chart-1)" },
        ])
      }
    }

    fetchFlavorsData()
  }, [supabase])

  return (
    <Card className="border-0 bg-card rb-card overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-bold rb-text">🍦 Popular Flavors</CardTitle>
        <p className="text-xs text-muted-foreground">Top selling ice cream flavors</p>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[250px] w-full">
          <BarChart data={flavorsData} layout="vertical">
            <XAxis type="number" axisLine={false} tickLine={false} />
            <YAxis
              dataKey="flavor"
              type="category"
              axisLine={false}
              tickLine={false}
              width={90}
              className="text-xs"
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar
              dataKey="sales"
              radius={[0, 4, 4, 0]}
              className="fill-primary"
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
