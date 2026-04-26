#!/usr/bin/env python3
"""
generate-questions.py
Generates professional AWS exam questions using Claude Sonnet.
Style matches real SAA-C03 exam questions — scenario-based, 4 options, full explanations.

Run from: ~/Desktop/Projects/CertiPrepAI/
Requires: pip install anthropic (already installed in venv)
Set: export ANTHROPIC_API_KEY=sk-ant-...
"""

import json, os, sys, time, re, random
from pathlib import Path

try:
    import anthropic
except ImportError:
    print("Missing: pip install anthropic")
    sys.exit(1)

API_KEY = os.environ.get("ANTHROPIC_API_KEY")
if not API_KEY:
    print("Missing: export ANTHROPIC_API_KEY=sk-ant-...")
    sys.exit(1)

client = anthropic.Anthropic(api_key=API_KEY)

DATA_DIR = Path("react-app/public/data")
TARGET_COUNT = 260  # questions per cert

# ─── Cert definitions ────────────────────────────────────────────────────────

CERTS = {
    "soa-c02": {
        "name": "AWS SysOps Administrator Associate (SOA-C02)",
        "domains": [
            "Monitoring, Logging, and Remediation (20%): CloudWatch metrics/alarms/logs, CloudTrail, AWS Config, Systems Manager, automated remediation",
            "Reliability and Business Continuity (16%): Auto Scaling, ELB health checks, backups, RTO/RPO, multi-AZ, failover",
            "Deployment, Provisioning, and Automation (18%): CloudFormation, Elastic Beanstalk, OpsWorks, AMIs, launch templates, Systems Manager Patch Manager",
            "Security and Compliance (16%): IAM, KMS, Secrets Manager, GuardDuty, Security Hub, Config rules, compliance",
            "Networking and Content Delivery (18%): VPC, Route 53, CloudFront, Transit Gateway, VPN, Direct Connect, NACLs, security groups",
            "Cost and Performance Optimization (12%): Cost Explorer, Trusted Advisor, Compute Optimizer, Reserved Instances, Savings Plans, rightsizing",
        ],
        "scenario_types": [
            "A company notices high CPU utilization on EC2 instances",
            "A SysOps administrator needs to automate patch management",
            "A company wants to reduce operational costs",
            "An application is experiencing intermittent failures",
            "A company needs to ensure compliance with security policies",
            "A team needs to monitor and alert on infrastructure changes",
            "A company wants to automate deployment of infrastructure",
            "An organization needs to implement backup and disaster recovery",
        ]
    },
    "scs-c03": {
        "name": "AWS Security Specialty (SCS-C03)",
        "domains": [
            "Threat Detection and Incident Response (14%): GuardDuty findings, Security Hub, Detective, automated incident response, forensics",
            "Security Logging and Monitoring (18%): CloudTrail, CloudWatch Logs, VPC Flow Logs, S3 access logs, Config, log analysis",
            "Infrastructure Security (20%): VPC security, WAF, Shield, Network Firewall, security groups, NACLs, PrivateLink",
            "Identity and Access Management (16%): IAM policies, SCPs, permission boundaries, cross-account access, federation, Cognito",
            "Data Protection (18%): KMS, CloudHSM, ACM, encryption at rest/transit, S3 encryption, Secrets Manager, Macie",
            "Management and Security Governance (14%): AWS Organizations, Control Tower, Config rules, Security Hub standards, compliance",
        ],
        "scenario_types": [
            "A security team detects unusual API calls in CloudTrail",
            "A company needs to encrypt sensitive data at rest",
            "An organization wants to enforce security controls across accounts",
            "A company needs to implement least privilege access",
            "A security engineer needs to detect and respond to threats",
            "A company must comply with regulatory requirements",
            "An application needs secure secret storage and rotation",
            "A company wants to protect its web application from attacks",
        ]
    },
    "gai-c01": {
        "name": "AWS Generative AI Developer (GAI-C01)",
        "domains": [
            "Fundamentals of AI and ML (20%): ML concepts, model types, training vs inference, supervised/unsupervised learning, neural networks",
            "Fundamentals of Generative AI (24%): Foundation models, LLMs, transformers, tokens, embeddings, prompt engineering, RAG",
            "Applications of Foundation Models (28%): Amazon Bedrock, model selection, fine-tuning, agents, knowledge bases, guardrails",
            "Guidelines for Responsible AI (14%): Bias, fairness, transparency, privacy, safety, hallucination, human oversight",
            "Security, Compliance, and Governance (14%): Data privacy, model security, access control, compliance for AI workloads",
        ],
        "scenario_types": [
            "A company wants to build a chatbot using foundation models",
            "A developer needs to reduce hallucinations in AI responses",
            "An organization wants to fine-tune a model on proprietary data",
            "A company needs to implement RAG for document Q&A",
            "A team wants to build an AI agent for task automation",
            "A company needs to evaluate foundation model outputs",
            "An organization wants to implement responsible AI practices",
            "A developer needs to optimize prompt engineering for cost",
        ]
    },
    "dea-c01": {
        "name": "AWS Data Engineer Associate (DEA-C01)",
        "domains": [
            "Data Ingestion and Transformation (34%): Kinesis, Glue ETL, DMS, DataSync, Step Functions, Lambda for data processing",
            "Data Store Management (26%): S3, Redshift, DynamoDB, RDS, Lake Formation, data lake design, partitioning, compression",
            "Data Operations and Support (22%): Glue Data Catalog, Athena, EMR, monitoring pipelines, troubleshooting data issues",
            "Data Security and Governance (18%): Lake Formation permissions, column/row-level security, encryption, data masking, compliance",
        ],
        "scenario_types": [
            "A company needs to process streaming data in real time",
            "A data engineer needs to build a cost-effective data lake",
            "A company wants to migrate its data warehouse to AWS",
            "An organization needs to implement data quality checks",
            "A team needs to orchestrate complex data pipelines",
            "A company needs to analyze large datasets with minimal cost",
            "A data engineer needs to implement near-real-time analytics",
            "A company needs to govern access to sensitive data in a lake",
        ]
    },
    "dva-c02": {
        "name": "AWS Developer Associate (DVA-C02)",
        "domains": [
            "Development with AWS Services (32%): Lambda, API Gateway, DynamoDB, S3, SQS, SNS, Kinesis, Step Functions, AppSync",
            "Security (26%): IAM roles/policies, Cognito, KMS, Secrets Manager, STS, signed URLs, resource-based policies",
            "Deployment (24%): CodeCommit, CodeBuild, CodeDeploy, CodePipeline, Elastic Beanstalk, SAM, CloudFormation",
            "Troubleshooting and Optimization (18%): X-Ray, CloudWatch, Lambda performance, DynamoDB optimization, caching strategies",
        ],
        "scenario_types": [
            "A developer needs to build a serverless REST API",
            "A company wants to implement CI/CD for its application",
            "A developer needs to secure API access for mobile users",
            "An application experiences performance issues under load",
            "A developer needs to implement asynchronous processing",
            "A company wants to store and rotate application secrets",
            "A developer needs to trace and debug a distributed application",
            "A team wants to implement blue/green deployment",
        ]
    },
}

# ─── Few-shot examples (real SAA-C03 style) ──────────────────────────────────

FEW_SHOT_EXAMPLES = """Here are 5 examples of the EXACT question style and quality required:

EXAMPLE 1:
{
  "cat": "resilient-arch",
  "q": "A company collects data for temperature, humidity, and atmospheric pressure in cities across multiple continents. The average volume of data that the company collects from each site daily is 500 GB. Each site has a high-speed Internet connection. The company wants to aggregate the data from all these global sites as quickly as possible in a single Amazon S3 bucket. The solution must minimize operational complexity. Which solution meets these requirements?",
  "options": [
    "Turn on S3 Transfer Acceleration on the destination S3 bucket. Use multipart uploads to directly upload site data to the destination S3 bucket.",
    "Upload the data from each site to an S3 bucket in the closest Region. Use S3 Cross-Region Replication to copy objects to the destination S3 bucket. Then remove the data from the origin S3 bucket.",
    "Schedule AWS Snowball Edge Storage Optimized device jobs daily to transfer data from each site to the closest Region. Use S3 Cross-Region Replication to copy objects to the destination S3 bucket.",
    "Upload the data from each site to an Amazon EC2 instance in the closest Region. Store the data in an Amazon Elastic Block Store (Amazon EBS) volume. At regular intervals, take an EBS snapshot and copy it to the Region that contains the destination S3 bucket. Restore the EBS volume in that Region."
  ],
  "answer": 0,
  "explain": "S3 Transfer Acceleration uses AWS edge locations to accelerate uploads from distributed global sites to a single S3 bucket. Combined with multipart uploads, this provides the fastest transfer speed while minimizing operational complexity — no additional infrastructure, replication jobs, or data movement steps are required. Cross-Region Replication adds unnecessary steps. Snowball Edge is for offline/low-bandwidth scenarios. EC2 with EBS snapshots adds significant operational overhead.",
  "keywords": ["S3 Transfer Acceleration", "multipart upload", "edge locations", "global data aggregation"]
}

EXAMPLE 2:
{
  "cat": "cost-optimized-arch",
  "q": "A company needs the ability to analyze the log files of its proprietary application. The logs are stored in JSON format in an Amazon S3 bucket. Queries will be simple and will run on-demand. A solutions architect needs to perform the analysis with minimal changes to the existing architecture. What should the solutions architect do to meet these requirements with the LEAST amount of operational overhead?",
  "options": [
    "Use Amazon Redshift to load all the content into one place and run the SQL queries as needed.",
    "Use Amazon CloudWatch Logs to store the logs. Run SQL queries as needed from the Amazon CloudWatch console.",
    "Use Amazon Athena directly with Amazon S3 to run the queries as needed.",
    "Use AWS Glue to catalog the logs. Use a transient Apache Spark cluster on Amazon EMR to run the SQL queries as needed."
  ],
  "answer": 2,
  "explain": "Amazon Athena is a serverless interactive query service that can directly query data in Amazon S3 using standard SQL. Since the logs are already in S3 in JSON format, no data movement is required. Athena requires no infrastructure to manage and charges only per query. This perfectly meets the requirements of minimal changes, on-demand queries, and least operational overhead. Redshift requires provisioning and data loading. CloudWatch Logs would require migrating existing logs. EMR adds significant management complexity.",
  "keywords": ["Amazon Athena", "serverless query", "S3 direct query", "operational overhead"]
}

EXAMPLE 3:
{
  "cat": "secure-arch",
  "q": "A company is hosting a web application on AWS using a single Amazon EC2 instance that stores user-uploaded documents in an Amazon EBS volume. For better scalability and availability, the company duplicated the architecture and created a second EC2 instance and EBS volume in another Availability Zone, placing both behind an Application Load Balancer. After completing this change, users reported that, each time they refreshed the website, they could see one subset of their documents or the other, but never all of the documents at the same time. What should a solutions architect propose to ensure users see all of their documents at once?",
  "options": [
    "Copy the data so both EBS volumes contain all the documents.",
    "Configure the Application Load Balancer to direct a user to the server with the documents.",
    "Copy the data from both EBS volumes to Amazon EFS. Modify the application to save new documents to Amazon EFS.",
    "Configure the Application Load Balancer to send the request to both servers. Return each document from the correct server."
  ],
  "answer": 2,
  "explain": "Amazon EFS (Elastic File System) is a managed NFS file system that can be simultaneously mounted by multiple EC2 instances across multiple Availability Zones. By migrating the document storage from EBS (which is AZ-specific) to EFS, all EC2 instances behind the ALB will share the same file system and see all documents. Copying data between EBS volumes doesn't solve the problem for new uploads. ALB sticky sessions or routing add complexity without solving the root cause.",
  "keywords": ["Amazon EFS", "shared file system", "multi-AZ storage", "EBS vs EFS"]
}

EXAMPLE 4:
{
  "cat": "resilient-arch",
  "q": "A company is building an ecommerce web application on AWS. The application sends information about new orders to an Amazon API Gateway REST API to process. The company wants to ensure that orders are processed in the order that they are received. Which solution will meet these requirements?",
  "options": [
    "Use an API Gateway integration to publish a message to an Amazon Simple Notification Service (Amazon SNS) topic when the application receives an order. Subscribe an AWS Lambda function to the topic to perform processing.",
    "Use an API Gateway integration to send a message to an Amazon Simple Queue Service (Amazon SQS) FIFO queue when the application receives an order. Configure the SQS FIFO queue to invoke an AWS Lambda function for processing.",
    "Use an API Gateway authorizer to block any requests while the application processes an order.",
    "Use an API Gateway integration to send a message to an Amazon Simple Queue Service (Amazon SQS) standard queue when the application receives an order. Configure the SQS standard queue to invoke an AWS Lambda function for processing."
  ],
  "answer": 1,
  "explain": "Amazon SQS FIFO (First-In-First-Out) queues guarantee that messages are processed in the exact order they are sent and are processed exactly once. This directly meets the requirement to process orders in the order they are received. Standard SQS queues provide best-effort ordering but do not guarantee order. SNS does not guarantee ordering. Blocking API Gateway requests would create a bottleneck and poor user experience.",
  "keywords": ["SQS FIFO", "message ordering", "exactly-once processing", "queue"]
}

EXAMPLE 5:
{
  "cat": "resilient-arch",
  "q": "A company is running an SMB file server in its data center. The file server stores large files that are accessed frequently for the first few days after the files are created. After 7 days the files are rarely accessed. The total data size is increasing and is close to the company's total storage capacity. A solutions architect must increase the company's available storage space without losing low-latency access to the most recently accessed files. The solutions architect must also provide file lifecycle management to avoid future storage issues. Which solution will meet these requirements?",
  "options": [
    "Use AWS DataSync to copy data that is older than 7 days from the SMB file server to AWS.",
    "Create an Amazon S3 File Gateway to extend the company's storage space. Create an S3 Lifecycle policy to transition the data to S3 Glacier Deep Archive after 7 days.",
    "Create an Amazon FSx for Windows File Server file system to extend the company's storage space.",
    "Install a utility on each user's computer to access Amazon S3. Create an S3 Lifecycle policy to transition the data to S3 Glacier Flexible Retrieval after 7 days."
  ],
  "answer": 1,
  "explain": "Amazon S3 File Gateway presents an SMB interface to on-premises clients while storing data durably in Amazon S3. It caches recently accessed files locally for low-latency access, solving the hot-file requirement. An S3 Lifecycle policy can automatically transition files to S3 Glacier Deep Archive after 7 days, providing automated lifecycle management and cost optimization. DataSync is for one-time or scheduled migration, not ongoing access. FSx for Windows doesn't provide lifecycle management to lower-cost tiers. Installing S3 utilities on user machines adds significant operational overhead.",
  "keywords": ["S3 File Gateway", "SMB", "lifecycle policy", "Glacier", "local cache"]
}"""

# ─── Domain category mappings ─────────────────────────────────────────────────

CERT_CATEGORIES = {
    "soa-c02": ["monitoring", "reliability", "deployment", "security", "networking", "cost-optimization"],
    "scs-c03": ["threat-detection", "logging-monitoring", "infrastructure-security", "iam", "data-protection", "governance"],
    "gai-c01": ["ai-fundamentals", "generative-ai", "foundation-models", "responsible-ai", "ai-security"],
    "dea-c01": ["data-ingestion", "data-store", "data-operations", "data-security"],
    "dva-c02": ["development", "security", "deployment", "troubleshooting"],
}

# ─── Generation ───────────────────────────────────────────────────────────────

def generate_batch(cert_id: str, cert_info: dict, categories: list, batch_size: int = 8, existing_questions: set = set()) -> list:
    """Generate a batch of questions for a cert."""

    domain_focus = random.choice(cert_info["domains"])
    cat = random.choice(categories)
    scenario_hint = random.choice(cert_info["scenario_types"])

    existing_sample = "\n".join(list(existing_questions)[:5]) if existing_questions else "None yet."

    prompt = f"""You are an expert AWS certification exam question writer. Generate {batch_size} unique, professional exam questions for the {cert_info["name"]} certification.

{FEW_SHOT_EXAMPLES}

REQUIREMENTS FOR EACH QUESTION:
1. Write a realistic business scenario (2-4 sentences) — a company has a specific problem to solve
2. Include specific constraints like "LEAST operational overhead", "minimize costs", "highest availability", "most secure", "fastest", etc.
3. Write exactly 4 answer options (A, B, C, D) — all must be plausible AWS solutions, only one is correct
4. Wrong answers must be real AWS services that COULD work but are suboptimal for the specific constraints
5. Explanation must be 3-5 sentences: explain why the correct answer is best AND why each wrong answer fails
6. Use real AWS service names exactly (e.g., "Amazon S3", "AWS Lambda", not just "S3" or "Lambda")

DOMAIN TO FOCUS ON: {domain_focus}
SCENARIO INSPIRATION: {scenario_hint}

AVOID generating questions similar to these (already exist):
{existing_sample}

Return ONLY a valid JSON array of {batch_size} objects. Each object must have exactly these fields:
- "cat": one of {categories} (string)
- "q": the question text (string)
- "options": array of exactly 4 strings (A, B, C, D options — no letter prefix)
- "answer": integer 0-3 (index of correct option)
- "explain": explanation string (complete sentences, ends with period)
- "keywords": array of 3-5 key AWS terms

Return ONLY the JSON array, no other text."""

    response = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=4000,
        messages=[{"role": "user", "content": prompt}]
    )

    text = response.content[0].text.strip()

    # Extract JSON array
    match = re.search(r'\[[\s\S]*\]', text)
    if not match:
        raise ValueError("No JSON array found in response")

    questions = json.loads(match.group())

    # Validate each question
    valid = []
    for q in questions:
        if not isinstance(q.get("options"), list) or len(q["options"]) != 4:
            continue
        if any(o.strip() == "" for o in q["options"]):
            continue
        if q.get("answer") not in [0, 1, 2, 3]:
            continue
        if not q.get("q", "").strip():
            continue
        if not q.get("explain", "").strip():
            continue
        # Check not duplicate
        if q["q"].strip() in existing_questions:
            continue
        valid.append(q)

    return valid


def generate_cert(cert_id: str):
    cert_info = CERTS[cert_id]
    categories = CERT_CATEGORIES[cert_id]
    fpath = DATA_DIR / f"{cert_id}.json"
    progress_path = DATA_DIR / f"{cert_id}.gen-progress.json"

    # Load existing questions
    existing = []
    if fpath.exists():
        with open(fpath) as f:
            existing = json.load(f)

    existing_questions = set(q["q"].strip() for q in existing)
    print(f"\n📄 {cert_info['name']}")
    print(f"   Current: {len(existing)} questions | Target: {TARGET_COUNT}")

    needed = TARGET_COUNT - len(existing)
    if needed <= 0:
        print(f"   ✅ Already at target!")
        return

    print(f"   Generating {needed} more questions...")

    generated = 0
    errors = 0
    batch_size = 8

    while len(existing) < TARGET_COUNT:
        remaining = TARGET_COUNT - len(existing)
        current_batch = min(batch_size, remaining + 2)  # slight overage to account for dupes

        try:
            batch = generate_batch(cert_id, cert_info, categories, current_batch, existing_questions)

            for q in batch:
                if len(existing) >= TARGET_COUNT:
                    break
                existing.append(q)
                existing_questions.add(q["q"].strip())
                generated += 1

            # Save progress after every batch
            with open(fpath, "w") as f:
                json.dump(existing, f, ensure_ascii=False, separators=(',', ':'))

            print(f"   [{len(existing)}/{TARGET_COUNT}] +{len(batch)} questions", end="\r")
            time.sleep(1)  # rate limiting

        except Exception as e:
            errors += 1
            print(f"\n   ⚠️  Batch failed: {e}")
            time.sleep(3)
            if errors > 5:
                print(f"   ❌ Too many errors, stopping.")
                break

    print(f"\n   ✅ Done — {len(existing)} questions saved ({generated} new, {errors} errors)")


def main():
    print("=== CertiPrepAI Question Generator ===")
    print(f"Model: claude-sonnet-4-6 | Target: {TARGET_COUNT}q per cert\n")

    certs_to_fix = [
        "soa-c02",   # 11 → 260
        "scs-c03",   # 153 → 260
        "gai-c01",   # 191 → 260
        "dea-c01",   # 214 → 260
        "dva-c02",   # 236 → 260
    ]

    for cert_id in certs_to_fix:
        generate_cert(cert_id)

    print("\n🎉 All done! Commit with:")
    print('  git add react-app/public/data/ && git commit -m "feat: regenerate question banks with professional scenario-based questions" && git push origin main')


if __name__ == "__main__":
    main()
