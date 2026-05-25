"use client"

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Star, Pencil, Trash2, RotateCw } from 'lucide-react'

import { Product } from '@/lib/types/product'
import { useSupabase } from '@/hooks/use-supabase'
import { getProductImageUrl } from '@/lib/utils'
import { useEffect, useState } from 'react'
import { AddProductModal } from './add-product-modal'
import { toast } from 'sonner'

/* Tiered stock badge — matches screenshot color coding */
function StockBadge({ stock }: { stock: number }) {
  const style =
    stock < 35
      ? "bg-[oklch(0.68_0.28_25)] text-white"       // red  — critical
      : stock < 65
      ? "bg-[oklch(0.78_0.22_55)] text-black"        // orange — warning
      : "bg-[oklch(0.72_0.22_145)] text-white"        // green — healthy

  return (
    <span className={`inline-flex items-center justify-center rounded-full px-2.5 py-0.5 text-xs font-bold ${style}`}>
      {stock}
    </span>
  )
}

/* Per-category color dot/badge */
const catColors: Record<string, string> = {
  Classic:    "bg-[oklch(0.68_0.28_350/0.2)] text-[oklch(0.68_0.28_350)] border border-[oklch(0.68_0.28_350/0.4)]",
  Fruit:      "bg-[oklch(0.78_0.22_55/0.2)]  text-[oklch(0.78_0.22_55)]  border border-[oklch(0.78_0.22_55/0.4)]",
  Nut:        "bg-[oklch(0.65_0.22_230/0.2)] text-[oklch(0.65_0.22_230)] border border-[oklch(0.65_0.22_230/0.4)]",
  Chocolate:  "bg-[oklch(0.72_0.22_145/0.2)] text-[oklch(0.72_0.22_145)] border border-[oklch(0.72_0.22_145/0.4)]",
  Cookies:    "bg-[oklch(0.68_0.26_310/0.2)] text-[oklch(0.68_0.26_310)] border border-[oklch(0.68_0.26_310/0.4)]",
  Cheesecake: "bg-[oklch(0.65_0.22_350/0.2)] text-[oklch(0.65_0.22_350)] border border-[oklch(0.65_0.22_350/0.4)]",
  Sorbet:     "bg-[oklch(0.75_0.20_195/0.2)] text-[oklch(0.75_0.20_195)] border border-[oklch(0.75_0.20_195/0.4)]",
  Kids:       "bg-[oklch(0.70_0.25_280/0.2)] text-[oklch(0.70_0.25_280)] border border-[oklch(0.70_0.25_280/0.4)]",
  Mint:       "bg-[oklch(0.75_0.20_180/0.2)] text-[oklch(0.75_0.20_180)] border border-[oklch(0.75_0.20_180/0.4)]",
  Premium:    "bg-[oklch(0.68_0.28_60/0.2)] text-[oklch(0.68_0.28_60)] border border-[oklch(0.68_0.28_60/0.4)]",
  Specialty:  "bg-[oklch(0.68_0.26_310/0.2)] text-[oklch(0.68_0.26_310)] border border-[oklch(0.68_0.26_310/0.4)]",
}

export function ProductsTable() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const supabase = useSupabase()

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('rating', { ascending: false })

      if (error) {
        toast.error(`Failed to fetch products: ${error.message}`)
      } else {
        setProducts(data || [])
      }
    } catch {
      toast.error('Error fetching products')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchProducts() }, [])

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this product?')) return
    try {
      const { error } = await supabase.from('products').delete().eq('id', id)
      if (error) { toast.error('Failed to delete product') }
      else { toast.success('Product deleted!'); fetchProducts() }
    } catch { toast.error('Error deleting product') }
  }

  return (
    <Card className="border-0 bg-card rb-card overflow-hidden">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base font-bold rb-text">
              Products Inventory (Lahore Ice Creams)
            </CardTitle>
            <p className="text-xs text-muted-foreground mt-0.5">
              {products.length} flavors, live from Supabase
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={fetchProducts}
              disabled={loading}
              className="h-8 w-8 p-0 border-border"
            >
              <RotateCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            </Button>
            <AddProductModal onProductAdded={fetchProducts} />
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="text-muted-foreground w-16">Image</TableHead>
                <TableHead className="text-muted-foreground">Name</TableHead>
                <TableHead className="text-muted-foreground">Price (PKR)</TableHead>
                <TableHead className="text-muted-foreground">Category</TableHead>
                <TableHead className="text-muted-foreground">Rating</TableHead>
                <TableHead className="text-muted-foreground text-center w-20">Stock</TableHead>
                <TableHead className="text-muted-foreground text-right w-32">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id} className="border-border hover:bg-secondary/30 transition-colors">
                  <TableCell>
                    <img
                      src={getProductImageUrl(product.image_path)}
                      alt={product.name}
                      className="h-12 w-12 rounded-lg object-cover border border-border"
                      onError={(e) => (e.target as HTMLImageElement).src = '/placeholder.jpg'}
                    />
                  </TableCell>

                  <TableCell className="font-semibold max-w-[200px] truncate">
                    <span className="rb-text">{product.name}</span>
                  </TableCell>

                  <TableCell className="font-bold text-card-foreground">
                    Rs{product.price.toLocaleString()}
                  </TableCell>

                  <TableCell>
                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold ${catColors[product.category] ?? catColors.Specialty}`}>
                      {product.category}
                    </span>
                  </TableCell>

                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Star className="h-3.5 w-3.5 fill-[oklch(0.88_0.18_90)] text-[oklch(0.88_0.18_90)]" />
                      <span className="font-semibold text-card-foreground">{product.rating}</span>
                    </div>
                  </TableCell>

                  <TableCell className="text-center">
                    <StockBadge stock={product.stock} />
                  </TableCell>

                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-[oklch(0.65_0.22_230)]"
                      >
                        <Pencil className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        onClick={() => handleDelete(product.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
