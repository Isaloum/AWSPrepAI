# AWSPrepAI

**Date:** 2026-03-24
**Status:** In Progress

## Folder Structure

```
AWSPrepAI/
├── 00-brief/         → Working brief & discovery answers
├── 01-strategy/      → Product strategy, MVP definition
├── 02-ux/            → User flows, screen list
├── 03-architecture/  → Tech stack, system design, data model
├── 04-execution/     → Milestones, build checklist, risks
├── 05-gtm/           → Positioning, analytics plan
├── 06-build/         → Production code
└── docs/             → Live site source (GitHub Pages)
```

## Progress

✅ Phase 0 — Setup
🔲 Phase 1 — Discovery
🔲 Phase 2 — Strategy
🔲 Phase 3 — Architecture
🔲 Phase 4 — Execution Plan
🔲 Phase 5 — Go To Market
🔲 Phase 6 — Build

## What Was Built (2026-03-24)

### ✅ Access Control — All 12 Cert Pages Wired

**Root cause fixed:** All 10 paid cert pages had `payment-system.js` loading AFTER `initPremiumCheck()` was called → function undefined → gate never opened for paid users.

**Changes made:**

| File | Fix |
|------|-----|
| `clf-c02.html` | Fixed script load order |
| `dva-c02.html` | Fixed script load order |
| `soa-c02.html` | Fixed script load order |
| `sap-c02.html` | Fixed script load order |
| `dop-c02.html` | Fixed script load order |
| `scs-c03.html` | Fixed script load order |
| `ans-c01.html` | Fixed script load order |
| `mla-c01.html` | Fixed script load order |
| `dea-c01.html` | Fixed script load order |
| `gai-c01.html` | Fixed script load order |
| `aif-c01.html` | Added `payment-system.js` + `requiresPremium` + `showPremiumOverlay` + section gate |
| `saa-c03.html` | Added `payment-system.js` + 5-question free limit + mock exam premium gate + upgrade wall |

**How gating works now:**
- **11 paid certs**: clicking Practice or Mock tab shows `showPremiumOverlay()` if not premium
- **SAA-C03 (free)**: practice pool is filtered to 5 questions for free users via `filterQuestionsForUser()`; upgrade wall fires after last free question; mock requires premium
- **chat.html (AI Coach)**: was already correctly wired ✅

## What Remains (from Roadmap)

⚠️ `REPLACE_WITH_17_BUNDLE_PRICE_ID` still missing in `payment-system.js` line 15
🔲 Subscription cancellation → revoke tier in Supabase on `customer.subscription.deleted`
🔲 Exam history: cert pages need to write to `_apa_history` on mock complete
🔲 Progress sync: wire `syncProgressDebounced` + `loadProgressForCert` in all cert pages
🔲 Monthly tier cert selection (which cert does $7/mo unlock?)
🔲 Password reset flow — verify Supabase redirect URL
🔲 Newsletter capture function (`capture-email` Netlify function)
🔲 Fix share links on `success.html` (still say SAA-C03)

## Next Step

Deploy to GitHub Pages using the write-tree push protocol from the roadmap.
