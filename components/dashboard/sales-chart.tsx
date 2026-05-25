"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  type ChartConfig,
} from "@/components/ui/chart"
import { useState, useEffect } from "react"
import { useSupabase } from "@/hooks/use-supabase"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"

const chartConfig = {
  sales: {
    label: "Sales (PKR)",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig

export function SalesChart() {
  const [salesData, setSalesData] = useState<any[]>([])
  const supabase = useSupabase()

  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        const { data: orders } = await supabase
          .from('orders')
          .select('created_at, total')

        // Group sales by day of week
        const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
        const daySales = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 }

        if (orders && orders.length > 0) {
          orders.forEach((order: any) => {
            if (order.created_at) {
              const date = new Date(order.created_at)
              const dayOfWeek = date.getDay()
              daySales[dayOfWeek as keyof typeof daySales] += order.total || 0
            }
          })
        }

        const data = dayNames.map((day, index) => ({
          day,
          sales: daySales[index as keyof typeof daySales],
        }))

        setSalesData(data)
      } catch (error) {
        console.error('Error fetching sales data:', error)
        // Fallback data
        setSalesData([
          { day: "Sun", sales: 0 },
          { day: "Mon", sales: 0 },
          { day: "Tue", sales: 0 },
          { day: "Wed", sales: 0 },
          { day: "Thu", sales: 0 },
          { day: "Fri", sales: 0 },
          { day: "Sat", sales: 0 },
        ])
      }
    }

    fetchSalesData()
  }, [supabase])

  return (
    <Card className="border-0 bg-card rb-card overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-bold rb-text">📈 Sales per Day</CardTitle>
        <p className="text-xs text-muted-foreground">Daily revenue overview (PKR)</p>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[250px] w-full">
          <AreaChart data={salesData}>
            <defs>
              <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="0%"
                  stopColor="var(--chart-1)"
                  stopOpacity={0.3}
                />
                <stop
                  offset="100%"
                  stopColor="var(--chart-1)"
                  stopOpacity={0.05}
                />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              className="stroke-border"
              vertical={false}
            />
            <XAxis
              dataKey="day"
              axisLine={false}
              tickLine={false}
              className="text-xs"
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              className="text-xs"
              tickFormatter={(value) => `Rs${(value / 1000).toFixed(0)}K`}
            />
            <ChartTooltip
              content={({ active, payload, label }) => {
                if (!active || !payload?.length) {
                  return null
                }

                const salesValue = Number(payload[0]?.value ?? 0)

                return (
                  <div className="grid min-w-[8rem] gap-1 rounded-lg border border-border/50 bg-background px-2.5 py-1.5 text-xs shadow-xl">
                    <div className="font-medium text-foreground">{label}</div>
                    <div className="text-muted-foreground">Sales</div>
                    <div className="font-mono font-medium tabular-nums text-foreground">
                      {`Rs${salesValue.toLocaleString()}`}
                    </div>
                  </div>
                )
              }}
            />
            <Area
              type="monotone"
              dataKey="sales"
              stroke="var(--chart-1)"
              strokeWidth={2}
              fill="url(#salesGradient)"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
