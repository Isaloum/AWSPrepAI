import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer style={{ background: '#0f172a', color: '#94a3b8', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '3rem 1.5rem 2rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '2rem' }}>

        {/* Brand */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '1.25rem' }}>☁️</span>
            <span style={{ color: '#f1f5f9', fontWeight: 800, fontSize: '1rem' }}>AWSPrepAI</span>
          </div>
          <p style={{ fontSize: '0.8rem', lineHeight: 1.7, color: '#64748b', maxWidth: '200px' }}>
            Scenario-based practice questions for every active AWS certification.
          </p>
          <p style={{ fontSize: '0.75rem', color: '#475569', marginTop: '1rem' }}>
            Not affiliated with Amazon Web Services
          </p>
        </div>

        {/* Practice */}
        <div>
          <h4 style={{ color: '#f1f5f9', fontWeight: 700, fontSize: '0.85rem', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Practice</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            {[
              { to: '/certifications', label: 'All Certifications' },
              { to: '/certifications', label: 'Mock Exams' },
              { to: '/sample-questions', label: 'Sample Questions' },
            ].map(l => (
              <Link key={l.label} to={l.to} style={{ color: '#64748b', fontSize: '0.85rem', textDecoration: 'none' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#93c5fd')}
                onMouseLeave={e => (e.currentTarget.style.color = '#64748b')}
              >{l.label}</Link>
            ))}
          </div>
        </div>

        {/* Study */}
        <div>
          <h4 style={{ color: '#f1f5f9', fontWeight: 700, fontSize: '0.85rem', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Study</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            {[
              { to: '/glossary', label: 'AWS Glossary' },
              { to: '/resources', label: 'Study Resources' },
              { to: '/about', label: 'About Us' },
            ].map(l => (
              <Link key={l.label} to={l.to} style={{ color: '#64748b', fontSize: '0.85rem', textDecoration: 'none' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#93c5fd')}
                onMouseLeave={e => (e.currentTarget.style.color = '#64748b')}
              >{l.label}</Link>
            ))}
          </div>
        </div>

        {/* Pricing */}
        <div>
          <h4 style={{ color: '#f1f5f9', fontWeight: 700, fontSize: '0.85rem', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Plans</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
            {[
              { to: '/signup?plan=monthly', name: 'Monthly', price: '$7/mo' },
              { to: '/signup?plan=yearly', name: 'Yearly', price: '$67/yr' },
              { to: '/signup?plan=lifetime', name: 'Lifetime', price: '$147' },
            ].map(l => (
              <Link key={l.name} to={l.to} style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', color: '#64748b' }}
                onMouseEnter={e => { e.currentTarget.style.color = '#93c5fd' }}
                onMouseLeave={e => { e.currentTarget.style.color = '#64748b' }}
              >
                <span style={{ fontSize: '0.85rem', width: '68px' }}>{l.name}</span>
                <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{l.price}</span>
              </Link>
            ))}
            <Link to="/pricing" style={{ marginTop: '0.35rem', fontSize: '0.8rem', color: '#3b82f6', textDecoration: 'none', fontWeight: 600 }}
              onMouseEnter={e => (e.currentTarget.style.color = '#93c5fd')}
              onMouseLeave={e => (e.currentTarget.style.color = '#3b82f6')}
            >Compare all plans →</Link>
          </div>
        </div>

        {/* Support */}
        <div>
          <h4 style={{ color: '#f1f5f9', fontWeight: 700, fontSize: '0.85rem', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Support</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            <a href="mailto:support@awsprepai.com" style={{ color: '#64748b', fontSize: '0.85rem', textDecoration: 'none' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#93c5fd')}
              onMouseLeave={e => (e.currentTarget.style.color = '#64748b')}
            >support@awsprepai.com</a>
            <Link to="/pricing#faq" style={{ color: '#64748b', fontSize: '0.85rem', textDecoration: 'none' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#93c5fd')}
              onMouseLeave={e => (e.currentTarget.style.color = '#64748b')}
            >FAQ</Link>
            <Link to="/terms" style={{ color: '#64748b', fontSize: '0.85rem', textDecoration: 'none' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#93c5fd')}
              onMouseLeave={e => (e.currentTarget.style.color = '#64748b')}
            >Terms & Privacy</Link>
          </div>
        </div>

      </div>

      {/* Bottom bar */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', padding: '1.25rem 1.5rem', maxWidth: '1100px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
        <span style={{ fontSize: '0.78rem', color: '#475569' }}>© {new Date().getFullYear()} AWSPrepAI. Not affiliated with Amazon Web Services.</span>
        <a href="https://github.com/Isaloum/AWSPrepAI" style={{ color: '#475569', fontSize: '0.78rem', textDecoration: 'none' }}
          onMouseEnter={e => (e.currentTarget.style.color = '#93c5fd')}
          onMouseLeave={e => (e.currentTarget.style.color = '#475569')}
        >GitHub ↗</a>
      </div>
    </footer>
  )
}
