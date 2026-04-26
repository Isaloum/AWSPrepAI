/**
 * checkout/index.js
 * AWS Lambda — creates a Stripe Checkout session and returns the redirect URL.
 */
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const PRICE_IDS = {
  monthly:  process.env.STRIPE_PRICE_MONTHLY  || 'price_1TB1YCE9neqrFM5LDbyzVSnv',
  bundle:   process.env.STRIPE_PRICE_BUNDLE   || 'price_BUNDLE_REPLACE_ME', // set STRIPE_PRICE_BUNDLE Lambda env var
  yearly:   process.env.STRIPE_PRICE_YEARLY   || 'price_1TED8EE9neqrFM5LCIL9P0Yp',
  lifetime: process.env.STRIPE_PRICE_LIFETIME || 'price_1TED9ME9neqrFM5LeKAAEWTO',
};

const PLAN_MODES = {
  monthly:  'subscription',
  bundle:   'subscription',
  yearly:   'subscription',
  lifetime: 'payment',
};

const ALLOWED_ORIGINS = [
  'https://certiprepai.com',
  'https://www.certiprepai.com',
  'https://main.d2pm3jfcsesli7.amplifyapp.com',
];

function corsHeaders(origin) {
  const allowed = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    'Access-Control-Allow-Origin':  allowed,
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json',
  };
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

exports.handler = async (event) => {
  const origin = event.headers?.origin || event.headers?.Origin || '';
  const CORS   = corsHeaders(origin);

  const method = event.httpMethod || event.requestContext?.http?.method || '';

  if (method === 'OPTIONS') return { statusCode: 200, headers: CORS, body: '' };
  if (method !== 'POST') {
    return { statusCode: 405, headers: CORS, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  try {
    const { plan, email } = JSON.parse(event.body || '{}');

    if (!plan || !PRICE_IDS[plan]) {
      return { statusCode: 400, headers: CORS, body: JSON.stringify({ error: 'Invalid plan' }) };
    }

    if (email && !EMAIL_RE.test(email)) {
      return { statusCode: 400, headers: CORS, body: JSON.stringify({ error: 'Invalid email format' }) };
    }

    const mode = PLAN_MODES[plan];
    const appUrl = process.env.APP_URL || 'https://certiprepai.com';

    const sessionParams = {
      payment_method_types: ['card'],
      line_items: [{ price: PRICE_IDS[plan], quantity: 1 }],
      mode,
      metadata: { product: 'awsprepai_premium', tier: plan },
      // Bundle users go to dashboard to pick their 3 certs immediately after payment
      success_url: plan === 'bundle'
        ? `${appUrl}/dashboard?upgrade=bundle`
        : `${appUrl}/certifications?upgrade=success`,
      cancel_url: `${appUrl}/pricing?cancelled=1`,
    };

    // NOTE: intentionally NOT passing customer_email — passing the email
    // causes Stripe to detect Link accounts and show the Link auth popup.

    if (mode === 'subscription') {
      sessionParams.subscription_data = { trial_period_days: 3 };
    }

    const session = await stripe.checkout.sessions.create(sessionParams);

    return {
      statusCode: 200,
      headers: CORS,
      body: JSON.stringify({ url: session.url }),
    };
  } catch (err) {
    console.error('[checkout]', err);
    return { statusCode: 500, headers: CORS, body: JSON.stringify({ error: 'Internal server error' }) };
  }
};
