import https from 'https'
import {
  CognitoIdentityProviderClient,
  GetUserCommand,
  AdminUpdateUserAttributesCommand,
} from '@aws-sdk/client-cognito-identity-provider'

const STRIPE_SECRET = process.env.STRIPE_SECRET_KEY
const USER_POOL_ID  = process.env.COGNITO_USER_POOL_ID || 'us-east-1_bqEVRsi2b'
const cognito = new CognitoIdentityProviderClient({ region: 'us-east-1' })

function stripeGet(path) {
  return new Promise((resolve, reject) => {
    const req = https.request({
      hostname: 'api.stripe.com', path, method: 'GET',
      headers: { Authorization: `Bearer ${STRIPE_SECRET}` },
    }, res => { let d = ''; res.on('data', c => d += c); res.on('end', () => resolve(JSON.parse(d))) })
    req.on('error', reject); req.end()
  })
}

function stripeDelete(path) {
  return new Promise((resolve, reject) => {
    const req = https.request({
      hostname: 'api.stripe.com', path, method: 'DELETE',
      headers: { Authorization: `Bearer ${STRIPE_SECRET}`, 'Content-Length': 0 },
    }, res => { let d = ''; res.on('data', c => d += c); res.on('end', () => resolve(JSON.parse(d))) })
    req.on('error', reject); req.end()
  })
}

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type,Authorization',
  'Access-Control-Allow-Methods': 'POST,OPTIONS',
  'Content-Type': 'application/json',
}

export const handler = async (event) => {
  if (event.requestContext?.http?.method === 'OPTIONS')
    return { statusCode: 200, headers: CORS, body: '' }

  try {
    const token = (event.headers?.authorization || event.headers?.Authorization || '').replace('Bearer ', '')
    if (!token) return { statusCode: 401, headers: CORS, body: JSON.stringify({ error: 'Missing token' }) }

    // Validate access token + get user attributes from Cognito
    const userInfo = await cognito.send(new GetUserCommand({ AccessToken: token }))
    const attrs = Object.fromEntries(userInfo.UserAttributes.map(a => [a.Name, a.Value]))
    const email = attrs.email
    const stripeCustomerId = attrs['custom:stripe_customer_id']

    // Cancel all active Stripe subscriptions if customer exists
    if (stripeCustomerId) {
      const subs = await stripeGet(`/v1/subscriptions?customer=${stripeCustomerId}&status=active&limit=10`)
      for (const sub of subs.data || []) {
        await stripeDelete(`/v1/subscriptions/${sub.id}`)
        console.log(`Cancelled Stripe subscription ${sub.id} for ${email}`)
      }
    }

    // Set plan to free in Cognito
    await cognito.send(new AdminUpdateUserAttributesCommand({
      UserPoolId: USER_POOL_ID,
      Username: email,
      UserAttributes: [{ Name: 'custom:plan', Value: 'free' }],
    }))

    console.log(`Plan set to free for ${email}`)
    return {
      statusCode: 200,
      headers: CORS,
      body: JSON.stringify({ message: 'Subscription cancelled successfully.' }),
    }
  } catch (err) {
    console.error('Cancel error:', err)
    return { statusCode: 500, headers: CORS, body: JSON.stringify({ error: err.message }) }
  }
}
