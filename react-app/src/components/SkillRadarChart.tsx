import { useState } from 'react'
import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Legend,
  ResponsiveContainer,
  Tooltip,
} from 'recharts'

export interface DomainScore {
  domain: string
  examWeight: number   // 0–100, official exam guide %
  userScore: number    // 0–100, user's correct % (overall for cert)
}

// Official exam domain breakdowns (from AWS exam guides)
const CERT_DOMAINS: Record<string, DomainScore[]> = {
  'saa-c03': [
    { domain: 'Resilient Arch',    examWeight: 30, userScore: 0 },
    { domain: 'High-Performing',   examWeight: 28, userScore: 0 },
    { domain: 'Secure Arch',       examWeight: 24, userScore: 0 },
    { domain: 'Cost-Optimized',    examWeight: 18, userScore: 0 },
  ],
  'clf-c02': [
    { domain: 'Cloud Concepts',    examWeight: 24, userScore: 0 },
    { domain: 'Security',          examWeight: 30, userScore: 0 },
    { domain: 'Cloud Technology',  examWeight: 34, userScore: 0 },
    { domain: 'Billing & Pricing', examWeight: 12, userScore: 0 },
  ],
  'dva-c02': [
    { domain: 'Development',       examWeight: 32, userScore: 0 },
    { domain: 'Security',          examWeight: 26, userScore: 0 },
    { domain: 'Deployment',        examWeight: 24, userScore: 0 },
    { domain: 'Troubleshooting',   examWeight: 18, userScore: 0 },
  ],
  'soa-c02': [
    { domain: 'Monitoring',        examWeight: 20, userScore: 0 },
    { domain: 'Reliability',       examWeight: 16, userScore: 0 },
    { domain: 'Deployment',        examWeight: 18, userScore: 0 },
    { domain: 'Security',          examWeight: 16, userScore: 0 },
    { domain: 'Networking',        examWeight: 18, userScore: 0 },
    { domain: 'Cost & Perf',       examWeight: 12, userScore: 0 },
  ],
  'dea-c01': [
    { domain: 'Ingestion & Transform', examWeight: 34, userScore: 0 },
    { domain: 'Store & Manage',        examWeight: 26, userScore: 0 },
    { domain: 'Operate Pipelines',     examWeight: 22, userScore: 0 },
    { domain: 'Security',              examWeight: 18, userScore: 0 },
  ],
  'mla-c01': [
    { domain: 'Data Preparation',  examWeight: 28, userScore: 0 },
    { domain: 'Model Development', examWeight: 26, userScore: 0 },
    { domain: 'Deployment',        examWeight: 22, userScore: 0 },
    { domain: 'Monitoring',        examWeight: 24, userScore: 0 },
  ],
  'scs-c03': [
    { domain: 'Threat Detection',  examWeight: 14, userScore: 0 },
    { domain: 'Logging',           examWeight: 18, userScore: 0 },
    { domain: 'Infrastructure',    examWeight: 20, userScore: 0 },
    { domain: 'Identity & Access', examWeight: 16, userScore: 0 },
    { domain: 'Data Protection',   examWeight: 32, userScore: 0 },
  ],
  'ans-c01': [
    { domain: 'Network Design',    examWeight: 30, userScore: 0 },
    { domain: 'Implementation',    examWeight: 26, userScore: 0 },
    { domain: 'Management',        examWeight: 20, userScore: 0 },
    { domain: 'Security',          examWeight: 24, userScore: 0 },
  ],
  'sap-c02': [
    { domain: 'Org Complexity',    examWeight: 26, userScore: 0 },
    { domain: 'New Solutions',     examWeight: 29, userScore: 0 },
    { domain: 'Improvement',       examWeight: 25, userScore: 0 },
    { domain: 'Migration',         examWeight: 20, userScore: 0 },
  ],
  'dop-c02': [
    { domain: 'SDLC Automation',   examWeight: 22, userScore: 0 },
    { domain: 'Config & IaC',      examWeight: 17, userScore: 0 },
    { domain: 'Resilience',        examWeight: 15, userScore: 0 },
    { domain: 'Monitoring',        examWeight: 15, userScore: 0 },
    { domain: 'Incident Response', examWeight: 14, userScore: 0 },
    { domain: 'Security',          examWeight: 17, userScore: 0 },
  ],
  'aif-c01': [
    { domain: 'AI & ML Basics',    examWeight: 20, userScore: 0 },
    { domain: 'Generative AI',     examWeight: 24, userScore: 0 },
    { domain: 'Foundation Models', examWeight: 28, userScore: 0 },
    { domain: 'Responsible AI',    examWeight: 14, userScore: 0 },
    { domain: 'Security',          examWeight: 14, userScore: 0 },
  ],
  'gai-c01': [
    { domain: 'Gen AI Design',     examWeight: 30, userScore: 0 },
    { domain: 'Model Selection',   examWeight: 20, userScore: 0 },
    { domain: 'Optimization',      examWeight: 25, userScore: 0 },
    { domain: 'Responsible AI',    examWeight: 25, userScore: 0 },
  ],
}

interface CertOption {
  id: string
  code: string
  name: string
}

interface Props {
  certOptions: CertOption[]
  /** cert_id → correct% (0–100). Only certs with real attempts. */
  progressMap: Record<string, number>
}

const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: { name: string; value: number }[] }) => {
  if (!active || !payload?.length) return null
  return (
    <div style={{
      background: '#1e293b', border: '1px solid #334155',
      borderRadius: '0.5rem', padding: '0.5rem 0.85rem',
      fontSize: '0.78rem', color: '#f1f5f9', lineHeight: 1.7,
    }}>
      {payload.map(p => (
        <div key={p.name}>
          <span style={{ color: p.name === 'Exam Weight' ? '#60a5fa' : '#f87171' }}>■ </span>
          {p.name}: <strong>{p.value}%</strong>
        </div>
      ))}
    </div>
  )
}

export default function SkillRadarChart({ certOptions, progressMap }: Props) {
  const [selectedId, setSelectedId] = useState(certOptions[0]?.id ?? 'saa-c03')

  const userPct = progressMap[selectedId] ?? 0
  const hasPracticed = selectedId in progressMap

  // Inject user's overall score into each domain
  const data: DomainScore[] = (CERT_DOMAINS[selectedId] ?? CERT_DOMAINS['saa-c03']).map(d => ({
    ...d,
    userScore: userPct,
  }))

  return (
    <div style={{
      background: '#fff', border: '1px solid #e5e7eb',
      borderRadius: '1rem', padding: '1.5rem', marginBottom: '2rem',
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
        <h2 style={{ fontSize: '1.125rem', fontWeight: 800, color: '#111827', margin: 0 }}>
          🕸️ Skill Radar
        </h2>

        {/* Cert dropdown — replaces "Sample data" badge */}
        <select
          value={selectedId}
          onChange={e => setSelectedId(e.target.value)}
          style={{
            fontSize: '0.78rem', fontWeight: 700,
            color: hasPracticed ? '#1d4ed8' : '#92400e',
            background: hasPracticed ? '#eff6ff' : '#fef3c7',
            border: `1px solid ${hasPracticed ? '#bfdbfe' : '#fde68a'}`,
            borderRadius: '999px', padding: '0.2rem 0.75rem',
            cursor: 'pointer', outline: 'none',
          }}
        >
          {certOptions.map(c => (
            <option key={c.id} value={c.id}>
              {c.code}{progressMap[c.id] !== undefined ? ` ✓` : ''}
            </option>
          ))}
        </select>
      </div>

      <p style={{ fontSize: '0.78rem', color: '#6b7280', marginBottom: '1.25rem', marginTop: '0.2rem' }}>
        {hasPracticed
          ? `Your overall score: ${userPct}% · blue = exam focus areas`
          : 'No practice yet for this cert · blue = what the exam tests'}
      </p>

      <ResponsiveContainer width="100%" height={320}>
        <RadarChart data={data} margin={{ top: 10, right: 30, bottom: 10, left: 30 }}>
          <PolarGrid stroke="#e5e7eb" />
          <PolarAngleAxis dataKey="domain" tick={{ fill: '#374151', fontSize: 12, fontWeight: 600 }} />
          <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: '#9ca3af', fontSize: 10 }} tickCount={5} />
          <Radar name="Exam Weight" dataKey="examWeight" stroke="#2563eb" fill="#2563eb" fillOpacity={0.12} strokeWidth={2} />
          <Radar name="Your Score"  dataKey="userScore"  stroke="#dc2626" fill="#dc2626" fillOpacity={0.15} strokeWidth={2} strokeDasharray="5 3" />
          <Tooltip content={<CustomTooltip />} />
          <Legend formatter={value => <span style={{ fontSize: '0.78rem', color: '#374151', fontWeight: 600 }}>{value}</span>} />
        </RadarChart>
      </ResponsiveContainer>

      {/* Domain score table */}
      <div style={{ marginTop: '0.75rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '0.5rem' }}>
        {data.map(d => {
          const gap = d.userScore - d.examWeight
          const gapColor = gap >= 0 ? '#16a34a' : gap >= -15 ? '#d97706' : '#dc2626'
          const gapLabel = hasPracticed ? (gap >= 0 ? `+${gap}%` : `${gap}%`) : '—'
          return (
            <div key={d.domain} style={{
              background: '#f9fafb', border: '1px solid #f3f4f6',
              borderRadius: '0.65rem', padding: '0.6rem 0.85rem',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            }}>
              <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#374151' }}>{d.domain}</span>
              <span style={{ fontSize: '0.72rem', fontWeight: 800, color: hasPracticed ? gapColor : '#9ca3af' }}>{gapLabel}</span>
            </div>
          )
        })}
      </div>
      <p style={{ fontSize: '0.7rem', color: '#9ca3af', marginTop: '0.75rem', textAlign: 'right' }}>
        {hasPracticed ? 'Gap = Your Score − Exam Weight · 🟢 above · 🔴 below' : 'Practice this cert to see your gap score'}
      </p>
    </div>
  )
}
