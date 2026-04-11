# CertiPrepAI — Claude Code Context

## Project Overview
AWS certification prep SaaS. Live at **https://certiprepai.com**

| Field | Value |
|-------|-------|
| GitHub | https://github.com/Isaloum/CertiPrepAI |
| Active branch (deploy) | `main` |
| Amplify App ID | `d2pm3jfcsesli7` |
| AWS Account | `441393059130` (Fridayaiapp) |
| AWS Region | `us-east-1` |
| Cognito User Pool | `us-east-1_bqEVRsi2b` |
| Cognito Client ID | `4j9mnlkhtu023takbj0qb1g10h` |
| API Gateway | `34zglioc5a.execute-api.us-east-1.amazonaws.com` |
| CloudFront | `d2xfdvrubb6op2.cloudfront.net` (ID: `E3885PO59ILHI0`) |

## Architecture
- **`react-app/`** — React 19 + Vite 8 + TypeScript + Tailwind. Deployed via AWS Amplify (auto-deploy on push to `main`)
- **`aws-lambdas/`** — AWS Lambda functions (Node.js)
- **`docs/`** — Static HTML on GitHub Pages (legacy, keep for now)
- **`worker/`** — Cloudflare Worker for progress sync

## AWS Lambdas
| Name | File | Status | Code Size |
|------|------|--------|-----------|
| `awsprepai-checkout` | `amplify/functions/checkout/index.js` | ✅ Active | 1.9 MB |
| `awsprepai-db` | `aws-lambdas/awsprepai-db/index.js` | ✅ Active | 3.7 MB |
| `awsprepai-verify-session` | `aws-lambdas/verify-session/index.js` | ✅ Active | 5.6 MB |
| `awsprepai-cancel-subscription` | `aws-lambdas/cancel-subscription/index.mjs` | ✅ Active | 6.1 MB |
| `awsprepai-stripe-webhook` | `aws-lambdas/stripe-webhook/index.js` | ✅ Active | 5.6 MB |

## Cognito Custom Attributes
- `custom:plan` — `free | monthly | yearly | lifetime`
- `custom:plan_expiry` — ISO date string
- `custom:stripe_customer_id` — Stripe `cus_xxx` ID

## Environment Variables

### Amplify Console (react-app)
Set at: AWS Amplify → CertiPrepAI → main branch → Environment variables
```
VITE_COGNITO_USER_POOL_ID   = us-east-1_bqEVRsi2b
VITE_COGNITO_CLIENT_ID      = 4j9mnlkhtu023takbj0qb1g10h
VITE_STRIPE_PUBLISHABLE_KEY = pk_live_51T0D2ZE9neqrFM5L...
VITE_DB_API_URL             = https://d2xfdvrubb6op2.cloudfront.net
VITE_CHECKOUT_API           = https://d2xfdvrubb6op2.cloudfront.net/checkout
VITE_CANCEL_API             = https://d2xfdvrubb6op2.cloudfront.net/cancel
VITE_VERIFY_SESSION_URL     = https://d2xfdvrubb6op2.cloudfront.net/verify
```

### Lambda Env Vars
```
awsprepai-checkout:             STRIPE_SECRET_KEY, APP_URL
awsprepai-cancel-subscription:  STRIPE_SECRET_KEY, COGNITO_USER_POOL_ID, COGNITO_CLIENT_ID
```

## IAM Role for Lambdas
`arn:aws:iam::441393059130:role/awsprepai-checkout-role`

---

## Current Status (as of April 11, 2026)

### ✅ Done
- Login fixed (email normalization `.trim().toLowerCase()` in cognito.ts, Login.tsx, Signup.tsx)
- Password policy enforced in Cognito (uppercase + lowercase + numbers + symbols)
- Study Guide page added (`/study-guide`)
- CORS fix committed for `awsprepai-db` and `awsprepai-verify-session` (added `certiprepai.com`)
- Cancel subscription Lambda + cancel button + confirmation modal in `Dashboard.tsx`
- Password strength indicator added to `Signup.tsx`
- `CHECKOUT_API` moved to `VITE_CHECKOUT_API` env var in `Pricing.tsx` and `Signup.tsx`
- MFA (TOTP) support added — setup, login flow, Dashboard toggle
- Progress tracking added — per-cert bars in Dashboard, updates on every answer
- docs/ pages replaced with redirect stubs → certiprepai.com
- CloudFront distribution in front of all Lambda URLs — POST allowed on default behavior ✓
- awsprepai-db tokenUse fixed ('access' → 'id' to match frontend ID token)
- All Lambdas redeployed with node_modules bundled ✅
- Footer: GitHub link removed, support@certiprepai.com added
- Home.tsx: mock exam timer corrected to 130 min
- Mock Exam: dark navy header + red EXAM badge
- Practice Quiz: green PRACTICE badge
- **Architecture Diagrams (`/diagrams`) — full professional SVG renderer** (Deployment ~200)
  - Ray-box intersection for exact arrow connection points
  - Straight lines only — NO curves, NO bezier
  - Per-node gradient fills + drop shadows
  - Dynamic label pill offset: `lo = max(42, lw/2 * |px| + 11 * |py| + 10)` — pills never overlap arrows
  - viewBox auto-centers content with PAD=70
  - All 11 diagrams redesigned with symmetric, grid-based layouts
- **VisualExam diagrams** — same professional renderer applied to all 3 arch diagrams
- **SEO** — `sitemap.xml` and `robots.txt` live in `react-app/public/`
  - Site already indexed on Google, showing 2 results ✅
  - Sitemap includes all real public pages only

**IMPORTANT — Always `npm install` + `zip -r` for Lambdas**
Lambda runtime does NOT include third-party packages. Always bundle node_modules:
```bash
# Template for any Lambda redeploy:
cd ~/Desktop/Projects/CertiPrepAI/aws-lambdas/<lambda-dir>
npm install
zip -r <name>-lambda.zip index.js node_modules   # or index.mjs
aws lambda update-function-code --function-name <function-name> --zip-file fileb://<name>-lambda.zip
```

**IMPORTANT — Diagram renderer key facts**
- File: `react-app/src/pages/Diagrams.tsx` — `DiagramSVG` function
- File: `react-app/src/pages/VisualExam.tsx` — `ArchDiagram` function (same renderer)
- Node width: `NW=140`, height: 40 (1 line) / 54 (2 lines) / 68 (3 lines)
- Bidirectional edges: offset ±9px perpendicular — always check for visual crossing
- Label pill: `lo = Math.max(42, lw/2 * Math.abs(px) + 11 * Math.abs(py) + 10)`
- When adding new diagrams: space nodes ≥200px apart horizontally, use grid layouts not triangles

**IMPORTANT — Git + Amplify deployment**
- Sandbox git commits do NOT auto-push to GitHub — user must `git pull && git push` from their terminal
- If Amplify doesn't trigger after push: `git commit --allow-empty -m "trigger redeploy" && git push`
- CloudFront cache (Amplify CDN ID: `E149XOHRPMJ4D1`) must be invalidated after each deploy:
```bash
git push origin main && sleep 100 && aws cloudfront create-invalidation --distribution-id E149XOHRPMJ4D1 --paths "/*"
```
- If `.git/HEAD.lock` blocks commit: `rm -f .git/HEAD.lock .git/index.lock`

### 🟡 Important — This Week
- Increase Lambda concurrency: Service Quotas → Lambda → Request increase to 1000
- MFA end-to-end testing (TOTP setup + login flow)
- Submit sitemap to Google Search Console → Sitemaps → `https://certiprepai.com/sitemap.xml`

### 🟢 Nice to Have
- Analytics instrumentation (Plausible or similar, free tier)
- More question banks (currently 260/cert)

---

## Key Patterns — Read Before Touching Anything

- **ALWAYS** `.trim().toLowerCase()` before passing email to Cognito. macOS autocorrects capitals.
- **Vite 8 uses Rolldown** (Rust bundler). `base: "/"` in vite.config is required for Amplify asset paths.
- **`admin-set-user-password --permanent`** not `admin-reset-user-password` (reset blocks login with RESET_REQUIRED status)
- **Deploy branch is `main`** — Amplify auto-deploys on push to main (~90s)
- **CertiPrepAI costs $0/mo** — Amplify, Lambda, Cognito, API Gateway all within free tier
- **Monthly AWS bill ~$14-17** (WAF $6, WorkMail $3.89, VPC $3.21, Route53 $0.51, Secrets Manager $0.40)
- **Budget: $20/mo** — CloudFront (~$1-2 extra) fits, don't add anything else
- **awsprepai-db uses ID token** (`tokenUse: 'id'`) — frontend sends `user.idToken`, not `user.accessToken`
- **CloudFront default behavior must allow POST** — GET/HEAD only by default, causes 403

## Test Accounts
| Email | Password | Plan | Notes |
|-------|----------|------|-------|
| ihabsaloum85@gmail.com | (owner) | Free | Owner account |
| ihabsaloum@hotmail.com | CertiPrep@2026! | monthly (manual) | Internal test |
| tester1.taxflow@gmail.com | CertiPrep@Tester1! | lifetime | Shared tester account — send to testers |

## Common Commands
```bash
# Local dev
cd ~/Desktop/Projects/CertiPrepAI/react-app && npm run dev

# Build
npm run build

# Deploy (Amplify auto-deploys on push)
git add <files> && git commit -m "message" && git push origin main

# Check Amplify build
aws amplify get-job --app-id d2pm3jfcsesli7 --branch-name main --job-id <N>

# Get Cognito user
aws cognito-idp admin-get-user \
  --user-pool-id us-east-1_bqEVRsi2b \
  --username email@example.com

# Set plan manually
aws cognito-idp admin-update-user-attributes \
  --user-pool-id us-east-1_bqEVRsi2b \
  --username email@example.com \
  --user-attributes Name=custom:plan,Value=monthly

# Reset password (use --permanent, NOT admin-reset-user-password)
aws cognito-idp admin-set-user-password \
  --user-pool-id us-east-1_bqEVRsi2b \
  --username email@example.com \
  --password "NewPass@2026!" --permanent
```
