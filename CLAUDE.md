# CertiPrepAI — Claude Context
_Last updated: 2026-04-28_

## What this project is
AWS certification prep SaaS. React frontend on AWS Amplify, serverless backend on Lambda + DynamoDB + Cognito.
- **Live app:** https://certiprepai.com
- **Amplify URL:** https://main.d2pm3jfcsesli7.amplifyapp.com
- **GitHub:** https://github.com/Isaloum/CertiPrepAI (branch: `main`)
- **Local repo:** `~/Desktop/Projects/CertiPrepAI`
- **Amplify App ID:** d2pm3jfcsesli7
- **AWS Account:** 441393059130 (Fridayaiapp)
- **AWS Region:** us-east-1

---

## ⚠️ CRITICAL — READ BEFORE TOUCHING ANYTHING

### 1. Email normalization is MANDATORY
macOS autocorrects the first letter to uppercase. Cognito is case-sensitive. Every auth function MUST do:
```typescript
const normalizedEmail = email.trim().toLowerCase()
```
Every email input MUST have:
```tsx
onChange={e => setEmail(e.target.value.trim().toLowerCase())}
```
**NEVER remove this normalization from cognito.ts.**

### 2. Token type matters
- `awsprepai-db` Lambda uses `GetUserCommand({ AccessToken: token })` — requires **Cognito ACCESS token**
- Dashboard.tsx MUST pass `user.accessToken` (NOT `user.idToken`) to all DB functions
- Cancel Lambda also uses access token — always `user.accessToken`

### 3. API URLs are hardcoded in source (NOT env vars)
Amplify was NOT injecting VITE_* env vars into the Vite build. All API URLs are hardcoded:
- `react-app/src/lib/db.ts` → `const DB_API = "https://dzhvi7oz29.execute-api.us-east-1.amazonaws.com"`
- `react-app/src/pages/Dashboard.tsx` → `const CANCEL_API = "https://hpcdl0ft8a.execute-api.us-east-1.amazonaws.com"`
- `react-app/src/pages/Dashboard.tsx` → `const AI_COACH_API = "https://hyb325gocg.execute-api.us-east-1.amazonaws.com"`
- Do NOT revert to env vars unless you fix Amplify build injection first.

### 4. Lambda zips must include node_modules
Always: `npm install` then zip before deploying. Use `coach.zip` or any name — NOT `lambda.zip` (turns into hyperlink in Claude chat).
```bash
zip -r coach.zip index.js node_modules/
aws lambda update-function-code --function-name FUNCTION_NAME --zip-file fileb://coach.zip
```

### 5. Vite 8 config
Must have `base: '/'` in `vite.config.ts` or Amplify deployment breaks.

### 6. Stripe cancellation = cancel_at_period_end: true
Cancel Lambda sets `cancel_at_period_end: true` on Stripe — user keeps access until billing period ends.
The Lambda does NOT downgrade Cognito plan — that is handled by the Stripe webhook at period end.

### 7. Browser caching
After deploys, always test in a **fresh incognito window**. Old bundles are aggressively cached.

### 8. ⚠️ CDN routing for certiprepai.com
`certiprepai.com` → Route 53 → **CloudFront `E149XOHRPMJ4D1`** (`d10nn383a5lev5.cloudfront.net`) → Amplify origin.
- Amplify RELEASE deployments do NOT clear this CloudFront cache.
- After any routing or caching fix, ALWAYS run: `aws cloudfront create-invalidation --distribution-id E149XOHRPMJ4D1 --paths "/*"`
- Amplify's own CDN only serves `main.d2pm3jfcsesli7.amplifyapp.com` (not the custom domain).

### 9. TypeScript strict mode
Amplify runs `tsc -b` before Vite build. Any unused variable (`TS6133`) or type error fails the build.
Always test locally first: `cd react-app && npm run build`

### 10. git HEAD.lock
If git says HEAD.lock exists: `rm -f ~/Desktop/Projects/CertiPrepAI/.git/HEAD.lock`

### 11. sed on macOS
macOS `sed -i ''` does NOT interpret `\n` as newline in replacement strings. Use Python instead:
```bash
python3 -c "f=open('file.tsx').read(); f=f.replace('old','new'); open('file.tsx','w').write(f)"
```

---

## Frontend Structure
- `docs/` — Only CNAME, favicon, robots.txt, sitemap.xml remain (static HTML deleted April 2026)
- `react-app/` — Vite 8 + React + TypeScript → deployed via AWS Amplify. This is the ONLY frontend.

---

## Key Files

| File | Purpose |
|------|---------|
| `react-app/src/lib/cognito.ts` | All auth functions. Email normalization MANDATORY. |
| `react-app/src/lib/db.ts` | DynamoDB API wrapper. Uses ACCESS token. DB_API hardcoded. |
| `react-app/src/contexts/AuthContext.tsx` | Auth state. Exposes: user, tier, isPremium, isFullAccess, loading. |
| `react-app/src/components/Navbar.tsx` | Nav. Pricing hidden for paid users. Billing shown for paid users. AI Coach shown for lifetime only. |
| `react-app/src/pages/Login.tsx` | Email normalized on input onChange. |
| `react-app/src/pages/Signup.tsx` | Email normalized. Password strength indicator. |
| `react-app/src/pages/Dashboard.tsx` | Plan display, cancel button, cert selection, Skill Radar Chart. AI Coach widget for lifetime only. |
| `react-app/src/pages/Pricing.tsx` | Checkout + upgrade flows. Upgrade buttons with prorated preview modal. |
| `react-app/src/pages/Billing.tsx` | ✅ NEW — /billing page. Current plan + upgrade options for paying users. |
| `react-app/src/pages/AiCoach.tsx` | ✅ NEW — /ai-coach full page. Lifetime only (redirects others to /dashboard). |
| `react-app/src/pages/CertDetail.tsx` | Practice mode. Bookmark questions. Retry wrong answers. Free tier 20q gating. |
| `react-app/src/pages/MockExam.tsx` | Timed mock exam. Saves per-domain scores. Monthly/bundle gating. |
| `react-app/src/pages/CheatSheets.tsx` | All 12 cert cheat sheets. 5 tabs per cert. |
| `react-app/src/pages/ForgotPassword.tsx` | 3-step forgot password flow. |
| `react-app/src/components/SEOMeta.tsx` | Per-route meta tags + JSON-LD schemas. |
| `react-app/src/components/SkillRadarChart.tsx` | Radar chart using real per-domain DynamoDB scores. |
| `react-app/src/components/EmailCapture.tsx` | Centered modal popup at 60% scroll. Saves to awsprepai-leads. No auth required. |
| `aws-lambdas/ai-coach/index.js` | AI Coach Lambda. Lifetime-only gating (`custom:plan === 'lifetime'`). |
| `aws-lambdas/cancel-subscription/index.mjs` | Cancels Stripe sub (period end). Does NOT touch Cognito plan. |
| `aws-lambdas/upgrade-subscription/index.mjs` | Handles preview + execute for plan upgrades with Stripe proration. |
| `aws-lambdas/awsprepai-db/index.js` | DynamoDB CRUD. `capture_lead` requires NO auth. All others require ACCESS token. |
| `aws-lambdas/stripe-webhook/index.js` | Handles Stripe webhook → writes plan to Cognito + DynamoDB at period end. |
| `aws-lambdas/checkout/index.js` | Creates Stripe checkout session. |

---

## AWS Resources

| Resource | ID/Value |
|----------|--------|
| Cognito User Pool | `us-east-1_bqEVRsi2b` |
| Lambda: awsprepai-checkout | Creates Stripe checkout session |
| Lambda: awsprepai-cancel-subscription | Cancels sub at period end (API Gateway behind it) |
| Lambda: awsprepai-verify-session | Session verification |
| Lambda: awsprepai-stripe-webhook | Stripe events → Cognito + DynamoDB |
| Lambda: awsprepai-db | DynamoDB CRUD (API Gateway behind it) |
| Lambda: awsprepai-ai-coach | AI Coach via Claude Haiku. **Lifetime-only.** |
| Lambda: awsprepai-upgrade-subscription | Upgrade with Stripe proration |
| IAM Role for Lambdas | `arn:aws:iam::441393059130:role/awsprepai-checkout-role` |
| DynamoDB: awsprepai-users | User records |
| DynamoDB: awsprepai-progress | (user_id PK, cert_id SK) — stores domain_scores map |
| DynamoDB: awsprepai-monthly-cert | Monthly cert selection per user |
| DynamoDB: awsprepai-free-usage | Free tier question count |
| DynamoDB: awsprepai-leads | Email capture (no auth) |
| DynamoDB: awsprepai-bundle-certs | Bundle cert selection (user_id PK) |
| API Gateway: DB | `https://dzhvi7oz29.execute-api.us-east-1.amazonaws.com` |
| API Gateway: Cancel | `https://hpcdl0ft8a.execute-api.us-east-1.amazonaws.com` |
| API Gateway: AI Coach | `https://hyb325gocg.execute-api.us-east-1.amazonaws.com` |
| API Gateway: Upgrade | `https://d8bmltyjpe.execute-api.us-east-1.amazonaws.com` |
| API Gateway: Stripe Webhook | `https://515bmmrebh.execute-api.us-east-1.amazonaws.com` |
| CloudFront | `E149XOHRPMJ4D1` → `d10nn383a5lev5.cloudfront.net` |

---

## Cognito Custom Attributes
- `custom:plan` — values: `free`, `monthly`, `bundle`, `yearly`, `lifetime`
- `custom:plan_expiry` — ISO date string
- `custom:stripe_customer_id` — Stripe cus_xxx ID

---

## Plan Tier System

```typescript
const TIER_RANK = { free: 0, monthly: 1, bundle: 1.5, yearly: 2, lifetime: 3 }
const isPremium = tier !== 'free'
const isFullAccess = tier === 'yearly' || tier === 'lifetime'
```

| Plan | Price | Access | AI Coach |
|------|-------|--------|----------|
| free | $0 | 20 sample questions | ❌ |
| monthly | $7/mo | 1 cert (pick from 12) | ❌ |
| bundle | $17/mo | 3 certs (pick from 12) | ❌ |
| yearly | $49/yr | All 12 certs | ❌ |
| lifetime | $97 once | All 12 certs | ✅ Widget on Dashboard |

---

## Navbar Logic (Tier-based)

| User State | Pricing Tab | AI Coach Tab | Billing in Dropdown |
|------------|-------------|--------------|---------------------|
| Logged out | ✅ Visible | ❌ | ❌ |
| Free | ✅ Visible | ❌ | ❌ |
| Monthly / Bundle / Yearly / Lifetime | ❌ Hidden | ❌ | ✅ |

---

## Stripe Keys

### Restricted key (active)
- Key: stored directly in Lambda env vars on `awsprepai-checkout` and `awsprepai-upgrade-subscription` — do NOT put key in files
- Permissions: Checkout Sessions Write, Customers Write, Subscriptions Write

### Webhook
- Endpoint: `https://515bmmrebh.execute-api.us-east-1.amazonaws.com`
- Secret stored as: `STRIPE_WEBHOOK_SECRET` in `awsprepai-stripe-webhook` Lambda

---

## Email Infrastructure (WorkMail)
- Domain: certiprepai.com
- Mailboxes: support@, noreply@, hello@
- DNS: MX, SPF, DKIM, DMARC, autodiscover records set in Route 53
- Statement descriptor on Stripe: CertiPrepAI

---

## Test Accounts
| Email | Plan | Notes |
|-------|------|-------|
| ihabsaloum@gmail.com | Free | Test account |
| ihabsaloum@hotmail.com | Monthly (paid) | Check Cognito before testing |

To restore plan manually:
```bash
aws cognito-idp admin-update-user-attributes \
  --user-pool-id us-east-1_bqEVRsi2b \
  --username ihabsaloum@hotmail.com \
  --user-attributes Name=custom:plan,Value=monthly
```

---

## Deployment
- **Auto-deploy:** push to `main` → Amplify builds in ~90 seconds
- **Check build:** `aws amplify list-jobs --app-id d2pm3jfcsesli7 --branch-name main --max-results 3`
- **Local build test:** `cd react-app && npm run build` (ALWAYS do this before pushing)
- **CloudFront invalidation:** `aws cloudfront create-invalidation --distribution-id E149XOHRPMJ4D1 --paths "/*"`

---

## ✅ Built This Session (April 28, 2026)

| # | Item | Details |
|---|------|---------|
| 1 | /billing page | `react-app/src/pages/Billing.tsx` — current plan card + upgrade options with prorated modal |
| 2 | /ai-coach page | `react-app/src/pages/AiCoach.tsx` — full-page chat, lifetime-only, redirects others to /dashboard |
| 3 | Navbar tier logic | Pricing tab hidden for all paid users. Billing link in dropdown for paid users. |
| 4 | Dashboard AI Coach | Yearly users: promo card removed. Lifetime users: widget unchanged. |
| 5 | AI Coach Lambda | Updated to lifetime-only gating (`custom:plan === 'lifetime'`) |
| 6 | EmailCapture redesign | Sticky bottom banner → centered modal popup (appears at 60% scroll) |
| 7 | No Refund Policy | Added as section 5 in Terms.tsx with 3-day free trial mention |
| 8 | Upgrade flow | awsprepai-upgrade-subscription Lambda + API Gateway. Prorated preview before charging. |
| 9 | Stripe business details | Statement descriptor → CertiPrepAI. Support email → support@certiprepai.com |
| 10 | WorkMail | certiprepai.com org. support@, noreply@, hello@ mailboxes. DNS in Route 53. |

---

## 🔲 What's Next (Backlog)

| Priority | Item |
|----------|------|
| 🔴 High | Rotate Anthropic API key (was exposed in terminal output) |
| 🔴 High | Render markdown in AI Coach responses (currently shows raw `##` and `**bold**`) |
| 🟡 Medium | Welcome email + drip sequence for new signups |
| 🟡 Medium | Analytics (Mixpanel or PostHog) |
| 🟡 Medium | Downgrade flow (yearly → monthly not yet built) |
| 🟢 Low | Move hardcoded API URLs back to env vars (fix Amplify build injection first) |
| 🟢 Low | CloudFront + WAF in front of API Gateway |

---

## Monthly AWS Cost (~$17-18/mo)
- WorkMail: ~$8 (for TaxFlowAI — keep it)
- Route 53: ~$5
- Amplify: ~$2
- Lambda/Cognito/DynamoDB: ~$1-2
- **CertiPrepAI itself: ~$0**

---

## Common Commands
```bash
# Check Cognito user
aws cognito-idp admin-get-user --user-pool-id us-east-1_bqEVRsi2b --username user@example.com

# Fix user plan manually
aws cognito-idp admin-update-user-attributes \
  --user-pool-id us-east-1_bqEVRsi2b \
  --username user@example.com \
  --user-attributes Name=custom:plan,Value=monthly

# Lambda logs
aws logs tail /aws/lambda/FUNCTION_NAME --since 10m

# Check Amplify builds
aws amplify list-jobs --app-id d2pm3jfcsesli7 --branch-name main --max-results 5

# Deploy Lambda (use coach.zip, NOT lambda.zip — turns into hyperlink in Claude)
zip -r coach.zip index.js node_modules/
aws lambda update-function-code --function-name FUNCTION_NAME --zip-file fileb://coach.zip

# CloudFront cache clear
aws cloudfront create-invalidation --distribution-id E149XOHRPMJ4D1 --paths "/*"

# Remove git lock
rm -f ~/Desktop/Projects/CertiPrepAI/.git/HEAD.lock
```
