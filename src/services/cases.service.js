const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');
const { db } = require('../db/database');
const security = require('../middleware/security');
const authService = require('./auth.service');

const AUDIO_DIR = path.join(__dirname, '..', '..', 'data', 'audio');
if (!fs.existsSync(AUDIO_DIR)) {
  fs.mkdirSync(AUDIO_DIR, { recursive: true });
}

const VALID_STATUSES = [
  'NEW',
  'RECEIVED',
  'INITIAL_REVIEW',
  'HUMAN_ASSESSMENT',
  'ACTION_REQUIRED',
  'REFERRED',
  'FOLLOW_UP',
  'RESOLVED',
  'CLOSED'
];

function generateReferenceCode(group) {
  const prefix = group === 'child' ? 'AMC' : group === 'girls' ? 'AMG' : 'AMW';
  const rand = crypto.randomBytes(3).toString('hex').toUpperCase();
  const datePart = new Date().toISOString().slice(2, 10).replace(/-/g, '');
  return `${prefix}-${datePart}-${rand}`;
}

function submitHelpRequest({
  beneficiaryGroup = 'women',
  category = 'general',
  urgency = 'normal',
  preferredLanguage = 'ar',
  submissionMethod = 'written',
  description = '',
  safeContact = '',
  city = ''
}) {
  if (!['women', 'girls', 'child'].includes(beneficiaryGroup)) {
    throw new Error('Invalid beneficiary group');
  }
  if (!['low', 'normal', 'high', 'urgent'].includes(urgency)) {
    urgency = 'normal';
  }
  if (!['written', 'audio', 'voice_to_text', 'callback'].includes(submissionMethod)) {
    submissionMethod = 'written';
  }

  const id = 'case_' + crypto.randomUUID().slice(0, 12);
  const referenceCode = generateReferenceCode(beneficiaryGroup);

  db.prepare(`
    INSERT INTO help_requests (
      id, reference_code, beneficiary_group, category, urgency,
      preferred_language, submission_method, description, safe_contact, city, status
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'NEW')
  `).run(
    id,
    referenceCode,
    beneficiaryGroup,
    security.sanitizeText(category),
    urgency,
    preferredLanguage,
    submissionMethod,
    security.sanitizeText(description),
    security.sanitizeText(safeContact),
    security.sanitizeText(city)
  );

  security.logAudit('help_request_submitted', { caseId: id, beneficiaryGroup, urgency, submissionMethod });

  return {
    id,
    referenceCode,
    status: 'NEW',
    beneficiaryGroup,
    createdAt: new Date().toISOString()
  };
}

function saveAudioReport({ caseId, base64Audio, mimeType = 'audio/webm', durationSeconds = 0, language = 'ar' }) {
  const caseRecord = db.prepare('SELECT id FROM help_requests WHERE id = ?').get(caseId);
  if (!caseRecord) {
    throw new Error('Case not found');
  }

  const allowedMimes = ['audio/webm', 'audio/ogg', 'audio/mp4', 'audio/mpeg', 'audio/wav'];
  if (!allowedMimes.includes(mimeType)) {
    throw new Error('Unsupported audio format');
  }

  const buffer = Buffer.from(base64Audio, 'base64');
  if (buffer.length === 0 || buffer.length > 10 * 1024 * 1024) {
    throw new Error('Audio size must be between 1 byte and 10 MB');
  }

  const id = 'aud_' + crypto.randomUUID().slice(0, 12);
  const ext = mimeType.split('/')[1] || 'webm';
  const fileRef = `${id}.${ext}`;
  const filePath = path.join(AUDIO_DIR, fileRef);

  fs.writeFileSync(filePath, buffer);

  const retentionDate = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString();
  db.prepare(`
    INSERT INTO audio_reports (id, case_id, file_ref, mime_type, duration_seconds, language, retention_until)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(id, caseId, fileRef, mimeType, Number(durationSeconds) || 0, language, retentionDate);

  security.logAudit('audio_report_uploaded', { audioId: id, caseId, durationSeconds });

  return { id, caseId, durationSeconds, language };
}

function getPublicFollowUp(referenceCode) {
  const row = db.prepare(`
    SELECT reference_code, beneficiary_group, status, updated_at, created_at
    FROM help_requests
    WHERE reference_code = ?
  `).get((referenceCode || '').trim().toUpperCase());

  if (!row) return null;

  return {
    referenceCode: row.reference_code,
    beneficiaryGroup: row.beneficiary_group,
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

function listCasesForUser(user, { status = '', group = '' } = {}) {
  if (!user || !authService.CASE_ACCESS_ROLES.has(user.role)) {
    throw new Error('Forbidden');
  }

  let query = 'SELECT * FROM help_requests WHERE 1=1';
  const params = [];

  if (user.role === authService.ROLES.WOMEN_CASEWORKER) {
    query += " AND beneficiary_group = 'women'";
  } else if (user.role === authService.ROLES.CHILD_CASEWORKER) {
    query += " AND beneficiary_group IN ('child', 'girls')";
  } else if (user.role === authService.ROLES.AUTHORIZED_PROFESSIONAL) {
    query += ' AND assigned_to = ?';
    params.push(user.id);
  }

  if (status && VALID_STATUSES.includes(status)) {
    query += ' AND status = ?';
    params.push(status);
  }
  if (group && ['women', 'girls', 'child'].includes(group)) {
    query += ' AND beneficiary_group = ?';
    params.push(group);
  }

  query += ' ORDER BY created_at DESC LIMIT 100';
  return db.prepare(query).all(...params);
}

function updateCaseStatus(user, caseId, { status, reason = '', assignedTo = null }) {
  const caseRecord = db.prepare('SELECT * FROM help_requests WHERE id = ?').get(caseId);
  if (!caseRecord) throw new Error('Case not found');
  if (!authService.canAccessCase(user, caseRecord)) throw new Error('Forbidden');

  if (!VALID_STATUSES.includes(status)) {
    throw new Error('Invalid status');
  }

  if (caseRecord.status === 'CLOSED' && status !== 'CLOSED') {
    if (!reason || reason.trim().length < 5) {
      throw new Error('Reopening a closed case requires a documented reason');
    }
    db.prepare(`
      UPDATE help_requests SET status = ?, reopen_reason = ?, updated_at = datetime('now') WHERE id = ?
    `).run(status, security.sanitizeText(reason), caseId);
  } else if (status === 'CLOSED') {
    db.prepare(`
      UPDATE help_requests SET status = 'CLOSED', closure_reason = ?, updated_at = datetime('now') WHERE id = ?
    `).run(security.sanitizeText(reason), caseId);
  } else {
    db.prepare(`
      UPDATE help_requests SET status = ?, assigned_to = COALESCE(?, assigned_to), updated_at = datetime('now') WHERE id = ?
    `).run(status, assignedTo, caseId);
  }

  security.logAudit('case_status_updated', { caseId, from: caseRecord.status, to: status }, null, user.id);
  return db.prepare('SELECT * FROM help_requests WHERE id = ?').get(caseId);
}

function addCaseNote(user, caseId, { content, noteType = 'assessment' }) {
  const caseRecord = db.prepare('SELECT * FROM help_requests WHERE id = ?').get(caseId);
  if (!caseRecord) throw new Error('Case not found');
  if (!authService.canAccessCase(user, caseRecord)) throw new Error('Forbidden');

  const id = 'note_' + crypto.randomUUID().slice(0, 12);
  db.prepare(`
    INSERT INTO case_notes (id, case_id, author_id, note_type, content)
    VALUES (?, ?, ?, ?, ?)
  `).run(id, caseId, user.id, security.sanitizeText(noteType), security.sanitizeText(content));

  security.logAudit('case_note_added', { caseId, noteId: id }, null, user.id);
  return db.prepare('SELECT * FROM case_notes WHERE id = ?').get(id);
}

function getAudioFileForUser(user, audioId) {
  const audio = db.prepare('SELECT * FROM audio_reports WHERE id = ?').get(audioId);
  if (!audio) throw new Error('Audio not found');

  const caseRecord = db.prepare('SELECT * FROM help_requests WHERE id = ?').get(audio.case_id);
  if (!caseRecord || !authService.canAccessCase(user, caseRecord)) {
    throw new Error('Forbidden');
  }

  const filePath = path.join(AUDIO_DIR, audio.file_ref);
  if (!fs.existsSync(filePath)) throw new Error('Audio file missing');

  security.logAudit('audio_accessed', { audioId, caseId: audio.case_id }, null, user.id);
  return { filePath, mimeType: audio.mime_type };
}

module.exports = {
  VALID_STATUSES,
  submitHelpRequest,
  saveAudioReport,
  getPublicFollowUp,
  listCasesForUser,
  updateCaseStatus,
  addCaseNote,
  getAudioFileForUser
};
