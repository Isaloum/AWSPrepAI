/**
 * upgrade-subscription/index.mjs
 * AWS Lambda — previews and executes Stripe subscription upgrades with proration.
 *
 * POST /  { action: 'preview' | 'upgrade', targetPlan }
 *         Authorization: Bearer <accessToken>
 *
 * preview → { type: 'proration', amountDue, amountDueFormatted, nextBillingDate }
 *           { type: 'checkout' }   ← lifetime always goes to checkout
 * upgrade → { success: true, newPlan }
 *           { type: 'checkout', url }  ← lifetime
 */

import Stripe from 'stripe'
import {
  CognitoIdentityProviderClient,
  GetUserCommand,
  AdminUpdateUserAttributesCommand,
} from '@aws-sdk/client-cognito-identity-provider'

const stripe   = new Stripe(process.env.STRIPE_SECRET_KEY)
const cognito  = new CognitoIdentityProviderClient({ region: 'us-east-1' })
const USER_POOL_ID = 'us-east-1_bqEVRsi2b'

const PRICE_IDS = {
  monthly:  process.env.STRIPE_PRICE_MONTHLY  || 'price_1TB1YCE9neqrFM5LDbyzVSnv',
  bundle:   process.env.STRIPE_PRICE_BUNDLE   || 'price_1TEh73E9neqrFM5L2Q38zGJF',
  yearly:   process.env.STRIPE_PRICE_YEARLY   || 'price_1TED8EE9neqrFM5LCIL9P0Yp',
  lifetime: process.env.STRIPE_PRICE_LIFETIME || 'price_1TED9ME9neqrFM5LeKAAEWTO',
}

const ALLOWED_ORIGINS = [
  'https://certiprepai.com',
  'https://www.certiprepai.com',
  'https://main.d2pm3jfcsesli7.amplifyapp.com',
]

function corsHeaders(origin) {
  const allowed = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0]
  return {
    'Access-Control-Allow-Origin':  allowed,
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json',
  }
}

export const handler = async (event) => {
  const origin = event.headers?.origin || event.headers?.Origin || ''
  const CORS   = corsHeaders(origin)
  const method = event.requestContext?.http?.method || event.httpMethod || ''

  if (method === 'OPTIONS') return { statusCode: 200, headers: CORS, body: '' }
  if (method !== 'POST')    return { statusCode: 405, headers: CORS, body: JSON.stringify({ error: 'Method not allowed' }) }

  try {
    const body = JSON.parse(event.body || '{}')
    const { action, targetPlan } = body

    // Auth
    const authHeader = event.headers?.authorization || event.headers?.Authorization || ''
    const token = authHeader.replace('Bearer ', '').trim()
    if (!token) return { statusCode: 401, headers: CORS, body: JSON.stringify({ error: 'Unauthorized' }) }

    // Validate target plan
    if (!PRICE_IDS[targetPlan]) return { statusCode: 400, headers: CORS, body: JSON.stringify({ error: 'Invalid target plan' }) }

    // Get user from Cognito
    const userResult = await cognito.send(new GetUserCommand({ AccessToken: token }))
    const attrs      = Object.fromEntries(userResult.UserAttributes.map(a => [a.Name, a.Value]))
    const customerId = attrs['custom:stripe_customer_id']
    const username   = userResult.Username

    if (!customerId) return { statusCode: 400, headers: CORS, body: JSON.stringify({ error: 'No Stripe customer linked to account' }) }

    // ── LIFETIME: always a new checkout session ───────────────────────────────
    if (targetPlan === 'lifetime') {
      const appUrl  = process.env.APP_URL || 'https://certiprepai.com'
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        customer:    customerId,
        line_items:  [{ price: PRICE_IDS.lifetime, quantity: 1 }],
        mode:        'payment',
        metadata:    { product: 'awsprepai_premium', tier: 'lifetime' },
        success_url: `${appUrl}/certifications?upgrade=success`,
        cancel_url:  `${appUrl}/pricing?cancelled=1`,
      })
      return { statusCode: 200, headers: CORS, body: JSON.stringify({ type: 'checkout', url: session.url }) }
    }

    // ── Subscription upgrade (monthly / bundle → yearly) ─────────────────────
    const subs = await stripe.subscriptions.list({ customer: customerId, status: 'active', limit: 1 })
    if (!subs.data.length) return { statusCode: 400, headers: CORS, body: JSON.stringify({ error: 'No active subscription found' }) }

    const sub       = subs.data[0]
    const subItemId = sub.items.data[0].id
    const newPriceId = PRICE_IDS[targetPlan]

    // ── PREVIEW: calculate prorated amount ───────────────────────────────────
    if (action === 'preview') {
      const preview = await stripe.invoices.retrieveUpcoming({
        customer: customerId,
        subscription: sub.id,
        subscription_items: [{ id: subItemId, price: newPriceId }],
        subscription_proration_behavior: 'always_invoice',
      })
      const amountDue = preview.amount_due // cents — may be 0 if credit covers it
      const nextTs    = preview.next_payment_attempt
      return {
        statusCode: 200,
        headers: CORS,
        body: JSON.stringify({
          type: 'proration',
          amountDue,
          amountDueFormatted: `$${(amountDue / 100).toFixed(2)}`,
          nextBillingDate: nextTs
            ? new Date(nextTs * 1000).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
            : null,
        }),
      }
    }

    // ── UPGRADE: execute the swap + charge proration immediately ─────────────
    if (action === 'upgrade') {
      await stripe.subscriptions.update(sub.id, {
        items: [{ id: subItemId, price: newPriceId }],
        proration_behavior: 'always_invoice',
      })

      // Update Cognito immediately so the next token refresh reflects the new plan
      await cognito.send(new AdminUpdateUserAttributesCommand({
        UserPoolId: USER_POOL_ID,
        Username:   username,
        UserAttributes: [{ Name: 'custom:plan', Value: targetPlan }],
      }))

      return { statusCode: 200, headers: CORS, body: JSON.stringify({ success: true, newPlan: targetPlan }) }
    }

    return { statusCode: 400, headers: CORS, body: JSON.stringify({ error: 'Invalid action. Use preview or upgrade.' }) }

  } catch (err) {
    console.error('[upgrade-subscription]', err)
    return { statusCode: 500, headers: CORS, body: JSON.stringify({ error: 'Internal server error' }) }
  }
}
