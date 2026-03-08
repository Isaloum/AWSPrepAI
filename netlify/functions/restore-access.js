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
  const headers = {
    'Access-Control-Allow-Origin': 'https://awsprepai.netlify.app',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
  };

  if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers, body: '' };
  if (event.httpMethod !== 'POST') return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };

  try {
    const { paymentIntentId } = JSON.parse(event.body);

    if (!paymentIntentId || !/^pi_/.test(paymentIntentId)) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: 'Invalid payment intent ID' }) };
    }

    const pi = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (pi.status !== 'succeeded') {
      return { statusCode: 402, headers, body: JSON.stringify({ error: 'Payment not completed' }) };
    }

    const tier = pi.metadata?.tier || 'lifetime';

    let expiry = null;
    if (tier === 'monthly' || tier === 'yearly') {
      const d = new Date(); d.setHours(d.getHours() + 24); expiry = d.toISOString();
    }

    const accessToken = issueToken(tier, paymentIntentId, expiry);

    return { statusCode: 200, headers, body: JSON.stringify({ verified: true, tier, accessToken }) };

  } catch (err) {
    console.error('Restore access error:', err);
    return { statusCode: 500, headers, body: JSON.stringify({ error: err.message || 'Restore failed' }) };
  }
};
