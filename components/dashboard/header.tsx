"use client"

import { Bell, Search, X, ShoppingCart, Sun, Moon, Package } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import { useSupabase } from "@/hooks/use-supabase"
import { useCart } from "@/hooks/use-cart"
import { useTheme } from "next-themes"
import Link from "next/link"

type Notification = {
  id: string
  message: string
  type: 'order' | 'stock' | 'system'
  created_at: string
  read: boolean
}

export function Header() {
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const supabase = useSupabase()
  const { items: cartItems } = useCart()
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const { data } = await supabase
          .from('notifications')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(10)
        setNotifications(data || [])
      } catch {
        // notifications table may not exist
      }
    }
    fetchNotifications()
    const channel = supabase
      .channel('notifications')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'notifications' },
        (payload) => { setNotifications(prev => [payload.new as Notification, ...prev].slice(0, 10)) }
      )
      .subscribe()
    const interval = setInterval(fetchNotifications, 30000)
    return () => { channel.unsubscribe(); clearInterval(interval) }
  }, [supabase])

  const unreadCount = notifications.filter(n => !n.read).length

  const markRead = async (id: string) => {
    await supabase.from('notifications').update({ read: true }).eq('id', id)
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
  }

  return (
    <header className="sticky top-0 z-30 flex flex-col bg-background/95 border-b border-border backdrop-blur-sm">
      <div className="rb-strip h-0.5" />
      <div className="flex h-14 items-center justify-between px-4 md:px-6 gap-4">
        {/* Search */}
        <div className="flex flex-1 items-center gap-3 pl-12 md:pl-0">
          <div className="relative hidden w-full max-w-xs md:block">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search orders, products..."
              className="h-9 w-full bg-secondary/60 pl-9 text-sm border-0 focus-visible:ring-1"
            />
          </div>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-1">
          {/* Track Order */}
          <Link href="/track-order">
            <Button variant="ghost" size="sm" className="hidden md:flex gap-1.5 text-xs h-9 text-muted-foreground hover:text-foreground">
              <Package className="h-3.5 w-3.5" />
              Track Order
            </Button>
          </Link>

          {/* Cart */}
          <Link href="/cart">
            <Button variant="ghost" size="icon" className="relative h-9 w-9">
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
              {cartItems.length > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-white">
                  {cartItems.length}
                </span>
              )}
            </Button>
          </Link>

          {/* Notifications */}
          <div className="relative">
            <Button variant="ghost" size="icon" className="relative h-9 w-9" onClick={() => setNotificationsOpen(!notificationsOpen)}>
              <Bell className="h-4 w-4 text-muted-foreground" />
              {unreadCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-white">
                  {unreadCount}
                </span>
              )}
            </Button>
            {notificationsOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-card border border-border rounded-xl shadow-xl z-50 overflow-hidden">
                <div className="p-3 border-b border-border flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-foreground">Notifications</h3>
                  <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setNotificationsOpen(false)}>
                    <X className="h-3 w-3" />
                  </Button>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-8 text-center text-sm text-muted-foreground">No notifications</div>
                  ) : notifications.map((n) => (
                    <div key={n.id} className={`p-3 border-b border-border hover:bg-secondary/50 cursor-pointer transition-colors ${!n.read ? 'bg-primary/5' : ''}`} onClick={() => markRead(n.id)}>
                      <p className="text-xs text-foreground">{n.message}</p>
                      <p className="text-[10px] text-muted-foreground mt-1">{new Date(n.created_at).toLocaleDateString()}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Dark/Light Toggle */}
          {mounted && (
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              title="Toggle theme"
            >
              {theme === 'dark'
                ? <Sun className="h-4 w-4 text-amber-500" />
                : <Moon className="h-4 w-4 text-muted-foreground" />
              }
            </Button>
          )}

          <div className="hidden md:block h-6 w-px bg-border mx-1" />

          {/* Admin avatar */}
          <div className="hidden md:flex items-center gap-2.5">
            <div className="text-right">
              <p className="text-xs font-semibold text-foreground">Admin</p>
              <p className="text-[10px] text-muted-foreground">Creamy Corner</p>
            </div>
            <div className="flex h-8 w-8 items-center justify-center rounded-full rb-bg-anim text-xs font-black text-white shadow-sm">
              CC
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
