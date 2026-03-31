import { useState } from 'react'
import Layout from '../components/Layout'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

interface DiagramNode {
  id: string
  label: string
  x: number
  y: number
  color: string
  emoji?: string
}

interface DiagramEdge {
  from: string
  to: string
  label?: string
}

interface Diagram {
  id: string
  title: string
  category: string
  description: string
  keyPoints: string[]
  nodes: DiagramNode[]
  edges: DiagramEdge[]
}

const DIAGRAMS: Diagram[] = [
  // ── Resilient ──────────────────────────────────────────────────────────────
  {
    id: 'vpc-subnets',
    title: 'VPC — Public & Private Subnets',
    category: 'resilient',
    description: 'A VPC with public subnets (internet-facing) and private subnets (no direct internet access). Public subnets route through an Internet Gateway. Private subnets use a NAT Gateway to reach the internet outbound only.',
    keyPoints: [
      'Internet Gateway enables inbound internet traffic to public subnets',
      'NAT Gateway lets private instances reach the internet outbound — NOT inbound',
      'Place web/load balancer tier in public subnets, app/DB tier in private',
      'Deploy across 2+ AZs for high availability',
    ],
    nodes: [
      { id: 'igw', label: 'Internet\nGateway', x: 250, y: 30, color: '#8B5CF6' },
      { id: 'pub-a', label: 'Public\nSubnet AZ-a', x: 100, y: 120, color: '#2563eb' },
      { id: 'pub-b', label: 'Public\nSubnet AZ-b', x: 400, y: 120, color: '#2563eb' },
      { id: 'natgw', label: 'NAT\nGateway', x: 100, y: 220, color: '#8B5CF6' },
      { id: 'alb', label: 'ALB', x: 400, y: 220, color: '#8B5CF6' },
      { id: 'priv-a', label: 'Private\nSubnet AZ-a', x: 100, y: 320, color: '#6b7280' },
      { id: 'priv-b', label: 'Private\nSubnet AZ-b', x: 400, y: 320, color: '#6b7280' },
    ],
    edges: [
      { from: 'igw', to: 'pub-a' },
      { from: 'igw', to: 'pub-b' },
      { from: 'pub-a', to: 'natgw' },
      { from: 'pub-b', to: 'alb' },
      { from: 'natgw', to: 'priv-a', label: 'outbound only' },
      { from: 'alb', to: 'priv-b' },
    ],
  },
  {
    id: 'alb-asg',
    title: 'ALB + Auto Scaling Group',
    category: 'resilient',
    description: 'An Application Load Balancer distributes HTTP/HTTPS traffic across EC2 instances managed by an Auto Scaling Group. CloudWatch metrics trigger scaling policies to add or remove instances.',
    keyPoints: [
      'ALB operates at Layer 7 — routes based on URL path, headers, host',
      'ASG maintains min/max/desired instance counts automatically',
      'CloudWatch alarms trigger scale-out (CPU > 70%) or scale-in (CPU < 30%)',
      'Health checks remove unhealthy instances from the target group',
    ],
    nodes: [
      { id: 'users', label: 'Users', x: 250, y: 20, color: '#6b7280' },
      { id: 'alb', label: 'Application\nLoad Balancer', x: 250, y: 110, color: '#8B5CF6' },
      { id: 'ec2a', label: 'EC2\n(AZ-a)', x: 100, y: 220, color: '#FF9900' },
      { id: 'ec2b', label: 'EC2\n(AZ-b)', x: 250, y: 220, color: '#FF9900' },
      { id: 'ec2c', label: 'EC2\n(AZ-c)', x: 400, y: 220, color: '#FF9900' },
      { id: 'asg', label: 'Auto Scaling\nGroup', x: 250, y: 320, color: '#16a34a' },
      { id: 'cw', label: 'CloudWatch\nAlarms', x: 450, y: 320, color: '#0369A1' },
    ],
    edges: [
      { from: 'users', to: 'alb' },
      { from: 'alb', to: 'ec2a' },
      { from: 'alb', to: 'ec2b' },
      { from: 'alb', to: 'ec2c' },
      { from: 'asg', to: 'ec2a' },
      { from: 'asg', to: 'ec2b' },
      { from: 'asg', to: 'ec2c' },
      { from: 'cw', to: 'asg', label: 'scale trigger' },
    ],
  },
  {
    id: 'rds-multiaz',
    title: 'RDS Multi-AZ vs Read Replicas',
    category: 'resilient',
    description: 'RDS Multi-AZ provides synchronous standby replication for failover (high availability). Read Replicas provide asynchronous replication for scaling reads (performance). They solve different problems.',
    keyPoints: [
      'Multi-AZ: synchronous replication → zero RPO, automatic failover ~1-2 min RTO',
      'Read Replica: asynchronous replication → slight lag, used for read scaling',
      'Multi-AZ standby cannot serve reads — it is purely for failover',
      'Can have both: Multi-AZ primary + Read Replicas for reads',
    ],
    nodes: [
      { id: 'app', label: 'Application', x: 250, y: 20, color: '#6b7280' },
      { id: 'primary', label: 'RDS Primary\n(AZ-a)', x: 150, y: 130, color: '#1A73E8' },
      { id: 'standby', label: 'RDS Standby\n(AZ-b)', x: 350, y: 130, color: '#9ca3af' },
      { id: 'replica1', label: 'Read\nReplica 1', x: 50, y: 270, color: '#16a34a' },
      { id: 'replica2', label: 'Read\nReplica 2', x: 250, y: 270, color: '#16a34a' },
    ],
    edges: [
      { from: 'app', to: 'primary', label: 'writes' },
      { from: 'primary', to: 'standby', label: 'sync replication' },
      { from: 'primary', to: 'replica1', label: 'async' },
      { from: 'primary', to: 'replica2', label: 'async' },
    ],
  },
  {
    id: 's3-cloudfront',
    title: 'S3 + CloudFront CDN',
    category: 'resilient',
    description: 'Amazon CloudFront caches static content from an S3 origin at 400+ global edge locations. Users are served from the nearest edge, dramatically reducing latency worldwide.',
    keyPoints: [
      'CloudFront caches objects at edge — reduces load on S3 origin',
      'Use OAC (Origin Access Control) to prevent direct S3 access — only CloudFront can access the bucket',
      'TTL controls how long content is cached at the edge',
      'Invalidate cache manually or use versioned filenames (best practice)',
    ],
    nodes: [
      { id: 'users', label: 'Global\nUsers', x: 250, y: 20, color: '#6b7280' },
      { id: 'edge', label: 'CloudFront\nEdge Location', x: 250, y: 130, color: '#8B5CF6' },
      { id: 's3', label: 'S3 Bucket\n(Origin)', x: 250, y: 280, color: '#3F8624' },
    ],
    edges: [
      { from: 'users', to: 'edge', label: 'request' },
      { from: 'edge', to: 's3', label: 'cache miss only' },
    ],
  },
  {
    id: 'sqs-decoupled',
    title: 'SQS — Decoupled Architecture',
    category: 'resilient',
    description: 'SQS decouples producers from consumers. The queue buffers messages, allowing both sides to scale independently. A Dead Letter Queue captures failed messages after max retry attempts.',
    keyPoints: [
      'Standard Queue: at-least-once delivery, best-effort ordering',
      'FIFO Queue: exactly-once delivery, strict ordering (3,000 msg/s)',
      'DLQ: captures messages that fail processing after max retries',
      'Visibility Timeout: hides a message from other consumers while being processed',
    ],
    nodes: [
      { id: 'producer', label: 'Producer\n(EC2/Lambda)', x: 80, y: 160, color: '#FF9900' },
      { id: 'sqs', label: 'SQS Queue', x: 280, y: 160, color: '#EA580C' },
      { id: 'consumer', label: 'Consumer\n(EC2/Lambda)', x: 460, y: 160, color: '#FF9900' },
      { id: 'dlq', label: 'Dead Letter\nQueue', x: 280, y: 300, color: '#dc2626' },
    ],
    edges: [
      { from: 'producer', to: 'sqs', label: 'send' },
      { from: 'sqs', to: 'consumer', label: 'poll' },
      { from: 'sqs', to: 'dlq', label: 'max retries' },
    ],
  },
  {
    id: 'disaster-recovery',
    title: 'Disaster Recovery — RTO/RPO Strategies',
    category: 'resilient',
    description: 'Four DR strategies ranked from lowest cost/slowest recovery to highest cost/fastest recovery: Backup & Restore → Pilot Light → Warm Standby → Multi-Site Active-Active.',
    keyPoints: [
      'Backup & Restore: cheapest. Restore from S3/snapshots. Hours of RTO/RPO.',
      'Pilot Light: minimal core (DB) always running. Scale up on failover. 10s of minutes.',
      'Warm Standby: scaled-down full environment always on. Minutes to fail over.',
      'Multi-Site Active-Active: full production in both regions. Near-zero RTO/RPO. Most expensive.',
    ],
    nodes: [
      { id: 'br', label: 'Backup &\nRestore', x: 80, y: 160, color: '#9ca3af' },
      { id: 'pl', label: 'Pilot\nLight', x: 210, y: 160, color: '#6b7280' },
      { id: 'ws', label: 'Warm\nStandby', x: 350, y: 160, color: '#2563eb' },
      { id: 'aa', label: 'Active-\nActive', x: 470, y: 160, color: '#16a34a' },
      { id: 'cost', label: 'Cost →', x: 250, y: 300, color: '#dc2626' },
      { id: 'speed', label: '← Recovery Speed', x: 250, y: 60, color: '#16a34a' },
    ],
    edges: [
      { from: 'br', to: 'pl' },
      { from: 'pl', to: 'ws' },
      { from: 'ws', to: 'aa' },
    ],
  },

  // ── Secure ────────────────────────────────────────────────────────────────
  {
    id: 'iam-roles',
    title: 'IAM — Users, Roles & Policies',
    category: 'secure',
    description: 'IAM manages who (authentication) can do what (authorization) in AWS. Users are for humans. Roles are for services and cross-account access. Policies define permissions.',
    keyPoints: [
      'IAM Users: long-term credentials (access keys + password). Use for humans.',
      'IAM Roles: temporary credentials. Use for EC2, Lambda, cross-account access.',
      'Policies: JSON documents defining Allow/Deny on Actions and Resources',
      'Least privilege: grant only the minimum permissions required',
    ],
    nodes: [
      { id: 'user', label: 'IAM User\n(human)', x: 80, y: 150, color: '#dc2626' },
      { id: 'role', label: 'IAM Role\n(service)', x: 280, y: 150, color: '#dc2626' },
      { id: 'policy', label: 'IAM\nPolicy', x: 180, y: 280, color: '#6b7280' },
      { id: 'aws', label: 'AWS\nServices', x: 420, y: 150, color: '#FF9900' },
    ],
    edges: [
      { from: 'user', to: 'policy', label: 'attached to' },
      { from: 'role', to: 'policy', label: 'attached to' },
      { from: 'role', to: 'aws', label: 'assumes →\ncan access' },
    ],
  },
  {
    id: 'sg-nacl',
    title: 'Security Groups vs NACLs',
    category: 'secure',
    description: 'Security Groups are stateful instance-level firewalls (return traffic automatically allowed). NACLs are stateless subnet-level firewalls (return traffic must be explicitly allowed).',
    keyPoints: [
      'Security Group: stateful, instance-level, allow rules only, evaluated as a whole',
      'NACL: stateless, subnet-level, allow AND deny rules, evaluated in rule number order',
      'Return traffic: SG auto-allows it. NACL requires explicit allow for both directions.',
      'Best practice: use SGs for fine-grained control, NACLs for subnet-wide blocks',
    ],
    nodes: [
      { id: 'internet', label: 'Internet', x: 250, y: 20, color: '#6b7280' },
      { id: 'nacl', label: 'NACL\n(Subnet level)', x: 250, y: 130, color: '#7c3aed' },
      { id: 'sg', label: 'Security Group\n(Instance level)', x: 250, y: 240, color: '#dc2626' },
      { id: 'ec2', label: 'EC2\nInstance', x: 250, y: 340, color: '#FF9900' },
    ],
    edges: [
      { from: 'internet', to: 'nacl', label: 'subnet traffic' },
      { from: 'nacl', to: 'sg', label: 'allowed traffic' },
      { from: 'sg', to: 'ec2', label: 'instance traffic' },
    ],
  },
  {
    id: 'waf-shield',
    title: 'WAF + Shield + CloudFront — DDoS Protection',
    category: 'secure',
    description: 'AWS WAF filters malicious HTTP traffic (SQL injection, XSS). AWS Shield protects against DDoS. CloudFront absorbs traffic at the edge before it reaches your origin.',
    keyPoints: [
      'WAF: filters L7 HTTP/HTTPS (SQL injection, XSS, rate limiting). Deploy on ALB, CloudFront, API GW.',
      'Shield Standard: free, automatically protects against common L3/L4 DDoS',
      'Shield Advanced: paid, 24/7 DRT team, L7 DDoS detection, cost protection',
      'CloudFront absorbs volumetric DDoS at edge — protects origin',
    ],
    nodes: [
      { id: 'attacker', label: 'DDoS\nAttacker', x: 80, y: 150, color: '#dc2626' },
      { id: 'users', label: 'Legitimate\nUsers', x: 80, y: 280, color: '#16a34a' },
      { id: 'shield', label: 'Shield\nAdvanced', x: 250, y: 150, color: '#7c3aed' },
      { id: 'cf', label: 'CloudFront\n+ WAF', x: 380, y: 200, color: '#8B5CF6' },
      { id: 'origin', label: 'Origin\n(ALB/EC2)', x: 500, y: 200, color: '#FF9900' },
    ],
    edges: [
      { from: 'attacker', to: 'shield', label: 'blocked' },
      { from: 'users', to: 'cf', label: 'allowed' },
      { from: 'shield', to: 'cf' },
      { from: 'cf', to: 'origin', label: 'clean traffic' },
    ],
  },

  // ── High-Performance ──────────────────────────────────────────────────────
  {
    id: 'elasticache',
    title: 'ElastiCache — Caching Layer',
    category: 'performance',
    description: 'ElastiCache (Redis or Memcached) sits between the application and the database. Frequently accessed data is cached in memory, reducing database load and response time.',
    keyPoints: [
      'Cache hit: app reads from ElastiCache (microseconds). No DB query.',
      'Cache miss: app queries DB, then writes result to cache for next time.',
      'Redis: supports persistence, pub/sub, sorted sets, multi-AZ with failover.',
      'Memcached: simple, multi-threaded, no persistence. Good for simple caching.',
    ],
    nodes: [
      { id: 'app', label: 'Application', x: 250, y: 20, color: '#6b7280' },
      { id: 'cache', label: 'ElastiCache\n(Redis)', x: 120, y: 160, color: '#dc2626' },
      { id: 'rds', label: 'RDS\nDatabase', x: 380, y: 160, color: '#1A73E8' },
    ],
    edges: [
      { from: 'app', to: 'cache', label: '1. check cache' },
      { from: 'cache', to: 'app', label: 'hit: return' },
      { from: 'app', to: 'rds', label: 'miss: query DB' },
      { from: 'rds', to: 'cache', label: 'write to cache' },
    ],
  },
  {
    id: 'serverless-api',
    title: 'Serverless — Lambda + API Gateway',
    category: 'performance',
    description: 'A fully serverless REST API. API Gateway handles HTTP routing and auth. Lambda executes business logic. DynamoDB stores data. No servers to manage.',
    keyPoints: [
      'API Gateway: rate limiting, auth (Cognito/Lambda Authorizer), request transformation',
      'Lambda: max 15 min runtime, up to 10GB RAM, scales automatically to thousands of concurrent executions',
      'DynamoDB: NoSQL, single-digit ms latency at any scale, serverless',
      'Entire stack scales to zero — pay only for what you use',
    ],
    nodes: [
      { id: 'client', label: 'Client\n(Browser/App)', x: 250, y: 20, color: '#6b7280' },
      { id: 'apigw', label: 'API Gateway', x: 250, y: 120, color: '#8B5CF6' },
      { id: 'lambda', label: 'Lambda\nFunction', x: 250, y: 230, color: '#FF9900' },
      { id: 'dynamo', label: 'DynamoDB', x: 150, y: 340, color: '#1A73E8' },
      { id: 's3', label: 'S3\n(files)', x: 350, y: 340, color: '#3F8624' },
    ],
    edges: [
      { from: 'client', to: 'apigw', label: 'HTTPS' },
      { from: 'apigw', to: 'lambda', label: 'invoke' },
      { from: 'lambda', to: 'dynamo', label: 'read/write' },
      { from: 'lambda', to: 's3', label: 'store files' },
    ],
  },
  {
    id: 'sns-fanout',
    title: 'SNS Fan-Out Pattern',
    category: 'performance',
    description: 'SNS publishes a single message to multiple SQS queues simultaneously. Each consumer service processes messages from its own queue independently — enabling loose coupling and parallel processing.',
    keyPoints: [
      'Fan-out: one SNS publish → delivered to ALL subscribed SQS queues simultaneously',
      'Each SQS queue gives each consumer service its own independent processing lane',
      'Decoupled: producer does not know or care about consumers',
      'Use for: order events processed by multiple services (inventory, shipping, email)',
    ],
    nodes: [
      { id: 'producer', label: 'Producer', x: 250, y: 20, color: '#6b7280' },
      { id: 'sns', label: 'SNS Topic', x: 250, y: 130, color: '#EA580C' },
      { id: 'sqs1', label: 'SQS Queue\n(Service A)', x: 80, y: 260, color: '#EA580C' },
      { id: 'sqs2', label: 'SQS Queue\n(Service B)', x: 250, y: 260, color: '#EA580C' },
      { id: 'sqs3', label: 'SQS Queue\n(Service C)', x: 420, y: 260, color: '#EA580C' },
      { id: 'svcA', label: 'Lambda A', x: 80, y: 370, color: '#FF9900' },
      { id: 'svcB', label: 'Lambda B', x: 250, y: 370, color: '#FF9900' },
      { id: 'svcC', label: 'Lambda C', x: 420, y: 370, color: '#FF9900' },
    ],
    edges: [
      { from: 'producer', to: 'sns' },
      { from: 'sns', to: 'sqs1' },
      { from: 'sns', to: 'sqs2' },
      { from: 'sns', to: 'sqs3' },
      { from: 'sqs1', to: 'svcA' },
      { from: 'sqs2', to: 'svcB' },
      { from: 'sqs3', to: 'svcC' },
    ],
  },

  // ── Cost Optimized ────────────────────────────────────────────────────────
  {
    id: 's3-lifecycle',
    title: 'S3 Storage Classes — Lifecycle Policy',
    category: 'cost',
    description: 'S3 Lifecycle policies automatically transition objects between storage classes based on age. This optimizes cost by using cheaper storage for older, less-accessed data.',
    keyPoints: [
      'S3 Standard: frequent access. Most expensive. Millisecond retrieval.',
      'S3 Standard-IA: infrequent access. ~46% cheaper. Retrieval fee applies.',
      'S3 Glacier Instant Retrieval: archive, ms retrieval. Good for quarterly access.',
      'S3 Glacier Deep Archive: cheapest. 12-48 hr retrieval. For compliance archives.',
    ],
    nodes: [
      { id: 'std', label: 'S3 Standard\n(0-30 days)', x: 80, y: 150, color: '#1A73E8' },
      { id: 'ia', label: 'S3 Standard-IA\n(30-90 days)', x: 230, y: 150, color: '#16a34a' },
      { id: 'glacier', label: 'S3 Glacier\n(90-365 days)', x: 380, y: 150, color: '#6b7280' },
      { id: 'deep', label: 'Glacier\nDeep Archive\n(365+ days)', x: 490, y: 150, color: '#374151' },
    ],
    edges: [
      { from: 'std', to: 'ia', label: '30 days' },
      { from: 'ia', to: 'glacier', label: '90 days' },
      { from: 'glacier', to: 'deep', label: '365 days' },
    ],
  },
  {
    id: 'ec2-pricing',
    title: 'EC2 Pricing Models',
    category: 'cost',
    description: 'AWS offers multiple EC2 pricing models. The right choice depends on workload predictability, duration, and fault tolerance. Mixing models is the optimal strategy.',
    keyPoints: [
      'On-Demand: pay per second. No commitment. Most expensive. Best for unpredictable short-term.',
      'Reserved (1 or 3 yr): up to 72% off. Best for steady, predictable 24/7 workloads.',
      'Spot: up to 90% off. Can be interrupted with 2-min notice. Best for batch/fault-tolerant.',
      'Savings Plans: like Reserved but more flexible — commit to $/hr spend, not specific instance type.',
    ],
    nodes: [
      { id: 'od', label: 'On-Demand\n(baseline)', x: 80, y: 160, color: '#6b7280' },
      { id: 'sp', label: 'Savings Plans\n(-up to 66%)', x: 210, y: 160, color: '#2563eb' },
      { id: 'ri', label: 'Reserved\n(-up to 72%)', x: 350, y: 160, color: '#16a34a' },
      { id: 'spot', label: 'Spot\n(-up to 90%)', x: 470, y: 160, color: '#EA580C' },
    ],
    edges: [],
  },
]

const CATEGORIES = [
  { id: 'all', label: 'All Domains' },
  { id: 'resilient', label: 'Resilient' },
  { id: 'secure', label: 'Secure' },
  { id: 'performance', label: 'High-Performance' },
  { id: 'cost', label: 'Cost-Optimized' },
]

const CAT_COLORS: Record<string, string> = {
  resilient: '#2563eb',
  secure: '#dc2626',
  performance: '#7c3aed',
  cost: '#16a34a',
}

function DiagramSVG({ nodes, edges }: { nodes: DiagramNode[]; edges: DiagramEdge[] }) {
  const width = 560
  const height = 420

  return (
    <svg
      width={width} height={height}
      viewBox={`0 0 ${width} ${height}`}
      style={{ width: '100%', height: 'auto', maxHeight: '360px', display: 'block' }}
    >
      <defs>
        <marker id="arr" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
          <path d="M0,0 L0,6 L8,3 z" fill="#94a3b8" />
        </marker>
      </defs>

      {/* Edges */}
      {edges.map((e, i) => {
        const from = nodes.find(n => n.id === e.from)
        const to = nodes.find(n => n.id === e.to)
        if (!from || !to) return null
        const mx = (from.x + to.x) / 2
        const my = (from.y + to.y) / 2
        return (
          <g key={i}>
            <line
              x1={from.x} y1={from.y + 20}
              x2={to.x} y2={to.y - 20}
              stroke="#cbd5e1" strokeWidth="1.5"
              markerEnd="url(#arr)"
            />
            {e.label && (
              <text x={mx + 4} y={my} fontSize="9" fill="#94a3b8" textAnchor="middle">{e.label}</text>
            )}
          </g>
        )
      })}

      {/* Nodes */}
      {nodes.map(n => {
        const lines = n.label.split('\n')
        const h = lines.length > 1 ? 48 : 34
        return (
          <g key={n.id}>
            <rect
              x={n.x - 58} y={n.y - h / 2}
              width="116" height={h} rx="10"
              fill={`${n.color}15`} stroke={n.color} strokeWidth="1.5"
            />
            {lines.map((line, li) => (
              <text
                key={li}
                x={n.x}
                y={n.y + (li - (lines.length - 1) / 2) * 14 + 1}
                textAnchor="middle" fontSize="11"
                fill={n.color} fontWeight="600"
              >
                {line}
              </text>
            ))}
          </g>
        )
      })}
    </svg>
  )
}

export default function Diagrams() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const tier = (user as any)?.user_metadata?.tier
  const isPremium = tier === 'monthly' || tier === 'yearly' || tier === 'lifetime'

  const [category, setCategory] = useState('all')
  const [selected, setSelected] = useState<string | null>(null)

  // Paywall
  if (!isPremium) {
    return (
      <Layout>
        <div style={{ background: '#f8fafc', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
          <div style={{ background: '#fff', borderRadius: '20px', padding: '48px', maxWidth: '480px', width: '100%', textAlign: 'center', boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '16px' }}>🗺️</div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', margin: '0 0 8px' }}>Architecture Diagrams requires a subscription</h2>
            <p style={{ color: '#64748b', marginBottom: '8px' }}>14 interactive SAA-C03 architecture diagrams with visual explanations and key exam points.</p>
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

  const filtered = category === 'all' ? DIAGRAMS : DIAGRAMS.filter(d => d.category === category)
  const activeDiagram = selected ? DIAGRAMS.find(d => d.id === selected) : null

  return (
    <Layout>
      <div style={{ background: '#f8fafc', minHeight: '100vh', padding: '40px 20px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>

          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <div style={{ display: 'inline-block', background: '#f0f9ff', color: '#0369a1', padding: '4px 14px', borderRadius: '999px', fontSize: '0.8rem', fontWeight: 700, marginBottom: '10px', letterSpacing: '0.05em' }}>
              ARCHITECTURE DIAGRAMS · SAA-C03
            </div>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a', margin: '0 0 6px' }}>AWS Architecture Diagrams</h1>
            <p style={{ color: '#64748b', margin: 0 }}>{DIAGRAMS.length} diagrams · Visual explanations · Key exam points</p>
          </div>

          {/* Filters */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '28px', justifyContent: 'center' }}>
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => { setCategory(cat.id); setSelected(null) }}
                style={{
                  padding: '6px 16px', borderRadius: '999px', fontSize: '0.85rem', fontWeight: 600,
                  border: '1px solid', cursor: 'pointer',
                  background: category === cat.id ? '#0369a1' : '#fff',
                  color: category === cat.id ? '#fff' : '#475569',
                  borderColor: category === cat.id ? '#0369a1' : '#e2e8f0',
                }}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Detail view */}
          {activeDiagram && (
            <div style={{ background: '#fff', borderRadius: '20px', padding: '32px', marginBottom: '28px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                  <span style={{ background: `${CAT_COLORS[activeDiagram.category] || '#6b7280'}15`, color: CAT_COLORS[activeDiagram.category] || '#6b7280', padding: '3px 12px', borderRadius: '999px', fontSize: '0.78rem', fontWeight: 700, marginRight: '8px', textTransform: 'uppercase' }}>
                    {activeDiagram.category}
                  </span>
                  <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0f172a', margin: '8px 0 0' }}>{activeDiagram.title}</h2>
                </div>
                <button onClick={() => setSelected(null)} style={{ padding: '6px 14px', borderRadius: '8px', border: '1px solid #e2e8f0', background: '#f8fafc', color: '#64748b', fontWeight: 600, cursor: 'pointer', fontSize: '0.85rem' }}>
                  ← Back
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                {/* SVG */}
                <div style={{ background: '#f8fafc', borderRadius: '12px', padding: '20px', border: '1px solid #e2e8f0' }}>
                  <DiagramSVG nodes={activeDiagram.nodes} edges={activeDiagram.edges} />
                </div>

                {/* Info */}
                <div>
                  <p style={{ color: '#475569', lineHeight: '1.7', fontSize: '0.93rem', marginBottom: '20px' }}>{activeDiagram.description}</p>
                  <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '10px' }}>
                    Key Exam Points
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {activeDiagram.keyPoints.map((point, i) => (
                      <div key={i} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                        <span style={{ color: '#2563eb', fontWeight: 700, flexShrink: 0, marginTop: '2px' }}>→</span>
                        <span style={{ color: '#374151', fontSize: '0.88rem', lineHeight: '1.5' }}>{point}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Grid */}
          {!activeDiagram && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
              {filtered.map(d => {
                const color = CAT_COLORS[d.category] || '#6b7280'
                return (
                  <div
                    key={d.id}
                    onClick={() => setSelected(d.id)}
                    style={{
                      background: '#fff', borderRadius: '14px', padding: '20px',
                      border: '1px solid #e5e7eb', cursor: 'pointer',
                      transition: 'all 0.15s', boxShadow: '0 1px 6px rgba(0,0,0,0.04)'
                    }}
                    onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.1)')}
                    onMouseLeave={e => (e.currentTarget.style.boxShadow = '0 1px 6px rgba(0,0,0,0.04)')}
                  >
                    <span style={{ background: `${color}15`, color, padding: '2px 10px', borderRadius: '999px', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      {d.category}
                    </span>
                    <h3 style={{ fontSize: '0.98rem', fontWeight: 700, color: '#1e293b', margin: '10px 0 6px' }}>{d.title}</h3>
                    <p style={{ color: '#64748b', fontSize: '0.82rem', margin: '0 0 12px', lineHeight: '1.5' }}>
                      {d.description.slice(0, 100)}...
                    </p>
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                      {d.nodes.slice(0, 3).map(n => (
                        <span key={n.id} style={{ background: '#f1f5f9', color: '#475569', padding: '2px 8px', borderRadius: '6px', fontSize: '0.72rem', fontWeight: 600 }}>
                          {n.label.split('\n')[0]}
                        </span>
                      ))}
                      {d.nodes.length > 3 && <span style={{ background: '#f1f5f9', color: '#94a3b8', padding: '2px 8px', borderRadius: '6px', fontSize: '0.72rem' }}>+{d.nodes.length - 3} more</span>}
                    </div>
                    <div style={{ marginTop: '12px', color: color, fontSize: '0.82rem', fontWeight: 600 }}>View diagram →</div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}
