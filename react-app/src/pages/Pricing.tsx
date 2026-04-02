import { useState, useEffect, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import Layout from '../components/Layout'
import { useAuth } from '../contexts/AuthContext'

// Same constants + payload as Signup.tsx — proven to work
const CHECKOUT_API   = 'https://alwdh4nsomuznniu6yhjgf5i6y0xbzve.lambda-url.us-east-1.on.aws/'
const PLAN_PRICE_IDS: Record<string,string> = {
  monthly:  'price_1TB1YCE9neqrFM5LDbyzVSnv',
  yearly:   'price_1TED8EE9neqrFM5LCIL9P0Yp',
  lifetime: 'price_1TED9ME9neqrFM5LeKAAEWTO',
}
const PLAN_MODES: Record<string,string> = {
  monthly: 'subscription', yearly: 'subscription', lifetime: 'payment',
}

const TIER_RANK: Record<string, number> = { free: 0, monthly: 1, yearly: 2, lifetime: 3 }

const DOWNGRADE_LABEL: Record<string, string> = {
  Free:     'Switch to Free',
  Monthly:  'Switch to Monthly',
  Yearly:   'Switch to Yearly',
  Lifetime: 'Get Lifetime',
}

const MOTIVATE_NOTE: Record<string, string> = {
  // shown above the CTA when a plan is the next upgrade
  Yearly:   '🔥 Save $17 vs monthly — most popular',
  Lifetime: '🏆 Pay once. Study forever. Best ROI.',
}

const plans = [
  {
    name: 'Free',
    price: '$0',
    oldPrice: null,
    period: 'forever',
    savings: null,
    badge: null,
    badgeColor: '',
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
    badge: '⚡ Cancel Anytime',
    badgeColor: '#0284c7',
    highlight: false,
    features: [
      '1 AWS certification at a time',
      'Switch cert once every 30 days',
      '260 questions for your chosen cert',
      'Timed mock exam (65q, 130 min)',
      'Domain filtering — focus weak areas',
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
    badgeColor: '#2563eb',
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
    badgeColor: '#1e3a8a',
    highlight: false,
    features: [
      'Everything in Yearly',
      'AI Coach (exclusive — lifetime only)',
      'All future certifications included',
      'Pay once, use forever',
      'No recurring fees, ever',
    ],
    cta: 'Get Lifetime Access',
    ctaBg: '#1e3a8a',
    action: '/signup?plan=lifetime',
  },
]


export default function Pricing() {
  const navigate = useNavigate()
  const location = useLocation()
  const { tier, user } = useAuth()
  const [hovered, setHovered] = useState<string | null>(null)
  const [hoveredBtn, setHoveredBtn] = useState<string | null>(null)
  const [checkingOut, setCheckingOut] = useState<string | null>(null)
  const yearlyRef = useRef<HTMLDivElement>(null)
  const [pulseYearly, setPulseYearly] = useState(false)

  const userRank = TIER_RANK[tier ?? 'free'] ?? 0

  const handlePlanClick = async (plan: typeof plans[0]) => {
    const key = plan.name.toLowerCase()
    // Logged-in user + paid plan → direct Stripe checkout, skip signup
    if (user?.email && PLAN_PRICE_IDS[key]) {
      setCheckingOut(plan.name)
      try {
        const res  = await fetch(CHECKOUT_API, {
          method:  'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ priceId: PLAN_PRICE_IDS[key], mode: PLAN_MODES[key], tier: key, email: user.email }),
        })
        const data = await res.json()
        if (data.url) { window.location.href = data.url; return }
        // API returned but no URL — show error, don't redirect to signup
        alert('Checkout error. Please try again or contact support.')
      } catch {
        alert('Unable to start checkout. Please try again.')
      } finally { setCheckingOut(null) }
      return // never fall through to navigate for logged-in users
    }
    // Not logged in → signup flow
    navigate(plan.action)
  }

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    if (params.get('highlight') === 'yearly') {
      // Small delay so layout is fully rendered before scrolling
      setTimeout(() => {
        yearlyRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
        setPulseYearly(true)
        setTimeout(() => setPulseYearly(false), 2800)
      }, 150)
    }
  }, [location.search])

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
          {plans.map((plan) => {
            const isHovered = hovered === plan.name
            const isYearly = plan.name === 'Yearly'
            const isPulsing = isYearly && pulseYearly
            const planRank = TIER_RANK[plan.name.toLowerCase()] ?? 0
            const isCurrent  = tier && planRank === userRank
            const isNextUp   = tier && planRank === userRank + 1
            const isDowngrade = tier && planRank < userRank
            return (
              <div
                key={plan.name}
                ref={isYearly ? yearlyRef : undefined}
                onMouseEnter={() => setHovered(plan.name)}
                onMouseLeave={() => setHovered(null)}
                style={{
                  background: isCurrent ? '#f0fdf4' : isDowngrade ? '#fafafa' : '#fff',
                  borderRadius: '1rem',
                  border: isCurrent
                    ? '2px solid #16a34a'
                    : isPulsing
                      ? '3px solid #7c3aed'
                      : isHovered
                        ? `2px solid ${plan.ctaBg}`
                        : isDowngrade
                          ? '2px solid #e5e7eb'
                          : '2px solid #e5e7eb',
                  padding: '1.75rem 1.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative',
                  opacity: isDowngrade ? 0.72 : 1,
                  boxShadow: isCurrent
                    ? '0 0 0 4px rgba(22,163,74,0.12)'
                    : isPulsing
                      ? '0 0 0 6px rgba(124,58,237,0.18), 0 16px 40px rgba(0,0,0,0.13)'
                      : isHovered
                        ? '0 16px 40px rgba(0,0,0,0.13), 0 4px 12px rgba(0,0,0,0.07)'
                        : '0 1px 4px rgba(0,0,0,0.06)',
                  transform: isPulsing
                    ? 'translateY(-10px) scale(1.03)'
                    : isHovered ? 'translateY(-8px) scale(1.02)' : 'translateY(0) scale(1)',
                  transition: 'transform 0.22s ease, box-shadow 0.22s ease, border-color 0.22s ease, opacity 0.22s ease',
                  cursor: isCurrent ? 'default' : 'pointer',
                  zIndex: isCurrent || isPulsing || isHovered ? 2 : 1,
                }}
              >
                {/* "Your Plan" badge — takes priority over marketing badges */}
                {isCurrent ? (
                  <div style={{
                    position: 'absolute',
                    top: '-14px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: '#16a34a',
                    color: '#fff',
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    padding: '0.25rem 0.75rem',
                    borderRadius: '999px',
                    whiteSpace: 'nowrap',
                  }}>
                    ✓ Your Plan
                  </div>
                ) : plan.badge && (
                  <div style={{
                    position: 'absolute',
                    top: '-14px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: plan.badgeColor,
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

                {/* Plan Name + Price */}
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

                {/* Motivational note — shown above CTA when this is the next upgrade */}
                {isNextUp && MOTIVATE_NOTE[plan.name] && (
                  <div style={{
                    marginBottom: '0.6rem',
                    fontSize: '0.72rem',
                    fontWeight: 600,
                    color: '#1d4ed8',
                    background: '#eff6ff',
                    border: '1px solid #bfdbfe',
                    borderRadius: '0.5rem',
                    padding: '0.3rem 0.6rem',
                    textAlign: 'center',
                  }}>
                    {MOTIVATE_NOTE[plan.name]}
                  </div>
                )}

                {/* CTA Button */}
                <button
                  onClick={() => { if (!isCurrent) handlePlanClick(plan) }}
                  onMouseEnter={() => setHoveredBtn(plan.name)}
                  onMouseLeave={() => setHoveredBtn(null)}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    background: isCurrent
                      ? '#d1fae5'
                      : isDowngrade
                        ? '#f3f4f6'
                        : plan.ctaBg,
                    color: isCurrent ? '#15803d' : isDowngrade ? '#6b7280' : '#fff',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    border: isCurrent ? '1.5px solid #86efac' : isDowngrade ? '1.5px solid #e5e7eb' : 'none',
                    borderRadius: '0.75rem',
                    cursor: isCurrent ? 'default' : 'pointer',
                    opacity: hoveredBtn === plan.name && !isCurrent ? 0.85 : 1,
                    transition: 'opacity 0.15s',
                  }}
                >
                  {isCurrent
                    ? '✓ Your Current Plan'
                    : checkingOut === plan.name
                      ? '⏳ Opening checkout…'
                      : isDowngrade
                        ? DOWNGRADE_LABEL[plan.name]
                        : plan.cta}
                </button>
              </div>
            )
          })}
        </div>


        {/* Bottom CTA */}
        <div style={{ background: '#111827', borderRadius: '1rem', padding: '2.5rem', textAlign: 'center', color: '#fff' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 900, margin: '0 0 0.5rem' }}>
            Ready to pass your AWS cert?
          </h2>
          <p style={{ color: '#9ca3af', margin: '0 0 1.5rem', fontSize: '0.95rem' }}>
            20 free questions — no credit card, no sign-up.
          </p>
          <button
            onClick={() => navigate('/sample-questions')}
            style={{ padding: '0.85rem 2rem', background: '#2563eb', color: '#fff', fontWeight: 700, fontSize: '0.95rem', border: 'none', borderRadius: '0.75rem', cursor: 'pointer' }}
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
