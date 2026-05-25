export type Product = {
  id: number
  name: string
  description: string
  price: number // Integer in PKR (Pakistani Rupees)
  image_path: string // File name/path in Supabase storage bucket
  stock: number // Integer >= 0
  rating: number // Decimal(3,1) - 0.0 to 5.0 with one decimal place
  category: 'Classic' | 'Fruit' | 'Nut' | 'Chocolate' | 'Cookies' | 'Cheesecake' | 'Sorbet' | 'Kids' | 'Mint' | 'Premium' | 'Specialty'
  created_at: string
}
