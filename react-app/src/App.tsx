import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { useEffect } from 'react'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior }) }, [pathname])
  return null
}

import Home from './pages/Home'
import Certifications from './pages/Certifications'
import CertDetail from './pages/CertDetail'
import Pricing from './pages/Pricing'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import MockExam from './pages/MockExam'
import About from './pages/About'
import Resources from './pages/Resources'
import Glossary from './pages/Glossary'
import PaymentSuccess from './pages/PaymentSuccess'
import SampleQuestions from './pages/SampleQuestions'
import VisualExam from './pages/VisualExam'
import ArchitectureBuilder from './pages/ArchitectureBuilder'
import Diagrams from './pages/Diagrams'
import Terms from './pages/Terms'
import Keywords from './pages/Keywords'
import StudyGuide from './pages/StudyGuide'
import ServiceGroups from './pages/ServiceGroups'
import Comparisons from './pages/Comparisons'
import ServiceComparison from './pages/ServiceComparison'
import ForgotPassword from './pages/ForgotPassword'
import SEOMeta from './components/SEOMeta'

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
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}
