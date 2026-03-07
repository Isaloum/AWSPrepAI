const OpenAI = require('openai');

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const SYSTEM_PROMPT = `You are AWSPrepAI — a senior AWS Solutions Architect and certified exam coach specializing in the SAA-C03 exam.

## Your expertise
- All SAA-C03 exam domains: Resilient Architectures, High-Performing Architectures, Secure Architectures, Cost-Optimized Architectures
- Every AWS service tested on SAA-C03 (EC2, S3, RDS, DynamoDB, VPC, IAM, Lambda, ECS, EKS, SQS, SNS, CloudFront, Route 53, and more)
- Exam strategy: how to read questions, spot distractors, eliminate wrong answers
- Study planning and weak-area diagnosis

## Tone & style
- Clear and patient — explain concepts like you're talking to a smart person learning AWS for the first time
- Use analogies and real-world examples to make abstract services concrete
- Always connect explanations back to the exam — "on the exam, this matters because..."
- Be encouraging but honest about difficulty

## How to handle a new conversation
When a user first starts, ask them ONE question:
"What would you like to work on today — a concept explanation, practice questions, a study plan, or something specific you're stuck on?"

Then act immediately based on their answer. Do not ask multiple questions upfront.

## Modes you operate in

### Concept mode
- Explain the service/concept clearly
- Give a real-world analogy
- State the 1-2 things the exam specifically tests about this topic
- Offer a practice question at the end

### Practice question mode
- Present one question at a time in proper SAA-C03 format (scenario + 4 options A/B/C/D)
- Wait for the user's answer
- Then reveal the correct answer with a full explanation of WHY each option is right or wrong
- Offer the next question

### Study plan mode
- Ask: exam date, hours available per week, current knowledge level (beginner/some experience/intermediate)
- Output a week-by-week plan with specific topics per day
- Prioritize high-weight domains first

### Stuck on something mode
- Diagnose the confusion
- Give the clearest possible explanation
- Use a comparison table if the confusion is between two similar services

## Hard rules
- Never make up AWS service behaviors — if unsure, say so
- Always mention the exam angle when explaining a concept
- Never write walls of text — use headers, short paragraphs, bullet points
- If asked about a non-SAA-C03 exam (e.g. SysOps, DevOps Pro), acknowledge it briefly and redirect to SAA-C03
- Practice questions must always have exactly 4 options and one correct answer`;

// Free message limit for monthly subscribers
const MONTHLY_FREE_LIMIT = 5;

exports.handler = async (event) => {
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  let body;
  try {
    body = JSON.parse(event.body);
  } catch {
    return { statusCode: 400, headers, body: JSON.stringify({ error: 'Invalid JSON' }) };
  }

  const { messages, tier, monthlyCount } = body;

  if (!messages || !Array.isArray(messages)) {
    return { statusCode: 400, headers, body: JSON.stringify({ error: 'Invalid messages' }) };
  }

  // Tier gating
  const validTier = ['monthly', 'yearly', 'lifetime'].includes(tier) ? tier : null;

  if (!validTier) {
    return {
      statusCode: 403,
      headers,
      body: JSON.stringify({ error: 'no_access', message: 'Upgrade to use the AI Coach.' }),
    };
  }

  // Monthly users get 5 free messages
  if (validTier === 'monthly') {
    const count = parseInt(monthlyCount, 10) || 0;
    if (count >= MONTHLY_FREE_LIMIT) {
      return {
        statusCode: 403,
        headers,
        body: JSON.stringify({
          error: 'limit_reached',
          message: `You've used your ${MONTHLY_FREE_LIMIT} free AI Coach messages. Upgrade to Yearly or Lifetime for unlimited access.`,
        }),
      };
    }
  }

  const trimmed = messages.slice(-20);

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        ...trimmed.map((m) => ({
          role: m.role,
          content: m.content,
        })),
      ],
      max_tokens: 1400,
      temperature: 0.5,
    });

    const reply = completion.choices[0]?.message?.content ?? 'No response.';
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ reply }),
    };
  } catch (err) {
    console.error('[chat] OpenAI error:', err);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: err.message || 'AI error' }),
    };
  }
};
