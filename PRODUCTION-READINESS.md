# CertiPrepAI — Full Analysis & Production Readiness Report
**Date:** April 9, 2026  
**Status:** NOT production-ready (1 critical blocker, 4 bugs)

---

## 🔴 CRITICAL — Fix Before Any Real User Pays

### 1. `awsprepai-verify-session` — BROKEN (no node_modules)
**Impact:** Every paid user after checkout lands on an error screen. Stripe charges succeed but their account never upgrades.

**Evidence:** CodeSize = 1,467 bytes. Should be ~4–5MB with `stripe` + `@aws-sdk` bundled. Env vars (`STRIPE_SECRET_KEY`, `COGNITO_USER_POOL_ID`) are correctly set — it's just the zip missing node_modules.

**Fix:** Run from project root:
```bash
cd aws-lambdas/verify-session
npm install
zip -r /tmp/verify-lambda.zip index.js node_modules
aws lambda update-function-code --function-name awsprepai-verify-session --zip-file fileb:///tmp/verify-lambda.zip --region us-east-1
```

### 2. `verify-session` code bug — `corsHeaders()` called without origin
**File:** `aws-lambdas/verify-session/index.js` line 52  
**Impact:** CORS header is hardcoded to `certiprepai.com`. Blocks testing from Amplify staging URL. Fine for production users, bad for QA.

**Fix:** Change line 52 from:
```js
const headers = corsHeaders()
```
to:
```js
const headers = corsHeaders(event.headers?.origin || event.headers?.Origin || '')
```

---

## 🟠 HIGH — Content Bugs (Wrong Facts Shown to Users)

### 3. Stats bar says "90 Min Timer" — should be 130
**File:** `react-app/src/pages/Home.tsx` line 161  
**Impact:** Users see wrong exam duration on the homepage. FAQ correctly says 130 minutes.

```js
// Wrong:
{ n: '90', label: 'Min Timer' }
// Fix:
{ n: '130', label: 'Min Timer' }
```

### 4. Footer "Mock Exams" links to wrong URL
**File:** `react-app/src/components/Footer.tsx` line 28  
**Impact:** Clicking "Mock Exams" in the footer goes to `/certifications` (the quiz picker), not the mock exam flow.

```js
// Wrong:
{ to: '/certifications', label: 'Mock Exams' }
// Fix:
{ to: '/certifications?mode=mock', label: 'Mock Exams' }
```

### 5. GitHub repo link in footer — security exposure
**File:** `react-app/src/components/Footer.tsx` line 104  
**Impact:** Footer links directly to your public GitHub repo. If the repo is public, it exposes your entire codebase including Lambda logic, env var references, and architecture to competitors.

**Fix:** Either make the repo private on GitHub, or remove the footer link. Don't keep a public link to a live product's source code.

---

## 🟡 MEDIUM — Logic & UX Issues

### 6. PaymentSuccess has orphaned `bundle3` tier label
**File:** `react-app/src/pages/PaymentSuccess.tsx` line 83  
**Impact:** Dead code. No `bundle3` plan exists in Stripe, Pricing page, or anywhere. Cosmetic but messy.

```js
// Remove this line:
bundle3: '🎁 3-Cert Bundle',
```

### 7. No `/study-guide` route in App.tsx
**Impact:** CLAUDE.md says "Study Guide page added (`/study-guide`)" but `App.tsx` has no route for it. The `/resources` page appears to serve this purpose. If `/study-guide` URL is linked anywhere, users get a 404.

**Fix:** Either add `<Route path="/study-guide" element={<Resources />} />` or update CLAUDE.md.

### 8. Navbar Study dropdown: "Study Guide" → `/resources` mismatch
**File:** `react-app/src/components/Navbar.tsx` line 85  
`studyItems[0]` is labeled "Study Guide" but points to `/resources`. This is confusing for testers checking routes.

### 9. Monthly plan: access scope unclear in UI
**Pricing page FAQ says:** "Monthly gives you 1 certification at a time"  
**Pricing page features list says:** "All 12 certs"  
These contradict each other. Monthly is 1 cert/month. The feature item should read "1 AWS certification (switch every 30 days)" not "All 12 certs".

---

## 🟢 NICE TO HAVE — Pre-Launch Polish

### 10. Lambda concurrency — default is 10, too low
Request a quota increase: AWS Console → Service Quotas → Lambda → Concurrent executions → Request 1000. Currently if 11 users hit the API simultaneously, the 11th gets throttled.

### 11. No error tracking
Zero visibility into runtime errors. If something breaks in production, you'll find out from a user complaint, not an alert. Consider adding Sentry (free tier) to the React app and Lambda logs monitoring.

### 12. No sitemap.xml or robots.txt
Hurts SEO. Pages like `/certifications`, `/glossary`, `/pricing` are valuable and should be indexed.

### 13. MFA flow — untested end-to-end
UI is built (Dashboard toggle + Login flow). Needs a real QA pass with Google Authenticator.

### 14. Terms page says "Last updated: March 2026"
Minor — worth updating to April 2026 to reflect current state.

---

## Lambda Health Summary

| Lambda | Code Size | Status |
|--------|-----------|--------|
| `awsprepai-checkout` | 1.9 MB | ✅ Fixed today — stripe bundled |
| `awsprepai-db` | 3.7 MB | ✅ Good |
| `awsprepai-cancel-subscription` | 6.1 MB | ✅ Good |
| `awsprepai-stripe-webhook` | 5.5 MB | ✅ Good |
| `awsprepai-verify-session` | **1.5 KB** | ❌ **BROKEN — no node_modules** |

---

## Full Page Audit

| Page | Route | Status | Notes |
|------|-------|--------|-------|
| Home | `/` | ✅ Good | Fix "90 Min" stat → 130 |
| Certifications | `/certifications` | ✅ Good | |
| Cert Detail | `/cert/:id` | ✅ Good | |
| Mock Exam | `/mock-exam/:id` | ✅ Good | |
| Pricing | `/pricing` | ⚠️ | Monthly features list says "All 12 certs" — should say "1 cert" |
| Login | `/login` | ✅ Good | Forgot password, MFA, email normalization all in place |
| Signup | `/signup` | ✅ Good | Password strength, email verify, plan passthrough all good |
| Dashboard | `/dashboard` | ✅ Good | Cancel badge fix deployed today |
| Payment Success | `/payment-success` | ⚠️ | Will fail until verify-session is redeployed. Has dead `bundle3` label |
| About | `/about` | ✅ Good | Custom SVG illustrations, solid content |
| Resources | `/resources` | ✅ Good | |
| Glossary | `/glossary` | ✅ Good | |
| Sample Questions | `/sample-questions` | ✅ Good | |
| Visual Exam | `/visual-exam` | ✅ Good | |
| Architecture Builder | `/architecture-builder` | ✅ Good | |
| Diagrams | `/diagrams` | ✅ Good | |
| Terms | `/terms` | ⚠️ | Update date: March → April 2026 |
| Keywords | `/keywords` | ✅ Good | |
| 404 | `*` | ✅ Good | |

---

## Production Readiness Checklist

### Must-fix before launch (blocking)
- [ ] Redeploy `awsprepai-verify-session` with node_modules — **paid signups broken without this**
- [ ] Fix `corsHeaders()` missing origin arg in verify-session code
- [ ] Fix home stats "90 Min" → "130 Min"
- [ ] Fix footer "Mock Exams" link → `/certifications?mode=mock`
- [ ] Fix Pricing Monthly feature "All 12 certs" → "1 cert at a time"
- [ ] Remove or restrict GitHub repo link in footer

### Fix before scaling
- [ ] Request Lambda concurrency increase to 1000
- [ ] Add Sentry or CloudWatch alarm for Lambda errors
- [ ] Add sitemap.xml and robots.txt

### Polish
- [ ] Remove dead `bundle3` label from PaymentSuccess
- [ ] Clarify `/study-guide` route situation
- [ ] Update Terms "Last updated" date
- [ ] End-to-end MFA test

---

## Priority Order for Next Session

1. **Redeploy verify-session** (AWS MCP — same as checkout today)
2. **Fix verify-session cors bug + 5 content bugs** → single git push
3. **Lambda concurrency quota request** (5 min in AWS console)
4. **MFA QA pass** (manual test)
