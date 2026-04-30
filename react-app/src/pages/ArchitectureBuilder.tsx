import { useState } from 'react'
import Layout from '../components/Layout'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

// ── Service definitions ────────────────────────────────────────────────────────
interface ServiceDef {
  id: string
  name: string
  category: string
  color: string
  emoji: string
  desc: string
}

const ALL_SERVICES: ServiceDef[] = [
  // Compute
  { id: 'ec2', name: 'EC2', category: 'compute', color: '#FF9900', emoji: '🖥️', desc: 'Virtual servers' },
  { id: 'lambda', name: 'Lambda', category: 'compute', color: '#FF9900', emoji: '⚙️', desc: 'Serverless functions' },
  { id: 'ecs', name: 'ECS', category: 'compute', color: '#FF9900', emoji: '🐳', desc: 'Container service' },
  { id: 'asg', name: 'Auto Scaling', category: 'compute', color: '#FF9900', emoji: '🔄', desc: 'Auto scale EC2' },
  { id: 'elasticbeanstalk', name: 'Elastic Beanstalk', category: 'compute', color: '#FF9900', emoji: '🎯', desc: 'PaaS platform' },
  // Storage
  { id: 's3', name: 'S3', category: 'storage', color: '#3F8624', emoji: '📦', desc: 'Object storage' },
  { id: 'ebs', name: 'EBS', category: 'storage', color: '#3F8624', emoji: '💾', desc: 'Block storage' },
  { id: 'efs', name: 'EFS', category: 'storage', color: '#3F8624', emoji: '📁', desc: 'File system' },
  { id: 'glacier', name: 'Glacier', category: 'storage', color: '#3F8624', emoji: '❄️', desc: 'Archival storage' },
  // Database
  { id: 'rds', name: 'RDS', category: 'database', color: '#1A73E8', emoji: '🗃️', desc: 'Managed SQL DB' },
  { id: 'dynamodb', name: 'DynamoDB', category: 'database', color: '#1A73E8', emoji: '⚡', desc: 'NoSQL database' },
  { id: 'aurora', name: 'Aurora', category: 'database', color: '#1A73E8', emoji: '🔷', desc: 'MySQL/PG compatible' },
  { id: 'elasticache', name: 'ElastiCache', category: 'database', color: '#1A73E8', emoji: '🔴', desc: 'In-memory cache' },
  { id: 'redshift', name: 'Redshift', category: 'database', color: '#1A73E8', emoji: '📊', desc: 'Data warehouse' },
  // Networking
  { id: 'cloudfront', name: 'CloudFront', category: 'networking', color: '#8B5CF6', emoji: '🌐', desc: 'CDN' },
  { id: 'alb', name: 'App Load Balancer', category: 'networking', color: '#8B5CF6', emoji: '⚖️', desc: 'HTTP load balancer' },
  { id: 'nlb', name: 'Network LB', category: 'networking', color: '#8B5CF6', emoji: '🔀', desc: 'TCP load balancer' },
  { id: 'route53', name: 'Route 53', category: 'networking', color: '#8B5CF6', emoji: '🌍', desc: 'DNS service' },
  { id: 'vpc', name: 'VPC', category: 'networking', color: '#8B5CF6', emoji: '🔗', desc: 'Virtual network' },
  { id: 'igw', name: 'Internet Gateway', category: 'networking', color: '#8B5CF6', emoji: '🚪', desc: 'Internet access' },
  { id: 'natgw', name: 'NAT Gateway', category: 'networking', color: '#8B5CF6', emoji: '🔒', desc: 'Private→internet' },
  { id: 'apigateway', name: 'API Gateway', category: 'networking', color: '#8B5CF6', emoji: '🔌', desc: 'Managed API' },
  // Security
  { id: 'iam', name: 'IAM', category: 'security', color: '#DC2626', emoji: '🔑', desc: 'Identity & access' },
  { id: 'kms', name: 'KMS', category: 'security', color: '#DC2626', emoji: '🗝️', desc: 'Encryption keys' },
  { id: 'waf', name: 'WAF', category: 'security', color: '#DC2626', emoji: '🛡️', desc: 'Web app firewall' },
  { id: 'securitygroups', name: 'Security Groups', category: 'security', color: '#DC2626', emoji: '🔐', desc: 'Instance firewall' },
  { id: 'elasticip', name: 'Elastic IP', category: 'networking', color: '#8B5CF6', emoji: '📍', desc: 'Static public IP' },
  // Integration
  { id: 'sqs', name: 'SQS', category: 'integration', color: '#EA580C', emoji: '📨', desc: 'Message queue' },
  { id: 'sns', name: 'SNS', category: 'integration', color: '#EA580C', emoji: '📢', desc: 'Pub/sub messaging' },
  { id: 'eventbridge', name: 'EventBridge', category: 'integration', color: '#EA580C', emoji: '⚡', desc: 'Event bus' },
  // Monitoring
  { id: 'cloudwatch', name: 'CloudWatch', category: 'monitoring', color: '#0369A1', emoji: '📈', desc: 'Monitoring & logs' },
  { id: 'cloudtrail', name: 'CloudTrail', category: 'monitoring', color: '#0369A1', emoji: '📋', desc: 'API audit logs' },
]

// ── Challenge definitions ──────────────────────────────────────────────────────
interface Challenge {
  id: number
  difficulty: string
  category: string
  title: string
  scenario: string
  requiredServices: string[]
  explanation: string
  hint: string
}

const CHALLENGES: Challenge[] = [
  {
    id: 1, difficulty: 'beginner', category: 'design-resilient',
    title: 'Static Website Hosting',
    scenario: 'Build a highly available architecture to host a static website with global distribution and low latency for users worldwide.',
    requiredServices: ['s3', 'cloudfront', 'route53'],
    explanation: 'Route 53 routes users to the CloudFront distribution. CloudFront caches static content from S3 at edge locations worldwide, delivering low-latency responses globally.',
    hint: 'Think: storage → CDN → DNS',
  },
  {
    id: 2, difficulty: 'beginner', category: 'design-secure',
    title: 'Simple Web Server',
    scenario: 'Deploy a single web application server accessible from the internet with proper network security and a static public IP.',
    requiredServices: ['ec2', 'securitygroups', 'elasticip'],
    explanation: 'EC2 provides the virtual server. Security Groups act as a virtual firewall. An Elastic IP provides a static public IP address.',
    hint: 'Think: compute + firewall + static IP',
  },
  {
    id: 3, difficulty: 'beginner', category: 'design-secure',
    title: 'Web App with Database',
    scenario: 'Deploy a web application with a relational database backend. The database must NOT be directly accessible from the internet.',
    requiredServices: ['ec2', 'rds', 'securitygroups'],
    explanation: 'EC2 hosts the web app and connects to RDS. Security Groups on the RDS instance only allow traffic from the EC2 security group, blocking public access.',
    hint: 'Think: web server → database + network isolation',
  },
  {
    id: 4, difficulty: 'beginner', category: 'design-secure',
    title: 'Encrypted Data Storage',
    scenario: 'Store sensitive customer data in AWS with server-side encryption using customer-managed keys to meet compliance requirements.',
    requiredServices: ['s3', 'kms'],
    explanation: 'S3 stores the data objects. KMS manages the customer-managed encryption keys. S3 uses SSE-KMS to encrypt all data at rest.',
    hint: 'Think: object storage + key management',
  },
  {
    id: 5, difficulty: 'beginner', category: 'design-resilient',
    title: 'Load Balanced Web App',
    scenario: 'Distribute incoming web traffic across multiple web server instances for better availability and to handle more concurrent users.',
    requiredServices: ['alb', 'ec2', 'securitygroups'],
    explanation: 'The ALB distributes incoming HTTP/HTTPS traffic across EC2 instances. Security Groups restrict inbound traffic to only the ALB.',
    hint: 'Think: load balancer → multiple servers + security',
  },
  {
    id: 6, difficulty: 'beginner', category: 'design-resilient',
    title: 'Auto Scaling Web Tier',
    scenario: 'Build a web tier that automatically scales EC2 instances up and down based on CPU usage and traffic load.',
    requiredServices: ['alb', 'asg', 'ec2', 'cloudwatch'],
    explanation: 'CloudWatch monitors CPU/request metrics and triggers ASG scaling policies. The ASG launches/terminates EC2 instances. ALB distributes traffic to healthy instances.',
    hint: 'Think: monitoring → auto scaling → compute behind a load balancer',
  },
  {
    id: 7, difficulty: 'beginner', category: 'design-resilient',
    title: 'Decoupled Architecture',
    scenario: 'Decouple a web application from a backend processing service using a message queue to handle variable workloads.',
    requiredServices: ['ec2', 'sqs'],
    explanation: 'The web EC2 instance sends tasks to SQS. The backend EC2 instances poll and process messages independently. SQS buffers the load and prevents message loss.',
    hint: 'Think: producer → queue → consumer',
  },
  {
    id: 8, difficulty: 'beginner', category: 'design-resilient',
    title: 'Multi-AZ Database',
    scenario: 'Configure a relational database that can survive an Availability Zone failure with automatic failover and no data loss.',
    requiredServices: ['rds', 'ec2'],
    explanation: 'RDS Multi-AZ maintains a synchronous standby in a different AZ. If the primary fails, RDS automatically fails over to the standby with minimal downtime.',
    hint: 'Think: web server + Multi-AZ managed database',
  },
  {
    id: 9, difficulty: 'beginner', category: 'design-performant',
    title: 'Serverless REST API',
    scenario: 'Build a fully serverless REST API that scales automatically with zero server management. The API reads and writes to a NoSQL database.',
    requiredServices: ['apigateway', 'lambda', 'dynamodb'],
    explanation: 'API Gateway handles HTTP requests and routes them to Lambda functions. Lambda executes the business logic and reads/writes to DynamoDB. Fully serverless — no EC2 needed.',
    hint: 'Think: API endpoint → serverless function → NoSQL database',
  },
  {
    id: 10, difficulty: 'beginner', category: 'design-secure',
    title: 'Secure Static Website with WAF',
    scenario: 'Host a static website globally with CloudFront and protect it from common web attacks like SQL injection and XSS.',
    requiredServices: ['s3', 'cloudfront', 'waf', 'route53'],
    explanation: 'Route 53 → CloudFront (with WAF attached) → S3. WAF inspects and filters malicious HTTP requests at the CloudFront edge before they reach the origin.',
    hint: 'Think: DNS → CDN with web firewall → storage',
  },
]

const CAT_LABELS: Record<string, string> = {
  'design-resilient': 'Resilient',
  'design-secure': 'Secure',
  'design-performant': 'Performance',
  'design-cost': 'Cost',
}


// ── Component ─────────────────────────────────────────────────────────────────
export default function ArchitectureBuilder() {
  const { user, isPremium } = useAuth()
  const navigate = useNavigate()

  const [challengeIdx, setChallengeIdx] = useState(0)
  const [placed, setPlaced] = useState<string[]>([])
  const [checked, setChecked] = useState(false)
  const [showHint, setShowHint] = useState(false)
  const [completed, setCompleted] = useState<Set<number>>(new Set())
  const [categoryFilter, setCategoryFilter] = useState('all')

  const challenge = CHALLENGES[challengeIdx]

  // Paywall
  if (!isPremium) {
    return (
      <Layout>
        <div style={{ background: '#f8fafc', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
          <div style={{ background: '#fff', borderRadius: '20px', padding: '48px', maxWidth: '480px', width: '100%', textAlign: 'center', boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '16px' }}>🏗️</div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', margin: '0 0 8px' }}>Architecture Builder requires a subscription</h2>
            <p style={{ color: '#64748b', marginBottom: '8px' }}>10 hands-on challenges · Drag AWS services to build real architectures · Instant feedback.</p>
            <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginBottom: '24px' }}>Available on Monthly ($7/mo), Yearly ($67/yr), and Lifetime ($147) plans.</p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              {!user && <button onClick={() => navigate('/signup')} style={{ padding: '10px 24px', borderRadius: '10px', background: '#f1f5f9', color: '#475569', border: 'none', fontWeight: 700, cursor: 'pointer' }}>Sign Up Free</button>}
              <button onClick={() => navigate('/pricing')} style={{ padding: '12px 28px', borderRadius: '10px', background: '#2563eb', color: '#fff', border: 'none', fontWeight: 700, cursor: 'pointer', fontSize: '0.95rem' }}>
                View Plans →
              </button>
            </div>
          </div>
        </div>
      </Layout>
    )
  }

  function toggleService(id: string) {
    if (checked) return
    setPlaced(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id])
  }

  function checkAnswer() {
    setChecked(true)
    const required = challenge.requiredServices
    const allCorrect = required.every(s => placed.includes(s)) && placed.length === required.length
    if (allCorrect) {
      setCompleted(prev => new Set([...prev, challenge.id]))
    }
  }

  function nextChallenge() {
    if (challengeIdx < CHALLENGES.length - 1) {
      setChallengeIdx(challengeIdx + 1)
      setPlaced([])
      setChecked(false)
      setShowHint(false)
    }
  }

  function prevChallenge() {
    if (challengeIdx > 0) {
      setChallengeIdx(challengeIdx - 1)
      setPlaced([])
      setChecked(false)
      setShowHint(false)
    }
  }

  function reset() {
    setPlaced([])
    setChecked(false)
    setShowHint(false)
  }

  const required = challenge.requiredServices
  const allCorrect = checked && required.every(s => placed.includes(s)) && placed.length === required.length
  const hasWrong = checked && (!required.every(s => placed.includes(s)) || placed.length !== required.length)

  const filteredServices = categoryFilter === 'all'
    ? ALL_SERVICES
    : ALL_SERVICES.filter(s => s.category === categoryFilter)

  return (
    <Layout>
      <div style={{ background: '#f8fafc', minHeight: '100vh', padding: '32px 20px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>

          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '28px' }}>
            <div style={{ display: 'inline-block', background: '#eff6ff', color: '#1d4ed8', padding: '4px 14px', borderRadius: '999px', fontSize: '0.8rem', fontWeight: 700, marginBottom: '10px', letterSpacing: '0.05em' }}>
              ARCHITECTURE BUILDER
            </div>
            <h1 style={{ fontSize: '1.7rem', fontWeight: 800, color: '#0f172a', margin: '0 0 6px' }}>Build AWS Architectures</h1>
            <p style={{ color: '#64748b', margin: 0 }}>Select the correct AWS services for each scenario · {completed.size}/{CHALLENGES.length} completed</p>
          </div>

          {/* Challenge progress */}
          <div style={{ display: 'flex', gap: '6px', marginBottom: '24px', flexWrap: 'wrap', justifyContent: 'center' }}>
            {CHALLENGES.map((c, i) => (
              <button
                key={c.id}
                onClick={() => { setChallengeIdx(i); setPlaced([]); setChecked(false); setShowHint(false) }}
                style={{
                  width: '36px', height: '36px', borderRadius: '50%', border: '2px solid',
                  fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer',
                  background: completed.has(c.id) ? '#16a34a' : challengeIdx === i ? '#2563eb' : '#fff',
                  color: completed.has(c.id) || challengeIdx === i ? '#fff' : '#64748b',
                  borderColor: completed.has(c.id) ? '#16a34a' : challengeIdx === i ? '#2563eb' : '#e2e8f0',
                }}
              >
                {completed.has(c.id) ? '✓' : i + 1}
              </button>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '20px' }}>

            {/* Left: Challenge + Canvas */}
            <div>
              {/* Challenge card */}
              <div style={{ background: '#fff', borderRadius: '16px', padding: '24px', marginBottom: '16px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                  <span style={{ background: '#eff6ff', color: '#2563eb', padding: '2px 10px', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 700 }}>
                    Challenge {challengeIdx + 1}/{CHALLENGES.length}
                  </span>
                  <span style={{ background: '#f0fdf4', color: '#16a34a', padding: '2px 10px', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 700 }}>
                    {challenge.difficulty}
                  </span>
                  <span style={{ background: '#faf5ff', color: '#7e22ce', padding: '2px 10px', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 700 }}>
                    {CAT_LABELS[challenge.category] || challenge.category}
                  </span>
                </div>
                <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', margin: '0 0 10px' }}>{challenge.title}</h2>
                <p style={{ color: '#475569', margin: '0 0 12px', lineHeight: '1.6', fontSize: '0.93rem' }}>{challenge.scenario}</p>

                {showHint && (
                  <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '10px', padding: '10px 14px', fontSize: '0.88rem', color: '#1e40af' }}>
                    💡 {challenge.hint}
                  </div>
                )}
              </div>

              {/* Canvas — selected services */}
              <div style={{ background: '#fff', borderRadius: '16px', padding: '20px', minHeight: '200px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', marginBottom: '16px' }}>
                <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#94a3b8', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Your Architecture ({placed.length} service{placed.length !== 1 ? 's' : ''} selected)
                </div>

                {placed.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '32px', color: '#cbd5e1', fontSize: '0.9rem' }}>
                    Click services from the panel to add them here
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                    {placed.map(sid => {
                      const svc = ALL_SERVICES.find(s => s.id === sid)!
                      const isRequired = required.includes(sid)
                      const borderColor = checked ? (isRequired ? '#16a34a' : '#dc2626') : svc.color
                      const bg = checked ? (isRequired ? '#f0fdf4' : '#fef2f2') : `${svc.color}10`
                      return (
                        <div
                          key={sid}
                          onClick={() => !checked && setPlaced(prev => prev.filter(s => s !== sid))}
                          style={{
                            display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 14px',
                            borderRadius: '10px', background: bg, border: `1.5px solid ${borderColor}`,
                            cursor: checked ? 'default' : 'pointer',
                          }}
                        >
                          <span>{svc.emoji}</span>
                          <span style={{ fontWeight: 700, color: '#1e293b', fontSize: '0.88rem' }}>{svc.name}</span>
                          {checked && (isRequired ? <span style={{ color: '#16a34a' }}>✓</span> : <span style={{ color: '#dc2626' }}>✗</span>)}
                          {!checked && <span style={{ color: '#94a3b8', fontSize: '0.75rem' }}>×</span>}
                        </div>
                      )
                    })}
                  </div>
                )}

                {/* Missing services after check */}
                {checked && hasWrong && (
                  <div style={{ marginTop: '12px', padding: '12px', background: '#fef2f2', borderRadius: '10px', border: '1px solid #fca5a5' }}>
                    <div style={{ fontWeight: 700, color: '#b91c1c', marginBottom: '4px', fontSize: '0.88rem' }}>Missing required services:</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {required.filter(s => !placed.includes(s)).map(sid => {
                        const svc = ALL_SERVICES.find(s => s.id === sid)
                        return <span key={sid} style={{ background: '#fee2e2', color: '#b91c1c', padding: '2px 10px', borderRadius: '999px', fontSize: '0.8rem', fontWeight: 600 }}>{svc?.emoji} {svc?.name}</span>
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Explanation */}
              {checked && (
                <div style={{
                  background: allCorrect ? '#f0fdf4' : '#fef2f2',
                  border: `1px solid ${allCorrect ? '#86efac' : '#fca5a5'}`,
                  borderRadius: '12px', padding: '16px', marginBottom: '16px'
                }}>
                  <div style={{ fontWeight: 700, color: allCorrect ? '#15803d' : '#b91c1c', marginBottom: '8px', fontSize: '0.95rem' }}>
                    {allCorrect ? '✅ Perfect Architecture!' : '❌ Not quite — see above'}
                  </div>
                  <p style={{ color: '#374151', margin: 0, fontSize: '0.9rem', lineHeight: '1.6' }}>{challenge.explanation}</p>
                </div>
              )}

              {/* Actions */}
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <button onClick={prevChallenge} disabled={challengeIdx === 0} style={{ padding: '10px 18px', borderRadius: '10px', border: '1px solid #e2e8f0', background: '#fff', color: challengeIdx === 0 ? '#cbd5e1' : '#475569', fontWeight: 600, cursor: challengeIdx === 0 ? 'default' : 'pointer', fontSize: '0.88rem' }}>
                  ← Prev
                </button>
                {!checked ? (
                  <>
                    <button onClick={() => setShowHint(!showHint)} style={{ padding: '10px 18px', borderRadius: '10px', border: '1px solid #bfdbfe', background: '#eff6ff', color: '#1e40af', fontWeight: 600, cursor: 'pointer', fontSize: '0.88rem' }}>
                      💡 Hint
                    </button>
                    <button onClick={checkAnswer} disabled={placed.length === 0} style={{ padding: '10px 24px', borderRadius: '10px', border: 'none', background: placed.length === 0 ? '#e2e8f0' : '#2563eb', color: placed.length === 0 ? '#94a3b8' : '#fff', fontWeight: 700, cursor: placed.length === 0 ? 'default' : 'pointer', fontSize: '0.88rem' }}>
                      Check Answer
                    </button>
                  </>
                ) : (
                  <>
                    <button onClick={reset} style={{ padding: '10px 18px', borderRadius: '10px', border: '1px solid #e2e8f0', background: '#fff', color: '#475569', fontWeight: 600, cursor: 'pointer', fontSize: '0.88rem' }}>
                      Try Again
                    </button>
                    {challengeIdx < CHALLENGES.length - 1 && (
                      <button onClick={nextChallenge} style={{ padding: '10px 24px', borderRadius: '10px', border: 'none', background: '#16a34a', color: '#fff', fontWeight: 700, cursor: 'pointer', fontSize: '0.88rem' }}>
                        Next Challenge →
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Right: Service Panel */}
            <div style={{ background: '#fff', borderRadius: '16px', padding: '20px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', alignSelf: 'start', position: 'sticky', top: '20px', maxHeight: 'calc(100vh - 80px)', overflowY: 'auto' }}>
              <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#94a3b8', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                AWS Services
              </div>

              {/* Category filter */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginBottom: '16px' }}>
                {['all', 'compute', 'storage', 'database', 'networking', 'security', 'integration', 'monitoring'].map(cat => (
                  <button
                    key={cat}
                    onClick={() => setCategoryFilter(cat)}
                    style={{
                      padding: '3px 10px', borderRadius: '999px', fontSize: '0.72rem', fontWeight: 600,
                      border: '1px solid', cursor: 'pointer',
                      background: categoryFilter === cat ? '#2563eb' : '#f8fafc',
                      color: categoryFilter === cat ? '#fff' : '#64748b',
                      borderColor: categoryFilter === cat ? '#2563eb' : '#e2e8f0',
                    }}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {filteredServices.map(svc => {
                  const isPlaced = placed.includes(svc.id)
                  return (
                    <div
                      key={svc.id}
                      onClick={() => toggleService(svc.id)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px',
                        borderRadius: '10px', cursor: checked ? 'default' : 'pointer',
                        border: `1.5px solid ${isPlaced ? svc.color : '#e5e7eb'}`,
                        background: isPlaced ? `${svc.color}10` : '#f8fafc',
                        transition: 'all 0.12s',
                      }}
                    >
                      <span style={{ fontSize: '1.1rem' }}>{svc.emoji}</span>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 700, color: '#1e293b', fontSize: '0.85rem' }}>{svc.name}</div>
                        <div style={{ color: '#94a3b8', fontSize: '0.72rem' }}>{svc.desc}</div>
                      </div>
                      {isPlaced && <span style={{ color: svc.color, fontWeight: 700, fontSize: '0.8rem' }}>✓</span>}
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
