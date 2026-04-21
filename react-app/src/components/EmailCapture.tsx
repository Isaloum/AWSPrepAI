/**
 * EmailCapture.tsx
 * Sticky bottom banner — appears after user scrolls 60% down.
 * Saves email to awsprepai-leads via awsprepai-db Lambda (no auth).
 */
import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'

const DB_API = import.meta.env.VITE_DB_API_URL || import.meta.env.VITE_DB_API || 'https://dzhvi7oz29.execute-api.us-east-1.amazonaws.com'
const STORAGE_KEY = 'certiprepai_lead_captured'

export default function EmailCapture() {
  const { user } = useAuth()
  const [visible, setVisible] = useState(false)
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle')
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    // Don't show if logged in or already captured/dismissed
    if (user) return
    if (localStorage.getItem(STORAGE_KEY)) return

    const onScroll = () => {
      const scrolled = window.scrollY / (document.body.scrollHeight - window.innerHeight)
      if (scrolled > 0.6) setVisible(true)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.includes('@')) return
    setStatus('loading')
    try {
      const res = await fetch(`${DB_API}/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'capture_lead', data: { email: email.trim().toLowerCase(), source: 'homepage-banner' } }),
      })
      if (res.ok) {
        setStatus('done')
        localStorage.setItem(STORAGE_KEY, '1')
        setTimeout(() => setDismissed(true), 2500)
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  if (!visible || dismissed) return null

  return (
    <div style={{
      position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 50,
      background: 'linear-gradient(135deg, #0f172a, #1e3a8a)',
      borderTop: '1px solid rgba(255,255,255,0.1)',
      padding: '1rem 1.5rem',
      boxShadow: '0 -4px 24px rgba(0,0,0,0.3)',
    }}>
      <div style={{ maxWidth: '700px', margin: '0 auto', display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>

        {status === 'done' ? (
          <div style={{ flex: 1, textAlign: 'center', color: '#4ade80', fontWeight: 700, fontSize: '0.95rem' }}>
            ✅ You're in! Check your email for AWS study tips.
          </div>
        ) : (
          <>
            <div style={{ flex: 1, minWidth: '200px' }}>
              <div style={{ color: '#fff', fontWeight: 800, fontSize: '0.95rem', marginBottom: '0.2rem' }}>
                🎓 Get free AWS exam tips
              </div>
              <div style={{ color: '#93c5fd', fontSize: '0.8rem' }}>
                Weekly study tips + cheat sheets — no spam, unsubscribe anytime.
              </div>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <input
                type="email"
                placeholder="you@email.com"
                value={email}
                onChange={e => setEmail(e.target.value.trim().toLowerCase())}
                required
                style={{
                  padding: '0.6rem 1rem', borderRadius: '0.625rem', border: '1px solid rgba(255,255,255,0.2)',
                  background: 'rgba(255,255,255,0.1)', color: '#fff', fontSize: '0.875rem',
                  outline: 'none', width: '220px',
                }}
              />
              <button
                type="submit"
                disabled={status === 'loading'}
                style={{
                  padding: '0.6rem 1.25rem', background: '#2563eb', color: '#fff',
                  fontWeight: 700, borderRadius: '0.625rem', border: 'none',
                  cursor: status === 'loading' ? 'not-allowed' : 'pointer', fontSize: '0.875rem',
                  opacity: status === 'loading' ? 0.7 : 1,
                }}
              >
                {status === 'loading' ? '...' : 'Send me tips →'}
              </button>
            </form>

            {status === 'error' && (
              <div style={{ color: '#fca5a5', fontSize: '0.8rem' }}>Something went wrong — try again.</div>
            )}
          </>
        )}

        <button
          onClick={() => { setDismissed(true); localStorage.setItem(STORAGE_KEY, 'dismissed') }}
          style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: '1.1rem', padding: '0.25rem', flexShrink: 0 }}
          title="Dismiss"
        >
          ✕
        </button>
      </div>
    </div>
  )
}
