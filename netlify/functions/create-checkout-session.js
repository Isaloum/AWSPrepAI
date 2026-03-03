const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Allowed pricing tiers — server-side to prevent client-side tampering
const PRICING = {
  monthly: {
    mode: 'subscription',
    price_data: {
      currency: 'usd',
      product_data: {
        name: 'AWSPrepAI Premium — Monthly',
        description: 'All 505 SAA-C03 questions, unlimited mock exams, progress tracking',
        images: ['https://isaloum.github.io/AWSPrepAI/favicon.svg'],
      },
      unit_amount: 1000, // $10.00
      recurring: { interval: 'month' },
    },
  },
  yearly: {
    mode: 'subscription',
    price_data: {
      currency: 'usd',
      product_data: {
        name: 'AWSPrepAI Premium — Yearly',
        description: 'All 505 SAA-C03 questions, unlimited mock exams, progress tracking (save $61/year)',
        images: ['https://isaloum.github.io/AWSPrepAI/favicon.svg'],
      },
      unit_amount: 5900, // $59.00
      recurring: { interval: 'year' },
    },
  },
  lifetime: {
    mode: 'payment',
    price_data: {
      currency: 'usd',
      product_data: {
        name: 'AWSPrepAI Premium — Lifetime',
        description: 'Lifetime access to all 505 SAA-C03 practice questions and future updates',
        images: ['https://isaloum.github.io/AWSPrepAI/favicon.svg'],
      },
      unit_amount: 9900, // $99.00
    },
  },
};

exports.handler = async (event) => {
  // Only allow POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const body = JSON.parse(event.body || '{}');
    const tier = body.tier && PRICING[body.tier] ? body.tier : 'lifetime';
    const tierConfig = PRICING[tier];

    // Build line item — use price_data (no pre-created Stripe prices required)
    const lineItem = { price_data: tierConfig.price_data, quantity: 1 };

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [lineItem],
      mode: tierConfig.mode,
      success_url: `${process.env.URL}/success.html?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.URL}/cancel.html`,
      metadata: {
        product: 'awsprepai_premium',
        tier,
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
