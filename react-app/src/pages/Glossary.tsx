import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import { useAuth } from '../contexts/AuthContext'

interface Term {
  term: string
  short: string
  definition: string
  category: string
  icon: string
}

const terms: Term[] = [
  { icon: '🖥️',  term: 'Amazon EC2', short: 'Elastic Compute Cloud - Virtual servers in the AWS cloud', definition: 'Amazon Elastic Compute Cloud (EC2) is a web service that provides secure, resizable compute capacity in the cloud. It is designed to make web-scale cloud computing easier for developers.', category: 'compute' },
  { icon: '🪣',  term: 'Amazon S3', short: "Simple Storage Service - Object storage with 11 9's durability", definition: "Amazon Simple Storage Service (S3) is an object storage service offering industry-leading scalability, data availability, security, and performance. It provides 99.999999999% (11 9's) durability.", category: 'storage' },
  { icon: '🌐',  term: 'Amazon VPC', short: 'Virtual Private Cloud - Isolated network section in AWS', definition: 'Amazon Virtual Private Cloud (VPC) lets you provision a logically isolated section of the AWS Cloud where you can launch AWS resources in a virtual network that you define.', category: 'networking' },
  { icon: '🛡️',  term: 'IAM', short: 'Identity and Access Management - Manage access to AWS services', definition: 'AWS Identity and Access Management (IAM) enables you to manage access to AWS services and resources securely. Using IAM, you can create and manage AWS users and groups, and use permissions to allow and deny their access to AWS resources.', category: 'security' },
  { icon: '🗄️',  term: 'Amazon RDS', short: 'Relational Database Service - Managed relational databases', definition: 'Amazon Relational Database Service (RDS) makes it easy to set up, operate, and scale a relational database in the cloud. It provides cost-efficient and resizable capacity while automating time-consuming administration tasks.', category: 'database' },
  { icon: '⚡',  term: 'AWS Lambda', short: 'Serverless compute - Run code without managing servers', definition: 'AWS Lambda is a serverless compute service that lets you run code without provisioning or managing servers. You pay only for the compute time you consume.', category: 'compute' },
  { icon: '📈',  term: 'Auto Scaling', short: 'Automatically adjust EC2 capacity based on demand', definition: 'Auto Scaling helps you ensure that you have the correct number of Amazon EC2 instances available to handle the load for your application. It automatically increases or decreases capacity based on conditions you define.', category: 'compute' },
  { icon: '🌍',  term: 'Amazon CloudFront', short: 'Content Delivery Network (CDN) - Global edge locations', definition: 'Amazon CloudFront is a fast content delivery network (CDN) service that securely delivers data, videos, applications, and APIs to customers globally with low latency and high transfer speeds.', category: 'networking' },
  { icon: '🔵',  term: 'Amazon DynamoDB', short: 'NoSQL database - Fully managed, single-digit millisecond latency', definition: "Amazon DynamoDB is a key-value and document database that delivers single-digit millisecond performance at any scale. It's a fully managed, multi-region, multi-active, durable database with built-in security, backup and restore, and in-memory caching.", category: 'database' },
  { icon: '⚖️',  term: 'Elastic Load Balancer (ELB)', short: 'Distribute traffic across multiple targets', definition: 'Elastic Load Balancing automatically distributes incoming application traffic across multiple targets, such as Amazon EC2 instances, containers, and IP addresses, in one or more Availability Zones.', category: 'networking' },
  { icon: '🌟',  term: 'Amazon Aurora', short: 'MySQL and PostgreSQL-compatible relational database', definition: 'Amazon Aurora is a MySQL and PostgreSQL-compatible relational database built for the cloud, combining the performance and availability of traditional enterprise databases with the simplicity and cost-effectiveness of open source databases.', category: 'database' },
  { icon: '🧭',  term: 'Amazon Route 53', short: 'Scalable DNS and domain registration service', definition: 'Amazon Route 53 is a highly available and scalable cloud Domain Name System (DNS) web service. It is designed to give developers and businesses a reliable way to route end users to Internet applications.', category: 'networking' },
  { icon: '💾',  term: 'Amazon EBS', short: 'Elastic Block Store - Block storage for EC2', definition: 'Amazon Elastic Block Store (EBS) provides block level storage volumes for use with EC2 instances. EBS volumes are highly available and reliable storage volumes that can be attached to any running instance in the same Availability Zone.', category: 'storage' },
  { icon: '🔑',  term: 'AWS KMS', short: 'Key Management Service - Encryption key management', definition: 'AWS Key Management Service (KMS) makes it easy to create and manage cryptographic keys and control their use across a wide range of AWS services and in your applications.', category: 'security' },
  { icon: '📬',  term: 'Amazon SQS', short: 'Simple Queue Service - Fully managed message queuing', definition: 'Amazon Simple Queue Service (SQS) is a fully managed message queuing service that enables you to decouple and scale microservices, distributed systems, and serverless applications.', category: 'integration' },
  { icon: '📢',  term: 'Amazon SNS', short: 'Simple Notification Service - Pub/sub messaging', definition: 'Amazon Simple Notification Service (SNS) is a fully managed messaging service for both application-to-application (A2A) and application-to-person (A2P) communication.', category: 'integration' },
  { icon: '👣',  term: 'AWS CloudTrail', short: 'Track user activity and API usage', definition: 'AWS CloudTrail is a service that enables governance, compliance, operational auditing, and risk auditing of your AWS account. It logs, continuously monitors, and retains account activity related to actions across your AWS infrastructure.', category: 'security' },
  { icon: '📊',  term: 'Amazon CloudWatch', short: 'Monitoring and observability service', definition: 'Amazon CloudWatch is a monitoring and observability service that provides data and actionable insights to monitor applications, respond to system-wide performance changes, and optimize resource utilization.', category: 'management' },
  { icon: '🔌',  term: 'AWS Direct Connect', short: 'Dedicated network connection to AWS', definition: 'AWS Direct Connect is a cloud service solution that makes it easy to establish a dedicated network connection from your premises to AWS. It can reduce network costs, increase bandwidth throughput, and provide a more consistent network experience.', category: 'networking' },
  { icon: '🏎️',  term: 'Amazon ElastiCache', short: 'In-memory caching service - Redis and Memcached', definition: 'Amazon ElastiCache is a web service that makes it easy to deploy, operate, and scale an in-memory cache in the cloud. It supports two open-source in-memory caching engines: Redis and Memcached.', category: 'caching' },
  { icon: '🔥',  term: 'Security Group', short: 'Virtual firewall for EC2 instances (stateful)', definition: 'A security group acts as a virtual firewall for your instance to control inbound and outbound traffic. Security groups are stateful - return traffic is automatically allowed, regardless of outbound rules.', category: 'security' },
  { icon: '🚧',  term: 'Network ACL (NACL)', short: 'Subnet-level firewall (stateless)', definition: 'A network access control list (NACL) is an optional layer of security for your VPC that acts as a firewall for controlling traffic in and out of one or more subnets. NACLs are stateless - return traffic must be explicitly allowed.', category: 'security' },
  { icon: '📁',  term: 'Amazon EFS', short: 'Elastic File System - Scalable NFS file storage', definition: 'Amazon Elastic File System (EFS) provides a simple, serverless, set-and-forget elastic file system that lets you share file data without provisioning or managing storage. It can be used with AWS Cloud services and on-premises resources.', category: 'storage' },
  { icon: '🔰',  term: 'AWS WAF', short: 'Web Application Firewall - Protect web apps', definition: 'AWS WAF is a web application firewall that helps protect your web applications or APIs against common web exploits and bots that may affect availability, compromise security, or consume excessive resources.', category: 'security' },
  { icon: '🌊',  term: 'Amazon Kinesis', short: 'Real-time data streaming and analytics', definition: 'Amazon Kinesis makes it easy to collect, process, and analyze real-time, streaming data so you can get timely insights and react quickly to new information.', category: 'analytics' },
  { icon: '📝',  term: 'AWS CloudFormation', short: 'Infrastructure as Code - Automate resource provisioning', definition: 'AWS CloudFormation provides a common language for you to describe and provision all the infrastructure resources in your cloud environment. It allows you to use a simple text file to model and provision all the resources needed for your applications.', category: 'management' },
  { icon: '🏭',  term: 'Amazon Redshift', short: 'Data warehouse for analytics - Petabyte-scale', definition: 'Amazon Redshift is a fast, scalable data warehouse that makes it simple and cost-effective to analyze all your data across your data warehouse and data lake. It delivers faster performance than other data warehouses.', category: 'database' },
  { icon: '🛡️',  term: 'AWS Shield', short: 'DDoS protection service', definition: 'AWS Shield is a managed Distributed Denial of Service (DDoS) protection service that safeguards applications running on AWS. AWS Shield Standard is included at no extra cost, while Shield Advanced provides enhanced protections.', category: 'security' },
  { icon: '🚪',  term: 'Amazon API Gateway', short: 'Create, publish, and manage APIs', definition: 'Amazon API Gateway is a fully managed service that makes it easy for developers to create, publish, maintain, monitor, and secure APIs at any scale. It handles all the tasks involved in accepting and processing API calls.', category: 'networking' },
  { icon: '🏙️',  term: 'Multi-AZ Deployment', short: 'High availability across multiple Availability Zones', definition: 'Multi-AZ (Availability Zone) deployment provides enhanced availability and durability for AWS resources. For RDS, it automatically replicates data to a standby instance in a different AZ, with automatic failover in case of failure.', category: 'architecture' },
  { icon: '📋',  term: 'Read Replica', short: 'Read-only copy of database for scaling reads', definition: 'Read replicas allow you to create read-only copies of your database. They are used primarily for read-heavy workloads to offload traffic from the primary database. Replication is asynchronous.', category: 'database' },
  { icon: '🔀',  term: 'NAT Gateway', short: 'Enable internet access for private subnet resources', definition: 'A NAT (Network Address Translation) gateway allows instances in a private subnet to connect to the internet or other AWS services, but prevents the internet from initiating connections with those instances.', category: 'networking' },
  { icon: '🕵️',  term: 'Amazon GuardDuty', short: 'Intelligent threat detection service', definition: 'Amazon GuardDuty is a threat detection service that continuously monitors for malicious activity and unauthorized behavior to protect your AWS accounts, workloads, and data stored in Amazon S3.', category: 'security' },
  { icon: '🎛️',  term: 'AWS Systems Manager', short: 'Operational hub for AWS resources', definition: 'AWS Systems Manager gives you visibility and control of your infrastructure on AWS. It provides a unified user interface to view operational data and automate operational tasks across your AWS resources.', category: 'management' },
  { icon: '🔎',  term: 'Amazon Athena', short: 'Serverless SQL queries on S3 data', definition: 'Amazon Athena is an interactive query service that makes it easy to analyze data in Amazon S3 using standard SQL. It is serverless, so there is no infrastructure to manage, and you pay only for the queries that you run.', category: 'analytics' },
  { icon: '🧩',  term: 'AWS Glue', short: 'Serverless ETL service - Extract, Transform, Load', definition: 'AWS Glue is a fully managed extract, transform, and load (ETL) service that makes it easy to prepare and load data for analytics. It can automatically discover and catalog your data.', category: 'analytics' },
  { icon: '💽',  term: 'Amazon FSx', short: 'Fully managed third-party file systems', definition: 'Amazon FSx provides fully managed third-party file systems. FSx for Windows File Server provides a Windows-native SMB file system. FSx for Lustre provides a high-performance parallel file system for HPC and ML workloads.', category: 'storage' },
  { icon: '🗂️',  term: 'AWS Backup', short: 'Centralized managed backup across AWS services', definition: 'AWS Backup is a fully managed service that centralizes and automates data protection across AWS services and hybrid workloads. It supports EC2, EBS, RDS, DynamoDB, EFS, FSx, Storage Gateway, and more from a single console.', category: 'management' },
  { icon: '🏢',  term: 'AWS Organizations', short: 'Multi-account management and governance', definition: 'AWS Organizations lets you centrally manage multiple AWS accounts. It enables consolidated billing, account grouping via Organizational Units (OUs), and policy enforcement via Service Control Policies (SCPs). SCPs set the maximum permissions for accounts.', category: 'security' },
  { icon: '🔄',  term: 'AWS Step Functions', short: 'Serverless workflow orchestration service', definition: 'AWS Step Functions is a serverless orchestration service that lets you coordinate multiple AWS services into workflows (state machines). Supports Standard Workflows (long-running, exactly-once) and Express Workflows (high-volume, at-least-once).', category: 'integration' },
  { icon: '🗝️',  term: 'AWS Secrets Manager', short: 'Rotate, manage, and retrieve secrets automatically', definition: 'AWS Secrets Manager helps you protect secrets needed to access applications, services, and IT resources. It enables automatic rotation of secrets (database credentials, API keys) without application changes. Designed specifically for secrets with built-in rotation.', category: 'security' },
  { icon: '🔍',  term: 'Amazon Inspector', short: 'Automated vulnerability assessment for EC2 and containers', definition: 'Amazon Inspector is an automated vulnerability management service that continuously scans AWS workloads for software vulnerabilities and unintended network exposure. It covers EC2 instances, container images in ECR, and Lambda functions.', category: 'security' },
  { icon: '⚙️',  term: 'AWS Config', short: 'Track resource configuration changes and compliance', definition: 'AWS Config continuously monitors and records AWS resource configurations and allows you to evaluate them against desired configurations. It maintains a history of configuration changes and can trigger remediation actions.', category: 'management' },
  { icon: '🎯',  term: 'AWS Security Hub', short: 'Centralized cloud security posture management', definition: 'AWS Security Hub provides a comprehensive view of your security state across AWS accounts. It aggregates findings from GuardDuty, Inspector, Macie, IAM Access Analyzer, and third-party tools into a single dashboard with automated compliance checks.', category: 'security' },
  { icon: '🔁',  term: 'AWS DataSync', short: 'Automated online data transfer between on-prem and AWS', definition: 'AWS DataSync is an online data transfer service that simplifies, automates, and accelerates copying data between on-premises storage and AWS storage services (S3, EFS, FSx). It supports NFS, SMB, HDFS, and object storage.', category: 'storage' },
  { icon: '🤖',  term: 'Amazon Macie', short: 'ML-powered sensitive data discovery in S3', definition: 'Amazon Macie uses machine learning to automatically discover, classify, and protect sensitive data in Amazon S3. It identifies PII, financial data, credentials, and other sensitive content, and generates findings for remediation.', category: 'security' },
  { icon: '🚚',  term: 'AWS DMS', short: 'Database Migration Service - migrate databases to AWS', definition: 'AWS Database Migration Service (DMS) helps you migrate databases to AWS quickly and securely. Supports homogeneous and heterogeneous migrations. The source database remains operational during migration (minimal downtime).', category: 'database' },
  { icon: '🔗',  term: 'Amazon RDS Proxy', short: 'Managed database proxy for connection pooling', definition: 'Amazon RDS Proxy is a fully managed, highly available database proxy that pools and shares database connections. It improves application scalability, reduces failover time, and is especially useful with Lambda functions.', category: 'database' },
  { icon: '🌉',  term: 'AWS EventBridge', short: 'Serverless event bus for AWS, SaaS, and custom apps', definition: 'Amazon EventBridge is a serverless event bus service that connects application data from AWS services, SaaS applications, and custom apps. It routes events based on rules to targets like Lambda, SQS, SNS, and Step Functions.', category: 'integration' },
  { icon: '🆘',  term: 'Disaster Recovery Strategies', short: 'RPO/RTO patterns: backup, pilot light, warm standby, active-active', definition: 'AWS DR strategies from slowest/cheapest to fastest/most expensive: (1) Backup and Restore, (2) Pilot Light - minimal core always running, (3) Warm Standby - scaled-down full environment always running, (4) Active-Active (Multi-Site) - full production in multiple regions simultaneously.', category: 'architecture' },
  { icon: '🐳',  term: 'Amazon ECS / EKS', short: 'Container orchestration - ECS (AWS-native) vs EKS (Kubernetes)', definition: 'Amazon ECS (Elastic Container Service) is AWS-native container orchestration. Amazon EKS (Elastic Kubernetes Service) is managed Kubernetes. Both support EC2 and Fargate (serverless) launch types.', category: 'compute' },
  { icon: '🫘',  term: 'AWS Elastic Beanstalk', short: 'PaaS - deploy apps without managing infrastructure', definition: 'AWS Elastic Beanstalk is a PaaS that automatically handles deployment, capacity provisioning, load balancing, and auto-scaling. Supports deployment strategies: All-at-once, Rolling, Rolling with additional batch, Blue/Green, and Immutable.', category: 'compute' },
  { icon: '💰',  term: 'AWS Cost Explorer', short: 'Visualize and analyze AWS costs and usage', definition: 'AWS Cost Explorer provides an interface to visualize, understand, and manage AWS costs and usage over time. It includes Reserved Instance recommendations, Savings Plans recommendations, and cost forecasting.', category: 'management' },
  { icon: '🔀',  term: 'AWS Transit Gateway', short: 'Central hub for connecting VPCs and on-premises networks', definition: 'AWS Transit Gateway acts as a cloud router - connect thousands of VPCs and on-premises networks through a single gateway. It supports transitive routing (unlike VPC Peering), and works with Direct Connect and VPN.', category: 'networking' },
  { icon: '🌁',  term: 'AWS Storage Gateway', short: 'Hybrid cloud storage connecting on-premises to AWS', definition: 'AWS Storage Gateway bridges on-premises environments to AWS cloud storage. Three types: S3 File Gateway (NFS/SMB to S3), Volume Gateway (iSCSI block storage), and Tape Gateway (virtual tape library backed by S3/Glacier).', category: 'storage' },
  { icon: '👤',  term: 'Amazon Cognito', short: 'User authentication and identity management for apps', definition: 'Amazon Cognito provides authentication, authorization, and user management. Two components: User Pools (user directory with sign-up/sign-in, MFA) and Identity Pools (grant temporary AWS credentials to client apps).', category: 'security' },
  { icon: '🚀',  term: 'AWS Global Accelerator', short: 'Improve global app performance using AWS network backbone', definition: 'AWS Global Accelerator routes traffic through the AWS global network instead of the public internet, reducing latency. It provides two static Anycast IPs routing to optimal endpoints based on health and geography.', category: 'networking' },
  { icon: '❄️',  term: 'AWS Snow Family', short: 'Physical devices for large-scale data migration', definition: 'AWS Snow Family are physical edge computing and data migration devices: Snowcone (8TB), Snowball Edge Storage Optimized (80TB), Snowball Edge Compute Optimized (GPU), and Snowmobile (100PB). Use when network transfer would take weeks.', category: 'migration' },
  { icon: '🔬',  term: 'Amazon EMR', short: 'Managed big data platform using Hadoop, Spark, and more', definition: 'Amazon EMR (Elastic MapReduce) is a managed cluster platform for processing big data using Apache Hadoop, Spark, Hive, and Presto. Best for ETL, ML training, log analysis, and interactive queries at petabyte scale.', category: 'analytics' },
  { icon: '📨',  term: 'Amazon MQ', short: 'Managed message broker for standard protocols (MQTT, AMQP)', definition: 'Amazon MQ is a managed message broker supporting Apache ActiveMQ and RabbitMQ with industry-standard protocols. Use for migrating existing on-premises apps (lift-and-shift). Use SQS/SNS for new cloud-native apps.', category: 'integration' },
  { icon: '💡',  term: 'AWS Trusted Advisor', short: 'Real-time guidance for AWS best practices', definition: 'AWS Trusted Advisor inspects your AWS environment across 5 categories: Cost Optimization, Performance, Security, Fault Tolerance, and Service Limits. Free checks for all; full checks require Business or Enterprise Support.', category: 'management' },
  { icon: '🔧',  term: 'SSM Parameter Store', short: 'Secure hierarchical storage for configuration data and secrets', definition: 'AWS Systems Manager Parameter Store provides secure, hierarchical storage for configuration data and secrets. Standard (free) and Advanced (paid with rotation policies) tiers. Unlike Secrets Manager, no automatic rotation built-in.', category: 'security' },
  { icon: '🕸️',  term: 'Amazon Neptune', short: 'Fully managed graph database for highly connected data', definition: 'Amazon Neptune is a fully managed graph database supporting Property Graph (Gremlin) and RDF/SPARQL. Use cases: social networks, fraud detection, knowledge graphs, recommendation engines.', category: 'database' },
  { icon: '📉',  term: 'Amazon QuickSight', short: 'Cloud-native BI and data visualization service', definition: 'Amazon QuickSight is a fully managed business intelligence (BI) service for interactive dashboards and visualizations. Uses SPICE (in-memory engine) for fast queries. Connects to S3, Athena, RDS, Redshift, and more.', category: 'analytics' },
  { icon: '🎚️',  term: 'AWS Compute Optimizer', short: 'ML-based recommendations for right-sizing compute resources', definition: 'AWS Compute Optimizer uses machine learning to analyze CloudWatch metrics and recommend optimal AWS compute resources - EC2 instances, Auto Scaling groups, EBS volumes, Lambda, and ECS on Fargate.', category: 'management' },
  { icon: '💵',  term: 'AWS Budgets', short: 'Set custom cost and usage alerts for your AWS spend', definition: 'AWS Budgets lets you set custom budgets and receive alerts when actual or forecasted costs/usage exceed thresholds. Four types: Cost, Usage, Savings Plans, and Reservation Budgets. Budget Actions can auto-apply IAM policies when breached.', category: 'management' },

  // ─── CACHING ────────────────────────────────────────────────────────────────
  { icon: '⚡',  term: 'ElastiCache Redis', short: 'Feature-rich in-memory cache - persistence, pub/sub, sorted sets, Multi-AZ', definition: 'ElastiCache for Redis is the go-to for feature-rich caching: it supports data persistence, pub/sub messaging, sorted sets, geospatial data, Multi-AZ with automatic failover, and backup/restore. Use Redis when you need session stores, leaderboards, real-time analytics, or pub/sub.', category: 'caching' },
  { icon: '🧵',  term: 'ElastiCache Memcached', short: 'Simple multi-threaded in-memory cache - no persistence', definition: 'ElastiCache for Memcached is a simple, high-performance, multi-threaded in-memory key-value store. No persistence, no replication, no pub/sub. Use Memcached when you need maximum throughput and multi-threading for simple object caching and want to scale horizontally.', category: 'caching' },
  { icon: '🔥',  term: 'DynamoDB DAX', short: 'DynamoDB Accelerator - microsecond read latency in-memory cache', definition: 'Amazon DynamoDB Accelerator (DAX) is a fully managed, in-memory cache for DynamoDB that delivers up to 10x performance improvement — from milliseconds to microseconds. It is API-compatible with DynamoDB (no code changes), handles cache invalidation automatically, and supports write-through caching.', category: 'caching' },
  { icon: '🌍',  term: 'CloudFront Caching', short: 'CDN edge caching - serve content from 400+ global edge locations', definition: 'Amazon CloudFront caches content at 400+ edge locations worldwide, reducing origin load and latency. Key concepts: Cache TTL (controlled by Cache-Control headers), Cache Key (URL + query strings + headers + cookies), Cache Behaviors (per path-pattern settings), and Origin Shield (additional caching layer to reduce origin hits).', category: 'caching' },
  { icon: '🧮',  term: 'API Gateway Caching', short: 'Cache API responses to reduce backend calls and latency', definition: 'API Gateway can cache endpoint responses for a TTL you define (default 300s, max 3600s). Cached responses are served directly from API Gateway without invoking the backend (Lambda, EC2, etc.). Cache capacity ranges from 0.5 GB to 237 GB. Can be invalidated per client using Cache-Control: max-age=0 header.', category: 'caching' },
  { icon: '🔄',  term: 'Cache-Aside (Lazy Loading)', short: 'Load data into cache only on cache miss', definition: 'Cache-Aside (also called Lazy Loading) is the most common caching pattern: the application checks the cache first. On a cache miss, it reads from the database and writes the result to the cache. Advantages: only requested data is cached, cache failures do not crash the app. Disadvantage: first request is always slow (cold start).', category: 'caching' },
  { icon: '✍️',  term: 'Write-Through Caching', short: 'Write to cache and DB simultaneously - always fresh data', definition: 'In write-through caching, every write to the database also updates the cache. The cache is always up-to-date (no stale data). Disadvantage: write latency increases slightly, and unused data is cached (wasted memory). ElastiCache and DAX both support write-through mode.', category: 'caching' },
  { icon: '⏳',  term: 'Cache TTL (Time-to-Live)', short: 'How long cached data lives before expiry and refresh', definition: 'TTL defines how long a cached item is valid before it expires and must be refreshed from the source. Short TTL = more cache misses but fresher data. Long TTL = fewer misses but risk of stale data. In CloudFront, TTL is set via Cache-Control headers. In ElastiCache, per-key TTL can be configured. In DAX, item-level and query-level TTLs are separate.', category: 'caching' },
  { icon: '🌐',  term: 'Lambda@Edge / CloudFront Functions', short: 'Run code at CloudFront edge - zero-origin latency', definition: 'CloudFront Functions run lightweight JavaScript at 400+ edge POPs with sub-millisecond latency (for request/response manipulation). Lambda@Edge runs Node.js or Python functions at regional edge caches with access to request/response body. Both reduce origin load. Use CloudFront Functions for URL rewrites, header manipulation; Lambda@Edge for complex logic, auth, A/B testing.', category: 'caching' },
  { icon: '🛡️',  term: 'Origin Shield', short: 'Additional CloudFront caching layer to protect your origin', definition: 'CloudFront Origin Shield is an additional caching layer between edge locations and your origin. It centralizes cache hits, dramatically reducing requests that reach the origin. It improves cache hit ratio, reduces origin load, and is especially useful for origins that are expensive to compute (dynamic content, APIs). Available in select regions.', category: 'caching' },
]

const CATEGORIES = [
  { id: 'all', label: 'All' },
  { id: 'compute', label: 'Compute' },
  { id: 'storage', label: 'Storage' },
  { id: 'database', label: 'Database' },
  { id: 'caching', label: '⚡ Caching' },
  { id: 'networking', label: 'Networking' },
  { id: 'security', label: 'Security' },
  { id: 'integration', label: 'Integration' },
  { id: 'analytics', label: 'Analytics' },
  { id: 'management', label: 'Management' },
  { id: 'architecture', label: 'Architecture' },
  { id: 'migration', label: 'Migration' },
]

const CATEGORY_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  compute:      { bg: '#eff6ff', text: '#1d4ed8', border: '#bfdbfe' },
  storage:      { bg: '#f0fdf4', text: '#15803d', border: '#bbf7d0' },
  database:     { bg: '#eff6ff', text: '#1d4ed8', border: '#bfdbfe' },
  networking:   { bg: '#faf5ff', text: '#7e22ce', border: '#e9d5ff' },
  security:     { bg: '#fef2f2', text: '#b91c1c', border: '#fecaca' },
  integration:  { bg: '#eef2ff', text: '#4338ca', border: '#c7d2fe' },
  analytics:    { bg: '#ecfeff', text: '#0e7490', border: '#a5f3fc' },
  management:   { bg: '#f0f9ff', text: '#0369a1', border: '#bae6fd' },
  caching:      { bg: '#fff7ed', text: '#c2410c', border: '#fed7aa' },
  architecture: { bg: '#fdf4ff', text: '#86198f', border: '#f0abfc' },
  migration:    { bg: '#fff1f2', text: '#be123c', border: '#fecdd3' },
}

export default function Glossary() {
  const { isPremium } = useAuth()
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('all')
  const [expanded, setExpanded] = useState<string | null>(null)

  if (!isPremium) {
    return (
      <Layout>
        <div style={{ minHeight: '70vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem', textAlign: 'center' }}>
          <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>🔒</div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#111827', marginBottom: '0.5rem' }}>Study Tools are for members only</h2>
          <p style={{ color: '#6b7280', maxWidth: '420px', lineHeight: 1.6, marginBottom: '1.5rem' }}>
            Upgrade to any paid plan to unlock the Glossary, Keywords, CheatSheets, Study Guide, and more.
          </p>
          <button onClick={() => navigate('/pricing')} style={{ padding: '12px 28px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 700, cursor: 'pointer', fontSize: '1rem' }}>
            See Plans →
          </button>
        </div>
      </Layout>
    )
  }

  const filtered = terms.filter(t => {
    const matchCat = category === 'all' || t.category === category
    const q = search.toLowerCase()
    const matchSearch = !q || t.term.toLowerCase().includes(q) || t.short.toLowerCase().includes(q) || t.definition.toLowerCase().includes(q)
    return matchCat && matchSearch
  })

  return (
    <Layout>
      <div style={{ background: '#f8fafc', minHeight: '100vh', padding: '40px 20px' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>

          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <div style={{ display: 'inline-block', background: '#eff6ff', color: '#2563eb', padding: '4px 14px', borderRadius: '999px', fontSize: '0.8rem', fontWeight: 700, marginBottom: '12px', letterSpacing: '0.05em' }}>
              GLOSSARY
            </div>
            <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a', margin: '0 0 8px 0' }}>
              AWS Terms & Services
            </h1>
            <p style={{ color: '#64748b', margin: '0 0 12px' }}>
              {terms.length} terms across all domains · Click any card to expand
            </p>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '999px', padding: '4px 14px', fontSize: '0.78rem', fontWeight: 700, color: '#16a34a' }}>
              ✅ Derived from AWS official documentation, exam guide objectives, and AWS whitepapers
            </div>
          </div>

          {/* Search */}
          <div style={{ position: 'relative', marginBottom: '20px' }}>
            <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', fontSize: '1rem' }}>🔍</span>
            <input
              id="glossary-search"
              name="search"
              type="text"
              placeholder="Search terms, services, definitions..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{
                width: '100%', boxSizing: 'border-box', padding: '12px 16px 12px 40px',
                fontSize: '0.95rem', border: '1px solid #e2e8f0', borderRadius: '12px',
                background: '#fff', outline: 'none', color: '#1e293b'
              }}
            />
          </div>

          {/* Category Filters */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '28px' }}>
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => setCategory(cat.id)}
                style={{
                  padding: '6px 14px', borderRadius: '999px', fontSize: '0.82rem', fontWeight: 600,
                  border: '1px solid', cursor: 'pointer', transition: 'all 0.15s',
                  background: category === cat.id ? '#2563eb' : '#fff',
                  color: category === cat.id ? '#fff' : '#475569',
                  borderColor: category === cat.id ? '#2563eb' : '#e2e8f0',
                }}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Results count */}
          <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginBottom: '16px' }}>
            Showing {filtered.length} of {terms.length} terms
          </p>

          {/* Terms list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {filtered.length === 0 && (
              <div style={{ textAlign: 'center', padding: '48px', color: '#94a3b8' }}>
                No terms match your search.
              </div>
            )}
            {filtered.map(t => {
              const colors = CATEGORY_COLORS[t.category] || { bg: '#f8fafc', text: '#475569', border: '#e2e8f0' }
              const isOpen = expanded === t.term
              return (
                <div
                  key={t.term}
                  onClick={() => setExpanded(isOpen ? null : t.term)}
                  style={{
                    background: '#fff',
                    border: `1px solid ${isOpen ? '#2563eb' : '#e5e7eb'}`,
                    borderRadius: '12px', padding: '14px 18px', cursor: 'pointer',
                    transition: 'all 0.15s',
                    boxShadow: isOpen ? '0 0 0 3px rgba(37,99,235,0.08)' : 'none'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: 0 }}>
                      {/* Icon box */}
                      <div style={{
                        width: '40px', height: '40px', flexShrink: 0,
                        background: colors.bg, border: `1px solid ${colors.border}`,
                        borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '1.25rem'
                      }}>
                        {t.icon}
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontWeight: 700, color: '#1e293b', fontSize: '0.95rem' }}>{t.term}</div>
                        <div style={{ color: '#64748b', fontSize: '0.82rem', marginTop: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: isOpen ? 'normal' : 'nowrap' }}>
                          {t.short}
                        </div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                      <span style={{
                        background: colors.bg, color: colors.text, border: `1px solid ${colors.border}`,
                        padding: '2px 10px', borderRadius: '999px', fontSize: '0.7rem', fontWeight: 700,
                        whiteSpace: 'nowrap', textTransform: 'uppercase', letterSpacing: '0.04em'
                      }}>
                        {t.category}
                      </span>
                      <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
                        {isOpen ? '▲' : '▼'}
                      </span>
                    </div>
                  </div>

                  {isOpen && (
                    <div style={{
                      marginTop: '14px', paddingTop: '14px', borderTop: '1px solid #f1f5f9',
                      color: '#334155', fontSize: '0.9rem', lineHeight: '1.7'
                    }}>
                      {t.definition}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </Layout>
  )
}
