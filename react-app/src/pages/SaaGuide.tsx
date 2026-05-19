/**
 * SaaGuide.tsx — The Complete SAA-C03 Study Encyclopedia
 * Tabs: Decision Matrix · Exam Traps · Deep Dives · Study Plan · Quick Reference · Exam Strategy
 * isPremium gate. SAA-C03 exclusive.
 */
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import { useAuth } from '../contexts/AuthContext'
import { useCertAccess } from '../hooks/useCertAccess'

type Tab = 'matrix' | 'traps' | 'deepdives' | 'studyplan' | 'reference' | 'strategy' | 'numbers' | 'codex'

// ─── DECISION MATRIX ─────────────────────────────────────────────────────────
interface MatrixRow { requirement: string; solution: string; why: string }

const MATRIX: MatrixRow[] = [
  { requirement: 'Global low latency for static content', solution: 'CloudFront', why: 'Caches at 400+ Edge Locations closest to users. HTTP/HTTPS only.' },
  { requirement: 'Decouple components asynchronously', solution: 'SQS', why: 'Queue buffers messages; producers and consumers operate independently.' },
  { requirement: 'Fan-out notifications to many subscribers', solution: 'SNS + SQS', why: 'SNS Pub/Sub pushes to Email, SMS, Lambda, SQS simultaneously.' },
  { requirement: 'High availability for RDS — automatic failover', solution: 'RDS Multi-AZ', why: 'Synchronous standby in another AZ. Auto-failover < 2 mins. NOT for reads.' },
  { requirement: 'Scale READ traffic for RDS', solution: 'Read Replicas', why: 'Asynchronous copies. Offload SELECT queries. Multi-AZ does NOT serve reads.' },
  { requirement: 'Temporary credentials for EC2 to access AWS', solution: 'IAM Role', why: 'Secure, auto-rotating. Never store access keys on EC2 instances.' },
  { requirement: 'Block a specific malicious IP address', solution: 'NACL Deny rule', why: 'Only NACLs support explicit Deny. Security Groups are allow-only.' },
  { requirement: 'Stateful instance-level firewall', solution: 'Security Group', why: 'Remembers connection state. Return traffic automatically allowed.' },
  { requirement: 'Private subnet instances need internet (outbound only)', solution: 'NAT Gateway in public subnet', why: 'Allows outbound. Blocks inbound. Must live in public subnet.' },
  { requirement: 'Encrypted tunnel to on-premises (fast setup)', solution: 'Site-to-Site VPN', why: 'IPSec over public internet. Minutes to set up. Variable latency.' },
  { requirement: 'Dedicated low-latency connection to on-premises', solution: 'AWS Direct Connect', why: 'Private fiber. Consistent latency. NOT encrypted by default — add VPN for encryption.' },
  { requirement: 'Fastest EBS disk I/O for databases', solution: 'io2 Block Express', why: 'Highest IOPS (256,000) and lowest latency. For mission-critical DBs.' },
  { requirement: 'Cheapest storage for 10-year archives', solution: 'S3 Glacier Deep Archive', why: 'Pennies per GB/month. 12+ hour retrieval. Lowest cost storage on AWS.' },
  { requirement: 'Run code without managing servers', solution: 'AWS Lambda', why: 'Serverless. Pay per request + duration. Max 15 min. Event-driven.' },
  { requirement: 'Managed container orchestration, no EC2 management', solution: 'ECS or EKS with Fargate', why: 'Fargate = serverless containers. AWS manages underlying infrastructure.' },
  { requirement: 'Analyze petabytes of data in S3 with SQL', solution: 'Amazon Athena', why: 'Serverless. Query S3 directly. Pay per query. No infrastructure.' },
  { requirement: 'Real-time streaming data — multiple consumers', solution: 'Kinesis Data Streams', why: 'Multiple consumers can read same stream independently. Replay supported.' },
  { requirement: 'Stream data to S3/Redshift — no management', solution: 'Kinesis Data Firehose', why: 'Fully managed delivery. Near real-time. No shards to manage.' },
  { requirement: 'Migrate TB/PB of data offline to AWS', solution: 'AWS Snowball', why: 'Physical device. Faster and cheaper than internet for large datasets.' },
  { requirement: 'Shared file system for Linux EC2 instances', solution: 'EFS', why: 'NFS protocol. Multi-AZ. Auto-scales. Thousands of concurrent EC2s.' },
  { requirement: 'Shared file system for Windows EC2 instances', solution: 'FSx for Windows File Server', why: 'SMB protocol. Active Directory integration. Windows-native.' },
  { requirement: 'DDoS protection', solution: 'AWS Shield', why: 'Standard (free, automatic) and Advanced (paid, 24/7 DRT, $3,000/month).' },
  { requirement: 'WAF — block SQL injection and XSS', solution: 'AWS WAF', why: 'Layer 7 rules. Integrates with ALB, CloudFront, API Gateway.' },
  { requirement: 'Global TCP/UDP low latency — static IP required', solution: 'Global Accelerator', why: 'Routes over AWS backbone. 2 static Anycast IPs. NOT a CDN — no caching.' },
  { requirement: 'Store DB password with automatic rotation', solution: 'AWS Secrets Manager', why: 'Native rotation for RDS, Redshift, DocumentDB. ~$0.40/secret/month.' },
  { requirement: 'Store app config values for free', solution: 'SSM Parameter Store (Standard)', why: 'Free for standard params. No native auto-rotation. Good for non-secret config.' },
  { requirement: 'SSH to EC2 without bastion host or port 22', solution: 'Systems Manager Session Manager', why: 'No open ports. Full CloudTrail audit. Works through SSM Agent on EC2.' },
  { requirement: 'Connect many VPCs + on-prem — hub model', solution: 'Transit Gateway', why: 'Hub-and-spoke. Transitive routing. 10 VPCs = 10 attachments, not 45 peering connections.' },
  { requirement: 'Expose VPC service to other VPCs without peering', solution: 'VPC PrivateLink', why: 'No peering, IGW, or public internet. Traffic stays on AWS network.' },
  { requirement: 'Send 10% of traffic to new app version', solution: 'Route 53 Weighted Routing', why: 'Assign numeric weights. Perfect for blue/green and A/B testing.' },
  { requirement: 'Automatic DNS failover to backup site', solution: 'Route 53 Failover Routing', why: 'Health check primary. Auto-route to secondary on failure. Active-passive.' },
  { requirement: 'Route users to lowest-latency AWS region', solution: 'Route 53 Latency Routing', why: 'Measured network latency, not geographic distance. User in EU may go to us-east-1.' },
  { requirement: 'Restrict access by country (compliance)', solution: 'Route 53 Geolocation Routing', why: 'Route by country/continent. Must have Default record or unmatched queries fail.' },
  { requirement: 'On-premises SFTP upload directly to S3', solution: 'AWS Transfer Family', why: 'Managed SFTP/FTP server backed by S3/EFS. No code changes for partners.' },
  { requirement: 'Migrate files from on-prem NAS to S3/EFS online', solution: 'AWS DataSync', why: 'Scheduled/one-time sync. 10x faster than open-source tools. Agent on-prem.' },
  { requirement: 'Speed up S3 uploads from globally distributed users', solution: 'S3 Transfer Acceleration', why: 'Users upload to nearest CloudFront edge → AWS backbone → S3 bucket.' },
  { requirement: 'Coordinate multiple Lambda functions with retries', solution: 'AWS Step Functions', why: 'Visual state machine. Handles retries, branching, parallel execution, error catching.' },
  { requirement: 'In-memory caching for DynamoDB (microseconds)', solution: 'DAX (DynamoDB Accelerator)', why: 'Purpose-built cache for DynamoDB. 10x speedup. API-compatible — no code change.' },
  { requirement: 'Cache RDS query results to reduce DB load', solution: 'ElastiCache (Redis or Memcached)', why: 'Cache identical query results. Redis for persistence/failover, Memcached for simplicity.' },

  // ── EXAM-CRITICAL GAPS ──────────────────────────────────────────────────────
  { requirement: 'Grant cross-account AWS access securely', solution: 'IAM Role with Trust Policy + sts:AssumeRole', why: 'Step 1: Account A creates a Role with Trust Policy allowing Account B principal. Step 2: Account B user has identity policy permitting sts:AssumeRole on that Role ARN. Two-step dance.' },
  { requirement: 'Add user sign-up/sign-in to application (JWT tokens)', solution: 'Cognito User Pool', why: 'Full identity provider. Manages sign-up, sign-in, MFA, password policies. Returns JWT tokens (ID, Access, Refresh). Does NOT grant AWS service access directly.' },
  { requirement: 'Grant app users temporary AWS credentials (e.g., upload to S3 directly)', solution: 'Cognito Identity Pool (Federated Identities)', why: 'Exchanges JWT (from User Pool, Google, SAML) for temporary IAM credentials via STS. Lets unauthenticated or authenticated users call AWS services directly from client.' },
  { requirement: 'Run real Microsoft Active Directory in AWS — trusts with on-premises AD', solution: 'AWS Managed Microsoft AD', why: 'Full AD in AWS. Supports trusts with on-premises AD, Group Policy, RADIUS MFA. Use for hybrid AD scenarios.' },
  { requirement: 'Authenticate AWS users against existing on-premises AD (proxy only)', solution: 'AD Connector', why: 'Redirects authentication requests to your on-prem AD. No local AD directory in AWS. Requires working on-prem AD. Lowest cost of the three.' },
  { requirement: 'Cheap LDAP-compatible directory — no on-premises AD, no trusts needed', solution: 'Simple AD (Samba 4)', why: 'Samba 4 compatible. Supports basic AD features. Cannot trust with on-prem AD. Cheapest option. Not Microsoft AD.' },
  { requirement: 'Aurora — route all write operations to the primary writer', solution: 'Aurora Cluster Endpoint', why: 'Always points to current writer instance. Auto-updated on failover. Use for INSERT/UPDATE/DELETE.' },
  { requirement: 'Aurora — auto load-balance read traffic across all replicas', solution: 'Aurora Reader Endpoint', why: 'Single DNS name that distributes reads across all read replicas. Not granular — all replicas are pooled.' },
  { requirement: 'Aurora — route reads to a specific subset of replica types', solution: 'Aurora Custom Endpoint', why: 'You define a named subset of instances (e.g., db.r5.4xlarge only). Useful for analytics queries that need larger instances without affecting regular read traffic.' },
  { requirement: 'Modify CloudFront request/response at the edge (nearest PoP)', solution: 'Lambda@Edge', why: 'Runs at CloudFront edge locations. Four trigger points: Viewer Request (before cache), Origin Request (after cache miss), Origin Response (before caching response), Viewer Response (before returning to user).' },

  // ── MEDIUM PRIORITY GAPS ────────────────────────────────────────────────────
  { requirement: 'Immutable, cryptographically verifiable ledger (tamper-proof history)', solution: 'Amazon QLDB', why: 'Ledger DB with a complete, append-only journal. Every change is cryptographically hashed. Use for financial records, supply chain, any system of record requiring proof of immutability.' },
  { requirement: 'IoT and operational time-series data — trillions of events/day', solution: 'Amazon Timestream', why: 'Purpose-built time-series DB. Automatically scales, tiered storage (hot/warm/cold). Built-in time-series analytics functions. Faster and cheaper than relational for time-ordered data.' },
  { requirement: 'Create and manage blockchain networks (Hyperledger Fabric or Ethereum)', solution: 'Amazon Managed Blockchain', why: 'Managed blockchain for decentralised, multi-party applications. Supports Hyperledger Fabric (private permissioned) and Ethereum (public). Different from QLDB — blockchain is decentralised, QLDB is centralised.' },
  { requirement: 'Monitor OS-level metrics (CPU per process, memory, disk) on RDS', solution: 'RDS Enhanced Monitoring', why: 'Installs an agent on the DB instance that reports OS-level metrics — CPU usage per process, free memory, disk I/O. Standard CloudWatch only gives hypervisor-level metrics, not per-process.' },
  { requirement: 'Fast EC2 boot from saved state — resume exactly where left off', solution: 'EC2 Hibernate', why: 'Saves RAM contents to encrypted EBS root volume. Boot time is much faster than cold start. Must be enabled at launch. RAM must be < 150 GB. Cannot hibernate longer than 60 days.' },
  { requirement: 'Automate the creation of custom, up-to-date AMIs on a schedule', solution: 'EC2 Image Builder', why: 'Managed pipeline for building, testing, and distributing AMIs (and container images). Applies patches, runs tests, rotates images. Eliminates manual AMI maintenance.' },
  { requirement: 'Automate EBS snapshot creation, retention, and deletion on a schedule', solution: 'EBS Data Lifecycle Manager (DLM)', why: 'Create lifecycle policies that automatically snapshot EBS volumes and AMIs, enforce retention periods, and delete old snapshots. The managed alternative to scripting cron + AWS CLI.' },
  { requirement: 'Per-application access to EFS with enforced user identity and root directory', solution: 'EFS Access Points', why: 'An access point enforces a specific POSIX user/group and restricts visibility to a named root directory within the file system. Multiple containers can share one EFS with isolated namespaces.' },
  { requirement: 'Managed file system for apps requiring NetApp ONTAP features (iSCSI, NFS, SMB)', solution: 'FSx for NetApp ONTAP', why: 'Full ONTAP data management: snapshots, clones, SnapMirror replication, tiering to S3. Supports iSCSI, NFS, and SMB simultaneously. For lift-and-shift of NetApp-dependent workloads.' },
  { requirement: 'Outbound-only internet for IPv6 private instances (IPv4 equivalent of NAT)', solution: 'Egress-Only Internet Gateway', why: 'Allows IPv6 instances to initiate outbound connections to the internet. Blocks all inbound-initiated IPv6 traffic. NAT Gateway is for IPv4 — Egress-Only IGW is the IPv6 equivalent.' },
  { requirement: 'Connect on-premises network to Transit Gateway via Direct Connect', solution: 'Direct Connect Transit VIF (Virtual Interface)', why: 'A Transit Virtual Interface on a Direct Connect connection attaches to a Transit Gateway, giving your on-prem network access to all VPCs attached to that TGW — single DX connection to many VPCs.' },
  { requirement: 'Deliver SNS messages only to subscribers matching specific attributes', solution: 'SNS Message Filtering (Filter Policy)', why: 'Each SNS subscription can define a JSON filter policy. Only messages whose MessageAttributes match the policy are delivered. Eliminates fan-out-then-filter Lambda functions.' },
  { requirement: 'Migrate heterogeneous database (Oracle → Aurora) — schema conversion', solution: 'AWS Schema Conversion Tool (SCT) + DMS', why: 'SCT converts source schema (tables, indexes, views, stored procedures) to target-compatible format for heterogeneous migrations. DMS then migrates the data. SCT is not needed for homogeneous migrations (MySQL → MySQL).' },
  { requirement: 'Personalised view of AWS service health events affecting your account', solution: 'AWS Health Dashboard (with EventBridge)', why: 'Shows operational issues, scheduled maintenance, and account-specific alerts. Integrate with EventBridge to trigger Lambda/SNS notifications automatically on health events affecting your resources.' },
  { requirement: 'Track migration progress across multiple tools and servers in one place', solution: 'AWS Migration Hub', why: 'Central dashboard showing migration status from DMS, Server Migration Service, CloudEndure, and partners. Drill into server-level progress. Pair with Application Discovery Service for pre-migration planning.' },
  { requirement: 'Collect on-premises server specs, performance, and dependencies before migrating', solution: 'AWS Application Discovery Service', why: 'Agentless (VMware) or agent-based discovery. Collects CPU, RAM, disk, network, and process dependency data. Feeds into Migration Hub to group servers into applications and estimate cloud sizing.' },
]

// ─── EXAM TRAPS ───────────────────────────────────────────────────────────────
interface Trap {
  title: string; icon: string; trigger: string
  wrong: string; wrongWhy: string
  correct: string; correctWhy: string; tip: string
}

const TRAPS: Trap[] = [
  {
    title: 'Multi-AZ does NOT serve reads',
    icon: '🗄️',
    trigger: '"Improve RDS performance" or "too many read queries slowing DB"',
    wrong: 'Enable RDS Multi-AZ',
    wrongWhy: 'Multi-AZ standby is completely inaccessible for reads. It only exists for failover. You cannot route any traffic to it.',
    correct: 'Create RDS Read Replicas',
    correctWhy: 'Read Replicas receive async copies and can serve SELECT queries, offloading read pressure from the primary instance.',
    tip: 'Multi-AZ = High Availability (DR/failover). Read Replicas = Performance (read scaling). These solve different problems and are never interchangeable on the exam.',
  },
  {
    title: 'Security Groups cannot Deny — only NACLs can',
    icon: '🛡️',
    trigger: '"Block a specific IP address" or "deny traffic from CIDR range"',
    wrong: 'Add a Deny rule to the Security Group',
    wrongWhy: 'Security Groups are allow-only. There is no Deny rule option. All traffic that does not match an allow rule is implicitly denied.',
    correct: 'Add a Deny rule to the Network ACL',
    correctWhy: 'NACLs support explicit Allow AND Deny rules, processed in numeric order. Block the IP at the subnet boundary.',
    tip: 'SG = stateful (return traffic auto-allowed), allow-only, instance level. NACL = stateless (must allow both directions), allow+deny, subnet level.',
  },
  {
    title: 'Direct Connect is NOT encrypted by default',
    icon: '🔌',
    trigger: '"Dedicated private connection with encryption"',
    wrong: 'AWS Direct Connect alone',
    wrongWhy: 'Direct Connect provides a dedicated private fiber connection but the traffic is NOT encrypted. It is private but not secured.',
    correct: 'Direct Connect + Site-to-Site VPN (IPSec over DX)',
    correctWhy: 'Run an IPSec VPN tunnel over the Direct Connect connection to get both consistent dedicated bandwidth AND encryption.',
    tip: 'Any question mentioning both "dedicated/consistent" AND "encrypted" → DX + VPN. DX alone = private. VPN alone = encrypted but variable latency.',
  },
  {
    title: 'S3 One Zone-IA is risky for legally required data',
    icon: '🪣',
    trigger: '"Legal retention", "compliance", or "regulatory" with S3 storage',
    wrong: 'S3 One Zone-IA to save costs on compliance data',
    wrongWhy: 'One Zone-IA stores data in a SINGLE AZ. If that AZ fails, the data is permanently and irrecoverably lost.',
    correct: 'S3 Standard-IA or S3 Glacier (multi-AZ)',
    correctWhy: 'Both replicate across 3+ AZs. Legal and compliance data must survive AZ failures. Never One Zone-IA for irreplaceable data.',
    tip: 'One Zone-IA is ONLY appropriate for reproducible data (thumbnails, transcoded media) or secondary backups. Any mention of "compliance" or "legal" eliminates it.',
  },
  {
    title: 'Spot Instances can be interrupted — not for critical workloads',
    icon: '💸',
    trigger: '"Most cost-effective" for stateful, critical, or DB workloads',
    wrong: 'Spot Instances for production database or payment processing',
    wrongWhy: 'AWS can terminate Spot Instances with a 2-minute warning when EC2 capacity is reclaimed. Data loss and downtime for stateful apps.',
    correct: 'Reserved Instances or Savings Plans for steady-state; On-Demand for critical unpredictable',
    correctWhy: 'Reserved Instances give up to 72% discount with guaranteed capacity. Savings Plans are flexible across instance families.',
    tip: 'Spot = stateless, fault-tolerant, flexible (batch, rendering, big data). If the word "database", "payment", "critical", or "stateful" appears → eliminate Spot.',
  },
  {
    title: 'Geolocation ≠ Latency-based routing',
    icon: '🌍',
    trigger: '"Route based on user location" vs "route to fastest region"',
    wrong: 'Geolocation routing for performance optimization',
    wrongWhy: 'Geolocation routes based on WHERE the user is (country/continent/state). It does NOT consider network latency or connection speed.',
    correct: 'Latency routing for performance, Geolocation for compliance/content control',
    correctWhy: 'Latency routing measures actual network latency to AWS regions. A user in London might go to us-east-1 if latency is lower there.',
    tip: '"Users in Germany MUST always use EU servers" → Geolocation (compliance). "Route users to the fastest region" → Latency (performance). "Must" = Geolocation.',
  },
  {
    title: 'Cannot encrypt existing RDS instance in-place',
    icon: '🔐',
    trigger: '"Enable encryption on existing unencrypted RDS instance"',
    wrong: 'Enable encryption on the running RDS instance via console',
    wrongWhy: 'RDS encryption must be set at creation time. You cannot toggle encryption on an existing instance — the option does not exist.',
    correct: 'Snapshot → copy snapshot with encryption → restore to new instance → update endpoint',
    correctWhy: 'AWS documented migration path. Take snapshot, copy it enabling encryption, restore from encrypted snapshot, then do cutover.',
    tip: 'Same applies to EBS: cannot encrypt existing volume. Create snapshot → copy with encryption → restore. Also: cannot create encrypted Read Replica from unencrypted source DB.',
  },
  {
    title: 'NAT Gateway must be in the PUBLIC subnet',
    icon: '🔀',
    trigger: 'Private subnet instances need internet access',
    wrong: 'Place NAT Gateway in the private subnet',
    wrongWhy: 'NAT Gateway itself needs internet access (to forward traffic) so it must have a route to an Internet Gateway — which means public subnet.',
    correct: 'NAT Gateway in PUBLIC subnet; private subnet route table points to NAT GW',
    correctWhy: 'Traffic flow: Private EC2 → NAT GW (public subnet) → IGW → Internet. For AZ resilience: one NAT GW per AZ.',
    tip: 'For high availability: one NAT Gateway PER Availability Zone. A single NAT GW is a single point of failure for private subnets in other AZs.',
  },
  {
    title: 'CloudFront ≠ Global Accelerator',
    icon: '⚡',
    trigger: '"Fixed IP addresses" or "TCP/UDP" or "gaming/IoT" or "non-HTTP"',
    wrong: 'CloudFront for non-HTTP apps or when static IPs are required',
    wrongWhy: 'CloudFront is HTTP/HTTPS only. IPs are dynamic (DNS-based). Cannot handle raw TCP/UDP traffic.',
    correct: 'Global Accelerator for TCP/UDP, static IPs, or non-cacheable dynamic content',
    correctWhy: 'Global Accelerator provides 2 static Anycast IPs and routes TCP/UDP over AWS backbone to your endpoints.',
    tip: '"Whitelist IPs at corporate firewall" → Global Accelerator (static IPs). "Cache images globally" → CloudFront. "Gaming/VoIP/IoT" → Global Accelerator.',
  },
  {
    title: 'Parameter Store cannot auto-rotate secrets',
    icon: '🔑',
    trigger: '"Automatically rotate database credentials every N days"',
    wrong: 'AWS Systems Manager Parameter Store with SecureString',
    wrongWhy: 'Parameter Store has no native rotation capability. You would need to build custom Lambda rotation logic entirely from scratch.',
    correct: 'AWS Secrets Manager',
    correctWhy: 'Secrets Manager has built-in native rotation for RDS, Redshift, and DocumentDB with pre-built Lambda rotation functions.',
    tip: 'The word "rotation" always points to Secrets Manager. Parameter Store = free config/secrets storage, no rotation. Cost: ~$0.40/secret/month for Secrets Manager.',
  },
  {
    title: 'Messages processed twice = visibility timeout too short',
    icon: '📨',
    trigger: '"SQS messages are being processed more than once"',
    wrong: 'Switch from Standard to FIFO queue',
    wrongWhy: 'FIFO gives exactly-once processing but has throughput limits (300 msg/sec). The root cause here is a timeout issue, not ordering.',
    correct: 'Increase the SQS visibility timeout',
    correctWhy: 'If processing takes longer than the timeout, the message reappears for another consumer. Set timeout > max processing time.',
    tip: 'Visibility timeout should exceed your worst-case processing time. If Lambda can take up to 5 min, set visibility timeout to 6+ minutes.',
  },
  {
    title: 'VPC Peering is non-transitive — use Transit Gateway for scale',
    icon: '🔗',
    trigger: '"Connect 5+ VPCs" or "hub-and-spoke" or "transitive routing"',
    wrong: 'VPC Peering for large multi-VPC architectures',
    wrongWhy: 'VPC Peering is non-transitive. A↔B and B↔C does NOT mean A↔C. With 10 VPCs you need 45 peering connections.',
    correct: 'Transit Gateway',
    correctWhy: 'TGW acts as a central hub with transitive routing. 10 VPCs = 10 attachments. Also connects VPN and Direct Connect.',
    tip: 'Formula: N VPCs need N×(N-1)/2 peering connections. 10 VPCs = 45. Transit Gateway = 10. Any "many VPCs" question → Transit Gateway.',
  },
]

// ─── STUDY PLAN ───────────────────────────────────────────────────────────────
interface StudyDay { day: number; week: number; title: string; topics: string[] }

const STUDY_PLAN: StudyDay[] = [
  { day: 1, week: 1, title: 'Cloud Concepts & IAM', topics: ['Well-Architected Framework (6 pillars)', 'IAM: Users, Groups, Roles, Policies', 'MFA, Password Policy, Access Keys', 'Root user best practices — never use for daily tasks'] },
  { day: 2, week: 1, title: 'EC2 & Network Security', topics: ['EC2 instance types (T, C, R, I, P families)', 'Security Groups vs NACLs — key distinctions', 'Key Pairs, Placement Groups (Cluster/Partition/Spread)', 'AMIs and Launch Templates'] },
  { day: 3, week: 1, title: 'VPC Deep Dive', topics: ['Public vs private subnets', 'Route Tables, Internet Gateway, NAT Gateway', 'VPC Peering (non-transitive!)', 'Draw a 3-tier VPC architecture from memory'] },
  { day: 4, week: 1, title: 'S3 Foundations', topics: ['All storage classes and when to use each', 'Versioning, MFA Delete, Object Lock (WORM)', 'Encryption: SSE-S3, SSE-KMS, SSE-C', 'Lifecycle Policies: automate transitions'] },
  { day: 5, week: 1, title: 'Security Services', topics: ['CloudTrail: API audit logs', 'GuardDuty: threat detection (no agents)', 'AWS Config: configuration compliance', 'KMS: key management, CMK vs AWS-managed'] },
  { day: 6, week: 1, title: 'Week 1 Review', topics: ['20-question quiz on IAM + VPC + S3', 'Review ALL wrong answers — understand why', 'Re-read Security Group vs NACL differences', 'Draw VPC diagram from memory (no notes)'] },
  { day: 7, week: 1, title: 'Rest Day', topics: ['Light scan of Decision Matrix', 'Review exam traps only', 'No new material today'] },
  { day: 8, week: 2, title: 'EC2 Advanced & EBS', topics: ['EBS types: gp3, io2, st1, sc1 — use cases', 'Instance Store: ephemeral, fastest I/O, lost on stop', 'EC2 pricing: On-Demand, Reserved, Spot, Savings Plans, Dedicated', 'Spot: when to use and when NOT to'] },
  { day: 9, week: 2, title: 'Auto Scaling & Load Balancers', topics: ['ASG: min/max/desired, scaling policies', 'Target Tracking vs Step Scaling vs Scheduled', 'ALB (Layer 7, path routing) vs NLB (Layer 4, TCP/UDP, static IP)', 'Health checks: ELB vs EC2 level'] },
  { day: 10, week: 2, title: 'RDS & Aurora', topics: ['Multi-AZ: synchronous, failover only, NOT reads', 'Read Replicas: async, reads only, can promote', 'Aurora: 5x faster, auto-scale storage to 128TB', 'Encryption must be enabled AT LAUNCH — no retroactive enable'] },
  { day: 11, week: 2, title: 'DynamoDB & ElastiCache', topics: ['DynamoDB: key-value, single-digit ms at any scale', 'DAX: in-memory cache, 10x speedup, no code change', 'Global Tables: multi-region active-active', 'ElastiCache: Redis (persistence, failover) vs Memcached (simple, multi-threaded)'] },
  { day: 12, week: 2, title: 'Serverless & Containers', topics: ['Lambda: 15 min max, event-driven, pay per ms', 'API Gateway: REST vs HTTP (cheaper) vs WebSocket', 'ECS: Fargate (serverless) vs EC2 launch type', 'Cognito: User Pools (auth/JWT) vs Identity Pools (AWS credentials)'] },
  { day: 13, week: 2, title: 'Week 2 Review', topics: ['20-question quiz on Compute + Databases', 'Multi-AZ vs Read Replica drills (most missed topic)', 'Spot vs Reserved decision scenarios', 'Review all wrong answers in depth'] },
  { day: 14, week: 2, title: 'Rest Day', topics: ['Decision Matrix scan', 'Port numbers memorisation', 'No new material'] },
  { day: 15, week: 3, title: 'Decoupling: SQS & SNS', topics: ['SQS Standard vs FIFO (throughput, ordering, dedup)', 'Visibility timeout, long polling, DLQ, delay queues', 'SNS: Pub/Sub, push-based fan-out to multiple targets', 'SNS + SQS fan-out pattern (canonical architecture)'] },
  { day: 16, week: 3, title: 'Streaming & Integration', topics: ['Kinesis Data Streams: real-time, multiple consumers, replay', 'Kinesis Firehose: managed delivery to S3/Redshift, no code', 'Kinesis Analytics: SQL on streaming data', 'Step Functions: state machine, Standard vs Express workflows'] },
  { day: 17, week: 3, title: 'Route 53 & CDN', topics: ['All 7 routing policies — memorise use cases, not definitions', 'Route 53 health checks (endpoint, CloudWatch alarm, calculated)', 'CloudFront: caching, origins, behaviors, invalidations', 'Global Accelerator vs CloudFront — the key distinction'] },
  { day: 18, week: 3, title: 'Hybrid & Advanced Networking', topics: ['Site-to-Site VPN: fast setup, encrypted, variable latency', 'Direct Connect: dedicated, consistent, NOT encrypted by default', 'Transit Gateway: hub-and-spoke, transitive, replaces mesh peering', 'VPC PrivateLink vs Peering vs TGW'] },
  { day: 19, week: 3, title: 'Cost Optimization & Migration', topics: ['S3 lifecycle policies + Intelligent-Tiering', 'Cost Explorer, Budgets, Trusted Advisor, Cost Allocation Tags', 'Snowball family: when offline transfer beats internet', 'DMS (migration) + SCT (schema conversion for heterogeneous)'] },
  { day: 20, week: 3, title: 'Advanced Security & Storage', topics: ['Secrets Manager vs Parameter Store — the rotation distinction', 'Macie (PII in S3), Inspector (CVE scanning), Security Hub (aggregate), Detective (investigate)', 'Storage Gateway: 4 types and their keywords', 'S3 advanced: CRR, SRR, Transfer Acceleration, Multipart'] },
  { day: 21, week: 3, title: 'Full Practice Exam #1 🎯', topics: ['65 questions — timed 130 minutes', 'Review EVERY wrong answer — understand why', 'Identify your 3 weakest domains', 'Note which exam traps caught you'] },
  { day: 22, week: 4, title: 'Weak Area Deep Dive', topics: ['Focused study on Exam #1 weak areas', 'Re-read Deep Dive sections for weak topics', '20 targeted questions on weakest domain', 'Re-check Decision Matrix rows you missed'] },
  { day: 23, week: 4, title: 'Scenario Drilling', topics: ['Read 15 complex architect scenarios', 'Identify the correct service BEFORE reading answers', 'Focus on "most cost-effective" vs "most available" framing', 'Practice the elimination method on 2-answer dilemmas'] },
  { day: 24, week: 4, title: 'Full Practice Exam #2 🎯', topics: ['65 questions — timed 130 minutes', 'Compare score vs Exam #1 (should improve)', 'Deep review of all wrong answers', 'Update weak areas list'] },
  { day: 25, week: 4, title: 'Weak Area Deep Dive #2', topics: ['Focused study on Exam #2 weak areas', 'Networking and storage are most commonly weak', 'Re-drill Decision Matrix for missed rows', 'Review all 12 exam traps — can you spot them instantly?'] },
  { day: 26, week: 4, title: 'Memorisation Day', topics: ['Decision Matrix: all 39 rows from memory', 'Port numbers: 22, 443, 3306, 5432, 6379, 2049', 'DR strategies: RTO/RPO and cost ranking', 'EC2 instance families: T=general, C=compute, R=RAM, I=storage, P=GPU'] },
  { day: 27, week: 4, title: 'Full Practice Exam #3 🎯', topics: ['65 questions — timed 130 minutes', 'Target score: >80% (you are ready)', 'If <75%: review weak areas and consider rescheduling', 'Final review of flagged topics'] },
  { day: 28, week: 4, title: 'Final Content Review', topics: ['Exam Traps — one last read-through', 'Well-Architected Framework pillars and keywords', 'Review keyword triggers table', 'No new topics — consolidation only'] },
  { day: 29, week: 4, title: 'Light Day', topics: ['30-minute review maximum', 'Scan exam strategy tips', 'Prepare logistics: ID, test centre location, arrival time', 'Sleep early — 8 hours minimum'] },
  { day: 30, week: 4, title: '🎯 EXAM DAY — You Got This', topics: ['Eat a real breakfast', 'Arrive 30 minutes early', 'Flag and move — do not spend more than 2 min per question', 'Trust your preparation. You have done the work.'] },
]

// ─── PORTS ────────────────────────────────────────────────────────────────────
const PORTS = [
  { port: '22', protocol: 'SSH / SFTP', use: 'Linux remote access / secure file transfer' },
  { port: '80', protocol: 'HTTP', use: 'Unencrypted web traffic' },
  { port: '443', protocol: 'HTTPS', use: 'Encrypted web traffic (TLS)' },
  { port: '3389', protocol: 'RDP', use: 'Windows Remote Desktop' },
  { port: '21', protocol: 'FTP', use: 'File transfer (unencrypted — avoid)' },
  { port: '53', protocol: 'DNS', use: 'Domain name resolution (Route 53)' },
  { port: '25', protocol: 'SMTP', use: 'Email sending (Amazon SES)' },
  { port: '3306', protocol: 'MySQL / Aurora MySQL', use: 'MySQL-compatible databases' },
  { port: '5432', protocol: 'PostgreSQL / Aurora PG', use: 'PostgreSQL-compatible databases' },
  { port: '1433', protocol: 'Microsoft SQL Server', use: 'MS SQL Server on RDS' },
  { port: '1521', protocol: 'Oracle DB', use: 'Oracle on RDS' },
  { port: '6379', protocol: 'Redis', use: 'ElastiCache for Redis' },
  { port: '11211', protocol: 'Memcached', use: 'ElastiCache for Memcached' },
  { port: '2049', protocol: 'NFS', use: 'EFS mount target (Linux)' },
  { port: '445', protocol: 'SMB', use: 'FSx for Windows File Server' },
  { port: '8080', protocol: 'HTTP Alt', use: 'Alternative HTTP port (non-privileged)' },
]

const DR_STRATEGIES = [
  { name: 'Backup & Restore', rto: 'Hours', rpo: 'Hours', cost: '$ Lowest', color: '#dcfce7', border: '#86efac', desc: 'Backup data to S3 or Glacier. Restore entire environment when disaster strikes. No standby infrastructure. Cheapest option — slowest recovery.' },
  { name: 'Pilot Light', rto: 'Minutes–Hours', rpo: 'Minutes', cost: '$$', color: '#fef9c3', border: '#fde047', desc: 'Core components (database) always running in DR region. App servers stopped/terminated. Scale up DB and launch app servers on failover. Like a gas pilot light — small flame ready to ignite.' },
  { name: 'Warm Standby', rto: 'Minutes', rpo: 'Seconds–Minutes', cost: '$$$', color: '#ffedd5', border: '#fdba74', desc: 'Scaled-down but fully functional copy of the environment always running in DR region. Traffic routed to DR on failover, then scaled to full capacity. Faster than Pilot Light.' },
  { name: 'Multi-Site Active/Active', rto: 'Seconds', rpo: 'Near zero', cost: '$$$$ Highest', color: '#fee2e2', border: '#fca5a5', desc: 'Full environment running in 2+ regions simultaneously. Live traffic split across regions at all times. Instant failover — users barely notice an outage. Most expensive option.' },
]

const PILLARS = [
  { name: 'Operational Excellence', icon: '⚙️', keywords: 'Automation, CloudFormation, CI/CD, Runbooks, Frequent small changes, Anticipate failure', color: '#3b82f6' },
  { name: 'Security', icon: '🔒', keywords: 'IAM, Least Privilege, Encryption at rest/transit, CloudTrail, GuardDuty, KMS, MFA', color: '#ef4444' },
  { name: 'Reliability', icon: '🔄', keywords: 'Multi-AZ, Auto Scaling, Backups, Health Checks, DR planning, Loose coupling (SQS)', color: '#10b981' },
  { name: 'Performance Efficiency', icon: '⚡', keywords: 'CloudFront, ElastiCache, Aurora, Serverless, Right instance type, Global distribution', color: '#f59e0b' },
  { name: 'Cost Optimization', icon: '💰', keywords: 'Reserved/Spot instances, S3 Lifecycle, Right-sizing, Trusted Advisor, Savings Plans', color: '#8b5cf6' },
  { name: 'Sustainability', icon: '🌱', keywords: 'Managed services, Serverless, Efficient code, Region selection, Energy efficiency', color: '#059669' },
]

// ─── DEEP DIVES LIST ──────────────────────────────────────────────────────────
const DEEP_DIVES = [
  { id: 'iam', title: 'IAM — Identity & Access Management', icon: '🔑', badge: '3–4 questions', summary: 'Users, Groups, Roles, Policies. The security foundation of every AWS architecture.' },
  { id: 'vpc', title: 'VPC — Core Networking', icon: '🌐', badge: '4–5 questions', summary: 'Subnets, Route Tables, IGW, NAT Gateway, VPC Endpoints, Flow Logs.' },
  { id: 'route53', title: 'Route 53 — All 7 Routing Policies', icon: '🌍', badge: '3–4 questions', summary: 'Simple, Weighted, Latency, Failover, Geolocation, Geoproximity, Multi-Value.' },
  { id: 'sgnacl', title: 'Security Groups vs NACLs', icon: '🛡️', badge: '2–3 questions', summary: 'Stateful vs stateless. Allow-only vs Allow+Deny. Instance vs subnet scope.' },
  { id: 'storagegw', title: 'Storage Gateway — 4 Types', icon: '🗄️', badge: '1–2 questions', summary: 'S3 File Gateway, FSx File Gateway, Volume Gateway (Cached/Stored), Tape Gateway.' },
  { id: 's3adv', title: 'S3 Advanced Features', icon: '🪣', badge: '2–3 questions', summary: 'CRR, Transfer Acceleration, Multipart, Object Lock, Pre-signed URLs, Event Notifications.' },
  { id: 'cloudfrontga', title: 'CloudFront vs Global Accelerator', icon: '⚡', badge: '1–2 questions', summary: 'CDN (HTTP caching, dynamic DNS) vs Network accelerator (TCP/UDP, static Anycast IPs).' },
  { id: 'secrets', title: 'Secrets Manager vs Parameter Store', icon: '🔐', badge: '1–2 questions', summary: 'Auto-rotation (paid) vs free config storage. When each is the right answer.' },
  { id: 'sqs', title: 'SQS — Deep Dive', icon: '📨', badge: '2–3 questions', summary: 'Visibility timeout, long polling, DLQ, Standard vs FIFO, delay queues.' },
  { id: 'kinesis', title: 'Kinesis — Data Streams vs Firehose vs Analytics', icon: '🌊', badge: '2–3 questions', summary: 'Real-time streaming. Know which service to pick for each scenario.' },
  { id: 'rds', title: 'RDS — Multi-AZ vs Read Replicas', icon: '🗃️', badge: '3–4 questions', summary: 'The single most-missed distinction on the entire exam. DR vs performance.' },
  { id: 'cognito', title: 'Cognito — User Pools vs Identity Pools', icon: '👤', badge: '1–2 questions', summary: 'Authentication and JWT tokens vs temporary AWS IAM credentials.' },
  { id: 'containers', title: 'ECS & EKS Deep Dive', icon: '🐳', badge: '2–3 questions', summary: 'Fargate vs EC2 launch type. ECS (AWS-native) vs EKS (Kubernetes). When to use each.' },
  { id: 'securitysvc', title: 'Security Services — 5 Tools', icon: '🔍', badge: '2–3 questions', summary: 'GuardDuty, Macie, Inspector, Security Hub, Detective — each has a distinct job.' },
  { id: 'orgs', title: 'AWS Organizations & SCPs', icon: '🏢', badge: '1–2 questions', summary: 'SCPs restrict max permissions across accounts. Consolidated billing. OU hierarchy.' },
  { id: 'stepfn', title: 'Step Functions & Advanced Integration', icon: '🔗', badge: '1–2 questions', summary: 'Orchestrate Lambda with retries, branching, parallel execution, error handling.' },
]

// ─── NUMBERS TAB DATA ─────────────────────────────────────────────────────────
interface NumberRow { service: string; fact: string; value: string }

const CRITICAL_NUMBERS: NumberRow[] = [
  { service: 'S3', fact: 'Max object size', value: '5 TB' },
  { service: 'S3', fact: 'Multipart upload threshold', value: '>100 MB recommended, required >5 GB' },
  { service: 'S3', fact: 'Durability', value: '99.999999999% (11 nines)' },
  { service: 'S3', fact: 'Standard-IA minimum storage', value: '30 days' },
  { service: 'S3', fact: 'Glacier Flexible/Deep Archive min storage', value: '90 days' },
  { service: 'S3', fact: 'Glacier Deep Archive min storage', value: '180 days' },
  { service: 'Lambda', fact: 'Max execution time', value: '15 minutes (900 sec)' },
  { service: 'Lambda', fact: 'Max memory', value: '10,240 MB (10 GB)' },
  { service: 'Lambda', fact: 'Max deployment package (zipped)', value: '50 MB' },
  { service: 'Lambda', fact: 'Max deployment package (unzipped)', value: '250 MB' },
  { service: 'SQS', fact: 'Max message size', value: '256 KB' },
  { service: 'SQS', fact: 'Max message retention', value: '14 days' },
  { service: 'SQS', fact: 'Visibility timeout max', value: '12 hours' },
  { service: 'SQS', fact: 'Delay queue max', value: '15 minutes' },
  { service: 'SQS FIFO', fact: 'Max throughput (standard)', value: '3,000 TPS with batching' },
  { service: 'DynamoDB', fact: 'Max item size', value: '400 KB' },
  { service: 'DynamoDB', fact: 'Partition key max length', value: '2,048 bytes' },
  { service: 'RDS', fact: 'Max storage (most engines)', value: '64 TB' },
  { service: 'Aurora', fact: 'Max storage (auto-scales)', value: '128 TB' },
  { service: 'Aurora', fact: 'Max read replicas', value: '15' },
  { service: 'Aurora', fact: 'Failover time', value: '<30 seconds' },
  { service: 'RDS Multi-AZ', fact: 'Failover time', value: '1–2 minutes' },
  { service: 'VPC', fact: 'CIDR range allowed', value: '/16 (65,536 IPs) to /28 (16 IPs)' },
  { service: 'VPC', fact: 'Subnets per VPC (soft limit)', value: '200' },
  { service: 'VPC', fact: 'First 4 + last 1 IPs reserved', value: '5 IPs per subnet (unusable)' },
  { service: 'Security Group', fact: 'Rules per SG', value: '60 inbound + 60 outbound' },
  { service: 'Security Group', fact: 'SGs per ENI', value: '5' },
  { service: 'NACL', fact: 'Rules per NACL', value: '20 inbound + 20 outbound (default soft limit)' },
  { service: 'EC2', fact: 'Spot interruption notice', value: '2 minutes' },
  { service: 'EC2', fact: 'Spread placement group max per AZ', value: '7 instances' },
  { service: 'EBS gp3', fact: 'Baseline IOPS', value: '3,000 (scalable to 16,000)' },
  { service: 'EBS io2 Block Express', fact: 'Max IOPS', value: '256,000' },
  { service: 'EFS', fact: 'Infrequent Access savings', value: 'Up to 92% vs EFS Standard' },
  { service: 'Direct Connect', fact: 'Port speeds', value: '1 Gbps, 10 Gbps, 100 Gbps' },
  { service: 'CloudFront', fact: 'Default TTL', value: '24 hours (86,400 sec)' },
  { service: 'Route 53', fact: 'Health check interval', value: '10 or 30 seconds' },
  { service: 'KMS', fact: 'Envelope encryption key size', value: 'Data key up to 4 KB per API call' },
  { service: 'Kinesis Data Streams', fact: 'Shard write throughput', value: '1 MB/s or 1,000 records/s' },
  { service: 'Kinesis Data Streams', fact: 'Shard read throughput', value: '2 MB/s per consumer' },
  { service: 'Kinesis Data Streams', fact: 'Default retention', value: '24 hours (up to 365 days)' },
  { service: 'API Gateway', fact: 'Default timeout', value: '29 seconds' },
  { service: 'SNS', fact: 'Max message size', value: '256 KB' },
  { service: 'Step Functions Standard', fact: 'Max duration', value: '1 year' },
  { service: 'Step Functions Express', fact: 'Max duration', value: '5 minutes' },
  { service: 'Transit Gateway', fact: 'Max VPC attachments', value: '5,000' },
  { service: 'ALB', fact: 'Idle connection timeout', value: '60 seconds (default)' },
  { service: 'Secrets Manager', fact: 'Cost per secret', value: '~$0.40/secret/month' },
]

interface DistinctionRow { scenario: string; answer: string; trap?: string }

const DISTINCTIONS_STORAGE: DistinctionRow[] = [
  { scenario: 'Store objects/files — any size, HTTP access', answer: 'Amazon S3', trap: 'Not EBS — EBS requires EC2 attachment' },
  { scenario: 'Block storage for ONE EC2 instance (OS, DB volume)', answer: 'Amazon EBS', trap: 'EBS is AZ-locked — cannot cross AZs' },
  { scenario: 'Shared file system — Linux, multiple EC2 simultaneously', answer: 'Amazon EFS (NFS)', trap: 'EBS cannot attach to multiple EC2 (except io2 Multi-Attach)' },
  { scenario: 'Shared file system — Windows, SMB, Active Directory', answer: 'FSx for Windows File Server', trap: 'EFS is Linux/POSIX only — never Windows' },
  { scenario: 'High-performance parallel file system for HPC/ML', answer: 'FSx for Lustre', trap: 'Not EFS — Lustre is for HPC throughput, not general file sharing' },
  { scenario: 'Archive, rarely accessed, cheapest long-term storage', answer: 'S3 Glacier Deep Archive', trap: 'Not S3 Standard-IA — S3 IA still more expensive than Glacier' },
  { scenario: 'Unknown or changing access patterns — auto-tier', answer: 'S3 Intelligent-Tiering', trap: 'Not Lifecycle — use Lifecycle only when access pattern is KNOWN' },
  { scenario: 'Highest IOPS ever — ephemeral, EC2-local NVMe', answer: 'EC2 Instance Store', trap: 'Data lost on stop/terminate — never for persistent data' },
]

const DISTINCTIONS_COMPUTE: DistinctionRow[] = [
  { scenario: 'Variable/unpredictable traffic, short executions', answer: 'AWS Lambda', trap: 'Lambda max = 15 min. Not for long-running jobs.' },
  { scenario: 'Long-running (>15 min), stateful, needs OS access', answer: 'EC2 or Fargate', trap: 'Lambda is limited to 15 minutes — cannot run video encoding jobs' },
  { scenario: 'Batch, fault-tolerant, can be interrupted', answer: 'EC2 Spot Instances', trap: 'Never Spot for databases or anything that cannot be interrupted' },
  { scenario: 'Steady-state 24/7 production workload', answer: 'Reserved Instances / Savings Plans', trap: 'On-Demand is wasteful for predictable workloads' },
  { scenario: 'Containerised app — no EC2 management', answer: 'ECS or EKS with Fargate', trap: 'Fargate = no EC2 cluster management. EKS = Kubernetes (need expertise)' },
  { scenario: 'HPC — lowest inter-node latency, tight coupling', answer: 'Cluster Placement Group + EFA', trap: 'Spread PG = max availability, not low latency' },
  { scenario: 'Maximize availability — each instance on different rack', answer: 'Spread Placement Group', trap: 'Max 7 per AZ — not for large clusters' },
]

const DISTINCTIONS_NETWORKING: DistinctionRow[] = [
  { scenario: 'HTTP/HTTPS routing — path, host, query string', answer: 'ALB (Layer 7)', trap: 'NLB cannot do path routing — it is Layer 4 only' },
  { scenario: 'TCP/UDP — ultra-low latency, static IP per AZ', answer: 'NLB (Layer 4)', trap: 'ALB has no static IP and cannot handle non-HTTP protocols' },
  { scenario: 'Inline security appliance (Palo Alto, Check Point)', answer: 'GWLB (Layer 3)', trap: 'Neither ALB nor NLB — GWLB is transparent bump-in-wire' },
  { scenario: 'Block a specific IP address explicitly', answer: 'NACL Deny rule', trap: 'Security Groups are allow-only — no Deny rules' },
  { scenario: 'Instance-level stateful firewall', answer: 'Security Group', trap: 'NACL is stateless — must allow return traffic manually' },
  { scenario: 'Connect many VPCs — transitive hub-and-spoke', answer: 'Transit Gateway', trap: 'VPC Peering is non-transitive — A↔B + B↔C ≠ A↔C' },
  { scenario: 'CDN — cache HTTP content at edge globally', answer: 'CloudFront', trap: 'Global Accelerator does NOT cache — it just routes faster over AWS backbone' },
  { scenario: 'Static Anycast IPs + TCP/UDP global acceleration', answer: 'Global Accelerator', trap: 'CloudFront is HTTP-only and DNS-based — no static IP' },
  { scenario: 'Dedicated private fiber to on-premises', answer: 'AWS Direct Connect', trap: 'Direct Connect is NOT encrypted by default — add VPN for encryption' },
]

const DISTINCTIONS_DB: DistinctionRow[] = [
  { scenario: 'Relational, SQL, complex queries, ACID', answer: 'RDS (MySQL, PostgreSQL, Oracle…)', trap: '' },
  { scenario: 'RDS with 5x MySQL speed, auto-scale storage to 128 TB', answer: 'Amazon Aurora', trap: '' },
  { scenario: 'RDS HA failover — standby in another AZ', answer: 'RDS Multi-AZ', trap: 'Multi-AZ standby is NOT readable — it is failover only' },
  { scenario: 'Scale READ traffic for RDS', answer: 'RDS Read Replicas', trap: 'Multi-AZ does NOT serve reads — only Read Replicas do' },
  { scenario: 'NoSQL, key-value, single-digit ms, auto-scale', answer: 'DynamoDB', trap: '' },
  { scenario: 'Microsecond cache for DynamoDB reads', answer: 'DynamoDB DAX', trap: 'DAX only works with DynamoDB — not RDS or other DBs' },
  { scenario: 'Sub-ms in-memory cache for RDS or general use', answer: 'ElastiCache (Redis or Memcached)', trap: 'DAX is DynamoDB-only — for RDS caching, use ElastiCache' },
  { scenario: 'Analytics — OLAP queries over petabytes', answer: 'Amazon Redshift', trap: 'Not RDS — Redshift is columnar warehouse, not OLTP' },
  { scenario: 'Graph relationships — social, fraud, recommendations', answer: 'Amazon Neptune', trap: '' },
  { scenario: 'MongoDB-compatible document store', answer: 'Amazon DocumentDB', trap: '' },
]

const ARCH_PATTERNS: { label: string; pattern: string }[] = [
  { label: 'Decouple (async)', pattern: 'SQS (queue) + Lambda/EC2 workers' },
  { label: 'Fan-out', pattern: 'SNS → multiple SQS queues / Lambda / Email / SMS' },
  { label: 'Event-driven', pattern: 'EventBridge → Lambda / Step Functions / SQS' },
  { label: 'Static website', pattern: 'S3 + CloudFront + Route 53 + ACM (SSL/TLS)' },
  { label: 'Serverless API', pattern: 'API Gateway + Lambda + DynamoDB' },
  { label: 'Microservices', pattern: 'ALB (path routing) + ECS Fargate + API Gateway' },
  { label: 'Hybrid cloud', pattern: 'Direct Connect / VPN + Storage Gateway + DataSync' },
  { label: 'Backup strategy', pattern: 'AWS Backup + S3 Versioning + Cross-Region Replication' },
  { label: 'Cost optimisation', pattern: 'Compute Optimizer + Trusted Advisor + Savings Plans + S3 Lifecycle' },
  { label: 'Multi-region DR', pattern: 'Aurora Global DB + DynamoDB Global Tables + Route 53 Failover' },
  { label: 'Big data pipeline', pattern: 'Kinesis Streams → Lambda / Firehose → S3 → Athena / Redshift' },
  { label: 'VPC private access to AWS', pattern: 'VPC Gateway Endpoint (S3/DDB free) or Interface Endpoint (PrivateLink)' },
]

const QUICK_TRAPS: { wrong: string; right: string }[] = [
  { wrong: 'Lambda for 30-min video encoding', right: 'ECS/Fargate or EC2 (Lambda max = 15 min)' },
  { wrong: 'Spot Instances for a database', right: 'On-Demand or Reserved (Spot can be interrupted)' },
  { wrong: 'EBS for shared storage across EC2s', right: 'EFS (Linux) or FSx for Windows (Windows)' },
  { wrong: 'Multi-AZ for read scaling', right: 'Read Replicas (Multi-AZ standby is not readable)' },
  { wrong: 'Direct Connect = encrypted', right: 'Direct Connect + VPN for encryption (DX alone is not encrypted)' },
  { wrong: 'Security Group to block an IP', right: 'NACL Deny rule (SGs are allow-only)' },
  { wrong: 'NAT Instance vs NAT Gateway = same', right: 'NAT Gateway: managed, HA, scales automatically. NAT Instance: you manage HA.' },
  { wrong: 'CloudFront for TCP/UDP with static IP', right: 'Global Accelerator (CloudFront = HTTP only, no static IP)' },
  { wrong: 'DAX to cache RDS queries', right: 'ElastiCache (DAX is DynamoDB-only)' },
  { wrong: '"Enable encryption" vaguely for S3', right: 'SSE-S3, SSE-KMS, or SSE-C (each has different key control implications)' },
  { wrong: 'VPC Peering for 5 VPCs = transitive', right: 'Transit Gateway (peering is non-transitive — 5 VPCs = 10 peering connections)' },
  { wrong: 'DynamoDB stores 10 TB log files', right: 'S3 + Athena (DynamoDB max item = 400 KB)' },
]

// ─── STRATEGY TIPS ────────────────────────────────────────────────────────────
const STRATEGY_TIPS = [
  { icon: '🚩', title: 'Flag and Move', desc: 'If a question takes more than 90 seconds, flag it and move on. Return at the end. You have 130 minutes for 65 questions — that\'s 2 minutes each. Never let one question cost you three.' },
  { icon: '✂️', title: 'Elimination Method', desc: 'Two answers are usually obviously wrong. Cross them out immediately and focus on the final two. Then apply the Golden Rule: more managed, more secure, more decoupled, more cost-effective.' },
  { icon: '📖', title: 'Read Every Word', desc: 'The correct answer is usually determined by a single word: "encrypted", "legal", "automatic", "minimal effort", "most cost-effective". Missing that word = wrong answer. Read the scenario before the answers.' },
  { icon: '🔑', title: 'Keyword Triggers', desc: '"Decouple" → SQS/SNS. "Global/low latency" → CloudFront. "NoSQL/high scale" → DynamoDB. "Temporary credentials" → IAM Role. "Rotate credentials" → Secrets Manager. "Block IP" → NACL. Memorise these mappings.' },
  { icon: '⚖️', title: 'Respect the Constraint', desc: '"Most cost-effective" = do not pick the expensive highly-available option. "Minimal operational overhead" = pick serverless or managed. "Least downtime" = blue/green or read replica promotion. The constraint is the answer.' },
  { icon: '🔄', title: 'Review Your Flags', desc: 'Reserve 15 minutes at the end to review flagged questions. Only change an answer if you found a specific reason it is wrong — gut-feel second-guessing rarely helps. If unsure, stick with your first instinct.' },
  { icon: '🎯', title: 'The Golden Rule', desc: 'When two answers both look correct, choose the one that is: (1) More Managed/Serverless over self-managed EC2, (2) More Secure (least privilege), (3) More Decoupled (SQS/SNS), (4) More Cost-Effective for the stated goal.' },
  { icon: '⏱️', title: 'Time Management', desc: 'Aim to finish question 33 (halfway) at the 65-minute mark. If ahead: slow down and read more carefully. If behind: skip longer scenario questions and come back. Never leave a question unanswered — no penalty for guessing.' },
]

// ─── TABS ─────────────────────────────────────────────────────────────────────
const TAB_LIST: { id: Tab; label: string; count: string }[] = [
  { id: 'matrix',    label: '🎯 Decision Matrix', count: `${MATRIX.length}` },
  { id: 'traps',     label: '⚠️ Exam Traps',      count: `${TRAPS.length}` },
  { id: 'deepdives', label: '🔬 Deep Dives',       count: `${DEEP_DIVES.length}` },
  { id: 'studyplan', label: '📅 Study Plan',        count: '30 days' },
  { id: 'reference', label: '🔌 Quick Reference',   count: `${PORTS.length} ports` },
  { id: 'strategy',  label: '🏆 Exam Strategy',     count: `${STRATEGY_TIPS.length} tips` },
  { id: 'numbers',   label: '📊 Numbers & Facts',   count: `${CRITICAL_NUMBERS.length}` },
  { id: 'codex',    label: "🧭 Architect's Codex", count: '' },
]

const STORAGE_KEY = 'certiprepai-saa-study-plan'

// ─── HELPER COMPONENT ────────────────────────────────────────────────────────
function ServiceDistinctionTable({ rows }: { rows: { scenario: string; answer: string; trap?: string }[] }) {
  return (
    <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', overflow: 'hidden' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', background: '#eff6ff', padding: '8px 14px', fontWeight: 700, fontSize: '0.78rem', color: '#1e40af', gap: '8px' }}>
        <span>Scenario / Requirement</span><span>Correct Service</span>
      </div>
      {rows.map((row, i) => (
        <div key={i} style={{ padding: '10px 14px', borderTop: '1px solid #f3f4f6', background: i % 2 === 0 ? '#fff' : '#fafafa' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '10px', alignItems: 'start' }}>
            <span style={{ fontSize: '0.85rem', color: '#374151', lineHeight: 1.5 }}>{row.scenario}</span>
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#059669', background: '#f0fdf4', border: '1px solid #bbf7d0', padding: '3px 12px', borderRadius: '6px', whiteSpace: 'nowrap' }}>{row.answer}</span>
          </div>
          {row.trap && (
            <div style={{ marginTop: '4px', fontSize: '0.75rem', color: '#b45309', background: '#fef9c3', border: '1px solid #fde047', borderRadius: '6px', padding: '3px 8px', display: 'inline-block' }}>
              ⚠️ Trap: {row.trap}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

// ─── COMPONENT ────────────────────────────────────────────────────────────────
export default function SaaGuide() {
  const { isPremium } = useAuth()
  const { hasAccess, loading: certLoading } = useCertAccess('saa-c03')
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<Tab>('matrix')
  const [expanded, setExpanded] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [checkedDays, setCheckedDays] = useState<Set<number>>(() => {
    try {
      const s = localStorage.getItem(STORAGE_KEY)
      return s ? new Set<number>(JSON.parse(s)) : new Set<number>()
    } catch { return new Set<number>() }
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...checkedDays]))
  }, [checkedDays])

  const toggleDay = (day: number) => {
    setCheckedDays(prev => {
      const next = new Set(prev)
      next.has(day) ? next.delete(day) : next.add(day)
      return next
    })
  }

  const filteredMatrix = search.trim()
    ? MATRIX.filter(r =>
        r.requirement.toLowerCase().includes(search.toLowerCase()) ||
        r.solution.toLowerCase().includes(search.toLowerCase()) ||
        r.why.toLowerCase().includes(search.toLowerCase())
      )
    : MATRIX

  // Still loading auth + cert check
  if (certLoading) {
    return (
      <Layout>
        <div style={{ minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ width: '36px', height: '36px', border: '3px solid #e5e7eb', borderTopColor: '#2563eb', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
        </div>
      </Layout>
    )
  }

  // Free user — no plan at all
  if (!isPremium) {
    return (
      <Layout>
        <div style={{ minHeight: '70vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem', textAlign: 'center' }}>
          <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>🔒</div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#111827', marginBottom: '0.5rem' }}>Members only</h2>
          <p style={{ color: '#6b7280', maxWidth: '420px', lineHeight: 1.6, marginBottom: '1.5rem' }}>
            The SAA-C03 Deep Study Guide is available on any paid plan that includes SAA-C03.
          </p>
          <button onClick={() => navigate('/pricing')} style={{ padding: '12px 28px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 700, cursor: 'pointer', fontSize: '1rem' }}>
            See Plans →
          </button>
        </div>
      </Layout>
    )
  }

  // Paid user but their plan doesn't include SAA-C03
  if (!hasAccess) {
    return (
      <Layout>
        <div style={{ minHeight: '70vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem', textAlign: 'center' }}>
          <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>🚫</div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#111827', marginBottom: '0.5rem' }}>SAA-C03 not in your plan</h2>
          <p style={{ color: '#6b7280', maxWidth: '440px', lineHeight: 1.6, marginBottom: '1.5rem' }}>
            Your current plan doesn't include SAA-C03. Switch your cert selection or upgrade to Yearly / Lifetime to access all guides.
          </p>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
            <button onClick={() => navigate('/dashboard')} style={{ padding: '12px 24px', background: '#f3f4f6', color: '#374151', border: '1px solid #e5e7eb', borderRadius: '10px', fontWeight: 700, cursor: 'pointer', fontSize: '0.95rem' }}>
              Switch Cert →
            </button>
            <button onClick={() => navigate('/billing')} style={{ padding: '12px 24px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 700, cursor: 'pointer', fontSize: '0.95rem' }}>
              Upgrade Plan →
            </button>
          </div>
        </div>
      </Layout>
    )
  }

  const progress = Math.round((checkedDays.size / 30) * 100)

  // ── Deep dive content renderer ──────────────────────────────────────────────
  const renderDeepDive = (id: string) => {
    const tip = (text: string) => (
      <div style={{ background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '10px', padding: '0.875rem 1rem', marginTop: '0.75rem' }}>
        <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '0.35rem' }}>💡 Exam tip</div>
        <div style={{ fontSize: '0.85rem', color: '#374151', lineHeight: 1.6 }}>{text}</div>
      </div>
    )
    const heading = (text: string) => (
      <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#1e293b', marginTop: '1rem', marginBottom: '0.35rem', borderLeft: '3px solid #2563eb', paddingLeft: '0.6rem' }}>{text}</div>
    )
    const bullets = (items: string[]) => (
      <ul style={{ margin: '0.4rem 0', paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
        {items.map((item, i) => <li key={i} style={{ fontSize: '0.85rem', color: '#374151', lineHeight: 1.55 }}>{item}</li>)}
      </ul>
    )
    const table = (headers: string[], rows: string[][]) => (
      <div style={{ overflowX: 'auto', marginTop: '0.75rem' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
          <thead>
            <tr style={{ background: '#f8fafc' }}>
              {headers.map(h => <th key={h} style={{ padding: '8px 12px', textAlign: 'left', fontWeight: 700, color: '#374151', borderBottom: '2px solid #e5e7eb', whiteSpace: 'nowrap' }}>{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} style={{ borderBottom: '1px solid #f3f4f6' }}>
                {row.map((cell, j) => <td key={j} style={{ padding: '8px 12px', color: '#4b5563', verticalAlign: 'top' }}>{cell}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
    const text = (t: string) => <p style={{ fontSize: '0.875rem', color: '#374151', lineHeight: 1.65, margin: '0.5rem 0' }}>{t}</p>

    switch (id) {
      case 'iam': return (
        <div>
          {text('IAM is the access control layer for every AWS service. It defines who can do what to which resources.')}
          {heading('Core entities')}
          {bullets(['Users — individual identities (person or application). Never use Root for daily tasks.', 'Groups — collection of users. Attach policies to groups, not individual users.', 'Roles — temporary credentials assumed by AWS services (EC2, Lambda) or federated users. No long-term keys.', 'Policies — JSON documents defining Allow/Deny permissions on Actions + Resources.'])}
          {heading('Policy types')}
          {table(['Type','Who manages it','Use case'],[ ['AWS Managed','AWS','Common policies like AdministratorAccess, ReadOnlyAccess'], ['Customer Managed','You','Custom org-specific permission sets'], ['Inline','You (attached to one entity)','Special one-off permissions, not reusable'] ])}
          {heading('Key tools')}
          {bullets(['MFA: Mandatory on Root. Strongly recommended for admins. Use virtual (Google Auth) or hardware token.', 'IAM Access Analyzer: Identifies resources accessible from outside your account.', 'Credential Report: List all IAM users and their credential status (last used, rotation needed).', 'Policy Simulator: Test what actions a policy allows before applying it.'])}
          {tip('If EC2 needs S3 access — IAM Role, not access keys stored on the instance. "Temporary credentials for a service" always means IAM Role. "Prevent even admins from deleting CloudTrail" → SCP (not IAM — SCPs override IAM in member accounts).')}
        </div>
      )
      case 'vpc': return (
        <div>
          {text('VPC is your isolated private network in AWS. This is the most heavily tested topic in Domain 1 and 2.')}
          {heading('Core components')}
          {bullets(['VPC: Isolated network defined by a CIDR block (e.g., 10.0.0.0/16). Spans all AZs in a region.', 'Public Subnet: Has a route to Internet Gateway. Resources can have public IPs.', 'Private Subnet: No route to IGW. Resources isolated from direct internet.', 'Internet Gateway (IGW): Horizontally scaled, redundant. Allows VPC ↔ Internet. One per VPC.', 'NAT Gateway: In PUBLIC subnet. Allows private instances to initiate outbound internet (for patches). Blocks inbound. One per AZ for HA.', 'Route Tables: Define where traffic goes. 0.0.0.0/0 → IGW = public subnet. 0.0.0.0/0 → NAT GW = private outbound.'])}
          {heading('VPC Endpoints (no NAT/IGW needed)')}
          {table(['Type','Supports','Cost','How'],[ ['Gateway Endpoint','S3, DynamoDB','Free','Adds route to route table'], ['Interface Endpoint','Most other services (Lambda, KMS, SSM…)','Paid (ENI + hourly)','Creates ENI in your subnet'] ])}
          {heading('Connectivity options')}
          {table(['Option','Use case','Transitive?'],[ ['VPC Peering','Connect 2 VPCs privately','No'], ['Transit Gateway','Hub for many VPCs + on-prem','Yes'], ['PrivateLink','Expose service to other VPCs','N/A'], ['Site-to-Site VPN','On-prem to AWS (encrypted, fast setup)','N/A'], ['Direct Connect','On-prem to AWS (dedicated fiber, low latency)','N/A'] ])}
          {tip('VPC Flow Logs capture IP traffic METADATA (src/dst IP, port, protocol, bytes, action ACCEPT/REJECT) — NOT packet contents. Stored in CloudWatch Logs or S3. Use for security analysis and troubleshooting, not for payload inspection.')}
        </div>
      )
      case 'route53': return (
        <div>
          {text('Route 53 is AWS\'s DNS service. The routing policy determines how it responds to queries. Know all 7 policies cold.')}
          {table(['Policy','Based on','Use case','Key detail'],[ ['Simple','Nothing','Single resource, no health check','Returns all values randomly. No failover.'], ['Weighted','Manual weights (0–255)','A/B testing, blue/green deploy','Weight 0 = no traffic. Weight 10+10 = 50/50.'], ['Latency','Measured network latency','Best performance globally','Not geography — actual RTT to AWS regions.'], ['Failover','Health check result','DR / active-passive','Primary unhealthy → auto-route to secondary.'], ['Geolocation','User\'s country/continent','Compliance, localised content','Must have Default record or unmatched queries fail.'], ['Geoproximity','Location + bias value','Traffic shifting between regions','Requires Route 53 Traffic Flow. Bias expands/shrinks region.'], ['Multi-Value','Health check + random','Multiple healthy endpoints','Returns up to 8 healthy IPs. NOT a load balancer.'] ])}
          {heading('Health checks')}
          {bullets(['Endpoint monitoring: HTTP, HTTPS, TCP checks against your resources.', 'CloudWatch Alarm: For private resources with no public endpoint (trigger on CW alarm state).', 'Calculated: Combine multiple health checks (AND/OR logic) into one parent check.'])}
          {tip('"Send 10% of users to new version" → Weighted. "Route to fastest region" → Latency. "Users in France must use EU servers" → Geolocation (the word "must" signals compliance → Geolocation, not Latency). "Automatic failover to S3 static site" → Failover routing + health check.')}
        </div>
      )
      case 'sgnacl': return (
        <div>
          {table(['Feature','Security Group','Network ACL'],[ ['Scope','Instance (ENI) level','Subnet level'], ['State','Stateful (return traffic auto-allowed)','Stateless (must allow both directions)'], ['Rules','Allow only','Allow AND Deny'], ['Processing','All rules evaluated','Rules in numeric order (lowest first)'], ['Association','Per instance/ENI','Per subnet (applies to all instances)'], ['Default','All outbound allowed, no inbound','All traffic allowed (default NACL)'] ])}
          {heading('When to use which')}
          {bullets(['Block a specific IP address → NACL (SGs cannot Deny).', 'Restrict access to port 3306 from app servers only → Security Group (simpler, stateful).', 'Emergency block of a CIDR range that is attacking your subnet → NACL Deny rule.', 'Allow inbound on port 443 → Security Group on the instance.'])}
          {heading('NACL stateless gotcha')}
          {text('Because NACLs are stateless, if you allow inbound port 443, you must ALSO allow the ephemeral port range (1024–65535) on outbound for the response to return. Security Groups handle this automatically.')}
          {tip('NACL rules are evaluated lowest number first. Rule 100 is processed before rule 200. A Deny at rule 90 will block traffic that an Allow at rule 100 would permit — if 90 comes first. Always check rule order when troubleshooting NACLs.')}
        </div>
      )
      case 'storagegw': return (
        <div>
          {text('Storage Gateway bridges on-premises environments with AWS storage. Know the 4 types by their keyword triggers.')}
          {table(['Type','Protocol','Data stored in','Use case keyword'],[ ['S3 File Gateway','NFS or SMB','S3 (as objects)','On-prem apps writing files to S3 via NFS/SMB'], ['FSx File Gateway','SMB','FSx for Windows','Windows clients + Active Directory → FSx'], ['Volume Gateway Cached','iSCSI block','S3 (primary) + local cache','Minimise on-prem storage, cache hot data'], ['Volume Gateway Stored','iSCSI block','On-premises (primary) + S3 backup','Full dataset local, async S3 backup as EBS snapshots'], ['Tape Gateway','VTL / iSCSI','S3 (active) + Glacier (archived)','Replace physical tape library, keep backup software'] ])}
          {heading('Key details')}
          {bullets(['S3 File Gateway: Frequently accessed files are cached locally. Great for on-prem apps that need to access S3 without code changes.', 'Volume Cached vs Stored: Cached = small on-prem footprint. Stored = full local copy with cloud backup. Choose Cached when minimising on-prem storage is the goal.', 'Tape Gateway: Works with existing backup software (Veeam, Veritas, Backup Exec). No software changes. Virtual Tape Library (VTL) replaces physical hardware.'])}
          {tip('"Replace physical tape backup" → Tape Gateway. "On-prem Linux NFS access to S3" → S3 File Gateway. "On-prem Windows SMB with Active Directory" → FSx File Gateway. "iSCSI block volumes, minimise local storage" → Volume Gateway Cached.')}
        </div>
      )
      case 's3adv': return (
        <div>
          {heading('Cross-Region Replication (CRR)')}
          {bullets(['Automatically replicate objects to a bucket in ANOTHER region.', 'Requires versioning on both source and destination.', 'Only replicates NEW objects after replication is enabled (use S3 Batch Replication for existing).', 'Use case: Compliance (data in specific region), DR, reduce latency for global users.'])}
          {heading('Same-Region Replication (SRR)')}
          {bullets(['Replicate to bucket in same region.', 'Use case: Aggregate logs, replicate prod to test account.'])}
          {heading('Transfer Acceleration')}
          {bullets(['Users upload to nearest CloudFront Edge Location → AWS backbone → S3 bucket.', 'Fastest for long-distance uploads (Australia → us-east-1 bucket).', 'Extra cost per GB transferred. Not beneficial for nearby users.'])}
          {heading('Multipart Upload')}
          {bullets(['Upload large files in parallel parts.', 'Recommended: >100MB. Required: >5GB.', 'If one part fails, retry only that part — not the whole file.'])}
          {heading('Object Lock (WORM)')}
          {table(['Mode','Who can delete','Use case'],[ ['Governance','Users with special permission','Protect against accidental deletion'], ['Compliance','Nobody — not even root','SEC, FINRA, HIPAA regulatory requirements'] ])}
          {heading('Pre-signed URLs')}
          {text('Grant time-limited access to a private S3 object without making the bucket public. Common for secure file download links.')}
          {tip('"Speed up uploads from globally distributed offices" → S3 Transfer Acceleration. "Legal retention, object cannot be deleted" → S3 Object Lock (Compliance mode). "Replicate data to DR region automatically" → Cross-Region Replication.')}
        </div>
      )
      case 'cloudfrontga': return (
        <div>
          {table(['Feature','CloudFront','Global Accelerator'],[ ['Layer','7 (HTTP/HTTPS)','3/4 (TCP/UDP)'], ['Caching','✅ Core feature','❌ No caching'], ['Protocols','HTTP, HTTPS','Any TCP or UDP'], ['Static IPs','❌ DNS-based (dynamic)','✅ 2 static Anycast IPs'], ['Best for','Static/cacheable content, media, APIs','Gaming, IoT, VoIP, dynamic TCP/UDP apps'], ['DDoS','AWS Shield Standard (free)','AWS Shield Standard (free)'], ['Failover','Not primary purpose','Sub-minute regional failover'], ['Pricing','Data transfer + requests','Fixed hourly + data transfer'] ])}
          {heading('Decision rule')}
          {bullets(['"Cache images/videos at edge globally" → CloudFront', '"Fixed IP addresses for whitelisting at firewall" → Global Accelerator', '"Gaming / VoIP / IoT / raw TCP" → Global Accelerator', '"HTTP API with global users" → CloudFront (if cacheable) or Global Accelerator (if not)', '"Low latency for non-HTTP protocol" → Global Accelerator'])}
          {tip('"A company needs two static IP addresses for their global application so corporate firewalls can whitelist them" — this is Global Accelerator. CloudFront IPs change and cannot be whitelisted reliably. This exact scenario appears regularly on the exam.')}
        </div>
      )
      case 'secrets': return (
        <div>
          {table(['Feature','Secrets Manager','Parameter Store'],[ ['Cost','~$0.40/secret/month','Free (Standard tier)'], ['Auto-rotation','✅ Native (RDS, Redshift, DocumentDB)','❌ Must build custom Lambda'], ['Max size','64KB','4KB (Standard) / 8KB (Advanced)'], ['Encryption','KMS (mandatory)','KMS (optional, SecureString)'], ['Use case','DB passwords, API keys needing rotation','App config, feature flags, non-rotating secrets'], ['Integration','RDS native integration','SSM Agent, CLI, SDK'] ])}
          {heading('Secrets Manager rotation flow')}
          {bullets(['Secrets Manager invokes a Lambda rotation function.', 'Lambda creates a new version of the secret.', 'Lambda updates the target (e.g., RDS password).', 'Lambda verifies the new credentials work.', 'Old version deprecated.', 'Application fetches latest secret from Secrets Manager via SDK — no downtime.'])}
          {heading('Other SSM tools to know')}
          {bullets(['Session Manager: SSH/RDP to EC2 without port 22/3389 or bastion host. Full CloudTrail audit trail.', 'Run Command: Execute scripts on EC2 fleet remotely without SSH access.', 'Patch Manager: Automated OS patching with maintenance windows.', 'Inventory: Collect software/configuration inventory from EC2 instances.'])}
          {tip('"Automatically rotate RDS Master password every 90 days" → Secrets Manager. "Store connection string for app config" → Parameter Store (free). "Connect to EC2 in private subnet without bastion" → Session Manager.')}
        </div>
      )
      case 'sqs': return (
        <div>
          {table(['Feature','Standard Queue','FIFO Queue'],[ ['Throughput','Unlimited','300 msg/sec (3,000 with batching)'], ['Ordering','Best-effort','Strict FIFO (guaranteed)'], ['Delivery','At-least-once (duplicates possible)','Exactly-once (deduplication)'], ['Deduplication','❌','✅ 5-minute dedup window'], ['Use case','High-volume, order not critical','Financial transactions, order processing'] ])}
          {heading('Critical concepts')}
          {bullets(['Visibility Timeout (default 30s, max 12h): After a consumer receives a message, it becomes invisible. If not deleted before timeout expires → message reappears → another consumer picks it up (duplicate processing). Fix: increase timeout beyond max processing time.', 'Long Polling (WaitTimeSeconds > 0): Wait up to 20 seconds for a message instead of returning immediately. Reduces empty responses and cost. Always prefer long polling.', 'Dead Letter Queue (DLQ): After maxReceiveCount failures, message sent to DLQ. Isolates problem messages for inspection without blocking main queue.', 'Delay Queue (0–900s): Delay delivery of new messages. Consumer cannot see until delay expires.', 'Message Retention: Default 4 days, max 14 days. Message auto-deleted after retention period.'])}
          {tip('"Messages processed multiple times" → increase visibility timeout. "Reduce cost of SQS polling" → enable long polling. "Messages failing processing need manual inspection" → configure DLQ. "Strict ordering + exactly-once" → FIFO queue (check throughput requirements — 300 msg/sec limit).')}
        </div>
      )
      case 'kinesis': return (
        <div>
          {table(['Feature','Data Streams','Data Firehose','Data Analytics'],[ ['Management','You manage shards','Fully managed','Fully managed'], ['Latency','Real-time (ms)','Near real-time (60s buffer)','Real-time SQL'], ['Consumers','Custom (Lambda, KCL, Analytics)','S3, Redshift, OpenSearch, Splunk','Streams, Firehose, Lambda'], ['Replay','✅ (1–365 day retention)','❌ (no storage)','N/A'], ['Transformation','Custom consumer code','Lambda (optional)','SQL / Apache Flink'], ['Use case','Custom real-time processing','Load to data store','SQL analytics on streams'] ])}
          {heading('Kinesis vs SQS')}
          {table(['',  'Kinesis Data Streams','SQS'],[ ['Multiple consumers','✅ Each reads independently','❌ Message deleted after one consumer'], ['Ordering','Per shard (partition key)','FIFO only'], ['Retention','1–365 days (replay)','Up to 14 days'], ['Throughput','Per shard (1MB/s write, 2MB/s read)','Unlimited (Standard)'], ['Use case','Real-time analytics, streaming','Decoupling, async task queues'] ])}
          {tip('"Multiple applications need to independently process the same data stream in real-time" → Kinesis Data Streams (not SQS — SQS deletes message after first consumer). "Load clickstream data to S3 for analytics, no custom code" → Kinesis Firehose. "Run SQL aggregations on live IoT sensor data" → Kinesis Data Analytics.')}
        </div>
      )
      case 'rds': return (
        <div>
          {table(['Feature','Multi-AZ','Read Replicas'],[ ['Purpose','High Availability (DR)','Performance (read scaling)'], ['Replication','Synchronous','Asynchronous'], ['Standby readable?','❌ NO — failover only','✅ YES — serve SELECT queries'], ['Failover','Automatic (<2 min)','Manual promotion required'], ['Same region?','Yes (different AZ)','Same or cross-region'], ['Cost','2x the instance cost','Additional instance cost'] ])}
          {heading('Aurora specifics')}
          {bullets(['Aurora automatically replicates data 6 ways across 3 AZs — no separate Multi-AZ to enable.', 'Aurora Read Replicas: up to 15 replicas. Sub-10ms replication lag. Auto-failover to replica if primary fails.', 'Aurora Serverless: Auto-scales ACUs based on load. Good for intermittent/unpredictable workloads.', 'Aurora Global Database: Primary region + up to 5 secondary regions. <1 second replication lag. DR with sub-second RPO.'])}
          {heading('Encryption rules')}
          {bullets(['Must enable encryption at DB creation time — cannot enable later on running instance.', 'To encrypt existing unencrypted DB: snapshot → copy with encryption → restore → update endpoint.', 'Cannot create encrypted Read Replica from unencrypted source database.'])}
          {tip('"Primary RDS failed, needs automatic failover" → Multi-AZ. "App slow because of too many reads" → Read Replicas. "Enable encryption on existing production RDS" → snapshot + encrypted copy + restore. These are the 3 guaranteed Multi-AZ/Read Replica exam questions.')}
        </div>
      )
      case 'cognito': return (
        <div>
          {table(['Feature','User Pools','Identity Pools (Federated Identities)'],[ ['What it does','User directory — sign-up, sign-in, MFA','Grants temporary AWS credentials to users'], ['Output','JWT tokens (ID, Access, Refresh)','Temporary IAM credentials via STS AssumeRole'], ['Think of it as','The login system','The AWS access granter'], ['Federation','Google, Facebook, SAML, OIDC IdPs','User Pool tokens, social IdPs, SAML'] ])}
          {heading('Combined flow (most common exam scenario)')}
          {bullets(['1. User signs in via Cognito User Pool → receives JWT tokens.', '2. JWT sent to Identity Pool → Identity Pool calls STS.', '3. STS returns temporary AWS credentials (Access Key + Secret + Session Token).', '4. User\'s app uses credentials to directly access AWS services (S3 upload, DynamoDB read).', '5. IAM role attached to Identity Pool defines what the user can access.'])}
          {heading('Federated identity with existing IdP')}
          {text('Company uses Microsoft Active Directory via SAML → Cognito Identity Pool → temporary AWS credentials. Users authenticate against AD, get AWS access without creating IAM users.')}
          {tip('"Mobile app users need to upload files directly to S3 without going through the backend server" → Cognito Identity Pool (provides temp S3-scoped credentials). User Pool alone only gives JWT — it does not grant AWS service access. Identity Pool is the bridge to AWS.')}
        </div>
      )
      case 'containers': return (
        <div>
          {table(['Feature','ECS (Elastic Container Service)','EKS (Elastic Kubernetes Service)'],[ ['Orchestration','AWS proprietary','Kubernetes (CNCF standard)'], ['Learning curve','Lower','Higher (requires k8s knowledge)'], ['Portability','AWS-specific','Multi-cloud (k8s is portable)'], ['Managed control plane','✅','✅'], ['Use case','New AWS-native containerised app','Existing k8s workloads, multi-cloud'] ])}
          {heading('ECS launch types')}
          {table(['','EC2 Launch Type','Fargate'],[ ['Infrastructure','You manage EC2 instances','AWS manages — serverless'], ['Cost','Pay for EC2 regardless of utilisation','Pay per task vCPU + memory per second'], ['Control','Full host access, GPU support','No host access'], ['Use case','Need GPU, specific instance types, full control','Standard containers, simplicity, no ops overhead'] ])}
          {heading('Key ECS concepts')}
          {bullets(['Task Definition: Blueprint for container (image, CPU, memory, ports, env vars, IAM task role).', 'Task: Running instance of a Task Definition. Can have multiple containers per task.', 'Service: Maintains desired count of tasks. Replaces failed tasks. Integrates with ALB for traffic distribution.', 'ECR (Elastic Container Registry): Managed Docker registry. Stores and manages container images.'])}
          {tip('"Company uses Kubernetes on-prem and wants to migrate to AWS with minimal changes" → EKS. "New containerised app, team has no Kubernetes experience" → ECS with Fargate. "Need to run GPU workloads in containers" → ECS with EC2 launch type (Fargate does not support GPU).')}
        </div>
      )
      case 'securitysvc': return (
        <div>
          {table(['Service','What it does','Keyword trigger','Requires agent?'],[ ['GuardDuty','ML-based threat detection. Analyses VPC Flow Logs, CloudTrail, DNS logs.','Compromised instance, malicious IP, crypto mining','❌ No agent'], ['Macie','Discovers and classifies sensitive data (PII, financial) in S3 using ML.','PII in S3, data classification, GDPR compliance','❌ No agent'], ['Inspector','Automated vulnerability assessment for EC2 and ECR container images.','CVE scanning, patch compliance, network exposure','✅ EC2 agent (or agentless for ECR)'], ['Security Hub','Aggregates findings from GuardDuty, Inspector, Macie, Firewall Manager, 3rd party.','Single dashboard, security posture, compliance standards','❌ No agent'], ['Detective','Root cause analysis of security incidents using ML graph of entity relationships.','Investigate incident, who accessed what, root cause','❌ No agent'], ['Config','Tracks configuration changes and evaluates compliance against rules.','Configuration history, compliance drift, what changed when','❌ No agent'] ])}
          {heading('Decision flow')}
          {bullets(['"Active threat detected" → GuardDuty', '"PII exposed in S3 buckets" → Macie', '"EC2 has unpatched CVEs" → Inspector', '"One place to see all security findings" → Security Hub', '"Investigate how the breach happened" → Detective', '"Was my security group open to 0.0.0.0/0 last Tuesday?" → AWS Config'])}
          {tip('GuardDuty is passive intelligence — it detects but does not block. For blocking → WAF (layer 7), Shield Advanced (DDoS), Network Firewall (layer 3/4). Common exam trap: "Block malicious traffic in real time" → WAF or Security Group, NOT GuardDuty.')}
        </div>
      )
      case 'orgs': return (
        <div>
          {heading('AWS Organizations structure')}
          {bullets(['Management Account (Root): Central payer. Creates and manages member accounts. Not affected by SCPs.', 'Organizational Units (OUs): Group accounts by function (Production OU, Dev OU, Security OU).', 'Member Accounts: Individual AWS accounts. Can be restricted by SCPs applied to their OU.', 'Consolidated Billing: All accounts combined for volume discounts. One monthly bill to management account.'])}
          {heading('Service Control Policies (SCPs)')}
          {bullets(['Define the MAXIMUM permissions available to accounts/OUs — they do NOT grant permissions.', 'Applied at OU or account level. Restrict what IAM policies in that account CAN grant.', 'Effective permission = intersection of SCP AND IAM policy.', 'Affect all users and roles in member accounts — including that account\'s root user.', 'Do NOT affect the management account (root org account).', 'Example: SCP allows only S3 and EC2 → even if an IAM policy in the account allows RDS, users cannot access RDS.'])}
          {table(['','SCP','IAM Policy'],[ ['Grants permissions?','❌ Only restricts','✅ Yes'], ['Scope','Account/OU level','User/Role/Group level'], ['Overrides account root?','✅ Member account root','❌ IAM root bypass impossible'], ['Purpose','Guardrails across accounts','Permission grants within account'] ])}
          {tip('"Prevent any account in the organisation from disabling CloudTrail, even account administrators" → SCP with explicit Deny on cloudtrail:StopLogging applied to the OU. IAM policies cannot achieve this because account admins can modify IAM. SCPs override everything in member accounts.')}
        </div>
      )
      case 'stepfn': return (
        <div>
          {text('Step Functions orchestrates sequences of Lambda functions and AWS services into workflows, managing retries, error handling, and branching logic.')}
          {table(['Feature','Standard Workflow','Express Workflow'],[ ['Max duration','1 year','5 minutes'], ['Execution semantics','Exactly-once','At-least-once'], ['History','Full execution history in console','CloudWatch Logs only'], ['Use case','Long-running critical business workflows','High-volume short-duration (IoT, streaming)'], ['Cost','Per state transition','Per execution + duration'] ])}
          {heading('Key state types')}
          {bullets(['Task: Call a Lambda, ECS task, SNS, SQS, or any AWS service.', 'Choice: Conditional branching (if/else logic based on output).', 'Parallel: Execute multiple branches simultaneously, wait for all to complete.', 'Map: Iterate over an array — process each item independently (like forEach).', 'Wait: Pause execution for a fixed duration or until a timestamp.', 'Catch/Retry: Built-in error handling with configurable retry backoff.'])}
          {heading('EventBridge (formerly CloudWatch Events)')}
          {bullets(['React to events from 200+ AWS services and SaaS apps.', 'Schedule rules (cron): "Run Lambda every Monday at 8am".', 'Event pattern rules: "When EC2 instance changes to stopped state → notify SNS".', 'Event Bus: Default (AWS events), Partner (SaaS), Custom (your app events).'])}
          {tip('"Coordinate multiple Lambda functions with automatic retry and error handling" → Step Functions (not SQS chaining — no state management). "Trigger Lambda on a schedule" → EventBridge Scheduler. "React to S3 object upload across accounts" → EventBridge (supports cross-account event routing, unlike S3 notifications alone).')}
        </div>
      )
      default: return <div style={{ color: '#6b7280', fontSize: '0.875rem' }}>Content loading…</div>
    }
  }

  const weeks = [1, 2, 3, 4]

  return (
    <Layout>
      {/* Hero */}
      <div style={{ background: 'linear-gradient(135deg, #1e3a5f 0%, #1d4ed8 50%, #1e3a5f 100%)', padding: '2.5rem 1.5rem 2rem', textAlign: 'center', color: '#fff' }}>
        <div style={{ display: 'inline-block', background: 'rgba(147,197,253,0.15)', border: '1px solid rgba(147,197,253,0.4)', borderRadius: '999px', padding: '4px 14px', fontSize: '0.75rem', fontWeight: 700, color: '#bfdbfe', letterSpacing: '0.08em', marginBottom: '0.75rem' }}>
          ☁️ SAA-C03 · COMPLETE STUDY GUIDE
        </div>
        <h1 style={{ fontSize: 'clamp(1.6rem, 4vw, 2.25rem)', fontWeight: 900, margin: '0 0 0.75rem', lineHeight: 1.2 }}>
          The SAA-C03 Encyclopedia
        </h1>
        <p style={{ color: '#bfdbfe', fontSize: '0.95rem', maxWidth: '600px', margin: '0 auto 0.75rem', lineHeight: 1.6 }}>
          Every decision matrix, exam trap, deep dive, and study plan you need to pass — in one place. Covers all 4 domains and ~90% of real exam questions.
        </p>
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.25)', borderRadius: '999px', padding: '4px 14px', fontSize: '0.75rem', fontWeight: 700, color: '#4ade80' }}>
            ✅ {MATRIX.length} Decision Matrix rows
          </div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.25)', borderRadius: '999px', padding: '4px 14px', fontSize: '0.75rem', fontWeight: 700, color: '#4ade80' }}>
            ✅ {TRAPS.length} Exam traps
          </div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.25)', borderRadius: '999px', padding: '4px 14px', fontSize: '0.75rem', fontWeight: 700, color: '#4ade80' }}>
            ✅ {DEEP_DIVES.length} Deep dive sections
          </div>
        </div>
      </div>

      {/* Tab bar */}
      <div style={{ background: '#fff', borderBottom: '1px solid #e5e7eb', padding: '0 1rem', display: 'flex', gap: '0', overflowX: 'auto', justifyContent: 'center' }}>
        {TAB_LIST.map(t => (
          <button key={t.id} onClick={() => { setActiveTab(t.id); setExpanded(null); setSearch('') }}
            style={{ padding: '0.9rem 1rem', background: 'none', border: 'none', cursor: 'pointer', fontWeight: activeTab === t.id ? 700 : 500, fontSize: '0.85rem', whiteSpace: 'nowrap', color: activeTab === t.id ? '#1d4ed8' : '#6b7280', borderBottom: activeTab === t.id ? '2px solid #1d4ed8' : '2px solid transparent', transition: 'all 0.15s' }}>
            {t.label}
            <span style={{ marginLeft: '5px', fontSize: '0.7rem', background: activeTab === t.id ? '#eff6ff' : '#f3f4f6', color: activeTab === t.id ? '#1d4ed8' : '#9ca3af', padding: '1px 7px', borderRadius: '999px', fontWeight: 600 }}>{t.count}</span>
          </button>
        ))}
      </div>

      <div style={{ maxWidth: '960px', margin: '0 auto', padding: '2rem 1.5rem' }}>

        {/* ── DECISION MATRIX ── */}
        {activeTab === 'matrix' && (
          <div>
            <p style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '1rem' }}>
              {MATRIX.length} requirement → solution mappings. Search by keyword, service name, or concept. This table solves ~40% of exam questions.
            </p>
            <input
              type="text" value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search e.g. 'latency', 'encrypt', 'cost', 'failover'…"
              style={{ width: '100%', padding: '10px 16px', border: '1px solid #d1d5db', borderRadius: '10px', fontSize: '0.9rem', marginBottom: '1rem', boxSizing: 'border-box', outline: 'none' }}
            />
            {filteredMatrix.length === 0 && (
              <div style={{ textAlign: 'center', color: '#6b7280', padding: '2rem', fontSize: '0.875rem' }}>No matches for "{search}"</div>
            )}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {filteredMatrix.map((row, i) => (
                <div key={i} style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '0.875rem 1.1rem', display: 'grid', gridTemplateColumns: '1fr auto', gap: '0.75rem', alignItems: 'start' }}>
                  <div>
                    <div style={{ fontSize: '0.85rem', color: '#374151', lineHeight: 1.5, marginBottom: '0.35rem' }}>{row.requirement}</div>
                    <div style={{ fontSize: '0.78rem', color: '#6b7280', lineHeight: 1.45 }}>{row.why}</div>
                  </div>
                  <div style={{ background: '#eff6ff', color: '#1d4ed8', padding: '4px 12px', borderRadius: '999px', fontSize: '0.78rem', fontWeight: 700, whiteSpace: 'nowrap', flexShrink: 0 }}>{row.solution}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── EXAM TRAPS ── */}
        {activeTab === 'traps' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <p style={{ color: '#6b7280', fontSize: '0.875rem', margin: '0 0 0.5rem' }}>
              {TRAPS.length} traps that appear on every SAA-C03 sitting. Know why the wrong answer looks right.
            </p>
            {TRAPS.map(t => {
              const isOpen = expanded === t.title
              const trapId = `trap-${t.title.replace(/\s+/g, '-')}`
              return (
                <div id={trapId} key={t.title} style={{ background: '#fff', border: `1px solid ${isOpen ? '#dc2626' : '#e5e7eb'}`, borderRadius: '14px', overflow: 'hidden', boxShadow: isOpen ? '0 0 0 3px rgba(220,38,38,0.07)' : 'none', transition: 'all 0.15s' }}>
                  <button onClick={() => { const opening = !isOpen; setExpanded(opening ? t.title : null); if (opening) setTimeout(() => document.getElementById(trapId)?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 80) }} style={{ width: '100%', padding: '1rem 1.25rem', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.875rem', textAlign: 'left' }}>
                    <span style={{ fontSize: '1.4rem', flexShrink: 0 }}>{t.icon}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: '0.92rem', color: '#111827' }}>{t.title}</div>
                      <div style={{ fontSize: '0.78rem', color: '#6b7280', marginTop: '0.15rem' }}>Triggered by: {t.trigger}</div>
                    </div>
                    <span style={{ color: '#6b7280', flexShrink: 0 }}>{isOpen ? '▲' : '▼'}</span>
                  </button>
                  {isOpen && (
                    <div style={{ borderTop: '1px solid #f3f4f6', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                        <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '10px', padding: '0.875rem' }}>
                          <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#991b1b', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '0.35rem' }}>❌ Wrong answer</div>
                          <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#7f1d1d', marginBottom: '0.35rem' }}>{t.wrong}</div>
                          <div style={{ fontSize: '0.8rem', color: '#991b1b', lineHeight: 1.5 }}>{t.wrongWhy}</div>
                        </div>
                        <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '10px', padding: '0.875rem' }}>
                          <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#166534', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '0.35rem' }}>✅ Correct answer</div>
                          <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#14532d', marginBottom: '0.35rem' }}>{t.correct}</div>
                          <div style={{ fontSize: '0.8rem', color: '#166534', lineHeight: 1.5 }}>{t.correctWhy}</div>
                        </div>
                      </div>
                      <div style={{ background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '10px', padding: '0.875rem 1rem' }}>
                        <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '0.35rem' }}>💡 Remember this</div>
                        <div style={{ fontSize: '0.875rem', color: '#374151', lineHeight: 1.6 }}>{t.tip}</div>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}

        {/* ── DEEP DIVES ── */}
        {activeTab === 'deepdives' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <p style={{ color: '#6b7280', fontSize: '0.875rem', margin: '0 0 0.5rem' }}>
              {DEEP_DIVES.length} sections covering every heavily-tested topic. Expand any section to see comparison tables, decision rules, and exam tips.
            </p>
            {DEEP_DIVES.map(d => {
              const isOpen = expanded === d.id
              const diveId = `dive-${d.id}`
              return (
                <div id={diveId} key={d.id} style={{ background: '#fff', border: `1px solid ${isOpen ? '#1d4ed8' : '#e5e7eb'}`, borderRadius: '14px', overflow: 'hidden', boxShadow: isOpen ? '0 0 0 3px rgba(29,78,216,0.08)' : 'none', transition: 'all 0.15s' }}>
                  <button onClick={() => { const opening = !isOpen; setExpanded(opening ? d.id : null); if (opening) setTimeout(() => document.getElementById(diveId)?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 80) }} style={{ width: '100%', padding: '1rem 1.25rem', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.875rem', textAlign: 'left' }}>
                    <span style={{ fontSize: '1.4rem', flexShrink: 0 }}>{d.icon}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: '0.92rem', color: '#111827' }}>{d.title}</div>
                      <div style={{ fontSize: '0.78rem', color: '#6b7280', marginTop: '0.15rem' }}>{d.summary}</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                      <span style={{ background: '#f3f4f6', color: '#374151', border: '1px solid #e5e7eb', borderRadius: '999px', fontSize: '0.7rem', fontWeight: 700, padding: '2px 8px' }}>{d.badge}</span>
                      <span style={{ color: '#6b7280' }}>{isOpen ? '▲' : '▼'}</span>
                    </div>
                  </button>
                  {isOpen && (
                    <div style={{ borderTop: '1px solid #f3f4f6', padding: '1.25rem' }}>
                      {renderDeepDive(d.id)}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}

        {/* ── STUDY PLAN ── */}
        {activeTab === 'studyplan' && (
          <div>
            <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '14px', padding: '1.25rem', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#111827' }}>Overall Progress</div>
                <div style={{ fontWeight: 800, fontSize: '1.1rem', color: '#1d4ed8' }}>{checkedDays.size} / 30 days</div>
              </div>
              <div style={{ background: '#f3f4f6', borderRadius: '999px', height: '10px', overflow: 'hidden' }}>
                <div style={{ background: 'linear-gradient(90deg, #2563eb, #1d4ed8)', height: '100%', width: `${progress}%`, borderRadius: '999px', transition: 'width 0.3s' }} />
              </div>
              <div style={{ fontSize: '0.78rem', color: '#6b7280', marginTop: '0.5rem' }}>{progress}% complete {progress === 100 ? '🎉 Ready for the exam!' : progress >= 70 ? '— almost there!' : ''}</div>
            </div>
            {weeks.map(week => (
              <div key={week} style={{ marginBottom: '1.5rem' }}>
                <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#374151', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ background: '#1d4ed8', color: '#fff', borderRadius: '999px', padding: '2px 10px', fontSize: '0.72rem' }}>Week {week}</span>
                  {week === 1 && 'Foundations & Security'}
                  {week === 2 && 'Compute & Databases'}
                  {week === 3 && 'Architecture Patterns'}
                  {week === 4 && 'Mastery & Final Prep'}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {STUDY_PLAN.filter(d => d.week === week).map(day => {
                    const done = checkedDays.has(day.day)
                    const isExam = day.title.includes('Practice Exam') || day.title.includes('EXAM DAY')
                    return (
                      <div key={day.day} onClick={() => toggleDay(day.day)}
                        style={{ background: done ? '#f0fdf4' : '#fff', border: `1px solid ${done ? '#86efac' : isExam ? '#fbbf24' : '#e5e7eb'}`, borderRadius: '12px', padding: '0.875rem 1rem', cursor: 'pointer', display: 'flex', gap: '0.875rem', alignItems: 'flex-start', transition: 'all 0.15s' }}>
                        <div style={{ width: '22px', height: '22px', borderRadius: '50%', border: `2px solid ${done ? '#16a34a' : '#d1d5db'}`, background: done ? '#16a34a' : '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '1px' }}>
                          {done && <span style={{ color: '#fff', fontSize: '12px', fontWeight: 700 }}>✓</span>}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.35rem', flexWrap: 'wrap' }}>
                            <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#6b7280' }}>Day {day.day}</span>
                            <span style={{ fontWeight: 700, fontSize: '0.88rem', color: done ? '#15803d' : '#111827' }}>{day.title}</span>
                            {isExam && <span style={{ background: '#f3f4f6', color: '#374151', border: '1px solid #e5e7eb', borderRadius: '999px', fontSize: '0.68rem', fontWeight: 700, padding: '1px 8px' }}>Milestone</span>}
                          </div>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                            {day.topics.map((topic, i) => (
                              <span key={i} style={{ fontSize: '0.75rem', color: done ? '#15803d' : '#6b7280', background: done ? 'rgba(22,163,74,0.08)' : '#f9fafb', padding: '2px 8px', borderRadius: '6px' }}>{topic}</span>
                            ))}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── QUICK REFERENCE ── */}
        {activeTab === 'reference' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

            {/* Port numbers */}
            <div>
              <h3 style={{ fontWeight: 800, fontSize: '1rem', color: '#111827', marginBottom: '0.75rem' }}>🔌 Critical Port Numbers</h3>
              <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', overflow: 'hidden' }}>
                {PORTS.map((p, i) => (
                  <div key={i} style={{ display: 'grid', gridTemplateColumns: '80px 1fr 1fr', padding: '10px 16px', borderBottom: i < PORTS.length - 1 ? '1px solid #f3f4f6' : 'none', background: i % 2 === 0 ? '#fff' : '#fafafa' }}>
                    <span style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: '0.9rem', color: '#1d4ed8' }}>{p.port}</span>
                    <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#111827' }}>{p.protocol}</span>
                    <span style={{ fontSize: '0.82rem', color: '#6b7280' }}>{p.use}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* DR Strategies */}
            <div>
              <h3 style={{ fontWeight: 800, fontSize: '1rem', color: '#111827', marginBottom: '0.75rem' }}>🔄 Disaster Recovery Strategies</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {DR_STRATEGIES.map(dr => (
                  <div key={dr.name} style={{ background: dr.color, border: `1px solid ${dr.border}`, borderRadius: '12px', padding: '1rem 1.25rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem', flexWrap: 'wrap', gap: '8px' }}>
                      <span style={{ fontWeight: 800, fontSize: '0.95rem', color: '#111827' }}>{dr.name}</span>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: 700, background: 'rgba(0,0,0,0.07)', padding: '2px 8px', borderRadius: '6px' }}>RTO: {dr.rto}</span>
                        <span style={{ fontSize: '0.75rem', fontWeight: 700, background: 'rgba(0,0,0,0.07)', padding: '2px 8px', borderRadius: '6px' }}>RPO: {dr.rpo}</span>
                        <span style={{ fontSize: '0.75rem', fontWeight: 700, background: 'rgba(0,0,0,0.07)', padding: '2px 8px', borderRadius: '6px' }}>{dr.cost}</span>
                      </div>
                    </div>
                    <p style={{ fontSize: '0.85rem', color: '#374151', margin: 0, lineHeight: 1.55 }}>{dr.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Well-Architected Pillars */}
            <div>
              <h3 style={{ fontWeight: 800, fontSize: '1rem', color: '#111827', marginBottom: '0.75rem' }}>🏛️ Well-Architected Framework — 6 Pillars</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '0.75rem' }}>
                {PILLARS.map(p => (
                  <div key={p.name} style={{ background: '#fff', border: `1px solid #e5e7eb`, borderRadius: '12px', padding: '1rem', borderLeft: `4px solid ${p.color}` }}>
                    <div style={{ fontWeight: 700, fontSize: '0.88rem', color: '#111827', marginBottom: '0.35rem' }}>{p.icon} {p.name}</div>
                    <div style={{ fontSize: '0.78rem', color: '#6b7280', lineHeight: 1.5 }}>{p.keywords}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* EC2 instance families */}
            <div>
              <h3 style={{ fontWeight: 800, fontSize: '1rem', color: '#111827', marginBottom: '0.75rem' }}>💻 EC2 Instance Families</h3>
              <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', overflow: 'hidden' }}>
                {[
                  { family: 'T3, T4g', type: 'General Purpose (Burstable)', use: 'Web servers, dev/test, small DBs. CPU credits for bursts.' },
                  { family: 'M5, M6i', type: 'General Purpose (Balanced)', use: 'App servers, mid-size DBs, code repos. Consistent CPU.' },
                  { family: 'C5, C6i', type: 'Compute Optimised', use: 'Batch processing, gaming, transcoding, HPC. High CPU.' },
                  { family: 'R5, R6i', type: 'Memory Optimised', use: 'In-memory DBs (Redis), real-time analytics, SAP HANA.' },
                  { family: 'X1, X2', type: 'Memory Optimised (Large)', use: 'SAP HANA, Apache Spark. Highest RAM per vCPU.' },
                  { family: 'I3, I4i', type: 'Storage Optimised', use: 'NoSQL DBs (Cassandra), OLTP, data warehousing. High sequential I/O.' },
                  { family: 'P3, P4', type: 'Accelerated Computing (GPU)', use: 'Machine learning training, graphics rendering, CUDA.' },
                  { family: 'G4, G5', type: 'Accelerated Computing (GPU)', use: 'ML inference, video transcoding, game streaming.' },
                ].map((r, i) => (
                  <div key={i} style={{ display: 'grid', gridTemplateColumns: '80px 200px 1fr', padding: '10px 16px', borderBottom: i < 7 ? '1px solid #f3f4f6' : 'none', background: i % 2 === 0 ? '#fff' : '#fafafa', alignItems: 'start', gap: '8px' }}>
                    <span style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: '0.85rem', color: '#1d4ed8' }}>{r.family}</span>
                    <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#374151' }}>{r.type}</span>
                    <span style={{ fontSize: '0.8rem', color: '#6b7280' }}>{r.use}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── EXAM STRATEGY ── */}
        {activeTab === 'strategy' && (
          <div>
            <p style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
              Knowing the content is 70% of passing. The remaining 30% is strategy. These {STRATEGY_TIPS.length} tips are the difference between 710 and 780.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {STRATEGY_TIPS.map((tip, i) => (
                <div key={i} style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '14px', padding: '1.25rem', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <div style={{ width: '44px', height: '44px', background: '#eff6ff', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', flexShrink: 0 }}>{tip.icon}</div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#111827', marginBottom: '0.4rem' }}>{tip.title}</div>
                    <div style={{ fontSize: '0.875rem', color: '#4b5563', lineHeight: 1.65 }}>{tip.desc}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Keyword cheat card */}
            <div style={{ marginTop: '2rem', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '1.25rem' }}>
              <h3 style={{ fontWeight: 800, color: '#0f172a', fontSize: '0.95rem', marginBottom: '1rem' }}>⚡ Instant Keyword → Service Map</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '0.5rem' }}>
                {[
                  ['Decouple', 'SQS / SNS'], ['Global low latency', 'CloudFront'], ['Temporary credentials', 'IAM Role'],
                  ['Block IP address', 'NACL'], ['NoSQL / high scale', 'DynamoDB'], ['Rotate credentials', 'Secrets Manager'],
                  ['Real-time streaming', 'Kinesis'], ['Serverless orchestration', 'Step Functions'], ['SSH without port 22', 'Session Manager'],
                  ['Many VPCs + on-prem', 'Transit Gateway'], ['Static IPs global', 'Global Accelerator'], ['PII in S3', 'Macie'],
                  ['CVE / patches', 'Inspector'], ['Threat detection', 'GuardDuty'], ['A/B testing DNS', 'Route 53 Weighted'],
                  ['Country-based routing', 'Route 53 Geolocation'], ['DB failover auto', 'RDS Multi-AZ'], ['DB reads scale', 'Read Replicas'],
                  ['Tape backup VTL', 'Storage Gateway Tape'], ['On-prem NFS to S3', 'S3 File Gateway'],
                ].map(([kw, svc], i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '6px 10px', gap: '8px' }}>
                    <span style={{ fontSize: '0.78rem', color: '#374151', fontStyle: 'italic' }}>{kw}</span>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#1d4ed8', background: '#eff6ff', padding: '2px 7px', borderRadius: '6px', whiteSpace: 'nowrap' }}>{svc}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── NUMBERS & FACTS ── */}
        {activeTab === 'numbers' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

            {/* Intro */}
            <div style={{ background: 'linear-gradient(135deg, #eff6ff, #dbeafe)', border: '1px solid #bfdbfe', borderRadius: '14px', padding: '1.25rem' }}>
              <div style={{ fontWeight: 800, fontSize: '1rem', color: '#1e40af', marginBottom: '6px' }}>📊 {CRITICAL_NUMBERS.length} Critical Numbers to Memorise</div>
              <div style={{ color: '#3b82f6', fontSize: '0.875rem', lineHeight: 1.6 }}>
                These exact values appear in SAA-C03 questions. Knowing them removes all ambiguity. Scan this table in your final 48 hours before the exam.
              </div>
            </div>

            {/* Critical Numbers Table */}
            <div>
              <h3 style={{ fontWeight: 800, fontSize: '1rem', color: '#111827', marginBottom: '0.75rem' }}>🔢 Critical Numbers</h3>
              <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', overflow: 'hidden' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr auto', background: '#eff6ff', padding: '8px 14px', fontWeight: 700, fontSize: '0.78rem', color: '#1e40af', gap: '8px' }}>
                  <span>Service</span><span>Fact</span><span>Value</span>
                </div>
                {CRITICAL_NUMBERS.map((row, i) => (
                  <div key={i} style={{ display: 'grid', gridTemplateColumns: '120px 1fr auto', padding: '9px 14px', borderTop: '1px solid #f3f4f6', background: i % 2 === 0 ? '#fff' : '#fafafa', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontWeight: 700, fontSize: '0.78rem', color: '#1d4ed8', fontFamily: 'monospace' }}>{row.service}</span>
                    <span style={{ fontSize: '0.82rem', color: '#374151' }}>{row.fact}</span>
                    <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#111827', background: '#f0fdf4', border: '1px solid #bbf7d0', padding: '2px 10px', borderRadius: '6px', whiteSpace: 'nowrap' }}>{row.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* DynamoDB RCU / WCU Math */}
            <div>
              <h3 style={{ fontWeight: 800, fontSize: '1rem', color: '#111827', marginBottom: '0.75rem' }}>🧮 DynamoDB RCU / WCU Capacity Math</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '12px', marginBottom: '12px' }}>
                {/* Formulas */}
                <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', overflow: 'hidden' }}>
                  <div style={{ padding: '10px 14px', background: '#eff6ff', borderBottom: '1px solid #bfdbfe' }}>
                    <h4 style={{ fontWeight: 700, fontSize: '0.85rem', color: '#1d4ed8', margin: 0 }}>📐 The Formulas</h4>
                  </div>
                  {[
                    { label: '1 RCU', def: '= 1 strongly consistent read/sec for an item ≤ 4 KB', note: 'OR 2 eventually consistent reads/sec for ≤ 4 KB' },
                    { label: '1 WCU', def: '= 1 write/sec for an item ≤ 1 KB', note: 'Larger items consume proportionally more WCUs' },
                    { label: 'RCU Formula (strong)', def: 'CEIL(item_size_KB / 4) × reads_per_sec', note: 'Always round UP the item size division' },
                    { label: 'RCU Formula (eventual)', def: 'CEIL(item_size_KB / 4) × reads_per_sec ÷ 2', note: 'Eventual consistency = half the RCUs' },
                    { label: 'WCU Formula', def: 'CEIL(item_size_KB / 1) × writes_per_sec', note: 'Each 1 KB fraction counts as a full WCU' },
                  ].map((f, i) => (
                    <div key={i} style={{ padding: '9px 14px', borderTop: i > 0 ? '1px solid #f3f4f6' : 'none', background: i % 2 === 0 ? '#fff' : '#fafafa' }}>
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start', marginBottom: '2px' }}>
                        <span style={{ fontWeight: 800, fontSize: '0.78rem', color: '#1d4ed8', background: '#eff6ff', padding: '1px 7px', borderRadius: '5px', flexShrink: 0, whiteSpace: 'nowrap' }}>{f.label}</span>
                        <span style={{ fontWeight: 700, fontSize: '0.8rem', color: '#111827', fontFamily: 'monospace' }}>{f.def}</span>
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#6b7280', paddingLeft: '4px' }}>{f.note}</div>
                    </div>
                  ))}
                </div>

                {/* Worked Examples */}
                <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', overflow: 'hidden' }}>
                  <div style={{ padding: '10px 14px', background: '#fef9c3', borderBottom: '1px solid #fde047' }}>
                    <h4 style={{ fontWeight: 700, fontSize: '0.85rem', color: '#713f12', margin: 0 }}>✏️ Worked Examples (Exam-style)</h4>
                  </div>
                  {[
                    {
                      q: 'Read 10 KB item, strong consistency, 10 reads/sec',
                      steps: ['CEIL(10 / 4) = 3 RCU per read', '3 × 10 = 30 RCU total'],
                      answer: '30 RCU',
                      color: '#1d4ed8',
                    },
                    {
                      q: 'Read 10 KB item, eventual consistency, 10 reads/sec',
                      steps: ['CEIL(10 / 4) = 3 RCU per read (strong)', '3 × 10 ÷ 2 = 15 RCU (eventual = ½)'],
                      answer: '15 RCU',
                      color: '#059669',
                    },
                    {
                      q: 'Write 3.5 KB item at 5 writes/sec',
                      steps: ['CEIL(3.5 / 1) = 4 WCU per write', '4 × 5 = 20 WCU total'],
                      answer: '20 WCU',
                      color: '#dc2626',
                    },
                    {
                      q: 'Read 1 KB item, eventual consistency, 100 reads/sec',
                      steps: ['CEIL(1 / 4) = 1 RCU per read (rounds up to 1)', '1 × 100 ÷ 2 = 50 RCU'],
                      answer: '50 RCU',
                      color: '#7c3aed',
                    },
                  ].map((ex, i) => (
                    <div key={i} style={{ padding: '10px 14px', borderTop: i > 0 ? '1px solid #f3f4f6' : 'none', background: i % 2 === 0 ? '#fff' : '#fffbeb' }}>
                      <div style={{ fontWeight: 700, fontSize: '0.78rem', color: '#111827', marginBottom: '4px' }}>Q: {ex.q}</div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', marginBottom: '4px' }}>
                        {ex.steps.map((s, j) => (
                          <div key={j} style={{ fontSize: '0.75rem', color: '#6b7280', fontFamily: 'monospace', paddingLeft: '8px' }}>→ {s}</div>
                        ))}
                      </div>
                      <div style={{ display: 'inline-block', fontWeight: 800, fontSize: '0.8rem', color: '#fff', background: ex.color, padding: '2px 10px', borderRadius: '6px' }}>Answer: {ex.answer}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick reference card */}
              <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '10px', padding: '1rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '8px' }}>
                {[
                  { rule: 'Item ≤ 4 KB', detail: '1 RCU (strong) · 0.5 RCU (eventual)' },
                  { rule: 'Item = 5 KB', detail: '2 RCU (strong) · 1 RCU (eventual) — always round UP' },
                  { rule: 'Item ≤ 1 KB', detail: '1 WCU regardless of actual size' },
                  { rule: 'Item = 2.5 KB', detail: '3 WCU — CEIL(2.5) = 3' },
                  { rule: 'Eventual = ÷2', detail: 'Exactly half the RCUs of strongly consistent' },
                  { rule: 'Transactional', detail: '2× RCU and 2× WCU — transactions cost double' },
                ].map((r, i) => (
                  <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    <div style={{ fontWeight: 700, fontSize: '0.78rem', color: '#065f46' }}>{r.rule}</div>
                    <div style={{ fontSize: '0.75rem', color: '#374151' }}>{r.detail}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Service Distinctions */}
            <div>
              <h3 style={{ fontWeight: 800, fontSize: '1rem', color: '#111827', marginBottom: '0.75rem' }}>⚡ Service Distinctions — Storage</h3>
              <ServiceDistinctionTable rows={DISTINCTIONS_STORAGE} />
            </div>

            <div>
              <h3 style={{ fontWeight: 800, fontSize: '1rem', color: '#111827', marginBottom: '0.75rem' }}>⚡ Service Distinctions — Compute</h3>
              <ServiceDistinctionTable rows={DISTINCTIONS_COMPUTE} />
            </div>

            <div>
              <h3 style={{ fontWeight: 800, fontSize: '1rem', color: '#111827', marginBottom: '0.75rem' }}>⚡ Service Distinctions — Networking</h3>
              <ServiceDistinctionTable rows={DISTINCTIONS_NETWORKING} />
            </div>

            <div>
              <h3 style={{ fontWeight: 800, fontSize: '1rem', color: '#111827', marginBottom: '0.75rem' }}>⚡ Service Distinctions — Databases</h3>
              <ServiceDistinctionTable rows={DISTINCTIONS_DB} />
            </div>

            {/* Architecture Patterns */}
            <div>
              <h3 style={{ fontWeight: 800, fontSize: '1rem', color: '#111827', marginBottom: '0.75rem' }}>🧠 Architecture Patterns to Memorise</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {ARCH_PATTERNS.map((p, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', background: '#fff', border: '1px solid #e5e7eb', borderRadius: '10px', padding: '10px 14px' }}>
                    <span style={{ fontSize: '0.78rem', fontWeight: 700, background: '#eff6ff', color: '#1d4ed8', border: '1px solid #bfdbfe', padding: '2px 10px', borderRadius: '6px', whiteSpace: 'nowrap', flexShrink: 0 }}>{p.label}</span>
                    <span style={{ fontSize: '0.85rem', color: '#374151', lineHeight: 1.5 }}>→ {p.pattern}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Traps */}
            <div>
              <h3 style={{ fontWeight: 800, fontSize: '1rem', color: '#111827', marginBottom: '0.75rem' }}>🚫 Common Exam Traps — Quick Reference</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {QUICK_TRAPS.map((t, i) => (
                  <div key={i} style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '10px', padding: '10px 14px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', alignItems: 'start' }}>
                    <div style={{ display: 'flex', gap: '6px', alignItems: 'flex-start' }}>
                      <span style={{ color: '#ef4444', fontWeight: 700, fontSize: '0.8rem', flexShrink: 0 }}>❌</span>
                      <span style={{ fontSize: '0.82rem', color: '#6b7280', lineHeight: 1.5 }}>{t.wrong}</span>
                    </div>
                    <div style={{ display: 'flex', gap: '6px', alignItems: 'flex-start' }}>
                      <span style={{ color: '#16a34a', fontWeight: 700, fontSize: '0.8rem', flexShrink: 0 }}>✅</span>
                      <span style={{ fontSize: '0.82rem', color: '#111827', fontWeight: 600, lineHeight: 1.5 }}>{t.right}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Pricing quick pick */}
            <div>
              <h3 style={{ fontWeight: 800, fontSize: '1rem', color: '#111827', marginBottom: '0.75rem' }}>💰 EC2 Pricing Models — When to Use</h3>
              <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', overflow: 'hidden' }}>
                {[
                  { model: 'On-Demand', discount: '0% (list price)', when: 'Short-term, unpredictable, testing, getting started', color: '#6b7280' },
                  { model: 'Savings Plans', discount: 'Up to 72%', when: 'Flexible commitment — covers EC2, Lambda, and Fargate across types/regions', color: '#059669' },
                  { model: 'Reserved Instances', discount: 'Up to 72%', when: 'Predictable, steady-state, specific instance type/region, 1–3 yr', color: '#2563eb' },
                  { model: 'Spot Instances', discount: 'Up to 90%', when: 'Fault-tolerant, flexible, batch, stateless. Can be interrupted with 2-min notice.', color: '#d97706' },
                  { model: 'Dedicated Hosts', discount: 'No discount (premium)', when: 'Compliance, BYOL (Bring Your Own Licence), physical server isolation', color: '#7c3aed' },
                ].map((p, i) => (
                  <div key={i} style={{ display: 'grid', gridTemplateColumns: '160px 100px 1fr', padding: '10px 14px', borderTop: i > 0 ? '1px solid #f3f4f6' : 'none', background: i % 2 === 0 ? '#fff' : '#fafafa', alignItems: 'start', gap: '8px' }}>
                    <span style={{ fontWeight: 700, fontSize: '0.85rem', color: '#111827' }}>{p.model}</span>
                    <span style={{ fontSize: '0.78rem', fontWeight: 700, color: p.color }}>{p.discount}</span>
                    <span style={{ fontSize: '0.8rem', color: '#6b7280', lineHeight: 1.5 }}>{p.when}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* HA vs DR table */}
            <div>
              <h3 style={{ fontWeight: 800, fontSize: '1rem', color: '#111827', marginBottom: '0.75rem' }}>🌐 HA vs DR — Key Distinction</h3>
              <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', overflow: 'hidden' }}>
                {[
                  { term: 'High Availability (HA)', def: 'Survive AZ failure', impl: 'Multi-AZ RDS + ALB across AZs + Auto Scaling across AZs' },
                  { term: 'Disaster Recovery (DR)', def: 'Survive Region failure', impl: 'Multi-Region deployment + S3 CRR + Route 53 Failover Routing' },
                  { term: 'RTO', def: 'Recovery Time Objective', impl: 'How fast you restore service — time to recover' },
                  { term: 'RPO', def: 'Recovery Point Objective', impl: 'How much data loss is acceptable — time between backups' },
                  { term: 'Pilot Light', def: 'Core DB always running in DR region', impl: 'DB replicated. App tier stopped. Scale up on failover.' },
                  { term: 'Warm Standby', def: 'Scaled-down full env always running', impl: 'Always on in secondary region. Scale to full on failover.' },
                  { term: 'Multi-Site Active/Active', def: 'Full prod in 2+ regions simultaneously', impl: 'Route 53 latency/geolocation. Near-zero RTO. Highest cost.' },
                ].map((r, i) => (
                  <div key={i} style={{ display: 'grid', gridTemplateColumns: '180px 200px 1fr', padding: '9px 14px', borderTop: i > 0 ? '1px solid #f3f4f6' : 'none', background: i % 2 === 0 ? '#fff' : '#fafafa', alignItems: 'start', gap: '8px' }}>
                    <span style={{ fontWeight: 700, fontSize: '0.82rem', color: '#1d4ed8' }}>{r.term}</span>
                    <span style={{ fontSize: '0.8rem', color: '#374151' }}>{r.def}</span>
                    <span style={{ fontSize: '0.8rem', color: '#6b7280', lineHeight: 1.5 }}>{r.impl}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* ════════════════════════════════════════════════════════════
             ARCHITECT'S CODEX TAB
             ════════════════════════════════════════════════════════════ */}
        {activeTab === 'codex' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

            {/* PART 1 — ARCHITECT'S MINDSET */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}>
                <div style={{ width: '36px', height: '36px', background: 'linear-gradient(135deg,#1d4ed8,#7c3aed)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem' }}>🧠</div>
                <h3 style={{ fontWeight: 800, fontSize: '1.05rem', color: '#111827', margin: 0 }}>Part 1 — The Architect's Mindset</h3>
              </div>

              {/* 4 Golden Rules */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(270px, 1fr))', gap: '12px', marginBottom: '1.25rem' }}>
                {[
                  { num: '1', rule: 'ELIMINATE before selecting', desc: 'Read every answer and cross out options that contradict explicit keywords. Wrong answers usually violate one clear constraint (cost, latency, encryption, durability).', color: '#1d4ed8', bg: '#eff6ff' },
                  { num: '2', rule: 'AWS MANAGED > self-managed', desc: 'AWS prefers "undifferentiated heavy lifting" answers. RDS over EC2+MySQL. ECS Fargate over EC2. Managed beats DIY unless the question demands self-managed.', color: '#059669', bg: '#ecfdf5' },
                  { num: '3', rule: 'LEAST PRIVILEGE always wins', desc: 'Security questions default to the most restrictive option that still satisfies the requirement. If you can deny instead of allow, deny. IAM over VPC security alone.', color: '#7c3aed', bg: '#f5f3ff' },
                  { num: '4', rule: 'COST optimisation = right-size first', desc: 'Before Spot or Reserved, ask whether the workload is sized correctly. Exam often tricks with "cheapest" where the real answer is right-sizing then commit pricing.', color: '#d97706', bg: '#fffbeb' },
                ].map(g => (
                  <div key={g.num} style={{ background: g.bg, border: `1.5px solid ${g.color}22`, borderRadius: '12px', padding: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                      <span style={{ width: '24px', height: '24px', background: g.color, color: '#fff', borderRadius: '50%', fontSize: '0.75rem', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{g.num}</span>
                      <span style={{ fontWeight: 800, fontSize: '0.85rem', color: g.color }}>{g.rule}</span>
                    </div>
                    <p style={{ fontSize: '0.82rem', color: '#374151', lineHeight: 1.6, margin: 0 }}>{g.desc}</p>
                  </div>
                ))}
              </div>

              {/* Decision Framework */}
              <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '1.25rem' }}>
                <h4 style={{ fontWeight: 700, fontSize: '0.9rem', color: '#111827', margin: '0 0 1rem' }}>⚙️ Universal Decision Framework — apply to every scenario question</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {[
                    { step: '① Identify the primary constraint', detail: 'Performance / Cost / Security / Durability / Availability — one always dominates the scenario' },
                    { step: '② Classify the workload', detail: 'Stateful vs Stateless · Bursty vs Steady · Real-time vs Batch · Read-heavy vs Write-heavy' },
                    { step: '③ Identify integration points', detail: 'On-prem hybrid? Multi-account? Cross-region? Existing VPC? Third-party SFTP? These constrain options immediately.' },
                    { step: '④ Apply the "Well-Architected" lens', detail: 'Operational Excellence · Security · Reliability · Performance Efficiency · Cost Optimisation · Sustainability' },
                    { step: '⑤ Eliminate then select', detail: 'Cross out options violating ①–③. Pick the AWS-managed answer that best satisfies the dominant constraint.' },
                  ].map((s, i) => (
                    <div key={i} style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '12px', padding: '8px 12px', background: i % 2 === 0 ? '#f9fafb' : '#fff', borderRadius: '8px', alignItems: 'start' }}>
                      <span style={{ fontWeight: 700, fontSize: '0.82rem', color: '#1d4ed8' }}>{s.step}</span>
                      <span style={{ fontSize: '0.81rem', color: '#374151', lineHeight: 1.55 }}>{s.detail}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* PART 2 — SERVICE SELECTION DECISION TREES */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}>
                <div style={{ width: '36px', height: '36px', background: 'linear-gradient(135deg,#059669,#0d9488)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem' }}>🗺️</div>
                <h3 style={{ fontWeight: 800, fontSize: '1.05rem', color: '#111827', margin: 0 }}>Part 2 — Service Selection Decision Trees</h3>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '12px' }}>

                {/* Storage Tree */}
                <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', overflow: 'hidden' }}>
                  <div style={{ background: 'linear-gradient(90deg,#0f766e,#0d9488)', padding: '10px 14px' }}>
                    <span style={{ color: '#fff', fontWeight: 700, fontSize: '0.88rem' }}>🗄️ STORAGE — Which service?</span>
                  </div>
                  <pre style={{ margin: 0, padding: '1rem', fontSize: '0.75rem', fontFamily: 'monospace', color: '#1f2937', background: '#f9fafb', lineHeight: 1.7, overflowX: 'auto', whiteSpace: 'pre' }}>{`Need object storage?
 └─ YES → S3
     ├─ Frequently accessed → S3 Standard
     ├─ Infrequent, multi-AZ → S3 Standard-IA
     ├─ Infrequent, single AZ (reproducible) → S3 One Zone-IA
     ├─ Archive, minutes retrieval → S3 Glacier Instant Retrieval
     ├─ Archive, hours retrieval → S3 Glacier Flexible Retrieval
     └─ Long-term archive, 12h+ → S3 Glacier Deep Archive

Need block storage?
 └─ YES → EBS (attached to one EC2 at a time)
     ├─ Max IOPS for DB → io2 Block Express
     ├─ General workload → gp3 (baseline 3,000 IOPS)
     └─ Cold/sequential access → st1 (throughput HDD)

Need shared file system?
 └─ YES
     ├─ Linux instances (NFS) → EFS
     └─ Windows instances (SMB) → FSx for Windows

Need high-performance HPC file system?
 └─ YES → FSx for Lustre`}</pre>
                </div>

                {/* Compute Tree */}
                <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', overflow: 'hidden' }}>
                  <div style={{ background: 'linear-gradient(90deg,#1d4ed8,#3b82f6)', padding: '10px 14px' }}>
                    <span style={{ color: '#fff', fontWeight: 700, fontSize: '0.88rem' }}>⚙️ COMPUTE — Which service?</span>
                  </div>
                  <pre style={{ margin: 0, padding: '1rem', fontSize: '0.75rem', fontFamily: 'monospace', color: '#1f2937', background: '#f9fafb', lineHeight: 1.7, overflowX: 'auto', whiteSpace: 'pre' }}>{`Need full OS control?
 └─ YES → EC2
     ├─ Predictable, steady → Reserved Instance / Savings Plans
     ├─ Fault-tolerant, flexible → Spot Instances
     └─ Compliance / BYOL → Dedicated Host

No OS management needed?
 └─ YES → Serverless / Managed
     ├─ Event-driven, short tasks (≤15 min) → Lambda
     ├─ Containers, no cluster mgmt → ECS / EKS + Fargate
     ├─ Containers, you manage nodes → ECS / EKS on EC2
     └─ Batch / overnight jobs → AWS Batch

Web app PaaS (full stack)?
 └─ YES → Elastic Beanstalk
     └─ Deploys EC2 + ALB + Auto Scaling
        (you retain full EC2 control)`}</pre>
                </div>

                {/* Networking Tree */}
                <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', overflow: 'hidden' }}>
                  <div style={{ background: 'linear-gradient(90deg,#7c3aed,#a855f7)', padding: '10px 14px' }}>
                    <span style={{ color: '#fff', fontWeight: 700, fontSize: '0.88rem' }}>🌐 NETWORKING — Which service?</span>
                  </div>
                  <pre style={{ margin: 0, padding: '1rem', fontSize: '0.75rem', fontFamily: 'monospace', color: '#1f2937', background: '#f9fafb', lineHeight: 1.7, overflowX: 'auto', whiteSpace: 'pre' }}>{`On-premises connectivity?
 ├─ Fast setup, encrypted, variable → Site-to-Site VPN
 ├─ Dedicated private, consistent → Direct Connect
 └─ Private + encrypted → Direct Connect + VPN

Global user acceleration?
 ├─ HTTP/HTTPS + caching → CloudFront
 └─ TCP/UDP / static IPs / non-HTTP → Global Accelerator

VPC-to-VPC connectivity?
 ├─ 2 VPCs, simple → VPC Peering
 ├─ 3+ VPCs, hub model → Transit Gateway
 └─ Expose service privately → VPC PrivateLink

Load balancing?
 ├─ HTTP/HTTPS, path/host routing → ALB
 ├─ TCP/UDP, extreme performance → NLB
 └─ Legacy / EC2-Classic → CLB`}</pre>
                </div>

                {/* Database Tree */}
                <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', overflow: 'hidden' }}>
                  <div style={{ background: 'linear-gradient(90deg,#b45309,#d97706)', padding: '10px 14px' }}>
                    <span style={{ color: '#fff', fontWeight: 700, fontSize: '0.88rem' }}>🗃️ DATABASE — Which service?</span>
                  </div>
                  <pre style={{ margin: 0, padding: '1rem', fontSize: '0.75rem', fontFamily: 'monospace', color: '#1f2937', background: '#f9fafb', lineHeight: 1.7, overflowX: 'auto', whiteSpace: 'pre' }}>{`Relational (SQL)?
 └─ YES → RDS
     ├─ MySQL / PostgreSQL / Oracle / SQL Server
     ├─ High availability → RDS Multi-AZ
     ├─ Scale reads → Read Replicas
     └─ Auto-scale 5× faster than RDS → Aurora

NoSQL key-value?
 └─ YES → DynamoDB
     ├─ Microsecond cache → DAX
     └─ Global, multi-region active/active → DynamoDB Global Tables

Data warehouse (analytics)?
 └─ YES → Amazon Redshift
     └─ Query S3 directly → Redshift Spectrum

Search / full-text?
 └─ YES → OpenSearch Service

In-memory / session cache?
 ├─ Persistence / replication → ElastiCache Redis
 └─ Simple, multi-threaded → ElastiCache Memcached

Specialty databases?
 ├─ Immutable tamper-proof ledger → Amazon QLDB
 ├─ Graph (social/fraud/recommendations) → Amazon Neptune
 ├─ Time-series (IoT, operational) → Amazon Timestream
 └─ Blockchain (Hyperledger/Ethereum) → Amazon Managed Blockchain`}</pre>
                </div>

                {/* Lambda@Edge Decision Tree */}
                <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', overflow: 'hidden' }}>
                  <div style={{ background: 'linear-gradient(90deg,#0891b2,#0e7490)', padding: '10px 14px' }}>
                    <span style={{ color: '#fff', fontWeight: 700, fontSize: '0.88rem' }}>⚡ LAMBDA@EDGE — Which trigger?</span>
                  </div>
                  <div style={{ padding: '1rem', background: '#f9fafb' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', marginBottom: '10px' }}>
                      {[
                        { stage: 'Viewer Request', arrow: '→ CF', when: 'Before CloudFront checks cache', use: 'A/B test routing, auth header injection, device detection, URL rewrite before cache lookup', color: '#1d4ed8' },
                        { stage: 'Origin Request', arrow: 'CF →', when: 'After cache miss, before forwarding to origin', use: 'Rewrite origin URL, add headers to origin request, collapse cache keys, fetch from different origins', color: '#7c3aed' },
                        { stage: 'Origin Response', arrow: '← Origin', when: 'After origin responds, before CloudFront caches', use: 'Add security headers (HSTS, CSP), modify response before it is cached at the edge', color: '#c2410c' },
                        { stage: 'Viewer Response', arrow: '← CF', when: 'After CloudFront serves response to viewer', use: 'Add/modify response headers for every request regardless of cache hit/miss. Cannot modify body.', color: '#059669' },
                      ].map((t, i) => (
                        <div key={i} style={{ background: '#fff', border: `1.5px solid ${t.color}22`, borderRadius: '10px', padding: '10px' }}>
                          <div style={{ display: 'flex', gap: '6px', alignItems: 'center', marginBottom: '4px' }}>
                            <span style={{ fontWeight: 800, fontSize: '0.78rem', color: t.color }}>{t.stage}</span>
                            <span style={{ fontSize: '0.7rem', color: '#9ca3af' }}>{t.arrow}</span>
                          </div>
                          <div style={{ fontSize: '0.72rem', color: '#6b7280', marginBottom: '4px', fontStyle: 'italic' }}>{t.when}</div>
                          <div style={{ fontSize: '0.75rem', color: '#374151', lineHeight: 1.5 }}>{t.use}</div>
                        </div>
                      ))}
                    </div>
                    <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '8px', padding: '8px 12px' }}>
                      <span style={{ fontSize: '0.77rem', fontWeight: 700, color: '#92400e' }}>⚠️ Exam tip: </span>
                      <span style={{ fontSize: '0.77rem', color: '#78350f' }}>Flow = User → [Viewer Request] → CloudFront Cache → [Origin Request] → Origin → [Origin Response] → CloudFront Cache → [Viewer Response] → User. "Modify before cache check" = Viewer Request. "Add headers always, even cache hits" = Viewer Response.</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* PART 3 — SECURITY */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}>
                <div style={{ width: '36px', height: '36px', background: 'linear-gradient(135deg,#dc2626,#991b1b)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem' }}>🔒</div>
                <h3 style={{ fontWeight: 800, fontSize: '1.05rem', color: '#111827', margin: 0 }}>Part 3 — Security Architecture</h3>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>

                {/* Layered Defense */}
                <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', overflow: 'hidden' }}>
                  <div style={{ padding: '12px 16px', borderBottom: '1px solid #e5e7eb' }}>
                    <h4 style={{ fontWeight: 700, fontSize: '0.88rem', color: '#111827', margin: 0 }}>🛡️ Layered Defense Stack</h4>
                  </div>
                  {[
                    { layer: 'Layer 5 — Edge', service: 'AWS Shield + WAF + CloudFront', role: 'DDoS, SQLi, XSS protection before traffic enters your AWS account' },
                    { layer: 'Layer 4 — Network', service: 'VPC + NACLs + Security Groups', role: 'NACLs = subnet deny. SGs = instance allow. Separate public/private subnets.' },
                    { layer: 'Layer 3 — Identity', service: 'IAM Roles + Policies + SCP', role: 'Least privilege. Roles over users. SCPs as guardrails across org.' },
                    { layer: 'Layer 2 — Data', service: 'KMS + S3 SSE + RDS encryption', role: 'Encrypt at rest with KMS CMKs. Enforce with bucket policies / SCPs.' },
                    { layer: 'Layer 1 — Detection', service: 'GuardDuty + CloudTrail + Config', role: 'GuardDuty: threat detection. CloudTrail: API audit log. Config: compliance drift.' },
                  ].map((l, i) => (
                    <div key={i} style={{ display: 'grid', gridTemplateColumns: '150px 1fr', gap: '10px', padding: '10px 14px', borderTop: i > 0 ? '1px solid #f3f4f6' : 'none', background: i % 2 === 0 ? '#fff' : '#fafafa', alignItems: 'start' }}>
                      <div>
                        <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#dc2626', marginBottom: '2px' }}>{l.layer}</div>
                        <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#111827' }}>{l.service}</div>
                      </div>
                      <span style={{ fontSize: '0.79rem', color: '#374151', lineHeight: 1.55 }}>{l.role}</span>
                    </div>
                  ))}
                </div>

                {/* IAM Skeleton + Key Rules */}
                <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', overflow: 'hidden' }}>
                    <div style={{ padding: '12px 16px', borderBottom: '1px solid #e5e7eb' }}>
                      <h4 style={{ fontWeight: 700, fontSize: '0.88rem', color: '#111827', margin: 0 }}>📄 IAM Policy Skeleton</h4>
                    </div>
                    <pre style={{ margin: 0, padding: '1rem', fontSize: '0.72rem', fontFamily: 'monospace', color: '#1f2937', background: '#f9fafb', lineHeight: 1.7 }}>{`{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",       // or "Deny"
      "Principal": "*",        // Who (omit for identity policy)
      "Action": "s3:GetObject",// What
      "Resource": "arn:aws:s3:::bucket/*", // On what
      "Condition": {           // Optional guardrails
        "StringEquals": {
          "aws:RequestedRegion": "us-east-1"
        }
      }
    }
  ]
}`}</pre>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '1rem' }}>
                      <h4 style={{ fontWeight: 700, fontSize: '0.88rem', color: '#111827', margin: '0 0 10px' }}>🔑 IAM Evaluation Logic</h4>
                      {[
                        { rule: 'Explicit DENY always wins', detail: 'Even if 10 allows exist, one Deny overrides them all.' },
                        { rule: 'Implicit DENY is default', detail: 'No policy = no access. Everything must be explicitly allowed.' },
                        { rule: 'Permission boundary limits max access', detail: 'Effective permissions = Identity policy ∩ Permission boundary.' },
                        { rule: 'SCPs don\'t grant permissions', detail: 'SCPs only restrict. An SCP allow still requires an IAM allow to act.' },
                        { rule: 'Resource-based policies can allow cross-account', detail: 'S3 bucket policy + IAM role = no need for explicit trust in both places.' },
                      ].map((r, i) => (
                        <div key={i} style={{ marginBottom: '8px', paddingBottom: i < 4 ? '8px' : 0, borderBottom: i < 4 ? '1px solid #f3f4f6' : 'none' }}>
                          <div style={{ fontWeight: 700, fontSize: '0.8rem', color: '#111827', marginBottom: '2px' }}>{r.rule}</div>
                          <div style={{ fontSize: '0.78rem', color: '#6b7280', lineHeight: 1.5 }}>{r.detail}</div>
                        </div>
                      ))}
                    </div>

                    {/* IAM Condition Operators */}
                    <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', overflow: 'hidden' }}>
                      <div style={{ padding: '10px 14px', background: '#fef2f2', borderBottom: '1px solid #fecaca' }}>
                        <h4 style={{ fontWeight: 700, fontSize: '0.85rem', color: '#991b1b', margin: 0 }}>🎛️ IAM Condition Operators — Exam-Tested</h4>
                      </div>
                      {[
                        { op: 'aws:SourceIp', use: 'Restrict API calls to specific IP addresses or CIDR ranges', example: '"aws:SourceIp": ["203.0.113.0/24"]' },
                        { op: 'aws:RequestedRegion', use: 'Restrict actions to specific AWS regions (data residency / compliance)', example: '"aws:RequestedRegion": "eu-west-1"' },
                        { op: 'aws:MultiFactorAuthPresent', use: 'Force MFA — action only allowed when user authenticated with MFA', example: '"aws:MultiFactorAuthPresent": "true"' },
                        { op: 'ec2:ResourceTag', use: 'Allow/deny actions based on tags on the EC2 resource being acted upon', example: '"ec2:ResourceTag/Environment": "Production"' },
                        { op: 's3:x-amz-server-side-encryption', use: 'Enforce that S3 PUT requests include server-side encryption header', example: '"s3:x-amz-server-side-encryption": "AES256"' },
                        { op: 'aws:PrincipalOrgID', use: 'Restrict resource access to principals within your AWS Organization only', example: '"aws:PrincipalOrgID": "o-xxxxxxxxx"' },
                      ].map((c, i) => (
                        <div key={i} style={{ padding: '8px 14px', borderTop: i > 0 ? '1px solid #f3f4f6' : 'none', background: i % 2 === 0 ? '#fff' : '#fef2f2' }}>
                          <div style={{ fontWeight: 700, fontSize: '0.77rem', color: '#dc2626', fontFamily: 'monospace', marginBottom: '2px' }}>{c.op}</div>
                          <div style={{ fontSize: '0.76rem', color: '#374151', marginBottom: '2px', lineHeight: 1.5 }}>{c.use}</div>
                          <div style={{ fontSize: '0.72rem', color: '#9ca3af', fontFamily: 'monospace' }}>{c.example}</div>
                        </div>
                      ))}
                    </div>

                    {/* Cross-Account Role */}
                    <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '1rem' }}>
                      <h4 style={{ fontWeight: 700, fontSize: '0.88rem', color: '#111827', margin: '0 0 10px' }}>🔄 Cross-Account Role — The Two-Step Dance</h4>
                      {[
                        { step: 'Step 1 — Account A (owner of the resource)', detail: 'Create an IAM Role. Attach a Trust Policy naming Account B\'s ARN (or specific user) as trusted Principal with Action: "sts:AssumeRole". This grants permission TO assume the role.' },
                        { step: 'Step 2 — Account B (the one who needs access)', detail: 'Attach an Identity-based policy to the user/role in Account B explicitly allowing "sts:AssumeRole" on the Role ARN in Account A. Both policies must exist — one alone is not enough.' },
                        { step: 'Result — STS issues temporary credentials', detail: 'When Account B user calls AssumeRole, STS returns a temporary Access Key ID, Secret Access Key, and Session Token valid for up to 12 hours. No long-term credentials cross account boundaries.' },
                      ].map((s, i) => (
                        <div key={i} style={{ display: 'flex', gap: '12px', marginBottom: i < 2 ? '10px' : 0, paddingBottom: i < 2 ? '10px' : 0, borderBottom: i < 2 ? '1px solid #f3f4f6' : 'none', alignItems: 'flex-start' }}>
                          <span style={{ width: '28px', height: '28px', background: ['#1d4ed8','#7c3aed','#059669'][i], color: '#fff', borderRadius: '50%', fontWeight: 800, fontSize: '0.72rem', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{i+1}</span>
                          <div>
                            <div style={{ fontWeight: 700, fontSize: '0.8rem', color: '#111827', marginBottom: '2px' }}>{s.step}</div>
                            <div style={{ fontSize: '0.77rem', color: '#6b7280', lineHeight: 1.55 }}>{s.detail}</div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Directory Services */}
                    <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', overflow: 'hidden' }}>
                      <div style={{ padding: '10px 14px', background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                        <h4 style={{ fontWeight: 700, fontSize: '0.85rem', color: '#111827', margin: 0 }}>🏢 AWS Directory Services — Pick the Right One</h4>
                      </div>
                      {[
                        { svc: 'AWS Managed Microsoft AD', when: 'Run real Microsoft Active Directory in AWS. Need trusts with on-premises AD. Need Group Policy, RADIUS MFA, or MFA with smart cards.', keyword: 'Trust with on-prem AD', color: '#1d4ed8' },
                        { svc: 'AD Connector', when: 'Proxy authentication to your existing on-premises AD. No local directory in AWS — just a forwarding connector. Requires on-prem AD to always be reachable.', keyword: 'Proxy to on-prem, no local AD', color: '#059669' },
                        { svc: 'Simple AD (Samba 4)', when: 'Cheapest option. Samba 4 compatible. Basic AD features only. Cannot create trusts with on-prem AD. Use for standalone AWS-only environments needing basic LDAP.', keyword: 'Cheap, no trusts, standalone', color: '#7c3aed' },
                      ].map((d, i) => (
                        <div key={i} style={{ padding: '10px 14px', borderTop: i > 0 ? '1px solid #f3f4f6' : 'none', background: i % 2 === 0 ? '#fff' : '#fafafa' }}>
                          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '4px' }}>
                            <span style={{ fontWeight: 700, fontSize: '0.8rem', color: d.color }}>{d.svc}</span>
                            <span style={{ fontSize: '0.7rem', background: `${d.color}15`, color: d.color, border: `1px solid ${d.color}30`, padding: '1px 7px', borderRadius: '5px', flexShrink: 0 }}>{d.keyword}</span>
                          </div>
                          <div style={{ fontSize: '0.77rem', color: '#374151', lineHeight: 1.55 }}>{d.when}</div>
                        </div>
                      ))}
                      <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '0 0 12px 12px', padding: '8px 14px' }}>
                        <span style={{ fontSize: '0.77rem', fontWeight: 700, color: '#92400e' }}>⚠️ Exam tip: </span>
                        <span style={{ fontSize: '0.77rem', color: '#78350f' }}>"Trust with on-prem AD" → Managed Microsoft AD. "Proxy only, keep existing on-prem AD" → AD Connector. "Simple, standalone, cheapest" → Simple AD.</span>
                      </div>
                    </div>
                  </div>
              </div>
            </div>

            {/* PART 4 — HA / DR */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}>
                <div style={{ width: '36px', height: '36px', background: 'linear-gradient(135deg,#0891b2,#0e7490)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem' }}>🌐</div>
                <h3 style={{ fontWeight: 800, fontSize: '1.05rem', color: '#111827', margin: 0 }}>Part 4 — High Availability &amp; Disaster Recovery</h3>
              </div>

              {/* DR Spectrum */}
              <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', overflow: 'hidden', marginBottom: '12px' }}>
                <div style={{ padding: '12px 16px', borderBottom: '1px solid #e5e7eb', background: '#f9fafb' }}>
                  <h4 style={{ fontWeight: 700, fontSize: '0.88rem', color: '#111827', margin: 0 }}>⚡ DR Strategy Spectrum — Cost increases left → right, RTO/RPO decreases</h4>
                </div>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
                    <thead>
                      <tr style={{ background: '#f1f5f9' }}>
                        {['Strategy', 'RTO', 'RPO', 'Cost', 'What runs in DR region', 'Failover action'].map(h => (
                          <th key={h} style={{ padding: '9px 12px', textAlign: 'left', fontWeight: 700, color: '#374151', fontSize: '0.76rem', whiteSpace: 'nowrap', borderBottom: '1px solid #e5e7eb' }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { strategy: 'Backup & Restore', rto: 'Hours', rpo: 'Hours', cost: '$', dr: 'Nothing (backups only in S3)', action: 'Restore from S3/Glacier snapshot', color: '#6b7280' },
                        { strategy: 'Pilot Light', rto: 'Minutes', rpo: 'Minutes', cost: '$$', dr: 'Core DB only (replicated, not app)', action: 'Scale up + deploy app tier on failover', color: '#d97706' },
                        { strategy: 'Warm Standby', rto: 'Minutes', rpo: 'Seconds', cost: '$$$', dr: 'Full env at reduced capacity', action: 'Scale to full production size', color: '#2563eb' },
                        { strategy: 'Active / Active', rto: 'Seconds / Near-zero', rpo: 'Near-zero', cost: '$$$$', dr: 'Full prod in 2+ regions simultaneously', action: 'Route 53 routes live traffic; no manual action', color: '#059669' },
                      ].map((r, i) => (
                        <tr key={i} style={{ background: i % 2 === 0 ? '#fff' : '#fafafa' }}>
                          <td style={{ padding: '10px 12px', fontWeight: 700, color: r.color, whiteSpace: 'nowrap' }}>{r.strategy}</td>
                          <td style={{ padding: '10px 12px', fontWeight: 700, color: '#111827', whiteSpace: 'nowrap' }}>{r.rto}</td>
                          <td style={{ padding: '10px 12px', color: '#374151', whiteSpace: 'nowrap' }}>{r.rpo}</td>
                          <td style={{ padding: '10px 12px', fontWeight: 700, color: '#374151' }}>{r.cost}</td>
                          <td style={{ padding: '10px 12px', color: '#374151', lineHeight: 1.5 }}>{r.dr}</td>
                          <td style={{ padding: '10px 12px', color: '#6b7280', lineHeight: 1.5 }}>{r.action}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '8px', padding: '10px 14px', margin: '12px 14px 14px' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#92400e' }}>⚠️ Key distinction: </span>
                  <span style={{ fontSize: '0.8rem', color: '#78350f' }}>Pilot Light = only the database (core) runs in DR. Application tier is OFF. Warm Standby = the entire environment runs at reduced scale. They are NOT the same tier.</span>
                </div>
              </div>

              {/* HA Checklist */}
              <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '1.25rem' }}>
                <h4 style={{ fontWeight: 700, fontSize: '0.88rem', color: '#111827', margin: '0 0 1rem' }}>✅ HA Architecture Checklist</h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                  {[
                    { check: 'Load Balancer spans ≥ 2 AZs', detail: 'ALB / NLB with cross-zone enabled' },
                    { check: 'Auto Scaling Group across ≥ 2 AZs', detail: 'Minimum capacity > 0 in each AZ' },
                    { check: 'RDS Multi-AZ enabled', detail: 'Synchronous standby; auto failover < 2 min' },
                    { check: 'Stateless EC2 instances', detail: 'Session state in ElastiCache / DynamoDB, not local disk' },
                    { check: 'Health checks at every tier', detail: 'ALB → EC2, Route 53 → endpoint, RDS → Multi-AZ' },
                    { check: 'S3 versioning + MFA Delete', detail: 'Protects against accidental deletion / overwrites' },
                    { check: 'CloudFront origin failover', detail: 'Primary + secondary origin group for static assets' },
                    { check: 'Route 53 failover routing', detail: 'Health-check-gated active-passive for global DR' },
                  ].map((c, i) => (
                    <div key={i} style={{ display: 'flex', gap: '10px', padding: '10px', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '8px', alignItems: 'flex-start' }}>
                      <span style={{ color: '#16a34a', fontWeight: 800, fontSize: '0.9rem', flexShrink: 0 }}>✓</span>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.8rem', color: '#111827' }}>{c.check}</div>
                        <div style={{ fontSize: '0.76rem', color: '#6b7280', marginTop: '2px', lineHeight: 1.4 }}>{c.detail}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* PART 5 — COST OPTIMISATION */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}>
                <div style={{ width: '36px', height: '36px', background: 'linear-gradient(135deg,#059669,#065f46)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem' }}>💰</div>
                <h3 style={{ fontWeight: 800, fontSize: '1.05rem', color: '#111827', margin: 0 }}>Part 5 — Cost Optimisation</h3>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(310px, 1fr))', gap: '12px' }}>

                {/* Pricing Model Matrix */}
                <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', overflow: 'hidden' }}>
                  <div style={{ padding: '12px 16px', borderBottom: '1px solid #e5e7eb', background: '#f9fafb' }}>
                    <h4 style={{ fontWeight: 700, fontSize: '0.88rem', color: '#111827', margin: 0 }}>EC2 Pricing Model — Exam Selector</h4>
                  </div>
                  {[
                    { keyword: '"testing" / "short-term" / "unpredictable"', answer: 'On-Demand', discount: '0%', color: '#6b7280' },
                    { keyword: '"steady-state" / "predictable" / "1-3 year"', answer: 'Reserved Instance', discount: 'Up to 72%', color: '#2563eb' },
                    { keyword: '"flexible commitment" / "multiple services"', answer: 'Savings Plans', discount: 'Up to 72%', color: '#7c3aed' },
                    { keyword: '"fault-tolerant" / "batch" / "stateless"', answer: 'Spot Instances', discount: 'Up to 90%', color: '#d97706' },
                    { keyword: '"BYOL" / "compliance" / "physical isolation"', answer: 'Dedicated Host', discount: 'Varies', color: '#dc2626' },
                  ].map((r, i) => (
                    <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 130px 70px', gap: '8px', padding: '9px 14px', borderTop: i > 0 ? '1px solid #f3f4f6' : 'none', background: i % 2 === 0 ? '#fff' : '#fafafa', alignItems: 'start' }}>
                      <span style={{ fontSize: '0.77rem', color: '#6b7280', fontStyle: 'italic', lineHeight: 1.5 }}>{r.keyword}</span>
                      <span style={{ fontWeight: 700, fontSize: '0.8rem', color: r.color }}>{r.answer}</span>
                      <span style={{ fontSize: '0.76rem', fontWeight: 600, color: '#059669' }}>{r.discount}</span>
                    </div>
                  ))}
                </div>

                {/* 5-Step Cost Audit */}
                <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '1.25rem' }}>
                  <h4 style={{ fontWeight: 700, fontSize: '0.88rem', color: '#111827', margin: '0 0 1rem' }}>🔍 5-Step Cost Audit (exam scenarios)</h4>
                  {[
                    { step: '1', action: 'Right-size first', detail: 'Identify idle or over-provisioned EC2 with CloudWatch metrics. Downsize before committing to a pricing model.' },
                    { step: '2', action: 'Turn off what\'s not needed', detail: 'Schedule non-prod instances with EventBridge + Lambda. Dev/test = 8h/day instead of 24h.' },
                    { step: '3', action: 'Commit to what\'s predictable', detail: 'Convert steady-state On-Demand to Reserved Instances or Savings Plans after right-sizing.' },
                    { step: '4', action: 'Use Spot for what can tolerate interruption', detail: 'Batch jobs, rendering, big data — horizontally scalable, checkpointed workloads.' },
                    { step: '5', action: 'Automate and monitor', detail: 'AWS Cost Explorer + Budgets + Trusted Advisor recommendations. Set billing alerts.' },
                  ].map((s, i) => (
                    <div key={i} style={{ display: 'flex', gap: '12px', marginBottom: i < 4 ? '12px' : 0, paddingBottom: i < 4 ? '12px' : 0, borderBottom: i < 4 ? '1px solid #f3f4f6' : 'none', alignItems: 'flex-start' }}>
                      <span style={{ width: '26px', height: '26px', background: '#059669', color: '#fff', borderRadius: '50%', fontWeight: 800, fontSize: '0.78rem', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{s.step}</span>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.82rem', color: '#111827', marginBottom: '3px' }}>{s.action}</div>
                        <div style={{ fontSize: '0.78rem', color: '#6b7280', lineHeight: 1.55 }}>{s.detail}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* PART 6 — EXAM STRATEGY */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}>
                <div style={{ width: '36px', height: '36px', background: 'linear-gradient(135deg,#7c3aed,#6d28d9)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem' }}>🏆</div>
                <h3 style={{ fontWeight: 800, fontSize: '1.05rem', color: '#111827', margin: 0 }}>Part 6 — Exam Strategy</h3>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '12px' }}>

                {/* Question Anatomy */}
                <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '1.25rem' }}>
                  <h4 style={{ fontWeight: 700, fontSize: '0.88rem', color: '#111827', margin: '0 0 1rem' }}>🔬 Question Anatomy</h4>
                  {[
                    { part: 'Context block', tip: 'Company type (startup vs enterprise), existing infrastructure, regulatory constraints. These narrow 2-3 answers immediately.' },
                    { part: 'Core problem', tip: 'Usually one sentence. Identify: performance vs availability vs cost vs security vs migration. Only one problem is primary.' },
                    { part: 'Constraint clause', tip: '"MOST cost-effective", "LEAST operational overhead", "MINIMUM downtime". This chooses between otherwise equal answers.' },
                    { part: 'Answer pattern', tip: '2 answers will be obviously wrong. 1 is the trap (partially right). 1 is correct. The trap usually misidentifies the primary constraint.' },
                  ].map((q, i) => (
                    <div key={i} style={{ marginBottom: i < 3 ? '10px' : 0, paddingBottom: i < 3 ? '10px' : 0, borderBottom: i < 3 ? '1px solid #f3f4f6' : 'none' }}>
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                        <span style={{ background: '#7c3aed', color: '#fff', borderRadius: '6px', padding: '2px 8px', fontSize: '0.7rem', fontWeight: 700, flexShrink: 0, whiteSpace: 'nowrap' }}>{q.part}</span>
                        <span style={{ fontSize: '0.79rem', color: '#374151', lineHeight: 1.55 }}>{q.tip}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* When in Doubt Heuristics */}
                <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '1.25rem' }}>
                  <h4 style={{ fontWeight: 700, fontSize: '0.88rem', color: '#111827', margin: '0 0 1rem' }}>"When In Doubt" Heuristics</h4>
                  {[
                    { trigger: 'Serverless + event-driven', answer: '→ Lambda' },
                    { trigger: '"Decouple" or "async"', answer: '→ SQS' },
                    { trigger: '"Fan-out" to multiple targets', answer: '→ SNS → SQS' },
                    { trigger: '"Least operational overhead"', answer: '→ Managed service (RDS, not EC2+DB)' },
                    { trigger: '"Automatic rotation"', answer: '→ Secrets Manager' },
                    { trigger: '"Block IP" or "Deny rule"', answer: '→ NACL (not Security Group)' },
                    { trigger: '"Fixed IP" or "TCP/UDP global"', answer: '→ Global Accelerator' },
                    { trigger: '"Cache globally" (HTTP)', answer: '→ CloudFront' },
                    { trigger: '"Dedicated connection"', answer: '→ Direct Connect' },
                    { trigger: '"Hub-and-spoke" VPC mesh', answer: '→ Transit Gateway' },
                    { trigger: '"Audit trail" / "API calls"', answer: '→ CloudTrail' },
                    { trigger: '"Detect threats" / "anomaly"', answer: '→ GuardDuty' },
                    { trigger: '"Compliance rules" / "config drift"', answer: '→ AWS Config' },
                    { trigger: '"Temporary credentials for EC2"', answer: '→ IAM Role' },
                  ].map((h, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', gap: '10px', padding: '5px 0', borderBottom: i < 13 ? '1px solid #f3f4f6' : 'none', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.78rem', color: '#6b7280', fontStyle: 'italic' }}>{h.trigger}</span>
                      <span style={{ fontSize: '0.79rem', fontWeight: 700, color: '#1d4ed8', flexShrink: 0 }}>{h.answer}</span>
                    </div>
                  ))}
                </div>

                {/* Time Management */}
                <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '1.25rem' }}>
                  <h4 style={{ fontWeight: 700, fontSize: '0.88rem', color: '#111827', margin: '0 0 1rem' }}>⏱️ Time Management (130 min / 65 questions)</h4>
                  {[
                    { phase: 'Pass 1 (65 min)', strategy: '~60 sec per question. Answer what you know. Flag anything uncertain. Never spend more than 90s on one question.' },
                    { phase: 'Pass 2 (40 min)', strategy: 'Return to flagged questions. Re-read the constraint clause. Eliminate. Commit.' },
                    { phase: 'Pass 3 (25 min)', strategy: 'Review all. Change answers only if you\'re 100% certain you were wrong — gut answers are often correct.' },
                    { phase: 'No blank answers', strategy: '65 questions must be answered. 0 points for blank. Eliminate 2 and guess between 2 = 50% chance.' },
                  ].map((t, i) => (
                    <div key={i} style={{ marginBottom: i < 3 ? '10px' : 0, paddingBottom: i < 3 ? '10px' : 0, borderBottom: i < 3 ? '1px solid #f3f4f6' : 'none' }}>
                      <div style={{ fontWeight: 700, fontSize: '0.82rem', color: '#111827', marginBottom: '3px' }}>{t.phase}</div>
                      <div style={{ fontSize: '0.79rem', color: '#6b7280', lineHeight: 1.55 }}>{t.strategy}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* APPENDIX */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}>
                <div style={{ width: '36px', height: '36px', background: 'linear-gradient(135deg,#374151,#1f2937)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem' }}>📋</div>
                <h3 style={{ fontWeight: 800, fontSize: '1.05rem', color: '#111827', margin: 0 }}>Appendix — Quick Reference</h3>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '12px' }}>

                {/* Ports */}
                <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', overflow: 'hidden' }}>
                  <div style={{ padding: '10px 14px', background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                    <h4 style={{ fontWeight: 700, fontSize: '0.85rem', color: '#111827', margin: 0 }}>🔌 Critical Ports</h4>
                  </div>
                  {[
                    { port: '22', proto: 'TCP', name: 'SSH', detail: 'Secure Shell — Linux remote access' },
                    { port: '3389', proto: 'TCP', name: 'RDP', detail: 'Remote Desktop Protocol — Windows EC2 access' },
                    { port: '80', proto: 'TCP', name: 'HTTP', detail: 'Unencrypted web traffic' },
                    { port: '443', proto: 'TCP', name: 'HTTPS', detail: 'Encrypted web traffic (TLS)' },
                    { port: '25', proto: 'TCP', name: 'SMTP', detail: 'Email (blocked on EC2 by default — use SES)' },
                    { port: '53', proto: 'UDP/TCP', name: 'DNS', detail: 'Domain Name System — Route 53' },
                    { port: '3306', proto: 'TCP', name: 'MySQL/Aurora', detail: 'Relational DB — RDS MySQL / Aurora' },
                    { port: '5432', proto: 'TCP', name: 'PostgreSQL', detail: 'Relational DB — RDS PostgreSQL' },
                    { port: '1433', proto: 'TCP', name: 'SQL Server', detail: 'Microsoft SQL Server on RDS' },
                    { port: '5439', proto: 'TCP', name: 'Redshift', detail: 'Amazon Redshift data warehouse' },
                    { port: '6379', proto: 'TCP', name: 'Redis', detail: 'ElastiCache Redis in-memory cache' },
                    { port: '11211', proto: 'TCP', name: 'Memcached', detail: 'ElastiCache Memcached' },
                    { port: '2049', proto: 'TCP', name: 'NFS', detail: 'Network File System — EFS mount' },
                  ].map((p, i) => (
                    <div key={i} style={{ display: 'grid', gridTemplateColumns: '50px 60px 120px 1fr', gap: '8px', padding: '7px 14px', borderTop: i > 0 ? '1px solid #f3f4f6' : 'none', background: i % 2 === 0 ? '#fff' : '#fafafa', alignItems: 'center' }}>
                      <span style={{ fontWeight: 800, fontSize: '0.78rem', color: '#1d4ed8', fontFamily: 'monospace' }}>{p.port}</span>
                      <span style={{ fontSize: '0.72rem', background: '#f3f4f6', color: '#6b7280', borderRadius: '4px', padding: '1px 5px', textAlign: 'center' }}>{p.proto}</span>
                      <span style={{ fontWeight: 700, fontSize: '0.78rem', color: '#111827' }}>{p.name}</span>
                      <span style={{ fontSize: '0.75rem', color: '#6b7280', lineHeight: 1.4 }}>{p.detail}</span>
                    </div>
                  ))}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {/* CIDR */}
                  <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', overflow: 'hidden' }}>
                    <div style={{ padding: '10px 14px', background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                      <h4 style={{ fontWeight: 700, fontSize: '0.85rem', color: '#111827', margin: 0 }}>🌐 CIDR Cheat Sheet</h4>
                    </div>
                    {[
                      { cidr: '/32', hosts: '1', use: 'Single IP address' },
                      { cidr: '/28', hosts: '16', use: 'Smallest AWS VPC subnet' },
                      { cidr: '/24', hosts: '256', use: 'Standard small subnet (251 usable — AWS reserves 5)' },
                      { cidr: '/20', hosts: '4,096', use: 'EKS node group, medium subnet' },
                      { cidr: '/16', hosts: '65,536', use: 'Largest common VPC CIDR' },
                      { cidr: '/0', hosts: 'All IPs', use: '0.0.0.0/0 = Internet (all traffic)' },
                    ].map((c, i) => (
                      <div key={i} style={{ display: 'grid', gridTemplateColumns: '55px 65px 1fr', gap: '8px', padding: '7px 14px', borderTop: i > 0 ? '1px solid #f3f4f6' : 'none', background: i % 2 === 0 ? '#fff' : '#fafafa', alignItems: 'center' }}>
                        <span style={{ fontFamily: 'monospace', fontWeight: 800, fontSize: '0.82rem', color: '#7c3aed' }}>{c.cidr}</span>
                        <span style={{ fontSize: '0.76rem', fontWeight: 700, color: '#374151' }}>{c.hosts}</span>
                        <span style={{ fontSize: '0.75rem', color: '#6b7280', lineHeight: 1.4 }}>{c.use}</span>
                      </div>
                    ))}
                  </div>

                  {/* Key Acronyms */}
                  <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', overflow: 'hidden' }}>
                    <div style={{ padding: '10px 14px', background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                      <h4 style={{ fontWeight: 700, fontSize: '0.85rem', color: '#111827', margin: 0 }}>📖 Acronyms</h4>
                    </div>
                    {[
                      { acronym: 'RTO', full: 'Recovery Time Objective', note: 'How fast you restore service' },
                      { acronym: 'RPO', full: 'Recovery Point Objective', note: 'Max acceptable data loss (time)' },
                      { acronym: 'IOPS', full: 'Input/Output Operations Per Second', note: 'Disk speed metric for EBS' },
                      { acronym: 'NACL', full: 'Network Access Control List', note: 'Stateless subnet firewall' },
                      { acronym: 'SCP', full: 'Service Control Policy', note: 'AWS Organizations permission guardrail' },
                      { acronym: 'CMK', full: 'Customer Master Key', note: 'KMS key you control for encryption' },
                      { acronym: 'BYOL', full: 'Bring Your Own License', note: 'Use existing software licences on AWS' },
                      { acronym: 'TTL', full: 'Time To Live', note: 'DNS cache duration; DynamoDB item expiry' },
                      { acronym: 'VIF', full: 'Virtual Interface', note: 'Direct Connect logical connection' },
                      { acronym: 'ENA', full: 'Elastic Network Adapter', note: 'Enhanced networking — up to 100 Gbps' },
                      { acronym: 'ENI', full: 'Elastic Network Interface', note: 'Virtual NIC attachable to EC2' },
                    ].map((a, i) => (
                      <div key={i} style={{ display: 'grid', gridTemplateColumns: '55px 1fr', gap: '10px', padding: '7px 14px', borderTop: i > 0 ? '1px solid #f3f4f6' : 'none', background: i % 2 === 0 ? '#fff' : '#fafafa', alignItems: 'start' }}>
                        <span style={{ fontFamily: 'monospace', fontWeight: 800, fontSize: '0.78rem', color: '#1d4ed8', paddingTop: '1px' }}>{a.acronym}</span>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: '0.78rem', color: '#374151' }}>{a.full}</div>
                          <div style={{ fontSize: '0.73rem', color: '#9ca3af', marginTop: '1px' }}>{a.note}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* ARCHITECT'S MANTRA */}
            <div style={{ background: 'linear-gradient(135deg, #1e3a5f 0%, #1d4ed8 50%, #7c3aed 100%)', borderRadius: '1.25rem', padding: '2rem', textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>🧭</div>
              <h3 style={{ color: '#f1f5f9', fontWeight: 800, fontSize: '1.15rem', margin: '0 0 1rem' }}>The Architect's Mantra</h3>
              <div style={{ maxWidth: '640px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {[
                  '"Eliminate before selecting — wrong answers usually violate one keyword."',
                  '"AWS managed beats self-managed unless the question demands otherwise."',
                  '"Least privilege is always the security answer."',
                  '"RDS Multi-AZ = availability. Read Replicas = performance. Never swap them."',
                  '"Decouple with SQS. Fan-out with SNS. Real-time stream with Kinesis."',
                  '"When you see RTO, think time. When you see RPO, think data loss."',
                ].map((m, i) => (
                  <div key={i} style={{ background: 'rgba(255,255,255,0.1)', borderRadius: '8px', padding: '10px 16px' }}>
                    <span style={{ color: '#e0e7ff', fontSize: '0.85rem', fontStyle: 'italic', lineHeight: 1.55 }}>{m}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* Bottom CTA */}
        <div style={{ marginTop: '2.5rem', background: 'linear-gradient(135deg, #1e3a5f, #1d4ed8)', borderRadius: '1.25rem', padding: '2rem', textAlign: 'center' }}>
          <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>☁️</div>
          <h3 style={{ color: '#f1f5f9', fontWeight: 700, margin: '0 0 0.5rem' }}>Now put it into practice</h3>
          <p style={{ color: '#93c5fd', fontSize: '0.875rem', margin: '0 0 1.25rem' }}>
            1,050 SAA-C03 questions — scenario-based, updated regularly.
          </p>
          <a href="/cert/saa-c03" style={{ display: 'inline-block', padding: '0.75rem 2rem', background: '#fff', color: '#1d4ed8', borderRadius: '0.75rem', fontWeight: 700, textDecoration: 'none', fontSize: '0.95rem' }}>
            Start SAA-C03 Practice →
          </a>
        </div>
      </div>
    </Layout>
  )
}
