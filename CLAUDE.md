# CertiPrepAI — Claude Context
_Last updated: 2026-05-01 (session 3)_

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
| `react-app/src/components/Navbar.tsx` | Nav. Pricing hidden for paid. Billing shown for paid. AI Coach for lifetime only. Dropdown items have `badge` field (amber pill) — SAA-C03 on Architecture Builder + Visual Exam, AIF-C01 on Prompt Patterns. |
| `react-app/src/pages/Login.tsx` | Email normalized on input onChange. |
| `react-app/src/pages/Signup.tsx` | Email normalized. Password strength indicator. |
| `react-app/src/pages/Dashboard.tsx` | Plan display, cert selection, Skill Radar Chart. AI Coach widget for lifetime only. Cancel button REMOVED. |
| `react-app/src/pages/Pricing.tsx` | Checkout + upgrade flows. Upgrade buttons with prorated preview modal. |
| `react-app/src/pages/Billing.tsx` | ✅ NEW — /billing page. Current plan + upgrade options for paying users. |
| `react-app/src/pages/AiCoach.tsx` | ✅ NEW — /ai-coach full page. Lifetime only (redirects others to /dashboard). |
| `react-app/src/pages/PromptPatterns.tsx` | ✅ NEW — /prompt-patterns. AIF-C01 prompt engineering reference. isPremium gate. 5 tabs: Techniques (10), Parameters (7), Problems & Fixes (9), Security (6), Bedrock (6). 38 items total. |
| `react-app/src/pages/Keywords.tsx` | Cert switcher: SAA-C03 ↔ AIF-C01. `saacKeywords` + `aifKeywords` (48 AIF items). `SAA_CATEGORIES` + `AIF_CATEGORIES`. |
| `react-app/src/pages/ServiceGroups.tsx` | Cert switcher: SAA-C03 ↔ AIF-C01. `SAA_GROUPS` + `AIF_GROUPS` (4 groups, 28 AI services). |
| `react-app/src/pages/ServiceComparison.tsx` | isPremium gate added. Cert switcher: SAA-C03 ↔ AIF-C01. `AIF_DATA` (15 comparisons, 5 groups). |
| `react-app/src/pages/ArchitectureBuilder.tsx` | SAA-C03 badge in hero. Drag-and-drop canvas. SAA-C03 services only. |
| `react-app/src/pages/VisualExam.tsx` | SAA-C03 badge next to title. Diagram connect questions. SAA-C03 only. |
| `react-app/src/pages/CertDetail.tsx` | Practice mode. Bookmark questions. Retry wrong answers. Free tier 20q gating. |
| `react-app/src/pages/MockExam.tsx` | Timed mock exam. Saves per-domain scores. Monthly/bundle gating. |
| `react-app/src/pages/CheatSheets.tsx` | All 12 cert cheat sheets. 5 tabs per cert. |
| `react-app/src/pages/ForgotPassword.tsx` | 3-step forgot password flow. |
| `react-app/src/components/SEOMeta.tsx` | Per-route meta tags + JSON-LD schemas. |
| `react-app/src/components/SkillRadarChart.tsx` | Radar chart using real per-domain DynamoDB scores. |
| `react-app/src/components/EmailCapture.tsx` | Centered modal popup at 60% scroll. Saves to awsprepai-leads. No auth required. Hidden for logged-in users. |
| `react-app/src/components/MarkdownRenderer.tsx` | Lightweight markdown renderer for AI Coach. No deps. Handles headers, bold, italic, code blocks, lists. |
| `react-app/src/components/Footer.tsx` | Auth-aware footer. Hides Sample Questions + shows Manage Subscription for paid users. |
| `aws-lambdas/ai-coach/index.js` | AI Coach Lambda. Lifetime-only gating (`custom:plan === 'lifetime'`). |
| `aws-lambdas/cancel-subscription/index.mjs` | Cancels Stripe sub (period end). Does NOT touch Cognito plan. |
| `aws-lambdas/upgrade-subscription/index.mjs` | Handles preview + execute for plan upgrades with Stripe proration. |
| `aws-lambdas/awsprepai-db/index.js` | DynamoDB CRUD. `capture_lead` requires NO auth. All others require ACCESS token. |
| `aws-lambdas/stripe-webhook/index.js` | Handles Stripe webhook → writes plan to Cognito + DynamoDB at period end. |
| `aws-lambdas/checkout/index.js` | Creates Stripe checkout session. |
| `aws-lambdas/email-drip/index.mjs` | 3-email drip sequence (welcome, day3, day7). Triggered by awsprepai-db after capture_lead. Uses SES + EventBridge Scheduler. FROM: hello@certiprepai.com. |

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
| DynamoDB: awsprepai-users | ⚠️ Does NOT exist — user data stored in Cognito attributes only |
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
| yearly | $67/yr | All 12 certs | ❌ |
| lifetime | $147 once | All 12 certs | ✅ Widget on Dashboard |

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
| testuser@certiprepai.com | Monthly | Password: `Test1234!` — created 2026-05-01 for premium feature testing |

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
| 3 | Navbar tier logic | Pricing tab hidden for paid. Sample Questions hidden for paid. Billing shown for paid. |
| 4 | Dashboard AI Coach | Cancel button removed. Lifetime: AI Coach widget. Yearly: upgrade prompt removed. |
| 5 | AI Coach Lambda | Lifetime-only gating (`custom:plan === 'lifetime'`) |
| 6 | AI Coach markdown | MarkdownRenderer.tsx — renders headers, bold, code blocks, lists in AI responses |
| 7 | CloudFront 404 fix | Custom error responses: 404+403 → /index.html (200). Fixes SPA hard refresh. |
| 8 | Pricing fixes | Yearly: $67/yr. Lifetime: $147. AI Coach removed from yearly description. |
| 9 | Auth-aware UI | Home, About, Footer, SampleQuestions, ServiceGroups all show different CTAs for paid vs free users |
| 10 | Billing cancel note | Changed from "go to dashboard" → "email support@certiprepai.com" |
| 11 | Broken links fixed | ServiceGroups `/practice` → `/certifications` |
| 12 | EmailCapture redesign | Sticky bottom banner → centered modal popup (appears at 60% scroll) |
| 13 | No Refund Policy | Added as section 5 in Terms.tsx |
| 14 | Upgrade flow | awsprepai-upgrade-subscription Lambda + API Gateway. Prorated preview before charging. |
| 15 | WorkMail | certiprepai.com org. support@, noreply@, hello@ mailboxes. DNS in Route 53. |
| 16 | Paid-user UI cleanup | Home: pricing teaser hidden for paid. Pricing: bottom CTA → "Go to Certifications". SampleQuestions: redirect paid to /certifications. Comparisons: bottom CTA → "Go to Your Certifications" for paid. |

---

## ✅ Built This Session (May 1, 2026)

| # | Item | Details |
|---|------|---------|
| 1 | Prompt Patterns page | `/prompt-patterns` — 5 tabs, 38 items total. isPremium gate. Covers AIF-C01 Domains 2, 4 & 5. |
| 2 | Prompt Patterns: Techniques | 10 techniques: Zero-Shot, Few-Shot, CoT, ReAct, Prompt Chaining, Tree of Thought, Role, Instruction, Context Injection, Structured Output |
| 3 | Prompt Patterns: Parameters | 7 parameters: Temperature, Top-p, Top-k, Max Tokens, Stop Sequences, Repetition Penalty, Beam Search |
| 4 | Prompt Patterns: Problems | 9 failure modes: Hallucination, Verbose, Wrong Format, Off-Topic, Inconsistent Persona, Context Overflow, Safety False Positive, Lost in the Middle, Repetitive Output |
| 5 | Prompt Patterns: Security | 6 risks: Prompt Injection, Indirect Prompt Injection, Jailbreaking, Sensitive Data Leakage, Data Poisoning, Excessive Agency |
| 6 | Prompt Patterns: Bedrock tab | NEW 5th tab — 6 items: System Prompt vs User Message API, Guardrails config, Knowledge Bases vs Agents, Model selection, Token economics, Fine-tuning vs RAG decision tree |
| 7 | AIF-C01 Keywords | Keywords.tsx cert switcher: SAA-C03 ↔ AIF-C01. 48 AIF-C01 keywords across 5 categories. |
| 8 | AIF-C01 Service Groups | ServiceGroups.tsx cert switcher. AIF_GROUPS: 4 groups, 28 AI/ML services. |
| 9 | AIF-C01 Service Comparison | ServiceComparison.tsx cert switcher + isPremium gate (was unprotected). AIF_DATA: 15 comparisons. |
| 10 | Stripe webhook secret rotated | Leaked secret removed from docs-project/README.md. New secret `whsec_A1seLNW08cP1cUDmRGp82PNvPNcUOQ1W` stored in Lambda env only. |
| 11 | CLAUDE.md prompt templates | 5 reusable prompt templates added: New Page, New Lambda, UI Change, Gating, Deploy & Ship. |
| 12 | Test account created | `testuser@certiprepai.com` / `Test1234!` — plan: monthly. Use for premium feature testing. |
| 13 | SAA-C03 badges | Architecture Builder + Visual Exam: orange SAA-C03 badge in page hero + amber pill in navbar dropdown. |
| 14 | Navbar dropdown badges | `badge` field added to practiceItems/studyItems. Amber pill renders when badge is non-empty. AIF-C01 on Prompt Patterns. |

---

## 🔲 What's Next (Backlog)

| Priority | Item |
|----------|------|
| 🔴 High | Manually verify Stripe prices in dashboard: $7/mo, $17/mo, $67/yr, $147 lifetime (restricted key can't read prices via API) |
| 🟡 Medium | CLF-C02 study tools — Keywords + Service Groups for highest-volume entry-level cert |
| 🟡 Medium | Downgrade flow (yearly → monthly not yet built) |
| 🟡 Medium | Analytics already integrated (PostHog `phc_vQkqAhkS2zJBrqL5roLz8iquSgXWuucyBodeyNH99dsS`) — review dashboards |
| 🟢 Low | Move hardcoded API URLs back to env vars (fix Amplify build injection first) |
| 🟢 Low | WAF in front of API Gateway (rate limiting, DDoS protection) |

## ⚠️ Deploy Checklist (run after every push)
```bash
git push origin main
# wait ~90s for Amplify build
aws cloudfront create-invalidation --distribution-id E149XOHRPMJ4D1 --paths "/*"
# test in fresh incognito window
```

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

---

## 🧠 How to Prompt Claude for This Project

Use these templates every time you ask Claude to build something.
The more specific the prompt, the less back-and-forth needed.

---

### 🟦 Template 1 — New Page

```
Create a new page at `react-app/src/pages/[PageName].tsx`.

- Route: /[route-name] (add to react-app/src/App.tsx)
- Pattern: same structure as [ClosestExistingPage].tsx
- Access: [free | isPremium | isFullAccess | tier === 'lifetime']
  → if blocked: redirect to [/pricing | /dashboard]
- Data: [fetches from DB_API using user.accessToken | no data needed | static content]
- SEO: add entry to react-app/src/components/SEOMeta.tsx ROUTE_META
- Nav: [add to Navbar under section X | no nav change needed]
- Do NOT: [add anything to Dashboard | change auth logic | touch cognito.ts]
```

---

### 🟩 Template 2 — New Lambda

```
Create a new Lambda at `aws-lambdas/[function-name]/index.js`.

- Function name: awsprepai-[function-name]
- Trigger: API Gateway HTTP (method: POST | GET)
- Auth: [Cognito ACCESS token in Authorization header | no auth required]
- Input: { field1, field2 } in request body
- Output: { result } JSON
- AWS services used: [DynamoDB table X | SES | Stripe | Cognito]
- Error handling: return 400 for missing fields, 401 for bad token, 500 for AWS errors
- Do NOT: use idToken — always ACCESS token for Cognito GetUserCommand
- Zip: coach.zip (never lambda.zip)
```

---

### 🟨 Template 3 — UI Change / Feature Tweak

```
In `react-app/src/pages/[File].tsx`:

- Find: [describe the section or paste the exact text]
- Change: [what to change and why]
- Access rule: [keep existing | change to isPremium | lifetime only]
- Style: match existing inline style pattern (no CSS modules, no Tailwind)
- Do NOT: change any other file unless I list it here
```

---

### 🟥 Template 4 — Gating / Access Control

```
Gate [feature/page/component] behind [isPremium | isFullAccess | tier === 'lifetime'].

- File: react-app/src/pages/[File].tsx
- Import: { isPremium } from useAuth() — already in AuthContext
- If blocked: show paywall card with [lock emoji + message + "See Plans →" button → /pricing]
- Paywall pattern: same as Keywords.tsx
- Do NOT change the underlying data fetching — only wrap in the gate
```

---

### 🟪 Template 5 — Deploy & Ship

```
Build and deploy this change:

1. Run local build: cd react-app && npm run build
2. Fix any TypeScript errors (no unused vars — TS6133 fails Amplify)
3. git add [specific files only]
4. git commit -m "[short description]"
5. git push origin main
6. Wait ~90s for Amplify build
7. Invalidate CloudFront: aws cloudfront create-invalidation --distribution-id E149XOHRPMJ4D1 --paths "/*"
8. Test in fresh incognito window at https://certiprepai.com
```

---

### ✅ Golden Rules for All Prompts

| Rule | Why |
|------|-----|
| Always name the exact file path | No guessing where it goes |
| Say "same pattern as X.tsx" | Claude mirrors structure, imports, style |
| Specify the access tier explicitly | isPremium ≠ isFullAccess ≠ lifetime |
| List every file that needs updating | Routes, Nav, SEO — Claude won't assume |
| End with "Do NOT touch X" | Prevents unintended side effects |
| One feature per prompt | Easier to review, easier to roll back |
