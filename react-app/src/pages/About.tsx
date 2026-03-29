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

            {/* Card 1 — Electrical → Cloud */}
            <div style={{ background: 'linear-gradient(135deg, #eff6ff, #e0f2fe)', border: '1px solid #bfdbfe', borderRadius: '1.25rem', padding: '1.75rem', display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <h3 style={{ fontWeight: 800, color: '#1d4ed8', marginBottom: '0.5rem', fontSize: '1rem' }}>From Electrical Engineering to Cloud</h3>
                <p style={{ color: '#1e40af', lineHeight: 1.75, margin: 0, fontSize: '0.925rem' }}>
                  I'm originally an electrical engineer. Like a lot of engineers today, I realized that to shift my career and stay relevant, I needed to go deep into cloud engineering and backend. That meant AWS certifications — and that meant studying.
                </p>
              </div>
              {/* Illustration: circuit chip → cloud */}
              <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="148" height="100" viewBox="0 0 148 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                  {/* Chip body */}
                  <rect x="8" y="28" width="40" height="44" rx="5" fill="#bfdbfe" stroke="#3b82f6" strokeWidth="1.8"/>
                  {/* Chip pins left */}
                  <line x1="8" y1="38" x2="1" y2="38" stroke="#3b82f6" strokeWidth="1.8" strokeLinecap="round"/>
                  <line x1="8" y1="50" x2="1" y2="50" stroke="#3b82f6" strokeWidth="1.8" strokeLinecap="round"/>
                  <line x1="8" y1="62" x2="1" y2="62" stroke="#3b82f6" strokeWidth="1.8" strokeLinecap="round"/>
                  {/* Chip pins right */}
                  <line x1="48" y1="38" x2="55" y2="38" stroke="#3b82f6" strokeWidth="1.8" strokeLinecap="round"/>
                  <line x1="48" y1="50" x2="55" y2="50" stroke="#3b82f6" strokeWidth="1.8" strokeLinecap="round"/>
                  <line x1="48" y1="62" x2="55" y2="62" stroke="#3b82f6" strokeWidth="1.8" strokeLinecap="round"/>
                  {/* Chip label */}
                  <text x="14" y="46" fontSize="7" fontWeight="700" fill="#1d4ed8">ELEC</text>
                  <text x="15" y="57" fontSize="7" fontWeight="700" fill="#1d4ed8">ENG.</text>
                  {/* Arrow */}
                  <line x1="62" y1="50" x2="80" y2="50" stroke="#60a5fa" strokeWidth="2" strokeLinecap="round"/>
                  <polyline points="75,44 82,50 75,56" stroke="#60a5fa" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                  {/* Cloud shape */}
                  <path d="M100 72 Q92 72 92 65 Q92 57 100 56 Q100 49 107 47 Q111 41 119 43 Q125 39 131 45 Q140 45 140 54 Q147 54 147 63 Q147 72 139 72 Z" fill="#dbeafe" stroke="#3b82f6" strokeWidth="1.8"/>
                  {/* AWS label */}
                  <text x="104" y="62" fontSize="8" fontWeight="800" fill="#1d4ed8">AWS</text>
                  {/* Small service dots */}
                  <circle cx="97" cy="68" r="3" fill="#3b82f6" opacity="0.6"/>
                  <circle cx="107" cy="70" r="3" fill="#3b82f6" opacity="0.6"/>
                  <circle cx="117" cy="70" r="3" fill="#3b82f6" opacity="0.6"/>
                  <circle cx="127" cy="68" r="3" fill="#3b82f6" opacity="0.6"/>
                  <circle cx="137" cy="68" r="3" fill="#3b82f6" opacity="0.4"/>
                </svg>
              </div>
            </div>

            {/* Card 2 — Cloud is Lego */}
            <div style={{ background: 'linear-gradient(135deg, #f0fdf4, #dcfce7)', border: '1px solid #bbf7d0', borderRadius: '1.25rem', padding: '1.75rem', display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <h3 style={{ fontWeight: 800, color: '#15803d', marginBottom: '0.5rem', fontSize: '1rem' }}>Cloud is Lego — and I love Lego</h3>
                <p style={{ color: '#166534', lineHeight: 1.75, margin: 0, fontSize: '0.925rem' }}>
                  My personal take: to succeed in cloud, you need to be good at building Lego and genuinely love finding solutions to problems. You need to be solutions-oriented. Cloud architecture is exactly that — you take pieces, understand how they connect, and build something that works. That mindset is everything.
                </p>
              </div>
              {/* Illustration: Lego bricks assembling */}
              <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="140" height="100" viewBox="0 0 140 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                  {/* Brick 1 — EC2 */}
                  <rect x="10" y="52" width="38" height="22" rx="3" fill="#86efac" stroke="#16a34a" strokeWidth="1.5"/>
                  <ellipse cx="22" cy="52" rx="5" ry="3" fill="#4ade80" stroke="#16a34a" strokeWidth="1.2"/>
                  <ellipse cx="37" cy="52" rx="5" ry="3" fill="#4ade80" stroke="#16a34a" strokeWidth="1.2"/>
                  <text x="17" y="67" fontSize="7" fontWeight="700" fill="#166534">EC2</text>
                  {/* Brick 2 — S3 */}
                  <rect x="52" y="52" width="38" height="22" rx="3" fill="#6ee7b7" stroke="#059669" strokeWidth="1.5"/>
                  <ellipse cx="64" cy="52" rx="5" ry="3" fill="#34d399" stroke="#059669" strokeWidth="1.2"/>
                  <ellipse cx="79" cy="52" rx="5" ry="3" fill="#34d399" stroke="#059669" strokeWidth="1.2"/>
                  <text x="62" y="67" fontSize="7" fontWeight="700" fill="#065f46">S3</text>
                  {/* Brick 3 — VPC — top center, snapping in */}
                  <rect x="31" y="28" width="38" height="22" rx="3" fill="#a7f3d0" stroke="#10b981" strokeWidth="1.5"/>
                  <ellipse cx="43" cy="28" rx="5" ry="3" fill="#6ee7b7" stroke="#10b981" strokeWidth="1.2"/>
                  <ellipse cx="58" cy="28" rx="5" ry="3" fill="#6ee7b7" stroke="#10b981" strokeWidth="1.2"/>
                  <text x="38" y="43" fontSize="7" fontWeight="700" fill="#065f46">VPC</text>
                  {/* Connecting snap arrows */}
                  <line x1="50" y1="50" x2="50" y2="75" stroke="#22c55e" strokeWidth="1" strokeDasharray="3,2" opacity="0.7"/>
                  <line x1="70" y1="50" x2="70" y2="75" stroke="#22c55e" strokeWidth="1" strokeDasharray="3,2" opacity="0.7"/>
                  {/* Result arrow */}
                  <line x1="96" y1="62" x2="112" y2="62" stroke="#16a34a" strokeWidth="2" strokeLinecap="round"/>
                  <polyline points="107,56 114,62 107,68" stroke="#16a34a" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                  {/* Final product — small building */}
                  <rect x="116" y="45" width="20" height="28" rx="2" fill="#bbf7d0" stroke="#16a34a" strokeWidth="1.5"/>
                  <rect x="120" y="36" width="12" height="10" rx="2" fill="#86efac" stroke="#16a34a" strokeWidth="1.5"/>
                  <rect x="120" y="60" width="5" height="13" rx="1" fill="#16a34a" opacity="0.4"/>
                  <rect x="127" y="55" width="5" height="7" rx="1" fill="#16a34a" opacity="0.3"/>
                </svg>
              </div>
            </div>

            {/* Card 3 — I learn by seeing */}
            <div style={{ background: 'linear-gradient(135deg, #faf5ff, #ede9fe)', border: '1px solid #e9d5ff', borderRadius: '1.25rem', padding: '1.75rem', display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <h3 style={{ fontWeight: 800, color: '#6d28d9', marginBottom: '0.5rem', fontSize: '1rem' }}>I learn by seeing, not just reading</h3>
                <p style={{ color: '#5b21b6', lineHeight: 1.75, margin: 0, fontSize: '0.925rem' }}>
                  I personally learn best when I can see the problem and visualize the solution — understanding what the elements are and how they fit together. That's exactly why I built the Visual Exam and the Architecture Builder. I wanted to see the architecture, not just memorize bullet points about it.
                </p>
              </div>
              {/* Illustration: text wall vs architecture diagram */}
              <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="148" height="100" viewBox="0 0 148 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                  {/* Left panel — boring text */}
                  <rect x="2" y="10" width="58" height="80" rx="6" fill="#ede9fe" stroke="#c4b5fd" strokeWidth="1.5"/>
                  <text x="10" y="24" fontSize="7" fill="#7c3aed" fontWeight="700">📄 Notes</text>
                  {/* Text lines */}
                  {[32, 42, 52, 62, 72, 82].map((y, i) => (
                    <rect key={i} x="10" y={y} width={i % 3 === 0 ? 38 : i % 3 === 1 ? 32 : 42} height="5" rx="2" fill="#c4b5fd" opacity="0.7"/>
                  ))}
                  {/* X mark — boring */}
                  <circle cx="49" cy="20" r="7" fill="#fecaca" stroke="#ef4444" strokeWidth="1.2"/>
                  <line x1="45" y1="16" x2="53" y2="24" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round"/>
                  <line x1="53" y1="16" x2="45" y2="24" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round"/>
                  {/* Arrow in middle */}
                  <text x="65" y="54" fontSize="14" fill="#a78bfa">→</text>
                  {/* Right panel — diagram */}
                  <rect x="84" y="10" width="62" height="80" rx="6" fill="#f5f3ff" stroke="#8b5cf6" strokeWidth="1.5"/>
                  <text x="90" y="24" fontSize="7" fill="#6d28d9" fontWeight="700">🏗️ Diagram</text>
                  {/* Architecture boxes */}
                  <rect x="100" y="30" width="28" height="14" rx="3" fill="#ddd6fe" stroke="#7c3aed" strokeWidth="1.2"/>
                  <text x="105" y="41" fontSize="6" fill="#5b21b6" fontWeight="600">Internet</text>
                  {/* Arrow down */}
                  <line x1="114" y1="44" x2="114" y2="52" stroke="#8b5cf6" strokeWidth="1.2"/>
                  <polyline points="111,49 114,53 117,49" stroke="#8b5cf6" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
                  <rect x="100" y="52" width="28" height="14" rx="3" fill="#c4b5fd" stroke="#7c3aed" strokeWidth="1.2"/>
                  <text x="107" y="63" fontSize="6" fill="#4c1d95" fontWeight="600">ALB</text>
                  {/* Arrow down */}
                  <line x1="114" y1="66" x2="114" y2="74" stroke="#8b5cf6" strokeWidth="1.2"/>
                  <polyline points="111,71 114,75 117,71" stroke="#8b5cf6" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
                  <rect x="100" y="74" width="28" height="13" rx="3" fill="#a78bfa" stroke="#7c3aed" strokeWidth="1.2"/>
                  <text x="106" y="84" fontSize="6" fill="#fff" fontWeight="600">EC2 x3</text>
                  {/* Check mark — visual */}
                  <circle cx="136" cy="20" r="7" fill="#bbf7d0" stroke="#16a34a" strokeWidth="1.2"/>
                  <polyline points="132,20 135,23 140,16" stroke="#16a34a" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>

            {/* Card 4 — Too many tabs, too many subscriptions */}
            <div style={{ background: 'linear-gradient(135deg, #fff7ed, #ffedd5)', border: '1px solid #fed7aa', borderRadius: '1.25rem', padding: '1.75rem', display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <h3 style={{ fontWeight: 800, color: '#c2410c', marginBottom: '0.5rem', fontSize: '1rem' }}>The real problem: too many tabs, too many subscriptions</h3>
                <p style={{ color: '#9a3412', lineHeight: 1.75, margin: 0, fontSize: '0.925rem' }}>
                  When I started studying, the typical path looked like this: a Udemy course — which is genuinely great, easily worth more than $23 — then YouTube to find someone walking through exam questions, then a platform like Dojo for more practice. These are all legitimate, high-quality resources. My only problem wasn't the quality — it was the fragmentation. Suddenly you've paid for three separate things and you're still jumping between tabs. I built AWSPrepAI to bring everything into one place: the questions, the explanations, the diagrams, and the resources — so you can focus on learning, not on managing five browser tabs.
                </p>
              </div>
              {/* Illustration: 3 subscriptions → 1 */}
              <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="148" height="100" viewBox="0 0 148 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                  {/* Card stack — Udemy */}
                  <rect x="4" y="8" width="44" height="28" rx="4" fill="#fde68a" stroke="#f59e0b" strokeWidth="1.5"/>
                  <text x="9" y="21" fontSize="6.5" fontWeight="800" fill="#92400e">Udemy</text>
                  <text x="9" y="31" fontSize="8" fontWeight="900" fill="#b45309">$23</text>
                  {/* YouTube */}
                  <rect x="4" y="40" width="44" height="28" rx="4" fill="#fecaca" stroke="#ef4444" strokeWidth="1.5"/>
                  <text x="9" y="53" fontSize="6.5" fontWeight="800" fill="#991b1b">YouTube</text>
                  <text x="9" y="63" fontSize="8" fontWeight="900" fill="#dc2626">$0 ✓</text>
                  {/* Dojo */}
                  <rect x="4" y="72" width="44" height="22" rx="4" fill="#fed7aa" stroke="#f97316" strokeWidth="1.5"/>
                  <text x="9" y="83" fontSize="6.5" fontWeight="800" fill="#9a3412">TutorialsDojo</text>
                  <text x="9" y="91" fontSize="8" fontWeight="900" fill="#c2410c">$15</text>
                  {/* Plus signs */}
                  <text x="51" y="32" fontSize="10" fill="#fb923c" fontWeight="900">+</text>
                  <text x="51" y="60" fontSize="10" fill="#fb923c" fontWeight="900">+</text>
                  {/* = sign + arrow */}
                  <line x1="56" y1="52" x2="72" y2="52" stroke="#f97316" strokeWidth="2" strokeLinecap="round"/>
                  <polyline points="67,46 74,52 67,58" stroke="#f97316" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                  {/* Result — AWSPrepAI */}
                  <rect x="78" y="26" width="64" height="48" rx="6" fill="#ffedd5" stroke="#ea580c" strokeWidth="2"/>
                  <text x="86" y="44" fontSize="7" fontWeight="800" fill="#c2410c">AWSPrepAI</text>
                  <rect x="84" y="48" width="52" height="6" rx="2" fill="#fed7aa"/>
                  <rect x="84" y="57" width="40" height="6" rx="2" fill="#fed7aa"/>
                  <text x="86" y="54" fontSize="5.5" fill="#9a3412">Questions + Diagrams</text>
                  <text x="86" y="63" fontSize="5.5" fill="#9a3412">Explanations + More</text>
                  {/* One price badge */}
                  <rect x="96" y="68" width="28" height="14" rx="3" fill="#ea580c"/>
                  <text x="101" y="78" fontSize="7" fontWeight="900" fill="#fff">1 tab ✓</text>
                </svg>
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
