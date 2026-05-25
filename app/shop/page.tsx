'use client'

import { useEffect, useState } from 'react'
import { useSupabase } from '@/hooks/use-supabase'
import { ProductCard } from '@/components/products/product-card'
import Recommendations from '@/components/products/recommendations'
import { BannerCarousel } from '@/components/shop/banner-carousel'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Search, Grid3x3, List } from 'lucide-react'

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

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [sortBy, setSortBy] = useState('rating')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [filterByRating, setFilterByRating] = useState(false)
  const [filterByTopSeller, setFilterByTopSeller] = useState(false)
  const supabase = useSupabase()

  // Get unique categories from products - more defensive
  const categories = loading 
    ? ['all']
    : ['all', ...Array.from(new Set(products
        .map(p => p.category?.trim?.())
        .filter((cat): cat is string => Boolean(cat) && typeof cat === 'string')
      )).sort()]

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true)
      try {
        console.log('Fetching products from Supabase...')
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .order('rating', { ascending: false })

        console.log('Fetch response:', { dataLength: data?.length, error })

        if (error) {
          console.error('Error fetching products:', error)
        } else {
          console.log('Products fetched:', data?.length)
          setProducts(data || [])
        }
      } catch (error) {
        console.error('Error:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [supabase])

  useEffect(() => {
    let filtered = [...products]

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter((p) => p.category?.trim() === selectedCategory.trim())
    }

    // Filter by high rating (4.8+)
    if (filterByRating) {
      filtered = filtered.filter((p) => p.rating >= 4.8)
    }

    // Filter by top seller (lowest stock = more sold)
    if (filterByTopSeller) {
      filtered = filtered.filter((p) => p.stock <= 100)
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Sort
    if (sortBy === 'price-low') {
      filtered.sort((a, b) => a.price - b.price)
    } else if (sortBy === 'price-high') {
      filtered.sort((a, b) => b.price - a.price)
    } else if (sortBy === 'rating') {
      filtered.sort((a, b) => b.rating - a.rating)
    }

    setFilteredProducts(filtered)
    console.log('Filtered products:', {
      selectedCategory,
      filterByRating,
      filterByTopSeller,
      totalProducts: products.length,
      filteredCount: filtered.length,
      categories: [...new Set(products.map(p => p.category))]
    })
  }, [products, searchQuery, selectedCategory, sortBy, filterByRating, filterByTopSeller])

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-secondary/20">
      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-2">
          <h1 className="text-5xl font-black rb-text">🍦 Ice Cream Paradise</h1>
          <p className="text-muted-foreground mt-2 text-lg">
            Discover premium ice cream flavors handcrafted in Lahore
          </p>
        </div>

        {/* Banner Carousel */}
        <BannerCarousel />

        {/* Top Recommendations */}
        <div className="mb-16">
          <h2 className="text-3xl font-black rb-text">⭐ Top Rated Picks</h2>
          <Recommendations type="top-rated" limit={4} />
        </div>

        {/* Advanced Filters */}
        <div className="mb-8 bg-secondary/50 rounded-xl p-6 border border-border">
          <h3 className="font-bold text-lg mb-4 text-foreground">Find Your Perfect Flavor</h3>
          
          {/* Category Filter Dropdown */}
          <div className="mb-5 pb-5 border-b border-border/50">
            <p className="text-sm font-semibold text-muted-foreground mb-3">📂 Shop by Category</p>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="h-11 bg-gradient-to-r from-primary/10 to-pink-500/10 border-primary/30 hover:border-primary/50">
                <SelectValue placeholder="Choose a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat === 'all' ? '🌟 All Categories' : `🍦 ${cat}`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Search and Filters */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {/* Search */}
            <div className="relative col-span-full lg:col-span-2">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search by flavor name or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-11 text-base"
              />
            </div>

            {/* Sort */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="h-11">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rating">⭐ Highest Rated</SelectItem>
                <SelectItem value="price-low">💰 Price: Low to High</SelectItem>
                <SelectItem value="price-high">💎 Price: High to Low</SelectItem>
              </SelectContent>
            </Select>

            {/* High Rating Filter */}
            <Button
              onClick={() => setFilterByRating(!filterByRating)}
              className={`h-11 font-semibold transition-all ${
                filterByRating
                  ? 'bg-gradient-to-r from-yellow-500 to-amber-500 text-white shadow-md'
                  : 'bg-secondary hover:bg-secondary/80 text-foreground border border-border'
              }`}
            >
              {filterByRating ? '⭐ Highly Rated' : '☆ All Ratings'}
            </Button>

            {/* Top Seller Filter */}
            <Button
              onClick={() => setFilterByTopSeller(!filterByTopSeller)}
              className={`h-11 font-semibold transition-all ${
                filterByTopSeller
                  ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-md'
                  : 'bg-secondary hover:bg-secondary/80 text-foreground border border-border'
              }`}
            >
              {filterByTopSeller ? '🔥 Top Sellers' : '⚡ Trending'}
            </Button>

            {/* View Toggle */}
            <div className="flex gap-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="icon"
                onClick={() => setViewMode('grid')}
                className="flex-1"
              >
                <Grid3x3 className="h-5 w-5" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="icon"
                onClick={() => setViewMode('list')}
                className="flex-1"
              >
                <List className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Results Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black rb-text">
              {filteredProducts.length} Flavors Available
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              {selectedCategory !== 'all' && `Category: ${selectedCategory} •`} Sorted by {sortBy === 'rating' ? 'rating' : 'price'}
            </p>
          </div>
        </div>

        {/* Products Grid/List */}
        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block">
              <div className="text-5xl mb-4">🍦</div>
              <p className="text-muted-foreground text-lg">Loading delicious flavors...</p>
            </div>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-20 bg-secondary/30 rounded-2xl border-2 border-dashed border-border">
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-muted-foreground text-lg font-medium">No flavors found!</p>
            <p className="text-muted-foreground mt-2">Try different filters or search terms</p>
            <Button 
              onClick={() => {
                setSearchQuery('')
                setSelectedCategory('all')
                setSortBy('rating')
              }}
              className="mt-6"
            >
              Reset Filters
            </Button>
          </div>
        ) : (
          <div className={viewMode === 'grid' ? "grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "space-y-3"}>
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {/* Recently Added Section */}
        <div className="mt-20 pt-12 border-t border-border">
          <h2 className="text-3xl font-black rb-text">🆕 Fresh Arrivals</h2>
          <Recommendations type="recently-added" limit={4} />
        </div>

        {/* Call to Action */}
        <div className="mt-16 mb-8 rb-bg-anim rounded-2xl p-8 text-white text-center shadow-2xl">
          <h3 className="text-3xl font-bold mb-2">Special Offer!</h3>
          <p className="text-lg opacity-90 mb-4">Subscribe to our newsletter for exclusive discounts</p>
          <div className="flex gap-2 max-w-md mx-auto">
            <Input
              type="email"
              placeholder="Enter your email..."
              className="bg-white/20 border-white/30 text-white placeholder:text-white/50"
            />
            <Button className="bg-white text-primary hover:bg-gray-100 font-bold px-6">
              Subscribe
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}
