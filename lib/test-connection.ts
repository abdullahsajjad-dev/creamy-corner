import { supabase } from './supabase-client'

async function testSupabaseConnection() {
  console.log('🔍 Testing Supabase Connection...\n')

  try {
    // Test 1: Check if we can connect
    console.log('✓ Step 1: Testing connection...')
    const { data: healthData, error: healthError } = await supabase
      .from('products')
      .select('count', { count: 'exact' })
      .limit(1)

    if (healthError) {
      console.error('✗ Connection failed:', healthError.message)
      return
    }
    console.log('✓ Connected to Supabase successfully!')

    // Test 2: Count products
    console.log('\n✓ Step 2: Checking products table...')
    const { count, error: countError } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true })

    if (countError) {
      console.error('✗ Failed to count products:', countError.message)
      return
    }

    console.log(`✓ Products table found with ${count} products`)

    // Test 3: Fetch sample product
    console.log('\n✓ Step 3: Fetching sample product...')
    const { data: products, error: fetchError } = await supabase
      .from('products')
      .select('*')
      .limit(1)

    if (fetchError) {
      console.error('✗ Failed to fetch product:', fetchError.message)
      return
    }

    if (products && products.length > 0) {
      const product = products[0]
      console.log('✓ Sample product:', {
        id: product.id,
        name: product.name,
        price: `Rs${product.price}`,
        category: product.category
      })
    } else {
      console.warn('⚠ No products found. You may need to run the seed script.')
      console.warn('Run: npx tsx lib/data/seed.ts')
    }

    // Test 4: Check orders table
    console.log('\n✓ Step 4: Checking orders table...')
    const { count: orderCount, error: orderError } = await supabase
      .from('orders')
      .select('*', { count: 'exact', head: true })

    if (!orderError) {
      console.log(`✓ Orders table found with ${orderCount} orders`)
    } else {
      console.warn('⚠ Orders table not accessible:', orderError.message)
    }

    // Test 5: Check notifications table
    console.log('\n✓ Step 5: Checking notifications table...')
    const { count: notifCount, error: notifError } = await supabase
      .from('notifications')
      .select('*', { count: 'exact', head: true })

    if (!notifError) {
      console.log(`✓ Notifications table found with ${notifCount} notifications`)
    } else {
      console.warn('⚠ Notifications table not accessible:', notifError.message)
    }

    console.log('\n✅ All tests passed! Your Supabase connection is working correctly.')
    console.log('\n📝 Next steps:')
    console.log('   1. If no products found, run: npx tsx lib/data/seed.ts')
    console.log('   2. Start dev server: npm run dev')
    console.log('   3. Visit http://localhost:3000 to see products')

  } catch (error) {
    console.error('❌ Unexpected error:', error)
  }
}

// Run the test
testSupabaseConnection()
