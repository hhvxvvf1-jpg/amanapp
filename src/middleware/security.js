const crypto = require('node:crypto');
const { db } = require('../db/database');

const rateLimitStore = new Map();

function applySecurityHeaders(res) {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'microphone=(self), geolocation=(self)');
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: blob:; media-src 'self' blob:; connect-src 'self' https://generativelanguage.googleapis.com;"
  );
}

function checkRateLimit(ip, maxRequests = 60, windowMs = 60000) {
  const now = Date.now();
  const key = String(ip || 'unknown');
  const entry = rateLimitStore.get(key) || { count: 0, resetAt: now + windowMs };

  if (now > entry.resetAt) {
    entry.count = 1;
    entry.resetAt = now + windowMs;
    rateLimitStore.set(key, entry);
    return true;
  }

  entry.count += 1;
  rateLimitStore.set(key, entry);
  return entry.count <= maxRequests;
}

function sanitizeText(input) {
  if (typeof input !== 'string') return '';
  return input
    .replace(/[<>]/g, (c) => (c === '<' ? '&lt;' : '&gt;'))
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '')
    .trim();
}

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${hash}`;
}

function verifyPassword(password, storedHash) {
  if (!storedHash || !storedHash.includes(':')) return false;
  const [salt, key] = storedHash.split(':');
  const keyBuf = Buffer.from(key, 'hex');
  const derived = crypto.scryptSync(password, salt, 64);
  if (keyBuf.length !== derived.length) return false;
  return crypto.timingSafeEqual(keyBuf, derived);
}

function generateSecureToken(bytes = 32) {
  return crypto.randomBytes(bytes).toString('hex');
}

function hashIp(ip) {
  return crypto.createHash('sha256').update(String(ip || 'unknown')).digest('hex').slice(0, 16);
}

function getEncryptionKey() {
  const raw = process.env.AMAN_ENCRYPTION_KEY || 'aman-local-dev-key-change-in-production';
  return crypto.createHash('sha256').update(raw).digest();
}

function encryptSensitive(plaintext) {
  if (!plaintext) return '';
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', getEncryptionKey(), iv);
  const encrypted = Buffer.concat([cipher.update(String(plaintext), 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();
  return `enc:v1:${iv.toString('hex')}:${tag.toString('hex')}:${encrypted.toString('hex')}`;
}

function decryptSensitive(ciphertext) {
  if (!ciphertext || !String(ciphertext).startsWith('enc:v1:')) return ciphertext || '';
  try {
    const [, , ivHex, tagHex, dataHex] = String(ciphertext).split(':');
    const decipher = crypto.createDecipheriv('aes-256-gcm', getEncryptionKey(), Buffer.from(ivHex, 'hex'));
    decipher.setAuthTag(Buffer.from(tagHex, 'hex'));
    const decrypted = Buffer.concat([decipher.update(Buffer.from(dataHex, 'hex')), decipher.final()]);
    return decrypted.toString('utf8');
  } catch {
    return '[DECRYPTION_ERROR]';
  }
}

function logAudit(action, details = {}, ipAddress = null, actorId = null) {
  try {
    db.prepare(
      'INSERT INTO audit_logs (action, actor_id, details, ip_address) VALUES (?, ?, ?, ?)'
    ).run(action, actorId, JSON.stringify(details), ipAddress ? hashIp(ipAddress) : null);
  } catch (err) {
    console.error('Audit log error:', err.message);
  }
}

module.exports = {
  applySecurityHeaders,
  checkRateLimit,
  sanitizeText,
  hashPassword,
  verifyPassword,
  generateSecureToken,
  hashIp,
  encryptSensitive,
  decryptSensitive,
  logAudit
};
