/**
 * verify-session.js
 * Called after Stripe Checkout redirect. Verifies payment and upgrades Supabase user tier.
 * SECURITY: verifies session directly with Stripe API — cannot be faked client-side.
 */
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const ALLOWED_ORIGINS = [
  'https://isaloum.github.io',
  'https://awsprepai.netlify.app',
  'https://main.d2pm3jfcsesli7.amplifyapp.com',
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

async function upgradeSupabaseUser(email, tier) {
  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceKey) throw new Error('Missing Supabase env vars');

  // Find user by email
  const listRes = await fetch(
    `${supabaseUrl}/auth/v1/admin/users?email=${encodeURIComponent(email)}`,
    { headers: { apikey: serviceKey, Authorization: `Bearer ${serviceKey}` } }
  );
  const listData = await listRes.json();
  const user = listData.users?.[0];
  if (!user) throw new Error(`No Supabase user found for: ${email}`);

  // Update tier in user_metadata
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
        user_metadata: { ...user.user_metadata, tier },
      }),
    }
  );
  if (!updateRes.ok) throw new Error(`Supabase update failed: ${updateRes.status}`);
  return user.id;
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

    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['customer'],
    });
    const isTrial = session.payment_status === 'no_payment_required';

    if (session.payment_status !== 'paid' && !isTrial) {
      return { statusCode: 402, headers, body: JSON.stringify({ verified: false, error: 'Payment not completed' }) };
    }

    if (session.metadata?.product !== 'awsprepai_premium') {
      return { statusCode: 400, headers, body: JSON.stringify({ verified: false, error: 'Invalid product' }) };
    }

    const tier = session.metadata?.tier || 'lifetime';

    // Get email from session
    const email =
      session.customer_details?.email ||
      (typeof session.customer === 'object' ? session.customer?.email : null);

    // Upgrade Supabase user if we have an email
    if (email) {
      try {
        await upgradeSupabaseUser(email, tier);
        console.log(`[verify-session] Upgraded ${email} → ${tier}`);
      } catch (err) {
        // Non-fatal: log and continue. Webhook will retry.
        console.error('[verify-session] Supabase upgrade failed:', err.message);
      }
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ verified: true, tier }),
    };

  } catch (err) {
    console.error('[verify-session] Error:', err.message);
    return { statusCode: 500, headers, body: JSON.stringify({ error: err.message }) };
  }
};
