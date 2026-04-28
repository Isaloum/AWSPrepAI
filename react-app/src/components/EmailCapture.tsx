/**
 * EmailCapture.tsx
 * Centered modal popup — appears after user scrolls 60% down.
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
        body: JSON.stringify({ action: 'capture_lead', data: { email: email.trim().toLowerCase(), source: 'homepage-popup' } }),
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

  const dismiss = () => {
    setDismissed(true)
    localStorage.setItem(STORAGE_KEY, 'dismissed')
  }

  if (!visible || dismissed) return null

  return (
    // Backdrop
    <div
      onClick={dismiss}
      style={{
        position: 'fixed', inset: 0, zIndex: 999,
        background: 'rgba(0,0,0,0.5)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '1rem',
        animation: 'fadeIn 0.25s ease',
      }}
    >
      {/* Modal box */}
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: 'linear-gradient(135deg, #0f172a, #1e3a8a)',
          borderRadius: '1.25rem',
          padding: '2.5rem 2rem',
          maxWidth: '460px',
          width: '100%',
          boxShadow: '0 24px 60px rgba(0,0,0,0.4)',
          position: 'relative',
          animation: 'slideUp 0.25s ease',
        }}
      >
        {/* Close button */}
        <button
          onClick={dismiss}
          style={{
            position: 'absolute', top: '1rem', right: '1rem',
            background: 'none', border: 'none', color: '#64748b',
            cursor: 'pointer', fontSize: '1.2rem', lineHeight: 1,
          }}
        >
          ✕
        </button>

        {status === 'done' ? (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>🎉</div>
            <div style={{ color: '#4ade80', fontWeight: 700, fontSize: '1.1rem' }}>
              You're in!
            </div>
            <div style={{ color: '#93c5fd', fontSize: '0.875rem', marginTop: '0.4rem' }}>
              Check your email for AWS study tips.
            </div>
          </div>
        ) : (
          <>
            <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🎓</div>
              <h3 style={{ color: '#fff', fontWeight: 900, fontSize: '1.25rem', margin: '0 0 0.5rem' }}>
                Get free AWS exam tips
              </h3>
              <p style={{ color: '#93c5fd', fontSize: '0.875rem', margin: 0, lineHeight: 1.6 }}>
                Weekly study tips + cheat sheets sent to your inbox.<br />No spam, unsubscribe anytime.
              </p>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={e => setEmail(e.target.value.trim().toLowerCase())}
                required
                autoFocus
                style={{
                  padding: '0.75rem 1rem', borderRadius: '0.75rem',
                  border: '1.5px solid rgba(255,255,255,0.2)',
                  background: 'rgba(255,255,255,0.08)', color: '#fff',
                  fontSize: '0.95rem', outline: 'none', width: '100%',
                  boxSizing: 'border-box',
                }}
              />
              <button
                type="submit"
                disabled={status === 'loading'}
                style={{
                  padding: '0.75rem', background: '#2563eb', color: '#fff',
                  fontWeight: 700, borderRadius: '0.75rem', border: 'none',
                  cursor: status === 'loading' ? 'not-allowed' : 'pointer',
                  fontSize: '0.95rem', opacity: status === 'loading' ? 0.7 : 1,
                }}
              >
                {status === 'loading' ? '⏳ Sending…' : 'Send me free tips →'}
              </button>
            </form>

            {status === 'error' && (
              <p style={{ color: '#fca5a5', fontSize: '0.8rem', textAlign: 'center', marginTop: '0.5rem' }}>
                Something went wrong — try again.
              </p>
            )}

            <p style={{ color: '#475569', fontSize: '0.75rem', textAlign: 'center', marginTop: '1rem', marginBottom: 0 }}>
              Join 500+ AWS learners. No credit card required.
            </p>
          </>
        )}
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes slideUp { from { transform: translateY(20px); opacity: 0 } to { transform: translateY(0); opacity: 1 } }
      `}</style>
    </div>
  )
}
