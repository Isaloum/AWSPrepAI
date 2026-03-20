/**
 * Shared JWT utility for Netlify functions
 * Signs tokens with RS256 using the RSA_PRIVATE_KEY env var
 */
const crypto = require('crypto');

function b64url(buf) {
  return Buffer.from(buf).toString('base64')
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

/**
 * Issue a signed RS256 JWT
 * @param {object} payload - { tier, pi, expiry }
 * @returns {string|null} signed JWT or null if key not configured
 */
function issueJWT(payload) {
  const privateKeyB64 = process.env.RSA_PRIVATE_KEY;
  if (!privateKeyB64) {
    console.error('[jwt] RSA_PRIVATE_KEY env var not set');
    return null;
  }

  try {
    const privateKeyPem = Buffer.from(privateKeyB64, 'base64').toString('utf8');

    const header = b64url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
    const body   = b64url(JSON.stringify({
      ...payload,
      iat: Math.floor(Date.now() / 1000),
    }));

    const data = `${header}.${body}`;
    const sig  = crypto.sign('SHA256', Buffer.from(data), {
      key: privateKeyPem,
      padding: crypto.constants.RSA_PKCS1_PADDING,
    });

    return `${data}.${b64url(sig)}`;
  } catch (err) {
    console.error('[jwt] Sign error:', err.message);
    return null;
  }
}

module.exports = { issueJWT };
