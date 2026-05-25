'use client'

import { useEffect, useState } from 'react'
import { useSupabase } from '@/hooks/use-supabase'

export default function DebugConnectionPage() {
  const [status, setStatus] = useState<string>('Initializing...')
  const [allData, setAllData] = useState<any>(null)
  const supabase = useSupabase()

  useEffect(() => {
    const testConnection = async () => {
      try {
        setStatus('Testing Supabase connection...')
        
        // Test with a simple count first
        const { count, error: countError } = await supabase
          .from('products')
          .select('id', { count: 'exact', head: true })

        console.log('Count result:', { count, error: countError })

        if (countError) {
          setStatus(`Count Error: ${countError.message}`)
          return
        }

        setStatus(`Found ${count} products in database`)

        // Now fetch all data
        const { data, error: dataError } = await supabase
          .from('products')
          .select('*')
          .order('id')

        console.log('Data result:', { dataLength: data?.length, error: dataError })

        if (dataError) {
          setStatus(`Data Error: ${dataError.message}`)
          return
        }

        setAllData(data)
        setStatus(`✅ Successfully fetched ${data?.length || 0} products`)
      } catch (err) {
        console.error('Exception:', err)
        setStatus(`Exception: ${String(err)}`)
      }
    }

    testConnection()
  }, [supabase])

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-4xl font-bold mb-6">🔍 Supabase Connection Debug</h1>

      <div className="bg-blue-100 border-2 border-blue-400 p-4 rounded mb-6">
        <p className="text-xl font-bold">{status}</p>
      </div>

      {allData && allData.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-4">Product Data: {allData.length} items</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300 text-sm">
              <thead className="bg-gray-300 sticky top-0">
                <tr>
                  <th className="border p-2">ID</th>
                  <th className="border p-2">Name</th>
                  <th className="border p-2">Price</th>
                  <th className="border p-2">Rating</th>
                  <th className="border p-2">Stock</th>
                  <th className="border p-2">Category</th>
                  <th className="border p-2">Image URL</th>
                </tr>
              </thead>
              <tbody>
                {allData.slice(0, 20).map((p, i) => (
                  <tr key={i} className="hover:bg-gray-100">
                    <td className="border p-2">{p.id}</td>
                    <td className="border p-2 font-semibold">{p.name}</td>
                    <td className="border p-2">₨{p.price}</td>
                    <td className="border p-2">⭐ {p.rating}</td>
                    <td className="border p-2">{p.stock}</td>
                    <td className="border p-2">{p.category}</td>
                    <td className="border p-2 text-xs truncate max-w-[200px]">
                      {p.image_path?.substring(0, 40)}...
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {allData.length > 20 && (
            <p className="mt-4 font-semibold">... and {allData.length - 20} more products</p>
          )}
        </div>
      )}

      {allData && allData.length === 0 && (
        <div className="bg-red-100 border-2 border-red-400 p-4 rounded">
          <p className="text-lg font-bold">❌ No products found</p>
        </div>
      )}
    </div>
  )
}
