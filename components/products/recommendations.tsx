'use client'

import { useEffect, useState } from 'react'
import { useSupabase } from '@/hooks/use-supabase'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ProductCard } from './product-card'
import { Skeleton } from '@/components/ui/skeleton'


interface Product {
  id: number
  name: string
  description: string
  price: number
  image_path: string
  stock: number
  rating: number
  category: string
  created_at: string
}

interface RecommendationsProps {
  type?:
    | 'top-rated'
    | 'recently-added'
    | 'popular-category'
    | 'all'
  category?: string
  limit?: number
  title?: string
}

export default function Recommendations({
  type = 'top-rated',
  category,
  limit = 4,
  title,
}: RecommendationsProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = useSupabase()

  useEffect(() => {
    const fetchRecommendations = async () => {
      setLoading(true)
      try {
        let query = supabase.from('products').select('*')

        // Filter by category if provided
        if (category) {
          query = query.eq('category', category)
        }

        // Determine sorting and limiting based on type
        if (type === 'top-rated') {
          query = query.order('rating', { ascending: false })
        } else if (type === 'recently-added') {
          query = query.order('created_at', { ascending: false })
        } else if (type === 'popular-category' && category) {
          query = query.order('rating', { ascending: false })
        }

        query = query.limit(limit)

        const { data, error } = await query

        if (error) {
          console.error('Error fetching recommendations:', error)
        } else {
          setProducts(data || [])
        }
      } catch (error) {
        console.error('Error fetching recommendations:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchRecommendations()
  }, [type, category, limit, supabase])

  const displayTitle =
    title ||
    (type === 'top-rated'
      ? '⭐ Top Rated'
      : type === 'recently-added'
        ? '✨ New Arrivals'
        : type === 'popular-category'
          ? `🎯 Popular in ${category}`
          : 'Recommendations')

  if (loading) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-foreground">{displayTitle}</h2>
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="h-48 w-full rounded-lg" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (products.length === 0) {
    return null
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-foreground">{displayTitle}</h2>
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  )
}
