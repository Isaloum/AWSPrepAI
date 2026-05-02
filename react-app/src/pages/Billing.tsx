/**
 * Billing.tsx
 * Subscription management for paying users.
 * Shows current plan + upgrade options via awsprepai-upgrade-subscription Lambda.
 */
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import { useAuth } from '../contexts/AuthContext'

const CHECKOUT_API = 'https://34zglioc5a.execute-api.us-east-1.amazonaws.com/checkout'
const UPGRADE_API  = 'https://d8bmltyjpe.execute-api.us-east-1.amazonaws.com'
const CANCEL_API   = 'https://hpcdl0ft8a.execute-api.us-east-1.amazonaws.com'

const TIER_RANK: Record<string, number> = { free: 0, monthly: 1, bundle: 1.5, yearly: 2, lifetime: 3 }

const PLAN_INFO: Record<string, { label: string; color: string; bg: string; icon: string; desc: string; price: string }> = {
  free:     { label: 'Free',     icon: '🆓', color: '#6b7280', bg: '#f9fafb', desc: '20 sample questions, no payment required', price: '$0/mo' },
  monthly:  { label: 'Monthly',  icon: '📦', color: '#2563eb', bg: '#eff6ff', desc: 'Access to 1 certification of your choice',  price: '$7/mo' },
  bundle:   { label: '3-Cert Bundle', icon: '🎯', color: '#0891b2', bg: '#ecfeff', desc: 'Access to any 3 certifications',         price: '$17/mo' },
  yearly:   { label: 'Yearly',   icon: '📅', color: '#7c3aed', bg: '#f5f3ff', desc: 'All 12 certifications, best annual value',   price: '$67/yr' },
  lifetime: { label: 'Lifetime', icon: '🔥', color: '#dc2626', bg: '#fef2f2', desc: 'All 12 certs + AI Coach, pay once forever',   price: '$147 once' },
}

const upgradePlans = [
  { key: 'monthly',  name: 'Monthly',  price: '$7/mo',   priceId: 'monthly',  desc: '1 cert · switch anytime' },
  { key: 'bundle',   name: '3-Cert Bundle', price: '$17/mo', priceId: 'bundle', desc: '3 certs of your choice' },
  { key: 'yearly',   name: 'Yearly',   price: '$67/yr',  priceId: 'yearly',   desc: 'All 12 certs, best annual value' },
  { key: 'lifetime', name: 'Lifetime', price: '$147',    priceId: 'lifetime', desc: 'Pay once, forever access' },
]

export default function Billing() {
  const { user, tier, loading } = useAuth()
  const navigate = useNavigate()

  const [upgradeModal, setUpgradeModal] = useState<{
    plan: typeof upgradePlans[0]
    state: 'loading' | 'preview' | 'confirming' | 'done'
    amount?: string
    error?: string
  } | null>(null)

  const [cancelModal, setCancelModal] = useState<'idle' | 'confirm' | 'loading' | 'done' | 'error'>('idle')
  const [cancelError, setCancelError] = useState('')

  const handleCancelSubscription = async () => {
    setCancelModal('loading')
    try {
      const res = await fetch(`${CANCEL_API}/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${user!.accessToken}` },
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Cancellation failed.')
      setCancelModal('done')
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Something went wrong.'
      setCancelError(msg)
      setCancelModal('error')
    }
  }

  if (!loading && !user) {
    navigate('/login')
    return null
  }

  if (loading) {
    return (
      <Layout>
        <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ color: '#9ca3af', fontSize: '0.95rem' }}>Loading…</div>
        </div>
      </Layout>
    )
  }

  const userRank = TIER_RANK[tier] ?? 0
  const info = PLAN_INFO[tier] ?? PLAN_INFO.free

  const handleUpgradeClick = async (plan: typeof upgradePlans[0]) => {
    // Lifetime: new checkout session
    if (plan.key === 'lifetime') {
      setUpgradeModal({ plan, state: 'loading' })
      try {
        const res = await fetch(CHECKOUT_API, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ plan: 'lifetime', email: user!.email }),
        })
        const data = await res.json()
        if (data.url) { window.location.href = data.url; return }
        setUpgradeModal(prev => prev ? { ...prev, state: 'preview', error: 'Could not create checkout session.' } : null)
      } catch {
        setUpgradeModal(prev => prev ? { ...prev, state: 'preview', error: 'Network error. Try again.' } : null)
      }
      return
    }

    // Prorated upgrade
    setUpgradeModal({ plan, state: 'loading' })
    try {
      const res = await fetch(`${UPGRADE_API}/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${user!.accessToken}` },
        body: JSON.stringify({ action: 'preview', targetPlan: plan.key }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Preview failed')
      setUpgradeModal({ plan, state: 'preview', amount: data.amountDue != null ? `$${(data.amountDue / 100).toFixed(2)}` : undefined })
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Preview failed.'
      setUpgradeModal({ plan, state: 'preview', error: msg })
    }
  }

  const handleUpgradeConfirm = async () => {
    if (!upgradeModal) return
    setUpgradeModal(prev => prev ? { ...prev, state: 'confirming' } : null)
    try {
      const res = await fetch(`${UPGRADE_API}/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${user!.accessToken}` },
        body: JSON.stringify({ action: 'upgrade', targetPlan: upgradeModal.plan.key }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Upgrade failed')
      if (data.url) { window.location.href = data.url; return }
      setUpgradeModal(prev => prev ? { ...prev, state: 'done' } : null)
      setTimeout(() => { window.location.reload() }, 2000)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Upgrade failed.'
      setUpgradeModal(prev => prev ? { ...prev, state: 'preview', error: msg } : null)
    }
  }

  return (
    <Layout>
      <div style={{ maxWidth: '700px', margin: '0 auto', padding: '2.5rem 1.5rem' }}>

        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 900, color: '#111827', margin: '0 0 0.25rem' }}>
            Billing & Subscription
          </h1>
          <p style={{ color: '#6b7280', fontSize: '0.9rem', margin: 0 }}>
            Manage your plan and payment settings.
          </p>
        </div>

        {/* Current Plan Card */}
        <div style={{ background: info.bg, border: `2px solid ${info.color}30`, borderRadius: '1rem', padding: '1.5rem', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '2rem' }}>{info.icon}</span>
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: info.color, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Current Plan</div>
              <div style={{ fontSize: '1.3rem', fontWeight: 900, color: '#111827' }}>{info.label}</div>
            </div>
            <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: info.color }}>{info.price}</div>
            </div>
          </div>
          <p style={{ color: '#4b5563', fontSize: '0.875rem', margin: 0 }}>{info.desc}</p>
        </div>

        {/* Upgrade Options */}
        {tier !== 'lifetime' && (
          <>
            <h2 style={{ fontSize: '1rem', fontWeight: 800, color: '#111827', marginBottom: '1rem' }}>
              Change Plan
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem' }}>
              {upgradePlans.map(plan => {
                const planRank = TIER_RANK[plan.key] ?? 0
                const isCurrent = plan.key === tier
                const isDowngrade = planRank < userRank

                if (isCurrent) {
                  return (
                    <div key={plan.key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 1.25rem', borderRadius: '0.75rem', border: '2px solid #2563eb', background: '#eff6ff' }}>
                      <div>
                        <div style={{ fontWeight: 700, color: '#111827', fontSize: '0.95rem' }}>{plan.name}</div>
                        <div style={{ color: '#6b7280', fontSize: '0.8rem', marginTop: '2px' }}>{plan.desc}</div>
                      </div>
                      <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#2563eb', background: '#dbeafe', padding: '4px 10px', borderRadius: '999px' }}>Current</span>
                    </div>
                  )
                }

                if (isDowngrade) {
                  return (
                    <div key={plan.key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 1.25rem', borderRadius: '0.75rem', border: '1px solid #e5e7eb', background: '#f9fafb', opacity: 0.6 }}>
                      <div>
                        <div style={{ fontWeight: 600, color: '#374151', fontSize: '0.95rem' }}>{plan.name} — {plan.price}</div>
                        <div style={{ color: '#9ca3af', fontSize: '0.8rem', marginTop: '2px' }}>Not available as a downgrade</div>
                      </div>
                    </div>
                  )
                }

                return (
                  <div key={plan.key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 1.25rem', borderRadius: '0.75rem', border: '1px solid #e5e7eb', background: '#fff' }}>
                    <div>
                      <div style={{ fontWeight: 700, color: '#111827', fontSize: '0.95rem' }}>
                        {plan.name} — {plan.price}
                        {plan.key === 'yearly' && <span style={{ marginLeft: '8px', fontSize: '0.72rem', fontWeight: 700, color: '#7c3aed', background: '#f5f3ff', padding: '2px 8px', borderRadius: '999px' }}>🔥 Most Popular</span>}
                      </div>
                      <div style={{ color: '#6b7280', fontSize: '0.8rem', marginTop: '2px' }}>{plan.desc}</div>
                    </div>
                    <button
                      onClick={() => handleUpgradeClick(plan)}
                      style={{ padding: '8px 18px', background: '#2563eb', color: '#fff', fontWeight: 700, border: 'none', borderRadius: '0.6rem', cursor: 'pointer', fontSize: '0.85rem', whiteSpace: 'nowrap', flexShrink: 0, marginLeft: '1rem' }}
                    >
                      ↑ Upgrade
                    </button>
                  </div>
                )
              })}
            </div>
          </>
        )}

        {/* Cancel Subscription */}
        {tier !== 'free' && tier !== 'lifetime' && (
          <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
              <div>
                <p style={{ fontWeight: 700, color: '#374151', fontSize: '0.875rem', margin: '0 0 0.2rem' }}>
                  Cancel Subscription
                </p>
                <p style={{ color: '#9ca3af', fontSize: '0.8rem', margin: 0 }}>
                  You'll keep access until the end of your current billing period.
                </p>
              </div>
              <button
                onClick={() => setCancelModal('confirm')}
                style={{ padding: '8px 18px', background: '#fff', color: '#dc2626', border: '1.5px solid #fca5a5', borderRadius: '0.6rem', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0 }}
              >
                Cancel Plan
              </button>
            </div>
          </div>
        )}

      </div>

      {/* Cancel Modal */}
      {cancelModal !== 'idle' && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
          <div style={{ background: '#fff', borderRadius: '1rem', padding: '2rem', maxWidth: '400px', width: '100%', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>

            {cancelModal === 'confirm' && (
              <>
                <div style={{ fontSize: '2rem', marginBottom: '0.75rem', textAlign: 'center' }}>⚠️</div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#111827', marginBottom: '0.5rem', textAlign: 'center' }}>
                  Cancel your subscription?
                </h3>
                <p style={{ color: '#6b7280', fontSize: '0.875rem', lineHeight: 1.6, marginBottom: '1.5rem', textAlign: 'center' }}>
                  Your plan will stay active until the end of the current billing period. After that, your account reverts to the free tier.
                </p>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <button
                    onClick={() => setCancelModal('idle')}
                    style={{ flex: 1, padding: '0.7rem', background: '#f3f4f6', color: '#374151', border: '1px solid #e5e7eb', borderRadius: '0.75rem', fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer' }}
                  >
                    Keep Plan
                  </button>
                  <button
                    onClick={handleCancelSubscription}
                    style={{ flex: 1, padding: '0.7rem', background: '#dc2626', color: '#fff', border: 'none', borderRadius: '0.75rem', fontWeight: 700, fontSize: '0.875rem', cursor: 'pointer' }}
                  >
                    Yes, Cancel
                  </button>
                </div>
              </>
            )}

            {cancelModal === 'loading' && (
              <div style={{ textAlign: 'center', padding: '1rem 0' }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>⏳</div>
                <p style={{ color: '#6b7280' }}>Cancelling subscription…</p>
              </div>
            )}

            {cancelModal === 'done' && (
              <div style={{ textAlign: 'center', padding: '1rem 0' }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>✅</div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#111827', marginBottom: '0.5rem' }}>
                  Subscription cancelled
                </h3>
                <p style={{ color: '#6b7280', fontSize: '0.875rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                  You'll keep full access until your billing period ends. We're sorry to see you go — you're always welcome back.
                </p>
                <button
                  onClick={() => setCancelModal('idle')}
                  style={{ padding: '0.7rem 1.5rem', background: '#f3f4f6', color: '#374151', border: '1px solid #e5e7eb', borderRadius: '0.75rem', fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer' }}
                >
                  Close
                </button>
              </div>
            )}

            {cancelModal === 'error' && (
              <>
                <div style={{ fontSize: '2rem', marginBottom: '0.75rem', textAlign: 'center' }}>❌</div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#111827', marginBottom: '0.5rem', textAlign: 'center' }}>
                  Something went wrong
                </h3>
                <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '0.5rem', padding: '0.6rem 0.85rem', color: '#b91c1c', fontSize: '0.83rem', marginBottom: '1.25rem', textAlign: 'center' }}>
                  {cancelError}
                </div>
                <p style={{ color: '#9ca3af', fontSize: '0.8rem', textAlign: 'center', marginBottom: '1.25rem' }}>
                  Please email <a href="mailto:support@certiprepai.com" style={{ color: '#2563eb' }}>support@certiprepai.com</a> if this keeps happening.
                </p>
                <button
                  onClick={() => setCancelModal('idle')}
                  style={{ width: '100%', padding: '0.7rem', background: '#f3f4f6', color: '#374151', border: '1px solid #e5e7eb', borderRadius: '0.75rem', fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer' }}
                >
                  Close
                </button>
              </>
            )}

          </div>
        </div>
      )}

      {/* Upgrade Modal */}
      {upgradeModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
          <div style={{ background: '#fff', borderRadius: '1rem', padding: '2rem', maxWidth: '400px', width: '100%', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>
            {upgradeModal.state === 'loading' && (
              <div style={{ textAlign: 'center', padding: '1rem 0' }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>⏳</div>
                <p style={{ color: '#6b7280' }}>Calculating proration…</p>
              </div>
            )}
            {upgradeModal.state === 'done' && (
              <div style={{ textAlign: 'center', padding: '1rem 0' }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>🎉</div>
                <p style={{ color: '#16a34a', fontWeight: 700 }}>Plan upgraded! Refreshing…</p>
              </div>
            )}
            {(upgradeModal.state === 'preview' || upgradeModal.state === 'confirming') && (
              <>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#111827', marginBottom: '0.5rem' }}>
                  Upgrade to {upgradeModal.plan.name}
                </h3>
                {upgradeModal.amount && (
                  <p style={{ color: '#374151', fontSize: '0.9rem', marginBottom: '1rem', lineHeight: 1.6 }}>
                    You'll be charged <strong style={{ color: '#2563eb' }}>{upgradeModal.amount}</strong> today — the prorated difference for the rest of your current billing period.
                  </p>
                )}
                {upgradeModal.error && (
                  <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '0.5rem', padding: '0.6rem 0.85rem', color: '#b91c1c', fontSize: '0.83rem', marginBottom: '1rem' }}>
                    {upgradeModal.error}
                  </div>
                )}
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <button
                    onClick={() => setUpgradeModal(null)}
                    disabled={upgradeModal.state === 'confirming'}
                    style={{ flex: 1, padding: '0.7rem', background: '#f3f4f6', color: '#374151', border: '1px solid #e5e7eb', borderRadius: '0.75rem', fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer' }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleUpgradeConfirm}
                    disabled={upgradeModal.state === 'confirming'}
                    style={{ flex: 1, padding: '0.7rem', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '0.75rem', fontWeight: 700, fontSize: '0.875rem', cursor: upgradeModal.state === 'confirming' ? 'not-allowed' : 'pointer', opacity: upgradeModal.state === 'confirming' ? 0.7 : 1 }}
                  >
                    {upgradeModal.state === 'confirming' ? '⏳ Processing…' : 'Confirm Upgrade'}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </Layout>
  )
}
