// Visual Architecture Exam - Enhanced Question Data
// Each question includes architecture definitions for ALL answer options
// allowing dual validation: answer selection + architecture construction.

const VISUAL_EXAM_QUESTIONS = [
  {
    id: 1,
    cat: 'design-resilient',
    q: 'A company needs to deploy a highly available web application that can handle unexpected traffic spikes. The application must distribute traffic across multiple Availability Zones and scale automatically based on demand. Which solution best meets these requirements?',
    options: [
      'A) Single EC2 instance with an Elastic IP address',
      'B) Auto Scaling Group behind an Application Load Balancer deployed across multiple AZs',
      'C) AWS Lambda with Amazon API Gateway',
      'D) EC2 instances in a single Availability Zone behind an Amazon CloudFront distribution'
    ],
    answer: 1,
    explain: 'An Auto Scaling Group automatically adjusts the number of EC2 instances based on demand. The Application Load Balancer distributes traffic across healthy instances in multiple Availability Zones, providing both elasticity and high availability.',
    architectures: {
      0: {
        requiredServices: ['ec2', 'elasticip'],
        requiredConnections: [{ from: 'elasticip', to: 'ec2' }],
        feedback: 'A single EC2 instance with an Elastic IP is NOT highly available. It has no scaling capability and represents a single point of failure.'
      },
      1: {
        requiredServices: ['alb', 'asg', 'ec2'],
        requiredConnections: [
          { from: 'alb', to: 'asg' },
          { from: 'asg', to: 'ec2' }
        ],
        optionalServices: ['cloudwatch', 'route53'],
        feedback: 'ALB distributes traffic across multiple AZs, the ASG scales EC2 instances automatically, ensuring high availability and elasticity.'
      },
      2: {
        requiredServices: ['apigateway', 'lambda'],
        requiredConnections: [{ from: 'apigateway', to: 'lambda' }],
        feedback: 'Lambda with API Gateway is serverless and scales automatically, but the question implies an EC2-based "web application" pattern in the SAA-C03 context.'
      },
      3: {
        requiredServices: ['ec2', 'cloudfront'],
        requiredConnections: [{ from: 'cloudfront', to: 'ec2' }],
        feedback: 'CloudFront provides global caching but EC2 in a single AZ is still a single point of failure with no auto-scaling.'
      }
    }
  },
  {
    id: 2,
    cat: 'design-secure',
    q: 'A company stores sensitive customer data in Amazon S3. A compliance requirement mandates that all data must be encrypted at rest using customer-managed keys so the company can rotate or revoke keys at any time. Which solution meets this requirement?',
    options: [
      'A) Enable S3 server-side encryption with Amazon S3-managed keys (SSE-S3)',
      'B) Enable S3 server-side encryption with AWS KMS customer-managed keys (SSE-KMS)',
      'C) Enable S3 server-side encryption with customer-provided keys (SSE-C)',
      'D) Enable client-side encryption before uploading to S3'
    ],
    answer: 1,
    explain: 'SSE-KMS uses AWS KMS customer-managed keys (CMKs). The company controls key rotation and can revoke access at any time via IAM policies, meeting the compliance requirement for customer-managed encryption keys.',
    architectures: {
      0: {
        requiredServices: ['s3'],
        requiredConnections: [],
        feedback: 'SSE-S3 uses keys managed entirely by AWS. The company cannot control key rotation or revocation — does NOT meet the compliance requirement.'
      },
      1: {
        requiredServices: ['s3', 'kms'],
        requiredConnections: [{ from: 's3', to: 'kms' }],
        optionalServices: ['cloudtrail'],
        feedback: 'S3 uses KMS customer-managed keys for encryption. The company controls key policies, rotation, and can audit key usage with CloudTrail.'
      },
      2: {
        requiredServices: ['s3'],
        requiredConnections: [],
        feedback: 'SSE-C requires the customer to provide the key on every request. AWS does not store the key, so there is no centralized key management — complex to operate at scale.'
      },
      3: {
        requiredServices: ['s3', 'kms'],
        requiredConnections: [{ from: 'kms', to: 's3' }],
        feedback: 'Client-side encryption puts the full encryption burden on the application. While valid, it is more operationally complex and the question asks for a managed AWS solution.'
      }
    }
  },
  {
    id: 3,
    cat: 'design-resilient',
    q: 'A company runs a critical e-commerce application with a relational database. The application requires a recovery point objective (RPO) of 1 hour and a recovery time objective (RTO) of 15 minutes. Which solution meets these requirements at the LOWEST cost?',
    options: [
      'A) Amazon RDS Multi-AZ deployment with automated backups',
      'B) Amazon RDS read replica promoted on failure',
      'C) Amazon Aurora Global Database',
      'D) Amazon RDS with manual snapshots taken daily'
    ],
    answer: 0,
    explain: 'RDS Multi-AZ maintains a synchronous standby replica that can automatically fail over within minutes (RTO < 15 min). Automated backups can be configured up to every 5 minutes with Point-in-Time Recovery (RPO ≤ 1 hour). This is the most cost-effective solution meeting both requirements.',
    architectures: {
      0: {
        requiredServices: ['rds', 'ec2'],
        requiredConnections: [{ from: 'ec2', to: 'rds' }],
        optionalServices: ['securitygroups'],
        feedback: 'RDS Multi-AZ provides automatic failover (low RTO) and automated backups with PITR (low RPO) at the lowest cost.'
      },
      1: {
        requiredServices: ['rds', 'ec2'],
        requiredConnections: [{ from: 'ec2', to: 'rds' }],
        feedback: 'Read replicas use asynchronous replication. Promotion takes longer than Multi-AZ failover and is a manual process — does not reliably meet 15-minute RTO.'
      },
      2: {
        requiredServices: ['aurora', 'ec2'],
        requiredConnections: [{ from: 'ec2', to: 'aurora' }],
        feedback: 'Aurora Global Database is designed for cross-region disaster recovery with sub-second replication. It meets the requirements but at a significantly higher cost than needed.'
      },
      3: {
        requiredServices: ['rds', 'ec2'],
        requiredConnections: [{ from: 'ec2', to: 'rds' }],
        feedback: 'Daily snapshots give an RPO of up to 24 hours — far worse than the required 1-hour RPO. This does NOT meet the requirement.'
      }
    }
  },
  {
    id: 4,
    cat: 'design-performant',
    q: 'A company has a web application that frequently reads the same product catalog data from an Amazon RDS MySQL database. The database is experiencing high read traffic causing slow response times. The data changes only a few times per day. Which solution improves read performance with MINIMAL application changes?',
    options: [
      'A) Add Amazon ElastiCache for Redis as a caching layer in front of RDS',
      'B) Create an RDS Read Replica and update the application to send reads there',
      'C) Migrate to Amazon DynamoDB for lower latency reads',
      'D) Enable RDS Performance Insights and optimize slow queries'
    ],
    answer: 0,
    explain: 'ElastiCache for Redis caches the query results in memory, reducing database load. Since the catalog data changes rarely, the cache hit rate will be very high. This provides the greatest performance improvement with minimal application changes (just add a cache check before querying RDS).',
    architectures: {
      0: {
        requiredServices: ['elasticache', 'rds', 'ec2'],
        requiredConnections: [
          { from: 'ec2', to: 'elasticache' },
          { from: 'ec2', to: 'rds' }
        ],
        feedback: 'ElastiCache sits in front of RDS and serves cached results in microseconds. Infrequently-changing data like a product catalog is a perfect caching candidate.'
      },
      1: {
        requiredServices: ['rds', 'ec2'],
        requiredConnections: [{ from: 'ec2', to: 'rds' }],
        feedback: 'Read Replicas help distribute read load but require application changes to route read queries and still hit the database (just a different instance). Not as fast as an in-memory cache.'
      },
      2: {
        requiredServices: ['dynamodb', 'ec2'],
        requiredConnections: [{ from: 'ec2', to: 'dynamodb' }],
        feedback: 'Migrating to DynamoDB is a major architectural change — NOT minimal. Also, relational catalog data may not map cleanly to DynamoDB\'s key-value model.'
      },
      3: {
        requiredServices: ['rds', 'ec2', 'cloudwatch'],
        requiredConnections: [{ from: 'ec2', to: 'rds' }],
        feedback: 'Performance Insights helps identify slow queries but does not add caching. Query tuning alone may not be sufficient for the described read traffic levels.'
      }
    }
  },
  {
    id: 5,
    cat: 'design-cost',
    q: 'A company runs a batch processing workload every night from 10 PM to 4 AM. The workload requires significant compute capacity but can tolerate interruptions. The company wants to minimize costs. Which EC2 purchasing option should they use?',
    options: [
      'A) On-Demand Instances',
      'B) Reserved Instances (1-year, Standard)',
      'C) Spot Instances',
      'D) Dedicated Hosts'
    ],
    answer: 2,
    explain: 'Spot Instances offer up to 90% discount compared to On-Demand. Since the batch job runs nightly and can tolerate interruptions (it can be restarted), Spot Instances are the most cost-effective choice.',
    architectures: {
      0: {
        requiredServices: ['ec2'],
        requiredConnections: [],
        feedback: 'On-Demand Instances provide full flexibility but at the highest cost. No discounts for predictable workloads.'
      },
      1: {
        requiredServices: ['ec2'],
        requiredConnections: [],
        feedback: 'Reserved Instances provide discounts for consistent 24/7 usage. A 6-hour nightly batch job would waste the reservation during the other 18 hours.'
      },
      2: {
        requiredServices: ['ec2', 'sqs'],
        requiredConnections: [{ from: 'sqs', to: 'ec2' }],
        optionalServices: ['s3'],
        feedback: 'Spot Instances are ideal for fault-tolerant batch workloads with up to 90% savings. SQS can track progress so interrupted jobs resume where they left off.'
      },
      3: {
        requiredServices: ['ec2'],
        requiredConnections: [],
        feedback: 'Dedicated Hosts are the most expensive option, used for licensing compliance. Completely wrong for cost optimization.'
      }
    }
  },
  {
    id: 6,
    cat: 'design-secure',
    q: 'A company has a three-tier web application (web, app, and database tiers) running in a VPC. The security team requires that the database tier should only accept connections from the application tier and must not be directly accessible from the internet. Which architecture enforces this requirement?',
    options: [
      'A) Place all tiers in public subnets, use Security Groups to restrict database access',
      'B) Place the database in a private subnet, use a Security Group that allows inbound traffic only from the application tier Security Group',
      'C) Place the database in a public subnet, use a Network ACL to block all internet traffic to the database',
      'D) Place all tiers in private subnets, use a NAT Gateway for all internet traffic'
    ],
    answer: 1,
    explain: 'The database should be in a private subnet (no direct internet route) AND protected by a Security Group that only allows inbound traffic from the application tier\'s Security Group. Defense in depth: network isolation + access control.',
    architectures: {
      0: {
        requiredServices: ['ec2', 'rds', 'securitygroups', 'vpc'],
        requiredConnections: [
          { from: 'ec2', to: 'rds' },
          { from: 'securitygroups', to: 'rds' }
        ],
        feedback: 'Putting the database in a public subnet exposes it to the internet even with Security Groups. Best practice is to use private subnets for databases.'
      },
      1: {
        requiredServices: ['ec2', 'rds', 'securitygroups', 'vpc'],
        requiredConnections: [
          { from: 'ec2', to: 'rds' },
          { from: 'securitygroups', to: 'rds' }
        ],
        optionalServices: ['natgw'],
        feedback: 'Private subnet + Security Group referencing the app tier SG is the correct defense-in-depth approach. The database has no public route and only accepts traffic from the app layer.'
      },
      2: {
        requiredServices: ['rds', 'vpc'],
        requiredConnections: [],
        feedback: 'NACLs are stateless and harder to manage than Security Groups. Placing the database in a public subnet is still risky; private subnets are the better architectural choice.'
      },
      3: {
        requiredServices: ['ec2', 'rds', 'natgw', 'vpc'],
        requiredConnections: [
          { from: 'ec2', to: 'rds' },
          { from: 'natgw', to: 'ec2' }
        ],
        feedback: 'All private subnets with a NAT Gateway addresses outbound internet access for the application tier, but does not specifically restrict database access to only the app tier.'
      }
    }
  },
  {
    id: 7,
    cat: 'design-resilient',
    q: 'A company needs to process messages from thousands of IoT sensors. The messages must be processed in order per sensor, and the system must retain failed messages for manual review. Which AWS service architecture meets these requirements?',
    options: [
      'A) Amazon SQS Standard Queue with Lambda consumer',
      'B) Amazon SQS FIFO Queue with a Dead Letter Queue and Lambda consumer',
      'C) Amazon SNS with Lambda subscription',
      'D) Amazon Kinesis Data Streams with Lambda consumer'
    ],
    answer: 1,
    explain: 'SQS FIFO queues guarantee exactly-once processing and ordering per message group (sensor ID). A Dead Letter Queue captures messages that fail after maximum retry attempts for manual review.',
    architectures: {
      0: {
        requiredServices: ['sqs', 'lambda'],
        requiredConnections: [{ from: 'sqs', to: 'lambda' }],
        feedback: 'Standard SQS queues do NOT guarantee ordering and deliver at-least-once. For ordered processing per sensor, FIFO queues are required.'
      },
      1: {
        requiredServices: ['sqs', 'lambda'],
        requiredConnections: [{ from: 'sqs', to: 'lambda' }],
        optionalServices: ['cloudwatch'],
        feedback: 'SQS FIFO with DLQ: FIFO ensures per-sensor ordering via message group IDs, DLQ captures failed messages for manual review. Lambda processes messages from the queue.'
      },
      2: {
        requiredServices: ['sns', 'lambda'],
        requiredConnections: [{ from: 'sns', to: 'lambda' }],
        feedback: 'SNS is a pub/sub notification service — it does NOT guarantee ordering or provide a Dead Letter Queue for failed messages.'
      },
      3: {
        requiredServices: ['kinesis', 'lambda'],
        requiredConnections: [{ from: 'kinesis', to: 'lambda' }],
        feedback: 'Kinesis Data Streams guarantees ordering per shard and is excellent for streaming data, but setting up DLQ-equivalent retry handling is more complex than SQS FIFO+DLQ.'
      }
    }
  },
  {
    id: 8,
    cat: 'design-performant',
    q: 'A global media company serves video content to users worldwide. Users in distant regions report high latency when loading content. The company uses Amazon S3 to store the video files. Which solution reduces latency for global users with MINIMAL infrastructure changes?',
    options: [
      'A) Enable S3 Transfer Acceleration',
      'B) Deploy Amazon CloudFront with the S3 bucket as the origin',
      'C) Create S3 buckets in multiple AWS regions and use Route 53 geolocation routing',
      'D) Use AWS Global Accelerator to route requests to the nearest S3 endpoint'
    ],
    answer: 1,
    explain: 'CloudFront is a CDN that caches content at 400+ edge locations worldwide. Users are served from the nearest edge location instead of the S3 origin, dramatically reducing latency with minimal infrastructure changes (just create a CloudFront distribution).',
    architectures: {
      0: {
        requiredServices: ['s3'],
        requiredConnections: [],
        feedback: 'S3 Transfer Acceleration speeds up UPLOADS to S3, not downloads to end users. It does not cache content at edge locations.'
      },
      1: {
        requiredServices: ['s3', 'cloudfront', 'route53'],
        requiredConnections: [
          { from: 'route53', to: 'cloudfront' },
          { from: 'cloudfront', to: 's3' }
        ],
        feedback: 'CloudFront caches video files at 400+ global edge locations. Users stream from their nearest edge location, dramatically reducing latency with no changes to S3.'
      },
      2: {
        requiredServices: ['s3', 'route53'],
        requiredConnections: [{ from: 'route53', to: 's3' }],
        feedback: 'Multi-region S3 with geolocation routing reduces latency but requires replicating all content to multiple buckets — much more complex and expensive than CloudFront.'
      },
      3: {
        requiredServices: ['s3'],
        requiredConnections: [],
        feedback: 'Global Accelerator improves availability and performance for TCP/UDP applications but does NOT cache content. It still hits the S3 origin for every request.'
      }
    }
  },
  {
    id: 9,
    cat: 'design-secure',
    q: 'A company wants to implement centralized logging for all API calls made to AWS services across multiple AWS accounts. The logs must be stored securely in a central S3 bucket and should be tamper-proof. Which solution meets these requirements?',
    options: [
      'A) Enable AWS CloudTrail in each account and deliver logs to a central S3 bucket with S3 Object Lock enabled',
      'B) Enable Amazon CloudWatch Logs in each account and forward to a central account',
      'C) Use AWS Config to record configuration changes and store in S3',
      'D) Enable VPC Flow Logs in each account and deliver to a central S3 bucket'
    ],
    answer: 0,
    explain: 'CloudTrail records all API calls. S3 Object Lock in WORM (Write Once Read Many) mode prevents logs from being modified or deleted, making them tamper-proof. This is the standard solution for compliance audit trails across multiple accounts.',
    architectures: {
      0: {
        requiredServices: ['cloudtrail', 's3', 'kms'],
        requiredConnections: [
          { from: 'cloudtrail', to: 's3' },
          { from: 's3', to: 'kms' }
        ],
        feedback: 'CloudTrail captures all API calls. S3 Object Lock (WORM) prevents tampering. KMS encryption protects the logs at rest. This is the correct compliance architecture.'
      },
      1: {
        requiredServices: ['cloudwatch', 's3'],
        requiredConnections: [{ from: 'cloudwatch', to: 's3' }],
        feedback: 'CloudWatch Logs captures application/system logs and some AWS service logs but is NOT designed for comprehensive API call logging across all AWS services like CloudTrail is.'
      },
      2: {
        requiredServices: ['awsconfig', 's3'],
        requiredConnections: [{ from: 'awsconfig', to: 's3' }],
        feedback: 'AWS Config records configuration changes to AWS resources, not API calls. It answers "what changed?" not "who called what API?".'
      },
      3: {
        requiredServices: ['vpc'],
        requiredConnections: [],
        feedback: 'VPC Flow Logs capture network traffic (IP flows) within VPCs, not API calls to AWS services. They cannot fulfill the API call logging requirement.'
      }
    }
  },
  {
    id: 10,
    cat: 'design-resilient',
    q: 'A company is designing a microservices architecture where services need to communicate asynchronously. When one service produces an event, multiple other services need to receive it independently. Which architecture pattern should be used?',
    options: [
      'A) Each service polls an Amazon SQS Standard Queue for messages',
      'B) Use Amazon SNS to publish events; each consuming service subscribes with its own SQS queue',
      'C) Services communicate directly via HTTP REST API calls',
      'D) Use AWS Step Functions to orchestrate service-to-service communication'
    ],
    answer: 1,
    explain: 'The SNS fan-out pattern delivers the same message to multiple SQS queues simultaneously. Each consuming service processes messages from its own queue independently, enabling loose coupling and independent scaling. This is the standard fan-out pattern in AWS.',
    architectures: {
      0: {
        requiredServices: ['sqs', 'lambda'],
        requiredConnections: [{ from: 'sqs', to: 'lambda' }],
        feedback: 'A single SQS queue means only ONE consumer receives each message. Multiple services cannot all receive the same message independently from a standard queue.'
      },
      1: {
        requiredServices: ['sns', 'sqs', 'lambda'],
        requiredConnections: [
          { from: 'sns', to: 'sqs' },
          { from: 'sqs', to: 'lambda' }
        ],
        feedback: 'SNS fan-out: the producer publishes to one SNS topic. Each consumer has its own SQS queue subscribed to the topic, receiving all messages independently — the correct pattern.'
      },
      2: {
        requiredServices: ['apigateway', 'lambda'],
        requiredConnections: [{ from: 'apigateway', to: 'lambda' }],
        feedback: 'Synchronous HTTP calls create tight coupling. If one service is down, the calling service fails. This defeats the purpose of asynchronous, decoupled microservices.'
      },
      3: {
        requiredServices: ['stepfunctions', 'lambda'],
        requiredConnections: [{ from: 'stepfunctions', to: 'lambda' }],
        feedback: 'Step Functions is an orchestration tool for workflows and state machines. It is not designed for simple pub/sub fan-out messaging between microservices.'
      }
    }
  },
  {
    id: 11,
    cat: 'design-cost',
    q: 'A company stores large amounts of log files in Amazon S3. Logs are accessed frequently for the first 30 days, occasionally from day 31 to 90, and rarely after 90 days. The company wants to minimize storage costs while maintaining accessibility. Which solution is MOST cost-effective?',
    options: [
      'A) Store all logs in S3 Standard indefinitely',
      'B) Store logs in S3 Standard, transition to S3 Standard-IA after 30 days, then to S3 Glacier after 90 days using an S3 Lifecycle policy',
      'C) Store all logs in S3 Glacier from day one',
      'D) Store logs in S3 Standard for 30 days, then delete them'
    ],
    answer: 1,
    explain: 'S3 Lifecycle policies automate tiering: S3 Standard for frequent access, S3 Standard-IA (Infrequent Access) for occasional access at lower cost, and S3 Glacier for archival storage at minimal cost. Each tier is optimized for its access pattern.',
    architectures: {
      0: {
        requiredServices: ['s3'],
        requiredConnections: [],
        feedback: 'S3 Standard for all logs is simple but the most expensive option. Logs rarely accessed after 90 days should not be stored in the highest-cost tier.'
      },
      1: {
        requiredServices: ['s3'],
        requiredConnections: [],
        feedback: 'S3 Lifecycle policy automates transitions: Standard (0-30d) → Standard-IA (30-90d) → Glacier (90d+). Each tier matches the access pattern, minimizing cost while keeping logs accessible.'
      },
      2: {
        requiredServices: ['s3'],
        requiredConnections: [],
        feedback: 'Storing all logs in Glacier from day one makes the first 30 days of frequent access very expensive due to retrieval costs and delays (hours for standard retrieval).'
      },
      3: {
        requiredServices: ['s3'],
        requiredConnections: [],
        feedback: 'Deleting logs after 30 days violates the requirement to maintain accessibility for the full retention period.'
      }
    }
  },
  {
    id: 12,
    cat: 'design-performant',
    q: 'A company runs a web application where users upload large files (up to 5 GB) directly to Amazon S3. Users complain about slow upload speeds, especially from regions far from the S3 bucket. Which solution improves upload performance?',
    options: [
      'A) Use S3 Transfer Acceleration to upload files through CloudFront edge locations',
      'B) Use Amazon CloudFront for uploads',
      'C) Use a multi-part upload with a larger part size',
      'D) Increase the EC2 instance size handling the upload proxy'
    ],
    answer: 0,
    explain: 'S3 Transfer Acceleration routes uploads through the nearest CloudFront edge location and then uses AWS\'s optimized global network backbone to reach the S3 bucket. This can improve upload speeds by up to 500% for long-distance transfers.',
    architectures: {
      0: {
        requiredServices: ['s3', 'cloudfront'],
        requiredConnections: [{ from: 'cloudfront', to: 's3' }],
        feedback: 'S3 Transfer Acceleration uses the CloudFront edge network to accelerate uploads from distant users to S3. Files travel over the optimized AWS backbone instead of the public internet.'
      },
      1: {
        requiredServices: ['s3', 'cloudfront'],
        requiredConnections: [{ from: 'cloudfront', to: 's3' }],
        feedback: 'CloudFront is designed for content DELIVERY (downloads), not uploads. Using CloudFront for uploads does not provide the same acceleration benefit as S3 Transfer Acceleration.'
      },
      2: {
        requiredServices: ['s3'],
        requiredConnections: [],
        feedback: 'Multi-part upload improves upload reliability and allows parallel upload of parts, but does not solve the fundamental issue of long network distance between user and S3.'
      },
      3: {
        requiredServices: ['ec2', 's3'],
        requiredConnections: [{ from: 'ec2', to: 's3' }],
        feedback: 'Adding an EC2 proxy adds complexity and cost. The bottleneck is the network distance, not the EC2 instance size.'
      }
    }
  },
  {
    id: 13,
    cat: 'design-secure',
    q: 'A company uses AWS Lambda functions that need to access a secrets stored in AWS Secrets Manager and read from an Amazon DynamoDB table. Following the principle of least privilege, how should permissions be granted to the Lambda function?',
    options: [
      'A) Embed AWS access keys in the Lambda function environment variables',
      'B) Create an IAM role with only the required permissions and attach it to the Lambda function as its execution role',
      'C) Create an IAM user with the required permissions and pass the credentials as Lambda environment variables',
      'D) Use the AWS root account credentials in the Lambda function'
    ],
    answer: 1,
    explain: 'IAM roles for Lambda (execution roles) provide temporary credentials automatically. The role should have only the minimum permissions needed (least privilege): SecretsManager:GetSecretValue and DynamoDB:GetItem. No credentials are stored in code.',
    architectures: {
      0: {
        requiredServices: ['lambda'],
        requiredConnections: [],
        feedback: 'Embedding access keys in environment variables is a security anti-pattern. Keys can be exposed in logs or if the Lambda is compromised. Use IAM roles instead.'
      },
      1: {
        requiredServices: ['lambda', 'iam', 'secretsmanager', 'dynamodb'],
        requiredConnections: [
          { from: 'iam', to: 'lambda' },
          { from: 'lambda', to: 'secretsmanager' },
          { from: 'lambda', to: 'dynamodb' }
        ],
        feedback: 'IAM execution role with least-privilege permissions: Lambda automatically gets temporary credentials. No keys to manage or rotate. This is the AWS-recommended approach.'
      },
      2: {
        requiredServices: ['lambda', 'iam'],
        requiredConnections: [{ from: 'iam', to: 'lambda' }],
        feedback: 'IAM users have long-term credentials that must be rotated manually. Storing them in environment variables is a security risk. IAM roles are always preferred for AWS services.'
      },
      3: {
        requiredServices: ['lambda'],
        requiredConnections: [],
        feedback: 'Using root account credentials is a critical security violation and AWS best practice explicitly prohibits this for any workload.'
      }
    }
  },
  {
    id: 14,
    cat: 'design-resilient',
    q: 'A company has an application that experiences unpredictable traffic spikes. The application needs to process requests without losing any messages even during traffic spikes. Which architecture ensures no messages are lost?',
    options: [
      'A) Increase the EC2 instance size to handle the peak load',
      'B) Use Amazon SQS to queue requests, with Auto Scaling EC2 instances processing the queue based on queue depth',
      'C) Deploy the application on AWS Lambda with provisioned concurrency',
      'D) Use Amazon ElastiCache to buffer requests in memory'
    ],
    answer: 1,
    explain: 'SQS acts as a durable buffer that accepts all incoming requests without loss. Auto Scaling adds EC2 workers based on queue depth (CloudWatch SQS metrics), ensuring messages are processed even during spikes. SQS retains messages for up to 14 days.',
    architectures: {
      0: {
        requiredServices: ['ec2'],
        requiredConnections: [],
        feedback: 'Larger instances handle more requests but have a fixed capacity ceiling. Unpredictable spikes can still overwhelm a fixed-size instance, causing message loss.'
      },
      1: {
        requiredServices: ['sqs', 'asg', 'ec2', 'cloudwatch'],
        requiredConnections: [
          { from: 'sqs', to: 'ec2' },
          { from: 'cloudwatch', to: 'asg' },
          { from: 'asg', to: 'ec2' }
        ],
        feedback: 'SQS durably stores all messages. CloudWatch monitors queue depth and triggers Auto Scaling to add workers. No messages are lost regardless of spike magnitude.'
      },
      2: {
        requiredServices: ['lambda', 'apigateway'],
        requiredConnections: [{ from: 'apigateway', to: 'lambda' }],
        feedback: 'Lambda with provisioned concurrency handles scaling but has concurrency limits. Without SQS, if Lambda is overwhelmed, synchronous requests may be throttled and lost.'
      },
      3: {
        requiredServices: ['elasticache', 'ec2'],
        requiredConnections: [{ from: 'ec2', to: 'elasticache' }],
        feedback: 'ElastiCache is an in-memory cache, not a message queue. Data in ElastiCache is not durable — it can be lost if the cache is full or the cluster fails.'
      }
    }
  },
  {
    id: 15,
    cat: 'design-cost',
    q: 'A company has an Amazon RDS database that is used only during business hours (9 AM to 6 PM) on weekdays. The rest of the time, the database is idle. Which approach MOST reduces the RDS costs while keeping the database available during business hours?',
    options: [
      'A) Use a Reserved Instance to save on hourly costs',
      'B) Stop the RDS instance outside of business hours using AWS Systems Manager automation or a Lambda scheduled function',
      'C) Migrate to Amazon DynamoDB to eliminate idle time costs',
      'D) Enable RDS Auto Scaling to scale down to minimum capacity when idle'
    ],
    answer: 1,
    explain: 'Stopping an RDS instance when not in use pauses the instance-hour charges (you only pay for storage). During ~128 business hours per month vs. 730 total hours, this reduces compute costs by over 80%. RDS can be stopped for up to 7 days before AWS automatically restarts it.',
    architectures: {
      0: {
        requiredServices: ['rds'],
        requiredConnections: [],
        feedback: 'Reserved Instances save money for 24/7 workloads. For a database used only ~18% of the time, paying for 24/7 reserved capacity vs. stopping it when idle is more expensive.'
      },
      1: {
        requiredServices: ['rds', 'lambda'],
        requiredConnections: [{ from: 'lambda', to: 'rds' }],
        optionalServices: ['eventbridge'],
        feedback: 'A Lambda function triggered by EventBridge (CloudWatch Events) on a cron schedule starts the RDS instance before business hours and stops it after. Compute charges pause while stopped.'
      },
      2: {
        requiredServices: ['dynamodb'],
        requiredConnections: [],
        feedback: 'Migrating to DynamoDB is a major change and may not be appropriate if the application requires relational features. The question asks to reduce RDS costs, not replace it.'
      },
      3: {
        requiredServices: ['rds'],
        requiredConnections: [],
        feedback: 'RDS Storage Auto Scaling adjusts storage capacity but does not reduce the compute (instance) costs during idle hours.'
      }
    }
  },
  {
    id: 16,
    cat: 'design-secure',
    q: 'A company needs to allow their on-premises data center to securely access resources in an Amazon VPC. The connection must be private, not traverse the public internet, and support high bandwidth requirements. Which solution should be used?',
    options: [
      'A) AWS Site-to-Site VPN over the public internet',
      'B) AWS Direct Connect with a private Virtual Interface',
      'C) Amazon CloudFront with an origin in the VPC',
      'D) AWS PrivateLink to expose VPC services'
    ],
    answer: 1,
    explain: 'AWS Direct Connect provides a dedicated, private physical connection from on-premises to AWS. It does not traverse the public internet, offers consistent network performance, and supports high bandwidth (up to 100 Gbps). The private VIF connects to VPC resources.',
    architectures: {
      0: {
        requiredServices: ['vpn', 'vpc'],
        requiredConnections: [{ from: 'vpn', to: 'vpc' }],
        feedback: 'Site-to-Site VPN is encrypted but uses the public internet, which means variable latency and bandwidth constraints. The requirement specifies NO public internet traversal.'
      },
      1: {
        requiredServices: ['directconnect', 'vpc'],
        requiredConnections: [{ from: 'directconnect', to: 'vpc' }],
        optionalServices: ['vpn'],
        feedback: 'AWS Direct Connect: dedicated private fiber connection from on-premises to AWS. Never touches the public internet, supports high bandwidth, consistent low latency.'
      },
      2: {
        requiredServices: ['cloudfront', 'vpc'],
        requiredConnections: [{ from: 'cloudfront', to: 'vpc' }],
        feedback: 'CloudFront is a CDN for content delivery to end users, not for private on-premises to VPC connectivity.'
      },
      3: {
        requiredServices: ['vpcendpoint', 'vpc'],
        requiredConnections: [{ from: 'vpcendpoint', to: 'vpc' }],
        feedback: 'AWS PrivateLink enables private access to AWS services from a VPC, but it does not establish connectivity between on-premises data centers and VPCs.'
      }
    }
  },
  {
    id: 17,
    cat: 'design-performant',
    q: 'A company is building a real-time dashboard that displays metrics from thousands of IoT devices. The data arrives continuously, and the dashboard must show near real-time aggregations. Which AWS service should be used to ingest and process the streaming data?',
    options: [
      'A) Amazon SQS Standard Queue with Lambda polling',
      'B) Amazon Kinesis Data Streams with Amazon Kinesis Data Analytics',
      'C) Amazon S3 with batch processing via AWS Glue',
      'D) Amazon RDS with a write-optimized instance class'
    ],
    answer: 1,
    explain: 'Kinesis Data Streams ingests high-throughput real-time data from thousands of sources. Kinesis Data Analytics processes the stream using SQL to compute real-time aggregations for the dashboard. This is the purpose-built AWS solution for real-time streaming analytics.',
    architectures: {
      0: {
        requiredServices: ['sqs', 'lambda'],
        requiredConnections: [{ from: 'sqs', to: 'lambda' }],
        feedback: 'SQS with Lambda polling introduces latency and SQS is designed for decoupling, not real-time analytics. It lacks native stream processing capabilities needed for continuous aggregations.'
      },
      1: {
        requiredServices: ['kinesis', 'dynamodb'],
        requiredConnections: [{ from: 'kinesis', to: 'dynamodb' }],
        optionalServices: ['lambda'],
        feedback: 'Kinesis Data Streams handles high-throughput real-time ingestion. Kinesis Data Analytics (or Lambda) processes the stream in real-time. DynamoDB stores the aggregated results for the dashboard.'
      },
      2: {
        requiredServices: ['s3'],
        requiredConnections: [],
        feedback: 'S3 with Glue is a batch processing solution. Processing latency is in minutes to hours — NOT suitable for a real-time dashboard.'
      },
      3: {
        requiredServices: ['rds'],
        requiredConnections: [],
        feedback: 'RDS is a relational database designed for transactional workloads, not for ingesting thousands of concurrent IoT streams or real-time stream processing.'
      }
    }
  },
  {
    id: 18,
    cat: 'design-resilient',
    q: 'A company wants to implement a disaster recovery strategy for their AWS workload. The RTO requirement is less than 1 hour and RPO is less than 15 minutes. The company wants to minimize costs. Which DR strategy should they use?',
    options: [
      'A) Backup and Restore — take regular snapshots and restore in DR region',
      'B) Pilot Light — maintain a minimal version of the environment running in the DR region',
      'C) Warm Standby — maintain a scaled-down but fully functional environment in DR region',
      'D) Multi-Site Active-Active — run full production in both regions simultaneously'
    ],
    answer: 2,
    explain: 'Warm Standby keeps a scaled-down but fully functional replica running. Failover requires scaling up (not provisioning from scratch), enabling sub-1-hour RTO. Continuous data replication provides RPO < 15 minutes. It is more cost-effective than Multi-Site Active-Active.',
    architectures: {
      0: {
        requiredServices: ['s3', 'rds'],
        requiredConnections: [{ from: 'rds', to: 's3' }],
        feedback: 'Backup and Restore has the highest RTO (hours to days to restore) and highest RPO (time since last backup). Does NOT meet < 1-hour RTO and < 15-minute RPO.'
      },
      1: {
        requiredServices: ['ec2', 'rds'],
        requiredConnections: [{ from: 'ec2', to: 'rds' }],
        feedback: 'Pilot Light keeps only core components running (e.g., database replication). Compute must be provisioned on failover. RTO can approach 1 hour but is riskier for strict SLAs.'
      },
      2: {
        requiredServices: ['ec2', 'rds', 'alb', 'route53'],
        requiredConnections: [
          { from: 'route53', to: 'alb' },
          { from: 'alb', to: 'ec2' },
          { from: 'ec2', to: 'rds' }
        ],
        feedback: 'Warm Standby: scaled-down full stack running in DR region. Scale out on failover. Continuous replication gives RPO < 15 min. Route 53 DNS failover enables < 1-hour RTO.'
      },
      3: {
        requiredServices: ['ec2', 'rds', 'alb', 'route53'],
        requiredConnections: [
          { from: 'route53', to: 'alb' },
          { from: 'alb', to: 'ec2' },
          { from: 'ec2', to: 'rds' }
        ],
        feedback: 'Multi-Site Active-Active meets the RTO/RPO requirements but at 2x the cost of a single region. The question asks to MINIMIZE costs — Warm Standby is sufficient and cheaper.'
      }
    }
  },
  {
    id: 19,
    cat: 'design-secure',
    q: 'A company wants to protect their web application running behind an Application Load Balancer from SQL injection attacks and DDoS attacks. Which combination of AWS services provides this protection?',
    options: [
      'A) Amazon CloudFront with AWS Shield Standard (included free)',
      'B) AWS WAF on the ALB with managed rule groups, and AWS Shield Advanced',
      'C) Amazon GuardDuty to detect threats and alert the security team',
      'D) VPC Security Groups and Network ACLs to block malicious IPs'
    ],
    answer: 1,
    explain: 'AWS WAF on the ALB filters HTTP/HTTPS traffic and blocks SQL injection using managed rule groups. AWS Shield Advanced provides enhanced DDoS protection with 24/7 DDoS response team and cost protection. Together they address both SQL injection and DDoS threats.',
    architectures: {
      0: {
        requiredServices: ['cloudfront', 'alb'],
        requiredConnections: [{ from: 'cloudfront', to: 'alb' }],
        feedback: 'Shield Standard (free) protects against common Layer 3/4 DDoS attacks but does NOT protect against SQL injection (Layer 7). No WAF = no SQL injection protection.'
      },
      1: {
        requiredServices: ['waf', 'alb', 'ec2'],
        requiredConnections: [
          { from: 'waf', to: 'alb' },
          { from: 'alb', to: 'ec2' }
        ],
        optionalServices: ['cloudfront'],
        feedback: 'WAF with managed rules blocks SQL injection at Layer 7. Shield Advanced provides enhanced DDoS protection and a 24/7 response team. Together they protect against both threat vectors.'
      },
      2: {
        requiredServices: ['cloudwatch'],
        requiredConnections: [],
        feedback: 'GuardDuty is a threat detection service that monitors and alerts, but it does NOT actively block SQL injection attacks or prevent DDoS. Reactive, not preventive.'
      },
      3: {
        requiredServices: ['securitygroups', 'vpc'],
        requiredConnections: [{ from: 'securitygroups', to: 'vpc' }],
        feedback: 'Security Groups and NACLs work at Layer 3/4 (IP/port level). They cannot inspect HTTP request payloads to detect SQL injection — that requires a Layer 7 tool like WAF.'
      }
    }
  },
  {
    id: 20,
    cat: 'design-cost',
    q: 'A company runs a multi-tier application with web, application, and database tiers. The web and application tiers run on EC2 instances. Usage patterns show 70% of the time the load is predictable and consistent, with occasional 30% spikes. Which EC2 purchasing strategy minimizes cost while handling all demand?',
    options: [
      'A) Use all On-Demand Instances for maximum flexibility',
      'B) Use Reserved Instances for the baseline 70% load, and On-Demand or Spot Instances for the spike 30%',
      'C) Use all Reserved Instances sized for peak load',
      'D) Use all Spot Instances with a Spot Fleet'
    ],
    answer: 1,
    explain: 'The optimal strategy: Reserved Instances (1-year, standard) for the predictable 70% baseline (up to 72% savings), and On-Demand or Spot Instances for unpredictable 30% spikes. This blended approach minimizes cost while ensuring all demand is always met.',
    architectures: {
      0: {
        requiredServices: ['ec2', 'alb', 'asg'],
        requiredConnections: [
          { from: 'alb', to: 'asg' },
          { from: 'asg', to: 'ec2' }
        ],
        feedback: 'All On-Demand has maximum flexibility but maximum cost. Reserved Instances save up to 72% for the predictable baseline — always more cost-effective for consistent workloads.'
      },
      1: {
        requiredServices: ['ec2', 'alb', 'asg', 'cloudwatch'],
        requiredConnections: [
          { from: 'alb', to: 'asg' },
          { from: 'asg', to: 'ec2' },
          { from: 'cloudwatch', to: 'asg' }
        ],
        feedback: 'Reserved Instances (baseline) + On-Demand/Spot (spikes): RIs cover the steady 70% at maximum discount. Auto Scaling adds On-Demand or Spot for the spike 30%, balancing cost and availability.'
      },
      2: {
        requiredServices: ['ec2', 'alb'],
        requiredConnections: [{ from: 'alb', to: 'ec2' }],
        feedback: 'Reserving instances sized for peak load wastes money during the 70% of time when running at lower capacity. Over-provisioning with RIs is not cost-optimal.'
      },
      3: {
        requiredServices: ['ec2', 'alb', 'asg'],
        requiredConnections: [
          { from: 'alb', to: 'asg' },
          { from: 'asg', to: 'ec2' }
        ],
        feedback: 'All Spot Instances saves money but Spot instances can be interrupted at any time. For a multi-tier application with a predictable baseline, using only Spot is too risky — the web/app tier cannot tolerate frequent interruptions.'
      }
    }
  }
];

// ==================== ARCHITECTURE TEMPLATES ====================
// Maps common SAA-C03 architectural patterns to service/connection data

const ARCH_TEMPLATES = {
  'ec2-basic': {
    requiredServices: ['ec2'],
    requiredConnections: []
  },
  'ec2-alb-asg': {
    requiredServices: ['alb', 'asg', 'ec2'],
    requiredConnections: [{ from: 'alb', to: 'asg' }, { from: 'asg', to: 'ec2' }]
  },
  'lambda-api': {
    requiredServices: ['apigateway', 'lambda'],
    requiredConnections: [{ from: 'apigateway', to: 'lambda' }]
  },
  'serverless': {
    requiredServices: ['apigateway', 'lambda', 'dynamodb'],
    requiredConnections: [{ from: 'apigateway', to: 'lambda' }, { from: 'lambda', to: 'dynamodb' }]
  },
  's3-static': {
    requiredServices: ['s3', 'cloudfront'],
    requiredConnections: [{ from: 'cloudfront', to: 's3' }]
  },
  's3-cloudfront-route53': {
    requiredServices: ['route53', 'cloudfront', 's3'],
    requiredConnections: [{ from: 'route53', to: 'cloudfront' }, { from: 'cloudfront', to: 's3' }]
  },
  'rds-ec2': {
    requiredServices: ['ec2', 'rds'],
    requiredConnections: [{ from: 'ec2', to: 'rds' }]
  },
  'rds-multi-az': {
    requiredServices: ['ec2', 'rds'],
    requiredConnections: [{ from: 'ec2', to: 'rds' }]
  },
  'aurora': {
    requiredServices: ['ec2', 'aurora'],
    requiredConnections: [{ from: 'ec2', to: 'aurora' }]
  },
  'dynamodb': {
    requiredServices: ['lambda', 'dynamodb'],
    requiredConnections: [{ from: 'lambda', to: 'dynamodb' }]
  },
  'elasticache': {
    requiredServices: ['ec2', 'elasticache', 'rds'],
    requiredConnections: [{ from: 'ec2', to: 'elasticache' }, { from: 'ec2', to: 'rds' }]
  },
  'sqs-decoupling': {
    requiredServices: ['ec2', 'sqs', 'ec2'],
    requiredConnections: [{ from: 'ec2', to: 'sqs' }, { from: 'sqs', to: 'ec2' }]
  },
  'sns-fanout': {
    requiredServices: ['sns', 'sqs'],
    requiredConnections: [{ from: 'sns', to: 'sqs' }]
  },
  'vpc-public-private': {
    requiredServices: ['vpc', 'igw', 'natgw', 'ec2'],
    requiredConnections: [{ from: 'igw', to: 'ec2' }, { from: 'ec2', to: 'natgw' }]
  },
  'vpc-endpoint': {
    requiredServices: ['ec2', 'vpcendpoint', 's3'],
    requiredConnections: [{ from: 'ec2', to: 'vpcendpoint' }, { from: 'vpcendpoint', to: 's3' }]
  },
  'direct-connect': {
    requiredServices: ['directconnect', 'vpc'],
    requiredConnections: [{ from: 'directconnect', to: 'vpc' }]
  },
  'vpn': {
    requiredServices: ['vpn', 'vpc'],
    requiredConnections: [{ from: 'vpn', to: 'vpc' }]
  },
  'cloudwatch': {
    requiredServices: ['cloudwatch', 'ec2'],
    requiredConnections: [{ from: 'cloudwatch', to: 'ec2' }]
  },
  'kinesis': {
    requiredServices: ['kinesis', 's3'],
    requiredConnections: [{ from: 'kinesis', to: 's3' }]
  },
  'kinesis-firehose': {
    requiredServices: ['kinesisfirehose', 's3'],
    requiredConnections: [{ from: 'kinesisfirehose', to: 's3' }]
  },
  'iam': {
    requiredServices: ['iam', 'ec2'],
    requiredConnections: [{ from: 'iam', to: 'ec2' }]
  },
  'kms': {
    requiredServices: ['kms', 's3'],
    requiredConnections: [{ from: 's3', to: 'kms' }]
  },
  'secrets-manager': {
    requiredServices: ['secretsmanager', 'ec2'],
    requiredConnections: [{ from: 'ec2', to: 'secretsmanager' }]
  },
  'waf-alb': {
    requiredServices: ['waf', 'alb', 'ec2'],
    requiredConnections: [{ from: 'waf', to: 'alb' }, { from: 'alb', to: 'ec2' }]
  },
  'cloudfront-waf': {
    requiredServices: ['cloudfront', 'waf', 's3'],
    requiredConnections: [{ from: 'waf', to: 'cloudfront' }, { from: 'cloudfront', to: 's3' }]
  },
  'cognito': {
    requiredServices: ['cognito', 'apigateway', 'lambda'],
    requiredConnections: [{ from: 'cognito', to: 'apigateway' }, { from: 'apigateway', to: 'lambda' }]
  },
  'route53-health': {
    requiredServices: ['route53', 'ec2'],
    requiredConnections: [{ from: 'route53', to: 'ec2' }]
  },
  'cloudfront-ec2': {
    requiredServices: ['cloudfront', 'alb', 'ec2'],
    requiredConnections: [{ from: 'cloudfront', to: 'alb' }, { from: 'alb', to: 'ec2' }]
  },
  'ecs': {
    requiredServices: ['ecs', 'alb'],
    requiredConnections: [{ from: 'alb', to: 'ecs' }]
  },
  'fargate': {
    requiredServices: ['fargate', 'alb'],
    requiredConnections: [{ from: 'alb', to: 'fargate' }]
  },
  'eks': {
    requiredServices: ['eks', 'alb'],
    requiredConnections: [{ from: 'alb', to: 'eks' }]
  },
  'redshift': {
    requiredServices: ['redshift', 's3'],
    requiredConnections: [{ from: 's3', to: 'redshift' }]
  },
  'athena': {
    requiredServices: ['athena', 's3'],
    requiredConnections: [{ from: 'athena', to: 's3' }]
  },
  'glue': {
    requiredServices: ['glue', 's3'],
    requiredConnections: [{ from: 'glue', to: 's3' }]
  },
  'emr': {
    requiredServices: ['emr', 's3'],
    requiredConnections: [{ from: 'emr', to: 's3' }]
  },
  'step-functions': {
    requiredServices: ['stepfunctions', 'lambda'],
    requiredConnections: [{ from: 'stepfunctions', to: 'lambda' }]
  },
  'dms': {
    requiredServices: ['dms', 'rds'],
    requiredConnections: [{ from: 'dms', to: 'rds' }]
  },
  'cloudtrail': {
    requiredServices: ['cloudtrail', 's3'],
    requiredConnections: [{ from: 'cloudtrail', to: 's3' }]
  },
  'config': {
    requiredServices: ['awsconfig', 'sns'],
    requiredConnections: [{ from: 'awsconfig', to: 'sns' }]
  },
  'guardduty': {
    requiredServices: ['guardduty', 'cloudwatch'],
    requiredConnections: [{ from: 'guardduty', to: 'cloudwatch' }]
  },
  'macie': {
    requiredServices: ['macie', 's3'],
    requiredConnections: [{ from: 'macie', to: 's3' }]
  },
  'transit-gateway': {
    requiredServices: ['transitgateway', 'vpc'],
    requiredConnections: [{ from: 'transitgateway', to: 'vpc' }]
  },
  'datasync': {
    requiredServices: ['datasync', 's3'],
    requiredConnections: [{ from: 'datasync', to: 's3' }]
  },
  'backup': {
    requiredServices: ['backup', 'rds'],
    requiredConnections: [{ from: 'backup', to: 'rds' }]
  },
  'eventbridge': {
    requiredServices: ['eventbridge', 'lambda'],
    requiredConnections: [{ from: 'eventbridge', to: 'lambda' }]
  },
  'ebs': {
    requiredServices: ['ec2', 'ebs'],
    requiredConnections: [{ from: 'ec2', to: 'ebs' }]
  },
  'efs': {
    requiredServices: ['ec2', 'efs'],
    requiredConnections: [{ from: 'ec2', to: 'efs' }]
  },
  's3-only': {
    requiredServices: ['s3'],
    requiredConnections: []
  },
  'rds-only': {
    requiredServices: ['rds'],
    requiredConnections: []
  }
};

// ==================== KEYWORD → TEMPLATE MAPPING ====================
// Maps question/option keywords to architecture template IDs

const KEYWORD_TEMPLATE_MAP = [
  { keywords: ['cloudfront', 'cdn', 'distribution', 'edge location', 'static website', 'static content', 's3', 'origin'], template: 's3-cloudfront-route53' },
  { keywords: ['waf', 'sql injection', 'xss', 'web application firewall', 'owasp'], template: 'waf-alb' },
  { keywords: ['auto scaling', 'autoscaling', 'asg', 'application load balancer', 'alb', 'load balancer', 'scale'], template: 'ec2-alb-asg' },
  { keywords: ['lambda', 'api gateway', 'serverless', 'function', 'dynamodb'], template: 'serverless' },
  { keywords: ['lambda', 'api gateway', 'serverless', 'function'], template: 'lambda-api' },
  { keywords: ['kinesis data firehose', 'firehose', 'delivery stream'], template: 'kinesis-firehose' },
  { keywords: ['kinesis data streams', 'kinesis streams', 'kinesis'], template: 'kinesis' },
  { keywords: ['elasticache', 'redis', 'memcached', 'cache', 'caching'], template: 'elasticache' },
  { keywords: ['sqs', 'queue', 'message queue', 'decouple', 'decoupling', 'loose coupling'], template: 'sqs-decoupling' },
  { keywords: ['sns', 'notification', 'pub/sub', 'fanout', 'topic'], template: 'sns-fanout' },
  { keywords: ['direct connect', 'directconnect', 'dedicated connection'], template: 'direct-connect' },
  { keywords: ['vpn', 'site-to-site vpn', 'vpn tunnel'], template: 'vpn' },
  { keywords: ['vpc endpoint', 'gateway endpoint', 'interface endpoint', 'privatelink', 'private connectivity'], template: 'vpc-endpoint' },
  { keywords: ['nat gateway', 'private subnet', 'public subnet', 'internet gateway', 'igw'], template: 'vpc-public-private' },
  { keywords: ['aurora', 'amazon aurora', 'aurora global'], template: 'aurora' },
  { keywords: ['rds', 'relational database', 'mysql', 'postgresql', 'oracle', 'sql server', 'multi-az'], template: 'rds-multi-az' },
  { keywords: ['dynamodb', 'nosql', 'key-value', 'document store'], template: 'dynamodb' },
  { keywords: ['redshift', 'data warehouse', 'olap', 'analytics database'], template: 'redshift' },
  { keywords: ['athena', 'query s3', 'sql on s3'], template: 'athena' },
  { keywords: ['glue', 'etl', 'data catalog', 'crawler'], template: 'glue' },
  { keywords: ['emr', 'hadoop', 'spark', 'big data', 'hive'], template: 'emr' },
  { keywords: ['step functions', 'workflow', 'state machine', 'orchestrat'], template: 'step-functions' },
  { keywords: ['cloudtrail', 'audit', 'api activity', 'logging'], template: 'cloudtrail' },
  { keywords: ['cloudwatch', 'monitoring', 'metrics', 'alarms', 'logs'], template: 'cloudwatch' },
  { keywords: ['aws config', 'compliance', 'configuration rules'], template: 'config' },
  { keywords: ['kms', 'key management', 'customer managed key', 'cmk', 'encrypt'], template: 'kms' },
  { keywords: ['secrets manager', 'secret', 'credential rotation', 'database password'], template: 'secrets-manager' },
  { keywords: ['cognito', 'user pool', 'identity pool', 'authentication', 'oauth', 'saml'], template: 'cognito' },
  { keywords: ['guardduty', 'threat detection', 'malicious activity'], template: 'guardduty' },
  { keywords: ['macie', 'sensitive data', 'pii', 'data classification'], template: 'macie' },
  { keywords: ['iam', 'role', 'permission', 'policy', 'access control', 'least privilege'], template: 'iam' },
  { keywords: ['ecs', 'container', 'docker', 'task definition'], template: 'ecs' },
  { keywords: ['eks', 'kubernetes', 'k8s'], template: 'eks' },
  { keywords: ['fargate', 'serverless container', 'container without server'], template: 'fargate' },
  { keywords: ['datasync', 'data transfer', 'migrate data', 'on-premises to s3'], template: 'datasync' },
  { keywords: ['aws backup', 'centralized backup', 'backup plan'], template: 'backup' },
  { keywords: ['dms', 'database migration', 'migrate database'], template: 'dms' },
  { keywords: ['transit gateway', 'hub-and-spoke', 'connect vpcs'], template: 'transit-gateway' },
  { keywords: ['route 53', 'route53', 'dns', 'health check', 'failover routing', 'latency routing', 'weighted routing'], template: 'route53-health' },
  { keywords: ['eventbridge', 'event bus', 'scheduled events', 'event-driven'], template: 'eventbridge' },
  { keywords: ['ebs', 'block storage', 'volume', 'snapshots'], template: 'ebs' },
  { keywords: ['efs', 'elastic file system', 'nfs', 'shared file'], template: 'efs' },
  { keywords: ['s3', 'object storage', 'bucket', 'glacier', 'storage class'], template: 's3-only' },
  { keywords: ['ec2', 'instance', 'virtual machine', 'compute'], template: 'ec2-basic' }
];

/**
 * Infer an architecture template from option text and question text.
 * Returns a template object or a fallback minimal architecture.
 */
function veInferArchitecture(optionText, questionText) {
  const combined = (optionText + ' ' + questionText).toLowerCase();

  // Walk through keyword map, return first matching template
  for (const entry of KEYWORD_TEMPLATE_MAP) {
    if (entry.keywords.some(kw => combined.includes(kw))) {
      const tpl = ARCH_TEMPLATES[entry.template];
      if (tpl) return { ...tpl, feedback: '' };
    }
  }

  // Fallback: guess a single service from the option text
  const fallbackServices = [
    { kw: 'cloudfront', id: 'cloudfront' },
    { kw: 'alb', id: 'alb' },
    { kw: 'nlb', id: 'nlb' },
    { kw: 's3', id: 's3' },
    { kw: 'rds', id: 'rds' },
    { kw: 'lambda', id: 'lambda' },
    { kw: 'ec2', id: 'ec2' },
    { kw: 'dynamodb', id: 'dynamodb' },
    { kw: 'aurora', id: 'aurora' },
    { kw: 'elasticache', id: 'elasticache' },
    { kw: 'sqs', id: 'sqs' },
    { kw: 'sns', id: 'sns' },
    { kw: 'kinesis', id: 'kinesis' },
    { kw: 'iam', id: 'iam' },
    { kw: 'kms', id: 'kms' },
    { kw: 'route 53', id: 'route53' },
    { kw: 'cloudwatch', id: 'cloudwatch' },
    { kw: 'ecs', id: 'ecs' },
    { kw: 'eks', id: 'eks' },
    { kw: 'fargate', id: 'fargate' }
  ];
  for (const fb of fallbackServices) {
    if (combined.includes(fb.kw)) {
      return { requiredServices: [fb.id], requiredConnections: [], feedback: '' };
    }
  }

  return { requiredServices: ['ec2'], requiredConnections: [], feedback: '' };
}

/**
 * Auto-generate architecture data for a saaQuestion.
 * Returns an object keyed 0–3 (one per answer option).
 */
function veGenerateArchitectures(question) {
  const archs = {};
  question.options.forEach((opt, idx) => {
    const arch = veInferArchitecture(opt, question.q);
    arch.feedback = (idx === question.answer)
      ? '✅ ' + (question.explain || 'This is the correct answer.')
      : '❌ ' + opt + ' — ' + (question.explain && question.explain.trim() ? 'The correct approach: ' + question.explain.split('.')[0] + '.' : 'Incorrect for this scenario.');
    archs[idx] = arch;
  });
  return archs;
}

// ==================== EXTEND WITH ALL SAA QUESTIONS ====================
// Auto-populate VISUAL_EXAM_QUESTIONS from the global saaQuestions array,
// skipping any questions already included above.

(function extendFromSaaQuestions() {
  if (typeof saaQuestions === 'undefined') return;
  const existingTexts = new Set(VISUAL_EXAM_QUESTIONS.map(q => q.q));
  let nextId = VISUAL_EXAM_QUESTIONS.length + 1;
  saaQuestions.forEach(sq => {
    if (existingTexts.has(sq.q)) return; // skip duplicates
    if (!sq.q || !sq.options || sq.options.length < 4) return;
    VISUAL_EXAM_QUESTIONS.push({
      id: nextId++,
      cat: sq.cat || 'design-resilient',
      q: sq.q,
      options: sq.options.slice(0, 26).map((opt, i) => String.fromCharCode(65 + i) + ') ' + opt),
      answer: sq.answer,
      explain: sq.explain || '',
      architectures: veGenerateArchitectures(sq)
    });
  });
})();
