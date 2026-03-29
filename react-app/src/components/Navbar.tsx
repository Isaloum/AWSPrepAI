import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const ChevronDown = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ display: 'inline-block', verticalAlign: 'middle', marginLeft: '3px' }}>
    <path d="M3 5l4 4 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

export default function Navbar() {
  const [practiceOpen, setPracticeOpen] = useState(false)
  const [studyOpen, setStudyOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { user, isPremium, tier, signOut, loading } = useAuth()

  const isActive = (path: string) => location.pathname.startsWith(path) && path !== '/'

  const handleSignOut = async () => {
    await signOut()
    setUserMenuOpen(false)
    navigate('/')
  }

  const tierBadge: Record<string, string> = {
    monthly: '📦 Monthly',
    yearly: '📅 Yearly',
    lifetime: '🔥 Lifetime',
    free: '🆓 Free',
  }

  const navItem = (active: boolean) => ({
    display: 'flex' as const,
    alignItems: 'center' as const,
    gap: '2px',
    padding: '6px 14px',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: active ? 600 : 500,
    color: active ? '#1d4ed8' : '#374151',
    background: active ? '#eff6ff' : 'transparent',
    border: 'none',
    cursor: 'pointer' as const,
    textDecoration: 'none' as const,
    transition: 'background 0.15s, color 0.15s',
    whiteSpace: 'nowrap' as const,
  })

  return (
    <nav style={{
      position: 'sticky',
      top: 0,
      zIndex: 50,
      background: 'rgba(255,255,255,0.95)',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      borderBottom: '1px solid #e5e7eb',
      boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>

        {/* ── Logo ── */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none', flexShrink: 0 }}>
          <span style={{ fontSize: '20px' }}>☁️</span>
          <span style={{ fontWeight: 800, fontSize: '16px', color: '#111827', letterSpacing: '-0.02em' }}>AWSPrepAI</span>
        </Link>

        {/* ── Center nav ── */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '2px', flex: 1, justifyContent: 'center' }}>

          {/* Practice dropdown */}
          <div style={{ position: 'relative' }}
            onMouseEnter={() => setPracticeOpen(true)}
            onMouseLeave={() => setPracticeOpen(false)}
          >
            <button
              style={{ ...navItem(location.pathname.startsWith('/certifications') || location.pathname.startsWith('/cert/')) }}
              onMouseEnter={e => { if (!location.pathname.startsWith('/certifications')) { (e.currentTarget as HTMLButtonElement).style.background = '#f9fafb'; (e.currentTarget as HTMLButtonElement).style.color = '#111827' } }}
              onMouseLeave={e => { if (!location.pathname.startsWith('/certifications')) { (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; (e.currentTarget as HTMLButtonElement).style.color = '#374151' } }}
            >
              Practice <ChevronDown />
            </button>
            {practiceOpen && (
              <div style={{ position: 'absolute', top: 'calc(100% + 8px)', left: '0', width: '220px', background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', boxShadow: '0 8px 24px rgba(0,0,0,0.1)', padding: '6px', zIndex: 100 }}>
                <Link to="/certifications" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 12px', borderRadius: '8px', textDecoration: 'none', color: '#374151' }}
                  onMouseEnter={e => (e.currentTarget.style.background = '#f9fafb')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >
                  <div style={{ width: '32px', height: '32px', background: '#eff6ff', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', flexShrink: 0 }}>📝</div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '14px', color: '#111827' }}>Practice Quiz</div>
                    <div style={{ fontSize: '12px', color: '#9ca3af', marginTop: '1px' }}>All 12 certifications</div>
                  </div>
                </Link>
                <Link to="/certifications" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 12px', borderRadius: '8px', textDecoration: 'none', color: '#374151' }}
                  onMouseEnter={e => (e.currentTarget.style.background = '#f9fafb')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >
                  <div style={{ width: '32px', height: '32px', background: '#f0fdf4', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', flexShrink: 0 }}>⏱️</div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '14px', color: '#111827' }}>Mock Exam</div>
                    <div style={{ fontSize: '12px', color: '#9ca3af', marginTop: '1px' }}>65 questions · 90 min</div>
                  </div>
                </Link>
              </div>
            )}
          </div>

          {/* Study dropdown */}
          <div style={{ position: 'relative' }}
            onMouseEnter={() => setStudyOpen(true)}
            onMouseLeave={() => setStudyOpen(false)}
          >
            <button
              style={{ ...navItem(location.pathname === '/glossary' || location.pathname === '/resources') }}
              onMouseEnter={e => { if (!isActive('/glossary') && !isActive('/resources')) { (e.currentTarget as HTMLButtonElement).style.background = '#f9fafb'; (e.currentTarget as HTMLButtonElement).style.color = '#111827' } }}
              onMouseLeave={e => { if (!isActive('/glossary') && !isActive('/resources')) { (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; (e.currentTarget as HTMLButtonElement).style.color = '#374151' } }}
            >
              Study <ChevronDown />
            </button>
            {studyOpen && (
              <div style={{ position: 'absolute', top: 'calc(100% + 8px)', left: '0', width: '220px', background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', boxShadow: '0 8px 24px rgba(0,0,0,0.1)', padding: '6px', zIndex: 100 }}>
                <Link to="/glossary" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 12px', borderRadius: '8px', textDecoration: 'none', color: '#374151' }}
                  onMouseEnter={e => (e.currentTarget.style.background = '#f9fafb')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >
                  <div style={{ width: '32px', height: '32px', background: '#faf5ff', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', flexShrink: 0 }}>📖</div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '14px', color: '#111827' }}>Glossary</div>
                    <div style={{ fontSize: '12px', color: '#9ca3af', marginTop: '1px' }}>50+ AWS terms explained</div>
                  </div>
                </Link>
                <Link to="/resources" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 12px', borderRadius: '8px', textDecoration: 'none', color: '#374151' }}
                  onMouseEnter={e => (e.currentTarget.style.background = '#f9fafb')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >
                  <div style={{ width: '32px', height: '32px', background: '#fff7ed', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', flexShrink: 0 }}>📚</div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '14px', color: '#111827' }}>Resources</div>
                    <div style={{ fontSize: '12px', color: '#9ca3af', marginTop: '1px' }}>Curated study materials</div>
                  </div>
                </Link>
              </div>
            )}
          </div>

          {/* Divider */}
          <div style={{ width: '1px', height: '18px', background: '#e5e7eb', margin: '0 6px', flexShrink: 0 }} />

          {/* Plain links */}
          <Link to="/certifications"
            style={{ ...navItem(isActive('/certifications')) }}
            onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = '#f9fafb'; (e.currentTarget as HTMLAnchorElement).style.color = '#111827' }}
            onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = isActive('/certifications') ? '#eff6ff' : 'transparent'; (e.currentTarget as HTMLAnchorElement).style.color = isActive('/certifications') ? '#1d4ed8' : '#374151' }}
          >Certifications</Link>

          <Link to="/about"
            style={{ ...navItem(isActive('/about')) }}
            onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = '#f9fafb'; (e.currentTarget as HTMLAnchorElement).style.color = '#111827' }}
            onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = isActive('/about') ? '#eff6ff' : 'transparent'; (e.currentTarget as HTMLAnchorElement).style.color = isActive('/about') ? '#1d4ed8' : '#374151' }}
          >About</Link>

          <Link to="/pricing"
            style={{ ...navItem(isActive('/pricing')) }}
            onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = '#f9fafb'; (e.currentTarget as HTMLAnchorElement).style.color = '#111827' }}
            onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = isActive('/pricing') ? '#eff6ff' : 'transparent'; (e.currentTarget as HTMLAnchorElement).style.color = isActive('/pricing') ? '#1d4ed8' : '#374151' }}
          >Pricing</Link>
        </div>

        {/* ── Auth ── */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
          {loading ? (
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#f3f4f6' }} />
          ) : user ? (
            <div style={{ position: 'relative' }}
              onMouseEnter={() => setUserMenuOpen(true)}
              onMouseLeave={() => setUserMenuOpen(false)}
            >
              <button style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 12px', borderRadius: '10px', border: '1px solid #e5e7eb', background: '#fff', cursor: 'pointer', transition: 'border-color 0.15s' }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = '#93c5fd')}
                onMouseLeave={e => (e.currentTarget.style.borderColor = '#e5e7eb')}
              >
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'linear-gradient(135deg, #2563eb, #1d4ed8)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '12px', fontWeight: 700 }}>
                  {(user.email?.[0] ?? 'U').toUpperCase()}
                </div>
                <span style={{ fontSize: '14px', fontWeight: 500, color: '#374151', maxWidth: '100px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {user.email?.split('@')[0]}
                </span>
                <ChevronDown />
              </button>
              {userMenuOpen && (
                <div style={{ position: 'absolute', top: 'calc(100% + 8px)', right: '0', width: '220px', background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', boxShadow: '0 8px 24px rgba(0,0,0,0.1)', padding: '6px', zIndex: 100 }}>
                  <div style={{ padding: '10px 12px 10px', borderBottom: '1px solid #f3f4f6', marginBottom: '4px' }}>
                    <div style={{ fontSize: '12px', color: '#9ca3af', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.email}</div>
                    <div style={{ fontSize: '12px', fontWeight: 600, color: '#2563eb', marginTop: '2px' }}>{tierBadge[tier] ?? '🆓 Free'}</div>
                  </div>
                  {[
                    { to: '/dashboard', icon: '🏠', label: 'My Dashboard' },
                    { to: '/certifications', icon: '📝', label: 'Practice' },
                  ].map(item => (
                    <Link key={item.to} to={item.to} onClick={() => setUserMenuOpen(false)}
                      style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '9px 12px', borderRadius: '8px', textDecoration: 'none', fontSize: '14px', color: '#374151', fontWeight: 500 }}
                      onMouseEnter={e => (e.currentTarget.style.background = '#f9fafb')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                    >
                      <span>{item.icon}</span> {item.label}
                    </Link>
                  ))}
                  {!isPremium && (
                    <Link to="/pricing" onClick={() => setUserMenuOpen(false)}
                      style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '9px 12px', borderRadius: '8px', textDecoration: 'none', fontSize: '14px', color: '#d97706', fontWeight: 600 }}
                      onMouseEnter={e => (e.currentTarget.style.background = '#fffbeb')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                    >
                      <span>⚡</span> Upgrade to Premium
                    </Link>
                  )}
                  <div style={{ borderTop: '1px solid #f3f4f6', marginTop: '4px', paddingTop: '4px' }}>
                    <button onClick={handleSignOut}
                      style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '10px', padding: '9px 12px', borderRadius: '8px', fontSize: '14px', color: '#ef4444', fontWeight: 500, background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left' }}
                      onMouseEnter={e => (e.currentTarget.style.background = '#fef2f2')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                    >
                      <span>👋</span> Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/login" style={{ padding: '7px 16px', fontSize: '14px', fontWeight: 500, color: '#374151', textDecoration: 'none', borderRadius: '8px' }}
                onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = '#f9fafb'; (e.currentTarget as HTMLAnchorElement).style.color = '#111827' }}
                onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = 'transparent'; (e.currentTarget as HTMLAnchorElement).style.color = '#374151' }}
              >Log In</Link>
              <Link to="/signup" style={{ padding: '7px 18px', fontSize: '14px', fontWeight: 600, color: '#fff', background: 'linear-gradient(135deg, #2563eb, #1d4ed8)', borderRadius: '8px', textDecoration: 'none', boxShadow: '0 1px 3px rgba(37,99,235,0.3)' }}
                onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = 'linear-gradient(135deg, #1d4ed8, #1e40af)' }}
                onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = 'linear-gradient(135deg, #2563eb, #1d4ed8)' }}
              >Sign Up Free</Link>
            </>
          )}
        </div>

      </div>
    </nav>
  )
}
