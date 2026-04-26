import { createContext, useContext, useEffect, useRef, useState } from 'react'
import { getSession, signOut as cognitoSignOut, type AuthUser } from '../lib/cognito'

const IDLE_TIMEOUT   = 30 * 60 * 1000  // 30 min → auto-logout
const WARN_BEFORE    =      60 * 1000  // warn 60 s before logout

interface AuthContextType {
  user: AuthUser | null
  loading: boolean
  isPremium: boolean
  isFullAccess: boolean
  tier: 'free' | 'monthly' | 'bundle' | 'yearly' | 'lifetime'
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
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [showWarning, setShowWarning] = useState(false)
  const [countdown, setCountdown] = useState(60)

  const logoutTimer  = useRef<ReturnType<typeof setTimeout> | null>(null)
  const warnTimer    = useRef<ReturnType<typeof setTimeout> | null>(null)
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const refreshUser = async () => {
    const u = await getSession()
    setUser(u)
  }

  useEffect(() => {
    getSession().then((u) => {
      setUser(u)
      setLoading(false)
    })
  }, [])

  const tier = user?.tier ?? 'free'
  const isPremium = tier !== 'free'
  const isFullAccess = tier === 'yearly' || tier === 'lifetime'

  const signOut = async () => {
    clearAllTimers()
    cognitoSignOut()
    setUser(null)
    setShowWarning(false)
  }

  const clearAllTimers = () => {
    if (logoutTimer.current)  clearTimeout(logoutTimer.current)
    if (warnTimer.current)    clearTimeout(warnTimer.current)
    if (countdownRef.current) clearInterval(countdownRef.current)
  }

  const resetTimers = () => {
    if (!user) return
    clearAllTimers()
    setShowWarning(false)
    setCountdown(60)

    warnTimer.current = setTimeout(() => {
      setShowWarning(true)
      setCountdown(60)
      countdownRef.current = setInterval(() => {
        setCountdown(c => {
          if (c <= 1) { clearInterval(countdownRef.current!); return 0 }
          return c - 1
        })
      }, 1000)
    }, IDLE_TIMEOUT - WARN_BEFORE)

    logoutTimer.current = setTimeout(() => {
      signOut()
    }, IDLE_TIMEOUT)
  }

  // Start timers when user logs in; clear when logged out
  useEffect(() => {
    if (user) {
      resetTimers()
      const events = ['mousemove', 'keydown', 'mousedown', 'touchstart', 'scroll', 'click']
      events.forEach(e => window.addEventListener(e, resetTimers, { passive: true }))
      return () => {
        clearAllTimers()
        events.forEach(e => window.removeEventListener(e, resetTimers))
      }
    } else {
      clearAllTimers()
    }
  }, [user]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <AuthContext.Provider value={{ user, loading, isPremium, isFullAccess, tier, signOut, refreshUser }}>
      {children}

      {/* Inactivity warning modal */}
      {showWarning && user && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.6)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 9999, backdropFilter: 'blur(4px)',
        }}>
          <div style={{
            background: '#fff', borderRadius: '20px', padding: '36px 40px',
            maxWidth: '420px', width: '90%', textAlign: 'center',
            boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
          }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>⏱️</div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: '0 0 8px' }}>
              Still there?
            </h2>
            <p style={{ color: '#64748b', margin: '0 0 20px', lineHeight: '1.6' }}>
              You've been inactive. We'll log you out in
            </p>
            <div style={{
              fontSize: '3rem', fontWeight: 900,
              color: countdown <= 10 ? '#dc2626' : '#2563eb',
              margin: '0 0 24px', transition: 'color 0.3s',
            }}>
              {countdown}s
            </div>
            <button
              onClick={resetTimers}
              style={{
                width: '100%', padding: '12px', borderRadius: '12px',
                background: '#2563eb', color: '#fff', border: 'none',
                fontWeight: 700, fontSize: '1rem', cursor: 'pointer',
              }}
            >
              Keep me logged in
            </button>
          </div>
        </div>
      )}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
