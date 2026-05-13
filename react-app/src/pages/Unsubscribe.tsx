import { useEffect, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'

const DB_API = 'https://dzhvi7oz29.execute-api.us-east-1.amazonaws.com'

export default function Unsubscribe() {
  const [searchParams] = useSearchParams()
  const [status, setStatus] = useState<'loading' | 'done' | 'error' | 'invalid'>('loading')

  useEffect(() => {
    const encoded = searchParams.get('e')
    if (!encoded) { setStatus('invalid'); return }

    let email: string
    try {
      email = atob(encoded).trim().toLowerCase()
      if (!email.includes('@')) throw new Error('invalid')
    } catch {
      setStatus('invalid')
      return
    }

    fetch(`${DB_API}/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'unsubscribe', data: { email } }),
    })
      .then(res => {
        if (res.ok) setStatus('done')
        else setStatus('error')
      })
      .catch(() => setStatus('error'))
  }, [searchParams])

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center',
      justifyContent: 'center', background: '#f9fafb', padding: '2rem',
    }}>
      <div style={{
        background: '#fff', borderRadius: '1rem', padding: '3rem 2.5rem',
        maxWidth: '440px', width: '100%', textAlign: 'center',
        boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
      }}>

        {status === 'loading' && (
          <>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>⏳</div>
            <p style={{ color: '#6b7280', fontSize: '0.95rem' }}>Unsubscribing…</p>
          </>
        )}

        {status === 'done' && (
          <>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>✅</div>
            <h1 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#111827', marginBottom: '0.5rem' }}>
              You've been unsubscribed
            </h1>
            <p style={{ color: '#6b7280', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
              You won't receive any more emails from CertiPrepAI.
              Your account and progress are still saved.
            </p>
            <Link
              to="/"
              style={{
                display: 'inline-block', padding: '0.65rem 1.5rem',
                background: '#2563eb', color: '#fff', borderRadius: '0.75rem',
                fontWeight: 700, fontSize: '0.875rem', textDecoration: 'none',
              }}
            >
              Go to homepage
            </Link>
          </>
        )}

        {status === 'invalid' && (
          <>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🔗</div>
            <h1 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#111827', marginBottom: '0.5rem' }}>
              Invalid link
            </h1>
            <p style={{ color: '#6b7280', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
              This unsubscribe link is invalid or expired. To unsubscribe, email{' '}
              <a href="mailto:support@certiprepai.com" style={{ color: '#2563eb' }}>
                support@certiprepai.com
              </a>.
            </p>
          </>
        )}

        {status === 'error' && (
          <>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>❌</div>
            <h1 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#111827', marginBottom: '0.5rem' }}>
              Something went wrong
            </h1>
            <p style={{ color: '#6b7280', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
              Please try again or email{' '}
              <a href="mailto:support@certiprepai.com" style={{ color: '#2563eb' }}>
                support@certiprepai.com
              </a>{' '}
              to be removed manually.
            </p>
          </>
        )}

      </div>
    </div>
  )
}
