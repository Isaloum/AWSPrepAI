import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import Layout from '../components/Layout'
import { useAuth } from '../contexts/AuthContext'
import { getMonthlyCert, getAllProgress, type CertProgress } from '../lib/db'
import { getStreak } from '../lib/streak'
import { getMFAStatus, setupTOTP, verifyAndEnableTOTP, disableTOTP } from '../lib/cognito'
import QRCode from 'qrcode'
import SkillRadarChart from '../components/SkillRadarChart'

/** Build progress map: cert_id → correct% (only certs with ≥1 attempt) */
function buildProgressMap(rows: CertProgress[]): Record<string, number> {
  return Object.fromEntries(
    rows
      .filter(r => r.questions_attempted > 0)
      .map(r => [r.cert_id, Math.round((r.correct_answers / r.questions_attempted) * 100)])
  )
}

/** Build domain scores map: cert_id → domain_catKey → { attempted, correct } */
function buildDomainScoresMap(rows: CertProgress[]): Record<string, Record<string, { attempted: number; correct: number }>> {
  return Object.fromEntries(
    rows
      .filter(r => r.domain_scores && Object.keys(r.domain_scores).length > 0)
      .map(r => [r.cert_id, r.domain_scores!])
  )
}

const CANCEL_API = import.meta.env.VITE_CANCEL_API || "https://hpcdl0ft8a.execute-api.us-east-1.amazonaws.com"
const AI_COACH_API = import.meta.env.VITE_AI_COACH_API || "https://hyb325gocg.execute-api.us-east-1.amazonaws.com"

const CERT_META: Record<string, { name: string; code: string; icon: string }> = {
  'clf-c02': { name: 'Cloud Practitioner', code: 'CLF-C02', icon: '☁️' },
  'aif-c01': { name: 'AI Practitioner', code: 'AIF-C01', icon: '🤖' },
  'saa-c03': { name: 'Solutions Architect Associate', code: 'SAA-C03', icon: '🏗️' },
  'dva-c02': { name: 'Developer Associate', code: 'DVA-C02', icon: '💻' },
  'soa-c02': { name: 'SysOps Administrator', code: 'SOA-C02', icon: '⚙️' },
  'dea-c01': { name: 'Data Engineer Associate', code: 'DEA-C01', icon: '📊' },
  'mla-c01': { name: 'ML Engineer Associate', code: 'MLA-C01', icon: '🧠' },
  'gai-c01': { name: 'Generative AI Developer', code: 'GAI-C01', icon: '✨' },
  'sap-c02': { name: 'Solutions Architect Professional', code: 'SAP-C02', icon: '🏆' },
  'dop-c02': { name: 'DevOps Engineer Professional', code: 'DOP-C02', icon: '🔧' },
  'scs-c03': { name: 'Security Specialty', code: 'SCS-C03', icon: '🔒' },
  'ans-c01': { name: 'Advanced Networking', code: 'ANS-C01', icon: '🌐' },
}

const CERTS = [
  { id: 'clf-c02', name: 'Cloud Practitioner', code: 'CLF-C02', icon: '☁️', level: 'Foundational' },
  { id: 'aif-c01', name: 'AI Practitioner', code: 'AIF-C01', icon: '🤖', level: 'Foundational' },
  { id: 'saa-c03', name: 'Solutions Architect Associate', code: 'SAA-C03', icon: '🏗️', level: 'Associate' },
  { id: 'dva-c02', name: 'Developer Associate', code: 'DVA-C02', icon: '💻', level: 'Associate' },
  { id: 'soa-c02', name: 'SysOps Administrator', code: 'SOA-C02', icon: '⚙️', level: 'Associate' },
  { id: 'dea-c01', name: 'Data Engineer Associate', code: 'DEA-C01', icon: '📊', level: 'Associate' },
  { id: 'mla-c01', name: 'ML Engineer Associate', code: 'MLA-C01', icon: '🧠', level: 'Associate' },
  { id: 'gai-c01', name: 'Generative AI Developer', code: 'GAI-C01', icon: '✨', level: 'Associate' },
  { id: 'sap-c02', name: 'Solutions Architect Professional', code: 'SAP-C02', icon: '🏆', level: 'Professional' },
  { id: 'dop-c02', name: 'DevOps Engineer Professional', code: 'DOP-C02', icon: '🔧', level: 'Professional' },
  { id: 'scs-c03', name: 'Security Specialty', code: 'SCS-C03', icon: '🔒', level: 'Specialty' },
  { id: 'ans-c01', name: 'Advanced Networking', code: 'ANS-C01', icon: '🌐', level: 'Specialty' },
]

const tierInfo: Record<string, { label: string; color: string; bg: string; desc: string }> = {
  free:     { label: '🆓 Free Plan',     color: '#374151', bg: '#f3f4f6', desc: '20 questions per certification' },
  monthly:  { label: '📦 Monthly Plan',  color: '#1d4ed8', bg: '#eff6ff', desc: '1 certification at a time · 1 switch per month' },
  yearly:   { label: '📅 Yearly Plan',   color: '#7c3aed', bg: '#f5f3ff', desc: 'Full access, best annual value' },
  lifetime: { label: '🔥 Lifetime Plan', color: '#1d4ed8', bg: '#eff6ff', desc: 'Pay once, access forever' },
}

export default function Dashboard() {
  const { user, isFullAccess, tier, loading, signOut } = useAuth()
  const navigate = useNavigate()
  const streak = getStreak()
  const [monthlyCert, setMonthlyCert] = useState<{ cert_id: string; selected_at: string } | null | undefined>(undefined)
  const [showCancelModal, setShowCancelModal] = useState(false)
  const [cancelling, setCancelling] = useState(false)
  const [cancelError, setCancelError] = useState('')
  const [cancelScheduled, setCancelScheduled] = useState(false)
  const [progress, setProgress] = useState<CertProgress[]>([])
  const [mfaEnabled, setMfaEnabled] = useState<boolean>(false)
  const [mfaSetup, setMfaSetup] = useState(false)
  const [mfaSecret, setMfaSecret] = useState('')
  const [mfaCode, setMfaCode] = useState('')
  const [mfaLoading, setMfaLoading] = useState(false)
  const [mfaError, setMfaError] = useState('')
  const [qrCodeUrl, setQrCodeUrl] = useState('')

  // AI Coach state (lifetime only)
  const [coachMessages, setCoachMessages] = useState<{ role: 'user' | 'assistant'; content: string }[]>([])
  const [coachInput, setCoachInput] = useState('')
  const [coachLoading, setCoachLoading] = useState(false)

  useEffect(() => {
    if (!mfaSecret || !user) { setQrCodeUrl(''); return }
    const uri = `otpauth://totp/CertiPrepAI:${encodeURIComponent(user.email)}?secret=${mfaSecret}&issuer=CertiPrepAI`
    QRCode.toDataURL(uri, { width: 200, margin: 2, color: { dark: '#111827', light: '#ffffff' } })
      .then(setQrCodeUrl).catch(() => setQrCodeUrl(''))
  }, [mfaSecret, user])

  useEffect(() => {
    if (!loading && !user) navigate('/login')
  }, [user, loading, navigate])

  useEffect(() => {
    if (!user || tier !== 'monthly') { setMonthlyCert(null); return }
    getMonthlyCert(user.accessToken).then((data) => setMonthlyCert(data ?? null)).catch(() => setMonthlyCert(null))
  }, [user, tier])

  useEffect(() => {
    if (!user) return
    getAllProgress(user.accessToken).then(setProgress).catch(() => {})
    getMFAStatus().then(setMfaEnabled).catch(() => setMfaEnabled(false))
  }, [user])

  if (loading || !user) {
    return (
      <Layout>
        <div style={{ minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>⏳</div>
            <p style={{ color: '#6b7280' }}>Loading...</p>
          </div>
        </div>
      </Layout>
    )
  }

  const info = tierInfo[tier] ?? tierInfo.free
  const email = user.email ?? ''
  const initials = email[0]?.toUpperCase() ?? 'U'

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  const handleEnableMFA = async () => {
    setMfaLoading(true); setMfaError('')
    try {
      const secret = await setupTOTP()
      setMfaSecret(secret)
      setMfaSetup(true)
    } catch (err: unknown) { setMfaError(err instanceof Error ? err.message : 'Failed to start MFA setup.') }
    setMfaLoading(false)
  }

  const handleVerifyMFA = async () => {
    if (!mfaCode) { setMfaError('Enter your 6-digit code.'); return }
    setMfaLoading(true); setMfaError('')
    try {
      await verifyAndEnableTOTP(mfaCode)
      setMfaEnabled(true); setMfaSetup(false); setMfaSecret(''); setMfaCode('')
    } catch (err: unknown) { setMfaError(err instanceof Error ? err.message : 'Invalid code. Try again.') }
    setMfaLoading(false)
  }

  const handleDisableMFA = async () => {
    setMfaLoading(true); setMfaError('')
    try {
      await disableTOTP()
      setMfaEnabled(false)
    } catch (err: unknown) { setMfaError(err instanceof Error ? err.message : 'Failed to disable MFA.') }
    setMfaLoading(false)
  }

  const sendCoachMessage = async () => {
    if (!coachInput.trim() || coachLoading || !user) return
    const userMsg = { role: 'user' as const, content: coachInput.trim() }
    const history = coachMessages.map(m => ({ role: m.role, content: m.content }))
    setCoachMessages(prev => [...prev, userMsg])
    setCoachInput('')
    setCoachLoading(true)
    try {
      const res = await fetch(AI_COACH_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${user.accessToken}` },
        body: JSON.stringify({ message: userMsg.content, history }),
      })
      const data = await res.json()
      setCoachMessages(prev => [...prev, { role: 'assistant', content: data.reply || 'Sorry, something went wrong.' }])
    } catch {
      setCoachMessages(prev => [...prev, { role: 'assistant', content: 'Network error. Please try again.' }])
    }
    setCoachLoading(false)
  }

  const handleCancelSubscription = async () => {
    if (!CANCEL_API || !user) return
    setCancelling(true)
    setCancelError('')
    try {
      const res = await fetch(CANCEL_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${user.accessToken}` },
      })
      const data = await res.json()
      if (!res.ok) { setCancelError(data.error || 'Cancellation failed. Please try again.'); setCancelling(false); return }
      // Success — plan cancelled at period end, stay on dashboard
      setShowCancelModal(false)
      setCancelScheduled(true)
    } catch {
      setCancelError('Network error. Please try again.')
      setCancelling(false)
    }
  }

  return (
    <Layout>
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '2rem 1rem' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '1.5rem', fontWeight: 800 }}>
              {initials}
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                <h1 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#111827', margin: 0 }}>Welcome back!</h1>
                {streak.count > 0 && (
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', background: streak.count >= 7 ? '#fef3c7' : '#fff7ed', border: `1px solid ${streak.count >= 7 ? '#fde68a' : '#fed7aa'}`, borderRadius: '999px', padding: '0.2rem 0.75rem' }}>
                    <span style={{ fontSize: '0.9rem' }}>🔥</span>
                    <span style={{ fontSize: '0.8rem', fontWeight: 800, color: streak.count >= 7 ? '#d97706' : '#ea580c' }}>
                      {streak.count} day streak
                    </span>
                  </div>
                )}
              </div>
              <p style={{ color: '#6b7280', fontSize: '0.875rem', margin: 0 }}>{email}</p>
            </div>
          </div>
          <button onClick={handleSignOut} style={{ padding: '0.5rem 1rem', border: '1px solid #e5e7eb', borderRadius: '0.5rem', background: '#fff', color: '#6b7280', fontSize: '0.875rem', cursor: 'pointer', fontWeight: 600 }}>
            Sign Out
          </button>
        </div>

        {/* Plan card */}
        <div style={{ background: info.bg, border: `1px solid ${info.color}30`, borderRadius: '1rem', padding: '1.25rem 1.5rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ fontWeight: 800, color: info.color, fontSize: '1rem' }}>{info.label}</div>
            <div style={{ color: '#6b7280', fontSize: '0.875rem', marginTop: '0.2rem' }}>{info.desc}</div>
          </div>
          {tier === 'free' && (
            <Link to="/pricing" style={{ padding: '0.6rem 1.25rem', background: '#2563eb', color: '#fff', borderRadius: '0.75rem', fontWeight: 700, fontSize: '0.875rem', textDecoration: 'none' }}>
              ⚡ Upgrade
            </Link>
          )}
          {tier === 'monthly' && (
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
              <Link to="/pricing?highlight=yearly" style={{ padding: '0.6rem 1.25rem', background: '#2563eb', color: '#fff', borderRadius: '0.75rem', fontWeight: 700, fontSize: '0.875rem', textDecoration: 'none' }}>
                ↑ Upgrade to Yearly
              </Link>
              {CANCEL_API && (
                cancelScheduled
                  ? <span style={{ padding: '0.6rem 1.25rem', background: '#f0fdf4', color: '#15803d', border: '1px solid #86efac', borderRadius: '0.75rem', fontWeight: 700, fontSize: '0.875rem' }}>✓ Cancellation Scheduled</span>
                  : <button onClick={() => { setCancelError(''); setShowCancelModal(true) }} style={{ padding: '0.6rem 1.25rem', background: '#fff', color: '#dc2626', border: '1px solid #fca5a5', borderRadius: '0.75rem', fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer' }}>Cancel Plan</button>
              )}
            </div>
          )}
          {tier === 'yearly' && CANCEL_API && (
            cancelScheduled
              ? <span style={{ padding: '0.6rem 1.25rem', background: '#f0fdf4', color: '#15803d', border: '1px solid #86efac', borderRadius: '0.75rem', fontWeight: 700, fontSize: '0.875rem' }}>✓ Cancellation Scheduled</span>
              : <button onClick={() => { setCancelError(''); setShowCancelModal(true) }} style={{ padding: '0.6rem 1.25rem', background: '#fff', color: '#dc2626', border: '1px solid #fca5a5', borderRadius: '0.75rem', fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer' }}>Cancel Plan</button>
          )}
          {isFullAccess && (
            <div style={{ padding: '0.5rem 1rem', background: '#ffffff80', borderRadius: '0.75rem', fontSize: '0.875rem', fontWeight: 600, color: info.color }}>
              ✅ Full Access Unlocked
            </div>
          )}
        </div>

        {/* Monthly: current cert card */}
        {tier === 'monthly' && (() => {
          if (monthlyCert === undefined) return (
            <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '1rem', padding: '1.25rem 1.5rem', marginBottom: '1.5rem' }}>
              <div style={{ background: '#e5e7eb', borderRadius: '0.5rem', height: '1rem', width: '55%', marginBottom: '0.5rem' }} />
              <div style={{ background: '#e5e7eb', borderRadius: '0.5rem', height: '0.75rem', width: '75%', marginBottom: '0.75rem' }} />
              <div style={{ background: '#e5e7eb', borderRadius: '0.6rem', height: '2rem', width: '9rem' }} />
            </div>
          )
          if (!monthlyCert) {
            return (
              <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '1rem', padding: '1.25rem 1.5rem', marginBottom: '1.5rem' }}>
                <div style={{ fontWeight: 700, color: '#92400e', fontSize: '0.95rem', marginBottom: '0.3rem' }}>📋 No certification selected yet</div>
                <div style={{ color: '#78350f', fontSize: '0.85rem', marginBottom: '0.75rem' }}>Pick a cert below to start practicing. You can switch once every 30 days.</div>
                <Link to="/certifications" style={{ display: 'inline-block', padding: '0.5rem 1.1rem', background: '#d97706', color: '#fff', borderRadius: '0.6rem', fontWeight: 700, fontSize: '0.85rem', textDecoration: 'none' }}>
                  Choose a Certification →
                </Link>
              </div>
            )
          }
          const meta = CERT_META[monthlyCert.cert_id]
          const selectedAt = new Date(monthlyCert.selected_at)
          const nextSwitch = new Date(selectedAt.getTime() + 30 * 24 * 60 * 60 * 1000)
          const now = new Date()
          const canSwitch = now >= nextSwitch
          const daysLeft = Math.ceil((nextSwitch.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
          return (
            <div style={{ background: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: '1rem', padding: '1.25rem 1.5rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{ fontSize: '2rem' }}>{meta?.icon ?? '📋'}</span>
                <div>
                  <div style={{ fontSize: '0.72rem', fontWeight: 600, color: '#0369a1', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.1rem' }}>Your Current Certification</div>
                  <div style={{ fontWeight: 800, color: '#0c4a6e', fontSize: '1rem' }}>{meta?.name ?? monthlyCert.cert_id}</div>
                  <div style={{ fontSize: '0.78rem', color: '#0369a1', marginTop: '0.15rem' }}>
                    {meta?.code} · Selected {selectedAt.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </div>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                {canSwitch ? (
                  <Link to="/certifications" style={{ display: 'inline-block', padding: '0.5rem 1.1rem', background: '#0284c7', color: '#fff', borderRadius: '0.6rem', fontWeight: 700, fontSize: '0.82rem', textDecoration: 'none' }}>
                    🔄 Switch Certification
                  </Link>
                ) : (
                  <div style={{ fontSize: '0.8rem', color: '#0369a1', fontWeight: 600 }}>
                    🔒 Switch available in <strong>{daysLeft} day{daysLeft !== 1 ? 's' : ''}</strong>
                    <div style={{ fontSize: '0.72rem', color: '#7dd3fc', marginTop: '0.1rem' }}>
                      {nextSwitch.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )
        })()}

        {/* Stats row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
          {[
            { label: 'Certifications', value: '12', icon: '📋' },
            { label: 'Total Questions', value: '3,958', icon: '📝' },
            { label: 'Available to you', value: isFullAccess ? '3,958' : tier === 'monthly' ? '260' : '20', icon: '🔓' },
          ].map(stat => (
            <div key={stat.label} style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '0.875rem', padding: '1rem 1.25rem', textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>{stat.icon}</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#111827' }}>{stat.value}</div>
              <div style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.1rem' }}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Skill Radar Chart */}
        <SkillRadarChart
          certOptions={CERTS.map(c => ({ id: c.id, code: c.code, name: c.name }))}
          progressMap={buildProgressMap(progress)}
          domainScoresMap={buildDomainScoresMap(progress)}
        />

        {/* Progress section */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <h2 style={{ fontSize: '1.125rem', fontWeight: 800, color: '#111827', margin: 0 }}>Your Progress</h2>
            {progress.filter(p => p.questions_attempted > 0).length > 0 && (
              <span style={{ fontSize: '0.75rem', color: '#6b7280', fontWeight: 600 }}>
                {progress.filter(p => p.questions_attempted > 0).length} cert{progress.filter(p => p.questions_attempted > 0).length > 1 ? 's' : ''} practiced
              </span>
            )}
          </div>

          {progress.filter(p => p.questions_attempted > 0).length === 0 ? (
            /* Empty state */
            <div style={{ background: '#f9fafb', border: '1px dashed #d1d5db', borderRadius: '0.875rem', padding: '2rem', textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🎯</div>
              <p style={{ fontWeight: 700, color: '#374151', margin: '0 0 0.25rem' }}>No practice yet</p>
              <p style={{ fontSize: '0.82rem', color: '#6b7280', margin: '0 0 1rem' }}>
                Answer questions in any cert below — your scores will appear here.
              </p>
              <Link to={`/cert/saa-c03`} style={{ display: 'inline-block', padding: '0.5rem 1.25rem', background: '#2563eb', color: '#fff', borderRadius: '0.75rem', fontWeight: 700, fontSize: '0.85rem', textDecoration: 'none' }}>
                Start with SAA-C03 →
              </Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {progress
                .filter(p => p.questions_attempted > 0)
                .sort((a, b) => new Date(b.last_practiced).getTime() - new Date(a.last_practiced).getTime())
                .map(p => {
                  const meta = CERT_META[p.cert_id]
                  if (!meta) return null
                  const pct = Math.round((p.correct_answers / p.questions_attempted) * 100)
                  const scoreColor = pct >= 72 ? '#16a34a' : pct >= 50 ? '#d97706' : '#dc2626'
                  const scoreBg   = pct >= 72 ? '#f0fdf4' : pct >= 50 ? '#fffbeb' : '#fef2f2'
                  const practiced = new Date(p.last_practiced).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                  const passing = pct >= 72

                  return (
                    <Link
                      key={p.cert_id}
                      to={`/cert/${p.cert_id}`}
                      style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', background: '#fff', border: `1px solid ${passing ? '#bbf7d0' : '#e5e7eb'}`, borderRadius: '0.875rem', padding: '0.875rem 1.125rem', textDecoration: 'none', transition: 'border-color 0.15s' }}
                      onMouseEnter={e => (e.currentTarget.style.borderColor = '#93c5fd')}
                      onMouseLeave={e => (e.currentTarget.style.borderColor = passing ? '#bbf7d0' : '#e5e7eb')}
                    >
                      <span style={{ fontSize: '1.5rem', flexShrink: 0 }}>{meta.icon}</span>

                      <div style={{ flex: 1, minWidth: 0 }}>
                        {/* Top row */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                          <span style={{ fontWeight: 700, color: '#111827', fontSize: '0.875rem' }}>{meta.name}</span>
                          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexShrink: 0, marginLeft: '0.5rem' }}>
                            {passing && <span style={{ fontSize: '0.65rem', fontWeight: 700, color: '#16a34a', background: '#f0fdf4', border: '1px solid #bbf7d0', padding: '0.1rem 0.5rem', borderRadius: '999px' }}>✓ Passing</span>}
                            <span style={{ fontSize: '0.72rem', color: '#9ca3af' }}>Last: {practiced}</span>
                          </div>
                        </div>

                        {/* Progress bar with 72% threshold marker */}
                        <div style={{ position: 'relative', background: '#f3f4f6', borderRadius: '999px', height: '8px', overflow: 'visible' }}>
                          <div style={{ width: `${Math.min(pct, 100)}%`, height: '100%', background: scoreColor, borderRadius: '999px', transition: 'width 0.5s ease' }} />
                          {/* 72% passing line */}
                          <div style={{ position: 'absolute', top: '-3px', left: '72%', width: '2px', height: '14px', background: '#6b7280', borderRadius: '1px', opacity: 0.4 }} />
                        </div>

                        {/* Bottom row */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.3rem' }}>
                          <span style={{ fontSize: '0.72rem', color: '#6b7280' }}>
                            {p.correct_answers}/{p.questions_attempted} correct
                          </span>
                          <span style={{ fontSize: '0.75rem', fontWeight: 800, color: scoreColor, background: scoreBg, padding: '0.1rem 0.5rem', borderRadius: '999px' }}>
                            {pct}%
                          </span>
                        </div>
                      </div>
                    </Link>
                  )
                })}
            </div>
          )}
        </div>

        {/* Certifications grid */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <h2 style={{ fontSize: '1.125rem', fontWeight: 800, color: '#111827', margin: 0 }}>Practice by Certification</h2>
          {tier === 'free' && (
            <Link to="/pricing" style={{ fontSize: '0.78rem', fontWeight: 700, color: '#2563eb', textDecoration: 'none', background: '#eff6ff', border: '1px solid #bfdbfe', padding: '0.25rem 0.75rem', borderRadius: '999px' }}>
              ⚡ Upgrade to unlock
            </Link>
          )}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '0.875rem' }}>
          {CERTS.map(cert => {
            const certLink = tier === 'free' ? '/pricing' : `/cert/${cert.id}`
            const isLocked = tier === 'free'
            return (
              <Link key={cert.id} to={certLink}
                style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', background: '#fff', border: '1px solid #e5e7eb', borderRadius: '0.875rem', padding: '1rem 1.125rem', textDecoration: 'none', transition: 'border-color 0.15s', cursor: 'pointer', opacity: isLocked ? 0.7 : 1 }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = isLocked ? '#fca5a5' : '#93c5fd')}
                onMouseLeave={e => (e.currentTarget.style.borderColor = '#e5e7eb')}
              >
                <span style={{ fontSize: '1.75rem' }}>{cert.icon}</span>
                <div>
                  <div style={{ fontWeight: 700, color: '#111827', fontSize: '0.875rem', lineHeight: 1.3 }}>{cert.name}</div>
                  <div style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.2rem' }}>{cert.code} · {cert.level}</div>
                </div>
                <span style={{ marginLeft: 'auto', fontSize: '1.125rem', color: isLocked ? '#fca5a5' : '#93c5fd' }}>
                  {isLocked ? '🔒' : '→'}
                </span>
              </Link>
            )
          })}
        </div>

        {/* Quick links */}
        <div style={{ marginTop: '2rem', display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <Link to="/glossary" style={{ padding: '0.6rem 1.25rem', border: '1px solid #e5e7eb', borderRadius: '0.75rem', fontWeight: 600, fontSize: '0.875rem', color: '#374151', textDecoration: 'none', background: '#fff' }}>
            📖 Glossary
          </Link>
          <Link to="/resources" style={{ padding: '0.6rem 1.25rem', border: '1px solid #e5e7eb', borderRadius: '0.75rem', fontWeight: 600, fontSize: '0.875rem', color: '#374151', textDecoration: 'none', background: '#fff' }}>
            📚 Resources
          </Link>
          {!isFullAccess && (
            <Link to="/pricing" style={{ padding: '0.6rem 1.25rem', border: '1px solid #93c5fd', borderRadius: '0.75rem', fontWeight: 700, fontSize: '0.875rem', color: '#1d4ed8', textDecoration: 'none', background: '#eff6ff' }}>
              ⚡ View Plans
            </Link>
          )}
        </div>

      </div>

      {/* Security / MFA section */}
      {(
        <div style={{ marginTop: '2rem', background: '#fff', border: '1px solid #e5e7eb', borderRadius: '1rem', padding: '1.25rem 1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div style={{ fontWeight: 700, color: '#111827', fontSize: '0.95rem' }}>🔐 Two-Factor Authentication</div>
              <div style={{ fontSize: '0.8rem', color: '#6b7280', marginTop: '0.2rem' }}>
                {mfaEnabled ? '✅ Enabled — Google Authenticator / Authy' : 'Add an extra layer of security to your account'}
              </div>
            </div>
            {!mfaSetup && (
              <button
                onClick={mfaEnabled ? handleDisableMFA : handleEnableMFA}
                disabled={mfaLoading}
                style={{ padding: '0.5rem 1.1rem', background: mfaEnabled ? '#fff' : '#2563eb', color: mfaEnabled ? '#dc2626' : '#fff', border: mfaEnabled ? '1px solid #fca5a5' : 'none', borderRadius: '0.65rem', fontWeight: 600, fontSize: '0.82rem', cursor: mfaLoading ? 'not-allowed' : 'pointer' }}
              >
                {mfaLoading ? '…' : mfaEnabled ? 'Disable MFA' : 'Enable MFA'}
              </button>
            )}
          </div>

          {mfaSetup && mfaSecret && (
            <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #f3f4f6' }}>
              <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '0.5rem', padding: '0.65rem 0.85rem', marginBottom: '0.85rem', fontSize: '0.78rem', color: '#1e40af' }}>
                <strong>Step 1:</strong> Open <strong>Google Authenticator</strong> or <strong>Authy</strong> on your phone<br />
                <strong>Step 2:</strong> Tap <strong>+</strong> → <strong>Scan QR code</strong><br />
                <strong>Step 3:</strong> Point your phone at the code below
              </div>
              {qrCodeUrl && (
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
                  <img src={qrCodeUrl} alt="MFA QR Code" style={{ width: '180px', height: '180px', borderRadius: '0.5rem', border: '1px solid #e5e7eb' }} />
                </div>
              )}
              <p style={{ fontSize: '0.75rem', color: '#9ca3af', marginBottom: '0.4rem', textAlign: 'center' }}>
                Can't scan? Enter this key manually:
              </p>
              <div style={{ background: '#f3f4f6', borderRadius: '0.5rem', padding: '0.75rem 1rem', fontFamily: 'monospace', fontSize: '0.85rem', letterSpacing: '0.1em', wordBreak: 'break-all', marginBottom: '1rem', color: '#1d4ed8', fontWeight: 700, textAlign: 'center' }}>
                {mfaSecret}
              </div>
              <p style={{ fontSize: '0.78rem', color: '#6b7280', marginBottom: '0.75rem' }}>
                Then enter the 6-digit code your app shows:
              </p>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input
                  type="text"
                  value={mfaCode}
                  onChange={e => setMfaCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="000000"
                  maxLength={6}
                  style={{ flex: 1, padding: '0.6rem 0.75rem', fontSize: '1.1rem', letterSpacing: '0.3em', textAlign: 'center', border: '2px solid #e5e7eb', borderRadius: '0.5rem', outline: 'none' }}
                />
                <button onClick={handleVerifyMFA} disabled={mfaLoading || mfaCode.length < 6}
                  style={{ padding: '0.6rem 1rem', background: mfaCode.length < 6 ? '#93c5fd' : '#2563eb', color: '#fff', border: 'none', borderRadius: '0.5rem', fontWeight: 700, fontSize: '0.83rem', cursor: mfaCode.length < 6 ? 'not-allowed' : 'pointer' }}>
                  {mfaLoading ? '…' : 'Verify'}
                </button>
                <button onClick={() => { setMfaSetup(false); setMfaSecret(''); setMfaCode(''); setMfaError('') }}
                  style={{ padding: '0.6rem 0.75rem', background: '#f3f4f6', color: '#374151', border: '1px solid #e5e7eb', borderRadius: '0.5rem', fontWeight: 600, fontSize: '0.83rem', cursor: 'pointer' }}>
                  Cancel
                </button>
              </div>
              {mfaError && <p style={{ color: '#dc2626', fontSize: '0.8rem', marginTop: '0.5rem' }}>{mfaError}</p>}
            </div>
          )}
          {mfaError && !mfaSetup && <p style={{ color: '#dc2626', fontSize: '0.8rem', marginTop: '0.5rem' }}>{mfaError}</p>}
        </div>
      )}

      {/* AI Coach — Lifetime users only */}
      {tier === 'lifetime' && (
        <div style={{ background: 'linear-gradient(135deg, #0f172a, #1e3a8a)', borderRadius: '1.25rem', padding: '1.75rem', marginBottom: '1.5rem', boxShadow: '0 4px 24px rgba(0,0,0,0.15)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
            <span style={{ fontSize: '1.5rem' }}>🤖</span>
            <div>
              <div style={{ color: '#fff', fontWeight: 800, fontSize: '1rem' }}>AI Coach</div>
              <div style={{ color: '#93c5fd', fontSize: '0.78rem' }}>Exclusive to Lifetime · Ask anything AWS</div>
            </div>
          </div>

          {/* Chat messages */}
          <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '0.75rem', padding: '1rem', minHeight: '120px', maxHeight: '320px', overflowY: 'auto', marginBottom: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {coachMessages.length === 0 && (
              <div style={{ color: '#64748b', fontSize: '0.85rem', textAlign: 'center', marginTop: '2rem' }}>
                Ask me anything — AWS concepts, exam tips, service comparisons, why an answer is wrong…
              </div>
            )}
            {coachMessages.map((m, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
                <div style={{
                  maxWidth: '85%', padding: '0.6rem 0.9rem', borderRadius: m.role === 'user' ? '1rem 1rem 0.25rem 1rem' : '1rem 1rem 1rem 0.25rem',
                  background: m.role === 'user' ? '#2563eb' : 'rgba(255,255,255,0.1)',
                  color: '#fff', fontSize: '0.85rem', lineHeight: 1.5, whiteSpace: 'pre-wrap',
                }}>
                  {m.content}
                </div>
              </div>
            ))}
            {coachLoading && (
              <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: '1rem 1rem 1rem 0.25rem', padding: '0.6rem 0.9rem', color: '#93c5fd', fontSize: '0.85rem' }}>
                  Thinking…
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <input
              type="text"
              placeholder="e.g. What's the difference between SQS and SNS?"
              value={coachInput}
              onChange={e => setCoachInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && sendCoachMessage()}
              disabled={coachLoading}
              style={{
                flex: 1, padding: '0.65rem 1rem', borderRadius: '0.625rem',
                border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.1)',
                color: '#fff', fontSize: '0.875rem', outline: 'none',
              }}
            />
            <button
              onClick={sendCoachMessage}
              disabled={coachLoading || !coachInput.trim()}
              style={{
                padding: '0.65rem 1.25rem', background: '#2563eb', color: '#fff',
                fontWeight: 700, borderRadius: '0.625rem', border: 'none',
                cursor: coachLoading || !coachInput.trim() ? 'not-allowed' : 'pointer',
                opacity: coachLoading || !coachInput.trim() ? 0.6 : 1, fontSize: '0.875rem',
              }}
            >
              Ask →
            </button>
          </div>
        </div>
      )}

      {/* Cancel Subscription Modal */}
      {showCancelModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
          <div style={{ background: '#fff', borderRadius: '1rem', padding: '2rem', maxWidth: '420px', width: '100%', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>
            <div style={{ fontSize: '2.5rem', textAlign: 'center', marginBottom: '1rem' }}>⚠️</div>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#111827', textAlign: 'center', marginBottom: '0.5rem' }}>Cancel your subscription?</h2>
            <p style={{ color: '#6b7280', fontSize: '0.875rem', textAlign: 'center', lineHeight: 1.6, marginBottom: '1.5rem' }}>
              You'll keep full access until the end of your current billing period. After that, your account will revert to the free plan.
            </p>
            {cancelError && (
              <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '0.5rem', padding: '0.6rem 0.85rem', fontSize: '0.83rem', color: '#b91c1c', marginBottom: '1rem', textAlign: 'center' }}>
                {cancelError}
              </div>
            )}
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button
                onClick={() => setShowCancelModal(false)}
                disabled={cancelling}
                style={{ flex: 1, padding: '0.75rem', background: '#f3f4f6', color: '#374151', border: '1px solid #e5e7eb', borderRadius: '0.75rem', fontWeight: 700, fontSize: '0.875rem', cursor: 'pointer' }}
              >
                Keep My Plan
              </button>
              <button
                onClick={handleCancelSubscription}
                disabled={cancelling}
                style={{ flex: 1, padding: '0.75rem', background: cancelling ? '#fca5a5' : '#dc2626', color: '#fff', border: 'none', borderRadius: '0.75rem', fontWeight: 700, fontSize: '0.875rem', cursor: cancelling ? 'not-allowed' : 'pointer' }}
              >
                {cancelling ? 'Cancelling…' : 'Yes, Cancel'}
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  )
}
