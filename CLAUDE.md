# CertiPrepAI — Claude Context
_Last updated: 2026-04-16_

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

## Two Frontends
1. `docs/` — Static HTML (GitHub Pages). certiprepai.com/saa-c03.html etc. 288 SAA questions.
2. `react-app/` — Vite 8 + React → deployed via AWS Amplify. This is the main app.

---

## Key Files

| File | Purpose |
|------|---------|
| `react-app/src/lib/cognito.ts` | All auth functions. Email normalization MANDATORY. |
| `react-app/src/lib/db.ts` | DynamoDB API wrapper. Uses ACCESS token. DB_API hardcoded. |
| `react-app/src/pages/Login.tsx` | Email normalized on input onChange |
| `react-app/src/pages/Signup.tsx` | Email normalized on input onChange |
| `react-app/src/pages/Dashboard.tsx` | Plan display, cancel button, cert selection. CANCEL_API hardcoded. |
| `react-app/src/pages/Pricing.tsx` | Calls checkout Lambda to create Stripe session |
| `aws-lambdas/cancel-subscription/index.mjs` | Cancels Stripe sub (period end). Does NOT touch Cognito plan. |
| `aws-lambdas/awsprepai-db/index.js` | DynamoDB CRUD. Requires Cognito ACCESS token. |
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
| DynamoDB: progress | `awsprepai-progress` (user_id PK, cert_id SK) |
| DynamoDB: monthly cert | `awsprepai-monthly-cert` |
| DynamoDB: free usage | `awsprepai-free-usage` |
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

### 🔴 CRITICAL
1. **Rotate the new AWS key `AKIAWNRITSU5EHIVIZ2I`** — exposed in Claude chat on 2026-04-16. Create a new key, update `~/.aws/credentials`, delete this one immediately.
2. **Rotate Stripe secret key** — exposed in terminal screenshot during session. Go to Stripe dashboard → Developers → API keys → roll secret key → update Lambda env var `STRIPE_SECRET_KEY`.

### 🟡 IMPORTANT
3. **Password strength indicator on Signup.tsx** — Cognito enforces uppercase/lowercase/numbers/symbols/min 8 chars but UI shows cryptic error.

### 🟢 NICE TO HAVE
4. Move hardcoded API URLs back to env vars (fix Amplify build injection first)
5. CloudFront + WAF in front of API Gateway
6. Progress tracking on Dashboard (score + questions per cert)

---

## ✅ Fixed April 16, 2026

| # | Item | Fix |
|---|------|-----|
| 1 | Checkout Lambda `Runtime.UserCodeSyntaxError` | Fixed April 9 via deploy-checkout-lambda.sh — confirmed working |
| 2 | Cancel button badge | Implemented in Dashboard.tsx lines 195-204 — `cancelScheduled` toggles button/badge |
| 3 | Sitemap `sitemap.xml` serving HTML to Google | Root cause: CloudFront `E149XOHRPMJ4D1` caching old HTML. Fixed by invalidating `/*` on that distribution |
| 4 | Leaked AWS key `AKIAWNRITSU5DRQBL74S` | Deactivated + deleted |
| 5 | Unused CloudFront `E3885PO59ILHI0` | Deleted |

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
