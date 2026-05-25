import { Sidebar } from "@/components/dashboard/sidebar"
import { Header } from "@/components/dashboard/header"
import { OrdersTable } from "@/components/dashboard/orders-table"

export default function OrdersPage() {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div className="md:pl-64">
        <Header />
        <main className="p-4 md:p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-black rb-text">🛒 Orders</h1>
            <p className="text-sm text-muted-foreground">
              Track and manage customer orders
            </p>
          </div>
          <OrdersTable />
        </main>
      </div>
    </div>
  )
}
