# AWSPrepAI — Full Project Roadmap & Handoff Document
**Last updated:** March 24, 2026
**Live site:** https://isaloum.github.io/AWSPrepAI/
**Netlify functions (API):** https://awsprepai.netlify.app
**GitHub repo:** https://github.com/Isaloum/AWSPrepAI

---

## Project Overview

AWSPrepAI is a web-based AWS certification prep platform. It covers **12 AWS certifications** with ~3,120 practice questions, mock exams, AI Coach chat, flashcards/glossary, and visual architecture diagrams. Users sign up free (5 questions), then pay to unlock full access.

**Tech stack:**
- Frontend: Static HTML/CSS/JS on **GitHub Pages** (`main` branch, `/docs` folder)
- Auth: **Supabase** (email/password, JWT sessions)
- Payments: **Stripe** (subscriptions + one-time) via **Netlify Functions**
- API/Serverless: **Netlify Functions** (Node.js)
- Progress storage: **Netlify Blobs** (cross-device sync for paid users)

---

## Architecture: Two Parallel Auth Systems

> This is the most important thing to understand about the codebase.

### 1. Supabase Auth (Login/Session)
Controls whether the user is **logged in**.

| localStorage key | Value |
|---|---|
| `_apa_session` | Supabase access token (JWT) |
| `_apa_session_exp` | Custom 24h expiry timestamp (`Date.now() + 24h`) |
| `_apa_email` | User email |
| `_apa_name` | First name |
| `_apa_tier` | Tier from Supabase `user_metadata.tier` (or fallback from payment JWT) |

**Key files:** `login.html`, `navigation.js`, `nav-auth.js`, `user-dashboard.html` (head guard)

### 2. Payment JWT System (Premium Access)
Controls whether the user has **paid access**.

| localStorage key | Value |
|---|---|
| `_apa_jwt` | RS256-signed JWT from Netlify (verified with embedded public key) |
| `_apa_tier` | Tier from payment JWT (`monthly`, `yearly`, `lifetime`) |
| `_apa_pi` | Stripe payment_intent or subscription ID (for token refresh) |

**Key files:** `payment-system.js`, `netlify/functions/verify-session.js`, `netlify/functions/stripe-webhook.js`

### Tier Values
- `free` — 5 sample questions, SAA-C03 only
- `monthly` — $7/mo — 1 cert full access (currently being built out)
- `yearly` — $67/yr — all 12 certs
- `lifetime` — $147 one-time — all 12 certs + AI Coach

---

## Git Push Protocol

GitHub Pages does NOT allow normal `git push` because `HEAD.lock` blocks it. Always use:

```bash
git write-tree
git commit-tree <TREE_HASH> -p HEAD -m "commit message"
git push origin <COMMIT_HASH>:refs/heads/main --force
```

---

## ✅ COMPLETED (what has been fixed/built)

### Bug Fixes
1. **Infinite redirect loop (login ↔ dashboard)** — FIXED
   - Root cause chain:
     - `navigation.js` decoded Supabase JWT with raw `atob()` → base64url chars broke it → caught exception → deleted `_apa_session` from localStorage → head guard saw no token → redirected to login → Supabase session still valid → redirected back → loop
     - `login.html` `getSession()` was redirecting to dashboard WITHOUT refreshing localStorage → stale tokens → loop continued
   - Fix: `navigation.js` now uses only custom 24h expiry check, never decodes JWT. `login.html` now refreshes all localStorage tokens before redirecting.

2. **Post-payment tier upgrade not working** — FIXED
   - Root cause: After Stripe payment, `_apa_jwt` was stored with `tier: 'monthly'`. But on next login, `login.html` set `_apa_tier` from `user_metadata.tier || 'free'` (Supabase metadata was never updated), overwriting the paid tier.
   - Fix (3 layers):
     - `user-dashboard.html`: reads tier from BOTH `_apa_tier` and `_apa_jwt`, uses the higher paid tier
     - `success.html`: after payment verified, calls `supa.auth.updateUser({ data: { tier } })` to persist tier in Supabase metadata
     - `login.html`: `resolveBestTier()` function checks `_apa_jwt` and uses paid tier over Supabase 'free' metadata

3. **Stripe personal phone number on bank statements** — FIXED
   - Was: personal phone number showing on customer receipts/statements
   - Fix: Updated Stripe Dashboard → Settings → Business details → set generic +1(800) number, set statement descriptor to `AWSPREPAI`, cleared home address

### Content Fixes
4. **About page** — rewritten to reflect all 12 certs (was SAA-C03 only)
5. **Contact page** — removed open-source/GitHub contributions content, added proper support email + refund policy
6. **Resources page** — removed SAA-C03-only framing, updated to cover all 12 certs
7. **Certifications page** — fixed `3353` → `3,120` questions, cert cards updated
8. **All 21 HTML pages** — removed `Dashboard` link from nav (both desktop + mobile), logo always links to `index.html`

### Code Architecture
9. **`navigation.js`** — stripped of JWT decode logic, uses only custom 24h expiry
10. **`nav-auth.js`** — created as separate nav auth helper, `isLoggedIn()` uses only custom expiry
11. **`payment-system.js`** — RSA-JWT verification system (RS256, public key embedded client-side, private key server-only)

---

## ❌ PENDING (what needs to be done)

### 🔴 Critical — Build Access Control for Practice/Study Tabs

Right now ALL users (free and paid) can access ALL questions once they navigate directly to a cert page. The gating that exists in `payment-system.js` (`hasPremiumAccess()`, `filterQuestionsForUser()`) is NOT wired up in the cert pages.

**What needs to happen:**
- Each cert page (e.g., `saa-c03.html`, `clf-c02.html`, etc.) must call `initPremiumCheck()` on load
- Gate questions using `filterQuestionsForUser(questions)` or `shouldShowUpgrade(questionIndex)`
- Free users: 5 sample questions only, then show upgrade wall
- Monthly ($7): currently defined as "1 cert" — needs to decide WHICH cert or let user pick
- Yearly ($67): all 12 certs full access
- Lifetime ($147): all 12 certs + AI Coach

**Files to modify:** All 12 cert HTML files + `chat.html` (AI Coach)

---

### 🔴 Critical — $17 Bundle Price ID Missing

In `payment-system.js` line 15:
```javascript
stripePriceId: 'REPLACE_WITH_17_BUNDLE_PRICE_ID',
```
Ihab needs to:
1. Create a $17 one-time price in Stripe Dashboard for the 3-cert bundle order bump
2. Copy the price ID (starts with `price_`)
3. Replace `REPLACE_WITH_17_BUNDLE_PRICE_ID` in `payment-system.js`

---

### 🟡 Important — Subscription Cancellation Flow

When a Monthly/Yearly user cancels:
- Stripe sends `customer.subscription.deleted` webhook → `stripe-webhook.js` logs it but does NOT revoke access
- Need to: update Supabase `user_metadata.tier` back to `'free'` when subscription is cancelled
- This requires the webhook to have the Supabase service role key (environment variable on Netlify)

---

### 🟡 Important — Exam History on Dashboard

The dashboard has an "Exam History" tab at line ~289. It reads from `_apa_history` in localStorage. This is currently just a display — the actual cert quiz pages don't write to `_apa_history` when a user completes a mock exam. Need to:
- Define exam history data format
- Write to `_apa_history` when a mock exam is completed in any cert page
- Dashboard reads and displays it

---

### 🟡 Important — Progress Sync (Cross-Device)

`payment-system.js` has `syncProgress()` and `loadAllProgress()` fully built (uses Netlify Blobs, JWT-authenticated). But no cert page currently CALLS these functions. Need to:
- Call `syncProgressDebounced('saa-c03', progressData)` after each answered question
- Call `loadProgressForCert('saa-c03', 'localKey')` on page load
- Do this for all 12 cert pages

---

### 🟢 Nice to Have — Monthly Tier Cert Selection

Monthly users pay $7 for "1 cert". Currently the tier just says `monthly` but there's no mechanism for the user to choose WHICH cert they want unlocked. Options:
- Let them pick at checkout (Stripe metadata)
- Let them pick on the dashboard after payment
- Simplify: monthly = SAA-C03 only (most popular), upgrade prompt for others

---

### 🟢 Nice to Have — Password Reset Flow

`forgot-password.html` exists but need to verify the Supabase password reset email is configured and the redirect URL is correct.

---

### 🟢 Nice to Have — Newsletter/Email Capture

`success.html` has a newsletter form that saves email to localStorage but the `fetch` to `/.netlify/functions/capture-email` is commented out. Need to create the `capture-email` Netlify function and connect to Resend/Mailchimp.

---

### 🟢 Nice to Have — Share Links on success.html Still Say SAA-C03

Lines 110-111 in `success.html` have Twitter/LinkedIn share links that mention "533 SAA-C03 questions" — outdated. Should say "3,120 questions across 12 AWS certs".

---

## File Map (Key Files)

```
AWSPrepAI/
├── docs/                          ← GitHub Pages root
│   ├── index.html                 ← Landing page
│   ├── login.html                 ← Auth: login + getSession redirect
│   ├── signup.html                ← Auth: sign up
│   ├── forgot-password.html       ← Auth: password reset
│   ├── user-dashboard.html        ← Main dashboard (post-login)
│   ├── pricing.html               ← Pricing / upgrade wall
│   ├── success.html               ← Post-Stripe-payment page
│   ├── cancel.html                ← Stripe cancel redirect
│   ├── certifications.html        ← All 12 certs overview
│   ├── about.html / contact.html / resources.html
│   ├── navigation.js              ← Global nav auth guard (24h expiry only)
│   ├── nav-auth.js                ← Nav UI helper (isLoggedIn, etc.)
│   ├── payment-system.js          ← RSA-JWT verify, hasPremiumAccess, Stripe flow
│   ├── saa-c03.html               ← SAA-C03 quiz (free cert)
│   ├── clf-c02.html               ← CLF-C02 quiz (paid)
│   ├── dva-c02.html               ← DVA-C02 quiz (paid)
│   ├── soa-c02.html               ← SOA-C02 quiz (paid)
│   ├── sap-c02.html               ← SAP-C02 quiz (paid)
│   ├── dop-c02.html               ← DOP-C02 quiz (paid)
│   ├── scs-c03.html               ← SCS-C03 quiz (paid)
│   ├── ans-c01.html               ← ANS-C01 quiz (paid)
│   ├── mla-c01.html               ← MLS-C01 quiz (paid)
│   ├── dea-c01.html               ← DEA-C01 quiz (paid)
│   ├── gai-c01.html               ← GAI-C01 quiz (paid)
│   ├── aif-c01.html               ← AIF-C01 quiz (paid)
│   ├── chat.html                  ← AI Coach (paid feature)
│   ├── glossary.html              ← Flashcards/glossary
│   ├── diagrams.html              ← Visual architecture builder
│   └── [cert]_questions_260.js   ← Question banks (260 per cert)
│
├── netlify/functions/
│   ├── create-checkout-session.js ← Creates Stripe checkout session
│   ├── verify-session.js          ← Verifies Stripe payment, issues RS256 JWT
│   ├── stripe-webhook.js          ← Handles Stripe events (payment, cancel, dispute)
│   ├── restore-access.js          ← Re-issues JWT for existing purchases (new device)
│   ├── sync-progress.js           ← Saves quiz progress to Netlify Blobs
│   ├── load-progress.js           ← Loads quiz progress from Netlify Blobs
│   ├── chat.js                    ← AI Coach (Claude API proxy)
│   └── _jwt.js                    ← Shared RS256 JWT issue/verify logic
│
└── package.json                   ← stripe + @netlify/blobs dependencies
```

---

## Environment Variables (Netlify)

| Variable | Used by |
|---|---|
| `STRIPE_SECRET_KEY` | create-checkout-session, verify-session, stripe-webhook |
| `STRIPE_WEBHOOK_SECRET` | stripe-webhook (signature verification) |
| `JWT_PRIVATE_KEY` | _jwt.js (RS256 signing) |
| `ANTHROPIC_API_KEY` | chat.js (AI Coach) |

---

## Pricing Structure

| Plan | Price | Stripe Price ID | Mode | Access |
|---|---|---|---|---|
| Monthly | $7/mo | `price_1TB1YCE9neqrFM5LDbyzVSnv` | subscription | 1 cert (TBD which) |
| 3-Cert Bundle | $17 | **MISSING — needs to be created** | payment | 3 certs |
| Yearly | $67/yr | `price_1TED8EE9neqrFM5LCIL9P0Yp` | subscription | all 12 certs |
| Lifetime | $147 | `price_1TED9ME9neqrFM5LeKAAEWTO` | payment | all 12 certs + AI Coach |

---

## Supabase Config

- **Project URL:** `https://swkqwqtgbxymyhcnhmfv.supabase.co`
- **Anon key:** embedded in `login.html`, `signup.html`, `success.html`
- **User metadata fields used:** `first_name`, `full_name`, `tier`
- **Tier is set:** at signup (default: `free`), and updated by `success.html` after payment via `supa.auth.updateUser({ data: { tier } })`

---

## What to Tell the New Chat

> "You have access to the full AWSPrepAI project. Read `AWSPrepAI_Roadmap.md` first — it explains the full architecture, what's been fixed, and exactly what needs to be built next. The working folder is `/sessions/.../mnt/AWSPrepAI`. The most urgent task is wiring up the access control (gating) on all 12 cert pages based on `_apa_tier` / `hasPremiumAccess()` from `payment-system.js`."
