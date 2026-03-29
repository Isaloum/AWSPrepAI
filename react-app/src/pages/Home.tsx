import { useNavigate, Link } from 'react-router-dom'
import Layout from '../components/Layout'

const certs = [
  { icon: '☁️', code: 'CLF-C02', name: 'Cloud Practitioner', level: 'Foundational', id: 'clf-c02' },
  { icon: '🤖', code: 'AIF-C01', name: 'AI Practitioner', level: 'Foundational', id: 'aif-c01' },
  { icon: '🏗️', code: 'SAA-C03', name: 'Solutions Architect Associate', level: 'Associate', id: 'saa-c03' },
  { icon: '💻', code: 'DVA-C02', name: 'Developer Associate', level: 'Associate', id: 'dva-c02' },
  { icon: '⚙️', code: 'SOA-C02', name: 'SysOps Administrator', level: 'Associate', id: 'soa-c02' },
  { icon: '📊', code: 'DEA-C01', name: 'Data Engineer Associate', level: 'Associate', id: 'dea-c01' },
  { icon: '🧠', code: 'MLA-C01', name: 'ML Engineer Associate', level: 'Associate', id: 'mla-c01' },
  { icon: '✨', code: 'GAI-C01', name: 'Generative AI Developer', level: 'Associate', id: 'gai-c01' },
  { icon: '🏆', code: 'SAP-C02', name: 'Solutions Architect Professional', level: 'Professional', id: 'sap-c02' },
  { icon: '🔧', code: 'DOP-C02', name: 'DevOps Engineer Professional', level: 'Professional', id: 'dop-c02' },
  { icon: '🔒', code: 'SCS-C03', name: 'Security Specialty', level: 'Specialty', id: 'scs-c03' },
  { icon: '🌐', code: 'ANS-C01', name: 'Advanced Networking Specialty', level: 'Specialty', id: 'ans-c01' },
]

const features = [
  { icon: '📝', title: '3,120 Questions', desc: '260 per certification across all 12 AWS exams' },
  { icon: '⏱️', title: 'Mock Exams', desc: '65 questions, 90-minute timer, score on submit' },
  { icon: '💡', title: 'Instant Explanations', desc: 'Every answer explained — learn why, not just what' },
  { icon: '🎯', title: 'Domain Filtering', desc: 'Focus on your weakest areas by exam domain' },
  { icon: '📖', title: 'AWS Glossary', desc: '50+ key terms explained in plain language' },
  { icon: '📚', title: 'Study Resources', desc: 'Curated links to the best AWS learning materials' },
]

const levelColors: Record<string, { bg: string; text: string }> = {
  Foundational: { bg: '#f0fdf4', text: '#16a34a' },
  Associate:    { bg: '#eff6ff', text: '#2563eb' },
  Professional: { bg: '#faf5ff', text: '#7c3aed' },
  Specialty:    { bg: '#fff7ed', text: '#c2410c' },
}

// Sample question card for hero visual
const SampleQuestion = () => (
  <div style={{
    background: '#1e293b',
    borderRadius: '1.25rem',
    padding: '1.5rem',
    border: '1px solid rgba(255,255,255,0.1)',
    boxShadow: '0 25px 50px rgba(0,0,0,0.4)',
    maxWidth: '440px',
    width: '100%',
  }}>
    {/* Card header */}
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <span style={{ fontSize: '1rem' }}>🏗️</span>
        <span style={{ color: '#60a5fa', fontSize: '0.75rem', fontWeight: 700 }}>SAA-C03</span>
        <span style={{ color: '#475569', fontSize: '0.75rem' }}>· Resilient Architecture</span>
      </div>
      <span style={{ color: '#475569', fontSize: '0.75rem' }}>Q 14 / 260</span>
    </div>

    {/* Question */}
    <p style={{ color: '#e2e8f0', fontSize: '0.875rem', lineHeight: 1.7, marginBottom: '1.25rem' }}>
      A web application needs to maintain user sessions across multiple EC2 instances behind a load balancer. Which approach is most scalable?
    </p>

    {/* Options */}
    {[
      { label: 'A', text: 'Enable sticky sessions on the ALB', correct: false, chosen: false },
      { label: 'B', text: 'Store sessions in Amazon ElastiCache', correct: true, chosen: true },
      { label: 'C', text: 'Use EC2 instance store for sessions', correct: false, chosen: false },
      { label: 'D', text: 'Write sessions to an S3 bucket', correct: false, chosen: false },
    ].map(opt => (
      <div key={opt.label} style={{
        display: 'flex', alignItems: 'flex-start', gap: '0.625rem',
        padding: '0.625rem 0.875rem',
        borderRadius: '0.625rem',
        marginBottom: '0.5rem',
        border: `1px solid ${opt.correct ? '#22c55e' : opt.chosen ? '#ef4444' : 'rgba(255,255,255,0.08)'}`,
        background: opt.correct ? 'rgba(34,197,94,0.12)' : 'rgba(255,255,255,0.03)',
      }}>
        <span style={{
          width: '20px', height: '20px', borderRadius: '50%', flexShrink: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '0.7rem', fontWeight: 800,
          background: opt.correct ? '#22c55e' : 'rgba(255,255,255,0.1)',
          color: opt.correct ? '#fff' : '#94a3b8',
        }}>{opt.label}</span>
        <span style={{ color: opt.correct ? '#86efac' : '#94a3b8', fontSize: '0.8rem', lineHeight: 1.5 }}>{opt.text}</span>
        {opt.correct && <span style={{ marginLeft: 'auto', color: '#22c55e', fontSize: '0.8rem', flexShrink: 0 }}>✓</span>}
      </div>
    ))}

    {/* Explanation */}
    <div style={{
      marginTop: '1rem', padding: '0.875rem', background: 'rgba(34,197,94,0.08)',
      borderRadius: '0.75rem', border: '1px solid rgba(34,197,94,0.2)',
    }}>
      <div style={{ color: '#22c55e', fontSize: '0.7rem', fontWeight: 800, marginBottom: '0.25rem' }}>✅ Correct! Here's why:</div>
      <p style={{ color: '#94a3b8', fontSize: '0.75rem', lineHeight: 1.6, margin: 0 }}>
        ElastiCache (Redis) stores session data outside EC2, allowing any instance to read sessions — fully scalable and fault-tolerant.
      </p>
    </div>
  </div>
)

export default function Home() {
  const navigate = useNavigate()

  return (
    <Layout>
      {/* ── Hero ── */}
      <section style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 50%, #0f172a 100%)', color: '#fff', padding: '5rem 1.5rem' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem', alignItems: 'center' }}>

          {/* Left — text */}
          <div>
            <div style={{ display: 'inline-block', background: 'rgba(96,165,250,0.15)', color: '#93c5fd', fontSize: '0.8rem', fontWeight: 700, padding: '0.375rem 1rem', borderRadius: '999px', marginBottom: '1.5rem', border: '1px solid rgba(96,165,250,0.3)' }}>
              🎓 12 AWS Certifications · 3,120 Questions
            </div>
            <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.25rem)', fontWeight: 900, lineHeight: 1.15, marginBottom: '1.25rem' }}>
              Pass Your AWS Cert.<br />
              <span style={{ color: '#60a5fa' }}>Practice Smarter.</span>
            </h1>
            <p style={{ color: '#94a3b8', fontSize: '1.1rem', lineHeight: 1.75, marginBottom: '2rem', maxWidth: '460px' }}>
              Scenario-based questions with instant explanations and timed mock exams — for every active AWS certification.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
              <button
                onClick={() => navigate('/certifications')}
                style={{ padding: '0.875rem 1.75rem', background: '#2563eb', color: '#fff', fontWeight: 800, borderRadius: '0.875rem', border: 'none', cursor: 'pointer', fontSize: '1rem', boxShadow: '0 4px 14px rgba(37,99,235,0.4)' }}
              >
                🚀 Start Practicing Free
              </button>
              <button
                onClick={() => navigate('/pricing')}
                style={{ padding: '0.875rem 1.75rem', background: 'rgba(255,255,255,0.08)', color: '#fff', fontWeight: 700, borderRadius: '0.875rem', border: '1px solid rgba(255,255,255,0.18)', cursor: 'pointer', fontSize: '1rem' }}
              >
                View Plans — from $7/mo
              </button>
            </div>
            <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
              <span style={{ color: '#4ade80', fontSize: '0.85rem', fontWeight: 600 }}>✅ 20 questions free</span>
              <span style={{ color: '#64748b', fontSize: '0.85rem' }}>No credit card needed</span>
              <span style={{ color: '#64748b', fontSize: '0.85rem' }}>Cancel anytime</span>
            </div>
          </div>

          {/* Right — sample question card */}
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <SampleQuestion />
          </div>

        </div>
      </section>

      {/* ── Stats bar ── */}
      <section style={{ background: '#1e293b', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', padding: '1.5rem 1rem', gap: '0.5rem' }}>
          {[
            { n: '12', label: 'Certifications' },
            { n: '3,120', label: 'Questions' },
            { n: '65', label: 'Questions / Mock Exam' },
            { n: '90', label: 'Min Timer' },
            { n: '72%', label: 'AWS Pass Mark' },
          ].map(s => (
            <div key={s.label} style={{ textAlign: 'center', padding: '0.5rem' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#60a5fa' }}>{s.n}</div>
              <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: '0.2rem' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ── */}
      <section style={{ padding: '4rem 1.5rem', background: '#fff' }}>
        <div style={{ maxWidth: '960px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '1.875rem', fontWeight: 900, color: '#111827', textAlign: 'center', marginBottom: '0.5rem' }}>Everything you need to pass</h2>
          <p style={{ color: '#6b7280', textAlign: 'center', marginBottom: '2.5rem', fontSize: '1rem' }}>No fluff. No fake features. Just what works.</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1rem' }}>
            {features.map(f => (
              <div key={f.title} style={{ background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '1rem', padding: '1.5rem', transition: 'border-color 0.15s, box-shadow 0.15s' }}
                onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = '#93c5fd'; (e.currentTarget as HTMLDivElement).style.boxShadow = '0 4px 12px rgba(0,0,0,0.06)' }}
                onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = '#e5e7eb'; (e.currentTarget as HTMLDivElement).style.boxShadow = 'none' }}
              >
                <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>{f.icon}</div>
                <div style={{ fontWeight: 800, color: '#111827', marginBottom: '0.375rem', fontSize: '1rem' }}>{f.title}</div>
                <div style={{ fontSize: '0.875rem', color: '#6b7280', lineHeight: 1.6 }}>{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section style={{ padding: '4rem 1.5rem', background: '#f8fafc' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '1.875rem', fontWeight: 900, color: '#111827', textAlign: 'center', marginBottom: '3rem' }}>How It Works</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '2rem' }}>
            {[
              { n: '1', title: 'Pick your cert', desc: 'Choose from 12 active AWS certifications' },
              { n: '2', title: 'Practice free', desc: '20 questions per cert, no account needed' },
              { n: '3', title: 'Upgrade for full access', desc: 'Unlock all 3,120 questions + mock exams' },
              { n: '4', title: 'Pass your exam', desc: 'Show up confident on exam day' },
            ].map(s => (
              <div key={s.n} style={{ textAlign: 'center' }}>
                <div style={{ width: '52px', height: '52px', background: 'linear-gradient(135deg, #2563eb, #1d4ed8)', color: '#fff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '1.25rem', margin: '0 auto 1rem', boxShadow: '0 4px 12px rgba(37,99,235,0.35)' }}>{s.n}</div>
                <div style={{ fontWeight: 700, color: '#111827', marginBottom: '0.375rem', fontSize: '0.95rem' }}>{s.title}</div>
                <div style={{ fontSize: '0.825rem', color: '#6b7280', lineHeight: 1.6 }}>{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── All certs ── */}
      <section style={{ padding: '4rem 1.5rem', background: '#fff' }}>
        <div style={{ maxWidth: '960px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '1.875rem', fontWeight: 900, color: '#111827', textAlign: 'center', marginBottom: '0.5rem' }}>All 12 AWS Certifications</h2>
          <p style={{ color: '#6b7280', textAlign: 'center', marginBottom: '2rem' }}>260 questions each. Every domain covered.</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))', gap: '0.75rem' }}>
            {certs.map(cert => {
              const lc = levelColors[cert.level]
              return (
                <Link
                  key={cert.id}
                  to={`/cert/${cert.id}`}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', background: '#fff', border: '1px solid #e5e7eb', borderRadius: '0.875rem', padding: '0.875rem 1rem', textDecoration: 'none', transition: 'border-color 0.15s, box-shadow 0.15s, transform 0.15s' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor = '#93c5fd'; (e.currentTarget as HTMLAnchorElement).style.boxShadow = '0 4px 12px rgba(0,0,0,0.07)'; (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(-1px)' }}
                  onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor = '#e5e7eb'; (e.currentTarget as HTMLAnchorElement).style.boxShadow = 'none'; (e.currentTarget as HTMLAnchorElement).style.transform = 'none' }}
                >
                  <span style={{ fontSize: '1.75rem' }}>{cert.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, color: '#111827', fontSize: '0.875rem' }}>{cert.name}</div>
                    <div style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.15rem' }}>{cert.code}</div>
                  </div>
                  <span style={{ padding: '0.2rem 0.625rem', background: lc.bg, color: lc.text, borderRadius: '999px', fontSize: '0.7rem', fontWeight: 700, whiteSpace: 'nowrap' }}>
                    {cert.level}
                  </span>
                </Link>
              )
            })}
          </div>
          <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <Link to="/certifications" style={{ display: 'inline-block', padding: '0.75rem 2rem', background: '#f1f5f9', color: '#374151', fontWeight: 700, borderRadius: '0.875rem', textDecoration: 'none', fontSize: '0.95rem', border: '1px solid #e2e8f0' }}>
              Browse All Certifications →
            </Link>
          </div>
        </div>
      </section>

      {/* ── Pricing teaser ── */}
      <section style={{ padding: '4rem 1.5rem', background: '#eff6ff' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: '1.875rem', fontWeight: 900, color: '#111827', marginBottom: '0.5rem' }}>Simple, honest pricing</h2>
          <p style={{ color: '#6b7280', marginBottom: '2rem' }}>Start free. Upgrade when you need more.</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
            {[
              { label: 'Free', price: '$0', desc: '20 questions / cert' },
              { label: 'Monthly', price: '$7/mo', desc: 'Full access' },
              { label: 'Lifetime', price: '$97', desc: 'Pay once, forever' },
            ].map(p => (
              <div key={p.label} style={{ background: '#fff', border: '1px solid #bfdbfe', borderRadius: '0.875rem', padding: '1.25rem 0.75rem', textAlign: 'center' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#2563eb', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>{p.label}</div>
                <div style={{ fontSize: '1.375rem', fontWeight: 900, color: '#111827', marginBottom: '0.25rem' }}>{p.price}</div>
                <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>{p.desc}</div>
              </div>
            ))}
          </div>
          <Link to="/pricing" style={{ display: 'inline-block', padding: '0.875rem 2rem', background: '#2563eb', color: '#fff', fontWeight: 800, borderRadius: '0.875rem', textDecoration: 'none', fontSize: '1rem', boxShadow: '0 4px 14px rgba(37,99,235,0.3)' }}>
            See Full Pricing →
          </Link>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section style={{ padding: '5rem 1.5rem', background: 'linear-gradient(135deg, #1e40af, #1e3a8a)', color: '#fff', textAlign: 'center' }}>
        <h2 style={{ fontSize: '2.25rem', fontWeight: 900, marginBottom: '0.75rem' }}>Ready to start?</h2>
        <p style={{ color: '#bfdbfe', marginBottom: '2rem', fontSize: '1.1rem' }}>20 free questions — no credit card, no account required.</p>
        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button onClick={() => navigate('/certifications')} style={{ padding: '0.875rem 2rem', background: '#fff', color: '#1d4ed8', fontWeight: 800, borderRadius: '0.875rem', border: 'none', cursor: 'pointer', fontSize: '1rem', boxShadow: '0 4px 14px rgba(0,0,0,0.2)' }}>
            Start Practicing Free →
          </button>
          <button onClick={() => navigate('/signup')} style={{ padding: '0.875rem 2rem', background: 'rgba(255,255,255,0.12)', color: '#fff', fontWeight: 700, borderRadius: '0.875rem', border: '1px solid rgba(255,255,255,0.3)', cursor: 'pointer', fontSize: '1rem' }}>
            Create Free Account
          </button>
        </div>
      </section>
    </Layout>
  )
}
