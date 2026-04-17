import { useState } from 'react'
import { Link } from 'react-router-dom'
import { forgotPassword, confirmNewPassword } from '../lib/cognito'

type Step = 'email' | 'code' | 'done'

export default function ForgotPassword() {
  const [step, setStep]         = useState<Step>('email')
  const [email, setEmail]       = useState('')
  const [code, setCode]         = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm]   = useState('')
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!email) { setError('Enter your email address.'); return }
    setLoading(true)
    try {
      await forgotPassword(email.trim().toLowerCase())
      setStep('code')
    } catch (err: any) {
      setError(err.message || 'Failed to send reset code.')
    } finally {
      setLoading(false)
    }
  }

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!code || !password) { setError('Fill in all fields.'); return }
    if (password !== confirm) { setError('Passwords do not match.'); return }
    if (password.length < 8) { setError('Password must be at least 8 characters.'); return }
    setLoading(true)
    try {
      await confirmNewPassword(email.trim().toLowerCase(), code.trim(), password)
      setStep('done')
    } catch (err: any) {
      setError(err.message || 'Reset failed. Check your code and try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(160deg, #0f172a 0%, #1e3a8a 60%, #1d4ed8 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>
      <div style={{ width: '100%', maxWidth: '400px' }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <a href="/" style={{ textDecoration: 'none' }}>
            <span style={{ fontSize: '1.5rem', fontWeight: 900, color: '#fff', letterSpacing: '-0.02em' }}>
              CertiPrep<span style={{ color: '#60a5fa' }}>AI</span>
            </span>
          </a>
        </div>

        <div style={{ background: '#fff', borderRadius: '1.25rem', padding: '2rem', boxShadow: '0 25px 50px rgba(0,0,0,0.3)' }}>

          {/* ── Step: Enter email ── */}
          {step === 'email' && (
            <>
              <h1 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#111827', marginBottom: '0.375rem' }}>Reset your password</h1>
              <p style={{ fontSize: '0.85rem', color: '#6b7280', marginBottom: '1.5rem' }}>
                Enter your email and we'll send a reset code.
              </p>

              <form onSubmit={handleSendCode} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#374151', marginBottom: '0.375rem' }}>Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value.trim().toLowerCase())}
                    placeholder="you@example.com"
                    autoComplete="email"
                    style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '0.75rem', border: '1.5px solid #e5e7eb', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' }}
                  />
                </div>

                {error && (
                  <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '0.75rem', padding: '0.75rem 1rem', fontSize: '0.82rem', color: '#dc2626' }}>
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  style={{ padding: '0.8rem', background: loading ? '#93c5fd' : '#2563eb', color: '#fff', border: 'none', borderRadius: '0.75rem', fontWeight: 700, fontSize: '0.9rem', cursor: loading ? 'not-allowed' : 'pointer' }}
                >
                  {loading ? 'Sending…' : 'Send Reset Code'}
                </button>
              </form>
            </>
          )}

          {/* ── Step: Enter code + new password ── */}
          {step === 'code' && (
            <>
              <h1 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#111827', marginBottom: '0.375rem' }}>Check your email</h1>
              <p style={{ fontSize: '0.85rem', color: '#6b7280', marginBottom: '1.5rem' }}>
                We sent a 6-digit code to <strong>{email}</strong>. Enter it below with your new password.
              </p>

              <form onSubmit={handleReset} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#374151', marginBottom: '0.375rem' }}>Reset Code</label>
                  <input
                    type="text"
                    value={code}
                    onChange={e => setCode(e.target.value.trim())}
                    placeholder="123456"
                    inputMode="numeric"
                    maxLength={6}
                    style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '0.75rem', border: '1.5px solid #e5e7eb', fontSize: '1.1rem', letterSpacing: '0.2em', outline: 'none', boxSizing: 'border-box' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#374151', marginBottom: '0.375rem' }}>New Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Min. 8 characters"
                    autoComplete="new-password"
                    style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '0.75rem', border: '1.5px solid #e5e7eb', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#374151', marginBottom: '0.375rem' }}>Confirm Password</label>
                  <input
                    type="password"
                    value={confirm}
                    onChange={e => setConfirm(e.target.value)}
                    placeholder="Repeat new password"
                    autoComplete="new-password"
                    style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '0.75rem', border: '1.5px solid #e5e7eb', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' }}
                  />
                </div>

                {error && (
                  <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '0.75rem', padding: '0.75rem 1rem', fontSize: '0.82rem', color: '#dc2626' }}>
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  style={{ padding: '0.8rem', background: loading ? '#93c5fd' : '#2563eb', color: '#fff', border: 'none', borderRadius: '0.75rem', fontWeight: 700, fontSize: '0.9rem', cursor: loading ? 'not-allowed' : 'pointer' }}
                >
                  {loading ? 'Resetting…' : 'Reset Password'}
                </button>

                <button
                  type="button"
                  onClick={() => { setStep('email'); setError('') }}
                  style={{ padding: '0.5rem', background: 'none', border: 'none', color: '#6b7280', fontSize: '0.82rem', cursor: 'pointer' }}
                >
                  ← Use a different email
                </button>
              </form>
            </>
          )}

          {/* ── Step: Done ── */}
          {step === 'done' && (
            <div style={{ textAlign: 'center', padding: '1rem 0' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>✅</div>
              <h1 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#111827', marginBottom: '0.5rem' }}>Password reset!</h1>
              <p style={{ fontSize: '0.85rem', color: '#6b7280', marginBottom: '1.5rem' }}>
                Your password has been updated. Log in with your new password.
              </p>
              <Link
                to="/login"
                style={{ display: 'inline-block', padding: '0.75rem 1.5rem', background: '#2563eb', color: '#fff', borderRadius: '0.75rem', fontWeight: 700, fontSize: '0.9rem', textDecoration: 'none' }}
              >
                Go to Login
              </Link>
            </div>
          )}

          {/* Footer link */}
          {step !== 'done' && (
            <p style={{ textAlign: 'center', fontSize: '0.82rem', color: '#6b7280', marginTop: '1.25rem', marginBottom: 0 }}>
              Remember your password? <Link to="/login" style={{ color: '#2563eb', fontWeight: 700, textDecoration: 'none' }}>Log in</Link>
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
