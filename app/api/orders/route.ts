import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '../../../lib/supabase-client'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { customer_email, customer_name, phone, address, items, total } = body

    // Validate
    if (!customer_email || !items || items.length === 0) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Check products exist and calculate total (security)
    let calculatedTotal = 0
    const productsToUpdate = []
    
    for (const item of items) {
      const { data: product } = await supabase
        .from('products')
        .select('price, stock, name')
        .eq('id', item.product_id)
        .single()
      
      if (!product) {
        return NextResponse.json({ error: `Product ${item.product_id} not found` }, { status: 404 })
      }

      // Check stock availability
      if (product.stock < (item.quantity || 1)) {
        return NextResponse.json({ 
          error: `Insufficient stock for ${product.name}. Available: ${product.stock}, Requested: ${item.quantity || 1}` 
        }, { status: 400 })
      }

      calculatedTotal += product.price * (item.quantity || 1)
      productsToUpdate.push({
        id: item.product_id,
        quantity: item.quantity || 1,
        name: product.name
      })
    }

    if (Math.abs(calculatedTotal - total) > 10) { // Allow small rounding
      return NextResponse.json({ error: 'Invalid total' }, { status: 400 })
    }

    // Create order
    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .insert({ 
        customer_email, 
        customer_name, 
        phone, 
        address,
        items,
        total,
        status: 'Pending'
      })
      .select()
      .single()

    if (orderError) throw orderError

    // Deduct stock from products
    for (const product of productsToUpdate) {
      const { error: updateError } = await supabase
        .from('products')
        .update({ stock: supabase.rpc('decrement_stock', { id: product.id, amount: product.quantity }) })
        .eq('id', product.id)
      
      if (updateError) {
        // Rollback order if stock update fails
        await supabase.from('orders').delete().eq('id', orderData.id)
        throw new Error(`Failed to update stock for product ${product.id}`)
      }
    }

    // Create order notification
    const itemNames = productsToUpdate.map(p => p.name).join(', ')
    const { error: notifError } = await supabase
      .from('notifications')
      .insert({
        message: `New order from ${customer_name || customer_email}: ${itemNames}`,
        type: 'order',
        read: false
      })

    if (notifError) {
      console.error('Failed to create notification:', notifError)
      // Don't fail the order if notification fails
    }

    return NextResponse.json({ order: orderData, success: true })

  } catch (error: any) {
    console.error('Order creation error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

