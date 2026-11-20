const crypto = require('node:crypto');
const { db } = require('../db/database');
const security = require('../middleware/security');
const authService = require('./auth.service');

function listContent({ type = '', publishedOnly = true } = {}) {
  let query = 'SELECT * FROM cms_content WHERE 1=1';
  const params = [];

  if (publishedOnly) {
    query += " AND review_status = 'published'";
  }
  if (type) {
    query += ' AND content_type = ?';
    params.push(type);
  }
  query += ' ORDER BY updated_at DESC';
  return db.prepare(query).all(...params);
}

function upsertContent(user, { slug, contentType, titleAr, titleFr, titleEn, bodyAr, bodyFr, bodyEn, sourceRef, reviewStatus = 'draft' }) {
  if (!user || ![authService.ROLES.CONTENT_MANAGER, authService.ROLES.PLATFORM_ADMIN, authService.ROLES.SUPER_ADMIN].includes(user.role)) {
    throw new Error('Forbidden');
  }
  const id = 'cms_' + crypto.randomUUID().slice(0, 12);
  db.prepare(`
    INSERT INTO cms_content (id, slug, content_type, title_ar, title_fr, title_en, body_ar, body_fr, body_en, source_ref, review_status, reviewed_by)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(slug) DO UPDATE SET
      content_type = excluded.content_type,
      title_ar = excluded.title_ar,
      title_fr = excluded.title_fr,
      title_en = excluded.title_en,
      body_ar = excluded.body_ar,
      body_fr = excluded.body_fr,
      body_en = excluded.body_en,
      source_ref = excluded.source_ref,
      review_status = excluded.review_status,
      reviewed_by = excluded.reviewed_by,
      updated_at = datetime('now')
  `).run(
    id,
    security.sanitizeText(slug),
    security.sanitizeText(contentType || 'legal'),
    security.sanitizeText(titleAr || ''),
    security.sanitizeText(titleFr || ''),
    security.sanitizeText(titleEn || ''),
    security.sanitizeText(bodyAr || ''),
    security.sanitizeText(bodyFr || ''),
    security.sanitizeText(bodyEn || ''),
    security.sanitizeText(sourceRef || ''),
    reviewStatus,
    user.id
  );

  security.logAudit('cms_content_upserted', { slug, reviewStatus }, null, user.id);
  return db.prepare('SELECT * FROM cms_content WHERE slug = ?').get(slug);
}

module.exports = {
  listContent,
  upsertContent
};
