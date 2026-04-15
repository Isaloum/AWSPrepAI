import { useState } from 'react'
import Layout from '../components/Layout'

// Comparison data backed by 1,098 real SAA-C03 exam questions (Tutorials Dojo + Udemy)
const comparisons = [
  {
    id: 'rds-multiaz-vs-replica',
    title: 'RDS Multi-AZ vs Read Replica',
    emoji: '🗄️',
    tag: 'Database',
    examFreq: '31 questions in 1,098 real exams',
    rows: [
      { feature: 'Purpose', a: 'High Availability & Failover', b: 'Read Scaling & Performance' },
      { feature: 'Replication type', a: 'Synchronous', b: 'Asynchronous' },
      { feature: 'Failover', a: 'Automatic (CNAME flip)', b: 'Manual (must be promoted)' },
      { feature: 'Readable?', a: 'No — standby is passive', b: 'Yes — read-only traffic only' },
      { feature: 'Same region?', a: 'Same region, different AZ', b: 'Same or different region' },
      { feature: 'Write operations', a: 'Only on primary', b: 'Only on primary' },
      { feature: 'Use when', a: 'Production DB needs HA', b: 'DB is overloaded with reads' },
    ],
    tip: 'Exam trap: "synchronous standby for DR" = Multi-AZ. "Async for reporting/reads" = Read Replica. They are separate features and can both be active simultaneously.',
  },
  {
    id: 'active-active-vs-passive',
    title: 'Route 53 Active-Active vs Active-Passive',
    emoji: '🌐',
    tag: 'Networking',
    examFreq: 'Tested across multiple domains in 1,098 real exams',
    rows: [
      { feature: 'All resources serve traffic', a: 'YES', b: 'NO — secondary is standby' },
      { feature: 'When is secondary used', a: 'All resources serve simultaneously', b: 'Only when ALL primary resources fail' },
      { feature: 'Routing policy used', a: 'Weighted, Latency, Geolocation, etc.', b: 'Failover routing policy' },
      { feature: 'Health checks required', a: 'Yes (unhealthy = removed)', b: 'Yes (primary + optional secondary)' },
      { feature: 'Use case', a: 'Multi-region apps, all resources needed', b: 'DR — primary site + backup site' },
      { feature: 'RTO', a: 'Near zero (just removes unhealthy)', b: 'Fast (DNS TTL)' },
    ],
    tip: 'Choose Active-Active when all resources must be available at all times. Choose Active-Passive for true primary/backup failover. The exam word "always available" = Active-Active.',
  },
  {
    id: 'sgs-vs-nacls',
    title: 'Security Groups vs Network ACLs',
    emoji: '🔒',
    tag: 'Security',
    examFreq: 'Core security concept in 1,098 real exams',
    rows: [
      { feature: 'Level', a: 'Instance level', b: 'Subnet level' },
      { feature: 'Stateful?', a: 'YES — return traffic auto-allowed', b: 'NO — must explicitly allow inbound AND outbound' },
      { feature: 'Rule evaluation', a: 'All rules evaluated together', b: 'Rules evaluated in order (first match wins)' },
      { feature: 'Default behavior', a: 'Deny all inbound, allow all outbound', b: 'Default NACL allows all' },
      { feature: 'Ephemeral ports', a: 'Not needed (stateful)', b: 'Must allow outbound 32768-65535 for return traffic' },
      { feature: 'Use for', a: 'Per-instance access control', b: 'Subnet-wide firewall rules' },
    ],
    tip: 'Critical NACL trap: When allowing HTTPS (443) inbound in a NACL, you MUST also add an outbound rule for ephemeral ports (32768-65535) for the response traffic. Security Groups handle this automatically (stateful).',
  },
  {
    id: 'gateway-vs-interface-endpoint',
    title: 'VPC Gateway vs Interface Endpoint',
    emoji: '🔗',
    tag: 'Networking',
    examFreq: '6 questions in 1,098 real exams',
    rows: [
      { feature: 'Supports', a: 'S3 and DynamoDB only', b: 'Most AWS services', b2: '' },
      { feature: 'Cost', a: 'FREE — no hourly charge, no data fee', b: 'Hourly charge + data processing fee' },
      { feature: 'How it works', a: 'Route table entry (prefix list)', b: 'Private IP in your subnet (ENI)' },
      { feature: 'Accessible from', a: 'Within VPC only', b: 'VPC, on-premises (via DX/VPN), peered VPCs' },
      { feature: 'DNS', a: 'No private DNS change needed', b: 'Private DNS overrides public endpoint' },
      { feature: 'Use when', a: 'S3/DynamoDB from within VPC, minimize cost', b: 'On-prem access needed, other services' },
    ],
    tip: '"Most cost-effective to access S3 from private subnet" = Gateway Endpoint (free). Do NOT choose NAT Gateway for S3 access — NAT charges per GB processed.',
  },
  {
    id: 'datasync-vs-storagegateway',
    title: 'AWS DataSync vs Storage Gateway',
    emoji: '💾',
    tag: 'Storage',
    examFreq: '13 questions in 1,098 real exams',
    rows: [
      { feature: 'Primary use case', a: 'One-time or scheduled bulk data migration', b: 'Hybrid storage — on-prem apps access cloud storage' },
      { feature: 'Protocol support', a: 'NFS, SMB, S3, HDFS, EFS', b: 'NFS, SMB (File), iSCSI (Volume), VTL (Tape)' },
      { feature: 'Local caching', a: 'No', b: 'YES — caches frequently accessed data locally' },
      { feature: 'Best for', a: 'Moving large amounts of data to AWS', b: 'Extending on-prem storage to cloud with low latency' },
      { feature: 'App changes needed', a: 'No (file-based sync)', b: 'No (transparent NFS/SMB mount)' },
      { feature: 'Tape backup', a: 'Not for tape workloads', b: 'Tape Gateway — replaces physical tapes with S3/Glacier' },
    ],
    tip: '"Migrate historical records" or "one-time move" = DataSync. "On-prem apps need low-latency access while data lives in AWS" = Storage Gateway File Gateway. Tape backup = Storage Gateway Tape Gateway.',
  },
  {
    id: 'spot-ondemand-reserved',
    title: 'Spot vs On-Demand vs Reserved Instances',
    emoji: '🖥️',
    tag: 'Compute',
    examFreq: '35 questions in 1,098 real exams (Spot + Reserved + On-Demand)',
    rows: [
      { feature: 'Discount vs On-Demand', a: 'Up to 90% off', b: '0% (baseline price)', c: 'Up to 72% off' },
      { feature: 'Interruption risk', a: '2-minute warning, can be interrupted', b: 'None', c: 'None' },
      { feature: 'Commitment', a: 'None', b: 'None', c: '1 or 3 years' },
      { feature: 'Best for', a: 'Batch, ML training, fault-tolerant jobs', b: 'Unpredictable, short-term workloads', c: 'Steady-state, predictable 24/7 workloads' },
    ],
    threeWay: true,
    colC: 'Reserved',
    tip: 'Exam keywords: "can be interrupted" or "flexible" = Spot. "24/7 steady-state" = Reserved. "Short-term" = On-Demand. "Non-production batch" = Spot.',
  },
  {
    id: 'geolocation-vs-geoproximity-vs-latency',
    title: 'Route 53: Geolocation vs Geoproximity vs Latency',
    emoji: '🗺️',
    tag: 'Networking',
    examFreq: '2 questions in 1,098 real exams',
    rows: [
      { feature: 'What controls routing', a: 'User\'s country/continent (fixed)', b: 'Geographic distance + optional BIAS', c: 'Measured network latency' },
      { feature: 'Can expand/shrink region', a: 'No', b: 'YES — use bias (+/- value)', c: 'No (auto based on latency)' },
      { feature: 'Compliance use case', a: 'YES — route Germany only to EU', b: 'Partial — distance-based', c: 'No — may route outside region' },
      { feature: 'Typical exam use', a: '"Route users in X country to X servers"', b: '"Route MORE traffic from X area to Y region"', c: '"Route users to lowest latency resource"' },
    ],
    threeWay: true,
    colC: 'Latency',
    tip: '"Users in Japan → Tokyo region" = Geolocation. "Route MORE of Philippines traffic to Tokyo" = Geoproximity with positive bias on Tokyo. "Route to best performance" = Latency.',
  },
  {
    id: 'sqs-sns-kinesis',
    title: 'SQS vs SNS vs Kinesis Data Streams',
    emoji: '📨',
    tag: 'Messaging',
    examFreq: '52 questions in 1,098 real exams (SQS + SNS + Kinesis combined)',
    rows: [
      { feature: 'Model', a: 'Pull (polling)', b: 'Push (pub/sub)', c: 'Pull or push (consumer)' },
      { feature: 'Consumer count', a: 'One consumer per message', b: 'Multiple subscribers receive same message', c: 'Multiple consumers, independent position' },
      { feature: 'Ordering', a: 'FIFO queue available', b: 'No ordering', c: 'Per-shard ordering' },
      { feature: 'Retention', a: 'Up to 14 days', b: 'No retention (fire & forget)', c: '24h default, up to 365 days' },
      { feature: 'Real-time analytics', a: 'No', b: 'No', c: 'YES — designed for real-time' },
      { feature: 'Fan-out pattern', a: 'No (one consumer)', b: 'YES — fan-out to SQS/Lambda/HTTP', c: 'Multiple consumers via enhanced fan-out' },
      { feature: 'Use when', a: 'Decouple app components, job queuing', b: 'Broadcast notifications, fan-out', c: 'Real-time data streams, IoT, clickstream' },
    ],
    threeWay: true,
    colC: 'Kinesis',
    tip: 'SQS + SNS fan-out: SNS topic → multiple SQS queues with filter policies. Each SQS queue gets filtered messages. Use this for priority queues (premium vs free) by having two SQS queues.',
  },
  {
    id: 'ecs-vs-eks',
    title: 'Amazon ECS vs Amazon EKS',
    emoji: '🐳',
    tag: 'Containers',
    examFreq: '14 questions in 1,098 real exams',
    rows: [
      { feature: 'Orchestrator', a: 'AWS-proprietary (not Kubernetes)', b: 'Kubernetes (open source)' },
      { feature: 'Cloud-agnostic?', a: 'NO — AWS only', b: 'YES — portable to any Kubernetes cluster' },
      { feature: 'Learning curve', a: 'Lower — simpler API', b: 'Higher — Kubernetes concepts needed' },
      { feature: 'Fargate support', a: 'YES', b: 'YES (EKS with Fargate profiles)' },
      { feature: 'Use when', a: 'AWS-only deployment, simplicity preferred', b: 'Multi-cloud portability, existing Kubernetes workloads' },
    ],
    tip: '"Cloud-agnostic", "same config across environments", "existing Kubernetes" = EKS. If cloud portability isn\'t mentioned and simplicity matters = ECS.',
  },
  {
    id: 'secrets-manager-vs-ssm',
    title: 'Secrets Manager vs SSM Parameter Store',
    emoji: '🔑',
    tag: 'Security',
    examFreq: 'Key security pattern in 1,098 real exams',
    rows: [
      { feature: 'Auto rotation', a: 'YES — built-in for RDS, Redshift, custom via Lambda', b: 'NO — manual rotation only' },
      { feature: 'Cost', a: '~$0.40/secret/month + API calls', b: 'Free for Standard tier, $0.05/10K API calls (Advanced)' },
      { feature: 'Encryption', a: 'Always encrypted with KMS', b: 'SecureString type uses KMS encryption' },
      { feature: 'Cross-account access', a: 'YES via resource policies', b: 'Limited' },
      { feature: 'Use when', a: 'Database passwords, API keys that need rotation', b: 'Config values, non-rotating secrets, cost sensitivity' },
    ],
    tip: '"Auto rotation" = always Secrets Manager. "Static config stored securely" + cost concern = SSM Parameter Store SecureString. Both use KMS, but Secrets Manager adds rotation on top.',
  },
  {
    id: 'glacier-retrieval',
    title: 'S3 Glacier Retrieval Options',
    emoji: '❄️',
    tag: 'Storage',
    examFreq: '21 questions in 1,098 real exams',
    rows: [
      { feature: 'Retrieval type', a: 'Expedited', b: 'Standard', c: 'Bulk' },
      { feature: 'Time', a: '1–5 minutes', b: '3–5 hours', c: '5–12 hours' },
      { feature: 'Cost', a: 'Highest per GB', b: 'Medium', c: 'Lowest per GB' },
      { feature: 'Guaranteed capacity?', a: 'Only with Provisioned Capacity', b: 'Yes', c: 'Yes (but slow)' },
      { feature: 'Throughput', a: 'Up to 150 MB/s with provisioned capacity', b: 'Standard', c: 'Standard' },
    ],
    threeWay: true,
    colC: 'Bulk',
    tip: '"Under 15 minutes" + "guaranteed capacity" = Expedited + Provisioned Capacity. Provisioned Capacity guarantees 3 expedited retrievals per 5 min and up to 150 MB/s. Without it, Expedited is best-effort.',
  },
  {
    id: 'waf-shield-guardduty',
    title: 'WAF vs Shield vs GuardDuty',
    emoji: '🛡️',
    tag: 'Security',
    examFreq: '10 questions in 1,098 real exams (WAF + Shield + GuardDuty)',
    rows: [
      { feature: 'Protects against', a: 'L7 web attacks (SQLi, XSS, rate abuse)', b: 'DDoS attacks (L3/L4/L7)', c: 'Threats & anomalies (all types)' },
      { feature: 'Mode', a: 'Active blocking', b: 'Active blocking', c: 'Detection only (no blocking)' },
      { feature: 'Attaches to', a: 'ALB, CloudFront, API Gateway', b: 'All AWS resources (Adv: specific)', c: 'Analyzes CloudTrail, VPC Flow Logs, DNS' },
      { feature: 'Price', a: 'Per rule/ACL + request volume', b: 'Standard: Free, Advanced: $3000/month', c: 'Per GB analyzed' },
      { feature: 'Use when', a: 'Blocking specific malicious web traffic', b: 'Protecting against volumetric DDoS', c: 'Detecting malicious activity patterns' },
    ],
    threeWay: true,
    colC: 'GuardDuty',
    tip: 'GuardDuty DETECTS but does NOT block. WAF and Shield BLOCK. GuardDuty feeds findings to Security Hub. To block IPs based on GuardDuty findings, use WAF IP set rules triggered by GuardDuty.',
  },
  {
    id: 'emr-glue-firehose',
    title: 'EMR vs AWS Glue vs Data Firehose',
    emoji: '📊',
    tag: 'Analytics',
    examFreq: 'Analytics pattern in 1,098 real exams',
    rows: [
      { feature: 'Purpose', a: 'Big data processing (Hadoop/Spark)', b: 'Serverless ETL (transform & load)', c: 'Stream delivery to data stores' },
      { feature: 'Infrastructure', a: 'EC2 cluster (managed but not serverless)', b: 'Fully serverless', c: 'Fully serverless' },
      { feature: 'Supports Spark/Hadoop', a: 'YES', b: 'Limited (Spark via Glue Studio)', c: 'No' },
      { feature: 'Real-time?', a: 'Near real-time with streaming', b: 'Batch/scheduled', c: 'Near real-time (60s buffer)' },
      { feature: 'Output targets', a: 'S3, Redshift, HDFS', b: 'S3, Redshift, JDBC', c: 'S3, Redshift, OpenSearch, Splunk' },
      { feature: 'Use when', a: '"Big data frameworks", Hadoop, Spark at scale', b: 'CSV→Parquet conversion, schema detection', c: 'Stream data → S3/Redshift/Splunk' },
    ],
    threeWay: true,
    colC: 'Firehose',
    tip: '"Big data processing frameworks" = EMR. "CSV to Parquet with crawler" = Glue. "Load streaming data to S3/Redshift/OpenSearch/Splunk" = Firehose. Kinesis Data Streams → Firehose is a common pipeline.',
  },
]

const tagColors: Record<string, string> = {
  Database: '#0ea5e9',
  Networking: '#8b5cf6',
  Security: '#ef4444',
  Storage: '#f59e0b',
  Compute: '#10b981',
  Messaging: '#f97316',
  Containers: '#06b6d4',
  Analytics: '#6366f1',
}

export default function Comparisons() {
  const [activeTag, setActiveTag] = useState('All')
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const tags = ['All', ...Array.from(new Set(comparisons.map(c => c.tag)))]
  const filtered = activeTag === 'All' ? comparisons : comparisons.filter(c => c.tag === activeTag)

  return (
    <Layout>
      {/* Hero */}
      <div style={{
        background: 'linear-gradient(135deg, #1e3a5f 0%, #0f172a 100%)',
        padding: '3rem 2rem 2rem',
        textAlign: 'center',
        borderBottom: '1px solid #1e3a5f',
      }}>
        <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>⚖️</div>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#f8fafc', marginBottom: '0.5rem' }}>
          Service Comparisons
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '0.95rem', maxWidth: '540px', margin: '0 auto 1.5rem' }}>
          The most-tested "X vs Y" comparisons on SAA-C03 — backed by 1,098 real Tutorials Dojo &amp; Udemy exam questions.
        </p>
        {/* Tag filter */}
        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          {tags.map(tag => (
            <button
              key={tag}
              onClick={() => setActiveTag(tag)}
              style={{
                padding: '0.35rem 1rem',
                borderRadius: '999px',
                border: '1px solid',
                borderColor: activeTag === tag ? '#3b82f6' : '#1e3a5f',
                background: activeTag === tag ? '#3b82f6' : 'transparent',
                color: activeTag === tag ? '#fff' : '#94a3b8',
                cursor: 'pointer',
                fontSize: '0.82rem',
                fontWeight: activeTag === tag ? 700 : 400,
                transition: 'all 0.15s',
              }}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '2rem 1.5rem' }}>
        <div style={{ display: 'grid', gap: '1rem' }}>
          {filtered.map(comp => {
            const isExpanded = expandedId === comp.id
            const tagColor = tagColors[comp.tag] || '#64748b'
            return (
              <div
                key={comp.id}
                style={{
                  background: '#1e293b',
                  border: '1px solid #1e3a5f',
                  borderRadius: '0.75rem',
                  overflow: 'hidden',
                }}
              >
                {/* Header */}
                <button
                  onClick={() => setExpandedId(isExpanded ? null : comp.id)}
                  style={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '1rem 1.25rem',
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    textAlign: 'left',
                    gap: '1rem',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span style={{ fontSize: '1.5rem' }}>{comp.emoji}</span>
                    <div>
                      <div style={{ fontWeight: 700, color: '#f1f5f9', fontSize: '1rem' }}>{comp.title}</div>
                      <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem', alignItems: 'center' }}>
                        <span style={{
                          background: tagColor + '22',
                          border: `1px solid ${tagColor}`,
                          color: tagColor,
                          padding: '0.1rem 0.5rem',
                          borderRadius: '4px',
                          fontSize: '0.7rem',
                          fontWeight: 600,
                        }}>{comp.tag}</span>
                        <span style={{ fontSize: '0.72rem', color: '#64748b' }}>🎯 {comp.examFreq}</span>
                      </div>
                    </div>
                  </div>
                  <span style={{ color: '#64748b', fontSize: '1.2rem', flexShrink: 0 }}>{isExpanded ? '▲' : '▼'}</span>
                </button>

                {/* Expanded content */}
                {isExpanded && (
                  <div style={{ padding: '0 1.25rem 1.25rem', borderTop: '1px solid #1e3a5f' }}>
                    {/* Table */}
                    <div style={{ overflowX: 'auto', marginTop: '1rem' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.84rem' }}>
                        <thead>
                          <tr>
                            <th style={{ textAlign: 'left', padding: '0.5rem 0.75rem', color: '#64748b', fontWeight: 600, borderBottom: '1px solid #1e3a5f', width: '25%' }}>Feature</th>
                            <th style={{ textAlign: 'left', padding: '0.5rem 0.75rem', color: '#38bdf8', fontWeight: 700, borderBottom: '1px solid #1e3a5f', background: '#0c1a2e' }}>
                              {comp.id.includes('spot') ? 'Spot' :
                               comp.id.includes('geolocation') ? 'Geolocation' :
                               comp.id.includes('sqs') ? 'SQS' :
                               comp.id.includes('ecs') ? 'ECS' :
                               comp.id.includes('secrets') ? 'Secrets Manager' :
                               comp.id.includes('glacier') ? 'Expedited' :
                               comp.id.includes('waf') ? 'WAF' :
                               comp.id.includes('emr') ? 'EMR' :
                               comp.id.includes('gateway') ? 'Gateway Endpoint' :
                               comp.title.split(' vs ')[0]?.replace('RDS ', '').replace('Route 53: ', '').replace('Amazon ', '').replace('AWS ', '')}
                            </th>
                            <th style={{ textAlign: 'left', padding: '0.5rem 0.75rem', color: '#a78bfa', fontWeight: 700, borderBottom: '1px solid #1e3a5f', background: '#0c1a2e' }}>
                              {comp.id.includes('spot') ? 'On-Demand' :
                               comp.id.includes('geolocation') ? 'Geoproximity' :
                               comp.id.includes('sqs') ? 'SNS' :
                               comp.id.includes('ecs') ? 'EKS' :
                               comp.id.includes('secrets') ? 'SSM Parameter Store' :
                               comp.id.includes('glacier') ? 'Standard' :
                               comp.id.includes('waf') ? 'Shield' :
                               comp.id.includes('emr') ? 'Glue' :
                               comp.id.includes('gateway') ? 'Interface Endpoint' :
                               comp.title.split(' vs ')[1]?.replace('Read Replica', 'Read Replica').replace('Route 53: ', '')}
                            </th>
                            {comp.threeWay && (
                              <th style={{ textAlign: 'left', padding: '0.5rem 0.75rem', color: '#34d399', fontWeight: 700, borderBottom: '1px solid #1e3a5f', background: '#0c1a2e' }}>
                                {comp.colC}
                              </th>
                            )}
                          </tr>
                        </thead>
                        <tbody>
                          {comp.rows.map((row, i) => (
                            <tr key={i} style={{ background: i % 2 === 0 ? '#1e293b' : '#0f172a' }}>
                              <td style={{ padding: '0.5rem 0.75rem', color: '#64748b', fontWeight: 600, fontSize: '0.8rem' }}>{row.feature}</td>
                              <td style={{ padding: '0.5rem 0.75rem', color: '#e2e8f0' }}>{row.a}</td>
                              <td style={{ padding: '0.5rem 0.75rem', color: '#e2e8f0' }}>{row.b}</td>
                              {comp.threeWay && (
                                <td style={{ padding: '0.5rem 0.75rem', color: '#e2e8f0' }}>{(row as any).c}</td>
                              )}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Exam tip */}
                    <div style={{
                      marginTop: '1rem',
                      background: '#064e3b22',
                      border: '1px solid #064e3b',
                      borderLeft: '4px solid #10b981',
                      borderRadius: '0.5rem',
                      padding: '0.75rem 1rem',
                    }}>
                      <span style={{ color: '#34d399', fontWeight: 700, fontSize: '0.8rem' }}>💡 EXAM TIP  </span>
                      <span style={{ color: '#6ee7b7', fontSize: '0.84rem' }}>{comp.tip}</span>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Bottom CTA */}
        <div style={{ textAlign: 'center', marginTop: '2.5rem', padding: '2rem', background: '#1e293b', borderRadius: '0.75rem', border: '1px solid #1e3a5f' }}>
          <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>🎯</div>
          <h3 style={{ color: '#f1f5f9', fontWeight: 700, marginBottom: '0.5rem' }}>Ready to test your knowledge?</h3>
          <p style={{ color: '#64748b', fontSize: '0.875rem', marginBottom: '1.25rem' }}>
            These comparisons appear in ~40% of SAA-C03 practice questions.
          </p>
          <a
            href="/cert/saa-c03"
            style={{
              display: 'inline-block',
              padding: '0.75rem 2rem',
              background: '#2563eb',
              color: '#fff',
              borderRadius: '0.75rem',
              fontWeight: 700,
              textDecoration: 'none',
              fontSize: '0.95rem',
            }}
          >
            Practice SAA-C03 →
          </a>
        </div>
      </div>
    </Layout>
  )
}
