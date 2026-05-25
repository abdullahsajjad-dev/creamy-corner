import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Convert Supabase storage image_path to public URL
 * @param imagePath - File name or path in the 'product-images' bucket
 * @returns Public URL to the image in Supabase storage
 */
export function getProductImageUrl(imagePath: string): string {
  if (!imagePath) return '/placeholder.png'

  // Already a full URL
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) return imagePath

  // Some DB rows may store paths like "/file.png"; storage APIs expect "file.png".
  const normalizedPath = imagePath.replace(/^\/+/, '')

  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
    'https://glvwigmaalustyxudijz.supabase.co'

  // NOTE: Your bucket is "product-image" (not "product-images").
  // Also, this app likely uses a PRIVATE bucket, so we can’t rely on /public/ URLs.
  // Best-effort: try to build the public URL first (works only if bucket is public).
  const publicUrl = `${supabaseUrl}/storage/v1/object/public/product-image/${encodeURIComponent(normalizedPath)}`

  return publicUrl
}

