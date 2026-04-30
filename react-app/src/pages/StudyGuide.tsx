import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import { useAuth } from '../contexts/AuthContext'
import { getMonthlyCert, getBundleCerts } from '../lib/db'

interface Domain {
  name: string
  weight: number
  color: string
  border: string
  focus: string[]
  traps: string[]
  greenFlags: string[]
}

interface CertGuide {
  id: string
  code: string
  name: string
  icon: string
  questions: number
  domains: Domain[]
  correct: string[]
  wrong: string[]
}

const CERT_GUIDES: CertGuide[] = [
  {
    id: 'saa-c03',
    code: 'SAA-C03',
    name: 'Solutions Architect Associate',
    icon: '🏗️',
    questions: 1050,
    domains: [
      {
        name: 'Design Secure Architectures',
        weight: 30,
        color: '#dbeafe',
        border: '#3b82f6',
        focus: [
          'IAM roles vs users + permissions boundary + SCPs',
          'Encryption SSE-KMS vs SSE-S3 vs in-transit',
          'VPC: NACLs vs Security Groups + PrivateLink + VPC endpoints',
          'Cognito User Pools for API Gateway auth',
          'CloudTrail auditing + GuardDuty threats + Macie sensitive data',
        ],
        traps: [
          'SSE-S3 vs SSE-KMS — KMS = customer-controlled key rotation',
          'NACLs are stateless; Security Groups are stateful',
          'Gateway endpoints (S3+DynamoDB only) are FREE; Interface endpoints cost per hour',
          'Permissions Boundary = max ceiling not a grant',
        ],
        greenFlags: ['Least privilege', 'Managed encryption', 'Private endpoints over internet'],
      },
      {
        name: 'Design Resilient Architectures',
        weight: 26,
        color: '#dcfce7',
        border: '#22c55e',
        focus: [
          'Multi-AZ vs Multi-Region trade-offs',
          'RDS Multi-AZ (failover) vs Read Replica (read scaling)',
          'Aurora Global Database for multi-region + reader endpoint for replicas',
          'S3 Versioning + MFA delete + Batch Replication for existing objects',
          'SQS FIFO: .fifo suffix + 3000 msg/s with batching + can\'t convert standard→FIFO',
        ],
        traps: [
          'CRR only replicates NEW objects — use S3 Batch Replication for existing',
          'Snowball → S3 first THEN lifecycle to Glacier (can\'t go directly)',
          'Launch Configuration is legacy — always use Launch Template for mixed Spot/On-Demand',
          'SQS FIFO queue: must delete and recreate to convert from standard',
        ],
        greenFlags: ['Multi-AZ deployments', 'Managed failover', 'Decoupled with SQS/SNS'],
      },
      {
        name: 'Design High-Performing Architectures',
        weight: 24,
        color: '#fef9c3',
        border: '#eab308',
        focus: [
          'Caching: ElastiCache in front of RDS + DAX for DynamoDB + CloudFront for S3',
          'Kinesis Data Streams vs Firehose: custom processing vs managed delivery',
          'Global Accelerator: static IPs + anycast routing + blue-green without DNS TTL issues',
          'Placement groups: Cluster (HPC) vs Spread (max 7/AZ) vs Partition (Hadoop/Kafka)',
          'ECS Fargate vs EC2: Fargate = pay per vCPU/memory + no cluster management',
        ],
        traps: [
          'Kinesis Enhanced Fan-Out = 2 MB/s per consumer (not shared 2 MB/s)',
          'Global Accelerator ≠ CloudFront — GA is for TCP/UDP (gaming IoT blue-green)',
          'Cluster placement group: all instances in ONE AZ — no HA',
          'Spread placement group: max 7 instances per AZ',
        ],
        greenFlags: ['Caching layers', 'Read replicas', 'Managed streaming services'],
      },
      {
        name: 'Design Cost-Optimized Architectures',
        weight: 20,
        color: '#ffedd5',
        border: '#f97316',
        focus: [
          'S3 storage classes: Standard→Standard-IA→One Zone-IA→Glacier — all have 30-day minimums except Standard',
          'EC2: On-Demand→Reserved (1 or 3yr)→Spot (interruptions)→Dedicated Hosts (BYOL)',
          'Compute Optimizer: ML-powered rightsizing for EC2 + Lambda + EBS',
          'Shield Advanced: $3000/month charged ONCE per org with consolidated billing',
          'AWS RAM: share subnets (not entire VPCs) across accounts',
        ],
        traps: [
          'S3 One Zone-IA = 30-day minimum — ideal for reproducible/recreatable data only',
          'Dedicated Hosts (BYOL) vs Dedicated Instances (hardware isolation no BYOL)',
          'Compute Optimizer ≠ Cost Explorer — Optimizer uses ML Explorer shows historical spend',
          'NAT Gateway = managed (no SG) vs NAT Instance = self-managed (has SG)',
        ],
        greenFlags: ['Lifecycle policies', 'Spot for fault-tolerant workloads', 'Reserved for steady-state'],
      },
    ],
    correct: ['Managed AWS services over self-managed', 'Automation over manual processes', 'Multi-AZ for availability', 'Least privilege for security', 'Decoupled architectures (SQS/SNS)'],
    wrong: ['Hardcoded credentials (use IAM roles)', 'Making resources public when private works', 'Over-engineered solutions when simple works', 'Manual processes that can be automated', 'Single-AZ for production workloads'],
  },
  {
    id: 'clf-c02',
    code: 'CLF-C02',
    name: 'Cloud Practitioner',
    icon: '☁️',
    questions: 260,
    domains: [
      {
        name: 'Cloud Technology & Services',
        weight: 34,
        color: '#dbeafe',
        border: '#3b82f6',
        focus: [
          'EC2 instance types + purchasing options (On-Demand Spot Reserved Savings Plans)',
          'S3 storage classes and use cases at a conceptual level',
          'Serverless: Lambda (event-driven) + API Gateway + DynamoDB basics',
          'Global infrastructure: Regions + AZs + Edge Locations + Local Zones',
          'Key services: RDS CloudFront VPC Elastic Beanstalk ECS basics',
        ],
        traps: [
          'Regions vs AZs vs Edge Locations — Edge Locations are for CloudFront NOT compute',
          'Elastic Beanstalk is PaaS (you upload code) not IaaS',
          'Lambda = serverless compute NOT a container service',
          'CloudFront is CDN not just for S3 — works with any HTTP origin',
        ],
        greenFlags: ['Managed services over self-managed', 'Global reach', 'Pay-per-use'],
      },
      {
        name: 'Security & Compliance',
        weight: 30,
        color: '#dcfce7',
        border: '#22c55e',
        focus: [
          'Shared Responsibility Model: AWS manages hardware/network/facilities + you manage OS/apps/data',
          'IAM: users vs groups vs roles vs policies — least privilege always',
          'MFA: virtual (Google Authenticator) vs hardware token',
          'Compliance programs: HIPAA SOC PCI-DSS + AWS Artifact for compliance reports',
          'Encryption: in-transit (SSL/TLS) vs at-rest (KMS S3 SSE)',
        ],
        traps: [
          'AWS is responsible for "security OF the cloud" — you are responsible for "security IN the cloud"',
          'Root account should NEVER be used for daily tasks — create IAM users',
          'IAM policies are DENY by default — must explicitly allow',
          'AWS Artifact is NOT a security tool — it\'s a compliance documentation portal',
        ],
        greenFlags: ['Shared responsibility', 'Least privilege IAM', 'Encryption everywhere'],
      },
      {
        name: 'Cloud Concepts',
        weight: 24,
        color: '#fef9c3',
        border: '#eab308',
        focus: [
          '6 advantages of cloud: Trade CapEx for OpEx + Massive economies of scale + Stop guessing capacity + Increase speed/agility + Stop spending on data centers + Go global in minutes',
          'CapEx (upfront hardware) vs OpEx (pay-as-you-go)',
          'Well-Architected Framework: 6 pillars (Operational Excellence Security Reliability Performance Efficiency Cost Optimization Sustainability)',
          'Cloud deployment models: Public vs Private vs Hybrid',
          'Total Cost of Ownership (TCO) calculator',
        ],
        traps: [
          '"Stop guessing capacity" refers to auto-scaling — not just estimating cost',
          'Economies of scale benefit YOU because AWS passes savings from massive purchasing power',
          'Hybrid cloud ≠ Multi-cloud — hybrid = on-prem + cloud',
          'Well-Architected has 6 pillars not 5 (Sustainability was added)',
        ],
        greenFlags: ['OpEx over CapEx', 'Elasticity', 'Global infrastructure'],
      },
      {
        name: 'Billing, Pricing & Support',
        weight: 12,
        color: '#ffedd5',
        border: '#f97316',
        focus: [
          'Cost Explorer: visualize and analyze spend + forecast',
          'AWS Budgets: set spend alerts before you go over budget',
          'Pricing Calculator: estimate costs BEFORE deploying',
          'Support plans: Basic (free) → Developer → Business → Enterprise',
          'Reserved Instances vs Savings Plans: RI = specific instance type + region; Savings Plans = flexible',
        ],
        traps: [
          'Cost Explorer shows HISTORICAL spend; Budgets alerts on FUTURE spend',
          'AWS Budgets is NOT free — Basic support is free but Budgets has a small cost per budget',
          'Trusted Advisor: free tier gives 7 checks; Business/Enterprise gives all checks',
          'Enterprise support includes TAM (Technical Account Manager) — Business does NOT',
        ],
        greenFlags: ['Reserved capacity for predictable workloads', 'Budget alerts proactively', 'Consolidated billing for multi-account'],
      },
    ],
    correct: ['Use managed services', 'Enable auto-scaling', 'Apply least privilege IAM', 'Tag resources for cost allocation', 'Use multiple AZs'],
    wrong: ['Using root account for daily tasks', 'Ignoring Trusted Advisor recommendations', 'Single-AZ deployments for production', 'No cost budgets or alerts', 'Sharing IAM credentials'],
  },
  {
    id: 'dva-c02',
    code: 'DVA-C02',
    name: 'Developer Associate',
    icon: '👨‍💻',
    questions: 260,
    domains: [
      {
        name: 'Development with AWS Services',
        weight: 32,
        color: '#dbeafe',
        border: '#3b82f6',
        focus: [
          'Lambda: event sources (API Gateway S3 DynamoDB SQS SNS EventBridge) + execution role + environment variables',
          'API Gateway: REST vs HTTP vs WebSocket APIs + integration types (Lambda proxy mock AWS service)',
          'DynamoDB: partition key + sort key design + GSI vs LSI + BatchWriteItem + TransactWriteItems',
          'SQS: standard vs FIFO + visibility timeout + DLQ + long polling vs short polling',
          'Cognito: User Pools (authentication) vs Identity Pools (authorization/AWS credentials)',
        ],
        traps: [
          'Lambda timeout max = 15 minutes NOT unlimited',
          'API Gateway HTTP API is cheaper/faster than REST API but has fewer features',
          'DynamoDB LSI must be defined at table creation — cannot add later',
          'SQS visibility timeout default = 30s — if Lambda takes longer messages reappear',
          'Cognito User Pool ≠ Identity Pool — User Pool is login; Identity Pool is AWS access',
        ],
        greenFlags: ['Serverless-first (Lambda + API Gateway + DynamoDB)', 'Event-driven', 'Managed auth with Cognito'],
      },
      {
        name: 'Security',
        weight: 26,
        color: '#dcfce7',
        border: '#22c55e',
        focus: [
          'IAM roles for Lambda/EC2/ECS — never hardcode credentials in code',
          'Secrets Manager vs Parameter Store: Secrets Manager = auto-rotation + costs more; SSM Parameter Store = free (standard) no auto-rotation',
          'KMS: GenerateDataKey for envelope encryption + grant permissions via key policy + grant',
          'Cognito tokens: ID token (user identity) vs Access token (API scopes) vs Refresh token (get new tokens)',
          'STS AssumeRole: cross-account access + temporary credentials',
        ],
        traps: [
          'Never store credentials in code — use IAM roles or Secrets Manager',
          'KMS key policy MUST explicitly allow root account — otherwise key is locked forever',
          'Cognito Access Token is for authorizing API calls — ID Token is for identity claims',
          'Parameter Store SecureString uses KMS — standard tier is free but 10,000 parameter limit',
        ],
        greenFlags: ['IAM roles over access keys', 'Secrets Manager for rotation', 'KMS envelope encryption'],
      },
      {
        name: 'Deployment',
        weight: 24,
        color: '#fef9c3',
        border: '#eab308',
        focus: [
          'CodePipeline: orchestrates Source→Build→Test→Deploy stages',
          'CodeBuild: managed build service + buildspec.yml + no servers to manage',
          'CodeDeploy: EC2/on-prem (in-place/blue-green) + Lambda (canary/linear/all-at-once) + ECS (blue-green)',
          'Elastic Beanstalk: All-at-once vs Rolling vs Rolling with additional batch vs Immutable vs Blue-Green',
          'SAM (Serverless Application Model): CloudFormation extension for Lambda + transform: AWS::Serverless-2016-10-31',
        ],
        traps: [
          'CodeDeploy appspec.yml = deployment lifecycle hooks (BeforeInstall AfterInstall etc)',
          'Elastic Beanstalk Immutable = new instances (zero downtime but double capacity)',
          'SAM template requires Transform header — it is NOT vanilla CloudFormation',
          'Blue-Green in Beanstalk = separate environment + Route 53 swap (NOT a native deployment type like Rolling)',
        ],
        greenFlags: ['Blue-green for zero-downtime', 'Immutable deployments for safety', 'IaC with SAM/CDK'],
      },
      {
        name: 'Troubleshooting and Optimization',
        weight: 18,
        color: '#ffedd5',
        border: '#f97316',
        focus: [
          'X-Ray: distributed tracing + service map + annotations (indexed) vs metadata (not indexed) + sampling rules',
          'CloudWatch: metrics + alarms + Logs Insights + custom metrics (PutMetricData API)',
          'Lambda optimization: increase memory to improve CPU + provisioned concurrency for cold starts + reserved concurrency for throttling control',
          'DynamoDB optimization: use sparse indexes + avoid hot partitions + enable DAX for read-heavy',
        ],
        traps: [
          'X-Ray annotations are indexed and searchable; metadata is NOT indexed',
          'Lambda reserved concurrency = maximum concurrent executions for that function',
          'CloudWatch Logs Insights uses its own query language (not SQL)',
          'DynamoDB hot partition = too many requests to one partition key — fix with write sharding',
        ],
        greenFlags: ['X-Ray for distributed tracing', 'CloudWatch alarms for proactive monitoring', 'Reserved concurrency to protect downstream systems'],
      },
    ],
    correct: ['Use IAM roles never hardcode credentials', 'Implement X-Ray tracing', 'Use DynamoDB TTL to expire old items', 'SQS dead-letter queues for failed messages', 'Environment variables for configuration'],
    wrong: ['Storing secrets in source code', 'Polling SQS in a tight loop (use long polling)', 'Ignoring DLQ messages', 'Using synchronous Lambda for long tasks', 'Hardcoding region/account IDs in code'],
  },
  {
    id: 'soa-c02',
    code: 'SOA-C02',
    name: 'SysOps Administrator Associate',
    icon: '🔧',
    questions: 260,
    domains: [
      {
        name: 'Monitoring, Logging, and Remediation',
        weight: 20,
        color: '#dbeafe',
        border: '#3b82f6',
        focus: [
          'CloudWatch: metrics + alarms + composite alarms + Logs + Logs Insights + dashboards + anomaly detection',
          'EventBridge: event-driven automation + rules + targets + custom event buses',
          'Systems Manager: Run Command + Patch Manager + Session Manager (no SSH/bastion needed) + Automation documents',
          'CloudTrail: management events vs data events + Insights for unusual API activity',
          'AWS Config: configuration recorder + conformance packs + auto-remediation with SSM',
        ],
        traps: [
          'CloudWatch detailed monitoring = 1-minute intervals (costs extra); basic = 5 minutes free',
          'EventBridge Rule ≠ CloudWatch Alarm — EventBridge reacts to events; CloudWatch reacts to metric thresholds',
          'Session Manager replaces bastion hosts — no open port 22 needed',
          'Config Rules evaluate compliance but do NOT enforce — use auto-remediation for enforcement',
        ],
        greenFlags: ['Automated remediation over manual', 'EventBridge for event-driven ops', 'Systems Manager for fleet management'],
      },
      {
        name: 'Deployment, Provisioning, and Automation',
        weight: 18,
        color: '#dcfce7',
        border: '#22c55e',
        focus: [
          'CloudFormation: stacks + change sets (preview before apply) + stack policies + drift detection + StackSets for multi-account',
          'Elastic Beanstalk: managed platform + .ebextensions for customization + platform updates',
          'EC2 Image Builder: automated AMI creation + testing pipeline + patching',
          'AWS OpsWorks: Chef/Puppet managed + layers + stacks (legacy but tested)',
          'Launch Template vs Launch Configuration: always use Launch Template (supports mixed instances Spot On-Demand)',
        ],
        traps: [
          'CloudFormation change set shows WHAT will change before applying — always use for production',
          'StackSets require delegated admin or management account — not any account',
          'EC2 Image Builder ≠ CodePipeline — Image Builder is specifically for AMI/container image pipelines',
          'Launch Configuration is legacy — cannot be modified, must create new one',
        ],
        greenFlags: ['IaC with CloudFormation', 'Change sets before production changes', 'Automated AMI patching'],
      },
      {
        name: 'Networking and Content Delivery',
        weight: 18,
        color: '#fef9c3',
        border: '#eab308',
        focus: [
          'VPC: CIDR planning + subnets (public vs private) + route tables + internet gateway vs NAT gateway',
          'Route 53: routing policies (Simple Weighted Latency Failover Geolocation Geoproximity Multivalue) + health checks',
          'CloudFront: origins + behaviors + cache policies + OAC (replaces OAI) + Lambda@Edge vs CloudFront Functions',
          'ALB vs NLB vs CLB: ALB = HTTP/HTTPS layer 7; NLB = TCP/UDP layer 4 ultra-low latency; CLB = legacy',
          'VPC Flow Logs: capture accepted/rejected traffic + send to CloudWatch or S3',
        ],
        traps: [
          'NAT Gateway is in public subnet — NOT private subnet',
          'Route 53 Failover requires health checks on primary',
          'OAI is legacy — use OAC for S3 CloudFront origins',
          'NLB preserves source IP; ALB does NOT (use X-Forwarded-For header)',
          'CIDR block cannot be changed after VPC creation — plan carefully',
        ],
        greenFlags: ['Private subnets for backend', 'NAT Gateway for outbound', 'CloudFront for caching'],
      },
      {
        name: 'Security and Compliance',
        weight: 16,
        color: '#f3e8ff',
        border: '#a855f7',
        focus: [
          'IAM: policies (identity-based resource-based) + permission boundaries + service control policies (SCPs)',
          'AWS Config: multi-account compliance + conformance packs for standards (PCI-DSS HIPAA CIS)',
          'Security Hub: aggregates findings from GuardDuty Inspector Macie Config + security score',
          'Inspector: EC2 vulnerability scanning + container image scanning + Lambda function scanning',
          'Trusted Advisor: security checks + cost optimization + performance + fault tolerance + service limits',
        ],
        traps: [
          'SCPs restrict maximum permissions — they do NOT grant permissions',
          'Security Hub REQUIRES AWS Config to be enabled',
          'Inspector needs SSM agent for EC2 deep scanning',
          'Trusted Advisor security checks: full access only with Business or Enterprise support',
        ],
        greenFlags: ['Config for continuous compliance', 'Security Hub for centralized findings', 'SCPs for guardrails'],
      },
      {
        name: 'Reliability and Business Continuity',
        weight: 16,
        color: '#ccfbf1',
        border: '#14b8a6',
        focus: [
          'AWS Backup: centralized backup policy + vault + cross-region/cross-account copy + backup plans',
          'RDS: automated backups (retention 0-35 days) + snapshots (manual unlimited) + Multi-AZ failover + read replicas',
          'Auto Scaling: target tracking vs step scaling vs scheduled scaling + health check grace period + lifecycle hooks',
          'EFS: regional (multi-AZ) vs One Zone + backup + performance modes (General Purpose vs Max I/O)',
          'Elastic Load Balancing: cross-zone load balancing + connection draining (deregistration delay)',
        ],
        traps: [
          'RDS automated backups are deleted when you delete the DB unless you take a final snapshot',
          'ASG health check grace period = time to wait before checking health after launch (set it longer than boot time)',
          'Lifecycle hooks pause instance launch/terminate — use for custom actions (drain connections etc)',
          'EFS Max I/O mode = higher latency but higher throughput (for parallel workloads)',
        ],
        greenFlags: ['Automated backups with retention policy', 'Multi-AZ for HA', 'ASG for self-healing'],
      },
      {
        name: 'Cost and Performance Optimization',
        weight: 12,
        color: '#ffedd5',
        border: '#f97316',
        focus: [
          'Cost Explorer: filter by service/tag/account + reservations utilization report + rightsizing recommendations',
          'Compute Optimizer: EC2 + Lambda + EBS + ECS on Fargate rightsizing using CloudWatch metrics',
          'Trusted Advisor: underutilized EC2 + idle load balancers + low utilization EBS volumes + Reserved Instance recommendations',
          'S3 Intelligent-Tiering: automatic movement between access tiers + no retrieval fee + monitoring fee per object',
          'EC2 Savings Plans vs Reserved Instances: Savings Plans = flexible instance family; RI = specific instance type',
        ],
        traps: [
          'Compute Optimizer requires sufficient CloudWatch metrics history (at least 14 days)',
          'S3 Intelligent-Tiering has a minimum 128KB object size — smaller objects not worth the monitoring fee',
          'Savings Plans apply AFTER Reserved Instances in billing order',
          'Trusted Advisor rightsizing ≠ Compute Optimizer — TA is rule-based; CO uses ML',
        ],
        greenFlags: ['Rightsizing before reserving', 'S3 Intelligent-Tiering for variable access', 'Tag resources for cost allocation'],
      },
    ],
    correct: ['Automate remediation with EventBridge + SSM', 'Use CloudFormation change sets', 'Enable Config for compliance', 'Centralize logging in CloudWatch', 'Use Systems Manager instead of bastion hosts'],
    wrong: ['SSH access with open port 22 (use Session Manager)', 'Manual patching without Patch Manager', 'Applying CloudFormation stacks without change sets', 'Ignoring Trusted Advisor recommendations', 'No backup policy for critical data'],
  },
  {
    id: 'dea-c01',
    code: 'DEA-C01',
    name: 'Data Engineer Associate',
    icon: '📊',
    questions: 260,
    domains: [
      {
        name: 'Data Ingestion and Transformation',
        weight: 34,
        color: '#dbeafe',
        border: '#3b82f6',
        focus: [
          'Kinesis Data Streams: shards + partition keys + retention (24h default up to 365 days) + enhanced fan-out',
          'Kinesis Data Firehose: managed delivery to S3/Redshift/OpenSearch + auto-scaling + no manual shards',
          'AWS Glue: ETL jobs (PySpark/Spark) + crawlers + Data Catalog + Glue Studio visual editor',
          'AWS DMS: homogeneous + heterogeneous migrations + CDC (Change Data Capture) for ongoing replication',
          'MSK (Managed Kafka): fully managed Apache Kafka + MSK Connect for connectors + MSK Serverless',
        ],
        traps: [
          'Kinesis Data Streams = custom processing with consumers; Firehose = managed delivery only (no custom code)',
          'Glue crawler creates/updates Data Catalog — it does NOT transform data',
          'DMS Schema Conversion Tool (SCT) is needed for heterogeneous migrations (different DB engines)',
          'MSK vs Kinesis: MSK = Kafka ecosystem + open source; Kinesis = AWS-native + simpler',
        ],
        greenFlags: ['Firehose for simple delivery', 'Kinesis Streams for custom processing', 'Glue for serverless ETL'],
      },
      {
        name: 'Store and Manage Data',
        weight: 26,
        color: '#dcfce7',
        border: '#22c55e',
        focus: [
          'S3: bucket policies + ACLs (legacy) + versioning + lifecycle rules + storage classes',
          'Redshift: columnar storage + distribution styles (KEY EVEN ALL) + sort keys + Spectrum for S3 queries',
          'Lake Formation: centralized data lake permissions + fine-grained column/row level access + governed tables',
          'Glue Data Catalog: central metadata repository + table definitions + partitions + schema evolution',
          'DynamoDB: single-table design patterns + GSI for query flexibility + streams for change events',
        ],
        traps: [
          'S3 is object storage NOT a database — no in-place updates (upload new version)',
          'Redshift distribution KEY = same key values to same node (good for joins); EVEN = round-robin (good for no joins)',
          'Lake Formation permissions are additive to IAM — most restrictive wins',
          'Glue Data Catalog is shared with Athena EMR Redshift Spectrum — one catalog to rule them all',
        ],
        greenFlags: ['S3 as data lake foundation', 'Redshift for OLAP', 'Lake Formation for governance'],
      },
      {
        name: 'Operate and Support Data Pipelines',
        weight: 22,
        color: '#fef9c3',
        border: '#eab308',
        focus: [
          'Step Functions: orchestrate Lambda + Glue + EMR + retry logic + error handling + Express vs Standard workflows',
          'Amazon MWAA (Managed Airflow): managed Apache Airflow + DAG-based workflows + Python-native',
          'EventBridge: schedule-based + event-based pipeline triggers + rule-based routing',
          'CloudWatch: pipeline metrics + Glue job bookmarks (track processed data) + EMR monitoring',
          'AWS Glue job bookmarks: track what data has already been processed in ETL jobs',
        ],
        traps: [
          'Step Functions Express Workflows = high-volume short-duration; Standard = long-running with audit trail',
          'MWAA is more complex than Step Functions — use Step Functions unless you need full Airflow compatibility',
          'Glue job bookmarks prevent reprocessing but must be enabled explicitly',
          'EventBridge scheduled rules use cron or rate expressions — not human-readable schedules',
        ],
        greenFlags: ['Step Functions for orchestration', 'EventBridge for triggers', 'CloudWatch for pipeline monitoring'],
      },
      {
        name: 'Design and Build Data Models',
        weight: 18,
        color: '#ffedd5',
        border: '#f97316',
        focus: [
          'Data lakehouse vs data warehouse: lakehouse = S3 + Iceberg/Delta + Athena; warehouse = Redshift',
          'Amazon Athena: serverless SQL on S3 + pay per query (per TB scanned) + partition pruning to reduce cost',
          'Redshift schema design: star schema + fact tables + dimension tables + distribution and sort keys',
          'DynamoDB modeling: single-table design + access patterns first + avoid relational thinking',
          'Apache Iceberg on S3: ACID transactions + schema evolution + time travel + supported by Athena EMR Glue',
        ],
        traps: [
          'Athena scans the entire file unless partitioned — always partition by date/region to reduce cost',
          'Redshift COPY command is fastest for bulk load (not INSERT rows one-by-one)',
          'DynamoDB: design the table around access patterns not entities — opposite of SQL thinking',
          'Iceberg time travel queries incur extra S3 read costs',
        ],
        greenFlags: ['Partition data for query efficiency', 'Single-table DynamoDB design', 'Columnar format (Parquet) for analytics'],
      },
    ],
    correct: ['Partition S3 data by date/region', 'Use columnar formats (Parquet ORC) for analytics', 'Enable Glue job bookmarks', 'Use Redshift COPY for bulk loads', 'Design DynamoDB around access patterns'],
    wrong: ['Scanning entire S3 buckets without partitioning', 'Storing analytics data in row-based format', 'Re-processing already-processed data without bookmarks', 'INSERT one-by-one into Redshift (use COPY)', 'Designing DynamoDB like a relational database'],
  },
  {
    id: 'mla-c01',
    code: 'MLA-C01',
    name: 'ML Engineer Associate',
    icon: '🤖',
    questions: 260,
    domains: [
      {
        name: 'Data Preparation for Machine Learning',
        weight: 28,
        color: '#dbeafe',
        border: '#3b82f6',
        focus: [
          'SageMaker Data Wrangler: visual data preparation + 300+ transforms + bias detection + export to pipeline',
          'SageMaker Feature Store: online (real-time) vs offline (batch training) + feature reuse across models',
          'S3 + Glue + Athena for data lake ML pipelines + data versioning with S3 versioning',
          'Data quality: handling missing values (imputation) + outliers + class imbalance (SMOTE oversampling)',
          'Ground Truth: human labeling + automated labeling (semi-supervised) + label quality',
        ],
        traps: [
          'Feature Store online = low-latency real-time inference; offline = batch training — they serve different purposes',
          'Data Wrangler exports to Pipeline/S3/Feature Store — it does NOT train models',
          'Imbalanced datasets: accuracy is misleading — use F1 precision recall AUC-ROC',
          'Ground Truth automated labeling only activates after manual labeling reaches confidence threshold',
        ],
        greenFlags: ['Feature Store for feature reuse', 'Data Wrangler for visual prep', 'Proper train/validation/test split'],
      },
      {
        name: 'ML Model Development',
        weight: 26,
        color: '#dcfce7',
        border: '#22c55e',
        focus: [
          'SageMaker built-in algorithms: XGBoost (tabular) + Linear Learner (regression/classification) + BlazingText (NLP) + DeepAR (time series) + K-Means (clustering)',
          'Hyperparameter tuning: SageMaker Automatic Model Tuning (Bayesian optimization) + warm start (reuse previous tuning jobs)',
          'SageMaker Training: managed instances + spot training (up to 90% cheaper) + checkpointing for spot interruption recovery',
          'Model evaluation: confusion matrix + precision vs recall trade-off + cross-validation + bias/variance trade-off',
          'SageMaker Experiments: track + compare + organize training runs',
        ],
        traps: [
          'XGBoost handles missing values natively — no imputation needed',
          'Spot training requires checkpointing — otherwise interrupted job loses all progress',
          'Overfitting (high variance) = good training accuracy bad validation; Underfitting (high bias) = bad both',
          'Bayesian optimization is smarter than random/grid search for hyperparameter tuning',
        ],
        greenFlags: ['Spot training for cost savings', 'Built-in algorithms before custom', 'Hyperparameter tuning for optimization'],
      },
      {
        name: 'Deployment and Orchestration of ML Workflows',
        weight: 22,
        color: '#fef9c3',
        border: '#eab308',
        focus: [
          'SageMaker endpoints: real-time (persistent) vs serverless (auto-scales to zero) vs async (large payloads) vs batch transform (offline)',
          'SageMaker Pipelines: MLOps CI/CD for ML + DAG of steps (processing training evaluation deployment)',
          'A/B testing with production variants: split traffic between model versions + monitor metrics',
          'MLflow on SageMaker: experiment tracking + model registry + deployment',
          'SageMaker Model Registry: versioning + approval workflow + cross-account deployment',
        ],
        traps: [
          'Serverless inference = cold start latency — not for latency-sensitive real-time',
          'Async inference = queued requests — good for large payloads (up to 1GB) not real-time',
          'Batch transform ≠ async inference — Batch Transform runs on a dataset file; async is still real-time with queuing',
          'Production variants traffic split does NOT require endpoint update — can adjust weights on the fly',
        ],
        greenFlags: ['Serverless inference for variable traffic', 'Batch transform for offline scoring', 'Pipelines for MLOps automation'],
      },
      {
        name: 'ML Solution Monitoring, Maintenance, and Security',
        weight: 24,
        color: '#ffedd5',
        border: '#f97316',
        focus: [
          'SageMaker Model Monitor: data drift + model quality + bias drift + feature attribution drift',
          'SageMaker Clarify: bias detection in data AND model + SHAP explainability + feature importance',
          'CloudWatch: endpoint invocation metrics + model latency + error rates + custom metrics',
          'IAM roles for SageMaker: execution role (training/processing) + separate role for endpoint invocation',
          'VPC for SageMaker: training in VPC + PrivateLink for endpoint access + no public internet',
        ],
        traps: [
          'Model Monitor requires a baseline from the training data distribution — set it at deployment',
          'Clarify bias reports show statistical bias — human review still needed for actionable decisions',
          'SageMaker endpoints are public by default — enable VPC mode for private access',
          'Data drift ≠ model drift — data drift = input distribution changed; model drift = accuracy degraded',
        ],
        greenFlags: ['Model Monitor for drift detection', 'Clarify for explainability', 'VPC for private training'],
      },
    ],
    correct: ['Use spot training with checkpointing', 'Enable Model Monitor at deployment', 'Use Feature Store for feature reuse', 'Clarify for bias before production', 'SageMaker Pipelines for reproducibility'],
    wrong: ['Training on-demand instances when spot works', 'Deploying without a baseline for monitoring', 'Recomputing features in every training job', 'Ignoring class imbalance in training data', 'Using real-time endpoint for batch scoring (use batch transform)'],
  },
  {
    id: 'sap-c02',
    code: 'SAP-C02',
    name: 'Solutions Architect Professional',
    icon: '🏛️',
    questions: 260,
    domains: [
      {
        name: 'Design for New Solutions',
        weight: 29,
        color: '#dbeafe',
        border: '#3b82f6',
        focus: [
          'Multi-account strategy: AWS Organizations + Control Tower + SCPs + OU structure',
          'Complex networking: Transit Gateway + VPC peering (non-transitive) + Direct Connect + VPN as backup',
          'Hybrid architecture: Storage Gateway (File/Volume/Tape) + DataSync + Direct Connect + Outposts',
          'Microservices: ECS/EKS + API Gateway + EventBridge + Step Functions + decoupled patterns',
          'Advanced security: WAF + Shield Advanced + Firewall Manager + Network Firewall + PrivateLink',
        ],
        traps: [
          'VPC peering is non-transitive — VPC A↔B and B↔C does NOT mean A↔C',
          'Transit Gateway supports transitive routing — it\'s the hub for multi-VPC architectures',
          'Control Tower landing zone sets up best-practice multi-account structure automatically',
          'Firewall Manager requires AWS Organizations and Config to be enabled',
        ],
        greenFlags: ['Transit Gateway for multi-VPC', 'Organizations for governance', 'PrivateLink for private service access'],
      },
      {
        name: 'Design Solutions for Organizational Complexity',
        weight: 26,
        color: '#dcfce7',
        border: '#22c55e',
        focus: [
          'AWS Organizations: management account + member accounts + OUs + consolidated billing + SCPs',
          'Control Tower: automated landing zone + guardrails (preventive=SCP + detective=Config) + Account Factory',
          'AWS RAM (Resource Access Manager): share resources across accounts (subnets Transit Gateway Route 53 Resolver)',
          'Service Catalog: pre-approved CloudFormation templates + self-service portal + portfolios + constraints',
          'Cost allocation: tags + Cost Explorer + budgets + chargeback reports per OU/account',
        ],
        traps: [
          'SCPs do NOT apply to management account — management account has full access regardless of SCPs',
          'RAM can share subnets but NOT entire VPCs — individual resources only',
          'Service Catalog products are CloudFormation templates — not arbitrary scripts',
          'Consolidated billing rolls up to management account — credits and volume discounts shared',
        ],
        greenFlags: ['SCPs for preventive guardrails', 'Config for detective guardrails', 'RAM to avoid VPC peering sprawl'],
      },
      {
        name: 'Continuous Improvement for Existing Solutions',
        weight: 25,
        color: '#fef9c3',
        border: '#eab308',
        focus: [
          'Migration strategies: 7Rs (Retire Retain Rehost Replatform Repurchase Refactor Re-architect)',
          'Well-Architected Framework reviews: Trusted Advisor + Well-Architected Tool + Pillar improvements',
          'Modernization: monolith → microservices + strangler fig pattern + event-driven architecture',
          'Cost optimization at scale: Reserved Instance portfolio management + Savings Plans + Spot Fleet + rightsizing',
          'Performance improvement: CloudFront + Global Accelerator + Read replicas + ElastiCache layers',
        ],
        traps: [
          'Lift-and-shift (Rehost) = fastest migration but least cloud-native optimization',
          'Strangler fig pattern = incrementally replace monolith without big-bang rewrite',
          'Well-Architected Tool generates a report but does NOT automatically fix issues',
          'Savings Plans commitment = $/hour — if you commit too much you overpay on unused compute',
        ],
        greenFlags: ['Phased migration over big-bang', 'Strangler fig for modernization', 'Well-Architected reviews quarterly'],
      },
      {
        name: 'Accelerate Workload Migration and Modernization',
        weight: 20,
        color: '#ffedd5',
        border: '#f97316',
        focus: [
          'AWS Migration Hub: centralized tracking of migration across tools',
          'Application Migration Service (MGN): lift-and-shift (rehost) server migration + continuous replication + cutover',
          'Database Migration Service (DMS): homogeneous + heterogeneous + ongoing CDC replication',
          'DataSync: accelerated data transfer (S3 EFS FSx) + up to 10x faster than open-source tools',
          'Snow Family: Snowcone (8TB) → Snowball Edge (80TB compute or storage) → Snowmobile (100PB)',
        ],
        traps: [
          'MGN (Application Migration Service) replaced SMS (Server Migration Service) — SMS is legacy',
          'DMS requires SCT for heterogeneous migrations (different DB engine types)',
          'DataSync is for file/object transfer — NOT database migration (use DMS for databases)',
          'Snowball Edge Storage Optimized (80TB) vs Compute Optimized (42TB SSD + GPU) — different use cases',
        ],
        greenFlags: ['MGN for server migration', 'DMS for database migration', 'DataSync for file migration', 'Snow for offline transfer'],
      },
    ],
    correct: ['Transit Gateway over VPC peering mesh', 'Control Tower for new multi-account setup', 'Migration Hub for tracking', 'SCPs on OUs not individual accounts', 'Well-Architected review before major changes'],
    wrong: ['VPC peering for more than 3 VPCs (use TGW)', 'SCPs on management account (they don\'t apply)', 'Big-bang migration instead of phased approach', 'Sharing entire VPCs instead of specific subnets via RAM', 'Ignoring Reserved Instance utilization reports'],
  },
  {
    id: 'dop-c02',
    code: 'DOP-C02',
    name: 'DevOps Engineer Professional',
    icon: '⚙️',
    questions: 260,
    domains: [
      {
        name: 'SDLC Automation',
        weight: 22,
        color: '#dbeafe',
        border: '#3b82f6',
        focus: [
          'CodePipeline: source (CodeCommit/GitHub/S3) + build (CodeBuild) + test + deploy stages + manual approvals',
          'CodeBuild: buildspec.yml + environment variables + artifacts + caching + reports (test results)',
          'CodeDeploy: EC2 in-place vs blue-green + Lambda canary/linear/all-at-once + ECS blue-green + appspec.yml hooks',
          'Testing strategies: unit (CodeBuild) + integration + load (Artillery/Gatling) + canary testing',
          'Feature flags: decoupled from deployment — release features independently of code deployment',
        ],
        traps: [
          'CodeDeploy appspec.yml hooks run in order: BeforeInstall → AfterInstall → ApplicationStart → ValidateService',
          'CodeBuild uses buildspec.yml OR inline commands — if both present, buildspec.yml wins',
          'Lambda canary (10Percent5Minutes) = 10% traffic for 5 min then switch all; Linear = gradual over time',
          'In-place CodeDeploy = same instances (downtime possible); Blue-green = new instances (zero downtime)',
        ],
        greenFlags: ['Blue-green for zero-downtime', 'Canary for safe Lambda releases', 'Manual approval gates for production'],
      },
      {
        name: 'Security and Compliance',
        weight: 17,
        color: '#dcfce7',
        border: '#22c55e',
        focus: [
          'Config Rules: managed rules + custom Lambda rules + conformance packs + auto-remediation with SSM',
          'Security Hub: aggregated findings + custom insights + automated response with EventBridge',
          'IAM policies as code: CloudFormation + CDK + validate with IAM Access Analyzer',
          'Secrets Manager in pipelines: CodeBuild env vars from Secrets Manager + no plaintext secrets in buildspec',
          'Inspector: automated vulnerability scanning integrated into CI/CD pipelines',
        ],
        traps: [
          'Config Rules evaluate — they do NOT prevent. Auto-remediation does the prevention',
          'Security Hub findings have severity levels — Critical and High need immediate action',
          'IAM Access Analyzer validates policies locally before deployment',
          'Secrets Manager rotation breaks if Lambda function is deleted — keep rotation Lambda',
        ],
        greenFlags: ['Shift security left (scan in pipeline)', 'Config for compliance as code', 'Secrets Manager over env vars'],
      },
      {
        name: 'Configuration Management and IaC',
        weight: 17,
        color: '#fef9c3',
        border: '#eab308',
        focus: [
          'CloudFormation: nested stacks + StackSets + change sets + drift detection + custom resources + stack policies',
          'CDK (Cloud Development Kit): synthesizes to CloudFormation + constructs (L1/L2/L3) + CDK Pipelines',
          'Systems Manager Parameter Store: hierarchy /app/prod/db-url + cross-account access + versioning',
          'OpsWorks: managed Chef/Puppet — legacy but still tested + layers + stacks + recipes',
          'Terraform on AWS: state management in S3 + DynamoDB locking + provider authentication via IAM role',
        ],
        traps: [
          'CloudFormation custom resources run Lambda — they must send SUCCESS/FAILURE response to pre-signed S3 URL',
          'CDK deploy = cdk synth (generate CF) → cdk deploy (deploy CF stack)',
          'StackSets need either Organizations integration OR manual account list',
          'OpsWorks is legacy — new architectures use CDK/CloudFormation or SSM',
        ],
        greenFlags: ['IaC for everything', 'Change sets before production', 'Drift detection regularly'],
      },
      {
        name: 'Monitoring and Logging',
        weight: 15,
        color: '#ffedd5',
        border: '#f97316',
        focus: [
          'CloudWatch: composite alarms + metric math + embedded metrics format (EMF) for Lambda logs',
          'X-Ray: active tracing + sampling rules + groups + trace map + annotations for filtering',
          'OpenSearch Service: log aggregation + Kibana dashboards + Kinesis Firehose integration',
          'CloudWatch Logs: log groups + log streams + subscription filters + cross-account log sharing',
          'Container monitoring: ECS Container Insights + EKS Container Insights + Fluent Bit for log forwarding',
        ],
        traps: [
          'X-Ray sampling = not all requests are traced by default (to control cost/volume)',
          'CloudWatch Logs subscription filter = real-time streaming to Lambda/Kinesis/Firehose',
          'Composite alarms can reduce alarm noise (only alert when multiple conditions are true)',
          'EMF (Embedded Metrics Format) = structured JSON logs that CloudWatch automatically parses into metrics',
        ],
        greenFlags: ['Composite alarms to reduce noise', 'X-Ray for distributed tracing', 'Centralized log aggregation'],
      },
      {
        name: 'Resilient Cloud Solutions',
        weight: 15,
        color: '#e0e7ff',
        border: '#6366f1',
        focus: [
          'Multi-region deployment: Route 53 failover + Aurora Global + DynamoDB Global Tables + S3 CRR',
          'Chaos engineering: AWS Fault Injection Simulator (FIS) + inject failures to test resilience',
          'Blue-green at infrastructure level: Route 53 weighted + CloudFront + ALB weighted target groups',
          'RTO/RPO targets: Backup&Restore (hours) → Pilot Light (hours) → Warm Standby (minutes) → Active-Active (near-zero)',
          'Auto Scaling: predictive scaling + target tracking + scheduled + lifecycle hooks for graceful drain',
        ],
        traps: [
          'FIS experiments should start small — start with 5% failure not 50%',
          'Route 53 TTL matters for failover speed — low TTL = faster failover but more DNS queries',
          'Global Tables require DynamoDB Streams to be enabled',
          'Pilot Light: only core DB runs in DR — everything else starts on failover',
        ],
        greenFlags: ['FIS for chaos testing', 'Global Tables for active-active', 'Low TTL for fast failover'],
      },
      {
        name: 'Incident and Event Response',
        weight: 14,
        color: '#fce7f3',
        border: '#ec4899',
        focus: [
          'EventBridge: real-time event routing + rules + targets (Lambda Step Functions SNS SQS) + event replay',
          'Systems Manager Incident Manager: automated runbooks + response plans + escalation + post-incident analysis',
          'OpsCenter: aggregated operational issues + related CloudWatch alarms + SSM automation',
          'Auto-remediation patterns: CloudWatch Alarm → EventBridge → Lambda (fix) + SNS (notify)',
          'On-call management: PagerDuty/OpsGenie integration with EventBridge + escalation policies',
        ],
        traps: [
          'EventBridge is the new name for CloudWatch Events — same service',
          'Incident Manager requires a replication set across regions for resilience',
          'SSM Automation runbooks can be triggered by EventBridge — not just manually',
          'OpsCenter items (OpsItems) are NOT the same as Config findings or Security Hub findings',
        ],
        greenFlags: ['Automated runbooks for common incidents', 'EventBridge for event-driven response', 'Post-incident analysis always'],
      },
    ],
    correct: ['Automate everything that happens more than once', 'Blue-green deployments for zero downtime', 'Shift security left into the pipeline', 'IaC for all infrastructure', 'Chaos testing before production incidents happen'],
    wrong: ['Manual deployments to production', 'In-place deployments without rollback plan', 'Secrets in environment variables or code', 'Single-region architecture for critical workloads', 'No runbook for common incidents'],
  },
  {
    id: 'scs-c03',
    code: 'SCS-C03',
    name: 'Security Specialty',
    icon: '🔐',
    questions: 260,
    domains: [
      {
        name: 'Infrastructure Security',
        weight: 20,
        color: '#dbeafe',
        border: '#3b82f6',
        focus: [
          'WAF: web ACLs + managed rule groups (OWASP Top 10) + rate limiting + Bot Control + IP sets',
          'AWS Shield: Standard (free automatic DDoS) vs Advanced ($3000/mo + 24/7 DDoS team + cost protection)',
          'Network Firewall: stateful inspection + Suricata-compatible rules + centralized in inspection VPC',
          'VPC security: security groups (stateful) + NACLs (stateless) + Flow Logs + traffic mirroring',
          'PrivateLink: expose services privately without VPC peering or internet + endpoint services',
        ],
        traps: [
          'WAF is NOT a firewall for all traffic — only HTTP/HTTPS layer 7 traffic',
          'Shield Advanced must be enabled per account OR use Firewall Manager to apply across org',
          'Network Firewall goes in a dedicated inspection VPC — traffic routes through it via TGW',
          'PrivateLink endpoint services require NLB on the provider side — not ALB',
        ],
        greenFlags: ['WAF for application layer', 'Shield Advanced for DDoS', 'PrivateLink for private access'],
      },
      {
        name: 'Security Logging and Monitoring',
        weight: 18,
        color: '#dcfce7',
        border: '#22c55e',
        focus: [
          'CloudTrail: enabled by default for management events + data events cost extra + Insights for unusual API calls + organization trail',
          'CloudWatch Logs: metric filters for security events + alarms + log retention policy + cross-account sharing',
          'Security Hub: CSPM score + standards (CIS AWS Foundations NIST PCI-DSS) + custom actions + automated response',
          'Detective: ML-powered investigation + behavior graphs + VPC Flow Logs + CloudTrail + GuardDuty integration',
          'Config: resource configuration history + relationships + conformance packs + remediation',
        ],
        traps: [
          'CloudTrail management events are enabled by default — data events (S3/Lambda) cost extra',
          'Security Hub score out of 100% — lower is worse (more findings)',
          'Detective is for INVESTIGATION not detection — GuardDuty detects, Detective investigates',
          'Config records configuration history — not CloudTrail (CloudTrail records API calls)',
        ],
        greenFlags: ['Organization-wide CloudTrail', 'Security Hub for compliance score', 'Detective for investigation'],
      },
      {
        name: 'Data Protection',
        weight: 18,
        color: '#fef9c3',
        border: '#eab308',
        focus: [
          'KMS: CMK (customer managed) vs AWS managed vs AWS owned + key policies + grants + envelope encryption + automatic rotation',
          'ACM (Certificate Manager): public certs (free) + private CA + automatic renewal + ALB/CloudFront/API Gateway integration',
          'Macie: ML-powered S3 sensitive data discovery (PII PHI credit cards) + findings + automated remediation',
          'CloudHSM: dedicated HSM hardware + FIPS 140-2 Level 3 + customer manages keys (AWS has NO access)',
          'S3 encryption: SSE-S3 + SSE-KMS + SSE-C (customer key) + client-side encryption',
        ],
        traps: [
          'AWS managed keys cannot be deleted or rotated manually — AWS controls rotation',
          'CloudHSM is NOT managed by AWS — you are responsible for key management and HSM cluster',
          'Macie only scans S3 — not RDS DynamoDB or other storage',
          'ACM private CA costs $400/month per CA — expensive, only use when you need private PKI',
        ],
        greenFlags: ['KMS for key management', 'Macie for sensitive data', 'CloudHSM for regulatory compliance'],
      },
      {
        name: 'Identity and Access Management',
        weight: 16,
        color: '#f3e8ff',
        border: '#a855f7',
        focus: [
          'IAM: permission boundaries + trust policies + resource-based policies + policy evaluation logic (explicit deny wins)',
          'IAM Identity Center (SSO): federated access to multiple AWS accounts + SAML/OIDC + permission sets',
          'AWS Organizations SCPs: restrict maximum permissions for member accounts + inheritance through OU hierarchy',
          'ABAC (Attribute-Based Access Control): tags as conditions + scalable for large organizations + dynamic permissions',
          'Cross-account access: IAM roles + trust policy + STS AssumeRole + external ID (confused deputy protection)',
        ],
        traps: [
          'Permission evaluation: explicit DENY always wins → then SCPs → then resource policies → then identity policies',
          'External ID in cross-account roles prevents confused deputy attacks — always require it for third-party access',
          'IAM Identity Center is the preferred way for multi-account access (not individual IAM users per account)',
          'ABAC requires tagging discipline — if tags are wrong permissions break',
        ],
        greenFlags: ['Least privilege always', 'Permission boundaries for delegation', 'External ID for cross-account roles'],
      },
      {
        name: 'Threat Detection and Incident Response',
        weight: 14,
        color: '#ccfbf1',
        border: '#14b8a6',
        focus: [
          'GuardDuty: ML threat detection + VPC Flow Logs + DNS logs + CloudTrail + S3 data events + EKS audit logs',
          'Inspector: vulnerability assessments + CVE scanning + EC2 + container images + Lambda functions',
          'Security Hub: aggregates GuardDuty + Inspector + Macie + Config + Firewall Manager findings',
          'Incident response: isolate (remove from ASG) → preserve (snapshot) → investigate (Detective) → remediate',
          'EventBridge + Lambda for automated IR: GuardDuty finding → EventBridge rule → Lambda isolates EC2',
        ],
        traps: [
          'GuardDuty does NOT prevent — it only detects. Use NACL/security group updates via Lambda to block',
          'Inspector findings are about vulnerabilities — not active threats (GuardDuty is active threats)',
          'Isolate compromised instance: remove from ASG + detach from ELB + snapshot EBS + preserve for forensics',
          'GuardDuty findings have severity 1-10: 7-8.9 = High; 9-10 = Critical',
        ],
        greenFlags: ['GuardDuty always enabled', 'Automated IR with EventBridge', 'Preserve evidence before remediation'],
      },
      {
        name: 'Management and Security Governance',
        weight: 14,
        color: '#ffedd5',
        border: '#f97316',
        focus: [
          'AWS Organizations: centralized governance + SCP inheritance + management account protection',
          'Control Tower: guardrails (preventive + detective) + account vending + drift remediation',
          'Firewall Manager: centralized WAF + Shield + Security Group + Network Firewall policies across org',
          'AWS Config conformance packs: bundle of Config rules for compliance standards (PCI-DSS CIS HIPAA)',
          'Audit Manager: continuous evidence collection for audits + prebuilt frameworks + custom frameworks',
        ],
        traps: [
          'Firewall Manager requires AWS Organizations + Config + designated administrator account',
          'Audit Manager collects evidence automatically — it does NOT fix non-compliance',
          'Control Tower preventive guardrails = SCPs (hard blocks); detective = Config Rules (soft compliance)',
          'AWS Config conformance packs deploy multiple rules at once — not a compliance certification',
        ],
        greenFlags: ['Organization-wide policies via Firewall Manager', 'Audit Manager for continuous compliance', 'Control Tower for governance at scale'],
      },
    ],
    correct: ['Enable GuardDuty org-wide', 'Automate IR with EventBridge + Lambda', 'KMS for all encryption', 'Centralize logs in S3 with CloudTrail', 'Least privilege + permission boundaries'],
    wrong: ['Relying only on perimeter security (defense in depth)', 'Disabling CloudTrail data events (cost savings — but you lose visibility)', 'Sharing KMS keys across unrelated services', 'Root account without MFA', 'No IR runbook before an incident occurs'],
  },
  {
    id: 'ans-c01',
    code: 'ANS-C01',
    name: 'Advanced Networking Specialty',
    icon: '🌐',
    questions: 260,
    domains: [
      {
        name: 'Network Design',
        weight: 30,
        color: '#dbeafe',
        border: '#3b82f6',
        focus: [
          'Transit Gateway: hub-and-spoke + route tables (one per TGW or shared) + inter-region peering + multicast + VPN attachment',
          'Direct Connect: dedicated (1/10/100 Gbps) vs hosted connection + public/private/transit VIFs + LAG for redundancy',
          'VPC design: CIDR planning + non-overlapping + shared VPC (RAM) + VPC peering (non-transitive) + PrivateLink',
          'BGP: route advertisement + AS path prepending for traffic engineering + BGP communities + MED attribute',
          'Hybrid DNS: Route 53 Resolver inbound/outbound endpoints + on-prem DNS integration',
        ],
        traps: [
          'VPC peering is non-transitive — must peer each VPC pair explicitly (use TGW for hub)',
          'Direct Connect public VIF = access to AWS public services (S3 DynamoDB); private VIF = VPC resources',
          'Transit VIF = connects Direct Connect to Transit Gateway for multiple VPCs',
          'LAG (Link Aggregation Group) bundles multiple Direct Connect connections — min 2 connections same location',
        ],
        greenFlags: ['Transit Gateway for multi-VPC', 'Direct Connect for consistent network performance', 'Route 53 Resolver for hybrid DNS'],
      },
      {
        name: 'Network Implementation',
        weight: 26,
        color: '#dcfce7',
        border: '#22c55e',
        focus: [
          'Route 53: advanced routing (Geoproximity with bias + Latency + Weighted + Failover) + health checks + DNSSEC',
          'Load balancers: ALB (L7 path/host routing + WAF integration) + NLB (L4 TCP/UDP static IP + PrivateLink) + GWLB (inline inspection)',
          'CloudFront: origin groups (failover) + cache behaviors + origin shield + field-level encryption',
          'VPN: Site-to-Site VPN + accelerated VPN (Global Accelerator) + Client VPN (OpenVPN)',
          'IPv6: dual-stack VPC + egress-only internet gateway + IPv6 CIDR assignment',
        ],
        traps: [
          'NLB preserves source IP; ALB does NOT (check X-Forwarded-For)',
          'GWLB uses GENEVE protocol port 6081 — it transparently passes traffic to inspection appliances',
          'Accelerated VPN uses Global Accelerator — not just a regular VPN with better routing',
          'Route 53 Geoproximity requires Traffic Flow (additional cost) — not available in simple routing',
        ],
        greenFlags: ['NLB for static IP and PrivateLink', 'GWLB for inline security appliances', 'Accelerated VPN for global connectivity'],
      },
      {
        name: 'Network Security, Compliance, and Governance',
        weight: 24,
        color: '#fef9c3',
        border: '#eab308',
        focus: [
          'Network Firewall: stateful (Suricata IDS/IPS) + stateless (5-tuple) + centralized in inspection VPC + TGW routing',
          'WAF: rate-based rules + managed rule groups + regex matching + IP reputation lists + Bot Control',
          'PrivateLink: endpoint services + NLB required + cross-account + cross-region (via TGW)',
          'VPC endpoints: gateway (S3/DynamoDB free) vs interface (ENI + hourly cost) + endpoint policies',
          'Security compliance: VPC Flow Logs + CloudTrail API calls + DNS query logging + network ACL logging',
        ],
        traps: [
          'Network Firewall stateless rules: evaluated first + actions (pass/drop/forward to stateful)',
          'Gateway endpoints have no cost; Interface endpoints cost $0.01/hour per AZ',
          'PrivateLink service provider needs NLB — ALB is not supported as endpoint service',
          'WAF rules: counted rules don\'t block — they just count (use BLOCK action to actually block)',
        ],
        greenFlags: ['Network Firewall for deep packet inspection', 'PrivateLink for private SaaS access', 'VPC Flow Logs always enabled'],
      },
      {
        name: 'Network Management and Operation',
        weight: 20,
        color: '#ffedd5',
        border: '#f97316',
        focus: [
          'VPC Flow Logs: accept/reject decisions + source/destination IP + port + protocol + send to CloudWatch/S3/Kinesis',
          'Traffic Mirroring: copy traffic from ENI to target (NLB or ENI) for deep packet inspection + IDS/IPS',
          'Reachability Analyzer: verify connectivity between resources without sending actual traffic + finds config issues',
          'Network Access Analyzer: identify unintended network access + compliance checking + automated analysis',
          'CloudWatch Network Insights: network topology + monitoring + performance',
        ],
        traps: [
          'VPC Flow Logs do NOT capture traffic to/from instance metadata endpoint (169.254.169.254)',
          'Traffic Mirroring requires Nitro-based instances — not all instance types supported',
          'Reachability Analyzer finds routing issues — not performance issues (use CloudWatch for performance)',
          'Flow Logs have a capture window of 10-15 minutes — not real-time',
        ],
        greenFlags: ['Flow Logs for network visibility', 'Reachability Analyzer for troubleshooting', 'Traffic Mirroring for security analysis'],
      },
    ],
    correct: ['Transit Gateway over VPC peering mesh', 'Direct Connect + VPN backup for HA', 'Enable VPC Flow Logs always', 'Network Firewall in inspection VPC', 'Route 53 health checks for failover'],
    wrong: ['VPC peering for more than 3-4 VPCs', 'No backup for Direct Connect (VPN or second DX)', 'Trusting source IPs through ALB (check X-Forwarded-For)', 'Gateway endpoints for all services (only S3/DynamoDB)', 'Direct Connect without LAG for redundancy'],
  },
  {
    id: 'aif-c01',
    code: 'AIF-C01',
    name: 'AI Practitioner',
    icon: '🧠',
    questions: 260,
    domains: [
      {
        name: 'Applications of Foundation Models',
        weight: 28,
        color: '#dbeafe',
        border: '#3b82f6',
        focus: [
          'Amazon Bedrock: managed access to foundation models (Claude Llama Titan Mistral) + no ML expertise needed',
          'RAG (Retrieval-Augmented Generation): retrieve relevant context + augment prompt + generate answer — reduces hallucinations',
          'Prompt engineering: zero-shot + few-shot + chain-of-thought + role prompting + output formatting',
          'Amazon Q: business assistant (Q Business for company data + Q Developer for code)',
          'Knowledge Bases for Bedrock: managed RAG + vector store (OpenSearch Pinecone Aurora) + automatic chunking',
        ],
        traps: [
          'Foundation models have a knowledge cutoff — they don\'t know recent events without RAG',
          'RAG retrieves from your data — fine-tuning trains the model on your data (very different cost/complexity)',
          'Bedrock model access must be explicitly enabled per model per region',
          'Amazon Q Business ≠ Q Developer — Business = company knowledge assistant; Developer = coding assistant',
        ],
        greenFlags: ['RAG for domain-specific knowledge', 'Prompt engineering before fine-tuning', 'Bedrock for managed access'],
      },
      {
        name: 'Fundamentals of Generative AI',
        weight: 24,
        color: '#dcfce7',
        border: '#22c55e',
        focus: [
          'Tokens: how models process text + context window limits (tokens not words)',
          'Temperature: controls randomness — 0 = deterministic; 1 = creative + Top-P/Top-K sampling',
          'Embeddings: vector representations of text + semantic similarity + cosine distance',
          'Inference parameters: max tokens + stop sequences + temperature + top-p',
          'Foundation model types: LLM (text) + multimodal (text+image) + diffusion (image generation)',
        ],
        traps: [
          'Higher temperature = more creative/random but less accurate — use low temp for factual tasks',
          'Context window = total tokens (input + output) — not just output length',
          'Embeddings don\'t store text — they store vector representations (floats)',
          'Top-P (nucleus sampling) vs Top-K: Top-P picks from tokens that sum to probability P; Top-K picks from top K tokens',
        ],
        greenFlags: ['Low temperature for factual answers', 'RAG to extend context', 'Embeddings for semantic search'],
      },
      {
        name: 'Fundamentals of AI and ML',
        weight: 20,
        color: '#fef9c3',
        border: '#eab308',
        focus: [
          'ML types: supervised (labeled data) + unsupervised (clustering) + reinforcement (reward signal) + self-supervised (foundation models)',
          'ML lifecycle: problem definition → data collection → preprocessing → training → evaluation → deployment → monitoring',
          'Common algorithms: linear regression + decision trees + neural networks + transformers (for LLMs)',
          'Evaluation metrics: accuracy + precision + recall + F1 + AUC-ROC + RMSE (regression)',
          'AWS ML services: Rekognition (images) + Comprehend (NLP) + Forecast (time series) + Personalize (recommendations)',
        ],
        traps: [
          'High accuracy on imbalanced dataset is misleading — use F1 or AUC-ROC',
          'Overfitting = great on training data poor on test data — add regularization or more data',
          'AI services (Rekognition Comprehend) = no ML knowledge needed; SageMaker = build your own ML',
          'Transformer architecture (BERT GPT) underpins most modern LLMs — attention mechanism is key',
        ],
        greenFlags: ['AI services for common use cases', 'SageMaker for custom ML', 'Evaluation beyond just accuracy'],
      },
      {
        name: 'Guidelines for Responsible AI',
        weight: 14,
        color: '#f3e8ff',
        border: '#a855f7',
        focus: [
          'Fairness: bias in training data leads to biased models + protected attributes + equal opportunity',
          'Transparency: model cards + explainability (SHAP) + audit trails + disclosure of AI use',
          'AWS Responsible AI principles: fairness + explainability + privacy + robustness + governance + transparency',
          'Bias types: historical bias (in data) + measurement bias (how data collected) + aggregation bias (grouping)',
          'Human oversight: human-in-the-loop for high-stakes decisions + AI as assistant not decision-maker',
        ],
        traps: [
          'Removing protected attributes (race gender) doesn\'t remove bias — proxies like zip code can still introduce bias',
          'Explainability ≠ interpretability — you can explain a black box model without understanding its internals',
          'Fair for one group may not be fair for another — fairness requires explicit definition',
          'Human oversight is critical — never fully automate high-stakes decisions with AI',
        ],
        greenFlags: ['Model cards for transparency', 'SHAP for explainability', 'Human-in-the-loop for high stakes'],
      },
      {
        name: 'Security, Compliance, and Governance for AI',
        weight: 14,
        color: '#ccfbf1',
        border: '#14b8a6',
        focus: [
          'Bedrock Guardrails: content filters + deny topics + sensitive info redaction + grounding checks + word filters',
          'Data privacy: no customer data used to train Bedrock models + data residency requirements',
          'Model access control: IAM policies for Bedrock + VPC endpoints for private access',
          'Compliance: GDPR (right to explanation) + AI Act requirements + data sovereignty',
          'AWS AI service terms: AWS does not use customer data to train its AI services',
        ],
        traps: [
          'Bedrock guardrails apply at inference time — they don\'t change the model',
          'AWS does NOT use your Bedrock prompts/responses to train models — customer data stays yours',
          'VPC endpoint for Bedrock prevents model calls going over the internet',
          'GDPR\'s right to explanation means AI decisions affecting people must be explainable',
        ],
        greenFlags: ['Guardrails for content safety', 'VPC endpoints for private AI access', 'Data residency compliance'],
      },
    ],
    correct: ['RAG before fine-tuning for domain knowledge', 'Low temperature for factual tasks', 'Guardrails for content safety', 'Human oversight for high-stakes AI', 'Evaluate beyond accuracy (F1 AUC-ROC)'],
    wrong: ['Fine-tuning when RAG would suffice (much cheaper)', 'High temperature for customer-facing factual responses', 'Assuming removing protected attributes removes bias', 'Deploying AI without human oversight for critical decisions', 'Ignoring context window limits in production'],
  },
  {
    id: 'gai-c01',
    code: 'GAI-C01',
    name: 'Generative AI Specialty',
    icon: '✨',
    questions: 260,
    domains: [
      {
        name: 'Design and Implementation of Generative AI Solutions',
        weight: 30,
        color: '#dbeafe',
        border: '#3b82f6',
        focus: [
          'Amazon Bedrock Agents: multi-step reasoning + action groups (Lambda) + knowledge bases + memory + orchestration',
          'RAG architecture: document chunking strategies + embedding models + vector stores + retrieval + reranking',
          'Prompt engineering advanced: system prompts + few-shot examples + chain-of-thought + self-consistency + structured output',
          'Amazon Q Developer: code generation + code review + /dev for feature implementation + /transform for modernization',
          'Multi-modal applications: Titan Image Generator + Stability AI + Bedrock multimodal models',
        ],
        traps: [
          'Bedrock Agents use ReAct (Reasoning + Acting) pattern — not just simple prompt chaining',
          'Chunking strategy affects RAG quality: too small = loss of context; too large = irrelevant retrieval',
          'Q Developer /transform uses Amazon Q to modernize legacy code (Java 8 → Java 17 etc)',
          'Reranking improves RAG precision but adds latency — trade-off decision',
        ],
        greenFlags: ['Agents for multi-step tasks', 'RAG for knowledge grounding', 'Structured output for downstream processing'],
      },
      {
        name: 'Foundation Model Selection and Optimization',
        weight: 28,
        color: '#dcfce7',
        border: '#22c55e',
        focus: [
          'Model selection criteria: context window + modality + latency + cost + quality + compliance',
          'Fine-tuning on Bedrock: continued pre-training (large unlabeled data) vs fine-tuning (task-specific labeled data)',
          'RLHF (Reinforcement Learning from Human Feedback): align model to human preferences + reduces harmful outputs',
          'LoRA (Low-Rank Adaptation): parameter-efficient fine-tuning + smaller training footprint + faster + cheaper',
          'Bedrock model evaluation: automatic (benchmark datasets) + human (reviewer ratings) + LLM-as-judge',
        ],
        traps: [
          'Fine-tuning requires significant high-quality labeled data — it\'s NOT just giving examples (that\'s few-shot)',
          'Continued pre-training ≠ fine-tuning — pre-training uses unlabeled domain corpus; fine-tuning uses labeled task data',
          'LoRA trains only low-rank adapter matrices — original model weights unchanged',
          'Model evaluation on benchmarks may not reflect real-world task performance — always evaluate on your use case',
        ],
        greenFlags: ['Prompt engineering first, RAG second, fine-tuning last (most expensive)', 'LoRA for efficient fine-tuning', 'Evaluate on your specific use case'],
      },
      {
        name: 'Security and Compliance for Generative AI',
        weight: 22,
        color: '#fef9c3',
        border: '#eab308',
        focus: [
          'Bedrock Guardrails: content filtering + PII redaction + deny topics + grounding (hallucination detection) + word filters',
          'Prompt injection attacks: malicious instructions in user input override system prompt + detection + mitigation',
          'Data privacy: training data privacy + inference data privacy + model memorization risks',
          'Model access governance: IAM + resource-based policies + VPC endpoints + cross-account access',
          'Compliance for AI: data residency + model cards + bias audits + explainability reports',
        ],
        traps: [
          'Prompt injection is the #1 security risk for LLM applications — validate and sanitize inputs',
          'Guardrails with grounding = detects when model response is not grounded in provided context (hallucination)',
          'Bedrock does not retain or use customer data for model training',
          'Model memorization: models can regurgitate training data including PII — audit training data',
        ],
        greenFlags: ['Guardrails always enabled', 'Input validation against prompt injection', 'VPC endpoints for private inference'],
      },
      {
        name: 'Infrastructure and Deployment for Generative AI',
        weight: 20,
        color: '#ffedd5',
        border: '#f97316',
        focus: [
          'SageMaker JumpStart: deploy foundation models with one click + fine-tuning + benchmark comparison',
          'Inference optimization: model quantization (INT8/INT4) + batching + streaming responses + caching',
          'Cost optimization: on-demand vs provisioned throughput (Bedrock) + model size vs quality trade-off + caching repeated queries',
          'Scalability: Bedrock auto-scales by default + SageMaker endpoint auto-scaling + multi-model endpoints',
          'Monitoring: CloudWatch for Bedrock + SageMaker Model Monitor for drift + LLM-specific metrics (latency tokens/sec)',
        ],
        traps: [
          'Provisioned throughput in Bedrock = guaranteed capacity + lower cost at scale — commitment required',
          'Model quantization reduces quality slightly but dramatically reduces cost/latency',
          'Streaming responses (SSE) reduce time-to-first-token perception — important for UX',
          'SageMaker multi-model endpoints share a single endpoint for multiple models — cost savings at lower traffic',
        ],
        greenFlags: ['Provisioned throughput for predictable workloads', 'Quantization for cost efficiency', 'Streaming for better UX'],
      },
    ],
    correct: ['RAG before fine-tuning', 'Guardrails always enabled', 'Evaluate on your use case not just benchmarks', 'VPC endpoints for private inference', 'Monitor for hallucinations with grounding checks'],
    wrong: ['Fine-tuning before trying prompt engineering or RAG', 'Deploying without guardrails', 'Assuming benchmark performance = production performance', 'No prompt injection protection', 'Ignoring cost of input/output tokens at scale'],
  },
]

const CERT_LIST = CERT_GUIDES.map(c => ({ id: c.id, code: c.code, name: c.name, icon: c.icon }))

export default function StudyGuide() {
  const { user, tier, isPremium } = useAuth()
  const navigate = useNavigate()
  const [selectedId, setSelectedId] = useState<string>('saa-c03')

  useEffect(() => {
    if (!user?.accessToken) return
    if (tier === 'monthly') {
      getMonthlyCert(user.accessToken)
        .then(data => { if (data?.cert_id) setSelectedId(data.cert_id) })
        .catch(() => {})
    } else if (tier === 'bundle') {
      getBundleCerts(user.accessToken)
        .then(data => { if (data?.cert_ids?.[0]) setSelectedId(data.cert_ids[0]) })
        .catch(() => {})
    }
  }, [user, tier])

  if (!isPremium) {
    return (
      <Layout>
        <div style={{ minHeight: '70vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem', textAlign: 'center' }}>
          <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>🔒</div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#111827', marginBottom: '0.5rem' }}>Study Tools are for members only</h2>
          <p style={{ color: '#6b7280', maxWidth: '420px', lineHeight: 1.6, marginBottom: '1.5rem' }}>
            Upgrade to any paid plan to unlock the Study Guide, CheatSheets, Keywords, Glossary, and more.
          </p>
          <button onClick={() => navigate('/pricing')} style={{ padding: '12px 28px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 700, cursor: 'pointer', fontSize: '1rem' }}>
            See Plans →
          </button>
        </div>
      </Layout>
    )
  }

  const guide = CERT_GUIDES.find(c => c.id === selectedId) ?? CERT_GUIDES[0]
  const totalWeight = guide.domains.reduce((sum, d) => sum + d.weight, 0)

  return (
    <Layout>
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '2rem 1rem' }}>

        {/* Cert selector */}
        <div style={{ overflowX: 'auto', marginBottom: '2rem', paddingBottom: '4px' }}>
          <div style={{ display: 'flex', gap: '8px', minWidth: 'max-content' }}>
            {CERT_LIST.map(c => (
              <button
                key={c.id}
                onClick={() => setSelectedId(c.id)}
                style={{
                  padding: '6px 14px',
                  borderRadius: '999px',
                  border: '1px solid',
                  borderColor: selectedId === c.id ? '#2563eb' : '#d1d5db',
                  background: selectedId === c.id ? '#2563eb' : '#fff',
                  color: selectedId === c.id ? '#fff' : '#374151',
                  fontWeight: 600,
                  fontSize: '13px',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.15s',
                }}
              >
                {c.icon} {c.code}
              </button>
            ))}
          </div>
        </div>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{ display: 'inline-block', background: '#eff6ff', color: '#1d4ed8', padding: '4px 14px', borderRadius: '20px', fontSize: '13px', fontWeight: 600, marginBottom: '1rem' }}>
            {guide.code} SMART STUDY GUIDE
          </div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#111827', marginBottom: '0.5rem' }}>
            Domain Strategy & What to Focus On
          </h1>
          <p style={{ color: '#6b7280', fontSize: '1rem', marginBottom: '0.75rem' }}>
            {guide.name} — know your weights, avoid the traps.
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '999px', padding: '4px 14px', fontSize: '0.78rem', fontWeight: 700, color: '#16a34a' }}>
              ✅ {guide.questions.toLocaleString()} scenario-based {guide.code} questions with detailed explanations
            </div>
          </div>
        </div>

        {/* Domain weight bar */}
        <div style={{ background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '1.25rem', marginBottom: '2rem' }}>
          <div style={{ fontWeight: 700, fontSize: '14px', color: '#374151', marginBottom: '0.75rem' }}>Exam Weight Distribution</div>
          <div style={{ display: 'flex', borderRadius: '8px', overflow: 'hidden', height: '28px' }}>
            {guide.domains.map(d => (
              <div
                key={d.name}
                style={{
                  flex: d.weight,
                  background: d.border,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  fontSize: '11px',
                  fontWeight: 700,
                  overflow: 'hidden',
                }}
              >
                {d.weight >= Math.round(totalWeight / guide.domains.length) ? `${d.weight}%` : `${d.weight}%`}
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '8px' }}>
            {guide.domains.map(d => (
              <div key={d.name} style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: '#6b7280' }}>
                <span style={{ width: '10px', height: '10px', borderRadius: '2px', background: d.border, display: 'inline-block' }} />
                {d.name} {d.weight}%
              </div>
            ))}
          </div>
        </div>

        {/* Domain cards */}
        {guide.domains.map(d => (
          <div key={d.name} style={{ border: `1px solid ${d.border}`, borderRadius: '14px', padding: '1.5rem', marginBottom: '1.5rem', background: '#fff' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1rem', flexWrap: 'wrap' }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#111827', margin: 0 }}>{d.name}</h2>
              <span style={{ background: d.color, color: '#374151', padding: '2px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: 700, marginLeft: 'auto', whiteSpace: 'nowrap' }}>
                {d.weight}% of exam
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
          <div style={{ background: '#dcfce7', borderRadius: '12px', padding: '1.25rem' }}>
            <div style={{ fontWeight: 700, fontSize: '14px', marginBottom: '0.75rem' }}>✅ Usually Correct</div>
            {guide.correct.map((t, i) => (
              <div key={i} style={{ fontSize: '13px', color: '#374151', padding: '3px 0' }}>• {t}</div>
            ))}
          </div>
          <div style={{ background: '#fee2e2', borderRadius: '12px', padding: '1.25rem' }}>
            <div style={{ fontWeight: 700, fontSize: '14px', marginBottom: '0.75rem' }}>❌ Usually Wrong</div>
            {guide.wrong.map((t, i) => (
              <div key={i} style={{ fontSize: '13px', color: '#374151', padding: '3px 0' }}>• {t}</div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div style={{ textAlign: 'center', padding: '2rem', background: '#eff6ff', borderRadius: '14px' }}>
          <div style={{ fontWeight: 700, fontSize: '1.1rem', color: '#1d4ed8', marginBottom: '0.5rem' }}>Ready to test your knowledge?</div>
          <p style={{ color: '#6b7280', marginBottom: '1rem', fontSize: '14px' }}>
            Practice with {guide.questions.toLocaleString()} questions mapped to every domain
          </p>
          <a href="/certifications" style={{ background: '#2563eb', color: '#fff', padding: '10px 28px', borderRadius: '8px', fontWeight: 700, textDecoration: 'none', fontSize: '14px' }}>
            Start Practicing →
          </a>
        </div>
      </div>
    </Layout>
  )
}
