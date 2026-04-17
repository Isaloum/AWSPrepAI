import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { signIn, forgotPassword, completeMFASignIn } from '../lib/cognito'
import { useAuth } from '../contexts/AuthContext'

export default function Login() {
  const navigate = useNavigate()
  const { refreshUser } = useAuth()
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)
  const [resetSent, setResetSent] = useState(false)
  const [focusField, setFocusField] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [mfaRequired, setMfaRequired] = useState(false)
  const [totpCode, setTotpCode] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!email || !password) { setError('Please fill in all fields.'); return }
    setLoading(true)
    try {
      const result = await signIn(email, password)
      if (result === 'MFA_REQUIRED') {
        setMfaRequired(true)
        setLoading(false)
        return
      }
      await refreshUser()
      navigate('/dashboard')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Sign in failed.')
    }
    setLoading(false)
  }

  const handleMFASubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!totpCode) { setError('Enter your 6-digit code.'); return }
    setLoading(true)
    setError('')
    try {
      await completeMFASignIn(totpCode)
      await refreshUser()
      navigate('/dashboard')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Invalid code. Try again.')
    }
    setLoading(false)
  }

  const handleForgotPassword = async () => {
    if (!email) { setError('Enter your email above first.'); return }
    setError('')
    try {
      await forgotPassword(email)
      setResetSent(true)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to send reset email.')
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex' }}>

      {/* Left panel — branding */}
      <div style={{
        flex: '1',
        background: 'linear-gradient(160deg, #0f172a 0%, #1e3a8a 100%)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '3rem 3.5rem',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', top: '-60px', left: '-60px', width: '300px', height: '300px', borderRadius: '50%', background: 'rgba(37,99,235,0.18)', filter: 'blur(70px)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '-40px', right: '-40px', width: '240px', height: '240px', borderRadius: '50%', background: 'rgba(99,102,241,0.12)', filter: 'blur(60px)', pointerEvents: 'none' }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '3rem' }}>
            <span style={{ fontSize: '1.4rem' }}>☁️</span>
            <span style={{ color: '#fff', fontWeight: 900, fontSize: '1.15rem' }}>CertiPrepAI</span>
          </div>

          <h2 style={{ fontSize: '2rem', fontWeight: 900, color: '#fff', lineHeight: 1.2, marginBottom: '0.75rem' }}>
            Welcome back.<br />
            <span style={{ color: '#60a5fa' }}>Keep practicing.</span>
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '0.95rem', marginBottom: '2.5rem', lineHeight: 1.6 }}>
            Pick up right where you left off — your progress, scores, and study plan are waiting.
          </p>

          {/* Quick stats */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {[
              { icon: '📋', text: '3,958 questions across 12 certifications' },
              { icon: '⏱️', text: 'Timed mock exams — 65 questions, 130 min' },
              { icon: '📊', text: 'Track your scores domain by domain' },
              { icon: '🎯', text: 'Domain filtering — focus your weak areas' },
            ].map(p => (
              <div key={p.text} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem', flexShrink: 0 }}>
                  {p.icon}
                </div>
                <span style={{ color: '#cbd5e1', fontSize: '0.88rem' }}>{p.text}</span>
              </div>
            ))}
          </div>

          <div style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
            <div style={{ display: 'flex', gap: '2rem' }}>
              {[['12', 'Certifications'], ['3,958', 'Questions'], ['72%', 'Pass Mark']].map(([val, label]) => (
                <div key={label}>
                  <div style={{ fontSize: '1.3rem', fontWeight: 900, color: '#60a5fa' }}>{val}</div>
                  <div style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right panel — form */}
      <div style={{
        width: '480px',
        flexShrink: 0,
        background: '#fff',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '3rem',
      }}>
        {mfaRequired ? (
          <>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <div style={{ fontSize: '3rem', marginBottom: '0.75rem' }}>🔐</div>
              <h1 style={{ fontSize: '1.4rem', fontWeight: 900, color: '#111827', marginBottom: '0.4rem' }}>Two-factor authentication</h1>
              <p style={{ color: '#6b7280', fontSize: '0.88rem' }}>Enter the 6-digit code from your authenticator app.</p>
            </div>
            <form onSubmit={handleMFASubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <input
                id="mfa-code"
                name="mfa-code"
                type="text"
                value={totpCode}
                onChange={e => setTotpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="000000"
                autoFocus
                maxLength={6}
                autoComplete="one-time-code"
                style={{ width: '100%', padding: '0.85rem', fontSize: '1.5rem', letterSpacing: '0.4em', textAlign: 'center', border: '2px solid #e5e7eb', borderRadius: '0.75rem', outline: 'none', boxSizing: 'border-box' }}
              />
              {error && <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '0.5rem', padding: '0.6rem 0.85rem', fontSize: '0.83rem', color: '#b91c1c' }}>{error}</div>}
              <button type="submit" disabled={loading || totpCode.length < 6}
                style={{ width: '100%', padding: '0.85rem', background: loading || totpCode.length < 6 ? '#93c5fd' : '#2563eb', color: '#fff', fontWeight: 700, fontSize: '0.95rem', border: 'none', borderRadius: '0.75rem', cursor: loading || totpCode.length < 6 ? 'not-allowed' : 'pointer' }}>
                {loading ? 'Verifying…' : 'Verify & Log In'}
              </button>
              <button type="button" onClick={() => { setMfaRequired(false); setTotpCode(''); setError('') }}
                style={{ background: 'none', border: 'none', color: '#6b7280', fontSize: '0.83rem', cursor: 'pointer', textDecoration: 'underline' }}>
                ← Back to login
              </button>
            </form>
          </>
        ) : (
          <>
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 900, color: '#111827', marginBottom: '0.4rem' }}>
            Log in to your account
          </h1>
          <p style={{ color: '#6b7280', fontSize: '0.88rem' }}>
            Continue your AWS certification journey
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
          <div>
            <label htmlFor="login-email" style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#374151', marginBottom: '0.4rem' }}>
              Email
            </label>
            <input
              id="login-email"
              name="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={e => setEmail(e.target.value.trim().toLowerCase())}
              onFocus={() => setFocusField('email')}
              onBlur={() => setFocusField(null)}
              placeholder="you@example.com"
              style={{
                width: '100%', padding: '0.7rem 0.9rem', borderRadius: '0.65rem', fontSize: '0.9rem',
                border: focusField === 'email' ? '2px solid #2563eb' : '2px solid #e5e7eb',
                outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.15s',
              }}
            />
          </div>

          <div>
            <label htmlFor="login-password" style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#374151', marginBottom: '0.4rem' }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <input
                id="login-password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                onFocus={() => setFocusField('password')}
                onBlur={() => setFocusField(null)}
                placeholder="••••••••"
                style={{
                  width: '100%', padding: '0.7rem 2.75rem 0.7rem 0.9rem', borderRadius: '0.65rem', fontSize: '0.9rem',
                  border: focusField === 'password' ? '2px solid #2563eb' : '2px solid #e5e7eb',
                  outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.15s',
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(v => !v)}
                style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', padding: '0.2rem', color: '#9ca3af', display: 'flex', alignItems: 'center' }}
                tabIndex={-1}
              >
                {showPassword
                  ? <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                  : <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                }
              </button>
            </div>
          </div>

          {error && (
            <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '0.5rem', padding: '0.6rem 0.85rem', fontSize: '0.83rem', color: '#b91c1c' }}>
              {error}
            </div>
          )}
          {resetSent && (
            <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '0.5rem', padding: '0.6rem 0.85rem', fontSize: '0.83rem', color: '#15803d' }}>
              Reset email sent — check your inbox.
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%', padding: '0.85rem', background: loading ? '#93c5fd' : '#2563eb',
              color: '#fff', fontWeight: 700, fontSize: '0.95rem', border: 'none',
              borderRadius: '0.75rem', cursor: loading ? 'not-allowed' : 'pointer', transition: 'background 0.15s',
            }}
            onMouseEnter={e => { if (!loading) e.currentTarget.style.background = '#1d4ed8' }}
            onMouseLeave={e => { if (!loading) e.currentTarget.style.background = '#2563eb' }}
          >
            {loading ? 'Logging in…' : 'Log In'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1rem' }}>
          <Link to="/forgot-password" style={{ color: '#2563eb', fontSize: '0.85rem', fontWeight: 500, textDecoration: 'none' }}>
            Forgot password?
          </Link>
        </div>

        <div style={{ borderTop: '1px solid #f3f4f6', marginTop: '1.75rem', paddingTop: '1.5rem', textAlign: 'center' }}>
          <p style={{ fontSize: '0.88rem', color: '#6b7280' }}>
            Don't have an account?{' '}
            <Link to="/signup" style={{ color: '#2563eb', fontWeight: 700, textDecoration: 'none' }}>Sign up free</Link>
          </p>
        </div>
          </>
        )}
      </div>

    </div>
  )
}
