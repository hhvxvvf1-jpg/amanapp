const crypto = require('node:crypto');
const { db } = require('../db/database');
const security = require('../middleware/security');
const authService = require('./auth.service');

function listDirectory({ region = '', category = '', city = '', verifiedOnly = true }) {
  let query = 'SELECT id, name_ar, name_fr, name_en, category, city, region, address, phone, operating_hours, accessibility_info, latitude, longitude, is_verified FROM organizations WHERE 1=1';
  const params = [];

  if (verifiedOnly) {
    query += ' AND is_verified = 1';
  }
  if (region) {
    query += ' AND region = ?';
    params.push(region);
  }
  if (category) {
    query += ' AND category = ?';
    params.push(category);
  }
  if (city) {
    query += ' AND LOWER(city) LIKE ?';
    params.push(`%${city.toLowerCase()}%`);
  }

  query += ' ORDER BY is_verified DESC, city ASC';
  return db.prepare(query).all(...params);
}

function registerPartner({ nameAr, nameFr, nameEn, category, city, region, address, phone, email, operatingHours, accessibilityInfo }) {
  const id = 'org_' + crypto.randomUUID().slice(0, 12);
  db.prepare(`
    INSERT INTO organizations (id, name_ar, name_fr, name_en, category, city, region, address, phone, email, operating_hours, accessibility_info, is_verified)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0)
  `).run(
    id,
    security.sanitizeText(nameAr || nameFr || nameEn),
    security.sanitizeText(nameFr || nameAr || nameEn),
    security.sanitizeText(nameEn || nameFr || nameAr),
    security.sanitizeText(category || 'ngo'),
    security.sanitizeText(city || 'Laâyoune'),
    security.sanitizeText(region || 'Laâyoune-Sakia El Hamra'),
    security.sanitizeText(address || ''),
    security.sanitizeText(phone || ''),
    security.sanitizeText(email || ''),
    security.sanitizeText(operatingHours || ''),
    security.sanitizeText(accessibilityInfo || '')
  );

  security.logAudit('partner_registered', { orgId: id, city, region });
  return db.prepare('SELECT * FROM organizations WHERE id = ?').get(id);
}

function verifyPartner(user, orgId, isVerified = true) {
  if (!user || ![authService.ROLES.SUPER_ADMIN, authService.ROLES.PLATFORM_ADMIN, authService.ROLES.SAFEGUARDING_SUPERVISOR].includes(user.role)) {
    throw new Error('Forbidden');
  }
  db.prepare("UPDATE organizations SET is_verified = ?, verified_at = datetime('now') WHERE id = ?").run(isVerified ? 1 : 0, orgId);
  security.logAudit('partner_verification_updated', { orgId, isVerified }, null, user.id);
  return db.prepare('SELECT * FROM organizations WHERE id = ?').get(orgId);
}

function createReferral(user, { caseId, organizationId, notes = '' }) {
  if (!user || !authService.CASE_ACCESS_ROLES.has(user.role)) {
    throw new Error('Forbidden');
  }
  const id = 'ref_' + crypto.randomUUID().slice(0, 12);
  db.prepare(`
    INSERT INTO referrals (id, case_id, organization_id, referred_by, status, notes)
    VALUES (?, ?, ?, ?, 'PENDING', ?)
  `).run(id, caseId, organizationId, user.id, security.sanitizeText(notes));

  db.prepare("UPDATE help_requests SET status = 'REFERRED', updated_at = datetime('now') WHERE id = ?").run(caseId);
  security.logAudit('referral_created', { referralId: id, caseId, organizationId }, null, user.id);
  return db.prepare('SELECT * FROM referrals WHERE id = ?').get(id);
}

function respondToReferral(user, referralId, { status, responseNotes = '' }) {
  if (!user || ![authService.ROLES.PARTNER_ADMIN, authService.ROLES.SAFEGUARDING_SUPERVISOR].includes(user.role)) {
    throw new Error('Forbidden');
  }
  if (!['ACCEPTED', 'REJECTED', 'COMPLETED'].includes(status)) {
    throw new Error('Invalid referral status');
  }
  const ref = db.prepare('SELECT * FROM referrals WHERE id = ?').get(referralId);
  if (!ref) throw new Error('Referral not found');

  if (user.role === authService.ROLES.PARTNER_ADMIN && user.organizationId !== ref.organization_id) {
    throw new Error('Forbidden');
  }

  db.prepare("UPDATE referrals SET status = ?, response_notes = ?, updated_at = datetime('now') WHERE id = ?").run(
    status,
    security.sanitizeText(responseNotes),
    referralId
  );
  security.logAudit('referral_responded', { referralId, status }, null, user.id);
  return db.prepare('SELECT * FROM referrals WHERE id = ?').get(referralId);
}

module.exports = {
  listDirectory,
  registerPartner,
  verifyPartner,
  createReferral,
  respondToReferral
};
