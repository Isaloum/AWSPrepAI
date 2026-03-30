import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import Layout from '../components/Layout'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'

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
  const [monthlyCert, setMonthlyCert] = useState<{ cert_id: string; selected_at: string } | null | undefined>(undefined)

  useEffect(() => {
    if (!loading && !user) navigate('/login')
  }, [user, loading, navigate])

  useEffect(() => {
    if (!user || tier !== 'monthly') { setMonthlyCert(null); return }
    supabase
      .from('monthly_cert_selection')
      .select('cert_id, selected_at')
      .eq('user_id', user.id)
      .maybeSingle()
      .then(({ data }) => setMonthlyCert(data ?? null))
  }, [user, tier])

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
              <h1 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#111827', margin: 0 }}>Welcome back!</h1>
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
            <Link to="/pricing?highlight=yearly" style={{ padding: '0.6rem 1.25rem', background: '#2563eb', color: '#fff', borderRadius: '0.75rem', fontWeight: 700, fontSize: '0.875rem', textDecoration: 'none' }}>
              ↑ Upgrade to Yearly
            </Link>
          )}
          {isFullAccess && (
            <div style={{ padding: '0.5rem 1rem', background: '#ffffff80', borderRadius: '0.75rem', fontSize: '0.875rem', fontWeight: 600, color: info.color }}>
              ✅ Full Access Unlocked
            </div>
          )}
        </div>

        {/* Monthly: current cert card */}
        {tier === 'monthly' && monthlyCert !== undefined && (() => {
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
            { label: 'Total Questions', value: '3,120', icon: '❓' },
            { label: 'Available to you', value: isFullAccess ? '3,120' : tier === 'monthly' ? '260' : '20', icon: '🔓' },
          ].map(stat => (
            <div key={stat.label} style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '0.875rem', padding: '1rem 1.25rem', textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>{stat.icon}</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#111827' }}>{stat.value}</div>
              <div style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.1rem' }}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Certifications grid */}
        <h2 style={{ fontSize: '1.125rem', fontWeight: 800, color: '#111827', marginBottom: '1rem' }}>Practice by Certification</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '0.875rem' }}>
          {CERTS.map(cert => (
            <Link key={cert.id} to={`/cert/${cert.id}`} style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', background: '#fff', border: '1px solid #e5e7eb', borderRadius: '0.875rem', padding: '1rem 1.125rem', textDecoration: 'none', transition: 'border-color 0.15s', cursor: 'pointer' }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = '#93c5fd')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = '#e5e7eb')}
            >
              <span style={{ fontSize: '1.75rem' }}>{cert.icon}</span>
              <div>
                <div style={{ fontWeight: 700, color: '#111827', fontSize: '0.875rem', lineHeight: 1.3 }}>{cert.name}</div>
                <div style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.2rem' }}>{cert.code} · {cert.level}</div>
              </div>
              <span style={{ marginLeft: 'auto', color: '#93c5fd', fontSize: '1.125rem' }}>→</span>
            </Link>
          ))}
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
    </Layout>
  )
}
