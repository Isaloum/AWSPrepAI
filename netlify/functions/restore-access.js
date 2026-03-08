const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
  };

  if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers, body: '' };
  if (event.httpMethod !== 'POST') return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };

  try {
    const { paymentIntentId } = JSON.parse(event.body);

    if (!paymentIntentId || !/^pi_/.test(paymentIntentId)) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: 'Invalid payment intent ID' }) };
    }

    const pi = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (pi.status !== 'succeeded') {
      return { statusCode: 402, headers, body: JSON.stringify({ error: 'Payment not completed' }) };
    }

    // Get tier from metadata
    const tier = (pi.metadata && pi.metadata.tier) ? pi.metadata.tier : 'lifetime';

    return { statusCode: 200, headers, body: JSON.stringify({ verified: true, tier }) };

  } catch (err) {
    console.error('Restore access error:', err);
    return { statusCode: 500, headers, body: JSON.stringify({ error: err.message || 'Restore failed' }) };
  }
};
