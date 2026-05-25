'use client'

import { useState } from 'react'
import { useSupabase } from '@/hooks/use-supabase'
import Link from 'next/link'
import { Search, Package, CheckCircle, Clock, Truck, XCircle, ArrowLeft, IceCream, MapPin, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

type Order = {
  id: string
  customer_name: string
  customer_email: string
  phone?: string
  address?: string
  items: Array<{ product_id: number; quantity: number }>
  total: number
  status: string
  created_at: string
}

const statusSteps = ['Pending', 'Processing', 'Shipped', 'Delivered']

const statusConfig: Record<string, { color: string; bg: string; icon: React.ReactNode; label: string }> = {
  Pending:    { color: 'text-amber-600',  bg: 'bg-amber-50 border-amber-200',   icon: <Clock className="h-4 w-4" />,       label: 'Order Placed' },
  Processing: { color: 'text-blue-600',   bg: 'bg-blue-50 border-blue-200',     icon: <Package className="h-4 w-4" />,     label: 'Being Prepared' },
  Shipped:    { color: 'text-violet-600', bg: 'bg-violet-50 border-violet-200', icon: <Truck className="h-4 w-4" />,       label: 'Out for Delivery' },
  Delivered:  { color: 'text-emerald-600',bg: 'bg-emerald-50 border-emerald-200',icon: <CheckCircle className="h-4 w-4" />,label: 'Delivered' },
  Cancelled:  { color: 'text-red-600',    bg: 'bg-red-50 border-red-200',       icon: <XCircle className="h-4 w-4" />,     label: 'Cancelled' },
}

export default function TrackOrderPage() {
  const [query, setQuery] = useState('')
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const supabase = useSupabase()

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return
    setLoading(true)
    setSearched(true)
    setOrder(null)

    const { data } = await supabase
      .from('orders')
      .select('*')
      .or(`id.ilike.${query}%,phone.eq.${query},customer_email.ilike.%${query}%`)
      .limit(1)
      .maybeSingle()

    setOrder(data)
    setLoading(false)
  }

  const currentStep = order ? (order.status === 'Cancelled' ? -1 : statusSteps.indexOf(order.status)) : -1

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-secondary/20">
      {/* Nav */}
      <nav className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between max-w-3xl">
          <Link href="/shop" className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Back to Shop
          </Link>
          <div className="flex items-center gap-2 font-black text-foreground">
            <IceCream className="h-5 w-5 text-primary" />
            Creamy Corner
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-12 max-w-3xl">
        {/* Hero */}
        <div className="text-center mb-10">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl rb-bg-anim text-3xl mb-4 shadow-lg">
            📦
          </div>
          <h1 className="text-4xl font-black text-foreground mb-3">Track Your Order</h1>
          <p className="text-muted-foreground text-lg">
            Enter your Order ID, phone number, or email to check your order status
          </p>
        </div>

        {/* Search Form */}
        <Card className="mb-8 border-border shadow-sm">
          <CardContent className="pt-6">
            <form onSubmit={handleTrack} className="flex gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder="Order ID, phone number, or email..."
                  className="pl-10 h-11 bg-secondary/50 border-0 focus-visible:ring-1"
                />
              </div>
              <Button type="submit" disabled={loading} className="h-11 px-6 rb-bg-anim border-0 text-white font-bold hover:opacity-90">
                {loading ? (
                  <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : 'Track'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Results */}
        {searched && !loading && (
          order ? (
            <div className="space-y-6 animate-fade-in">
              {/* Order Header */}
              <Card className="border-border shadow-sm overflow-hidden">
                <div className="rb-strip h-1" />
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between flex-wrap gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Order ID</p>
                      <p className="font-mono text-sm font-bold text-foreground mt-1">{order.id.substring(0, 8).toUpperCase()}...</p>
                      <p className="text-sm text-muted-foreground mt-2 flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" />
                        {new Date(order.created_at).toLocaleDateString('en-PK', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Total Amount</p>
                      <p className="text-2xl font-black text-primary mt-1">₨{order.total.toLocaleString()}</p>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-border grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground">Customer</p>
                      <p className="text-sm font-semibold text-foreground">{order.customer_name}</p>
                    </div>
                    {order.address && (
                      <div>
                        <p className="text-xs text-muted-foreground flex items-center gap-1"><MapPin className="h-3 w-3" /> Delivery Address</p>
                        <p className="text-sm font-semibold text-foreground">{order.address}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Status Timeline */}
              <Card className="border-border shadow-sm">
                <CardContent className="pt-6">
                  <h3 className="font-bold text-foreground mb-6">Order Status</h3>

                  {order.status === 'Cancelled' ? (
                    <div className="flex items-center gap-3 p-4 rounded-xl bg-red-50 border border-red-200">
                      <XCircle className="h-6 w-6 text-red-500 flex-shrink-0" />
                      <div>
                        <p className="font-bold text-red-700">Order Cancelled</p>
                        <p className="text-sm text-red-600">This order has been cancelled. Please contact us if you have questions.</p>
                      </div>
                    </div>
                  ) : (
                    <div className="relative">
                      {/* Progress line */}
                      <div className="absolute top-5 left-5 right-5 h-0.5 bg-secondary" />
                      <div
                        className="absolute top-5 left-5 h-0.5 bg-primary transition-all duration-500"
                        style={{ width: currentStep >= 0 ? `${(currentStep / (statusSteps.length - 1)) * 100}%` : '0%' }}
                      />

                      <div className="relative flex justify-between">
                        {statusSteps.map((step, idx) => {
                          const isDone = idx <= currentStep
                          const isCurrent = idx === currentStep
                          const cfg = statusConfig[step]
                          return (
                            <div key={step} className="flex flex-col items-center gap-2 flex-1">
                              <div className={`h-10 w-10 rounded-full flex items-center justify-center border-2 transition-all z-10 ${
                                isDone
                                  ? 'bg-primary border-primary text-white'
                                  : 'bg-background border-border text-muted-foreground'
                              } ${isCurrent ? 'shadow-md shadow-primary/30 scale-110' : ''}`}>
                                {cfg.icon}
                              </div>
                              <div className="text-center">
                                <p className={`text-xs font-bold ${isDone ? 'text-foreground' : 'text-muted-foreground'}`}>{step}</p>
                                <p className="text-[10px] text-muted-foreground hidden sm:block">{cfg.label}</p>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Items */}
              <Card className="border-border shadow-sm">
                <CardContent className="pt-6">
                  <h3 className="font-bold text-foreground mb-4">Order Items ({order.items.length} item{order.items.length !== 1 ? 's' : ''})</h3>
                  <div className="space-y-2">
                    {order.items.map((item, i) => (
                      <div key={i} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                            <IceCream className="h-4 w-4 text-primary" />
                          </div>
                          <span className="text-sm font-medium text-foreground">Product #{item.product_id}</span>
                        </div>
                        <Badge variant="secondary" className="text-xs">Qty: {item.quantity}</Badge>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 pt-4 border-t border-border flex justify-between">
                    <span className="font-bold text-foreground">Total</span>
                    <span className="font-black text-primary text-lg">₨{order.total.toLocaleString()}</span>
                  </div>
                </CardContent>
              </Card>

              {/* CTA */}
              <div className="flex gap-3">
                <Link href="/shop" className="flex-1">
                  <Button variant="outline" className="w-full">Continue Shopping</Button>
                </Link>
                <Button
                  className="flex-1 rb-bg-anim border-0 text-white font-bold hover:opacity-90"
                  onClick={() => {
                    const msg = `Hi! I'm inquiring about my Creamy Corner order #${order.id.substring(0, 8)}. Status: ${order.status}. Total: Rs${order.total.toLocaleString()}.`
                    window.open(`https://wa.me/923114782290?text=${encodeURIComponent(msg)}`, '_blank')
                  }}
                >
                  💬 WhatsApp Support
                </Button>
              </div>
            </div>
          ) : (
            <Card className="border-border shadow-sm">
              <CardContent className="py-16 text-center">
                <div className="text-5xl mb-4">🔍</div>
                <p className="font-bold text-foreground text-lg">Order not found</p>
                <p className="text-muted-foreground text-sm mt-2 mb-6">
                  No order matched "<span className="font-mono">{query}</span>". Check your Order ID, phone, or email.
                </p>
                <Button variant="outline" onClick={() => { setSearched(false); setQuery('') }}>Try Again</Button>
              </CardContent>
            </Card>
          )
        )}

        {/* Help */}
        {!searched && (
          <div className="text-center text-sm text-muted-foreground">
            <p>Need help? Contact us on WhatsApp: <span className="font-semibold text-foreground">0311-4782290</span></p>
          </div>
        )}
      </main>
    </div>
  )
}
