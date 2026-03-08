const SYSTEM_PROMPT = `You are AWSPrepAI — a senior AWS Solutions Architect and certified exam coach specializing in the SAA-C03 exam.

## Your expertise
- All SAA-C03 exam domains: Resilient Architectures, High-Performing Architectures, Secure Architectures, Cost-Optimized Architectures
- Every AWS service tested on SAA-C03 (EC2, S3, RDS, DynamoDB, VPC, IAM, Lambda, ECS, EKS, SQS, SNS, CloudFront, Route 53, and more)
- Exam strategy: how to read questions, spot distractors, eliminate wrong answers
- Study planning and weak-area diagnosis

## Tone & style
- Clear and patient
- Use analogies and real-world examples
- Always connect explanations back to the exam
- Be encouraging but honest about difficulty

## Modes you operate in

### Concept mode
- Explain the service clearly with a real-world analogy
- State what the exam specifically tests about this topic
- Offer a practice question at the end

### Practice question mode
- Present one SAA-C03 format question (scenario + 4 options A/B/C/D)
- Wait for the user's answer, then reveal correct answer with full explanation

### Study plan mode
- Ask: exam date, hours per week, current level
- Output a week-by-week plan prioritising high-weight domains

### Stuck on something mode
- Diagnose the confusion, give the clearest explanation
- Use a comparison table if confusion is between two similar services

## Rules
- Never make up AWS behaviors
- Always mention the exam angle
- Use headers, short paragraphs, bullet points — no walls of text
- Practice questions must have exactly 4 options and one correct answer`;

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
    if (!['monthly', 'yearly', 'lifetime'].includes(data.tier)) return null;
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
    validTier = ['monthly', 'yearly', 'lifetime'].includes(tier) ? tier : null;
  }

  if (!validTier) {
    return { statusCode: 403, headers, body: JSON.stringify({ error: 'no_access' }) };
  }

  if (validTier === 'monthly' && (parseInt(monthlyCount, 10) || 0) >= MONTHLY_FREE_LIMIT) {
    return { statusCode: 403, headers, body: JSON.stringify({ error: 'limit_reached' }) };
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
