import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function Navbar() {
  const [practiceOpen, setPracticeOpen] = useState(false)
  const [studyOpen, setStudyOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { user, isPremium, tier, signOut, loading } = useAuth()

  const isActive = (path: string) => location.pathname === path

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

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-14">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 font-bold text-lg text-blue-600 no-underline">
          ☁️ <span>AWSPrepAI</span>
        </Link>

        {/* Nav Links */}
        <div className="hidden md:flex items-center gap-2">

          {/* Practice dropdown */}
          <div className="relative" onMouseEnter={() => setPracticeOpen(true)} onMouseLeave={() => setPracticeOpen(false)}>
            <button className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 rounded-md hover:bg-gray-50">
              Practice <span className="text-xs">▾</span>
            </button>
            {practiceOpen && (
              <div className="absolute top-full left-0 w-56 bg-white border border-gray-200 rounded-xl shadow-lg py-2 z-50">
                <Link to="/certifications" className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                  <span>📝</span><div><div className="font-semibold">Practice Quiz</div><div className="text-xs text-gray-400">All certifications</div></div>
                </Link>
                <Link to="/certifications" className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                  <span>⏱️</span><div><div className="font-semibold">Mock Exam</div><div className="text-xs text-gray-400">Timed practice test</div></div>
                </Link>
              </div>
            )}
          </div>

          {/* Study dropdown */}
          <div className="relative" onMouseEnter={() => setStudyOpen(true)} onMouseLeave={() => setStudyOpen(false)}>
            <button className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 rounded-md hover:bg-gray-50">
              Study <span className="text-xs">▾</span>
            </button>
            {studyOpen && (
              <div className="absolute top-full left-0 w-56 bg-white border border-gray-200 rounded-xl shadow-lg py-2 z-50">
                <Link to="/glossary" className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                  <span>📖</span><div><div className="font-semibold">Glossary</div><div className="text-xs text-gray-400">AWS terminology</div></div>
                </Link>
                <Link to="/resources" className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                  <span>📚</span><div><div className="font-semibold">Resources</div><div className="text-xs text-gray-400">Study materials</div></div>
                </Link>
              </div>
            )}
          </div>

          <Link to="/certifications" className={`px-3 py-2 text-sm font-medium rounded-md ${isActive('/certifications') ? 'text-blue-600 bg-blue-50' : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'}`}>Certifications</Link>
          <Link to="/about" className={`px-3 py-2 text-sm font-medium rounded-md ${isActive('/about') ? 'text-blue-600 bg-blue-50' : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'}`}>About</Link>
          <Link to="/pricing" className={`px-3 py-2 text-sm font-medium rounded-md ${isActive('/pricing') ? 'text-blue-600 bg-blue-50' : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'}`}>Pricing</Link>
        </div>

        {/* Auth area */}
        <div className="flex items-center gap-2">
          {loading ? (
            <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse" />
          ) : user ? (
            /* Logged-in user menu */
            <div className="relative" onMouseEnter={() => setUserMenuOpen(true)} onMouseLeave={() => setUserMenuOpen(false)}>
              <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors">
                <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold">
                  {(user.email?.[0] ?? 'U').toUpperCase()}
                </div>
                <span className="text-sm font-medium text-gray-700 hidden sm:block max-w-[120px] truncate">
                  {user.email?.split('@')[0]}
                </span>
                <span className="text-xs">▾</span>
              </button>
              {userMenuOpen && (
                <div className="absolute top-full right-0 w-56 bg-white border border-gray-200 rounded-xl shadow-lg py-2 z-50 mt-1">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <div className="text-xs text-gray-400 truncate">{user.email}</div>
                    <div className="text-xs font-semibold text-blue-600 mt-0.5">{tierBadge[tier] ?? '🆓 Free'}</div>
                  </div>
                  <Link to="/dashboard" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                    <span>🏠</span> My Dashboard
                  </Link>
                  <Link to="/certifications" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                    <span>📝</span> Practice
                  </Link>
                  {!isPremium && (
                    <Link to="/pricing" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm text-yellow-600 font-semibold hover:bg-yellow-50">
                      <span>⚡</span> Upgrade to Premium
                    </Link>
                  )}
                  <div className="border-t border-gray-100 mt-1 pt-1">
                    <button onClick={handleSignOut} className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-red-50">
                      <span>👋</span> Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Guest buttons */
            <>
              <Link to="/login" className="px-3 py-2 text-sm font-bold text-gray-700 hover:text-blue-600">Log In</Link>
              <Link to="/signup" className="px-4 py-2 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors">Sign Up Free</Link>
            </>
          )}
        </div>

      </div>
    </nav>
  )
}
