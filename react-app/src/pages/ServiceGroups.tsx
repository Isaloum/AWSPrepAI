import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import { useAuth } from '../contexts/AuthContext'

type Domain = 'all' | 'resilient' | 'secure' | 'performance' | 'cost'

interface Service {
  name: string
  icon: string
  what: string
  when: string
  examTip: string
  vs?: string
}

interface ServiceGroup {
  id: Domain
  label: string
  color: string
  bg: string
  border: string
  description: string
  weight: string
  services: Service[]
}

const GROUPS: ServiceGroup[] = [
  {
    id: 'resilient',
    label: 'Resilient Architectures',
    color: '#0369a1',
    bg: '#f0f9ff',
    border: '#bae6fd',
    description: 'High availability, fault tolerance, and disaster recovery',
    weight: '26% of SAA exam',
    services: [
      {
        name: 'EC2',
        icon: '🖥️',
        what: 'Virtual servers in the cloud — pick OS, CPU, RAM, storage',
        when: 'You need full control over the OS, custom software, or stateful workloads',
        examTip: 'Default choice for "lift and shift" migrations',
        vs: 'vs Lambda: EC2 = always-on server. Lambda = runs only when triggered',
      },
      {
        name: 'Auto Scaling Group (ASG)',
        icon: '📈',
        what: 'Automatically adds or removes EC2 instances based on demand',
        when: 'Traffic is unpredictable or you want to cut costs during low usage',
        examTip: 'Scale-out = add instances. Scale-in = remove. Always pair with ALB',
        vs: 'vs Manual scaling: ASG reacts automatically. Manual = you change it yourself',
      },
      {
        name: 'ALB (Application Load Balancer)',
        icon: '⚖️',
        what: 'Distributes HTTP/HTTPS traffic across multiple targets (EC2, containers, Lambda)',
        when: 'You need path-based routing, host-based routing, or WebSocket support',
        examTip: 'Layer 7 (HTTP). Use for web apps. Supports sticky sessions',
        vs: 'vs NLB: ALB = Layer 7 (smart routing). NLB = Layer 4 (ultra-fast, static IP)',
      },
      {
        name: 'NLB (Network Load Balancer)',
        icon: '🔀',
        what: 'Distributes TCP/UDP traffic with ultra-low latency and static IP',
        when: 'You need static IP, extreme performance, or non-HTTP protocols',
        examTip: 'Layer 4. Use for gaming, IoT, financial trading. Preserves client IP',
        vs: 'vs ALB: NLB = faster, simpler. ALB = smarter routing for web apps',
      },
      {
        name: 'Route 53',
        icon: '🌐',
        what: 'AWS DNS service — routes users to your app globally',
        when: 'You need DNS, health checks, or traffic routing across regions',
        examTip: 'Failover routing = primary/secondary. Latency routing = closest region',
        vs: 'vs CloudFront: Route 53 routes DNS. CloudFront caches content at edge',
      },
      {
        name: 'RDS',
        icon: '🗄️',
        what: 'Managed relational database (MySQL, PostgreSQL, Oracle, SQL Server)',
        when: 'You need a traditional SQL database without managing the server',
        examTip: 'Multi-AZ = high availability (sync). Read Replica = performance (async)',
        vs: 'vs Aurora: RDS = standard SQL. Aurora = AWS-optimized, faster, more expensive',
      },
      {
        name: 'Aurora',
        icon: '⚡',
        what: 'AWS-built relational DB — MySQL/PostgreSQL compatible, 5x faster',
        when: 'You need high performance, auto-scaling storage, or global replication',
        examTip: 'Aurora Serverless = auto pause/resume. Aurora Global = multi-region',
        vs: 'vs RDS: Aurora = faster, pricier, AWS-native. RDS = standard, cheaper',
      },
      {
        name: 'ElastiCache',
        icon: '🚀',
        what: 'In-memory cache — Redis or Memcached',
        when: 'You need sub-millisecond response, session storage, or reduce DB load',
        examTip: 'Redis = persistence + pub/sub. Memcached = simple, multi-threaded cache',
        vs: 'vs DynamoDB: ElastiCache = cache (temporary). DynamoDB = database (persistent)',
      },
      {
        name: 'S3',
        icon: '🪣',
        what: 'Object storage — store any file, any size, unlimited scale',
        when: 'You need to store images, videos, backups, static websites, or data lakes',
        examTip: '99.999999999% (11 9s) durability. Use versioning + MFA delete for protection',
        vs: 'vs EBS: S3 = object storage (files). EBS = block storage (attached to EC2)',
      },
    ],
  },
  {
    id: 'secure',
    label: 'Secure Architectures',
    color: '#7c3aed',
    bg: '#faf5ff',
    border: '#ddd6fe',
    description: 'Identity, access control, encryption, and threat protection',
    weight: '30% of SAA exam',
    services: [
      {
        name: 'IAM',
        icon: '🔐',
        what: 'Controls who can do what in AWS — users, groups, roles, policies',
        when: 'Always. Every AWS action goes through IAM',
        examTip: 'Least privilege principle. Roles > long-term credentials. Never use root',
        vs: 'vs Cognito: IAM = AWS resource access. Cognito = app user authentication',
      },
      {
        name: 'IAM Roles',
        icon: '🎭',
        what: 'Temporary permissions assigned to AWS services or users',
        when: 'EC2 needs S3 access, Lambda needs DynamoDB access, cross-account access',
        examTip: 'Never store credentials on EC2. Use instance role instead',
        vs: 'vs IAM Users: Roles = temporary + no password. Users = permanent + password',
      },
      {
        name: 'KMS (Key Management Service)',
        icon: '🔑',
        what: 'Create and manage encryption keys for AWS services',
        when: 'You need to encrypt S3, EBS, RDS, or any AWS service data',
        examTip: 'AWS managed keys (free). Customer managed keys ($1/mo). CMK never leaves KMS',
        vs: 'vs Secrets Manager: KMS = encrypts data. Secrets Manager = stores secrets',
      },
      {
        name: 'Secrets Manager',
        icon: '🗝️',
        what: 'Stores and auto-rotates database passwords, API keys, tokens',
        when: 'You need to store DB credentials and rotate them automatically',
        examTip: 'Auto-rotation built in for RDS. Charges per secret per month',
        vs: 'vs SSM Parameter Store: Secrets Manager = auto-rotation + higher cost. SSM = cheaper, manual rotation',
      },
      {
        name: 'Cognito',
        icon: '👤',
        what: 'User authentication for web and mobile apps (sign up, sign in, social login)',
        when: 'You need to add user login to your app without building auth yourself',
        examTip: 'User Pool = authentication (login). Identity Pool = AWS resource access (authorization)',
        vs: 'vs IAM: Cognito = app users (millions). IAM = AWS employees/services',
      },
      {
        name: 'WAF (Web Application Firewall)',
        icon: '🛡️',
        what: 'Filters malicious HTTP traffic — SQL injection, XSS, bad IPs',
        when: 'You need to protect ALB, CloudFront, or API Gateway from web attacks',
        examTip: 'Works at Layer 7. Use with CloudFront for global protection',
        vs: 'vs Shield: WAF = blocks specific attack patterns. Shield = DDoS protection',
      },
      {
        name: 'Shield',
        icon: '🏰',
        what: 'DDoS protection — Standard (free) and Advanced (paid)',
        when: 'You need protection against volumetric DDoS attacks',
        examTip: 'Shield Standard = automatic, free. Shield Advanced = $3k/mo, 24/7 DDoS response team',
        vs: 'vs WAF: Shield = DDoS flood protection. WAF = application layer attack filtering',
      },
      {
        name: 'GuardDuty',
        icon: '👁️',
        what: 'Threat detection — monitors CloudTrail, VPC Flow Logs, DNS logs with ML',
        when: 'You want automatic threat detection without configuring anything',
        examTip: 'One-click enable. No agents. Detects: crypto mining, credential abuse, unusual API calls',
        vs: 'vs Inspector: GuardDuty = runtime threats. Inspector = vulnerability scanning',
      },
      {
        name: 'ACM (Certificate Manager)',
        icon: '📜',
        what: 'Free SSL/TLS certificates for AWS services',
        when: 'You need HTTPS on ALB, CloudFront, or API Gateway',
        examTip: 'Free for AWS services. Auto-renews. Cannot export private key',
        vs: 'vs self-managed certs: ACM = free + auto-renew. Self-managed = manual work',
      },
    ],
  },
  {
    id: 'performance',
    label: 'High-Performing Architectures',
    color: '#b45309',
    bg: '#fffbeb',
    border: '#fde68a',
    description: 'Compute, messaging, caching, and content delivery at scale',
    weight: '24% of SAA exam',
    services: [
      {
        name: 'Lambda',
        icon: '⚡',
        what: 'Run code without managing servers — triggered by events',
        when: 'Short tasks (<15 min), event-driven, unpredictable traffic, microservices',
        examTip: 'Max 15 min timeout. Max 10GB memory. Scales to thousands of concurrent executions',
        vs: 'vs EC2: Lambda = serverless, pay per ms. EC2 = always-on, pay per hour',
      },
      {
        name: 'ECS (Elastic Container Service)',
        icon: '📦',
        what: 'Run Docker containers on AWS — managed by AWS',
        when: 'You have containerized apps and want AWS to manage the cluster',
        examTip: 'EC2 launch type = you manage servers. Fargate = serverless containers',
        vs: 'vs EKS: ECS = AWS-native, simpler. EKS = Kubernetes, more control',
      },
      {
        name: 'EKS (Elastic Kubernetes Service)',
        icon: '☸️',
        what: 'Managed Kubernetes — run K8s without managing the control plane',
        when: 'You already use Kubernetes or need K8s-specific features',
        examTip: 'More complex than ECS. Choose EKS when question mentions Kubernetes',
        vs: 'vs ECS: EKS = Kubernetes standard. ECS = simpler, AWS-only',
      },
      {
        name: 'Fargate',
        icon: '🚀',
        what: 'Serverless compute for containers — no EC2 instances to manage',
        when: 'You want to run containers without managing servers',
        examTip: 'Works with both ECS and EKS. More expensive than EC2 but zero server management',
        vs: 'vs EC2 launch type: Fargate = serverless. EC2 = you manage the host',
      },
      {
        name: 'SQS (Simple Queue Service)',
        icon: '📬',
        what: 'Message queue — decouples producers from consumers',
        when: 'You need to buffer requests, handle spikes, or decouple microservices',
        examTip: 'Standard = at-least-once. FIFO = exactly-once, ordered. Max 14 day retention',
        vs: 'vs SNS: SQS = pull (consumer polls). SNS = push (fan-out to multiple subscribers)',
      },
      {
        name: 'SNS (Simple Notification Service)',
        icon: '📢',
        what: 'Pub/sub messaging — one message to many subscribers instantly',
        when: 'You need to fan-out to multiple services (email, SMS, Lambda, SQS)',
        examTip: 'SNS + SQS = fan-out pattern. One SNS topic → multiple SQS queues',
        vs: 'vs SQS: SNS = push to many. SQS = one consumer pulls from queue',
      },
      {
        name: 'Kinesis',
        icon: '🌊',
        what: 'Real-time data streaming — ingest, process, analyze streaming data',
        when: 'You need to process logs, IoT data, clickstreams in real time',
        examTip: 'Data Streams = custom processing. Firehose = load to S3/Redshift automatically',
        vs: 'vs SQS: Kinesis = ordered, replayable streams. SQS = simple queue, no replay',
      },
      {
        name: 'CloudFront',
        icon: '🌍',
        what: 'CDN — caches content at 400+ edge locations globally',
        when: 'You need to serve static assets, reduce latency, or protect origin',
        examTip: 'Origin can be S3, ALB, EC2, or any HTTP server. Use with WAF for security',
        vs: 'vs Route 53: CloudFront = caches content. Route 53 = just DNS routing',
      },
      {
        name: 'API Gateway',
        icon: '🚪',
        what: 'Create, publish, and manage REST, HTTP, and WebSocket APIs',
        when: 'You need a front door for Lambda functions or backend services',
        examTip: 'REST API = full features. HTTP API = cheaper, faster, less features',
        vs: 'vs ALB: API Gateway = API management + auth + throttling. ALB = simple load balancing',
      },
    ],
  },
  {
    id: 'cost',
    label: 'Cost-Optimized Architectures',
    color: '#166534',
    bg: '#f0fdf4',
    border: '#bbf7d0',
    description: 'Storage tiers, EC2 pricing models, and cost management tools',
    weight: '20% of SAA exam',
    services: [
      {
        name: 'EC2 Pricing Models',
        icon: '💰',
        what: 'On-Demand, Reserved, Savings Plans, Spot, Dedicated',
        when: 'Always — choosing the right model saves 70-90%',
        examTip: 'On-Demand = flexibility. Reserved = 1-3yr commitment. Spot = cheapest, can be interrupted',
        vs: 'Spot = 90% cheaper but interruptible. Reserved = 72% cheaper, committed',
      },
      {
        name: 'S3 Storage Classes',
        icon: '🪣',
        what: 'Standard, Intelligent-Tiering, Standard-IA, Glacier, Glacier Deep Archive',
        when: 'Match access frequency to storage class to minimize cost',
        examTip: 'Standard = frequent. IA = infrequent. Glacier = archive (minutes). Deep Archive = cheapest (hours)',
        vs: 'Standard = $0.023/GB. Deep Archive = $0.00099/GB — 23x cheaper',
      },
      {
        name: 'S3 Intelligent-Tiering',
        icon: '🤖',
        what: 'Auto-moves objects between access tiers based on usage patterns',
        when: 'You have unpredictable access patterns and want automatic cost savings',
        examTip: 'Small monitoring fee per object. No retrieval fees. Best for unknown access patterns',
        vs: 'vs Standard: Intelligent-Tiering = auto-optimizes. Standard = always full price',
      },
      {
        name: 'EBS Volume Types',
        icon: '💾',
        what: 'gp3, gp2, io1/io2, st1, sc1 — different performance/cost tradeoffs',
        when: 'Match workload IOPS and throughput needs to volume type',
        examTip: 'gp3 = default, best value. io2 = databases needing high IOPS. sc1 = cheapest, cold data',
        vs: 'gp3 = 20% cheaper than gp2 with better baseline performance',
      },
      {
        name: 'Trusted Advisor',
        icon: '💡',
        what: 'Checks your AWS account for cost, performance, security, and reliability issues',
        when: 'You want automated recommendations to optimize your AWS usage',
        examTip: 'Free tier: 6 core checks. Business/Enterprise: all checks + API access',
        vs: 'vs Cost Explorer: Trusted Advisor = recommendations. Cost Explorer = spending analysis',
      },
      {
        name: 'Cost Explorer',
        icon: '📊',
        what: 'Visualize and analyze your AWS spending over time',
        when: 'You need to understand where money is going and forecast future costs',
        examTip: 'Can see Reserved Instance recommendations. Forecast up to 12 months',
        vs: 'vs Budgets: Cost Explorer = analyze past. Budgets = alert on future thresholds',
      },
      {
        name: 'AWS Budgets',
        icon: '🚨',
        what: 'Set custom cost and usage budgets with alerts',
        when: 'You want to be notified before you overspend',
        examTip: 'Alert at 80% threshold before hitting limit. Can trigger Lambda or SNS',
        vs: 'vs Cost Explorer: Budgets = proactive alerts. Cost Explorer = reactive analysis',
      },
      {
        name: 'DynamoDB',
        icon: '⚡',
        what: 'Fully managed NoSQL database — single-digit millisecond at any scale',
        when: 'You need serverless, scalable key-value or document storage',
        examTip: 'On-demand mode = pay per request (unpredictable traffic). Provisioned = cheaper for steady load',
        vs: 'vs RDS: DynamoDB = NoSQL, serverless, infinite scale. RDS = SQL, fixed size',
      },
    ],
  },
]

export default function ServiceGroups() {
  const { isPremium } = useAuth()
  const navigate = useNavigate()
  const [activeDomain, setActiveDomain] = useState<Domain>('all')
  const [expandedService, setExpandedService] = useState<string | null>(null)

  if (!isPremium) {
    return (
      <Layout>
        <div style={{ minHeight: '70vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem', textAlign: 'center' }}>
          <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>🔒</div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#111827', marginBottom: '0.5rem' }}>Study Tools are for members only</h2>
          <p style={{ color: '#6b7280', maxWidth: '420px', lineHeight: 1.6, marginBottom: '1.5rem' }}>
            Upgrade to any paid plan to unlock Service Groups, CheatSheets, Study Guide, Keywords, and more.
          </p>
          <button onClick={() => navigate('/pricing')} style={{ padding: '12px 28px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 700, cursor: 'pointer', fontSize: '1rem' }}>
            See Plans →
          </button>
        </div>
      </Layout>
    )
  }

  const visibleGroups = activeDomain === 'all'
    ? GROUPS
    : GROUPS.filter(g => g.id === activeDomain)

  return (
    <Layout>
      {/* Hero */}
      <div style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 50%, #0f172a 100%)',
        padding: '3rem 1rem',
        textAlign: 'center',
        color: '#fff',
      }}>
        <div style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.12em', color: '#60a5fa', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
          SAA-C03 · SERVICE GROUPS
        </div>
        <h1 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 900, margin: '0 0 1rem', lineHeight: 1.2 }}>
          AWS Services — Side by Side
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '1rem', maxWidth: '560px', margin: '0 auto 0.75rem' }}>
          Not what each service is — but <strong style={{ color: '#fff' }}>when to use it</strong> and <strong style={{ color: '#fff' }}>how it differs</strong> from the others. Built for SAA-C03.
        </p>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(34,197,94,0.15)', border: '1px solid rgba(34,197,94,0.3)', borderRadius: '999px', padding: '4px 14px', fontSize: '0.78rem', fontWeight: 700, color: '#4ade80', marginBottom: '1rem' }}>
          ✅ Service selection patterns from 1,098 real SAA-C03 practice questions
        </div>

        {/* Domain filter tabs */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', justifyContent: 'center', marginTop: '1rem' }}>
          {[
            { id: 'all', label: 'All Domains' },
            { id: 'resilient', label: '🏗️ Resilient (26%)' },
            { id: 'secure', label: '🔐 Secure (30%)' },
            { id: 'performance', label: '⚡ Performance (24%)' },
            { id: 'cost', label: '💰 Cost (20%)' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveDomain(tab.id as Domain)}
              style={{
                padding: '0.5rem 1.1rem',
                borderRadius: '2rem',
                border: activeDomain === tab.id ? 'none' : '1px solid rgba(255,255,255,0.2)',
                background: activeDomain === tab.id ? '#2563eb' : 'rgba(255,255,255,0.08)',
                color: activeDomain === tab.id ? '#fff' : '#94a3b8',
                fontWeight: activeDomain === tab.id ? 700 : 500,
                fontSize: '0.85rem',
                cursor: 'pointer',
                transition: 'all 0.15s',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Groups */}
      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '2.5rem 1rem' }}>
        {visibleGroups.map(group => (
          <div key={group.id} style={{ marginBottom: '3rem' }}>
            {/* Group header */}
            <div style={{
              background: group.bg,
              border: `1px solid ${group.border}`,
              borderRadius: '1rem',
              padding: '1.25rem 1.5rem',
              marginBottom: '1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '0.5rem',
            }}>
              <div>
                <h2 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: group.color }}>{group.label}</h2>
                <p style={{ margin: '0.25rem 0 0', fontSize: '0.85rem', color: '#64748b' }}>{group.description}</p>
              </div>
              <span style={{
                background: group.color,
                color: '#fff',
                fontSize: '0.75rem',
                fontWeight: 700,
                padding: '0.3rem 0.75rem',
                borderRadius: '2rem',
              }}>{group.weight}</span>
            </div>

            {/* Service cards */}
            <div style={{ display: 'grid', gap: '0.75rem' }}>
              {group.services.map(service => {
                const key = `${group.id}-${service.name}`
                const isOpen = expandedService === key
                return (
                  <div
                    key={key}
                    style={{
                      background: '#fff',
                      border: `1px solid ${isOpen ? group.border : '#e2e8f0'}`,
                      borderRadius: '0.875rem',
                      overflow: 'hidden',
                      boxShadow: isOpen ? `0 4px 20px rgba(0,0,0,0.06)` : 'none',
                      transition: 'all 0.2s',
                    }}
                  >
                    {/* Card header — always visible */}
                    <button
                      onClick={() => setExpandedService(isOpen ? null : key)}
                      style={{
                        width: '100%',
                        padding: '1rem 1.25rem',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '1rem',
                        textAlign: 'left',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <span style={{ fontSize: '1.5rem' }}>{service.icon}</span>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#111827' }}>{service.name}</div>
                          <div style={{ fontSize: '0.8rem', color: '#6b7280', marginTop: '0.1rem' }}>{service.what}</div>
                        </div>
                      </div>
                      <span style={{ color: '#9ca3af', fontSize: '1.2rem', flexShrink: 0 }}>{isOpen ? '▲' : '▼'}</span>
                    </button>

                    {/* Expanded content */}
                    {isOpen && (
                      <div style={{ padding: '0 1.25rem 1.25rem', borderTop: `1px solid ${group.border}` }}>
                        <div style={{ display: 'grid', gap: '0.75rem', marginTop: '1rem' }}>
                          <div style={{ background: '#f8fafc', borderRadius: '0.6rem', padding: '0.75rem 1rem' }}>
                            <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.3rem' }}>When to use</div>
                            <div style={{ fontSize: '0.875rem', color: '#1e293b' }}>{service.when}</div>
                          </div>
                          <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '0.6rem', padding: '0.75rem 1rem' }}>
                            <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#92400e', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.3rem' }}>💡 Exam tip</div>
                            <div style={{ fontSize: '0.875rem', color: '#78350f' }}>{service.examTip}</div>
                          </div>
                          {service.vs && (
                            <div style={{ background: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: '0.6rem', padding: '0.75rem 1rem' }}>
                              <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#0369a1', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.3rem' }}>⚖️ Key comparison</div>
                              <div style={{ fontSize: '0.875rem', color: '#0c4a6e' }}>{service.vs}</div>
                            </div>
                          )}
                        </div>
                        <Link
                          to={`/certifications`}
                          style={{
                            display: 'inline-block',
                            marginTop: '1rem',
                            padding: '0.5rem 1.1rem',
                            background: group.color,
                            color: '#fff',
                            borderRadius: '0.6rem',
                            fontSize: '0.8rem',
                            fontWeight: 700,
                            textDecoration: 'none',
                          }}
                        >
                          Practice {service.name} questions →
                        </Link>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        ))}

        {/* Bottom CTA */}
        <div style={{
          background: 'linear-gradient(135deg, #0f172a, #1e3a5f)',
          borderRadius: '1.25rem',
          padding: '2rem',
          textAlign: 'center',
          color: '#fff',
          marginTop: '1rem',
        }}>
          <div style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.5rem' }}>Ready to test your knowledge?</div>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.25rem' }}>Practice real SAA-C03 scenario questions across all service domains</p>
          <Link
            to="/certifications"
            style={{
              display: 'inline-block',
              padding: '0.75rem 2rem',
              background: '#2563eb',
              color: '#fff',
              borderRadius: '0.75rem',
              fontWeight: 700,
              fontSize: '0.95rem',
              textDecoration: 'none',
            }}
          >
            Start Practicing →
          </Link>
        </div>
      </div>
    </Layout>
  )
}
