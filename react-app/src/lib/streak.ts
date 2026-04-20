/**
 * streak.ts — daily practice streak tracker (localStorage)
 *
 * Schema: localStorage key "certiprepai_streak"
 * { count: number, lastDate: "YYYY-MM-DD" }
 */

const KEY = 'certiprepai_streak'

function today(): string {
  return new Date().toISOString().slice(0, 10) // "YYYY-MM-DD"
}

function yesterday(): string {
  const d = new Date()
  d.setDate(d.getDate() - 1)
  return d.toISOString().slice(0, 10)
}

export interface StreakData {
  count: number
  lastDate: string
}

export function getStreak(): StreakData {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return { count: 0, lastDate: '' }
    return JSON.parse(raw) as StreakData
  } catch {
    return { count: 0, lastDate: '' }
  }
}

/**
 * Call this whenever the user answers a question.
 * Returns the updated streak count.
 */
export function updateStreak(): number {
  const t = today()
  const streak = getStreak()

  // Already practiced today — no change
  if (streak.lastDate === t) return streak.count

  const newCount = streak.lastDate === yesterday()
    ? streak.count + 1  // continued streak
    : 1                 // streak broken or first time

  const updated: StreakData = { count: newCount, lastDate: t }
  try {
    localStorage.setItem(KEY, JSON.stringify(updated))
  } catch {}

  return newCount
}
