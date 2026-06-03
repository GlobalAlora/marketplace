import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'

export async function GET() {
  const cookieStore = await cookies()
  const allCookies = cookieStore.getAll()

  const supabaseCookies = allCookies.filter(c =>
    c.name.includes('sb-') || c.name.includes('supabase')
  )

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll() },
        setAll() {},
      },
    }
  )

  const { data: { user }, error: userError } = await supabase.auth.getUser()
  const { data: { session }, error: sessionError } = await supabase.auth.getSession()

  // Mismo createClient que usa el dashboard layout (con setAll + try/catch)
  const { createClient } = await import('@/lib/supabase/server')
  const layoutSupabase = await createClient()
  const { data: { user: layoutUser }, error: layoutUserError } = await layoutSupabase.auth.getUser()

  let profileData = null
  let profileError = null
  if (layoutUser) {
    const { data, error } = await layoutSupabase
      .from('profiles')
      .select('id, email, nombre, role')
      .eq('id', layoutUser.id)
      .single()
    profileData = data
    profileError = error?.message ?? null
  }

  return NextResponse.json({
    totalCookies: allCookies.length,
    supabaseCookies: supabaseCookies.map(c => ({
      name: c.name,
      valueLength: c.value.length,
    })),
    getUser: {
      userId: user?.id ?? null,
      email: user?.email ?? null,
      error: userError?.message ?? null,
    },
    getSession: {
      userId: session?.user?.id ?? null,
      expiresAt: session?.expires_at ?? null,
      error: sessionError?.message ?? null,
    },
    layoutClient: {
      userId: layoutUser?.id ?? null,
      error: layoutUserError?.message ?? null,
      profile: profileData,
      profileError,
    },
  })
}
