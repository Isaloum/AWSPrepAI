import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate, Link, useSearchParams } from 'react-router-dom'
import Layout from '../components/Layout'
import Paywall from '../components/Paywall'
import { useAuth } from '../contexts/AuthContext'
import { getFreeUsage, updateFreeUsage, getMonthlyCert, setMonthlyCert, updateProgress } from '../lib/db'

interface Question {
  cat: string
  q: string
  options: string[]
  answer: number
  explain: string
  hint?: string
  keywords?: string[]
}

const certMeta: Record<string, { name: string; code: string; icon: string; domains: Record<string, string> }> = {
  'saa-c03': { name: 'Solutions Architect Associate', code: 'SAA-C03', icon: '🏗️', domains: { 'secure-arch': 'Secure', 'resilient-arch': 'Resilient', 'high-perf-arch': 'Performant', 'cost-optimized-arch': 'Cost-Optimized' } },
  'clf-c02': { name: 'Cloud Practitioner', code: 'CLF-C02', icon: '☁️', domains: { 'cloud-concepts': 'Cloud Concepts', 'security-compliance': 'Security', 'cloud-technology': 'Technology', 'billing-pricing': 'Billing' } },
  'aif-c01': { name: 'AI Practitioner', code: 'AIF-C01', icon: '🤖', domains: { 'ai-fundamentals': 'AI Fundamentals', 'generative-ai': 'Generative AI', 'foundation-models': 'Foundation Models', 'responsible-ai': 'Responsible AI', 'ai-security': 'Security' } },
  'dva-c02': { name: 'Developer Associate', code: 'DVA-C02', icon: '💻', domains: { 'development': 'Development', 'security': 'Security', 'deployment': 'Deployment', 'troubleshooting': 'Troubleshooting' } },
  'soa-c02': { name: 'SysOps Administrator', code: 'SOA-C02', icon: '⚙️', domains: { 'monitoring': 'Monitoring', 'reliability': 'Reliability', 'deployment': 'Deployment', 'networking': 'Networking', 'security': 'Security' } },
  'dea-c01': { name: 'Data Engineer Associate', code: 'DEA-C01', icon: '📊', domains: { 'data-ingestion-transformation': 'Ingestion', 'data-store-management': 'Data Store', 'data-operations': 'Operations', 'data-security-governance': 'Security' } },
  'mla-c01': { name: 'ML Engineer Associate', code: 'MLA-C01', icon: '🧠', domains: { 'data-preparation': 'Data Prep', 'model-development': 'Model Dev', 'deployment-orchestration': 'Deployment', 'monitoring-governance': 'Monitoring' } },
  'gai-c01': { name: 'Generative AI Developer', code: 'GAI-C01', icon: '✨', domains: { 'gen-ai-fundamentals': 'Gen AI Fundamentals', 'bedrock': 'Bedrock', 'foundation-models': 'Foundation Models', 'responsible-ai': 'Responsible AI' } },
  'sap-c02': { name: 'Solutions Architect Professional', code: 'SAP-C02', icon: '🏆', domains: { 'complex-org-design': 'Org Design', 'new-solutions': 'New Solutions', 'migration-modernization': 'Migration', 'cost-complexity': 'Cost' } },
  'dop-c02': { name: 'DevOps Engineer Professional', code: 'DOP-C02', icon: '🔧', domains: { 'sdlc-automation': 'SDLC', 'configuration-management': 'Config', 'monitoring-logging': 'Monitoring', 'high-availability': 'High Availability' } },
  'scs-c03': { name: 'Security Specialty', code: 'SCS-C03', icon: '🔒', domains: { 'threat-detection': 'Threat Detection', 'iam': 'IAM', 'data-protection': 'Data Protection', 'infrastructure-security': 'Infrastructure' } },
  'ans-c01': { name: 'Advanced Networking Specialty', code: 'ANS-C01', icon: '🌐', domains: { 'network-design': 'Design', 'network-implementation': 'Implementation', 'network-management': 'Management', 'network-security': 'Security' } },
}

const FREE_LIMIT = 20

export default function CertDetail() {
  const { certId } = useParams<{ certId: string }>()
  const navigate = useNavigate()
  const { tier, user, loading } = useAuth()

  const [questions, setQuestions] = useState<Question[]>([])
  const [filtered, setFiltered] = useState<Question[]>([])
  const [current, setCurrent] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [revealed, setRevealed] = useState(false)
  const [score, setScore] = useState(0)
  const [answered, setAnswered] = useState(0)
  const [searchParams] = useSearchParams()
  const [domainFilter, setDomainFilter] = useState(searchParams.get('domain') || 'all')
  const [showResults, setShowResults] = useState(false)
  const [showPaywall, setShowPaywall] = useState(false)
  const [_wrongQuestions, setWrongQuestions] = useState<Question[]>([])

  // Free tier usage (total across all certs)
  const [usedCount, setUsedCount] = useState(0)
  const [usageLoaded, setUsageLoaded] = useState(false)

  // Monthly cert selection
  const [monthlySelection, setMonthlySelection] = useState<{ cert_id: string; selected_at: string } | null>(null)
  const [monthlyLoaded, setMonthlyLoaded] = useState(false)
  const [switching, setSwitching] = useState(false)
  const [showHint, setShowHint] = useState(false)

  const meta = certMeta[certId || ''] || { name: 'Unknown', code: '', icon: '❓', domains: {} }

  // Redirect if not logged in
  useEffect(() => {
    if (!loading && !user) navigate('/signup')
  }, [loading, user, navigate])

  // Load questions
  useEffect(() => {
    if (!certId || !certMeta[certId]) { navigate('/certifications'); return }
    import(`../data/${certId}.json`).then((mod) => {
      const qs: Question[] = mod.default
      setQuestions(qs)
      setFiltered(qs)
    }).catch(() => navigate('/certifications'))
  }, [certId, navigate])

  // Load free usage (free tier only)
  useEffect(() => {
    if (!user || tier !== 'free') { setUsageLoaded(true); return }
    getFreeUsage(user.accessToken).then((data) => {
      setUsedCount(data?.count ?? 0)
      setUsageLoaded(true)
    }).catch(() => {
      // DB unavailable — default to 0 usage, let user practice
      setUsedCount(0)
      setUsageLoaded(true)
    })
  }, [user, tier])

  // Load monthly cert selection (monthly tier only)
  useEffect(() => {
    if (!user || tier !== 'monthly') { setMonthlyLoaded(true); return }
    getMonthlyCert(user.accessToken).then((data) => {
      setMonthlySelection(data)
      setMonthlyLoaded(true)
    }).catch(() => {
      // DB unavailable — allow access without cert lock
      setMonthlySelection(null)
      setMonthlyLoaded(true)
    })
  }, [user, tier])

  useEffect(() => {
    if (domainFilter === 'all') setFiltered(questions)
    else setFiltered(questions.filter(q => q.cat === domainFilter))
    setCurrent(0); setSelected(null); setRevealed(false)
  }, [domainFilter, questions])

  const canSwitchMonthly = () => {
    if (!monthlySelection) return true // no cert selected yet
    const selected_at = new Date(monthlySelection.selected_at)
    const now = new Date()
    const diffDays = (now.getTime() - selected_at.getTime()) / (1000 * 60 * 60 * 24)
    return diffDays >= 30
  }

  const handleSelectMonthlyCert = async () => {
    if (!user || !certId) return
    setSwitching(true)
    await setMonthlyCert(certId, user.accessToken)
    setMonthlySelection({ cert_id: certId, selected_at: new Date().toISOString() })
    setSwitching(false)
  }

  const handleSelect = useCallback((idx: number) => {
    if (revealed) return
    setSelected(idx)
  }, [revealed])

  const handleReveal = useCallback(async () => {
    if (selected === null) return
    if (tier === 'free' && usedCount >= FREE_LIMIT) { setShowPaywall(true); return }

    setRevealed(true)
    setAnswered(a => a + 1)
    if (selected === filtered[current].answer) setScore(s => s + 1)
    else setWrongQuestions(w => [...w, filtered[current]])

    // Persist free usage
    if (tier === 'free' && user) {
      const newCount = usedCount + 1
      setUsedCount(newCount)
      await updateFreeUsage(certId || '', newCount, user.accessToken)
    }

    // Track progress for all authenticated users
    if (user && certId) {
      updateProgress(certId, selected === filtered[current].answer, user.accessToken).catch(() => {})
    }
  }, [selected, revealed, filtered, current, tier, usedCount, user, certId])

  const handleNext = useCallback(() => {
    if (tier === 'free' && usedCount >= FREE_LIMIT) { setShowPaywall(true); return }
    if (current + 1 >= filtered.length) setShowResults(true)
    else { setCurrent(c => c + 1); setSelected(null); setRevealed(false); setShowHint(false) }
  }, [current, filtered.length, tier, usedCount])

  const handlePrev = () => {
    if (current > 0) { setCurrent(c => c - 1); setSelected(null); setRevealed(false); setShowHint(false) }
  }

  const restart = () => {
    setCurrent(0); setSelected(null); setRevealed(false)
    setScore(0); setAnswered(0)
    setShowResults(false); setWrongQuestions([])
  }

  // ── Loading state ──
  const isLoading = questions.length === 0
    || (!loading && !user)
    || (tier === 'free' && !usageLoaded)
    || (tier === 'monthly' && !monthlyLoaded)

  if (isLoading) {
    return (
      <Layout>
        <div style={{ minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>⚙️</div>
            <p style={{ color: '#6b7280' }}>Loading questions...</p>
          </div>
        </div>
      </Layout>
    )
  }

  // ── Monthly: locked cert screen ──
  if (tier === 'monthly' && monthlySelection && monthlySelection.cert_id !== certId) {
    const lockedMeta = certMeta[monthlySelection.cert_id] || { name: monthlySelection.cert_id, code: '', icon: '📝' }
    const canSwitch = canSwitchMonthly()
    const selectedAt = new Date(monthlySelection.selected_at)
    const nextSwitch = new Date(selectedAt.getTime() + 30 * 24 * 60 * 60 * 1000)
    const daysLeft = Math.ceil((nextSwitch.getTime() - Date.now()) / (1000 * 60 * 60 * 24))

    return (
      <Layout>
        <div style={{ maxWidth: '520px', margin: '4rem auto', padding: '0 1.5rem', textAlign: 'center' }}>
          <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '1.5rem', padding: '3rem 2rem', boxShadow: '0 4px 24px rgba(0,0,0,0.07)' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔒</div>
            <h1 style={{ fontSize: '1.4rem', fontWeight: 900, color: '#111827', marginBottom: '0.5rem' }}>Monthly Plan — 1 Cert at a Time</h1>
            <p style={{ color: '#6b7280', fontSize: '0.9rem', lineHeight: 1.65, marginBottom: '1.75rem' }}>
              Your current cert is <strong>{lockedMeta.icon} {lockedMeta.code} — {lockedMeta.name}</strong>. Monthly plan allows 1 active certification at a time.
            </p>

            <Link to={`/cert/${monthlySelection.cert_id}`}
              style={{ display: 'block', padding: '0.875rem', background: '#2563eb', color: '#fff', borderRadius: '0.875rem', fontWeight: 700, textDecoration: 'none', fontSize: '0.95rem', marginBottom: '1rem' }}>
              Go to {lockedMeta.code} →
            </Link>

            {canSwitch ? (
              <button
                onClick={handleSelectMonthlyCert}
                disabled={switching}
                style={{ width: '100%', padding: '0.875rem', background: '#f3f4f6', color: '#374151', borderRadius: '0.875rem', fontWeight: 700, border: 'none', cursor: 'pointer', fontSize: '0.95rem', marginBottom: '1rem' }}>
                {switching ? 'Switching...' : `Switch to ${meta.code}`}
              </button>
            ) : (
              <div style={{ background: '#fef3c7', border: '1px solid #fde68a', borderRadius: '0.875rem', padding: '0.875rem', marginBottom: '1rem' }}>
                <p style={{ fontSize: '0.82rem', color: '#92400e', margin: 0, fontWeight: 600 }}>
                  Next switch available in <strong>{daysLeft} days</strong>
                </p>
              </div>
            )}

            <Link to="/pricing"
              style={{ display: 'block', fontSize: '0.82rem', color: '#2563eb', fontWeight: 600, textDecoration: 'none' }}>
              Upgrade to Yearly for all 12 certs →
            </Link>
          </div>
        </div>
      </Layout>
    )
  }

  // ── Monthly: no cert selected yet — prompt to select this one ──
  if (tier === 'monthly' && !monthlySelection) {
    return (
      <Layout>
        <div style={{ maxWidth: '520px', margin: '4rem auto', padding: '0 1.5rem', textAlign: 'center' }}>
          <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '1.5rem', padding: '3rem 2rem', boxShadow: '0 4px 24px rgba(0,0,0,0.07)' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>{meta.icon}</div>
            <h1 style={{ fontSize: '1.4rem', fontWeight: 900, color: '#111827', marginBottom: '0.5rem' }}>Activate Your Cert</h1>
            <p style={{ color: '#6b7280', fontSize: '0.9rem', lineHeight: 1.65, marginBottom: '1.75rem' }}>
              Your Monthly plan includes <strong>1 certification at a time</strong>. You're about to activate <strong>{meta.code} — {meta.name}</strong>.
              <br /><br />
              You get 1 switch per month, so choose wisely.
            </p>
            <button
              onClick={handleSelectMonthlyCert}
              disabled={switching}
              style={{ width: '100%', padding: '0.875rem', background: '#2563eb', color: '#fff', borderRadius: '0.875rem', fontWeight: 700, border: 'none', cursor: 'pointer', fontSize: '0.95rem', marginBottom: '1rem' }}>
              {switching ? 'Activating...' : `Activate ${meta.code}`}
            </button>
            <Link to="/certifications" style={{ display: 'block', fontSize: '0.82rem', color: '#6b7280', textDecoration: 'none' }}>
              ← Choose a different cert
            </Link>
          </div>
        </div>
      </Layout>
    )
  }

  const q = filtered[current]
  const progress = filtered.length > 0 ? Math.round(((current + 1) / filtered.length) * 100) : 0
  const scorePercent = answered > 0 ? Math.round((score / answered) * 100) : 0
  const domains = Object.entries(meta.domains)
  const freeRemaining = FREE_LIMIT - usedCount

  // Results screen
  if (showResults) {
    const passed = scorePercent >= 72
    return (
      <Layout>
        <div style={{ maxWidth: '600px', margin: '0 auto', padding: '3rem 1.5rem' }}>
          <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '1.5rem', padding: '3rem', textAlign: 'center', boxShadow: '0 4px 24px rgba(0,0,0,0.07)' }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>{passed ? '🎉' : '📚'}</div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 900, color: '#111827', marginBottom: '0.25rem' }}>{passed ? 'Great Work!' : 'Keep Practicing'}</h1>
            <p style={{ color: '#6b7280', marginBottom: '2rem' }}>{meta.icon} {meta.name}</p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '3rem', marginBottom: '2rem' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2.5rem', fontWeight: 900, color: passed ? '#16a34a' : '#ef4444' }}>{scorePercent}%</div>
                <div style={{ fontSize: '0.75rem', color: '#9ca3af', textTransform: 'uppercase', fontWeight: 700, marginTop: '0.25rem' }}>Score</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#1f2937' }}>{score}/{answered}</div>
                <div style={{ fontSize: '0.75rem', color: '#9ca3af', textTransform: 'uppercase', fontWeight: 700, marginTop: '0.25rem' }}>Correct</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#3b82f6' }}>72%</div>
                <div style={{ fontSize: '0.75rem', color: '#9ca3af', textTransform: 'uppercase', fontWeight: 700, marginTop: '0.25rem' }}>Pass Mark</div>
              </div>
            </div>
            <div style={{ background: '#f3f4f6', borderRadius: '9999px', height: '12px', marginBottom: '2rem' }}>
              <div style={{ background: passed ? '#22c55e' : '#f87171', height: '12px', borderRadius: '9999px', width: `${scorePercent}%`, transition: 'width 0.5s' }} />
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button onClick={restart} style={{ padding: '0.75rem 2rem', background: '#3b82f6', color: '#fff', fontWeight: 700, borderRadius: '0.75rem', border: 'none', cursor: 'pointer', fontSize: '0.95rem' }}>Practice Again</button>
              <button onClick={() => navigate('/certifications')} style={{ padding: '0.75rem 2rem', background: '#f3f4f6', color: '#374151', fontWeight: 700, borderRadius: '0.75rem', border: 'none', cursor: 'pointer', fontSize: '0.95rem' }}>All Certs</button>
            </div>
          </div>
        </div>
      </Layout>
    )
  }

  if (!q) return null

  const optionColors = (i: number) => {
    if (!revealed) {
      if (i === selected) return { background: '#eff6ff', border: '2px solid #3b82f6', color: '#1e40af' }
      return { background: '#fff', border: '2px solid #e5e7eb', color: '#374151' }
    }
    if (i === q.answer) return { background: '#f0fdf4', border: '2px solid #22c55e', color: '#15803d' }
    if (i === selected) return { background: '#fef2f2', border: '2px solid #ef4444', color: '#b91c1c' }
    return { background: '#f9fafb', border: '2px solid #f3f4f6', color: '#9ca3af' }
  }

  return (
    <Layout>
      {showPaywall && <Paywall reason="free-user" onClose={() => setShowPaywall(false)} />}

      {/* Header bar */}
      <div style={{ background: '#fff', borderBottom: '1px solid #e5e7eb', padding: '0.875rem 2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button onClick={() => navigate('/certifications')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280', fontSize: '0.875rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
          ← Back
        </button>
        <span style={{ color: '#d1d5db' }}>|</span>
        <span style={{ fontWeight: 800, color: '#111827', fontSize: '0.875rem' }}>{meta.icon} {meta.code} — {meta.name}</span>
        <span style={{ fontSize: '0.6rem', fontWeight: 800, background: '#dcfce7', color: '#15803d', padding: '2px 8px', borderRadius: '4px', letterSpacing: '0.08em', textTransform: 'uppercase', border: '1px solid #bbf7d0' }}>PRACTICE</span>
        {tier === 'monthly' && (
          <span style={{ fontSize: '0.7rem', fontWeight: 700, background: '#dbeafe', color: '#1d4ed8', padding: '0.2rem 0.6rem', borderRadius: '999px' }}>Monthly — Active Cert</span>
        )}
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>
            <span style={{ fontWeight: 800, color: '#3b82f6', fontSize: '1rem' }}>{score}</span> correct &nbsp;·&nbsp; {answered} answered
          </span>
          {answered > 0 && (
            <span style={{ fontSize: '0.875rem', fontWeight: 700, color: scorePercent >= 72 ? '#16a34a' : '#2563eb' }}>{scorePercent}%</span>
          )}
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ height: '4px', background: '#e5e7eb', width: '100%' }}>
        <div style={{ height: '4px', background: '#3b82f6', width: `${progress}%`, transition: 'width 0.3s' }} />
      </div>

      {/* Main content */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '2rem', maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>

        {/* LEFT */}
        <div>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
            <button onClick={() => setDomainFilter('all')}
              style={{ padding: '0.4rem 1rem', borderRadius: '9999px', fontSize: '0.8rem', fontWeight: 700, border: 'none', cursor: 'pointer', background: domainFilter === 'all' ? '#111827' : '#fff', color: domainFilter === 'all' ? '#fff' : '#6b7280', boxShadow: domainFilter === 'all' ? 'none' : '0 0 0 1px #e5e7eb' }}>
              All ({questions.length})
            </button>
            {domains.map(([cat, label]) => {
              const count = questions.filter(q => q.cat === cat).length
              if (count === 0) return null
              const active = domainFilter === cat
              return (
                <button key={cat} onClick={() => setDomainFilter(cat)}
                  style={{ padding: '0.4rem 1rem', borderRadius: '9999px', fontSize: '0.8rem', fontWeight: 700, border: 'none', cursor: 'pointer', background: active ? '#111827' : '#fff', color: active ? '#fff' : '#6b7280', boxShadow: active ? 'none' : '0 0 0 1px #e5e7eb' }}>
                  {label} ({count})
                </button>
              )
            })}
          </div>

          <div style={{ background: '#fff', borderRadius: '1.25rem', border: '1px solid #e5e7eb', boxShadow: '0 4px 20px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
            <div style={{ padding: '1.25rem 1.75rem', borderBottom: '1px solid #f3f4f6', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#3b82f6', background: '#eff6ff', padding: '0.25rem 0.75rem', borderRadius: '9999px' }}>
                {meta.domains[q.cat] || q.cat}
              </span>
              <span style={{ fontSize: '0.8rem', color: '#9ca3af', fontWeight: 600 }}>{current + 1} / {filtered.length}</span>
            </div>

            <div style={{ padding: '1.75rem 1.75rem 1.25rem' }}>
              <p style={{ fontSize: '1.05rem', fontWeight: 600, color: '#111827', lineHeight: 1.65, margin: 0 }}>{q.q}</p>
              {q.hint && !revealed && (
                <div style={{ marginTop: '1rem' }}>
                  <button onClick={() => setShowHint(h => !h)}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '5px 14px', fontSize: '0.78rem', fontWeight: 700, color: '#d97706', background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '999px', cursor: 'pointer' }}>
                    💡 {showHint ? 'Hide Hint' : 'Show Thinking Path'}
                  </button>
                  {showHint && (
                    <div style={{ marginTop: '0.75rem', background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '0.75rem', padding: '1rem 1.25rem' }}>
                      <p style={{ fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#d97706', marginBottom: '0.5rem' }}>Thinking Path</p>
                      <p style={{ fontSize: '0.875rem', color: '#78350f', lineHeight: 1.65, margin: 0 }}>{q.hint}</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div style={{ padding: '0 1.75rem 1.75rem', display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
              {q.options.map((opt, i) => (
                <button key={i} onClick={() => handleSelect(i)} disabled={revealed}
                  style={{ width: '100%', textAlign: 'left', padding: '1rem 1.25rem', borderRadius: '0.875rem', fontSize: '0.925rem', fontWeight: 500, cursor: revealed ? 'default' : 'pointer', transition: 'all 0.15s', display: 'flex', alignItems: 'flex-start', gap: '0.75rem', ...optionColors(i) }}>
                  <span style={{ fontWeight: 800, minWidth: '1.5rem', flexShrink: 0 }}>{String.fromCharCode(65 + i)}.</span>
                  <span>{opt}</span>
                  {revealed && i === q.answer && <span style={{ marginLeft: 'auto', color: '#16a34a', fontWeight: 800, flexShrink: 0 }}>✓</span>}
                  {revealed && i === selected && i !== q.answer && <span style={{ marginLeft: 'auto', color: '#ef4444', fontWeight: 800, flexShrink: 0 }}>✗</span>}
                </button>
              ))}
            </div>

            {revealed && (
              <div style={{ margin: '0 1.75rem 1.75rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '0.875rem', padding: '1.25rem' }}>
                  <p style={{ fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#3b82f6', marginBottom: '0.5rem' }}>Explanation</p>
                  <p style={{ fontSize: '0.9rem', color: '#1e40af', lineHeight: 1.6, margin: 0 }}>{q.explain}</p>
                </div>
                {q.keywords && q.keywords.length > 0 && (
                  <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '0.875rem', padding: '1.25rem' }}>
                    <p style={{ fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#16a34a', marginBottom: '0.625rem' }}>Keywords &amp; Terms</p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                      {q.keywords.map((kw, i) => (
                        <span key={i} style={{ fontSize: '0.75rem', fontWeight: 600, color: '#166534', background: '#dcfce7', border: '1px solid #bbf7d0', borderRadius: '999px', padding: '2px 10px' }}>{kw}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {tier === 'free' && freeRemaining <= 5 && freeRemaining > 0 && (
            <div style={{ marginTop: '1rem', background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '0.875rem', padding: '0.875rem 1.25rem', fontSize: '0.875rem', color: '#1e3a8a', fontWeight: 500 }}>
              ⚠️ <strong>{freeRemaining} free questions left.</strong> Upgrade to unlock all questions.
            </div>
          )}

          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.25rem' }}>
            <button onClick={handlePrev} disabled={current === 0}
              style={{ padding: '0.875rem 1.5rem', border: '1.5px solid #e5e7eb', background: '#fff', color: '#6b7280', fontWeight: 700, borderRadius: '0.875rem', cursor: current === 0 ? 'not-allowed' : 'pointer', opacity: current === 0 ? 0.35 : 1, fontSize: '0.9rem' }}>
              ← Prev
            </button>
            {!revealed ? (
              <button onClick={handleReveal} disabled={selected === null}
                style={{ flex: 1, padding: '0.875rem', background: selected !== null ? '#3b82f6' : '#93c5fd', color: '#fff', fontWeight: 800, borderRadius: '0.875rem', border: 'none', cursor: selected !== null ? 'pointer' : 'not-allowed', fontSize: '0.95rem', transition: 'background 0.15s' }}>
                Submit Answer
              </button>
            ) : (
              <button onClick={handleNext}
                style={{ flex: 1, padding: '0.875rem', background: '#111827', color: '#fff', fontWeight: 800, borderRadius: '0.875rem', border: 'none', cursor: 'pointer', fontSize: '0.95rem' }}>
                {current + 1 >= filtered.length ? 'See Results 🎯' : 'Next Question →'}
              </button>
            )}
          </div>
        </div>

        {/* RIGHT: Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

          {/* Score card */}
          <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '1.25rem', padding: '1.5rem', boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
            <p style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: '#9ca3af', marginBottom: '1rem', letterSpacing: '0.06em' }}>Session Score</p>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <div>
                <div style={{ fontSize: '2.25rem', fontWeight: 900, color: scorePercent >= 72 ? '#16a34a' : answered === 0 ? '#111827' : '#3b82f6' }}>
                  {answered === 0 ? '—' : `${scorePercent}%`}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#6b7280', fontWeight: 600 }}>Current score</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '2.25rem', fontWeight: 900, color: '#3b82f6' }}>{score}/{answered}</div>
                <div style={{ fontSize: '0.75rem', color: '#6b7280', fontWeight: 600 }}>Correct</div>
              </div>
            </div>
            {answered > 0 && (
              <>
                <div style={{ background: '#f3f4f6', borderRadius: '9999px', height: '8px', marginBottom: '0.5rem' }}>
                  <div style={{ height: '8px', borderRadius: '9999px', background: scorePercent >= 72 ? '#22c55e' : '#3b82f6', width: `${scorePercent}%`, transition: 'width 0.4s' }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: '#9ca3af', fontWeight: 600 }}>
                  <span>0%</span><span style={{ color: '#3b82f6', fontWeight: 800 }}>72% to pass</span><span>100%</span>
                </div>
              </>
            )}
          </div>

          {/* Progress card */}
          <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '1.25rem', padding: '1.5rem', boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
            <p style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: '#9ca3af', marginBottom: '1rem', letterSpacing: '0.06em' }}>Progress</p>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '0.875rem', color: '#374151', fontWeight: 600 }}>Question {current + 1} of {filtered.length}</span>
              <span style={{ fontSize: '0.875rem', fontWeight: 800, color: '#3b82f6' }}>{progress}%</span>
            </div>
            <div style={{ background: '#f3f4f6', borderRadius: '9999px', height: '8px' }}>
              <div style={{ height: '8px', borderRadius: '9999px', background: '#3b82f6', width: `${progress}%`, transition: 'width 0.3s' }} />
            </div>
          </div>

          {/* Free tier card */}
          {tier === 'free' && (
            <div style={{ background: 'linear-gradient(135deg, #eff6ff, #f0fdf4)', border: '1px solid #bfdbfe', borderRadius: '1.25rem', padding: '1.5rem' }}>
              <p style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: '#3b82f6', marginBottom: '0.75rem', letterSpacing: '0.06em' }}>Free Tier</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.875rem', color: '#374151', fontWeight: 600 }}>{usedCount} / {FREE_LIMIT} used</span>
                <span style={{ fontSize: '0.875rem', fontWeight: 800, color: freeRemaining === 0 ? '#ef4444' : '#3b82f6' }}>
                  {freeRemaining === 0 ? 'Limit reached' : `${freeRemaining} left`}
                </span>
              </div>
              <div style={{ background: '#dbeafe', borderRadius: '9999px', height: '6px', marginBottom: '1rem' }}>
                <div style={{ height: '6px', borderRadius: '9999px', background: freeRemaining === 0 ? '#ef4444' : '#3b82f6', width: `${(usedCount / FREE_LIMIT) * 100}%`, transition: 'width 0.3s' }} />
              </div>
              <button onClick={() => navigate('/pricing')}
                style={{ width: '100%', padding: '0.625rem', background: '#3b82f6', color: '#fff', fontWeight: 700, borderRadius: '0.625rem', border: 'none', cursor: 'pointer', fontSize: '0.825rem' }}>
                Unlock All Questions →
              </button>
            </div>
          )}

          {/* Monthly plan card */}
          {tier === 'monthly' && (
            <div style={{ background: 'linear-gradient(135deg, #eff6ff, #dbeafe)', border: '1px solid #bfdbfe', borderRadius: '1.25rem', padding: '1.5rem' }}>
              <p style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: '#1d4ed8', marginBottom: '0.5rem', letterSpacing: '0.06em' }}>Monthly Plan</p>
              <p style={{ fontSize: '0.8rem', color: '#1e40af', margin: '0 0 0.75rem', fontWeight: 600 }}>Active: {meta.code}</p>
              <button onClick={() => navigate('/pricing')}
                style={{ width: '100%', padding: '0.625rem', background: '#2563eb', color: '#fff', fontWeight: 700, borderRadius: '0.625rem', border: 'none', cursor: 'pointer', fontSize: '0.825rem' }}>
                Upgrade to Yearly →
              </button>
            </div>
          )}

          {/* Tip card */}
          <div style={{ background: '#f9fafb', border: '1px solid #f3f4f6', borderRadius: '1.25rem', padding: '1.25rem' }}>
            <p style={{ fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', color: '#9ca3af', marginBottom: '0.5rem', letterSpacing: '0.06em' }}>💡 Exam Tip</p>
            <p style={{ fontSize: '0.825rem', color: '#6b7280', lineHeight: 1.55, margin: 0 }}>
              Read every option carefully. AWS exams often have 2 correct-sounding answers — the right one is the <strong>most cost-effective or operationally efficient</strong>.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  )
}
