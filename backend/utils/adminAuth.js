const crypto = require('crypto');

const TOKEN_TTL_HOURS = Number(process.env.ADMIN_TOKEN_TTL_HOURS || 12);

function base64UrlEncode(input) {
  return Buffer.from(input).toString('base64').replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
}

function base64UrlDecode(input) {
  const normalized = input.replace(/-/g, '+').replace(/_/g, '/');
  const padded = normalized + '='.repeat((4 - (normalized.length % 4)) % 4);
  return Buffer.from(padded, 'base64').toString();
}

function timingSafeEqualString(a, b) {
  const aBuffer = Buffer.from(a);
  const bBuffer = Buffer.from(b);

  if (aBuffer.length !== bBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(aBuffer, bBuffer);
}

function createAdminToken() {
  const secret = process.env.ADMIN_TOKEN_SECRET;
  if (!secret) {
    throw new Error('ADMIN_TOKEN_SECRET is not configured.');
  }

  const expiresAt = Date.now() + TOKEN_TTL_HOURS * 60 * 60 * 1000;
  const payload = {
    role: 'admin',
    exp: expiresAt,
  };

  const payloadString = JSON.stringify(payload);
  const encodedPayload = base64UrlEncode(payloadString);
  const signature = crypto
    .createHmac('sha256', secret)
    .update(encodedPayload)
    .digest('hex');

  return `${encodedPayload}.${signature}`;
}

function verifyAdminToken(token) {
  const secret = process.env.ADMIN_TOKEN_SECRET;
  if (!secret || !token) {
    return null;
  }

  const [encodedPayload, signature] = token.split('.');
  if (!encodedPayload || !signature) {
    return null;
  }

  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(encodedPayload)
    .digest('hex');

  if (!timingSafeEqualString(signature, expectedSignature)) {
    return null;
  }

  try {
    const payload = JSON.parse(base64UrlDecode(encodedPayload));
    if (payload.role !== 'admin') {
      return null;
    }

    if (!payload.exp || Date.now() > payload.exp) {
      return null;
    }

    return payload;
  } catch (err) {
    return null;
  }
}

function requireAdmin(req, res, next) {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
  const payload = verifyAdminToken(token);

  if (!payload) {
    return res.status(401).json({ error: 'Admin access required' });
  }

  req.admin = payload;
  return next();
}

module.exports = {
  createAdminToken,
  requireAdmin,
  timingSafeEqualString,
  verifyAdminToken,
};
