// Glossary Terms Data - AWS SAA-C03 Focused
const glossaryTerms = [
  {
    term: "Amazon EC2",
    short: "Elastic Compute Cloud - Virtual servers in the AWS cloud",
    definition: "Amazon Elastic Compute Cloud (EC2) is a web service that provides secure, resizable compute capacity in the cloud. It is designed to make web-scale cloud computing easier for developers.",
    category: "compute",
    examRelevant: true,
    examples: [
      "Launch a web server to host your application",
      "Run batch processing jobs on demand",
      "Deploy a development and test environment"
    ]
  },
  {
    term: "Amazon S3",
    short: "Simple Storage Service - Object storage with 11 9's durability",
    definition: "Amazon Simple Storage Service (S3) is an object storage service offering industry-leading scalability, data availability, security, and performance. It provides 99.999999999% (11 9's) durability.",
    category: "storage",
    examRelevant: true,
    examples: [
      "Store and retrieve any amount of data at any time",
      "Host static websites",
      "Data backup and disaster recovery",
      "Archive data with Glacier storage classes"
    ]
  },
  {
    term: "Amazon VPC",
    short: "Virtual Private Cloud - Isolated network section in AWS",
    definition: "Amazon Virtual Private Cloud (VPC) lets you provision a logically isolated section of the AWS Cloud where you can launch AWS resources in a virtual network that you define.",
    category: "networking",
    examRelevant: true,
    examples: [
      "Create public and private subnets for multi-tier applications",
      "Use VPN or Direct Connect for hybrid cloud connectivity",
      "Control inbound and outbound traffic with security groups and NACLs"
    ]
  },
  {
    term: "IAM",
    short: "Identity and Access Management - Manage access to AWS services",
    definition: "AWS Identity and Access Management (IAM) enables you to manage access to AWS services and resources securely. Using IAM, you can create and manage AWS users and groups, and use permissions to allow and deny their access to AWS resources.",
    category: "security",
    examRelevant: true,
    examples: [
      "Create users and groups with specific permissions",
      "Use roles for EC2 instances to access S3",
      "Enable MFA for enhanced security",
      "Implement least privilege access policies"
    ]
  },
  {
    term: "Amazon RDS",
    short: "Relational Database Service - Managed relational databases",
    definition: "Amazon Relational Database Service (RDS) makes it easy to set up, operate, and scale a relational database in the cloud. It provides cost-efficient and resizable capacity while automating time-consuming administration tasks.",
    category: "database",
    examRelevant: true,
    examples: [
      "Run MySQL, PostgreSQL, Oracle, SQL Server, or MariaDB databases",
      "Enable Multi-AZ deployment for high availability",
      "Use read replicas for read-heavy workloads",
      "Automated backups and point-in-time recovery"
    ]
  },
  {
    term: "AWS Lambda",
    short: "Serverless compute - Run code without managing servers",
    definition: "AWS Lambda is a serverless compute service that lets you run code without provisioning or managing servers. You pay only for the compute time you consume.",
    category: "compute",
    examRelevant: true,
    examples: [
      "Process S3 uploads automatically",
      "Build RESTful APIs with API Gateway",
      "Run scheduled tasks with CloudWatch Events",
      "Process streaming data from Kinesis"
    ]
  },
  {
    term: "Auto Scaling",
    short: "Automatically adjust EC2 capacity based on demand",
    definition: "Auto Scaling helps you ensure that you have the correct number of Amazon EC2 instances available to handle the load for your application. It automatically increases or decreases capacity based on conditions you define.",
    category: "compute",
    examRelevant: true,
    examples: [
      "Scale out during peak hours and scale in during off-peak",
      "Maintain application availability during instance failures",
      "Use target tracking to maintain CPU utilization at 50%"
    ]
  },
  {
    term: "Amazon CloudFront",
    short: "Content Delivery Network (CDN) - Global edge locations",
    definition: "Amazon CloudFront is a fast content delivery network (CDN) service that securely delivers data, videos, applications, and APIs to customers globally with low latency and high transfer speeds.",
    category: "networking",
    examRelevant: true,
    examples: [
      "Distribute static and dynamic web content globally",
      "Stream video content with low latency",
      "Protect against DDoS attacks with AWS Shield",
      "Use Lambda@Edge for edge computing"
    ]
  },
  {
    term: "Amazon DynamoDB",
    short: "NoSQL database - Fully managed, single-digit millisecond latency",
    definition: "Amazon DynamoDB is a key-value and document database that delivers single-digit millisecond performance at any scale. It's a fully managed, multi-region, multi-active, durable database with built-in security, backup and restore, and in-memory caching.",
    category: "database",
    examRelevant: true,
    examples: [
      "Build mobile and web applications requiring low latency",
      "Use DynamoDB Streams for real-time processing",
      "Implement global tables for multi-region replication",
      "Use DAX for microsecond latency caching"
    ]
  },
  {
    term: "Elastic Load Balancer (ELB)",
    short: "Distribute traffic across multiple targets",
    definition: "Elastic Load Balancing automatically distributes incoming application traffic across multiple targets, such as Amazon EC2 instances, containers, and IP addresses, in one or more Availability Zones.",
    category: "networking",
    examRelevant: true,
    examples: [
      "Application Load Balancer (ALB) for HTTP/HTTPS traffic",
      "Network Load Balancer (NLB) for TCP/UDP traffic",
      "Gateway Load Balancer for third-party appliances",
      "Enable cross-zone load balancing for even distribution"
    ]
  },
  {
    term: "Amazon Aurora",
    short: "MySQL and PostgreSQL-compatible relational database",
    definition: "Amazon Aurora is a MySQL and PostgreSQL-compatible relational database built for the cloud, combining the performance and availability of traditional enterprise databases with the simplicity and cost-effectiveness of open source databases.",
    category: "database",
    examRelevant: true,
    examples: [
      "5x faster than standard MySQL, 3x faster than PostgreSQL",
      "Automatic storage scaling up to 128 TB",
      "Up to 15 read replicas with minimal lag",
      "Aurora Serverless for intermittent workloads"
    ]
  },
  {
    term: "Amazon Route 53",
    short: "Scalable DNS and domain registration service",
    definition: "Amazon Route 53 is a highly available and scalable cloud Domain Name System (DNS) web service. It is designed to give developers and businesses a reliable way to route end users to Internet applications.",
    category: "networking",
    examRelevant: true,
    examples: [
      "Register and manage domain names",
      "Route traffic using latency-based routing",
      "Configure health checks and DNS failover",
      "Use geolocation routing for region-specific content"
    ]
  },
  {
    term: "Amazon EBS",
    short: "Elastic Block Store - Block storage for EC2",
    definition: "Amazon Elastic Block Store (EBS) provides block level storage volumes for use with EC2 instances. EBS volumes are highly available and reliable storage volumes that can be attached to any running instance in the same Availability Zone.",
    category: "storage",
    examRelevant: true,
    examples: [
      "General Purpose SSD (gp2/gp3) for balanced performance",
      "Provisioned IOPS SSD (io1/io2) for mission-critical workloads",
      "Take snapshots for backup and disaster recovery",
      "Encrypt volumes at rest using KMS"
    ]
  },
  {
    term: "AWS KMS",
    short: "Key Management Service - Encryption key management",
    definition: "AWS Key Management Service (KMS) makes it easy to create and manage cryptographic keys and control their use across a wide range of AWS services and in your applications.",
    category: "security",
    examRelevant: true,
    examples: [
      "Encrypt EBS volumes and S3 objects",
      "Manage customer master keys (CMKs)",
      "Enable automatic key rotation",
      "Audit key usage with CloudTrail"
    ]
  },
  {
    term: "Amazon SQS",
    short: "Simple Queue Service - Fully managed message queuing",
    definition: "Amazon Simple Queue Service (SQS) is a fully managed message queuing service that enables you to decouple and scale microservices, distributed systems, and serverless applications.",
    category: "integration",
    examRelevant: true,
    examples: [
      "Standard queues for maximum throughput",
      "FIFO queues for exactly-once processing",
      "Decouple application components",
      "Buffer requests between tiers"
    ]
  },
  {
    term: "Amazon SNS",
    short: "Simple Notification Service - Pub/sub messaging",
    definition: "Amazon Simple Notification Service (SNS) is a fully managed messaging service for both application-to-application (A2A) and application-to-person (A2P) communication.",
    category: "integration",
    examRelevant: true,
    examples: [
      "Fan out messages to multiple SQS queues",
      "Send SMS and email notifications",
      "Push notifications to mobile devices",
      "Trigger Lambda functions"
    ]
  },
  {
    term: "AWS CloudTrail",
    short: "Track user activity and API usage",
    definition: "AWS CloudTrail is a service that enables governance, compliance, operational auditing, and risk auditing of your AWS account. It logs, continuously monitors, and retains account activity related to actions across your AWS infrastructure.",
    category: "security",
    examRelevant: true,
    examples: [
      "Track who made API calls and when",
      "Monitor resource changes for compliance",
      "Integrate with CloudWatch Logs for analysis",
      "Enable for all regions for comprehensive coverage"
    ]
  },
  {
    term: "Amazon CloudWatch",
    short: "Monitoring and observability service",
    definition: "Amazon CloudWatch is a monitoring and observability service that provides data and actionable insights to monitor applications, respond to system-wide performance changes, and optimize resource utilization.",
    category: "management",
    examRelevant: true,
    examples: [
      "Monitor EC2 CPU, disk, and network metrics",
      "Create alarms to trigger Auto Scaling",
      "Collect and track custom metrics",
      "Set up dashboards for visualization"
    ]
  },
  {
    term: "AWS Direct Connect",
    short: "Dedicated network connection to AWS",
    definition: "AWS Direct Connect is a cloud service solution that makes it easy to establish a dedicated network connection from your premises to AWS. Using Direct Connect, you can reduce network costs, increase bandwidth throughput, and provide a more consistent network experience.",
    category: "networking",
    examRelevant: true,
    examples: [
      "Create private connectivity between AWS and your datacenter",
      "Reduce bandwidth costs for large data transfers",
      "Provide consistent network performance",
      "Access public services (S3, DynamoDB) privately"
    ]
  },
  {
    term: "Amazon ElastiCache",
    short: "In-memory caching service - Redis and Memcached",
    definition: "Amazon ElastiCache is a web service that makes it easy to deploy, operate, and scale an in-memory cache in the cloud. It supports two open-source in-memory caching engines: Redis and Memcached.",
    category: "database",
    examRelevant: true,
    examples: [
      "Cache database query results",
      "Store session data for web applications",
      "Use Redis for complex data structures",
      "Use Memcached for simple key-value caching"
    ]
  },
  {
    term: "Security Group",
    short: "Virtual firewall for EC2 instances (stateful)",
    definition: "A security group acts as a virtual firewall for your instance to control inbound and outbound traffic. Security groups are stateful - return traffic is automatically allowed, regardless of outbound rules.",
    category: "security",
    examRelevant: true,
    examples: [
      "Allow HTTP (port 80) and HTTPS (port 443) inbound",
      "Allow SSH (port 22) from specific IP addresses",
      "Reference other security groups for internal communication",
      "All outbound traffic is allowed by default"
    ]
  },
  {
    term: "Network ACL (NACL)",
    short: "Subnet-level firewall (stateless)",
    definition: "A network access control list (NACL) is an optional layer of security for your VPC that acts as a firewall for controlling traffic in and out of one or more subnets. NACLs are stateless - return traffic must be explicitly allowed.",
    category: "security",
    examRelevant: true,
    examples: [
      "Control traffic at the subnet level",
      "Support allow and deny rules",
      "Rules are evaluated in number order",
      "Must configure both inbound and outbound for bidirectional traffic"
    ]
  },
  {
    term: "Amazon EFS",
    short: "Elastic File System - Scalable NFS file storage",
    definition: "Amazon Elastic File System (EFS) provides a simple, serverless, set-and-forget elastic file system that lets you share file data without provisioning or managing storage. It can be used with AWS Cloud services and on-premises resources.",
    category: "storage",
    examRelevant: true,
    examples: [
      "Share files across multiple EC2 instances",
      "Automatically scales to petabytes",
      "Use EFS Standard for frequently accessed files",
      "Use EFS Infrequent Access for cost optimization"
    ]
  },
  {
    term: "AWS WAF",
    short: "Web Application Firewall - Protect web apps",
    definition: "AWS WAF is a web application firewall that helps protect your web applications or APIs against common web exploits and bots that may affect availability, compromise security, or consume excessive resources.",
    category: "security",
    examRelevant: true,
    examples: [
      "Block SQL injection and cross-site scripting (XSS)",
      "Create rate-based rules to prevent DDoS",
      "Filter traffic based on IP addresses or geographic location",
      "Integrate with CloudFront, ALB, and API Gateway"
    ]
  },
  {
    term: "Amazon Kinesis",
    short: "Real-time data streaming and analytics",
    definition: "Amazon Kinesis makes it easy to collect, process, and analyze real-time, streaming data so you can get timely insights and react quickly to new information.",
    category: "analytics",
    examRelevant: true,
    examples: [
      "Kinesis Data Streams for custom processing",
      "Kinesis Data Firehose for loading data into AWS",
      "Kinesis Data Analytics for SQL queries on streams",
      "Process clickstream data in real-time"
    ]
  },
  {
    term: "AWS CloudFormation",
    short: "Infrastructure as Code - Automate resource provisioning",
    definition: "AWS CloudFormation provides a common language for you to describe and provision all the infrastructure resources in your cloud environment. It allows you to use a simple text file to model and provision all the resources needed for your applications.",
    category: "management",
    examRelevant: true,
    examples: [
      "Define infrastructure using JSON or YAML templates",
      "Create stacks to manage related resources together",
      "Update stacks to modify infrastructure safely",
      "Use StackSets for multi-region deployments"
    ]
  },
  {
    term: "Amazon Redshift",
    short: "Data warehouse for analytics - Petabyte-scale",
    definition: "Amazon Redshift is a fast, scalable data warehouse that makes it simple and cost-effective to analyze all your data across your data warehouse and data lake. It delivers faster performance than other data warehouses.",
    category: "database",
    examRelevant: true,
    examples: [
      "Run complex analytic queries using SQL",
      "Integrate with BI tools like Tableau and QuickSight",
      "Use columnar storage for fast queries",
      "Scale compute and storage independently with RA3 nodes"
    ]
  },
  {
    term: "AWS Shield",
    short: "DDoS protection service",
    definition: "AWS Shield is a managed Distributed Denial of Service (DDoS) protection service that safeguards applications running on AWS. AWS Shield Standard is included at no extra cost, while Shield Advanced provides enhanced protections.",
    category: "security",
    examRelevant: true,
    examples: [
      "Shield Standard protects against common DDoS attacks",
      "Shield Advanced includes 24/7 DDoS Response Team",
      "Get cost protection for scaling during attacks",
      "Real-time attack notifications and visibility"
    ]
  },
  {
    term: "Amazon API Gateway",
    short: "Create, publish, and manage APIs",
    definition: "Amazon API Gateway is a fully managed service that makes it easy for developers to create, publish, maintain, monitor, and secure APIs at any scale. It handles all the tasks involved in accepting and processing API calls.",
    category: "networking",
    examRelevant: true,
    examples: [
      "Create RESTful APIs backed by Lambda functions",
      "Build WebSocket APIs for real-time applications",
      "Implement API throttling and quotas",
      "Enable caching to improve performance"
    ]
  },
  {
    term: "Multi-AZ Deployment",
    short: "High availability across multiple Availability Zones",
    definition: "Multi-AZ (Availability Zone) deployment provides enhanced availability and durability for AWS resources. For RDS, it automatically replicates data to a standby instance in a different AZ, with automatic failover in case of failure.",
    category: "architecture",
    examRelevant: true,
    examples: [
      "RDS Multi-AZ for automatic database failover",
      "Deploy EC2 instances across multiple AZs",
      "Use ELB to distribute traffic across AZs",
      "Typically provides 1-2 minute RTO for failover"
    ]
  },
  {
    term: "Read Replica",
    short: "Read-only copy of database for scaling reads",
    definition: "Read replicas allow you to create read-only copies of your database. They are used primarily for read-heavy workloads to offload traffic from the primary database. Replication is asynchronous.",
    category: "database",
    examRelevant: true,
    examples: [
      "Create up to 15 Aurora read replicas",
      "Promote read replica to standalone database",
      "Place replicas in different regions for disaster recovery",
      "Reduce latency by placing replicas closer to users"
    ]
  },
  {
    term: "NAT Gateway",
    short: "Enable internet access for private subnet resources",
    definition: "A NAT (Network Address Translation) gateway allows instances in a private subnet to connect to the internet or other AWS services, but prevents the internet from initiating connections with those instances.",
    category: "networking",
    examRelevant: true,
    examples: [
      "Place NAT Gateway in public subnet",
      "Update private subnet route table to use NAT Gateway",
      "Deploy one NAT Gateway per AZ for high availability",
      "Charges based on hourly usage and data processed"
    ]
  },
  {
    term: "Amazon GuardDuty",
    short: "Intelligent threat detection service",
    definition: "Amazon GuardDuty is a threat detection service that continuously monitors for malicious activity and unauthorized behavior to protect your AWS accounts, workloads, and data stored in Amazon S3.",
    category: "security",
    examRelevant: true,
    examples: [
      "Detect cryptocurrency mining activity",
      "Identify compromised EC2 instances",
      "Monitor for unusual API calls",
      "Uses machine learning to identify threats"
    ]
  },
  {
    term: "AWS Systems Manager",
    short: "Operational hub for AWS resources",
    definition: "AWS Systems Manager gives you visibility and control of your infrastructure on AWS. It provides a unified user interface to view operational data and automate operational tasks across your AWS resources.",
    category: "management",
    examRelevant: true,
    examples: [
      "Patch EC2 instances at scale",
      "Store configuration data and secrets in Parameter Store",
      "Run commands across multiple instances",
      "Session Manager for secure instance access without SSH"
    ]
  },
  {
    term: "Amazon Athena",
    short: "Serverless SQL queries on S3 data",
    definition: "Amazon Athena is an interactive query service that makes it easy to analyze data in Amazon S3 using standard SQL. It is serverless, so there is no infrastructure to manage, and you pay only for the queries that you run.",
    category: "analytics",
    examRelevant: true,
    examples: [
      "Query log files stored in S3",
      "Analyze data without loading into database",
      "Use with AWS Glue for data cataloging",
      "Charged based on data scanned per query"
    ]
  },
  {
    term: "AWS Glue",
    short: "Serverless ETL service - Extract, Transform, Load",
    definition: "AWS Glue is a fully managed extract, transform, and load (ETL) service that makes it easy to prepare and load data for analytics. It can automatically discover and catalog your data.",
    category: "analytics",
    examRelevant: true,
    examples: [
      "Crawl data sources to populate Data Catalog",
      "Run ETL jobs to transform data",
      "Schedule jobs or trigger based on events",
      "Write transformations in Python or Scala"
    ]
  }
];

// Flashcards Data
const flashcards = [
  // Compute Domain
  {
    domain: "compute",
    front: "What are the four EC2 pricing models?",
    back: "1. On-Demand (pay by hour/second)\n2. Reserved Instances (1 or 3 year commitment, up to 72% savings)\n3. Spot Instances (up to 90% savings, interruptible)\n4. Dedicated Hosts (physical server for your use)",
    hint: "Think: flexibility vs. commitment vs. cost savings"
  },
  {
    domain: "compute",
    front: "When should you use Lambda instead of EC2?",
    back: "Use Lambda when:\n• Workloads are event-driven and short-running (<15 min)\n• You want serverless architecture\n• Costs should scale with usage\n• You don't need persistent state\n\nUse EC2 when:\n• Long-running processes\n• Custom runtime environments\n• Need full OS control",
    hint: "Consider duration, management overhead, and scaling needs"
  },
  {
    domain: "compute",
    front: "What is Auto Scaling's minimum, maximum, and desired capacity?",
    back: "• Minimum: Lowest number of instances to maintain\n• Maximum: Highest number of instances allowed\n• Desired: Target number of instances\n\nExample: Min=2, Desired=4, Max=10\nNormal operation: 4 instances\nHigh load: scales up to 10\nLow load: scales down to 2",
    hint: "Think of boundaries and targets"
  },
  {
    domain: "compute",
    front: "What is the difference between vertical and horizontal scaling?",
    back: "Vertical Scaling (Scale Up/Down):\n• Change instance size/type\n• Requires downtime\n• Limited by instance size\n\nHorizontal Scaling (Scale Out/In):\n• Add/remove instances\n• No downtime with proper architecture\n• Nearly unlimited scaling\n• Preferred for AWS",
    hint: "Up/Down vs. Out/In"
  },

  // Storage Domain
  {
    domain: "storage",
    front: "What are the main S3 storage classes and their use cases?",
    back: "• Standard: Frequently accessed data\n• Intelligent-Tiering: Unknown/changing access\n• Standard-IA: Infrequent access, rapid retrieval\n• One Zone-IA: Infrequent, non-critical data\n• Glacier Instant: Archive with instant retrieval\n• Glacier Flexible: Archive, min-hrs retrieval\n• Glacier Deep Archive: Long-term, 12hr retrieval",
    hint: "Consider access frequency and retrieval time"
  },
  {
    domain: "storage",
    front: "What is the difference between EBS and Instance Store?",
    back: "EBS (Elastic Block Store):\n• Persistent network storage\n• Survives instance stop/termination\n• Can detach and reattach\n• Snapshots for backup\n\nInstance Store:\n• Ephemeral local storage\n• Data lost on stop/termination\n• Very high IOPS\n• Included in instance cost",
    hint: "Persistent vs. Ephemeral"
  },
  {
    domain: "storage",
    front: "What are the four EBS volume types?",
    back: "SSD:\n• gp2/gp3: General Purpose (balanced)\n• io1/io2: Provisioned IOPS (high performance)\n\nHDD:\n• st1: Throughput Optimized (big data, logs)\n• sc1: Cold HDD (infrequent access)\n\nRule: Boot volumes must be SSD",
    hint: "Think: SSD for IOPS, HDD for throughput"
  },
  {
    domain: "storage",
    front: "How does S3 Transfer Acceleration work?",
    back: "S3 Transfer Acceleration uses CloudFront edge locations to accelerate uploads to S3.\n\nHow it works:\n1. Upload to nearest edge location\n2. Data travels over AWS backbone\n3. Faster than internet upload\n\nBest for: Large files, distant regions, slow connections",
    hint: "Think: CloudFront edge locations + AWS backbone"
  },

  // Database Domain
  {
    domain: "database",
    front: "Multi-AZ vs. Read Replica: What's the difference?",
    back: "Multi-AZ:\n• High availability/disaster recovery\n• Synchronous replication\n• Automatic failover (1-2 min)\n• Same region\n• No read traffic\n\nRead Replica:\n• Read scaling\n• Asynchronous replication\n• Manual promotion\n• Can be cross-region\n• Serves read traffic",
    hint: "HA/DR vs. Read Scaling"
  },
  {
    domain: "database",
    front: "When should you use DynamoDB vs. RDS?",
    back: "Use DynamoDB when:\n• Need single-digit ms latency\n• Serverless, auto-scaling\n• Key-value or document data\n• Massive scale required\n\nUse RDS when:\n• Complex queries and joins needed\n• Existing SQL applications\n• ACID compliance required\n• Structured relational data",
    hint: "NoSQL speed vs. SQL complexity"
  },
  {
    domain: "database",
    front: "What makes Aurora different from RDS?",
    back: "Aurora advantages:\n• 5x faster than MySQL, 3x faster than PostgreSQL\n• Storage auto-scales (10GB → 128TB)\n• Up to 15 read replicas (vs 5 for RDS)\n• Continuous backup to S3\n• Aurora Serverless for variable workloads\n• Global Database for cross-region\n\nTrade-off: Slightly more expensive",
    hint: "Think: Performance, scale, and cloud-native features"
  },
  {
    domain: "database",
    front: "What is DynamoDB DAX and when to use it?",
    back: "DAX (DynamoDB Accelerator):\n• In-memory cache for DynamoDB\n• Microsecond latency (vs. single-digit ms)\n• API-compatible with DynamoDB\n• Fully managed\n\nUse when:\n• Need microsecond response times\n• Read-heavy workloads\n• Reduce DynamoDB read costs",
    hint: "DynamoDB-specific ElastiCache"
  },

  // Security Domain
  {
    domain: "security",
    front: "What is the difference between Security Groups and NACLs?",
    back: "Security Groups:\n• Instance-level firewall\n• Stateful (return traffic auto-allowed)\n• Allow rules only\n• Evaluated as a whole\n\nNACLs:\n• Subnet-level firewall\n• Stateless (must allow both directions)\n• Allow AND deny rules\n• Rules processed in order\n\nDefault: Security Groups deny all inbound, NACLs allow all",
    hint: "Stateful vs. Stateless, Instance vs. Subnet"
  },
  {
    domain: "security",
    front: "What are the three types of IAM policies?",
    back: "1. AWS Managed Policies:\n   • Created by AWS\n   • Cannot modify\n\n2. Customer Managed Policies:\n   • Created by you\n   • Reusable across users/groups/roles\n\n3. Inline Policies:\n   • Embedded in user/group/role\n   • 1:1 relationship\n   • Deleted with entity",
    hint: "AWS vs. Customer vs. Embedded"
  },
  {
    domain: "security",
    front: "What are the S3 encryption options?",
    back: "Server-Side Encryption:\n• SSE-S3: AWS managed keys (AES-256)\n• SSE-KMS: AWS KMS managed keys\n• SSE-C: Customer provided keys\n\nClient-Side Encryption:\n• Encrypt before uploading\n• You manage keys and encryption\n\nIn-Transit:\n• HTTPS/SSL for uploads and downloads",
    hint: "Server-side (S3, KMS, Customer) vs. Client-side"
  },
  {
    domain: "security",
    front: "What is AWS KMS used for?",
    back: "KMS (Key Management Service):\n• Create and manage encryption keys (CMKs)\n• Encrypt data in AWS services\n• Automatic key rotation\n• Audit key usage via CloudTrail\n\nCommon uses:\n• EBS volume encryption\n• S3 object encryption (SSE-KMS)\n• RDS database encryption\n• Secrets Manager encryption",
    hint: "Centralized key management and encryption"
  },

  // Networking Domain
  {
    domain: "networking",
    front: "What are the three types of Elastic Load Balancers?",
    back: "1. Application Load Balancer (ALB):\n   • Layer 7 (HTTP/HTTPS)\n   • Path/host-based routing\n   • WebSocket support\n\n2. Network Load Balancer (NLB):\n   • Layer 4 (TCP/UDP)\n   • Ultra-high performance\n   • Static IP support\n\n3. Gateway Load Balancer:\n   • Layer 3 (IP packets)\n   • Third-party appliances",
    hint: "Layer 7, Layer 4, Layer 3"
  },
  {
    domain: "networking",
    front: "What is the difference between Internet Gateway and NAT Gateway?",
    back: "Internet Gateway:\n• Allows internet access for public subnets\n• Two-way communication\n• Free\n• Required for public instances\n\nNAT Gateway:\n• Allows outbound internet for private subnets\n• One-way (outbound only)\n• Charged hourly + data processed\n• Prevents inbound connections",
    hint: "Public two-way vs. Private one-way"
  },
  {
    domain: "networking",
    front: "What are VPC Endpoints and their types?",
    back: "VPC Endpoints: Private connection to AWS services\n\nTwo types:\n1. Gateway Endpoints (FREE):\n   • S3 and DynamoDB only\n   • Added to route table\n\n2. Interface Endpoints (PAID):\n   • All other services\n   • Uses ENI with private IP\n   • Powered by PrivateLink",
    hint: "Gateway (S3/DynamoDB) vs. Interface (others)"
  },
  {
    domain: "networking",
    front: "What is CloudFront and when should you use it?",
    back: "CloudFront: AWS Content Delivery Network (CDN)\n\nUse cases:\n• Serve static/dynamic content globally\n• Reduce latency for users worldwide\n• DDoS protection with Shield\n• HTTPS/custom SSL certificates\n• Lambda@Edge for edge computing\n\nOrigins: S3, EC2, ALB, custom HTTP server",
    hint: "Global distribution + caching + security"
  },
  {
    domain: "networking",
    front: "What are Route 53 routing policies?",
    back: "1. Simple: Single resource\n2. Weighted: Traffic distribution by weight\n3. Latency: Lowest latency region\n4. Failover: Active-passive DR\n5. Geolocation: Based on user location\n6. Geoproximity: Based on resource location\n7. Multi-value: Multiple IPs with health checks",
    hint: "7 policies for different traffic routing needs"
  },

  // Architecture & Best Practices
  {
    domain: "compute",
    front: "What is the AWS Well-Architected Framework's 6 pillars?",
    back: "1. Operational Excellence: Run and monitor systems\n2. Security: Protect information and systems\n3. Reliability: Recover from failures\n4. Performance Efficiency: Use resources efficiently\n5. Cost Optimization: Avoid unnecessary costs\n6. Sustainability: Minimize environmental impact",
    hint: "Operations, Security, Reliability, Performance, Cost, Sustainability"
  },
  {
    domain: "networking",
    front: "What is the Shared Responsibility Model?",
    back: "AWS Responsibility (Security OF the cloud):\n• Physical infrastructure\n• Hardware, software, networking\n• Managed service operations\n\nCustomer Responsibility (Security IN the cloud):\n• Data encryption\n• IAM/access management\n• OS patches and updates\n• Application security\n• Network configuration",
    hint: "AWS = Infrastructure, You = Configuration & Data"
  },
  {
    domain: "storage",
    front: "What is S3 Lifecycle Management?",
    back: "Automate transitions and expiration:\n\nTransitions:\n• Standard → Intelligent-Tiering (any time)\n• Standard → Standard-IA (30 days min)\n• Standard-IA → Glacier (90 days min)\n• Glacier → Deep Archive\n\nExpiration:\n• Delete objects after specified days\n• Delete incomplete multipart uploads\n• Delete previous versions",
    hint: "Automate cost optimization based on age"
  },
  {
    domain: "security",
    front: "What is the principle of Least Privilege?",
    back: "Least Privilege: Grant only the minimum permissions needed to perform a task.\n\nBest practices:\n• Start with no permissions\n• Grant permissions as needed\n• Review permissions regularly\n• Use managed policies when possible\n• Avoid wildcard (*) permissions\n• Use IAM Access Analyzer to identify overly permissive policies",
    hint: "Minimum necessary permissions, nothing more"
  }
];
