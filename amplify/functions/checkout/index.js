/**
 * checkout/index.js
 * AWS Lambda — creates a Stripe Checkout session and returns the redirect URL.
 * Ported from the original Netlify function.
 */
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const PRICE_IDS = {
  monthly:  process.env.STRIPE_PRICE_MONTHLY  || 'price_1TB1YCE9neqrFM5LDbyzVSnv',
  yearly:   process.env.STRIPE_PRICE_YEARLY   || 'price_1TED8EE9neqrFM5LCIL9P0Yp',
  lifetime: process.env.STRIPE_PRICE_LIFETIME || 'price_1TED9ME9neqrFM5LeKAAEWTO',
};

const PLAN_MODES = {
  monthly:  'subscription',
  yearly:   'subscription',
  lifetime: 'payment',
};

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Content-Type': 'application/json',
};

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers: CORS, body: '' };
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers: CORS, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  try {
    const { plan, email } = JSON.parse(event.body || '{}');

    if (!plan || !PRICE_IDS[plan]) {
      return { statusCode: 400, headers: CORS, body: JSON.stringify({ error: 'Invalid plan' }) };
    }

    const mode = PLAN_MODES[plan];
    const appUrl = process.env.APP_URL || 'https://main.d2pm3jfcsesli7.amplifyapp.com';

    const sessionParams = {
      payment_method_types: ['card'],
      line_items: [{ price: PRICE_IDS[plan], quantity: 1 }],
      mode,
      metadata: { product: 'awsprepai_premium', tier: plan },
      success_url: `${appUrl}/certifications?upgrade=success`,
      cancel_url: `${appUrl}/pricing?cancelled=1`,
    };

    if (email) sessionParams.customer_email = email;

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
    console.error('[checkout]', err.message);
    return { statusCode: 500, headers: CORS, body: JSON.stringify({ error: err.message }) };
  }
};
