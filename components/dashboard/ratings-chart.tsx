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
  count: {
    label: "Reviews",
  },
  "5 Stars": {
    label: "5 Stars",
    color: "var(--chart-1)",
  },
  "4 Stars": {
    label: "4 Stars",
    color: "var(--chart-2)",
  },
  "3 Stars": {
    label: "3 Stars",
    color: "var(--chart-5)",
  },
  "2 Stars": {
    label: "2 Stars",
    color: "var(--chart-3)",
  },
  "1 Star": {
    label: "1 Star",
    color: "var(--chart-4)",
  },
} satisfies ChartConfig

export function RatingsChart() {
  const [ratingsData, setRatingsData] = useState<any[]>([])
  const supabase = useSupabase()

  useEffect(() => {
    const fetchRatingsData = async () => {
      try {
        const { data: products } = await supabase
          .from('products')
          .select('rating')

        // Count ratings by star level (using range-based grouping for decimal ratings)
        const ratingCounts = {
          "5 Stars": 0,
          "4 Stars": 0,
          "3 Stars": 0,
          "2 Stars": 0,
          "1 Star": 0,
        }

        if (products) {
          products.forEach((p: any) => {
            const rating = p.rating || 0
            if (rating >= 4.5) ratingCounts["5 Stars"]++
            else if (rating >= 3.5) ratingCounts["4 Stars"]++
            else if (rating >= 2.5) ratingCounts["3 Stars"]++
            else if (rating >= 1.5) ratingCounts["2 Stars"]++
            else if (rating >= 0.5) ratingCounts["1 Star"]++
          })
        }

        const data = [
          {
            rating: "5 Stars",
            count: ratingCounts["5 Stars"],
            fill: "var(--chart-1)",
          },
          {
            rating: "4 Stars",
            count: ratingCounts["4 Stars"],
            fill: "var(--chart-2)",
          },
          {
            rating: "3 Stars",
            count: ratingCounts["3 Stars"],
            fill: "var(--chart-5)",
          },
          {
            rating: "2 Stars",
            count: ratingCounts["2 Stars"],
            fill: "var(--chart-3)",
          },
          {
            rating: "1 Star",
            count: ratingCounts["1 Star"],
            fill: "var(--chart-4)",
          },
        ]

        setRatingsData(data)
      } catch (error) {
        console.error('Error fetching ratings data:', error)
        // Fallback data
        setRatingsData([
          {
            rating: "5 Stars",
            count: 0,
            fill: "var(--chart-1)",
          },
          {
            rating: "4 Stars",
            count: 0,
            fill: "var(--chart-2)",
          },
          {
            rating: "3 Stars",
            count: 0,
            fill: "var(--chart-5)",
          },
          {
            rating: "2 Stars",
            count: 0,
            fill: "var(--chart-3)",
          },
          {
            rating: "1 Star",
            count: 0,
            fill: "var(--chart-4)",
          },
        ])
      }
    }

    fetchRatingsData()
  }, [supabase])

  return (
    <Card className="border-0 bg-card rb-card overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-bold rb-text">⭐ Customer Ratings</CardTitle>
        <p className="text-xs text-muted-foreground">Rating distribution overview</p>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[250px] w-full">
          <BarChart data={ratingsData}>
            <XAxis
              dataKey="rating"
              axisLine={false}
              tickLine={false}
              className="text-xs"
            />
            <YAxis axisLine={false} tickLine={false} className="text-xs" />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="count" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
