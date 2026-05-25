"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useSupabase } from '@/hooks/use-supabase'
import { toast } from 'sonner'

import { Product } from '@/lib/types/product'

type ProductInput = Omit<Product, 'id' | 'created_at'>

interface AddProductModalProps {
  onProductAdded?: () => void
}

export function AddProductModal({ onProductAdded }: AddProductModalProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<ProductInput>({
    name: '',
    description: '',
    price: 1000,
    image_path: '',
    stock: 100,
    rating: 4.5,
    category: 'Classic',
  })
  const supabase = useSupabase()

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'price' || name === 'stock' || name === 'rating' 
        ? parseFloat(value) 
        : value,
    }))
  }

  const handleCategoryChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      category: value as Product['category'],
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name || !formData.description || !formData.image_path) {
      toast.error('Please fill in all required fields')
      return
    }

    if (formData.price < 300 || formData.price > 2500) {
      toast.error('Price must be between Rs300 and Rs2500')
      return
    }

    setLoading(true)
    try {
      const { error } = await supabase
        .from('products')
        .insert([formData])

      if (error) {
        toast.error('Failed to add product: ' + error.message)
        return
      }

      toast.success('Product added successfully!')
      setFormData({
        name: '',
        description: '',
        price: 1000,
        image_path: '',
        stock: 100,
        rating: 4.5,
        category: 'Classic',
      } as ProductInput)
      setOpen(false)
      onProductAdded?.()
    } catch (error) {
      toast.error('Error adding product')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="rb-bg-anim text-white font-bold border-0 shadow-md hover:opacity-90">
          + Add Product
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Product</DialogTitle>
          <DialogDescription>
            Add a new ice cream product to your inventory
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Product Name *</Label>
            <Input
              id="name"
              name="name"
              placeholder="e.g., Mango Kulfi"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="e.g., Rich creamy kulfi made with Alphonso mangoes"
              value={formData.description}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="price">Price (Rs) *</Label>
              <Input
                id="price"
                name="price"
                type="number"
                min="800"
                max="2500"
                value={formData.price}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="stock">Stock</Label>
              <Input
                id="stock"
                name="stock"
                type="number"
                min="0"
                value={formData.stock}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="rating">Rating</Label>
              <Input
                id="rating"
                name="rating"
                type="number"
                min="0"
                max="5"
                step="0.1"
                value={formData.rating}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <Label htmlFor="category">Category *</Label>
              <Select value={formData.category} onValueChange={handleCategoryChange}>
                <SelectTrigger id="category">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Classic">Classic</SelectItem>
                  <SelectItem value="Fruit">Fruit</SelectItem>
                  <SelectItem value="Nut">Nut</SelectItem>
                  <SelectItem value="Chocolate">Chocolate</SelectItem>
                  <SelectItem value="Cookies">Cookies</SelectItem>
                  <SelectItem value="Cheesecake">Cheesecake</SelectItem>
                  <SelectItem value="Sorbet">Sorbet</SelectItem>
                  <SelectItem value="Kids">Kids</SelectItem>
                  <SelectItem value="Mint">Mint</SelectItem>
                  <SelectItem value="Premium">Premium</SelectItem>
                  <SelectItem value="Specialty">Specialty</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="image_path">Image Path *</Label>
            <Input
              id="image_path"
              name="image_path"
              placeholder="e.g., 1. Vanilla Ice Cream.png"
              value={formData.image_path}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="flex gap-2 justify-end pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="rb-bg-anim text-white font-bold border-0 hover:opacity-90">
              {loading ? 'Adding...' : '🍦 Add Product'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
