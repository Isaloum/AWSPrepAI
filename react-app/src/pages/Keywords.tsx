import { useState } from 'react'
import Layout from '../components/Layout'

interface Keyword {
  keyword: string
  hint: string
  services: string[]
  category: string
  icon: string
}

const keywords: Keyword[] = [
  // Availability / Resilience
  { icon: '🔁', keyword: 'highly available', hint: 'Needs redundancy — no single point of failure.', services: ['Multi-AZ RDS', 'ALB', 'Auto Scaling', 'Multi-AZ EFS'], category: 'availability' },
  { icon: '🏥', keyword: 'fault tolerant', hint: 'System must survive component failures.', services: ['Multi-AZ', 'Multi-Region', 'S3 (11 9s)', 'DynamoDB Global Tables'], category: 'availability' },
  { icon: '⚡', keyword: 'automatic failover', hint: 'Failover without manual intervention.', services: ['Multi-AZ RDS', 'RDS Proxy', 'Route 53 Health Checks', 'Aurora'], category: 'availability' },
  { icon: '🌍', keyword: 'global users / low latency worldwide', hint: 'Need edge locations or global network.', services: ['CloudFront', 'Global Accelerator', 'Route 53 Latency Routing', 'DynamoDB Global Tables'], category: 'availability' },
  { icon: '🔄', keyword: 'disaster recovery / DR', hint: 'RPO/RTO — match strategy to recovery needs.', services: ['Backup & Restore', 'Pilot Light', 'Warm Standby', 'Active-Active'], category: 'availability' },
  { icon: '📊', keyword: 'minimum downtime', hint: 'Zero or near-zero downtime during changes.', services: ['Blue/Green deploy', 'Rolling + ELB', 'Aurora', 'Elastic Beanstalk Immutable'], category: 'availability' },

  // Cost
  { icon: '💰', keyword: 'cheapest / lowest cost', hint: 'Prioritize cost over performance or SLA.', services: ['Spot Instances', 'S3 Glacier', 'Reserved Instances', 'AWS Savings Plans'], category: 'cost' },
  { icon: '🧾', keyword: 'cost-effective', hint: 'Good balance of cost and performance.', services: ['S3 Intelligent-Tiering', 'Lambda', 'Fargate', 'Reserved Instances'], category: 'cost' },
  { icon: '📉', keyword: 'reduce costs', hint: 'Eliminate waste or switch purchasing model.', services: ['Compute Optimizer', 'Trusted Advisor', 'Spot Instances', 'S3 Lifecycle Policies'], category: 'cost' },
  { icon: '🆓', keyword: 'pay per use / no idle cost', hint: 'Serverless or on-demand billing model.', services: ['Lambda', 'Fargate', 'API Gateway', 'DynamoDB on-demand'], category: 'cost' },
  { icon: '⏱️', keyword: 'short-lived / temporary workload', hint: 'Don\'t pay for idle time.', services: ['Spot Instances', 'Lambda', 'Fargate Spot', 'EC2 On-Demand'], category: 'cost' },

  // Performance
  { icon: '🚀', keyword: 'high performance / fast', hint: 'Optimize for throughput or IOPS.', services: ['EC2 Instance Store', 'EBS io2', 'DynamoDB DAX', 'ElastiCache'], category: 'performance' },
  { icon: '📈', keyword: 'scalable / scale automatically', hint: 'Must grow with demand.', services: ['Auto Scaling', 'DynamoDB', 'Lambda', 'ECS + Fargate'], category: 'performance' },
  { icon: '🏎️', keyword: 'millisecond latency / sub-ms', hint: 'Need in-memory caching layer.', services: ['ElastiCache Redis', 'ElastiCache Memcached', 'DynamoDB DAX', 'MemoryDB'], category: 'performance' },
  { icon: '📦', keyword: 'millions of requests / high throughput', hint: 'Massively scalable services.', services: ['SQS', 'Kinesis Data Streams', 'API Gateway', 'DynamoDB'], category: 'performance' },
  { icon: '🔥', keyword: 'hot data / frequently accessed', hint: 'Keep in cache or fast tier.', services: ['ElastiCache', 'DAX', 'S3 Standard', 'EBS io2'], category: 'performance' },

  // Serverless
  { icon: '☁️', keyword: 'serverless', hint: 'No server management — pure pay-per-use.', services: ['Lambda', 'Fargate', 'API Gateway', 'DynamoDB', 'S3', 'SQS', 'SNS'], category: 'serverless' },
  { icon: '🎯', keyword: 'event-driven', hint: 'Something triggers the compute.', services: ['Lambda', 'EventBridge', 'SQS → Lambda', 'SNS → Lambda', 'S3 Events'], category: 'serverless' },
  { icon: '🔌', keyword: 'no infrastructure management', hint: 'Fully managed = serverless or PaaS.', services: ['Lambda', 'Fargate', 'Elastic Beanstalk', 'RDS', 'DynamoDB'], category: 'serverless' },
  { icon: '📋', keyword: 'run code without servers', hint: 'Pure Lambda scenario.', services: ['Lambda', 'Lambda@Edge', 'Lambda + API Gateway'], category: 'serverless' },

  // Security
  { icon: '🔐', keyword: 'encrypt at rest', hint: 'Data needs to be encrypted when stored.', services: ['KMS', 'S3 SSE-KMS', 'EBS encryption', 'RDS encryption', 'Secrets Manager'], category: 'security' },
  { icon: '🔒', keyword: 'encrypt in transit', hint: 'Data encrypted while moving.', services: ['TLS/SSL', 'ACM', 'HTTPS', 'VPN', 'Direct Connect + VPN'], category: 'security' },
  { icon: '🗝️', keyword: 'rotate credentials / secrets', hint: 'Automatic secret rotation.', services: ['Secrets Manager (auto-rotate)', 'Parameter Store (manual)'], category: 'security' },
  { icon: '🛡️', keyword: 'DDoS protection', hint: 'Shield from volumetric attacks.', services: ['AWS Shield Standard (free)', 'AWS Shield Advanced', 'CloudFront + WAF'], category: 'security' },
  { icon: '🚫', keyword: 'prevent SQL injection / XSS', hint: 'App-layer protection.', services: ['AWS WAF', 'WAF + ALB', 'WAF + CloudFront', 'WAF + API Gateway'], category: 'security' },
  { icon: '🕵️', keyword: 'detect threats / anomalies', hint: 'Intelligent threat detection.', services: ['GuardDuty', 'Security Hub', 'Macie (S3 data)', 'Inspector (vulnerabilities)'], category: 'security' },
  { icon: '📜', keyword: 'audit / compliance / who did what', hint: 'Logging and tracking API calls.', services: ['CloudTrail', 'Config', 'CloudWatch Logs', 'Security Hub'], category: 'security' },
  { icon: '🏠', keyword: 'private / not publicly accessible', hint: 'Keep traffic inside AWS network.', services: ['Private Subnet', 'VPC Endpoints', 'PrivateLink', 'Security Groups'], category: 'security' },

  // Migration / Hybrid
  { icon: '🚛', keyword: 'migrate to AWS / lift-and-shift', hint: 'Move existing workloads to AWS.', services: ['AWS MGN', 'DMS', 'Snow Family', 'DataSync'], category: 'migration' },
  { icon: '💽', keyword: 'large dataset / terabytes to migrate', hint: 'Too big for internet transfer.', services: ['Snowball Edge', 'Snowcone', 'Snowmobile (>10PB)', 'DataSync'], category: 'migration' },
  { icon: '🌉', keyword: 'on-premises integration / hybrid', hint: 'Connect data center to AWS.', services: ['Direct Connect', 'VPN', 'Storage Gateway', 'Outposts'], category: 'migration' },
  { icon: '🔄', keyword: 'migrate database with minimal downtime', hint: 'Keep source running during migration.', services: ['DMS (continuous replication)', 'Schema Conversion Tool', 'Aurora Migration'], category: 'migration' },
  { icon: '📁', keyword: 'file transfer to cloud', hint: 'Sync or transfer file data.', services: ['DataSync', 'Storage Gateway File', 'S3 Transfer Acceleration', 'Snowball'], category: 'migration' },

  // Decoupling / Messaging
  { icon: '🔗', keyword: 'decouple / loosely coupled', hint: 'Components should not depend on each other.', services: ['SQS', 'SNS', 'EventBridge', 'Step Functions'], category: 'messaging' },
  { icon: '📬', keyword: 'queue / buffer / async', hint: 'Handle bursts and decouple producers from consumers.', services: ['SQS Standard', 'SQS FIFO', 'SNS + SQS fanout'], category: 'messaging' },
  { icon: '🎙️', keyword: 'fan-out / pub-sub / one-to-many', hint: 'One message → multiple subscribers.', services: ['SNS', 'SNS + SQS', 'EventBridge'], category: 'messaging' },
  { icon: '⏳', keyword: 'order preserved / exactly once', hint: 'Message ordering matters.', services: ['SQS FIFO', 'Kinesis Data Streams', 'EventBridge'], category: 'messaging' },
  { icon: '📡', keyword: 'real-time streaming / live data', hint: 'Continuous data flow, not batch.', services: ['Kinesis Data Streams', 'Kinesis Firehose', 'MSK (Kafka)', 'EventBridge Pipes'], category: 'messaging' },

  // Storage
  { icon: '🗄️', keyword: 'archive / infrequently accessed', hint: 'Store cheaply, retrieve rarely.', services: ['S3 Glacier Instant', 'S3 Glacier Flexible', 'S3 Glacier Deep Archive', 'EBS Cold HDD'], category: 'storage' },
  { icon: '🔗', keyword: 'shared storage / multiple instances', hint: 'Multiple EC2s need same storage.', services: ['EFS (NFS)', 'FSx for Windows (SMB)', 'S3'], category: 'storage' },
  { icon: '🖥️', keyword: 'single instance storage / block storage', hint: 'Attached to one EC2, like a disk.', services: ['EBS gp3', 'EBS io2', 'EC2 Instance Store (ephemeral)'], category: 'storage' },
  { icon: '⚡', keyword: 'highest IOPS / NVMe', hint: 'Maximum disk throughput, ephemeral ok.', services: ['EC2 Instance Store', 'EBS io2 Block Express'], category: 'storage' },
  { icon: '🌊', keyword: 'data lake / unstructured data at scale', hint: 'Store anything, query with SQL.', services: ['S3', 'S3 + Athena', 'Lake Formation', 'Glue'], category: 'storage' },

  // Networking
  { icon: '⚖️', keyword: 'distribute traffic / load balance', hint: 'Spread requests across instances.', services: ['ALB (HTTP/HTTPS)', 'NLB (TCP/UDP)', 'CLB (legacy)', 'Route 53'], category: 'networking' },
  { icon: '🌐', keyword: 'static IP / fixed IP', hint: 'IP that doesn\'t change.', services: ['Elastic IP', 'Global Accelerator (Anycast)', 'NLB'], category: 'networking' },
  { icon: '🚪', keyword: 'internet access from private subnet', hint: 'Outbound only from private subnet.', services: ['NAT Gateway', 'NAT Instance'], category: 'networking' },
  { icon: '🏰', keyword: 'connect multiple VPCs', hint: 'VPC-to-VPC routing.', services: ['VPC Peering (non-transitive)', 'Transit Gateway (hub & spoke)', 'PrivateLink'], category: 'networking' },
  { icon: '🌏', keyword: 'geolocation / geo-routing', hint: 'Route users based on their location.', services: ['Route 53 Geolocation', 'Route 53 Geoproximity', 'CloudFront'], category: 'networking' },

  // Compute
  { icon: '🐳', keyword: 'containers / Docker / microservices', hint: 'Containerized workload.', services: ['ECS (AWS-native)', 'EKS (Kubernetes)', 'Fargate (serverless containers)', 'ECR'], category: 'compute' },
  { icon: '⏱️', keyword: 'scheduled / cron / batch jobs', hint: 'Run at specific times or intervals.', services: ['EventBridge Scheduler', 'Lambda + EventBridge', 'Batch', 'ECS Scheduled Tasks'], category: 'compute' },
  { icon: '🧩', keyword: 'lift-and-shift without refactoring', hint: 'Keep same app architecture.', services: ['EC2', 'Elastic Beanstalk', 'MGN (Migration)'], category: 'compute' },
  { icon: '🎮', keyword: 'GPU / machine learning / HPC', hint: 'High-performance compute needs.', services: ['EC2 P-series/G-series', 'SageMaker', 'Trainium', 'Inferentia', 'ParallelCluster'], category: 'compute' },
]

const CATEGORIES = [
  { id: 'all', label: 'All' },
  { id: 'availability', label: 'Availability' },
  { id: 'cost', label: 'Cost' },
  { id: 'performance', label: 'Performance' },
  { id: 'serverless', label: 'Serverless' },
  { id: 'security', label: 'Security' },
  { id: 'migration', label: 'Migration' },
  { id: 'messaging', label: 'Messaging' },
  { id: 'storage', label: 'Storage' },
  { id: 'networking', label: 'Networking' },
  { id: 'compute', label: 'Compute' },
]

const CAT_COLORS: Record<string, { bg: string; text: string; border: string; tag: string }> = {
  availability: { bg: '#eff6ff', text: '#1d4ed8', border: '#bfdbfe', tag: '#2563eb' },
  cost:         { bg: '#f0fdf4', text: '#15803d', border: '#bbf7d0', tag: '#16a34a' },
  performance:  { bg: '#fdf4ff', text: '#7e22ce', border: '#e9d5ff', tag: '#9333ea' },
  serverless:   { bg: '#ecfeff', text: '#0e7490', border: '#a5f3fc', tag: '#0891b2' },
  security:     { bg: '#fef2f2', text: '#b91c1c', border: '#fecaca', tag: '#dc2626' },
  migration:    { bg: '#fff7ed', text: '#c2410c', border: '#fed7aa', tag: '#ea580c' },
  messaging:    { bg: '#eef2ff', text: '#4338ca', border: '#c7d2fe', tag: '#4f46e5' },
  storage:      { bg: '#f0fdf4', text: '#15803d', border: '#bbf7d0', tag: '#16a34a' },
  networking:   { bg: '#faf5ff', text: '#7e22ce', border: '#e9d5ff', tag: '#9333ea' },
  compute:      { bg: '#fff1f2', text: '#be123c', border: '#fecdd3', tag: '#e11d48' },
}

export default function Keywords() {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('all')

  const filtered = keywords.filter(k => {
    const matchCat = category === 'all' || k.category === category
    const q = search.toLowerCase()
    const matchSearch = !q ||
      k.keyword.toLowerCase().includes(q) ||
      k.hint.toLowerCase().includes(q) ||
      k.services.some(s => s.toLowerCase().includes(q))
    return matchCat && matchSearch
  })

  return (
    <Layout>
      <div style={{ background: '#f8fafc', minHeight: '100vh', padding: '40px 20px' }}>
        <div style={{ maxWidth: '960px', margin: '0 auto' }}>

          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <div style={{ display: 'inline-block', background: '#faf5ff', color: '#7e22ce', padding: '4px 14px', borderRadius: '999px', fontSize: '0.8rem', fontWeight: 700, marginBottom: '12px', letterSpacing: '0.05em' }}>
              SCENARIO KEYWORDS
            </div>
            <h1 style={{ fontSize: '2rem', fontWeight: 900, color: '#111827', margin: '0 0 10px' }}>
              Keywords & Terms
            </h1>
            <p style={{ color: '#6b7280', fontSize: '1rem', margin: 0 }}>
              Spot these words in exam questions → know exactly which AWS service to pick.
            </p>
          </div>

          {/* Search */}
          <div style={{ position: 'relative', marginBottom: '24px' }}>
            <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', fontSize: '1.1rem' }}>🔍</span>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search keywords, hints, or services…"
              style={{ width: '100%', boxSizing: 'border-box', padding: '12px 16px 12px 42px', fontSize: '0.95rem', border: '1.5px solid #e2e8f0', borderRadius: '10px', background: '#fff', outline: 'none', color: '#111827' }}
            />
          </div>

          {/* Category filter */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '28px' }}>
            {CATEGORIES.map(c => (
              <button
                key={c.id}
                onClick={() => setCategory(c.id)}
                style={{
                  padding: '6px 16px', borderRadius: '999px', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer', border: '1.5px solid',
                  background: category === c.id ? '#7c3aed' : '#fff',
                  color: category === c.id ? '#fff' : '#374151',
                  borderColor: category === c.id ? '#7c3aed' : '#e2e8f0',
                  transition: 'all 0.15s',
                }}
              >{c.label}</button>
            ))}
          </div>

          {/* Count */}
          <p style={{ color: '#6b7280', fontSize: '0.85rem', marginBottom: '20px' }}>
            Showing {filtered.length} of {keywords.length} keywords
          </p>

          {/* Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(420px, 1fr))', gap: '16px' }}>
            {filtered.map(k => {
              const colors = CAT_COLORS[k.category] || CAT_COLORS['compute']
              return (
                <div key={k.keyword} style={{ background: '#fff', border: '1.5px solid #e2e8f0', borderRadius: '14px', padding: '20px', transition: 'box-shadow 0.15s', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}
                  onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.08)')}
                  onMouseLeave={e => (e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.04)')}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '10px' }}>
                    <span style={{ fontSize: '1.4rem', lineHeight: 1 }}>{k.icon}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                        <span style={{ fontSize: '1rem', fontWeight: 800, color: '#111827', background: '#fef9c3', padding: '2px 8px', borderRadius: '6px', fontFamily: 'monospace' }}>
                          "{k.keyword}"
                        </span>
                        <span style={{ fontSize: '0.72rem', fontWeight: 700, background: colors.bg, color: colors.tag, border: `1px solid ${colors.border}`, padding: '2px 8px', borderRadius: '999px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                          {k.category}
                        </span>
                      </div>
                      <p style={{ margin: '6px 0 10px', color: '#4b5563', fontSize: '0.88rem', lineHeight: 1.5 }}>
                        {k.hint}
                      </p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {k.services.map(s => (
                      <span key={s} style={{ fontSize: '0.78rem', fontWeight: 600, background: '#f1f5f9', color: '#334155', padding: '3px 10px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>

          {filtered.length === 0 && (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: '#6b7280' }}>
              <div style={{ fontSize: '2rem', marginBottom: '8px' }}>🔍</div>
              <p>No keywords match your search.</p>
            </div>
          )}

        </div>
      </div>
    </Layout>
  )
}
