const FREE_QUESTION_LIMIT = 5;

const PRICING = {
  basic: { priceId: 'price_1Hh5KsL22WIh8cZp7Oq2z2R8', amount: 500 },
  standard: { priceId: 'price_1Hh5KsL22WIh8cZp7OqT3aBX', amount: 1000 },
  premium: { priceId: 'price_1Hh5KsL22WIh8cZp7OqIlRLW', amount: 2000 }
};

const STRIPE_PUBLISHABLE_KEY = 'pk_test_51Hh5KsL22WIh8cZp7OqT3M3D';

function initiatePayment(priceId) {
  // logic to initiate payment via Stripe
}

function processPayment(request) {
  // logic to process the payment
}

function refundPayment(paymentId) {
  // logic to refund the payment
}

function getPaymentStatus(paymentId) {
  // logic to retrieve payment status
}

function listPaymentMethods(userId) {
  // logic to list available payment methods for a user
}

module.exports = { FREE_QUESTION_LIMIT, PRICING, STRIPE_PUBLISHABLE_KEY, initiatePayment, processPayment, refundPayment, getPaymentStatus, listPaymentMethods };