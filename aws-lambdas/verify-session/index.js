/**
 * awsprepai-verify-session
 * Verifies Stripe checkout session and upgrades user tier in Cognito.
 */
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { CognitoIdentityProviderClient, ListUsersCommand, AdminUpdateUserAttributesCommand } = require('@aws-sdk/client-cognito-identity-provider');

const cognito = new CognitoIdentityProviderClient({ region: 'us-east-1' });
const USER_POOL_ID = process.env.COGNITO_USER_POOL_ID;

const ALLOWED_ORIGINS = [
  'https://certiprepai.com',
  'https://www.certiprepai.com',
  'https://main.d2pm3jfcsesli7.amplifyapp.com',
  'https://awsprepai.isaloumapps.com',
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

async function upgradeCognitoUser(email, tier) {
  // Find user by email
  const listCmd = new ListUsersCommand({
    UserPoolId: USER_POOL_ID,
    Filter: `email = "${email}"`,
    Limit: 1,
  });
  const listRes = await cognito.send(listCmd);
  const user = listRes.Users?.[0];
  if (!user) throw new Error(`No Cognito user found for: ${email}`);

  // Update tier attribute
  const updateCmd = new AdminUpdateUserAttributesCommand({
    UserPoolId: USER_POOL_ID,
    Username: user.Username,
    UserAttributes: [{ Name: 'custom:plan', Value: tier }],
  });
  await cognito.send(updateCmd);
  console.log(`[verify-session] Upgraded ${email} -> ${tier}`);
  return user.Username;
}

exports.handler = async (event) => {
  const headers = corsHeaders();

  if (event.requestContext?.http?.method === 'OPTIONS' || event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    const { sessionId } = JSON.parse(event.body || '{}');
    if (!sessionId || !/^cs_/.test(sessionId)) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: 'Invalid session ID' }) };
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId, { expand: ['customer'] });
    const isTrial = session.payment_status === 'no_payment_required';

    if (session.payment_status !== 'paid' && !isTrial) {
      return { statusCode: 402, headers, body: JSON.stringify({ verified: false, error: 'Payment not completed' }) };
    }

    if (session.metadata?.product !== 'awsprepai_premium') {
      return { statusCode: 400, headers, body: JSON.stringify({ verified: false, error: 'Invalid product' }) };
    }

    const tier = session.metadata?.tier || 'lifetime';
    const email = session.customer_details?.email || (typeof session.customer === 'object' ? session.customer?.email : null);

    if (!email) {
      return { statusCode: 400, headers, body: JSON.stringify({ verified: false, error: 'No email found in session' }) };
    }

    await upgradeCognitoUser(email, tier);

    return { statusCode: 200, headers, body: JSON.stringify({ verified: true, tier }) };
  } catch (err) {
    console.error('[verify-session] Error:', err.message);
    return { statusCode: 500, headers, body: JSON.stringify({ error: err.message }) };
  }
};
