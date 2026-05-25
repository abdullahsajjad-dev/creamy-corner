'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { useCart } from '@/hooks/use-cart'
import { Trash2, Plus, Minus, ArrowLeft, CheckCircle, MessageCircle, ShoppingBag } from 'lucide-react'
import { useSupabase } from '@/hooks/use-supabase'
import { getProductImageUrl } from '@/lib/utils'
import { useState } from 'react'
import { toast } from 'sonner'
import { Label } from '@/components/ui/label'

export default function CartPage() {
  const { items, updateQuantity, removeFromCart, clearCart, total } = useCart()
  const [customerInfo, setCustomerInfo] = useState({ name: '', email: '', phone: '', address: '' })
  const [loading, setLoading] = useState(false)
  const [orderSuccess, setOrderSuccess] = useState<{ id: string; total: number; name: string; items: typeof items } | null>(null)
  const supabase = useSupabase()

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault()

    if (items.length === 0) {
      toast.error('Cart is empty')
      return
    }

    if (!customerInfo.name || !customerInfo.email || !customerInfo.phone) {
      toast.error('Please fill in all required fields')
      return
    }

    setLoading(true)
    try {
      const { error } = await supabase.from('orders').insert([
        {
          customer_name: customerInfo.name,
          customer_email: customerInfo.email,
          phone: customerInfo.phone,
          address: customerInfo.address,
          items: items.map((item) => ({
            product_id: item.id,
            quantity: item.quantity,
          })),
          total: total,
          status: 'Pending',
        },
      ])

      if (error) {
        toast.error('Failed to place order: ' + error.message)
      } else {
        const { data: newOrder } = await supabase
          .from('orders')
          .select('id')
          .eq('customer_email', customerInfo.email)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle()
        setOrderSuccess({
          id: newOrder?.id || 'N/A',
          total: total + 300,
          name: customerInfo.name,
          items: [...items],
        })
        clearCart()
        setCustomerInfo({ name: '', email: '', phone: '', address: '' })
      }
    } catch (error) {
      toast.error('Error placing order')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  if (orderSuccess) {
    const waMessage = `Hi Creamy Corner! 🍦\n\nI just placed an order.\n👤 Name: ${orderSuccess.name}\n📦 Items: ${orderSuccess.items.length} item(s)\n💰 Total: Rs${orderSuccess.total.toLocaleString()}\n🔖 Order: ${orderSuccess.id.substring(0, 8).toUpperCase()}\n\nPlease confirm my order. Thank you!`
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-lg border-border shadow-lg overflow-hidden">
          <div className="rb-strip h-1.5" />
          <CardContent className="pt-10 pb-8 text-center space-y-6">
            <div className="flex justify-center">
              <div className="h-20 w-20 rounded-full bg-emerald-100 flex items-center justify-center">
                <CheckCircle className="h-10 w-10 text-emerald-500" />
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-black text-foreground">Order Placed!</h2>
              <p className="text-muted-foreground mt-1">Thank you, <span className="font-semibold text-foreground">{orderSuccess.name}</span>! Your order has been received.</p>
            </div>
            <div className="bg-secondary/50 rounded-xl p-4 text-left space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Order ID</span>
                <span className="font-mono font-bold text-foreground">{orderSuccess.id.substring(0, 8).toUpperCase()}...</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Items</span>
                <span className="font-semibold text-foreground">{orderSuccess.items.length} item(s)</span>
              </div>
              <div className="flex justify-between text-sm border-t border-border pt-2 mt-2">
                <span className="font-bold text-foreground">Total Paid</span>
                <span className="font-black text-primary text-lg">₨{orderSuccess.total.toLocaleString()}</span>
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <Button
                className="w-full gap-2 bg-[#25D366] hover:bg-[#22c55e] text-white font-bold border-0"
                onClick={() => window.open(`https://wa.me/923114782290?text=${encodeURIComponent(waMessage)}`, '_blank')}
              >
                <MessageCircle className="h-4 w-4" />
                Confirm via WhatsApp
              </Button>
              <Link href="/track-order">
                <Button variant="outline" className="w-full gap-2">
                  <ShoppingBag className="h-4 w-4" />
                  Track My Order
                </Button>
              </Link>
              <Link href="/shop">
                <Button variant="ghost" className="w-full text-muted-foreground">
                  Continue Shopping
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center space-y-4">
            <p className="text-lg text-muted-foreground">Your cart is empty</p>
            <Button asChild className="w-full">
              <Link href="/shop">Continue Shopping</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="mb-8 flex items-center gap-4">
          <Link href="/shop">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-3xl font-black rb-text">🛒 Shopping Cart</h1>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  {items.length} item{items.length !== 1 ? 's' : ''} in cart
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-4 p-4 border border-border rounded-lg"
                  >
                    {/* Product Image */}
                    <img
                      src={getProductImageUrl(item.image_path)}
                      alt={item.name}
                      className="h-24 w-24 rounded-md object-cover"
                      onError={(e) => {
                        ;(e.target as HTMLImageElement).src = '/placeholder.jpg'
                      }}
                    />

                    {/* Product Info */}
                    <div className="flex-1">
                      <h3 className="font-semibold text-card-foreground">
                        {item.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {item.category}
                      </p>
                      <p className="text-lg font-black rb-text mt-2">
                        Rs{item.price.toLocaleString()}
                      </p>
                    </div>

                    {/* Quantity & Actions */}
                    <div className="flex flex-col items-end gap-2">
                      <div className="flex items-center gap-2 border border-border rounded-md">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-8 text-center text-sm font-medium">
                          {item.quantity}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFromCart(item.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      <p className="text-sm font-semibold text-card-foreground">
                        Rs
                        {(item.price * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Checkout Form */}
          <div>
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCheckout} className="space-y-4">
                  {/* Customer Info */}
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="name">Name *</Label>
                      <Input
                        id="name"
                        placeholder="Your name"
                        value={customerInfo.name}
                        onChange={(e) =>
                          setCustomerInfo({
                            ...customerInfo,
                            name: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="Your email"
                        value={customerInfo.email}
                        onChange={(e) =>
                          setCustomerInfo({
                            ...customerInfo,
                            email: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone *</Label>
                      <Input
                        id="phone"
                        placeholder="Your phone"
                        value={customerInfo.phone}
                        onChange={(e) =>
                          setCustomerInfo({
                            ...customerInfo,
                            phone: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="address">Address</Label>
                      <Input
                        id="address"
                        placeholder="Delivery address (Lahore)"
                        value={customerInfo.address}
                        onChange={(e) =>
                          setCustomerInfo({
                            ...customerInfo,
                            address: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>

                  {/* Price Breakdown */}
                  <div className="border-t border-border pt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Subtotal:</span>
                      <span>Rs{total.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Delivery:</span>
                      <span>Rs300</span>
                    </div>
                    <div className="border-t border-border pt-2 flex justify-between font-bold">
                      <span>Total:</span>
                      <span className="rb-text text-lg font-black">
                        Rs{(total + 300).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Buttons */}
                  <div className="space-y-2">
                    <Button
                      type="submit"
                      className="w-full rb-bg-anim text-white font-black border-0 shadow-md hover:opacity-90"
                      disabled={loading}
                      size="lg"
                    >
                      {loading ? 'Processing...' : '🍦 Place Order'}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full"
                      asChild
                    >
                      <Link href="/shop">Continue Shopping</Link>
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
