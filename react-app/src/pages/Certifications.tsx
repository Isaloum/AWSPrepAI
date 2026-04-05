import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import Layout from '../components/Layout'

const certs = [
  { id: 'clf-c02', icon: '☁️', name: 'Cloud Practitioner', code: 'CLF-C02', level: 'Foundation', forRole: 'IT managers, sales, non-technical roles new to cloud', salary: '$95K–$115K', domains: ['Cloud Concepts', 'Security', 'Technology', 'Billing'] },
  { id: 'aif-c01', icon: '🤖', name: 'AI Practitioner', code: 'AIF-C01', level: 'Foundation', forRole: 'Anyone exploring AI/ML on AWS — no ML background needed', salary: '$105K–$130K', domains: ['AI Fundamentals', 'ML Concepts', 'Generative AI', 'Responsible AI'] },
  { id: 'saa-c03', icon: '🏗️', name: 'Solutions Architect Associate', code: 'SAA-C03', level: 'Associate', forRole: 'Cloud architects, DevOps engineers, backend developers', salary: '$130K–$160K', domains: ['Secure 30%', 'Resilient 26%', 'Performant 24%', 'Cost 20%'] },
  { id: 'dva-c02', icon: '💻', name: 'Developer Associate', code: 'DVA-C02', level: 'Associate', forRole: 'Software developers building and deploying on AWS', salary: '$125K–$155K', domains: ['Development', 'Security', 'Deployment', 'Troubleshooting'] },
  { id: 'soa-c02', icon: '⚙️', name: 'SysOps Administrator', code: 'SOA-C02', level: 'Associate', forRole: 'System admins and ops engineers managing AWS infrastructure', salary: '$120K–$150K', domains: ['Monitoring', 'Reliability', 'Deployment', 'Networking'] },
  { id: 'dea-c01', icon: '📊', name: 'Data Engineer Associate', code: 'DEA-C01', level: 'Associate', forRole: 'Data engineers building pipelines and analytics on AWS', salary: '$130K–$160K', domains: ['Ingestion', 'Data Store', 'Operations', 'Security'] },
  { id: 'mla-c01', icon: '🧠', name: 'ML Engineer Associate', code: 'MLA-C01', level: 'Associate', forRole: 'ML engineers deploying and operationalizing models on AWS', salary: '$145K–$175K', domains: ['Data Prep', 'Model Dev', 'Deployment', 'Monitoring'] },
  { id: 'gai-c01', icon: '✨', name: 'Generative AI Developer', code: 'GAI-C01', level: 'Associate', forRole: 'Developers building generative AI apps with Bedrock & LLMs', salary: '$150K–$185K', domains: ['Gen AI', 'Bedrock', 'Foundation Models', 'Responsible AI'] },
  { id: 'sap-c02', icon: '🏆', name: 'Solutions Architect Professional', code: 'SAP-C02', level: 'Professional', forRole: 'Senior architects designing complex, multi-account AWS environments', salary: '$165K–$200K', domains: ['Org Design', 'New Solutions', 'Migration', 'Cost'] },
  { id: 'dop-c02', icon: '🔧', name: 'DevOps Engineer Professional', code: 'DOP-C02', level: 'Professional', forRole: 'DevOps engineers automating CI/CD and cloud operations at scale', salary: '$160K–$195K', domains: ['SDLC', 'Config & Incident', 'Monitoring', 'High Availability'] },
  { id: 'scs-c03', icon: '🔒', name: 'Security Specialty', code: 'SCS-C03', level: 'Specialty', forRole: 'Security engineers and compliance-focused cloud professionals', salary: '$155K–$190K', domains: ['Threat Detection', 'IAM', 'Data Protection', 'Infrastructure'] },
  { id: 'ans-c01', icon: '🌐', name: 'Advanced Networking Specialty', code: 'ANS-C01', level: 'Specialty', forRole: 'Network engineers designing hybrid and advanced VPC architectures', salary: '$150K–$185K', domains: ['Network Design', 'Implementation', 'Management', 'Security'] },
]

const levelStyle: Record<string, { bg: string; color: string; border: string }> = {
  Foundation:   { bg: '#eff6ff', color: '#1d4ed8', border: '#bfdbfe' },
  Associate:    { bg: '#f0fdf4', color: '#16a34a', border: '#bbf7d0' },
  Professional: { bg: '#faf5ff', color: '#7c3aed', border: '#e9d5ff' },
  Specialty:    { bg: '#eff6ff', color: '#1d4ed8', border: '#bfdbfe' },
}

const paths = [
  { icon: '☁️', label: 'New to cloud', path: 'CLF-C02' },
  { icon: '🏗️', label: 'Architect / DevOps', path: 'SAA-C03' },
  { icon: '💻', label: 'Developer', path: 'DVA-C02' },
  { icon: '🔒', label: 'Security role', path: 'SCS-C03' },
  { icon: '🤖', label: 'AI / ML track', path: 'AIF-C01 → MLA-C01' },
]

type Level = 'All' | 'Foundation' | 'Associate' | 'Professional' | 'Specialty'
const levels: Level[] = ['All', 'Foundation', 'Associate', 'Professional', 'Specialty']

export default function Certifications() {
  const [filter, setFilter] = useState<Level>('All')
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const isMockMode = searchParams.get('mode') === 'mock'

  const filtered = filter === 'All' ? certs : certs.filter(c => c.level === filter)

  return (
    <Layout>
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '3rem 1.5rem' }}>

        {/* ── Hero ── */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          {isMockMode && (
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#f0fdf4', border: '1.5px solid #bbf7d0', borderRadius: '999px', padding: '4px 14px', fontSize: '0.78rem', fontWeight: 700, color: '#15803d', marginBottom: '0.75rem' }}>
              ⏱️ MOCK EXAM MODE — 65 questions · 130 minutes
            </div>
          )}
          <h1 style={{ fontSize: '2rem', fontWeight: 900, color: '#111827', marginBottom: '0.5rem' }}>
            {isMockMode ? 'Select a Certification to Start Mock Exam' : 'Choose Your AWS Certification'}
          </h1>
          <p style={{ color: '#6b7280', fontSize: '1rem', maxWidth: '520px', margin: '0 auto 1.5rem' }}>
            {isMockMode
              ? 'Timed simulation · 65 questions · 130 min · scored at the end'
              : 'Scenario-based questions for every active AWS certification. 260 questions per cert.'}
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '2.5rem' }}>
            {[
              { n: '3,120', label: 'Total Questions' },
              { n: '12', label: 'Certifications' },
              { n: '130 min', label: 'Mock Exam Timer' },
            ].map(s => (
              <div key={s.label} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#2563eb' }}>{s.n}</div>
                <div style={{ fontSize: '0.7rem', color: '#9ca3af', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: '2px' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Path guidance banner ── */}
        <div style={{ background: '#0f172a', borderRadius: '16px', padding: '1.25rem 1.5rem', marginBottom: '2rem', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '1rem' }}>
          <div style={{ marginRight: '0.5rem' }}>
            <div style={{ color: '#f1f5f9', fontWeight: 700, fontSize: '0.9rem' }}>🤔 Not sure which cert to pick?</div>
            <div style={{ color: '#64748b', fontSize: '0.8rem', marginTop: '2px' }}>Match your role to a path:</div>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {paths.map(p => (
              <span key={p.label} style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', color: '#cbd5e1', fontSize: '0.78rem', fontWeight: 600, padding: '5px 12px', borderRadius: '999px' }}>
                {p.icon} {p.label} → {p.path}
              </span>
            ))}
          </div>
        </div>

        {/* ── Filter tabs ── */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
          {levels.map(l => (
            <button
              key={l}
              onClick={() => setFilter(l)}
              style={{
                padding: '6px 18px',
                borderRadius: '999px',
                fontSize: '13px',
                fontWeight: 600,
                border: filter === l ? '1.5px solid #1d4ed8' : '1.5px solid #e5e7eb',
                background: filter === l ? '#2563eb' : '#fff',
                color: filter === l ? '#fff' : '#374151',
                cursor: 'pointer',
                transition: 'all 0.15s',
              }}
            >
              {l}
            </button>
          ))}
        </div>

        {/* ── Cert grid ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
          {filtered.map(cert => {
            const ls = levelStyle[cert.level]
            return (
              <div
                key={cert.id}
                onClick={() => navigate(isMockMode ? `/mock-exam/${cert.id}` : `/cert/${cert.id}`)}
                style={{
                  background: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '16px',
                  padding: '20px',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  transition: 'border-color 0.15s, box-shadow 0.15s, transform 0.15s',
                }}
                onMouseEnter={e => {
                  const el = e.currentTarget as HTMLDivElement
                  el.style.borderColor = '#93c5fd'
                  el.style.boxShadow = '0 4px 20px rgba(0,0,0,0.08)'
                  el.style.transform = 'translateY(-2px)'
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget as HTMLDivElement
                  el.style.borderColor = '#e5e7eb'
                  el.style.boxShadow = 'none'
                  el.style.transform = 'translateY(0)'
                }}
              >
                {/* Card top row */}
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    {/* Icon circle */}
                    <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: ls.bg, border: `1px solid ${ls.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', flexShrink: 0 }}>
                      {cert.icon}
                    </div>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: '15px', color: '#111827', lineHeight: 1.3 }}>{cert.name}</div>
                      <div style={{ fontSize: '12px', color: '#2563eb', fontWeight: 700, marginTop: '2px' }}>{cert.code}</div>
                    </div>
                  </div>
                  {/* Level badge */}
                  <span style={{ padding: '3px 10px', background: ls.bg, color: ls.color, border: `1px solid ${ls.border}`, borderRadius: '999px', fontSize: '11px', fontWeight: 700, whiteSpace: 'nowrap', flexShrink: 0 }}>
                    {cert.level}
                  </span>
                </div>

                {/* Best for */}
                <p style={{ fontSize: '13px', color: '#6b7280', lineHeight: 1.6, margin: 0 }}>
                  <span style={{ fontWeight: 600, color: '#374151' }}>Best for: </span>{cert.forRole}
                </p>

                {/* Salary */}
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '8px', padding: '4px 10px', width: 'fit-content' }}>
                  <span style={{ fontSize: '13px' }}>💰</span>
                  <span style={{ fontSize: '12px', fontWeight: 700, color: '#15803d' }}>{cert.salary}</span>
                </div>

                {/* Domain tags */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {cert.domains.map(d => (
                    <span key={d} style={{ padding: '3px 8px', background: '#f9fafb', border: '1px solid #f3f4f6', borderRadius: '6px', fontSize: '11px', color: '#6b7280', fontWeight: 500 }}>{d}</span>
                  ))}
                </div>

                {/* CTA */}
                <button
                  style={{ width: '100%', padding: '10px', background: 'linear-gradient(135deg, #2563eb, #1d4ed8)', color: '#fff', fontWeight: 700, fontSize: '13px', border: 'none', borderRadius: '10px', cursor: 'pointer', marginTop: 'auto', boxShadow: '0 1px 3px rgba(37,99,235,0.25)' }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'linear-gradient(135deg, #1d4ed8, #1e40af)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'linear-gradient(135deg, #2563eb, #1d4ed8)')}
                >
                  {isMockMode ? '⏱️ Start Mock Exam →' : 'Start Practicing →'}
                </button>
              </div>
            )
          })}
        </div>

      </div>
    </Layout>
  )
}
