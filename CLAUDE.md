# CertiPrepAI — Claude Context
_Last updated: 2026-04-20_

## What this project is
AWS certification prep SaaS. Two frontends, one backend on AWS.
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
- Do NOT revert to env vars unless you fix Amplify build injection first.

### 4. Lambda zips must include node_modules
The cancel-subscription Lambda uses: `stripe`, `aws-jwt-verify`, `@aws-sdk/client-cognito-identity-provider`
Always: `npm install` then `zip -r lambda.zip index.mjs node_modules/` before deploying.

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

---

## One Frontend (migration complete April 2026)
- `docs/` — All static HTML files deleted. Only CNAME, favicon, robots.txt, sitemap.xml remain.
- `react-app/` — Vite 8 + React → deployed via AWS Amplify. This is the ONLY frontend.

---

## Key Files

| File | Purpose |
|------|---------|
| `react-app/src/lib/cognito.ts` | All auth functions. Email normalization MANDATORY. |
| `react-app/src/lib/db.ts` | DynamoDB API wrapper. Uses ACCESS token. DB_API hardcoded. `saveExamResult` for domain tracking. |
| `react-app/src/pages/Login.tsx` | Email normalized on input onChange. Forgot password → /forgot-password |
| `react-app/src/pages/Signup.tsx` | Email normalized on input onChange. Password strength indicator. |
| `react-app/src/pages/Dashboard.tsx` | Plan display, cancel button, cert selection. Skill Radar Chart. CANCEL_API hardcoded. |
| `react-app/src/pages/Pricing.tsx` | Calls checkout Lambda to create Stripe session |
| `react-app/src/pages/CertDetail.tsx` | Practice mode. Bookmark questions (localStorage). Retry wrong answers. Free tier 20q gating. |
| `react-app/src/pages/MockExam.tsx` | Timed mock exam. Saves per-domain scores via saveExamResult. |
| `react-app/src/pages/CheatSheets.tsx` | All 12 cert cheat sheets. 5 tabs: Domains, Top Services, Choose When, Traps, Patterns. |
| `react-app/src/pages/ForgotPassword.tsx` | 3-step forgot password flow (email → code → new password). |
| `react-app/src/components/SEOMeta.tsx` | Per-route meta tags + JSON-LD (WebSite, FAQPage, Course schemas). |
| `react-app/src/components/SkillRadarChart.tsx` | Radar chart using real per-domain DynamoDB scores. |
| `react-app/src/components/EmailCapture.tsx` | Sticky bottom banner. Captures email → awsprepai-leads DynamoDB. No auth required. |
| `aws-lambdas/cancel-subscription/index.mjs` | Cancels Stripe sub (period end). Does NOT touch Cognito plan. |
| `aws-lambdas/awsprepai-db/index.js` | DynamoDB CRUD. `capture_lead` action requires NO auth. All others require ACCESS token. |
| `aws-lambdas/stripe-webhook/` | Handles Stripe webhook → writes plan to Cognito + DynamoDB at period end |

---

## AWS Resources

| Resource | ID/ARN |
|----------|--------|
| Cognito User Pool | `us-east-1_bqEVRsi2b` |
| Lambda: checkout | `awsprepai-checkout` |
| Lambda: cancel-subscription | `awsprepai-cancel-subscription` (behind API Gateway) |
| Lambda: verify-session | `awsprepai-verify-session` |
| Lambda: stripe-webhook | `awsprepai-stripe-webhook` |
| Lambda: awsprepai-db | `awsprepai-db` (behind API Gateway) |
| IAM Role for Lambdas | `arn:aws:iam::441393059130:role/awsprepai-checkout-role` |
| DynamoDB: users | `awsprepai-users` |
| DynamoDB: progress | `awsprepai-progress` (user_id PK, cert_id SK) — stores domain_scores map |
| DynamoDB: monthly cert | `awsprepai-monthly-cert` |
| DynamoDB: free usage | `awsprepai-free-usage` |
| DynamoDB: leads | `awsprepai-leads` (email PK) — email capture, no auth required |
| API Gateway: DB | `https://dzhvi7oz29.execute-api.us-east-1.amazonaws.com` |
| API Gateway: Cancel | `https://hpcdl0ft8a.execute-api.us-east-1.amazonaws.com` |

---

## Cognito Custom Attributes
- `custom:plan` — values: `free`, `monthly`, `yearly`
- `custom:plan_expiry` — ISO date string
- `custom:stripe_customer_id` — Stripe cus_xxx ID

---

## What Was Fixed (April 5–9, 2026)

| # | Problem | Root Cause | Fix |
|---|---------|------------|-----|
| 1 | Dashboard CORS errors | Lambda missing npm packages in zip | Bundled stripe + aws-jwt-verify + @aws-sdk into zip |
| 2 | API URLs not loading | Amplify not injecting VITE_* vars into Vite build | Hardcoded API Gateway URLs directly in source |
| 3 | DB API returning 401 | Dashboard passed `user.idToken` but DB Lambda needs access token | Changed to `user.accessToken` on lines 68+73 of Dashboard.tsx |
| 4 | DB API returning 400 | `getAllProgress()` sent action `get_progress` — not handled in Lambda | Added `get_progress` + `update_progress` handlers to awsprepai-db |
| 5 | Cancel immediately downgraded plan | Lambda was calling AdminUpdateUserAttributes to set plan=free | Removed that block — Stripe webhook handles it at period end |
| 6 | Cancel logged user out | Frontend called `signOut()` after cancel success | Replaced with `setShowCancelModal(false)` + `setCancelScheduled(true)` |
| 7 | Cert box popped in with delay | Rendered only when `monthlyCert !== undefined` | Added skeleton loader when `monthlyCert === undefined` |
| 8 | Browser serving stale bundle | Amplify cache + browser cache | Triggered RELEASE job + fresh incognito window |

---

## What's Still Pending

### 🟢 NICE TO HAVE
1. Move hardcoded API URLs back to env vars (fix Amplify build injection first)
2. CloudFront + WAF in front of API Gateway
3. Streak tracking / gamification

---

## ✅ Fixed April 16–17, 2026

| # | Item | Fix |
|---|------|-----|
| 1 | Checkout Lambda `Runtime.UserCodeSyntaxError` | Fixed April 9 via deploy-checkout-lambda.sh — confirmed working |
| 2 | Cancel button badge | Implemented in Dashboard.tsx — `cancelScheduled` toggles button/badge |
| 3 | Sitemap `sitemap.xml` serving HTML to Google | CloudFront `E149XOHRPMJ4D1` cache invalidated |
| 4 | Leaked AWS key `AKIAWNRITSU5DRQBL74S` | Deactivated + deleted |
| 5 | Unused CloudFront `E3885PO59ILHI0` | Deleted |
| 6 | Password strength indicator | Live bar + checklist on Signup.tsx |
| 7 | Skill Radar Chart on Dashboard | Cert dropdown, real domain weights, live DynamoDB scores |
| 8 | Progress cards on Dashboard | Empty state, 72% passing marker, color-coded score pill |
| 9 | DB_API env var not injected | Hardcoded URL in db.ts (matches CANCEL_API pattern) |
| 10 | Leaked AWS key `AKIAWNRITSU5EHIVIZ2I` + Stripe key | Rotated by user |
| 11 | Tutorials Dojo/Udemy references | Removed from Comparisons, Glossary, Resources pages |
| 12 | Question count 3,120 → 3,958 | Updated across all HTML + React files (SAA-C03 has 1,098) |

## ✅ Built April 18–20, 2026

| # | Item | Details |
|---|------|---------|
| 1 | Full static → React migration | All 30 HTML files deleted. docs/ is now redirect stubs only. |
| 2 | SEO meta tags per route | SEOMeta.tsx — title, description, og:*, twitter:*, canonical on all 26 routes |
| 3 | Forgot password page | /forgot-password — 3-step flow: email → code → new password |
| 4 | Per-domain progress tracking | MockExam saves domain_scores → DynamoDB → Radar chart reads real scores |
| 5 | All 12 cert cheat sheets | /cheat-sheets — 5 tabs per cert: Domains, Top Services, Choose When, Traps, Patterns |
| 6 | Retry Wrong Answers | CertDetail results screen — red banner + retry button drills only wrong questions |
| 7 | Bookmark questions | 🔖 button per question → localStorage → "Bookmarked" filter pill in domain bar |
| 8 | Free tier gating fix | Removed immediate /pricing redirect — users now get 20 questions with escalating urgency UI |
| 9 | Social proof on landing | Trust bar (avatars + rating) + 6 testimonial cards on Home.tsx |
| 10 | JSON-LD structured data | WebSite schema everywhere, FAQPage on /, Course schema on /cert/* pages |
| 11 | Email capture banner | Appears at 60% scroll — saves to awsprepai-leads DynamoDB — no auth required |

---

## Test Accounts
| Email | Plan | Notes |
|-------|------|-------|
| ihabsaloum@gmail.com | Free | Test account |
| ihabsaloum@hotmail.com | Monthly (paid) | Manually restored multiple times during debugging — check Cognito before testing |

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
- **Deploy command:** `git add . && git commit -m "fix: description" && git push origin main`
- **Check build:** `aws amplify list-jobs --app-id d2pm3jfcsesli7 --branch-name main --max-results 3`
- **Get build error:** `aws amplify get-job --app-id d2pm3jfcsesli7 --branch-name main --job-id JOB_ID --query 'job.steps[?stepName==\`BUILD\`].logUrl' --output text | xargs curl -s | tail -50`

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

# Deploy Lambda (from Lambda folder)
zip -r lambda.zip index.mjs node_modules/
aws lambda update-function-code --function-name FUNCTION_NAME --zip-file fileb://lambda.zip
```
