/**
 * lib/db.ts
 * DynamoDB API wrapper — calls awsprepai-db Lambda (internal name, not user-facing).
 * Uses Cognito ID token (has aud claim required for JWT verification).
 */

const DB_API = import.meta.env.VITE_DB_API_URL as string

async function call(action: string, data: object | null, idToken: string) {
  const res = await fetch(DB_API, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`,
    },
    body: JSON.stringify({ action, data }),
  })
  if (!res.ok) throw new Error(`DB error: ${res.status}`)
  return res.json()
}

export async function getMonthlyCert(idToken: string) {
  const { data } = await call('get_monthly_cert', null, idToken)
  return data as { cert_id: string; selected_at: string } | null
}

export async function setMonthlyCert(certId: string, idToken: string) {
  await call('set_monthly_cert', { cert_id: certId }, idToken)
}

export async function getFreeUsage(idToken: string) {
  const { data } = await call('get_free_usage', null, idToken)
  return data as { cert_id: string; count: number } | null
}

export async function updateFreeUsage(certId: string, count: number, idToken: string) {
  await call('update_free_usage', { cert_id: certId, count }, idToken)
}

export interface CertProgress {
  cert_id: string
  questions_attempted: number
  correct_answers: number
  last_practiced: string
}

export async function getAllProgress(idToken: string) {
  const { data } = await call('get_progress', null, idToken)
  return data as CertProgress[]
}

export async function updateProgress(certId: string, correct: boolean, idToken: string) {
  await call('update_progress', { cert_id: certId, correct }, idToken)
}
