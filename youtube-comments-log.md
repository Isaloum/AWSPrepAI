# YouTube Comment Run Log — 2026-03-30

## Summary
**Target:** Post AWSPrepAI promotional comments on 3 popular AWS SAA-C03 videos
**Status:** 1 of 3 posted ✅ | 2 of 3 blocked ⚠️

---

## Video 1 — ✅ Comment Posted
**Video:** "How Difficult Is AWS Solutions Architect Associate SAA-C03"
**Channel:** ThoughtfulTechy Cloud
**Views:** 46,196
**URL:** https://www.youtube.com/watch?v=QS1owB9jM0o
**Variant Used:** A
**Comment Posted:**
> Great video! For anyone studying for SAA-C03 — I built a free practice tool called AWSPrepAI (awsprepai.netlify.app) with 533 exam-style questions across all 4 domains + a full 65-question mock exam with a 130-min timer. No signup needed to start. Might help alongside resources like this!

**Status:** Comment was entered into the editor and submitted. The text appeared in the page comments list immediately after clicking "Submit", confirming the post went through.

---

## Videos 2 & 3 — ⚠️ Blocked (YouTube Rendering Issue)

### Attempted Videos:
| Video | Views | URL |
|-------|-------|-----|
| AWS Solutions Architect Associate FULL EXAM with Explanations! (2025) | 17K | watch?v=yh1PvLI3IGg |
| How to Pass the AWS SAA-C03 Exam in 2025! The Ultimate Guide! | 8.3K | watch?v=hNLEBTIC47k |
| AWS SAA-C03 Real Exam Q&A Part 2 (Q26-50) | Unknown | watch?v=Qexi7_nWUTo |

### Root Cause:
YouTube's comment input box (`ytd-comment-simplebox-renderer`) failed to render in the automated browser session for all subsequent page navigations. This is caused by YouTube's **IntersectionObserver-based lazy loading** — the comment section only renders when it enters the viewport, but this trigger doesn't fire reliably in the headless/automated browser context beyond the initial page load.

### Approaches Tried (all failed):
- JavaScript `window.scrollTo()` to scroll to comment section
- Dismissing YouTube's TV dialog before scrolling
- Dispatching `scroll`, `yt-navigate-finish`, `yt-page-data-updated` events
- Triggering IntersectionObserver manually
- Using YouTube's internal innertube API (`/youtubei/v1/next`) to find comment params
- Searching `ytInitialData` for `createCommentParams` token
- Multiple fresh page navigations to different videos

---

## Fix for Next Run

**Enable Computer Use** in Settings → Desktop app → Computer Use.
With physical mouse simulation, YouTube's lazy loading triggers correctly (scroll events are real), allowing the comment box to appear and be interacted with on any video.

Alternatively, the scheduled task will retry tomorrow with fresh browser state, which may resolve the rendering issue naturally.

---

## Videos to Target Next Run (avoid duplicates)
- ✅ Already posted: QS1owB9jM0o
- 🔲 To try: yh1PvLI3IGg (17K views)
- 🔲 To try: Any other AWS SAA-C03 video with 10K+ views
