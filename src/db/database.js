const { DatabaseSync } = require('node:sqlite');
const path = require('node:path');
const fs = require('node:fs');

const DATA_DIR = path.join(__dirname, '..', '..', 'data');
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const DB_PATH = process.env.AMAN_DB_PATH || path.join(DATA_DIR, 'aman.db');
const db = new DatabaseSync(DB_PATH);

function initDatabase() {
  db.exec('PRAGMA journal_mode = WAL;');
  db.exec('PRAGMA foreign_keys = ON;');

  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      full_name TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'authorized_professional',
      organization_id TEXT,
      is_active INTEGER NOT NULL DEFAULT 1,
      mfa_enabled INTEGER NOT NULL DEFAULT 0,
      last_login_at TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS sessions (
      token TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      expires_at TEXT NOT NULL,
      ip_address TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS organizations (
      id TEXT PRIMARY KEY,
      name_ar TEXT NOT NULL,
      name_fr TEXT NOT NULL,
      name_en TEXT NOT NULL,
      category TEXT NOT NULL,
      city TEXT NOT NULL,
      region TEXT NOT NULL,
      address TEXT,
      phone TEXT,
      email TEXT,
      operating_hours TEXT,
      accessibility_info TEXT,
      latitude REAL,
      longitude REAL,
      is_verified INTEGER NOT NULL DEFAULT 0,
      verified_at TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS help_requests (
      id TEXT PRIMARY KEY,
      reference_code TEXT UNIQUE NOT NULL,
      beneficiary_group TEXT NOT NULL CHECK (beneficiary_group IN ('women', 'girls', 'child')),
      category TEXT NOT NULL,
      urgency TEXT NOT NULL DEFAULT 'normal' CHECK (urgency IN ('low', 'normal', 'high', 'urgent')),
      preferred_language TEXT NOT NULL DEFAULT 'ar',
      submission_method TEXT NOT NULL DEFAULT 'written' CHECK (submission_method IN ('written', 'audio', 'voice_to_text', 'callback')),
      description TEXT,
      safe_contact TEXT,
      city TEXT,
      status TEXT NOT NULL DEFAULT 'NEW' CHECK (status IN (
        'NEW', 'RECEIVED', 'INITIAL_REVIEW', 'HUMAN_ASSESSMENT',
        'ACTION_REQUIRED', 'REFERRED', 'FOLLOW_UP', 'RESOLVED', 'CLOSED'
      )),
      assigned_to TEXT,
      closure_reason TEXT,
      reopen_reason TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (assigned_to) REFERENCES users(id) ON DELETE SET NULL
    );

    CREATE TABLE IF NOT EXISTS audio_reports (
      id TEXT PRIMARY KEY,
      case_id TEXT NOT NULL,
      file_ref TEXT UNIQUE NOT NULL,
      mime_type TEXT NOT NULL,
      duration_seconds INTEGER DEFAULT 0,
      language TEXT DEFAULT 'ar',
      transcription TEXT,
      transcription_verified INTEGER NOT NULL DEFAULT 0,
      retention_until TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (case_id) REFERENCES help_requests(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS case_notes (
      id TEXT PRIMARY KEY,
      case_id TEXT NOT NULL,
      author_id TEXT NOT NULL,
      note_type TEXT NOT NULL DEFAULT 'assessment',
      content TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (case_id) REFERENCES help_requests(id) ON DELETE CASCADE,
      FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS referrals (
      id TEXT PRIMARY KEY,
      case_id TEXT NOT NULL,
      organization_id TEXT NOT NULL,
      referred_by TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'ACCEPTED', 'REJECTED', 'COMPLETED')),
      notes TEXT,
      response_notes TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (case_id) REFERENCES help_requests(id) ON DELETE CASCADE,
      FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE,
      FOREIGN KEY (referred_by) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS cms_content (
      id TEXT PRIMARY KEY,
      slug TEXT UNIQUE NOT NULL,
      content_type TEXT NOT NULL,
      title_ar TEXT NOT NULL,
      title_fr TEXT NOT NULL,
      title_en TEXT NOT NULL,
      body_ar TEXT NOT NULL,
      body_fr TEXT NOT NULL,
      body_en TEXT NOT NULL,
      source_ref TEXT,
      review_status TEXT NOT NULL DEFAULT 'draft',
      reviewed_by TEXT,
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS audit_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      action TEXT NOT NULL,
      actor_id TEXT,
      details TEXT,
      ip_address TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    -- Existing community tables
    CREATE TABLE IF NOT EXISTS posts (
      id TEXT PRIMARY KEY,
      author_name TEXT NOT NULL,
      is_anonymous INTEGER NOT NULL DEFAULT 1,
      category TEXT NOT NULL DEFAULT 'general',
      title TEXT NOT NULL,
      body TEXT NOT NULL,
      image_url TEXT,
      likes_count INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS comments (
      id TEXT PRIMARY KEY,
      post_id TEXT NOT NULL,
      author_name TEXT NOT NULL,
      text TEXT NOT NULL,
      is_anonymous INTEGER NOT NULL DEFAULT 1,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS post_likes (
      post_id TEXT NOT NULL,
      ip_hash TEXT NOT NULL,
      PRIMARY KEY (post_id, ip_hash),
      FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE
    );
  `);

  seedInitialData();
}

function seedInitialData() {
  const orgCount = db.prepare('SELECT COUNT(*) as count FROM organizations').get().count;
  if (orgCount === 0) {
    const insertOrg = db.prepare(`
      INSERT INTO organizations (id, name_ar, name_fr, name_en, category, city, region, address, phone, operating_hours, accessibility_info, latitude, longitude, is_verified, verified_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    // Laâyoune Pilot Territory + National Verified Emergency/Support Reference
    insertOrg.run(
      'org_laayoune_1',
      'مركز الاستماع والتوجيه للنساء - العيون',
      'Centre d’écoute et d’orientation pour femmes - Laâyoune',
      'Women Listening & Guidance Center - Laâyoune',
      'women_support',
      'Laâyoune',
      'Laâyoune-Sakia El Hamra',
      'Quartier Administrative, Laâyoune',
      '0528-00-00-00 (Pilot Placeholder)',
      'Lun-Ven 08:30 - 16:30',
      'Accès PMR disponible / ولوجيات متوفرة',
      27.1536,
      -13.2033,
      1,
      new Date().toISOString()
    );
    insertOrg.run(
      'org_laayoune_2',
      'خلية التكفل بالنساء والأطفال ضحايا العنف - العيون',
      'Cellule de prise en charge des femmes et enfants victimes de violence - Laâyoune',
      'Women & Child Protection Unit - Laâyoune',
      'child_protection',
      'Laâyoune',
      'Laâyoune-Sakia El Hamra',
      'Avenue Mekka, Laâyoune',
      '8350 / 19',
      '24/7 Urgences / 08:30-16:30',
      'Accueil confidentiel / استقبال سري',
      27.1418,
      -13.1879,
      1,
      new Date().toISOString()
    );
    insertOrg.run(
      'org_rabat_unfm',
      'الاتحاد الوطني لنساء المغرب - خط 8350',
      'Union Nationale des Femmes du Maroc (UNFM) - Ligne 8350',
      'National Union of Women of Morocco (UNFM) - 8350',
      'ngo',
      'Rabat',
      'Rabat-Salé-Kénitra',
      'Rabat (Couverture Nationale)',
      '8350',
      '24/7',
      'Service téléphonique national gratuit',
      34.0209,
      -6.8416,
      1,
      new Date().toISOString()
    );
  }

  const postCount = db.prepare('SELECT COUNT(*) as count FROM posts').get().count;
  if (postCount === 0) {
    db.prepare(`
      INSERT INTO posts (id, author_name, is_anonymous, category, title, body, likes_count)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(
      'post_welcome_1',
      'فريق أمان',
      0,
      'legal',
      'القانون 103-13: حماية النساء من العنف في المغرب',
      'يكفل القانون المغربي رقم 103-13 تدابير حماية فورية للنساء ضحايا العنف، بما في ذلك إبعاد المعتدي، وتوفير خلايا التكفل بالمحاكم والمستشفيات ومراكز الشرطة.',
      12
    );
  }
}

initDatabase();

module.exports = { db, initDatabase };
