// ==================== PAYMENT SYSTEM ====================
// Freemium model: First 50 questions free, then paid tiers for full access

const FREE_QUESTION_LIMIT = 50;

const PRICING = {
  monthly: {
    price: 10,
    stripePriceId: 'price_1T7q2nE9neqrFM5L9ggfWy1i',
    label: 'Monthly',
    interval: 'month',
    mode: 'subscription'
  },
  yearly: {
    price: 59,
    stripePriceId: 'price_1T7q2vE9neqrFM5LjPQ25fZb',
    label: 'Yearly',
    savings: 61,
    interval: 'year',
    mode: 'subscription'
  },
  lifetime: {
    price: 99,
    stripePriceId: 'price_1T7q30E9neqrFM5LaLIoRQSy',
    label: 'Lifetime',
    popular: true,
    interval: 'one-time',
    mode: 'payment'
  }
};

const STRIPE_PUBLISHABLE_KEY = 'pk_live_51T0D2ZE9neqrFM5LGapKn0jDVlOu4vLVkQlUkjKXhNxji1jf8rjxpBYV1UEUXAQDty4i2Mn0GrKzJCDsFblJldKK00qq4R8TA';

// Initialize Stripe
let stripe;
if (typeof Stripe !== 'undefined') {
  stripe = Stripe(STRIPE_PUBLISHABLE_KEY);
}

// ==================== PREMIUM ACCESS MANAGEMENT ====================

function hasPremiumAccess() {
  return localStorage.getItem('premium_access') === 'true';
}

function grantPremiumAccess() {
  localStorage.setItem('premium_access', 'true');
  localStorage.setItem('premium_unlocked_at', new Date().toISOString());
  console.log('✅ Premium access granted');
}

function isQuestionLocked(questionIndex) {
  if (hasPremiumAccess()) {
    return false;
  }
  return questionIndex >= FREE_QUESTION_LIMIT;
}

function getAvailableQuestionCount() {
  if (typeof questions !== 'undefined') {
    return hasPremiumAccess() ? questions.length : FREE_QUESTION_LIMIT;
  }
  return FREE_QUESTION_LIMIT;
}

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

function showPaywall() {
  const modal = document.getElementById('paywall-modal');
  if (modal) {
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    updatePaywallStats();
  }
}

function closePaywall() {
  const modal = document.getElementById('paywall-modal');
  if (modal) {
    modal.style.display = 'none';
    document.body.style.overflow = '';
  }
}

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
    if (button) {
      button.disabled = true;
      button.textContent = '⏳ Processing...';
    }

    const response = await fetch('/.netlify/functions/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        priceId: pricing.stripePriceId,
        mode: pricing.mode,
        tier: tier
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to create checkout session');
    }

    const session = await response.json();

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

function getSubscriptionTier() {
  return localStorage.getItem('subscription_tier') || null;
}

function grantPremiumAccessWithTier(tier) {
  grantPremiumAccess();
  if (tier) {
    localStorage.setItem('subscription_tier', tier);
  }
}

function isSubscriptionActive() {
  if (!hasPremiumAccess()) return false;
  const tier = getSubscriptionTier();
  if (tier === 'lifetime' || !tier) return true;
  const expiry = localStorage.getItem('subscription_expiry');
  if (!expiry) return true;
  return new Date(expiry) > new Date();
}

// ==================== QUESTION NAVIGATION HOOKS ====================

function checkQuestionAccess(questionIndex) {
  if (isQuestionLocked(questionIndex)) {
    showPaywall();
    return false;
  }
  return true;
}

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

function showPremiumBadge() {
  const badge = document.getElementById('premium-badge');
  if (badge && hasPremiumAccess()) {
    badge.style.display = 'inline-flex';
  }
}

function updatePremiumUI() {
  const isPremium = hasPremiumAccess();
  showPremiumBadge();
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

document.addEventListener('DOMContentLoaded', () => {
  updatePremiumUI();
});
