import { useState } from 'react'
import Layout from '../components/Layout'

const resources = [
  {
    id: 'official',
    category: 'Official AWS',
    icon: '🎓',
    color: '#dbeafe',
    text: '#1d4ed8',
    items: [
      { title: 'AWS Certification Official Page', url: 'https://aws.amazon.com/certification/', desc: 'All exam guides, scheduling, and official prep materials', free: true },
      { title: 'AWS Skill Builder', url: 'https://skillbuilder.aws/', desc: 'Free and paid official courses directly from AWS', free: true },
      { title: 'AWS Documentation', url: 'https://docs.aws.amazon.com/', desc: 'Complete service documentation — the ground truth for every service', free: true },
      { title: 'AWS Whitepapers', url: 'https://aws.amazon.com/whitepapers/', desc: 'Foundational architecture and security papers — exam favorites', free: true },
      { title: 'AWS Well-Architected Framework', url: 'https://aws.amazon.com/architecture/well-architected/', desc: 'The 6 pillars that underpin most exam questions', free: true },
    ],
  },
  {
    id: 'courses',
    category: 'Video Courses',
    icon: '📹',
    color: '#ede9fe',
    text: '#6d28d9',
    items: [
      { title: 'Stephane Maarek (Udemy)', url: 'https://www.udemy.com/user/stephane-maarek/', desc: 'Most popular AWS courses. SAA-C03 is the gold standard for beginners — genuinely worth every cent', free: false },
      { title: 'Adrian Cantrill', url: 'https://learn.cantrill.io/', desc: 'Deep-dive architecture focus. Excellent for Associate & Professional levels', free: false },
      { title: 'A Cloud Guru / Pluralsight', url: 'https://acloudguru.com/', desc: 'Broad coverage of all certs with hands-on labs', free: false },
      { title: 'FreeCodeCamp AWS (YouTube)', url: 'https://www.youtube.com/@freecodecamp', desc: 'Free full-length courses for CLF-C02 and SAA-C03', free: true },
    ],
  },
  {
    id: 'practice',
    category: 'Practice & Study',
    icon: '📝',
    color: '#dcfce7',
    text: '#15803d',
    items: [
      { title: 'Tutorials Dojo Practice Exams (Jon Bonso)', url: 'https://portal.tutorialsdojo.com/courses/aws-certified-solutions-architect-associate-exam-video-course/', desc: '⭐ Full SAA-C03 video course — 1,031 slides, comprehensive coverage. One of the best available.', free: false },
      { title: 'TutorialsDojo Practice Exams', url: 'https://tutorialsdojo.com/', desc: 'High-quality timed practice exams — very close to real exam style. The gold standard for SAA-C03 practice.', free: false },
      { title: 'Neal Davis Practice Tests', url: 'https://www.udemy.com/user/n-davis-5/', desc: 'Excellent timed practice exams on Udemy for multiple certs', free: false },
      { title: 'Examtopics AWS', url: 'https://www.examtopics.com/exams/amazon/', desc: 'Community-sourced questions — use as a supplement, not a primary source', free: true },
      { title: 'AWS Flashcards (Anki)', url: 'https://ankiweb.net/shared/info/1806131571', desc: 'Spaced-repetition flashcards for AWS services and terms', free: true },
    ],
  },
  {
    id: 'labs',
    category: 'Hands-On Labs',
    icon: '🏗️',
    color: '#ffedd5',
    text: '#c2410c',
    items: [
      { title: 'AWS Free Tier', url: 'https://aws.amazon.com/free/', desc: 'Build real infrastructure for free. Hands-on = highest retention rate', free: true },
      { title: 'Cloud Quest (AWS)', url: 'https://aws.amazon.com/training/digital/aws-cloud-quest/', desc: 'Gamified learning with real AWS labs. Great for Foundational level', free: true },
      { title: 'Instruqt', url: 'https://play.instruqt.com/awspartner', desc: 'Browser-based AWS sandboxes — no account needed', free: true },
    ],
  },
  {
    id: 'cheatsheets',
    category: 'Cheat Sheets',
    icon: '📖',
    color: '#fce7f3',
    text: '#be185d',
    items: [
      { title: 'TutorialsDojo Cheat Sheets', url: 'https://tutorialsdojo.com/aws-cheat-sheets/', desc: 'One-page service summaries — perfect for last-minute review', free: true },
      { title: 'DigitalCloud Comparison Tables', url: 'https://digitalcloud.training/aws-cheat-sheets/', desc: 'Side-by-side comparisons of similar services — S3 vs EFS vs EBS and more', free: true },
      { title: 'AWS Icons & Architecture Diagrams', url: 'https://aws.amazon.com/architecture/icons/', desc: 'Official icon sets for building architecture diagrams', free: true },
    ],
  },
  {
    id: 'community',
    category: 'Communities',
    icon: '💬',
    color: '#e0f2fe',
    text: '#0369a1',
    items: [
      { title: 'r/AWSCertifications', url: 'https://www.reddit.com/r/AWSCertifications/', desc: 'Active community with study tips, exam experiences, and real advice', free: true },
      { title: 'AWS Discord', url: 'https://discord.gg/aws', desc: 'Real-time chat with AWS learners and practitioners worldwide', free: true },
      { title: 'A Cloud Guru Forums', url: 'https://acloud.guru/forums', desc: 'Course-specific Q&A and study group discussions', free: true },
    ],
  },
]

export default function Resources() {
  const [activeFilter, setActiveFilter] = useState('all')
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)

  const filtered = activeFilter === 'all' ? resources : resources.filter(r => r.id === activeFilter)

  return (
    <Layout>

      {/* ── Hero ── */}
      <div style={{ background: 'linear-gradient(160deg, #0f172a 0%, #1e3a8a 60%, #1d4ed8 100%)', padding: '4rem 1.5rem 3rem', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-60px', left: '15%', width: '300px', height: '300px', background: 'rgba(96,165,250,0.12)', borderRadius: '50%', filter: 'blur(70px)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '-40px', right: '10%', width: '250px', height: '250px', background: 'rgba(139,92,246,0.1)', borderRadius: '50%', filter: 'blur(60px)', pointerEvents: 'none' }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '999px', padding: '0.4rem 1rem', marginBottom: '1.25rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#93c5fd', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Curated by an engineer</span>
          </div>
          <h1 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 900, color: '#fff', marginBottom: '0.75rem', letterSpacing: '-0.02em' }}>
            Everything I Used to Study AWS
          </h1>
          <p style={{ color: '#93c5fd', fontSize: '1rem', lineHeight: 1.7, maxWidth: '480px', margin: '0 auto 1rem' }}>
            The best courses, practice tools, cheat sheets, and communities — all in one place so you don't have to hunt.
          </p>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(34,197,94,0.15)', border: '1px solid rgba(34,197,94,0.3)', borderRadius: '999px', padding: '4px 14px', fontSize: '0.78rem', fontWeight: 700, color: '#4ade80' }}>
            ✅ 3,958 practice questions derived from AWS official documentation and exam objectives
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '2.5rem 1.5rem' }}>

        {/* ── Filter tabs ── */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
          <button
            onClick={() => setActiveFilter('all')}
            style={{ padding: '0.45rem 1rem', borderRadius: '999px', fontSize: '0.8rem', fontWeight: 700, border: 'none', cursor: 'pointer', background: activeFilter === 'all' ? '#111827' : '#fff', color: activeFilter === 'all' ? '#fff' : '#6b7280', boxShadow: activeFilter === 'all' ? 'none' : '0 0 0 1px #e5e7eb' }}
          >
            All Resources
          </button>
          {resources.map(r => (
            <button
              key={r.id}
              onClick={() => setActiveFilter(r.id)}
              style={{ padding: '0.45rem 1rem', borderRadius: '999px', fontSize: '0.8rem', fontWeight: 700, border: 'none', cursor: 'pointer', background: activeFilter === r.id ? '#111827' : '#fff', color: activeFilter === r.id ? '#fff' : '#6b7280', boxShadow: activeFilter === r.id ? 'none' : '0 0 0 1px #e5e7eb' }}
            >
              {r.icon} {r.category}
            </button>
          ))}
        </div>

        {/* ── Resource sections ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
          {filtered.map(section => (
            <div key={section.id}>
              {/* Section header */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                <div style={{ width: '36px', height: '36px', background: section.color, borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', flexShrink: 0 }}>
                  {section.icon}
                </div>
                <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#111827', margin: 0 }}>{section.category}</h2>
                <span style={{ fontSize: '0.75rem', color: '#9ca3af', fontWeight: 600 }}>{section.items.length} resources</span>
              </div>

              {/* Cards grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' }}>
                {section.items.map(item => {
                  const key = `${section.id}-${item.title}`
                  const hovered = hoveredItem === key
                  return (
                    <a
                      key={item.title}
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onMouseEnter={() => setHoveredItem(key)}
                      onMouseLeave={() => setHoveredItem(null)}
                      style={{
                        display: 'flex', flexDirection: 'column', gap: '0.5rem',
                        background: hovered ? section.color : '#fff',
                        border: `1px solid ${hovered ? section.text + '40' : '#e5e7eb'}`,
                        borderRadius: '1rem', padding: '1.125rem 1.25rem',
                        textDecoration: 'none', transition: 'all 0.18s',
                        transform: hovered ? 'translateY(-2px)' : 'none',
                        boxShadow: hovered ? '0 6px 20px rgba(0,0,0,0.08)' : 'none',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem' }}>
                        <div style={{ fontWeight: 700, color: hovered ? section.text : '#1d4ed8', fontSize: '0.875rem', lineHeight: 1.4 }}>{item.title}</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', flexShrink: 0 }}>
                          <span style={{
                            fontSize: '0.65rem', fontWeight: 700, padding: '0.2rem 0.5rem', borderRadius: '999px',
                            background: item.free ? '#dcfce7' : '#fef3c7',
                            color: item.free ? '#15803d' : '#92400e',
                          }}>
                            {item.free ? 'FREE' : 'PAID'}
                          </span>
                          <span style={{ color: '#9ca3af', fontSize: '0.9rem' }}>↗</span>
                        </div>
                      </div>
                      <div style={{ fontSize: '0.8rem', color: hovered ? section.text + 'cc' : '#6b7280', lineHeight: 1.55 }}>{item.desc}</div>
                    </a>
                  )
                })}
              </div>
            </div>
          ))}
        </div>

        {/* ── Service Comparison CTA ── */}
        <div style={{ marginTop: '2.5rem', background: 'linear-gradient(135deg, #f0fdf4, #dcfce7)', border: '1px solid #86efac', borderRadius: '1.25rem', padding: '1.5rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <div>
            <p style={{ fontSize: '1rem', fontWeight: 800, color: '#14532d', margin: '0 0 0.3rem' }}>🔍 AWS Service Comparison Guide</p>
            <p style={{ fontSize: '0.85rem', color: '#166534', margin: 0, lineHeight: 1.6 }}>
              20 side-by-side comparisons across 7 groups — S3 vs EFS, SQS vs SNS, NAT Gateway vs Instance, and more. Built for exam day.
            </p>
          </div>
          <a href="/service-comparison" style={{ flexShrink: 0, padding: '0.625rem 1.25rem', background: '#16a34a', color: '#fff', borderRadius: '0.75rem', fontWeight: 700, fontSize: '0.85rem', textDecoration: 'none', whiteSpace: 'nowrap' }}>
            View Comparisons →
          </a>
        </div>

        {/* ── Pro tip ── */}
        <div style={{ marginTop: '3rem', background: 'linear-gradient(135deg, #0f172a, #1e3a8a)', borderRadius: '1.25rem', padding: '1.75rem 2rem', display: 'flex', gap: '1.25rem', alignItems: 'flex-start' }}>
          <div style={{ fontSize: '1.75rem', flexShrink: 0 }}>💡</div>
          <div>
            <p style={{ fontSize: '0.9rem', fontWeight: 800, color: '#fff', margin: '0 0 0.375rem' }}>My study combo that works</p>
            <p style={{ fontSize: '0.85rem', color: '#93c5fd', margin: 0, lineHeight: 1.65 }}>
              One solid video course (Stephane Maarek or Adrian Cantrill) + practice questions here on CertiPrepAI + one cheat sheet set for last-minute review. That trio is what passes most AWS exams.
            </p>
          </div>
        </div>

      </div>
    </Layout>
  )
}
