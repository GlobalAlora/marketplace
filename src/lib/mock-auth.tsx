'use client'

// Shim de compatibilidad — delega a AuthProvider real (Supabase).
// Los componentes que importan de aquí no necesitan cambios.
import { AuthProvider, useAuth as useRealAuth, type AuthUser } from '@/lib/supabase/AuthProvider'
import type { ReactNode } from 'react'

export type MockUser = AuthUser

export function MockAuthProvider({ children }: { children: ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>
}

export function useAuth() {
  const { user, signOut } = useRealAuth()
  return {
    user,
    setUser: (_u: MockUser | null) => { if (!_u) signOut() },
    isLoggedIn: !!user,
  }
}
