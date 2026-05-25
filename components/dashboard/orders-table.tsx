"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"

import { useSupabase } from '@/hooks/use-supabase'
import { pakistaniCustomers } from '@/lib/data/customers'
import { useEffect, useState } from 'react'

type Order = {
  id: string
  customer_email: string
  customer_name?: string
  items: Array<{product_id: number, quantity: number}>
  total: number
  status: string
  created_at: string
}

const statusStyles: Record<string, string> = {
  Delivered:  "border text-white bg-[oklch(0.72_0.22_145)] border-[oklch(0.72_0.22_145)]",
  Processing: "border text-black bg-[oklch(0.88_0.18_90)]  border-[oklch(0.88_0.18_90)]",
  Shipped:    "border text-white bg-[oklch(0.65_0.22_230)] border-[oklch(0.65_0.22_230)]",
  Pending:    "border text-black bg-[oklch(0.78_0.22_55)]  border-[oklch(0.78_0.22_55)]",
  Cancelled:  "border text-white bg-[oklch(0.68_0.28_25)]  border-[oklch(0.68_0.28_25)]",
}

function exportCSV(orders: Order[]) {
  const rows = [
    ['Order ID', 'Customer', 'Email', 'Items', 'Total (PKR)', 'Status', 'Date'],
    ...orders.map(o => [
      o.id,
      o.customer_name || '',
      o.customer_email,
      o.items.map(i => `P${i.product_id}x${i.quantity}`).join(' | '),
      o.total.toString(),
      o.status,
      new Date(o.created_at).toLocaleDateString(),
    ])
  ]
  const csv = rows.map(r => r.map(c => `"${c}"`).join(',')).join('\n')
  const blob = new Blob([csv], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `creamy-corner-orders-${new Date().toISOString().split('T')[0]}.csv`
  a.click()
  URL.revokeObjectURL(url)
}

export function OrdersTable() {
  const [orders, setOrders] = useState<Order[]>([])
  const supabase = useSupabase()

  useEffect(() => {
    async function fetchOrders() {
      const { data } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10)
      setOrders(data || [])
    }
    
    fetchOrders()

    // Subscribe to real-time changes (modern Supabase API)
    const channel = supabase
      .channel('orders')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'orders'
        },
        () => {
          fetchOrders()
        }
      )
      .subscribe()

    return () => {
      channel.unsubscribe()
    }
  }, [supabase])

  return (
    <Card className="border-0 bg-card rb-card overflow-hidden">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base font-bold rb-text">🛒 Recent Orders</CardTitle>
            <p className="text-xs text-muted-foreground mt-0.5">Latest customer orders overview</p>
          </div>
          {orders.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5 text-xs h-8"
              onClick={() => exportCSV(orders)}
            >
              <Download className="h-3 w-3" />
              Export CSV
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="text-muted-foreground">Order ID</TableHead>
                <TableHead className="text-muted-foreground">Customer</TableHead>
                <TableHead className="text-muted-foreground">Items</TableHead>
                <TableHead className="text-muted-foreground">Total</TableHead>
                <TableHead className="text-muted-foreground">Status</TableHead>
                <TableHead className="text-muted-foreground">Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => {
                // Find Pakistani customer name if available
                const pakistaniCustomer = pakistaniCustomers.find(
                  (pc) => pc.email === order.customer_email
                )
                const displayName = pakistaniCustomer?.name || order.customer_name || order.customer_email

                return (
                  <TableRow key={order.id} className="border-border">
                    <TableCell className="font-mono text-xs text-card-foreground">
                      {order.id.substring(0,8)}...
                    </TableCell>
                    <TableCell className="text-card-foreground">
                      {displayName}
                    </TableCell>
                    <TableCell className="text-card-foreground">
                      {order.items.map((item: any) => `#${item.product_id} x${item.quantity}`).join(', ')}
                    </TableCell>
                    <TableCell className="text-card-foreground font-semibold">
                      ₨{order.total.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={statusStyles[order.status] || statusStyles['Pending']}
                      >
                        {order.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(order.created_at).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
