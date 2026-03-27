/**
 * restore-access.js
 * Re-issues a signed JWT when a paying user clears their browser or uses a new device.
 * Verifies the original payment_intent with Stripe before issuing.
 */
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { issueJWT } = require('./_jwt');

const ALLOWED_ORIGINS = [
  'https://isaloum.github.io',
  'https://awsprepai.netlify.app',
];

function corsHeaders(origin) {
  const allowed = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    'Access-Control-Allow-Origin': allowed,
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json',
  };
}

exports.handler = async (event) => {
  const origin = event.headers.origin || event.headers.Origin || '';
  const headers = corsHeaders(origin);

  if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers, body: '' };
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  try {
    const { paymentIntentId } = JSON.parse(event.body || '{}');

    if (!paymentIntentId || !/^pi_/.test(paymentIntentId)) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: 'Invalid payment intent ID' }) };
    }

    const pi = await stripe.paymentIntents.retrieve(paymentIntentId, {
      expand: ['latest_charge.dispute'],
    });

    if (pi.status !== 'succeeded') {
      return { statusCode: 402, headers, body: JSON.stringify({ error: 'Payment not completed' }) };
    }

    // Block chargebacks
    if (pi.latest_charge?.dispute) {
      console.warn(`[restore] Blocked disputed payment — pi: ${paymentIntentId}`);
      return { statusCode: 403, headers, body: JSON.stringify({ error: 'Payment disputed. Contact support.' }) };
    }

    const tier = pi.metadata?.tier || 'lifetime';
    const now  = Math.floor(Date.now() / 1000);

    // Subscriptions get a rolling 24h window; lifetime is permanent
    let exp = null;
    if (tier === 'monthly' || tier === 'bundle3' || tier === 'yearly') {
      exp = now + 86400; // 24-hour rolling refresh
    }

    const accessToken = issueJWT({ tier, pi: paymentIntentId, ...(exp ? { exp } : {}) });

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ verified: true, tier, accessToken }),
    };

  } catch (err) {
    console.error('[restore-access] Error:', err.message);
    return { statusCode: 500, headers, body: JSON.stringify({ error: err.message || 'Restore failed' }) };
  }
};
