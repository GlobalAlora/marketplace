'use client'

import { createContext, useContext, useState, type ReactNode } from 'react'

export interface MockUser {
  nombre: string
  apellido: string
  email: string
}

interface AuthContextType {
  user: MockUser | null
  setUser: (user: MockUser | null) => void
  isLoggedIn: boolean
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  setUser: () => {},
  isLoggedIn: false,
})

export function MockAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<MockUser | null>(null)
  return (
    <AuthContext.Provider value={{ user, setUser, isLoggedIn: !!user }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
