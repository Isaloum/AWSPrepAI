/**
 * awsprepai-cancel-subscription
 * Cancels a user's Stripe subscription at period end and downgrades
 * their Cognito custom:plan to 'free'.
 *
 * Protected by Cognito JWT (Authorization: Bearer <accessToken>).
 * Deploy as: awsprepai-cancel-subscription  runtime: nodejs20.x
 * Env vars: STRIPE_SECRET_KEY, COGNITO_USER_POOL_ID, COGNITO_CLIENT_ID
 */
import Stripe from 'stripe';
import {
  CognitoIdentityProviderClient,
  AdminGetUserCommand,
  AdminUpdateUserAttributesCommand,
} from '@aws-sdk/client-cognito-identity-provider';
import { CognitoJwtVerifier } from 'aws-jwt-verify';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const cognito = new CognitoIdentityProviderClient({ region: 'us-east-1' });

const USER_POOL_ID = process.env.COGNITO_USER_POOL_ID || 'us-east-1_bqEVRsi2b';
const CLIENT_ID    = process.env.COGNITO_CLIENT_ID    || '4j9mnlkhtu023takbj0qb1g10h';

const verifier = CognitoJwtVerifier.create({
  userPoolId: USER_POOL_ID,
  tokenUse:   'access',
  clientId:   CLIENT_ID,
});

const CORS = {
  'Access-Control-Allow-Origin':  '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Content-Type': 'application/json',
};

export const handler = async (event) => {
  if (event.requestContext?.http?.method === 'OPTIONS') {
    return { statusCode: 200, headers: CORS, body: '' };
  }

  // ── Verify JWT ───────────────────────────────────────────────────
  const authHeader = event.headers?.authorization || event.headers?.Authorization || '';
  const token = authHeader.replace(/^Bearer\s+/i, '');

  let claims;
  try {
    claims = await verifier.verify(token);
  } catch {
    return { statusCode: 401, headers: CORS, body: JSON.stringify({ error: 'Unauthorized' }) };
  }

  // Cognito username == email (per project config)
  const username = claims.username || claims.sub;

  try {
    // ── Look up Stripe customer ID from Cognito ───────────────────
    const userRes = await cognito.send(new AdminGetUserCommand({
      UserPoolId: USER_POOL_ID,
      Username:   username,
    }));

    const attrs = Object.fromEntries(
      (userRes.UserAttributes || []).map(a => [a.Name, a.Value])
    );

    const stripeCustomerId = attrs['custom:stripe_customer_id'];
    const currentPlan      = attrs['custom:plan'] || 'free';

    if (currentPlan === 'free') {
      return { statusCode: 400, headers: CORS, body: JSON.stringify({ error: 'No active subscription to cancel.' }) };
    }

    if (currentPlan === 'lifetime') {
      return { statusCode: 400, headers: CORS, body: JSON.stringify({ error: 'Lifetime plans cannot be cancelled.' }) };
    }

    // ── Cancel active Stripe subscriptions at period end ─────────
    if (stripeCustomerId) {
      const subscriptions = await stripe.subscriptions.list({
        customer: stripeCustomerId,
        status:   'active',
        limit:    10,
      });

      for (const sub of subscriptions.data) {
        await stripe.subscriptions.update(sub.id, { cancel_at_period_end: true });
      }

      console.log(`[cancel-subscription] Scheduled cancellation for ${username} (${stripeCustomerId})`);
    }

    // ── Downgrade Cognito plan to free ───────────────────────────
    await cognito.send(new AdminUpdateUserAttributesCommand({
      UserPoolId:      USER_POOL_ID,
      Username:        username,
      UserAttributes:  [{ Name: 'custom:plan', Value: 'free' }],
    }));

    console.log(`[cancel-subscription] Downgraded ${username} -> free`);

    return {
      statusCode: 200,
      headers:    CORS,
      body:       JSON.stringify({ success: true, message: 'Subscription cancelled. Access continues until end of billing period.' }),
    };
  } catch (err) {
    console.error('[cancel-subscription] Error:', err.message);
    return { statusCode: 500, headers: CORS, body: JSON.stringify({ error: err.message }) };
  }
};
