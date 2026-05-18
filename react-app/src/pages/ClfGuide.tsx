/**
 * ClfGuide.tsx — The Complete CLF-C02 Study Encyclopedia
 * Tabs: Decision Matrix · Exam Traps · Deep Dives · Study Plan · Quick Reference · Exam Strategy
 * isPremium gate. CLF-C02 exclusive.
 */
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import { useAuth } from '../contexts/AuthContext'
import { useCertAccess } from '../hooks/useCertAccess'

type Tab = 'matrix' | 'traps' | 'deepdives' | 'studyplan' | 'reference' | 'strategy' | 'codex'

// ─── DECISION MATRIX ─────────────────────────────────────────────────────────
interface MatrixRow { requirement: string; solution: string; why: string }

const MATRIX: MatrixRow[] = [
  // Cloud Concepts
  { requirement: 'Run servers without buying physical hardware', solution: 'Cloud Computing (IaaS)', why: 'On-demand access to compute, storage, and networking over the internet. Pay-as-you-go model eliminates upfront CapEx.' },
  { requirement: 'Scale instantly to handle traffic spikes', solution: 'Elasticity / Auto Scaling', why: 'Cloud resources expand and contract on demand. Traditional data centers are fixed capacity and cannot react instantly.' },
  { requirement: 'Go global in minutes / deploy to multiple regions', solution: 'AWS Global Infrastructure', why: '30+ Regions, 100+ AZs worldwide. Deploy your app to any region with a few clicks — months faster than building a data center.' },
  { requirement: 'Reduce capital expenditure / no upfront cost', solution: 'OpEx model (pay-as-you-go)', why: 'Cloud trades large CapEx (servers, facilities) for small, variable OpEx (monthly bill). No depreciation, no over-provisioning.' },
  { requirement: 'Deploy to private company data center only', solution: 'Private Cloud / On-Premises', why: 'All infrastructure managed and owned by the organisation. Maximum control, but highest cost and least elasticity.' },
  { requirement: 'Keep sensitive workloads on-prem + use cloud for bursting', solution: 'Hybrid Cloud', why: 'Hybrid connects on-premises infrastructure to AWS. Sensitive data stays local; elastic workloads burst to cloud.' },
  { requirement: 'Use software without installing or managing it', solution: 'SaaS (Software as a Service)', why: 'Provider manages everything — hardware, OS, middleware, application. You just use the software (e.g., Gmail, Salesforce, Amazon Chime).' },
  { requirement: 'Deploy on a managed platform — no OS patches', solution: 'PaaS (Platform as a Service)', why: 'Provider manages OS, runtime, scaling. You deploy code only. Example: AWS Elastic Beanstalk, AWS Amplify.' },
  { requirement: 'Rent raw compute / storage / networking — manage OS yourself', solution: 'IaaS (Infrastructure as a Service)', why: 'Provider manages physical hardware and virtualisation. You manage OS, middleware, applications. Example: Amazon EC2.' },

  // Compute
  { requirement: 'Run virtual servers / full OS control', solution: 'Amazon EC2', why: 'EC2 = resizable compute capacity. You choose instance type, OS, and software. Best for apps needing full control of the environment.' },
  { requirement: 'Run code in response to events / no server management', solution: 'AWS Lambda', why: 'Serverless compute. Pay only per request and duration. Max 15 minutes. Perfect for event-driven, short-duration tasks.' },
  { requirement: 'Run containerised applications at scale', solution: 'Amazon ECS or EKS with Fargate', why: 'ECS = AWS-native container orchestration. EKS = Kubernetes. Fargate = serverless (no EC2 to manage). Choose Fargate for simplest ops.' },
  { requirement: 'Deploy web app without managing infrastructure / PaaS', solution: 'AWS Elastic Beanstalk', why: 'Upload your code; Beanstalk handles EC2, ALB, Auto Scaling, RDS provisioning. You keep full control but skip manual setup.' },
  { requirement: 'Run short-term, interruptible batch workloads cheaply', solution: 'EC2 Spot Instances', why: 'Spot = unused EC2 capacity at up to 90% discount. Can be interrupted with 2-min notice. Use for fault-tolerant, flexible jobs.' },
  { requirement: 'Commit to 1 or 3 years of compute for discount', solution: 'EC2 Reserved Instances / Savings Plans', why: 'Reserved Instances: up to 72% off On-Demand for committed steady-state workloads. Savings Plans: more flexible, covers Lambda too.' },

  // Storage
  { requirement: 'Store and retrieve any amount of data / objects', solution: 'Amazon S3', why: 'Object storage. Unlimited capacity. 11 nines durability. Ideal for files, images, backups, data lakes, static websites.' },
  { requirement: 'Store data accessed frequently (fast retrieval)', solution: 'S3 Standard', why: 'Default storage class. High durability, availability, and performance for frequently accessed data. Most expensive per-GB but no retrieval fee.' },
  { requirement: 'Store data accessed once or twice a month / lower cost', solution: 'S3 Standard-IA (Infrequent Access)', why: 'Lower storage cost than S3 Standard but charges per retrieval. Best when data is important but accessed infrequently.' },
  { requirement: 'Archive data rarely accessed / cheapest long-term storage', solution: 'S3 Glacier Flexible Retrieval / Deep Archive', why: 'Glacier = minutes-to-hours retrieval. Deep Archive = 12+ hours. Lowest cost storage on AWS. For compliance/regulatory archives.' },
  { requirement: 'Store EC2 operating system disk / database files', solution: 'Amazon EBS (Elastic Block Store)', why: 'Block storage attached to a single EC2 instance. Persistent. Like a hard drive. Required for the OS and database volumes.' },
  { requirement: 'Share files across many Linux EC2 instances simultaneously', solution: 'Amazon EFS (Elastic File System)', why: 'Network file system (NFS). Multiple EC2s read/write at once. Auto-scales. For shared application data, CMS, home directories.' },
  { requirement: 'Move petabytes of data offline to AWS', solution: 'AWS Snowball Edge', why: 'Physical device shipped to your location. Faster and cheaper than internet for massive datasets or limited bandwidth environments.' },

  // Database
  { requirement: 'Managed relational database / MySQL, PostgreSQL, SQL', solution: 'Amazon RDS', why: 'Managed relational DB. AWS handles backups, patching, Multi-AZ failover. Supports MySQL, PostgreSQL, Oracle, SQL Server, MariaDB.' },
  { requirement: 'Serverless key-value / NoSQL database at any scale', solution: 'Amazon DynamoDB', why: 'Fully managed NoSQL. Single-digit millisecond latency. Auto-scales. No schema. Perfect for high-traffic, flexible data models.' },
  { requirement: 'Analyze petabytes of data with SQL / BI / data warehouse', solution: 'Amazon Redshift', why: 'Columnar data warehouse. Optimised for analytics (OLAP), not transactions (OLTP). Massively parallel — queries millions of rows fast.' },

  // Networking
  { requirement: 'Isolate AWS resources in a private network', solution: 'Amazon VPC (Virtual Private Cloud)', why: 'Logically isolated network within AWS. You define IP ranges, subnets, route tables, and security. Default VPC provided per region.' },
  { requirement: 'Deliver content to global users with low latency', solution: 'Amazon CloudFront (CDN)', why: 'Content Delivery Network. Caches content at 400+ edge locations worldwide. Reduces latency for images, videos, APIs.' },
  { requirement: 'Route internet traffic to AWS resources / DNS management', solution: 'Amazon Route 53', why: 'Scalable DNS service. Translates domain names to IP addresses. Supports routing policies: latency, failover, geolocation.' },
  { requirement: 'Connect on-premises data center to AWS privately', solution: 'AWS Direct Connect', why: 'Dedicated private fiber connection from your facility to AWS. More consistent throughput and lower latency than VPN over internet.' },

  // Security
  { requirement: 'Control who can access AWS services / manage permissions', solution: 'AWS IAM (Identity and Access Management)', why: 'Create users, groups, roles, and policies. Principle of least privilege. Root account should be secured immediately with MFA.' },
  { requirement: 'Protect web applications from SQL injection and XSS', solution: 'AWS WAF (Web Application Firewall)', why: 'Filters malicious Layer 7 HTTP traffic. Attach to ALB, CloudFront, or API Gateway. Uses rule-based allow/deny lists.' },
  { requirement: 'Protect against DDoS attacks', solution: 'AWS Shield', why: 'Shield Standard = free, automatic protection against common attacks. Shield Advanced = paid, 24/7 DRT, cost protection, L7 mitigation.' },
  { requirement: 'Detect threats and unusual behaviour automatically', solution: 'Amazon GuardDuty', why: 'Continuous threat detection using ML. Analyses VPC Flow Logs, CloudTrail, DNS queries. No agents needed. Alerts within minutes.' },
  { requirement: 'Audit API calls / track who did what in your account', solution: 'AWS CloudTrail', why: 'Records every API call: who, what resource, when, from where. Required for security forensics, compliance, and change tracking.' },
  { requirement: 'Check compliance / resource configuration history', solution: 'AWS Config', why: 'Records resource configuration state over time. Evaluates compliance against rules. Alerts when config drifts from desired state.' },
  { requirement: 'Store and automatically rotate database passwords', solution: 'AWS Secrets Manager', why: 'Stores and rotates secrets (DB credentials, API keys) automatically. Native RDS integration. ~$0.40/secret/month.' },
  { requirement: 'Free vulnerability scanning / security recommendations', solution: 'AWS Trusted Advisor', why: 'Checks account for security, cost, performance, reliability, and service limit issues. Basic checks free; all checks require Business/Enterprise support.' },

  // Billing & Cost
  { requirement: 'Understand and forecast AWS spend', solution: 'AWS Cost Explorer', why: 'Visualise spending by service, region, tag, or linked account. Forecast future costs. Identify anomalies and cost drivers.' },
  { requirement: 'Get alerts when spending exceeds a threshold', solution: 'AWS Budgets', why: 'Set cost, usage, or reservation budgets. Send SNS/email alerts when actual or forecasted spend exceeds thresholds.' },
  { requirement: 'Consolidate billing for multiple AWS accounts', solution: 'AWS Organizations / Consolidated Billing', why: 'One monthly bill for all accounts. Volume discounts aggregated across accounts. Member accounts inherit payment from management account.' },
  { requirement: 'Estimate cost of a planned AWS architecture', solution: 'AWS Pricing Calculator', why: 'Free web tool to model your architecture and estimate monthly cost before you build anything. No sign-in required.' },
  { requirement: 'Optimise costs / find underutilised resources', solution: 'AWS Trusted Advisor + Cost Explorer', why: 'Trusted Advisor flags underutilised EC2, idle RDS, and unattached EBS. Cost Explorer rightsizing shows savings opportunities.' },

  // Support Plans
  { requirement: 'Fastest 24/7 AWS support with dedicated TAM', solution: 'Enterprise Support (or Enterprise On-Ramp)', why: 'Enterprise: <15 min critical response, dedicated Technical Account Manager. Enterprise On-Ramp: pool of TAMs, <30 min critical.' },
  { requirement: 'Business-hours support for production issues', solution: 'Business Support Plan', why: 'Business: 24/7 access, <1 hr critical response, full Trusted Advisor checks, AWS Health API, IEM (paid extra). $100/month minimum.' },
  { requirement: 'Cheapest paid plan with 12-hour business-hours response', solution: 'Developer Support Plan', why: 'Developer: business hours only, 1 primary contact, <12 hr general response. Good for testing and development environments.' },
]

// ─── EXAM TRAPS ───────────────────────────────────────────────────────────────
interface Trap {
  title: string; icon: string; trigger: string
  wrong: string; wrongWhy: string
  correct: string; correctWhy: string; tip: string
}

const TRAPS: Trap[] = [
  {
    title: 'Shared Responsibility Model — who owns what',
    icon: '🤝',
    trigger: '"Who is responsible for…" or "Which security task belongs to the customer vs AWS"',
    wrong: 'AWS is responsible for everything in the cloud',
    wrongWhy: 'AWS only manages security OF the cloud (hardware, network, physical data centres). The customer is always responsible for what they put IN the cloud.',
    correct: 'AWS = security OF the cloud. Customer = security IN the cloud.',
    correctWhy: 'AWS owns: hardware, facilities, physical network, hypervisor, managed service availability. Customer owns: OS patches, IAM policies, encryption of data, application security, firewall rules they configure.',
    tip: 'If the question is about "who patches the OS" on EC2 → customer (IaaS). On Lambda or RDS → AWS (managed service). Encryption of data at rest is ALWAYS the customer\'s choice, even though AWS provides the tools.',
  },
  {
    title: 'Support Plans — response times and TAM',
    icon: '📞',
    trigger: '"Fastest response time" or "dedicated TAM" or "full Trusted Advisor access"',
    wrong: 'Developer plan for production with SLA guarantees',
    wrongWhy: 'Developer support is business-hours only, 1 user, no phone support, no SLA for production. It is for dev/test environments.',
    correct: 'Business (all Trusted Advisor) or Enterprise (TAM + <15 min)',
    correctWhy: 'Critical response times: Enterprise <15 min, Enterprise On-Ramp <30 min, Business <1 hr, Developer 12 hr (business hours), Basic = no response. Trusted Advisor full checks: Business and above only.',
    tip: 'TAM = Enterprise or Enterprise On-Ramp ONLY. Full Trusted Advisor = Business and above. Any question about 24/7 access with phone support → at least Business tier.',
  },
  {
    title: 'EC2 Pricing — Reserved vs Spot vs Savings Plans',
    icon: '💰',
    trigger: '"Most cost-effective" or "steady-state 24/7 workload" or "interruptible"',
    wrong: 'Spot Instances for a database server',
    wrongWhy: 'Spot instances can be interrupted with only 2 minutes notice. A database cannot be interrupted — data could be corrupted or sessions lost.',
    correct: 'Reserved Instances for predictable 24/7 workloads. Spot for fault-tolerant batch jobs.',
    correctWhy: 'On-Demand = flexible, no commitment. Reserved = commit 1-3 yr for up to 72% off. Spot = 90% off but interruptible. Savings Plans = flexible commitment covering EC2 + Lambda + Fargate.',
    tip: 'If the question mentions "steady", "predictable", "24/7", "database" → Reserved or Savings Plans. "Interruptible", "batch", "flexible" → Spot. "Testing" or "short-term" → On-Demand.',
  },
  {
    title: 'Availability Zones vs Regions vs Edge Locations',
    icon: '🌍',
    trigger: '"High availability within a city" vs "global distribution" vs "CDN caching"',
    wrong: 'Regions provide redundancy within the same city',
    wrongWhy: 'Regions are separate geographic areas (e.g., us-east-1, eu-west-1). AZs are the redundancy within a region (multiple data centres in one area).',
    correct: 'AZ = within a region for HA. Region = geographic area. Edge = CloudFront CDN cache.',
    correctWhy: 'AZs are physically isolated data centres within one region (~2-60 ms apart). Deploy across 2+ AZs for high availability. Regions are independent (choose for latency, compliance). Edge Locations serve CloudFront caches globally.',
    tip: '"Deploy in multiple AZs for high availability" ✅. "Deploy in multiple Regions for disaster recovery" ✅. "Edge Locations are NOT AZs or Regions — they only cache content for CloudFront." Exam frequently tests this 3-way distinction.',
  },
  {
    title: 'IAM — Role vs User vs Group',
    icon: '🔑',
    trigger: '"EC2 needs to access S3" or "grant temporary access"',
    wrong: 'Create an IAM user with access keys and put them on the EC2',
    wrongWhy: 'Access keys stored on EC2 are a security risk. They can be found in logs, metadata, or if the instance is compromised. They also do not rotate automatically.',
    correct: 'Attach an IAM Role to the EC2 instance',
    correctWhy: 'IAM Roles provide temporary, automatically rotated credentials via the Instance Metadata Service. No access keys needed. No hardcoded credentials. This is the AWS best practice.',
    tip: 'Any time an AWS service (EC2, Lambda, ECS) needs to access another AWS service → IAM Role. For human users → IAM User or IAM Identity Center (SSO). Never store long-term access keys on an EC2 instance.',
  },
  {
    title: 'S3 Glacier retrieval times — not all the same',
    icon: '🧊',
    trigger: '"Archive storage" or "long-term retention" with a specific retrieval requirement',
    wrong: 'S3 Glacier Deep Archive for data needed within minutes',
    wrongWhy: 'Deep Archive retrieval takes 12-48 hours. If you need minutes-retrieval from a cold tier, you need Glacier Instant Retrieval.',
    correct: 'Match the Glacier tier to the retrieval SLA: Instant (ms), Flexible (1-12 hr), Deep Archive (12-48 hr)',
    correctWhy: 'S3 Glacier Instant Retrieval = millisecond access (like Standard-IA but cheaper storage). Flexible Retrieval = minutes to 12 hours. Deep Archive = 12-48 hours, cheapest.',
    tip: 'Trick question: "Glacier" alone is ambiguous. Look for: "milliseconds" → Instant. "Within a few minutes/hours" → Flexible. "Rarely accessed compliance archive" → Deep Archive. Cost goes down; retrieval time goes up.',
  },
  {
    title: 'Well-Architected Framework — 6 Pillars',
    icon: '🏛️',
    trigger: '"Which pillar covers…" cost / security / reliability / performance / operations / sustainability',
    wrong: 'Security is covered by the Cost Optimization pillar',
    wrongWhy: 'Each pillar is distinct. Security = protect data and systems. Cost = eliminate waste and right-size. Reliability = recover from failure. Performance = use resources efficiently.',
    correct: '6 pillars: Operational Excellence, Security, Reliability, Performance Efficiency, Cost Optimization, Sustainability',
    correctWhy: 'Operational Excellence: run and monitor systems, improve processes. Security: IAM, encryption, threat detection. Reliability: Multi-AZ, backups, Auto Scaling. Performance: right instance types, caching. Cost: pricing models, right-sizing. Sustainability: efficient resource use.',
    tip: 'Exam will give you a scenario and ask "which pillar does this address?" Match keywords: "uptime, Multi-AZ, backup" → Reliability. "Encryption, IAM, GuardDuty" → Security. "Spot instances, lifecycle policies" → Cost Optimization.',
  },
  {
    title: 'Total Cost of Ownership — CapEx vs OpEx',
    icon: '📊',
    trigger: '"Moving to cloud reduces…" or "advantage of cloud pricing model"',
    wrong: 'Moving to AWS increases capital expenditure',
    wrongWhy: 'The opposite is true. AWS eliminates the need to buy physical servers upfront (CapEx). You shift to a pay-as-you-go operating expense model (OpEx).',
    correct: 'Cloud reduces CapEx (no hardware purchases) and shifts to OpEx (pay-as-you-go)',
    correctWhy: 'On-premises: buy servers upfront (CapEx), hire staff, pay for space/power regardless of usage. AWS: pay only for what you use (OpEx), no over-provisioning, AWS handles hardware lifecycle.',
    tip: 'TCO (Total Cost of Ownership) comparison: include on-prem hardware, facilities, power, cooling, staffing, and maintenance vs AWS bill. AWS often wins because you pay for actual usage, not planned peak capacity.',
  },
  {
    title: 'Managed service = AWS patches OS. EC2 = you patch.',
    icon: '🔧',
    trigger: '"Who is responsible for patching" or "OS updates on RDS vs EC2"',
    wrong: 'You patch the OS on RDS instances',
    wrongWhy: 'RDS is a managed service. You do not have OS-level access. AWS applies OS patches. You only control DB engine configuration.',
    correct: 'EC2: you patch OS. RDS/Lambda/Fargate: AWS patches the platform.',
    correctWhy: 'With EC2 (IaaS), you have OS access and must apply patches. With RDS, Fargate, Lambda (PaaS/Serverless), AWS manages the underlying OS/platform. You own the application layer only.',
    tip: 'This directly tests the Shared Responsibility Model. Managed services = AWS owns the OS layer. EC2 = IaaS = you own the OS. SageMaker, ElastiCache, Lambda, Fargate, Elastic Beanstalk managed platform = AWS patches.',
  },
  {
    title: 'AWS Global Accelerator vs CloudFront — different use cases',
    icon: '⚡',
    trigger: '"Static IP globally" or "TCP/UDP acceleration" vs "CDN for static content"',
    wrong: 'CloudFront for TCP/UDP gaming app with static IPs',
    wrongWhy: 'CloudFront is HTTP/HTTPS only and DNS-based — no static IPs. Cannot serve TCP/UDP protocols. No global static IP addresses.',
    correct: 'CloudFront = HTTP CDN with caching. Global Accelerator = TCP/UDP network acceleration with 2 static Anycast IPs.',
    correctWhy: 'CloudFront: caches content at edge, HTTP/HTTPS, dynamic DNS. Global Accelerator: routes traffic over AWS backbone for TCP/UDP, 2 static IPs, no caching — just faster routing and health-aware failover.',
    tip: '"Static IP" or "TCP/UDP" or "non-HTTP protocol" → Global Accelerator. "Cache static content globally" or "reduce image load time for users worldwide" → CloudFront.',
  },
]

// ─── STUDY PLAN ───────────────────────────────────────────────────────────────
interface StudyDay { day: number; week: number; title: string; topics: string[] }

const STUDY_PLAN: StudyDay[] = [
  { day: 1, week: 1, title: 'Cloud Concepts & Value Proposition', topics: ['What is cloud computing (NIST definition)', 'Benefits: agility, elasticity, global reach, economies of scale', 'CapEx vs OpEx — this is a key exam distinction', 'Deployment models: Public, Private, Hybrid'] },
  { day: 2, week: 1, title: 'Cloud Service Models', topics: ['IaaS: EC2 — you manage OS and above', 'PaaS: Elastic Beanstalk — you manage app and data only', 'SaaS: AWS managed apps (Chime, WorkDocs) — you just use it', 'Serverless: Lambda, Fargate — AWS manages everything below your code'] },
  { day: 3, week: 1, title: 'AWS Global Infrastructure', topics: ['Regions: geographic areas (30+). Choose for latency, compliance, pricing.', 'Availability Zones: physically isolated data centres within a region (2-6 per region)', 'Edge Locations: 400+ CloudFront cache locations — NOT AZs or Regions', 'High Availability = deploy across 2+ AZs. DR = multi-region.'] },
  { day: 4, week: 1, title: 'IAM — Identity & Access Management', topics: ['Root account: only for billing setup. Enable MFA immediately. Never use daily.', 'IAM Users: long-term credentials. For human access.', 'IAM Groups: attach policies to groups, add users to groups.', 'IAM Roles: temporary credentials for AWS services (EC2, Lambda). No access keys.', 'IAM Policies: JSON documents defining Allow/Deny for specific actions and resources.'] },
  { day: 5, week: 1, title: 'Security — Shared Responsibility Model', topics: ['AWS responsibility: hardware, data centres, physical security, managed service OS', 'Customer responsibility: IAM policies, data encryption, OS patches on EC2, app code', 'Shared: encryption tools (AWS provides, you must enable/use)', 'Managed service (RDS, Lambda): AWS patches OS. EC2 (IaaS): you patch OS.'] },
  { day: 6, week: 1, title: 'Core Compute: EC2 & Lambda', topics: ['EC2: virtual servers, 750 hours/month free tier (t2.micro/t3.micro)', 'EC2 pricing: On-Demand (no commit), Reserved (1/3yr, 72% off), Spot (90% off, interruptible), Savings Plans', 'Lambda: event-driven, serverless, pay per request + ms duration, max 15 min', 'When EC2 vs Lambda: EC2 for long-running, Lambda for event-driven short tasks'] },
  { day: 7, week: 1, title: 'Week 1 Review', topics: ['Quiz: Cloud Models (IaaS/PaaS/SaaS) — can you identify each?', 'Quiz: Shared Responsibility — 10 scenarios, customer or AWS?', 'Review exam traps from days 1-6', 'Draw: Region → AZ → Edge Location hierarchy from memory'] },

  { day: 8, week: 2, title: 'Core Storage: S3', topics: ['S3: object storage, unlimited capacity, 11 nines durability, global namespace', 'Storage classes: Standard → Standard-IA → Glacier Instant → Glacier Flexible → Deep Archive', 'Use case match: frequent access = Standard, infrequent = IA, archive = Glacier', 'Versioning, static website hosting, bucket policies, ACLs'] },
  { day: 9, week: 2, title: 'More Storage: EBS, EFS, Snowball', topics: ['EBS: block storage for EC2. Persistent. One instance (except io2 Multi-Attach). Like a hard drive.', 'EFS: NFS file system, Linux only, shared across multiple EC2 instances, auto-scales', 'Snowball Edge: offline data transfer for TB/PB when bandwidth is insufficient', 'S3 Glacier Deep Archive: cheapest. 12+ hr retrieval. Long-term compliance archives.'] },
  { day: 10, week: 2, title: 'Databases', topics: ['RDS: managed SQL (MySQL, PostgreSQL, Oracle, SQL Server, MariaDB). AWS patches.', 'RDS Multi-AZ: automatic failover for HA. NOT for read scaling.', 'DynamoDB: NoSQL, key-value, single-digit ms, serverless, auto-scales', 'Aurora: MySQL/PostgreSQL compatible, 5x faster than RDS MySQL, auto-scales storage to 128 TB', 'Redshift: data warehouse, OLAP, analytical queries across petabytes'] },
  { day: 11, week: 2, title: 'Networking Basics', topics: ['VPC: isolated network. You define subnets, route tables, security groups, NACLs.', 'Security Groups: stateful firewall at instance level. Allow rules only.', 'NACLs: stateless firewall at subnet level. Allow + Deny rules.', 'CloudFront: CDN. Cache content at 400+ edge locations. HTTP/HTTPS only.', 'Route 53: DNS service. Routes users to correct AWS resource by domain name.'] },
  { day: 12, week: 2, title: 'Security Services', topics: ['GuardDuty: AI threat detection. Analyses VPC Flow Logs, CloudTrail, DNS. No agents.', 'CloudTrail: API audit log. Every API call = who, what, when, where. Mandatory for compliance.', 'AWS Config: tracks resource configuration history. Evaluates against compliance rules.', 'Inspector: vulnerability scanning for EC2 and ECR container images.', 'Macie: uses ML to detect PII and sensitive data in S3 buckets.'] },
  { day: 13, week: 2, title: 'Billing, Cost, and Pricing', topics: ['Cost Explorer: analyse and forecast AWS spend by service/region/tag', 'AWS Budgets: alert when budget is exceeded or forecasted to exceed', 'Consolidated Billing: combine multiple accounts into one bill via AWS Organizations', 'Pricing Calculator: estimate cost BEFORE you build anything', 'Trusted Advisor: free cost checks (Basic/Developer). Full checks = Business/Enterprise.'] },
  { day: 14, week: 2, title: 'Support Plans + Exam Day Strategy', topics: ['Basic: free, no tech support, limited Trusted Advisor', 'Developer: business hours, 1 contact, $29+/month', 'Business: 24/7, phone/chat, full Trusted Advisor, <1 hr critical, $100+/month', 'Enterprise On-Ramp: <30 min critical, pool of TAMs, $5500+/month', 'Enterprise: <15 min critical, dedicated TAM, concierge, $15000+/month'] },
]

// ─── DEEP DIVES ───────────────────────────────────────────────────────────────
interface DeepDive { id: string; title: string; icon: string; badge: string; summary: string }

const DEEP_DIVES: DeepDive[] = [
  { id: 'cloudconcepts', title: 'Cloud Concepts — Benefits & Models', icon: '☁️', badge: '5–8 questions', summary: 'IaaS vs PaaS vs SaaS, CapEx vs OpEx, elasticity, global reach, economies of scale.' },
  { id: 'sharedresponsibility', title: 'Shared Responsibility Model', icon: '🤝', badge: '4–6 questions', summary: 'AWS security OF the cloud. Customer security IN the cloud. Who patches what.' },
  { id: 'iam', title: 'IAM — Users, Groups, Roles & Policies', icon: '🔑', badge: '4–6 questions', summary: 'Root account hardening, least privilege, IAM roles for services, MFA, access keys.' },
  { id: 'infra', title: 'AWS Global Infrastructure', icon: '🌍', badge: '3–5 questions', summary: 'Regions vs Availability Zones vs Edge Locations. HA within a region. DR across regions.' },
  { id: 'billing', title: 'Billing, Pricing & Cost Tools', icon: '💰', badge: '4–6 questions', summary: 'Cost Explorer, Budgets, Pricing Calculator, Consolidated Billing, Trusted Advisor, TCO.' },
  { id: 'support', title: 'Support Plans — All 5 Tiers', icon: '📞', badge: '4–5 questions', summary: 'Basic vs Developer vs Business vs Enterprise On-Ramp vs Enterprise. Response times, TAM, Trusted Advisor access.' },
  { id: 'compute', title: 'Core Compute — EC2, Lambda, Fargate', icon: '🖥️', badge: '3–5 questions', summary: 'EC2 pricing models, when to use Lambda vs EC2, Elastic Beanstalk, instance types.' },
  { id: 'storage', title: 'Storage — S3, EBS, EFS, Snowball', icon: '📦', badge: '3–5 questions', summary: 'S3 storage classes, EBS vs EFS, Snowball use cases, Glacier retrieval tiers.' },
  { id: 'security', title: 'Security Services Overview', icon: '🛡️', badge: '3–5 questions', summary: 'GuardDuty, CloudTrail, Config, Inspector, Macie, WAF, Shield, Secrets Manager.' },
  { id: 'waf', title: 'Well-Architected Framework — 6 Pillars', icon: '🏛️', badge: '3–4 questions', summary: 'Operational Excellence, Security, Reliability, Performance, Cost, Sustainability — keywords per pillar.' },
]

// ─── HELPER FUNCTIONS ─────────────────────────────────────────────────────────
function heading(text: string) {
  return <div style={{ fontWeight: 800, fontSize: '1rem', color: '#1e40af', margin: '1.5rem 0 0.5rem', borderBottom: '2px solid #bfdbfe', paddingBottom: '4px' }}>{text}</div>
}
function text(t: string) {
  return <p style={{ color: '#374151', fontSize: '0.875rem', lineHeight: 1.7, margin: '0.5rem 0' }}>{t}</p>
}
function bullets(items: string[]) {
  return (
    <ul style={{ margin: '0.5rem 0 1rem', paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '6px' }}>
      {items.map((item, i) => <li key={i} style={{ color: '#374151', fontSize: '0.875rem', lineHeight: 1.6 }}>{item}</li>)}
    </ul>
  )
}
function tip(t: string) {
  return (
    <div style={{ background: '#fef9c3', border: '1px solid #fde047', borderRadius: '8px', padding: '10px 14px', margin: '1rem 0', fontSize: '0.82rem', color: '#713f12', lineHeight: 1.6 }}>
      💡 <strong>Exam tip: </strong>{t}
    </div>
  )
}
function table(headers: string[], rows: string[][]) {
  return (
    <div style={{ overflowX: 'auto', margin: '0.75rem 0' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
        <thead>
          <tr style={{ background: '#eff6ff' }}>
            {headers.map((h, i) => <th key={i} style={{ padding: '8px 12px', textAlign: 'left', fontWeight: 700, color: '#1e40af', border: '1px solid #bfdbfe' }}>{h}</th>)}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} style={{ background: i % 2 === 0 ? '#fff' : '#f8fafc' }}>
              {row.map((cell, j) => <td key={j} style={{ padding: '7px 12px', color: '#374151', border: '1px solid #e5e7eb' }}>{cell}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function renderDeepDive(id: string) {
  switch (id) {
    case 'cloudconcepts': return (
      <div>
        {heading('What is Cloud Computing?')}
        {text('Cloud computing is on-demand delivery of IT resources (compute, storage, databases, networking) over the internet with pay-as-you-go pricing. You access resources instantly without managing physical hardware.')}
        {heading('6 Advantages of Cloud (AWS Framework)')}
        {bullets([
          'Trade CapEx for OpEx — Pay only for what you consume. No upfront hardware purchase.',
          'Benefit from massive economies of scale — AWS\'s scale reduces per-unit costs.',
          'Stop guessing capacity — Scale up or down in minutes, not months.',
          'Increase speed and agility — Provision resources in seconds globally.',
          'Stop spending money running and maintaining data centres — Focus on your business.',
          'Go global in minutes — Deploy to any of 30+ regions worldwide instantly.',
        ])}
        {heading('Cloud Service Models')}
        {table(
          ['Model', 'Who Manages Platform', 'You Manage', 'AWS Example'],
          [
            ['IaaS', 'AWS manages hardware + virtualisation', 'OS, middleware, runtime, app, data', 'Amazon EC2'],
            ['PaaS', 'AWS manages hardware + OS + runtime', 'App code + data only', 'Elastic Beanstalk, RDS'],
            ['SaaS', 'AWS manages everything', 'Just configure and use', 'Amazon Chime, WorkDocs'],
            ['Serverless', 'AWS manages everything below your code', 'Function code only', 'AWS Lambda, Fargate'],
          ]
        )}
        {heading('Cloud Deployment Models')}
        {table(
          ['Model', 'Description', 'Use Case'],
          [
            ['Public Cloud', 'All infrastructure on AWS. Multi-tenant.', 'Most workloads. Best cost and elasticity.'],
            ['Private Cloud', 'Dedicated infrastructure on-prem or single-tenant cloud.', 'Strict compliance, maximum control.'],
            ['Hybrid Cloud', 'Mix of on-prem and AWS connected via VPN/Direct Connect.', 'Phased migration, sensitive data on-prem.'],
            ['Community Cloud', 'Shared by specific community (government, healthcare).', 'Govcloud, regulated industries.'],
          ]
        )}
        {tip('"Trade capital expense for variable expense" and "stop guessing capacity" are the two most commonly tested cloud benefits. CapEx = upfront hardware purchases. OpEx = monthly pay-as-you-go bills.')}
      </div>
    )

    case 'sharedresponsibility': return (
      <div>
        {heading('The Core Concept')}
        {text('AWS and customers share responsibility for security. AWS is responsible for the security OF the cloud (the infrastructure). Customers are responsible for security IN the cloud (what they put in).')}
        {heading('AWS Responsibility (Security OF the Cloud)')}
        {bullets([
          'Physical data centres, hardware, servers, networking equipment',
          'Physical security of facilities (guards, cameras, access control)',
          'Hypervisor and virtualisation layer',
          'Global infrastructure: Regions, AZs, Edge Locations',
          'Managed service underlying OS/platform (RDS, Lambda, Fargate, S3)',
        ])}
        {heading('Customer Responsibility (Security IN the Cloud)')}
        {bullets([
          'IAM: user creation, policies, permissions, MFA enforcement',
          'EC2 OS patching (Guest OS) — you are responsible for EC2 operating system updates',
          'Application code security',
          'Data encryption (you decide whether to enable encryption at rest and in transit)',
          'Network configuration: Security Groups, NACLs, VPC settings',
          'Customer data — what you store, who accesses it',
        ])}
        {heading('How Service Type Shifts Responsibility')}
        {table(
          ['Service Type', 'Example', 'AWS Manages', 'You Manage'],
          [
            ['IaaS', 'EC2', 'Hardware, hypervisor', 'OS patches, middleware, app, data'],
            ['PaaS/Managed', 'RDS', 'Hardware, hypervisor, OS', 'DB config, user access, encryption choice'],
            ['Serverless', 'Lambda', 'Hardware, OS, runtime, scaling', 'Function code, IAM roles, data'],
            ['SaaS', 'Amazon Chime', 'Everything', 'User configuration, data uploaded'],
          ]
        )}
        {tip('"Customer is responsible for patching the guest OS on EC2" — ALWAYS true. "AWS is responsible for patching RDS underlying OS" — ALWAYS true. Encryption: AWS provides tools (KMS, SSE), but enabling them is the CUSTOMER\'s responsibility.')}
      </div>
    )

    case 'iam': return (
      <div>
        {heading('IAM Core Components')}
        {table(
          ['Component', 'What it is', 'Key Points'],
          [
            ['Root User', 'Account owner. Email + password.', 'Lock away. Enable MFA. Never use for daily tasks. Cannot be restricted by IAM.'],
            ['IAM User', 'Person or application. Long-term credentials.', 'Access key + secret for CLI/API. Username + password for Console.'],
            ['IAM Group', 'Collection of users.', 'Attach policies to groups. Users inherit group permissions. Cannot nest groups.'],
            ['IAM Role', 'Assumed by services or users temporarily.', 'No long-term credentials. Auto-rotated tokens. Use for EC2, Lambda accessing AWS.'],
            ['IAM Policy', 'JSON document: Action, Resource, Effect.', 'Attached to users/groups/roles. Least privilege = grant minimum needed.'],
          ]
        )}
        {heading('Principle of Least Privilege')}
        {text('Grant only the permissions required to perform the task. Start with zero permissions and add only what is needed. Regularly review and remove unused permissions.')}
        {heading('Root Account Best Practices')}
        {bullets([
          'Enable MFA on root account immediately after account creation',
          'Delete or do not create root access keys',
          'Use root only for: initial account setup, billing, changing support plan, closing the account',
          'Create an IAM admin user for all daily administrative tasks',
        ])}
        {heading('IAM Role for EC2 (best practice)')}
        {bullets([
          'Attach an IAM Role to an EC2 instance instead of using access keys',
          'EC2 retrieves temporary credentials from the Instance Metadata Service (IMDS)',
          'Credentials auto-rotate every few hours — no manual management',
          'Never store access keys in EC2 user data, environment variables, or application code',
        ])}
        {tip('"EC2 instance needs to read from S3" → Create IAM Role with S3 read policy, attach to EC2. Do NOT create IAM user with access keys and put them on EC2. This is the #1 IAM exam scenario.')}
      </div>
    )

    case 'infra': return (
      <div>
        {heading('AWS Global Infrastructure Hierarchy')}
        {table(
          ['Concept', 'What it is', 'Example'],
          [
            ['Region', 'Geographic area with 2+ AZs. Independent infrastructure.', 'us-east-1 (N. Virginia), eu-west-1 (Ireland)'],
            ['Availability Zone (AZ)', 'Isolated data centre(s) within a region. Physical failure boundary.', 'us-east-1a, us-east-1b, us-east-1c'],
            ['Edge Location', 'CloudFront CDN cache point of presence.', '400+ locations worldwide. NOT AZs.'],
            ['Local Zone', 'AWS infrastructure in major cities, closer to users.', 'Los Angeles, Boston, Denver'],
            ['Wavelength Zone', 'AWS compute at 5G network edge.', 'Verizon, SK Telecom 5G cells'],
          ]
        )}
        {heading('Why Regions and AZs Matter for the Exam')}
        {bullets([
          'High Availability: Deploy across 2+ AZs within the SAME region.',
          'Disaster Recovery: Replicate across MULTIPLE regions.',
          'Data Sovereignty: Data stays in the region you deploy. It does NOT move to other regions automatically.',
          'Low Latency: Pick the region closest to your end users.',
          'Compliance: Some regulations require data to stay in specific geographic areas — choose the region accordingly.',
        ])}
        {heading('How to Choose a Region (4 factors)')}
        {bullets([
          '1. Compliance: Data residency laws may require a specific country/region.',
          '2. Latency: Deploy close to the majority of your users.',
          '3. Service availability: Not all services are in all regions.',
          '4. Pricing: Services cost different amounts in different regions.',
        ])}
        {tip('"Edge Locations serve CloudFront CDN cache — they are NOT AZs or Regions." This is the most common infrastructure trap. Edge Locations ≠ data centres where you run EC2.')}
      </div>
    )

    case 'billing': return (
      <div>
        {heading('AWS Pricing Fundamentals')}
        {bullets([
          'Pay for what you use — no upfront commitment for On-Demand.',
          'Pay less when you reserve — commit 1 or 3 years for up to 72% discount.',
          'Pay less as you use more — volume pricing tiers (S3, data transfer).',
          'AWS Free Tier — 750 hrs EC2 t2/t3 micro, 5 GB S3, 25 GB DynamoDB per month (first 12 months or always-free).',
        ])}
        {heading('Cost and Billing Tools')}
        {table(
          ['Tool', 'Purpose', 'Key Point'],
          [
            ['AWS Cost Explorer', 'Visualise and analyse past and future spend', 'Filter by service, tag, account, region. Forecast 12 months.'],
            ['AWS Budgets', 'Alert when spend exceeds threshold', 'Set cost, usage, RI, or Savings Plans budgets. Email/SNS alerts.'],
            ['AWS Pricing Calculator', 'Estimate cost BEFORE you build', 'Free, no login required. Model any AWS architecture.'],
            ['AWS Cost and Usage Report', 'Most granular billing data', 'Hourly data per resource. Exported to S3. Used by 3rd-party tools.'],
            ['Consolidated Billing', 'One bill for multiple accounts', 'Via AWS Organizations. Volume discounts aggregated across accounts.'],
            ['Trusted Advisor', 'Cost optimisation recommendations', 'Free basic checks. Full access requires Business/Enterprise support.'],
          ]
        )}
        {heading('TCO — Total Cost of Ownership')}
        {text('When comparing on-premises vs cloud, TCO includes: hardware purchase/lease, data centre space and power, cooling, networking, staff, software licences, hardware refresh cycles. Cloud replaces most of these with a variable monthly bill.')}
        {tip('Pricing Calculator = use BEFORE building to estimate cost. Cost Explorer = use AFTER building to analyse actual cost. This distinction appears on the exam.')}
      </div>
    )

    case 'support': return (
      <div>
        {heading('5 AWS Support Tiers Compared')}
        {table(
          ['Feature', 'Basic', 'Developer', 'Business', 'Enterprise On-Ramp', 'Enterprise'],
          [
            ['Cost', 'Free', '$29+/mo', '$100+/mo', '$5,500+/mo', '$15,000+/mo'],
            ['Critical Response', 'None', 'None', '<1 hour', '<30 minutes', '<15 minutes'],
            ['General Response', 'None', '12–24 hr (BH)', '24/7, <1 hr', '24/7, <30 min', '24/7, <15 min'],
            ['Contacts', '0 tech support', '1', 'Unlimited', 'Unlimited', 'Unlimited'],
            ['TAM', 'None', 'None', 'None', 'Pool of TAMs', 'Dedicated TAM'],
            ['Full Trusted Advisor', '❌', '❌', '✅', '✅', '✅'],
            ['AWS Health API', '❌', '❌', '✅', '✅', '✅'],
            ['Concierge', '❌', '❌', '❌', '❌', '✅'],
          ]
        )}
        {heading('What Each Tier Covers')}
        {bullets([
          'Basic (free): AWS documentation, forums, billing support, limited Trusted Advisor (6 checks only)',
          'Developer: Email support during business hours. Single primary contact. For dev/test environments.',
          'Business: Phone/chat 24/7. Full Trusted Advisor (all ~115 checks). AWS Health API. For production workloads.',
          'Enterprise On-Ramp: Pool of Technical Account Managers. Infrastructure Event Management (IEM) included. For large production.',
          'Enterprise: Dedicated Technical Account Manager (TAM). Concierge team for billing. Well-Architected Reviews. Mission-critical workloads.',
        ])}
        {tip('TAM = Enterprise or Enterprise On-Ramp ONLY. Full Trusted Advisor = Business and above. "Fastest support response" = Enterprise. Any question about 24/7 phone + full Trusted Advisor = at least Business.')}
      </div>
    )

    case 'compute': return (
      <div>
        {heading('EC2 Instance Pricing Models')}
        {table(
          ['Pricing Model', 'Discount', 'Commitment', 'Use Case'],
          [
            ['On-Demand', '0% (list price)', 'None', 'Short-term, unpredictable, dev/test, getting started'],
            ['Reserved Instances', 'Up to 72%', '1 or 3 years', 'Steady-state 24/7 production workloads'],
            ['Spot Instances', 'Up to 90%', 'None (interruptible)', 'Fault-tolerant batch jobs, ML training, flexible workloads'],
            ['Savings Plans', 'Up to 72%', '1 or 3 years ($/hr)', 'Flexible — covers EC2, Lambda, Fargate across types/regions'],
            ['Dedicated Hosts', 'Varies', 'On-Demand or Reserved', 'Compliance, BYOL (Bring Your Own Licence), single-tenant'],
          ]
        )}
        {heading('EC2 vs Lambda Decision')}
        {table(
          ['Factor', 'Choose EC2', 'Choose Lambda'],
          [
            ['Duration', 'Long-running (hours, days)', 'Short bursts (milliseconds to 15 min)'],
            ['Trigger', 'Always running, user requests', 'Event-driven (S3 upload, API call, schedule)'],
            ['Control', 'Need OS-level access', 'No infrastructure management'],
            ['Cost', 'Predictable, steady traffic', 'Spiky, infrequent, or near-zero traffic'],
          ]
        )}
        {heading('Elastic Beanstalk — PaaS')}
        {bullets([
          'Upload your code → Beanstalk provisions EC2, ALB, Auto Scaling Group, RDS',
          'You retain FULL control — can SSH into EC2, modify configurations',
          'Free service — you pay only for underlying resources (EC2, RDS, etc.)',
          'Supports: Node.js, Java, Python, PHP, Ruby, .NET, Docker',
        ])}
        {tip('"Spot instances should NOT be used for databases" — they can be interrupted. Any exam scenario with "database", "production", "cannot be interrupted" → On-Demand or Reserved, NOT Spot.')}
      </div>
    )

    case 'storage': return (
      <div>
        {heading('S3 Storage Classes (Cost vs Retrieval Speed)')}
        {table(
          ['Storage Class', 'Access Frequency', 'Retrieval', 'Min Storage', 'Cost'],
          [
            ['S3 Standard', 'Frequent', 'Milliseconds', 'None', '$$$$'],
            ['S3 Standard-IA', 'Infrequent', 'Milliseconds', '30 days', '$$$'],
            ['S3 One Zone-IA', 'Infrequent, less critical', 'Milliseconds', '30 days', '$$'],
            ['S3 Glacier Instant', 'Quarterly', 'Milliseconds', '90 days', '$$'],
            ['S3 Glacier Flexible', 'Yearly or less', 'Minutes–Hours', '90 days', '$'],
            ['S3 Glacier Deep Archive', 'Rarely (regulatory)', '12–48 hours', '180 days', '¢'],
          ]
        )}
        {heading('EBS vs EFS vs S3 — When to Use Which')}
        {table(
          ['Service', 'Type', 'Access', 'Use Case'],
          [
            ['EBS', 'Block storage', 'One EC2 instance (usually)', 'OS disk, databases, swap volume'],
            ['EFS', 'File system (NFS)', 'Many EC2 simultaneously', 'Shared app data, CMS files, home directories'],
            ['S3', 'Object storage', 'Any client via HTTP', 'Images, videos, backups, data lakes, static websites'],
          ]
        )}
        {heading('AWS Snow Family — Offline Data Transfer')}
        {bullets([
          'Snowcone: 8-14 TB. Smallest device. Edge computing + data transfer. Fits in a backpack.',
          'Snowball Edge: 80 TB. Has local compute. Most common for TB-scale migrations.',
          'Snowmobile: 100 PB. Actual truck. For moving entire data centres.',
          'Use Snow when: upload would take >1 week over your available internet bandwidth.',
        ])}
        {tip('Glacier retrieval exam trap: Glacier Instant = milliseconds. Flexible = minutes to hours. Deep Archive = 12-48 hours. "Cheapest storage" always = Glacier Deep Archive. "Cheapest with millisecond retrieval" = Glacier Instant.')}
      </div>
    )

    case 'security': return (
      <div>
        {heading('Security Services Quick Reference')}
        {table(
          ['Service', 'What it does', 'Key Trigger Words'],
          [
            ['GuardDuty', 'Threat detection using ML. Analyses CloudTrail + VPC Flow Logs + DNS.', '"Unusual API calls", "suspicious behaviour", "no agent"'],
            ['CloudTrail', 'Records every AWS API call. Who, what, when, from where.', '"Audit", "who changed", "compliance", "API history"'],
            ['AWS Config', 'Records configuration changes. Checks compliance against rules.', '"Config drift", "compliance history", "what changed when"'],
            ['Inspector', 'Vulnerability scanning for EC2 + container images.', '"CVE", "patches", "vulnerability assessment"'],
            ['Macie', 'Discovers PII in S3 using ML.', '"PII", "sensitive data", "classify data in S3"'],
            ['WAF', 'Layer 7 firewall. Blocks SQL injection, XSS, etc.', '"Web attacks", "SQL injection", "OWASP"'],
            ['Shield', 'DDoS protection. Standard = free. Advanced = paid.', '"DDoS", "volumetric attack"'],
            ['Secrets Manager', 'Store and rotate secrets (DB passwords, API keys).', '"Rotate credentials", "database password management"'],
            ['KMS', 'Create and manage encryption keys.', '"Encrypt at rest", "CMK", "key management"'],
            ['Trusted Advisor', 'Best practice checks: cost, security, performance, reliability.', '"Best practice audit", "security recommendations", "free checks"'],
          ]
        )}
        {heading('Encryption: At Rest vs In Transit')}
        {bullets([
          'At rest: data stored on disk. Use AWS KMS, SSE-S3, SSE-KMS to encrypt S3, EBS, RDS.',
          'In transit: data moving over network. Use TLS/HTTPS, SSL, VPN.',
          'Customer responsibility: deciding to enable encryption. AWS provides the tools.',
          'KMS Customer Managed Key (CMK): full control, audit trail, custom rotation schedule.',
        ])}
        {tip('GuardDuty ≠ CloudTrail. CloudTrail records every API call (log). GuardDuty analyses those logs + others to detect THREATS. Both are needed: CloudTrail for audit, GuardDuty for active threat detection.')}
      </div>
    )

    case 'waf': return (
      <div>
        {heading('The 6 Well-Architected Pillars')}
        {table(
          ['Pillar', 'Focus', 'Key AWS Tools / Concepts'],
          [
            ['Operational Excellence', 'Run and improve systems. Automate operations.', 'CloudFormation, CloudWatch, AWS Config, CI/CD pipelines, runbooks'],
            ['Security', 'Protect data and systems. Apply least privilege.', 'IAM, KMS, GuardDuty, CloudTrail, WAF, Shield, MFA, encryption'],
            ['Reliability', 'Recover from failures. Meet demand consistently.', 'Multi-AZ, Auto Scaling, Route 53 health checks, backups, SQS decoupling'],
            ['Performance Efficiency', 'Use resources efficiently. Select right types.', 'EC2 right-sizing, CloudFront, ElastiCache, Aurora, serverless, benchmarking'],
            ['Cost Optimization', 'Eliminate waste. Right-size and commit.', 'Reserved/Spot, S3 Lifecycle, Trusted Advisor, Cost Explorer, rightsizing'],
            ['Sustainability', 'Minimise environmental impact.', 'Serverless, managed services, efficient code, right-sizing, renewable energy regions'],
          ]
        )}
        {heading('How to Answer Pillar Questions')}
        {bullets([
          '"Moving from manual to automated deployments" → Operational Excellence (automation, CI/CD)',
          '"Enabling MFA and encryption for all S3 buckets" → Security (least privilege, encrypt at rest)',
          '"Deploying across 3 AZs with Auto Scaling" → Reliability (eliminate single point of failure)',
          '"Switching from On-Demand to Reserved Instances" → Cost Optimization',
          '"Using serverless instead of always-on EC2" → Both Cost Optimization AND Sustainability',
          '"Using CloudFront to cache globally" → Performance Efficiency',
        ])}
        {tip('The exam gives a scenario and asks "which pillar does this align with?" Match keywords: "uptime/failover/backup" → Reliability. "IAM/encryption/audit" → Security. "Pay less/rightsizing" → Cost Optimization. "Automation/CI-CD" → Operational Excellence.')}
      </div>
    )

    default: return <div style={{ color: '#6b7280', fontSize: '0.875rem' }}>Content loading…</div>
  }
}

const TAB_LIST: { id: Tab; label: string; count: string }[] = [
  { id: 'matrix',    label: '📋 Decision Matrix', count: `${MATRIX.length}` },
  { id: 'traps',     label: '⚠️ Exam Traps',       count: `${TRAPS.length}` },
  { id: 'deepdives', label: '🔬 Deep Dives',        count: `${DEEP_DIVES.length}` },
  { id: 'studyplan', label: '📅 Study Plan',         count: '14d' },
  { id: 'reference', label: '📌 Quick Reference',   count: '' },
  { id: 'strategy',  label: '🎯 Exam Strategy',     count: '' },
  { id: 'codex',    label: "🧭 CLF Codex",          count: '' },
]

const STORAGE_KEY = 'certiprepai-clf-study-plan'

export default function ClfGuide() {
  const { isPremium } = useAuth()
  const navigate = useNavigate()
  const { hasAccess, loading: accessLoading } = useCertAccess('clf-c02')

  const [activeTab, setActiveTab] = useState<Tab>('matrix')
  const [search, setSearch] = useState('')
  const [expanded, setExpanded] = useState<string | null>(null)
  const [completedDays, setCompletedDays] = useState<Set<number>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      return saved ? new Set(JSON.parse(saved)) : new Set()
    } catch { return new Set() }
  })

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify([...completedDays])) } catch {}
  }, [completedDays])

  // Gate: must be premium
  if (!isPremium) {
    return (
      <Layout>
        <div style={{ minHeight: '70vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem', textAlign: 'center' }}>
          <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>🔒</div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#111827', marginBottom: '0.5rem' }}>CLF-C02 Deep Study Guide is for members only</h2>
          <p style={{ color: '#6b7280', maxWidth: '420px', lineHeight: 1.6, marginBottom: '1.5rem' }}>
            Upgrade to any paid plan to unlock this complete CLF-C02 study resource.
          </p>
          <button onClick={() => navigate('/pricing')} style={{ padding: '12px 28px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 700, cursor: 'pointer', fontSize: '1rem' }}>
            See Plans →
          </button>
        </div>
      </Layout>
    )
  }

  // Gate: must have CLF cert access
  if (!accessLoading && !hasAccess) {
    return (
      <Layout>
        <div style={{ minHeight: '70vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem', textAlign: 'center' }}>
          <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>☁️</div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#111827', marginBottom: '0.5rem' }}>CLF-C02 not in your current plan</h2>
          <p style={{ color: '#6b7280', maxWidth: '420px', lineHeight: 1.6, marginBottom: '1.5rem' }}>
            Select CLF-C02 as your active cert, or upgrade to a plan that includes it.
          </p>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
            <button onClick={() => navigate('/dashboard')} style={{ padding: '12px 24px', background: '#0f172a', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 700, cursor: 'pointer' }}>
              Go to Dashboard →
            </button>
            <button onClick={() => navigate('/billing')} style={{ padding: '12px 24px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 700, cursor: 'pointer' }}>
              Upgrade Plan →
            </button>
          </div>
        </div>
      </Layout>
    )
  }

  const filteredMatrix = MATRIX.filter(row => {
    if (!search) return true
    const q = search.toLowerCase()
    return row.requirement.toLowerCase().includes(q) || row.solution.toLowerCase().includes(q) || row.why.toLowerCase().includes(q)
  })

  const toggleDay = (day: number) => {
    setCompletedDays(prev => {
      const next = new Set(prev)
      next.has(day) ? next.delete(day) : next.add(day)
      return next
    })
  }

  const weeks = [1, 2]

  return (
    <Layout>
      {/* Hero */}
      <div style={{ background: 'linear-gradient(135deg, #064e3b 0%, #059669 50%, #064e3b 100%)', padding: '2.5rem 1.5rem 2rem', textAlign: 'center', color: '#fff' }}>
        <div style={{ display: 'inline-block', background: 'rgba(167,243,208,0.15)', border: '1px solid rgba(167,243,208,0.4)', borderRadius: '999px', padding: '4px 14px', fontSize: '0.75rem', fontWeight: 700, color: '#a7f3d0', letterSpacing: '0.08em', marginBottom: '0.75rem' }}>
          ☁️ CLF-C02 · COMPLETE STUDY GUIDE
        </div>
        <h1 style={{ fontSize: 'clamp(1.6rem, 4vw, 2.25rem)', fontWeight: 900, margin: '0 0 0.75rem', lineHeight: 1.2 }}>
          The CLF-C02 Encyclopedia
        </h1>
        <p style={{ color: '#a7f3d0', fontSize: '0.95rem', maxWidth: '600px', margin: '0 auto 0.75rem', lineHeight: 1.6 }}>
          Every decision matrix, exam trap, deep dive, and study plan you need to pass the AWS Cloud Practitioner exam — in one place.
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
            style={{ padding: '0.9rem 1rem', background: 'none', border: 'none', cursor: 'pointer', fontWeight: activeTab === t.id ? 700 : 500, fontSize: '0.85rem', whiteSpace: 'nowrap', color: activeTab === t.id ? '#059669' : '#6b7280', borderBottom: activeTab === t.id ? '2px solid #059669' : '2px solid transparent', transition: 'all 0.15s' }}>
            {t.label}
            {t.count && <span style={{ marginLeft: '5px', fontSize: '0.7rem', background: activeTab === t.id ? '#ecfdf5' : '#f3f4f6', color: activeTab === t.id ? '#059669' : '#9ca3af', padding: '1px 7px', borderRadius: '999px', fontWeight: 600 }}>{t.count}</span>}
          </button>
        ))}
      </div>

      <div style={{ maxWidth: '960px', margin: '0 auto', padding: '2rem 1.5rem' }}>

        {/* ── DECISION MATRIX ── */}
        {activeTab === 'matrix' && (
          <div>
            <p style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '1rem' }}>
              {MATRIX.length} requirement → solution mappings. Search by keyword or concept. Covers Cloud Concepts, Compute, Storage, Database, Security, Billing, and Support Plans.
            </p>
            <input
              type="text" value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search e.g. 'serverless', 'cost', 'archive', 'support', 'IAM'…"
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
                  <div style={{ background: '#ecfdf5', color: '#059669', padding: '4px 12px', borderRadius: '999px', fontSize: '0.78rem', fontWeight: 700, whiteSpace: 'nowrap', flexShrink: 0 }}>{row.solution}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── EXAM TRAPS ── */}
        {activeTab === 'traps' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <p style={{ color: '#6b7280', fontSize: '0.875rem', margin: '0 0 0.5rem' }}>
              {TRAPS.length} high-frequency exam traps. These are the misconceptions that cost candidates the most points on CLF-C02.
            </p>
            {TRAPS.map((trap) => (
              <div key={trap.title} style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '14px', overflow: 'hidden' }}>
                <button
                  onClick={() => setExpanded(expanded === trap.title ? null : trap.title)}
                  style={{ width: '100%', padding: '1rem 1.25rem', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px', textAlign: 'left' }}
                >
                  <span style={{ fontSize: '1.5rem', flexShrink: 0 }}>{trap.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#111827' }}>{trap.title}</div>
                    <div style={{ fontSize: '0.78rem', color: '#6b7280', marginTop: '2px' }}>Trigger: {trap.trigger}</div>
                  </div>
                  <span style={{ fontSize: '1.2rem', color: '#6b7280', flexShrink: 0 }}>{expanded === trap.title ? '▲' : '▼'}</span>
                </button>
                {expanded === trap.title && (
                  <div style={{ padding: '0 1.25rem 1.25rem', borderTop: '1px solid #f3f4f6' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', margin: '1rem 0' }}>
                      <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '10px', padding: '0.875rem' }}>
                        <div style={{ fontWeight: 700, color: '#b91c1c', fontSize: '0.8rem', marginBottom: '6px' }}>❌ Common Wrong Answer</div>
                        <div style={{ fontWeight: 600, color: '#111827', fontSize: '0.875rem', marginBottom: '4px' }}>{trap.wrong}</div>
                        <div style={{ color: '#6b7280', fontSize: '0.8rem', lineHeight: 1.5 }}>{trap.wrongWhy}</div>
                      </div>
                      <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '10px', padding: '0.875rem' }}>
                        <div style={{ fontWeight: 700, color: '#15803d', fontSize: '0.8rem', marginBottom: '6px' }}>✅ Correct Answer</div>
                        <div style={{ fontWeight: 600, color: '#111827', fontSize: '0.875rem', marginBottom: '4px' }}>{trap.correct}</div>
                        <div style={{ color: '#6b7280', fontSize: '0.8rem', lineHeight: 1.5 }}>{trap.correctWhy}</div>
                      </div>
                    </div>
                    <div style={{ background: '#fef9c3', border: '1px solid #fde047', borderRadius: '8px', padding: '10px 14px', fontSize: '0.82rem', color: '#713f12', lineHeight: 1.6 }}>
                      💡 <strong>Remember: </strong>{trap.tip}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* ── DEEP DIVES ── */}
        {activeTab === 'deepdives' && (
          <div>
            <p style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '1rem' }}>
              {DEEP_DIVES.length} topic deep dives. Click any section to expand the full breakdown. Badge shows approximate question count on real CLF-C02 exam.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {DEEP_DIVES.map(dd => (
                <div key={dd.id} style={{ background: '#fff', border: expanded === dd.id ? '2px solid #059669' : '1px solid #e5e7eb', borderRadius: '14px', overflow: 'hidden', transition: 'border 0.15s' }}>
                  <button
                    onClick={() => setExpanded(expanded === dd.id ? null : dd.id)}
                    style={{ width: '100%', padding: '1rem 1.25rem', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px', textAlign: 'left' }}
                  >
                    <span style={{ fontSize: '1.5rem', flexShrink: 0 }}>{dd.icon}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                        <span style={{ fontWeight: 700, fontSize: '0.9rem', color: '#111827' }}>{dd.title}</span>
                        <span style={{ background: '#ecfdf5', color: '#059669', fontSize: '0.72rem', fontWeight: 700, padding: '2px 8px', borderRadius: '999px', border: '1px solid #a7f3d0' }}>~{dd.badge}</span>
                      </div>
                      <div style={{ fontSize: '0.78rem', color: '#6b7280', marginTop: '2px' }}>{dd.summary}</div>
                    </div>
                    <span style={{ fontSize: '1.2rem', color: '#6b7280', flexShrink: 0 }}>{expanded === dd.id ? '▲' : '▼'}</span>
                  </button>
                  {expanded === dd.id && (
                    <div style={{ padding: '0 1.5rem 1.5rem', borderTop: '1px solid #f3f4f6' }}>
                      {renderDeepDive(dd.id)}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── STUDY PLAN ── */}
        {activeTab === 'studyplan' && (
          <div>
            <div style={{ background: 'linear-gradient(135deg, #ecfdf5, #f0fdf4)', border: '1px solid #a7f3d0', borderRadius: '14px', padding: '1.25rem', marginBottom: '1.5rem' }}>
              <div style={{ fontWeight: 800, fontSize: '1rem', color: '#064e3b', marginBottom: '6px' }}>📅 14-Day CLF-C02 Study Plan</div>
              <div style={{ color: '#065f46', fontSize: '0.85rem', lineHeight: 1.6 }}>
                CLF-C02 is a 90-minute exam (65 questions). 14 days is enough with 60–90 min/day. Click each day to mark as complete and track your progress.
              </div>
              <div style={{ marginTop: '10px', background: '#fff', borderRadius: '10px', overflow: 'hidden', height: '8px' }}>
                <div style={{ height: '100%', background: 'linear-gradient(90deg, #059669, #34d399)', width: `${(completedDays.size / 14) * 100}%`, transition: 'width 0.4s ease' }} />
              </div>
              <div style={{ fontSize: '0.78rem', color: '#6b7280', marginTop: '6px' }}>{completedDays.size}/14 days completed</div>
            </div>

            {weeks.map(week => (
              <div key={week} style={{ marginBottom: '2rem' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#064e3b', margin: '0 0 1rem', padding: '0.5rem 0', borderBottom: '2px solid #a7f3d0' }}>
                  Week {week} — {week === 1 ? 'Cloud Concepts, IAM & Core Services' : 'Deep Services, Billing, Support & Exam Ready'}
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {STUDY_PLAN.filter(d => d.week === week).map(day => (
                    <div key={day.day}
                      onClick={() => toggleDay(day.day)}
                      style={{ background: completedDays.has(day.day) ? '#ecfdf5' : '#fff', border: completedDays.has(day.day) ? '1.5px solid #6ee7b7' : '1px solid #e5e7eb', borderRadius: '12px', padding: '0.875rem 1.1rem', cursor: 'pointer', transition: 'all 0.15s', display: 'flex', gap: '12px', alignItems: 'flex-start' }}
                    >
                      <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: completedDays.has(day.day) ? '#059669' : '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', flexShrink: 0, fontWeight: 700, color: completedDays.has(day.day) ? '#fff' : '#6b7280' }}>
                        {completedDays.has(day.day) ? '✓' : day.day}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 700, fontSize: '0.875rem', color: completedDays.has(day.day) ? '#064e3b' : '#111827', marginBottom: '4px' }}>
                          Day {day.day}: {day.title}
                        </div>
                        <ul style={{ margin: 0, paddingLeft: '1.1rem', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                          {day.topics.map((t, ti) => (
                            <li key={ti} style={{ fontSize: '0.78rem', color: completedDays.has(day.day) ? '#065f46' : '#6b7280', lineHeight: 1.5 }}>{t}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── QUICK REFERENCE ── */}
        {activeTab === 'reference' && (
          <div>
            <h3 style={{ fontWeight: 800, fontSize: '1.1rem', color: '#111827', marginBottom: '1rem' }}>📌 CLF-C02 Quick Reference</h3>

            {/* Exam breakdown */}
            <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '14px', padding: '1.25rem', marginBottom: '1.25rem' }}>
              <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#111827', marginBottom: '10px' }}>Exam Blueprint — 4 Domains</div>
              {[
                { domain: 'Cloud Concepts', pct: 24, color: '#3b82f6' },
                { domain: 'Security and Compliance', pct: 30, color: '#ef4444' },
                { domain: 'Cloud Technology and Services', pct: 34, color: '#10b981' },
                { domain: 'Billing, Pricing, and Support', pct: 12, color: '#f59e0b' },
              ].map(d => (
                <div key={d.domain} style={{ marginBottom: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '4px' }}>
                    <span style={{ fontWeight: 600, color: '#374151' }}>{d.domain}</span>
                    <span style={{ fontWeight: 700, color: d.color }}>{d.pct}%</span>
                  </div>
                  <div style={{ background: '#f3f4f6', borderRadius: '999px', height: '8px' }}>
                    <div style={{ background: d.color, width: `${d.pct}%`, height: '100%', borderRadius: '999px' }} />
                  </div>
                </div>
              ))}
              <div style={{ fontSize: '0.78rem', color: '#6b7280', marginTop: '8px' }}>65 questions · 90 minutes · 700/1000 passing score · Multiple choice + Multiple response</div>
            </div>

            {/* Support plan table */}
            <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '14px', padding: '1.25rem', marginBottom: '1.25rem' }}>
              <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#111827', marginBottom: '10px' }}>Support Plans — Cheat Sheet</div>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
                  <thead>
                    <tr style={{ background: '#f8fafc' }}>
                      {['Plan', 'Cost', 'Critical SLA', 'TAM', 'Full TA'].map(h => (
                        <th key={h} style={{ padding: '8px 10px', textAlign: 'left', fontWeight: 700, color: '#374151', border: '1px solid #e5e7eb' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ['Basic', 'Free', '—', '❌', '❌'],
                      ['Developer', '$29+/mo', '—', '❌', '❌'],
                      ['Business', '$100+/mo', '<1 hr', '❌', '✅'],
                      ['Enterprise On-Ramp', '$5,500+/mo', '<30 min', 'Pool', '✅'],
                      ['Enterprise', '$15,000+/mo', '<15 min', 'Dedicated', '✅'],
                    ].map((row, i) => (
                      <tr key={i} style={{ background: i % 2 === 0 ? '#fff' : '#f9fafb' }}>
                        {row.map((cell, j) => <td key={j} style={{ padding: '7px 10px', color: '#374151', border: '1px solid #e5e7eb', fontWeight: j === 0 ? 700 : 400 }}>{cell}</td>)}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Shared responsibility */}
            <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '14px', padding: '1.25rem', marginBottom: '1.25rem' }}>
              <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#111827', marginBottom: '10px' }}>Shared Responsibility — Cheat Sheet</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '10px', padding: '12px' }}>
                  <div style={{ fontWeight: 700, color: '#1e40af', fontSize: '0.82rem', marginBottom: '6px' }}>☁️ AWS Manages</div>
                  {['Physical data centres', 'Network hardware', 'Hypervisor', 'Managed service OS (RDS, Lambda)', 'Global infrastructure'].map(i => (
                    <div key={i} style={{ fontSize: '0.78rem', color: '#374151', padding: '2px 0' }}>• {i}</div>
                  ))}
                </div>
                <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '10px', padding: '12px' }}>
                  <div style={{ fontWeight: 700, color: '#b91c1c', fontSize: '0.82rem', marginBottom: '6px' }}>👤 You Manage</div>
                  {['IAM users and policies', 'EC2 OS patches', 'Application security', 'Data encryption (your choice)', 'Security Groups & VPC config'].map(i => (
                    <div key={i} style={{ fontSize: '0.78rem', color: '#374151', padding: '2px 0' }}>• {i}</div>
                  ))}
                </div>
              </div>
            </div>

            {/* Pricing models */}
            <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '14px', padding: '1.25rem' }}>
              <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#111827', marginBottom: '10px' }}>EC2 Pricing Models — Quick Pick</div>
              {[
                { model: 'On-Demand', when: 'Testing, dev, unpredictable short-term workloads', discount: '0%', color: '#6b7280' },
                { model: 'Savings Plans', when: 'Flexible commitment. Covers EC2, Lambda, Fargate.', discount: '66-72%', color: '#059669' },
                { model: 'Reserved Instances', when: 'Specific instance type/region, steady-state 24/7', discount: '72%', color: '#2563eb' },
                { model: 'Spot Instances', when: 'Fault-tolerant, interruptible batch workloads', discount: '90%', color: '#d97706' },
                { model: 'Dedicated Host', when: 'BYOL, compliance, single-tenant requirement', discount: 'Varies', color: '#7c3aed' },
              ].map(p => (
                <div key={p.model} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid #f3f4f6' }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#111827' }}>{p.model}</div>
                    <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>{p.when}</div>
                  </div>
                  <div style={{ background: '#f3f4f6', color: p.color, padding: '3px 10px', borderRadius: '999px', fontSize: '0.78rem', fontWeight: 700, whiteSpace: 'nowrap' }}>
                    Save {p.discount}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── EXAM STRATEGY ── */}
        {activeTab === 'strategy' && (
          <div>
            <div style={{ background: 'linear-gradient(135deg, #ecfdf5, #f0fdf4)', border: '1px solid #a7f3d0', borderRadius: '14px', padding: '1.5rem', marginBottom: '1.5rem' }}>
              <div style={{ fontWeight: 900, fontSize: '1.1rem', color: '#064e3b', marginBottom: '0.5rem' }}>🎯 CLF-C02 Exam Strategy</div>
              <div style={{ color: '#065f46', fontSize: '0.875rem', lineHeight: 1.7 }}>
                65 questions · 90 minutes · 700/1000 to pass · Multiple choice (1 correct) and Multiple response (2+ correct)
              </div>
            </div>

            {[
              {
                title: '1. The 4 Question Lenses',
                icon: '🔍',
                items: [
                  '"Responsible for" → Go to Shared Responsibility Model. Is it AWS infrastructure or customer data/config?',
                  '"Most cost-effective" → Think: Spot (interruptible), Reserved (predictable), Savings Plans (flexible).',
                  '"Which pillar" → Match keywords: uptime = Reliability, encryption = Security, pricing = Cost Optimization.',
                  '"Which support plan" → TAM? = Enterprise. Full Trusted Advisor? = Business+. 24/7 phone? = Business+.',
                ],
              },
              {
                title: '2. Elimination Method',
                icon: '✂️',
                items: [
                  'CLF has only 2 plausible answers. The other 2 are obviously wrong — eliminate them first.',
                  'Look for absolutes ("always", "never") — they are usually wrong.',
                  'AWS never recommends using root account for daily tasks. Eliminate any option that does.',
                  'If one answer includes IAM Role and another includes access keys on EC2 → Role wins.',
                ],
              },
              {
                title: '3. Most Commonly Tested Concepts',
                icon: '📊',
                items: [
                  'Shared Responsibility Model — appears in 4-6 questions. Know who patches what.',
                  'Support Plans — know response times and TAM tiers cold.',
                  'IAM best practices — least privilege, MFA, roles over access keys.',
                  'S3 storage classes — match use case to storage class (especially Glacier tiers).',
                  'Cloud benefits — CapEx vs OpEx, elasticity, economies of scale.',
                  'Well-Architected pillars — be able to map any scenario to a pillar.',
                ],
              },
              {
                title: '4. Multiple Response Strategy',
                icon: '☑️',
                items: [
                  'The question tells you how many to select ("choose 2", "select 3").',
                  'All selected answers must be correct — partial credit is NOT given.',
                  'Eliminate obviously wrong first, then evaluate remaining options.',
                  'If you are unsure between 2 remaining options, guess — no penalty for wrong answers.',
                ],
              },
              {
                title: '5. Time Management',
                icon: '⏱️',
                items: [
                  '90 minutes ÷ 65 questions = 83 seconds per question. You have plenty of time.',
                  'Flag questions you are unsure about. Return after completing all others.',
                  'If you are spending >2 minutes on one question, mark and move.',
                  'Aim to finish all 65 with 20 minutes to review flagged questions.',
                  'No penalty for guessing — answer every question.',
                ],
              },
            ].map(section => (
              <div key={section.title} style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '14px', padding: '1.25rem', marginBottom: '1rem' }}>
                <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#111827', marginBottom: '10px' }}>
                  {section.icon} {section.title}
                </div>
                <ul style={{ margin: 0, paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {section.items.map((item, i) => (
                    <li key={i} style={{ color: '#374151', fontSize: '0.875rem', lineHeight: 1.6 }}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}

            <div style={{ background: '#fef9c3', border: '1px solid #fde047', borderRadius: '14px', padding: '1.25rem', textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', marginBottom: '6px' }}>💡</div>
              <div style={{ fontWeight: 800, color: '#713f12', marginBottom: '4px' }}>The CLF-C02 tests conceptual understanding, not memorisation of service names.</div>
              <div style={{ color: '#92400e', fontSize: '0.875rem', lineHeight: 1.6 }}>
                Know WHY each service exists and WHAT problem it solves. If you understand the Shared Responsibility Model, support plan tiers, IAM best practices, and cloud economics deeply — you will pass.
              </div>
            </div>
          </div>
        )}

        {/* ════════════════════════════════════════════════════════════
             CLF CODEX TAB
             ════════════════════════════════════════════════════════════ */}
        {activeTab === 'codex' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

            {/* SECTION 1 — CLOUD CONCEPTS */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}>
                <div style={{ width: '36px', height: '36px', background: 'linear-gradient(135deg,#059669,#065f46)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem' }}>☁️</div>
                <h3 style={{ fontWeight: 800, fontSize: '1.05rem', color: '#111827', margin: 0 }}>Section 1 — Cloud Concepts (The "Why AWS?")</h3>
              </div>

              {/* 6 Advantages */}
              <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', overflow: 'hidden', marginBottom: '12px' }}>
                <div style={{ padding: '12px 16px', background: '#ecfdf5', borderBottom: '1px solid #d1fae5' }}>
                  <h4 style={{ fontWeight: 700, fontSize: '0.88rem', color: '#064e3b', margin: 0 }}>📋 The 6 Advantages of Cloud Computing — Memorise Exactly</h4>
                </div>
                {[
                  { num: '1', advantage: 'Trade capital expense (CAPEX) for variable expense (OPEX)', note: 'No upfront hardware cost — pay only for what you use' },
                  { num: '2', advantage: 'Benefit from massive economies of scale', note: 'AWS buys hardware at a scale you never can — savings passed to you' },
                  { num: '3', advantage: 'Stop guessing capacity (elasticity)', note: 'Scale up or down in minutes instead of over-provisioning' },
                  { num: '4', advantage: 'Increase speed and agility', note: 'Resources available in minutes vs weeks for physical procurement' },
                  { num: '5', advantage: 'Stop spending money on running/maintaining data centers', note: 'AWS handles the undifferentiated heavy lifting' },
                  { num: '6', advantage: 'Go global in minutes', note: 'Deploy to multiple regions with a few clicks' },
                ].map((a, i) => (
                  <div key={i} style={{ display: 'grid', gridTemplateColumns: '28px 1fr', gap: '10px', padding: '9px 16px', borderTop: i > 0 ? '1px solid #f3f4f6' : 'none', background: i % 2 === 0 ? '#fff' : '#fafafa', alignItems: 'start' }}>
                    <span style={{ width: '22px', height: '22px', background: '#059669', color: '#fff', borderRadius: '50%', fontWeight: 800, fontSize: '0.72rem', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{a.num}</span>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.82rem', color: '#111827' }}>{a.advantage}</div>
                      <div style={{ fontSize: '0.76rem', color: '#6b7280', marginTop: '2px' }}>{a.note}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Deployment Models + Service Models side by side */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px' }}>

                {/* Deployment Models */}
                <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', overflow: 'hidden' }}>
                  <div style={{ padding: '12px 16px', background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                    <h4 style={{ fontWeight: 700, fontSize: '0.88rem', color: '#111827', margin: 0 }}>🏗️ Cloud Deployment Models</h4>
                  </div>
                  {[
                    { icon: '☁️', model: 'Public Cloud', desc: 'AWS — you share infrastructure with others. Lowest cost. No hardware ownership.' },
                    { icon: '🏢', model: 'Private Cloud', desc: 'On-premises data center you own entirely. Full control, highest cost.' },
                    { icon: '🔗', model: 'Hybrid Cloud', desc: 'AWS + on-prem connected via VPN or Direct Connect. Best of both worlds.' },
                  ].map((m, i) => (
                    <div key={i} style={{ display: 'flex', gap: '12px', padding: '12px 16px', borderTop: i > 0 ? '1px solid #f3f4f6' : 'none', background: i % 2 === 0 ? '#fff' : '#fafafa', alignItems: 'flex-start' }}>
                      <span style={{ fontSize: '1.2rem', flexShrink: 0 }}>{m.icon}</span>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.82rem', color: '#059669' }}>{m.model}</div>
                        <div style={{ fontSize: '0.78rem', color: '#374151', marginTop: '2px', lineHeight: 1.5 }}>{m.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Service Models — Fix #3: Lambda → FaaS */}
                <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', overflow: 'hidden' }}>
                  <div style={{ padding: '12px 16px', background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                    <h4 style={{ fontWeight: 700, fontSize: '0.88rem', color: '#111827', margin: 0 }}>🍕 Cloud Service Models</h4>
                  </div>
                  {[
                    { model: 'IaaS', full: 'Infrastructure as a Service', you: 'Manage OS and above', aws: 'Manages hardware', example: 'EC2, VPC, EBS', color: '#1d4ed8' },
                    { model: 'PaaS', full: 'Platform as a Service', you: 'Manage code + data', aws: 'Manages OS and above', example: 'Elastic Beanstalk, RDS', color: '#7c3aed' },
                    { model: 'FaaS', full: 'Function as a Service (Serverless)', you: 'Write functions only', aws: 'Manages everything else', example: 'Lambda (event-driven, ≤15 min)', color: '#0891b2' },
                    { model: 'SaaS', full: 'Software as a Service', you: 'Use the application', aws: 'Manages everything', example: 'Chime, WorkMail, Salesforce', color: '#059669' },
                  ].map((s, i) => (
                    <div key={i} style={{ padding: '10px 16px', borderTop: i > 0 ? '1px solid #f3f4f6' : 'none', background: i % 2 === 0 ? '#fff' : '#fafafa' }}>
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '3px' }}>
                        <span style={{ fontWeight: 800, fontSize: '0.78rem', background: `${s.color}18`, color: s.color, border: `1px solid ${s.color}33`, padding: '1px 7px', borderRadius: '5px' }}>{s.model}</span>
                        <span style={{ fontWeight: 700, fontSize: '0.78rem', color: '#111827' }}>{s.full}</span>
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#6b7280', lineHeight: 1.5 }}>You: {s.you} · Examples: <span style={{ fontWeight: 600, color: s.color }}>{s.example}</span></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* SECTION 2 — GLOBAL INFRASTRUCTURE */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}>
                <div style={{ width: '36px', height: '36px', background: 'linear-gradient(135deg,#0891b2,#0e7490)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem' }}>🌍</div>
                <h3 style={{ fontWeight: 800, fontSize: '1.05rem', color: '#111827', margin: 0 }}>Section 2 — Global Infrastructure</h3>
              </div>

              <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', overflow: 'hidden', marginBottom: '12px' }}>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
                    <thead>
                      <tr style={{ background: '#f0fdfa' }}>
                        {['Term', 'Definition', 'Exam Fact'].map(h => (
                          <th key={h} style={{ padding: '9px 12px', textAlign: 'left', fontWeight: 700, color: '#0e7490', borderBottom: '2px solid #a5f3fc', whiteSpace: 'nowrap' }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { term: 'Region', def: 'Geographic area containing multiple AZs', fact: 'Choose based on: compliance, latency, cost, service availability. Data stays in region unless you replicate.' },
                        // Fix #1: "typically 3 AZs (minimum 2)" not "minimum 3"
                        { term: 'Availability Zone (AZ)', def: 'Isolated data center(s) within a region', fact: 'Typically 3 AZs per region (minimum 2). Connected via low-latency private links. Survive AZ failure with Multi-AZ.' },
                        { term: 'Edge Location', def: 'CloudFront cache endpoint near users', fact: '400+ globally. Serves static content closest to users. Used by CloudFront + Global Accelerator.' },
                        { term: 'Regional Edge Cache', def: 'Larger cache between origin & Edge Locations', fact: 'Reduces calls to origin. Improves cache hit ratio for less-popular content.' },
                      ].map((r, i) => (
                        <tr key={i} style={{ background: i % 2 === 0 ? '#fff' : '#f0fdfa' }}>
                          <td style={{ padding: '9px 12px', fontWeight: 700, color: '#0e7490', whiteSpace: 'nowrap' }}>{r.term}</td>
                          <td style={{ padding: '9px 12px', color: '#374151' }}>{r.def}</td>
                          <td style={{ padding: '9px 12px', color: '#6b7280', lineHeight: 1.5 }}>{r.fact}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div style={{ background: '#f0fdfa', border: '1px solid #a5f3fc', borderRadius: '10px', padding: '1rem' }}>
                <div style={{ fontWeight: 700, fontSize: '0.82rem', color: '#0e7490', marginBottom: '8px' }}>🔑 Key Region Facts</div>
                {[
                  'us-east-1 (N. Virginia) = Most services, lowest cost, the default region for many services',
                  'Some services are region-specific (e.g., Amazon Lex available in select regions)',
                  'Data stays in its region unless you explicitly replicate (S3 CRR, Aurora Global Tables)',
                  'Compliance: GDPR → EU regions. HIPAA → eligible services + signed BAA with AWS',
                ].map((f, i) => (
                  <div key={i} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start', marginBottom: i < 3 ? '6px' : 0 }}>
                    <span style={{ color: '#059669', fontWeight: 800, flexShrink: 0 }}>✅</span>
                    <span style={{ fontSize: '0.8rem', color: '#134e4a', lineHeight: 1.55 }}>{f}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* SECTION 3 — CORE SERVICES */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}>
                <div style={{ width: '36px', height: '36px', background: 'linear-gradient(135deg,#1d4ed8,#3b82f6)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem' }}>⚙️</div>
                <h3 style={{ fontWeight: 800, fontSize: '1.05rem', color: '#111827', margin: 0 }}>Section 3 — Core Services Cheat Sheet</h3>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '12px' }}>

                {/* Compute */}
                <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', overflow: 'hidden' }}>
                  <div style={{ padding: '10px 14px', background: '#eff6ff', borderBottom: '1px solid #bfdbfe' }}>
                    <h4 style={{ fontWeight: 700, fontSize: '0.85rem', color: '#1d4ed8', margin: 0 }}>🖥️ Compute — Pick the Right One</h4>
                  </div>
                  {[
                    { svc: 'EC2', desc: 'Virtual servers — you manage the OS. Full control. IaaS.' },
                    { svc: 'Lambda', desc: 'Serverless functions (FaaS) — event-driven, ≤15 min, pay per request.' },
                    { svc: 'ECS / EKS', desc: 'Managed container orchestration (Docker / Kubernetes).' },
                    { svc: 'Elastic Beanstalk', desc: 'Deploy code without managing infrastructure. PaaS.' },
                    { svc: 'Lightsail', desc: 'Simple VPS for beginners. Fixed monthly pricing. Easy setup.' },
                  ].map((s, i) => (
                    <div key={i} style={{ display: 'grid', gridTemplateColumns: '130px 1fr', gap: '8px', padding: '8px 14px', borderTop: i > 0 ? '1px solid #f3f4f6' : 'none', background: i % 2 === 0 ? '#fff' : '#fafafa', alignItems: 'start' }}>
                      <span style={{ fontWeight: 700, fontSize: '0.8rem', color: '#1d4ed8', fontFamily: 'monospace' }}>{s.svc}</span>
                      <span style={{ fontSize: '0.78rem', color: '#374151', lineHeight: 1.5 }}>{s.desc}</span>
                    </div>
                  ))}
                </div>

                {/* Storage */}
                <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', overflow: 'hidden' }}>
                  <div style={{ padding: '10px 14px', background: '#fef9c3', borderBottom: '1px solid #fde047' }}>
                    <h4 style={{ fontWeight: 700, fontSize: '0.85rem', color: '#713f12', margin: 0 }}>📦 Storage — Match the Use Case</h4>
                  </div>
                  {[
                    { svc: 'S3', desc: 'Object storage. 11 nines durability. Unlimited scale. Any file type.' },
                    { svc: 'EBS', desc: 'Block storage attached to ONE EC2. AZ-locked. Like a hard drive.' },
                    { svc: 'EFS', desc: 'Shared file system for multiple Linux EC2. Multi-AZ. Pay-per-use.' },
                    { svc: 'FSx', desc: 'Managed Windows (SMB) / Lustre / NetApp file systems.' },
                    { svc: 'Snow Family', desc: 'Physical devices for offline data transfer (Edge computing → AWS).' },
                  ].map((s, i) => (
                    <div key={i} style={{ display: 'grid', gridTemplateColumns: '60px 1fr', gap: '8px', padding: '8px 14px', borderTop: i > 0 ? '1px solid #f3f4f6' : 'none', background: i % 2 === 0 ? '#fff' : '#fffbeb', alignItems: 'start' }}>
                      <span style={{ fontWeight: 700, fontSize: '0.8rem', color: '#b45309', fontFamily: 'monospace' }}>{s.svc}</span>
                      <span style={{ fontSize: '0.78rem', color: '#374151', lineHeight: 1.5 }}>{s.desc}</span>
                    </div>
                  ))}
                </div>

                {/* S3 Storage Classes */}
                <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', overflow: 'hidden' }}>
                  <div style={{ padding: '10px 14px', background: '#fff7ed', borderBottom: '1px solid #fed7aa' }}>
                    <h4 style={{ fontWeight: 700, fontSize: '0.85rem', color: '#c2410c', margin: 0 }}>🪣 S3 Storage Classes — Access Patterns</h4>
                  </div>
                  {[
                    { cls: 'Standard', when: 'Frequent access. Default class.' },
                    { cls: 'Intelligent-Tiering', when: 'Unknown/changing patterns. Auto-moves between tiers.' },
                    { cls: 'Standard-IA', when: 'Infrequent access, fast retrieval. Multi-AZ. Min 30 days.' },
                    { cls: 'One Zone-IA', when: 'Infrequent + reproducible data only. Single AZ. Cheaper.' },
                    { cls: 'Glacier Instant', when: 'Archive with milliseconds retrieval. Min 90 days.' },
                    { cls: 'Glacier Flexible', when: 'Archive — minutes to hours retrieval. Min 90 days.' },
                    { cls: 'Glacier Deep Archive', when: 'Long-term archive. 12h+ retrieval. Cheapest storage.' },
                  ].map((s, i) => (
                    <div key={i} style={{ display: 'grid', gridTemplateColumns: '150px 1fr', gap: '8px', padding: '7px 14px', borderTop: i > 0 ? '1px solid #f3f4f6' : 'none', background: i % 2 === 0 ? '#fff' : '#fff7ed', alignItems: 'start' }}>
                      <span style={{ fontWeight: 700, fontSize: '0.76rem', color: '#c2410c' }}>{s.cls}</span>
                      <span style={{ fontSize: '0.76rem', color: '#374151', lineHeight: 1.5 }}>{s.when}</span>
                    </div>
                  ))}
                </div>

                {/* Databases */}
                <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', overflow: 'hidden' }}>
                  <div style={{ padding: '10px 14px', background: '#fdf4ff', borderBottom: '1px solid #e9d5ff' }}>
                    <h4 style={{ fontWeight: 700, fontSize: '0.85rem', color: '#6b21a8', margin: 0 }}>🗃️ Databases — Relational vs NoSQL</h4>
                  </div>
                  {[
                    { svc: 'RDS', desc: 'Managed relational DBs (MySQL, PostgreSQL, Oracle, SQL Server). Multi-AZ = HA. Read Replicas = read scale.' },
                    { svc: 'Aurora', desc: 'AWS-native relational DB. 5× MySQL performance. Auto-scales. Compatible with MySQL/PostgreSQL.' },
                    { svc: 'DynamoDB', desc: 'NoSQL key-value. Single-digit ms latency. Serverless. Global Tables for multi-region.' },
                    { svc: 'ElastiCache', desc: 'In-memory cache (Redis/Memcached). Sub-millisecond. Reduces DB load.' },
                  ].map((s, i) => (
                    <div key={i} style={{ display: 'grid', gridTemplateColumns: '90px 1fr', gap: '8px', padding: '8px 14px', borderTop: i > 0 ? '1px solid #f3f4f6' : 'none', background: i % 2 === 0 ? '#fff' : '#fdf4ff', alignItems: 'start' }}>
                      <span style={{ fontWeight: 700, fontSize: '0.8rem', color: '#7c3aed', fontFamily: 'monospace' }}>{s.svc}</span>
                      <span style={{ fontSize: '0.78rem', color: '#374151', lineHeight: 1.5 }}>{s.desc}</span>
                    </div>
                  ))}
                </div>

                {/* Networking */}
                <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', overflow: 'hidden' }}>
                  <div style={{ padding: '10px 14px', background: '#ecfdf5', borderBottom: '1px solid #a7f3d0' }}>
                    <h4 style={{ fontWeight: 700, fontSize: '0.85rem', color: '#065f46', margin: 0 }}>🌐 Networking Basics</h4>
                  </div>
                  {[
                    { svc: 'VPC', desc: 'Your isolated virtual network inside AWS. Foundation for all resources.' },
                    { svc: 'Subnet', desc: 'Segment of VPC. Public = route to IGW. Private = no direct internet.' },
                    { svc: 'IGW', desc: 'Internet Gateway — allows VPC ↔ Internet communication (bidirectional).' },
                    { svc: 'NAT Gateway', desc: 'Lets private instances reach internet outbound only. In public subnet.' },
                    { svc: 'Security Group', desc: 'Stateful firewall at instance level. Allow rules only.' },
                    { svc: 'NACL', desc: 'Stateless firewall at subnet level. Allow + Deny rules. Processed in order.' },
                    { svc: 'Route 53', desc: 'DNS service. Domain registration. Health checks. Routing policies.' },
                  ].map((s, i) => (
                    <div key={i} style={{ display: 'grid', gridTemplateColumns: '110px 1fr', gap: '8px', padding: '7px 14px', borderTop: i > 0 ? '1px solid #f3f4f6' : 'none', background: i % 2 === 0 ? '#fff' : '#ecfdf5', alignItems: 'start' }}>
                      <span style={{ fontWeight: 700, fontSize: '0.78rem', color: '#059669', fontFamily: 'monospace' }}>{s.svc}</span>
                      <span style={{ fontSize: '0.77rem', color: '#374151', lineHeight: 1.5 }}>{s.desc}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* SECTION 4 — SECURITY */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}>
                <div style={{ width: '36px', height: '36px', background: 'linear-gradient(135deg,#dc2626,#991b1b)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem' }}>🔐</div>
                <h3 style={{ fontWeight: 800, fontSize: '1.05rem', color: '#111827', margin: 0 }}>Section 4 — Security &amp; Compliance</h3>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '12px' }}>

                {/* Shared Responsibility */}
                <div style={{ background: '#fff', border: '2px solid #fca5a5', borderRadius: '12px', padding: '1.25rem' }}>
                  <h4 style={{ fontWeight: 800, fontSize: '0.9rem', color: '#dc2626', margin: '0 0 1rem' }}>🤝 Shared Responsibility Model — EXAM CRITICAL</h4>
                  <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '8px', padding: '10px 14px', marginBottom: '8px' }}>
                    <div style={{ fontWeight: 700, fontSize: '0.8rem', color: '#1d4ed8', marginBottom: '4px' }}>AWS Responsible FOR (Security OF the cloud)</div>
                    <div style={{ fontSize: '0.78rem', color: '#374151', lineHeight: 1.6 }}>Hardware · Software · Networking · Physical facilities · Hypervisor · Managed service OS patches</div>
                  </div>
                  <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: '8px', padding: '10px 14px', marginBottom: '10px' }}>
                    <div style={{ fontWeight: 700, fontSize: '0.8rem', color: '#059669', marginBottom: '4px' }}>Customer Responsible FOR (Security IN the cloud)</div>
                    <div style={{ fontSize: '0.78rem', color: '#374151', lineHeight: 1.6 }}>Data · IAM users/roles/policies · OS patching on EC2 · Application security · Encryption settings · Firewall config</div>
                  </div>
                  <div style={{ background: '#fef9c3', border: '1px solid #fde047', borderRadius: '8px', padding: '8px 12px' }}>
                    <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#713f12' }}>💡 Mnemonic: </span>
                    <span style={{ fontSize: '0.78rem', color: '#78350f' }}>"AWS protects the cloud. You protect what's IN it."</span>
                  </div>
                </div>

                {/* IAM */}
                <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', overflow: 'hidden' }}>
                  <div style={{ padding: '10px 14px', background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                    <h4 style={{ fontWeight: 700, fontSize: '0.85rem', color: '#111827', margin: 0 }}>🔑 IAM Fundamentals</h4>
                  </div>
                  {[
                    { term: 'User', def: 'Person or service that interacts with AWS. Has credentials (password + access keys).' },
                    { term: 'Group', def: 'Collection of users. Attach policies to groups — not individual users.' },
                    { term: 'Role', def: 'Temporary credentials for EC2, Lambda, or cross-account access. No long-term keys.' },
                    { term: 'Policy', def: 'JSON document defining permissions. Always apply least privilege.' },
                    { term: 'MFA', def: 'Multi-factor authentication. REQUIRED for root account. Best practice for all users.' },
                  ].map((r, i) => (
                    <div key={i} style={{ display: 'grid', gridTemplateColumns: '55px 1fr', gap: '10px', padding: '9px 14px', borderTop: i > 0 ? '1px solid #f3f4f6' : 'none', background: i % 2 === 0 ? '#fff' : '#fafafa', alignItems: 'start' }}>
                      <span style={{ fontWeight: 700, fontSize: '0.78rem', color: '#dc2626' }}>{r.term}</span>
                      <span style={{ fontSize: '0.77rem', color: '#374151', lineHeight: 1.5 }}>{r.def}</span>
                    </div>
                  ))}
                </div>

                {/* Security Services */}
                <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', overflow: 'hidden' }}>
                  <div style={{ padding: '10px 14px', background: '#fef2f2', borderBottom: '1px solid #fecaca' }}>
                    <h4 style={{ fontWeight: 700, fontSize: '0.85rem', color: '#991b1b', margin: 0 }}>🛡️ Security Services Overview</h4>
                  </div>
                  {[
                    { svc: 'Shield Standard', desc: 'Free DDoS protection — always on for all AWS customers.' },
                    { svc: 'WAF', desc: 'Web Application Firewall. Blocks SQLi, XSS, bots. Layer 7.' },
                    { svc: 'KMS', desc: 'Key Management Service. Create and manage encryption keys.' },
                    { svc: 'CloudTrail', desc: 'Logs ALL API calls. Audit who did what and when. Always enable.' },
                    { svc: 'Config', desc: 'Tracks resource config changes over time. Compliance auditing.' },
                    { svc: 'GuardDuty', desc: 'Threat detection using ML + threat intelligence feeds.' },
                    { svc: 'Inspector', desc: 'Vulnerability scanning for EC2 instances and Lambda functions.' },
                  ].map((s, i) => (
                    <div key={i} style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '8px', padding: '7px 14px', borderTop: i > 0 ? '1px solid #f3f4f6' : 'none', background: i % 2 === 0 ? '#fff' : '#fef2f2', alignItems: 'start' }}>
                      <span style={{ fontWeight: 700, fontSize: '0.77rem', color: '#dc2626' }}>{s.svc}</span>
                      <span style={{ fontSize: '0.77rem', color: '#374151', lineHeight: 1.5 }}>{s.desc}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* SECTION 5 — BILLING */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}>
                <div style={{ width: '36px', height: '36px', background: 'linear-gradient(135deg,#059669,#065f46)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem' }}>💰</div>
                <h3 style={{ fontWeight: 800, fontSize: '1.05rem', color: '#111827', margin: 0 }}>Section 5 — Billing &amp; Pricing</h3>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '12px' }}>

                {/* Pricing Models — Fix #2: RI 72% not 75% */}
                <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', overflow: 'hidden' }}>
                  <div style={{ padding: '10px 14px', background: '#ecfdf5', borderBottom: '1px solid #a7f3d0' }}>
                    <h4 style={{ fontWeight: 700, fontSize: '0.85rem', color: '#065f46', margin: 0 }}>EC2 Pricing Models</h4>
                  </div>
                  {[
                    { model: 'On-Demand', discount: 'List price', when: 'Short-term, unpredictable, testing. No commitment.', color: '#6b7280' },
                    { model: 'Savings Plans', discount: 'Up to 72%', when: 'Commit to $/hr for 1–3 yrs. Flexible across services + regions.', color: '#2563eb' },
                    { model: 'Reserved Instances', discount: 'Up to 72%', when: 'Specific instance type + region, 1–3 yr. Predictable, steady-state.', color: '#7c3aed' },
                    { model: 'Spot Instances', discount: 'Up to 90%', when: 'Fault-tolerant, stateless, batch. Can be interrupted with 2-min notice.', color: '#d97706' },
                  ].map((p, i) => (
                    <div key={i} style={{ display: 'grid', gridTemplateColumns: '150px 70px 1fr', gap: '8px', padding: '9px 14px', borderTop: i > 0 ? '1px solid #f3f4f6' : 'none', background: i % 2 === 0 ? '#fff' : '#ecfdf5', alignItems: 'start' }}>
                      <span style={{ fontWeight: 700, fontSize: '0.8rem', color: p.color }}>{p.model}</span>
                      <span style={{ fontWeight: 700, fontSize: '0.78rem', color: '#059669' }}>{p.discount}</span>
                      <span style={{ fontSize: '0.77rem', color: '#374151', lineHeight: 1.5 }}>{p.when}</span>
                    </div>
                  ))}
                </div>

                {/* Free Tier */}
                <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', overflow: 'hidden' }}>
                  <div style={{ padding: '10px 14px', background: '#f0fdf4', borderBottom: '1px solid #bbf7d0' }}>
                    <h4 style={{ fontWeight: 700, fontSize: '0.85rem', color: '#15803d', margin: 0 }}>🎁 Free Tier (12 months from sign-up)</h4>
                  </div>
                  {[
                    '750 hrs/month EC2 t2/t3.micro (Linux or Windows)',
                    '5 GB S3 Standard storage',
                    '25 GB DynamoDB storage (Always Free)',
                    '1 million Lambda requests/month (Always Free)',
                    '100 GB data transfer OUT to internet/month',
                  ].map((f, i) => (
                    <div key={i} style={{ display: 'flex', gap: '10px', padding: '8px 14px', borderTop: i > 0 ? '1px solid #f3f4f6' : 'none', background: i % 2 === 0 ? '#fff' : '#f0fdf4', alignItems: 'center' }}>
                      <span style={{ color: '#16a34a', fontWeight: 800, flexShrink: 0 }}>✅</span>
                      <span style={{ fontSize: '0.78rem', color: '#374151' }}>{f}</span>
                    </div>
                  ))}
                </div>

                {/* Support Plans */}
                <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', overflow: 'hidden' }}>
                  <div style={{ padding: '10px 14px', background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                    <h4 style={{ fontWeight: 700, fontSize: '0.85rem', color: '#111827', margin: 0 }}>📞 Support Plans — Know the Differences</h4>
                  </div>
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.75rem' }}>
                      <thead>
                        <tr style={{ background: '#f1f5f9' }}>
                          {['Plan', 'Cost', 'Critical Response', 'Key Feature'].map(h => (
                            <th key={h} style={{ padding: '7px 10px', textAlign: 'left', fontWeight: 700, color: '#374151', borderBottom: '1px solid #e5e7eb', whiteSpace: 'nowrap' }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          { plan: 'Basic', cost: 'Free', resp: 'None', feat: 'Forums + Health Dashboard', color: '#6b7280' },
                          { plan: 'Developer', cost: '$29/mo', resp: '12 hours', feat: 'Business-hours email support', color: '#059669' },
                          { plan: 'Business', cost: '$100/mo', resp: '1 hour', feat: '24/7 phone/chat + full Trusted Advisor', color: '#2563eb' },
                          { plan: 'Enterprise On-Ramp', cost: '$5,500/mo', resp: '30 min', feat: 'Pool of TAMs + proactive guidance', color: '#7c3aed' },
                          { plan: 'Enterprise', cost: '$15,000+/mo', resp: '15 min', feat: 'Dedicated TAM + Infrastructure Event Mgmt', color: '#dc2626' },
                        ].map((r, i) => (
                          <tr key={i} style={{ background: i % 2 === 0 ? '#fff' : '#fafafa' }}>
                            <td style={{ padding: '7px 10px', fontWeight: 700, color: r.color, whiteSpace: 'nowrap' }}>{r.plan}</td>
                            <td style={{ padding: '7px 10px', color: '#374151', whiteSpace: 'nowrap' }}>{r.cost}</td>
                            <td style={{ padding: '7px 10px', fontWeight: 700, color: '#dc2626', whiteSpace: 'nowrap' }}>{r.resp}</td>
                            <td style={{ padding: '7px 10px', color: '#6b7280', lineHeight: 1.5 }}>{r.feat}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Cost Tools */}
                <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', overflow: 'hidden' }}>
                  <div style={{ padding: '10px 14px', background: '#ecfdf5', borderBottom: '1px solid #a7f3d0' }}>
                    <h4 style={{ fontWeight: 700, fontSize: '0.85rem', color: '#065f46', margin: 0 }}>🔧 Cost Management Tools</h4>
                  </div>
                  {[
                    { tool: 'Cost Explorer', desc: 'Visualise spending trends. Forecast 12 months. Filter by tag/service/account.' },
                    { tool: 'Budgets', desc: 'Set custom cost/usage alerts. Notify via email or SNS when threshold exceeded.' },
                    { tool: 'Trusted Advisor', desc: 'Best practice checks: cost, security, performance, fault tolerance, limits.' },
                    { tool: 'AWS Organizations', desc: 'Consolidated billing across accounts. Volume discounts. SCPs for governance.' },
                    { tool: 'Pricing Calculator', desc: 'Estimate monthly AWS costs before deploying. No sign-in required.' },
                  ].map((t, i) => (
                    <div key={i} style={{ display: 'grid', gridTemplateColumns: '140px 1fr', gap: '8px', padding: '8px 14px', borderTop: i > 0 ? '1px solid #f3f4f6' : 'none', background: i % 2 === 0 ? '#fff' : '#ecfdf5', alignItems: 'start' }}>
                      <span style={{ fontWeight: 700, fontSize: '0.78rem', color: '#059669' }}>{t.tool}</span>
                      <span style={{ fontSize: '0.77rem', color: '#374151', lineHeight: 1.5 }}>{t.desc}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* EXAM STRATEGY QUICK CARD */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}>
                <div style={{ width: '36px', height: '36px', background: 'linear-gradient(135deg,#059669,#0891b2)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem' }}>🎯</div>
                <h3 style={{ fontWeight: 800, fontSize: '1.05rem', color: '#111827', margin: 0 }}>Quick Exam Strategy</h3>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '12px' }}>

                <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '1.25rem' }}>
                  <h4 style={{ fontWeight: 700, fontSize: '0.88rem', color: '#111827', margin: '0 0 10px' }}>🔎 Question Patterns</h4>
                  {[
                    { trigger: '"Which service is BEST for…?"', answer: 'Match use case to service from the cheat sheet' },
                    { trigger: '"Who is responsible for…?"', answer: 'Apply Shared Responsibility Model' },
                    { trigger: '"How to reduce cost…?"', answer: 'Right-size → S3 lifecycle → correct pricing model' },
                    { trigger: '"Which is MOST secure…?"', answer: 'MFA + least privilege IAM + encryption + CloudTrail' },
                    { trigger: '"AWS manages vs customer manages?"', answer: 'Security OF vs security IN the cloud' },
                  ].map((p, i) => (
                    <div key={i} style={{ marginBottom: i < 4 ? '8px' : 0, paddingBottom: i < 4 ? '8px' : 0, borderBottom: i < 4 ? '1px solid #f3f4f6' : 'none' }}>
                      <div style={{ fontSize: '0.77rem', fontStyle: 'italic', color: '#6b7280', marginBottom: '2px' }}>{p.trigger}</div>
                      <div style={{ fontSize: '0.79rem', fontWeight: 700, color: '#059669' }}>→ {p.answer}</div>
                    </div>
                  ))}
                </div>

                <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '1.25rem' }}>
                  <h4 style={{ fontWeight: 700, fontSize: '0.88rem', color: '#111827', margin: '0 0 10px' }}>✂️ Quick Elimination Tricks</h4>
                  {[
                    '"Install OS patches on RDS" → WRONG (AWS manages RDS OS)',
                    '"EC2 for serverless" → WRONG (EC2 is not serverless — use Lambda)',
                    '"S3 for relational queries" → WRONG (use RDS/Aurora)',
                    '"Root account for daily tasks" → WRONG (always use IAM users/roles)',
                    '"Access keys on EC2" → WRONG (use IAM Role — never embed credentials)',
                  ].map((e, i) => (
                    <div key={i} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start', marginBottom: i < 4 ? '7px' : 0 }}>
                      <span style={{ color: '#ef4444', fontWeight: 800, fontSize: '0.8rem', flexShrink: 0 }}>❌</span>
                      <span style={{ fontSize: '0.78rem', color: '#374151', lineHeight: 1.5 }}>{e}</span>
                    </div>
                  ))}
                </div>

                <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '12px', padding: '1.25rem' }}>
                  <h4 style={{ fontWeight: 700, fontSize: '0.88rem', color: '#15803d', margin: '0 0 10px' }}>☑️ Final 24-Hour Checklist</h4>
                  {[
                    'Memorise the 6 cloud advantages (exact wording)',
                    'Know Shared Responsibility Model cold — OF vs IN',
                    'Match all 7 S3 classes to their access patterns',
                    'Distinguish Security Groups (stateful) vs NACLs (stateless)',
                    'Recall support plan response times + TAM tiers',
                    'Remember: Multi-AZ = HA within region. Multi-Region = DR.',
                    'FaaS/Lambda is NOT PaaS — it\'s serverless compute',
                    'Sleep well 😴',
                  ].map((c, i) => (
                    <div key={i} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start', marginBottom: i < 7 ? '6px' : 0 }}>
                      <span style={{ color: '#16a34a', fontWeight: 800, fontSize: '0.85rem', flexShrink: 0 }}>✓</span>
                      <span style={{ fontSize: '0.78rem', color: '#166534', lineHeight: 1.5 }}>{c}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* CLF MANTRA */}
            <div style={{ background: 'linear-gradient(135deg, #064e3b 0%, #059669 50%, #065f46 100%)', borderRadius: '1.25rem', padding: '2rem', textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>☁️</div>
              <h3 style={{ color: '#ecfdf5', fontWeight: 800, fontSize: '1.1rem', margin: '0 0 1rem' }}>The CLF Practitioner's Mantra</h3>
              <div style={{ maxWidth: '620px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {[
                  '"AWS protects the cloud. You protect what\'s in it."',
                  '"Stateful = Security Groups. Stateless = NACLs. Never confuse them."',
                  '"Multi-AZ survives AZ failure. Multi-Region survives region failure."',
                  '"TAM requires Enterprise or Enterprise On-Ramp. Full Trusted Advisor requires Business+."',
                  '"Reserved = predictable. Spot = interruptible. Savings Plans = flexible commitment."',
                  '"The CLF tests conceptual understanding — know WHY each service exists."',
                ].map((m, i) => (
                  <div key={i} style={{ background: 'rgba(255,255,255,0.1)', borderRadius: '8px', padding: '10px 16px' }}>
                    <span style={{ color: '#a7f3d0', fontSize: '0.84rem', fontStyle: 'italic', lineHeight: 1.55 }}>{m}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}
      </div>
    </Layout>
  )
}
