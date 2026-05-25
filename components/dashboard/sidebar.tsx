"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  IceCream,
  ShoppingCart,
  Users,
  Star,
  BarChart3,
  Menu,
  X,
  Store,
  LogOut,
  MapPin,
} from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"

const menuItems = [
  { name: "Dashboard",  href: "/",          icon: LayoutDashboard, color: "bg-rose-500"    },
  { name: "Products",   href: "/products",  icon: IceCream,         color: "bg-orange-500" },
  { name: "Orders",     href: "/orders",    icon: ShoppingCart,     color: "bg-amber-500"  },
  { name: "Customers",  href: "/customers", icon: Users,            color: "bg-emerald-500"},
  { name: "Ratings",    href: "/ratings",   icon: Star,             color: "bg-cyan-500"   },
  { name: "Analytics",  href: "/analytics", icon: BarChart3,        color: "bg-violet-500" },
]

export function Sidebar() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 md:hidden"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={cn(
          "fixed left-0 top-0 z-40 h-screen w-64 border-r border-sidebar-border bg-sidebar transition-transform duration-300 flex flex-col overflow-hidden shadow-sm",
          mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        {/* Top accent strip */}
        <div className="rb-strip h-1 w-full flex-shrink-0" />

        {/* Logo */}
        <div className="flex h-16 items-center gap-3 border-b border-sidebar-border px-5 flex-shrink-0">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl rb-bg-anim shadow-md">
            <IceCream className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-sm font-black text-sidebar-foreground">Creamy Corner</h1>
            <p className="text-[11px] text-muted-foreground flex items-center gap-1">
              <MapPin className="h-2.5 w-2.5" /> Model Town, Lahore
            </p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
          <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70">
            Main Menu
          </p>
          {menuItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-sm"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent/10 hover:text-sidebar-foreground"
                )}
              >
                <span className={cn("flex h-7 w-7 items-center justify-center rounded-md flex-shrink-0 text-white", item.color)}>
                  <item.icon className="h-3.5 w-3.5" />
                </span>
                {item.name}
                {isActive && (
                  <span className="ml-auto h-1.5 w-1.5 rounded-full bg-white/70" />
                )}
              </Link>
            )
          })}

          <div className="my-3 border-t border-sidebar-border" />
          <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70">
            Storefront
          </p>
          <Link
            href="/shop"
            onClick={() => setMobileOpen(false)}
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-sidebar-foreground/70 hover:bg-sidebar-accent/10 hover:text-sidebar-foreground transition-all duration-150"
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-md bg-pink-500 text-white flex-shrink-0">
              <Store className="h-3.5 w-3.5" />
            </span>
            Visit Shop
          </Link>
          <Link
            href="/track-order"
            onClick={() => setMobileOpen(false)}
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-sidebar-foreground/70 hover:bg-sidebar-accent/10 hover:text-sidebar-foreground transition-all duration-150"
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-md bg-teal-500 text-white flex-shrink-0">
              <ShoppingCart className="h-3.5 w-3.5" />
            </span>
            Track Orders
          </Link>
        </nav>

        {/* Footer */}
        <div className="border-t border-sidebar-border p-3 flex-shrink-0">
          <div className="flex items-center gap-3 rounded-lg bg-sidebar-accent/10 px-3 py-2.5 mb-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full rb-bg-anim text-xs font-black text-white shadow-sm flex-shrink-0">
              CC
            </div>
            <div className="flex-1 truncate">
              <p className="text-xs font-semibold text-sidebar-foreground">Admin User</p>
              <p className="truncate text-[10px] text-muted-foreground">admin@creamycorner.pk</p>
            </div>
          </div>
          <Link href="/login">
            <button className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-muted-foreground hover:text-destructive hover:bg-destructive/5 transition-colors">
              <LogOut className="h-3.5 w-3.5" />
              Sign Out
            </button>
          </Link>
        </div>
      </aside>
    </>
  )
}
