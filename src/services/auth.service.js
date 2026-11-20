const crypto = require('node:crypto');
const { db } = require('../db/database');
const security = require('../middleware/security');

const ROLES = {
  SUPER_ADMIN: 'super_admin',
  PLATFORM_ADMIN: 'platform_admin',
  SAFEGUARDING_SUPERVISOR: 'safeguarding_supervisor',
  WOMEN_CASEWORKER: 'women_caseworker',
  CHILD_CASEWORKER: 'child_caseworker',
  PARTNER_ADMIN: 'partner_admin',
  AUTHORIZED_PROFESSIONAL: 'authorized_professional',
  CONTENT_MANAGER: 'content_manager',
  AUDITOR: 'auditor',
  TECH_SUPPORT: 'tech_support'
};

const CASE_ACCESS_ROLES = new Set([
  ROLES.SAFEGUARDING_SUPERVISOR,
  ROLES.WOMEN_CASEWORKER,
  ROLES.CHILD_CASEWORKER,
  ROLES.AUTHORIZED_PROFESSIONAL
]);

function registerUser({ email, password, fullName, role = ROLES.AUTHORIZED_PROFESSIONAL, organizationId = null }) {
  if (!email || !password || password.length < 8) {
    throw new Error('Email and password (min 8 chars) are required');
  }
  const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email.toLowerCase().trim());
  if (existing) {
    throw new Error('Email already registered');
  }

  const id = 'usr_' + crypto.randomUUID().slice(0, 12);
  const passwordHash = security.hashPassword(password);

  db.prepare(`
    INSERT INTO users (id, email, password_hash, full_name, role, organization_id, is_active)
    VALUES (?, ?, ?, ?, ?, ?, 1)
  `).run(id, email.toLowerCase().trim(), passwordHash, security.sanitizeText(fullName || 'Staff'), role, organizationId);

  security.logAudit('user_registered', { userId: id, role }, null, id);
  return { id, email: email.toLowerCase().trim(), fullName, role, organizationId };
}

function login({ email, password, ipAddress }) {
  const user = db.prepare('SELECT * FROM users WHERE email = ?').get((email || '').toLowerCase().trim());
  if (!user || !user.is_active) {
    security.logAudit('login_failed', { email }, ipAddress);
    throw new Error('Invalid credentials');
  }

  if (!security.verifyPassword(password || '', user.password_hash)) {
    security.logAudit('login_failed', { userId: user.id }, ipAddress, user.id);
    throw new Error('Invalid credentials');
  }

  const token = security.generateSecureToken(32);
  const expiresAt = new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString();

  db.prepare('INSERT INTO sessions (token, user_id, expires_at, ip_address) VALUES (?, ?, ?, ?)').run(
    token,
    user.id,
    expiresAt,
    ipAddress ? security.hashIp(ipAddress) : null
  );
  db.prepare("UPDATE users SET last_login_at = datetime('now') WHERE id = ?").run(user.id);

  security.logAudit('login_success', { role: user.role }, ipAddress, user.id);

  return {
    token,
    expiresAt,
    user: {
      id: user.id,
      email: user.email,
      fullName: user.full_name,
      role: user.role,
      organizationId: user.organization_id
    }
  };
}

function getSessionUser(req) {
  const authHeader = req.headers['authorization'] || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : null;
  if (!token) return null;

  const session = db.prepare(`
    SELECT s.token, s.expires_at, u.id, u.email, u.full_name, u.role, u.organization_id, u.is_active
    FROM sessions s
    JOIN users u ON u.id = s.user_id
    WHERE s.token = ?
  `).get(token);

  if (!session || !session.is_active) return null;
  if (new Date(session.expires_at) < new Date()) {
    db.prepare('DELETE FROM sessions WHERE token = ?').run(token);
    return null;
  }

  return {
    id: session.id,
    email: session.email,
    fullName: session.full_name,
    role: session.role,
    organizationId: session.organization_id
  };
}

function logout(token) {
  if (token) {
    db.prepare('DELETE FROM sessions WHERE token = ?').run(token);
  }
}

function canAccessCase(user, caseRecord) {
  if (!user) return false;
  if (user.role === ROLES.SAFEGUARDING_SUPERVISOR) return true;
  if (user.role === ROLES.WOMEN_CASEWORKER && caseRecord.beneficiary_group === 'women') return true;
  if (user.role === ROLES.CHILD_CASEWORKER && (caseRecord.beneficiary_group === 'child' || caseRecord.beneficiary_group === 'girls')) return true;
  if (user.role === ROLES.AUTHORIZED_PROFESSIONAL && caseRecord.assigned_to === user.id) return true;
  return false;
}

module.exports = {
  ROLES,
  CASE_ACCESS_ROLES,
  registerUser,
  login,
  getSessionUser,
  logout,
  canAccessCase
};
