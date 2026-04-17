import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import Layout from '../components/Layout'
import { useAuth } from '../contexts/AuthContext'

const VERIFY_API = import.meta.env.VITE_VERIFY_SESSION_URL as string || 'https://6ryf7eipwnxeus2xbekgvwykme0otufd.lambda-url.us-east-1.on.aws'

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams()
  const sessionId = searchParams.get('session_id')
  const { refreshUser } = useAuth()
  const navigate = useNavigate()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [tier, setTier] = useState('')

  useEffect(() => {
    if (!sessionId) { navigate('/'); return }

    const verify = async () => {
      try {
        const res = await fetch(VERIFY_API, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionId }),
        })
        const data = await res.json()
        if (data.verified) {
          setTier(data.tier || 'monthly')
          await refreshUser()
          setStatus('success')
        } else {
          setStatus('error')
        }
      } catch {
        setStatus('error')
      }
    }

    verify()
  }, [sessionId, refreshUser, navigate])

  if (status === 'loading') {
    return (
      <Layout>
        <div style={{ minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>⏳</div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#111827', marginBottom: '0.5rem' }}>Confirming your payment...</h2>
            <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>Please wait while we activate your account.</p>
          </div>
        </div>
      </Layout>
    )
  }

  if (status === 'error') {
    return (
      <Layout>
        <div style={{ maxWidth: '480px', margin: '4rem auto', padding: '0 1rem', textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚠️</div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#111827', marginBottom: '0.5rem' }}>Verification Issue</h2>
          <p style={{ color: '#6b7280', marginBottom: '1.5rem', lineHeight: 1.6 }}>
            We couldn't automatically verify your payment. Don't worry — if you completed payment, your access will activate within a few minutes. Check your email for confirmation.
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/certifications" style={{ padding: '0.75rem 1.5rem', background: '#2563eb', color: '#fff', borderRadius: '0.875rem', fontWeight: 700, textDecoration: 'none' }}>
              Start Practicing
            </Link>
            <Link to="/dashboard" style={{ padding: '0.75rem 1.5rem', border: '1px solid #e5e7eb', background: '#fff', color: '#374151', borderRadius: '0.875rem', fontWeight: 700, textDecoration: 'none' }}>
              My Dashboard
            </Link>
          </div>
        </div>
      </Layout>
    )
  }

  const tierLabels: Record<string, string> = {
    monthly: '📦 Monthly Plan',
    yearly: '📅 Yearly Plan',
    lifetime: '🔥 Lifetime Plan',
  }

  return (
    <Layout>
      <div style={{ maxWidth: '520px', margin: '4rem auto', padding: '0 1rem', textAlign: 'center' }}>
        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎉</div>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 900, color: '#111827', marginBottom: '0.5rem' }}>
          You're all set!
        </h1>
        <div style={{ display: 'inline-block', padding: '0.375rem 1rem', background: '#eff6ff', borderRadius: '999px', color: '#1d4ed8', fontWeight: 700, fontSize: '0.9rem', marginBottom: '1rem' }}>
          {tierLabels[tier] ?? '⭐ Premium Plan'}
        </div>
        <p style={{ color: '#6b7280', marginBottom: '2rem', lineHeight: 1.7 }}>
          Your account has been upgraded. You now have full access to all 3,958 questions across 12 AWS certifications.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '2rem' }}>
          {[
            { icon: '✅', label: '3,958 Questions', sub: 'All 12 certs' },
            { icon: '⏱️', label: 'Mock Exams', sub: '65 questions, timed' },
            { icon: '🎯', label: 'Domain Focus', sub: 'Filter by topic' },
            { icon: '💡', label: 'Explanations', sub: 'Every answer' },
          ].map(item => (
            <div key={item.label} style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '0.875rem', padding: '1rem', textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>{item.icon}</div>
              <div style={{ fontWeight: 700, color: '#166534', fontSize: '0.875rem' }}>{item.label}</div>
              <div style={{ fontSize: '0.75rem', color: '#4ade80', marginTop: '0.1rem' }}>{item.sub}</div>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/certifications" style={{ padding: '0.875rem 2rem', background: '#2563eb', color: '#fff', borderRadius: '0.875rem', fontWeight: 800, textDecoration: 'none', fontSize: '1rem' }}>
            Start Practicing →
          </Link>
          <Link to="/dashboard" style={{ padding: '0.875rem 1.5rem', border: '1px solid #e5e7eb', background: '#fff', color: '#374151', borderRadius: '0.875rem', fontWeight: 700, textDecoration: 'none' }}>
            My Dashboard
          </Link>
        </div>
      </div>
    </Layout>
  )
}
