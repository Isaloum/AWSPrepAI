import { useState } from 'react'
import { Link } from 'react-router-dom'
import Layout from '../components/Layout'

export default function About() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null)

  const faqs = [
    { q: 'Can I try before buying?', a: 'Yes — create a free account and get 20 questions. No credit card needed. See the quality before you pay.' },
    { q: "What's the pass rate for AWS exams?", a: 'AWS exams require 72% or higher. My questions are scenario-based and match the real exam difficulty — the same style you\'ll face on test day.' },
    { q: 'Does Lifetime include future certs?', a: 'Yes. Every new AWS certification I add is automatically included in your Lifetime plan at no extra cost, forever.' },
    { q: 'Can I cancel Monthly or Yearly anytime?', a: 'Absolutely. Cancel from your dashboard with one click. No cancellation fees, no questions asked.' },
    { q: 'What is the AI Coach?', a: 'AI Coach is an intelligent tutor that answers your questions, explains AWS concepts in depth, and builds personalized study plans. Available exclusively on the Lifetime plan.' },
  ]

  const features = [
    { icon: '📝', title: '3,120 Questions', desc: '260 per cert across all 12 AWS certifications, updated regularly', color: '#eff6ff', border: '#bfdbfe' },
    { icon: '⏱️', title: 'Mock Exams', desc: '65-question timed tests that mirror the real exam format exactly', color: '#f0fdf4', border: '#bbf7d0' },
    { icon: '💡', title: 'Instant Explanations', desc: 'Every answer explained — learn why options are right or wrong', color: '#faf5ff', border: '#e9d5ff' },
    { icon: '🎯', title: 'Domain Filtering', desc: 'Filter by exam domain to focus on your weakest areas first', color: '#fff7ed', border: '#fed7aa' },
    { icon: '🏗️', title: 'Architecture Builder', desc: 'Drag-and-drop AWS diagrams — learn by building, not just reading', color: '#eff6ff', border: '#bfdbfe' },
    { icon: '🖼️', title: 'Visual Exam', desc: 'Diagram-based questions so you see the problem, not just read it', color: '#f0fdf4', border: '#bbf7d0' },
  ]

  const certs = [
    { code: 'CLF-C02', name: 'Cloud Practitioner', level: 'Foundational', color: '#dcfce7', text: '#15803d' },
    { code: 'AIF-C01', name: 'AI Practitioner', level: 'Foundational', color: '#dcfce7', text: '#15803d' },
    { code: 'SAA-C03', name: 'Solutions Architect Associate', level: 'Associate', color: '#dbeafe', text: '#1d4ed8' },
    { code: 'DVA-C02', name: 'Developer Associate', level: 'Associate', color: '#dbeafe', text: '#1d4ed8' },
    { code: 'SOA-C02', name: 'SysOps Administrator', level: 'Associate', color: '#dbeafe', text: '#1d4ed8' },
    { code: 'DEA-C01', name: 'Data Engineer Associate', level: 'Associate', color: '#dbeafe', text: '#1d4ed8' },
    { code: 'MLA-C01', name: 'ML Engineer Associate', level: 'Associate', color: '#dbeafe', text: '#1d4ed8' },
    { code: 'GAI-C01', name: 'Generative AI Developer', level: 'Associate', color: '#dbeafe', text: '#1d4ed8' },
    { code: 'SAP-C02', name: 'Solutions Architect Pro', level: 'Professional', color: '#ede9fe', text: '#6d28d9' },
    { code: 'DOP-C02', name: 'DevOps Engineer Pro', level: 'Professional', color: '#ede9fe', text: '#6d28d9' },
    { code: 'SCS-C03', name: 'Security Specialty', level: 'Specialty', color: '#fce7f3', text: '#be185d' },
    { code: 'ANS-C01', name: 'Advanced Networking', level: 'Specialty', color: '#fce7f3', text: '#be185d' },
  ]

  const stats = [
    { value: '3,120', label: 'Practice Questions' },
    { value: '12', label: 'AWS Certifications' },
    { value: '72%', label: 'Pass Mark Required' },
    { value: '4', label: 'Exam Levels' },
  ]

  return (
    <Layout>

      {/* ── Hero ── */}
      <div style={{ background: 'linear-gradient(160deg, #0f172a 0%, #1e3a8a 60%, #1d4ed8 100%)', padding: '5rem 1.5rem 4rem', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-80px', left: '10%', width: '400px', height: '400px', background: 'rgba(96,165,250,0.12)', borderRadius: '50%', filter: 'blur(80px)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '-60px', right: '10%', width: '300px', height: '300px', background: 'rgba(139,92,246,0.1)', borderRadius: '50%', filter: 'blur(60px)', pointerEvents: 'none' }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '999px', padding: '0.4rem 1rem', marginBottom: '1.5rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#93c5fd', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Built by an engineer, for engineers</span>
          </div>
          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 900, color: '#fff', marginBottom: '1rem', lineHeight: 1.15, letterSpacing: '-0.02em' }}>
            Hi, I'm Ihab.<br />This is why I built AWSPrepAI.
          </h1>
          <p style={{ color: '#93c5fd', fontSize: '1.05rem', lineHeight: 1.7, maxWidth: '540px', margin: '0 auto 3rem' }}>
            An electrical engineer shifting into cloud — and tired of paying for five different things just to study for one exam.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap' }}>
            {stats.map(s => (
              <div key={s.label} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', fontWeight: 900, color: '#fff', lineHeight: 1 }}>{s.value}</div>
                <div style={{ fontSize: '0.75rem', color: '#93c5fd', fontWeight: 600, marginTop: '0.25rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '3rem 1.5rem' }}>

        {/* ── My Story ── */}
        <div style={{ marginBottom: '3.5rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#111827', marginBottom: '1.5rem' }}>My Story</h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {/* Card 1 */}
            <div style={{ background: 'linear-gradient(135deg, #eff6ff, #e0f2fe)', border: '1px solid #bfdbfe', borderRadius: '1.25rem', padding: '1.75rem', display: 'flex', gap: '1.25rem', alignItems: 'flex-start' }}>
              <div style={{ fontSize: '2rem', flexShrink: 0 }}>⚡</div>
              <div>
                <h3 style={{ fontWeight: 800, color: '#1d4ed8', marginBottom: '0.5rem', fontSize: '1rem' }}>From Electrical Engineering to Cloud</h3>
                <p style={{ color: '#1e40af', lineHeight: 1.75, margin: 0, fontSize: '0.925rem' }}>
                  I'm originally an electrical engineer. Like a lot of engineers today, I realized that to shift my career and stay relevant, I needed to go deep into cloud engineering and backend. That meant AWS certifications — and that meant studying.
                </p>
              </div>
            </div>

            {/* Card 2 */}
            <div style={{ background: 'linear-gradient(135deg, #f0fdf4, #dcfce7)', border: '1px solid #bbf7d0', borderRadius: '1.25rem', padding: '1.75rem', display: 'flex', gap: '1.25rem', alignItems: 'flex-start' }}>
              <div style={{ fontSize: '2rem', flexShrink: 0 }}>🧩</div>
              <div>
                <h3 style={{ fontWeight: 800, color: '#15803d', marginBottom: '0.5rem', fontSize: '1rem' }}>Cloud is Lego — and I love Lego</h3>
                <p style={{ color: '#166534', lineHeight: 1.75, margin: 0, fontSize: '0.925rem' }}>
                  My personal take: to succeed in cloud, you need to be good at building Lego and genuinely love finding solutions to problems. You need to be solutions-oriented. Cloud architecture is exactly that — you take pieces, understand how they connect, and build something that works. That mindset is everything.
                </p>
              </div>
            </div>

            {/* Card 3 */}
            <div style={{ background: 'linear-gradient(135deg, #faf5ff, #ede9fe)', border: '1px solid #e9d5ff', borderRadius: '1.25rem', padding: '1.75rem', display: 'flex', gap: '1.25rem', alignItems: 'flex-start' }}>
              <div style={{ fontSize: '2rem', flexShrink: 0 }}>👁️</div>
              <div>
                <h3 style={{ fontWeight: 800, color: '#6d28d9', marginBottom: '0.5rem', fontSize: '1rem' }}>I learn by seeing, not just reading</h3>
                <p style={{ color: '#5b21b6', lineHeight: 1.75, margin: 0, fontSize: '0.925rem' }}>
                  I personally learn best when I can see the problem and visualize the solution — understanding what the elements are and how they fit together. That's exactly why I built the Visual Exam and the Architecture Builder. I wanted to see the architecture, not just memorize bullet points about it.
                </p>
              </div>
            </div>

            {/* Card 4 */}
            <div style={{ background: 'linear-gradient(135deg, #fff7ed, #ffedd5)', border: '1px solid #fed7aa', borderRadius: '1.25rem', padding: '1.75rem', display: 'flex', gap: '1.25rem', alignItems: 'flex-start' }}>
              <div style={{ fontSize: '2rem', flexShrink: 0 }}>💸</div>
              <div>
                <h3 style={{ fontWeight: 800, color: '#c2410c', marginBottom: '0.5rem', fontSize: '1rem' }}>The real problem: too many tabs, too many bills</h3>
                <p style={{ color: '#9a3412', lineHeight: 1.75, margin: 0, fontSize: '0.925rem' }}>
                  When I started studying, the typical path looked like this: pay $25 for a Udemy course, then go to YouTube to find someone explaining the exam questions, then head to a platform like Dojo for more practice — and suddenly you've paid for three separate things and you're still jumping between tabs. I wanted to fix that. I built AWSPrepAI to bring everything into one place: the questions, the explanations, the diagrams, and the resources — so you can focus on learning, not on managing five browser tabs.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ── What I Built ── */}
        <h2 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#111827', marginBottom: '1.25rem' }}>What I Built Into It</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '3.5rem' }}>
          {features.map((f, i) => (
            <div key={f.title}
              onMouseEnter={() => setHoveredFeature(i)}
              onMouseLeave={() => setHoveredFeature(null)}
              style={{
                background: hoveredFeature === i ? f.color : '#fff',
                border: `1px solid ${hoveredFeature === i ? f.border : '#e5e7eb'}`,
                borderRadius: '1rem', padding: '1.25rem',
                transition: 'all 0.2s', cursor: 'default',
                transform: hoveredFeature === i ? 'translateY(-3px)' : 'none',
                boxShadow: hoveredFeature === i ? '0 8px 24px rgba(0,0,0,0.08)' : 'none',
              }}>
              <div style={{ fontSize: '1.75rem', marginBottom: '0.625rem' }}>{f.icon}</div>
              <div style={{ fontWeight: 700, color: '#111827', fontSize: '0.9rem', marginBottom: '0.375rem' }}>{f.title}</div>
              <div style={{ fontSize: '0.8rem', color: '#6b7280', lineHeight: 1.55 }}>{f.desc}</div>
            </div>
          ))}
        </div>

        {/* ── Certifications ── */}
        <h2 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#111827', marginBottom: '0.5rem' }}>12 Certifications Covered</h2>
        <p style={{ color: '#6b7280', fontSize: '0.9rem', marginBottom: '1.25rem' }}>All active AWS certification paths — from Foundational to Specialty.</p>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
          {[
            { level: 'Foundational', color: '#dcfce7', text: '#15803d' },
            { level: 'Associate', color: '#dbeafe', text: '#1d4ed8' },
            { level: 'Professional', color: '#ede9fe', text: '#6d28d9' },
            { level: 'Specialty', color: '#fce7f3', text: '#be185d' },
          ].map(l => (
            <div key={l.level} style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '3px', background: l.color, border: `1px solid ${l.text}40` }} />
              <span style={{ fontSize: '0.75rem', color: '#6b7280', fontWeight: 600 }}>{l.level}</span>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '3.5rem' }}>
          {certs.map(cert => (
            <span key={cert.code} style={{ padding: '0.4rem 0.875rem', background: cert.color, borderRadius: '999px', fontSize: '0.78rem', fontWeight: 700, color: cert.text, border: `1px solid ${cert.text}30` }}>
              {cert.code} · {cert.name}
            </span>
          ))}
        </div>

        {/* ── FAQ ── */}
        <h2 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#111827', marginBottom: '1.25rem' }}>Frequently Asked Questions</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem', marginBottom: '3.5rem' }}>
          {faqs.map((faq, i) => (
            <div key={i}
              onClick={() => setOpenFaq(openFaq === i ? null : i)}
              style={{ background: '#fff', border: `1px solid ${openFaq === i ? '#bfdbfe' : '#e5e7eb'}`, borderRadius: '0.875rem', padding: '1.1rem 1.25rem', cursor: 'pointer', transition: 'border-color 0.15s' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
                <p style={{ fontWeight: 700, color: '#111827', margin: 0, fontSize: '0.9rem' }}>{faq.q}</p>
                <span style={{ color: '#3b82f6', fontWeight: 800, fontSize: '1.1rem', flexShrink: 0, transition: 'transform 0.2s', display: 'inline-block', transform: openFaq === i ? 'rotate(45deg)' : 'none' }}>+</span>
              </div>
              {openFaq === i && (
                <p style={{ color: '#6b7280', fontSize: '0.875rem', margin: '0.75rem 0 0', lineHeight: 1.65 }}>{faq.a}</p>
              )}
            </div>
          ))}
        </div>

        {/* ── CTA ── */}
        <div style={{ background: 'linear-gradient(160deg, #0f172a, #1e3a8a)', borderRadius: '1.5rem', padding: '3rem 2rem', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: '-40px', left: '20%', width: '200px', height: '200px', background: 'rgba(96,165,250,0.15)', borderRadius: '50%', filter: 'blur(50px)', pointerEvents: 'none' }} />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 900, color: '#fff', marginBottom: '0.75rem' }}>Stop juggling tabs. Start here.</h2>
            <p style={{ color: '#93c5fd', marginBottom: '2rem', fontSize: '1rem' }}>
              Everything you need to pass your AWS exam — in one place.
            </p>
            <div style={{ display: 'flex', gap: '0.875rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/signup" style={{ padding: '0.875rem 2rem', background: '#2563eb', color: '#fff', borderRadius: '0.875rem', fontWeight: 700, textDecoration: 'none', fontSize: '0.95rem', boxShadow: '0 4px 14px rgba(37,99,235,0.4)' }}>
                Create Free Account
              </Link>
              <Link to="/pricing" style={{ padding: '0.875rem 2rem', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', borderRadius: '0.875rem', fontWeight: 700, textDecoration: 'none', fontSize: '0.95rem' }}>
                View Plans →
              </Link>
            </div>
          </div>
        </div>

      </div>
    </Layout>
  )
}
