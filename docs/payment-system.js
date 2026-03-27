// ==================== PAYMENT SYSTEM ====================

const FREE_QUESTION_LIMIT = 5;

const PRICING = {
  monthly: {
    price: 7,
    stripePriceId: 'price_1TB1YCE9neqrFM5LDbyzVSnv',
    label: 'Monthly',
    interval: 'month',
    mode: 'subscription'
  },
  bundle3: {
    price: 17,
    stripePriceId: 'REPLACE_WITH_17_BUNDLE_PRICE_ID',
    label: '3-Cert Bundle',
    interval: 'one-time',
    mode: 'payment'
  },
  yearly: {
    price: 67,
    stripePriceId: 'price_1TED8EE9neqrFM5LCIL9P0Yp',
    label: 'Yearly',
    savings: 38,
    interval: 'year',
    mode: 'subscription'
  },
  lifetime: {
    price: 147,
    stripePriceId: 'price_1TED9ME9neqrFM5LeKAAEWTO',
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

// API base — functions live on Netlify, site is served from GitHub Pages
const API_BASE = 'https://awsprepai.netlify.app';

// ==================== RSA-JWT VERIFICATION ====================
// Public key embedded at build time — private key never leaves the server.
// Tokens signed with RS256 cannot be forged without the private key.
// Anyone can read the public key; only the server can create valid tokens.

const RSA_PUBLIC_KEY_B64 = 'LS0tLS1CRUdJTiBQVUJMSUMgS0VZLS0tLS0KTUlJQklqQU5CZ2txaGtpRzl3MEJBUUVGQUFPQ0FROEFNSUlCQ2dLQ0FRRUFtZEVxU09iZy9OeWVmdWxHVW4yVgpnUVNMajU3Wk4wMDBqell2WFUwR1lyelJmQW9sUmoxdzl6dldhcTBYOFNqNzhmS3N5RnpaOVlJSzFsWWVzK1Y4Cm5UVHp6ZDhnZk5kbTlIQk9pbjRacytXK1poU05pTlZDOHhoT25zdkU4cHRlVWlIcWNWOGRiOW1paDRyenJHSzcKamUzdkgzTTg1Sm12RVN4MkQ0QmtsbmxqdXJ5L2NnREdwVHZmYjFwRHJINkNSOVg0RDIvQUJnd21sNUg4SGpVRwpYNXl0RG1aWjh5cGYyZW00WW9mNFpYTThLVmxMZE95TWhhNDdyN3I0L3JlTkQvbysvakp0MUJOU3h2UFk1VlROCkJGOVVEU3RsTnQ2dXgzS1djWUlGa0Y1N3B2UERUV0ZlTXpDak5Ca3FJTEV3Rkl0RHRDWCtLRWVEZ0dnaGhOa0kKOFFJREFRQUIKLS0tLS1FTkQgUFVCTElDIEtFWS0tLS0tCg==';

// Internal state — set once per page load via initPremiumCheck()
let _premiumState = null; // { valid: bool, tier: string|null }

function b64urlDecode(s) {
  s = s.replace(/-/g, '+').replace(/_/g, '/');
  while (s.length % 4) s += '=';
  return Uint8Array.from(atob(s), c => c.charCodeAt(0));
}

function pemToArrayBuffer(pem) {
  const b64 = pem.replace(/-----[^-]+-----/g, '').replace(/\s/g, '');
  return b64urlDecode(b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, ''));
}

async function _importPublicKey() {
  try {
    const pem = atob(RSA_PUBLIC_KEY_B64);
    const der = pemToArrayBuffer(pem);
    return await crypto.subtle.importKey(
      'spki', der.buffer,
      { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
      false, ['verify']
    );
  } catch (e) {
    console.error('[jwt] importKey failed:', e);
    return null;
  }
}

async function _verifyJWT(token) {
  if (!token || typeof token !== 'string') return null;
  const parts = token.split('.');
  if (parts.length !== 3) return null;

  try {
    const pubKey = await _importPublicKey();
    if (!pubKey) return null;

    const data  = new TextEncoder().encode(`${parts[0]}.${parts[1]}`);
    const sig   = b64urlDecode(parts[2]);
    const valid = await crypto.subtle.verify('RSASSA-PKCS1-v1_5', pubKey, sig, data);
    if (!valid) return null;

    const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
    // Check expiry
    if (payload.exp && Math.floor(Date.now() / 1000) > payload.exp) return null;
    return payload;
  } catch (e) {
    console.error('[jwt] verify failed:', e);
    return null;
  }
}

/**
 * Call once on page load. Verifies the stored JWT and caches the result.
 * All subsequent hasPremiumAccess() calls are synchronous (cached).
 */
async function initPremiumCheck() {
  if (_premiumState !== null) return; // already done

  const token = localStorage.getItem('_apa_jwt');
  if (!token) {
    _premiumState = { valid: false, tier: null };
    return;
  }

  const payload = await _verifyJWT(token);
  if (payload) {
    _premiumState = { valid: true, tier: payload.tier || 'lifetime' };

    // Subscription: refresh token from server if it expires within 2 days
    if (payload.exp) {
      const secsLeft = payload.exp - Math.floor(Date.now() / 1000);
      if (secsLeft < 2 * 86400 && payload.pi) {
        // Background refresh — don't block UI
        _refreshToken(payload.pi).catch(() => {});
      }
    }
  } else {
    // Token invalid or expired — revoke
    _revokeAccess();
    _premiumState = { valid: false, tier: null };
  }
}

async function _refreshToken(paymentIntentId) {
  try {
    const resp = await fetch(API_BASE + '/.netlify/functions/restore-access', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ paymentIntentId }),
    });
    const data = await resp.json();
    if (data.accessToken) {
      localStorage.setItem('_apa_jwt', data.accessToken);
      localStorage.setItem('_apa_tier', data.tier || 'lifetime');
    }
  } catch (e) {
    // Offline or network error — keep existing token, will retry next visit
  }
}

function _revokeAccess() {
  ['_apa_jwt', '_apa_tier', '_apa_pi',
   // Legacy keys (clean up old sessions)
   '_apa_tk', '_apa_ex', '_apa_tr', '_apa_ts', '_apa_st', 'premium_access'
  ].forEach(k => localStorage.removeItem(k));
}

// ==================== PUBLIC API ====================

function hasPremiumAccess() {
  if (_premiumState === null) {
    // initPremiumCheck() hasn't finished yet — fail safe (show free limit)
    return false;
  }
  return _premiumState.valid === true;
}

function getPremiumTier() {
  return _premiumState?.tier || localStorage.getItem('_apa_tier') || null;
}

function getAccessToken() {
  return localStorage.getItem('_apa_jwt') || null;
}

function isPremiumUser() {
  return hasPremiumAccess();
}

function revokePremiumAccess() {
  _revokeAccess();
  _premiumState = { valid: false, tier: null };
}

// ==================== GRANT ACCESS (post-payment) ====================

async function grantPremiumAccessWithTier(tier, paymentIntentId, accessToken) {
  if (accessToken) {
    // Verify before storing — never trust unverified tokens
    const payload = await _verifyJWT(accessToken);
    if (payload) {
      localStorage.setItem('_apa_jwt', accessToken);
      localStorage.setItem('_apa_tier', tier || payload.tier || 'lifetime');
      if (paymentIntentId) localStorage.setItem('_apa_pi', paymentIntentId);
      _premiumState = { valid: true, tier: tier || payload.tier || 'lifetime' };
    } else {
      console.error('[payment] Received invalid token from server');
    }
  }
}

// ==================== REFRESH (restore on new device) ====================

async function refreshPremiumAccess() {
  const piId = (localStorage.getItem('_apa_pi') || '').trim();
  if (!piId || !piId.startsWith('pi_')) {
    alert('No payment record found. Please contact support at support@awsprepai.com');
    return;
  }
  try {
    await _refreshToken(piId);
    // Re-verify with fresh token
    _premiumState = null;
    await initPremiumCheck();
    if (hasPremiumAccess()) {
      alert('Access restored! Welcome back.');
      location.reload();
    } else {
      alert('Could not verify your purchase. Please contact support.');
    }
  } catch (e) {
    alert('Network error. Please try again.');
  }
}

// ==================== QUESTION GATING ====================

function shouldShowUpgrade(questionIndex) {
  if (hasPremiumAccess()) return false;
  return questionIndex >= FREE_QUESTION_LIMIT;
}

function getAvailableQuestionCount(questions) {
  return hasPremiumAccess() ? questions.length : FREE_QUESTION_LIMIT;
}

function filterQuestionsForUser(questions) {
  const isPremium = hasPremiumAccess();
  return isPremium ? questions : questions.slice(0, FREE_QUESTION_LIMIT);
}

// ==================== STRIPE PAYMENT FLOW ====================

async function initiatePayment(tier, addOnPriceId) {
  const plan = PRICING[tier];
  if (!plan) return;

  const body = { priceId: plan.stripePriceId, mode: plan.mode, tier };
  if (addOnPriceId) body.addOnPriceId = addOnPriceId;

  try {
    const resp = await fetch(API_BASE + '/.netlify/functions/create-checkout-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const data = await resp.json();
    if (data.url) {
      window.location.href = data.url;
    } else {
      throw new Error(data.error || 'No checkout URL returned');
    }
  } catch (err) {
    console.error('Payment error:', err);
    alert('Payment failed to initialize. Please try again.');
  }
}

// ==================== PROGRESS SYNC (server-side, cross-device) ====================
// Saves & loads quiz progress via Netlify Blobs (JWT-authenticated).
// Local storage is always used as primary cache; server is synced in background.

const SYNC_BASE = API_BASE + '/.netlify/functions/sync-progress';
const LOAD_BASE = API_BASE + '/.netlify/functions/load-progress';

/**
 * Save progress for one cert to the server.
 * Call after every answered question (debounce recommended).
 * @param {string} cert  e.g. 'saa-c03'
 * @param {object} data  any serializable progress object
 */
async function syncProgress(cert, data) {
  const token = getAccessToken();
  if (!token || !hasPremiumAccess()) return; // free users — local only

  try {
    await fetch(SYNC_BASE, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ cert, data }),
    });
  } catch (e) {
    // Offline — silently fail; local storage still has data
  }
}

/**
 * Load ALL certs' progress from server.
 * Returns object keyed by cert, e.g. { 'saa-c03': {...}, ... }
 * Returns null if not premium or request fails.
 */
async function loadAllProgress() {
  const token = getAccessToken();
  if (!token || !hasPremiumAccess()) return null;

  try {
    const resp = await fetch(LOAD_BASE, {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${token}` },
    });
    if (!resp.ok) return null;
    const { progress } = await resp.json();
    return progress || null;
  } catch (e) {
    return null;
  }
}

/**
 * Load progress for a single cert from server.
 * Falls back to localStorage if server unavailable.
 * @param {string} cert
 * @param {string} localKey  localStorage key for fallback
 */
async function loadProgressForCert(cert, localKey) {
  const token = getAccessToken();
  if (!token || !hasPremiumAccess()) {
    // Free user — local only
    try { return JSON.parse(localStorage.getItem(localKey) || 'null'); } catch { return null; }
  }

  try {
    const resp = await fetch(`${SYNC_BASE}?cert=${encodeURIComponent(cert)}`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    if (!resp.ok) throw new Error('not ok');
    const { data } = await resp.json();
    if (data) {
      // Cache locally for offline use
      localStorage.setItem(localKey, JSON.stringify(data));
      return data;
    }
  } catch (e) {
    // Fall back to local cache
  }
  try { return JSON.parse(localStorage.getItem(localKey) || 'null'); } catch { return null; }
}

// Debounce helper for sync calls (avoids hammering server on every keystroke)
function _debounce(fn, ms) {
  let timer;
  return (...args) => { clearTimeout(timer); timer = setTimeout(() => fn(...args), ms); };
}

// Ready-to-use debounced sync (1.5 s delay after last call)
const syncProgressDebounced = _debounce(syncProgress, 1500);

// ==================== UI HELPERS ====================

function initPremiumUI() {
  const badge = document.getElementById('premiumBadge');
  if (badge && hasPremiumAccess()) badge.style.display = 'inline-flex';

  // Migrate legacy sessions (old btoa tokens → prompt restore)
  const hasLegacy = localStorage.getItem('_apa_tk') || localStorage.getItem('premium_access');
  const hasNew    = localStorage.getItem('_apa_jwt');
  if (hasLegacy && !hasNew) {
    // Clean up legacy keys silently
    ['_apa_tk','_apa_ex','_apa_tr','_apa_ts','_apa_st','premium_access']
      .forEach(k => localStorage.removeItem(k));
  }
}
