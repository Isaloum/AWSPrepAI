import { useState } from 'react'
import Layout from '../components/Layout'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

interface Question {
  id: number
  domain: string
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
  references: string[]
}

const questions: Question[] = [
  {
    id: 1,
    domain: 'Design Resilient Architectures',
    question: 'A company needs to ensure their web application remains available even if an entire AWS region fails. Which solution provides the HIGHEST level of availability?',
    options: [
      'Deploy the application in multiple Availability Zones within a single region',
      'Use Amazon Route 53 with health checks to route traffic between multiple AWS regions',
      'Deploy the application on EC2 instances with Auto Scaling',
      'Use Amazon CloudFront with an S3 bucket as the origin',
    ],
    correctAnswer: 1,
    explanation: 'Route 53 with multi-region deployment provides the highest availability by protecting against entire region failures. While multi-AZ protects against AZ failures, it does not protect against region-level issues.',
    references: ['Route 53', 'Multi-Region Architecture', 'High Availability'],
  },
  {
    id: 2,
    domain: 'Design Resilient Architectures',
    question: 'An application stores critical data in Amazon S3. What is the MOST cost-effective way to protect against accidental deletion?',
    options: [
      'Enable S3 Versioning and configure lifecycle policies',
      'Create daily snapshots using AWS Backup',
      'Use S3 Cross-Region Replication',
      'Store data in S3 Glacier Deep Archive',
    ],
    correctAnswer: 0,
    explanation: 'S3 Versioning allows you to preserve, retrieve, and restore every version of every object. It is the most cost-effective solution for protection against accidental deletion while keeping data in the same bucket.',
    references: ['S3 Versioning', 'S3 Lifecycle Policies', 'Data Protection'],
  },
  {
    id: 3,
    domain: 'Design High-Performance Architectures',
    question: 'A media company needs to deliver video content to users worldwide with minimal latency. Which combination of services provides the BEST performance?',
    options: [
      'Amazon S3 + Amazon CloudFront',
      'Amazon EBS + EC2 instances in multiple regions',
      'Amazon EFS + AWS Global Accelerator',
      'Amazon S3 + AWS Direct Connect',
    ],
    correctAnswer: 0,
    explanation: 'CloudFront is a content delivery network (CDN) that caches content at edge locations worldwide, providing the lowest latency for global users. S3 provides durable storage for the origin content.',
    references: ['CloudFront', 'S3', 'Content Delivery', 'Edge Locations'],
  },
  {
    id: 4,
    domain: 'Design High-Performance Architectures',
    question: 'An application experiences unpredictable traffic spikes. Database queries are causing performance bottlenecks. What is the MOST effective solution?',
    options: [
      'Increase the RDS instance size',
      'Implement Amazon ElastiCache in front of the database',
      'Enable RDS Multi-AZ deployment',
      'Migrate to Amazon DynamoDB',
    ],
    correctAnswer: 1,
    explanation: 'ElastiCache provides an in-memory caching layer that can dramatically reduce database load by caching frequently accessed queries, making it ideal for handling traffic spikes efficiently.',
    references: ['ElastiCache', 'RDS', 'Caching Strategies', 'Performance Optimization'],
  },
  {
    id: 5,
    domain: 'Design Secure Applications and Architectures',
    question: 'A company wants to grant temporary access to an S3 bucket for external users without creating IAM users. What is the BEST approach?',
    options: [
      'Create IAM users with temporary passwords',
      'Generate S3 pre-signed URLs with expiration times',
      'Make the S3 bucket publicly accessible',
      'Use S3 bucket policies with IP restrictions',
    ],
    correctAnswer: 1,
    explanation: 'Pre-signed URLs provide temporary, secure access to S3 objects without requiring IAM credentials. They automatically expire after a specified time, making them ideal for temporary external access.',
    references: ['S3 Pre-signed URLs', 'Temporary Access', 'IAM', 'Security Best Practices'],
  },
  {
    id: 6,
    domain: 'Design Secure Applications and Architectures',
    question: 'An application running on EC2 needs to access AWS services. What is the MOST secure way to provide credentials?',
    options: [
      'Store AWS credentials in the application code',
      'Store credentials in environment variables on the EC2 instance',
      'Attach an IAM role to the EC2 instance',
      'Use AWS Systems Manager Parameter Store',
    ],
    correctAnswer: 2,
    explanation: 'IAM roles provide temporary credentials that are automatically rotated by AWS. This eliminates the need to store long-term credentials and follows AWS security best practices.',
    references: ['IAM Roles', 'EC2', 'Security Best Practices', 'Temporary Credentials'],
  },
  {
    id: 7,
    domain: 'Design Cost-Optimized Architectures',
    question: 'A company has a batch processing job that runs for 4 hours every night. What is the MOST cost-effective EC2 pricing model?',
    options: [
      'On-Demand Instances',
      'Reserved Instances (1-year term)',
      'Spot Instances',
      'Dedicated Hosts',
    ],
    correctAnswer: 2,
    explanation: 'Spot Instances are ideal for fault-tolerant, flexible workloads like batch processing. They can provide up to 90% cost savings compared to On-Demand pricing. Since the job runs at night with flexibility, interruptions can be handled.',
    references: ['Spot Instances', 'EC2 Pricing Models', 'Cost Optimization', 'Batch Processing'],
  },
  {
    id: 8,
    domain: 'Design Cost-Optimized Architectures',
    question: 'A company stores 500 TB of infrequently accessed data that must be retained for 7 years for compliance. What is the MOST cost-effective storage solution?',
    options: [
      'Amazon S3 Standard',
      'Amazon S3 Intelligent-Tiering',
      'Amazon S3 Glacier Deep Archive',
      'Amazon EFS Infrequent Access',
    ],
    correctAnswer: 2,
    explanation: 'S3 Glacier Deep Archive provides the lowest-cost storage for long-term archival data that is rarely accessed. It is designed for data retention with retrieval times of 12-48 hours, perfect for compliance requirements.',
    references: ['S3 Glacier Deep Archive', 'S3 Storage Classes', 'Cost Optimization', 'Archival Storage'],
  },
  {
    id: 9,
    domain: 'Operational Excellence',
    question: 'A DevOps team needs to automate infrastructure provisioning and ensure consistency across environments. Which service is BEST suited for this?',
    options: [
      'AWS CloudFormation',
      'AWS Systems Manager',
      'AWS Config',
      'AWS OpsWorks',
    ],
    correctAnswer: 0,
    explanation: 'CloudFormation provides infrastructure as code (IaC) capabilities, allowing you to define and provision AWS infrastructure using templates. This ensures consistency, repeatability, and version control across all environments.',
    references: ['CloudFormation', 'Infrastructure as Code', 'Automation', 'DevOps'],
  },
  {
    id: 10,
    domain: 'Operational Excellence',
    question: 'A company wants to receive alerts when their monthly AWS bill exceeds $1,000. Which service should they use?',
    options: [
      'Amazon CloudWatch with custom metrics',
      'AWS Budgets with budget alerts',
      'AWS Cost Explorer with saved reports',
      'AWS Trusted Advisor',
    ],
    correctAnswer: 1,
    explanation: 'AWS Budgets allows you to set custom cost and usage budgets with alert notifications via SNS when thresholds are exceeded. It is specifically designed for monitoring and alerting on AWS spending.',
    references: ['AWS Budgets', 'Cost Management', 'CloudWatch', 'Billing Alerts'],
  },
  {
    id: 11,
    domain: 'Design Resilient Architectures',
    question: 'A company is building a microservices application where multiple services must receive the same event simultaneously. Which AWS pattern supports this fan-out architecture?',
    options: [
      'Amazon SQS FIFO Queue with multiple consumers',
      'Amazon SNS topic with multiple SQS queue subscriptions',
      'Amazon Kinesis Data Streams with enhanced fan-out',
      'AWS EventBridge with a single Lambda target',
    ],
    correctAnswer: 1,
    explanation: 'SNS fan-out delivers one message to multiple SQS queues simultaneously. Each service has its own queue and processes messages independently, enabling true decoupled fan-out architecture.',
    references: ['SNS', 'SQS', 'Fan-out Pattern', 'Microservices'],
  },
  {
    id: 12,
    domain: 'Design Secure Applications and Architectures',
    question: 'A company needs to rotate database credentials automatically every 30 days without changing application code. Which service handles this?',
    options: [
      'AWS Systems Manager Parameter Store with SecureString',
      'AWS Secrets Manager with automatic rotation enabled',
      'AWS KMS with automatic key rotation',
      'Amazon Cognito user pool with password policy',
    ],
    correctAnswer: 1,
    explanation: 'AWS Secrets Manager supports automatic rotation of secrets (including RDS credentials) using Lambda functions. It updates the secret value and the database password without any application changes.',
    references: ['Secrets Manager', 'Credential Rotation', 'RDS', 'Security Best Practices'],
  },
  {
    id: 13,
    domain: 'Design High-Performance Architectures',
    question: 'An application needs a database that can handle millions of requests per second with single-digit millisecond latency and must scale globally. Which AWS database is the best fit?',
    options: [
      'Amazon RDS Aurora with read replicas',
      'Amazon ElastiCache for Redis',
      'Amazon DynamoDB with global tables',
      'Amazon Redshift with RA3 nodes',
    ],
    correctAnswer: 2,
    explanation: 'DynamoDB with global tables provides multi-region, active-active replication with single-digit millisecond latency at any scale. It is purpose-built for millions of requests per second without managing servers.',
    references: ['DynamoDB', 'Global Tables', 'NoSQL', 'Scalability'],
  },
  {
    id: 14,
    domain: 'Design Cost-Optimized Architectures',
    question: 'A company wants to reduce EC2 costs for a development environment that runs only during business hours. What is the MOST cost-effective approach?',
    options: [
      'Use Reserved Instances for the dev environment',
      'Use Spot Instances for all dev workloads',
      'Schedule EC2 instances to stop at night and on weekends using AWS Instance Scheduler',
      'Use AWS Lambda instead of EC2 for all development workloads',
    ],
    correctAnswer: 2,
    explanation: 'Stopping EC2 instances when not in use eliminates instance-hour charges. An 8-hour workday, 5 days a week represents only ~24% of all hours — stopping instances for the remaining 76% provides significant savings.',
    references: ['EC2', 'Cost Optimization', 'Instance Scheduler', 'AWS Systems Manager'],
  },
  {
    id: 15,
    domain: 'Design Resilient Architectures',
    question: 'A company needs their RDS database to survive an Availability Zone failure with automatic failover and no data loss. Which configuration achieves this?',
    options: [
      'RDS with automated backups enabled',
      'RDS with a read replica in a different AZ',
      'RDS Multi-AZ deployment with synchronous replication',
      'RDS with manual snapshots taken every hour',
    ],
    correctAnswer: 2,
    explanation: 'RDS Multi-AZ uses synchronous replication to a standby instance in a different AZ. If the primary fails, RDS automatically fails over to the standby in 1-2 minutes with no data loss (synchronous = zero RPO).',
    references: ['RDS Multi-AZ', 'High Availability', 'Failover', 'Synchronous Replication'],
  },
  {
    id: 16,
    domain: 'Design Secure Applications and Architectures',
    question: 'A Solutions Architect needs to ensure that only specific AWS accounts can assume a cross-account IAM role. Which element of the role configuration controls this?',
    options: [
      'The role permission policy',
      'The role trust policy (principal section)',
      'A Service Control Policy in AWS Organizations',
      'The role boundary policy',
    ],
    correctAnswer: 1,
    explanation: 'The trust policy defines WHO can assume the role (the principal). The permission policy defines WHAT the role can do. To restrict cross-account access, you specify the trusted account IDs in the principal section of the trust policy.',
    references: ['IAM Roles', 'Trust Policy', 'Cross-Account Access', 'Principal'],
  },
  {
    id: 17,
    domain: 'Design High-Performance Architectures',
    question: 'A company wants to use a managed service to run containerized applications without managing EC2 servers. Which combination achieves this?',
    options: [
      'Amazon ECS with EC2 launch type',
      'Amazon EKS with self-managed node groups',
      'Amazon ECS or EKS with AWS Fargate launch type',
      'Amazon EC2 with Docker installed manually',
    ],
    correctAnswer: 2,
    explanation: 'AWS Fargate is a serverless compute engine for containers. With ECS or EKS on Fargate, AWS manages the underlying infrastructure — you only define and run your containers without provisioning or managing EC2 instances.',
    references: ['Fargate', 'ECS', 'EKS', 'Serverless Containers'],
  },
  {
    id: 18,
    domain: 'Design Cost-Optimized Architectures',
    question: 'A company has a predictable workload running 24/7 for the next 3 years. What is the MOST cost-effective EC2 purchasing option?',
    options: [
      'On-Demand Instances',
      'Spot Instances',
      'Reserved Instances with a 3-year term (All Upfront)',
      'Dedicated Hosts',
    ],
    correctAnswer: 2,
    explanation: 'For steady-state, predictable 24/7 workloads, Reserved Instances with a 3-year All Upfront commitment provide the maximum discount (up to 72% off On-Demand). The longer commitment and full upfront payment yields the deepest savings.',
    references: ['Reserved Instances', 'EC2 Pricing', 'Cost Optimization', '3-Year Commitment'],
  },
  {
    id: 19,
    domain: 'Operational Excellence',
    question: 'A team needs to define and version-control their entire AWS infrastructure and deploy it consistently across dev, staging, and production environments. Which service enables this?',
    options: [
      'AWS Systems Manager',
      'AWS CloudFormation with stack templates',
      'AWS Config with conformance packs',
      'AWS OpsWorks',
    ],
    correctAnswer: 1,
    explanation: 'CloudFormation allows you to define infrastructure as code in JSON/YAML templates. The same template can deploy identical environments in any account or region, ensuring consistency. Templates can be version-controlled in Git.',
    references: ['CloudFormation', 'Infrastructure as Code', 'IaC', 'DevOps'],
  },
  {
    id: 20,
    domain: 'Design Resilient Architectures',
    question: 'A company needs to ensure their static website remains available even if the origin S3 bucket has issues. Which architecture provides the best resilience?',
    options: [
      'Host the website directly on S3 with static website hosting enabled',
      'Use CloudFront in front of S3 with origin failover to a secondary S3 bucket',
      'Deploy the website on multiple EC2 instances behind an ALB',
      'Use Route 53 with health checks pointing to S3',
    ],
    correctAnswer: 1,
    explanation: 'CloudFront origin failover automatically routes requests to a secondary S3 origin if the primary fails health checks. This provides high availability with no manual intervention. CloudFront also caches content at edge locations for performance.',
    references: ['CloudFront', 'Origin Failover', 'S3', 'High Availability'],
  },
]

const DOMAIN_COLORS: Record<string, string> = {
  'Design Resilient Architectures': '#2563eb',
  'Design High-Performance Architectures': '#7c3aed',
  'Design Secure Applications and Architectures': '#dc2626',
  'Design Cost-Optimized Architectures': '#16a34a',
  'Operational Excellence': '#2563eb',
}

export default function SampleQuestions() {
  const navigate = useNavigate()
  const { tier } = useAuth()
  const isPaid = tier && tier !== 'free'
  const [current, setCurrent] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [answered, setAnswered] = useState(false)
  const [answers, setAnswers] = useState<{ userAnswer: number; isCorrect: boolean }[]>([])
  const [done, setDone] = useState(false)

  const q = questions[current]
  const score = answers.filter(a => a.isCorrect).length
  const domainColor = DOMAIN_COLORS[q?.domain] || '#2563eb'

  function handleSelect(idx: number) {
    if (answered) return
    setSelected(idx)
  }

  function handleSubmit() {
    if (selected === null) return
    const isCorrect = selected === q.correctAnswer
    setAnswered(true)
    const newAnswers = [...answers]
    newAnswers[current] = { userAnswer: selected, isCorrect }
    setAnswers(newAnswers)
  }

  function handleNext() {
    if (current < questions.length - 1) {
      setCurrent(current + 1)
      const prev = answers[current + 1]
      if (prev) {
        setSelected(prev.userAnswer)
        setAnswered(true)
      } else {
        setSelected(null)
        setAnswered(false)
      }
    } else {
      setDone(true)
    }
  }

  function handlePrev() {
    if (current > 0) {
      setCurrent(current - 1)
      const prev = answers[current - 1]
      if (prev) {
        setSelected(prev.userAnswer)
        setAnswered(true)
      } else {
        setSelected(null)
        setAnswered(false)
      }
    }
  }

  function handleRestart() {
    setCurrent(0)
    setSelected(null)
    setAnswered(false)
    setAnswers([])
    setDone(false)
  }

  if (done) {
    const pct = Math.round((score / questions.length) * 100)
    return (
      <Layout>
        <div style={{ background: '#f8fafc', minHeight: '100vh', padding: '60px 20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#fff', borderRadius: '20px', padding: '48px', maxWidth: '560px', width: '100%', textAlign: 'center', boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}>
            <div style={{ fontSize: '3rem', marginBottom: '16px' }}>
              {pct >= 80 ? '🎉' : pct >= 60 ? '📚' : '💪'}
            </div>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a', margin: '0 0 8px' }}>Quiz Complete!</h2>
            <div style={{ fontSize: '3rem', fontWeight: 900, color: pct >= 80 ? '#16a34a' : pct >= 60 ? '#2563eb' : '#dc2626', margin: '16px 0' }}>
              {score}/{questions.length}
            </div>
            <p style={{ color: '#64748b', marginBottom: '8px' }}>
              {pct >= 80 ? 'Excellent! You are well-prepared.' : pct >= 60 ? 'Good effort. Review the missed questions.' : 'Keep studying — you will get there!'}
            </p>
            {!isPaid && (
              <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginBottom: '32px' }}>
                These are free sample questions. Sign up for access to 3,958 full questions across all 12 certs.
              </p>
            )}
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                onClick={handleRestart}
                style={{ padding: '12px 24px', borderRadius: '10px', background: '#f1f5f9', color: '#475569', border: 'none', fontWeight: 700, cursor: 'pointer', fontSize: '0.95rem' }}
              >
                Try Again
              </button>
              <button
                onClick={() => navigate('/signup')}
                style={{ padding: '12px 24px', borderRadius: '10px', background: '#2563eb', color: '#fff', border: 'none', fontWeight: 700, cursor: 'pointer', fontSize: '0.95rem' }}
              >
                Get Full Access
              </button>
            </div>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div style={{ background: '#f8fafc', minHeight: '100vh', padding: '40px 20px' }}>
        <div style={{ maxWidth: '760px', margin: '0 auto' }}>

          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <div style={{ display: 'inline-block', background: '#eff6ff', color: '#2563eb', padding: '4px 14px', borderRadius: '999px', fontSize: '0.8rem', fontWeight: 700, marginBottom: '12px', letterSpacing: '0.05em' }}>
              FREE SAMPLE
            </div>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a', margin: '0 0 6px' }}>SAA-C03 Sample Questions</h1>
            <p style={{ color: '#64748b', margin: 0 }}>20 curated questions · No sign-up required</p>
          </div>

          {/* Progress bar */}
          <div style={{ background: '#e2e8f0', borderRadius: '999px', height: '6px', marginBottom: '8px' }}>
            <div style={{ background: '#2563eb', height: '6px', borderRadius: '999px', width: `${((current + 1) / questions.length) * 100}%`, transition: 'width 0.3s' }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', color: '#94a3b8', marginBottom: '24px' }}>
            <span>Question {current + 1} of {questions.length}</span>
            <span>Score: {score}/{answers.length}</span>
          </div>

          {/* Question card */}
          <div style={{ background: '#fff', borderRadius: '16px', padding: '28px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', marginBottom: '16px' }}>

            {/* Domain badge */}
            <div style={{ display: 'inline-block', background: `${domainColor}15`, color: domainColor, padding: '4px 12px', borderRadius: '999px', fontSize: '0.78rem', fontWeight: 700, marginBottom: '16px' }}>
              {q.domain}
            </div>

            {/* Question text */}
            <p style={{ fontSize: '1rem', fontWeight: 600, color: '#1e293b', lineHeight: '1.6', margin: '0 0 20px' }}>
              {q.question}
            </p>

            {/* Options */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {q.options.map((opt, idx) => {
                let bg = '#f8fafc'
                let border = '#e2e8f0'
                let color = '#1e293b'

                if (answered) {
                  if (idx === q.correctAnswer) { bg = '#f0fdf4'; border = '#86efac'; color = '#15803d' }
                  else if (idx === selected && idx !== q.correctAnswer) { bg = '#fef2f2'; border = '#fca5a5'; color = '#b91c1c' }
                } else if (selected === idx) {
                  bg = '#eff6ff'; border = '#93c5fd'; color = '#1d4ed8'
                }

                return (
                  <div
                    key={idx}
                    onClick={() => handleSelect(idx)}
                    style={{
                      display: 'flex', alignItems: 'flex-start', gap: '12px', padding: '14px 16px',
                      borderRadius: '10px', background: bg, border: `1.5px solid ${border}`,
                      cursor: answered ? 'default' : 'pointer', transition: 'all 0.15s', color
                    }}
                  >
                    <span style={{
                      width: '26px', height: '26px', borderRadius: '50%',
                      background: answered && idx === q.correctAnswer ? '#16a34a' : answered && idx === selected ? '#dc2626' : selected === idx ? '#2563eb' : '#e2e8f0',
                      color: (answered || selected === idx) ? '#fff' : '#94a3b8',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontWeight: 700, fontSize: '0.78rem', flexShrink: 0
                    }}>
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span style={{ lineHeight: '1.5', fontSize: '0.93rem', paddingTop: '3px' }}>{opt}</span>
                    {answered && idx === q.correctAnswer && <span style={{ marginLeft: 'auto', color: '#16a34a', flexShrink: 0 }}>✓</span>}
                    {answered && idx === selected && idx !== q.correctAnswer && <span style={{ marginLeft: 'auto', color: '#dc2626', flexShrink: 0 }}>✗</span>}
                  </div>
                )
              })}
            </div>

            {/* Explanation */}
            {answered && (
              <div style={{
                marginTop: '20px', padding: '16px', borderRadius: '10px',
                background: answers[current]?.isCorrect ? '#f0fdf4' : '#fef2f2',
                border: `1px solid ${answers[current]?.isCorrect ? '#86efac' : '#fca5a5'}`
              }}>
                <div style={{ fontWeight: 700, color: answers[current]?.isCorrect ? '#15803d' : '#b91c1c', marginBottom: '6px' }}>
                  {answers[current]?.isCorrect ? '✅ Correct!' : '❌ Incorrect'}
                </div>
                <p style={{ color: '#374151', margin: '0 0 10px', fontSize: '0.9rem', lineHeight: '1.6' }}>{q.explanation}</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {q.references.map(r => (
                    <span key={r} style={{ background: '#e0f2fe', color: '#0369a1', padding: '2px 8px', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 600 }}>{r}</span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Navigation */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px' }}>
            <button
              onClick={handlePrev}
              disabled={current === 0}
              style={{
                padding: '10px 20px', borderRadius: '10px', border: '1px solid #e2e8f0',
                background: '#fff', color: current === 0 ? '#cbd5e1' : '#475569',
                fontWeight: 600, cursor: current === 0 ? 'default' : 'pointer', fontSize: '0.9rem'
              }}
            >
              ← Previous
            </button>

            {!answered ? (
              <button
                onClick={handleSubmit}
                disabled={selected === null}
                style={{
                  padding: '10px 28px', borderRadius: '10px', border: 'none',
                  background: selected === null ? '#e2e8f0' : '#2563eb',
                  color: selected === null ? '#94a3b8' : '#fff',
                  fontWeight: 700, cursor: selected === null ? 'default' : 'pointer', fontSize: '0.9rem'
                }}
              >
                Submit Answer
              </button>
            ) : (
              <button
                onClick={handleNext}
                style={{
                  padding: '10px 28px', borderRadius: '10px', border: 'none',
                  background: '#2563eb', color: '#fff', fontWeight: 700, cursor: 'pointer', fontSize: '0.9rem'
                }}
              >
                {current < questions.length - 1 ? 'Next →' : 'See Results'}
              </button>
            )}
          </div>

          {/* CTA */}
          {isPaid ? (
            <div style={{ marginTop: '32px', background: '#0f172a', borderRadius: '16px', padding: '24px', textAlign: 'center' }}>
              <p style={{ color: '#4ade80', fontWeight: 700, fontSize: '1rem', margin: '0 0 8px' }}>✅ You have full access</p>
              <p style={{ color: '#94a3b8', margin: '0 0 16px', fontSize: '0.85rem' }}>3,958 questions across all 12 AWS certifications</p>
              <button
                onClick={() => navigate('/certifications')}
                style={{ padding: '10px 24px', borderRadius: '10px', background: '#2563eb', color: '#fff', border: 'none', fontWeight: 700, cursor: 'pointer', fontSize: '0.9rem' }}
              >
                Start Full Practice →
              </button>
            </div>
          ) : (
            <div style={{ marginTop: '32px', background: '#0f172a', borderRadius: '16px', padding: '24px', textAlign: 'center' }}>
              <p style={{ color: '#94a3b8', margin: '0 0 8px', fontSize: '0.85rem' }}>Want more? Get full access to</p>
              <p style={{ color: '#fff', fontWeight: 700, fontSize: '1.1rem', margin: '0 0 16px' }}>
                3,958 questions across all 12 AWS certifications
              </p>
              <button
                onClick={() => navigate('/signup')}
                style={{ padding: '10px 24px', borderRadius: '10px', background: '#2563eb', color: '#fff', border: 'none', fontWeight: 700, cursor: 'pointer', fontSize: '0.9rem' }}
              >
                Sign Up Free
              </button>
            </div>
          )}

        </div>
      </div>
    </Layout>
  )
}
