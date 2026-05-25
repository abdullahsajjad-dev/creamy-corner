// Load environment variables from .env.local
import * as fs from 'fs'
import * as path from 'path'

const envPath = path.resolve(process.cwd(), '.env.local')
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8')
  const lines = envContent.split('\\n')
  lines.forEach(line => {
    if (line.trim() && !line.startsWith('#')) {
      const [key, value] = line.split('=')
      if (key && value) {
        process.env[key.trim()] = value.trim()
      }
    }
  })
}

import { createClient } from '@supabase/supabase-js'

// Inline data to avoid ESM issues
const products = [
  { id: 1, price: 1200 },
  { id: 2, price: 1500 },
  { id: 3, price: 950 },
  { id: 4, price: 1800 },
  { id: 5, price: 850 },
  { id: 6, price: 900 },
  { id: 7, price: 1100 },
  { id: 8, price: 1300 },
  { id: 9, price: 1400 },
  { id: 10, price: 1250 },
  // add more for variety, min-max prices
  { id: 11, price: 1150 },
  { id: 12, price: 1600 },
  { id: 13, price: 1100 },
  { id: 14, price: 1700 },
  { id: 15, price: 800 },
  { id: 16, price: 1000 },
  { id: 17, price: 2000 },
  { id: 18, price: 950 },
  { id: 19, price: 1350 },
  { id: 20, price: 1300 },
  { id: 21, price: 2200 },
  { id: 22, price: 1900 },
  { id: 23, price: 1400 },
  { id: 24, price: 1250 },
  { id: 25, price: 2100 },
];

const pakistaniCustomers = [
  { name: "Ahmed Hassan", email: "ahmed.hassan@email.com" },
  { name: "Fatima Khan", email: "fatima.khan@email.com" },
  { name: "Muhammad Ali", email: "m.ali@email.com" },
  { name: "Zainab Malik", email: "zainab.malik@email.com" },
  { name: "Hassan Raza", email: "hassan.raza@email.com" },
  { name: "Ayesha Ahmed", email: "ayesha.ahmed@email.com" },
  { name: "Omar Farooq", email: "omar.farooq@email.com" },
  { name: "Hira Abbas", email: "hira.abbas@email.com" },
  { name: "Ali Nawaz", email: "ali.nawaz@email.com" },
  { name: "Maria Yasmin", email: "maria.yasmin@email.com" },
  // add more to 33 if needed, but 10+ for demo
  { name: "Bilal Sheikh", email: "bilal.sheikh@email.com" },
];

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const supabase = createClient(supabaseUrl, supabaseAnonKey)

function generateOrderItems() {
  const numItems = Math.floor(Math.random() * 3) + 1
  const items = []
  for (let i = 0; i < numItems; i++) {
    const product = products[Math.floor(Math.random() * products.length)]
    const quantity = Math.floor(Math.random() * 3) + 1
    items.push({ product_id: product.id, quantity, price: product.price })
  }
  return items
}

async function seedOrders() {
  console.log('🌱 Seeding customer orders...')
  
  await supabase.from('orders').delete()
  
  const orders = []
  const recentDays = 180
  let orderCounter = 0
  
  pakistaniCustomers.forEach(customer => {
    const numOrders = Math.floor(Math.random() * 10) + 1
    
    for (let i = 0; i < numOrders; i++) {
      const daysAgo = Math.floor(Math.random() * recentDays)
      const orderDate = new Date(Date.now() - daysAgo * 86400000).toISOString()
      
      const items = generateOrderItems()
      const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
      const total = Math.max(200, Math.min(2500, subtotal))
      
      // Use capitalized values to match the UI and database constraint
      const statusOptions = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled']
      const randomStatus = statusOptions[Math.floor(Math.random() * statusOptions.length)]
      
      orders.push({
        // Ensure `id` is a UUID (your DB error indicates `orders.id` is uuid)
        id: (globalThis as any).crypto?.randomUUID
          ? (globalThis as any).crypto.randomUUID()
          : `order_${customer.email.replace(/[^a-zA-Z0-9]/g, '_')}_${++orderCounter}`,
        customer_email: customer.email,
        customer_name: customer.name,
        items,
        total,
        created_at: orderDate,
        status: randomStatus
      })
    }
  })
  
  const { data, error } = await supabase.from('orders').upsert(orders, { onConflict: 'id' }).select()
  
  if (error) {
    console.error('❌ Error:', error)
    process.exit(1)
  }
  
  console.log(`✅ Seeded ${data?.length || orders.length} orders!`)
  
  const { data: agg } = await supabase.from('orders').select('customer_email, total')
  
  const totals = {}
  agg.forEach(o => {
    totals[o.customer_email] = (totals[o.customer_email] || 0) + o.total
  })
  
  const allInRange = Object.values(totals).every(t => t >= 200 && t <= 2500)
  console.log('✅ Ranges OK:', allInRange)
  console.log('Avg total spent:', Math.round(Object.values(totals).reduce((a,b) => a + b, 0) / pakistaniCustomers.length))
}

seedOrders()
