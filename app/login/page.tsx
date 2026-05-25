'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { IceCream, Eye, EyeOff, Lock, Mail, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    await new Promise(r => setTimeout(r, 900))
    if (email === 'admin@creamycorner.pk' && password === 'admin123') {
      if (typeof window !== 'undefined') localStorage.setItem('cc_admin', '1')
      toast.success('Welcome back! Redirecting to dashboard...')
      setTimeout(() => router.push('/'), 600)
    } else {
      toast.error('Invalid email or password')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left: Branding Panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-rose-500 via-pink-500 to-orange-400 flex-col justify-between p-12 text-white">
        {/* Background decorative circles */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />
        <div className="absolute top-1/2 left-1/2 w-32 h-32 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2" />

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm">
            <IceCream className="h-7 w-7 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-black">Creamy Corner</h2>
            <p className="text-sm text-white/80">Business Management Portal</p>
          </div>
        </div>

        {/* Center Content */}
        <div className="relative z-10 space-y-6">
          <div className="text-7xl">🍦</div>
          <h1 className="text-5xl font-black leading-tight">
            Manage Your<br />
            <span className="text-white/90">Ice Cream</span><br />
            Business
          </h1>
          <p className="text-lg text-white/80 max-w-sm">
            Track orders, monitor sales, manage inventory, and understand your customers — all in one place.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mt-8">
            {[
              { label: 'Products', value: '67' },
              { label: 'Orders', value: '34+' },
              { label: 'Rating', value: '4.8★' },
            ].map(stat => (
              <div key={stat.label} className="text-center bg-white/10 backdrop-blur-sm rounded-xl p-3">
                <p className="text-2xl font-black">{stat.value}</p>
                <p className="text-xs text-white/70">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="relative z-10">
          <p className="text-sm text-white/60">© 2025 Creamy Corner · Model Town, Lahore</p>
        </div>
      </div>

      {/* Right: Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-sm space-y-8">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
              <IceCream className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-black text-foreground">Creamy Corner</span>
          </div>

          <div>
            <h2 className="text-3xl font-black text-foreground">Sign in</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Enter your admin credentials to access the dashboard
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-semibold">Email address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@creamycorner.pk"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="pl-10 h-11"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-semibold">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="pl-10 pr-10 h-11"
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="rounded border-border" />
                <span className="text-muted-foreground">Remember me</span>
              </label>
              <button type="button" className="text-primary hover:underline font-medium">
                Forgot password?
              </button>
            </div>

            <Button
              type="submit"
              className="w-full h-11 font-bold text-base rb-bg-anim border-0 text-white hover:opacity-90"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  Sign In <ArrowRight className="h-4 w-4" />
                </span>
              )}
            </Button>
          </form>

          {/* Demo hint */}
          <div className="rounded-xl bg-secondary/60 border border-border p-4 space-y-1">
            <p className="text-xs font-semibold text-foreground">Demo Credentials</p>
            <p className="text-xs text-muted-foreground">Email: <span className="font-mono text-foreground">admin@creamycorner.pk</span></p>
            <p className="text-xs text-muted-foreground">Password: <span className="font-mono text-foreground">admin123</span></p>
          </div>

          <p className="text-center text-xs text-muted-foreground">
            Customer?{' '}
            <a href="/shop" className="text-primary font-semibold hover:underline">
              Browse our shop →
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
