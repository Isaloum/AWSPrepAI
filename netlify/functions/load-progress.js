/**
 * load-progress.js
 * Load ALL saved progress for a user (all certs) in one call.
 * Requires valid RS256 JWT in Authorization: Bearer header.
 *
 * GET → returns { "saa-c03": {...}, "aif-c01": {...}, ... }
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
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Content-Type': 'application/json',
  };
}

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
      console.error('[load] RSA_PUBLIC_KEY_B64 env var not set');
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
    if (payload.exp && payload.exp < now) return null;

    return payload;
  } catch (err) {
    console.error('[load] JWT verify error:', err.message);
    return null;
  }
}

const ALL_CERTS = [
  'saa-c03', 'aif-c01', 'clf-c02',
  'dva-c02', 'soa-c02', 'sap-c02',
  'dop-c02', 'scs-c03', 'ans-c01',
  'gai-c01', 'mla-c01', 'dea-c01',
];

exports.handler = async (event) => {
  const origin = event.headers.origin || event.headers.Origin || '';
  const headers = corsHeaders(origin);

  if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers, body: '' };
  if (event.httpMethod !== 'GET') {
    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  const authHeader = event.headers.authorization || event.headers.Authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
  if (!token) {
    return { statusCode: 401, headers, body: JSON.stringify({ error: 'No token' }) };
  }

  const payload = await verifyJWT(token);
  if (!payload || !payload.pi) {
    return { statusCode: 401, headers, body: JSON.stringify({ error: 'Invalid token' }) };
  }

  const piId = payload.pi;
  const store = getStore('progress');

  try {
    // Fetch all certs in parallel
    const results = await Promise.all(
      ALL_CERTS.map(async (cert) => {
        const raw = await store.get(`${piId}/${cert}`);
        return [cert, raw ? JSON.parse(raw) : null];
      })
    );

    const progress = {};
    for (const [cert, data] of results) {
      if (data !== null) progress[cert] = data;
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ progress, tier: payload.tier }),
    };
  } catch (err) {
    console.error('[load] Error:', err.message);
    return { statusCode: 500, headers, body: JSON.stringify({ error: err.message }) };
  }
};
