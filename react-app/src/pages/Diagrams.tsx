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
  dashed?: boolean
  labelFlip?: boolean
  color?: string
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
      { id: 'igw',    label: 'Internet\nGateway',      x: 310, y: 60,  color: '#8B5CF6' },
      { id: 'pub-a',  label: 'Public\nSubnet AZ-a',    x: 150, y: 190, color: '#2563eb' },
      { id: 'pub-b',  label: 'Public\nSubnet AZ-b',    x: 470, y: 190, color: '#2563eb' },
      { id: 'natgw',  label: 'NAT\nGateway',           x: 150, y: 320, color: '#8B5CF6' },
      { id: 'alb',    label: 'ALB',                    x: 470, y: 320, color: '#8B5CF6' },
      { id: 'priv-a', label: 'Private\nSubnet AZ-a',   x: 150, y: 440, color: '#475569' },
      { id: 'priv-b', label: 'Private\nSubnet AZ-b',   x: 470, y: 440, color: '#475569' },
    ],
    edges: [
      { from: 'igw',   to: 'pub-a' },
      { from: 'igw',   to: 'pub-b' },
      { from: 'pub-a', to: 'natgw' },
      { from: 'pub-b', to: 'alb' },
      { from: 'natgw', to: 'priv-a', label: 'outbound only' },
      { from: 'alb',   to: 'priv-b' },
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
      { id: 'users', label: 'Users',                    x: 310, y: 50,  color: '#475569' },
      { id: 'alb',   label: 'Application\nLoad Balancer', x: 310, y: 180, color: '#8B5CF6' },
      { id: 'ec2a',  label: 'EC2\n(AZ-a)',              x: 110, y: 330, color: '#FF9900' },
      { id: 'ec2b',  label: 'EC2\n(AZ-b)',              x: 310, y: 330, color: '#FF9900' },
      { id: 'ec2c',  label: 'EC2\n(AZ-c)',              x: 510, y: 330, color: '#FF9900' },
      { id: 'asg',   label: 'Auto Scaling\nGroup',      x: 310, y: 470, color: '#16a34a' },
      { id: 'cw',    label: 'CloudWatch\nAlarms',       x: 530, y: 470, color: '#0369A1' },
    ],
    edges: [
      { from: 'users', to: 'alb' },
      { from: 'alb',   to: 'ec2a' },
      { from: 'alb',   to: 'ec2b' },
      { from: 'alb',   to: 'ec2c' },
      { from: 'asg',   to: 'ec2a' },
      { from: 'asg',   to: 'ec2b' },
      { from: 'asg',   to: 'ec2c' },
      { from: 'cw',    to: 'asg',  label: 'scale trigger', labelFlip: true },
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
      { id: 'app',      label: 'Application',         x: 240, y: 60,  color: '#475569' },
      { id: 'primary',  label: 'RDS Primary\n(AZ-a)', x: 240, y: 200, color: '#1A73E8' },
      { id: 'standby',  label: 'RDS Standby\n(AZ-b)', x: 500, y: 200, color: '#9ca3af' },
      { id: 'replica1', label: 'Read\nReplica 1',     x: 110, y: 370, color: '#16a34a' },
      { id: 'replica2', label: 'Read\nReplica 2',     x: 370, y: 370, color: '#16a34a' },
    ],
    edges: [
      { from: 'app',     to: 'primary',  label: 'writes' },
      { from: 'primary', to: 'standby',  label: 'sync replication' },
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
      { id: 'users', label: 'Global\nUsers',           x: 310, y: 60,  color: '#475569' },
      { id: 'edge',  label: 'CloudFront\nEdge Location', x: 310, y: 210, color: '#8B5CF6' },
      { id: 's3',    label: 'S3 Bucket\n(Origin)',     x: 310, y: 380, color: '#3F8624' },
    ],
    edges: [
      { from: 'users', to: 'edge', label: 'request' },
      { from: 'edge',  to: 's3',   label: 'cache miss only' },
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
      { id: 'producer',  label: 'Producer\n(EC2/Lambda)', x: 90,  y: 180, color: '#FF9900' },
      { id: 'sqs',       label: 'SQS Queue',              x: 310, y: 180, color: '#EA580C' },
      { id: 'consumer',  label: 'Consumer\n(EC2/Lambda)', x: 530, y: 180, color: '#FF9900' },
      { id: 'dlq',       label: 'Dead Letter\nQueue',     x: 310, y: 350, color: '#dc2626' },
    ],
    edges: [
      { from: 'producer', to: 'sqs',      label: 'send' },
      { from: 'sqs',      to: 'consumer', label: 'poll' },
      { from: 'sqs',      to: 'dlq',      label: 'max retries' },
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
      { id: 'speed', label: 'Recovery\nSpeed ↑', x: 90,  y: 60,  color: '#16a34a' },
      { id: 'br',    label: 'Backup &\nRestore', x: 90,  y: 220, color: '#9ca3af' },
      { id: 'pl',    label: 'Pilot\nLight',      x: 280, y: 220, color: '#475569' },
      { id: 'ws',    label: 'Warm\nStandby',     x: 470, y: 220, color: '#2563eb' },
      { id: 'aa',    label: 'Active-\nActive',   x: 660, y: 220, color: '#16a34a' },
      { id: 'cost',  label: 'Cost ↑',            x: 660, y: 60,  color: '#dc2626' },
    ],
    edges: [
      { from: 'speed', to: 'br' },
      { from: 'br',    to: 'pl' },
      { from: 'pl',    to: 'ws' },
      { from: 'ws',    to: 'aa' },
      { from: 'cost',  to: 'aa' },
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
      { id: 'policy', label: 'IAM\nPolicy',         x: 310, y: 80,  color: '#475569' },
      { id: 'user',   label: 'IAM User\n(human)',   x: 120, y: 260, color: '#dc2626' },
      { id: 'role',   label: 'IAM Role\n(service)', x: 310, y: 260, color: '#dc2626' },
      { id: 'aws',    label: 'AWS\nServices',       x: 500, y: 260, color: '#FF9900' },
    ],
    edges: [
      { from: 'user', to: 'policy' },
      { from: 'role', to: 'policy' },
      { from: 'role', to: 'aws', label: 'assumes' },
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
      { id: 'internet', label: 'Internet',                  x: 310, y: 60,  color: '#475569' },
      { id: 'nacl',     label: 'NACL\n(Subnet level)',      x: 310, y: 200, color: '#7c3aed' },
      { id: 'sg',       label: 'Security Group\n(Instance)', x: 310, y: 350, color: '#dc2626' },
      { id: 'ec2',      label: 'EC2\nInstance',             x: 310, y: 490, color: '#FF9900' },
    ],
    edges: [
      { from: 'internet', to: 'nacl', label: 'subnet traffic' },
      { from: 'nacl',     to: 'sg',   label: 'allowed traffic' },
      { from: 'sg',       to: 'ec2',  label: 'instance traffic' },
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
      { id: 'attacker', label: 'DDoS\nAttacker',    x: 120, y: 100, color: '#dc2626' },
      { id: 'shield',   label: 'Shield\nAdvanced',  x: 400, y: 100, color: '#7c3aed' },
      { id: 'users',    label: 'Legitimate\nUsers', x: 120, y: 270, color: '#16a34a' },
      { id: 'cf',       label: 'CloudFront\n+ WAF', x: 400, y: 270, color: '#8B5CF6' },
      { id: 'origin',   label: 'Origin\n(ALB/EC2)', x: 640, y: 270, color: '#FF9900' },
    ],
    edges: [
      { from: 'attacker', to: 'shield', label: 'blocked' },
      { from: 'shield',   to: 'cf' },
      { from: 'users',    to: 'cf',     label: 'allowed' },
      { from: 'cf',       to: 'origin', label: 'clean traffic' },
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
      { id: 'app',   label: 'Application',          x: 150, y: 90,  color: '#475569' },
      { id: 'cache', label: 'ElastiCache\n(Redis)', x: 450, y: 90,  color: '#dc2626' },
      { id: 'rds',   label: 'RDS\nDatabase',        x: 150, y: 290, color: '#1A73E8' },
    ],
    edges: [
      { from: 'app',   to: 'cache', label: 'check cache', color: '#dc2626' },
      { from: 'cache', to: 'app',   label: 'hit: return' },
      { from: 'app',   to: 'rds',   label: 'miss: query DB', labelFlip: true },
      { from: 'rds',   to: 'cache', label: 'write to cache', labelFlip: true },
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
      { id: 'client', label: 'Client\n(Browser/App)', x: 310, y: 60,  color: '#475569' },
      { id: 'apigw',  label: 'API Gateway',           x: 310, y: 190, color: '#8B5CF6' },
      { id: 'lambda', label: 'Lambda\nFunction',      x: 310, y: 320, color: '#FF9900' },
      { id: 'dynamo', label: 'DynamoDB\n(NoSQL)',      x: 140, y: 470, color: '#1A73E8' },
      { id: 's3',     label: 'S3\n(files)',            x: 480, y: 470, color: '#3F8624' },
    ],
    edges: [
      { from: 'client', to: 'apigw',  label: 'HTTPS' },
      { from: 'apigw',  to: 'lambda', label: 'invoke' },
      { from: 'lambda', to: 'dynamo', label: 'read/write',  labelFlip: true },
      { from: 'lambda', to: 's3',     label: 'store files', labelFlip: true },
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
      { id: 'producer', label: 'Producer',             x: 310, y: 50,  color: '#475569' },
      { id: 'sns',      label: 'SNS Topic',            x: 310, y: 170, color: '#EA580C' },
      { id: 'sqs1',     label: 'SQS Queue\n(Service A)', x: 100, y: 320, color: '#EA580C' },
      { id: 'sqs2',     label: 'SQS Queue\n(Service B)', x: 310, y: 320, color: '#EA580C' },
      { id: 'sqs3',     label: 'SQS Queue\n(Service C)', x: 520, y: 320, color: '#EA580C' },
      { id: 'svcA',     label: 'Lambda A',              x: 100, y: 450, color: '#FF9900' },
      { id: 'svcB',     label: 'Lambda B',              x: 310, y: 450, color: '#FF9900' },
      { id: 'svcC',     label: 'Lambda C',              x: 520, y: 450, color: '#FF9900' },
    ],
    edges: [
      { from: 'producer', to: 'sns' },
      { from: 'sns',  to: 'sqs1' },
      { from: 'sns',  to: 'sqs2' },
      { from: 'sns',  to: 'sqs3' },
      { from: 'sqs1', to: 'svcA' },
      { from: 'sqs2', to: 'svcB' },
      { from: 'sqs3', to: 'svcC' },
    ],
  },

  // ── Cost Optimized ────────────────────────────────────────────────────────
  {
    id: 's3-lifecycle',
    title: 'S3 Storage Classes — All 7 Tiers',
    category: 'cost',
    description: 'AWS S3 has 7 storage classes. Lifecycle policies transition objects automatically based on age — moving from expensive fast-access tiers to cheap archive tiers over time.',
    keyPoints: [
      'S3 Standard: frequent access, ms retrieval. Most expensive.',
      'Intelligent-Tiering: auto-moves objects between tiers based on access patterns. No retrieval fee.',
      'Standard-IA / One Zone-IA: infrequent access. Retrieval fee applies. One Zone = single AZ, cheaper.',
      'Glacier Instant: archive with ms retrieval. Glacier Flexible: minutes–hours. Deep Archive: 12–48 hrs, cheapest.',
    ],
    nodes: [
      { id: 'std',      label: 'S3 Standard\n0+ days',             x: 310, y: 70,  color: '#1A73E8' },
      { id: 'int-tier', label: 'Intelligent\nTiering',             x: 90,  y: 240, color: '#0891b2' },
      { id: 'std-ia',   label: 'S3 Standard-IA\nafter 30 days',    x: 310, y: 240, color: '#16a34a' },
      { id: 'one-zone', label: 'One Zone-IA\nSingle AZ',           x: 540, y: 240, color: '#ca8a04' },
      { id: 'gl-inst',  label: 'Glacier Instant\nafter 90 days',   x: 310, y: 420, color: '#7C3AED' },
      { id: 'gl-flex',  label: 'Glacier Flexible\nafter 180 days', x: 310, y: 590, color: '#475569' },
      { id: 'deep',     label: 'Glacier Deep\nArchive\n365+ days', x: 310, y: 770, color: '#374151' },
    ],
    edges: [
      { from: 'std',     to: 'std-ia' },
      { from: 'std',     to: 'int-tier', label: 'auto-tier', dashed: true },
      { from: 'std-ia',  to: 'gl-inst' },
      { from: 'std-ia',  to: 'one-zone', label: 'single AZ', dashed: true },
      { from: 'gl-inst', to: 'gl-flex' },
      { from: 'gl-flex', to: 'deep' },
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
      { id: 'od',   label: 'On-Demand\n(baseline)',     x: 90,  y: 180, color: '#475569' },
      { id: 'sp',   label: 'Savings Plans\n(-66%)',      x: 290, y: 180, color: '#2563eb' },
      { id: 'ri',   label: 'Reserved\n(-72%)',           x: 490, y: 180, color: '#16a34a' },
      { id: 'spot', label: 'Spot\n(-90%)',               x: 690, y: 180, color: '#EA580C' },
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
  const NW = 140 // node width

  // Node height based on line count
  const NH = (n: DiagramNode) => {
    const lines = n.label.split('\n').length
    return lines >= 3 ? 68 : lines === 2 ? 54 : 40
  }

  // Gradient: lighter top to base color bottom
  const lighten = (hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16)
    const g = parseInt(hex.slice(3, 5), 16)
    const b = parseInt(hex.slice(5, 7), 16)
    return `rgb(${Math.min(255, r + 55)},${Math.min(255, g + 55)},${Math.min(255, b + 55)})`
  }

  // Ray-box intersection: point on node boundary facing toward (tx, ty)
  const boxPt = (n: DiagramNode, tx: number, ty: number): [number, number] => {
    const dx = tx - n.x, dy = ty - n.y
    if (!dx && !dy) return [n.x, n.y]
    const sx = NW / 2 / Math.abs(dx)
    const sy = NH(n) / 2 / Math.abs(dy)
    const s = Math.min(isFinite(sx) ? sx : 1e9, isFinite(sy) ? sy : 1e9)
    return [n.x + dx * s, n.y + dy * s]
  }

  // Bidirectional edge detection — offset parallel lines apart
  const mirrorIdx = (e: DiagramEdge) =>
    edges.findIndex(e2 => e2.from === e.to && e2.to === e.from)

  // Auto viewBox — fit all nodes with padding
  const PAD = 70
  const xs = nodes.map(n => n.x), ys = nodes.map(n => n.y)
  const x0 = Math.min(...xs) - NW / 2 - PAD
  const x1 = Math.max(...xs) + NW / 2 + PAD
  const y0 = Math.min(...ys) - 40 - PAD
  const y1 = Math.max(...ys) + 40 + PAD
  const contentW = x1 - x0
  const contentH = y1 - y0
  const vw = Math.max(520, contentW)
  const vh = Math.max(320, contentH)
  // Centre content inside the viewBox by adding equal padding on both sides
  const vx = x0 - (vw - contentW) / 2
  const vy = y0 - (vh - contentH) / 2

  return (
    <svg
      viewBox={`${vx} ${vy} ${vw} ${vh}`}
      style={{ width: '100%', height: 'auto', maxHeight: '500px', display: 'block' }}
    >
      <defs>
        <filter id="ns" x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="0" dy="3" stdDeviation="5" floodColor="#0f172a" floodOpacity="0.15" />
        </filter>
        <filter id="ls" x="-60%" y="-60%" width="220%" height="220%">
          <feDropShadow dx="0" dy="1" stdDeviation="2" floodColor="#000" floodOpacity="0.28" />
        </filter>
        {nodes.map(n => (
          <linearGradient key={`gr-${n.id}`} id={`gr-${n.id}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={lighten(n.color)} />
            <stop offset="100%" stopColor={n.color} />
          </linearGradient>
        ))}
        {/* Arrow marker per node color — tip at endpoint (refX = full width) */}
        {nodes.map(n => (
          <marker key={`ar-${n.id}`} id={`ar-${n.id}`}
            markerWidth="11" markerHeight="9" refX="11" refY="4.5" orient="auto">
            <path d="M0,0 L0,9 L11,4.5 z" fill={n.color} />
          </marker>
        ))}
        <pattern id="dg" width="22" height="22" patternUnits="userSpaceOnUse">
          <circle cx="11" cy="11" r="1" fill="#d8dfe8" />
        </pattern>
      </defs>

      {/* Background */}
      <rect x={vx} y={vy} width={vw} height={vh} rx="16" fill="#f1f5f9" />
      <rect x={vx} y={vy} width={vw} height={vh} rx="16" fill="url(#dg)" />

      {/* ── Edges (drawn below nodes) ── */}
      {edges.map((e, i) => {
        const fn = nodes.find(n => n.id === e.from)
        const tn = nodes.find(n => n.id === e.to)
        if (!fn || !tn) return null
        const edgeColor = e.color || fn.color
        const markerNodeId = e.color ? (nodes.find(n => n.color === e.color)?.id || fn.id) : fn.id

        // Exact box-edge connection points
        const [ax, ay] = boxPt(fn, tn.x, tn.y)
        const [bx, by] = boxPt(tn, fn.x, fn.y)

        // Offset bidirectional pairs so lines don't overlap
        const mi = mirrorIdx(e)
        const biOff = mi >= 0 ? (mi > i ? 9 : -9) : 0
        const dx = bx - ax, dy = by - ay
        const len = Math.sqrt(dx * dx + dy * dy) || 1
        const px = -dy / len, py = dx / len // perpendicular unit vector
        const lax = ax + px * biOff, lay = ay + py * biOff
        const lbx = bx + px * biOff, lby = by + py * biOff

        // Label position: midpoint offset perpendicular toward "upper" side
        const mx = (lax + lbx) / 2, my = (lay + lby) / 2
        const sign = (py < 0 ? 1 : py > 0 ? -1 : px < 0 ? -1 : 1) * (e.labelFlip ? -1 : 1)
        const lw = e.label ? Math.max(e.label.length * 6.8 + 20, 40) : 0
        // Offset must clear the pill's projected extent onto the perpendicular direction
        const lo = Math.max(42, lw / 2 * Math.abs(px) + 11 * Math.abs(py) + 10)
        const llx = mx + sign * px * lo
        const lly = my + sign * py * lo

        return (
          <g key={i}>
            {/* Straight line — tail at FROM box edge, tip at TO box edge */}
            <line
              x1={lax} y1={lay} x2={lbx} y2={lby}
              stroke={edgeColor} strokeWidth="2.4" strokeLinecap="round"
              strokeDasharray={e.dashed ? '7 4' : undefined}
              markerEnd={`url(#ar-${markerNodeId})`}
            />
            {/* Label pill floating above/beside the line */}
            {e.label && (
              <g filter="url(#ls)">
                <rect x={llx - lw / 2} y={lly - 11} width={lw} height={22} rx="11" fill={edgeColor} />
                <text
                  x={llx} y={lly + 4.5}
                  fontSize="10.5" fontWeight="700" fill="#fff"
                  textAnchor="middle" fontFamily="system-ui, -apple-system, sans-serif"
                >
                  {e.label}
                </text>
              </g>
            )}
          </g>
        )
      })}

      {/* ── Nodes (drawn on top of edges) ── */}
      {nodes.map(n => {
        const lines = n.label.split('\n')
        const h = NH(n)
        return (
          <g key={n.id} filter="url(#ns)">
            {/* Drop shadow offset */}
            <rect x={n.x - NW / 2 + 1} y={n.y - h / 2 + 4} width={NW} height={h} rx="13"
              fill="rgba(0,0,0,0.1)" />
            {/* Gradient body */}
            <rect x={n.x - NW / 2} y={n.y - h / 2} width={NW} height={h} rx="13"
              fill={`url(#gr-${n.id})`} stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" />
            {/* Gloss shine */}
            <rect x={n.x - NW / 2 + 8} y={n.y - h / 2 + 4} width={NW - 16} height={h * 0.38} rx="8"
              fill="rgba(255,255,255,0.22)" />
            {/* Text */}
            {lines.map((line, li) => (
              <text key={li}
                x={n.x} y={n.y + (li - (lines.length - 1) / 2) * 16 + 5}
                textAnchor="middle" fontSize="12" fontWeight="700" fill="#fff"
                fontFamily="system-ui, -apple-system, sans-serif"
                style={{ letterSpacing: '0.015em' }}
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
  const { user, tier } = useAuth()
  const navigate = useNavigate()
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
