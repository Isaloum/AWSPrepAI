// ==================== MOBILE MENU TOGGLE ====================
const mobileMenuToggle = document.getElementById('mobileMenuToggle');
const mobileNavOverlay = document.getElementById('mobileNavOverlay');
const mobileNavClose = document.getElementById('mobileNavClose');

if (mobileMenuToggle && mobileNavOverlay) {
  mobileMenuToggle.addEventListener('click', () => {
    mobileNavOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  });
}

if (mobileNavClose) {
  mobileNavClose.addEventListener('click', closeMobileNav);
}

if (mobileNavOverlay) {
  mobileNavOverlay.addEventListener('click', (e) => {
    if (e.target === mobileNavOverlay) {
      closeMobileNav();
    }
  });
}

function closeMobileNav() {
  if (mobileNavOverlay) {
    mobileNavOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }
}

// Close mobile nav when clicking a link
document.querySelectorAll('.mobile-nav-link, .mobile-nav-cta').forEach(link => {
  link.addEventListener('click', closeMobileNav);
});

// ==================== KEYBOARD NAVIGATION FOR DROPDOWNS ====================
document.querySelectorAll('.nav-item-dropdown').forEach(dropdown => {
  const button = dropdown.querySelector('.nav-link');
  const menu = dropdown.querySelector('.dropdown-menu');

  if (button && menu) {
    button.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const isExpanded = button.getAttribute('aria-expanded') === 'true';
        button.setAttribute('aria-expanded', String(!isExpanded));
        menu.style.display = isExpanded ? '' : 'block';
      }
      if (e.key === 'Escape') {
        button.setAttribute('aria-expanded', 'false');
        menu.style.display = '';
        button.focus();
      }
    });
  }
});

// ==================== ACTIVE LINK HIGHLIGHTING ====================
(function () {
  const currentPath = window.location.pathname;
  document.querySelectorAll('.nav-menu .nav-link[href]').forEach(link => {
    const href = link.getAttribute('href');
    if (href && href !== '#' && href !== 'javascript:void(0)' && currentPath.endsWith(href)) {
      link.classList.add('active');
    }
  });
}());

// ==================== AUTH NAV STATE ====================
// Show "My Dashboard" and hide "Log In / Sign Up" when user is logged in
(function () {
  const session = localStorage.getItem('_apa_session');
  const sessionExp = parseInt(localStorage.getItem('_apa_session_exp') || '0');
  let isValid = false;
  if (session) {
    try {
      const payload = JSON.parse(atob(session.split('.')[1]));
      isValid = (Date.now() / 1000 < payload.exp) && (Date.now() < sessionExp);
    } catch(e) { isValid = false; }
  }
  if (!isValid && session) {
    ['_apa_session','_apa_session_exp','_apa_email','_apa_name','_apa_tier'].forEach(k => localStorage.removeItem(k));
  }
  const loginBtn = document.getElementById('nav-login-btn');
  const signupBtn = document.getElementById('nav-signup-btn');
  const dashBtn = document.getElementById('nav-dashboard-btn');
  if (isValid && loginBtn && signupBtn && dashBtn) {
    loginBtn.style.display = 'none';
    signupBtn.style.display = 'none';
    dashBtn.style.display = 'inline-flex';
  }
}());

// ==================== SHOW TAB FALLBACK (for non-index pages) ====================
// On index.html the inline script defines showTab(); this fallback is used on other pages.
window.showTab = window.showTab || function (tabName) {
  // Sanitize: only allow alphanumeric characters and hyphens
  const safe = String(tabName).replace(/[^a-zA-Z0-9-]/g, '');
  window.location.href = 'index.html#' + safe;
};
