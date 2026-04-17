import { useState } from 'react'
import Layout from '../components/Layout'

interface Comparison {
  a: string
  b: string
  aFull: string
  bFull: string
  aSummary: string
  bSummary: string
  chooseA: string[]
  chooseB: string[]
}

interface Group {
  group: string
  icon: string
  comparisons: Comparison[]
}

const DATA: Group[] = [
  {
    group: 'Compute', icon: '⚡',
    comparisons: [
      {
        a: 'EC2', b: 'Lambda', aFull: 'Amazon EC2', bFull: 'AWS Lambda',
        aSummary: 'Virtual servers — full control, persistent, stateful workloads',
        bSummary: 'Serverless functions — event-driven, auto-scaling, pay-per-execution',
        chooseA: ['Need full OS or custom runtime control', 'Workloads running >15 minutes', 'Stateful applications requiring persistent storage', 'Legacy applications requiring specific OS config'],
        chooseB: ['Event-driven processing (S3 events, API calls)', 'Unpredictable or intermittent traffic', 'Microservices with short execution time', 'Zero server management required'],
      },
      {
        a: 'ECS', b: 'EKS', aFull: 'Amazon ECS', bFull: 'Amazon EKS',
        aSummary: 'AWS-native container orchestration — simpler, tightly integrated with AWS',
        bSummary: 'Managed Kubernetes — industry standard, multi-cloud portability',
        chooseA: ['AWS-native workloads, no Kubernetes expertise needed', 'Simpler orchestration with less operational overhead', 'Tight integration with ALB, IAM, CloudWatch'],
        chooseB: ['Existing Kubernetes workloads', 'Multi-cloud or hybrid strategy', 'Need Kubernetes ecosystem (Helm, operators)'],
      },
      {
        a: 'ECS on EC2', b: 'Fargate', aFull: 'ECS on EC2', bFull: 'ECS on Fargate',
        aSummary: 'Containers on EC2 — manage the underlying instances yourself',
        bSummary: 'Serverless containers — no EC2 management, pay per task',
        chooseA: ['Need GPU instances or specific instance types', 'Cost optimization with reserved capacity', 'Require daemonsets or host-level access'],
        chooseB: ['No desire to manage EC2 clusters', 'Variable or unpredictable container workloads', 'Simplest container deployment path'],
      },
    ],
  },
  {
    group: 'Storage', icon: '🗄️',
    comparisons: [
      {
        a: 'S3', b: 'EBS', aFull: 'Amazon S3', bFull: 'Amazon EBS',
        aSummary: 'Object storage — unlimited scale, accessed via HTTP, decoupled from compute',
        bSummary: 'Block storage — attached to single EC2 instance, low-latency disk',
        chooseA: ['Static files, images, backups, data lakes', 'Shared access across many services', 'Cost-effective large-scale storage', 'Static website hosting'],
        chooseB: ['OS root volume for EC2', 'Database files requiring low-latency block I/O', 'Transactional workloads (IOPS-intensive)'],
      },
      {
        a: 'S3', b: 'EFS', aFull: 'Amazon S3', bFull: 'Amazon EFS',
        aSummary: 'Object storage — HTTP access, unlimited, cheapest at scale',
        bSummary: 'File system — POSIX-compliant, mountable on multiple EC2 simultaneously',
        chooseA: ['Web-accessible content, backups, archives', 'Object-level access via SDK or HTTP'],
        chooseB: ['Shared file system across many EC2 instances', 'Applications that require a POSIX file system', 'Content management or home directories'],
      },
      {
        a: 'S3 Standard', b: 'S3 Glacier', aFull: 'Amazon S3 Standard', bFull: 'S3 Glacier',
        aSummary: 'Frequent access — millisecond retrieval, standard pricing',
        bSummary: 'Archive storage — minutes to hours retrieval, 80%+ cheaper',
        chooseA: ['Data accessed frequently or unpredictably', 'Real-time applications requiring instant access'],
        chooseB: ['Long-term backup and compliance archives (7+ years)', 'Data rarely accessed — DR copies, audit logs'],
      },
    ],
  },
  {
    group: 'Database', icon: '🗃️',
    comparisons: [
      {
        a: 'RDS', b: 'DynamoDB', aFull: 'Amazon RDS', bFull: 'Amazon DynamoDB',
        aSummary: 'Managed relational DB — SQL, ACID transactions, structured schema',
        bSummary: 'NoSQL key-value/document DB — single-digit ms latency at any scale',
        chooseA: ['Complex SQL queries and joins', 'ACID transactions across multiple tables', 'Structured relational data with fixed schema'],
        chooseB: ['Millions of requests/sec with consistent low latency', 'Flexible schema, semi-structured data', 'Serverless, scales automatically to zero'],
      },
      {
        a: 'RDS', b: 'Aurora', aFull: 'Amazon RDS', bFull: 'Amazon Aurora',
        aSummary: 'Standard managed relational DB — MySQL/PostgreSQL/SQL Server/Oracle',
        bSummary: 'AWS-built relational DB — 5x MySQL speed, 3x PostgreSQL, auto-scales storage',
        chooseA: ['Non-MySQL/PostgreSQL engines (Oracle, SQL Server, MariaDB)', 'Cost-sensitive workloads (Aurora costs more)'],
        chooseB: ['High-performance MySQL or PostgreSQL workloads', 'Need Aurora Serverless for variable traffic', 'Up to 15 read replicas with Aurora'],
      },
      {
        a: 'DynamoDB', b: 'ElastiCache', aFull: 'Amazon DynamoDB', bFull: 'Amazon ElastiCache',
        aSummary: 'Durable NoSQL DB — persists data, single-digit ms at scale',
        bSummary: 'In-memory cache — sub-ms latency, ephemeral, for read acceleration',
        chooseA: ['Primary data store that needs to persist', 'Write-heavy workloads with durable storage'],
        chooseB: ['Cache frequently-read data to reduce DB load', 'Session storage, leaderboards, real-time analytics', 'Sub-millisecond latency required'],
      },
    ],
  },
  {
    group: 'Messaging', icon: '📨',
    comparisons: [
      {
        a: 'SQS', b: 'SNS', aFull: 'Amazon SQS', bFull: 'Amazon SNS',
        aSummary: 'Queue — decouples producers and consumers, messages persist until processed',
        bSummary: 'Pub/Sub — fan-out messages to multiple subscribers simultaneously',
        chooseA: ['Decouple microservices with a buffer', 'Ensure each message is processed exactly once (FIFO)', 'Handle traffic spikes without losing messages'],
        chooseB: ['Send notifications to multiple endpoints at once', 'Fan-out to SQS + Lambda + email + SMS simultaneously', 'Push-based delivery to subscribers'],
      },
      {
        a: 'SQS', b: 'EventBridge', aFull: 'Amazon SQS', bFull: 'Amazon EventBridge',
        aSummary: 'Simple queue — point-to-point, pull-based, reliable delivery',
        bSummary: 'Event bus — content-based routing, 90+ AWS sources, SaaS integrations',
        chooseA: ['Simple point-to-point decoupling', 'Need persistent queue with retry logic'],
        chooseB: ['Route events based on content/patterns', 'Integrate with SaaS apps (Salesforce, Zendesk)', 'React to AWS service events (EC2 state changes)'],
      },
    ],
  },
  {
    group: 'Networking', icon: '🌐',
    comparisons: [
      {
        a: 'ALB', b: 'NLB', aFull: 'Application Load Balancer', bFull: 'Network Load Balancer',
        aSummary: 'Layer 7 — HTTP/HTTPS routing, path/host-based rules, WebSockets',
        bSummary: 'Layer 4 — TCP/UDP, ultra-low latency, millions of req/sec, static IP',
        chooseA: ['Web applications with HTTP/HTTPS traffic', 'Content-based routing (path, host, headers)', 'WebSocket or HTTP/2 support needed'],
        chooseB: ['Extreme performance — millions of requests/second', 'TCP/UDP workloads (gaming, IoT, VoIP)', 'Need static IP or Elastic IP on load balancer'],
      },
      {
        a: 'CloudFront', b: 'Global Accelerator', aFull: 'Amazon CloudFront', bFull: 'AWS Global Accelerator',
        aSummary: 'CDN — cache content at edge for HTTP, best for static/media delivery',
        bSummary: 'Network accelerator — routes TCP/UDP over AWS backbone, non-HTTP traffic',
        chooseA: ['Cache and serve static content (images, JS, CSS, video)', 'Reduce latency for global web users', 'DDoS protection with AWS WAF integration'],
        chooseB: ['Non-HTTP workloads (TCP/UDP, gaming, IoT)', 'Need static Anycast IP addresses', 'Consistent performance regardless of content cacheability'],
      },
      {
        a: 'Direct Connect', b: 'VPN', aFull: 'AWS Direct Connect', bFull: 'AWS Site-to-Site VPN',
        aSummary: 'Dedicated private line — consistent bandwidth, low latency, not over internet',
        bSummary: 'Encrypted tunnel over internet — fast setup, lower cost, variable latency',
        chooseA: ['Consistent, high-bandwidth connection to AWS', 'Sensitive data requiring private link (compliance)', 'Production workloads needing predictable performance'],
        chooseB: ['Quick setup (hours vs weeks for Direct Connect)', 'Backup connection for Direct Connect failover', 'Lower cost, acceptable variable latency'],
      },
    ],
  },
  {
    group: 'Security', icon: '🔒',
    comparisons: [
      {
        a: 'WAF', b: 'Shield', aFull: 'AWS WAF', bFull: 'AWS Shield',
        aSummary: 'Web Application Firewall — blocks SQL injection, XSS, custom rules at Layer 7',
        bSummary: 'DDoS protection — absorbs volumetric attacks at Layer 3/4',
        chooseA: ['Block application-layer attacks (SQL injection, XSS)', 'Rate limiting and bot control', 'Custom rules based on IP, geo, request patterns'],
        chooseB: ['Protection against volumetric DDoS attacks', 'Shield Standard: free, automatic for all AWS customers', 'Shield Advanced: 24/7 DRT team, cost protection, Layer 7'],
      },
      {
        a: 'GuardDuty', b: 'Inspector', aFull: 'Amazon GuardDuty', bFull: 'Amazon Inspector',
        aSummary: 'Threat detection — monitors logs/network for active threats and anomalies',
        bSummary: 'Vulnerability scanner — scans EC2/containers/Lambda for CVEs and misconfigs',
        chooseA: ['Detect compromised instances, crypto mining, unusual API calls', 'Continuous monitoring of CloudTrail, VPC Flow Logs, DNS logs'],
        chooseB: ['Scan workloads for known CVEs before attackers find them', 'Compliance: identify unpatched OS/packages', 'Automated vulnerability assessment'],
      },
      {
        a: 'Secrets Manager', b: 'KMS', aFull: 'AWS Secrets Manager', bFull: 'AWS KMS',
        aSummary: 'Stores and rotates secrets (DB passwords, API keys) — with automatic rotation',
        bSummary: 'Creates and manages encryption keys — used to encrypt data at rest',
        chooseA: ['Store database credentials with automatic rotation', 'Inject secrets into Lambda/ECS without hardcoding'],
        chooseB: ['Encrypt S3 objects, EBS volumes, RDS instances', 'Customer-managed key rotation and auditing via CloudTrail'],
      },
    ],
  },
  {
    group: 'Monitoring', icon: '📊',
    comparisons: [
      {
        a: 'CloudWatch', b: 'CloudTrail', aFull: 'Amazon CloudWatch', bFull: 'AWS CloudTrail',
        aSummary: 'Performance monitoring — metrics, logs, alarms, dashboards',
        bSummary: 'API audit log — who did what, when, from where across your AWS account',
        chooseA: ['Monitor EC2 CPU, Lambda duration, RDS connections', 'Set alarms to auto-scale or notify on thresholds', 'Centralize application logs'],
        chooseB: ['Audit: who deleted the S3 bucket?', 'Compliance: prove all API calls are logged', 'Detect unauthorized IAM changes'],
      },
      {
        a: 'CloudWatch', b: 'X-Ray', aFull: 'Amazon CloudWatch', bFull: 'AWS X-Ray',
        aSummary: 'Infrastructure metrics and logs — broad monitoring across all AWS services',
        bSummary: 'Distributed tracing — follow a request through microservices end-to-end',
        chooseA: ['Monitor infrastructure health and set alarms', 'Aggregate logs from EC2, Lambda, containers'],
        chooseB: ['Debug why a microservice call is slow', 'Trace requests across Lambda → API Gateway → DynamoDB', 'Identify bottlenecks in distributed applications'],
      },
      {
        a: 'CloudTrail', b: 'Config', aFull: 'AWS CloudTrail', bFull: 'AWS Config',
        aSummary: 'API activity log — captures every API call made in your account',
        bSummary: 'Configuration history — tracks what your resources look like over time',
        chooseA: ['Who made this change? (IAM user, role, time)', 'Security investigation and forensics'],
        chooseB: ['Was this S3 bucket public last Tuesday?', 'Compliance: are all EC2 instances using approved AMIs?', 'Remediate non-compliant resources automatically'],
      },
    ],
  },
]

const GROUP_COLORS: Record<string, { border: string; bg: string; text: string }> = {
  Compute:    { border: '#3b82f6', bg: '#eff6ff', text: '#1d4ed8' },
  Storage:    { border: '#10b981', bg: '#f0fdf4', text: '#065f46' },
  Database:   { border: '#8b5cf6', bg: '#f5f3ff', text: '#5b21b6' },
  Messaging:  { border: '#f59e0b', bg: '#fffbeb', text: '#92400e' },
  Networking: { border: '#6366f1', bg: '#eef2ff', text: '#3730a3' },
  Security:   { border: '#ef4444', bg: '#fef2f2', text: '#991b1b' },
  Monitoring: { border: '#06b6d4', bg: '#ecfeff', text: '#0e7490' },
}

export default function ServiceComparison() {
  const [activeGroup, setActiveGroup] = useState('All')
  const [expanded, setExpanded] = useState<string | null>(null)

  const groups = ['All', ...DATA.map(g => g.group)]
  const filtered = activeGroup === 'All' ? DATA : DATA.filter(g => g.group === activeGroup)
  const totalPairs = DATA.reduce((acc, g) => acc + g.comparisons.length, 0)

  return (
    <Layout>
      {/* Hero */}
      <div style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%)', padding: '3rem 2rem 2.5rem', textAlign: 'center', borderBottom: '1px solid #1e3a5f' }}>
        <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>⚖️</div>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#f8fafc', marginBottom: '0.5rem' }}>
          Service Comparisons
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '0.95rem', maxWidth: '520px', margin: '0 auto 0.75rem' }}>
          {totalPairs} side-by-side comparisons across {DATA.length} domains — the most-tested "X vs Y" questions on AWS exams.
        </p>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.25)', borderRadius: '999px', padding: '4px 14px', fontSize: '0.75rem', fontWeight: 700, color: '#4ade80', marginBottom: '1.75rem' }}>
          ✅ Derived from AWS official documentation and exam guide objectives
        </div>

        {/* Group filter */}
        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          {groups.map(g => {
            const color = GROUP_COLORS[g]
            const isActive = activeGroup === g
            return (
              <button key={g} onClick={() => setActiveGroup(g)} style={{
                padding: '0.35rem 1rem', borderRadius: '999px', border: '1px solid',
                borderColor: isActive ? (color?.border ?? '#3b82f6') : '#1e3a5f',
                background: isActive ? (color?.bg ?? '#eff6ff') : 'transparent',
                color: isActive ? (color?.text ?? '#1d4ed8') : '#94a3b8',
                cursor: 'pointer', fontSize: '0.82rem',
                fontWeight: isActive ? 700 : 400, transition: 'all 0.15s',
              }}>
                {DATA.find(d => d.group === g)?.icon ?? '🔍'} {g}
              </button>
            )
          })}
        </div>
      </div>

      <div style={{ maxWidth: '920px', margin: '0 auto', padding: '2.5rem 1.5rem' }}>
        {filtered.map(group => {
          const gc = GROUP_COLORS[group.group] ?? { border: '#3b82f6', bg: '#eff6ff', text: '#1d4ed8' }
          return (
            <div key={group.group} style={{ marginBottom: '2.5rem' }}>
              {/* Group header */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', paddingBottom: '0.625rem', borderBottom: `2px solid ${gc.border}20` }}>
                <span style={{ fontSize: '1.25rem' }}>{group.icon}</span>
                <h2 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#111827', margin: 0 }}>{group.group}</h2>
                <span style={{ fontSize: '0.72rem', color: '#9ca3af', fontWeight: 600 }}>{group.comparisons.length} comparisons</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {group.comparisons.map(c => {
                  const key = `${group.group}-${c.a}-${c.b}`
                  const isOpen = expanded === key
                  return (
                    <div key={key} style={{ background: '#fff', border: `1px solid ${isOpen ? gc.border : '#e5e7eb'}`, borderRadius: '0.875rem', overflow: 'hidden', transition: 'border-color 0.15s', boxShadow: isOpen ? `0 0 0 3px ${gc.border}18` : 'none' }}>

                      {/* Card header — always visible */}
                      <button onClick={() => setExpanded(isOpen ? null : key)} style={{ width: '100%', display: 'grid', gridTemplateColumns: '1fr auto 1fr auto', alignItems: 'center', gap: '0.75rem', padding: '1rem 1.25rem', background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left' }}>
                        {/* Service A */}
                        <div>
                          <div style={{ fontWeight: 800, color: '#111827', fontSize: '0.95rem' }}>{c.aFull}</div>
                          <div style={{ fontSize: '0.78rem', color: '#6b7280', marginTop: '0.2rem', lineHeight: 1.4 }}>{c.aSummary}</div>
                        </div>
                        {/* VS badge */}
                        <div style={{ background: gc.bg, border: `1px solid ${gc.border}40`, borderRadius: '999px', padding: '0.25rem 0.625rem', fontSize: '0.7rem', fontWeight: 800, color: gc.text, flexShrink: 0 }}>VS</div>
                        {/* Service B */}
                        <div>
                          <div style={{ fontWeight: 800, color: '#111827', fontSize: '0.95rem' }}>{c.bFull}</div>
                          <div style={{ fontSize: '0.78rem', color: '#6b7280', marginTop: '0.2rem', lineHeight: 1.4 }}>{c.bSummary}</div>
                        </div>
                        <span style={{ color: '#9ca3af', flexShrink: 0 }}>{isOpen ? '▲' : '▼'}</span>
                      </button>

                      {/* Expanded — choose A vs choose B */}
                      {isOpen && (
                        <div style={{ borderTop: `1px solid ${gc.border}20`, display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
                          {/* Choose A */}
                          <div style={{ padding: '1rem 1.25rem', borderRight: `1px solid ${gc.border}20` }}>
                            <div style={{ fontSize: '0.72rem', fontWeight: 800, color: gc.text, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.625rem' }}>
                              ✓ Choose {c.aFull}
                            </div>
                            {c.chooseA.map((item, i) => (
                              <div key={i} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.4rem', alignItems: 'flex-start' }}>
                                <span style={{ color: gc.border, flexShrink: 0, marginTop: '0.1rem', fontSize: '0.75rem' }}>▸</span>
                                <span style={{ fontSize: '0.82rem', color: '#374151', lineHeight: 1.45 }}>{item}</span>
                              </div>
                            ))}
                          </div>
                          {/* Choose B */}
                          <div style={{ padding: '1rem 1.25rem' }}>
                            <div style={{ fontSize: '0.72rem', fontWeight: 800, color: gc.text, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.625rem' }}>
                              ✓ Choose {c.bFull}
                            </div>
                            {c.chooseB.map((item, i) => (
                              <div key={i} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.4rem', alignItems: 'flex-start' }}>
                                <span style={{ color: gc.border, flexShrink: 0, marginTop: '0.1rem', fontSize: '0.75rem' }}>▸</span>
                                <span style={{ fontSize: '0.82rem', color: '#374151', lineHeight: 1.45 }}>{item}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}

        {/* Bottom CTA */}
        <div style={{ textAlign: 'center', marginTop: '1rem', padding: '2rem', background: 'linear-gradient(135deg, #0f172a, #1e3a8a)', borderRadius: '1.25rem' }}>
          <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>🎯</div>
          <h3 style={{ color: '#f1f5f9', fontWeight: 700, margin: '0 0 0.5rem' }}>Test your knowledge</h3>
          <p style={{ color: '#94a3b8', fontSize: '0.875rem', margin: '0 0 1.25rem' }}>
            These service comparisons appear in every AWS exam. Practice to lock them in.
          </p>
          <a href="/cert/saa-c03" style={{ display: 'inline-block', padding: '0.75rem 2rem', background: '#2563eb', color: '#fff', borderRadius: '0.75rem', fontWeight: 700, textDecoration: 'none', fontSize: '0.95rem' }}>
            Practice SAA-C03 →
          </a>
        </div>
      </div>
    </Layout>
  )
}
