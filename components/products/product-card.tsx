'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Star, ShoppingCart } from 'lucide-react'
import { useCart } from '@/hooks/use-cart'
import { getProductImageUrl } from '@/lib/utils'
import { toast } from 'sonner'

type Product = {
  id: number
  name: string
  description: string
  price: number
  image_path: string
  stock: number
  rating: number
  category: string
}

/* Map categories to a rainbow hue */
const categoryColors: Record<string, string> = {
  kulfi:    "bg-[oklch(0.68_0.28_350)] text-white",
  cone:     "bg-[oklch(0.78_0.22_55)]  text-black",
  sundae:   "bg-[oklch(0.72_0.22_145)] text-white",
  drink:    "bg-[oklch(0.65_0.22_230)] text-white",
  gelato:   "bg-[oklch(0.68_0.26_310)] text-white",
  sorbet:   "bg-[oklch(0.75_0.20_195)] text-black",
  default:  "rb-bg-anim text-white",
}

function getCategoryStyle(cat: string) {
  const key = cat?.toLowerCase().trim()
  return categoryColors[key] || categoryColors.default
}

export function ProductCard({ product }: { product: Product }) {
  const { addToCart, items } = useCart()
  const cartItem = items.find((item) => item.id === product.id)

  const handleAddToCart = () => {
    if (product.stock === 0) { toast.error('Out of stock'); return }
    addToCart(product)
    toast.success(`${product.name} added to cart! 🍦`)
  }

  return (
    <Card className="overflow-hidden rb-card hover:scale-[1.02] transition-transform duration-200 bg-card border-0">
      <CardHeader className="p-0">
        <div className="relative h-48 w-full bg-secondary overflow-hidden rounded-t-lg">
          <img
            src={getProductImageUrl(product.image_path)}
            alt={product.name}
            className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
            onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder.jpg' }}
          />
          {/* Rainbow shimmer overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent" />
          {/* Category badge */}
          <div className={`absolute top-2 right-2 px-2.5 py-1 rounded-full text-[11px] font-bold shadow ${getCategoryStyle(product.category)}`}>
            {product.category}
          </div>
          {/* Stock badge */}
          {product.stock === 0 && (
            <div className="absolute inset-0 bg-background/70 flex items-center justify-center">
              <span className="text-sm font-bold text-destructive">OUT OF STOCK</span>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="p-4 space-y-3">
        <div>
          <h3 className="font-bold text-card-foreground line-clamp-1">{product.name}</h3>
          <p className="text-xs text-muted-foreground line-clamp-2 mt-1">{product.description}</p>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Star className="h-3.5 w-3.5 fill-[oklch(0.88_0.18_90)] text-[oklch(0.88_0.18_90)]" />
            <span className="text-xs font-bold text-card-foreground">{product.rating}</span>
          </div>
          <span className={`text-[11px] font-semibold ${product.stock > 0 ? 'text-[oklch(0.72_0.22_145)]' : 'text-destructive'}`}>
            {product.stock > 0 ? `${product.stock} in stock` : 'Sold out'}
          </span>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-border">
          <span className="text-lg font-black rb-text">₨{product.price.toLocaleString()}</span>
          <Button
            size="sm"
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className="gap-1.5 rb-bg-anim text-white font-bold hover:opacity-90 border-0 shadow-md"
          >
            <ShoppingCart className="h-3.5 w-3.5" />
            {cartItem ? `In Cart (${cartItem.quantity})` : 'Add'}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
