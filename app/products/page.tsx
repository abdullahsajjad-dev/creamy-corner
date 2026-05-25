import { Sidebar } from "@/components/dashboard/sidebar"
import { Header } from "@/components/dashboard/header"
import { ProductsTable } from "@/components/dashboard/products-table"

export default function ProductsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div className="md:pl-64">
        <Header />
        <main className="p-4 md:p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-black rb-text">🍦 Products</h1>
            <p className="text-sm text-muted-foreground">
              Manage your ice cream product inventory
            </p>
          </div>
          <ProductsTable />
        </main>
      </div>
    </div>
  )
}
