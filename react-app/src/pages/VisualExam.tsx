import { useState, useRef, useEffect } from 'react'
import Layout from '../components/Layout'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

// ── Types ────────────────────────────────────────────────────────────────────
type DNode   = { id: string; label: string; icon: string; color: string; x: number; y: number }
type ConnKey = string   // "a:b" — always sorted alphabetically for uniqueness

interface Question {
  id:       number
  scenario: string
  task:     string
  hint:     string
  nodes:    DNode[]
  correct:  ConnKey[]
}

// ── Helpers ──────────────────────────────────────────────────────────────────
const ck = (a: string, b: string): ConnKey => [a, b].sort().join(':')

// ── Question Bank ────────────────────────────────────────────────────────────
const QUESTIONS: Question[] = [
  {
    id: 1,
    scenario: 'A company needs a highly available web app that auto-scales across 2 Availability Zones and distributes traffic evenly.',
    task: 'Draw connections to show how traffic flows from users through the load balancer to EC2 instances managed by Auto Scaling.',
    hint: 'Users → ALB → EC2 (AZ-A) + EC2 (AZ-B). ASG manages both EC2 instances.',
    nodes: [
      { id: 'users', label: 'Users',              icon: '👥', color: '#475569', x: 340, y: 55  },
      { id: 'alb',   label: 'App Load\nBalancer', icon: '⚖️', color: '#2563eb', x: 340, y: 185 },
      { id: 'ec2a',  label: 'EC2\n(AZ-A)',        icon: '🖥️', color: '#0891b2', x: 160, y: 320 },
      { id: 'ec2b',  label: 'EC2\n(AZ-B)',        icon: '🖥️', color: '#0891b2', x: 520, y: 320 },
      { id: 'asg',   label: 'Auto Scaling\nGroup',icon: '📈', color: '#16a34a', x: 340, y: 410 },
    ],
    correct: [ck('users','alb'), ck('alb','ec2a'), ck('alb','ec2b'), ck('asg','ec2a'), ck('asg','ec2b')],
  },
  {
    id: 2,
    scenario: 'A startup wants a fully serverless REST API that reads/writes to a NoSQL database — zero servers to manage.',
    task: 'Connect the services to show the request flow from client all the way to the database.',
    hint: 'Client → API Gateway → Lambda → DynamoDB',
    nodes: [
      { id: 'client', label: 'Client',           icon: '💻', color: '#475569', x: 90,  y: 220 },
      { id: 'apigw',  label: 'API\nGateway',     icon: '🔀', color: '#7c3aed', x: 270, y: 220 },
      { id: 'lambda', label: 'Lambda\nFunction', icon: 'λ',  color: '#ea580c', x: 460, y: 220 },
      { id: 'dynamo', label: 'DynamoDB',         icon: '🗄️', color: '#1A73E8', x: 630, y: 220 },
    ],
    correct: [ck('client','apigw'), ck('apigw','lambda'), ck('lambda','dynamo')],
  },
  {
    id: 3,
    scenario: 'A media company stores videos in S3 and needs to serve them globally with low latency using a Content Delivery Network.',
    task: 'Connect the services to show how global users receive content through the CDN from the origin bucket.',
    hint: 'Global Users → CloudFront → S3 Bucket',
    nodes: [
      { id: 'users', label: 'Global\nUsers',    icon: '🌍', color: '#475569', x: 110, y: 220 },
      { id: 'cf',    label: 'CloudFront\n(CDN)',icon: '🌐', color: '#FF9900', x: 350, y: 220 },
      { id: 's3',    label: 'S3\nBucket',       icon: '🪣', color: '#16a34a', x: 580, y: 220 },
    ],
    correct: [ck('users','cf'), ck('cf','s3')],
  },
  {
    id: 4,
    scenario: 'A 3-tier VPC app: web tier is public, app tier is private, database must be isolated from the internet.',
    task: 'Connect internet traffic through the load balancer and app servers down to the isolated database.',
    hint: 'Internet → ALB (public) → App EC2 (private) → RDS (isolated)',
    nodes: [
      { id: 'inet', label: 'Internet',            icon: '🌍', color: '#475569', x: 100, y: 180 },
      { id: 'alb',  label: 'App Load\nBalancer',  icon: '⚖️', color: '#2563eb', x: 290, y: 180 },
      { id: 'app',  label: 'App EC2\n(private)',  icon: '🖥️', color: '#0891b2', x: 490, y: 180 },
      { id: 'rds',  label: 'RDS\n(isolated)',     icon: '💾', color: '#7c3aed', x: 490, y: 370 },
    ],
    correct: [ck('inet','alb'), ck('alb','app'), ck('app','rds')],
  },
  {
    id: 5,
    scenario: 'Order events must reach three independent services (Billing, Inventory, Shipping) simultaneously — fan-out pattern.',
    task: 'Connect the order service so every event is delivered to all three SQS queues via a pub/sub topic.',
    hint: 'Order Service → SNS Topic → SQS (Billing), SQS (Inventory), SQS (Shipping)',
    nodes: [
      { id: 'prod',  label: 'Order\nService',    icon: '📡', color: '#475569', x: 100, y: 220 },
      { id: 'sns',   label: 'SNS\nTopic',        icon: '📢', color: '#FF9900', x: 300, y: 220 },
      { id: 'sqsa',  label: 'SQS\n(Billing)',    icon: '📬', color: '#dc2626', x: 520, y: 90  },
      { id: 'sqsb',  label: 'SQS\n(Inventory)', icon: '📬', color: '#dc2626', x: 520, y: 220 },
      { id: 'sqsc',  label: 'SQS\n(Shipping)',  icon: '📬', color: '#dc2626', x: 520, y: 355 },
    ],
    correct: [ck('prod','sns'), ck('sns','sqsa'), ck('sns','sqsb'), ck('sns','sqsc')],
  },
  {
    id: 6,
    scenario: 'Lambda processes jobs from a queue. Failed messages must be captured in a Dead Letter Queue for manual retry.',
    task: 'Connect the message flow from producer through the queue to Lambda, and the failure path to the DLQ.',
    hint: 'Producer → SQS → Lambda (success). SQS → DLQ (on failure).',
    nodes: [
      { id: 'prod',   label: 'Message\nProducer',  icon: '📡', color: '#475569', x: 100, y: 220 },
      { id: 'sqs',    label: 'SQS\nQueue',         icon: '📬', color: '#FF9900', x: 300, y: 220 },
      { id: 'lambda', label: 'Lambda\n(consumer)', icon: 'λ',  color: '#ea580c', x: 510, y: 110 },
      { id: 'dlq',    label: 'Dead Letter\nQueue', icon: '⚠️', color: '#dc2626', x: 510, y: 340 },
    ],
    correct: [ck('prod','sqs'), ck('sqs','lambda'), ck('sqs','dlq')],
  },
  {
    id: 7,
    scenario: 'A web app behind an ALB needs protection from SQL injection, XSS, and DDoS attacks using AWS managed services.',
    task: 'Connect internet traffic through the security services before it reaches the web server.',
    hint: 'Internet → WAF + Shield → ALB → EC2',
    nodes: [
      { id: 'inet', label: 'Internet',           icon: '🌍', color: '#475569', x: 90,  y: 220 },
      { id: 'waf',  label: 'AWS WAF\n+ Shield',  icon: '🛡️', color: '#dc2626', x: 270, y: 220 },
      { id: 'alb',  label: 'App Load\nBalancer', icon: '⚖️', color: '#2563eb', x: 460, y: 220 },
      { id: 'ec2',  label: 'EC2\nWeb Server',    icon: '🖥️', color: '#0891b2', x: 630, y: 220 },
    ],
    correct: [ck('inet','waf'), ck('waf','alb'), ck('alb','ec2')],
  },
  {
    id: 8,
    scenario: 'Logs are hot for 30 days, warm for 30–90 days, then cold. The company wants minimum-cost tiered storage using S3 lifecycle.',
    task: 'Connect the storage tiers in the correct lifecycle order from hot to archival.',
    hint: 'App → S3 Standard → S3 Standard-IA → S3 Glacier',
    nodes: [
      { id: 'app',     label: 'App\nLogs',         icon: '📋', color: '#475569', x: 90,  y: 220 },
      { id: 'std',     label: 'S3\nStandard',       icon: '🪣', color: '#16a34a', x: 270, y: 220 },
      { id: 'ia',      label: 'S3\nStandard-IA',    icon: '🗃️', color: '#ea580c', x: 450, y: 220 },
      { id: 'glacier', label: 'S3\nGlacier',        icon: '🏔️', color: '#64748b', x: 620, y: 220 },
    ],
    correct: [ck('app','std'), ck('std','ia'), ck('ia','glacier')],
  },
]

// ── Canvas constants ──────────────────────────────────────────────────────────
const NW = 120   // node width
const NH = 58    // node height
const SVG_W = 720
const SVG_H = 450

// ── Main Component ────────────────────────────────────────────────────────────
export default function VisualExam() {
  const { isPremium } = useAuth()
  const navigate = useNavigate()

  // ── Game state ──
  const [qIdx,      setQIdx]      = useState(0)
  const [conns,     setConns]     = useState<Set<ConnKey>>(new Set())
  const [selected,  setSelected]  = useState<string | null>(null)
  const [svgMouse,  setSvgMouse]  = useState({ x: 0, y: 0 })
  const [nodePos,   setNodePos]   = useState<Record<string, { x: number; y: number }>>({})
  const [submitted, setSubmitted] = useState(false)
  const [results,   setResults]   = useState<{
    correct: Set<ConnKey>; wrong: Set<ConnKey>; missing: Set<ConnKey>
  } | null>(null)
  const [scores, setScores] = useState<boolean[]>([])
  const [done,   setDone]   = useState(false)
  const [showHint, setShowHint] = useState(false)

  // ── Drag state (refs = no re-render during drag) ──
  const dragRef  = useRef<{ id: string; ox: number; oy: number; mx: number; my: number } | null>(null)
  const movedRef = useRef(false)
  const svgRef   = useRef<SVGSVGElement>(null)

  const q = QUESTIONS[qIdx]

  // Reset on question change
  useEffect(() => {
    setConns(new Set())
    setSelected(null)
    setSubmitted(false)
    setResults(null)
    setNodePos({})
    setShowHint(false)
    movedRef.current = false
    dragRef.current  = null
  }, [qIdx])

  // ── Helpers ──
  const getPos = (n: DNode) => nodePos[n.id] ?? { x: n.x, y: n.y }

  const toSvg = (e: React.MouseEvent): { x: number; y: number } => {
    const svg = svgRef.current
    if (!svg) return { x: 0, y: 0 }
    const r = svg.getBoundingClientRect()
    return {
      x: ((e.clientX - r.left) / r.width)  * SVG_W,
      y: ((e.clientY - r.top)  / r.height) * SVG_H,
    }
  }

  // ── SVG event handlers ──
  const onSvgMove = (e: React.MouseEvent) => {
    const pt = toSvg(e)
    setSvgMouse(pt)
    if (dragRef.current) {
      movedRef.current = true
      const { id, ox, oy, mx, my } = dragRef.current
      setNodePos(p => ({ ...p, [id]: { x: ox + pt.x - mx, y: oy + pt.y - my } }))
    }
  }

  const onSvgUp = () => { dragRef.current = null }

  const onSvgClick = () => { setSelected(null) }

  // ── Node event handlers ──
  const onNodeDown = (e: React.MouseEvent, n: DNode) => {
    e.stopPropagation()
    if (submitted) return
    const pt  = toSvg(e)
    const pos = getPos(n)
    movedRef.current = false
    dragRef.current  = { id: n.id, ox: pos.x, oy: pos.y, mx: pt.x, my: pt.y }
  }

  const onNodeUp = (e: React.MouseEvent, n: DNode) => {
    e.stopPropagation()
    dragRef.current = null
    if (submitted)        return
    if (movedRef.current) return   // was a drag — skip click logic

    if (!selected) {
      setSelected(n.id)
    } else if (selected === n.id) {
      setSelected(null)
    } else {
      const key = ck(selected, n.id)
      setConns(prev => {
        const next = new Set(prev)
        if (next.has(key)) next.delete(key)
        else               next.add(key)
        return next
      })
      setSelected(null)
    }
  }

  const removeConn = (key: ConnKey, e: React.MouseEvent) => {
    e.stopPropagation()
    if (submitted) return
    setConns(prev => { const n = new Set(prev); n.delete(key); return n })
  }

  // ── Submit ──
  const submit = () => {
    const cset    = new Set(q.correct)
    const correct = new Set<ConnKey>()
    const wrong   = new Set<ConnKey>()
    const missing = new Set<ConnKey>()
    conns.forEach(k => cset.has(k) ? correct.add(k) : wrong.add(k))
    q.correct.forEach(k => { if (!conns.has(k)) missing.add(k) })
    setResults({ correct, wrong, missing })
    setSubmitted(true)
    setScores(prev => [...prev, wrong.size === 0 && missing.size === 0])
  }

  const nextQ = () => {
    if (qIdx + 1 >= QUESTIONS.length) setDone(true)
    else setQIdx(i => i + 1)
  }

  // ── Connection line color ──
  const lineColor = (key: ConnKey) => {
    if (!submitted || !results) return '#64748b'
    if (results.correct.has(key)) return '#16a34a'
    if (results.wrong.has(key))   return '#dc2626'
    return '#64748b'
  }

  // ── Render an arrow between two node centers ──
  const renderArrow = (
    key: ConnKey,
    opts: { color?: string; dashed?: boolean; onClick?: (e: React.MouseEvent) => void } = {}
  ) => {
    const ids = key.split(':')
    const an  = q.nodes.find(n => n.id === ids[0])
    const bn  = q.nodes.find(n => n.id === ids[1])
    if (!an || !bn) return null
    const ap = getPos(an), bp = getPos(bn)
    const dx = bp.x - ap.x, dy = bp.y - ap.y
    const len = Math.sqrt(dx * dx + dy * dy) || 1
    const ux = dx / len, uy = dy / len
    const sx = ap.x + ux * (NW / 2 + 5)
    const sy = ap.y + uy * (NH / 2 + 5)
    const ex = bp.x - ux * (NW / 2 + 18)
    const ey = bp.y - uy * (NH / 2 + 18)
    const color  = opts.color  ?? '#64748b'
    const dashed = opts.dashed ?? false
    const markId = `arr-${color.replace('#', '')}`

    return (
      <g key={key} onClick={opts.onClick} style={{ cursor: opts.onClick ? 'pointer' : 'default' }}>
        <line
          x1={sx} y1={sy} x2={ex} y2={ey}
          stroke={color}
          strokeWidth={dashed ? 2 : 2.5}
          strokeDasharray={dashed ? '9,5' : undefined}
          markerEnd={`url(#${markId})`}
        />
        {/* wider invisible hit area for easier clicking */}
        {opts.onClick && (
          <line x1={sx} y1={sy} x2={ex} y2={ey}
            stroke="transparent" strokeWidth={14} style={{ cursor: 'pointer' }} />
        )}
      </g>
    )
  }

  // ── Marker defs for arrowheads ──────────────────────────────────────────────
  const MARKER_COLORS = ['#64748b', '#16a34a', '#dc2626', '#f59e0b', '#2563eb']
  const markers = MARKER_COLORS.map(c => (
    <marker
      key={c}
      id={`arr-${c.replace('#','')}`}
      markerWidth="8" markerHeight="8"
      refX="6" refY="3"
      orient="auto"
    >
      <path d="M0,0 L0,6 L8,3 z" fill={c} />
    </marker>
  ))

  // ── Premium gate ──────────────────────────────────────────────────────────────
  if (!isPremium) {
    return (
      <Layout>
        <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '32px 16px' }}>
          <div style={{ background: '#fff', borderRadius: '24px', padding: '48px 40px', maxWidth: '480px', width: '100%', textAlign: 'center', boxShadow: '0 20px 60px rgba(0,0,0,0.12)', border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🔒</div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', margin: '0 0 12px' }}>Premium Feature</h2>
            <p style={{ color: '#64748b', margin: '0 0 28px', lineHeight: '1.6' }}>
              Visual Exam — drag-and-connect — is available on monthly, yearly, and lifetime plans.
            </p>
            <button
              onClick={() => navigate('/pricing')}
              style={{ background: 'linear-gradient(135deg,#2563eb,#1d4ed8)', color: '#fff', border: 'none', borderRadius: '14px', padding: '14px 32px', fontWeight: 700, fontSize: '1rem', cursor: 'pointer', width: '100%' }}
            >
              View Plans
            </button>
          </div>
        </div>
      </Layout>
    )
  }

  // ── Done / Results screen ─────────────────────────────────────────────────────
  if (done) {
    const total   = QUESTIONS.length
    const correct = scores.filter(Boolean).length
    const pct     = Math.round((correct / total) * 100)
    const passed  = pct >= 70
    return (
      <Layout>
        <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '32px 16px' }}>
          <div style={{ background: '#fff', borderRadius: '24px', padding: '48px 40px', maxWidth: '520px', width: '100%', textAlign: 'center', boxShadow: '0 20px 60px rgba(0,0,0,0.12)', border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: '3.5rem', marginBottom: '12px' }}>{passed ? '🏆' : '📚'}</div>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 900, color: '#0f172a', margin: '0 0 8px' }}>
              {passed ? 'Great job!' : 'Keep practicing!'}
            </h2>
            <p style={{ color: '#64748b', margin: '0 0 28px' }}>
              You got <strong>{correct}/{total}</strong> diagrams fully correct
            </p>
            {/* Score circle */}
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '28px' }}>
              <div style={{
                width: '120px', height: '120px', borderRadius: '50%',
                background: passed ? 'linear-gradient(135deg,#16a34a,#15803d)' : 'linear-gradient(135deg,#dc2626,#b91c1c)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
              }}>
                <span style={{ color: '#fff', fontSize: '2rem', fontWeight: 900 }}>{pct}%</span>
              </div>
            </div>
            {/* Per-question breakdown */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '32px' }}>
              {scores.map((ok, i) => (
                <div key={i} style={{
                  width: '36px', height: '36px', borderRadius: '50%',
                  background: ok ? '#dcfce7' : '#fee2e2',
                  color: ok ? '#16a34a' : '#dc2626',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 700, fontSize: '0.85rem',
                }}>
                  {ok ? '✓' : '✗'}
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={() => { setDone(false); setQIdx(0); setScores([]) }}
                style={{ flex: 1, background: '#f1f5f9', color: '#0f172a', border: 'none', borderRadius: '12px', padding: '13px', fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer' }}
              >
                Retry
              </button>
              <button
                onClick={() => navigate('/dashboard')}
                style={{ flex: 1, background: 'linear-gradient(135deg,#2563eb,#1d4ed8)', color: '#fff', border: 'none', borderRadius: '12px', padding: '13px', fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer' }}
              >
                Dashboard
              </button>
            </div>
          </div>
        </div>
      </Layout>
    )
  }

  // ── Main exam UI ──────────────────────────────────────────────────────────────
  const isCorrectQ = submitted && results && results.wrong.size === 0 && results.missing.size === 0

  return (
    <Layout>
      <div style={{ maxWidth: '860px', margin: '0 auto', padding: '28px 16px 48px' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
              <span style={{ background: '#dbeafe', color: '#1d4ed8', borderRadius: '8px', padding: '4px 12px', fontWeight: 700, fontSize: '0.8rem', letterSpacing: '0.05em' }}>
                VISUAL EXAM
              </span>
              <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
                Question {qIdx + 1} of {QUESTIONS.length}
              </span>
            </div>
            <h1 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 800, color: '#0f172a' }}>
              Connect the AWS Architecture
            </h1>
          </div>
          {/* Progress dots */}
          <div style={{ display: 'flex', gap: '6px' }}>
            {QUESTIONS.map((_, i) => (
              <div key={i} style={{
                width: '10px', height: '10px', borderRadius: '50%',
                background: i < scores.length
                  ? (scores[i] ? '#16a34a' : '#dc2626')
                  : i === qIdx ? '#2563eb' : '#e2e8f0',
              }} />
            ))}
          </div>
        </div>

        {/* Scenario card */}
        <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '20px 24px', marginBottom: '16px' }}>
          <p style={{ margin: '0 0 8px', color: '#0f172a', fontWeight: 600, lineHeight: '1.55' }}>
            📋 {q.scenario}
          </p>
          <p style={{ margin: 0, color: '#2563eb', fontWeight: 500, fontSize: '0.9rem' }}>
            🎯 {q.task}
          </p>
        </div>

        {/* Instructions row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
          <div style={{ display: 'flex', gap: '16px', fontSize: '0.8rem', color: '#64748b' }}>
            <span>🖱️ <strong>Drag</strong> to reposition</span>
            <span>🔗 <strong>Click</strong> to select → connect</span>
            <span>✂️ <strong>Click connection</strong> to remove</span>
          </div>
          <button
            onClick={() => setShowHint(h => !h)}
            style={{ background: 'none', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '5px 14px', fontSize: '0.8rem', color: '#64748b', cursor: 'pointer' }}
          >
            {showHint ? '🙈 Hide hint' : '💡 Hint'}
          </button>
        </div>

        {showHint && (
          <div style={{ background: '#fffbeb', border: '1px solid #fcd34d', borderRadius: '10px', padding: '10px 16px', marginBottom: '12px', fontSize: '0.85rem', color: '#92400e' }}>
            💡 {q.hint}
          </div>
        )}

        {/* SVG Canvas */}
        <div style={{
          background: '#fff', border: `2px solid ${selected ? '#2563eb' : '#e2e8f0'}`,
          borderRadius: '16px', overflow: 'hidden',
          boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
          transition: 'border-color 0.2s',
          userSelect: 'none',
        }}>
          <svg
            ref={svgRef}
            viewBox={`0 0 ${SVG_W} ${SVG_H}`}
            width="100%"
            style={{ display: 'block', cursor: 'default' }}
            onMouseMove={onSvgMove}
            onMouseUp={onSvgUp}
            onMouseLeave={onSvgUp}
            onClick={onSvgClick}
          >
            <defs>
              {markers}
            </defs>

            {/* Grid background */}
            <rect width={SVG_W} height={SVG_H} fill="#fafbfc" />
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#f1f5f9" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width={SVG_W} height={SVG_H} fill="url(#grid)" />

            {/* ── Draw existing connections ── */}
            {Array.from(conns).map(key => {
              const color = lineColor(key)
              return renderArrow(key, {
                color,
                onClick: (e) => removeConn(key, e),
              })
            })}

            {/* ── Draw missing connections (after submit) ── */}
            {submitted && results && Array.from(results.missing).map(key =>
              renderArrow(key, { color: '#f59e0b', dashed: true })
            )}

            {/* ── Live "rubber-band" line while connecting ── */}
            {selected && (() => {
              const sn = q.nodes.find(n => n.id === selected)
              if (!sn) return null
              const sp = getPos(sn)
              const dx = svgMouse.x - sp.x, dy = svgMouse.y - sp.y
              const len = Math.sqrt(dx*dx+dy*dy)||1
              const ux = dx/len, uy = dy/len
              const sx = sp.x + ux*(NW/2+5), sy = sp.y + uy*(NH/2+5)
              return (
                <line
                  x1={sx} y1={sy} x2={svgMouse.x} y2={svgMouse.y}
                  stroke="#2563eb" strokeWidth="2" strokeDasharray="8,5"
                  markerEnd="url(#arr-2563eb)"
                />
              )
            })()}

            {/* ── Draw nodes ── */}
            {q.nodes.map(n => {
              const { x, y } = getPos(n)
              const isSel    = selected === n.id
              const lines    = n.label.split('\n')
              const lineH    = 16
              const totalTH  = lines.length * lineH
              const startY   = y - totalTH / 2 + lineH / 2 - 4

              return (
                <g
                  key={n.id}
                  onMouseDown={e => onNodeDown(e, n)}
                  onMouseUp={e   => onNodeUp(e, n)}
                  style={{ cursor: submitted ? 'default' : 'pointer' }}
                >
                  {/* Selection glow */}
                  {isSel && (
                    <rect
                      x={x - NW/2 - 6} y={y - NH/2 - 6}
                      width={NW + 12} height={NH + 12}
                      rx="14" fill="none"
                      stroke="#2563eb" strokeWidth="2.5"
                      strokeDasharray="6,4"
                      opacity="0.7"
                    />
                  )}

                  {/* Node body */}
                  <rect
                    x={x - NW/2} y={y - NH/2}
                    width={NW} height={NH}
                    rx="10"
                    fill={n.color}
                    opacity={isSel ? 1 : 0.92}
                    filter={isSel ? 'url(#glow)' : undefined}
                  />

                  {/* Subtle inner highlight */}
                  <rect
                    x={x - NW/2 + 1} y={y - NH/2 + 1}
                    width={NW - 2} height={NH/2}
                    rx="9"
                    fill="rgba(255,255,255,0.12)"
                  />

                  {/* Icon */}
                  <text
                    x={x - NW/2 + 14} y={y + 5}
                    fontSize="18" dominantBaseline="middle"
                    style={{ userSelect: 'none' }}
                  >
                    {n.icon}
                  </text>

                  {/* Label lines */}
                  {lines.map((line, li) => (
                    <text
                      key={li}
                      x={x + 6} y={startY + li * lineH}
                      fontSize="11.5" fontWeight="700"
                      fill="#fff" textAnchor="middle"
                      dominantBaseline="middle"
                      style={{ userSelect: 'none' }}
                    >
                      {line}
                    </text>
                  ))}

                  {/* Result badge */}
                  {submitted && results && (() => {
                    const nodeConns = Array.from(conns).filter(k => k.includes(n.id))
                    const nodeCorrect = nodeConns.every(k => results.correct.has(k))
                    const hasMissing  = q.correct.some(k => k.includes(n.id) && results.missing.has(k))
                    if (hasMissing) return (
                      <circle cx={x + NW/2 - 8} cy={y - NH/2 + 8} r="7" fill="#f59e0b" />
                    )
                    if (nodeCorrect && !hasMissing) return (
                      <circle cx={x + NW/2 - 8} cy={y - NH/2 + 8} r="7" fill="#16a34a" />
                    )
                    return (
                      <circle cx={x + NW/2 - 8} cy={y - NH/2 + 8} r="7" fill="#dc2626" />
                    )
                  })()}
                </g>
              )
            })}

            {/* Glow filter */}
            <defs>
              <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
          </svg>
        </div>

        {/* Connection count + status */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '12px', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
          <div style={{ fontSize: '0.85rem', color: '#64748b' }}>
            {selected
              ? <span style={{ color: '#2563eb', fontWeight: 600 }}>✔ Node selected — click another to connect</span>
              : <span>{conns.size} connection{conns.size !== 1 ? 's' : ''} drawn</span>
            }
          </div>
          {submitted && results && (
            <div style={{ display: 'flex', gap: '12px', fontSize: '0.82rem', fontWeight: 600 }}>
              <span style={{ color: '#16a34a' }}>✓ {results.correct.size} correct</span>
              <span style={{ color: '#dc2626' }}>✗ {results.wrong.size} wrong</span>
              <span style={{ color: '#f59e0b' }}>○ {results.missing.size} missing</span>
            </div>
          )}
        </div>

        {/* Feedback banner */}
        {submitted && (
          <div style={{
            background: isCorrectQ ? '#f0fdf4' : '#fef2f2',
            border: `1px solid ${isCorrectQ ? '#bbf7d0' : '#fecaca'}`,
            borderRadius: '12px', padding: '14px 20px', marginBottom: '16px',
            color: isCorrectQ ? '#166534' : '#991b1b',
            fontWeight: 600, fontSize: '0.9rem',
          }}>
            {isCorrectQ
              ? '🎉 Perfect! All connections are correct.'
              : `❌ Not quite. ${results!.wrong.size > 0 ? 'Remove wrong connections (red). ' : ''}${results!.missing.size > 0 ? 'Orange dashed lines show missing connections.' : ''}`
            }
          </div>
        )}

        {/* Legend (after submit) */}
        {submitted && (
          <div style={{ display: 'flex', gap: '20px', marginBottom: '16px', flexWrap: 'wrap' }}>
            {[['#16a34a','Correct'], ['#dc2626','Wrong — remove'], ['#f59e0b','Missing']].map(([c,l]) => (
              <div key={l} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: '#475569' }}>
                <div style={{ width: '28px', height: '3px', background: c, borderRadius: '2px' }} />
                {l}
              </div>
            ))}
          </div>
        )}

        {/* Action buttons */}
        <div style={{ display: 'flex', gap: '12px' }}>
          {!submitted ? (
            <>
              <button
                onClick={() => { setConns(new Set()); setSelected(null) }}
                style={{ flex: 0, background: '#f1f5f9', color: '#475569', border: 'none', borderRadius: '12px', padding: '13px 24px', fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer' }}
              >
                Clear
              </button>
              <button
                onClick={submit}
                disabled={conns.size === 0}
                style={{
                  flex: 1, background: conns.size === 0 ? '#e2e8f0' : 'linear-gradient(135deg,#2563eb,#1d4ed8)',
                  color: conns.size === 0 ? '#94a3b8' : '#fff', border: 'none', borderRadius: '12px',
                  padding: '13px 24px', fontWeight: 700, fontSize: '1rem', cursor: conns.size === 0 ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                Submit Answer
              </button>
            </>
          ) : (
            <button
              onClick={nextQ}
              style={{ flex: 1, background: 'linear-gradient(135deg,#16a34a,#15803d)', color: '#fff', border: 'none', borderRadius: '12px', padding: '14px 24px', fontWeight: 700, fontSize: '1rem', cursor: 'pointer' }}
            >
              {qIdx + 1 >= QUESTIONS.length ? '🏁 See Results' : 'Next Question →'}
            </button>
          )}
        </div>

      </div>
    </Layout>
  )
}
