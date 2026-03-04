// ==================== PAYMENT SYSTEM ====================
// Freemium model: First 50 questions free, then paid tiers for full access
//
// TO SET UP STRIPE PRICES:
// 1. Go to https://dashboard.stripe.com/test/products
// 2. Click "Add product"
// 3. Create these 3 products:
//    - Monthly: $10/month recurring subscription
//    - Yearly: $59/year recurring subscription
//    - Lifetime: $99 one-time payment
// 4. Copy the price IDs (format: price_xxxxxxxxxxxxx)
// 5. Replace the placeholder IDs below

const FREE_QUESTION_LIMIT = 50;

const PRICING = {
  monthly: {
    price: 10,
    stripePriceId: 'price_MONTHLY_TEST_ID_HERE', // TODO: Replace with your Stripe TEST price ID for $10/month
    label: 'Monthly',
    interval: 'month'
  },
  yearly: {
    price: 59,
<<<<<<< copilot/fix-stripe-test-mode-price-ids
    stripePriceId: 'price_YEARLY_TEST_ID_HERE', // TODO: Replace with your Stripe TEST price ID for $59/year
=======
    stripePriceId: 'price_1T6jssE9neqrFM5LWiY47vYv',
>>>>>>> main
    label: 'Yearly',
    savings: 61,
    interval: 'year'
  },
  lifetime: {
    price: 99,
    stripePriceId: 'price_LIFETIME_TEST_ID_HERE', // TODO: Replace with your Stripe TEST price ID for $99 one-time
    label: 'Lifetime',
    popular: true,
    interval: 'one-time'
  }
};

const STRIPE_PUBLISHABLE_KEY = 'pk_test_51T0D2ZE9neqrFM5LGdEoLrxxjlOMSwRrwgQTqWYHDM8J163XrRZlo7jAIzp4WDj2nNqq1sSCGJH2JXtzkbzswGAm003fvoymSl'; // Stripe publishable key (safe to commit - not a secret)

// Initialize Stripe
let stripe;
if (typeof Stripe !== 'undefined') {
  stripe = Stripe(STRIPE_PUBLISHABLE_KEY);
}

// ==================== PREMIUM ACCESS MANAGEMENT ====================

/**
 * Check if user has premium access
 */
function hasPremiumAccess() {
  return localStorage.getItem('premium_access') === 'true';
}

/**
 * Grant premium access to user
 */
function grantPremiumAccess() {
  localStorage.setItem('premium_access', 'true');
  localStorage.setItem('premium_unlocked_at', new Date().toISOString());
  console.log('✅ Premium access granted');
}

/**
 * Check if a specific question is locked
 */
function isQuestionLocked(questionIndex) {
  if (hasPremiumAccess()) {
    return false; // Premium users have access to all
  }
  // Lock questions after the free limit (0-indexed, so 20+ = locked)
  return questionIndex >= FREE_QUESTION_LIMIT;
}

/**
 * Get total available questions for current user
 */
function getAvailableQuestionCount() {
  if (typeof questions !== 'undefined') {
    return hasPremiumAccess() ? questions.length : FREE_QUESTION_LIMIT;
  }
  return FREE_QUESTION_LIMIT;
}

/**
 * Get premium status info
 */
function getPremiumStatus() {
  const isPremium = hasPremiumAccess();
  const totalQuestions = typeof questions !== 'undefined' ? questions.length : 505;
  const currentIndex = typeof currentQuestionIndex !== 'undefined' ? currentQuestionIndex : 0;
  return {
    isPremium,
    freeQuestionsRemaining: isPremium ? 0 : Math.max(0, FREE_QUESTION_LIMIT - currentIndex),
    totalQuestions,
    availableQuestions: getAvailableQuestionCount(),
    lockedQuestions: totalQuestions - FREE_QUESTION_LIMIT
  };
}

// ==================== PAYWALL UI ====================

/**
 * Show paywall modal
 */
function showPaywall() {
  const modal = document.getElementById('paywall-modal');
  if (modal) {
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';

    // Update stats in modal
    updatePaywallStats();
  }
}

/**
 * Close paywall modal
 */
function closePaywall() {
  const modal = document.getElementById('paywall-modal');
  if (modal) {
    modal.style.display = 'none';
    document.body.style.overflow = '';
  }
}

/**
 * Update paywall statistics
 */
function updatePaywallStats() {
  const status = getPremiumStatus();

  const lockedCountEl = document.getElementById('locked-question-count');
  if (lockedCountEl) {
    lockedCountEl.textContent = status.lockedQuestions;
  }

  const freeCountEl = document.getElementById('free-question-count');
  if (freeCountEl) {
    freeCountEl.textContent = FREE_QUESTION_LIMIT;
  }
}

// ==================== STRIPE PAYMENT ====================

/**
 * Initiate Stripe payment for a given pricing tier
 * @param {string} tier - 'monthly', 'yearly', or 'lifetime'
 */
async function initiatePayment(tier = 'lifetime') {
  if (!stripe) {
    alert('Payment system not initialized. Please refresh the page.');
    return;
  }

  const pricing = PRICING[tier];
  if (!pricing) {
    alert('Invalid pricing tier selected.');
    return;
  }

  const button = document.querySelector(`.btn-premium[data-tier="${tier}"]`);

  try {
    // Show loading state
    if (button) {
      button.disabled = true;
      button.textContent = '⏳ Processing...';
    }

    // Call Netlify function to create Stripe Checkout session
    const response = await fetch('/.netlify/functions/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        priceId: pricing.stripePriceId,
        tier: tier
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to create checkout session');
    }

    const session = await response.json();

    // Redirect to Stripe Checkout
    const result = await stripe.redirectToCheckout({
      sessionId: session.id,
    });

    if (result.error) {
      alert(result.error.message);
      if (button) {
        button.disabled = false;
        button.textContent = pricing.label || '🔓 Unlock';
      }
    }
  } catch (error) {
    console.error('Payment error:', error);
    alert('Payment failed. Please try again or contact support.');

    if (button) {
      button.disabled = false;
      button.textContent = pricing.label || '🔓 Unlock';
    }
  }
}

// ==================== SUBSCRIPTION MANAGEMENT ====================

/**
 * Get the current subscription tier from local storage
 */
function getSubscriptionTier() {
  return localStorage.getItem('subscription_tier') || null;
}

/**
 * Grant premium access with a specific tier
 * @param {string} tier - 'monthly', 'yearly', or 'lifetime'
 */
function grantPremiumAccessWithTier(tier) {
  grantPremiumAccess();
  if (tier) {
    localStorage.setItem('subscription_tier', tier);
  }
}

/**
 * Check if the user's subscription is still active (for monthly/yearly)
 * For lifetime, always returns true if premium_access is set.
 */
function isSubscriptionActive() {
  if (!hasPremiumAccess()) return false;
  const tier = getSubscriptionTier();
  if (tier === 'lifetime' || !tier) return true;
  // Monthly/yearly: check expiry if stored
  const expiry = localStorage.getItem('subscription_expiry');
  if (!expiry) return true; // No expiry stored → assume active
  return new Date(expiry) > new Date();
}

// ==================== QUESTION NAVIGATION HOOKS ====================

/**
 * Hook into question navigation to check locks
 */
function checkQuestionAccess(questionIndex) {
  if (isQuestionLocked(questionIndex)) {
    showPaywall();
    return false; // Block navigation
  }
  return true; // Allow navigation
}

/**
 * Get locked question UI
 */
function getLockedQuestionHTML(questionIndex) {
  const totalQuestions = typeof questions !== 'undefined' ? questions.length : 505;
  return `
    <div class="question-locked">
      <div class="lock-icon">🔒</div>
      <h3>Question ${questionIndex + 1} is Locked</h3>
      <p class="lock-description">
        You've completed the <strong>${FREE_QUESTION_LIMIT} free questions</strong>. 
        Unlock all <strong>${totalQuestions} questions</strong> — plans start at <strong>$${PRICING.monthly.price}/month</strong>!
      </p>
      <button class="btn-unlock" onclick="showPaywall()">
        🚀 Unlock All Questions
      </button>
      <p class="lock-note">Monthly, yearly, or lifetime access available</p>
    </div>
  `;
}

// ==================== PREMIUM BADGE ====================

/**
 * Show premium badge in UI
 */
function showPremiumBadge() {
  const badge = document.getElementById('premium-badge');
  if (badge && hasPremiumAccess()) {
    badge.style.display = 'inline-flex';
  }
}

/**
 * Update UI based on premium status
 */
function updatePremiumUI() {
  const isPremium = hasPremiumAccess();

  // Show/hide premium badge
  showPremiumBadge();

  // Update question counter if it exists
  const counterEl = document.getElementById('question-counter');
  if (counterEl) {
    const status = getPremiumStatus();
    if (isPremium) {
      counterEl.innerHTML = `<span class="premium-label">⭐ Premium</span> All ${status.totalQuestions} questions unlocked`;
    } else {
      counterEl.innerHTML = `${status.freeQuestionsRemaining} free questions remaining`;
    }
  }
}

// ==================== INITIALIZATION ====================

// Run on page load
document.addEventListener('DOMContentLoaded', () => {
  updatePremiumUI();
});
