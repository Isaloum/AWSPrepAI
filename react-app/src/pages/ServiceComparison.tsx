import { useState } from 'react'
import Layout from '../components/Layout'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'

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
      {
        a: 'Lambda', b: 'EC2 Auto Scaling',
        aFull: 'AWS Lambda', bFull: 'EC2 Auto Scaling Group',
        aSummary: 'Serverless — scales to thousands of concurrent executions in seconds',
        bSummary: 'Provision new EC2 instances — scaling takes 2-5 minutes to complete',
        chooseA: ['Handle sudden traffic burst within seconds (not minutes)', 'Short-duration workloads (max 15 minutes per execution)', 'Event-driven: API calls, S3 uploads, SQS messages, DynamoDB streams', 'Zero idle cost — pay only for actual execution time'],
        chooseB: ['Long-running workloads exceeding Lambda 15-minute limit', 'Need persistent state, large memory, or specific OS configuration', 'Cost optimization at scale: Reserved Instances cheaper than Lambda at sustained high load', 'Applications requiring full OS control or custom runtimes'],
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
      {
        a: 'S3 Transfer Acceleration', b: 'Cross-Region Replication',
        aFull: 'S3 Transfer Acceleration', bFull: 'S3 Cross-Region Replication (CRR)',
        aSummary: 'Speed up uploads to a single S3 bucket from anywhere via CloudFront edge',
        bSummary: 'Automatically copy objects to a bucket in another region after upload',
        chooseA: ['Global users need to upload large files to a single S3 bucket quickly', 'Reduce upload time by routing through CloudFront edge locations', 'Fastest aggregation of data from global locations into one region'],
        chooseB: ['Need objects automatically available in another region for compliance or DR', 'Reduce cross-region read latency by keeping a copy closer to readers', 'Disaster recovery: objects automatically replicated to backup region (15-min SLA with S3 RTC)'],
      },
      {
        a: 'File Gateway', b: 'Tape Gateway',
        aFull: 'Storage Gateway — File Gateway', bFull: 'Storage Gateway — Tape Gateway',
        aSummary: 'NFS/SMB file interface → S3 with local cache for low-latency access',
        bSummary: 'Virtual tape library → S3/Glacier for backup software integration',
        chooseA: ['On-premises apps need to store files in S3 via NFS or SMB protocol', 'Require local cache to reduce data egress charges and provide low-latency access', 'Hybrid file sharing: on-prem staff access files locally, stored durably in S3', 'Files must be accessible via SMB — use File Gateway, not Tape Gateway'],
        chooseB: ['Existing backup software uses tape library interface (iSCSI VTL)', 'Replace physical tape infrastructure with virtual tapes backed by S3 and Glacier', 'Cost-effective long-term backup — tapes automatically archived to Glacier', 'Note: Tape Gateway does NOT provide local cache or immediate file access'],
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
      {
        a: 'Aurora Reader Endpoint', b: 'Aurora Custom Endpoint',
        aFull: 'Aurora Reader Endpoint', bFull: 'Aurora Custom Endpoint',
        aSummary: 'Load-balances reads across ALL Aurora Replicas — no differentiation by capacity',
        bSummary: 'Routes to a SPECIFIC SUBSET of replicas you define — by size, config, or role',
        chooseA: ['Simple read scaling where all replicas are the same instance size', 'Want automatic load balancing across all available read replicas', 'No need to differentiate between production reads and reporting queries'],
        chooseB: ['Cluster has replicas of different sizes (e.g., r5.4xlarge for prod, r5.large for reports)', 'Route production traffic to high-capacity instances and reporting to low-capacity', 'Aurora does NOT do this automatically — you must create custom endpoints explicitly'],
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
      {
        a: 'CloudWatch Default Metrics', b: 'CloudWatch Custom Metrics',
        aFull: 'CloudWatch Default EC2 Metrics', bFull: 'CloudWatch Custom Metrics (Agent)',
        aSummary: 'Built-in EC2 metrics from hypervisor — CPU, network, disk I/O ops',
        bSummary: 'Additional metrics requiring CloudWatch Agent — memory, disk space, logs',
        chooseA: ['Monitoring CPU utilization, network in/out, or disk read/write operations', 'No agent installation needed — metrics appear automatically for EC2 instances', 'Standard infrastructure monitoring that does not require OS-level visibility'],
        chooseB: ['Need memory utilization — NOT available by default, must install CloudWatch Agent', 'Disk space utilization, disk swap, page file — all require the agent', 'Collect application logs from inside EC2 instances', 'Install CloudWatch Agent on both Linux and Windows EC2 instances'],
      },
      {
        a: 'CloudWatch', b: 'RDS Enhanced Monitoring',
        aFull: 'Amazon CloudWatch (RDS Metrics)', bFull: 'RDS Enhanced Monitoring',
        aSummary: 'Hypervisor-level RDS metrics — CPU utilization of the instance as a whole',
        bSummary: 'OS-agent metrics — per-process and per-thread CPU/memory on the DB host',
        chooseA: ['Standard RDS monitoring: CPU%, memory%, storage, connections, IOPS', 'Setting alarms on high-level DB instance metrics', 'No requirement to see per-process breakdown'],
        chooseB: ['Need to see which specific database process or thread is consuming CPU', 'Granular OS-level visibility: memory per process, CPU per thread', 'Troubleshoot DB performance at the process level — not just the instance level', 'Data stored in CloudWatch Logs (RDSOSMetrics group), not standard CloudWatch metrics'],
      },
    ],
  },
  {
    group: 'Identity & Federation', icon: '🪪',
    comparisons: [
      {
        a: 'AD Connector', b: 'Simple AD',
        aFull: 'AWS Directory Service AD Connector', bFull: 'AWS Directory Service Simple AD',
        aSummary: 'Proxy gateway — redirects auth to your existing on-premises Active Directory',
        bSummary: 'Standalone LDAP directory in AWS — no on-premises AD required',
        chooseA: ['Company already has an on-premises Active Directory', 'Want AWS services to authenticate against existing corporate AD credentials', 'Need to redirect auth without replicating or storing directory data in AWS', 'Granting AWS Console/EC2 access to employees using existing corporate usernames'],
        chooseB: ['No existing on-premises AD — need a new directory in AWS', 'Smaller organizations needing basic Active Directory-compatible features', 'Development/test environments needing an LDAP directory without on-prem dependency', 'Subset of AD features: user accounts, groups, Kerberos SSO, but not full Microsoft AD'],
      },
      {
        a: 'SAML 2.0 + AD FS', b: 'Web Identity Federation',
        aFull: 'SAML 2.0 Federation (AD FS)', bFull: 'Web Identity Federation (Cognito)',
        aSummary: 'Corporate SSO — employees use on-premises AD credentials to access AWS',
        bSummary: 'App user auth — end users sign in with Google, Facebook, Amazon, or Cognito',
        chooseA: ['Corporate employees need AWS Console or API access using company credentials', 'Identity provider is Microsoft Active Directory with AD FS', 'Federated single sign-on for internal workforce accessing AWS resources', 'Compliance: centralize authentication in existing corporate IdP'],
        chooseB: ['Mobile or web app users authenticating via social login (Google, Facebook)', 'Consumer-facing applications where users create their own accounts', 'Need to grant app users temporary AWS credentials to access S3/DynamoDB directly', 'Amazon Cognito is the AWS-native Web Identity Federation service'],
      },
      {
        a: 'Organizations', b: 'RAM',
        aFull: 'AWS Organizations', bFull: 'AWS Resource Access Manager (RAM)',
        aSummary: 'Account management — consolidate billing, enforce SCPs across all accounts',
        bSummary: 'Resource sharing — share specific AWS resources across accounts without duplicating',
        chooseA: ['Centrally manage multiple AWS accounts under one organization', 'Apply Service Control Policies (SCPs) to restrict what accounts can do', 'Consolidated billing across all accounts', 'Create Organizational Units (OUs) for account grouping'],
        chooseB: ['Share Transit Gateways, VPC subnets, or License Manager configs across accounts', 'Avoid duplicating the same resource in every account', 'Grant specific cross-account resource access without full account management', 'Organizations + RAM together: Organizations consolidates, RAM shares resources within it'],
      },
    ],
  },
  {
    group: 'Encryption', icon: '🔐',
    comparisons: [
      {
        a: 'SSE-S3', b: 'SSE-KMS',
        aFull: 'Server-Side Encryption with S3 Keys (SSE-S3)', bFull: 'Server-Side Encryption with KMS (SSE-KMS)',
        aSummary: 'AWS manages keys entirely — automatic, free, no audit trail',
        bSummary: 'Customer or AWS managed KMS key — audit trail in CloudTrail, key policy control',
        chooseA: ['Need encryption at rest with zero management overhead', 'No compliance requirement for key audit logs or rotation control', 'Default encryption for S3 buckets where key control is not required'],
        chooseB: ['Compliance requires audit log of who accessed which encrypted object (CloudTrail logs KMS calls)', 'Need to disable or rotate the encryption key to immediately revoke access', 'Customer Managed Key (CMK): full control over key policy, rotation, and cross-account sharing'],
      },
      {
        a: 'Client-Side (Client Master Key)', b: 'Client-Side (KMS Key)',
        aFull: 'Client-Side Encryption with Client Master Key', bFull: 'Client-Side Encryption with KMS Key',
        aSummary: 'Your key and unencrypted data NEVER reach AWS — full local control',
        bSummary: 'Your code encrypts data locally, but sends the KMS KeyId to AWS to generate data key',
        chooseA: ['Compliance: master key must NEVER be sent to or stored in AWS', 'Both unencrypted data AND master key must stay on-premises', 'Strictest data sovereignty requirements — you manage key lifecycle entirely'],
        chooseB: ['Want client-side encryption benefits with KMS key management (rotation, CloudTrail)', 'Unencrypted data never reaches S3, but AWS KMS generates and manages the data key', 'Easier key management than self-managing a client master key'],
      },
      {
        a: 'KMS CMK', b: 'KMS Custom Key Store (CloudHSM)',
        aFull: 'KMS Customer Managed Key (CMK)', bFull: 'KMS Custom Key Store + CloudHSM',
        aSummary: 'You control key policy and rotation — AWS stores key material in AWS HSMs',
        bSummary: 'Your CloudHSM cluster stores key material — AWS never accesses your HSM',
        chooseA: ['Need control over key policy, rotation schedule, and cross-account access', 'Audit key usage via CloudTrail — each KMS API call is logged', 'Standard compliance requirements met by AWS-managed HSM infrastructure'],
        chooseB: ['Regulation prohibits AWS from having ANY access to key material', 'Need to independently audit HSM operations outside of CloudTrail', 'Single-tenant HSM hardware required for compliance (FIPS 140-2 Level 3)', 'Ability to immediately destroy key material by deleting CloudHSM cluster'],
      },
    ],
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// AIF-C01 COMPARISONS — AI Practitioner Exam
// ═══════════════════════════════════════════════════════════════════════════════
const AIF_DATA: Group[] = [
  {
    group: 'Model Adaptation', icon: '🧬',
    comparisons: [
      {
        a: 'Prompting', b: 'Fine-tuning',
        aFull: 'Prompt Engineering', bFull: 'Fine-tuning',
        aSummary: 'Craft inputs to guide FM output — no model changes, no training cost, instant iteration',
        bSummary: 'Update FM weights on your labeled dataset — specializes the model for your domain',
        chooseA: [
          'Fastest and cheapest first approach — start here before considering fine-tuning',
          'Task can be solved with zero-shot or few-shot examples embedded in the prompt',
          'Knowledge changes frequently — dynamic content belongs in RAG, not baked into weights',
          'Limited labeled training data — prompting works without examples (zero-shot)',
        ],
        chooseB: [
          'Model consistently underperforms even after extensive prompt engineering',
          'Need to instill a specific writing style, tone, or domain vocabulary into the model itself',
          'Large volume of high-quality labeled input-output pairs available for training',
          'Repeated task at scale — fine-tuned model may need shorter prompts, reducing token cost',
        ],
      },
      {
        a: 'RAG', b: 'Fine-tuning',
        aFull: 'Retrieval Augmented Generation (RAG)', bFull: 'Fine-tuning',
        aSummary: 'Retrieve external facts at inference time and inject into context — no model changes',
        bSummary: 'Bake domain knowledge into model weights through additional training on your data',
        chooseA: [
          'Knowledge base changes frequently — RAG reads current documents at inference time',
          'Answers must be grounded in specific source documents with traceability',
          'Primary goal is reducing hallucination — RAG provides verified facts per query',
          'Faster and cheaper: no training job, no GPU cost, update knowledge by updating docs',
        ],
        chooseB: [
          'Need the model to reason differently, not just access more facts',
          'Task requires a specific output format or response style baked into model behavior',
          'Latency is critical — RAG adds retrieval time; fine-tuned model responds directly',
          'Domain terminology so specialized that the base model fundamentally misunderstands queries',
        ],
      },
      {
        a: 'Foundation Model', b: 'Traditional ML',
        aFull: 'Foundation Model (FM)', bFull: 'Traditional ML Model',
        aSummary: 'Large pre-trained model adaptable to many tasks via prompting or fine-tuning',
        bSummary: 'Task-specific model trained from scratch on labeled data for one well-defined problem',
        chooseA: [
          'Need to handle diverse, open-ended tasks: text generation, Q&A, summarization, code',
          'Limited labeled training data — FMs generalize well with few-shot prompting',
          'Rapid deployment needed — no full ML pipeline development required',
          'Unstructured data (text, images) where FMs have a proven advantage',
        ],
        chooseB: [
          'Narrow, well-defined task with abundant labeled structured/tabular training data',
          'Strict cost or latency constraints — traditional models (XGBoost, linear) are orders of magnitude smaller',
          'Interpretability required — decision trees and linear models are more explainable than LLMs',
          'Tabular data: gradient boosting (XGBoost, LightGBM) consistently outperforms LLMs',
        ],
      },
    ],
  },
  {
    group: 'Generative AI Services', icon: '✨',
    comparisons: [
      {
        a: 'Bedrock', b: 'JumpStart',
        aFull: 'Amazon Bedrock', bFull: 'SageMaker JumpStart',
        aSummary: 'Serverless FM API — pay per token, zero infrastructure, multi-provider model catalog',
        bSummary: 'Deploy and fine-tune open-source FMs on SageMaker endpoints you own and manage',
        chooseA: [
          'Need serverless, pay-per-token access with zero infrastructure management',
          'Want proprietary FMs: Anthropic Claude, Amazon Titan, Stability AI via managed API',
          'Need built-in RAG (Knowledge Bases), Agents, or Guardrails out of the box',
          'Customer data privacy: prompts and completions never used to train base models',
        ],
        chooseB: [
          'Need full control: specific instance type, VPC placement, or custom scaling config',
          'Deploying open-source models (Llama, Mistral) with reserved capacity for cost optimization',
          'Workload is high-volume and predictable — reserved endpoint cheaper than per-token billing',
          'Need to run inference in a region or compliance boundary not supported by Bedrock',
        ],
      },
      {
        a: 'Knowledge Bases', b: 'Bedrock Agents',
        aFull: 'Bedrock Knowledge Bases', bFull: 'Amazon Bedrock Agents',
        aSummary: 'Managed RAG pipeline — retrieve relevant context from your docs and generate grounded answers',
        bSummary: 'Agentic framework — plan and execute multi-step tasks autonomously using tools and APIs',
        chooseA: [
          'Use case is retrieve-and-answer: find the right document, then respond with grounded facts',
          'Reducing hallucination is the primary goal — inject verified context before generation',
          'Simpler implementation: no tool integration, no multi-step orchestration needed',
          'Q&A over company documents: policies, manuals, FAQs, product documentation',
        ],
        chooseB: [
          'Task requires multiple steps: query a database, call an API, then compose a response',
          'Need the FM to take actions — not just answer questions, but create, update, or trigger things',
          'Workflow involves the model reasoning about what to do next based on intermediate results',
          'Agents can use Knowledge Bases as one of their tools when they need both retrieval and action',
        ],
      },
      {
        a: 'Amazon Q Business', b: 'Amazon Kendra',
        aFull: 'Amazon Q Business', bFull: 'Amazon Kendra',
        aSummary: 'Conversational enterprise assistant — Q&A, summarization, and actions on company data',
        bSummary: 'Intelligent enterprise search — retrieves precise answers and passages from documents',
        chooseA: [
          'Users need a conversational interface: ask follow-up questions, get AI-generated summaries',
          'Require the assistant to take actions based on answers (create tickets, send emails)',
          'Want a fully managed solution without building a custom RAG pipeline',
          'Need to combine document retrieval with generative summarization in one product',
        ],
        chooseB: [
          'Primary need is precision document retrieval — users expect source document links',
          'Integrating search capability into an existing application via Kendra API',
          'Need exact passage extraction from highly regulated documents (legal, compliance)',
          'Kendra GenAI Edition combines Kendra search with Bedrock when you need both',
        ],
      },
    ],
  },
  {
    group: 'Pre-built AI Services', icon: '🤖',
    comparisons: [
      {
        a: 'Rekognition', b: 'Comprehend',
        aFull: 'Amazon Rekognition', bFull: 'Amazon Comprehend',
        aSummary: 'Computer vision — analyzes images and video for objects, faces, scenes, and text',
        bSummary: 'Natural language processing — extracts entities, sentiment, and topics from text',
        chooseA: [
          'Input data is images or video (JPEG, PNG, MP4, or live streams)',
          'Need to detect faces, objects, scenes, labels, PPE, or unsafe visual content',
          'Text embedded within images (license plates, signs) — use Rekognition DetectText',
          'Identity verification, content moderation, or surveillance on visual media',
        ],
        chooseB: [
          'Input data is plain text (reviews, support tickets, social media, clinical notes)',
          'Need sentiment analysis, entity extraction, key phrases, PII detection, or topic modeling',
          'Classify text into custom categories or identify domain-specific named entities',
          'Clinical/medical text: use Comprehend Medical (HIPAA eligible, trained on medical terminology)',
        ],
      },
      {
        a: 'Transcribe', b: 'Polly',
        aFull: 'Amazon Transcribe', bFull: 'Amazon Polly',
        aSummary: 'Speech-to-text — converts audio recordings or live audio streams into written text',
        bSummary: 'Text-to-speech — converts written text into natural-sounding spoken audio output',
        chooseA: [
          'Converting recorded meetings, calls, interviews, or podcasts to text transcripts',
          'Generating subtitles or closed captions from video content for accessibility',
          'Analyzing call center recordings: speaker diarization, sentiment, issue categorization',
          'Medical transcription of clinical consultations — use Transcribe Medical (HIPAA eligible)',
        ],
        chooseB: [
          'Adding voice output to an application, chatbot, or voice assistant',
          'Generating audio versions of articles, learning content, or notifications',
          'Building accessibility features: text-to-audio for visually impaired users',
          'IVR (Interactive Voice Response) systems that read dynamic prompts to callers',
        ],
      },
      {
        a: 'Textract', b: 'Comprehend',
        aFull: 'Amazon Textract', bFull: 'Amazon Comprehend',
        aSummary: 'Document processing — extracts structured data, forms, and tables from PDFs and images',
        bSummary: 'Text analytics — analyzes plain text for sentiment, entities, and classification',
        chooseA: [
          'Input is a scanned document, PDF, or image containing forms, fields, or tables',
          'Need to extract key:value pairs (e.g., "Invoice Date: 2026-01-15") from documents',
          'Digitizing structured paperwork: tax forms, medical records, contracts, invoices',
          'Preserving table structure from documents for downstream structured data processing',
        ],
        chooseB: [
          'Input is already extracted plain text requiring deeper NLP analysis',
          'Need sentiment, entity recognition, classification, or PII detection on text content',
          'Typical pipeline: Textract extracts text from documents → Comprehend analyzes the extracted text',
          'Detecting PII or medical entities in text strings (not embedded in scanned images)',
        ],
      },
      {
        a: 'Kendra', b: 'Lex',
        aFull: 'Amazon Kendra', bFull: 'Amazon Lex',
        aSummary: 'Intelligent search — finds precise answers in documents using NL question understanding',
        bSummary: 'Conversational AI — structured chatbot with intent recognition and slot filling',
        chooseA: [
          'Users ask open-ended questions and need answers retrieved from large document repositories',
          'No predefined conversation flow — queries are exploratory and knowledge retrieval-focused',
          'Integrate search into an existing portal or application via API',
          'Enterprise search over wikis, manuals, policies — users want source document access',
        ],
        chooseB: [
          'Need a structured conversation flow with defined intents and data slots to collect',
          'Building a task-completion chatbot: book appointment, check order status, reset password',
          'Integrating with Amazon Connect for automated contact center call handling',
          'Users follow predictable dialogue paths: identify intent → gather required parameters → fulfill',
        ],
      },
    ],
  },
  {
    group: 'ML Development', icon: '🔬',
    comparisons: [
      {
        a: 'Real-Time Endpoint', b: 'Batch Transform',
        aFull: 'SageMaker Real-Time Endpoint', bFull: 'SageMaker Batch Transform',
        aSummary: 'Always-on inference endpoint — returns predictions immediately for individual requests',
        bSummary: 'Offline batch job — processes large datasets and writes prediction outputs to S3',
        chooseA: [
          'Users or applications need predictions instantly: fraud detection, product recommendations',
          'Low-latency requirement: response expected in milliseconds to seconds per request',
          'Real-time interactive application where waiting is unacceptable (e.g., live recommendation engine)',
          'Streaming use case: each incoming event must be scored immediately upon arrival',
        ],
        chooseB: [
          'Need to score millions of records on a schedule — nightly batch, weekly re-scoring',
          'No real-time latency requirement — results can be computed in advance and stored',
          'Cost-effective: no idle endpoint cost; pay only for compute during the batch job itself',
          'Pre-compute recommendations overnight, score batch of loan applications, bulk image analysis',
        ],
      },
      {
        a: 'SageMaker Clarify', b: 'Model Monitor',
        aFull: 'Amazon SageMaker Clarify', bFull: 'Amazon SageMaker Model Monitor',
        aSummary: 'Pre-deployment analysis — detects bias in training data and models, explains predictions',
        bSummary: 'Post-deployment monitoring — continuously tracks drift, bias, and quality in production',
        chooseA: [
          'Detect bias in training data before any model is trained (class imbalance, label bias)',
          'Measure output fairness across demographic groups in a trained model before deployment',
          'Generate SHAP-based explanations of individual predictions for regulatory review or audits',
          'Part of the model development process — bias report required before deployment approval',
        ],
        chooseB: [
          'Model is already deployed and you need continuous automated quality assurance',
          'Alert when production data distribution diverges significantly from training baseline',
          'Track whether model accuracy degrades over time as real-world conditions evolve',
          'Monitor bias drift and feature attribution drift to catch silent model failures',
        ],
      },
    ],
  },
  {
    group: 'Responsible AI', icon: '⚖️',
    comparisons: [
      {
        a: 'Guardrails', b: 'Prompt Safety',
        aFull: 'Amazon Bedrock Guardrails', bFull: 'Prompt-based Safety Instructions',
        aSummary: 'Enforced safety layer applied at inference — auditable, model-agnostic, cannot be bypassed',
        bSummary: 'Safety instructions embedded in the system prompt — flexible but bypassable by users',
        chooseA: [
          'Need enforceable, auditable safety controls — Guardrails produce CloudWatch logs per block',
          'Compliance requirement: demonstrate content filtering with documented audit trail',
          'Automatically redact PII/PHI from all FM responses regardless of what users request',
          'Block specific denied topics (competitor names, legal advice) as a hard organizational policy',
        ],
        chooseB: [
          'Lightweight guidance sufficient for low-risk, internal prototyping or research use',
          'Need per-interaction flexibility to adjust safety tone without reconfiguring infrastructure',
          'Early-stage development where enforcement overhead is premature',
          'Critical note: prompt safety can be bypassed by determined users — always use Guardrails in production',
        ],
      },
      {
        a: 'Amazon A2I', b: 'Ground Truth',
        aFull: 'Amazon Augmented AI (A2I)', bFull: 'AWS Ground Truth',
        aSummary: 'Human review of live model predictions — routes low-confidence outputs to reviewers',
        bSummary: 'Human data labeling — creates annotated training datasets for ML model development',
        chooseA: [
          'Model is in production and humans must review uncertain or high-stakes predictions',
          'Regulatory requirement for human oversight of AI decisions in real time (financial, medical)',
          'Low-confidence Textract extractions or Rekognition moderation flags need human verification',
          'Building a quality assurance loop into your live AI pipeline with configurable thresholds',
        ],
        chooseB: [
          'Building a new model that needs labeled training data — labeling happens before training',
          'Creating image bounding boxes, text classifications, or transcription annotations at scale',
          'Active learning: Ground Truth auto-labels high-confidence items, humans label the uncertain ones',
          'Generating the ground truth dataset — not reviewing live production predictions',
        ],
      },
    ],
  },
]

const SAA_GROUP_COLORS: Record<string, { border: string; bg: string; text: string }> = {
  Compute:               { border: '#3b82f6', bg: '#eff6ff', text: '#1d4ed8' },
  Storage:               { border: '#10b981', bg: '#f0fdf4', text: '#065f46' },
  Database:              { border: '#8b5cf6', bg: '#f5f3ff', text: '#5b21b6' },
  Messaging:             { border: '#f59e0b', bg: '#fffbeb', text: '#92400e' },
  Networking:            { border: '#6366f1', bg: '#eef2ff', text: '#3730a3' },
  Security:              { border: '#ef4444', bg: '#fef2f2', text: '#991b1b' },
  Monitoring:            { border: '#06b6d4', bg: '#ecfeff', text: '#0e7490' },
  'Identity & Federation': { border: '#7c3aed', bg: '#faf5ff', text: '#5b21b6' },
  'Encryption':            { border: '#dc2626', bg: '#fef2f2', text: '#991b1b' },
}

const AIF_GROUP_COLORS: Record<string, { border: string; bg: string; text: string }> = {
  'Model Adaptation':        { border: '#7c3aed', bg: '#faf5ff', text: '#5b21b6' },
  'Generative AI Services':  { border: '#2563eb', bg: '#eff6ff', text: '#1d4ed8' },
  'Pre-built AI Services':   { border: '#ea580c', bg: '#fff7ed', text: '#9a3412' },
  'ML Development':          { border: '#0891b2', bg: '#ecfeff', text: '#0e7490' },
  'Responsible AI':          { border: '#16a34a', bg: '#f0fdf4', text: '#166534' },
}

export default function ServiceComparison() {
  const { isPremium } = useAuth()
  const navigate = useNavigate()
  const [activeGroup, setActiveGroup] = useState('All')
  const [expanded, setExpanded] = useState<string | null>(null)
  const [cert, setCert] = useState<'saa' | 'aif'>('saa')

  if (!isPremium) {
    return (
      <Layout>
        <div style={{ minHeight: '70vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem', textAlign: 'center' }}>
          <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>🔒</div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#111827', marginBottom: '0.5rem' }}>Study Tools are for members only</h2>
          <p style={{ color: '#6b7280', maxWidth: '420px', lineHeight: 1.6, marginBottom: '1.5rem' }}>
            Upgrade to any paid plan to unlock Service Comparisons, Keywords, CheatSheets, and more.
          </p>
          <button onClick={() => navigate('/pricing')} style={{ padding: '12px 28px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 700, cursor: 'pointer', fontSize: '1rem' }}>
            See Plans →
          </button>
        </div>
      </Layout>
    )
  }

  const activeData = cert === 'saa' ? DATA : AIF_DATA
  const activeColors = cert === 'saa' ? SAA_GROUP_COLORS : AIF_GROUP_COLORS
  const groups = ['All', ...activeData.map(g => g.group)]
  const filtered = activeGroup === 'All' ? activeData : activeData.filter(g => g.group === activeGroup)
  const totalPairs = activeData.reduce((acc, g) => acc + g.comparisons.length, 0)

  return (
    <Layout>
      {/* Hero */}
      <div style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%)', padding: '3rem 2rem 2.5rem', textAlign: 'center', borderBottom: '1px solid #1e3a5f' }}>
        <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>⚖️</div>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#f8fafc', marginBottom: '0.5rem' }}>
          Service Comparisons
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '0.95rem', maxWidth: '520px', margin: '0 auto 0.75rem' }}>
          {totalPairs} side-by-side comparisons across {activeData.length} groups — the most-tested "X vs Y" questions on the {cert === 'saa' ? 'SAA-C03' : 'AIF-C01'} exam.
        </p>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.25)', borderRadius: '999px', padding: '4px 14px', fontSize: '0.75rem', fontWeight: 700, color: '#4ade80', marginBottom: '1.25rem' }}>
          ✅ Derived from AWS official documentation and exam guide objectives
        </div>

        {/* Cert Switcher */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '1.5rem' }}>
          {([
            { id: 'saa', label: '☁️ SAA-C03' },
            { id: 'aif', label: '🤖 AIF-C01' },
          ] as const).map(c => (
            <button
              key={c.id}
              onClick={() => { setCert(c.id); setActiveGroup('All'); setExpanded(null) }}
              style={{
                padding: '9px 26px', borderRadius: '12px', fontWeight: 700, fontSize: '0.88rem', cursor: 'pointer', transition: 'all 0.15s',
                border: cert === c.id ? 'none' : '1px solid rgba(255,255,255,0.25)',
                background: cert === c.id ? '#fff' : 'rgba(255,255,255,0.08)',
                color: cert === c.id ? '#0f172a' : '#94a3b8',
                boxShadow: cert === c.id ? '0 4px 12px rgba(0,0,0,0.3)' : 'none',
              }}
            >{c.label}</button>
          ))}
        </div>

        {/* Group filter */}
        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          {groups.map(g => {
            const color = activeColors[g]
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
                {activeData.find(d => d.group === g)?.icon ?? '🔍'} {g}
              </button>
            )
          })}
        </div>
      </div>

      <div style={{ maxWidth: '920px', margin: '0 auto', padding: '2.5rem 1.5rem' }}>
        {filtered.map(group => {
          const gc = activeColors[group.group] ?? { border: '#3b82f6', bg: '#eff6ff', text: '#1d4ed8' }
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
            These comparisons appear in every AWS exam. Practice questions to lock them in.
          </p>
          <a href={cert === 'saa' ? '/cert/saa-c03' : '/cert/aif-c01'} style={{ display: 'inline-block', padding: '0.75rem 2rem', background: '#2563eb', color: '#fff', borderRadius: '0.75rem', fontWeight: 700, textDecoration: 'none', fontSize: '0.95rem' }}>
            Practice {cert === 'saa' ? 'SAA-C03' : 'AIF-C01'} Questions →
          </a>
        </div>
      </div>
    </Layout>
  )
}
