// ==================== PAYMENT SYSTEM ====================

const FREE_QUESTION_LIMIT = 20;

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
// Keys are obfuscated to prevent casual DevTools bypass
const _K = { a: '_apa_tk', b: '_apa_ex', c: '_apa_tr', d: '_apa_ts', e: '_apa_pi', f: '_apa_st' };

function _tok(d) {
  // Simple token: base64 of "granted:" + date string
  try { return btoa('granted:' + d); } catch(e) { return ''; }
}

function hasPremiumAccess() {
  try {
    const token  = localStorage.getItem(_K.a);
    const expiry = localStorage.getItem(_K.b);
    const tier   = localStorage.getItem(_K.c);
    const ts     = localStorage.getItem(_K.d);
    if (!token || !ts) return false;
    // Validate token integrity
    if (token !== _tok(ts)) return false;
    // Lifetime has no expiry
    if (tier === 'lifetime') return true;
    // Check expiry for monthly/yearly
    if (expiry) {
      return new Date(expiry) > new Date();
    }
    return true;
  } catch(e) { return false; }
}

function grantPremiumAccess() {
  grantPremiumAccessWithTier('lifetime');
}

function grantPremiumAccessWithTier(tier, paymentIntentId, accessToken) {
  try {
    const ts = new Date().toISOString();
    localStorage.setItem(_K.a, _tok(ts));
    localStorage.setItem(_K.c, tier || 'lifetime');
    localStorage.setItem(_K.d, ts);
    if (paymentIntentId && /^pi_/.test(paymentIntentId)) {
      localStorage.setItem(_K.e, paymentIntentId);
    }
    if (accessToken) {
      localStorage.setItem(_K.f, accessToken);
    }
    // Set expiry based on tier
    if (tier === 'monthly') {
      const exp = new Date(); exp.setDate(exp.getDate() + 32);
      localStorage.setItem(_K.b, exp.toISOString());
    } else if (tier === 'yearly') {
      const exp = new Date(); exp.setDate(exp.getDate() + 366);
      localStorage.setItem(_K.b, exp.toISOString());
    } else {
      localStorage.removeItem(_K.b); // lifetime = no expiry
    }
    console.log('✅ Premium access granted:', tier);
  } catch(e) {}
}

function restoreAccess(paymentIntentId) {
  return new Promise(async (resolve, reject) => {
    try {
      const id = (paymentIntentId || localStorage.getItem(_K.e) || '').trim();
      if (!id || !/^pi_/.test(id)) { reject('No valid Payment Intent ID'); return; }
      const res = await fetch('/.netlify/functions/restore-access', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentIntentId: id }),
      });
      const data = await res.json();
      if (!res.ok || !data.verified) { reject(data.error || 'Restore failed'); return; }
      grantPremiumAccessWithTier(data.tier, id, data.accessToken);
      resolve(data.tier);
    } catch(e) { reject(e.message || 'Restore failed'); }
  });
}

function revokePremiumAccess() {
  [_K.a, _K.b, _K.c, _K.d, _K.e, _K.f].forEach(k => localStorage.removeItem(k));
  // Clean up old keys from previous version
  localStorage.removeItem('premium_access');
  localStorage.removeItem('premium_unlocked_at');
  localStorage.removeItem('subscription_tier');
  localStorage.removeItem('subscription_expiry');
}

function isQuestionLocked(questionIndex) {
  if (hasPremiumAccess()) return false;
  const limit = window.currentFreeLimit || FREE_QUESTION_LIMIT;
  return questionIndex >= limit;
}

function getAvailableQuestionCount() {
  if (typeof questions !== 'undefined') {
    return hasPremiumAccess() ? questions.length : FREE_QUESTION_LIMIT;
  }
  return FREE_QUESTION_LIMIT;
}

function getPremiumStatus() {
  const isPremium = hasPremiumAccess();
  const totalQuestions = typeof questions !== 'undefined' ? questions.length : 533;
  const currentIndex = typeof currentQuestionIndex !== 'undefined' ? currentQuestionIndex : 0;
  return {
    isPremium,
    freeQuestionsRemaining: isPremium ? 0 : Math.max(0, FREE_QUESTION_LIMIT - currentIndex),
    totalQuestions,
    availableQuestions: getAvailableQuestionCount(),
    lockedQuestions: totalQuestions - FREE_QUESTION_LIMIT
  };
}

function getSubscriptionTier() {
  try { return localStorage.getItem(_K.c) || null; } catch(e) { return null; }
}

function getAccessToken() {
  try { return localStorage.getItem(_K.f) || null; } catch(e) { return null; }
}

function isSubscriptionActive() {
  return hasPremiumAccess();
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
  if (lockedCountEl) lockedCountEl.textContent = status.lockedQuestions;
  const freeCountEl = document.getElementById('free-question-count');
  if (freeCountEl) freeCountEl.textContent = FREE_QUESTION_LIMIT;
}

// ==================== STRIPE PAYMENT ====================

async function initiatePayment(tier = 'lifetime') {
  if (!stripe) {
    alert('Payment system not initialized. Please refresh the page.');
    return;
  }
  const pricing = PRICING[tier];
  if (!pricing) { alert('Invalid pricing tier selected.'); return; }
  const button = document.querySelector(`.btn-premium[data-tier="${tier}"]`);
  try {
    if (button) { button.disabled = true; button.textContent = '⏳ Processing...'; }
    const response = await fetch('/.netlify/functions/create-checkout-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ priceId: pricing.stripePriceId, mode: pricing.mode, tier }),
    });
    if (!response.ok) throw new Error('Failed to create checkout session');
    const session = await response.json();
    if (session.url) { window.location.href = session.url; }
    else throw new Error('No checkout URL returned');
  } catch (error) {
    console.error('Payment error:', error);
    alert('Payment failed. Please try again or contact support.');
    if (button) { button.disabled = false; button.textContent = pricing.label || '🔓 Unlock'; }
  }
}

// ==================== PREMIUM BADGE ====================

function showPremiumBadge() {
  const badge = document.getElementById('premium-badge');
  if (badge && hasPremiumAccess()) badge.style.display = 'inline-flex';
}

function updatePremiumUI() {
  showPremiumBadge();
  const counterEl = document.getElementById('question-counter');
  if (counterEl) {
    const status = getPremiumStatus();
    if (hasPremiumAccess()) {
      counterEl.innerHTML = `<span class="premium-label">⭐ Premium</span> All ${status.totalQuestions} questions unlocked`;
    } else {
      counterEl.innerHTML = `${status.freeQuestionsRemaining} free questions remaining`;
    }
  }
}

// ==================== INITIALIZATION ====================

document.addEventListener('DOMContentLoaded', () => {
  // Migrate old-style premium_access key to new obfuscated format
  if (localStorage.getItem('premium_access') === 'true' && !localStorage.getItem(_K.a)) {
    const oldTier = localStorage.getItem('subscription_tier') || 'lifetime';
    grantPremiumAccessWithTier(oldTier);
  }
  updatePremiumUI();
});
