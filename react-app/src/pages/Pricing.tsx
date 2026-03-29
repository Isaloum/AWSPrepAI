import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'

const plans = [
  {
    name: 'Free',
    price: '$0',
    oldPrice: null,
    period: 'forever',
    savings: null,
    badge: null,
    highlight: false,
    features: [
      '20 free sample questions',
      'No sign-up required',
      'Instant explanations included',
      'Browse all 12 certifications',
    ],
    cta: 'Start Free',
    ctaBg: '#111827',
    action: '/sample-questions',
  },
  {
    name: 'Monthly',
    price: '$7',
    oldPrice: null,
    period: 'per month',
    savings: null,
    badge: null,
    highlight: false,
    features: [
      'All 12 AWS certifications',
      '260 questions per cert (3,120 total)',
      'Timed mock exam per cert (65q, 90 min)',
      'Visual Exam + Architecture Builder',
      'Architecture Diagrams library',
      'Domain filtering — focus weak areas',
      'Cancel anytime',
    ],
    cta: 'Start Monthly',
    ctaBg: '#2563eb',
    action: '/signup?plan=monthly',
  },
  {
    name: 'Yearly',
    price: '$67',
    oldPrice: '$84',
    period: 'per year',
    savings: '🔥 Save $17 — ~$5.60/month',
    badge: '⭐ Most Popular',
    highlight: true,
    features: [
      'Everything in Monthly',
      'All 12 AWS certifications',
      '260 questions per cert (3,120 total)',
      'Timed mock exams included',
      'Visual Exam + Architecture Builder',
      'Architecture Diagrams library',
      'Best price for serious learners',
    ],
    cta: 'Lock In Yearly',
    ctaBg: '#1d4ed8',
    action: '/signup?plan=yearly',
  },
  {
    name: 'Lifetime',
    price: '$147',
    oldPrice: '$499',
    period: 'one-time',
    savings: '💡 AWS cert = avg $15K salary boost',
    badge: '🔥 Best Value',
    highlight: false,
    features: [
      'Everything in Yearly',
      'AI Coach (exclusive — lifetime only)',
      'All future certifications included',
      'Pay once, use forever',
      'No recurring fees, ever',
    ],
    cta: 'Get Lifetime Access',
    ctaBg: '#d97706',
    action: '/signup?plan=lifetime',
  },
]

const faqs = [
  { q: 'Can I try before buying?', a: '20 free sample questions — no sign-up needed. See exactly what you\'re getting before paying.' },
  { q: 'What\'s the pass rate for AWS exams?', a: 'AWS exams require 72% or higher. Our questions are scenario-based and match the real exam difficulty.' },
  { q: 'Does Lifetime include future certs?', a: 'Yes. Any new AWS certification we add is included in your Lifetime plan at no extra cost.' },
  { q: 'Can I cancel Monthly or Yearly anytime?', a: 'Yes, cancel from your dashboard with one click. No cancellation fees.' },
  { q: 'Is there a refund policy?', a: 'We offer a 7-day money-back guarantee if you\'re not satisfied.' },
  { q: 'What is the AI Coach?', a: 'AI Coach is an intelligent tutor that answers your questions, explains concepts, and gives personalized study plans. It\'s exclusively available on the Lifetime plan.' },
]

export default function Pricing() {
  const navigate = useNavigate()

  return (
    <Layout>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '3rem 1.5rem' }}>

        {/* Hero */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 900, color: '#111827', margin: '0 0 0.5rem' }}>
            Simple, Honest Pricing
          </h1>
          <p style={{ color: '#6b7280', fontSize: '1rem', margin: 0 }}>
            Start free. Upgrade when you're ready. No tricks.
          </p>
        </div>

        {/* Plans Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '1.25rem',
          marginBottom: '4rem',
          alignItems: 'stretch',
        }}>
          {plans.map((plan) => (
            <div
              key={plan.name}
              style={{
                background: '#fff',
                borderRadius: '1rem',
                border: plan.highlight ? '2px solid #2563eb' : '2px solid #e5e7eb',
                padding: '1.75rem 1.5rem',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                boxShadow: plan.highlight ? '0 4px 24px rgba(37,99,235,0.12)' : '0 1px 4px rgba(0,0,0,0.06)',
              }}
            >
              {/* Badge */}
              {plan.badge && (
                <div style={{
                  position: 'absolute',
                  top: '-14px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  background: plan.highlight ? '#2563eb' : '#d97706',
                  color: '#fff',
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  padding: '0.25rem 0.75rem',
                  borderRadius: '999px',
                  whiteSpace: 'nowrap',
                }}>
                  {plan.badge}
                </div>
              )}

              {/* Plan Name */}
              <div style={{ marginBottom: '1rem' }}>
                <h3 style={{ fontWeight: 900, color: '#111827', fontSize: '1.1rem', margin: '0 0 0.5rem' }}>
                  {plan.name}
                </h3>
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: '0.4rem' }}>
                  <span style={{ fontSize: '2.25rem', fontWeight: 900, color: '#111827', lineHeight: 1 }}>
                    {plan.price}
                  </span>
                  {plan.oldPrice && (
                    <span style={{ fontSize: '0.85rem', color: '#9ca3af', textDecoration: 'line-through', marginBottom: '0.2rem' }}>
                      {plan.oldPrice}
                    </span>
                  )}
                  <span style={{ fontSize: '0.8rem', color: '#6b7280', marginBottom: '0.2rem' }}>
                    /{plan.period}
                  </span>
                </div>
                {plan.savings && (
                  <div style={{
                    marginTop: '0.6rem',
                    fontSize: '0.72rem',
                    fontWeight: 600,
                    color: '#15803d',
                    background: '#f0fdf4',
                    border: '1px solid #bbf7d0',
                    borderRadius: '0.5rem',
                    padding: '0.3rem 0.6rem',
                    lineHeight: 1.4,
                  }}>
                    {plan.savings}
                  </div>
                )}
              </div>

              {/* Features */}
              <ul style={{ listStyle: 'none', margin: '0 0 1.5rem', padding: 0, flex: 1, display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                {plan.features.map((f) => (
                  <li key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.82rem', color: '#374151' }}>
                    <span style={{ color: '#16a34a', marginTop: '0.1rem', flexShrink: 0, fontWeight: 700 }}>✓</span>
                    {f}
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <button
                onClick={() => navigate(plan.action)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  background: plan.ctaBg,
                  color: '#fff',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  border: 'none',
                  borderRadius: '0.75rem',
                  cursor: 'pointer',
                  transition: 'opacity 0.15s',
                }}
                onMouseEnter={e => (e.currentTarget.style.opacity = '0.88')}
                onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
              >
                {plan.cta}
              </button>
            </div>
          ))}
        </div>

        {/* FAQ */}
        <div style={{ maxWidth: '680px', margin: '0 auto 4rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#111827', textAlign: 'center', marginBottom: '1.5rem' }}>
            FAQ
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {faqs.map((faq) => (
              <div
                key={faq.q}
                style={{
                  background: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '0.75rem',
                  padding: '1.25rem',
                }}
              >
                <p style={{ fontWeight: 700, color: '#111827', margin: '0 0 0.5rem', fontSize: '0.9rem' }}>{faq.q}</p>
                <p style={{ color: '#6b7280', fontSize: '0.85rem', margin: 0, lineHeight: 1.6 }}>{faq.a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div style={{
          background: '#111827',
          borderRadius: '1rem',
          padding: '2.5rem',
          textAlign: 'center',
          color: '#fff',
        }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 900, margin: '0 0 0.5rem' }}>
            Ready to pass your AWS cert?
          </h2>
          <p style={{ color: '#9ca3af', margin: '0 0 1.5rem', fontSize: '0.95rem' }}>
            20 free questions — no credit card, no sign-up.
          </p>
          <button
            onClick={() => navigate('/sample-questions')}
            style={{
              padding: '0.85rem 2rem',
              background: '#2563eb',
              color: '#fff',
              fontWeight: 700,
              fontSize: '0.95rem',
              border: 'none',
              borderRadius: '0.75rem',
              cursor: 'pointer',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = '#1d4ed8')}
            onMouseLeave={e => (e.currentTarget.style.background = '#2563eb')}
          >
            Start Practicing Free →
          </button>
        </div>

      </div>
    </Layout>
  )
}
