/**
 * capture-email.js
 * Saves newsletter subscriber emails to Netlify Blobs.
 * POST { email: "user@example.com" }
 */
const { getStore } = require('@netlify/blobs');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method not allowed' };
  }

  let email;
  try {
    ({ email } = JSON.parse(event.body || '{}'));
  } catch {
    return { statusCode: 400, body: JSON.stringify({ error: 'Invalid JSON' }) };
  }

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Invalid email' }) };
  }

  const normalized = email.trim().toLowerCase();

  try {
    const store = getStore({ name: 'newsletter', consistency: 'strong' });

    // Load existing list
    let list = [];
    try {
      const raw = await store.get('subscribers');
      if (raw) list = JSON.parse(raw);
    } catch { /* first subscriber */ }

    // Deduplicate
    if (!list.includes(normalized)) {
      list.push(normalized);
      await store.set('subscribers', JSON.stringify(list));
      console.log(`[newsletter] New subscriber: ${normalized} (total: ${list.length})`);
    } else {
      console.log(`[newsletter] Already subscribed: ${normalized}`);
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true }),
    };
  } catch (err) {
    console.error('[newsletter] Error saving subscriber:', err.message);
    return { statusCode: 500, body: JSON.stringify({ error: 'Failed to save' }) };
  }
};
