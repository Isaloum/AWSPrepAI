// ==================== SAMPLE QUESTIONS DATA ====================
// 10 curated questions (2 from each domain)

const sampleQuestions = [
  // Domain 1: Design Resilient Architectures (Questions 1-2)
  {
    id: 1,
    domain: "Design Resilient Architectures",
    question: "A company needs to ensure their web application remains available even if an entire AWS region fails. Which solution provides the HIGHEST level of availability?",
    options: [
      "Deploy the application in multiple Availability Zones within a single region",
      "Use Amazon Route 53 with health checks to route traffic between multiple AWS regions",
      "Deploy the application on EC2 instances with Auto Scaling",
      "Use Amazon CloudFront with an S3 bucket as the origin"
    ],
    correctAnswer: 1,
    explanation: "Route 53 with multi-region deployment provides the highest availability by protecting against entire region failures. While multi-AZ protects against AZ failures, it doesn't protect against region-level issues.",
    references: ["Route 53", "Multi-Region Architecture", "High Availability"]
  },
  {
    id: 2,
    domain: "Design Resilient Architectures",
    question: "An application stores critical data in Amazon S3. What is the MOST cost-effective way to protect against accidental deletion?",
    options: [
      "Enable S3 Versioning and configure lifecycle policies",
      "Create daily snapshots using AWS Backup",
      "Use S3 Cross-Region Replication",
      "Store data in S3 Glacier Deep Archive"
    ],
    correctAnswer: 0,
    explanation: "S3 Versioning allows you to preserve, retrieve, and restore every version of every object. It's the most cost-effective solution for protection against accidental deletion while keeping data in the same bucket.",
    references: ["S3 Versioning", "S3 Lifecycle Policies", "Data Protection"]
  },

  // Domain 2: Design High-Performance Architectures (Questions 3-4)
  {
    id: 3,
    domain: "Design High-Performance Architectures",
    question: "A media company needs to deliver video content to users worldwide with minimal latency. Which combination of services provides the BEST performance?",
    options: [
      "Amazon S3 + Amazon CloudFront",
      "Amazon EBS + EC2 instances in multiple regions",
      "Amazon EFS + AWS Global Accelerator",
      "Amazon S3 + AWS Direct Connect"
    ],
    correctAnswer: 0,
    explanation: "CloudFront is a content delivery network (CDN) that caches content at edge locations worldwide, providing the lowest latency for global users. S3 provides durable storage for the origin content.",
    references: ["CloudFront", "S3", "Content Delivery", "Edge Locations"]
  },
  {
    id: 4,
    domain: "Design High-Performance Architectures",
    question: "An application experiences unpredictable traffic spikes. Database queries are causing performance bottlenecks. What is the MOST effective solution?",
    options: [
      "Increase the RDS instance size",
      "Implement Amazon ElastiCache in front of the database",
      "Enable RDS Multi-AZ deployment",
      "Migrate to Amazon DynamoDB"
    ],
    correctAnswer: 1,
    explanation: "ElastiCache provides an in-memory caching layer that can dramatically reduce database load by caching frequently accessed queries, making it ideal for handling traffic spikes efficiently.",
    references: ["ElastiCache", "RDS", "Caching Strategies", "Performance Optimization"]
  },

  // Domain 3: Design Secure Applications (Questions 5-6)
  {
    id: 5,
    domain: "Design Secure Applications and Architectures",
    question: "A company wants to grant temporary access to an S3 bucket for external users without creating IAM users. What is the BEST approach?",
    options: [
      "Create IAM users with temporary passwords",
      "Generate S3 pre-signed URLs with expiration times",
      "Make the S3 bucket publicly accessible",
      "Use S3 bucket policies with IP restrictions"
    ],
    correctAnswer: 1,
    explanation: "Pre-signed URLs provide temporary, secure access to S3 objects without requiring IAM credentials. They automatically expire after a specified time, making them ideal for temporary external access.",
    references: ["S3 Pre-signed URLs", "Temporary Access", "IAM", "Security Best Practices"]
  },
  {
    id: 6,
    domain: "Design Secure Applications and Architectures",
    question: "An application running on EC2 needs to access AWS services. What is the MOST secure way to provide credentials?",
    options: [
      "Store AWS credentials in the application code",
      "Store credentials in environment variables on the EC2 instance",
      "Attach an IAM role to the EC2 instance",
      "Use AWS Systems Manager Parameter Store"
    ],
    correctAnswer: 2,
    explanation: "IAM roles provide temporary credentials that are automatically rotated by AWS. This eliminates the need to store long-term credentials and follows AWS security best practices.",
    references: ["IAM Roles", "EC2", "Security Best Practices", "Temporary Credentials"]
  },

  // Domain 4: Design Cost-Optimized Architectures (Questions 7-8)
  {
    id: 7,
    domain: "Design Cost-Optimized Architectures",
    question: "A company has a batch processing job that runs for 4 hours every night. What is the MOST cost-effective EC2 pricing model?",
    options: [
      "On-Demand Instances",
      "Reserved Instances (1-year term)",
      "Spot Instances",
      "Dedicated Hosts"
    ],
    correctAnswer: 2,
    explanation: "Spot Instances are ideal for fault-tolerant, flexible workloads like batch processing. They can provide up to 90% cost savings compared to On-Demand pricing. Since the job runs at night with flexibility, interruptions can be handled.",
    references: ["Spot Instances", "EC2 Pricing Models", "Cost Optimization", "Batch Processing"]
  },
  {
    id: 8,
    domain: "Design Cost-Optimized Architectures",
    question: "A company stores 500 TB of infrequently accessed data that must be retained for 7 years for compliance. What is the MOST cost-effective storage solution?",
    options: [
      "Amazon S3 Standard",
      "Amazon S3 Intelligent-Tiering",
      "Amazon S3 Glacier Deep Archive",
      "Amazon EFS Infrequent Access"
    ],
    correctAnswer: 2,
    explanation: "S3 Glacier Deep Archive provides the lowest-cost storage for long-term archival data that is rarely accessed. It's designed for data retention with retrieval times of 12-48 hours, perfect for compliance requirements.",
    references: ["S3 Glacier Deep Archive", "S3 Storage Classes", "Cost Optimization", "Archival Storage"]
  },

  // Domain 5: Operational Excellence (Questions 9-10)
  {
    id: 9,
    domain: "Operational Excellence",
    question: "A DevOps team needs to automate infrastructure provisioning and ensure consistency across environments. Which service is BEST suited for this?",
    options: [
      "AWS CloudFormation",
      "AWS Systems Manager",
      "AWS Config",
      "AWS OpsWorks"
    ],
    correctAnswer: 0,
    explanation: "CloudFormation provides infrastructure as code (IaC) capabilities, allowing you to define and provision AWS infrastructure using templates. This ensures consistency, repeatability, and version control across all environments.",
    references: ["CloudFormation", "Infrastructure as Code", "Automation", "DevOps"]
  },
  {
    id: 10,
    domain: "Operational Excellence",
    question: "A company wants to receive alerts when their monthly AWS bill exceeds $1,000. Which service should they use?",
    options: [
      "Amazon CloudWatch with custom metrics",
      "AWS Budgets with budget alerts",
      "AWS Cost Explorer with saved reports",
      "AWS Trusted Advisor"
    ],
    correctAnswer: 1,
    explanation: "AWS Budgets allows you to set custom cost and usage budgets with alert notifications via SNS when thresholds are exceeded. It's specifically designed for monitoring and alerting on AWS spending.",
    references: ["AWS Budgets", "Cost Management", "CloudWatch", "Billing Alerts"]
  }
];

// ==================== SAMPLE QUIZ STATE ====================
let currentSampleIndex = 0;
let sampleAnswers = [];
let sampleScore = 0;
let sampleAnswered = false;

// ==================== SAMPLE QUIZ FUNCTIONS ====================

/**
 * Initialize sample quiz
 */
function initSampleQuiz() {
  currentSampleIndex = 0;
  sampleAnswers = [];
  sampleScore = 0;
  sampleAnswered = false;

  const quizContainer = document.querySelector('.sample-quiz-container');
  const completion = document.getElementById('sample-completion');
  if (quizContainer) quizContainer.style.display = 'block';
  if (completion) completion.style.display = 'none';

  renderSampleQuestion();
}

/**
 * Render current sample question
 */
function renderSampleQuestion() {
  const question = sampleQuestions[currentSampleIndex];
  sampleAnswered = false;

  // Update progress
  const progress = ((currentSampleIndex + 1) / sampleQuestions.length) * 100;
  const progressEl = document.getElementById('sample-progress');
  if (progressEl) progressEl.style.width = progress + '%';

  // Update header
  const numEl = document.getElementById('sample-question-number');
  if (numEl) numEl.textContent = `Question ${currentSampleIndex + 1} of ${sampleQuestions.length}`;

  const badgeEl = document.getElementById('sample-domain-badge');
  if (badgeEl) badgeEl.textContent = question.domain;

  // Render question
  const contentHTML = `
    <div class="question-card">
      <h3 class="question-text">${question.question}</h3>
      <div class="options-list" id="sample-options">
        ${question.options.map((option, index) => `
          <div class="option-item" onclick="selectSampleOption(${index})">
            <input type="radio" name="sample-answer" id="sample-opt-${index}" value="${index}">
            <label for="sample-opt-${index}">
              <span class="option-letter">${String.fromCharCode(65 + index)}</span>
              <span class="option-text">${option}</span>
            </label>
          </div>
        `).join('')}
      </div>
      <div id="sample-explanation" class="explanation-box" style="display: none;"></div>
    </div>
  `;

  const contentEl = document.getElementById('sample-question-content');
  if (contentEl) contentEl.innerHTML = contentHTML;

  // Update buttons
  const prevBtn = document.getElementById('sample-prev-btn');
  const submitBtn = document.getElementById('sample-submit-btn');
  const nextBtn = document.getElementById('sample-next-btn');
  if (prevBtn) prevBtn.disabled = currentSampleIndex === 0;
  if (submitBtn) submitBtn.style.display = 'inline-block';
  if (nextBtn) nextBtn.style.display = 'none';
}

/**
 * Select sample option
 */
function selectSampleOption(index) {
  if (sampleAnswered) return;

  document.querySelectorAll('#sample-options .option-item').forEach(item => {
    item.classList.remove('selected');
  });

  const items = document.querySelectorAll('#sample-options .option-item');
  if (items[index]) items[index].classList.add('selected');
  const radio = document.getElementById(`sample-opt-${index}`);
  if (radio) radio.checked = true;

  // Clear any error message
  const errMsg = document.getElementById('sample-error-msg');
  if (errMsg) errMsg.classList.remove('visible');
}

/**
 * Submit sample answer
 */
function submitSampleAnswer() {
  const selected = document.querySelector('input[name="sample-answer"]:checked');

  if (!selected) {
    const errMsg = document.getElementById('sample-error-msg');
    if (errMsg) errMsg.classList.add('visible');
    return;
  }

  const errMsg = document.getElementById('sample-error-msg');
  if (errMsg) errMsg.classList.remove('visible');

  const question = sampleQuestions[currentSampleIndex];
  const userAnswer = parseInt(selected.value);
  const isCorrect = userAnswer === question.correctAnswer;

  sampleAnswered = true;

  sampleAnswers[currentSampleIndex] = { userAnswer, isCorrect };

  if (isCorrect) sampleScore++;

  showSampleFeedback(userAnswer, question);

  const submitBtn = document.getElementById('sample-submit-btn');
  const nextBtn = document.getElementById('sample-next-btn');
  if (submitBtn) submitBtn.style.display = 'none';
  if (nextBtn) nextBtn.style.display = 'inline-block';
}

/**
 * Show sample feedback
 */
function showSampleFeedback(userAnswer, question) {
  const options = document.querySelectorAll('#sample-options .option-item');

  options.forEach((option, index) => {
    if (index === question.correctAnswer) {
      option.classList.add('correct');
    } else if (index === userAnswer) {
      option.classList.add('incorrect');
    }
    option.style.pointerEvents = 'none';
  });

  const explanationBox = document.getElementById('sample-explanation');
  if (explanationBox) {
    explanationBox.innerHTML = `
      <div class="explanation-header">
        <strong>${userAnswer === question.correctAnswer ? '✅ Correct!' : '❌ Incorrect'}</strong>
      </div>
      <p>${question.explanation}</p>
      <div class="references">
        <strong>Related Topics:</strong> ${question.references.join(', ')}
      </div>
    `;
    explanationBox.style.display = 'block';
  }
}

/**
 * Next sample question
 */
function nextSampleQuestion() {
  if (currentSampleIndex < sampleQuestions.length - 1) {
    currentSampleIndex++;
    renderSampleQuestion();
  } else {
    showSampleCompletion();
  }
}

/**
 * Previous sample question
 */
function previousSampleQuestion() {
  if (currentSampleIndex > 0) {
    currentSampleIndex--;
    renderSampleQuestion();

    // If already answered, restore and show feedback
    if (sampleAnswers[currentSampleIndex]) {
      const answer = sampleAnswers[currentSampleIndex];
      const question = sampleQuestions[currentSampleIndex];

      const radio = document.getElementById(`sample-opt-${answer.userAnswer}`);
      if (radio) radio.checked = true;
      selectSampleOption(answer.userAnswer);

      sampleAnswered = true;
      showSampleFeedback(answer.userAnswer, question);

      const submitBtn = document.getElementById('sample-submit-btn');
      const nextBtn = document.getElementById('sample-next-btn');
      if (submitBtn) submitBtn.style.display = 'none';
      if (nextBtn) nextBtn.style.display = 'inline-block';
    }
  }
}

/**
 * Show completion screen
 */
function showSampleCompletion() {
  const quizContainer = document.querySelector('.sample-quiz-container');
  const completion = document.getElementById('sample-completion');
  if (quizContainer) quizContainer.style.display = 'none';
  if (completion) completion.style.display = 'block';

  const scoreText = document.getElementById('sample-score-text');
  if (scoreText) scoreText.textContent = `${sampleScore}/${sampleQuestions.length}`;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
}

/**
 * Restart sample quiz
 */
function restartSampleQuiz() {
  initSampleQuiz();
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
}
