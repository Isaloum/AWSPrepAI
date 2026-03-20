/**
 * sync-progress.js
 * Save user progress to Netlify Blobs (server-side, cross-device).
 * Requires valid RS256 JWT in Authorization: Bearer header.
 *
 * POST body: { cert: "saa-c03", data: { ... } }
 * GET  ?cert=saa-c03  → returns stored progress
 */
const { getStore } = require('@netlify/blobs');
const crypto = require('crypto');

const ALLOWED_ORIGINS = [
  'https://isaloum.github.io',
  'https://awsprepai.netlify.app',
];

function corsHeaders(origin) {
  const allowed = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    'Access-Control-Allow-Origin': allowed,
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Content-Type': 'application/json',
  };
}

/* ---------- JWT verification (RS256 / RSASSA-PKCS1-v1_5) ---------- */
function b64urlDecode(str) {
  const padded = str + '==='.slice((str.length + 3) % 4);
  return Buffer.from(padded.replace(/-/g, '+').replace(/_/g, '/'), 'base64');
}

async function verifyJWT(token) {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const publicKeyB64 = process.env.RSA_PUBLIC_KEY_B64;
    if (!publicKeyB64) {
      console.error('[sync] RSA_PUBLIC_KEY_B64 env var not set');
      return null;
    }

    const pubKeyDer = Buffer.from(publicKeyB64, 'base64');
    const cryptoKey = await crypto.webcrypto.subtle.importKey(
      'spki',
      pubKeyDer,
      { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
      false,
      ['verify']
    );

    const dataToVerify = Buffer.from(`${parts[0]}.${parts[1]}`);
    const signature = b64urlDecode(parts[2]);

    const valid = await crypto.webcrypto.subtle.verify(
      'RSASSA-PKCS1-v1_5',
      cryptoKey,
      signature,
      dataToVerify
    );
    if (!valid) return null;

    const payload = JSON.parse(b64urlDecode(parts[1]).toString('utf8'));
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < now) return null; // expired

    return payload;
  } catch (err) {
    console.error('[sync] JWT verify error:', err.message);
    return null;
  }
}

/* ---------- Handler ---------- */
exports.handler = async (event) => {
  const origin = event.headers.origin || event.headers.Origin || '';
  const headers = corsHeaders(origin);

  if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers, body: '' };

  // Auth
  const authHeader = event.headers.authorization || event.headers.Authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
  if (!token) {
    return { statusCode: 401, headers, body: JSON.stringify({ error: 'No token' }) };
  }

  const payload = await verifyJWT(token);
  if (!payload || !payload.pi) {
    return { statusCode: 401, headers, body: JSON.stringify({ error: 'Invalid token' }) };
  }

  const piId = payload.pi; // payment_intent — unique per user
  const store = getStore('progress');

  /* ── GET: load progress for one cert ── */
  if (event.httpMethod === 'GET') {
    const cert = event.queryStringParameters?.cert;
    if (!cert) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: 'Missing cert param' }) };
    }
    try {
      const raw = await store.get(`${piId}/${cert}`);
      if (!raw) return { statusCode: 200, headers, body: JSON.stringify({ data: null }) };
      return { statusCode: 200, headers, body: JSON.stringify({ data: JSON.parse(raw) }) };
    } catch (err) {
      console.error('[sync] GET error:', err.message);
      return { statusCode: 500, headers, body: JSON.stringify({ error: err.message }) };
    }
  }

  /* ── POST: save progress ── */
  if (event.httpMethod === 'POST') {
    try {
      const body = JSON.parse(event.body || '{}');
      const { cert, data } = body;

      if (!cert || typeof cert !== 'string' || !data) {
        return { statusCode: 400, headers, body: JSON.stringify({ error: 'Missing cert or data' }) };
      }

      const entry = { ...data, syncedAt: Date.now() };
      await store.set(`${piId}/${cert}`, JSON.stringify(entry));

      return { statusCode: 200, headers, body: JSON.stringify({ ok: true }) };
    } catch (err) {
      console.error('[sync] POST error:', err.message);
      return { statusCode: 500, headers, body: JSON.stringify({ error: err.message }) };
    }
  }

  return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };
};
