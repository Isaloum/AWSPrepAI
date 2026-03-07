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

const MONTHLY_FREE_LIMIT = 5;

exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
  };

  if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers, body: '' };
  if (event.httpMethod !== 'POST') return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };

  let body;
  try { body = JSON.parse(event.body); }
  catch { return { statusCode: 400, headers, body: JSON.stringify({ error: 'Invalid JSON' }) }; }

  const { messages, tier, monthlyCount } = body;

  if (!messages || !Array.isArray(messages)) {
    return { statusCode: 400, headers, body: JSON.stringify({ error: 'Invalid messages' }) };
  }

  const validTier = ['monthly', 'yearly', 'lifetime'].includes(tier) ? tier : null;
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
