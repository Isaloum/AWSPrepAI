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

  // ─── CACHING ───────────────────────────────────────────────────────────────
  { icon: '⚡', keyword: 'millisecond / sub-ms DB latency', hint: 'Add an in-memory cache in front of your database.', services: ['ElastiCache Redis', 'ElastiCache Memcached', 'DynamoDB DAX'], category: 'caching' },
  { icon: '🔥', keyword: 'microsecond latency / DynamoDB reads', hint: 'DAX = DynamoDB Accelerator. API-compatible, microsecond reads. No code rewrite.', services: ['DynamoDB DAX'], category: 'caching' },
  { icon: '🔁', keyword: 'same queries repeated thousands of times', hint: 'Repeated reads = wasted DB load. Cache the results.', services: ['ElastiCache Redis', 'ElastiCache Memcached', 'DAX (for DynamoDB)'], category: 'caching' },
  { icon: '🌍', keyword: 'static content slow for global users', hint: 'Serve from edge locations close to users — not from origin.', services: ['Amazon CloudFront (CDN)', 'CloudFront + S3', 'CloudFront + ALB'], category: 'caching' },
  { icon: '🗝️', keyword: 'session store / user sessions', hint: 'Store sessions outside EC2 so any instance can serve the user.', services: ['ElastiCache Redis (recommended)', 'DynamoDB (alternative)'], category: 'caching' },
  { icon: '📉', keyword: 'reduce database load / read pressure', hint: 'Cache frequent reads so DB handles fewer queries.', services: ['ElastiCache Redis', 'ElastiCache Memcached', 'DAX', 'RDS Read Replicas'], category: 'caching' },
  { icon: '🏎️', keyword: 'Redis vs Memcached', hint: 'Redis = persistence + pub/sub + sorted sets + Multi-AZ + backup. Memcached = simple KV + multi-threading + no persistence.', services: ['ElastiCache Redis (feature-rich)', 'ElastiCache Memcached (simple/fast)'], category: 'caching' },
  { icon: '⏳', keyword: 'cache TTL / cache expiry / stale data', hint: 'TTL controls how long cached data lives before refresh.', services: ['ElastiCache TTL', 'CloudFront TTL (Cache-Control header)', 'DAX TTL'], category: 'caching' },
  { icon: '🔄', keyword: 'cache miss → query DB → store in cache', hint: 'This is Lazy Loading (Cache-Aside) pattern. Simple, avoids caching unused data.', services: ['ElastiCache Lazy Loading', 'DAX (built-in lazy load)'], category: 'caching' },
  { icon: '✍️', keyword: 'write-through caching / always fresh cache', hint: 'Every DB write also updates the cache. No stale data, but higher write cost.', services: ['ElastiCache Write-Through', 'DAX Write-Through'], category: 'caching' },
  { icon: '📡', keyword: 'low cache hit ratio / CDN miss', hint: 'CloudFront is not caching effectively. Check: query strings, headers, cookies in cache key.', services: ['CloudFront Cache Policy', 'CloudFront Cache Behaviors', 'Origin Shield'], category: 'caching' },
  { icon: '🧮', keyword: 'API responses cached / reduce Lambda calls', hint: 'API Gateway has built-in response caching. Reduces backend invocations.', services: ['API Gateway Caching', 'CloudFront + API Gateway'], category: 'caching' },
  { icon: '🌐', keyword: 'edge computing / run code at edge', hint: 'Execute lightweight logic at CloudFront POPs without going to origin.', services: ['CloudFront Functions (sub-ms, JS only)', 'Lambda@Edge (ms latency, Node/Python)', 'CloudFront'], category: 'caching' },

  // ─── AVAILABILITY / RESILIENCE ──────────────────────────────────────────────
  { icon: '🔁', keyword: 'highly available / HA', hint: 'Eliminate single points of failure. Multi-AZ is the standard answer.', services: ['Multi-AZ RDS', 'ALB (cross-AZ)', 'Auto Scaling Group', 'Multi-AZ EFS', 'Multi-AZ ElastiCache'], category: 'availability' },
  { icon: '🏥', keyword: 'fault tolerant', hint: 'System must keep running even when components fail.', services: ['Multi-AZ', 'Multi-Region', 'S3 (11 nines)', 'DynamoDB Global Tables', 'Aurora'], category: 'availability' },
  { icon: '⚡', keyword: 'automatic failover', hint: 'Failover without manual intervention. Match service to the failover speed required.', services: ['RDS Multi-AZ (1-2 min)', 'Aurora (<30s)', 'Route 53 health checks', 'RDS Proxy (absorbs reconnects)'], category: 'availability' },
  { icon: '🌍', keyword: 'global users / low latency worldwide', hint: 'Need edge locations or global routing to reduce distance to users.', services: ['CloudFront (CDN, HTTP)', 'Global Accelerator (TCP/UDP)', 'Route 53 Latency Routing', 'DynamoDB Global Tables'], category: 'availability' },
  { icon: '🔄', keyword: 'disaster recovery / RTO / RPO', hint: 'RTO = how fast to recover. RPO = how much data loss acceptable. Pick DR tier to match.', services: ['Backup & Restore (hours)', 'Pilot Light (hours, core running)', 'Warm Standby (minutes)', 'Active-Active (near-zero)'], category: 'availability' },
  { icon: '📊', keyword: 'minimum downtime during deployment', hint: 'Deploy without dropping requests.', services: ['Blue/Green (Route 53 weighted)', 'Rolling + ALB health checks', 'Aurora zero-downtime patch', 'Elastic Beanstalk Immutable'], category: 'availability' },
  { icon: '🌩️', keyword: 'survive AZ failure', hint: 'Spread across at least 2 AZs. Stateless EC2 + ALB + Multi-AZ DB.', services: ['Auto Scaling Group (multi-AZ)', 'ALB', 'RDS Multi-AZ', 'EFS (multi-AZ)'], category: 'availability' },
  { icon: '🌏', keyword: 'survive region failure / cross-region DR', hint: 'Need a copy of everything in a second region.', services: ['Aurora Global Database', 'DynamoDB Global Tables', 'S3 Cross-Region Replication', 'Route 53 Failover Routing'], category: 'availability' },
  { icon: '⏱️', keyword: 'RTO < 30 seconds / near-instant DB failover', hint: 'Aurora fails over in <30 seconds. RDS Multi-AZ takes 1-2 min.', services: ['Aurora Multi-AZ Replicas', 'Aurora Global (read replica promotion)', 'RDS Proxy (connection pooling)'], category: 'availability' },
  { icon: '🔃', keyword: 'pilot light', hint: 'Only critical core (usually DB) runs in DR region. Scale up rest on failover.', services: ['Cross-region RDS Read Replica', 'AMIs stored in DR region', 'Route 53 failover'], category: 'availability' },
  { icon: '🟡', keyword: 'warm standby', hint: 'Scaled-down but fully functional environment always running in DR region.', services: ['Auto Scaling Group (min=1 in DR)', 'Cross-region RDS Read Replica', 'Route 53 weighted routing'], category: 'availability' },

  // ─── DATABASE ────────────────────────────────────────────────────────────────
  { icon: '🗄️', keyword: 'relational database / SQL / ACID', hint: 'Need structured tables, foreign keys, JOINs → managed relational DB.', services: ['Amazon RDS (MySQL, PostgreSQL, Oracle, SQL Server, MariaDB)', 'Amazon Aurora'], category: 'database' },
  { icon: '🚀', keyword: 'faster than RDS / 5x MySQL / 3x PostgreSQL', hint: 'Aurora is MySQL/PostgreSQL compatible but much faster and more resilient.', services: ['Amazon Aurora', 'Aurora Serverless v2'], category: 'database' },
  { icon: '📖', keyword: 'read-heavy database / offload reads', hint: 'Add read replicas to redirect read traffic from primary.', services: ['RDS Read Replicas (async, up to 15)', 'Aurora Read Replicas (up to 15)', 'ElastiCache (cache DB results)'], category: 'database' },
  { icon: '🔒', keyword: 'RDS standby / Multi-AZ / NOT readable', hint: 'Multi-AZ standby is for HA failover only — it is NOT readable. Read Replicas = readable.', services: ['RDS Multi-AZ (HA, sync, not readable)', 'RDS Read Replicas (async, readable, read scaling)'], category: 'database' },
  { icon: '⚡', keyword: 'NoSQL / key-value / flexible schema', hint: 'DynamoDB = serverless NoSQL, single-digit ms, no schema, auto-scales.', services: ['DynamoDB (on-demand or provisioned)', 'DynamoDB + DAX (for microsecond)'], category: 'database' },
  { icon: '📊', keyword: 'analytics / OLAP / aggregate millions of rows', hint: 'Not OLTP. Columnar warehouse optimised for BI/analytics queries.', services: ['Amazon Redshift', 'Redshift Spectrum (query S3)', 'Athena (serverless SQL on S3)'], category: 'database' },
  { icon: '🔗', keyword: 'graph database / relationships / social network', hint: 'Graph DB stores nodes and edges natively. Best for relationship traversal.', services: ['Amazon Neptune (SPARQL, Gremlin)', 'Neptune Serverless'], category: 'database' },
  { icon: '🍃', keyword: 'MongoDB compatible / document database', hint: 'JSON documents, flexible schema, MongoDB API.', services: ['Amazon DocumentDB (MongoDB-compatible)'], category: 'database' },
  { icon: '⏭️', keyword: 'Apache Cassandra / wide-column / serverless', hint: 'Keyspaces = managed Cassandra-compatible, serverless, fully managed.', services: ['Amazon Keyspaces (Cassandra-compatible)'], category: 'database' },
  { icon: '💾', keyword: 'durable Redis / Redis as primary DB', hint: 'MemoryDB = Redis-compatible but data stored durably. Not just a cache.', services: ['Amazon MemoryDB for Redis'], category: 'database' },
  { icon: '🔄', keyword: 'migrate database / minimal downtime', hint: 'DMS keeps source running while replicating continuously.', services: ['AWS DMS (Database Migration Service)', 'AWS SCT (Schema Conversion Tool)', 'Aurora Migration Wizard'], category: 'database' },
  { icon: '🧾', keyword: 'DynamoDB throttling / too many requests', hint: 'Switch to on-demand or add DAX cache. Or increase provisioned capacity.', services: ['DynamoDB On-Demand mode', 'DynamoDB Auto Scaling', 'DynamoDB DAX'], category: 'database' },
  { icon: '🌐', keyword: 'multi-region active-active NoSQL', hint: 'DynamoDB Global Tables = multi-region active-active with eventual consistency.', services: ['DynamoDB Global Tables', 'DynamoDB Streams (replication)'], category: 'database' },
  { icon: '📉', keyword: 'Aurora Serverless / variable DB workload', hint: 'Aurora Serverless v2 auto-scales capacity in ACUs. No capacity planning needed.', services: ['Aurora Serverless v2', 'Aurora Auto Scaling (replicas)'], category: 'database' },

  // ─── COST ─────────────────────────────────────────────────────────────────
  { icon: '💰', keyword: 'cheapest / lowest cost option', hint: 'Spot for compute, Glacier for storage, Reserved for committed workloads.', services: ['Spot Instances (90% off)', 'S3 Glacier Deep Archive', 'Reserved Instances (72% off)', 'Savings Plans'], category: 'cost' },
  { icon: '🧾', keyword: 'cost-effective / good balance', hint: 'Match workload type to pricing model. Predictable → RI. Variable → Savings Plans. Spiky → On-Demand.', services: ['S3 Intelligent-Tiering', 'Lambda (pay per use)', 'Fargate', 'Compute Savings Plans'], category: 'cost' },
  { icon: '📉', keyword: 'reduce / optimise existing costs', hint: 'Measure first → rightsize → then commit to RI or Savings Plans.', services: ['AWS Compute Optimizer', 'AWS Trusted Advisor', 'Cost Explorer Rightsizing', 'S3 Lifecycle Policies'], category: 'cost' },
  { icon: '🆓', keyword: 'pay per use / no idle cost', hint: 'Serverless = zero cost when not running.', services: ['Lambda', 'Fargate', 'API Gateway', 'DynamoDB On-Demand', 'Aurora Serverless v2'], category: 'cost' },
  { icon: '⏱️', keyword: 'fault-tolerant / can be interrupted / batch', hint: 'Spot Instances can save 90% for any interruptible workload.', services: ['Spot Instances', 'Spot Fleet', 'Fargate Spot', 'AWS Batch (uses Spot)'], category: 'cost' },
  { icon: '📅', keyword: 'predictable / steady-state / 24-7 workload', hint: 'Reserve for 1 or 3 years for maximum discount.', services: ['Reserved Instances — Standard (72% off, fixed type)', 'Reserved Instances — Convertible (54% off)', 'EC2 Savings Plans (72% off)'], category: 'cost' },
  { icon: '🔀', keyword: 'flexible / any instance type / multiple services', hint: 'Compute Savings Plans = commit $/hr, use on any EC2 + Lambda + Fargate.', services: ['Compute Savings Plans (66% off)', 'EC2 Instance Savings Plans (72% off)'], category: 'cost' },
  { icon: '🗃️', keyword: 'data not accessed in 90 days / archive', hint: 'Lifecycle policy → Glacier. Deep Archive for 180+ days.', services: ['S3 Glacier Flexible Retrieval', 'S3 Glacier Deep Archive ($0.001/GB)', 'S3 Lifecycle Policy'], category: 'cost' },
  { icon: '🔌', keyword: 'NAT Gateway cost too high / S3 from private subnet', hint: 'Replace NAT Gateway with VPC Gateway Endpoint for S3/DynamoDB — it is FREE.', services: ['VPC Gateway Endpoint for S3 (free)', 'VPC Gateway Endpoint for DynamoDB (free)', 'PrivateLink (paid, other services)'], category: 'cost' },
  { icon: '📊', keyword: 'data transfer cost / cross-AZ traffic', hint: 'Same AZ = free. Cross-AZ = $0.01/GB each way. Internet egress = $0.09+/GB.', services: ['Place EC2 in same AZ as RDS', 'VPC Endpoints (avoid internet egress)', 'CloudFront (reduce origin requests)'], category: 'cost' },
  { icon: '🧮', keyword: 'rightsizing / underutilised EC2', hint: 'Use Compute Optimizer or Trusted Advisor to identify oversized instances.', services: ['AWS Compute Optimizer (ML-based)', 'Trusted Advisor (underutilised EC2)', 'Cost Explorer Rightsizing Recommendations'], category: 'cost' },
  { icon: '📦', keyword: 'S3 access pattern unknown / changing', hint: 'Intelligent-Tiering auto-moves objects. Has per-object monitoring fee.', services: ['S3 Intelligent-Tiering', 'S3 Lifecycle Policy (if pattern is known)'], category: 'cost' },

  // ─── PERFORMANCE ──────────────────────────────────────────────────────────
  { icon: '🚀', keyword: 'high performance / high throughput', hint: 'Match compute/storage to workload: IOPS for DB, throughput for analytics.', services: ['EBS io2 (64K IOPS)', 'EC2 Instance Store (ephemeral, highest IOPS)', 'EBS st1 (sequential throughput)', 'FSx for Lustre (HPC)'], category: 'performance' },
  { icon: '📈', keyword: 'scalable / handle traffic spikes', hint: 'Horizontal scaling + Auto Scaling Group reacts to demand.', services: ['EC2 Auto Scaling (Target Tracking)', 'DynamoDB (auto-scales)', 'Lambda (automatic concurrency)', 'ECS + Fargate'], category: 'performance' },
  { icon: '📦', keyword: 'millions of requests / massive throughput', hint: 'Managed services that scale automatically without server management.', services: ['Amazon SQS (unlimited)', 'API Gateway', 'DynamoDB', 'Kinesis Data Streams (shard-based)'], category: 'performance' },
  { icon: '🧱', keyword: 'HPC / tightly coupled compute / low inter-node latency', hint: 'Cluster Placement Group packs EC2s in same rack → 25 Gbps, lowest latency.', services: ['Cluster Placement Group (single AZ)', 'EFA (Elastic Fabric Adapter for MPI/RDMA)', 'EC2 P/G/Hpc instances'], category: 'performance' },
  { icon: '🔀', keyword: 'spread across racks / max availability', hint: 'Spread Placement Group puts each instance on a different rack.', services: ['Spread Placement Group (max 7 per AZ)', 'Multi-AZ deployment'], category: 'performance' },
  { icon: '📊', keyword: 'large distributed system / Kafka / HDFS / Cassandra', hint: 'Partition Placement Group isolates groups of instances on separate racks.', services: ['Partition Placement Group', 'Amazon MSK (Kafka)', 'Amazon EMR (Hadoop/Spark)'], category: 'performance' },
  { icon: '🌐', keyword: 'accelerate upload to S3 / fast global upload', hint: 'S3 Transfer Acceleration uses CloudFront edge to speed up UPLOADS (not downloads).', services: ['S3 Transfer Acceleration', 'S3 Multipart Upload (>100MB)'], category: 'performance' },
  { icon: '💾', keyword: 'shared file system / POSIX / NFS / multiple EC2', hint: 'EFS = NFS, Linux only, POSIX-compliant, auto-scales, multi-AZ. Not for Windows.', services: ['Amazon EFS (NFS, Linux)', 'FSx for Windows File Server (SMB, Windows)'], category: 'performance' },
  { icon: '🖥️', keyword: 'Windows shared storage / SMB / Active Directory', hint: 'FSx for Windows File Server = managed Windows SMB file system, AD-integrated.', services: ['Amazon FSx for Windows File Server', 'FSx Multi-AZ'], category: 'performance' },
  { icon: '🔬', keyword: 'ML training / HPC / high throughput file system', hint: 'FSx for Lustre = high-performance parallel file system. Integrates with S3.', services: ['Amazon FSx for Lustre', 'FSx for Lustre + S3 integration'], category: 'performance' },

  // ─── SECURITY ────────────────────────────────────────────────────────────
  { icon: '🔐', keyword: 'encrypt data at rest / KMS', hint: 'KMS hierarchy: SSE-S3 (no control) < SSE-KMS AWS key < SSE-KMS CMK (full control).', services: ['SSE-S3 (AWS manages)', 'SSE-KMS + AWS managed key', 'SSE-KMS + CMK (full control, audit, rotate)', 'Client-side encryption'], category: 'security' },
  { icon: '🔑', keyword: 'full control of encryption key / rotate on demand', hint: 'Only CMK (Customer Managed Key) gives full policy + rotation + CloudTrail audit.', services: ['AWS KMS Customer Managed Key (CMK)', 'Key rotation (automatic annual or manual)', 'CloudTrail KMS audit logs'], category: 'security' },
  { icon: '🔒', keyword: 'encrypt data in transit / HTTPS / TLS', hint: 'Use ACM for free managed TLS certificates on AWS services.', services: ['AWS ACM (free TLS certs for ALB/CloudFront)', 'HTTPS enforced via bucket policy', 'VPN/Direct Connect + VPN (in-transit)'], category: 'security' },
  { icon: '🗝️', keyword: 'rotate credentials / auto-rotate secrets', hint: 'Secrets Manager = paid, auto-rotates DB passwords (RDS, Redshift, DocumentDB built-in).', services: ['AWS Secrets Manager (auto-rotation)', 'Parameter Store (manual, free tier)', 'RDS password auto-rotation (Secrets Manager)'], category: 'security' },
  { icon: '🛡️', keyword: 'DDoS / volumetric attack / SYN flood', hint: 'Shield Standard = free, L3/L4. Shield Advanced = paid, L7 + 24/7 DRT + cost protection.', services: ['AWS Shield Standard (free, automatic)', 'AWS Shield Advanced ($3000/month)', 'CloudFront + WAF + Shield'], category: 'security' },
  { icon: '🚫', keyword: 'SQL injection / XSS / OWASP Top 10 / L7 attack', hint: 'WAF inspects HTTP/HTTPS content. NACLs/SGs cannot — they only see IP/port.', services: ['AWS WAF (Layer 7)', 'WAF + ALB', 'WAF + CloudFront', 'WAF + API Gateway', 'Managed Rule Groups (OWASP)'], category: 'security' },
  { icon: '🕵️', keyword: 'detect threats / anomalies / unusual API calls', hint: 'GuardDuty analyses VPC Flow Logs, DNS, CloudTrail for threats — no agent needed.', services: ['Amazon GuardDuty (threat detection)', 'Amazon Detective (root cause analysis)', 'CloudTrail Insights (unusual API rates)'], category: 'security' },
  { icon: '📜', keyword: 'audit / who did what / API call history', hint: 'CloudTrail = every API call (who, what, when, from where). NOT performance metrics.', services: ['AWS CloudTrail (management events)', 'CloudTrail data events (S3/Lambda, extra cost)', 'CloudTrail + S3 + Athena (long-term query)'], category: 'security' },
  { icon: '✅', keyword: 'resource compliance / config drift / history', hint: 'AWS Config records configuration history and evaluates compliance rules.', services: ['AWS Config', 'Config Rules (AWS-managed or custom Lambda)', 'Config Remediation (SSM Automation)'], category: 'security' },
  { icon: '🔍', keyword: 'scan for vulnerabilities / EC2 patches / CVEs', hint: 'Inspector continuously scans EC2 and container images for vulnerabilities.', services: ['Amazon Inspector (EC2 + ECR)', 'AWS Systems Manager Patch Manager', 'AWS Security Hub (aggregated findings)'], category: 'security' },
  { icon: '💽', keyword: 'discover sensitive data / PII in S3', hint: 'Macie uses ML to discover and classify sensitive data (PII, PHI) in S3.', services: ['Amazon Macie', 'S3 Inventory + Athena (alternative)', 'AWS Glue (ETL + classify)'], category: 'security' },
  { icon: '🏠', keyword: 'private access / no internet / AWS services from VPC', hint: 'VPC Endpoint = private path to AWS services. Gateway (free, S3+DDB) or Interface (paid, 100+ services).', services: ['VPC Gateway Endpoint (S3, DynamoDB — free)', 'VPC Interface Endpoint / PrivateLink (paid)', 'No need for NAT Gateway'], category: 'security' },
  { icon: '🚷', keyword: 'prevent across entire org / block even root account', hint: 'SCP applied to root OU cannot be overridden — even by account root users.', services: ['SCPs (Service Control Policies)', 'AWS Organizations', 'Root OU SCP (global guardrail)'], category: 'security' },
  { icon: '🆔', keyword: 'no long-term credentials on EC2 / no hardcoded keys', hint: 'IAM Role on EC2 delivers temp credentials via IMDS. No access keys needed.', services: ['IAM Role (attached to EC2)', 'Instance Profile', 'IMDS (Instance Metadata Service)', 'STS temporary credentials'], category: 'security' },
  { icon: '🌐', keyword: 'federated login / corporate SSO / SAML', hint: 'IAM Identity Center (SSO) = federate corporate directory for AWS Console/CLI access.', services: ['IAM Identity Center (AWS SSO)', 'SAML 2.0 federation', 'AWS Directory Service', 'Cognito (mobile/web app users)'], category: 'security' },
  { icon: '📱', keyword: 'mobile / web app users / social login / MFA', hint: 'Cognito User Pool = authentication (JWT). Cognito Identity Pool = temporary AWS credentials.', services: ['Cognito User Pool (auth, sign-up/in)', 'Cognito Identity Pool (AWS credentials)', 'Social login (Google, Facebook, Apple)', 'MFA via Cognito'], category: 'security' },
  { icon: '🔐', keyword: 'WORM / write-once-read-many / compliance retention', hint: 'S3 Object Lock prevents anyone (including root) from deleting objects before retention period.', services: ['S3 Object Lock — Compliance mode (no override)', 'S3 Object Lock — Governance mode (admin can override)', 'S3 Versioning (required)', 'MFA Delete'], category: 'security' },
  { icon: '🛜', keyword: 'inline network security / IDS/IPS / firewall appliance', hint: 'GWLB routes traffic through third-party security appliances (Check Point, Palo Alto, etc.) transparently.', services: ['AWS Gateway Load Balancer (GWLB)', 'AWS Network Firewall (managed stateful)', 'AWS Firewall Manager (centralised WAF/Shield/GWLB)'], category: 'security' },

  // ─── SERVERLESS ────────────────────────────────────────────────────────────
  { icon: '☁️', keyword: 'serverless / no server management', hint: 'Pay only for what you use. Auto-scales. No patching/provisioning.', services: ['Lambda', 'Fargate', 'API Gateway', 'DynamoDB', 'S3', 'SQS', 'SNS', 'Aurora Serverless v2'], category: 'serverless' },
  { icon: '🎯', keyword: 'event-driven / triggered by event', hint: 'Something triggers the function. Lambda reacts, processes, returns.', services: ['Lambda + SQS', 'Lambda + SNS', 'Lambda + EventBridge', 'Lambda + S3 Events', 'Lambda + DynamoDB Streams'], category: 'serverless' },
  { icon: '📋', keyword: 'run code without servers / max 15 minutes', hint: 'Lambda limit = 15 min. 10 GB RAM. 10 GB /tmp. For longer tasks → Fargate or Batch.', services: ['AWS Lambda', 'Lambda Layers', 'Lambda + SQS (for retry)', 'Lambda Provisioned Concurrency (no cold start)'], category: 'serverless' },
  { icon: '🐳', keyword: 'containers / Docker / no server management', hint: 'Fargate = serverless containers. No EC2 cluster to manage.', services: ['AWS Fargate (ECS or EKS)', 'Amazon ECS (AWS-native)', 'Amazon EKS (Kubernetes)', 'Amazon ECR (container registry)'], category: 'serverless' },
  { icon: '🌊', keyword: 'complex multi-step workflow / retry / parallel branches', hint: 'Step Functions orchestrates workflows visually. Built-in retry, parallel, wait for human.', services: ['AWS Step Functions (Standard: 1yr, Express: high-volume)', 'Lambda (steps)', 'SQS + Lambda (async step)'], category: 'serverless' },
  { icon: '⏱️', keyword: 'Lambda cold start / first invocation slow', hint: 'Provisioned Concurrency pre-warms Lambda functions. Eliminates cold start.', services: ['Lambda Provisioned Concurrency', 'Lambda SnapStart (Java)', 'Keep-warm hack (not recommended)'], category: 'serverless' },
  { icon: '🌐', keyword: 'serverless REST API / HTTP API', hint: 'API Gateway + Lambda = fully managed serverless API. No EC2.', services: ['API Gateway REST API (full features)', 'API Gateway HTTP API (cheaper, simpler)', 'API Gateway WebSocket API', 'Lambda'], category: 'serverless' },

  // ─── STORAGE ────────────────────────────────────────────────────────────────
  { icon: '🗄️', keyword: 'archive / infrequently accessed / compliance retention', hint: 'Cost decreases as retrieval time increases. Pick based on how fast you need data back.', services: ['S3 Glacier Instant (ms, quarterly)', 'S3 Glacier Flexible (mins-hours, 90d min)', 'S3 Glacier Deep Archive (hours, cheapest)', 'EBS Cold HDD sc1'], category: 'storage' },
  { icon: '🔗', keyword: 'shared storage / multiple EC2 simultaneous access', hint: 'EFS = POSIX NFS for Linux. FSx for Windows = SMB. S3 = object (not filesystem).', services: ['Amazon EFS (NFS, Linux, POSIX)', 'FSx for Windows (SMB, Windows)', 'S3 (object, not POSIX)'], category: 'storage' },
  { icon: '🖥️', keyword: 'block storage / single EC2 / OS disk / database', hint: 'EBS is always attached to one EC2 (except Multi-Attach io2 for cluster FS).', services: ['EBS gp3 (general, cost-effective)', 'EBS io2 (databases, max IOPS)', 'EBS st1 (big data sequential)', 'EBS sc1 (cold, cheapest)'], category: 'storage' },
  { icon: '⚡', keyword: 'highest IOPS / NVMe / ephemeral ok', hint: 'Instance Store = physically attached NVMe, highest performance. Data lost on stop/terminate.', services: ['EC2 Instance Store (ephemeral, NVMe)', 'EBS io2 Block Express (persistent, max IOPS)'], category: 'storage' },
  { icon: '🌊', keyword: 'data lake / query S3 data with SQL', hint: 'Athena = serverless SQL on S3. No loading needed. Pay per query.', services: ['Amazon S3 (data lake)', 'Amazon Athena (serverless SQL)', 'AWS Glue (ETL + data catalog)', 'AWS Lake Formation'], category: 'storage' },
  { icon: '📐', keyword: 'S3 Lifecycle / automatic storage class transition', hint: 'If access pattern is KNOWN → Lifecycle rules. Pattern UNKNOWN → Intelligent-Tiering.', services: ['S3 Lifecycle Policy (automatic transitions)', 'S3 Standard → IA (30d min) → Glacier (90d min) → Deep Archive (180d min)'], category: 'storage' },
  { icon: '🔄', keyword: 'S3 replication / copy objects cross-region', hint: 'CRR = cross-region (compliance, latency). SRR = same-region (log aggregation, test with prod data).', services: ['S3 Cross-Region Replication (CRR)', 'S3 Same-Region Replication (SRR)', 'Versioning required for both'], category: 'storage' },
  { icon: '🔐', keyword: 'S3 pre-signed URL / temporary download link', hint: 'Owner generates a time-limited URL that grants access to a private S3 object.', services: ['S3 Presigned URL (GET = download, PUT = upload)', 'CloudFront Signed URL (if served via CDN)', 'CloudFront Signed Cookie (multiple files)'], category: 'storage' },
  { icon: '📁', keyword: 'on-premises file server → S3 / NFS/SMB to cloud', hint: 'Storage Gateway File Gateway presents S3 as NFS or SMB to on-premises apps.', services: ['Storage Gateway File Gateway (NFS/SMB → S3)', 'AWS DataSync (online transfer, scheduled)', 'AWS Transfer Family (SFTP → S3/EFS)'], category: 'storage' },
  { icon: '💿', keyword: 'EBS gp2 → gp3 migration / cost saving', hint: 'gp3 = same price as gp2 but lets you independently tune IOPS and throughput. Always migrate.', services: ['EBS gp3 (3000 IOPS baseline, tune to 16K)', 'vs EBS gp2 (IOPS tied to size)'], category: 'storage' },

  // ─── NETWORKING ───────────────────────────────────────────────────────────
  { icon: '⚖️', keyword: 'distribute HTTP traffic / layer 7 / path routing', hint: 'ALB = HTTP/HTTPS, path-based, host-based, WebSocket. Integrates with WAF.', services: ['ALB (Application Load Balancer, Layer 7)', 'Path routing (/api → service A)', 'Host routing (api.example.com → service B)', 'WAF + ALB'], category: 'networking' },
  { icon: '🏎️', keyword: 'ultra-low latency / TCP / static IP / millions RPS', hint: 'NLB = Layer 4, preserves client IP, has static EIP per AZ. Use for TCP/UDP at extreme scale.', services: ['NLB (Network Load Balancer, Layer 4)', 'NLB + PrivateLink (expose service to other VPCs)', 'NLB static Elastic IP'], category: 'networking' },
  { icon: '🔥', keyword: 'inline security appliance / Palo Alto / Check Point', hint: 'GWLB routes traffic transparently through third-party security appliances.', services: ['Gateway Load Balancer (GWLB, Layer 3)', 'AWS Network Firewall (managed stateful)', 'AWS Firewall Manager'], category: 'networking' },
  { icon: '🌐', keyword: 'static anycast IP / global TCP/UDP acceleration', hint: 'Global Accelerator ≠ CloudFront. GA routes any protocol. CloudFront caches HTTP only.', services: ['AWS Global Accelerator (static IP, health-aware)', 'vs CloudFront (CDN, caching, HTTP only)'], category: 'networking' },
  { icon: '🏰', keyword: 'connect 2 VPCs / VPC peering', hint: 'VPC Peering = 1:1, non-transitive, no overlapping CIDR, no cost for connection (only data transfer).', services: ['VPC Peering (few VPCs)', 'Transit Gateway (many VPCs, hub-and-spoke)', 'AWS RAM (share subnets across accounts)'], category: 'networking' },
  { icon: '🚦', keyword: 'connect many VPCs / hub and spoke / centralised routing', hint: 'Transit Gateway connects 1000s of VPCs, VPNs, Direct Connect. Replaces complex peering mesh.', services: ['AWS Transit Gateway', 'TGW Route Tables', 'TGW + Direct Connect Gateway'], category: 'networking' },
  { icon: '🌉', keyword: 'on-premises to AWS / private dedicated line', hint: 'Direct Connect = physical dedicated circuit. Consistent bandwidth. NOT encrypted by default.', services: ['AWS Direct Connect (1/10/100 Gbps)', 'DX + VPN over DX (encrypted + consistent)', 'vs Site-to-Site VPN (encrypted, internet, cheaper)'], category: 'networking' },
  { icon: '🔑', keyword: 'encrypted VPN to on-premises / quick setup', hint: 'Site-to-Site VPN = encrypted, over internet, quick to provision. Variable latency.', services: ['AWS Site-to-Site VPN', 'Virtual Private Gateway (AWS side)', 'Customer Gateway (on-prem side)', 'Accelerated VPN + Global Accelerator'], category: 'networking' },
  { icon: '🗺️', keyword: 'DNS routing / Route 53 policies', hint: 'Match the routing policy to the requirement: latency, failover, weighted, geolocation, geoproximity.', services: ['Latency routing (lowest latency region)', 'Failover routing (primary/secondary)', 'Weighted routing (A/B test, % split)', 'Geolocation (by country/continent)', 'Geoproximity (distance + bias)'], category: 'networking' },
  { icon: '🚪', keyword: 'outbound internet from private subnet', hint: 'NAT Gateway = managed, AZ-specific, scales automatically. Deploy one per AZ for HA.', services: ['NAT Gateway (managed, AZ-specific)', 'vs NAT Instance (self-managed, cheaper, single AZ)', 'Egress-only IGW (IPv6 only)'], category: 'networking' },
  { icon: '🔌', keyword: 'expose service to other VPC without full access', hint: 'PrivateLink exposes only a specific service endpoint — not full VPC access.', services: ['AWS PrivateLink / VPC Interface Endpoint', 'NLB (required for PrivateLink provider side)'], category: 'networking' },

  // ─── MESSAGING / DECOUPLING ───────────────────────────────────────────────
  { icon: '🔗', keyword: 'decouple / loosely coupled / async processing', hint: 'Replace direct calls with a queue or event bus. Producer does not wait for consumer.', services: ['Amazon SQS (queue, pull model)', 'Amazon SNS (push, pub/sub)', 'Amazon EventBridge (event bus)'], category: 'messaging' },
  { icon: '📬', keyword: 'queue / buffer traffic spikes / absorb bursts', hint: 'SQS Standard = unlimited throughput. FIFO = ordered + exactly-once (3000 TPS).', services: ['SQS Standard (at-least-once, unlimited TPS)', 'SQS FIFO (exactly-once, ordered, 3000 TPS)', 'Dead-Letter Queue (DLQ) for failed messages'], category: 'messaging' },
  { icon: '🎙️', keyword: 'fan-out / pub-sub / one message many subscribers', hint: 'SNS pushes to all subscribers simultaneously. Use SNS → multiple SQS for fan-out.', services: ['Amazon SNS (push to Lambda, SQS, HTTP, email, SMS)', 'SNS + SQS fan-out pattern', 'SNS message filtering (subscribers get subset)'], category: 'messaging' },
  { icon: '⏳', keyword: 'message order guaranteed / exactly once delivery', hint: 'SQS FIFO = ordered + exactly-once. Standard = at-least-once (duplicates possible).', services: ['SQS FIFO Queue', 'Kinesis Data Streams (ordered within shard)', 'EventBridge (ordered event delivery)'], category: 'messaging' },
  { icon: '📡', keyword: 'real-time / continuous streaming / replay events', hint: 'Kinesis Streams = retain and replay. Firehose = deliver to S3/Redshift (no replay).', services: ['Kinesis Data Streams (replay, 24h-365d retention)', 'Kinesis Firehose (near-real-time delivery, no replay)', 'Amazon MSK / Apache Kafka'], category: 'messaging' },
  { icon: '🕹️', keyword: 'react to AWS service events / schedule automation', hint: 'EventBridge rules match event patterns and route to targets (Lambda, SQS, Step Functions).', services: ['Amazon EventBridge (event bus + scheduler)', 'EventBridge Pipes (source → target with enrichment)', 'EventBridge Scheduler (cron + one-time)'], category: 'messaging' },
  { icon: '🐮', keyword: 'legacy message broker / AMQP / MQTT / RabbitMQ', hint: 'Amazon MQ = managed ActiveMQ or RabbitMQ. Use for lift-and-shift of on-prem brokers. NOT for new builds.', services: ['Amazon MQ (ActiveMQ or RabbitMQ)', 'vs SQS/SNS (for new cloud-native apps)'], category: 'messaging' },
  { icon: '🔁', keyword: 'duplicate message processing / idempotency', hint: 'SQS Standard = at-least-once delivery. Design consumers to handle duplicates (idempotent operations).', services: ['SQS Standard (idempotent consumer required)', 'SQS FIFO (exactly-once, deduplication ID)', 'DynamoDB conditional writes (idempotent pattern)'], category: 'messaging' },

  // ─── MIGRATION / HYBRID ───────────────────────────────────────────────────
  { icon: '🚛', keyword: 'migrate to AWS / lift-and-shift (rehost)', hint: 'Application Migration Service = automated lift-and-shift. Minimal code changes.', services: ['AWS Application Migration Service (MGN)', 'AWS DMS (database)', 'AWS Migration Hub (tracking)'], category: 'migration' },
  { icon: '💽', keyword: 'large dataset / terabytes / limited bandwidth', hint: 'Rule of thumb: if transfer takes >1 week over internet → use Snow device.', services: ['Snowcone (8-14TB, smallest)', 'Snowball Edge (80TB, edge compute)', 'Snowmobile (100PB, truck)'], category: 'migration' },
  { icon: '🌉', keyword: 'on-premises integration / hybrid cloud', hint: 'Storage Gateway bridges on-premises to S3. Direct Connect for private network link.', services: ['Storage Gateway File (NFS/SMB → S3)', 'Storage Gateway Volume Cached/Stored', 'AWS Direct Connect', 'AWS Outposts (AWS hardware on-prem)'], category: 'migration' },
  { icon: '🔄', keyword: 'online data transfer / continuous sync to AWS', hint: 'DataSync = scheduled, incremental, online transfer from NFS/SMB/HDFS to AWS storage.', services: ['AWS DataSync (NFS/SMB/S3/EFS/FSx)', 'AWS Transfer Family (SFTP/FTPS/FTP)', 'S3 Replication (for S3 to S3)'], category: 'migration' },
  { icon: '🗃️', keyword: 'database migration / different engine / Oracle to Aurora', hint: 'Different engines → SCT (schema conversion) + DMS (data migration). Same engine → DMS alone.', services: ['AWS SCT (Schema Conversion Tool)', 'AWS DMS (ongoing replication, minimal downtime)', 'Aurora Migration Wizard'], category: 'migration' },
  { icon: '📁', keyword: 'on-premises tape backup to cloud', hint: 'Storage Gateway Tape Gateway = virtual tape library, stores to S3 and Glacier.', services: ['Storage Gateway Tape Gateway (VTL)', 'S3 Glacier (tape data storage)', 'AWS Backup (centralised backup)'], category: 'migration' },
  { icon: '🏷️', keyword: '6 Rs / migration strategy', hint: 'Retire → Retain → Rehost (fastest) → Replatform → Repurchase → Refactor (most cloud-native).', services: ['Rehost: EC2 + MGN', 'Replatform: RDS, Elastic Beanstalk', 'Refactor: Lambda, ECS, DynamoDB'], category: 'migration' },

  // ─── MONITORING ────────────────────────────────────────────────────────────
  { icon: '📊', keyword: 'metrics / alarms / dashboards / performance data', hint: 'CloudWatch = metrics + alarms + logs. NOT for API audit (that is CloudTrail).', services: ['Amazon CloudWatch Metrics (default 5-min, detailed 1-min)', 'CloudWatch Alarms (SNS, Auto Scaling, EC2 action)', 'CloudWatch Dashboards'], category: 'monitoring' },
  { icon: '📋', keyword: 'centralise logs / application logs / log retention', hint: 'Send logs from EC2, Lambda, containers to CloudWatch Logs via CloudWatch Agent.', services: ['CloudWatch Logs', 'CloudWatch Log Insights (query language)', 'CloudWatch Agent (on EC2)', 'Kinesis Firehose → S3 (for large-scale log archiving)'], category: 'monitoring' },
  { icon: '🔍', keyword: 'distributed tracing / service latency / microservices debug', hint: 'X-Ray provides service map showing where latency occurs across distributed services.', services: ['AWS X-Ray (traces, service map, latency)', 'X-Ray SDK in Lambda/ECS/EC2', 'X-Ray + CloudWatch ServiceLens'], category: 'monitoring' },
  { icon: '🤖', keyword: 'detect anomalies / unusual patterns automatically', hint: 'CloudWatch Anomaly Detection uses ML to baseline metrics and alert on deviations.', services: ['CloudWatch Anomaly Detection', 'CloudWatch Alarms (metric anomaly)', 'GuardDuty (security anomaly)', 'CloudTrail Insights (unusual API calls)'], category: 'monitoring' },
  { icon: '📬', keyword: 'alert / notify on AWS service events / react automatically', hint: 'EventBridge routes AWS service events to targets. CloudWatch Events is now EventBridge.', services: ['Amazon EventBridge (rules + targets)', 'SNS (alert notifications)', 'CloudWatch Alarms → SNS → Lambda'], category: 'monitoring' },

  // ─── COMPUTE ─────────────────────────────────────────────────────────────
  { icon: '🐳', keyword: 'containers / Docker / microservices', hint: 'ECS = AWS-native. EKS = Kubernetes. Fargate = serverless compute for both.', services: ['Amazon ECS (AWS orchestration)', 'Amazon EKS (Kubernetes)', 'AWS Fargate (serverless)', 'Amazon ECR (image registry)'], category: 'compute' },
  { icon: '⏱️', keyword: 'scheduled jobs / cron / periodic batch', hint: 'EventBridge Scheduler triggers Lambda or ECS tasks on a schedule.', services: ['EventBridge Scheduler (cron)', 'AWS Batch (managed batch jobs)', 'ECS Scheduled Tasks', 'Lambda + EventBridge rule'], category: 'compute' },
  { icon: '🧩', keyword: 'PaaS / deploy code without managing servers', hint: 'Elastic Beanstalk deploys your app and auto-provisions EC2, ALB, ASG, RDS. You keep control.', services: ['AWS Elastic Beanstalk', 'AWS App Runner (even simpler, containers)', 'AWS Amplify (frontend + backend)'], category: 'compute' },
  { icon: '🎮', keyword: 'GPU / ML inference / deep learning', hint: 'EC2 GPU families: P (training), G (inference/graphics), Trn (Trainium), Inf (Inferentia).', services: ['EC2 P-series (training)', 'EC2 G-series (inference)', 'AWS Trainium (custom ML chip)', 'AWS Inferentia (inference)', 'Amazon SageMaker'], category: 'compute' },
  { icon: '🔄', keyword: 'Auto Scaling / scale to demand', hint: 'Target Tracking = simplest (maintain % CPU). Step = custom thresholds. Predictive = ML-forecast.', services: ['EC2 Auto Scaling — Target Tracking (e.g., 70% CPU)', 'EC2 Auto Scaling — Step Scaling (alarm thresholds)', 'EC2 Auto Scaling — Scheduled', 'EC2 Auto Scaling — Predictive (ML)'], category: 'compute' },
  { icon: '🧮', keyword: 'large-scale parallel processing / managed batch', hint: 'AWS Batch manages EC2/Fargate provisioning, job queues, array jobs, retries automatically.', services: ['AWS Batch (managed)', 'AWS Batch + Spot (cost-optimised)', 'AWS Batch array jobs (parallel)', 'AWS EMR (Hadoop/Spark)'], category: 'compute' },
  { icon: '🖥️', keyword: 'EC2 user data / run script on first launch only', hint: 'User data scripts run ONCE at first boot by default. Instance metadata is read-only data — not for running scripts.', services: ['EC2 User Data (shell script, cloud-init)', 'Runs once at first launch (default)', 'Instance Metadata ≠ User Data'], category: 'compute' },
  { icon: '💥', keyword: 'Spot Instance interrupted / can restart / persistent', hint: 'Persistent Spot request reopens automatically after interruption. One-time does not.', services: ['Spot Instance — persistent request (auto-reopen)', 'Spot Instance — one-time (no reopen)', '2-minute interruption notice (CloudWatch Events)'], category: 'compute' },
  { icon: '🏢', keyword: 'single-tenant hardware / compliance / isolation', hint: 'Dedicated Instances = single-tenant hardware, cost-effective. Dedicated Hosts = also single-tenant + BYOL visibility + more expensive.', services: ['Dedicated Instances (single-tenant, most cost-effective)', 'Dedicated Hosts (single-tenant + BYOL + socket/core visibility)', 'vs On-Demand (shared hardware)'], category: 'compute' },
  { icon: '🔬', keyword: 'HPC / MPI / inter-node communication / OS-bypass', hint: 'EFA = Elastic Fabric Adapter. Bypasses OS kernel for node-to-node MPI traffic. ENA = enhanced networking but no OS-bypass.', services: ['EFA (Elastic Fabric Adapter, MPI, OS-bypass)', 'ENA (enhanced networking, SR-IOV, no OS-bypass)', 'Cluster Placement Group (lowest latency rack)'], category: 'compute' },
  { icon: '🚪', keyword: 'bastion host / SSH jump server / highly available', hint: 'Bastion hosts use TCP/SSH (Layer 4). Use NLB — not ALB (ALB only handles HTTP Layer 7).', services: ['NLB (Network Load Balancer, TCP/SSH Layer 4)', 'Auto Scaling Group (min=1, multi-AZ)', 'Security Group (allow SSH from NLB)'], category: 'compute' },
  { icon: '🎯', keyword: 'single instance HA / monolith / cannot distribute', hint: 'ASG with min=max=desired=1 across 2 AZs auto-recreates the instance in other AZ on failure. Use EIP + user data to re-attach IP. No ALB needed (saves cost).', services: ['ASG min=max=1 across 2 AZs', 'Elastic IP + EC2 user data script to re-attach', 'EC2 Instance Role (for EIP API call)'], category: 'compute' },

  // ─── SECURITY (exam additions) ────────────────────────────────────────────
  { icon: '🧪', keyword: 'proprietary encryption / custom algorithm / client encrypts before upload', hint: 'Only Client-Side Encryption lets you apply your own algorithm before data reaches AWS. SSE-S3/KMS/SSE-C all happen server-side — AWS touches the data.', services: ['Client-Side Encryption (CSE)', 'Amazon S3 Encryption Client', 'vs SSE-S3 / SSE-KMS / SSE-C (all server-side)'], category: 'security' },
  { icon: '🎭', keyword: 'restrict S3 access through CloudFront only / block direct S3 URL', hint: 'OAI (Origin Access Identity) ties CloudFront to S3. Users can only reach S3 via CloudFront. S3 has NO security groups.', services: ['CloudFront OAI (Origin Access Identity)', 'S3 Bucket Policy (allow OAI principal only)', 'CloudFront Signed URL/Cookie (for subscriber content)'], category: 'security' },
  { icon: '🪪', keyword: 'Cognito user pool vs identity pool / S3 from mobile app', hint: 'User Pool = login/auth (JWT token). Identity Pool = exchange JWT for temporary IAM credentials to call AWS APIs like S3.', services: ['Cognito User Pool (authentication, sign-up/in, JWT)', 'Cognito Identity Pool (temporary AWS credentials via STS)', 'IAM Role mapped to identity pool'], category: 'security' },
  { icon: '🚦', keyword: 'rate-based attack / DDoS HTTP flood / too many requests per IP', hint: 'WAF rate-based rule counts requests per IP and blocks when threshold crossed. Shield Advanced does NOT have rate rules.', services: ['AWS WAF rate-based rule', 'WAF + ALB', 'WAF + CloudFront', 'Shield Standard (free, L3/L4 only)'], category: 'security' },
  { icon: '🏦', keyword: 'central firewall rules / manage WAF across all accounts', hint: 'Firewall Manager centralises WAF rules, Shield Advanced, VPC Security Groups, Network Firewall, Route 53 DNS Firewall across AWS Organizations. Does NOT manage GuardDuty or Inspector.', services: ['AWS Firewall Manager (central policy)', 'AWS WAF (supported)', 'Shield Advanced (supported)', 'VPC Security Groups (supported)', 'NOT GuardDuty / NOT Inspector / NOT NACLs'], category: 'security' },
  { icon: '💰', keyword: 'cryptocurrency mining on EC2 / unauthorized workload', hint: 'GuardDuty detects EC2 querying cryptocurrency mining IPs (finding: CryptoCurrency:EC2/BitcoinTool.B). Set suppression rule if intentional.', services: ['Amazon GuardDuty', 'Finding: CryptoCurrency:EC2/BitcoinTool.B!DNS', 'GuardDuty suppression rule (if legitimate)'], category: 'security' },
  { icon: '🗂️', keyword: 'Route 53 private hosted zone / custom internal domain', hint: 'For private hosted zones to resolve inside a VPC, both enableDnsHostnames AND enableDnsSupport must be true on the VPC.', services: ['Route 53 Private Hosted Zone', 'enableDnsHostnames = true (VPC setting)', 'enableDnsSupport = true (VPC setting)'], category: 'security' },
  { icon: '🏛️', keyword: 'multi-account governance / auto guardrails / new account setup', hint: 'Control Tower automates account vending with SCPs, Config rules, CloudTrail logging. Pair with RAM to share VPC subnets.', services: ['AWS Control Tower (automated landing zone)', 'AWS RAM (Resource Access Manager, share VPC subnets)', 'SCPs (guardrails)', 'AWS Organizations'], category: 'governance' },
  { icon: '👥', keyword: '50 users need extra permissions / IAM group / least effort', hint: 'Create a group, attach the policy to the group, add the 50 users. S3 bucket policies limited to 20 KB — cannot list 50 ARNs reliably.', services: ['IAM Group (attach policy once, add users)', 'vs S3 Bucket Policy (20 KB limit)', 'vs individual user policies (hard to scale)'], category: 'governance' },
  { icon: '📧', keyword: 'AWS account notifications / alternate contacts / billing / security ops', hint: 'Each AWS account has Alternate Contacts for Billing, Security, and Operations. Use company-managed distribution lists — not individual emails. Combined with root email alias to central mailbox.', services: ['AWS Alternate Contacts (billing, security, operations)', 'Root email → company alias → monitored mailbox', 'AWS Organizations multi-account'], category: 'governance' },
  { icon: '🔑', keyword: 'IAM Identity Center / permission sets / federated teams', hint: 'IAM Identity Center centralises access: define permission sets (least-privilege policies), assign users to groups, map groups to permission sets per account. Low overhead.', services: ['AWS IAM Identity Center (formerly SSO)', 'Permission Sets (mapped to IAM policies)', 'Group-based assignment', 'Integrates with AD / external IdP'], category: 'governance' },

  // ─── DATABASE (exam additions) ─────────────────────────────────────────────
  { icon: '🔁', keyword: 'RDS Multi-AZ OS updates / patching order', hint: 'RDS patches standby first → promotes standby to primary → patches old primary (now standby). Minimises downtime during maintenance.', services: ['RDS Multi-AZ (synchronous replication)', 'Maintenance: standby first, then primary', 'Automated backups taken from standby (no I/O suspend on primary)'], category: 'database' },
  { icon: '💸', keyword: 'read replica same region vs cross-region cost', hint: 'Replicating data to a read replica in the SAME region is FREE. Cross-region read replica replication incurs data transfer charges.', services: ['Read Replica same region (no replication charge)', 'Read Replica cross-region (data transfer charged)', 'Analytics workloads → same-region read replica'], category: 'database' },
  { icon: '🔀', keyword: 'unpredictable OLTP spikes / relational / auto-scale DB', hint: 'Aurora Serverless = relational, SQL, OLTP, auto-scales ACUs to zero. DynamoDB = NoSQL, no JOINs, not relational.', services: ['Aurora Serverless v2 (MySQL/PostgreSQL, auto-scale)', 'vs DynamoDB (NoSQL, no relational queries)', 'vs RDS (fixed capacity, no auto-scale)'], category: 'database' },
  { icon: '❄️', keyword: 'Redshift cold data / 30-day-old warehouse data / SQL on S3', hint: 'Move old data from Redshift to S3 Standard-IA (cheaper), then query it with Athena (serverless SQL). Glacier = no immediate SQL query.', services: ['S3 Standard-IA (infrequent, immediate access)', 'Amazon Athena (serverless SQL on S3)', 'vs S3 Glacier (no immediate SQL query)', 'vs smaller Redshift cluster (storage still grows)'], category: 'database' },
  { icon: '📊', keyword: 'S3 analytics / storage class analysis / which tier to use', hint: 'S3 Storage Class Analysis ONLY recommends transitions from Standard → Standard-IA. It does NOT recommend Glacier, One Zone-IA, or Deep Archive.', services: ['S3 Analytics Storage Class Analysis', 'Recommends: Standard → Standard-IA only', 'Then use Lifecycle rules based on findings'], category: 'database' },
  { icon: '🌐', keyword: 'Aurora Global Database / cross-region RTO RPO', hint: 'Aurora Global Database replicates with <1s lag (RPO ~seconds). Managed failover meets RTO <15 min. Better than DMS (complex) or snapshot-based DR (hours).', services: ['Aurora Global Database', 'RPO: typically < 1 second', 'RTO: < 15 minutes (managed failover)', 'vs DMS (higher complexity, no RPO guarantee)'], category: 'database' },

  // ─── COST (exam additions) ──────────────────────────────────────────────────
  { icon: '📐', keyword: 'Compute Savings Plan vs EC2 Instance Savings Plan vs SageMaker SP', hint: 'Compute SP = EC2+Fargate+Lambda (most flexible, 66% off). EC2 Instance SP = EC2 family only (72% off, NOT Fargate). SageMaker SP = separate plan for SageMaker only.', services: ['Compute Savings Plan (EC2+Fargate+Lambda, 66% off)', 'EC2 Instance Savings Plan (EC2 only, 72% off, NOT Fargate)', 'SageMaker Savings Plan (SageMaker only, up to 64% off)'], category: 'cost' },
  { icon: '🚨', keyword: 'auto-stop spending / budget exceeded / DenyAll policy', hint: 'AWS Budgets Actions can automatically attach a DenyAll IAM policy to a role when budget threshold is crossed. Fully automated, no Lambda needed.', services: ['AWS Budgets (spending/forecasted alerts)', 'Budgets Actions (auto-apply IAM policy)', 'DenyAll IAM policy on breach'], category: 'cost' },
  { icon: '📡', keyword: 'monitor Savings Plans coverage / alert when coverage drops', hint: 'AWS Budgets coverage budget tracks % of compute usage covered by Savings Plans. Alerts when below threshold. CloudWatch has no SP coverage metrics.', services: ['AWS Budgets coverage budget', 'Email/SNS alert on coverage drop', 'vs CloudWatch (no native SP coverage metrics)', 'vs Compute Optimizer (no SP coverage tracking)'], category: 'cost' },
  { icon: '🌐', keyword: 'EC2 replication cost / cross-AZ data transfer / use private IP', hint: 'Private IP traffic within a VPC is free across AZs. Public IP traffic (even within AWS) goes via internet gateway and incurs charges.', services: ['Private IP replication = free within VPC', 'Public IP replication = internet charges ($0.01/GB/dir)', 'Always use private IPs for inter-instance replication'], category: 'cost' },

  // ─── STORAGE (exam additions) ───────────────────────────────────────────────
  { icon: '🔗', keyword: 'EBS Multi-Attach / shared block / cluster filesystem', hint: 'EBS Multi-Attach only works with Provisioned IOPS SSD (io1 or io2). All instances must be in the same AZ. NOT supported on HDD or gp2/gp3.', services: ['EBS io1 / io2 (Provisioned IOPS SSD only)', 'Multi-Attach: same AZ only', 'Full read/write from each attached instance', 'NOT HDD / NOT gp2 / NOT gp3'], category: 'storage' },
  { icon: '💀', keyword: 'Instance Store behaviour / stop terminate hibernate', hint: 'Instance Store is lost on stop, terminate, AND hibernate. Data survives a reboot. Cannot detach and reattach to another instance. Not in AMI.', services: ['Lost on: stop, terminate, hibernate', 'Survives: reboot only', 'Cannot detach/reattach to another EC2', 'AMI creation does NOT preserve instance store data'], category: 'storage' },
  { icon: '📁', keyword: 'POSIX file system / NFS / infrequent access / archive', hint: 'EFS Infrequent Access (EFS IA) = POSIX-compliant NFS, up to 92% cheaper than EFS Standard. Use Lifecycle Management to auto-move files.', services: ['Amazon EFS Infrequent Access (EFS IA)', 'EFS Lifecycle Management (auto-tiering)', 'vs S3 (object storage, not POSIX)', 'vs EFS Standard (POSIX but more expensive)'], category: 'storage' },
  { icon: '📋', keyword: 'S3 versioning status / check across all accounts regions', hint: 'S3 Storage Lens provides org-wide visibility with versioning status, usage metrics, and recommendations across all regions and accounts in one dashboard.', services: ['S3 Storage Lens (advanced metrics)', 'Per-bucket versioning status view', 'vs CloudTrail (only logs changes, not current state)', 'vs IAM Access Analyzer (access, not config)'], category: 'storage' },
  { icon: '⚖️', keyword: 'Glacier Instant Retrieval vs Standard-IA cost tradeoff', hint: 'Glacier Instant Retrieval = cheaper to store ($0.004/GB) but expensive to retrieve ($0.03/GB). Standard-IA = more expensive to store ($0.0125/GB) but cheaper to retrieve ($0.01/GB). If accessed even occasionally, Standard-IA wins.', services: ['S3 Standard-IA ($0.0125/GB storage, $0.01/GB retrieval)', 'S3 Glacier Instant Retrieval ($0.004/GB storage, $0.03/GB retrieval)', 'Prefer Standard-IA when retrieval happens more than rarely'], category: 'storage' },

  // ─── NETWORKING (exam additions) ──────────────────────────────────────────
  { icon: '🚫', keyword: 'ELB cannot span multiple regions / cross-region load balancing', hint: 'ELB (ALB/NLB/CLB) distributes traffic across AZs within ONE region only. For multi-region, use Route 53 or Global Accelerator.', services: ['ELB = single region, multiple AZs only', 'Route 53 (multi-region DNS routing)', 'Global Accelerator (multi-region TCP/UDP)', 'NOT ELB across us-east-1 and us-west-2'], category: 'networking' },
  { icon: '🔌', keyword: 'Direct Connect + public VIF / access S3 from on-premises privately', hint: 'Public VIF advertises AWS public service IPs (S3, DynamoDB) over your DX link. Traffic stays private. Private VIF = VPC resources only, cannot reach S3 directly.', services: ['Direct Connect Public VIF (access S3, DynamoDB, public services)', 'Direct Connect Private VIF (VPC resources only)', 'vs Site-to-Site VPN (internet, encrypted)', 'Public VIF ≠ internet (stays on AWS backbone)'], category: 'networking' },
  { icon: '🌐', keyword: 'branch offices communicate / VPN CloudHub / hub-and-spoke on-prem', hint: 'VPN CloudHub = multiple Site-to-Site VPN + Direct Connect connections via virtual private gateway. Branch offices talk to each other AND to HQ. Works with or without a VPC.', services: ['AWS VPN CloudHub (hub-and-spoke)', 'Virtual Private Gateway (hub)', 'Site-to-Site VPN per branch (spokes)', 'Direct Connect can also participate'], category: 'networking' },
  { icon: '🏗️', keyword: 'NAT Gateway placement / public subnet only / HA config', hint: 'NAT Gateway must be in a PUBLIC subnet (it needs an internet gateway). For HA: deploy one NAT Gateway per AZ in each AZ\'s public subnet. Route private subnet traffic to same-AZ NAT.', services: ['NAT Gateway in public subnet (required)', 'One NAT Gateway per AZ (for HA)', 'Route table: private subnet → NAT Gateway in same AZ', 'NOT in private subnet'], category: 'networking' },
  { icon: '🆚', keyword: 'ALB vs NLB / which load balancer / SSH vs HTTP', hint: 'ALB = Layer 7 HTTP/HTTPS only (WebSocket). NLB = Layer 4 TCP/UDP/TLS — supports SSH, FTP, custom TCP, TLS offload, static EIP. Bastion hosts NEED NLB.', services: ['ALB (Layer 7: HTTP/HTTPS, path routing, WAF)', 'NLB (Layer 4: TCP/UDP/TLS, SSH, static IP, TLS offload)', 'GWLB (Layer 3: transparent security appliance)'], category: 'networking' },
  { icon: '🔒', keyword: 'private subnet access S3 without internet / gateway endpoint', hint: 'Gateway VPC Endpoint for S3 (and DynamoDB) is FREE and routes traffic via route table — no internet gateway, no NAT needed. Interface endpoints cost per-hour + per-GB.', services: ['VPC Gateway Endpoint for S3 (free, route table)', 'VPC Gateway Endpoint for DynamoDB (free)', 'vs Interface Endpoint / PrivateLink (hourly + per-GB cost)', 'S3 + Gateway EP = compliance + zero data egress cost'], category: 'networking' },

  // ─── MESSAGING (exam additions) ────────────────────────────────────────────
  { icon: '⏳', keyword: 'postpone delivery of new messages / delay queue', hint: 'SQS Delay Queues hold NEW messages invisible for 0-15 minutes. Visibility timeout hides ALREADY-RECEIVED messages from other consumers — different concept.', services: ['SQS Delay Queue (delay: 0 sec to 15 min)', 'vs Visibility Timeout (hides already-received message)', 'vs Dead-Letter Queue (captures failed processing)', 'vs FIFO (ordering, not delay)'], category: 'messaging' },
  { icon: '🏆', keyword: 'priority queue / pro users before lite / two queues', hint: 'SQS has no native priority. Solution: two separate queues (pro + lite). EC2 workers poll pro queue first, lite queue second. Long/short polling does not affect priority.', services: ['Two SQS Standard Queues (one per priority tier)', 'EC2 consumer: poll pro queue first', 'Long polling ≠ priority (controls wait time only)'], category: 'messaging' },
  { icon: '↔️', keyword: 'request-response / temporary queue / lightweight messaging', hint: 'SQS Temporary Queues = virtual queues multiplexed on one real SQS queue. Used for request-response patterns. Auto-cleaned. No extra API calls, no extra cost.', services: ['SQS Temporary Queue Client', 'Virtual Queues (lightweight, no real SQS queue per request)', 'Auto-cleanup when no longer used', 'High-throughput, API-compatible'], category: 'messaging' },
  { icon: '📦', keyword: 'SQS scale EC2 on queue depth / auto scale consumers', hint: 'Use EC2 Auto Scaling target tracking on ApproximateNumberOfMessages SQS metric. More messages = more EC2 workers. Better than CPU-based scaling for queue-driven workloads.', services: ['SQS ApproximateNumberOfMessages metric', 'EC2 ASG target tracking policy', 'vs CPU scaling (lags behind, reactive only)', 'vs scheduled scaling (needs predictable traffic)'], category: 'messaging' },

  // ─── MIGRATION (exam additions) ─────────────────────────────────────────────
  { icon: '🚀', keyword: 'AWS MGN / Application Migration Service / lift-and-shift steps', hint: 'MGN workflow: Install Replication Agent on source VM → initial replication → launch TEST instance (validate) → final sync → launch CUTOVER instance → decommission source.', services: ['AWS MGN Replication Agent (on source VM)', 'Test Instance (validate before cutover)', 'Cutover Instance (go-live)', 'vs CloudEndure Disaster Recovery (DR only, not migration)'], category: 'migration' },
  { icon: '🌊', keyword: 'Kinesis on-demand mode / unpredictable streaming traffic', hint: 'Kinesis Data Streams on-demand mode auto-provisions shard capacity based on throughput — no manual shard management. Ideal for unpredictable or growing real-time workloads.', services: ['Kinesis Data Streams on-demand (auto-scale shards)', 'vs Provisioned mode (manual shard management)', 'Lambda consumer (real-time, serverless)'], category: 'messaging' },

  // ─── PERFORMANCE (exam additions) ──────────────────────────────────────────
  { icon: '📏', keyword: 'read first N bytes of S3 object / partial read / byte range', hint: 'Use Range HTTP header in S3 GET request to fetch only specific bytes. Much cheaper and faster than downloading entire 50TB files when you only need 250 bytes.', services: ['S3 Byte Range Fetch (Range header in GET)', 'Concurrent byte ranges (parallel reads)', 'vs S3 Select ScanRange (query CSV/JSON, different purpose)', 'vs full object download (wasteful for large files)'], category: 'performance' },
  { icon: '⏰', keyword: 'real-time streaming + 30-minute jobs / Kinesis + Fargate', hint: 'Kinesis = ingestion (real-time). Fargate = processing container (no 15-min Lambda limit). Lambda max is 15 min — cannot run 30-min jobs. EMR = Hadoop big data, overkill here.', services: ['Kinesis Data Streams (real-time ingestion)', 'AWS Fargate + ECS (container, no time limit)', 'vs Lambda (max 15 min, not for long jobs)', 'vs EMR (Hadoop, big data specific)'], category: 'performance' },

  // ─── GOVERNANCE (exam additions) ───────────────────────────────────────────
  { icon: '🏢', keyword: 'Managed Microsoft AD / trust with on-premises AD / SharePoint', hint: 'AWS Managed Microsoft AD = full AD features + trust relationships with on-premises AD. AD Connector = redirect to on-prem (no cloud directory). Simple AD = subset, no trusts, no MFA.', services: ['AWS Managed Microsoft AD (full features, trust relationships)', 'AD Connector (redirect to on-prem, no cloud directory)', 'Simple AD (limited features, no trust, no MFA, standalone only)'], category: 'governance' },
  { icon: '🛑', keyword: 'SCP guardrails / prevent root account / block entire org', hint: 'SCPs set the maximum allowed permissions across all accounts in an org unit. They DENY/LIMIT only — they do not grant. Even root cannot bypass an SCP.', services: ['SCPs (deny/limit only, no grant)', 'AWS Organizations OU hierarchy', 'Root OU SCP = global block (even overrides root user)'], category: 'governance' },
]

const CATEGORIES = [
  { id: 'all',          label: '⭐ All' },
  { id: 'caching',      label: '⚡ Caching' },
  { id: 'availability', label: '🛡️ Availability' },
  { id: 'database',     label: '🗄️ Database' },
  { id: 'security',     label: '🔐 Security' },
  { id: 'cost',         label: '💰 Cost' },
  { id: 'performance',  label: '🚀 Performance' },
  { id: 'serverless',   label: '☁️ Serverless' },
  { id: 'storage',      label: '📦 Storage' },
  { id: 'networking',   label: '🌐 Networking' },
  { id: 'messaging',    label: '📬 Messaging' },
  { id: 'migration',    label: '🚛 Migration' },
  { id: 'monitoring',   label: '📊 Monitoring' },
  { id: 'compute',      label: '🖥️ Compute' },
  { id: 'governance',   label: '🏛️ Governance' },
]

const CAT_COLORS: Record<string, { bg: string; text: string; border: string; tag: string }> = {
  caching:      { bg: '#fff7ed', text: '#c2410c', border: '#fed7aa', tag: '#ea580c' },
  availability: { bg: '#eff6ff', text: '#1d4ed8', border: '#bfdbfe', tag: '#2563eb' },
  database:     { bg: '#fdf4ff', text: '#7e22ce', border: '#e9d5ff', tag: '#9333ea' },
  cost:         { bg: '#f0fdf4', text: '#15803d', border: '#bbf7d0', tag: '#16a34a' },
  performance:  { bg: '#ecfeff', text: '#0e7490', border: '#a5f3fc', tag: '#0891b2' },
  serverless:   { bg: '#eef2ff', text: '#4338ca', border: '#c7d2fe', tag: '#4f46e5' },
  security:     { bg: '#fef2f2', text: '#b91c1c', border: '#fecaca', tag: '#dc2626' },
  migration:    { bg: '#fafafa', text: '#374151', border: '#d1d5db', tag: '#6b7280' },
  messaging:    { bg: '#f0fdf4', text: '#166534', border: '#bbf7d0', tag: '#15803d' },
  storage:      { bg: '#fff1f2', text: '#be123c', border: '#fecdd3', tag: '#e11d48' },
  networking:   { bg: '#faf5ff', text: '#6b21a8', border: '#e9d5ff', tag: '#7c3aed' },
  monitoring:   { bg: '#f0f9ff', text: '#0369a1', border: '#bae6fd', tag: '#0284c7' },
  compute:      { bg: '#fff7ed', text: '#9a3412', border: '#fed7aa', tag: '#c2410c' },
  governance:   { bg: '#f0f9ff', text: '#075985', border: '#bae6fd', tag: '#0369a1' },
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
        <div style={{ maxWidth: '1040px', margin: '0 auto' }}>

          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <div style={{ display: 'inline-block', background: '#faf5ff', color: '#7e22ce', padding: '4px 14px', borderRadius: '999px', fontSize: '0.8rem', fontWeight: 700, marginBottom: '12px', letterSpacing: '0.05em' }}>
              OFFICIAL SAA-C03 GUIDE
            </div>
            <h1 style={{ fontSize: '2rem', fontWeight: 900, color: '#111827', margin: '0 0 10px' }}>
              Keywords & Terms
            </h1>
            <p style={{ color: '#6b7280', fontSize: '1rem', margin: '0 0 4px' }}>
              Spot these words in a question → know exactly which AWS service to pick.
            </p>
            <p style={{ color: '#9ca3af', fontSize: '0.85rem', margin: '0 0 12px' }}>
              {keywords.length} exam scenarios · {CATEGORIES.length - 1} categories · SAA-C03 aligned
            </p>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '999px', padding: '4px 14px', fontSize: '0.78rem', fontWeight: 700, color: '#16a34a' }}>
              ✅ Patterns extracted from 1,098 real Tutorials Dojo &amp; Udemy exam questions
            </div>
          </div>

          {/* Search */}
          <div style={{ position: 'relative', marginBottom: '20px' }}>
            <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', fontSize: '1.1rem' }}>🔍</span>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search: caching, WAF, DynamoDB, latency, cost…"
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
                  padding: '6px 14px', borderRadius: '999px', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer', border: '1.5px solid',
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
            Showing <strong>{filtered.length}</strong> of {keywords.length} scenarios
          </p>

          {/* Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(440px, 1fr))', gap: '14px' }}>
            {filtered.map(k => {
              const colors = CAT_COLORS[k.category] || CAT_COLORS['compute']
              return (
                <div key={k.keyword + k.category} style={{ background: '#fff', border: '1.5px solid #e2e8f0', borderRadius: '14px', padding: '18px 20px', transition: 'box-shadow 0.15s', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}
                  onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.09)')}
                  onMouseLeave={e => (e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.04)')}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginBottom: '10px' }}>
                    <span style={{ fontSize: '1.3rem', lineHeight: 1, marginTop: '2px' }}>{k.icon}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '6px', marginBottom: '6px' }}>
                        <span style={{ fontSize: '0.9rem', fontWeight: 800, color: '#111827', background: '#fef9c3', padding: '2px 8px', borderRadius: '6px', fontFamily: 'monospace' }}>
                          "{k.keyword}"
                        </span>
                        <span style={{ fontSize: '0.68rem', fontWeight: 700, background: colors.bg, color: colors.tag, border: `1px solid ${colors.border}`, padding: '2px 8px', borderRadius: '999px', textTransform: 'uppercase', letterSpacing: '0.04em', whiteSpace: 'nowrap' }}>
                          {k.category}
                        </span>
                      </div>
                      <p style={{ margin: '0 0 10px', color: '#4b5563', fontSize: '0.85rem', lineHeight: 1.55 }}>
                        {k.hint}
                      </p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                    {k.services.map(s => (
                      <span key={s} style={{ fontSize: '0.75rem', fontWeight: 600, background: colors.bg, color: colors.text, padding: '3px 9px', borderRadius: '6px', border: `1px solid ${colors.border}` }}>
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
              <p>No keywords match your search. Try "cache", "WAF", "latency" or "cost".</p>
            </div>
          )}

        </div>
      </div>
    </Layout>
  )
}
