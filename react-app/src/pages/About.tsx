import { Link } from 'react-router-dom'
import Layout from '../components/Layout'

export default function About() {
  return (
    <Layout>
      <div style={{ maxWidth: '720px', margin: '0 auto', padding: '3rem 1rem' }}>

        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>☁️</div>
          <h1 style={{ fontSize: '2rem', fontWeight: 900, color: '#111827', marginBottom: '0.75rem' }}>About AWSPrepAI</h1>
          <p style={{ color: '#6b7280', fontSize: '1.1rem', lineHeight: 1.7 }}>
            The fastest way to pass your AWS certification exam — built by engineers, for engineers.
          </p>
        </div>

        {/* Mission */}
        <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '1rem', padding: '1.5rem', marginBottom: '2rem' }}>
          <h2 style={{ fontWeight: 800, color: '#1d4ed8', marginBottom: '0.5rem', fontSize: '1.125rem' }}>Our Mission</h2>
          <p style={{ color: '#1e40af', lineHeight: 1.7, margin: 0 }}>
            AWS certifications unlock careers. We make prep accessible, efficient, and actually enjoyable. No bloated textbooks. No confusing interfaces. Just high-quality questions, instant feedback, and the confidence to walk into your exam ready.
          </p>
        </div>

        {/* What we offer */}
        <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#111827', marginBottom: '1rem' }}>What We Offer</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
          {[
            { icon: '📝', title: '3,120 Questions', desc: '260 per certification, across all 12 AWS certs' },
            { icon: '⏱️', title: 'Mock Exams', desc: '65-question timed tests mimicking the real exam' },
            { icon: '📖', title: 'AWS Glossary', desc: '50+ key terms explained simply' },
            { icon: '📚', title: 'Study Resources', desc: 'Curated links to the best AWS study materials' },
            { icon: '💡', title: 'Instant Explanations', desc: 'Learn why answers are right or wrong immediately' },
            { icon: '🎯', title: 'Domain Filtering', desc: 'Focus practice on your weakest areas' },
          ].map(item => (
            <div key={item.title} style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '0.875rem', padding: '1.125rem' }}>
              <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{item.icon}</div>
              <div style={{ fontWeight: 700, color: '#111827', fontSize: '0.9rem', marginBottom: '0.25rem' }}>{item.title}</div>
              <div style={{ fontSize: '0.8rem', color: '#6b7280', lineHeight: 1.5 }}>{item.desc}</div>
            </div>
          ))}
        </div>

        {/* Certifications */}
        <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#111827', marginBottom: '1rem' }}>12 Certifications Covered</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '2rem' }}>
          {[
            'CLF-C02 · Cloud Practitioner',
            'AIF-C01 · AI Practitioner',
            'SAA-C03 · Solutions Architect Associate',
            'DVA-C02 · Developer Associate',
            'SOA-C02 · SysOps Administrator',
            'DEA-C01 · Data Engineer Associate',
            'MLA-C01 · ML Engineer Associate',
            'GAI-C01 · Generative AI Developer',
            'SAP-C02 · Solutions Architect Professional',
            'DOP-C02 · DevOps Engineer Professional',
            'SCS-C03 · Security Specialty',
            'ANS-C01 · Advanced Networking',
          ].map(cert => (
            <span key={cert} style={{ padding: '0.375rem 0.875rem', background: '#f3f4f6', borderRadius: '999px', fontSize: '0.8rem', fontWeight: 600, color: '#374151' }}>
              {cert}
            </span>
          ))}
        </div>

        {/* FAQ */}
        <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#111827', marginBottom: '1rem' }}>Frequently Asked Questions</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2.5rem' }}>
          {[
            { q: 'Can I try before buying?', a: "20 free sample questions — no sign-up needed. See exactly what you're getting before paying." },
            { q: "What's the pass rate for AWS exams?", a: 'AWS exams require 72% or higher. Our questions are scenario-based and match the real exam difficulty.' },
            { q: 'Does Lifetime include future certs?', a: 'Yes. Any new AWS certification we add is included in your Lifetime plan at no extra cost.' },
            { q: 'Can I cancel Monthly or Yearly anytime?', a: 'Yes, cancel from your dashboard with one click. No cancellation fees.' },
            { q: 'What is the AI Coach?', a: "AI Coach is an intelligent tutor that answers your questions, explains concepts, and gives personalized study plans. It's exclusively available on the Lifetime plan." },
          ].map(faq => (
            <div key={faq.q} style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '0.75rem', padding: '1.1rem 1.25rem' }}>
              <p style={{ fontWeight: 700, color: '#111827', margin: '0 0 0.4rem', fontSize: '0.9rem' }}>{faq.q}</p>
              <p style={{ color: '#6b7280', fontSize: '0.85rem', margin: 0, lineHeight: 1.6 }}>{faq.a}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div style={{ textAlign: 'center', padding: '2rem', background: '#f9fafb', borderRadius: '1rem', border: '1px solid #e5e7eb' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#111827', marginBottom: '0.5rem' }}>Ready to start?</h2>
          <p style={{ color: '#6b7280', marginBottom: '1.25rem', fontSize: '0.95rem' }}>
            20 free questions — no credit card required.
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/sample-questions" style={{ padding: '0.75rem 1.5rem', background: '#2563eb', color: '#fff', borderRadius: '0.875rem', fontWeight: 700, textDecoration: 'none' }}>
              Start Practicing Free
            </Link>
            <Link to="/pricing" style={{ padding: '0.75rem 1.5rem', border: '1px solid #e5e7eb', background: '#fff', color: '#374151', borderRadius: '0.875rem', fontWeight: 700, textDecoration: 'none' }}>
              View Plans
            </Link>
          </div>
        </div>

      </div>
    </Layout>
  )
}
