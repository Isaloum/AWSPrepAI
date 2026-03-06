# AWSPrepAI — Quick Setup Guide

## 1. Google Analytics (GA4) — 10 minutes

### Get your Measurement ID:
1. Go to https://analytics.google.com
2. Create account → Create property → Select "Web"
3. Enter site URL: `https://awsprepai.netlify.app`
4. Copy your **Measurement ID** (format: `G-XXXXXXXXXX`)

### Add to your site:
Paste this in the `<head>` of `index.html`, `pricing.html`, `landing.html`, `success.html`:

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

Replace `G-XXXXXXXXXX` with your real Measurement ID.

---

## 2. Resend Email — 15 minutes

Resend.com is free for up to 3,000 emails/month (100/day).

### Get API key:
1. Go to https://resend.com → Sign up (free)
2. Add & verify your domain OR use their test domain to start
3. Go to API Keys → Create API Key
4. Copy the key (format: `re_xxxxxxxxxxxxxxxx`)

### Add to Netlify environment variables:
1. Go to https://app.netlify.com/projects/awsprepai/configuration/env
2. Add new variable:
   - Key: `RESEND_API_KEY`
   - Value: `re_xxxxxxxxxxxxxxxx` (your key)

### Create the Netlify function:
Create file: `netlify/functions/capture-email.js`

```javascript
const { Resend } = require('resend');
const resend = new Resend(process.env.RESEND_API_KEY);

exports.handler = async (event) => {
  const { email, tier, source } = JSON.parse(event.body);

  try {
    // Send welcome email to customer
    await resend.emails.send({
      from: 'AWSPrepAI <noreply@yourdomain.com>',
      to: email,
      subject: '🎉 Welcome to AWSPrepAI Premium!',
      html: `
        <h1>Welcome to AWSPrepAI! 🚀</h1>
        <p>Your ${tier || 'premium'} access is now active.</p>
        <p>Go to your dashboard: <a href="https://awsprepai.netlify.app">awsprepai.netlify.app</a></p>
        <hr>
        <p><strong>Your 14-day study plan:</strong></p>
        <p>Days 1–4: Glossary & Flashcards<br>
        Days 5–11: All 505 questions<br>
        Days 12–13: Retake weak tests<br>
        Day 14: Rest. You're ready. 💪</p>
        <p>Questions? Reply to this email.</p>
      `
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};
```

### Install Resend package:
Run in your repo root:
```bash
npm install resend
```

Then uncomment the fetch calls in:
- `docs/pricing.html` (line ~280, inside `proceedWithEmail()`)
- `docs/success.html` (line ~80, inside `subscribeNewsletter()`)

---

## 3. Enable Stripe Email Receipts (2 minutes)

Stripe can auto-send receipts for free:
1. Go to https://dashboard.stripe.com/settings/emails
2. Toggle ON: "Successful payments"
3. Done — Stripe handles it automatically

---

## 4. Delete Restricted Stripe Key (URGENT)

If not done yet:
1. Go to https://dashboard.stripe.com/apikeys
2. Find `rk_live_...CMlE`
3. Click the trash icon → Delete
