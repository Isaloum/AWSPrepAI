/**
 * CertiPrepAI Analytics — powered by Amazon Pinpoint
 * Tracks user behaviour across the entire app.
 */
import { Amplify } from 'aws-amplify'
import { record, configureAutoTrack } from 'aws-amplify/analytics'

// ── Configure Amplify + Pinpoint ────────────────────────────────────────────
Amplify.configure({
  Analytics: {
    Pinpoint: {
      appId: 'c5d77298f70142dfb18f9814e9100e51',
      region: 'us-east-1',
    },
  },
})

// Auto-track page views
try {
  configureAutoTrack({ enable: true, type: 'pageView', options: { eventName: 'page_view' } })
} catch (_) { /* ignore if already configured */ }

// ── Helper ───────────────────────────────────────────────────────────────────
function track(name: string, attrs: Record<string, string> = {}, metrics: Record<string, number> = {}) {
  try {
    record({
      name,
      attributes: attrs,
      metrics,
    })
  } catch (_) { /* never crash the app over analytics */ }
}

// ── Events ───────────────────────────────────────────────────────────────────

/** Called when a user views a certification detail page */
export function trackCertStarted(certId: string, plan: string) {
  track('cert_started', { cert_id: certId, plan })
}

/** Called when a user answers a practice question */
export function trackQuestionAnswered(certId: string, domain: string, correct: boolean, plan: string) {
  track('question_answered', { cert_id: certId, domain, correct: String(correct), plan }, { correct_count: correct ? 1 : 0 })
}

/** Called when a free user hits the 20-question limit */
export function trackFreeLimitHit(certId: string) {
  track('free_limit_hit', { cert_id: certId })
}

/** Called when a mock exam is completed */
export function trackMockExamCompleted(certId: string, score: number, total: number, plan: string) {
  const pct = Math.round((score / total) * 100)
  track('mock_exam_completed', { cert_id: certId, plan, passed: String(pct >= 72) }, { score_pct: pct, correct: score, total })
}

/** Called when a user clicks an upgrade button */
export function trackUpgradeClicked(fromPlan: string, toPlan: string, location: string) {
  track('upgrade_clicked', { from_plan: fromPlan, to_plan: toPlan, location })
}

/** Called when a checkout session is initiated */
export function trackCheckoutStarted(plan: string) {
  track('checkout_started', { plan })
}

/** Called when payment succeeds (landing on /payment-success) */
export function trackPaymentSuccess(plan: string) {
  track('payment_success', { plan })
}

/** Called when AI Coach is opened */
export function trackAiCoachOpened() {
  track('ai_coach_opened', { plan: 'lifetime' })
}

/** Called when AI Coach sends a message */
export function trackAiCoachMessage(messageIndex: number) {
  track('ai_coach_message_sent', {}, { message_index: messageIndex })
}

/** Called when a user signs up */
export function trackSignup() {
  track('signup')
}

/** Called when a user logs in */
export function trackLogin(plan: string) {
  track('login', { plan })
}

/** Called when a user bookmarks a question */
export function trackBookmark(certId: string) {
  track('question_bookmarked', { cert_id: certId })
}

/** Called when email capture popup is submitted */
export function trackLeadCaptured() {
  track('lead_captured')
}
