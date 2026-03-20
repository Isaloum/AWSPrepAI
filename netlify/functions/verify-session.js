/**
 * verify-session.js
 * Called after Stripe Checkout redirect to confirm payment and issue a signed JWT.
 * SECURITY: verifies session directly with Stripe API — cannot be faked client-side.
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
    const { sessionId } = JSON.parse(event.body || '{}');

    if (!sessionId || typeof sessionId !== 'string' || !/^cs_/.test(sessionId)) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: 'Invalid session ID' }) };
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId);
    const isTrial = session.payment_status === 'no_payment_required';

    if (session.payment_status !== 'paid' && !isTrial) {
      return { statusCode: 402, headers, body: JSON.stringify({ verified: false, error: 'Payment not completed' }) };
    }

    if (session.metadata?.product !== 'awsprepai_premium') {
      return { statusCode: 400, headers, body: JSON.stringify({ verified: false, error: 'Invalid product' }) };
    }

    const tier = session.metadata?.tier || 'lifetime';
    const piId = session.payment_intent || session.subscription || null;

    const now = Math.floor(Date.now() / 1000);
    let exp = null;
    if (isTrial)               exp = now + 3   * 86400;
    else if (tier === 'monthly') exp = now + 32  * 86400;
    else if (tier === 'yearly')  exp = now + 366 * 86400;

    const accessToken = issueJWT({ tier, pi: piId, ...(exp ? { exp } : {}) });

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ verified: true, tier, accessToken }),
    };

  } catch (err) {
    console.error('[verify-session] Error:', err.message);
    return { statusCode: 500, headers, body: JSON.stringify({ error: err.message }) };
  }
};
