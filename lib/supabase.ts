export const supabaseUrl = 'https://glvwigmaalustyxudijz.supabase.co'
export const supabaseAnonKey = 'sb_publishable_GDminjQUEXrk-ofnxHSd2g_zgR3T1hr'

const SUPABASE_URL = 'https://glvwigmaalustyxudijz.supabase.co'
const SUPABASE_ANON_KEY = 'sb_publishable_GDminjQUEXrk-ofnxHSd2g_zgR3T1hr'

export function createClientServer() {
  const cookieStore = cookies()

  return createServerClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          cookieStore.set({ name, value, ...options })
        },
        remove(name: string, options: CookieOptions) {
          cookieStore.set({ name, value: '', ...options })
        },
      },
    }
  )
}

export const createClientBrowser = () => createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
  {
    auth: {
      storageKey: '__sb_public_key__',
    },
  }
)

