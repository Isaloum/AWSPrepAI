import { useState } from 'react'
import Layout from '../components/Layout'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

interface VisualQuestion {
  id: number
  cat: string
  q: string
  options: string[]
  answer: number
  explain: string
}

const visualQuestions: VisualQuestion[] = [
  { id: 1, cat: 'design-resilient', q: "A company needs to deploy a highly available web application that can handle unexpected traffic spikes. The application must distribute traffic across multiple Availability Zones and scale automatically based on demand. Which solution best meets these requirements?", options: ["A) Single EC2 instance with an Elastic IP address", "B) Auto Scaling Group behind an Application Load Balancer deployed across multiple AZs", "C) AWS Lambda with Amazon API Gateway", "D) EC2 instances in a single Availability Zone behind an Amazon CloudFront distribution"], answer: 1, explain: "An Auto Scaling Group automatically adjusts the number of EC2 instances based on demand. The Application Load Balancer distributes traffic across healthy instances in multiple Availability Zones, providing both elasticity and high availability." },
  { id: 2, cat: 'design-secure', q: "A company stores sensitive customer data in Amazon S3. A compliance requirement mandates that all data must be encrypted at rest using customer-managed keys so the company can rotate or revoke keys at any time. Which solution meets this requirement?", options: ["A) Enable S3 server-side encryption with Amazon S3-managed keys (SSE-S3)", "B) Enable S3 server-side encryption with AWS KMS customer-managed keys (SSE-KMS)", "C) Enable S3 server-side encryption with customer-provided keys (SSE-C)", "D) Enable client-side encryption before uploading to S3"], answer: 1, explain: "SSE-KMS uses AWS KMS customer-managed keys (CMKs). The company controls key rotation and can revoke access at any time via IAM policies, meeting the compliance requirement for customer-managed encryption keys." },
  { id: 3, cat: 'design-resilient', q: "A company runs a critical e-commerce application with a relational database. The application requires a recovery point objective (RPO) of 1 hour and a recovery time objective (RTO) of 15 minutes. Which solution meets these requirements at the LOWEST cost?", options: ["A) Amazon RDS Multi-AZ deployment with automated backups", "B) Amazon RDS read replica promoted on failure", "C) Amazon Aurora Global Database", "D) Amazon RDS with manual snapshots taken daily"], answer: 0, explain: "RDS Multi-AZ maintains a synchronous standby replica that can automatically fail over within minutes (RTO < 15 min). Automated backups can be configured up to every 5 minutes with Point-in-Time Recovery (RPO <= 1 hour). This is the most cost-effective solution meeting both requirements." },
  { id: 4, cat: 'design-performant', q: "A company has a web application that frequently reads the same product catalog data from an Amazon RDS MySQL database. The database is experiencing high read traffic causing slow response times. The data changes only a few times per day. Which solution improves read performance with MINIMAL application changes?", options: ["A) Add Amazon ElastiCache for Redis as a caching layer in front of RDS", "B) Create an RDS Read Replica and update the application to send reads there", "C) Migrate to Amazon DynamoDB for lower latency reads", "D) Enable RDS Performance Insights and optimize slow queries"], answer: 0, explain: "ElastiCache for Redis caches the query results in memory, reducing database load. Since the catalog data changes rarely, the cache hit rate will be very high. This provides the greatest performance improvement with minimal application changes." },
  { id: 5, cat: 'design-cost', q: "A company runs a batch processing workload every night from 10 PM to 4 AM. The workload requires significant compute capacity but can tolerate interruptions. The company wants to minimize costs. Which EC2 purchasing option should they use?", options: ["A) On-Demand Instances", "B) Reserved Instances (1-year, Standard)", "C) Spot Instances", "D) Dedicated Hosts"], answer: 2, explain: "Spot Instances offer up to 90% discount compared to On-Demand. Since the batch job runs nightly and can tolerate interruptions, Spot Instances are the most cost-effective choice." },
  { id: 6, cat: 'design-secure', q: "A company has a three-tier web application (web, app, and database tiers) running in a VPC. The security team requires that the database tier should only accept connections from the application tier and must not be directly accessible from the internet. Which architecture enforces this requirement?", options: ["A) Place all tiers in public subnets, use Security Groups to restrict database access", "B) Place the database in a private subnet, use a Security Group that allows inbound traffic only from the application tier Security Group", "C) Place the database in a public subnet, use a Network ACL to block all internet traffic to the database", "D) Place all tiers in private subnets, use a NAT Gateway for all internet traffic"], answer: 1, explain: "The database should be in a private subnet (no direct internet route) AND protected by a Security Group that only allows inbound traffic from the application tier's Security Group. Defense in depth: network isolation + access control." },
  { id: 7, cat: 'design-resilient', q: "A company needs to process messages from thousands of IoT sensors. The messages must be processed in order per sensor, and the system must retain failed messages for manual review. Which AWS service architecture meets these requirements?", options: ["A) Amazon SQS Standard Queue with Lambda consumer", "B) Amazon SQS FIFO Queue with a Dead Letter Queue and Lambda consumer", "C) Amazon SNS with Lambda subscription", "D) Amazon Kinesis Data Streams with Lambda consumer"], answer: 1, explain: "SQS FIFO queues guarantee exactly-once processing and ordering per message group (sensor ID). A Dead Letter Queue captures messages that fail after maximum retry attempts for manual review." },
  { id: 8, cat: 'design-performant', q: "A global media company serves video content to users worldwide. Users in distant regions report high latency when loading content. The company uses Amazon S3 to store the video files. Which solution reduces latency for global users with MINIMAL infrastructure changes?", options: ["A) Enable S3 Transfer Acceleration", "B) Deploy Amazon CloudFront with the S3 bucket as the origin", "C) Create S3 buckets in multiple AWS regions and use Route 53 geolocation routing", "D) Use AWS Global Accelerator to route requests to the nearest S3 endpoint"], answer: 1, explain: "CloudFront is a CDN that caches content at 400+ edge locations worldwide. Users are served from the nearest edge location instead of the S3 origin, dramatically reducing latency with minimal infrastructure changes." },
  { id: 9, cat: 'design-secure', q: "A company wants to implement centralized logging for all API calls made to AWS services across multiple AWS accounts. The logs must be stored securely in a central S3 bucket and should be tamper-proof. Which solution meets these requirements?", options: ["A) Enable AWS CloudTrail in each account and deliver logs to a central S3 bucket with S3 Object Lock enabled", "B) Enable Amazon CloudWatch Logs in each account and forward to a central account", "C) Use AWS Config to record configuration changes and store in S3", "D) Enable VPC Flow Logs in each account and deliver to a central S3 bucket"], answer: 0, explain: "CloudTrail records all API calls. S3 Object Lock in WORM (Write Once Read Many) mode prevents logs from being modified or deleted, making them tamper-proof. This is the standard solution for compliance audit trails across multiple accounts." },
  { id: 10, cat: 'design-resilient', q: "A company is designing a microservices architecture where services need to communicate asynchronously. When one service produces an event, multiple other services need to receive it independently. Which architecture pattern should be used?", options: ["A) Each service polls an Amazon SQS Standard Queue for messages", "B) Use Amazon SNS to publish events; each consuming service subscribes with its own SQS queue", "C) Services communicate directly via HTTP REST API calls", "D) Use AWS Step Functions to orchestrate service-to-service communication"], answer: 1, explain: "The SNS fan-out pattern delivers the same message to multiple SQS queues simultaneously. Each consuming service processes messages from its own queue independently, enabling loose coupling and independent scaling." },
  { id: 11, cat: 'design-cost', q: "A company stores large amounts of log files in Amazon S3. Logs are accessed frequently for the first 30 days, occasionally from day 31 to 90, and rarely after 90 days. The company wants to minimize storage costs while maintaining accessibility. Which solution is MOST cost-effective?", options: ["A) Store all logs in S3 Standard indefinitely", "B) Store logs in S3 Standard, transition to S3 Standard-IA after 30 days, then to S3 Glacier after 90 days using an S3 Lifecycle policy", "C) Store all logs in S3 Glacier from day one", "D) Store logs in S3 Standard for 30 days, then delete them"], answer: 1, explain: "S3 Lifecycle policies automate tiering: S3 Standard for frequent access, S3 Standard-IA for occasional access at lower cost, and S3 Glacier for archival storage at minimal cost. Each tier is optimized for its access pattern." },
  { id: 12, cat: 'design-performant', q: "A company runs a web application where users upload large files (up to 5 GB) directly to Amazon S3. Users complain about slow upload speeds, especially from regions far from the S3 bucket. Which solution improves upload performance?", options: ["A) Use S3 Transfer Acceleration to upload files through CloudFront edge locations", "B) Use Amazon CloudFront for uploads", "C) Use a multi-part upload with a larger part size", "D) Increase the EC2 instance size handling the upload proxy"], answer: 0, explain: "S3 Transfer Acceleration routes uploads through the nearest CloudFront edge location and then uses AWS's optimized global network backbone to reach the S3 bucket. This can improve upload speeds by up to 500% for long-distance transfers." },
  { id: 13, cat: 'design-secure', q: "A company uses AWS Lambda functions that need to access secrets stored in AWS Secrets Manager and read from an Amazon DynamoDB table. Following the principle of least privilege, how should permissions be granted to the Lambda function?", options: ["A) Embed AWS access keys in the Lambda function environment variables", "B) Create an IAM role with only the required permissions and attach it to the Lambda function as its execution role", "C) Create an IAM user with the required permissions and pass the credentials as Lambda environment variables", "D) Use the AWS root account credentials in the Lambda function"], answer: 1, explain: "IAM roles for Lambda (execution roles) provide temporary credentials automatically. The role should have only the minimum permissions needed (least privilege): SecretsManager:GetSecretValue and DynamoDB:GetItem. No credentials are stored in code." },
  { id: 14, cat: 'design-resilient', q: "A company has an application that experiences unpredictable traffic spikes. The application needs to process requests without losing any messages even during traffic spikes. Which architecture ensures no messages are lost?", options: ["A) Increase the EC2 instance size to handle the peak load", "B) Use Amazon SQS to queue requests, with Auto Scaling EC2 instances processing the queue based on queue depth", "C) Deploy the application on AWS Lambda with provisioned concurrency", "D) Use Amazon ElastiCache to buffer requests in memory"], answer: 1, explain: "SQS acts as a durable buffer that accepts all incoming requests without loss. Auto Scaling adds EC2 workers based on queue depth, ensuring messages are processed even during spikes. SQS retains messages for up to 14 days." },
  { id: 15, cat: 'design-cost', q: "A company has an Amazon RDS database that is used only during business hours (9 AM to 6 PM) on weekdays. The rest of the time, the database is idle. Which approach MOST reduces the RDS costs while keeping the database available during business hours?", options: ["A) Use a Reserved Instance to save on hourly costs", "B) Stop the RDS instance outside of business hours using AWS Systems Manager automation or a Lambda scheduled function", "C) Migrate to Amazon DynamoDB to eliminate idle time costs", "D) Enable RDS Auto Scaling to scale down to minimum capacity when idle"], answer: 1, explain: "Stopping an RDS instance when not in use pauses the instance-hour charges. During ~128 business hours per month vs. 730 total hours, this reduces compute costs by over 80%. RDS can be stopped for up to 7 days before AWS automatically restarts it." },
  { id: 16, cat: 'design-secure', q: "A company needs to allow their on-premises data center to securely access resources in an Amazon VPC. The connection must be private, not traverse the public internet, and support high bandwidth requirements. Which solution should be used?", options: ["A) AWS Site-to-Site VPN over the public internet", "B) AWS Direct Connect with a private Virtual Interface", "C) Amazon CloudFront with an origin in the VPC", "D) AWS PrivateLink to expose VPC services"], answer: 1, explain: "AWS Direct Connect provides a dedicated, private physical connection from on-premises to AWS. It does not traverse the public internet, offers consistent network performance, and supports high bandwidth (up to 100 Gbps)." },
  { id: 17, cat: 'design-performant', q: "A company is building a real-time dashboard that displays metrics from thousands of IoT devices. The data arrives continuously, and the dashboard must show near real-time aggregations. Which AWS service should be used to ingest and process the streaming data?", options: ["A) Amazon SQS Standard Queue with Lambda polling", "B) Amazon Kinesis Data Streams with Amazon Kinesis Data Analytics", "C) Amazon S3 with batch processing via AWS Glue", "D) Amazon RDS with a write-optimized instance class"], answer: 1, explain: "Kinesis Data Streams ingests high-throughput real-time data from thousands of sources. Kinesis Data Analytics processes the stream using SQL to compute real-time aggregations for the dashboard. This is the purpose-built AWS solution for real-time streaming analytics." },
  { id: 18, cat: 'design-resilient', q: "A company wants to implement a disaster recovery strategy for their AWS workload. The RTO requirement is less than 1 hour and RPO is less than 15 minutes. The company wants to minimize costs. Which DR strategy should they use?", options: ["A) Backup and Restore — take regular snapshots and restore in DR region", "B) Pilot Light — maintain a minimal version of the environment running in the DR region", "C) Warm Standby — maintain a scaled-down but fully functional environment in DR region", "D) Multi-Site Active-Active — run full production in both regions simultaneously"], answer: 2, explain: "Warm Standby keeps a scaled-down but fully functional replica running. Failover requires scaling up (not provisioning from scratch), enabling sub-1-hour RTO. Continuous data replication provides RPO < 15 minutes. More cost-effective than Multi-Site Active-Active." },
  { id: 19, cat: 'design-secure', q: "A company wants to protect their web application running behind an Application Load Balancer from SQL injection attacks and DDoS attacks. Which combination of AWS services provides this protection?", options: ["A) Amazon CloudFront with AWS Shield Standard (included free)", "B) AWS WAF on the ALB with managed rule groups, and AWS Shield Advanced", "C) Amazon GuardDuty to detect threats and alert the security team", "D) VPC Security Groups and Network ACLs to block malicious IPs"], answer: 1, explain: "AWS WAF on the ALB filters HTTP/HTTPS traffic and blocks SQL injection using managed rule groups. AWS Shield Advanced provides enhanced DDoS protection with 24/7 DDoS response team and cost protection." },
  { id: 20, cat: 'design-cost', q: "A company runs a multi-tier application with web, application, and database tiers. Usage patterns show 70% of the time the load is predictable and consistent, with occasional 30% spikes. Which EC2 purchasing strategy minimizes cost while handling all demand?", options: ["A) Use all On-Demand Instances for maximum flexibility", "B) Use Reserved Instances for the baseline 70% load, and On-Demand or Spot Instances for the spike 30%", "C) Use all Reserved Instances sized for peak load", "D) Use all Spot Instances with a Spot Fleet"], answer: 1, explain: "The optimal strategy: Reserved Instances (1-year) for the predictable 70% baseline (up to 72% savings), and On-Demand or Spot Instances for unpredictable 30% spikes. This blended approach minimizes cost while ensuring all demand is always met." },
]

const CAT_LABELS: Record<string, string> = {
  'design-resilient': 'Design Resilient Architectures',
  'design-secure': 'Design Secure Architectures',
  'design-performant': 'Design High-Performance Architectures',
  'design-cost': 'Design Cost-Optimized Architectures',
}

const CAT_COLORS: Record<string, string> = {
  'design-resilient': '#2563eb',
  'design-secure': '#dc2626',
  'design-performant': '#7c3aed',
  'design-cost': '#16a34a',
}

const ARCH_DIAGRAMS: Record<number, { label: string; nodes: { id: string; label: string; x: number; y: number; color: string }[]; arrows: { from: string; to: string }[] }> = {
  1: {
    label: 'ALB + ASG across Multi-AZ',
    nodes: [
      { id: 'users', label: 'Users', x: 200, y: 30, color: '#6b7280' },
      { id: 'alb', label: 'App Load\nBalancer', x: 200, y: 110, color: '#2563eb' },
      { id: 'ec2a', label: 'EC2\n(AZ-a)', x: 100, y: 200, color: '#2563eb' },
      { id: 'ec2b', label: 'EC2\n(AZ-b)', x: 300, y: 200, color: '#2563eb' },
      { id: 'asg', label: 'Auto Scaling\nGroup', x: 200, y: 290, color: '#16a34a' },
    ],
    arrows: [
      { from: 'users', to: 'alb' },
      { from: 'alb', to: 'ec2a' },
      { from: 'alb', to: 'ec2b' },
      { from: 'asg', to: 'ec2a' },
      { from: 'asg', to: 'ec2b' },
    ],
  },
  3: {
    label: 'RDS Multi-AZ with Automated Backups',
    nodes: [
      { id: 'app', label: 'Application', x: 200, y: 30, color: '#6b7280' },
      { id: 'rds', label: 'RDS Primary\n(AZ-a)', x: 120, y: 130, color: '#2563eb' },
      { id: 'standby', label: 'RDS Standby\n(AZ-b)', x: 280, y: 130, color: '#9ca3af' },
      { id: 's3', label: 'S3 Backups\n(PITR)', x: 200, y: 250, color: '#16a34a' },
    ],
    arrows: [
      { from: 'app', to: 'rds' },
      { from: 'rds', to: 'standby' },
      { from: 'rds', to: 's3' },
    ],
  },
  8: {
    label: 'CloudFront + S3 for Global CDN',
    nodes: [
      { id: 'users', label: 'Global Users', x: 200, y: 30, color: '#6b7280' },
      { id: 'cf', label: 'CloudFront\nEdge Locations', x: 200, y: 120, color: '#8b5cf6' },
      { id: 's3', label: 'S3 Bucket\n(Origin)', x: 200, y: 230, color: '#16a34a' },
    ],
    arrows: [
      { from: 'users', to: 'cf' },
      { from: 'cf', to: 's3' },
    ],
  },
}

function ArchDiagram({ questionId }: { questionId: number }) {
  const diagram = ARCH_DIAGRAMS[questionId]
  if (!diagram) return null

  return (
    <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px', marginBottom: '20px' }}>
      <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#94a3b8', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
        Correct Architecture: {diagram.label}
      </div>
      <svg width="400" height="320" viewBox="0 0 400 320" style={{ width: '100%', height: 'auto', maxHeight: '260px' }}>
        {/* Arrows */}
        {diagram.arrows.map((arrow, i) => {
          const from = diagram.nodes.find(n => n.id === arrow.from)!
          const to = diagram.nodes.find(n => n.id === arrow.to)!
          return (
            <line
              key={i}
              x1={from.x} y1={from.y + 24}
              x2={to.x} y2={to.y - 10}
              stroke="#cbd5e1" strokeWidth="1.5"
              markerEnd="url(#arrow)"
            />
          )
        })}
        <defs>
          <marker id="arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
            <path d="M0,0 L0,6 L9,3 z" fill="#94a3b8" />
          </marker>
        </defs>
        {/* Nodes */}
        {diagram.nodes.map(node => (
          <g key={node.id}>
            <rect x={node.x - 45} y={node.y - 14} width="90" height="40" rx="8"
              fill={`${node.color}18`} stroke={node.color} strokeWidth="1.5" />
            {node.label.split('\n').map((line, li) => (
              <text key={li} x={node.x} y={node.y + (li * 14) + 2} textAnchor="middle"
                fontSize="11" fill={node.color} fontWeight="600">
                {line}
              </text>
            ))}
          </g>
        ))}
      </svg>
    </div>
  )
}

export default function VisualExam() {
  const { user, tier } = useAuth()
  const navigate = useNavigate()
  const isPremium = tier === 'monthly' || tier === 'yearly' || tier === 'lifetime'
  const [filter, setFilter] = useState('all')
  const [current, setCurrent] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [answered, setAnswered] = useState(false)
  const [answers, setAnswers] = useState<Record<number, { userAnswer: number; isCorrect: boolean }>>({})
  const [done, setDone] = useState(false)

  const filtered = filter === 'all' ? visualQuestions : visualQuestions.filter(q => q.cat === filter)
  const q = filtered[current]
  const score = Object.values(answers).filter(a => a.isCorrect).length
  const totalAnswered = Object.keys(answers).length

  function handleSelect(idx: number) {
    if (answered) return
    setSelected(idx)
  }

  function handleSubmit() {
    if (selected === null || !q) return
    const isCorrect = selected === q.answer
    setAnswered(true)
    setAnswers(prev => ({ ...prev, [q.id]: { userAnswer: selected, isCorrect } }))
  }

  function handleNext() {
    if (current < filtered.length - 1) {
      const next = filtered[current + 1]
      const prev = answers[next.id]
      setCurrent(current + 1)
      if (prev) { setSelected(prev.userAnswer); setAnswered(true) }
      else { setSelected(null); setAnswered(false) }
    } else {
      setDone(true)
    }
  }

  function handlePrev() {
    if (current > 0) {
      const prev2 = filtered[current - 1]
      const prevAns = answers[prev2.id]
      setCurrent(current - 1)
      if (prevAns) { setSelected(prevAns.userAnswer); setAnswered(true) }
      else { setSelected(null); setAnswered(false) }
    }
  }

  function handleRestart() {
    setCurrent(0); setSelected(null); setAnswered(false); setAnswers({}); setDone(false)
  }

  if (!isPremium) {
    return (
      <Layout>
        <div style={{ background: '#f8fafc', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
          <div style={{ background: '#fff', borderRadius: '20px', padding: '48px', maxWidth: '480px', width: '100%', textAlign: 'center', boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '16px' }}>🔐</div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', margin: '0 0 8px' }}>Visual Exam requires a subscription</h2>
            <p style={{ color: '#64748b', marginBottom: '8px' }}>20 diagram-based SAA-C03 questions with architecture explanations.</p>
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

  if (done) {
    const pct = Math.round((score / filtered.length) * 100)
    return (
      <Layout>
        <div style={{ background: '#f8fafc', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
          <div style={{ background: '#fff', borderRadius: '20px', padding: '48px', maxWidth: '540px', width: '100%', textAlign: 'center', boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}>
            <div style={{ fontSize: '3rem', marginBottom: '16px' }}>{pct >= 80 ? '🎉' : pct >= 60 ? '📚' : '💪'}</div>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a', margin: '0 0 8px' }}>Visual Exam Complete!</h2>
            <div style={{ fontSize: '3.5rem', fontWeight: 900, color: pct >= 80 ? '#16a34a' : pct >= 60 ? '#2563eb' : '#dc2626', margin: '16px 0' }}>
              {score}/{filtered.length}
            </div>
            <p style={{ color: '#64748b', marginBottom: '32px' }}>
              {pct >= 80 ? 'Excellent! You understand AWS architectures well.' : pct >= 60 ? 'Good effort. Review the architecture diagrams you missed.' : 'Keep practicing — architecture questions are key to the SAA exam.'}
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button onClick={handleRestart} style={{ padding: '12px 24px', borderRadius: '10px', background: '#f1f5f9', color: '#475569', border: 'none', fontWeight: 700, cursor: 'pointer' }}>Try Again</button>
              <button onClick={() => navigate('/cert/saa-c03')} style={{ padding: '12px 24px', borderRadius: '10px', background: '#2563eb', color: '#fff', border: 'none', fontWeight: 700, cursor: 'pointer' }}>Practice Quiz</button>
            </div>
          </div>
        </div>
      </Layout>
    )
  }

  if (!q) return null

  return (
    <Layout>
      <div style={{ background: '#f8fafc', minHeight: '100vh', padding: '40px 20px' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>

          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '28px' }}>
            <div style={{ display: 'inline-block', background: '#faf5ff', color: '#7e22ce', padding: '4px 14px', borderRadius: '999px', fontSize: '0.8rem', fontWeight: 700, marginBottom: '10px', letterSpacing: '0.05em' }}>
              VISUAL EXAM · SAA-C03
            </div>
            <h1 style={{ fontSize: '1.7rem', fontWeight: 800, color: '#0f172a', margin: '0 0 6px' }}>Architecture-Based Questions</h1>
            <p style={{ color: '#64748b', margin: 0 }}>20 questions · Diagram explanations for correct answers</p>
          </div>

          {/* Category filter */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '20px' }}>
            {['all', 'design-resilient', 'design-secure', 'design-performant', 'design-cost'].map(cat => (
              <button
                key={cat}
                onClick={() => { setFilter(cat); setCurrent(0); setSelected(null); setAnswered(false) }}
                style={{
                  padding: '5px 14px', borderRadius: '999px', fontSize: '0.8rem', fontWeight: 600,
                  border: '1px solid', cursor: 'pointer',
                  background: filter === cat ? '#7e22ce' : '#fff',
                  color: filter === cat ? '#fff' : '#64748b',
                  borderColor: filter === cat ? '#7e22ce' : '#e2e8f0',
                }}
              >
                {cat === 'all' ? 'All' : CAT_LABELS[cat]?.replace('Design ', '')}
              </button>
            ))}
          </div>

          {/* Progress */}
          <div style={{ background: '#e2e8f0', borderRadius: '999px', height: '6px', marginBottom: '8px' }}>
            <div style={{ background: '#7c3aed', height: '6px', borderRadius: '999px', width: `${((current + 1) / filtered.length) * 100}%`, transition: 'width 0.3s' }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', color: '#94a3b8', marginBottom: '24px' }}>
            <span>Question {current + 1} of {filtered.length}</span>
            <span>Score: {score}/{totalAnswered}</span>
          </div>

          {/* Question card */}
          <div style={{ background: '#fff', borderRadius: '16px', padding: '28px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', marginBottom: '16px' }}>
            <div style={{ display: 'inline-block', background: `${CAT_COLORS[q.cat]}15`, color: CAT_COLORS[q.cat], padding: '4px 12px', borderRadius: '999px', fontSize: '0.78rem', fontWeight: 700, marginBottom: '16px' }}>
              {CAT_LABELS[q.cat]}
            </div>

            {/* Architecture diagram preview — always visible */}
            {ARCH_DIAGRAMS[q.id] && !answered && (
              <div style={{ marginBottom: '20px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px' }}>
                <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#7c3aed', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>📐 Architecture Diagram</div>
                <ArchDiagram questionId={q.id} />
              </div>
            )}

            <p style={{ fontSize: '1rem', fontWeight: 600, color: '#1e293b', lineHeight: '1.6', margin: '0 0 20px' }}>
              {q.q}
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {q.options.map((opt, idx) => {
                let bg = '#f8fafc', border = '#e2e8f0', color = '#1e293b'
                if (answered) {
                  if (idx === q.answer) { bg = '#f0fdf4'; border = '#86efac'; color = '#15803d' }
                  else if (idx === selected && idx !== q.answer) { bg = '#fef2f2'; border = '#fca5a5'; color = '#b91c1c' }
                } else if (selected === idx) { bg = '#faf5ff'; border = '#c4b5fd'; color = '#7e22ce' }

                return (
                  <div key={idx} onClick={() => handleSelect(idx)} style={{
                    display: 'flex', alignItems: 'flex-start', gap: '12px', padding: '14px 16px',
                    borderRadius: '10px', background: bg, border: `1.5px solid ${border}`,
                    cursor: answered ? 'default' : 'pointer', transition: 'all 0.15s', color
                  }}>
                    <span style={{
                      width: '26px', height: '26px', borderRadius: '50%', flexShrink: 0,
                      background: answered && idx === q.answer ? '#16a34a' : answered && idx === selected ? '#dc2626' : selected === idx ? '#7c3aed' : '#e2e8f0',
                      color: (answered || selected === idx) ? '#fff' : '#94a3b8',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.78rem'
                    }}>
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span style={{ lineHeight: '1.5', fontSize: '0.93rem', paddingTop: '3px' }}>{opt}</span>
                    {answered && idx === q.answer && <span style={{ marginLeft: 'auto', color: '#16a34a', flexShrink: 0 }}>✓</span>}
                    {answered && idx === selected && idx !== q.answer && <span style={{ marginLeft: 'auto', color: '#dc2626', flexShrink: 0 }}>✗</span>}
                  </div>
                )
              })}
            </div>

            {answered && (
              <div style={{ marginTop: '20px' }}>
                {ARCH_DIAGRAMS[q.id] && <ArchDiagram questionId={q.id} />}
                <div style={{
                  padding: '16px', borderRadius: '10px',
                  background: answers[q.id]?.isCorrect ? '#f0fdf4' : '#fef2f2',
                  border: `1px solid ${answers[q.id]?.isCorrect ? '#86efac' : '#fca5a5'}`
                }}>
                  <div style={{ fontWeight: 700, color: answers[q.id]?.isCorrect ? '#15803d' : '#b91c1c', marginBottom: '6px' }}>
                    {answers[q.id]?.isCorrect ? '✅ Correct!' : '❌ Incorrect'}
                  </div>
                  <p style={{ color: '#374151', margin: 0, fontSize: '0.9rem', lineHeight: '1.6' }}>{q.explain}</p>
                </div>
              </div>
            )}
          </div>

          {/* Nav */}
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px' }}>
            <button onClick={handlePrev} disabled={current === 0} style={{ padding: '10px 20px', borderRadius: '10px', border: '1px solid #e2e8f0', background: '#fff', color: current === 0 ? '#cbd5e1' : '#475569', fontWeight: 600, cursor: current === 0 ? 'default' : 'pointer' }}>
              ← Previous
            </button>
            {!answered ? (
              <button onClick={handleSubmit} disabled={selected === null} style={{ padding: '10px 28px', borderRadius: '10px', border: 'none', background: selected === null ? '#e2e8f0' : '#7c3aed', color: selected === null ? '#94a3b8' : '#fff', fontWeight: 700, cursor: selected === null ? 'default' : 'pointer' }}>
                Submit Answer
              </button>
            ) : (
              <button onClick={handleNext} style={{ padding: '10px 28px', borderRadius: '10px', border: 'none', background: '#7c3aed', color: '#fff', fontWeight: 700, cursor: 'pointer' }}>
                {current < filtered.length - 1 ? 'Next →' : 'See Results'}
              </button>
            )}
          </div>

        </div>
      </div>
    </Layout>
  )
}
