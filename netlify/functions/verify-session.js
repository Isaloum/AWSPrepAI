const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event) => {
  // Only allow POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const { sessionId } = JSON.parse(event.body);

    if (!sessionId || typeof sessionId !== 'string' || !/^cs_/.test(sessionId)) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Invalid session ID' }),
      };
    }

    // Retrieve and verify the session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== 'paid') {
      return {
        statusCode: 402,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ verified: false, error: 'Payment not completed' }),
      };
    }

    if (session.metadata && session.metadata.product !== 'awsprepai_premium') {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ verified: false, error: 'Invalid product' }),
      };
    }

    const tier = (session.metadata && session.metadata.tier) ? session.metadata.tier : 'lifetime';
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ verified: true, tier }),
    };
  } catch (error) {
    console.error('Stripe verification error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: error.message || 'Unable to verify payment. Please contact support.'
      }),
    };
  }
};
