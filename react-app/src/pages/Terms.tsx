import Layout from '../components/Layout'

export default function Terms() {
  return (
    <Layout>
      <div style={{ maxWidth: '760px', margin: '0 auto', padding: '3rem 1.5rem' }}>

        <h1 style={{ fontSize: '1.75rem', fontWeight: 900, color: '#111827', marginBottom: '0.4rem' }}>
          Terms of Service & Privacy Policy
        </h1>
        <p style={{ color: '#6b7280', fontSize: '0.9rem', marginBottom: '2.5rem' }}>
          Last updated: March 2026
        </p>

        {[
          {
            title: '1. Acceptance of Terms',
            body: 'By accessing or using AWSPrepAI, you agree to be bound by these Terms of Service. If you do not agree, please do not use the platform.',
          },
          {
            title: '2. Description of Service',
            body: 'AWSPrepAI provides scenario-based AWS certification practice questions, mock exams, architecture tools, and study resources. We are not affiliated with or endorsed by Amazon Web Services.',
          },
          {
            title: '3. User Accounts',
            body: 'You are responsible for maintaining the confidentiality of your account credentials. You agree to provide accurate information and to notify us of any unauthorized use of your account.',
          },
          {
            title: '4. Payments & Subscriptions',
            body: 'Paid plans (Monthly, Yearly, Lifetime) are processed securely through Stripe. Monthly and Yearly plans can be cancelled at any time from your dashboard — cancellation takes effect at the end of the billing period. Lifetime plans are a one-time purchase with no recurring charges.',
          },
          {
            title: '5. Intellectual Property',
            body: 'All content on AWSPrepAI — including questions, explanations, diagrams, and study materials — is the property of AWSPrepAI and may not be copied, reproduced, or distributed without written permission.',
          },
          {
            title: '6. Prohibited Use',
            body: 'You may not use AWSPrepAI to scrape content, share account credentials, attempt unauthorized access, or use the platform in any way that violates applicable laws.',
          },
          {
            title: '7. Disclaimer',
            body: 'AWSPrepAI is an independent study tool. We do not guarantee exam results. AWS certifications are administered by Amazon Web Services — passing any exam depends on individual preparation and performance.',
          },
          {
            title: '8. Privacy Policy',
            body: 'We collect only the information necessary to provide the service: your email address, payment status (processed by Stripe — we never store card details), and usage data to improve the platform. We do not sell your data to third parties. We use cookies for authentication and session management only.',
          },
          {
            title: '9. Data Retention',
            body: 'Your account data is retained for as long as your account is active. You may request deletion of your account and associated data by emailing support@awsprepai.com.',
          },
          {
            title: '10. Changes to Terms',
            body: 'We may update these terms from time to time. Continued use of the platform after changes constitutes acceptance of the revised terms.',
          },
          {
            title: '11. Contact',
            body: 'For any questions about these terms, contact us at support@awsprepai.com.',
          },
        ].map(section => (
          <div key={section.title} style={{ marginBottom: '1.75rem' }}>
            <h2 style={{ fontSize: '1rem', fontWeight: 700, color: '#111827', marginBottom: '0.4rem' }}>
              {section.title}
            </h2>
            <p style={{ fontSize: '0.9rem', color: '#4b5563', lineHeight: 1.7, margin: 0 }}>
              {section.body}
            </p>
          </div>
        ))}

        <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '1.5rem', marginTop: '1rem' }}>
          <p style={{ fontSize: '0.8rem', color: '#9ca3af' }}>
            AWSPrepAI is not affiliated with, endorsed by, or in any way officially connected with Amazon Web Services or its affiliates.
          </p>
        </div>

      </div>
    </Layout>
  )
}
