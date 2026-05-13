import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { useEffect, lazy, Suspense } from 'react'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior }) }, [pathname])
  return null
}

// Lazy-loaded routes — each page loads only when visited (mobile performance fix)
const Home                = lazy(() => import('./pages/Home'))
const Certifications      = lazy(() => import('./pages/Certifications'))
const CertDetail          = lazy(() => import('./pages/CertDetail'))
const Pricing             = lazy(() => import('./pages/Pricing'))
const Login               = lazy(() => import('./pages/Login'))
const Signup              = lazy(() => import('./pages/Signup'))
const Dashboard           = lazy(() => import('./pages/Dashboard'))
const MockExam            = lazy(() => import('./pages/MockExam'))
const About               = lazy(() => import('./pages/About'))
const Resources           = lazy(() => import('./pages/Resources'))
const Glossary            = lazy(() => import('./pages/Glossary'))
const PaymentSuccess      = lazy(() => import('./pages/PaymentSuccess'))
const SampleQuestions     = lazy(() => import('./pages/SampleQuestions'))
const VisualExam          = lazy(() => import('./pages/VisualExam'))
const ArchitectureBuilder = lazy(() => import('./pages/ArchitectureBuilder'))
const Diagrams            = lazy(() => import('./pages/Diagrams'))
const Terms               = lazy(() => import('./pages/Terms'))
const Keywords            = lazy(() => import('./pages/Keywords'))
const StudyGuide          = lazy(() => import('./pages/StudyGuide'))
const ServiceGroups       = lazy(() => import('./pages/ServiceGroups'))
const Comparisons         = lazy(() => import('./pages/Comparisons'))
const ServiceComparison   = lazy(() => import('./pages/ServiceComparison'))
const ForgotPassword      = lazy(() => import('./pages/ForgotPassword'))
const CheatSheets         = lazy(() => import('./pages/CheatSheets'))
const Billing             = lazy(() => import('./pages/Billing'))
const AiCoach             = lazy(() => import('./pages/AiCoach'))
const PromptPatterns      = lazy(() => import('./pages/PromptPatterns'))
const SaaGuide            = lazy(() => import('./pages/SaaGuide'))
const AifGuide            = lazy(() => import('./pages/AifGuide'))
const Unsubscribe         = lazy(() => import('./pages/Unsubscribe'))

import SEOMeta from './components/SEOMeta'

const PageLoader = () => (
  <div style={{
    minHeight: '100vh', display: 'flex', alignItems: 'center',
    justifyContent: 'center', background: '#f9fafb',
  }}>
    <div style={{ textAlign: 'center' }}>
      <div style={{
        width: '40px', height: '40px', border: '3px solid #e5e7eb',
        borderTop: '3px solid #2563eb', borderRadius: '50%',
        animation: 'spin 0.8s linear infinite', margin: '0 auto 1rem',
      }} />
      <p style={{ color: '#6b7280', fontSize: '0.9rem' }}>Loading…</p>
    </div>
    <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
  </div>
)

const NotFound = () => (
  <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f9fafb' }}>
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#111827' }}>Page Not Found</h1>
      <p style={{ color: '#6b7280', marginTop: '0.5rem' }}>The page you're looking for doesn't exist.</p>
      <a href="/" style={{ display: 'inline-block', marginTop: '1.5rem', padding: '0.75rem 1.5rem', background: '#2563eb', color: '#fff', borderRadius: '0.75rem', fontWeight: 700, textDecoration: 'none' }}>
        Go Home
      </a>
    </div>
  </div>
)

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ScrollToTop />
        <SEOMeta />
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/certifications" element={<Certifications />} />
            <Route path="/cert/:certId" element={<CertDetail />} />
            <Route path="/mock-exam/:certId" element={<MockExam />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/about" element={<About />} />
            <Route path="/resources" element={<Resources />} />
            <Route path="/glossary" element={<Glossary />} />
            <Route path="/payment-success" element={<PaymentSuccess />} />
            <Route path="/sample-questions" element={<SampleQuestions />} />
            <Route path="/visual-exam" element={<VisualExam />} />
            <Route path="/architecture-builder" element={<ArchitectureBuilder />} />
            <Route path="/diagrams" element={<Diagrams />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/study-guide" element={<StudyGuide />} />
            <Route path="/keywords" element={<Keywords />} />
            <Route path="/service-groups" element={<ServiceGroups />} />
            <Route path="/comparisons" element={<Comparisons />} />
            <Route path="/service-comparison" element={<ServiceComparison />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/cheat-sheets" element={<CheatSheets />} />
            <Route path="/billing" element={<Billing />} />
            <Route path="/ai-coach" element={<AiCoach />} />
            <Route path="/prompt-patterns" element={<PromptPatterns />} />
            <Route path="/saa-guide" element={<SaaGuide />} />
            <Route path="/aif-guide" element={<AifGuide />} />
            <Route path="/unsubscribe" element={<Unsubscribe />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </AuthProvider>
    </BrowserRouter>
  )
}
