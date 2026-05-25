"use client"

import { Sidebar } from "@/components/dashboard/sidebar"
import { Header } from "@/components/dashboard/header"
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
import { useState, useEffect } from "react"
import { useSupabase } from "@/hooks/use-supabase"
import {
  buildCustomerSummaries,
  getCustomerOverviewStats,
  type CustomerSummary,
} from "@/lib/customer-insights"

const statusStyles: Record<string, string> = {
  Active:   "border text-white bg-[oklch(0.72_0.22_145)] border-[oklch(0.72_0.22_145)]",
  VIP:      "border text-white bg-[oklch(0.72_0.28_350)] border-[oklch(0.72_0.28_350)]",
  New:      "border text-white bg-[oklch(0.65_0.22_230)] border-[oklch(0.65_0.22_230)]",
  Inactive: "bg-muted text-muted-foreground border-border",
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<CustomerSummary[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = useSupabase()

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const { data: orders } = await supabase
          .from('orders')
          .select('customer_email, customer_name, total, created_at')

        setCustomers(buildCustomerSummaries(orders))
      } catch (error) {
        console.error('Error fetching customers:', error)
        setCustomers(buildCustomerSummaries([]))
      } finally {
        setLoading(false)
      }
    }

    fetchCustomers()
  }, [supabase])

  const overview = getCustomerOverviewStats(customers)

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div className="md:pl-64">
        <Header />
        <main className="p-4 md:p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-black rb-text">👥 Customers</h1>
            <p className="text-sm text-muted-foreground">
              View and manage your customer base
            </p>
          </div>

          <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {[
              { label: "Customers",     value: loading ? "..." : String(overview.totalCustomers), grad: "from-[oklch(0.68_0.28_25)] to-[oklch(0.78_0.22_55)]" },
              { label: "Avg Orders",    value: loading ? "..." : `${overview.averageOrders}/10`,  grad: "from-[oklch(0.78_0.22_55)] to-[oklch(0.88_0.18_90)]" },
              { label: "Avg Spent",     value: loading ? "..." : `Rs${overview.averageSpent.toLocaleString()}`, grad: "from-[oklch(0.72_0.22_145)] to-[oklch(0.65_0.22_230)]" },
              { label: "VIP Customers", value: loading ? "..." : String(overview.vipCustomers), grad: "from-[oklch(0.68_0.26_310)] to-[oklch(0.72_0.28_350)]" },
            ].map((s) => (
              <Card key={s.label} className={`border-0 bg-gradient-to-br ${s.grad} shadow-lg overflow-hidden relative`}>
                <div className="absolute inset-[1px] rounded-[calc(var(--radius)-1px)] bg-background/75 backdrop-blur-sm" />
                <CardContent className="relative z-10 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{s.label}</p>
                  <p className="mt-2 text-2xl font-black rb-text">{s.value}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="border-0 bg-card rb-card overflow-hidden">
            <CardHeader className="pb-4">
              <CardTitle className="text-base font-bold rb-text">👥 All Customers</CardTitle>
              <p className="text-xs text-muted-foreground">
                {customers.length} total customers
              </p>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-border hover:bg-transparent">
                      <TableHead className="text-muted-foreground">Name</TableHead>
                      <TableHead className="text-muted-foreground">Email</TableHead>
                      <TableHead className="text-muted-foreground text-center">
                        Orders
                      </TableHead>
                      <TableHead className="text-muted-foreground">
                        Total Spent
                      </TableHead>
                      <TableHead className="text-muted-foreground">Status</TableHead>
                      <TableHead className="text-muted-foreground">Joined</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {customers.map((customer) => (
                      <TableRow key={customer.email} className="border-border">
                        <TableCell className="font-medium text-card-foreground">
                          {customer.name}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {customer.email}
                        </TableCell>
                        <TableCell className="text-center text-card-foreground">
                          {customer.orders}
                        </TableCell>
                        <TableCell className="text-card-foreground">
                          Rs{customer.spent.toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={statusStyles[customer.status]}
                          >
                            {customer.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {customer.joined}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  )
}
