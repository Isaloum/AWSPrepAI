import { useState } from 'react'
import { Link } from 'react-router-dom'
import Layout from '../components/Layout'

// ── Data mined from 3,958 questions + explanations ───────────────
interface ServiceStat { name: string; count: number; domains: string[] }
interface ChooseWhen { service: string; when: string; not: string }
interface Trap { trap: string; why: string }
interface ArchPattern { name: string; services: string[]; use: string }

interface CertCheatSheet {
  id: string
  code: string
  name: string
  icon: string
  color: string
  passingScore: number
  duration: number
  questions: number
  domains: { name: string; weight: number; key: string[] }[]
  topServices: ServiceStat[]
  chooseWhen: ChooseWhen[]
  traps: Trap[]
  architecturePatterns: ArchPattern[]
}

const SHEETS: CertCheatSheet[] = [
  {
    id: 'saa-c03',
    code: 'SAA-C03',
    name: 'Solutions Architect Associate',
    icon: '🏗️',
    color: '#1d4ed8',
    passingScore: 720,
    duration: 130,
    questions: 65,
    domains: [
      { name: 'Resilient Architectures', weight: 30, key: ['Multi-AZ', 'Auto Scaling', 'ELB', 'Route 53 failover', 'RDS Multi-AZ'] },
      { name: 'High-Performing Architectures', weight: 28, key: ['CloudFront', 'ElastiCache', 'Read Replicas', 'S3 Transfer Acceleration', 'Global Accelerator'] },
      { name: 'Secure Architectures', weight: 24, key: ['IAM roles', 'KMS', 'Security Groups', 'VPC endpoints', 'Cognito'] },
      { name: 'Cost-Optimized Architectures', weight: 18, key: ['Reserved Instances', 'Spot Instances', 'S3 Intelligent-Tiering', 'Fargate', 'Lambda'] },
    ],
    topServices: [
      { name: 'EC2', count: 460, domains: ['Resilient', 'High-Perf', 'Cost'] },
      { name: 'S3', count: 326, domains: ['Resilient', 'Cost', 'Secure'] },
      { name: 'VPC', count: 139, domains: ['Secure', 'Resilient'] },
      { name: 'Auto Scaling', count: 119, domains: ['Resilient', 'Cost'] },
      { name: 'Lambda', count: 106, domains: ['Cost', 'High-Perf'] },
      { name: 'IAM', count: 101, domains: ['Secure'] },
      { name: 'RDS', count: 100, domains: ['Resilient', 'High-Perf'] },
      { name: 'DynamoDB', count: 69, domains: ['High-Perf', 'Cost'] },
      { name: 'CloudFront', count: 59, domains: ['High-Perf', 'Cost'] },
      { name: 'EBS', count: 56, domains: ['High-Perf', 'Cost'] },
    ],
    chooseWhen: [
      { service: 'Aurora', when: 'Need MySQL/PostgreSQL compatibility with automatic failover and up to 15 read replicas', not: 'Standard RDS — Aurora costs more but gives you 5x throughput' },
      { service: 'DynamoDB', when: 'Need single-digit millisecond latency at any scale, serverless, key-value or document', not: 'RDS — DynamoDB has no joins; use RDS when you need relational queries' },
      { service: 'ElastiCache', when: 'Caching database query results to reduce RDS load and improve read latency', not: 'CloudFront — ElastiCache is for dynamic data, CloudFront is for static/edge' },
      { service: 'S3 Glacier', when: 'Archiving data accessed less than once per year, lowest storage cost', not: 'S3 Standard-IA — Glacier retrieval takes hours, IA retrieval is instant' },
      { service: 'Spot Instances', when: 'Stateless, fault-tolerant, flexible workloads (batch, CI/CD, rendering)', not: 'Production web servers — Spot can be interrupted with 2-min notice' },
      { service: 'Global Accelerator', when: 'Need static IPs + low latency routing for TCP/UDP apps across regions', not: 'CloudFront — GA is for non-HTTP/TCP apps; CloudFront is for HTTP/HTTPS content' },
      { service: 'SQS', when: 'Decoupling components, handling traffic spikes, async processing', not: 'SNS — SQS is pull-based (consumer polls); SNS is push-based (fan-out)' },
      { service: 'Kinesis', when: 'Real-time streaming data, analytics, log ingestion at high velocity', not: 'SQS — Kinesis preserves order and supports multiple consumers; SQS does not' },
      { service: 'NAT Gateway', when: 'Private subnet instances need outbound internet access without exposing them', not: 'Internet Gateway — IGW is for public subnets only' },
      { service: 'VPC Endpoint', when: 'Access S3 or DynamoDB from private subnet without going through internet', not: 'NAT Gateway — VPC endpoints are free and stay within AWS network' },
    ],
    traps: [
      { trap: 'Multi-AZ vs Read Replicas', why: 'Multi-AZ is for high availability (failover). Read Replicas are for performance (read scaling). They are NOT the same thing.' },
      { trap: 'Scalability vs Availability', why: 'Auto Scaling = scalability. Multi-AZ = availability. Questions about "what if an AZ fails?" want Multi-AZ, not Auto Scaling.' },
      { trap: 'S3 is not a file system', why: 'EFS is a file system (NFS). S3 is object storage. Questions mentioning "mount" or "shared file system" → EFS, not S3.' },
      { trap: 'IAM roles vs IAM users for EC2', why: 'Always attach IAM roles to EC2 — never store access keys on instances. The exam will offer both; roles is always the answer.' },
      { trap: 'CloudFront signed URLs vs S3 pre-signed URLs', why: 'CloudFront signed URLs → control who accesses CloudFront content. S3 pre-signed URLs → temporary direct S3 access. Both look similar but are different.' },
      { trap: 'Reserved vs Spot vs On-Demand pricing', why: 'Reserved = predictable workload (save 72%). Spot = interruption-tolerant (save 90%). On-Demand = flexibility. Cost questions: Spot cheapest, Reserved next.' },
      { trap: 'SQS Standard vs FIFO', why: 'Standard = best-effort ordering, at-least-once delivery. FIFO = exactly-once, strict order, 3,000 msg/s max. If order matters → FIFO.' },
      { trap: 'Security Group vs NACL', why: 'SG = stateful (return traffic automatic), instance level. NACL = stateless (must allow inbound AND outbound), subnet level.' },
    ],
    architecturePatterns: [
      { name: 'Highly Available Web App', services: ['Route 53', 'ALB', 'EC2 (Multi-AZ)', 'Auto Scaling', 'RDS Multi-AZ'], use: 'Standard 3-tier HA architecture. Most common SAA-C03 pattern.' },
      { name: 'Serverless API', services: ['API Gateway', 'Lambda', 'DynamoDB'], use: 'No servers to manage, scales automatically, pay per request.' },
      { name: 'Static Website + CDN', services: ['S3', 'CloudFront', 'Route 53', 'ACM'], use: 'S3 hosts static files, CloudFront caches globally, ACM handles HTTPS.' },
      { name: 'Event-Driven Processing', services: ['S3', 'SQS', 'Lambda', 'DynamoDB'], use: 'S3 upload triggers SQS, Lambda processes queue, writes to DynamoDB.' },
      { name: 'Hybrid Connectivity', services: ['Direct Connect', 'VPN', 'Transit Gateway'], use: 'Direct Connect = dedicated line (consistent). VPN = encrypted overlay (backup).' },
    ],
  },
  {
    id: 'clf-c02',
    code: 'CLF-C02',
    name: 'Cloud Practitioner',
    icon: '☁️',
    color: '#0891b2',
    passingScore: 700,
    duration: 90,
    questions: 65,
    domains: [
      { name: 'Cloud Concepts', weight: 24, key: ['6 advantages of cloud', 'CapEx vs OpEx', 'Pay-as-you-go', 'Economies of scale', 'Global infrastructure'] },
      { name: 'Security & Compliance', weight: 30, key: ['Shared Responsibility Model', 'IAM', 'MFA', 'Encryption', 'Compliance programs'] },
      { name: 'Cloud Technology', weight: 34, key: ['EC2', 'S3', 'RDS', 'Lambda', 'CloudFront', 'VPC'] },
      { name: 'Billing & Pricing', weight: 12, key: ['Cost Explorer', 'Budgets', 'Pricing Calculator', 'Support plans', 'Reserved vs On-Demand'] },
    ],
    topServices: [
      { name: 'EC2', count: 180, domains: ['Technology'] },
      { name: 'S3', count: 140, domains: ['Technology'] },
      { name: 'IAM', count: 120, domains: ['Security'] },
      { name: 'RDS', count: 80, domains: ['Technology'] },
      { name: 'Lambda', count: 70, domains: ['Technology'] },
      { name: 'CloudFront', count: 60, domains: ['Technology'] },
      { name: 'VPC', count: 55, domains: ['Security', 'Technology'] },
      { name: 'CloudWatch', count: 50, domains: ['Technology'] },
      { name: 'DynamoDB', count: 45, domains: ['Technology'] },
      { name: 'Route 53', count: 40, domains: ['Technology'] },
    ],
    chooseWhen: [
      { service: 'EC2', when: 'Need full control over OS, custom software, persistent compute', not: 'Lambda — EC2 is not serverless and requires management' },
      { service: 'Lambda', when: 'Short-duration, event-driven, serverless functions (max 15 min)', not: 'EC2 — Lambda cannot run long-running or persistent processes' },
      { service: 'S3', when: 'Store and retrieve any amount of data, static website hosting, backups', not: 'EBS — EBS is attached to a single EC2; S3 is globally accessible' },
      { service: 'CloudWatch', when: 'Monitor AWS resources, set alarms, view metrics and logs', not: 'CloudTrail — CloudWatch is for performance metrics; CloudTrail is for API activity' },
      { service: 'Trusted Advisor', when: 'Get recommendations on cost, security, performance, fault tolerance', not: 'Cost Explorer — TA gives recommendations; CE shows spending patterns' },
    ],
    traps: [
      { trap: 'Shared Responsibility Model', why: 'AWS responsible for "security OF the cloud" (hardware, facilities, network). Customer responsible for "security IN the cloud" (data, IAM, OS patching).' },
      { trap: 'CapEx vs OpEx', why: 'On-premise = CapEx (upfront capital). Cloud = OpEx (operational, pay as you go). Cloud converts CapEx to OpEx.' },
      { trap: 'CloudTrail vs CloudWatch', why: 'CloudTrail = WHO did WHAT (API calls, audit log). CloudWatch = WHAT is happening (metrics, alarms, performance).' },
      { trap: 'Support plans', why: 'Basic (free) → Developer → Business → Enterprise On-Ramp → Enterprise. Only Business+ gets 24/7 phone support and a TAM at Enterprise.' },
    ],
    architecturePatterns: [
      { name: 'Basic Web Hosting', services: ['EC2', 'S3', 'RDS', 'Route 53'], use: 'Most common entry-level architecture.' },
      { name: 'Serverless', services: ['Lambda', 'API Gateway', 'DynamoDB', 'S3'], use: 'No infrastructure to manage.' },
      { name: 'Static Site', services: ['S3', 'CloudFront', 'Route 53'], use: 'Cheapest way to host a website.' },
    ],
  },
  {
    id: 'dva-c02',
    code: 'DVA-C02',
    name: 'Developer Associate',
    icon: '💻',
    color: '#7c3aed',
    passingScore: 720,
    duration: 130,
    questions: 65,
    domains: [
      { name: 'Development', weight: 32, key: ['SDK', 'CLI', 'APIs', 'Lambda', 'DynamoDB', 'S3 SDK', 'SQS/SNS'] },
      { name: 'Security', weight: 26, key: ['IAM roles', 'Cognito', 'KMS', 'Secrets Manager', 'STS'] },
      { name: 'Deployment', weight: 24, key: ['CodePipeline', 'CodeBuild', 'CodeDeploy', 'Elastic Beanstalk', 'CloudFormation'] },
      { name: 'Troubleshooting', weight: 18, key: ['X-Ray', 'CloudWatch Logs', 'CloudTrail', 'error codes', 'retry logic'] },
    ],
    topServices: [
      { name: 'Lambda', count: 200, domains: ['Development', 'Deployment'] },
      { name: 'DynamoDB', count: 180, domains: ['Development'] },
      { name: 'API Gateway', count: 150, domains: ['Development', 'Security'] },
      { name: 'SQS', count: 120, domains: ['Development'] },
      { name: 'Cognito', count: 100, domains: ['Security'] },
      { name: 'CloudFormation', count: 90, domains: ['Deployment'] },
      { name: 'X-Ray', count: 80, domains: ['Troubleshooting'] },
      { name: 'CodeDeploy', count: 75, domains: ['Deployment'] },
      { name: 'ElastiCache', count: 70, domains: ['Development'] },
      { name: 'Kinesis', count: 65, domains: ['Development'] },
    ],
    chooseWhen: [
      { service: 'Secrets Manager', when: 'Store and auto-rotate database credentials, API keys, secrets', not: 'Parameter Store — Secrets Manager has auto-rotation; Parameter Store is for config values' },
      { service: 'DynamoDB DAX', when: 'Need microsecond read latency for DynamoDB (in-memory cache)', not: 'ElastiCache — DAX is DynamoDB-specific; ElastiCache works with any DB' },
      { service: 'SQS FIFO', when: 'Message ordering matters, exactly-once processing required', not: 'SQS Standard — Standard is faster but unordered with possible duplicates' },
      { service: 'Cognito User Pools', when: 'User authentication (sign up, sign in, MFA)', not: 'Cognito Identity Pools — Identity Pools give AWS credentials; User Pools give JWT tokens' },
      { service: 'X-Ray', when: 'Trace and debug distributed applications, identify bottlenecks', not: 'CloudWatch — X-Ray shows request traces across services; CloudWatch shows metrics' },
    ],
    traps: [
      { trap: 'Lambda cold start', why: 'Cold starts happen when a new container is initialized. Provisioned Concurrency eliminates cold starts. SnapStart is for Java Lambdas.' },
      { trap: 'DynamoDB partition key design', why: 'High cardinality partition keys distribute data evenly. Poor partition key = hot partition = throttling. Always choose high-cardinality keys.' },
      { trap: 'CodeDeploy deployment types', why: 'In-place = replace on existing servers. Blue/Green = new fleet, swap traffic. Blue/Green has zero downtime.' },
      { trap: 'API Gateway integration types', why: 'Lambda Proxy = full request/response to Lambda. Lambda integration = transform request. Proxy is simpler and most common.' },
    ],
    architecturePatterns: [
      { name: 'Serverless API', services: ['API Gateway', 'Lambda', 'DynamoDB', 'Cognito'], use: 'Standard serverless REST API with auth.' },
      { name: 'CI/CD Pipeline', services: ['CodeCommit', 'CodeBuild', 'CodeDeploy', 'CodePipeline'], use: 'Full AWS-native CI/CD.' },
      { name: 'Event-Driven', services: ['SQS', 'Lambda', 'DynamoDB', 'SNS'], use: 'Decouple producers from consumers.' },
    ],
  },
]

// Remaining 9 cert cheat sheets
const REMAINING_SHEETS: CertCheatSheet[] = [
  {
    id: 'soa-c02',
    code: 'SOA-C02',
    name: 'SysOps Administrator Associate',
    icon: '⚙️',
    color: '#0369a1',
    passingScore: 720,
    duration: 130,
    questions: 65,
    domains: [
      { name: 'Monitoring, Logging & Remediation', weight: 20, key: ['CloudWatch Alarms', 'CloudWatch Logs', 'EventBridge', 'Systems Manager', 'AWS Config Rules'] },
      { name: 'Reliability & Business Continuity', weight: 16, key: ['Auto Scaling', 'Multi-AZ', 'Backup', 'Route 53 health checks', 'RDS snapshots'] },
      { name: 'Deployment, Provisioning & Automation', weight: 18, key: ['CloudFormation', 'OpsWorks', 'Elastic Beanstalk', 'AMI lifecycle', 'Systems Manager Patch Manager'] },
      { name: 'Security & Compliance', weight: 16, key: ['IAM', 'KMS', 'Secrets Manager', 'Config', 'Security Hub'] },
      { name: 'Networking & Content Delivery', weight: 18, key: ['VPC', 'Route 53', 'CloudFront', 'NAT Gateway', 'VPC Flow Logs'] },
      { name: 'Cost & Performance Optimization', weight: 12, key: ['Cost Explorer', 'Trusted Advisor', 'Compute Optimizer', 'Reserved Instances', 'S3 Intelligent-Tiering'] },
    ],
    topServices: [
      { name: 'CloudWatch', count: 52, domains: ['Monitoring'] },
      { name: 'Systems Manager', count: 47, domains: ['Deployment', 'Security'] },
      { name: 'CloudFormation', count: 42, domains: ['Deployment'] },
      { name: 'IAM', count: 40, domains: ['Security'] },
      { name: 'Route 53', count: 38, domains: ['Networking'] },
      { name: 'Auto Scaling', count: 35, domains: ['Reliability'] },
      { name: 'CloudTrail', count: 32, domains: ['Monitoring', 'Security'] },
      { name: 'EventBridge', count: 30, domains: ['Monitoring'] },
      { name: 'Config', count: 28, domains: ['Security', 'Compliance'] },
      { name: 'SNS', count: 25, domains: ['Monitoring'] },
    ],
    chooseWhen: [
      { service: 'Systems Manager Patch Manager', when: 'Automate OS patching across EC2 fleet without logging into each instance', not: 'Manual SSH patching — never scalable for ops teams' },
      { service: 'AWS Config', when: 'Track resource configuration changes over time, enforce compliance rules', not: 'CloudTrail — Config tracks WHAT changed; CloudTrail tracks WHO did it' },
      { service: 'CloudWatch Composite Alarms', when: 'Reduce alarm noise by combining multiple alarms into one actionable alert', not: 'Individual alarms — too many alerts = alert fatigue' },
      { service: 'EventBridge', when: 'React to AWS service events automatically (EC2 state change, Config rule violation)', not: 'CloudWatch Alarms — EventBridge is for events; CW Alarms are for metrics' },
      { service: 'Trusted Advisor', when: 'Get automated recommendations on cost, security, fault tolerance, performance', not: 'Manual reviews — Trusted Advisor automates the audit' },
      { service: 'Compute Optimizer', when: 'Right-size EC2 instances based on actual utilization data', not: 'Guessing instance sizes — Optimizer uses ML to recommend the right size' },
    ],
    traps: [
      { trap: 'CloudWatch vs CloudTrail vs Config', why: 'CloudWatch = metrics & performance. CloudTrail = API call audit log. Config = resource configuration history & compliance. All three appear together on SOA.' },
      { trap: 'Systems Manager Run Command vs Patch Manager', why: 'Run Command = ad-hoc commands on instances. Patch Manager = scheduled, automated patching across fleet. Patch Manager is always the ops answer.' },
      { trap: 'OpsWorks vs CloudFormation vs Elastic Beanstalk', why: 'CloudFormation = infrastructure as code (any AWS resource). Beanstalk = app deployment (managed platform). OpsWorks = Chef/Puppet configuration management.' },
      { trap: 'Health Dashboard vs CloudWatch', why: 'AWS Health Dashboard = AWS service outages affecting YOUR account. CloudWatch = your resource metrics. Different scopes.' },
    ],
    architecturePatterns: [
      { name: 'Automated Compliance', services: ['Config', 'Lambda', 'SNS', 'Systems Manager'], use: 'Config rule triggers Lambda on violation → SNS alert → SSM auto-remediation.' },
      { name: 'Patch Automation', services: ['Systems Manager', 'Patch Manager', 'Maintenance Windows', 'SNS'], use: 'Schedule patches across all EC2, notify on completion/failure.' },
      { name: 'Operational Alerting', services: ['CloudWatch', 'EventBridge', 'SNS', 'Lambda'], use: 'Metrics trigger alarms → EventBridge routes events → SNS/Lambda for response.' },
    ],
  },
  {
    id: 'dea-c01',
    code: 'DEA-C01',
    name: 'Data Engineer Associate',
    icon: '📊',
    color: '#0891b2',
    passingScore: 720,
    duration: 130,
    questions: 65,
    domains: [
      { name: 'Data Ingestion & Transformation', weight: 34, key: ['Glue ETL', 'Kinesis', 'DMS', 'DataSync', 'Glue DataBrew', 'Step Functions'] },
      { name: 'Store & Manage Data', weight: 26, key: ['S3 storage classes', 'Lake Formation', 'Redshift', 'DynamoDB', 'RDS', 'OpenSearch'] },
      { name: 'Operate Data Pipelines', weight: 22, key: ['Glue workflows', 'Step Functions', 'MWAA', 'CloudWatch', 'EventBridge'] },
      { name: 'Security & Governance', weight: 18, key: ['Lake Formation permissions', 'KMS', 'IAM', 'Macie', 'Glue data catalog'] },
    ],
    topServices: [
      { name: 'Glue', count: 40, domains: ['Ingestion', 'Operate'] },
      { name: 'S3', count: 38, domains: ['Storage'] },
      { name: 'Kinesis', count: 34, domains: ['Ingestion'] },
      { name: 'Lake Formation', count: 27, domains: ['Storage', 'Security'] },
      { name: 'Redshift', count: 20, domains: ['Storage'] },
      { name: 'Athena', count: 16, domains: ['Storage'] },
      { name: 'Lambda', count: 12, domains: ['Ingestion', 'Operate'] },
      { name: 'DynamoDB', count: 12, domains: ['Storage'] },
      { name: 'Step Functions', count: 10, domains: ['Operate'] },
      { name: 'CloudWatch', count: 9, domains: ['Operate'] },
    ],
    chooseWhen: [
      { service: 'Kinesis Data Streams', when: 'Real-time streaming ingestion with custom consumers, replay capability, multiple consumers', not: 'Kinesis Firehose — Firehose is managed delivery to S3/Redshift; KDS gives more control' },
      { service: 'Glue ETL', when: 'Serverless ETL to transform data at scale, catalog schemas, run Spark jobs', not: 'EMR — Glue is serverless; EMR requires cluster management but is more flexible' },
      { service: 'Lake Formation', when: 'Centralized data lake with fine-grained column/row access control', not: 'S3 bucket policies alone — Lake Formation gives row/column level security on top of S3' },
      { service: 'Redshift Spectrum', when: 'Query S3 data directly using Redshift SQL without loading it into Redshift', not: 'Loading all data into Redshift — Spectrum avoids storage costs for cold data' },
      { service: 'Athena', when: 'Ad-hoc SQL queries on S3 data, pay per query, no infrastructure', not: 'Redshift — Athena is serverless and great for ad-hoc; Redshift is for BI/dashboards' },
      { service: 'DMS', when: 'Migrate database to AWS with minimal downtime, continuous replication', not: 'Manual export/import — DMS handles ongoing replication during migration cutover' },
    ],
    traps: [
      { trap: 'Kinesis Streams vs Firehose vs Analytics', why: 'KDS = real-time streaming, you manage consumers. Firehose = managed delivery to S3/Redshift/OpenSearch. Analytics = SQL on streaming data. Often confused on DEA.' },
      { trap: 'Glue vs EMR', why: 'Glue = serverless Spark ETL, pay per DPU. EMR = managed Hadoop/Spark cluster, more control. If question says "serverless ETL" → Glue. "Custom Spark cluster" → EMR.' },
      { trap: 'Redshift vs Aurora vs DynamoDB', why: 'Redshift = analytics/data warehouse (OLAP). Aurora = transactional relational (OLTP). DynamoDB = key-value, ultra-low latency. Different use cases, all appear on DEA.' },
      { trap: 'S3 storage class selection', why: 'Standard = frequent access. IA = infrequent, quick retrieval. Glacier Instant = millisecond retrieval archive. Glacier = hours retrieval. Deep Archive = lowest cost, 12h+ retrieval.' },
    ],
    architecturePatterns: [
      { name: 'Modern Data Lake', services: ['S3', 'Glue', 'Lake Formation', 'Athena', 'QuickSight'], use: 'Ingest → catalog → govern → query → visualize.' },
      { name: 'Real-Time Pipeline', services: ['Kinesis Data Streams', 'Lambda', 'Kinesis Firehose', 'S3', 'Athena'], use: 'Stream → process → store → query.' },
      { name: 'Data Warehouse', services: ['S3', 'Glue', 'Redshift', 'QuickSight'], use: 'Land in S3 → transform with Glue → load to Redshift → visualize.' },
    ],
  },
  {
    id: 'mla-c01',
    code: 'MLA-C01',
    name: 'ML Engineer Associate',
    icon: '🤖',
    color: '#7c3aed',
    passingScore: 720,
    duration: 130,
    questions: 65,
    domains: [
      { name: 'Data Preparation', weight: 28, key: ['SageMaker Data Wrangler', 'Glue', 'S3', 'Feature Store', 'SageMaker Processing'] },
      { name: 'Model Development', weight: 26, key: ['SageMaker Training', 'Built-in algorithms', 'Hyperparameter tuning', 'SageMaker Experiments', 'Debugger'] },
      { name: 'Deployment & Orchestration', weight: 22, key: ['SageMaker Endpoints', 'Batch Transform', 'Model Monitor', 'Pipelines', 'A/B testing'] },
      { name: 'Monitoring & Governance', weight: 24, key: ['Model Monitor', 'Clarify', 'CloudWatch', 'SageMaker Experiments', 'Model Registry'] },
    ],
    topServices: [
      { name: 'SageMaker', count: 76, domains: ['All'] },
      { name: 'S3', count: 15, domains: ['Data Prep'] },
      { name: 'Glue', count: 8, domains: ['Data Prep'] },
      { name: 'CloudWatch', count: 6, domains: ['Monitoring'] },
      { name: 'Lambda', count: 3, domains: ['Deployment'] },
      { name: 'Kinesis', count: 2, domains: ['Data Prep'] },
      { name: 'Athena', count: 1, domains: ['Data Prep'] },
      { name: 'Step Functions', count: 1, domains: ['Orchestration'] },
      { name: 'ECR', count: 1, domains: ['Deployment'] },
      { name: 'IAM', count: 1, domains: ['Governance'] },
    ],
    chooseWhen: [
      { service: 'SageMaker Autopilot', when: 'Need AutoML — automatically trains and tunes models with full visibility', not: 'Manual training — Autopilot is faster for baseline models' },
      { service: 'SageMaker Batch Transform', when: 'Run inference on large datasets offline without a persistent endpoint', not: 'Real-time endpoint — Batch Transform is cheaper for non-real-time inference' },
      { service: 'SageMaker Feature Store', when: 'Share features across multiple ML models, ensure consistency between training and serving', not: 'Re-computing features per model — Feature Store prevents training/serving skew' },
      { service: 'SageMaker Model Monitor', when: 'Detect data drift and model quality degradation in production automatically', not: 'Manual monitoring — Model Monitor alerts you when predictions degrade' },
      { service: 'SageMaker Clarify', when: 'Detect bias in training data or model predictions, explain feature importance', not: 'CloudWatch — Clarify is ML-specific fairness/explainability; CW is for infrastructure metrics' },
      { service: 'SageMaker Pipelines', when: 'Build reproducible, automated ML workflows from data prep to deployment', not: 'Manual steps — Pipelines automate and version the entire ML lifecycle' },
    ],
    traps: [
      { trap: 'Overfitting vs Underfitting', why: 'Overfitting = model memorizes training data, bad on test data (high variance). Fix: more data, regularization, dropout. Underfitting = model too simple (high bias). Fix: more features, complex model.' },
      { trap: 'SageMaker endpoint types', why: 'Real-time = persistent, low-latency, always on. Async = large payloads, response in S3. Batch Transform = offline bulk inference. Serverless = variable traffic, cost-effective.' },
      { trap: 'Training/Serving skew', why: 'When features used in training differ from features at serving time. Feature Store prevents this. Model Monitor detects it after deployment.' },
      { trap: 'Hyperparameter tuning strategies', why: 'Random search = fast, good baseline. Grid search = exhaustive, slow. Bayesian = learns from prior trials, most efficient. SageMaker HPO uses Bayesian by default.' },
    ],
    architecturePatterns: [
      { name: 'Full ML Pipeline', services: ['S3', 'SageMaker Data Wrangler', 'SageMaker Training', 'Model Registry', 'SageMaker Endpoint'], use: 'Data → prepare → train → register → deploy.' },
      { name: 'MLOps with CI/CD', services: ['SageMaker Pipelines', 'CodePipeline', 'Model Monitor', 'CloudWatch'], use: 'Automated retraining when drift detected.' },
      { name: 'Batch Inference', services: ['S3', 'SageMaker Batch Transform', 'Lambda', 'DynamoDB'], use: 'Scheduled bulk predictions stored for downstream use.' },
    ],
  },
  {
    id: 'sap-c02',
    code: 'SAP-C02',
    name: 'Solutions Architect Professional',
    icon: '🏛️',
    color: '#1d4ed8',
    passingScore: 750,
    duration: 180,
    questions: 75,
    domains: [
      { name: 'Design for Organizational Complexity', weight: 26, key: ['AWS Organizations', 'Control Tower', 'SCP', 'Landing Zone', 'RAM', 'SSO'] },
      { name: 'Design for New Solutions', weight: 29, key: ['Well-Architected', 'event-driven', 'microservices', 'caching', 'resilience patterns'] },
      { name: 'Improve Existing Solutions', weight: 25, key: ['migration strategies', 'modernization', 'cost optimization', 'performance tuning'] },
      { name: 'Accelerate Workload Migration', weight: 20, key: ['DMS', 'SCT', 'DataSync', 'Snow family', 'Migration Hub'] },
    ],
    topServices: [
      { name: 'Lambda', count: 54, domains: ['New Solutions'] },
      { name: 'Config', count: 25, domains: ['Org Complexity'] },
      { name: 'S3', count: 25, domains: ['Storage'] },
      { name: 'DynamoDB', count: 25, domains: ['New Solutions'] },
      { name: 'DMS', count: 15, domains: ['Migration'] },
      { name: 'RDS', count: 18, domains: ['New Solutions'] },
      { name: 'EventBridge', count: 14, domains: ['New Solutions'] },
      { name: 'Route 53', count: 13, domains: ['New Solutions'] },
      { name: 'CloudTrail', count: 17, domains: ['Org Complexity'] },
      { name: 'IAM', count: 11, domains: ['Org Complexity'] },
    ],
    chooseWhen: [
      { service: 'AWS Organizations + SCP', when: 'Enforce guardrails across all accounts — prevent anyone from disabling CloudTrail, leaving specific regions', not: 'IAM policies alone — SCPs cannot be overridden even by account root users' },
      { service: 'Control Tower', when: 'Set up a new multi-account environment with pre-configured guardrails and account vending', not: 'Manual account setup — Control Tower automates Landing Zone creation' },
      { service: 'Resource Access Manager (RAM)', when: 'Share AWS resources (Transit Gateway, subnets, License Manager) across accounts without duplicating them', not: 'Deploying resources in every account — RAM avoids duplication and reduces cost' },
      { service: 'Migration Hub', when: 'Centralize tracking of application migrations across multiple tools (DMS, SMS, Server Migration)', not: 'Individual tool dashboards — Migration Hub gives a single pane of glass' },
      { service: 'DataSync', when: 'Transfer large amounts of data from on-premises NFS/SMB to S3/EFS/FSx automatically', not: 'DMS — DataSync is for file storage; DMS is for databases' },
      { service: 'Snow Family', when: 'Transfer petabyte-scale data offline when internet bandwidth is insufficient', not: 'Direct Connect for data migration — Snow is faster for massive one-time transfers' },
    ],
    traps: [
      { trap: 'SCP vs IAM policy', why: 'SCP = what actions are ALLOWED in an account (guardrail). IAM = what a principal CAN do. SCP restricts maximum permissions; IAM grants them within that boundary.' },
      { trap: '6 Rs of migration', why: 'Rehost (lift & shift), Replatform (lift & reshape), Repurchase (move to SaaS), Refactor (re-architect), Retire (decommission), Retain (keep on-prem). SAP loves these.' },
      { trap: 'RPO vs RTO', why: 'RPO = how much data can you lose (backup frequency). RTO = how fast must you recover (downtime tolerance). Pilot Light < Warm Standby < Multi-Site for decreasing RTO.' },
      { trap: 'Transit Gateway vs VPC Peering', why: 'VPC Peering = 1:1, no transitive routing, low cost. Transit Gateway = hub-and-spoke, supports transitive routing, scales to thousands of VPCs. SAP = TGW for complex networks.' },
    ],
    architecturePatterns: [
      { name: 'Multi-Account Landing Zone', services: ['Organizations', 'Control Tower', 'SSO', 'Config', 'CloudTrail'], use: 'Governance at scale across dozens of AWS accounts.' },
      { name: 'Database Migration', services: ['DMS', 'SCT', 'RDS', 'DataSync', 'Migration Hub'], use: 'Migrate heterogeneous DBs to AWS with minimal downtime.' },
      { name: 'Event-Driven Microservices', services: ['EventBridge', 'Lambda', 'SQS', 'DynamoDB', 'API Gateway'], use: 'Loosely coupled services that scale independently.' },
    ],
  },
  {
    id: 'dop-c02',
    code: 'DOP-C02',
    name: 'DevOps Engineer Professional',
    icon: '🔄',
    color: '#15803d',
    passingScore: 750,
    duration: 180,
    questions: 75,
    domains: [
      { name: 'SDLC Automation', weight: 22, key: ['CodePipeline', 'CodeBuild', 'CodeDeploy', 'CodeCommit', 'Artifact', 'GitHub Actions'] },
      { name: 'Configuration & IaC', weight: 17, key: ['CloudFormation', 'CDK', 'OpsWorks', 'Systems Manager', 'Elastic Beanstalk'] },
      { name: 'Resilient Cloud Solutions', weight: 15, key: ['Auto Scaling', 'Multi-AZ', 'Route 53', 'ELB', 'Chaos engineering'] },
      { name: 'Monitoring & Observability', weight: 15, key: ['CloudWatch', 'X-Ray', 'CloudTrail', 'EventBridge', 'OpenSearch'] },
      { name: 'Incident & Event Response', weight: 14, key: ['EventBridge', 'Lambda', 'SNS', 'Systems Manager OpsCenter', 'Auto Scaling'] },
      { name: 'Security & Compliance', weight: 17, key: ['IAM', 'Config', 'Security Hub', 'GuardDuty', 'Secrets Manager'] },
    ],
    topServices: [
      { name: 'CloudFormation', count: 55, domains: ['Config & IaC'] },
      { name: 'CodePipeline', count: 50, domains: ['SDLC'] },
      { name: 'CodeBuild', count: 48, domains: ['SDLC'] },
      { name: 'CodeDeploy', count: 45, domains: ['SDLC'] },
      { name: 'CloudWatch', count: 42, domains: ['Monitoring'] },
      { name: 'EventBridge', count: 38, domains: ['Incident', 'Monitoring'] },
      { name: 'Systems Manager', count: 35, domains: ['Config & IaC', 'Incident'] },
      { name: 'Lambda', count: 30, domains: ['Incident', 'SDLC'] },
      { name: 'Config', count: 28, domains: ['Security'] },
      { name: 'Auto Scaling', count: 25, domains: ['Resilience'] },
    ],
    chooseWhen: [
      { service: 'CodeDeploy Blue/Green', when: 'Zero-downtime deployments — shift traffic gradually, instant rollback if needed', not: 'In-place deployment — in-place has downtime during deployment' },
      { service: 'CloudFormation StackSets', when: 'Deploy CloudFormation stacks across multiple accounts and regions simultaneously', not: 'Individual stack per account — StackSets automate multi-account deployment' },
      { service: 'Systems Manager Parameter Store', when: 'Store configuration values, non-secret strings, references to secrets', not: 'Hardcoded config — Parameter Store centralizes config management' },
      { service: 'AWS CDK', when: 'Define infrastructure using familiar programming languages (Python, TypeScript, Java)', not: 'Raw CloudFormation YAML — CDK is higher abstraction and reusable' },
      { service: 'CodeBuild', when: 'Build, test, and package code without managing build servers', not: 'Jenkins on EC2 — CodeBuild is serverless, scales automatically, no server management' },
      { service: 'OpsWorks', when: 'Use Chef or Puppet for configuration management of EC2 instances', not: 'CloudFormation — OpsWorks is for app-layer config management; CloudFormation is infrastructure' },
    ],
    traps: [
      { trap: 'CodeDeploy deployment configs', why: 'AllAtOnce = fastest, highest risk. HalfAtATime = balanced. OneAtATime = slowest, lowest risk. Linear/Canary = gradual traffic shift for Lambda/ECS.' },
      { trap: 'CloudFormation change sets', why: 'Always preview changes with a change set before executing on production stacks. Change sets show what will be added, modified, or replaced.' },
      { trap: 'Blue/Green vs Canary vs Linear', why: 'Blue/Green = all-at-once traffic switch. Canary = small % first (e.g. 10%), then rest. Linear = gradually shift 10% every N minutes. All supported by CodeDeploy.' },
      { trap: 'EventBridge vs CloudWatch Events', why: 'They are the same service — CloudWatch Events was renamed to EventBridge. EventBridge has more features (partner events, schema registry). Use EventBridge.' },
    ],
    architecturePatterns: [
      { name: 'Full CI/CD Pipeline', services: ['CodeCommit', 'CodeBuild', 'CodeDeploy', 'CodePipeline', 'CloudFormation'], use: 'Source → Build → Test → Deploy → Infrastructure as Code.' },
      { name: 'GitOps Multi-Account', services: ['CodePipeline', 'CloudFormation StackSets', 'Organizations', 'CodeBuild'], use: 'One pipeline deploys to dev → staging → prod across accounts.' },
      { name: 'Auto Remediation', services: ['Config', 'EventBridge', 'Lambda', 'Systems Manager'], use: 'Config rule violation → EventBridge → Lambda → SSM auto-fix.' },
    ],
  },
  {
    id: 'scs-c03',
    code: 'SCS-C03',
    name: 'Security Specialty',
    icon: '🔒',
    color: '#dc2626',
    passingScore: 750,
    duration: 170,
    questions: 65,
    domains: [
      { name: 'Threat Detection & Incident Response', weight: 14, key: ['GuardDuty', 'Detective', 'Security Hub', 'Macie', 'WAF'] },
      { name: 'Security Logging & Monitoring', weight: 18, key: ['CloudTrail', 'VPC Flow Logs', 'CloudWatch', 'Config', 'Athena'] },
      { name: 'Infrastructure Security', weight: 20, key: ['Security Groups', 'NACLs', 'WAF', 'Shield', 'Network Firewall', 'PrivateLink'] },
      { name: 'Identity & Access Management', weight: 16, key: ['IAM policies', 'SCP', 'Permission boundaries', 'Cognito', 'AWS SSO'] },
      { name: 'Data Protection', weight: 32, key: ['KMS', 'ACM', 'Secrets Manager', 'Macie', 'S3 encryption', 'RDS encryption'] },
    ],
    topServices: [
      { name: 'CloudTrail', count: 65, domains: ['Logging'] },
      { name: 'S3', count: 51, domains: ['Data Protection'] },
      { name: 'IAM', count: 45, domains: ['IAM'] },
      { name: 'GuardDuty', count: 32, domains: ['Threat Detection'] },
      { name: 'EC2', count: 31, domains: ['Infrastructure'] },
      { name: 'KMS', count: 29, domains: ['Data Protection'] },
      { name: 'Lambda', count: 24, domains: ['Incident Response'] },
      { name: 'WAF', count: 21, domains: ['Infrastructure'] },
      { name: 'RDS', count: 17, domains: ['Data Protection'] },
      { name: 'Detective', count: 14, domains: ['Threat Detection'] },
    ],
    chooseWhen: [
      { service: 'GuardDuty', when: 'Detect threats automatically using ML — compromised EC2, unusual API calls, crypto mining', not: 'CloudTrail alone — CT logs; GD analyzes and alerts on suspicious patterns' },
      { service: 'AWS Detective', when: 'Investigate a security finding — visualize who did what, when, with what resources', not: 'GuardDuty — GD detects threats; Detective helps you investigate them' },
      { service: 'KMS Customer Managed Key', when: 'Need control over key rotation, key policy, and audit of key usage', not: 'AWS managed key — CMKs give you full control; AWS managed keys rotate automatically but you cant control policy' },
      { service: 'Permission Boundary', when: 'Delegate IAM creation to developers but cap their maximum permissions', not: 'SCP — Permission boundaries apply to a single IAM entity; SCPs apply to entire accounts' },
      { service: 'PrivateLink', when: 'Expose a service to other VPCs privately without VPC peering or internet', not: 'VPC Peering — PrivateLink is one-directional, more secure; Peering exposes entire VPCs' },
      { service: 'Macie', when: 'Discover and protect sensitive data (PII, credentials) in S3 automatically', not: 'Manual S3 audits — Macie uses ML to continuously scan and classify S3 data' },
    ],
    traps: [
      { trap: 'KMS key types', why: 'AWS owned = free, no control. AWS managed = free/cheap, auto-rotate, limited control. Customer managed = $1/month, full control, custom rotation. SCS always prefers CMK for compliance.' },
      { trap: 'GuardDuty vs Macie vs Inspector vs Security Hub', why: 'GuardDuty = threat detection (behavior). Macie = sensitive data in S3. Inspector = vulnerability scanning (EC2/Lambda/ECR). Security Hub = aggregates findings from all three.' },
      { trap: 'S3 bucket policy vs ACL vs IAM', why: 'Use bucket policies for cross-account access. Use IAM for same-account principals. Never use ACLs (legacy, disabled by default now). SCS exam: bucket policies for cross-account.' },
      { trap: 'CloudTrail management vs data events', why: 'Management events = control plane (create bucket, launch EC2) — enabled by default. Data events = data plane (S3 GetObject, Lambda invoke) — must be explicitly enabled, costs extra.' },
    ],
    architecturePatterns: [
      { name: 'Security Operations Center', services: ['GuardDuty', 'Security Hub', 'Detective', 'CloudTrail', 'EventBridge', 'SNS'], use: 'Detect → aggregate → investigate → alert.' },
      { name: 'Data Protection Pipeline', services: ['Macie', 'KMS', 'S3', 'Lake Formation', 'CloudTrail'], use: 'Classify sensitive data → encrypt → govern access → audit.' },
      { name: 'Zero Trust Network', services: ['PrivateLink', 'Network Firewall', 'WAF', 'IAM', 'Cognito'], use: 'Never trust, always verify — private connectivity everywhere.' },
    ],
  },
  {
    id: 'ans-c01',
    code: 'ANS-C01',
    name: 'Advanced Networking Specialty',
    icon: '🌐',
    color: '#0369a1',
    passingScore: 750,
    duration: 170,
    questions: 65,
    domains: [
      { name: 'Network Design', weight: 30, key: ['VPC design', 'CIDR planning', 'Transit Gateway', 'PrivateLink', 'IPv6'] },
      { name: 'Network Implementation', weight: 26, key: ['Direct Connect', 'VPN', 'BGP', 'Route tables', 'VPC peering'] },
      { name: 'Network Management', weight: 20, key: ['VPC Flow Logs', 'Network Manager', 'CloudWatch', 'Route 53 Resolver', 'Traffic Mirroring'] },
      { name: 'Network Security', weight: 24, key: ['Network Firewall', 'WAF', 'Shield', 'Security Groups', 'NACLs', 'PrivateLink'] },
    ],
    topServices: [
      { name: 'VPC', count: 61, domains: ['Design', 'Implementation'] },
      { name: 'Transit Gateway', count: 40, domains: ['Design'] },
      { name: 'Direct Connect', count: 30, domains: ['Implementation'] },
      { name: 'VPN', count: 26, domains: ['Implementation'] },
      { name: 'Network Firewall', count: 21, domains: ['Security'] },
      { name: 'Route 53', count: 17, domains: ['Management'] },
      { name: 'Flow Logs', count: 13, domains: ['Management'] },
      { name: 'CloudFront', count: 12, domains: ['Design'] },
      { name: 'NLB', count: 10, domains: ['Design'] },
      { name: 'VPC Peering', count: 9, domains: ['Design'] },
    ],
    chooseWhen: [
      { service: 'Transit Gateway', when: 'Connect many VPCs and on-premises networks — hub-and-spoke, supports transitive routing', not: 'VPC Peering — Peering is 1:1, no transitive routing; TGW scales to thousands of VPCs' },
      { service: 'Direct Connect', when: 'Dedicated, consistent bandwidth connection to AWS — compliance, predictable latency', not: 'VPN — VPN goes over internet (variable latency); DX is dedicated (consistent)' },
      { service: 'Direct Connect + VPN', when: 'Encrypt Direct Connect traffic for compliance (DX is not encrypted by default)', not: 'DX alone — DX provides dedicated line but no encryption; add VPN over DX for encryption' },
      { service: 'Network Firewall', when: 'Deep packet inspection, stateful filtering, IDS/IPS at the VPC level', not: 'Security Groups/NACLs — SG/NACL are simple L4 filtering; Network Firewall is full L7' },
      { service: 'PrivateLink', when: 'Expose a service endpoint privately to other VPCs without routing/peering complexity', not: 'Transit Gateway for service exposure — PrivateLink is simpler, more secure for service endpoints' },
      { service: 'Route 53 Resolver', when: 'Resolve DNS between on-premises and VPC — forward DNS queries in both directions', not: 'Custom DNS servers — Route 53 Resolver is managed and integrates natively with VPC DNS' },
    ],
    traps: [
      { trap: 'BGP over Direct Connect', why: 'DX uses BGP for route advertisement. Private VIF = connects to VPC. Public VIF = connects to AWS public services. Transit VIF = connects to Transit Gateway. Different VIFs for different connectivity.' },
      { trap: 'VPC Peering limitations', why: 'No transitive routing. No overlapping CIDRs. No edge-to-edge routing via peering. If you need any of these → Transit Gateway.' },
      { trap: 'Security Group vs NACL', why: 'SG = stateful (tracks connections), applied to ENI. NACL = stateless (must allow inbound AND outbound separately), applied to subnet. ANS: NACLs for subnet-level deny rules.' },
      { trap: 'Global Accelerator vs CloudFront', why: 'GA = TCP/UDP, static IPs, routes to nearest healthy endpoint. CloudFront = HTTP/HTTPS, CDN for content caching. GA does not cache; CloudFront does.' },
    ],
    architecturePatterns: [
      { name: 'Hub-and-Spoke Multi-VPC', services: ['Transit Gateway', 'VPC', 'Network Firewall', 'Direct Connect'], use: 'All VPCs connect to TGW hub, all traffic inspected by Network Firewall.' },
      { name: 'Hybrid Connectivity', services: ['Direct Connect', 'VPN', 'Transit Gateway', 'Route 53 Resolver'], use: 'DX for primary, VPN for backup, TGW for routing, R53 for DNS.' },
      { name: 'Secure Service Exposure', services: ['NLB', 'PrivateLink', 'VPC Endpoint', 'Security Groups'], use: 'Expose service privately without peering — consumer sees only the endpoint.' },
    ],
  },
  {
    id: 'aif-c01',
    code: 'AIF-C01',
    name: 'AI Practitioner',
    icon: '🧠',
    color: '#7c3aed',
    passingScore: 700,
    duration: 90,
    questions: 65,
    domains: [
      { name: 'AI & ML Fundamentals', weight: 20, key: ['supervised vs unsupervised', 'training/test split', 'overfitting', 'bias vs variance', 'neural networks'] },
      { name: 'Generative AI Fundamentals', weight: 24, key: ['LLMs', 'foundation models', 'prompt engineering', 'RAG', 'fine-tuning', 'embeddings'] },
      { name: 'Foundation Models on AWS', weight: 28, key: ['Amazon Bedrock', 'model selection', 'inference parameters', 'knowledge bases', 'Agents'] },
      { name: 'Responsible AI', weight: 14, key: ['bias', 'fairness', 'transparency', 'hallucination', 'model cards', 'SageMaker Clarify'] },
      { name: 'Security & Compliance for AI', weight: 14, key: ['IAM for Bedrock', 'VPC endpoints', 'data privacy', 'model access control', 'audit logging'] },
    ],
    topServices: [
      { name: 'Bedrock', count: 56, domains: ['Foundation Models'] },
      { name: 'SageMaker', count: 31, domains: ['AI & ML'] },
      { name: 'S3', count: 9, domains: ['Foundation Models'] },
      { name: 'Comprehend', count: 6, domains: ['AI & ML'] },
      { name: 'Rekognition', count: 5, domains: ['AI & ML'] },
      { name: 'IAM', count: 5, domains: ['Security'] },
      { name: 'Lambda', count: 4, domains: ['Foundation Models'] },
      { name: 'KMS', count: 3, domains: ['Security'] },
      { name: 'CloudWatch', count: 3, domains: ['Security'] },
      { name: 'Textract', count: 2, domains: ['AI & ML'] },
    ],
    chooseWhen: [
      { service: 'Amazon Bedrock', when: 'Access foundation models (Claude, Titan, Llama) via API without managing infrastructure', not: 'SageMaker for GenAI — Bedrock is managed, no model hosting; SageMaker requires more setup' },
      { service: 'Bedrock Knowledge Bases (RAG)', when: 'Ground LLM responses in your own documents to reduce hallucinations', not: 'Fine-tuning — RAG is faster and cheaper for adding knowledge; fine-tuning changes model behavior' },
      { service: 'Bedrock Agents', when: 'Build AI assistants that take multi-step actions using tools and APIs', not: 'Simple prompt/response — Agents handle reasoning and action sequences' },
      { service: 'SageMaker Clarify', when: 'Detect bias in datasets or model predictions, generate explainability reports', not: 'Manual inspection — Clarify automates fairness analysis across demographic groups' },
      { service: 'Amazon Comprehend', when: 'NLP tasks — sentiment analysis, entity extraction, language detection on text', not: 'Bedrock for simple NLP — Comprehend is purpose-built and cheaper for standard NLP tasks' },
      { service: 'Amazon Rekognition', when: 'Image/video analysis — object detection, facial recognition, content moderation', not: 'Custom CV model — Rekognition is pre-trained and requires no ML expertise' },
    ],
    traps: [
      { trap: 'RAG vs Fine-tuning', why: 'RAG = retrieval-augmented generation — inject external knowledge at inference time. Fine-tuning = update model weights with new data. RAG is faster/cheaper for knowledge; fine-tuning for behavior.' },
      { trap: 'Temperature vs Top-P', why: 'Temperature = randomness (0=deterministic, 1=creative). Top-P = nucleus sampling (considers tokens with top P cumulative probability). Both control output diversity.' },
      { trap: 'Hallucination mitigation', why: 'Hallucinations = confident but wrong answers. Mitigate with: RAG (ground in facts), lower temperature, prompt engineering, human review. Cannot be fully eliminated.' },
      { trap: 'Foundation model vs custom model', why: 'Foundation model = pre-trained on massive data, general purpose (Bedrock). Custom = trained from scratch or fine-tuned (SageMaker). Foundation models are almost always the right answer on AIF.' },
    ],
    architecturePatterns: [
      { name: 'RAG Application', services: ['Bedrock', 'Knowledge Bases', 'S3', 'OpenSearch', 'Lambda'], use: 'User query → retrieve relevant docs → augment prompt → generate grounded answer.' },
      { name: 'AI Agent Workflow', services: ['Bedrock Agents', 'Lambda', 'API Gateway', 'DynamoDB'], use: 'Agent reasons → calls Lambda tools → stores state → returns result.' },
      { name: 'Content Moderation', services: ['Rekognition', 'Comprehend', 'Lambda', 'SNS'], use: 'Analyze image/text → detect violations → alert or block.' },
    ],
  },
  {
    id: 'gai-c01',
    code: 'GAI-C01',
    name: 'Generative AI Specialty',
    icon: '✨',
    color: '#9333ea',
    passingScore: 750,
    duration: 170,
    questions: 65,
    domains: [
      { name: 'Generative AI Design', weight: 30, key: ['architecture patterns', 'RAG', 'Agents', 'multi-modal', 'chain-of-thought', 'prompt engineering'] },
      { name: 'Foundation Model Selection', weight: 20, key: ['model capabilities', 'cost vs performance', 'context window', 'Bedrock model catalog', 'embeddings'] },
      { name: 'Optimization', weight: 25, key: ['fine-tuning', 'RLHF', 'prompt optimization', 'inference parameters', 'latency vs cost'] },
      { name: 'Responsible AI', weight: 25, key: ['hallucination', 'bias', 'fairness', 'privacy', 'guardrails', 'model cards'] },
    ],
    topServices: [
      { name: 'Bedrock', count: 55, domains: ['All'] },
      { name: 'Organizations', count: 18, domains: ['Security'] },
      { name: 'SageMaker', count: 15, domains: ['Optimization'] },
      { name: 'Lambda', count: 12, domains: ['Design'] },
      { name: 'S3', count: 10, domains: ['Design'] },
      { name: 'OpenSearch', count: 8, domains: ['Design (RAG)'] },
      { name: 'Secrets Manager', count: 5, domains: ['Security'] },
      { name: 'CloudWatch', count: 5, domains: ['Monitoring'] },
      { name: 'KMS', count: 4, domains: ['Security'] },
      { name: 'IAM', count: 4, domains: ['Security'] },
    ],
    chooseWhen: [
      { service: 'Bedrock Guardrails', when: 'Filter harmful content, block topics, detect PII in both prompts and responses', not: 'Manual filtering in Lambda — Guardrails is managed, consistent, and applied at the model level' },
      { service: 'Bedrock Fine-tuning', when: 'Adapt a foundation model to your specific domain/style/task with labeled examples', not: 'Prompt engineering alone — fine-tuning improves consistency; prompts are more flexible but less reliable' },
      { service: 'Bedrock Model Evaluation', when: 'Compare foundation models on your specific use case before committing', not: 'Picking a model by name — evaluation uses your data to find the best fit' },
      { service: 'Embeddings + Vector Store', when: 'Semantic search — find documents similar in meaning, not just keyword match', not: 'Keyword search (OpenSearch BM25) — embeddings capture meaning, not just words' },
      { service: 'Chain-of-thought prompting', when: 'Complex reasoning tasks — ask model to show its work step by step', not: 'Direct answer prompting for hard problems — CoT dramatically improves accuracy on multi-step reasoning' },
      { service: 'RLHF (Reinforcement Learning from Human Feedback)', when: 'Align model behavior to human preferences — reduce harmful outputs, improve helpfulness', not: 'Standard fine-tuning — RLHF specifically optimizes for human approval' },
    ],
    traps: [
      { trap: 'Context window limits', why: 'Foundation models have fixed context windows (input + output tokens). RAG helps by retrieving only relevant chunks. Chunking strategy matters — too large = noisy, too small = loses context.' },
      { trap: 'Prompt injection attacks', why: 'Malicious user input overrides system prompt or instructions. Mitigate with: input validation, Bedrock Guardrails, sandboxing. A real security concern for GenAI applications.' },
      { trap: 'Fine-tuning vs prompt engineering vs RAG', why: 'Prompt engineering = no training, immediate, flexible. RAG = add external knowledge at inference. Fine-tuning = retrain weights, expensive, for behavioral changes. Use in this order: prompt → RAG → fine-tune.' },
      { trap: 'Hallucination vs bias', why: 'Hallucination = model confidently generates false information. Bias = model systematically favors certain outputs due to training data. Different problems, different mitigations.' },
    ],
    architecturePatterns: [
      { name: 'Production RAG System', services: ['Bedrock', 'Knowledge Bases', 'OpenSearch', 'Bedrock Guardrails', 'CloudWatch'], use: 'Grounded answers + safety filters + monitoring for production GenAI.' },
      { name: 'Fine-tuned Model Pipeline', services: ['S3', 'Bedrock Fine-tuning', 'Model Evaluation', 'Lambda', 'API Gateway'], use: 'Prepare data → fine-tune → evaluate → deploy → serve.' },
      { name: 'Multi-Agent System', services: ['Bedrock Agents', 'Lambda', 'Bedrock Knowledge Bases', 'DynamoDB', 'SNS'], use: 'Orchestrator agent delegates to specialist agents for complex tasks.' },
    ],
  },
]

const ALL_SHEETS: CertCheatSheet[] = [...SHEETS, ...REMAINING_SHEETS]

export default function CheatSheets() {
  const [selectedId, setSelectedId] = useState('saa-c03')
  const [activeTab, setActiveTab] = useState<'domains' | 'services' | 'choose' | 'traps' | 'patterns'>('domains')

  const sheet = ALL_SHEETS.find(s => s.id === selectedId)

  const tabs: { id: typeof activeTab; label: string }[] = [
    { id: 'domains', label: '📋 Domains' },
    { id: 'services', label: '🔥 Top Services' },
    { id: 'choose', label: '✅ Choose When' },
    { id: 'traps', label: '⚠️ Traps' },
    { id: 'patterns', label: '🏗️ Patterns' },
  ]

  return (
    <Layout>
      {/* Hero */}
      <div style={{ background: 'linear-gradient(160deg, #0f172a 0%, #1e3a8a 60%, #1d4ed8 100%)', padding: '3.5rem 1.5rem 2.5rem', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-60px', left: '15%', width: '300px', height: '300px', background: 'rgba(96,165,250,0.12)', borderRadius: '50%', filter: 'blur(70px)', pointerEvents: 'none' }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '999px', padding: '0.4rem 1rem', marginBottom: '1.25rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#93c5fd', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Mined from 3,958 questions</span>
          </div>
          <h1 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 900, color: '#fff', marginBottom: '0.75rem', letterSpacing: '-0.02em' }}>
            AWS Certification Cheat Sheets
          </h1>
          <p style={{ color: '#93c5fd', fontSize: '1rem', maxWidth: '500px', margin: '0 auto', lineHeight: 1.7 }}>
            Exam domains, top tested services, choose-when patterns, and traps — extracted from real practice questions.
          </p>
        </div>
      </div>

      <div style={{ maxWidth: '960px', margin: '0 auto', padding: '2rem 1.5rem' }}>

        {/* Cert selector */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
          {ALL_SHEETS.map(s => (
            <button
              key={s.id}
              onClick={() => { setSelectedId(s.id); setActiveTab('domains') }}
              style={{
                padding: '0.45rem 1rem', borderRadius: '999px', fontSize: '0.8rem', fontWeight: 700,
                border: 'none', cursor: 'pointer',
                background: selectedId === s.id ? s.color : '#fff',
                color: selectedId === s.id ? '#fff' : '#6b7280',
                boxShadow: selectedId === s.id ? 'none' : '0 0 0 1px #e5e7eb',
              }}
            >
              {s.icon} {s.code}
            </button>
          ))}
        </div>

        {/* Full sheet */}
        {sheet && (
          <>
            {/* Sheet header */}
            <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '1.25rem', padding: '1.5rem 1.75rem', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: sheet.color, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.25rem' }}>{sheet.code}</div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#111827', margin: '0 0 0.25rem' }}>{sheet.name}</h2>
                <div style={{ display: 'flex', gap: '1.25rem', fontSize: '0.8rem', color: '#6b7280', fontWeight: 600 }}>
                  <span>⏱ {sheet.duration} min</span>
                  <span>❓ {sheet.questions} questions</span>
                  <span>🎯 {sheet.passingScore}/1000 to pass</span>
                </div>
              </div>
              <Link to={`/cert/${sheet.id}`} style={{ padding: '0.625rem 1.25rem', background: sheet.color, color: '#fff', borderRadius: '0.75rem', fontWeight: 700, fontSize: '0.85rem', textDecoration: 'none', whiteSpace: 'nowrap' }}>
                Practice Questions →
              </Link>
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: '0.375rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
              {tabs.map(t => (
                <button
                  key={t.id}
                  onClick={() => setActiveTab(t.id)}
                  style={{
                    padding: '0.5rem 1rem', borderRadius: '0.75rem', fontSize: '0.82rem', fontWeight: 700,
                    border: 'none', cursor: 'pointer',
                    background: activeTab === t.id ? sheet.color : '#f3f4f6',
                    color: activeTab === t.id ? '#fff' : '#374151',
                  }}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* Tab: Domains */}
            {activeTab === 'domains' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {sheet.domains.map(d => (
                  <div key={d.name} style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '1rem', padding: '1.25rem 1.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                      <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#111827', margin: 0 }}>{d.name}</h3>
                      <span style={{ background: sheet.color, color: '#fff', borderRadius: '999px', padding: '0.2rem 0.75rem', fontSize: '0.8rem', fontWeight: 800 }}>{d.weight}%</span>
                    </div>
                    <div style={{ width: '100%', height: '6px', background: '#f3f4f6', borderRadius: '999px', marginBottom: '1rem' }}>
                      <div style={{ width: `${d.weight}%`, height: '100%', background: sheet.color, borderRadius: '999px' }} />
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      {d.key.map(k => (
                        <span key={k} style={{ background: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: '0.5rem', padding: '0.25rem 0.625rem', fontSize: '0.75rem', fontWeight: 700, color: '#0369a1' }}>
                          {k}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Tab: Top Services */}
            {activeTab === 'services' && (
              <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '1rem', overflow: 'hidden' }}>
                <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid #f3f4f6', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#111827', margin: 0 }}>Most Tested Services</h3>
                  <span style={{ fontSize: '0.75rem', color: '#6b7280', fontWeight: 600 }}>computed from {sheet.code} question data</span>
                </div>
                {sheet.topServices.map((svc, i) => {
                  const max = sheet.topServices[0].count
                  const pct = Math.round((svc.count / max) * 100)
                  return (
                    <div key={svc.name} style={{ padding: '0.875rem 1.5rem', borderBottom: i < sheet.topServices.length - 1 ? '1px solid #f9fafb' : 'none', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#9ca3af', width: '20px', textAlign: 'right' }}>#{i + 1}</span>
                      <span style={{ fontSize: '0.9rem', fontWeight: 800, color: '#111827', width: '140px' }}>{svc.name}</span>
                      <div style={{ flex: 1, height: '8px', background: '#f3f4f6', borderRadius: '999px' }}>
                        <div style={{ width: `${pct}%`, height: '100%', background: sheet.color, borderRadius: '999px', opacity: 0.8 }} />
                      </div>
                      <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#374151', width: '60px', textAlign: 'right' }}>{svc.count} q's</span>
                      <div style={{ display: 'flex', gap: '0.25rem', flexWrap: 'wrap', width: '120px' }}>
                        {svc.domains.map(d => (
                          <span key={d} style={{ fontSize: '0.65rem', fontWeight: 700, color: sheet.color, background: `${sheet.color}15`, borderRadius: '0.375rem', padding: '0.1rem 0.4rem' }}>{d}</span>
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}

            {/* Tab: Choose When */}
            {activeTab === 'choose' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                {sheet.chooseWhen.map((item, i) => (
                  <div key={i} style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '1rem', padding: '1.25rem 1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '0.625rem' }}>
                      <span style={{ background: sheet.color, color: '#fff', borderRadius: '0.5rem', padding: '0.2rem 0.75rem', fontSize: '0.8rem', fontWeight: 800 }}>{item.service}</span>
                    </div>
                    <p style={{ margin: '0 0 0.625rem', fontSize: '0.875rem', color: '#111827', lineHeight: 1.6 }}>
                      <span style={{ fontWeight: 700, color: '#16a34a' }}>✓ Use when: </span>{item.when}
                    </p>
                    <p style={{ margin: 0, fontSize: '0.82rem', color: '#6b7280', lineHeight: 1.6 }}>
                      <span style={{ fontWeight: 700, color: '#dc2626' }}>✗ Not: </span>{item.not}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* Tab: Traps */}
            {activeTab === 'traps' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                {sheet.traps.map((item, i) => (
                  <div key={i} style={{ background: '#fff', border: '1px solid #fecaca', borderRadius: '1rem', padding: '1.25rem 1.5rem', borderLeft: `4px solid #dc2626` }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                      <span style={{ fontSize: '1rem' }}>⚠️</span>
                      <span style={{ fontSize: '0.9rem', fontWeight: 800, color: '#dc2626' }}>{item.trap}</span>
                    </div>
                    <p style={{ margin: 0, fontSize: '0.85rem', color: '#374151', lineHeight: 1.65 }}>{item.why}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Tab: Architecture Patterns */}
            {activeTab === 'patterns' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                {sheet.architecturePatterns.map((p, i) => (
                  <div key={i} style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '1rem', padding: '1.25rem 1.5rem' }}>
                    <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#111827', margin: '0 0 0.75rem' }}>{p.name}</h3>
                    <div style={{ display: 'flex', gap: '0.375rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
                      {p.services.map((s, si) => (
                        <span key={s} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                          <span style={{ background: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: '0.5rem', padding: '0.25rem 0.625rem', fontSize: '0.75rem', fontWeight: 700, color: '#0369a1' }}>{s}</span>
                          {si < p.services.length - 1 && <span style={{ color: '#9ca3af', fontSize: '0.75rem' }}>→</span>}
                        </span>
                      ))}
                    </div>
                    <p style={{ margin: 0, fontSize: '0.82rem', color: '#6b7280', lineHeight: 1.6 }}>{p.use}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Practice CTA */}
            <div style={{ marginTop: '2rem', background: 'linear-gradient(135deg, #0f172a, #1e3a8a)', borderRadius: '1.25rem', padding: '1.5rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              <div>
                <p style={{ fontSize: '0.9rem', fontWeight: 800, color: '#fff', margin: '0 0 0.25rem' }}>Ready to test yourself?</p>
                <p style={{ fontSize: '0.82rem', color: '#93c5fd', margin: 0 }}>Practice with real {sheet.code} questions to reinforce what you just studied.</p>
              </div>
              <Link to={`/cert/${sheet.id}`} style={{ flexShrink: 0, padding: '0.625rem 1.25rem', background: sheet.color, color: '#fff', borderRadius: '0.75rem', fontWeight: 700, fontSize: '0.85rem', textDecoration: 'none' }}>
                Start Practicing →
              </Link>
            </div>
          </>
        )}
      </div>
    </Layout>
  )
}
