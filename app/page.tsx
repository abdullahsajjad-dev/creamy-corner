import { Sidebar } from "@/components/dashboard/sidebar"
import { Header } from "@/components/dashboard/header"
import { StatCards } from "@/components/dashboard/stat-cards"
import { SalesChart } from "@/components/dashboard/sales-chart"
import { FlavorsChart } from "@/components/dashboard/flavors-chart"
import { RatingsChart } from "@/components/dashboard/ratings-chart"
import { OrdersTable } from "@/components/dashboard/orders-table"

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div className="md:pl-64">
        <Header />
        <main className="p-4 md:p-6">
          {/* Page Title */}
          <div className="mb-6">
            <h1 className="text-2xl font-black rb-text">🍨 Dashboard</h1>
            <p className="text-sm text-muted-foreground">
              Welcome back! Here&apos;s your ice cream business overview.
            </p>
          </div>

          {/* Stat Cards */}
          <StatCards />

          {/* Charts Row */}
          <div className="mt-6 grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
            <SalesChart />
            <FlavorsChart />
            <RatingsChart />
          </div>

          {/* Recent Orders */}
          <div className="mt-6">
            <OrdersTable />
          </div>
        </main>
      </div>
    </div>
  )
}
