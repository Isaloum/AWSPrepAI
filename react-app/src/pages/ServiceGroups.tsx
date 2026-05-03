import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import { useAuth } from '../contexts/AuthContext'

type SaaDomain = 'all' | 'resilient' | 'secure' | 'performance' | 'cost'
type AifDomain = 'all' | 'managed-ai' | 'generative-ai' | 'ml-platform' | 'responsible-ai'
type Domain = SaaDomain | AifDomain

interface Service {
  name: string
  icon: string
  what: string
  when: string
  examTip: string
  vs?: string
}

interface ServiceGroup {
  id: Domain
  label: string
  color: string
  bg: string
  border: string
  description: string
  weight: string
  services: Service[]
}

const SAA_GROUPS: ServiceGroup[] = [
  {
    id: 'resilient',
    label: 'Resilient Architectures',
    color: '#0369a1',
    bg: '#f0f9ff',
    border: '#bae6fd',
    description: 'High availability, fault tolerance, and disaster recovery',
    weight: '26% of SAA exam',
    services: [
      {
        name: 'EC2',
        icon: '🖥️',
        what: 'Virtual servers in the cloud — pick OS, CPU, RAM, storage',
        when: 'You need full control over the OS, custom software, or stateful workloads',
        examTip: 'Default choice for "lift and shift" migrations',
        vs: 'vs Lambda: EC2 = always-on server. Lambda = runs only when triggered',
      },
      {
        name: 'Auto Scaling Group (ASG)',
        icon: '📈',
        what: 'Automatically adds or removes EC2 instances based on demand',
        when: 'Traffic is unpredictable or you want to cut costs during low usage',
        examTip: 'Scale-out = add instances. Scale-in = remove. Always pair with ALB',
        vs: 'vs Manual scaling: ASG reacts automatically. Manual = you change it yourself',
      },
      {
        name: 'ALB (Application Load Balancer)',
        icon: '⚖️',
        what: 'Distributes HTTP/HTTPS traffic across multiple targets (EC2, containers, Lambda)',
        when: 'You need path-based routing, host-based routing, or WebSocket support',
        examTip: 'Layer 7 (HTTP). Use for web apps. Supports sticky sessions',
        vs: 'vs NLB: ALB = Layer 7 (smart routing). NLB = Layer 4 (ultra-fast, static IP)',
      },
      {
        name: 'NLB (Network Load Balancer)',
        icon: '🔀',
        what: 'Distributes TCP/UDP traffic with ultra-low latency and static IP',
        when: 'You need static IP, extreme performance, or non-HTTP protocols',
        examTip: 'Layer 4. Use for gaming, IoT, financial trading. Preserves client IP',
        vs: 'vs ALB: NLB = faster, simpler. ALB = smarter routing for web apps',
      },
      {
        name: 'Route 53',
        icon: '🌐',
        what: 'AWS DNS service — routes users to your app globally',
        when: 'You need DNS, health checks, or traffic routing across regions',
        examTip: 'Failover routing = primary/secondary. Latency routing = closest region',
        vs: 'vs CloudFront: Route 53 routes DNS. CloudFront caches content at edge',
      },
      {
        name: 'RDS',
        icon: '🗄️',
        what: 'Managed relational database (MySQL, PostgreSQL, Oracle, SQL Server)',
        when: 'You need a traditional SQL database without managing the server',
        examTip: 'Multi-AZ = high availability (sync). Read Replica = performance (async)',
        vs: 'vs Aurora: RDS = standard SQL. Aurora = AWS-optimized, faster, more expensive',
      },
      {
        name: 'Aurora',
        icon: '⚡',
        what: 'AWS-built relational DB — MySQL/PostgreSQL compatible, 5x faster',
        when: 'You need high performance, auto-scaling storage, or global replication',
        examTip: 'Aurora Serverless = auto pause/resume. Aurora Global = multi-region',
        vs: 'vs RDS: Aurora = faster, pricier, AWS-native. RDS = standard, cheaper',
      },
      {
        name: 'ElastiCache',
        icon: '🚀',
        what: 'In-memory cache — Redis or Memcached',
        when: 'You need sub-millisecond response, session storage, or reduce DB load',
        examTip: 'Redis = persistence + pub/sub. Memcached = simple, multi-threaded cache',
        vs: 'vs DynamoDB: ElastiCache = cache (temporary). DynamoDB = database (persistent)',
      },
      {
        name: 'S3',
        icon: '🪣',
        what: 'Object storage — store any file, any size, unlimited scale',
        when: 'You need to store images, videos, backups, static websites, or data lakes',
        examTip: '99.999999999% (11 9s) durability. Use versioning + MFA delete for protection',
        vs: 'vs EBS: S3 = object storage (files). EBS = block storage (attached to EC2)',
      },
      {
        name: 'S3 Transfer Acceleration',
        icon: '🚀',
        what: 'Speeds up global S3 uploads by routing through CloudFront edge locations',
        when: 'Users are uploading large files to S3 from around the world and speed matters',
        examTip: 'Combine with Multipart Upload for fastest possible upload: parallel parts + edge routing. Use when question asks about fastest upload from distant regions',
        vs: 'vs CRR: Transfer Acceleration = faster uploads TO S3. CRR = replicate objects BETWEEN S3 buckets across regions',
      },
      {
        name: 'DynamoDB Streams',
        icon: '🌊',
        what: 'Ordered stream of item-level changes in a DynamoDB table — insert, update, delete events',
        when: 'You need to react to database changes: trigger Lambda, replicate to another region, build audit logs',
        examTip: 'NOT enabled by default — you must turn it on. Retains records for 24 hours. Pairs with Lambda for event-driven processing',
        vs: 'vs Kinesis Data Streams: DynamoDB Streams = tied to DynamoDB table changes. Kinesis = general-purpose streaming for any source',
      },
    ],
  },
  {
    id: 'secure',
    label: 'Secure Architectures',
    color: '#7c3aed',
    bg: '#faf5ff',
    border: '#ddd6fe',
    description: 'Identity, access control, encryption, and threat protection',
    weight: '30% of SAA exam',
    services: [
      {
        name: 'IAM',
        icon: '🔐',
        what: 'Controls who can do what in AWS — users, groups, roles, policies',
        when: 'Always. Every AWS action goes through IAM',
        examTip: 'Least privilege principle. Roles > long-term credentials. Never use root',
        vs: 'vs Cognito: IAM = AWS resource access. Cognito = app user authentication',
      },
      {
        name: 'IAM Roles',
        icon: '🎭',
        what: 'Temporary permissions assigned to AWS services or users',
        when: 'EC2 needs S3 access, Lambda needs DynamoDB access, cross-account access',
        examTip: 'Never store credentials on EC2. Use instance role instead',
        vs: 'vs IAM Users: Roles = temporary + no password. Users = permanent + password',
      },
      {
        name: 'KMS (Key Management Service)',
        icon: '🔑',
        what: 'Create and manage encryption keys for AWS services',
        when: 'You need to encrypt S3, EBS, RDS, or any AWS service data',
        examTip: 'AWS managed keys (free). Customer managed keys ($1/mo). CMK never leaves KMS',
        vs: 'vs Secrets Manager: KMS = encrypts data. Secrets Manager = stores secrets',
      },
      {
        name: 'Secrets Manager',
        icon: '🗝️',
        what: 'Stores and auto-rotates database passwords, API keys, tokens',
        when: 'You need to store DB credentials and rotate them automatically',
        examTip: 'Auto-rotation built in for RDS. Charges per secret per month',
        vs: 'vs SSM Parameter Store: Secrets Manager = auto-rotation + higher cost. SSM = cheaper, manual rotation',
      },
      {
        name: 'Cognito',
        icon: '👤',
        what: 'User authentication for web and mobile apps (sign up, sign in, social login)',
        when: 'You need to add user login to your app without building auth yourself',
        examTip: 'User Pool = authentication (login). Identity Pool = AWS resource access (authorization)',
        vs: 'vs IAM: Cognito = app users (millions). IAM = AWS employees/services',
      },
      {
        name: 'WAF (Web Application Firewall)',
        icon: '🛡️',
        what: 'Filters malicious HTTP traffic — SQL injection, XSS, bad IPs',
        when: 'You need to protect ALB, CloudFront, or API Gateway from web attacks',
        examTip: 'Works at Layer 7. Use with CloudFront for global protection',
        vs: 'vs Shield: WAF = blocks specific attack patterns. Shield = DDoS protection',
      },
      {
        name: 'Shield',
        icon: '🏰',
        what: 'DDoS protection — Standard (free) and Advanced (paid)',
        when: 'You need protection against volumetric DDoS attacks',
        examTip: 'Shield Standard = automatic, free. Shield Advanced = $3k/mo, 24/7 DDoS response team',
        vs: 'vs WAF: Shield = DDoS flood protection. WAF = application layer attack filtering',
      },
      {
        name: 'GuardDuty',
        icon: '👁️',
        what: 'Threat detection — monitors CloudTrail, VPC Flow Logs, DNS logs with ML',
        when: 'You want automatic threat detection without configuring anything',
        examTip: 'One-click enable. No agents. Detects: crypto mining, credential abuse, unusual API calls',
        vs: 'vs Inspector: GuardDuty = runtime threats. Inspector = vulnerability scanning',
      },
      {
        name: 'ACM (Certificate Manager)',
        icon: '📜',
        what: 'Free SSL/TLS certificates for AWS services',
        when: 'You need HTTPS on ALB, CloudFront, or API Gateway',
        examTip: 'Free for AWS services. Auto-renews. Cannot export private key',
        vs: 'vs self-managed certs: ACM = free + auto-renew. Self-managed = manual work',
      },
      {
        name: 'AD Connector',
        icon: '🔗',
        what: 'Directory gateway — proxies authentication requests to your existing on-premises Active Directory',
        when: 'Your company already has on-prem AD and you want AWS services to use it without syncing',
        examTip: 'AD Connector = proxy (no data stored). Simple AD = standalone AWS directory. AWS Managed AD = full AD in cloud',
        vs: 'vs Simple AD: AD Connector requires existing on-prem AD. Simple AD is standalone — no on-prem dependency',
      },
      {
        name: 'SAML 2.0 Federation',
        icon: '🏢',
        what: 'Corporate SSO — let employees log in to AWS using company credentials via AD FS',
        when: 'Your company uses Active Directory and you want employees to access AWS Console or APIs with their corporate login',
        examTip: 'SAML 2.0 = corporate AD/LDAP SSO. Web Identity Federation = consumer social login (Google, Facebook). Never confuse the two',
        vs: 'vs Web Identity Federation: SAML = enterprise employees. Web Identity = consumer app users',
      },
      {
        name: 'S3 Object Lock',
        icon: '🔒',
        what: 'WORM (Write Once Read Many) protection — prevents objects from being deleted or overwritten',
        when: 'You need regulatory compliance, audit evidence, or ransomware protection',
        examTip: 'Compliance mode = nobody can delete (not even root). Governance mode = privileged users can bypass. Legal Hold = no time period, manual removal',
        vs: 'vs S3 Versioning: Versioning keeps old copies. Object Lock actively prevents deletion/modification',
      },
      {
        name: 'AWS Artifact',
        icon: '📋',
        what: 'Self-service portal for AWS compliance reports — SOC 1/2/3, PCI DSS, ISO certifications',
        when: 'Auditors or compliance teams need official AWS compliance documentation',
        examTip: 'Artifact = download compliance DOCUMENTS. Not a security scanner. Inspector = vulnerabilities. Security Hub = findings aggregation',
        vs: 'vs Inspector: Artifact = compliance reports to show auditors. Inspector = scans your EC2/containers for vulnerabilities',
      },
    ],
  },
  {
    id: 'performance',
    label: 'High-Performing Architectures',
    color: '#b45309',
    bg: '#fffbeb',
    border: '#fde68a',
    description: 'Compute, messaging, caching, and content delivery at scale',
    weight: '24% of SAA exam',
    services: [
      {
        name: 'Lambda',
        icon: '⚡',
        what: 'Run code without managing servers — triggered by events',
        when: 'Short tasks (<15 min), event-driven, unpredictable traffic, microservices',
        examTip: 'Max 15 min timeout. Max 10GB memory. Scales to thousands of concurrent executions',
        vs: 'vs EC2: Lambda = serverless, pay per ms. EC2 = always-on, pay per hour',
      },
      {
        name: 'ECS (Elastic Container Service)',
        icon: '📦',
        what: 'Run Docker containers on AWS — managed by AWS',
        when: 'You have containerized apps and want AWS to manage the cluster',
        examTip: 'EC2 launch type = you manage servers. Fargate = serverless containers',
        vs: 'vs EKS: ECS = AWS-native, simpler. EKS = Kubernetes, more control',
      },
      {
        name: 'EKS (Elastic Kubernetes Service)',
        icon: '☸️',
        what: 'Managed Kubernetes — run K8s without managing the control plane',
        when: 'You already use Kubernetes or need K8s-specific features',
        examTip: 'More complex than ECS. Choose EKS when question mentions Kubernetes',
        vs: 'vs ECS: EKS = Kubernetes standard. ECS = simpler, AWS-only',
      },
      {
        name: 'Fargate',
        icon: '🚀',
        what: 'Serverless compute for containers — no EC2 instances to manage',
        when: 'You want to run containers without managing servers',
        examTip: 'Works with both ECS and EKS. More expensive than EC2 but zero server management',
        vs: 'vs EC2 launch type: Fargate = serverless. EC2 = you manage the host',
      },
      {
        name: 'SQS (Simple Queue Service)',
        icon: '📬',
        what: 'Message queue — decouples producers from consumers',
        when: 'You need to buffer requests, handle spikes, or decouple microservices',
        examTip: 'Standard = at-least-once. FIFO = exactly-once, ordered. Max 14 day retention',
        vs: 'vs SNS: SQS = pull (consumer polls). SNS = push (fan-out to multiple subscribers)',
      },
      {
        name: 'SNS (Simple Notification Service)',
        icon: '📢',
        what: 'Pub/sub messaging — one message to many subscribers instantly',
        when: 'You need to fan-out to multiple services (email, SMS, Lambda, SQS)',
        examTip: 'SNS + SQS = fan-out pattern. One SNS topic → multiple SQS queues',
        vs: 'vs SQS: SNS = push to many. SQS = one consumer pulls from queue',
      },
      {
        name: 'Kinesis',
        icon: '🌊',
        what: 'Real-time data streaming — ingest, process, analyze streaming data',
        when: 'You need to process logs, IoT data, clickstreams in real time',
        examTip: 'Data Streams = custom processing. Firehose = load to S3/Redshift automatically',
        vs: 'vs SQS: Kinesis = ordered, replayable streams. SQS = simple queue, no replay',
      },
      {
        name: 'CloudFront',
        icon: '🌍',
        what: 'CDN — caches content at 400+ edge locations globally',
        when: 'You need to serve static assets, reduce latency, or protect origin',
        examTip: 'Origin can be S3, ALB, EC2, or any HTTP server. Use with WAF for security',
        vs: 'vs Route 53: CloudFront = caches content. Route 53 = just DNS routing',
      },
      {
        name: 'API Gateway',
        icon: '🚪',
        what: 'Create, publish, and manage REST, HTTP, and WebSocket APIs',
        when: 'You need a front door for Lambda functions or backend services',
        examTip: 'REST API = full features. HTTP API = cheaper, faster, less features',
        vs: 'vs ALB: API Gateway = API management + auth + throttling. ALB = simple load balancing',
      },
      {
        name: 'Storage Gateway',
        icon: '🗂️',
        what: 'Hybrid cloud storage bridge — connects on-premises apps to S3, EBS, or Glacier',
        when: 'You need on-premises apps to access cloud storage without a full migration',
        examTip: 'File Gateway = NFS/SMB files → S3 with local cache. Tape Gateway = virtual tapes → Glacier (no local cache). Volume Gateway = iSCSI block storage → EBS/S3',
        vs: 'vs DataSync: Storage Gateway = ongoing hybrid access. DataSync = one-time or scheduled bulk data transfer',
      },
      {
        name: 'CloudWatch Custom Metrics',
        icon: '📊',
        what: 'Push your own application metrics to CloudWatch — memory, disk, custom business metrics',
        when: 'You need to monitor something CloudWatch does NOT collect by default (memory, disk usage, swap)',
        examTip: 'Default EC2 metrics: CPU, network, disk I/O — NO memory or disk space. Install CloudWatch Agent to get memory + disk. Custom metrics use PutMetricData API',
        vs: 'vs CloudWatch default metrics: Default = free, no agent. Custom metrics = requires CloudWatch Agent or API call',
      },
      {
        name: 'RDS Enhanced Monitoring',
        icon: '🔬',
        what: 'Real-time OS metrics for RDS at per-process granularity — CPU by process, memory, swap, disk I/O',
        when: 'You need to diagnose which process is consuming database OS resources (not just DB-level metrics)',
        examTip: 'Enhanced Monitoring runs an agent ON the DB instance. CloudWatch monitors from the hypervisor (less granular). Choose Enhanced Monitoring when question mentions per-process CPU or OS-level metrics',
        vs: 'vs CloudWatch: CloudWatch = hypervisor view (aggregate). Enhanced Monitoring = OS agent (per-process, real-time)',
      },
      {
        name: 'Aurora Custom Endpoints',
        icon: '🎯',
        what: 'Route database connections to a specific subset of Aurora instances within a cluster',
        when: 'You have different instance classes in a cluster and want to direct analytics traffic to larger instances',
        examTip: 'Custom endpoints do NOT manage themselves — you must create and configure them explicitly. Reader endpoint balances across ALL readers. Custom endpoint = specific subset you define',
        vs: 'vs Reader Endpoint: Reader endpoint = all read replicas (round-robin). Custom endpoint = your chosen subset only',
      },
      {
        name: 'EventBridge',
        icon: '🔔',
        what: 'Serverless event bus — route events between AWS services, SaaS, and your apps',
        when: 'You need to trigger actions based on events: scheduled jobs, S3 events, API events, SaaS events',
        examTip: 'EventBridge can invoke ECS tasks DIRECTLY — no Lambda needed as intermediary. Rules filter which events trigger which targets',
        vs: 'vs SNS: EventBridge = content-based filtering + rich routing. SNS = simple pub/sub fan-out',
      },
    ],
  },
  {
    id: 'cost',
    label: 'Cost-Optimized Architectures',
    color: '#166534',
    bg: '#f0fdf4',
    border: '#bbf7d0',
    description: 'Storage tiers, EC2 pricing models, and cost management tools',
    weight: '20% of SAA exam',
    services: [
      {
        name: 'EC2 Pricing Models',
        icon: '💰',
        what: 'On-Demand, Reserved, Savings Plans, Spot, Dedicated',
        when: 'Always — choosing the right model saves 70-90%',
        examTip: 'On-Demand = flexibility. Reserved = 1-3yr commitment. Spot = cheapest, can be interrupted',
        vs: 'Spot = 90% cheaper but interruptible. Reserved = 72% cheaper, committed',
      },
      {
        name: 'S3 Storage Classes',
        icon: '🪣',
        what: 'Standard, Intelligent-Tiering, Standard-IA, Glacier, Glacier Deep Archive',
        when: 'Match access frequency to storage class to minimize cost',
        examTip: 'Standard = frequent. IA = infrequent. Glacier = archive (minutes). Deep Archive = cheapest (hours)',
        vs: 'Standard = $0.023/GB. Deep Archive = $0.00099/GB — 23x cheaper',
      },
      {
        name: 'S3 Intelligent-Tiering',
        icon: '🤖',
        what: 'Auto-moves objects between access tiers based on usage patterns',
        when: 'You have unpredictable access patterns and want automatic cost savings',
        examTip: 'Small monitoring fee per object. No retrieval fees. Best for unknown access patterns',
        vs: 'vs Standard: Intelligent-Tiering = auto-optimizes. Standard = always full price',
      },
      {
        name: 'EBS Volume Types',
        icon: '💾',
        what: 'gp3, gp2, io1/io2, st1, sc1 — different performance/cost tradeoffs',
        when: 'Match workload IOPS and throughput needs to volume type',
        examTip: 'gp3 = default, best value. io2 = databases needing high IOPS. sc1 = cheapest, cold data',
        vs: 'gp3 = 20% cheaper than gp2 with better baseline performance',
      },
      {
        name: 'Trusted Advisor',
        icon: '💡',
        what: 'Checks your AWS account for cost, performance, security, and reliability issues',
        when: 'You want automated recommendations to optimize your AWS usage',
        examTip: 'Free tier: 6 core checks. Business/Enterprise: all checks + API access',
        vs: 'vs Cost Explorer: Trusted Advisor = recommendations. Cost Explorer = spending analysis',
      },
      {
        name: 'Cost Explorer',
        icon: '📊',
        what: 'Visualize and analyze your AWS spending over time',
        when: 'You need to understand where money is going and forecast future costs',
        examTip: 'Can see Reserved Instance recommendations. Forecast up to 12 months',
        vs: 'vs Budgets: Cost Explorer = analyze past. Budgets = alert on future thresholds',
      },
      {
        name: 'AWS Budgets',
        icon: '🚨',
        what: 'Set custom cost and usage budgets with alerts',
        when: 'You want to be notified before you overspend',
        examTip: 'Alert at 80% threshold before hitting limit. Can trigger Lambda or SNS',
        vs: 'vs Cost Explorer: Budgets = proactive alerts. Cost Explorer = reactive analysis',
      },
      {
        name: 'DynamoDB',
        icon: '⚡',
        what: 'Fully managed NoSQL database — single-digit millisecond at any scale',
        when: 'You need serverless, scalable key-value or document storage',
        examTip: 'On-demand mode = pay per request (unpredictable traffic). Provisioned = cheaper for steady load',
        vs: 'vs RDS: DynamoDB = NoSQL, serverless, infinite scale. RDS = SQL, fixed size',
      },
      {
        name: 'AWS RAM (Resource Access Manager)',
        icon: '🤝',
        what: 'Share AWS resources (subnets, Transit Gateways, Route 53 Resolver rules) across accounts in your Organization',
        when: 'You want multiple accounts to share a single VPC subnet or Transit Gateway instead of duplicating infrastructure',
        examTip: 'RAM = resource sharing between accounts. Organizations = account management and consolidated billing. They are separate — RAM uses Organizations for trust, but does different things',
        vs: 'vs AWS Organizations: Organizations = manage accounts, policies, consolidated billing. RAM = share specific resources between those accounts',
      },
    ],
  },
]

const AIF_GROUPS: ServiceGroup[] = [
  {
    id: 'managed-ai',
    label: 'Managed AI Services',
    color: '#0369a1',
    bg: '#f0f9ff',
    border: '#bae6fd',
    description: 'Pre-built AI capabilities accessible via API — no ML expertise, no model training required.',
    weight: 'Domains 1 & 3 — most tested pre-built services',
    services: [
      {
        name: 'Amazon Rekognition',
        icon: '👁️',
        what: 'Computer vision service — detects objects, faces, scenes, text, and unsafe content in images and video',
        when: 'You need image/video analysis without building or training a CV model',
        examTip: 'Custom Labels extends Rekognition with your own image categories. Video analysis works on stored files or live streams.',
        vs: 'vs SageMaker: Rekognition = no training, API only. SageMaker = build fully custom CV models',
      },
      {
        name: 'Amazon Comprehend',
        icon: '📝',
        what: 'Natural Language Processing service — extracts entities, key phrases, sentiment, PII, and topics from text',
        when: 'You need to analyze text at scale: customer reviews, support tickets, social media, clinical notes',
        examTip: 'Comprehend Medical handles clinical text (HIPAA eligible). Custom Classification and Custom Entities let you define domain-specific categories.',
        vs: 'vs Bedrock LLM: Comprehend = fast, structured, cheap, purpose-built. LLM = flexible, general, more expensive per call',
      },
      {
        name: 'Amazon Textract',
        icon: '📄',
        what: 'Intelligent document processing — extracts text, forms (field:value pairs), and tables from PDFs and images',
        when: 'You need to digitize structured documents: invoices, tax forms, medical records, contracts, insurance claims',
        examTip: 'Goes beyond OCR — understands document structure. Queries API lets you ask specific questions: "What is the invoice total?" Pair with A2I for human review of low-confidence extractions.',
        vs: 'vs standard OCR: Textract preserves form structure and table relationships. OCR only reads raw characters.',
      },
      {
        name: 'Amazon Transcribe',
        icon: '🎙️',
        what: 'Automatic speech recognition — converts audio/video files or live streams to text',
        when: 'You need to transcribe meetings, calls, medical consultations, podcasts, or subtitles',
        examTip: 'Speaker diarization labels who said what. Custom Vocabulary improves accuracy for domain terms. Transcribe Call Analytics adds sentiment and issue detection for contact centers.',
        vs: 'vs Amazon Polly: Transcribe = speech→text (listen). Polly = text→speech (speak).',
      },
      {
        name: 'Amazon Polly',
        icon: '🔊',
        what: 'Text-to-speech service — converts text into natural-sounding speech using deep learning',
        when: 'You need to add voice to an app, generate audio content, or build accessibility features',
        examTip: 'Neural TTS produces the most lifelike voices. SSML tags control pronunciation, emphasis, and pauses. 60+ voices across 20+ languages.',
        vs: 'vs Amazon Transcribe: Polly = text→speech. Transcribe = speech→text. They are inverse operations.',
      },
      {
        name: 'Amazon Translate',
        icon: '🌐',
        what: 'Neural machine translation — translates text between 75+ language pairs in real-time or batch',
        when: 'You need multilingual support: translate user content, localize apps, process foreign-language documents',
        examTip: 'Custom Terminology preserves brand names, product names, and domain-specific terms across translations. Batch translation processes large S3 document sets.',
        vs: 'vs third-party APIs: Translate integrates natively with IAM, VPC, and other AWS services. Same-VPC calls stay private.',
      },
      {
        name: 'Amazon Kendra',
        icon: '🔎',
        what: 'Intelligent enterprise search — understands natural language questions and retrieves precise answers from your document corpus',
        when: 'You need employees or customers to find answers across internal documents, wikis, SharePoint, Confluence, S3',
        examTip: 'Unlike keyword search (which returns document lists), Kendra extracts and returns the specific answer passage. Kendra GenAI Edition integrates with Bedrock for RAG workflows.',
        vs: 'vs Amazon OpenSearch: Kendra = semantic Q&A understanding. OpenSearch = keyword/vector search requiring custom NLP pipeline.',
      },
      {
        name: 'Amazon Lex',
        icon: '💬',
        what: 'Conversational AI service — build chatbots and voice interfaces using the same technology as Alexa',
        when: 'You need structured conversation flows: customer service bots, appointment booking, FAQ automation',
        examTip: 'Key concepts: Intents (what the user wants), Slots (parameters to extract), Fulfillment (Lambda that executes the intent). Integrates natively with Amazon Connect for call center automation.',
        vs: 'vs Amazon Bedrock: Lex = structured intent-based dialogue with defined flows. Bedrock = open-ended LLM generation without predefined paths.',
      },
      {
        name: 'Amazon Personalize',
        icon: '🛒',
        what: 'Real-time personalization and recommendations — uses the same ML technology as amazon.com, without ML expertise',
        when: 'You need product recommendations, content ranking, similar-item suggestions, or personalized search results',
        examTip: 'Train on your historical interaction data (user-item-timestamp events). User-Personalization recipe = ranked feed per user. Similar-Items = item-to-item. Real-time event tracking updates recommendations as users browse.',
        vs: 'vs building custom collaborative filtering: Personalize handles data ingestion, model training, hosting, and real-time serving — fully managed.',
      },
      {
        name: 'Amazon Lookout for Metrics',
        icon: '📉',
        what: 'Automated anomaly detection for time-series business and operational metrics — no ML expertise required',
        when: 'You need to detect unusual patterns in KPIs: revenue drops, traffic spikes, conversion rate changes, error rate increases',
        examTip: 'Lookout for Equipment = industrial sensor anomalies. Lookout for Vision = visual defect detection on production lines. DevOps Guru = application operational anomalies.',
        vs: 'vs CloudWatch Anomaly Detection: Lookout = business metrics with root-cause analysis. CloudWatch = infrastructure metrics with threshold alarms.',
      },
    ],
  },
  {
    id: 'generative-ai',
    label: 'Generative AI Platform',
    color: '#7c3aed',
    bg: '#faf5ff',
    border: '#ddd6fe',
    description: 'Foundation models, RAG pipelines, agentic workflows, and safety controls via Amazon Bedrock.',
    weight: 'Domains 2 & 3 — highest exam weight (52% combined)',
    services: [
      {
        name: 'Amazon Bedrock',
        icon: '🪨',
        what: 'Fully managed service providing serverless API access to leading foundation models from multiple providers',
        when: 'You need to build generative AI applications without managing GPU infrastructure or FM licenses',
        examTip: 'Customer data (prompts, completions, training data) is NEVER used to train the underlying base models — critical for compliance. Supports fine-tuning (Custom Models), RAG (Knowledge Bases), agents, and safety (Guardrails).',
        vs: 'vs SageMaker JumpStart: Bedrock = serverless, API-first, multi-provider FMs. JumpStart = deploy FMs on SageMaker endpoints you manage.',
      },
      {
        name: 'Amazon Bedrock Knowledge Bases',
        icon: '📚',
        what: 'Managed RAG pipeline — connects your S3 documents to a vector store and retrieves relevant context at inference time',
        when: 'You need your FM to answer questions grounded in your own data (company docs, product manuals, policies) without retraining',
        examTip: 'Flow: S3 documents → chunk → embed (Titan Embeddings) → store in vector DB → at query time: embed query → retrieve k nearest → inject into prompt → generate grounded answer. Reduces hallucination.',
        vs: 'vs fine-tuning: Knowledge Bases = dynamic, updatable, no retraining. Fine-tuning = bakes knowledge into weights, requires retraining to update.',
      },
      {
        name: 'Amazon Bedrock Agents',
        icon: '🤖',
        what: 'Managed agentic framework — orchestrates multi-step task execution using an FM as a reasoning engine with access to tools',
        when: 'You need an AI system that autonomously plans and executes tasks: book appointments, query databases, trigger workflows',
        examTip: 'The agent iterates: Reason → Act (call tool) → Observe result → Reason again. Action Groups define what tools are available (Lambda functions, API schemas). Knowledge Bases provide retrieval context.',
        vs: 'vs Bedrock Knowledge Bases: Agents = take actions and execute tasks. Knowledge Bases = retrieve and answer. Agents can use Knowledge Bases as a tool.',
      },
      {
        name: 'Amazon Bedrock Guardrails',
        icon: '🛡️',
        what: 'Safety and compliance layer applied at inference time — filters harmful content, blocks topics, redacts PII, and checks factual grounding',
        when: 'You need to enforce responsible AI policies across all FM interactions without modifying the underlying model',
        examTip: 'Controls: harmful content filters (hate/violence/sexual/self-harm severity levels), denied topics (block specific subjects), sensitive info redaction (PII, PHI, financial data), grounding check (RAG faithfulness score).',
        vs: 'vs prompt engineering for safety: Guardrails = enforced, auditable, model-agnostic. Prompts = easily bypassed, not auditable.',
      },
      {
        name: 'Amazon Titan',
        icon: '⚡',
        what: 'AWS-native family of foundation models available exclusively through Amazon Bedrock',
        when: 'You need AWS-native FMs with deep AWS integration, data privacy guarantees, or embedded model generation',
        examTip: 'Titan Text = LLM for text generation, summarization, Q&A. Titan Embeddings = convert text to dense vectors for RAG. Titan Image Generator = create and edit images from text. Titan Multimodal Embeddings = embed both text and images.',
        vs: 'vs third-party FMs on Bedrock: Titan = AWS-native, no third-party dependency. Claude/Llama = often stronger on benchmarks but require Anthropic/Meta model access.',
      },
      {
        name: 'Amazon Q',
        icon: '💡',
        what: 'AI-powered assistant built on Bedrock FMs — two variants: Q Business (enterprise knowledge) and Q Developer (coding)',
        when: 'Employees need answers from company data (Q Business), or developers need coding assistance and AWS help (Q Developer)',
        examTip: 'Q Business: connects to 40+ enterprise data sources (SharePoint, Salesforce, Confluence), respects IAM permissions, and answers questions about company data. Q Developer: available in VS Code, JetBrains, CLI — explains, generates, and debugs code.',
        vs: 'vs Amazon Kendra: Kendra = search and retrieve documents. Q Business = conversational Q&A with summarization and actions on top of search.',
      },
    ],
  },
  {
    id: 'ml-platform',
    label: 'ML Development Platform',
    color: '#b45309',
    bg: '#fffbeb',
    border: '#fde68a',
    description: 'End-to-end managed platform for building, training, and deploying custom ML models at scale.',
    weight: 'Domain 1 — AI/ML Fundamentals (20%)',
    services: [
      {
        name: 'Amazon SageMaker Studio',
        icon: '🔬',
        what: 'Unified web-based IDE for the entire ML lifecycle — data preparation, training, debugging, and deployment',
        when: 'Your ML team needs a collaborative, browser-based environment with integrated MLOps tooling',
        examTip: 'SageMaker Studio is the umbrella product. Inside Studio: Data Wrangler (feature engineering), Experiments (tracking), Model Registry (versioning), Pipelines (MLOps automation), Clarify (bias + explainability).',
        vs: 'vs SageMaker Notebooks (legacy): Studio = full IDE with integrated tooling. Classic Notebooks = standalone Jupyter only.',
      },
      {
        name: 'SageMaker Training',
        icon: '⚙️',
        what: 'Managed training infrastructure — provision GPU/CPU clusters, run training scripts, and store model artifacts automatically',
        when: 'You need to train a custom ML model at scale, without managing EC2 instances or cluster setup',
        examTip: 'Training jobs are ephemeral — infrastructure is provisioned, training runs, artifacts saved to S3, infrastructure terminated. Spot training = up to 90% cost reduction for fault-tolerant training jobs.',
        vs: 'vs EC2 self-managed: SageMaker Training = fully managed, auto-provision, auto-terminate. EC2 = you manage AMI, storage, monitoring.',
      },
      {
        name: 'SageMaker JumpStart',
        icon: '🚀',
        what: 'Model hub — discover, deploy, and fine-tune pre-trained models (open-source FMs and task-specific models) with one click',
        when: 'You want to start from a pre-trained model rather than training from scratch, or deploy open-source FMs like Llama',
        examTip: 'Includes 300+ pre-trained models: FMs (Llama, Mistral), vision models, NLP models. Fine-tuning available for supported models. Deploys to SageMaker real-time endpoints.',
        vs: 'vs Amazon Bedrock: JumpStart = you own and manage the endpoint infrastructure. Bedrock = fully serverless, pay-per-token, no infrastructure.',
      },
      {
        name: 'SageMaker Data Wrangler',
        icon: '🏭',
        what: 'Visual, no-code feature engineering tool — transform, normalize, encode, and visualize data with 300+ built-in transforms',
        when: 'Data scientists need to prepare and transform training data without writing extensive Spark or Pandas code',
        examTip: 'Part of SageMaker Studio. Supports 50+ data sources. Generates automated data quality reports. Export transformations to SageMaker Pipelines for production reuse.',
        vs: 'vs AWS Glue: Data Wrangler = interactive, visual, ML-focused. Glue = scalable ETL for large-scale data engineering pipelines.',
      },
      {
        name: 'SageMaker Feature Store',
        icon: '🗄️',
        what: 'Centralized repository to store, share, and discover ML features across teams and models',
        when: 'Multiple teams compute the same features (e.g., customer spend in last 30 days) and you want to avoid redundant computation',
        examTip: 'Online store = low-latency feature retrieval for real-time inference. Offline store = S3-based for batch training. Features are versioned and time-stamped, enabling point-in-time correct training.',
        vs: 'vs ad-hoc S3 features: Feature Store = governed, versioned, discoverable, shareable. S3 = unstructured, no lineage, easy to use stale features.',
      },
      {
        name: 'SageMaker Automatic Model Tuning',
        icon: '🎯',
        what: 'Hyperparameter optimization — automatically searches for the best hyperparameter configuration using Bayesian optimization',
        when: 'You need to optimize learning rate, batch size, regularization, network depth, or other training hyperparameters',
        examTip: 'Bayesian optimization is smarter than grid search — it learns from previous runs to focus on promising regions of the hyperparameter space. Warm start reuses knowledge from a previous tuning job.',
        vs: 'vs manual tuning: AMT = systematic, automated, efficient. Manual = trial and error, expensive, time-consuming.',
      },
    ],
  },
  {
    id: 'responsible-ai',
    label: 'Responsible AI & Governance',
    color: '#166534',
    bg: '#f0fdf4',
    border: '#bbf7d0',
    description: 'Fairness, explainability, monitoring, human oversight, and compliance for production AI systems.',
    weight: 'Domain 4 (14%) + Domain 5 (14%) — both tested on exam',
    services: [
      {
        name: 'Amazon SageMaker Clarify',
        icon: '⚖️',
        what: 'Detects bias in training data and trained models, and provides feature-level explainability using SHAP values',
        when: 'You need to measure fairness before deployment, explain individual predictions, or satisfy regulatory transparency requirements',
        examTip: 'Pre-training bias: detects imbalanced data before any training. Post-training bias: measures output fairness across demographic groups. Explainability: SHAP values show which features drove each prediction (positive = increases prediction, negative = decreases).',
        vs: 'vs model monitoring: Clarify = point-in-time bias and explainability analysis. Model Monitor = continuous drift detection in production.',
      },
      {
        name: 'Amazon SageMaker Model Monitor',
        icon: '📉',
        what: 'Continuously monitors deployed ML endpoints for data quality, model quality, bias, and feature attribution drift',
        when: 'Your model is in production and you need alerts when real-world data diverges from training data or accuracy degrades',
        examTip: 'Four monitors: (1) Data quality — detect schema/distribution changes. (2) Model quality — compare predictions to ground truth. (3) Bias drift — track fairness metrics. (4) Feature attribution drift — track SHAP value changes. Outputs to CloudWatch.',
        vs: 'vs SageMaker Clarify: Clarify = pre-deployment analysis. Model Monitor = post-deployment continuous monitoring.',
      },
      {
        name: 'Amazon Augmented AI (A2I)',
        icon: '🌍',
        what: 'Manages human review workflows for ML predictions — routes low-confidence or high-stakes outputs to human reviewers',
        when: 'Your use case requires human oversight: medical decisions, content moderation, financial approvals, or regulatory compliance',
        examTip: 'Built-in task types for Rekognition (content moderation) and Textract (document extraction) — no custom UI needed. For other use cases, create a custom task type. Three workforce options: Amazon Mechanical Turk, private team, or third-party vendor.',
        vs: 'vs AWS Ground Truth: A2I = production human review for live predictions. Ground Truth = create labeled training datasets.',
      },
      {
        name: 'AWS Ground Truth',
        icon: '🏷️',
        what: 'Managed data labeling service — creates high-quality training datasets using human annotators with active learning assistance',
        when: 'You need to label large datasets for supervised learning: image bounding boxes, text classification, named entity recognition',
        examTip: 'Active learning: Ground Truth uses a model trained on already-labeled data to auto-label high-confidence items, sending only uncertain items to humans. Reduces labeling cost by up to 70%. Supports Mechanical Turk, private teams, and vendor workforces.',
        vs: 'vs Amazon A2I: Ground Truth = label training data offline. A2I = review live production model predictions.',
      },
      {
        name: 'SageMaker Model Registry',
        icon: '📋',
        what: 'Central catalog for versioning, approving, and tracking ML models through their lifecycle from development to production',
        when: 'You need governance over which model versions are approved for production and an audit trail of model deployments',
        examTip: 'Models progress through statuses: PendingManualApproval → Approved → Rejected. Approval gates can trigger automated deployment pipelines. Stores model lineage: which training job, dataset, and code produced the model.',
        vs: 'vs ad-hoc S3 model storage: Registry = governance, versioning, approval workflow, lineage. S3 = just file storage with no metadata.',
      },
      {
        name: 'SageMaker Model Cards',
        icon: '📝',
        what: 'Structured documentation artifact that describes a model\'s purpose, performance, training data, limitations, and ethical considerations',
        when: 'You need to document models for internal governance, regulatory review, or responsible AI accountability',
        examTip: 'Model Cards live in SageMaker Model Dashboard alongside the Model Registry. AWS AI Service Cards provide similar transparency documentation for AWS managed AI services (Rekognition, Comprehend, etc.).',
        vs: 'vs technical README: Model Cards = standardized, auditable, integrated with SageMaker governance. README = informal, unstructured.',
      },
    ],
  },
]

export default function ServiceGroups() {
  const { isPremium } = useAuth()
  const navigate = useNavigate()
  const [activeDomain, setActiveDomain] = useState<Domain>('all')
  const [expandedService, setExpandedService] = useState<string | null>(null)
  const [cert, setCert] = useState<'saa' | 'aif'>('saa')

  if (!isPremium) {
    return (
      <Layout>
        <div style={{ minHeight: '70vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem', textAlign: 'center' }}>
          <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>🔒</div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#111827', marginBottom: '0.5rem' }}>Study Tools are for members only</h2>
          <p style={{ color: '#6b7280', maxWidth: '420px', lineHeight: 1.6, marginBottom: '1.5rem' }}>
            Upgrade to any paid plan to unlock Service Groups, CheatSheets, Study Guide, Keywords, and more.
          </p>
          <button onClick={() => navigate('/pricing')} style={{ padding: '12px 28px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 700, cursor: 'pointer', fontSize: '1rem' }}>
            See Plans →
          </button>
        </div>
      </Layout>
    )
  }

  const activeGroups = cert === 'saa' ? SAA_GROUPS : AIF_GROUPS
  const visibleGroups = activeDomain === 'all'
    ? activeGroups
    : activeGroups.filter(g => g.id === activeDomain)

  return (
    <Layout>
      {/* Hero */}
      <div style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 50%, #0f172a 100%)',
        padding: '3rem 1rem',
        textAlign: 'center',
        color: '#fff',
      }}>
        <h1 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 900, margin: '0 0 0.75rem', lineHeight: 1.2 }}>
          AWS Services — Side by Side
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '1rem', maxWidth: '560px', margin: '0 auto 1.25rem' }}>
          Not what each service is — but <strong style={{ color: '#fff' }}>when to use it</strong> and <strong style={{ color: '#fff' }}>how it differs</strong> from the others.
        </p>

        {/* Cert Switcher */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '1rem' }}>
          {([
            { id: 'saa', label: '☁️ SAA-C03', sub: 'Solutions Architect' },
            { id: 'aif', label: '🤖 AIF-C01', sub: 'AI Practitioner' },
          ] as const).map(c => (
            <button
              key={c.id}
              onClick={() => { setCert(c.id); setActiveDomain('all'); setExpandedService(null) }}
              style={{
                padding: '10px 28px', borderRadius: '12px', fontWeight: 700, fontSize: '0.88rem', cursor: 'pointer', transition: 'all 0.15s',
                border: cert === c.id ? 'none' : '1px solid rgba(255,255,255,0.25)',
                background: cert === c.id ? '#fff' : 'rgba(255,255,255,0.08)',
                color: cert === c.id ? '#0f172a' : '#94a3b8',
                boxShadow: cert === c.id ? '0 4px 12px rgba(0,0,0,0.3)' : 'none',
              }}
            >{c.label}</button>
          ))}
        </div>

        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(34,197,94,0.15)', border: '1px solid rgba(34,197,94,0.3)', borderRadius: '999px', padding: '4px 14px', fontSize: '0.78rem', fontWeight: 700, color: '#4ade80', marginBottom: '1.25rem' }}>
          ✅ {cert === 'saa' ? 'Service selection patterns from 1,050 real SAA-C03 practice questions' : 'Service selection patterns from 260 real AIF-C01 practice questions · Official exam domain aligned'}
        </div>

        {/* Domain filter tabs */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          {(cert === 'saa' ? [
            { id: 'all', label: 'All Domains' },
            { id: 'resilient', label: '🏗️ Resilient (26%)' },
            { id: 'secure', label: '🔐 Secure (30%)' },
            { id: 'performance', label: '⚡ Performance (24%)' },
            { id: 'cost', label: '💰 Cost (20%)' },
          ] : [
            { id: 'all', label: 'All Groups' },
            { id: 'managed-ai', label: '🤖 Managed AI' },
            { id: 'generative-ai', label: '✨ Generative AI' },
            { id: 'ml-platform', label: '🔬 ML Platform' },
            { id: 'responsible-ai', label: '⚖️ Responsible AI' },
          ]).map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveDomain(tab.id as Domain)}
              style={{
                padding: '0.5rem 1.1rem', borderRadius: '2rem', fontSize: '0.85rem', cursor: 'pointer', transition: 'all 0.15s',
                border: activeDomain === tab.id ? 'none' : '1px solid rgba(255,255,255,0.2)',
                background: activeDomain === tab.id ? '#2563eb' : 'rgba(255,255,255,0.08)',
                color: activeDomain === tab.id ? '#fff' : '#94a3b8',
                fontWeight: activeDomain === tab.id ? 700 : 500,
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Groups */}
      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '2.5rem 1rem' }}>
        {visibleGroups.map(group => (
          <div key={group.id} style={{ marginBottom: '3rem' }}>
            {/* Group header */}
            <div style={{
              background: group.bg,
              border: `1px solid ${group.border}`,
              borderRadius: '1rem',
              padding: '1.25rem 1.5rem',
              marginBottom: '1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '0.5rem',
            }}>
              <div>
                <h2 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: group.color }}>{group.label}</h2>
                <p style={{ margin: '0.25rem 0 0', fontSize: '0.85rem', color: '#64748b' }}>{group.description}</p>
              </div>
              <span style={{
                background: group.color,
                color: '#fff',
                fontSize: '0.75rem',
                fontWeight: 700,
                padding: '0.3rem 0.75rem',
                borderRadius: '2rem',
              }}>{group.weight}</span>
            </div>

            {/* Service cards */}
            <div style={{ display: 'grid', gap: '0.75rem' }}>
              {group.services.map(service => {
                const key = `${group.id}-${service.name}`
                const isOpen = expandedService === key
                return (
                  <div
                    key={key}
                    style={{
                      background: '#fff',
                      border: `1px solid ${isOpen ? group.border : '#e2e8f0'}`,
                      borderRadius: '0.875rem',
                      overflow: 'hidden',
                      boxShadow: isOpen ? `0 4px 20px rgba(0,0,0,0.06)` : 'none',
                      transition: 'all 0.2s',
                    }}
                  >
                    {/* Card header — always visible */}
                    <button
                      onClick={() => setExpandedService(isOpen ? null : key)}
                      style={{
                        width: '100%',
                        padding: '1rem 1.25rem',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '1rem',
                        textAlign: 'left',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <span style={{ fontSize: '1.5rem' }}>{service.icon}</span>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#111827' }}>{service.name}</div>
                          <div style={{ fontSize: '0.8rem', color: '#6b7280', marginTop: '0.1rem' }}>{service.what}</div>
                        </div>
                      </div>
                      <span style={{ color: '#9ca3af', fontSize: '1.2rem', flexShrink: 0 }}>{isOpen ? '▲' : '▼'}</span>
                    </button>

                    {/* Expanded content */}
                    {isOpen && (
                      <div style={{ padding: '0 1.25rem 1.25rem', borderTop: `1px solid ${group.border}` }}>
                        <div style={{ display: 'grid', gap: '0.75rem', marginTop: '1rem' }}>
                          <div style={{ background: '#f8fafc', borderRadius: '0.6rem', padding: '0.75rem 1rem' }}>
                            <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.3rem' }}>When to use</div>
                            <div style={{ fontSize: '0.875rem', color: '#1e293b' }}>{service.when}</div>
                          </div>
                          <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '0.6rem', padding: '0.75rem 1rem' }}>
                            <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#92400e', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.3rem' }}>💡 Exam tip</div>
                            <div style={{ fontSize: '0.875rem', color: '#78350f' }}>{service.examTip}</div>
                          </div>
                          {service.vs && (
                            <div style={{ background: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: '0.6rem', padding: '0.75rem 1rem' }}>
                              <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#0369a1', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.3rem' }}>⚖️ Key comparison</div>
                              <div style={{ fontSize: '0.875rem', color: '#0c4a6e' }}>{service.vs}</div>
                            </div>
                          )}
                        </div>
                        <Link
                          to={`/certifications`}
                          style={{
                            display: 'inline-block',
                            marginTop: '1rem',
                            padding: '0.5rem 1.1rem',
                            background: group.color,
                            color: '#fff',
                            borderRadius: '0.6rem',
                            fontSize: '0.8rem',
                            fontWeight: 700,
                            textDecoration: 'none',
                          }}
                        >
                          Practice {service.name} questions →
                        </Link>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        ))}

        {/* Bottom CTA */}
        <div style={{
          background: 'linear-gradient(135deg, #0f172a, #1e3a5f)',
          borderRadius: '1.25rem',
          padding: '2rem',
          textAlign: 'center',
          color: '#fff',
          marginTop: '1rem',
        }}>
          <div style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.5rem' }}>Ready to test your knowledge?</div>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.25rem' }}>Practice real SAA-C03 scenario questions across all service domains</p>
          <Link
            to="/certifications"
            style={{
              display: 'inline-block',
              padding: '0.75rem 2rem',
              background: '#2563eb',
              color: '#fff',
              borderRadius: '0.75rem',
              fontWeight: 700,
              fontSize: '0.95rem',
              textDecoration: 'none',
            }}
          >
            Start Practicing →
          </Link>
        </div>
      </div>
    </Layout>
  )
}
