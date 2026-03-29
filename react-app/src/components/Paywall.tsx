import { useNavigate } from 'react-router-dom'

type PaywallReason = 'free-user' | 'session-expired' | 'lifetime-required'

interface PaywallProps {
  reason: PaywallReason
  onClose: () => void
}

export default function Paywall({ reason, onClose }: PaywallProps) {
  const navigate = useNavigate()

  if (reason === 'session-expired') {
    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
        <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center shadow-2xl" onClick={e => e.stopPropagation()}>
          <div className="text-4xl mb-3">⏰</div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Session Expired</h2>
          <p className="text-gray-500 mb-6">Your session has expired. Log in again to continue practicing.</p>
          <button onClick={() => navigate('/login')} className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 mb-2">Log In Again</button>
          <button onClick={onClose} className="text-sm text-gray-400 hover:text-gray-600">Dismiss</button>
        </div>
      </div>
    )
  }

  if (reason === 'lifetime-required') {
    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
        <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center shadow-2xl" onClick={e => e.stopPropagation()}>
          <div className="text-4xl mb-3">🎯</div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Lifetime Access Required</h2>
          <p className="text-gray-500 mb-6">The Visual Architecture Exam is exclusive to Lifetime plan members.</p>
          <button onClick={() => navigate('/pricing')} className="w-full py-3 bg-amber-500 text-white font-bold rounded-xl hover:bg-amber-600 mb-2">See Lifetime Plan →</button>
          <button onClick={onClose} className="text-sm text-gray-400 hover:text-gray-600">Dismiss</button>
        </div>
      </div>
    )
  }

  // Free user upgrade modal
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="text-4xl mb-3">🚀</div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Unlock Full Access</h2>
        <p className="text-gray-500 mb-4">You've used your 20 free questions. Upgrade to keep practicing.</p>

        <div className="bg-gray-50 rounded-xl p-4 mb-6 text-left space-y-2">
          <div className="flex items-center gap-2 text-sm text-gray-700"><span className="text-green-500">✓</span> 260 questions per cert (3,120 total)</div>
          <div className="flex items-center gap-2 text-sm text-gray-700"><span className="text-green-500">✓</span> Timed mock exam per cert (65q, 90 min)</div>
          <div className="flex items-center gap-2 text-sm text-gray-700"><span className="text-green-500">✓</span> All 12 AWS certifications</div>
          <div className="flex items-center gap-2 text-sm text-gray-700"><span className="text-green-500">✓</span> Domain filtering — focus on weak areas</div>
        </div>

        <button onClick={() => navigate('/pricing')} className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 mb-3">
          See Plans — From $7/mo
        </button>
        <button onClick={onClose} className="text-sm text-gray-400 hover:text-gray-600">Continue with free (20 questions)</button>
      </div>
    </div>
  )
}
