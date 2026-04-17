import { useState } from 'react'
import { useNavigate, Link, useSearchParams } from 'react-router-dom'
import { signUp, confirmSignUp } from '../lib/cognito'

const CHECKOUT_API = import.meta.env.VITE_CHECKOUT_API as string || 'https://34zglioc5a.execute-api.us-east-1.amazonaws.com/checkout'

const PAID_PLANS = new Set(['monthly', 'yearly', 'lifetime'])

const perks = [
  { icon: '📋', text: '3,958 scenario-based questions' },
  { icon: '⏱️', text: 'Timed mock exams — 65q / 130 min' },
  { icon: '🗺️', text: 'Architecture diagrams & visual exam' },
  { icon: '🎯', text: 'Domain filtering — focus weak areas' },
  { icon: '🏆', text: 'All 12 active AWS certifications' },
]

export default function Signup() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const plan = searchParams.get('plan') || 'free'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [confirmSent, setConfirmSent] = useState(false)
  const [code, setCode] = useState('')
  const [confirming, setConfirming] = useState(false)
  const [focusField, setFocusField] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [passwordTouched, setPasswordTouched] = useState(false)

  const pwChecks = {
    length:    password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number:    /[0-9]/.test(password),
    symbol:    /[^A-Za-z0-9]/.test(password),
  }
  const pwValid = Object.values(pwChecks).every(Boolean)
  const strengthScore = Object.values(pwChecks).filter(Boolean).length
  const strengthLabel = strengthScore <= 1 ? 'Weak' : strengthScore <= 3 ? 'Fair' : strengthScore === 4 ? 'Good' : 'Strong'
  const strengthColor = strengthScore <= 1 ? '#ef4444' : strengthScore <= 3 ? '#f59e0b' : strengthScore === 4 ? '#3b82f6' : '#16a34a'

  const planLabel =
    plan === 'lifetime' ? '🔥 Lifetime — pay once, use forever'
    : plan === 'yearly'  ? '📅 Yearly — ~$5.60/month'
    : plan === 'monthly' ? '📦 Monthly — cancel anytime'
    : null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!email || !password) { setError('Please fill in all fields.'); return }
    if (!pwValid) { setPasswordTouched(true); setError('Password does not meet all requirements.'); return }

    setLoading(true)
    try {
      await signUp(email, password)
    } catch (err: unknown) {
      setLoading(false)
      setError(err instanceof Error ? err.message : 'Sign up failed.')
      return
    }

    if (plan !== 'free' && PAID_PLANS.has(plan)) {
      try {
        const res = await fetch(CHECKOUT_API, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ plan, email }),
        })
        const data = await res.json()
        if (data.url) { window.location.href = data.url; return }
        setError(data.error || 'Checkout failed. Please try again.')
      } catch {
        setError('Network error. Please try again.')
      }
      return
    }

    // Always verify email first before any redirect (including paid plans)
    setLoading(false)
    setConfirmSent(true)
  }

  if (confirmSent) {
    const handleConfirm = async (e: React.FormEvent) => {
      e.preventDefault()
      if (!code) { setError('Please enter the verification code.'); return }
      setConfirming(true)
      setError('')
      try {
        await confirmSignUp(email, code)
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Invalid code. Please try again.')
        setConfirming(false)
        return
      }

      // Email verified — now redirect to payment if paid plan, otherwise to login
      if (plan !== 'free' && PAID_PLANS.has(plan)) {
        try {
          const res = await fetch(CHECKOUT_API, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ plan, email }),
          })
          const data = await res.json()
          if (data.url) { window.location.href = data.url; return }
          setError(data.error || 'Checkout failed. Please try again.')
        } catch {
          setError('Network error. Please try again.')
        }
        setConfirming(false)
        return
      }

      navigate('/login?verified=1')
    }

    const handleResend = async () => {
      try {
        const { CognitoUser } = await import('amazon-cognito-identity-js')
        const { userPool } = await import('../lib/cognito')
        const user = new CognitoUser({ Username: email, Pool: userPool })
        user.resendConfirmationCode((err) => {
          if (err) setError('Could not resend code. Please try again.')
          else setError('')
        })
      } catch {
        setError('Could not resend code.')
      }
    }

    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc', padding: '2rem' }}>
        <div style={{ textAlign: 'center', maxWidth: '360px', width: '100%' }}>
          <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>📬</div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 900, color: '#111827', marginBottom: '0.5rem' }}>Check your email</h2>
          <p style={{ color: '#6b7280', fontSize: '0.9rem', marginBottom: '1.5rem', lineHeight: 1.6 }}>
            We sent a 6-digit code to <strong>{email}</strong>. Enter it below to activate your account.
            {plan !== 'free' && PAID_PLANS.has(plan) && (
              <span style={{ display: 'block', marginTop: '0.5rem', color: '#2563eb', fontWeight: 600 }}>
                After verification you'll be taken to payment.
              </span>
            )}
          </p>
          <form onSubmit={handleConfirm}>
            <input
              id="verify-code"
              name="code"
              type="text"
              placeholder="Enter 6-digit code"
              value={code}
              onChange={e => setCode(e.target.value)}
              maxLength={6}
              autoComplete="one-time-code"
              style={{ width: '100%', padding: '0.75rem 1rem', fontSize: '1.2rem', letterSpacing: '0.3em', textAlign: 'center', border: '1.5px solid #d1d5db', borderRadius: '0.75rem', marginBottom: '1rem', boxSizing: 'border-box' }}
            />
            {error && <p style={{ color: '#dc2626', fontSize: '0.85rem', marginBottom: '0.75rem' }}>{error}</p>}
            <button
              type="submit"
              disabled={confirming}
              style={{ width: '100%', padding: '0.75rem', background: '#2563eb', color: '#fff', fontWeight: 700, borderRadius: '0.75rem', border: 'none', cursor: 'pointer', fontSize: '0.95rem', marginBottom: '0.75rem' }}
            >
              {confirming ? 'Verifying…' : plan !== 'free' && PAID_PLANS.has(plan) ? 'Verify & Continue to Payment →' : 'Verify & Log In'}
            </button>
            <button
              type="button"
              onClick={handleResend}
              style={{ background: 'none', border: 'none', color: '#6b7280', fontSize: '0.82rem', cursor: 'pointer', textDecoration: 'underline' }}
            >
              Didn't get the code? Resend it
            </button>
          </form>
        </div>
      </div>
    )
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
        {/* Glow */}
        <div style={{ position: 'absolute', top: '-60px', left: '-60px', width: '300px', height: '300px', borderRadius: '50%', background: 'rgba(37,99,235,0.18)', filter: 'blur(70px)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '-40px', right: '-40px', width: '240px', height: '240px', borderRadius: '50%', background: 'rgba(99,102,241,0.12)', filter: 'blur(60px)', pointerEvents: 'none' }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '3rem' }}>
            <span style={{ fontSize: '1.4rem' }}>☁️</span>
            <span style={{ color: '#fff', fontWeight: 900, fontSize: '1.15rem' }}>CertiPrepAI</span>
          </div>

          <h2 style={{ fontSize: '2rem', fontWeight: 900, color: '#fff', lineHeight: 1.2, marginBottom: '0.75rem' }}>
            Pass your AWS cert.<br />
            <span style={{ color: '#60a5fa' }}>Practice smarter.</span>
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '0.95rem', marginBottom: '2.5rem', lineHeight: 1.6 }}>
            Scenario-based questions with instant explanations — for every active AWS certification.
          </p>

          {/* Perks */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {perks.map(p => (
              <div key={p.text} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem', flexShrink: 0 }}>
                  {p.icon}
                </div>
                <span style={{ color: '#cbd5e1', fontSize: '0.88rem' }}>{p.text}</span>
              </div>
            ))}
          </div>

          {/* Social proof */}
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
        padding: '3rem 3rem',
      }}>
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 900, color: '#111827', marginBottom: '0.4rem' }}>
            Create your account
          </h1>
          <p style={{ color: '#6b7280', fontSize: '0.88rem' }}>
            {planLabel
              ? <span style={{ display: 'inline-block', background: '#eff6ff', color: '#1d4ed8', fontWeight: 700, padding: '0.2rem 0.65rem', borderRadius: '999px', fontSize: '0.8rem' }}>{planLabel}</span>
              : '20 free questions — no credit card required'}
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
          <div>
            <label htmlFor="signup-email" style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#374151', marginBottom: '0.4rem' }}>
              Email
            </label>
            <input
              id="signup-email"
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
            <label htmlFor="signup-password" style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#374151', marginBottom: '0.4rem' }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <input
                id="signup-password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                onFocus={() => { setFocusField('password'); setPasswordTouched(true) }}
                onBlur={() => setFocusField(null)}
                placeholder="Min 8 characters"
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
            {password.length > 0 && (
              <div style={{ marginTop: '0.5rem' }}>
                <div style={{ display: 'flex', gap: '3px', marginBottom: '0.2rem' }}>
                  {[1, 2, 3, 4, 5].map(i => (
                    <div key={i} style={{
                      flex: 1, height: '4px', borderRadius: '2px',
                      background: i <= strengthScore ? strengthColor : '#e5e7eb',
                      transition: 'background 0.2s',
                    }} />
                  ))}
                </div>
                <div style={{ fontSize: '0.72rem', fontWeight: 700, color: strengthColor, textAlign: 'right', transition: 'color 0.2s' }}>
                  {strengthLabel}
                </div>
              </div>
            )}
            {(passwordTouched || password.length > 0) && (
              <div style={{ marginTop: '0.5rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.3rem 1rem' }}>
                {([
                  ['length',    '8+ characters'],
                  ['uppercase', 'Uppercase letter'],
                  ['lowercase', 'Lowercase letter'],
                  ['number',    'Number'],
                  ['symbol',    'Symbol (!@#$…)'],
                ] as [keyof typeof pwChecks, string][]).map(([key, label]) => (
                  <div key={key} style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.75rem', color: pwChecks[key] ? '#15803d' : '#9ca3af' }}>
                    <span style={{ fontWeight: 700 }}>{pwChecks[key] ? '✓' : '✗'}</span>
                    {label}
                  </div>
                ))}
              </div>
            )}
          </div>

          {error && error !== '__EXISTS__' && (
            <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '0.5rem', padding: '0.6rem 0.85rem', fontSize: '0.83rem', color: '#b91c1c' }}>
              {error}
            </div>
          )}
          {error === '__EXISTS__' && (
            <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '0.75rem', padding: '0.85rem 1rem', fontSize: '0.85rem', color: '#1d4ed8', textAlign: 'center' }}>
              <strong>Account already exists.</strong>
              <br />
              <Link to={`/login`} style={{ color: '#1d4ed8', fontWeight: 700, textDecoration: 'underline', marginTop: '0.35rem', display: 'inline-block' }}>
                Log in instead →
              </Link>
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
            {loading ? 'Creating account…' : plan === 'free' ? 'Sign Up Free' : 'Sign Up & Continue to Payment →'}
          </button>
        </form>

        <p style={{ fontSize: '0.75rem', color: '#9ca3af', textAlign: 'center', marginTop: '1rem' }}>
          By signing up you agree to our{' '}
          <Link to="/terms" style={{ color: '#6b7280', textDecoration: 'underline' }}>Terms & Privacy Policy</Link>
        </p>

        <div style={{ borderTop: '1px solid #f3f4f6', marginTop: '1.75rem', paddingTop: '1.5rem', textAlign: 'center' }}>
          <p style={{ fontSize: '0.88rem', color: '#6b7280' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: '#2563eb', fontWeight: 700, textDecoration: 'none' }}>Log in</Link>
          </p>
        </div>
      </div>

    </div>
  )
}
