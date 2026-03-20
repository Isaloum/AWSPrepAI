/**
 * create-checkout-session.js
 * Creates a Stripe Checkout session and returns the redirect URL.
 */
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

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
    const { priceId, mode = 'payment', quantity = 1, tier = 'lifetime' } = JSON.parse(event.body || '{}');

    if (!priceId) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: 'Missing priceId' }) };
    }

    const sessionParams = {
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity }],
      mode,
      metadata: { product: 'awsprepai_premium', tier },
      success_url: `${process.env.SUCCESS_URL}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: process.env.CANCEL_URL,
    };

    if (mode === 'subscription') {
      sessionParams.subscription_data = { trial_period_days: 3 };
      sessionParams.payment_method_collection = 'always';
    }

    const session = await stripe.checkout.sessions.create(sessionParams);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ id: session.id, url: session.url }),
    };

  } catch (err) {
    console.error('[create-checkout] Error:', err.message);
    return { statusCode: 500, headers, body: JSON.stringify({ error: err.message }) };
  }
};
