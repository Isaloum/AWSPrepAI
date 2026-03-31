const SYSTEM_PROMPT = `You are Professor Cloud — a veteran AWS architect with 15+ years of hands-on experience and a passion for teaching. You have personally passed all 12 AWS certifications and have helped hundreds of students do the same. You speak with the calm authority of someone who has seen it all, but you never talk down to students — you remember what it felt like to be confused.

Your personality:
- Warm, wise, and direct — like a great professor who genuinely wants you to succeed
- You use stories and real-world analogies because you know dry theory doesn't stick
- You celebrate progress and normalize struggle ("This trips everyone up at first — here's how I think about it...")
- You're honest: if something is tricky or commonly misunderstood on the exam, you say so upfront
- You never pad responses with fluff — every sentence earns its place
- You occasionally share a short "war story" from real AWS projects to make a concept memorable

## Certifications you coach
- CLF-C02: Cloud Practitioner (foundational cloud concepts, billing, support)
- SAA-C03: Solutions Architect Associate (VPC, EC2, S3, RDS, IAM, Lambda, HA/DR)
- DVA-C02: Developer Associate (Lambda, API Gateway, DynamoDB, CodePipeline, X-Ray, SQS/SNS)
- SOA-C02: SysOps Administrator (monitoring, patching, cost, Auto Scaling, CloudWatch, Systems Manager)
- SAP-C02: Solutions Architect Professional (complex multi-account, migrations, enterprise patterns)
- DOP-C02: DevOps Engineer Professional (CI/CD, IaC, incident response, CloudFormation, CodeDeploy)
- ANS-C01: Advanced Networking Specialty (VPC deep-dive, BGP, Direct Connect, Transit Gateway, Route 53)
- SCS-C02: Security Specialty (IAM, GuardDuty, Macie, KMS, Security Hub, CloudTrail, WAF)
- DEA-C01: Data Engineer Associate (Glue, Athena, Kinesis, Redshift, Lake Formation, EMR)
- MLA-C01: Machine Learning Engineer Associate (SageMaker, model deployment, MLOps, inference)
- AIF-C01: AI Practitioner (AI/ML fundamentals, responsible AI, AWS AI services overview)
- GAI-C01: Generative AI with Bedrock (Bedrock, RAG, prompt engineering, agents, guardrails)

## How you teach

### Explaining a concept
- Open with a real-world analogy that makes it click instantly
- Then layer in the technical detail
- Always close with: "On the exam, they'll test this by..."
- Optionally offer a practice question to lock in the learning

### Practice questions
- Write scenario-based questions the way AWS actually writes them (situational, tricky distractors)
- Present 4 options (A/B/C/D), then wait for the student's answer
- After they answer: full breakdown — why the right answer is right, and exactly why each wrong answer is wrong
- If they got it wrong, diagnose the misconception with kindness: "You're not alone — most people mix these two up because..."

### Study plans
- Ask: which cert, exam date, hours per week, current experience
- Build a realistic week-by-week plan focused on the highest-weight exam domains
- Be honest about what's hard and what can be skimmed

### Cert guidance
- When asked "which cert next", ask about their role, goals, and current certs
- Give a clear recommendation with reasoning, not a vague "it depends"

## Non-negotiable rules
- Never invent AWS behaviors — if genuinely unsure, say so and point to the right direction
- Always name the exam domain or topic being tested
- Short paragraphs, headers, bullets — never walls of text
- Practice questions: exactly 4 options, exactly one correct answer
- Stay focused — wisdom is knowing what NOT to say`;

const crypto = require('crypto');

const MONTHLY_FREE_LIMIT = 5;

// ── Rate limiting (in-memory, resets on cold start) ──────────────────────────
const _rl = new Map();
function isRateLimited(ip) {
  const now = Date.now();
  const window = 60 * 60 * 1000; // 1 hour
  const limit = 60; // max requests per IP per hour
  const entry = _rl.get(ip) || { count: 0, reset: now + window };
  if (now > entry.reset) { entry.count = 0; entry.reset = now + window; }
  entry.count++;
  _rl.set(ip, entry);
  return entry.count > limit;
}

// ── Token verification ────────────────────────────────────────────────────────
function verifyToken(token) {
  const secret = process.env.ACCESS_TOKEN_SECRET;
  if (!secret || !token) return null;
  try {
    const dot = token.lastIndexOf('.');
    if (dot === -1) return null;
    const payload = token.substring(0, dot);
    const sig = token.substring(dot + 1);
    if (sig.length !== 64) return null; // expect 32-byte hex
    const expected = crypto.createHmac('sha256', secret).update(payload).digest('hex');
    if (!crypto.timingSafeEqual(Buffer.from(sig, 'hex'), Buffer.from(expected, 'hex'))) return null;
    const data = JSON.parse(Buffer.from(payload, 'base64').toString());
    // Token must have a valid tier
    if (!['monthly', 'bundle3', 'yearly', 'lifetime'].includes(data.tier)) return null;
    // Token must be tied to a real Stripe PaymentIntent (pi_ prefix)
    if (!data.pi || !/^pi_/.test(data.pi)) return null;
    // Check expiry
    if (data.expiry && new Date(data.expiry) < new Date()) return null;
    return data; // { tier, pi, expiry, iat }
  } catch { return null; }
}

exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': 'https://awsprepai.netlify.app',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
  };

  if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers, body: '' };
  if (event.httpMethod !== 'POST') return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };

  // Rate limit by IP
  const ip = event.headers?.['x-forwarded-for']?.split(',')[0]?.trim() || 'unknown';
  if (isRateLimited(ip)) {
    return { statusCode: 429, headers, body: JSON.stringify({ error: 'Too many requests. Try again later.' }) };
  }

  let body;
  try { body = JSON.parse(event.body); }
  catch { return { statusCode: 400, headers, body: JSON.stringify({ error: 'Invalid JSON' }) }; }

  const { messages, accessToken, monthlyCount } = body;

  if (!messages || !Array.isArray(messages)) {
    return { statusCode: 400, headers, body: JSON.stringify({ error: 'Invalid messages' }) };
  }

  // ── Verify signed token (server-side auth) ──────────────────────────────────
  const tokenData = verifyToken(accessToken);

  // Fallback: if no valid token but ACCESS_TOKEN_SECRET not set yet, use legacy tier field
  const SECRET_CONFIGURED = !!process.env.ACCESS_TOKEN_SECRET;
  let validTier = null;

  if (tokenData) {
    validTier = tokenData.tier;
  } else if (!SECRET_CONFIGURED) {
    // Legacy mode — secret not configured yet, trust client (temporary)
    const { tier } = body;
    validTier = ['monthly', 'bundle3', 'yearly', 'lifetime'].includes(tier) ? tier : null;
  }

  if (!validTier) {
    return { statusCode: 403, headers, body: JSON.stringify({ error: 'no_access' }) };
  }

  // AI Coach is Lifetime-only
  if (validTier !== 'lifetime') {
    return { statusCode: 403, headers, body: JSON.stringify({ error: 'lifetime_required' }) };
  }

  const apiKey = process.env.OPENAI_API_KEY_Chat_Bot;
  if (!apiKey) return { statusCode: 500, headers, body: JSON.stringify({ error: 'Missing OPENAI_API_KEY_Chat_Bot' }) };

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          ...messages.slice(-20).map((m) => ({ role: m.role, content: m.content })),
        ],
        max_tokens: 1400,
        temperature: 0.5,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('[chat] OpenAI error:', JSON.stringify(data));
      return { statusCode: 500, headers, body: JSON.stringify({ error: data.error?.message || 'OpenAI error' }) };
    }

    const reply = data.choices?.[0]?.message?.content ?? 'No response.';
    return { statusCode: 200, headers, body: JSON.stringify({ reply }) };

  } catch (err) {
    console.error('[chat] fetch error:', err.message);
    return { statusCode: 500, headers, body: JSON.stringify({ error: err.message }) };
  }
};
