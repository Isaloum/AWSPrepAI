import Layout from '../components/Layout'

const domains = [
  {
    id: 'secure',
    label: '🔐 Design Secure Architectures',
    color: '#dbeafe',
    border: '#3b82f6',
    weight: '30%',
    questions: 228,
    focus: [
      'IAM: roles vs users, permissions boundary, SCPs',
      'Encryption: SSE-KMS (CMK), SSE-S3, in-transit SSL/TLS',
      'VPC security: NACLs vs Security Groups, PrivateLink, VPC endpoints',
      'Cognito User Pools for API Gateway auth',
      'CloudTrail for API auditing, GuardDuty for threats, Macie for sensitive data',
    ],
    traps: [
      'SSE-S3 vs SSE-KMS — SSE-KMS = customer-controlled key rotation',
      'NACLs are stateless; Security Groups are stateful',
      'Gateway endpoints (S3 + DynamoDB only) are FREE; Interface endpoints cost per hour',
      'Permissions Boundary = max ceiling, not a grant',
    ],
    greenFlags: ['Least privilege', 'Managed encryption', 'Private endpoints over internet'],
  },
  {
    id: 'resilient',
    label: '🛡️ Design Resilient Architectures',
    color: '#dcfce7',
    border: '#22c55e',
    weight: '26%',
    questions: 325,
    focus: [
      'Multi-AZ vs Multi-Region trade-offs',
      'RDS: Multi-AZ (failover) vs Read Replica (read scaling)',
      'Aurora: Global Database for multi-region, reader endpoint for read replicas',
      'S3: Versioning + MFA delete, Batch Replication for existing objects',
      'SQS FIFO: .fifo suffix, 3000 msg/s with batching, can\'t convert standard → FIFO',
    ],
    traps: [
      'CRR only replicates NEW objects — use S3 Batch Replication for existing',
      'Snowball → S3 first, THEN lifecycle to Glacier (can\'t go directly)',
      'Launch Configuration is legacy — always use Launch Template for mixed Spot/On-Demand',
      'SQS FIFO queue: must delete and recreate to convert from standard',
    ],
    greenFlags: ['Multi-AZ deployments', 'Managed failover', 'Decoupled with SQS/SNS'],
  },
  {
    id: 'performant',
    label: '⚡ Design High-Performing Architectures',
    color: '#fef9c3',
    border: '#eab308',
    weight: '24%',
    questions: 342,
    focus: [
      'Caching: ElastiCache (Redis/Memcached) in front of RDS, DAX for DynamoDB, CloudFront for S3',
      'Kinesis Data Streams vs Firehose: custom processing vs managed delivery',
      'Global Accelerator: static IPs, anycast routing, blue-green without DNS TTL issues',
      'Placement groups: Cluster (HPC/low latency), Spread (max 7/AZ), Partition (Hadoop/Kafka)',
      'ECS Fargate vs EC2: Fargate = pay per vCPU/memory, no cluster management',
    ],
    traps: [
      'Kinesis Enhanced Fan-Out = 2 MB/s per consumer (not shared 2 MB/s)',
      'Global Accelerator ≠ CloudFront — GA is for TCP/UDP (gaming, IoT, blue-green)',
      'Cluster placement group: all instances in ONE AZ — no HA',
      'Spread placement group: max 7 instances per AZ',
    ],
    greenFlags: ['Caching layers', 'Read replicas', 'Managed streaming services'],
  },
  {
    id: 'cost',
    label: '💰 Design Cost-Optimized Architectures',
    color: '#ffedd5',
    border: '#f97316',
    weight: '20%',
    questions: 203,
    focus: [
      'S3 storage classes: Standard → Standard-IA → One Zone-IA → Glacier — all have 30-day minimums except Standard',
      'EC2: On-Demand → Reserved (1 or 3yr) → Spot (interruptions) → Dedicated Hosts (BYOL)',
      'Compute Optimizer: ML-powered rightsizing for EC2, Lambda, EBS',
      'Shield Advanced: $3,000/month charged ONCE per org with consolidated billing',
      'AWS RAM: share subnets (not entire VPCs) across accounts',
    ],
    traps: [
      'S3 One Zone-IA = 30-day minimum — ideal for reproducible/recreatable data only',
      'Dedicated Hosts (BYOL) vs Dedicated Instances (hardware isolation, no BYOL)',
      'Compute Optimizer ≠ Cost Explorer — Optimizer uses ML, Explorer shows historical spend',
      'NAT Gateway = managed (no SG, no bastion) vs NAT Instance = self-managed (has SG)',
    ],
    greenFlags: ['Lifecycle policies', 'Spot for fault-tolerant workloads', 'Reserved for steady-state'],
  },
]

const generalTips = [
  { icon: '✅', color: '#dcfce7', label: 'Usually Correct', tips: ['Managed AWS services over self-managed', 'Automation over manual processes', 'Multi-AZ for availability', 'Least privilege for security', 'Decoupled architectures (SQS/SNS)'] },
  { icon: '❌', color: '#fee2e2', label: 'Usually Wrong', tips: ['Hardcoded credentials (use IAM roles)', 'Making resources public when private works', 'Over-engineered solutions when simple works', 'Manual processes that can be automated', 'Single-AZ for production workloads'] },
]

export default function StudyGuide() {
  return (
    <Layout>
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '2rem 1rem' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{ display: 'inline-block', background: '#eff6ff', color: '#1d4ed8', padding: '4px 14px', borderRadius: '20px', fontSize: '13px', fontWeight: 600, marginBottom: '1rem' }}>
            SAA-C03 SMART STUDY GUIDE
          </div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#111827', marginBottom: '0.5rem' }}>
            Domain Strategy & What to Focus On
          </h1>
          <p style={{ color: '#6b7280', fontSize: '1rem', marginBottom: '0.75rem' }}>
            Based on analysis of 1,098 real exam questions — know your weights, avoid the traps.
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '999px', padding: '4px 14px', fontSize: '0.78rem', fontWeight: 700, color: '#16a34a' }}>
              ✅ 1,098 scenario-based SAA-C03 questions with detailed explanations
            </div>
          </div>
        </div>

        {/* Domain weight bar */}
        <div style={{ background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '1.25rem', marginBottom: '2rem' }}>
          <div style={{ fontWeight: 700, fontSize: '14px', color: '#374151', marginBottom: '0.75rem' }}>Exam Weight Distribution</div>
          <div style={{ display: 'flex', borderRadius: '8px', overflow: 'hidden', height: '28px' }}>
            {[
              { label: 'Secure 30%', color: '#3b82f6', flex: 30 },
              { label: 'Resilient 26%', color: '#22c55e', flex: 26 },
              { label: 'Performant 24%', color: '#eab308', flex: 24 },
              { label: 'Cost 20%', color: '#f97316', flex: 20 },
            ].map(d => (
              <div key={d.label} style={{ flex: d.flex, background: d.color, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '11px', fontWeight: 700 }}>
                {d.flex > 22 ? d.label : `${d.flex}%`}
              </div>
            ))}
          </div>
        </div>

        {/* Domain cards */}
        {domains.map(d => (
          <div key={d.id} style={{ border: `1px solid ${d.border}`, borderRadius: '14px', padding: '1.5rem', marginBottom: '1.5rem', background: '#fff' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1rem' }}>
              <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#111827', margin: 0 }}>{d.label}</h2>
              <span style={{ background: d.color, color: '#374151', padding: '2px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: 700, marginLeft: 'auto' }}>
                {d.weight} of exam · {d.questions} questions
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: '13px', color: '#374151', marginBottom: '0.5rem' }}>🎯 What to Focus On</div>
                {d.focus.map((tip, i) => (
                  <div key={i} style={{ fontSize: '13px', color: '#4b5563', padding: '4px 0', borderBottom: '1px solid #f3f4f6' }}>• {tip}</div>
                ))}
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '13px', color: '#dc2626', marginBottom: '0.5rem' }}>⚠️ Common Traps</div>
                {d.traps.map((trap, i) => (
                  <div key={i} style={{ fontSize: '13px', color: '#4b5563', padding: '4px 0', borderBottom: '1px solid #f3f4f6' }}>• {trap}</div>
                ))}
              </div>
            </div>

            <div style={{ marginTop: '1rem', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {d.greenFlags.map((flag, i) => (
                <span key={i} style={{ background: '#dcfce7', color: '#166534', padding: '3px 10px', borderRadius: '10px', fontSize: '12px', fontWeight: 500 }}>✅ {flag}</span>
              ))}
            </div>
          </div>
        ))}

        {/* General tips */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
          {generalTips.map(g => (
            <div key={g.label} style={{ background: g.color, borderRadius: '12px', padding: '1.25rem' }}>
              <div style={{ fontWeight: 700, fontSize: '14px', marginBottom: '0.75rem' }}>{g.icon} {g.label}</div>
              {g.tips.map((t, i) => (
                <div key={i} style={{ fontSize: '13px', color: '#374151', padding: '3px 0' }}>• {t}</div>
              ))}
            </div>
          ))}
        </div>

        {/* CTA */}
        <div style={{ textAlign: 'center', padding: '2rem', background: '#eff6ff', borderRadius: '14px' }}>
          <div style={{ fontWeight: 700, fontSize: '1.1rem', color: '#1d4ed8', marginBottom: '0.5rem' }}>Ready to test your knowledge?</div>
          <p style={{ color: '#6b7280', marginBottom: '1rem', fontSize: '14px' }}>Practice with 288 questions mapped to every domain</p>
          <a href="/certifications" style={{ background: '#2563eb', color: '#fff', padding: '10px 28px', borderRadius: '8px', fontWeight: 700, textDecoration: 'none', fontSize: '14px' }}>
            Start Practicing →
          </a>
        </div>
      </div>
    </Layout>
  )
}
