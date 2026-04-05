import { useState, useEffect, useCallback, useRef } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import Layout from '../components/Layout'
import { useAuth } from '../contexts/AuthContext'

interface Question {
  cat: string
  q: string
  options: string[]
  answer: number
  explain: string
  hint?: string
  keywords?: string[]
}

const certMeta: Record<string, { name: string; code: string; icon: string }> = {
  'saa-c03': { name: 'Solutions Architect Associate', code: 'SAA-C03', icon: '🏗️' },
  'clf-c02': { name: 'Cloud Practitioner', code: 'CLF-C02', icon: '☁️' },
  'aif-c01': { name: 'AI Practitioner', code: 'AIF-C01', icon: '🤖' },
  'dva-c02': { name: 'Developer Associate', code: 'DVA-C02', icon: '💻' },
  'soa-c02': { name: 'SysOps Administrator', code: 'SOA-C02', icon: '⚙️' },
  'dea-c01': { name: 'Data Engineer Associate', code: 'DEA-C01', icon: '📊' },
  'mla-c01': { name: 'ML Engineer Associate', code: 'MLA-C01', icon: '🧠' },
  'gai-c01': { name: 'Generative AI Developer', code: 'GAI-C01', icon: '✨' },
  'sap-c02': { name: 'Solutions Architect Professional', code: 'SAP-C02', icon: '🏆' },
  'dop-c02': { name: 'DevOps Engineer Professional', code: 'DOP-C02', icon: '🔧' },
  'scs-c03': { name: 'Security Specialty', code: 'SCS-C03', icon: '🔒' },
  'ans-c01': { name: 'Advanced Networking', code: 'ANS-C01', icon: '🌐' },
}

const EXAM_QUESTIONS = 65
const EXAM_MINUTES = 90

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0')
  const s = (seconds % 60).toString().padStart(2, '0')
  return `${m}:${s}`
}

export default function MockExam() {
  const { certId } = useParams<{ certId: string }>()
  const navigate = useNavigate()
  const { isPremium } = useAuth()

  const [questions, setQuestions] = useState<Question[]>([])
  const [answers, setAnswers] = useState<(number | null)[]>([])
  const [current, setCurrent] = useState(0)
  const [timeLeft, setTimeLeft] = useState(EXAM_MINUTES * 60)
  const [submitted, setSubmitted] = useState(false)
  const [started, setStarted] = useState(false)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const meta = certMeta[certId || ''] ?? { name: 'Unknown', code: '', icon: '❓' }

  useEffect(() => {
    if (!certId || !certMeta[certId]) { navigate('/certifications'); return }
    if (!isPremium) return // show gate below
    import(`../data/${certId}.json`).then((mod) => {
      const qs = shuffle(mod.default as Question[]).slice(0, EXAM_QUESTIONS)
      setQuestions(qs)
      setAnswers(new Array(qs.length).fill(null))
    }).catch(() => navigate('/certifications'))
  }, [certId, navigate, isPremium])

  const submitExam = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current)
    setSubmitted(true)
  }, [])

  useEffect(() => {
    if (!started || submitted) return
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) { submitExam(); return 0 }
        return t - 1
      })
    }, 1000)
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [started, submitted, submitExam])

  const selectAnswer = (idx: number) => {
    if (submitted) return
    setAnswers(prev => {
      const next = [...prev]
      next[current] = idx
      return next
    })
  }

  const score = answers.reduce((acc: number, ans, i) => acc + (ans === questions[i]?.answer ? 1 : 0), 0)
  const pct = questions.length > 0 ? Math.round((score / questions.length) * 100) : 0
  const passed = pct >= 72

  // Paywall
  if (!isPremium) {
    return (
      <Layout>
        <div style={{ maxWidth: '540px', margin: '4rem auto', padding: '0 1rem', textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔒</div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#111827', marginBottom: '0.5rem' }}>Mock Exam — Premium Only</h1>
          <p style={{ color: '#6b7280', marginBottom: '1.5rem', lineHeight: 1.6 }}>
            The full 65-question timed mock exam (130 min) is available for premium members. Upgrade to unlock all 12 certifications.
          </p>
          <Link to="/pricing" style={{ display: 'inline-block', padding: '0.875rem 2rem', background: '#2563eb', color: '#fff', borderRadius: '0.875rem', fontWeight: 800, textDecoration: 'none', fontSize: '1rem' }}>
            ⚡ View Plans — from $7/mo
          </Link>
          <div style={{ marginTop: '1rem' }}>
            <Link to={`/cert/${certId}`} style={{ color: '#6b7280', fontSize: '0.875rem', textDecoration: 'underline' }}>
              Continue free practice instead →
            </Link>
          </div>
        </div>
      </Layout>
    )
  }

  // Loading
  if (questions.length === 0) {
    return (
      <Layout>
        <div style={{ minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>⏳</div>
            <p style={{ color: '#6b7280' }}>Loading exam...</p>
          </div>
        </div>
      </Layout>
    )
  }

  // Pre-start screen
  if (!started) {
    return (
      <Layout>
        <div style={{ maxWidth: '540px', margin: '4rem auto', padding: '0 1rem', textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>{meta.icon}</div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#111827', marginBottom: '0.25rem' }}>{meta.name}</h1>
          <p style={{ color: '#6b7280', marginBottom: '2rem' }}>Mock Exam — {meta.code}</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
            {[
              { label: 'Questions', value: `${EXAM_QUESTIONS}` },
              { label: 'Time Limit', value: `${EXAM_MINUTES} min` },
              { label: 'Passing Score', value: '72%' },
              { label: 'Mode', value: 'No hints' },
            ].map(item => (
              <div key={item.label} style={{ background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '0.75rem', padding: '1rem' }}>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#111827' }}>{item.value}</div>
                <div style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.2rem' }}>{item.label}</div>
              </div>
            ))}
          </div>
          <div style={{ background: '#eff6ff', border: '1px solid #93c5fd', borderRadius: '0.75rem', padding: '0.875rem 1rem', marginBottom: '1.5rem', textAlign: 'left', fontSize: '0.875rem', color: '#1e3a8a' }}>
            ⚠️ <strong>Rules:</strong> No explanations shown during the exam. Answers are revealed only after submission. Timer starts immediately.
          </div>
          <button
            onClick={() => setStarted(true)}
            style={{ width: '100%', padding: '0.875rem', background: '#2563eb', color: '#fff', borderRadius: '0.875rem', fontWeight: 800, fontSize: '1rem', border: 'none', cursor: 'pointer' }}
          >
            Start Exam ⏱️
          </button>
          <div style={{ marginTop: '1rem' }}>
            <Link to={`/cert/${certId}`} style={{ color: '#6b7280', fontSize: '0.875rem', textDecoration: 'underline' }}>
              ← Back to practice
            </Link>
          </div>
        </div>
      </Layout>
    )
  }

  // Results screen
  if (submitted) {
    return (
      <Layout>
        <div style={{ maxWidth: '700px', margin: '2rem auto', padding: '0 1rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>{passed ? '🎉' : '😓'}</div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#111827', marginBottom: '0.5rem' }}>
              {passed ? 'Exam Passed!' : 'Not Quite — Keep Practicing'}
            </h1>
            <div style={{ fontSize: '3rem', fontWeight: 900, color: passed ? '#16a34a' : '#dc2626' }}>{pct}%</div>
            <div style={{ color: '#6b7280', marginTop: '0.25rem' }}>{score} / {questions.length} correct · Passing: 72%</div>
          </div>

          {/* Review */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {questions.map((q, i) => {
              const userAns = answers[i]
              const correct = userAns === q.answer
              return (
                <div key={i} style={{ background: '#fff', border: `1px solid ${correct ? '#bbf7d0' : '#fecaca'}`, borderRadius: '0.875rem', padding: '1rem 1.25rem' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: correct ? '#16a34a' : '#dc2626', marginBottom: '0.4rem' }}>
                    Q{i + 1} · {correct ? '✅ Correct' : '❌ Wrong'}
                  </div>
                  <div style={{ fontWeight: 600, color: '#111827', fontSize: '0.875rem', marginBottom: '0.6rem' }}>{q.q}</div>
                  {!correct && userAns !== null && (
                    <div style={{ fontSize: '0.8rem', color: '#dc2626', marginBottom: '0.3rem' }}>
                      Your answer: {q.options[userAns]}
                    </div>
                  )}
                  {!correct && userAns === null && (
                    <div style={{ fontSize: '0.8rem', color: '#dc2626', marginBottom: '0.3rem' }}>
                      Not answered
                    </div>
                  )}
                  <div style={{ fontSize: '0.8rem', color: '#16a34a', marginBottom: '0.4rem' }}>
                    Correct: {q.options[q.answer]}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#6b7280', background: '#f9fafb', borderRadius: '0.5rem', padding: '0.5rem 0.75rem', marginBottom: q.keywords?.length ? '0.5rem' : 0 }}>
                    {q.explain}
                  </div>
                  {q.keywords && q.keywords.length > 0 && (
                    <div style={{ marginTop: '0.4rem' }}>
                      <div style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', color: '#16a34a', marginBottom: '0.3rem', letterSpacing: '0.05em' }}>Keywords &amp; Terms</div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem' }}>
                        {q.keywords.map((kw, ki) => (
                          <span key={ki} style={{ fontSize: '0.7rem', fontWeight: 600, color: '#166534', background: '#dcfce7', border: '1px solid #bbf7d0', borderRadius: '999px', padding: '1px 8px' }}>{kw}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          <div style={{ marginTop: '2rem', display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={() => { setSubmitted(false); setStarted(false); setTimeLeft(EXAM_MINUTES * 60); setCurrent(0); setAnswers(new Array(questions.length).fill(null)) }}
              style={{ padding: '0.75rem 1.5rem', background: '#2563eb', color: '#fff', borderRadius: '0.875rem', fontWeight: 700, border: 'none', cursor: 'pointer' }}>
              Retake Exam
            </button>
            <Link to={`/cert/${certId}`} style={{ padding: '0.75rem 1.5rem', border: '1px solid #e5e7eb', borderRadius: '0.875rem', fontWeight: 700, color: '#374151', textDecoration: 'none', background: '#fff' }}>
              Practice Mode
            </Link>
          </div>
        </div>
      </Layout>
    )
  }

  // Exam in progress
  const q = questions[current]
  const answered = answers.filter(a => a !== null).length
  const timerColor = timeLeft < 300 ? '#dc2626' : timeLeft < 600 ? '#2563eb' : '#111827'

  return (
    <Layout>
      {/* Exam header */}
      <div style={{ background: '#fff', borderBottom: '1px solid #e5e7eb', padding: '0.75rem 1rem', position: 'sticky', top: 56, zIndex: 40 }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div style={{ fontWeight: 700, color: '#111827', fontSize: '0.875rem' }}>
            {meta.icon} {meta.code} Mock Exam
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>{answered}/{questions.length} answered</div>
            <div style={{ fontWeight: 800, fontSize: '1rem', color: timerColor, fontVariantNumeric: 'tabular-nums' }}>
              ⏱ {formatTime(timeLeft)}
            </div>
            <button onClick={submitExam} style={{ padding: '0.4rem 1rem', background: '#2563eb', color: '#fff', borderRadius: '0.5rem', fontWeight: 700, fontSize: '0.8rem', border: 'none', cursor: 'pointer' }}>
              Submit
            </button>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '760px', margin: '2rem auto', padding: '0 1rem' }}>
        {/* Progress bar */}
        <div style={{ background: '#e5e7eb', borderRadius: '999px', height: '6px', marginBottom: '1.5rem' }}>
          <div style={{ background: '#2563eb', borderRadius: '999px', height: '6px', width: `${(current / questions.length) * 100}%`, transition: 'width 0.3s' }} />
        </div>

        {/* Question */}
        <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '1rem', padding: '1.5rem', marginBottom: '1rem' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>
            Question {current + 1} of {questions.length}
          </div>
          <p style={{ fontSize: '1rem', fontWeight: 600, color: '#111827', lineHeight: 1.6, margin: 0 }}>{q.q}</p>
        </div>

        {/* Options */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem', marginBottom: '1.5rem' }}>
          {q.options.map((opt, i) => {
            const isSelected = answers[current] === i
            return (
              <button
                key={i}
                onClick={() => selectAnswer(i)}
                style={{
                  width: '100%', textAlign: 'left', padding: '0.875rem 1.125rem',
                  border: `2px solid ${isSelected ? '#2563eb' : '#e5e7eb'}`,
                  borderRadius: '0.75rem', background: isSelected ? '#eff6ff' : '#fff',
                  color: '#111827', fontSize: '0.875rem', fontWeight: isSelected ? 600 : 400,
                  cursor: 'pointer', transition: 'all 0.1s',
                }}
              >
                <span style={{ fontWeight: 700, color: isSelected ? '#2563eb' : '#9ca3af', marginRight: '0.5rem' }}>
                  {String.fromCharCode(65 + i)}.
                </span>
                {opt}
              </button>
            )
          })}
        </div>

        {/* Navigation */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <button
            onClick={() => setCurrent(c => Math.max(0, c - 1))}
            disabled={current === 0}
            style={{ padding: '0.6rem 1.25rem', border: '1px solid #e5e7eb', borderRadius: '0.75rem', background: '#fff', color: current === 0 ? '#d1d5db' : '#374151', fontWeight: 700, fontSize: '0.875rem', cursor: current === 0 ? 'not-allowed' : 'pointer' }}
          >
            ← Prev
          </button>

          {/* Question dots (show 10 around current) */}
          <div style={{ display: 'flex', gap: '0.25rem', flexWrap: 'wrap', justifyContent: 'center', maxWidth: '400px' }}>
            {questions.map((_, i) => {
              const isCurrent = i === current
              const isAnswered = answers[i] !== null
              return (
                <button key={i} onClick={() => setCurrent(i)}
                  title={`Q${i + 1}`}
                  style={{
                    width: '24px', height: '24px', borderRadius: '50%', border: 'none',
                    background: isCurrent ? '#2563eb' : isAnswered ? '#bbf7d0' : '#e5e7eb',
                    color: isCurrent ? '#fff' : isAnswered ? '#166534' : '#6b7280',
                    fontSize: '0.65rem', fontWeight: 700, cursor: 'pointer',
                  }}
                >
                  {i + 1}
                </button>
              )
            })}
          </div>

          <button
            onClick={() => {
              if (current + 1 >= questions.length) submitExam()
              else setCurrent(c => c + 1)
            }}
            style={{ padding: '0.6rem 1.25rem', background: '#2563eb', color: '#fff', borderRadius: '0.75rem', fontWeight: 700, fontSize: '0.875rem', border: 'none', cursor: 'pointer' }}
          >
            {current + 1 >= questions.length ? 'Submit →' : 'Next →'}
          </button>
        </div>
      </div>
    </Layout>
  )
}
