/**
 * nav-auth.js — shared across all static pages
 * - Injects .nav-cta CSS so button renders on all pages
 * - Shows "My Dashboard" (green) if logged in
 * - Hides "Sign Up Free" / "Start Practicing" if logged in
 * - Points all Dashboard nav links to user-dashboard.html
 */
(function () {

  // ── Inject nav-cta styles if not already defined ──────────────────────────
  if (!document.getElementById('nav-auth-styles')) {
    var style = document.createElement('style');
    style.id = 'nav-auth-styles';
    style.textContent = [
      '.nav-cta{',
        'display:inline-flex;align-items:center;',
        'padding:.5rem 1.25rem;border-radius:8px;',
        'background:#3B82F6;color:#fff !important;',
        'font-weight:700;font-size:.875rem;',
        'text-decoration:none !important;',
        'border:none;cursor:pointer;',
        'transition:opacity .2s;white-space:nowrap;',
      '}',
      '.nav-cta:hover{opacity:.88}'
    ].join('');
    document.head.appendChild(style);
  }

  // ── Auth helpers ───────────────────────────────────────────────────────────
  function isLoggedIn() {
    var token     = localStorage.getItem('_apa_session');
    var customExp = parseInt(localStorage.getItem('_apa_session_exp') || '0');
    if (!token) return false;
    // Only check custom 24h expiry — do NOT decode JWT (Supabase uses base64url, breaks atob)
    if (customExp && Date.now() > customExp) return false;
    return true;
  }

  // ── Main ──────────────────────────────────────────────────────────────────
  function initNav() {
    var loggedIn = isLoggedIn();

    // 1. Point ALL "Dashboard" nav links to user-dashboard.html
    document.querySelectorAll('a.nav-link, a.mobile-nav-link').forEach(function (a) {
      if (/^\s*📊?\s*Dashboard\s*$/i.test(a.textContent)) {
        a.href = 'user-dashboard.html';
      }
    });

    var dashBtn   = document.getElementById('nav-dashboard-btn');
    var signupBtn = document.getElementById('nav-signup-btn');

    if (loggedIn) {
      // Show My Dashboard button
      if (dashBtn) {
        dashBtn.style.cssText = [
          'display:inline-flex !important;',
          'align-items:center;',
          'background:#10b981 !important;',
          'color:#fff !important;',
          'text-decoration:none !important;',
          'padding:.5rem 1.25rem;',
          'border-radius:8px;',
          'font-weight:700;',
          'font-size:.875rem;',
          'white-space:nowrap;'
        ].join('');
        dashBtn.href = 'user-dashboard.html';
      }
      // Hide sign-up / start-practicing button
      if (signupBtn) signupBtn.style.display = 'none';
    } else {
      // Hide My Dashboard button
      if (dashBtn) dashBtn.style.display = 'none';
      // Make sure signup button is visible
      if (signupBtn) signupBtn.style.display = '';
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initNav);
  } else {
    initNav();
  }

})();
