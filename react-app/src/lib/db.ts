/**
 * lib/db.ts
 * DynamoDB API wrapper — calls awsprepai-db Lambda.
 * Uses Cognito ACCESS token.
 */

const DB_API = import.meta.env.VITE_DB_API_URL || import.meta.env.VITE_DB_API || "https://dzhvi7oz29.execute-api.us-east-1.amazonaws.com"

async function call(action: string, data: object | null, token: string) {
  const res = await fetch(DB_API, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ action, data }),
  })
  if (!res.ok) throw new Error(`DB error: ${res.status}`)
  return res.json()
}

export async function getMonthlyCert(token: string) {
  const { data } = await call('get_monthly_cert', null, token)
  return data as { cert_id: string; selected_at: string } | null
}

export async function setMonthlyCert(certId: string, token: string) {
  await call('set_monthly_cert', { cert_id: certId }, token)
}

export async function getFreeUsage(token: string) {
  const { data } = await call('get_free_usage', null, token)
  return data as { cert_id: string; count: number } | null
}

export async function updateFreeUsage(certId: string, count: number, token: string) {
  await call('update_free_usage', { cert_id: certId, count }, token)
}

export interface DomainScore {
  attempted: number
  correct: number
}

export interface CertProgress {
  cert_id: string
  questions_attempted: number
  correct_answers: number
  last_practiced: string
  domain_scores?: Record<string, DomainScore>
}

export async function getAllProgress(token: string) {
  const { data } = await call('get_progress', null, token)
  return data as CertProgress[]
}

export async function saveExamResult(
  certId: string,
  questionsAttempted: number,
  correctAnswers: number,
  domainScores: Record<string, DomainScore>,
  token: string
) {
  await call('save_exam_result', {
    cert_id: certId,
    questions_attempted: questionsAttempted,
    correct_answers: correctAnswers,
    domain_scores: domainScores,
  }, token)
}

// ── Bundle cert selection (bundle tier: 3 certs, 30-day change window) ───────

export async function getBundleCerts(token: string) {
  const { data } = await call('get_bundle_certs', null, token)
  return data as { cert_ids: string[]; selected_at: string } | null
}

export async function setBundleCerts(certIds: string[], token: string) {
  await call('set_bundle_certs', { cert_ids: certIds }, token)
}

export function canChangeBundleCerts(selectedAt: string): boolean {
  const diffMs = Date.now() - new Date(selectedAt).getTime()
  return diffMs >= 30 * 24 * 60 * 60 * 1000
}

/** Legacy single-question update — kept for backward compat */
export async function updateProgress(certId: string, correct: boolean, token: string) {
  await call('update_progress', { cert_id: certId, correct }, token)
}
