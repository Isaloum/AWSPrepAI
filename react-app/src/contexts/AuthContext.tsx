import { createContext, useContext, useEffect, useState } from 'react'
import type { User } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'

interface AuthContextType {
  user: User | null
  loading: boolean
  isPremium: boolean
  isFullAccess: boolean
  tier: 'free' | 'monthly' | 'yearly' | 'lifetime'
  signOut: () => Promise<void>
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  isPremium: false,
  isFullAccess: false,
  tier: 'free',
  signOut: async () => {},
  refreshUser: async () => {},
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  const getTier = (u: User | null): 'free' | 'monthly' | 'yearly' | 'lifetime' => {
    const t = u?.user_metadata?.tier
    if (t === 'monthly' || t === 'yearly' || t === 'lifetime') return t
    return 'free'
  }

  const refreshUser = async () => {
    const { data } = await supabase.auth.getUser()
    setUser(data.user)
  }

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null)
      setLoading(false)
    })
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })
    return () => listener.subscription.unsubscribe()
  }, [])

  const tier = getTier(user)
  const isPremium = tier !== 'free'
  const isFullAccess = tier === 'yearly' || tier === 'lifetime'

  const signOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, isPremium, isFullAccess, tier, signOut, refreshUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
