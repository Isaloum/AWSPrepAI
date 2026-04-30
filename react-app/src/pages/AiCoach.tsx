/**
 * AiCoach.tsx
 * Full-page AI Coach — exclusive to Lifetime plan users.
 * Uses the same awsprepai-ai-coach Lambda as the Dashboard widget.
 */
import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import MarkdownRenderer from '../components/MarkdownRenderer'
import { useAuth } from '../contexts/AuthContext'
import { trackAiCoachOpened, trackAiCoachMessage } from '../lib/analytics'

const AI_COACH_API = 'https://hyb325gocg.execute-api.us-east-1.amazonaws.com'

type Message = { role: 'user' | 'assistant'; content: string }

const STARTERS = [
  'What is the difference between SQS and SNS?',
  'When should I use ElastiCache vs DynamoDB DAX?',
  'Explain S3 storage classes and when to use each.',
  'What are the key differences between EC2 and Lambda?',
  'How does AWS IAM work — roles vs policies?',
]

export default function AiCoach() {
  const { user, tier, loading } = useAuth()
  const navigate = useNavigate()
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!loading && !user) navigate('/login')
    if (!loading && user && tier !== 'lifetime') navigate('/dashboard')
    if (!loading && user && tier === 'lifetime') trackAiCoachOpened()
  }, [loading, user, tier])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  const send = async (text?: string) => {
    const msg = (text ?? input).trim()
    if (!msg || isLoading || !user) return
    setInput('')
    const userMsg: Message = { role: 'user', content: msg }
    const history = messages.map(m => ({ role: m.role, content: m.content }))
    setMessages(prev => [...prev, userMsg])
    setIsLoading(true)
    try {
      const res = await fetch(AI_COACH_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${user.accessToken}` },
        body: JSON.stringify({ message: msg, history }),
      })
      const data = await res.json()
      const reply = data.reply
        || (res.status === 403 ? '🔒 AI Coach is exclusive to Yearly and Lifetime plan users.' : null)
        || 'Something went wrong. Please try again.'
      setMessages(prev => {
        trackAiCoachMessage(prev.length)
        return [...prev, { role: 'assistant', content: reply }]
      })
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Network error. Please try again.' }])
    }
    setIsLoading(false)
    setTimeout(() => inputRef.current?.focus(), 50)
  }

  if (loading || !user) return null

  return (
    <Layout>
      <div style={{ maxWidth: '760px', margin: '0 auto', padding: '2rem 1.5rem', display: 'flex', flexDirection: 'column', minHeight: 'calc(100vh - 120px)' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'linear-gradient(135deg, #0f172a, #1e3a8a)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', flexShrink: 0 }}>
            🤖
          </div>
          <div>
            <h1 style={{ fontSize: '1.4rem', fontWeight: 900, color: '#111827', margin: 0 }}>AI Coach</h1>
            <p style={{ color: '#6b7280', fontSize: '0.85rem', margin: 0 }}>Ask anything about AWS — concepts, exam tips, service comparisons, why an answer is wrong.</p>
          </div>
          <div style={{ marginLeft: 'auto' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#7c3aed', background: '#f5f3ff', padding: '5px 12px', borderRadius: '999px' }}>
              🔥 Lifetime
            </span>
          </div>
        </div>

        {/* Chat area */}
        <div style={{ flex: 1, background: 'linear-gradient(135deg, #0f172a, #1e293b)', borderRadius: '1.25rem', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1rem', minHeight: '420px' }}>

          {/* Empty state */}
          {messages.length === 0 && (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1.5rem' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>💬</div>
                <p style={{ color: '#64748b', fontSize: '0.9rem', margin: 0 }}>Start a conversation or pick a question below</p>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', justifyContent: 'center', maxWidth: '560px' }}>
                {STARTERS.map(q => (
                  <button
                    key={q}
                    onClick={() => send(q)}
                    style={{ padding: '7px 14px', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '999px', color: '#93c5fd', fontSize: '0.78rem', cursor: 'pointer', textAlign: 'left', transition: 'background 0.15s' }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.12)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.07)')}
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Messages */}
          {messages.length > 0 && (
            <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
              {messages.map((m, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
                  {m.role === 'assistant' && (
                    <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'linear-gradient(135deg, #1e3a8a, #2563eb)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem', flexShrink: 0, marginRight: '8px', marginTop: '2px' }}>
                      🤖
                    </div>
                  )}
                  <div style={{
                    maxWidth: '80%', padding: '0.7rem 1rem',
                    borderRadius: m.role === 'user' ? '1.1rem 1.1rem 0.25rem 1.1rem' : '1.1rem 1.1rem 1.1rem 0.25rem',
                    background: m.role === 'user' ? '#2563eb' : 'rgba(255,255,255,0.1)',
                    color: '#fff', fontSize: '0.875rem', lineHeight: 1.65,
                  }}>
                    {m.role === 'user'
                      ? <span style={{ whiteSpace: 'pre-wrap' }}>{m.content}</span>
                      : <MarkdownRenderer content={m.content} />
                    }
                  </div>
                </div>
              ))}
              {isLoading && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'linear-gradient(135deg, #1e3a8a, #2563eb)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem', flexShrink: 0 }}>🤖</div>
                  <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: '1rem 1rem 1rem 0.25rem', padding: '0.7rem 1rem', color: '#93c5fd', fontSize: '0.85rem', display: 'flex', gap: '4px', alignItems: 'center' }}>
                    <span style={{ animation: 'bounce 1.2s infinite', display: 'inline-block' }}>●</span>
                    <span style={{ animation: 'bounce 1.2s 0.2s infinite', display: 'inline-block' }}>●</span>
                    <span style={{ animation: 'bounce 1.2s 0.4s infinite', display: 'inline-block' }}>●</span>
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>
          )}
        </div>

        {/* Input bar */}
        <div style={{ display: 'flex', gap: '0.625rem' }}>
          <input
            ref={inputRef}
            type="text"
            placeholder="Ask me anything about AWS…"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send()}
            disabled={isLoading}
            style={{
              flex: 1, padding: '0.8rem 1.1rem', borderRadius: '0.85rem',
              border: '1.5px solid #e5e7eb', background: '#fff',
              color: '#111827', fontSize: '0.9rem', outline: 'none',
              boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
            }}
          />
          <button
            onClick={() => send()}
            disabled={isLoading || !input.trim()}
            style={{
              padding: '0.8rem 1.5rem', background: '#2563eb', color: '#fff',
              fontWeight: 700, borderRadius: '0.85rem', border: 'none',
              cursor: isLoading || !input.trim() ? 'not-allowed' : 'pointer',
              opacity: isLoading || !input.trim() ? 0.6 : 1, fontSize: '0.9rem',
              transition: 'opacity 0.15s',
            }}
          >
            Send →
          </button>
        </div>

        <p style={{ color: '#d1d5db', fontSize: '0.72rem', textAlign: 'center', marginTop: '0.75rem' }}>
          AI Coach uses Claude · Answers may contain errors — always verify with official AWS documentation.
        </p>
      </div>

      <style>{`
        @keyframes bounce { 0%,80%,100%{opacity:.3;transform:scale(.8)} 40%{opacity:1;transform:scale(1)} }
      `}</style>
    </Layout>
  )
}
