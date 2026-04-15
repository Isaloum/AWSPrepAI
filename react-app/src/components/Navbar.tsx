import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const ChevronDown = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ display: 'inline-block', verticalAlign: 'middle', marginLeft: '3px' }}>
    <path d="M3 5l4 4 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const HamburgerIcon = () => (
  <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
    <path d="M3 6h16M3 11h16M3 16h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
)

const CloseIcon = () => (
  <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
    <path d="M5 5l12 12M17 5L5 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
)

export default function Navbar() {
  const [practiceOpen, setPracticeOpen] = useState(false)
  const [studyOpen, setStudyOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { user, isPremium, tier, signOut, loading } = useAuth()

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  // Close mobile menu on route change
  useEffect(() => { setMobileOpen(false) }, [location.pathname])

  const isActive = (path: string) => location.pathname.startsWith(path) && path !== '/'

  const handleSignOut = async () => {
    await signOut()
    setUserMenuOpen(false)
    setMobileOpen(false)
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

  const practiceItems = [
    { to: '/certifications', bg: '#eff6ff', icon: '📝', label: 'Practice Quiz', sub: '3,120 questions · 12 certs' },
    { to: '/certifications?mode=mock', bg: '#f0fdf4', icon: '⏱️', label: 'Mock Exam', sub: 'Timed practice test · 65q · 130 min' },
    { to: '/architecture-builder', bg: '#f5f3ff', icon: '🏗️', label: 'Architecture Builder', sub: 'Drag & drop AWS services' },
    { to: '/visual-exam', bg: '#fff0f0', icon: '🎯', label: 'Visual Exam', sub: 'Diagram-based questions' },
    { to: '/sample-questions', bg: '#eff6ff', icon: '🆓', label: 'Sample Questions', sub: '20 free questions · no sign up' },
  ]

  const studyItems = [
    { to: '/resources', bg: '#eff6ff', icon: '📘', label: 'Study Guide', sub: 'Exam tips & curated resources' },
    { to: '/keywords', bg: '#faf5ff', icon: '🔑', label: 'Keywords & Terms', sub: 'Scenario identifiers — spot the right service' },
    { to: '/glossary', bg: '#eff6ff', icon: '📖', label: 'Glossary', sub: '50+ AWS terms explained simply' },
    { to: '/diagrams', bg: '#f5f3ff', icon: '🗺️', label: 'Architecture Diagrams', sub: 'Interactive SAA-C03 diagrams' },
    { to: '/service-groups', bg: '#f0fdf4', icon: '🗂️', label: 'Service Groups', sub: 'Compare AWS services by category' },
    { to: '/comparisons', bg: '#fef3c7', icon: '⚖️', label: 'Service Comparisons', sub: 'X vs Y tables from 1,098 real exams' },
  ]

  const DropdownItem = ({ item }: { item: typeof practiceItems[0] }) => (
    <Link to={item.to} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '9px 10px', borderRadius: '10px', textDecoration: 'none' }}
      onMouseEnter={e => (e.currentTarget.style.background = '#f9fafb')}
      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
    >
      <div style={{ width: '36px', height: '36px', background: item.bg, borderRadius: '9px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', flexShrink: 0 }}>{item.icon}</div>
      <div>
        <div style={{ fontWeight: 600, fontSize: '13px', color: '#111827' }}>{item.label}</div>
        <div style={{ fontSize: '11px', color: '#9ca3af', marginTop: '2px' }}>{item.sub}</div>
      </div>
    </Link>
  )

  return (
    <>
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
            <span style={{ fontWeight: 800, fontSize: '16px', color: '#111827', letterSpacing: '-0.02em' }}>CertiPrepAI</span>
          </Link>

          {/* ── Desktop nav ── */}
          {!isMobile && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '2px', flex: 1, justifyContent: 'center' }}>

              {/* Practice dropdown */}
              <div style={{ position: 'relative' }}
                onMouseEnter={() => setPracticeOpen(true)}
                onMouseLeave={() => setPracticeOpen(false)}
              >
                <button style={{ ...navItem(location.pathname.startsWith('/cert/') || location.pathname.startsWith('/mock-exam/') || location.pathname === '/architecture-builder' || location.pathname === '/visual-exam' || location.pathname === '/sample-questions') }}>
                  Practice <ChevronDown />
                </button>
                {practiceOpen && (
                  <div style={{ position: 'absolute', top: '100%', left: '0', width: '260px', paddingTop: '8px', zIndex: 100 }}>
                    <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '14px', boxShadow: '0 12px 32px rgba(0,0,0,0.12)', padding: '8px' }}>
                      {practiceItems.map(item => <DropdownItem key={item.label} item={item} />)}
                    </div>
                  </div>
                )}
              </div>

              {/* Study dropdown */}
              <div style={{ position: 'relative' }}
                onMouseEnter={() => setStudyOpen(true)}
                onMouseLeave={() => setStudyOpen(false)}
              >
                <button style={{ ...navItem(isActive('/glossary') || isActive('/diagrams') || isActive('/keywords') || isActive('/resources')) }}>
                  Study <ChevronDown />
                </button>
                {studyOpen && (
                  <div style={{ position: 'absolute', top: '100%', left: '0', width: '260px', paddingTop: '8px', zIndex: 100 }}>
                    <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '14px', boxShadow: '0 12px 32px rgba(0,0,0,0.12)', padding: '8px' }}>
                      {studyItems.map(item => <DropdownItem key={item.label} item={item} />)}
                    </div>
                  </div>
                )}
              </div>

              <div style={{ width: '1px', height: '18px', background: '#e5e7eb', margin: '0 6px', flexShrink: 0 }} />

              {[
                { to: '/certifications', label: 'Certifications' },
                { to: '/about', label: 'About' },
                { to: '/resources', label: 'Resources' },
                { to: '/pricing', label: 'Pricing' },
              ].map(link => (
                <Link key={link.to} to={link.to}
                  style={{ ...navItem(isActive(link.to)) }}
                  onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = '#f9fafb'; (e.currentTarget as HTMLAnchorElement).style.color = '#111827' }}
                  onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = isActive(link.to) ? '#eff6ff' : 'transparent'; (e.currentTarget as HTMLAnchorElement).style.color = isActive(link.to) ? '#1d4ed8' : '#374151' }}
                >{link.label}</Link>
              ))}
            </div>
          )}

          {/* ── Right: Auth (desktop) + Hamburger (mobile) ── */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
            {!isMobile && (
              loading ? (
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
                    <div style={{ position: 'absolute', top: '100%', right: '0', paddingTop: '8px', zIndex: 100 }}>
                      <div style={{ width: '220px', background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', boxShadow: '0 8px 24px rgba(0,0,0,0.1)', padding: '6px' }}>
                        <div style={{ padding: '10px 12px', borderBottom: '1px solid #f3f4f6', marginBottom: '4px' }}>
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
                            style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '9px 12px', borderRadius: '8px', textDecoration: 'none', fontSize: '14px', color: '#2563eb', fontWeight: 600 }}
                            onMouseEnter={e => (e.currentTarget.style.background = '#eff6ff')}
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
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <Link to="/login" style={{ padding: '7px 16px', fontSize: '14px', fontWeight: 500, color: '#374151', textDecoration: 'none', borderRadius: '8px' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = '#f9fafb' }}
                    onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = 'transparent' }}
                  >Log In</Link>
                  <Link to="/signup" style={{ padding: '7px 18px', fontSize: '14px', fontWeight: 600, color: '#fff', background: 'linear-gradient(135deg, #2563eb, #1d4ed8)', borderRadius: '8px', textDecoration: 'none', boxShadow: '0 1px 3px rgba(37,99,235,0.3)' }}>
                    Sign Up Free
                  </Link>
                </>
              )
            )}

            {/* Hamburger — mobile only */}
            {isMobile && (
              <button
                onClick={() => setMobileOpen(o => !o)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '6px', color: '#374151', display: 'flex', alignItems: 'center' }}
                aria-label="Toggle menu"
              >
                {mobileOpen ? <CloseIcon /> : <HamburgerIcon />}
              </button>
            )}
          </div>

        </div>
      </nav>

      {/* ── Mobile drawer ── */}
      {isMobile && mobileOpen && (
        <div style={{
          position: 'fixed', top: '60px', left: 0, right: 0, bottom: 0,
          background: '#fff', zIndex: 49, overflowY: 'auto',
          borderTop: '1px solid #e5e7eb',
          boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
        }}>
          <div style={{ padding: '1rem' }}>

            {/* User info if logged in */}
            {user && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', background: '#f8fafc', borderRadius: '12px', marginBottom: '1rem' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg, #2563eb, #1d4ed8)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '14px', fontWeight: 700, flexShrink: 0 }}>
                  {(user.email?.[0] ?? 'U').toUpperCase()}
                </div>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: '#111827' }}>{user.email?.split('@')[0]}</div>
                  <div style={{ fontSize: '11px', color: '#2563eb', fontWeight: 600 }}>{tierBadge[tier] ?? '🆓 Free'}</div>
                </div>
              </div>
            )}

            {/* Practice section */}
            <div style={{ marginBottom: '0.5rem' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.06em', padding: '4px 8px', marginBottom: '4px' }}>Practice</div>
              {practiceItems.map(item => (
                <Link key={item.label} to={item.to}
                  style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 8px', borderRadius: '10px', textDecoration: 'none' }}
                  onMouseEnter={e => (e.currentTarget.style.background = '#f9fafb')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >
                  <div style={{ width: '34px', height: '34px', background: item.bg, borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', flexShrink: 0 }}>{item.icon}</div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '14px', color: '#111827' }}>{item.label}</div>
                    <div style={{ fontSize: '11px', color: '#9ca3af' }}>{item.sub}</div>
                  </div>
                </Link>
              ))}
            </div>

            <div style={{ height: '1px', background: '#f3f4f6', margin: '0.75rem 0' }} />

            {/* Study section */}
            <div style={{ marginBottom: '0.5rem' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.06em', padding: '4px 8px', marginBottom: '4px' }}>Study</div>
              {studyItems.map(item => (
                <Link key={item.label} to={item.to}
                  style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 8px', borderRadius: '10px', textDecoration: 'none' }}
                  onMouseEnter={e => (e.currentTarget.style.background = '#f9fafb')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >
                  <div style={{ width: '34px', height: '34px', background: item.bg, borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', flexShrink: 0 }}>{item.icon}</div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '14px', color: '#111827' }}>{item.label}</div>
                    <div style={{ fontSize: '11px', color: '#9ca3af' }}>{item.sub}</div>
                  </div>
                </Link>
              ))}
            </div>

            <div style={{ height: '1px', background: '#f3f4f6', margin: '0.75rem 0' }} />

            {/* Plain links */}
            {[
              { to: '/certifications', label: 'Certifications' },
              { to: '/about', label: 'About' },
              { to: '/pricing', label: 'Pricing' },
            ].map(link => (
              <Link key={link.to} to={link.to}
                style={{ display: 'block', padding: '10px 8px', fontSize: '14px', fontWeight: 500, color: '#374151', textDecoration: 'none', borderRadius: '8px' }}
                onMouseEnter={e => (e.currentTarget.style.background = '#f9fafb')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
              >{link.label}</Link>
            ))}

            <div style={{ height: '1px', background: '#f3f4f6', margin: '0.75rem 0' }} />

            {/* Auth buttons */}
            {user ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <Link to="/dashboard" style={{ display: 'block', padding: '12px', background: '#eff6ff', color: '#1d4ed8', fontWeight: 700, borderRadius: '10px', textDecoration: 'none', textAlign: 'center', fontSize: '14px' }}>
                  My Dashboard
                </Link>
                {!isPremium && (
                  <Link to="/pricing" style={{ display: 'block', padding: '12px', background: 'linear-gradient(135deg, #2563eb, #1d4ed8)', color: '#fff', fontWeight: 700, borderRadius: '10px', textDecoration: 'none', textAlign: 'center', fontSize: '14px' }}>
                    ⚡ Upgrade to Premium
                  </Link>
                )}
                <button onClick={handleSignOut} style={{ padding: '12px', background: '#fef2f2', color: '#ef4444', fontWeight: 600, borderRadius: '10px', border: 'none', cursor: 'pointer', fontSize: '14px' }}>
                  Sign Out
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <Link to="/login" style={{ display: 'block', padding: '12px', border: '1px solid #e5e7eb', color: '#374151', fontWeight: 600, borderRadius: '10px', textDecoration: 'none', textAlign: 'center', fontSize: '14px' }}>
                  Log In
                </Link>
                <Link to="/signup" style={{ display: 'block', padding: '12px', background: 'linear-gradient(135deg, #2563eb, #1d4ed8)', color: '#fff', fontWeight: 700, borderRadius: '10px', textDecoration: 'none', textAlign: 'center', fontSize: '14px' }}>
                  Sign Up Free
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
