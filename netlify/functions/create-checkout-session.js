const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Fixed price in cents to prevent client-side price tampering
const PREMIUM_PRICE_CENTS = 1499;

exports.handler = async (event) => {
  // Only allow POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    // Create Stripe Checkout session with server-side fixed price
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'AWSPrepAI Premium',
              description: 'Lifetime access to all 505 SAA-C03 practice questions',
              images: ['https://isaloum.github.io/AWSPrepAI/favicon.svg'],
            },
            unit_amount: PREMIUM_PRICE_CENTS,
          },
          quantity: 1,
        },
      ],
      mode: 'payment', // One-time payment
      success_url: `${process.env.URL}/success.html?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.URL}/cancel.html`,
      metadata: {
        product: 'awsprepai_premium',
      },
    });

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id: session.id }),
    };
  } catch (error) {
    console.error('Stripe error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: error.message || 'Unable to process payment. Please try again or contact support.'
      }),
    };
  }
};
