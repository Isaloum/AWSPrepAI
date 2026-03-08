const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const crypto = require('crypto');

function issueToken(tier, piId, expiry) {
  const secret = process.env.ACCESS_TOKEN_SECRET;
  if (!secret) return null;
  const payload = Buffer.from(JSON.stringify({
    tier,
    pi: piId || null,
    expiry: expiry || null,
    iat: Date.now(),
  })).toString('base64');
  const sig = crypto.createHmac('sha256', secret).update(payload).digest('hex');
  return `${payload}.${sig}`;
}

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  try {
    const { sessionId } = JSON.parse(event.body);

    if (!sessionId || typeof sessionId !== 'string' || !/^cs_/.test(sessionId)) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Invalid session ID' }) };
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== 'paid') {
      return { statusCode: 402, headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ verified: false, error: 'Payment not completed' }) };
    }

    if (session.metadata?.product !== 'awsprepai_premium') {
      return { statusCode: 400, headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ verified: false, error: 'Invalid product' }) };
    }

    const tier = session.metadata?.tier || 'lifetime';
    const piId = session.payment_intent || null;

    // 24-hour expiry for monthly/yearly — auto-refreshed via pi_
    let expiry = null;
    if (tier === 'monthly' || tier === 'yearly') {
      const d = new Date(); d.setHours(d.getHours() + 24); expiry = d.toISOString();
    }

    const accessToken = issueToken(tier, piId, expiry);

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ verified: true, tier, paymentIntentId: piId, accessToken }),
    };
  } catch (error) {
    console.error('Stripe verification error:', error);
    return { statusCode: 500, body: JSON.stringify({ error: error.message || 'Unable to verify payment.' }) };
  }
};
