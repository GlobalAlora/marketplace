import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY

  // Skip auth logic until env vars are configured
  if (!supabaseUrl || supabaseUrl === 'placeholder' || !supabaseAnonKey || supabaseAnonKey === 'placeholder') {
    return NextResponse.next({ request })
  }

  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
        supabaseResponse = NextResponse.next({ request })
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options)
        )
      },
    },
  })

  const { data: { user } } = await supabase.auth.getUser()

  const { pathname } = request.nextUrl
  const isAuthPage    = pathname.startsWith('/auth/login') || pathname.startsWith('/auth/registro')
  const isPrimerAcceso = pathname.startsWith('/auth/primer-acceso')
  const isDashboard   = pathname.startsWith('/dashboard')
  const isAdmin       = pathname.startsWith('/admin')
  const isPanel       = pathname.startsWith('/panel')
  const isProtected   = isPanel || isAdmin || isPrimerAcceso

  if (isDashboard) {
    return NextResponse.redirect(new URL('/admin', request.url))
  }

  // Redirect unauthenticated users away from protected routes
  if (isProtected && !user) {
    const loginUrl = isPrimerAcceso
      ? '/auth/login'
      : `/auth/login?redirect=${encodeURIComponent(pathname)}`
    return NextResponse.redirect(new URL(loginUrl, request.url))
  }

  if (isProtected && user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role, activo, debe_cambiar_password, terminos_aceptados')
      .eq('id', user.id)
      .single()

    // Cuenta suspendida: cerrar sesión
    if (profile && profile.activo === false) {
      await supabase.auth.signOut()
      return NextResponse.redirect(new URL('/auth/login?suspendida=1', request.url))
    }

    // Solo admins pueden acceder a /admin
    if (isAdmin && (!profile || profile.role !== 'admin')) {
      return NextResponse.redirect(new URL('/auth/login', request.url))
    }

    // Primer acceso obligatorio — redirigir si hay pasos pendientes
    // (excepción: ya estamos en /auth/primer-acceso)
    if (!isPrimerAcceso && (profile?.debe_cambiar_password || !profile?.terminos_aceptados)) {
      return NextResponse.redirect(new URL('/auth/primer-acceso', request.url))
    }
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
