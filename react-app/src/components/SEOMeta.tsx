/**
 * SEOMeta.tsx
 * Dynamically updates <title>, <meta name="description">, og:*, twitter:*
 * on every route change. Drop <SEOMeta /> into any page component.
 */
import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

interface SEOProps {
  title?: string
  description?: string
  canonical?: string
}

const BASE = 'https://certiprepai.com'

// ── Per-route defaults ───────────────────────────────────────────
const ROUTE_META: Record<string, { title: string; description: string }> = {
  '/': {
    title: 'CertiPrepAI — AWS Certification Practice Exams | 3,910 Questions',
    description: 'Pass any AWS certification with 3,910 practice questions across 12 exams. SAA-C03, CLF-C02, DVA-C02, and more. Free mock exams, study guide, glossary.',
  },
  '/certifications': {
    title: 'AWS Certifications — All 12 Exams | CertiPrepAI',
    description: 'Browse all 12 AWS certification practice exams on CertiPrepAI. Foundational, Associate, Professional, and Specialty. 3,910 questions total.',
  },
  '/cert/saa-c03': {
    title: 'AWS Solutions Architect Associate (SAA-C03) Practice Exam | CertiPrepAI',
    description: '1,050 SAA-C03 practice questions covering resilient architecture, high performance, security, and cost optimization. Pass the AWS SAA-C03 exam.',
  },
  '/cert/clf-c02': {
    title: 'AWS Cloud Practitioner (CLF-C02) Practice Exam | CertiPrepAI',
    description: '260 CLF-C02 practice questions covering cloud concepts, security, technology, and billing. Pass the AWS Cloud Practitioner exam.',
  },
  '/cert/dva-c02': {
    title: 'AWS Developer Associate (DVA-C02) Practice Exam | CertiPrepAI',
    description: '260 DVA-C02 practice questions covering development, deployment, security, and troubleshooting. Pass the AWS Developer Associate exam.',
  },
  '/cert/soa-c02': {
    title: 'AWS SysOps Administrator Associate (SOA-C02) Practice Exam | CertiPrepAI',
    description: '260 SOA-C02 practice questions covering monitoring, reliability, deployment, and security. Pass the AWS SysOps Administrator exam.',
  },
  '/cert/dea-c01': {
    title: 'AWS Data Engineer Associate (DEA-C01) Practice Exam | CertiPrepAI',
    description: '260 DEA-C01 practice questions covering data ingestion, transformation, orchestration, and security. Pass the AWS Data Engineer Associate exam.',
  },
  '/cert/mla-c01': {
    title: 'AWS Machine Learning Engineer Associate (MLA-C01) Practice Exam | CertiPrepAI',
    description: '260 MLA-C01 practice questions covering ML model development, deployment, and monitoring on AWS. Pass the AWS ML Engineer Associate exam.',
  },
  '/cert/gai-c01': {
    title: 'AWS Generative AI Specialty (GAI-C01) Practice Exam | CertiPrepAI',
    description: '260 GAI-C01 practice questions covering generative AI concepts, foundation models, and responsible AI on AWS.',
  },
  '/cert/sap-c02': {
    title: 'AWS Solutions Architect Professional (SAP-C02) Practice Exam | CertiPrepAI',
    description: '260 SAP-C02 practice questions covering complex, multi-account architectures. Pass the AWS Solutions Architect Professional exam.',
  },
  '/cert/dop-c02': {
    title: 'AWS DevOps Engineer Professional (DOP-C02) Practice Exam | CertiPrepAI',
    description: '260 DOP-C02 practice questions covering CI/CD, monitoring, incident response, and configuration management. Pass the AWS DevOps Professional exam.',
  },
  '/cert/scs-c03': {
    title: 'AWS Security Specialty (SCS-C03) Practice Exam | CertiPrepAI',
    description: '260 SCS-C03 practice questions covering threat detection, identity management, data protection, and incident response on AWS.',
  },
  '/cert/ans-c01': {
    title: 'AWS Advanced Networking Specialty (ANS-C01) Practice Exam | CertiPrepAI',
    description: '260 ANS-C01 practice questions covering VPC, hybrid connectivity, routing, and network security. Pass the AWS Networking Specialty exam.',
  },
  '/cert/aif-c01': {
    title: 'AWS AI Practitioner (AIF-C01) Practice Exam | CertiPrepAI',
    description: '260 AIF-C01 practice questions covering AI/ML fundamentals, AWS AI services, and responsible AI. Pass the AWS AI Practitioner exam.',
  },
  '/pricing': {
    title: 'Pricing — CertiPrepAI | Unlock All 12 AWS Certs',
    description: 'Unlock all 3,910 practice questions across 12 AWS certifications. Monthly and yearly plans available. Start free.',
  },
  '/resources': {
    title: 'AWS Study Resources — Courses, Cheat Sheets & Tools | CertiPrepAI',
    description: 'The best AWS certification study resources: Stephane Maarek, Adrian Cantrill, AWS Skill Builder, cheat sheets, and hands-on labs — all in one place.',
  },
  '/glossary': {
    title: 'AWS Glossary — 70+ Terms Explained | CertiPrepAI',
    description: 'Plain-English definitions for 70+ AWS services and concepts tested on certification exams. Built for exam prep.',
  },
  '/study-guide': {
    title: 'AWS Exam Strategy & Study Guide | CertiPrepAI',
    description: 'Proven strategies for passing AWS certification exams: time management, question patterns, common traps, and a week-by-week study plan.',
  },
  '/comparisons': {
    title: 'AWS Service Comparisons — Exam Frequency | CertiPrepAI',
    description: 'Which AWS services appear most on certification exams? Data-driven comparisons across all 12 AWS certs.',
  },
  '/service-comparison': {
    title: 'AWS Service Comparison Guide — S3 vs EFS, SQS vs SNS & More | CertiPrepAI',
    description: '20 side-by-side AWS service comparisons across 7 groups. Know exactly when to choose which service on exam day.',
  },
  '/diagrams': {
    title: 'AWS Architecture Diagrams | CertiPrepAI',
    description: 'Visual AWS architecture diagrams for certification exam prep. Understand how services connect in real-world scenarios.',
  },
  '/keywords': {
    title: 'AWS Exam Keywords — Spot the Right Answer | CertiPrepAI',
    description: 'Key phrases and trigger words that appear in AWS certification exam questions. Know what the question is really asking.',
  },
  '/service-groups': {
    title: 'AWS Service Groups — Organized by Category | CertiPrepAI',
    description: 'All AWS services organized by category: compute, storage, database, networking, security, and more.',
  },
  '/prompt-patterns': {
    title: 'Prompt Patterns — AIF-C01 Techniques, Parameters & Security | CertiPrepAI',
    description: 'Master prompt engineering for the AWS AI Practitioner exam. Zero-shot, few-shot, chain-of-thought, inference parameters, prompt injection defenses, and more.',
  },
  '/saa-guide': {
    title: 'SAA-C03 Complete Study Guide — Decision Matrix, Traps & Deep Dives | CertiPrepAI',
    description: 'The complete SAA-C03 encyclopedia: 39-row decision matrix, 12 exam traps, 16 deep dives, 30-day study plan, port numbers, and exam strategy.',
  },
  '/about': {
    title: 'About CertiPrepAI — Built by an AWS Engineer',
    description: 'CertiPrepAI is built by an AWS engineer who passed multiple certifications. 3,910 practice questions derived from official AWS documentation.',
  },
  '/login': {
    title: 'Log In | CertiPrepAI',
    description: 'Log in to your CertiPrepAI account to access AWS certification practice exams and track your progress.',
  },
  '/signup': {
    title: 'Sign Up Free | CertiPrepAI',
    description: 'Create a free CertiPrepAI account and start practicing for your AWS certification exam today.',
  },
  '/forgot-password': {
    title: 'Reset Password | CertiPrepAI',
    description: 'Reset your CertiPrepAI account password.',
  },
  '/cheat-sheets': {
    title: 'AWS Certification Cheat Sheets — Domains, Traps & Patterns | CertiPrepAI',
    description: 'Exam domains, top tested services, choose-when patterns, and common traps for all 12 AWS certifications. Mined from 3,910 real practice questions.',
  },
  '/dashboard': {
    title: 'Dashboard | CertiPrepAI',
    description: 'Track your AWS certification exam progress, skill radar, and practice history.',
  },
  '/payment-success': {
    title: 'Payment Successful | CertiPrepAI',
    description: 'Your CertiPrepAI plan is now active. Start practicing for your AWS certification today.',
  },
}

// ── JSON-LD structured data ──────────────────────────────────────
const CERT_LD: Record<string, { name: string; description: string; questions: number }> = {
  '/cert/saa-c03': { name: 'AWS Solutions Architect Associate (SAA-C03)', description: '1,050 practice questions for the SAA-C03 exam covering resilient architecture, high performance, security, and cost optimization.', questions: 1050 },
  '/cert/clf-c02': { name: 'AWS Cloud Practitioner (CLF-C02)', description: '260 practice questions for the CLF-C02 exam covering cloud concepts, security, technology, and billing.', questions: 260 },
  '/cert/dva-c02': { name: 'AWS Developer Associate (DVA-C02)', description: '260 practice questions for the DVA-C02 exam covering development, deployment, security, and troubleshooting.', questions: 260 },
  '/cert/soa-c02': { name: 'AWS SysOps Administrator Associate (SOA-C02)', description: '260 practice questions for the SOA-C02 exam.', questions: 260 },
  '/cert/dea-c01': { name: 'AWS Data Engineer Associate (DEA-C01)', description: '260 practice questions for the DEA-C01 exam.', questions: 260 },
  '/cert/mla-c01': { name: 'AWS Machine Learning Engineer Associate (MLA-C01)', description: '260 practice questions for the MLA-C01 exam.', questions: 260 },
  '/cert/gai-c01': { name: 'AWS Generative AI Specialty (GAI-C01)', description: '260 practice questions for the GAI-C01 exam.', questions: 260 },
  '/cert/sap-c02': { name: 'AWS Solutions Architect Professional (SAP-C02)', description: '260 practice questions for the SAP-C02 exam.', questions: 260 },
  '/cert/dop-c02': { name: 'AWS DevOps Engineer Professional (DOP-C02)', description: '260 practice questions for the DOP-C02 exam.', questions: 260 },
  '/cert/scs-c03': { name: 'AWS Security Specialty (SCS-C03)', description: '260 practice questions for the SCS-C03 exam.', questions: 260 },
  '/cert/ans-c01': { name: 'AWS Advanced Networking Specialty (ANS-C01)', description: '260 practice questions for the ANS-C01 exam.', questions: 260 },
  '/cert/aif-c01': { name: 'AWS AI Practitioner (AIF-C01)', description: '260 practice questions for the AIF-C01 exam.', questions: 260 },
}

const HOME_FAQ = [
  { q: 'How many AWS certification practice questions does CertiPrepAI have?', a: 'CertiPrepAI has 3,910 practice questions covering all 12 active AWS certifications, including SAA-C03, CLF-C02, DVA-C02, and more.' },
  { q: 'Is CertiPrepAI free to use?', a: 'Yes. You can practice 20 questions for free with no credit card required. Paid plans unlock all 3,910 questions and timed mock exams starting at $7/month.' },
  { q: 'Does CertiPrepAI include mock exams?', a: 'Yes. Each certification includes a timed mock exam with 65 questions and a 130-minute timer, matching the real AWS exam format.' },
  { q: 'Which AWS certifications are covered?', a: 'CertiPrepAI covers all 12 active AWS certifications: CLF-C02, AIF-C01, SAA-C03, DVA-C02, SOA-C02, DEA-C01, MLA-C01, GAI-C01, SAP-C02, DOP-C02, SCS-C03, and ANS-C01.' },
  { q: 'How is CertiPrepAI different from other AWS practice platforms?', a: 'CertiPrepAI is purpose-built for AWS exam prep. Every question includes a detailed explanation, domain filtering lets you focus on weak areas, and cheat sheets are mined directly from the question bank.' },
]

function injectJsonLd(id: string, data: object) {
  let el = document.getElementById(id) as HTMLScriptElement | null
  if (!el) {
    el = document.createElement('script')
    el.id = id
    el.type = 'application/ld+json'
    document.head.appendChild(el)
  }
  el.textContent = JSON.stringify(data)
}

function removeJsonLd(id: string) {
  document.getElementById(id)?.remove()
}

function setMeta(name: string, content: string, attr = 'name') {
  let el = document.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement | null
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, name)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

export default function SEOMeta({ title, description, canonical }: SEOProps) {
  const { pathname } = useLocation()

  useEffect(() => {
    const route = ROUTE_META[pathname]
    const t = title || route?.title || 'CertiPrepAI — AWS Certification Practice Exams'
    const d = description || route?.description || 'Pass any AWS certification with 3,910 practice questions across 12 exams.'
    const url = canonical || `${BASE}${pathname}`

    // Title
    document.title = t

    // Standard meta
    setMeta('description', d)

    // Open Graph
    setMeta('og:title', t, 'property')
    setMeta('og:description', d, 'property')
    setMeta('og:url', url, 'property')
    setMeta('og:type', 'website', 'property')
    setMeta('og:site_name', 'CertiPrepAI', 'property')

    // Twitter
    setMeta('twitter:card', 'summary_large_image')
    setMeta('twitter:title', t)
    setMeta('twitter:description', d)

    // Canonical
    let canon = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null
    if (!canon) {
      canon = document.createElement('link')
      canon.setAttribute('rel', 'canonical')
      document.head.appendChild(canon)
    }
    canon.href = url

    // JSON-LD: Website (always)
    injectJsonLd('ld-website', {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'CertiPrepAI',
      url: BASE,
      description: 'AWS certification practice exams — 3,910 questions across 12 certifications.',
    })

    // JSON-LD: Home page FAQ
    if (pathname === '/') {
      injectJsonLd('ld-faq', {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: HOME_FAQ.map(f => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: { '@type': 'Answer', text: f.a },
        })),
      })
    } else {
      removeJsonLd('ld-faq')
    }

    // JSON-LD: Cert pages — Course schema
    const cert = CERT_LD[pathname]
    if (cert) {
      injectJsonLd('ld-course', {
        '@context': 'https://schema.org',
        '@type': 'Course',
        name: cert.name,
        description: cert.description,
        provider: { '@type': 'Organization', name: 'CertiPrepAI', sameAs: BASE },
        hasCourseInstance: {
          '@type': 'CourseInstance',
          courseMode: 'online',
          instructor: { '@type': 'Person', name: 'CertiPrepAI' },
        },
        numberOfCredits: cert.questions,
        url: `${BASE}${pathname}`,
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
          availability: 'https://schema.org/InStock',
          description: '20 questions free. Full access from $7/mo.',
        },
      })
    } else {
      removeJsonLd('ld-course')
    }
  }, [pathname, title, description, canonical])

  return null
}
