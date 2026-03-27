/**
 * stripe-webhook.js
 * Stripe calls this server-to-server when a payment/trial completes.
 * SECURITY: verifies webhook signature — cannot be forged.
 */
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { issueJWT } = require('./_jwt');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method not allowed' };
  }

  const sig           = event.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!sig || !webhookSecret) {
    console.error('[webhook] Missing signature or webhook secret');
    return { statusCode: 400, body: 'Missing webhook configuration' };
  }

  let stripeEvent;
  try {
    stripeEvent = stripe.webhooks.constructEvent(event.body, sig, webhookSecret);
  } catch (err) {
    console.error('[webhook] Signature verification failed:', err.message);
    return { statusCode: 400, body: `Webhook signature verification failed: ${err.message}` };
  }

  // Chargeback: flag for manual review (token will fail on next refresh)
  if (stripeEvent.type === 'charge.dispute.created') {
    const dispute = stripeEvent.data.object;
    console.warn(`[webhook] CHARGEBACK — pi: ${dispute.payment_intent}, amount: ${dispute.amount}`);
    return { statusCode: 200, body: JSON.stringify({ received: true, action: 'access_flagged' }) };
  }

  if (stripeEvent.type === 'customer.subscription.deleted') {
    const sub = stripeEvent.data.object;
    console.log('[webhook] Subscription cancelled:', sub.id);

    try {
      // 1. Get customer email from Stripe
      const customer = await stripe.customers.retrieve(sub.customer);
      const email = customer.email;
      if (!email) throw new Error('No email on Stripe customer');

      const supabaseUrl = process.env.SUPABASE_URL;
      const serviceKey  = process.env.SUPABASE_SERVICE_ROLE_KEY;
      if (!supabaseUrl || !serviceKey) throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY env vars');

      // 2. Find Supabase user by email
      const listRes = await fetch(
        `${supabaseUrl}/auth/v1/admin/users?email=${encodeURIComponent(email)}`,
        { headers: { apikey: serviceKey, Authorization: `Bearer ${serviceKey}` } }
      );
      const listData = await listRes.json();
      const user = listData.users?.[0];
      if (!user) throw new Error(`No Supabase user found for: ${email}`);

      // 3. Downgrade tier to 'free' — preserve other metadata fields
      const updateRes = await fetch(
        `${supabaseUrl}/auth/v1/admin/users/${user.id}`,
        {
          method: 'PUT',
          headers: {
            apikey: serviceKey,
            Authorization: `Bearer ${serviceKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            user_metadata: { ...user.user_metadata, tier: 'free' },
          }),
        }
      );
      if (!updateRes.ok) throw new Error(`Supabase update failed: ${updateRes.status}`);

      console.log(`[webhook] Tier revoked → free for ${email}`);
    } catch (err) {
      // Log but still return 200 — prevents Stripe from retrying endlessly
      console.error('[webhook] Failed to revoke tier:', err.message);
    }

    return { statusCode: 200, body: JSON.stringify({ received: true, action: 'tier_revoked' }) };
  }

  if (stripeEvent.type !== 'checkout.session.completed') {
    return { statusCode: 200, body: JSON.stringify({ received: true }) };
  }

  const session  = stripeEvent.data.object;
  const isTrial  = session.payment_status === 'no_payment_required';

  if (session.payment_status !== 'paid' && !isTrial) {
    return { statusCode: 200, body: JSON.stringify({ received: true }) };
  }

  const tier = session.metadata?.tier || 'lifetime';
  const piId = session.payment_intent || session.subscription || null;
  const now  = Math.floor(Date.now() / 1000);

  let exp = null;
  if (isTrial)               exp = now + 3   * 86400;
  else if (tier === 'monthly') exp = now + 32  * 86400;
  else if (tier === 'yearly')  exp = now + 366 * 86400;

  const accessToken = issueJWT({ tier, pi: piId, ...(exp ? { exp } : {}) });

  console.log(`[webhook] ${isTrial ? 'Trial' : 'Payment'} confirmed — tier: ${tier}, pi: ${piId}`);

  // NOTE: This response goes to Stripe, not the user.
  // The user gets their token via verify-session after the checkout redirect.
  return {
    statusCode: 200,
    body: JSON.stringify({ received: true, tier }),
  };
};
