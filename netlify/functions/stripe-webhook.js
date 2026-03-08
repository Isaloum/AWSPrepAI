/**
 * Stripe Webhook Handler
 * Stripe calls this directly when a payment succeeds — no client involvement.
 * This is the most secure way to grant access: server-to-server only.
 *
 * Required env vars:
 *   STRIPE_SECRET_KEY
 *   STRIPE_WEBHOOK_SECRET   (from Netlify → your webhook signing secret in Stripe dashboard)
 *   ACCESS_TOKEN_SECRET
 */

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const crypto = require('crypto');

function issueToken(tier, piId, expiry) {
  const secret = process.env.ACCESS_TOKEN_SECRET;
  if (!secret) return null;
  const payload = Buffer.from(JSON.stringify({
    tier,
    pi: piId,
    expiry: expiry || null,
    iat: Date.now(),
  })).toString('base64');
  const sig = crypto.createHmac('sha256', secret).update(payload).digest('hex');
  return `${payload}.${sig}`;
}

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method not allowed' };
  }

  const sig = event.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!sig || !webhookSecret) {
    console.error('[webhook] Missing signature or webhook secret');
    return { statusCode: 400, body: 'Missing webhook configuration' };
  }

  let stripeEvent;
  try {
    // Stripe verifies the payload hasn't been tampered with
    stripeEvent = stripe.webhooks.constructEvent(event.body, sig, webhookSecret);
  } catch (err) {
    console.error('[webhook] Signature verification failed:', err.message);
    return { statusCode: 400, body: `Webhook signature verification failed: ${err.message}` };
  }

  // Only handle successful payments
  if (stripeEvent.type !== 'checkout.session.completed') {
    return { statusCode: 200, body: JSON.stringify({ received: true }) };
  }

  const session = stripeEvent.data.object;

  if (session.payment_status !== 'paid') {
    return { statusCode: 200, body: JSON.stringify({ received: true }) };
  }

  const tier = session.metadata?.tier || 'lifetime';
  const piId = session.payment_intent || null;

  let expiry = null;
  if (tier === 'monthly') {
    const d = new Date(); d.setHours(d.getHours() + 24); expiry = d.toISOString();
  } else if (tier === 'yearly') {
    const d = new Date(); d.setHours(d.getHours() + 24); expiry = d.toISOString();
  }

  const accessToken = issueToken(tier, piId, expiry);

  // Log for audit trail
  console.log(`[webhook] Payment confirmed — tier: ${tier}, pi: ${piId}`);

  return {
    statusCode: 200,
    body: JSON.stringify({ received: true, tier, accessToken }),
  };
};
