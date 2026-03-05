const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event) => {
    const { body } = event;
    const { priceId, quantity = 1 } = JSON.parse(body);

    if (!priceId) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: 'Missing priceId' }),
        };
    }

    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [{
                price: priceId,
                quantity,
            }],
            mode: 'payment',
            success_url: `${process.env.SUCCESS_URL}?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.CANCEL_URL}`,
        });

        return {
            statusCode: 200,
            body: JSON.stringify({ id: session.id }),
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message }),
        };
    }
};