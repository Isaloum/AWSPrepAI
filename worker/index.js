/**
 * AWSPrepAI Progress Sync Worker
 * Cloudflare Worker backed by D1 — stores quiz progress server-side.
 * Auth: validates RS256 JWT in Authorization header (same key as Netlify functions).
 * 
 * Routes:
 *   POST /sync   — save progress for a cert
 *   GET  /sync   — load all progress for the user
 *   POST /analytics — upsert per-category accuracy stats
 */

const ALLOWED_ORIGINS = [
  'https://isaloum.github.io',
  'https://awsprepai.netlify.app',
];

// ── JWT Verification (RS256) ──────────────────────────────────────────────────

function b64urlToBytes(s) {
  s = s.replace(/-/g, '+').replace(/_/g, '/');
  while (s.length % 4) s += '=';
  const bin = atob(s);
  return Uint8Array.from(bin, c => c.charCodeAt(0));
}

async function importPublicKey(env) {
  const pem = atob(env.RSA_PUBLIC_KEY_B64);
  const b64 = pem.replace(/-----[^-]+-----/g, '').replace(/\s/g, '');
  const der = b64urlToBytes(b64.replace(/\+/g,'-').replace(/\//g,'_').replace(/=/g,''));
  return crypto.subtle.importKey(
    'spki', der.buffer,
    { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
    false, ['verify']
  );
}

async function verifyJWT(token, env) {
  if (!token) return null;
  const parts = token.split('.');
  if (parts.length !== 3) return null;
  try {
    const pubKey = await importPublicKey(env);
    const data   = new TextEncoder().encode(`${parts[0]}.${parts[1]}`);
    const sig    = b64urlToBytes(parts[2]);
    const valid  = await crypto.subtle.verify('RSASSA-PKCS1-v1_5', pubKey, sig, data);
    if (!valid) return null;
    const payload = JSON.parse(atob(parts[1].replace(/-/g,'+').replace(/_/g,'/')));
    if (payload.exp && Math.floor(Date.now() / 1000) > payload.exp) return null;
    return payload;
  } catch { return null; }
}

// ── CORS ──────────────────────────────────────────────────────────────────────

function corsHeaders(origin) {
  const allowed = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    'Access-Control-Allow-Origin': allowed,
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Content-Type': 'application/json',
  };
}

function json(data, status = 200, origin = '') {
  return new Response(JSON.stringify(data), { status, headers: corsHeaders(origin) });
}

// ── Request Handler ───────────────────────────────────────────────────────────

export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin') || '';
    const url    = new URL(request.url);

    // Preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders(origin) });
    }

    // Auth — every route requires a valid JWT
    const authHeader = request.headers.get('Authorization') || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
    const payload = await verifyJWT(token, env);
    if (!payload || !payload.pi) {
      return json({ error: 'Unauthorized' }, 401, origin);
    }

    const piId = payload.pi;
    const tier = payload.tier || 'lifetime';

    // Upsert user on every request
    await env.DB.prepare(
      `INSERT INTO users (pi_id, tier, last_seen) VALUES (?, ?, unixepoch())
       ON CONFLICT(pi_id) DO UPDATE SET tier=excluded.tier, last_seen=unixepoch()`
    ).bind(piId, tier).run();

    // ── GET /sync — load all progress ────────────────────────────────────────
    if (request.method === 'GET' && url.pathname === '/sync') {
      const rows = await env.DB.prepare(
        `SELECT cert, data, updated_at FROM progress WHERE pi_id = ?`
      ).bind(piId).all();

      const progress = {};
      for (const row of rows.results) {
        try { progress[row.cert] = JSON.parse(row.data); } catch {}
      }
      return json({ ok: true, progress }, 200, origin);
    }

    // ── POST /sync — save progress for one cert ───────────────────────────────
    if (request.method === 'POST' && url.pathname === '/sync') {
      const { cert, data } = await request.json();
      if (!cert || !data) return json({ error: 'Missing cert or data' }, 400, origin);

      await env.DB.prepare(
        `INSERT INTO progress (pi_id, cert, data, updated_at)
         VALUES (?, ?, ?, unixepoch())
         ON CONFLICT(pi_id, cert) DO UPDATE SET data=excluded.data, updated_at=unixepoch()`
      ).bind(piId, cert, JSON.stringify(data)).run();

      return json({ ok: true }, 200, origin);
    }

    // ── POST /analytics — upsert per-category stats ───────────────────────────
    if (request.method === 'POST' && url.pathname === '/analytics') {
      const { cert, cat, correct, total } = await request.json();
      if (!cert || !cat || correct == null || total == null) {
        return json({ error: 'Missing fields' }, 400, origin);
      }

      await env.DB.prepare(
        `INSERT INTO analytics (pi_id, cert, cat, correct, total, updated_at)
         VALUES (?, ?, ?, ?, ?, unixepoch())
         ON CONFLICT(pi_id, cert, cat) DO UPDATE SET
           correct=analytics.correct + excluded.correct,
           total=analytics.total + excluded.total,
           updated_at=unixepoch()`
      ).bind(piId, cert, cat, correct, total).run();

      return json({ ok: true }, 200, origin);
    }

    return json({ error: 'Not found' }, 404, origin);
  }
};
