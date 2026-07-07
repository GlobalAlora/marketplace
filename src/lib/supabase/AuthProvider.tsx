'use client'

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { createClient } from './client'
import type { Role } from '@/types'

export interface AuthUser {
  id: string
  email: string
  nombre: string
  apellido: string
  role: Role
  avatar_url?: string
  logo_agencia?: string
}

interface AuthContextType {
  user: AuthUser | null
  loading: boolean
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signOut: async () => {},
})

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()

    async function loadProfile(userId: string, email: string) {
      const { data } = await supabase
        .from('profiles')
        .select('id, nombre, apellido, role, avatar_url, logo_agencia')
        .eq('id', userId)
        .single()

      if (data) {
        setUser({
          id: data.id, email,
          nombre: data.nombre, apellido: data.apellido, role: data.role,
          avatar_url: data.avatar_url ?? undefined,
          logo_agencia: data.logo_agencia ?? undefined,
        })
      }
    }

    // Check current session on mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        loadProfile(session.user.id, session.user.email ?? '').finally(() => setLoading(false))
      } else {
        setLoading(false)
      }
    })

    // Listen for auth changes (login / logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        loadProfile(session.user.id, session.user.email ?? '')
      } else {
        setUser(null)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  async function signOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    setUser(null)
    window.location.href = '/'
  }

  return (
    <AuthContext.Provider value={{ user, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
