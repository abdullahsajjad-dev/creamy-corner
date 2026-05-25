'use client'

import { useEffect, useState } from 'react'
import { useSupabase } from '@/hooks/use-supabase'

export default function DebugPage() {
  const [supabaseData, setSupabaseData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const supabase = useSupabase()

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const { data, error: fetchError } = await supabase
          .from('products')
          .select('*')
          .order('id', { ascending: true })

        if (fetchError) {
          setError(`Supabase Error: ${fetchError.message}`)
        } else {
          setSupabaseData(data || [])
          console.log('Supabase Data:', data)
        }
      } catch (err) {
        setError(`Fetch Error: ${String(err)}`)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [supabase])

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">🔍 Supabase Debug</h1>

      {loading && <p className="text-lg">Loading...</p>}
      {error && <p className="text-red-600 text-lg font-bold">{error}</p>}

      <div className="bg-blue-100 p-4 rounded mb-4">
        <p className="font-bold text-lg">
          Total Products in Supabase: <span className="text-blue-600">{supabaseData.length}</span>
        </p>
      </div>

      <div className="overflow-auto max-h-[600px]">
        <table className="w-full border-collapse border border-gray-300">
          <thead className="bg-gray-200 sticky top-0">
            <tr>
              <th className="border p-2">ID</th>
              <th className="border p-2">Name</th>
              <th className="border p-2">Price</th>
              <th className="border p-2">Image Path</th>
              <th className="border p-2">Stock</th>
              <th className="border p-2">Rating</th>
              <th className="border p-2">Category</th>
            </tr>
          </thead>
          <tbody>
            {supabaseData.map((product, idx) => (
              <tr key={idx} className="hover:bg-gray-100">
                <td className="border p-2 text-sm">{product.id}</td>
                <td className="border p-2 text-sm font-semibold">{product.name}</td>
                <td className="border p-2 text-sm">₨{product.price}</td>
                <td className="border p-2 text-xs">
                  {product.image_path ? (
                    <span className="text-blue-600 break-all">{product.image_path.substring(0, 50)}...</span>
                  ) : (
                    <span className="text-red-600">NO IMAGE PATH</span>
                  )}
                </td>
                <td className="border p-2 text-sm">{product.stock}</td>
                <td className="border p-2 text-sm">{product.rating}</td>
                <td className="border p-2 text-sm">{product.category}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {supabaseData.length === 0 && !loading && !error && (
        <div className="bg-red-100 border border-red-400 text-red-700 p-4 rounded mt-4">
          <p className="font-bold">❌ No products found in Supabase!</p>
          <p>Check your Supabase connection and make sure the products table has data.</p>
        </div>
      )}
    </div>
  )
}
