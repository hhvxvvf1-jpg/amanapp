/**
 * AMAN · أمان - Production Server
 * Clean Architecture: Native SQLite (node:sqlite), Security Middleware, Services Layer
 * Platform for Prevention of Violence Against Women in Morocco
 */

const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const url = require('node:url');

// Services & Database
const { db, initDatabase } = require('./src/db/database');
const communityService = require('./src/services/community.service');
const aiService = require('./src/services/ai.service');
const authService = require('./src/services/auth.service');
const casesService = require('./src/services/cases.service');
const partnersService = require('./src/services/partners.service');
const analyticsService = require('./src/services/analytics.service');
const cmsService = require('./src/services/cms.service');
const girlsService = require('./src/services/girls.service');
const security = require('./src/middleware/security');

function readJsonBody(req, maxBytes = 15 * 1024 * 1024) {
  return new Promise((resolve, reject) => {
    let body = '';
    let size = 0;
    req.on('data', (chunk) => {
      size += chunk.length;
      if (size > maxBytes) {
        reject(new Error('Payload too large'));
        req.destroy();
        return;
      }
      body += chunk;
    });
    req.on('end', () => {
      try {
        resolve(JSON.parse(body || '{}'));
      } catch {
        reject(new Error('Invalid JSON'));
      }
    });
    req.on('error', reject);
  });
}

function sendJson(res, status, data) {
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(data));
}

const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = __dirname;

// MIME Types
const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.webmanifest': 'application/manifest+json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp',
  '.woff2': 'font/woff2',
  '.txt': 'text/plain; charset=utf-8'
};

/**
 * Main HTTP Request Dispatcher
 */
const server = http.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  const method = req.method.toUpperCase();
  const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';

  // Apply Security Headers
  security.applySecurityHeaders(res);

  if (method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // --- API: CHAT (AI COUNSELING) ---
  if (pathname === '/api/chat' && method === 'POST') {
    if (!security.checkRateLimit(clientIp, 40, 60000)) {
      res.writeHead(429, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify({ error: 'rate_limit_exceeded', code: 'rate_limited' }));
      return;
    }

    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', async () => {
      try {
        let payload = {};
        if (req.headers['content-type']?.includes('application/json')) {
          payload = JSON.parse(body || '{}');
        } else {
          const match = body.match(/\{[\s\S]*\}/);
          if (match) payload = JSON.parse(match[0]);
        }

        const userMsg = security.sanitizeText(payload.message || '');
        const history = payload.history || [];
        const replyLang = payload.replyLang || 'auto';
        const uiLang = payload.uiLang || 'ar';

        const reply = await aiService.processChat({ message: userMsg, history, replyLang, uiLang });

        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({ success: true, reply }));
      } catch (err) {
        console.error('Chat error:', err);
        const fallback = aiService.generateLocalExpertReply('', [], 'darija', 'ar');
        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({ success: true, reply: fallback }));
      }
    });
    return;
  }

  // --- API: COMMUNITY SESSION ---
  if (pathname === '/api/community/session' && method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify({
      user: {
        id: 'usr_guest',
        name: 'مشاركة (هوية محفوظة)',
        verified: false,
        kind: 'person'
      }
    }));
    return;
  }

  // --- API: COMMUNITY FEED & POSTS ---
  if (pathname.startsWith('/api/community/feed') || pathname === '/api/community/mine' || (pathname === '/api/community/posts' && method === 'GET')) {
    const category = parsedUrl.query.category || '';
    const search = parsedUrl.query.q || '';
    const page = parseInt(parsedUrl.query.page, 10) || 0;

    const posts = communityService.getFeed({ category, search, page });
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify({ posts, total: posts.length, page }));
    return;
  }

  // --- API: COMMUNITY PUBLISH & POST CREATE ---
  if ((pathname === '/api/community/publish' || pathname === '/api/community/posts') && method === 'POST') {
    if (!security.checkRateLimit(clientIp, 20, 60000)) {
      res.writeHead(429, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify({ error: 'rate_limited' }));
      return;
    }

    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        let data = {};
        if (req.headers['content-type']?.includes('application/json')) {
          data = JSON.parse(body || '{}');
        } else {
          const match = body.match(/\{[\s\S]*\}/);
          if (match) data = JSON.parse(match[0]);
          else {
            data = {
              title: (body.match(/name="title"[\r\n]+([^\r\n]+)/)?.[1] || '').trim(),
              body: (body.match(/name="body"[\r\n]+([^\r\n]+)/)?.[1] || '').trim(),
              category: (body.match(/name="category"[\r\n]+([^\r\n]+)/)?.[1] || 'general').trim(),
              isAnonymous: /name="isAnonymous"[\r\n]+(true|on|1)/i.test(body)
            };
          }
        }

        const newPost = communityService.createPost({
          authorName: security.sanitizeText(data.author),
          isAnonymous: data.isAnonymous !== false,
          category: data.category || 'general',
          title: security.sanitizeText(data.title),
          body: security.sanitizeText(data.body),
          imageUrl: data.image || null
        });

        security.logAudit('post_created', { id: newPost.id, category: newPost.category }, clientIp);

        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({ success: true, post: newPost }));
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({ error: err.message || 'invalid_input' }));
      }
    });
    return;
  }

  // --- API: COMMUNITY LIKE TOGGLE ---
  if (pathname === '/api/community/like' && method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const { id, liked } = JSON.parse(body || '{}');
        const result = communityService.toggleLike(id, clientIp);
        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify(result));
      } catch (e) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'failed' }));
      }
    });
    return;
  }

  // --- API: COMMUNITY COMMENTS ---
  if (pathname.startsWith('/api/community/comments')) {
    if (method === 'GET') {
      const postId = parsedUrl.query.post;
      const comments = db.prepare('SELECT id, author_name as author, text, is_anonymous, created_at FROM comments WHERE post_id = ? ORDER BY created_at ASC').all(postId || '');
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify({ comments }));
      return;
    }
    if (method === 'POST') {
      let body = '';
      req.on('data', chunk => { body += chunk; });
      req.on('end', () => {
        try {
          const { postId, text, author } = JSON.parse(body || '{}');
          const cleanText = security.sanitizeText(text);
          const comment = communityService.addComment(postId, {
            authorName: security.sanitizeText(author),
            text: cleanText,
            isAnonymous: true
          });
          res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
          res.end(JSON.stringify({ success: true, comment }));
        } catch (e) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'failed' }));
        }
      });
      return;
    }
  }

  // --- API: COMMUNITY READING TOOLS ---
  if (pathname === '/api/community/read' && method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const { id, mode } = JSON.parse(body || '{}');
        const post = db.prepare('SELECT title, body FROM posts WHERE id = ?').get(id) || { title: '', body: '' };
        let text = '';
        if (mode === 'summary') {
          text = `خلاصة الموضوع: ${post.title}. النقطة الأساسية هي معرفة الإجراءات الوقائية، الشهادة الطبية من المستشفى، والاتصال بالأرقام المعتمدة (19 / 177 / 8350).`;
        } else if (mode === 'simple') {
          text = `توضيح مسطري مبسط: في حال التعرض لأي ضرر، القانون المغربي يتيح لكِ الحماية الفورية. الخطوة الأولى فحص طبي والحصول على شهادة عجز، ثم التوجه للدائرة الأمنية أو مصالح الدرك أو الاتصال بخط 8350.`;
        } else if (mode === 'explain') {
          text = `المصطلحات القانونية المعتمدة:\n• القانون 103-13: الإطار القانوني المغربي لمحاربة العنف ضد النساء وتخويل وكيل الملك تدابير الطرد والحماية.\n• طلاق الشقاق: مسطرة يختص بها قسم قضاء الأسرة وتمنح الحقوق الثابتة للزوجة والأبناء دون اشتراط موافقة الزوج.\n• مدة العجز (ITT): تقدير الضرر البدني المثبت بشهادة طبية معتمدة.`;
        } else {
          text = post.body;
        }
        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({ success: true, text }));
      } catch (e) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'failed' }));
      }
    });
    return;
  }

  // --- API: AUTHENTICATION ---
  if (pathname === '/api/auth/login' && method === 'POST') {
    if (!security.checkRateLimit(clientIp, 15, 60000)) {
      return sendJson(res, 429, { error: 'rate_limited' });
    }
    try {
      const payload = await readJsonBody(req);
      const result = authService.login({ email: payload.email, password: payload.password, ipAddress: clientIp });
      return sendJson(res, 200, { success: true, ...result });
    } catch (err) {
      return sendJson(res, 401, { error: err.message });
    }
  }

  if (pathname === '/api/auth/me' && method === 'GET') {
    const user = authService.getSessionUser(req);
    if (!user) return sendJson(res, 401, { error: 'unauthorized' });
    return sendJson(res, 200, { user });
  }

  if (pathname === '/api/auth/logout' && method === 'POST') {
    const authHeader = req.headers['authorization'] || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : null;
    authService.logout(token);
    return sendJson(res, 200, { success: true });
  }

  // --- API: HELP REQUESTS & AUDIO REPORTING ---
  if (pathname === '/api/reports' && method === 'POST') {
    if (!security.checkRateLimit(clientIp, 20, 60000)) {
      return sendJson(res, 429, { error: 'rate_limited' });
    }
    try {
      const payload = await readJsonBody(req);
      const result = casesService.submitHelpRequest(payload);
      return sendJson(res, 201, { success: true, report: result });
    } catch (err) {
      return sendJson(res, 400, { error: err.message });
    }
  }

  if (pathname === '/api/reports/audio' && method === 'POST') {
    if (!security.checkRateLimit(clientIp, 10, 60000)) {
      return sendJson(res, 429, { error: 'rate_limited' });
    }
    try {
      const payload = await readJsonBody(req);
      const result = casesService.saveAudioReport(payload);
      return sendJson(res, 201, { success: true, audio: result });
    } catch (err) {
      return sendJson(res, 400, { error: err.message });
    }
  }

  if (pathname.startsWith('/api/followup/') && method === 'GET') {
    const refCode = decodeURIComponent(pathname.slice('/api/followup/'.length));
    const status = casesService.getPublicFollowUp(refCode);
    if (!status) return sendJson(res, 404, { error: 'not_found' });
    return sendJson(res, 200, { success: true, followup: status });
  }

  // --- API: PROFESSIONAL CASE MANAGEMENT (RBAC) ---
  if (pathname === '/api/cases' && method === 'GET') {
    const user = authService.getSessionUser(req);
    if (!user) return sendJson(res, 401, { error: 'unauthorized' });
    try {
      const cases = casesService.listCasesForUser(user, {
        status: parsedUrl.query.status || '',
        group: parsedUrl.query.group || ''
      });
      return sendJson(res, 200, { success: true, cases });
    } catch (err) {
      return sendJson(res, 403, { error: err.message });
    }
  }

  if (pathname.startsWith('/api/cases/') && pathname.endsWith('/status') && method === 'PATCH') {
    const user = authService.getSessionUser(req);
    if (!user) return sendJson(res, 401, { error: 'unauthorized' });
    const caseId = pathname.split('/')[3];
    try {
      const payload = await readJsonBody(req);
      const updated = casesService.updateCaseStatus(user, caseId, payload);
      return sendJson(res, 200, { success: true, case: updated });
    } catch (err) {
      return sendJson(res, err.message === 'Forbidden' ? 403 : 400, { error: err.message });
    }
  }

  if (pathname.startsWith('/api/cases/') && pathname.endsWith('/notes') && method === 'POST') {
    const user = authService.getSessionUser(req);
    if (!user) return sendJson(res, 401, { error: 'unauthorized' });
    const caseId = pathname.split('/')[3];
    try {
      const payload = await readJsonBody(req);
      const note = casesService.addCaseNote(user, caseId, payload);
      return sendJson(res, 201, { success: true, note });
    } catch (err) {
      return sendJson(res, err.message === 'Forbidden' ? 403 : 400, { error: err.message });
    }
  }

  if (pathname.startsWith('/api/audio/') && method === 'GET') {
    const user = authService.getSessionUser(req);
    if (!user) return sendJson(res, 401, { error: 'unauthorized' });
    const audioId = pathname.slice('/api/audio/'.length);
    try {
      const { filePath, mimeType } = casesService.getAudioFileForUser(user, audioId);
      res.writeHead(200, { 'Content-Type': mimeType, 'Cache-Control': 'no-store' });
      fs.createReadStream(filePath).pipe(res);
      return;
    } catch (err) {
      return sendJson(res, err.message === 'Forbidden' ? 403 : 404, { error: err.message });
    }
  }

  // --- API: DIRECTORY & PARTNERS ---
  if (pathname === '/api/directory' && method === 'GET') {
    const orgs = partnersService.listDirectory({
      region: parsedUrl.query.region || '',
      category: parsedUrl.query.category || '',
      city: parsedUrl.query.city || '',
      verifiedOnly: parsedUrl.query.all !== '1'
    });
    return sendJson(res, 200, { success: true, organizations: orgs });
  }

  if (pathname === '/api/partners/register' && method === 'POST') {
    if (!security.checkRateLimit(clientIp, 10, 60000)) {
      return sendJson(res, 429, { error: 'rate_limited' });
    }
    try {
      const payload = await readJsonBody(req);
      const org = partnersService.registerPartner(payload);
      return sendJson(res, 201, { success: true, organization: org });
    } catch (err) {
      return sendJson(res, 400, { error: err.message });
    }
  }

  if (pathname === '/api/referrals' && method === 'POST') {
    const user = authService.getSessionUser(req);
    if (!user) return sendJson(res, 401, { error: 'unauthorized' });
    try {
      const payload = await readJsonBody(req);
      const ref = partnersService.createReferral(user, payload);
      return sendJson(res, 201, { success: true, referral: ref });
    } catch (err) {
      return sendJson(res, err.message === 'Forbidden' ? 403 : 400, { error: err.message });
    }
  }

  if (pathname === '/api/analytics' && method === 'GET') {
    const user = authService.getSessionUser(req);
    if (!user) return sendJson(res, 401, { error: 'unauthorized' });
    try {
      const stats = analyticsService.getAggregatedStats(user);
      return sendJson(res, 200, { success: true, stats });
    } catch (err) {
      return sendJson(res, 403, { error: err.message });
    }
  }

  // --- API: CMS & LEGAL RESOURCES ---
  if (pathname === '/api/cms' && method === 'GET') {
    const items = cmsService.listContent({
      type: parsedUrl.query.type || '',
      publishedOnly: parsedUrl.query.all !== '1'
    });
    return sendJson(res, 200, { success: true, items });
  }

  if (pathname === '/api/cms' && method === 'POST') {
    const user = authService.getSessionUser(req);
    if (!user) return sendJson(res, 401, { error: 'unauthorized' });
    try {
      const payload = await readJsonBody(req);
      const item = cmsService.upsertContent(user, payload);
      return sendJson(res, 200, { success: true, item });
    } catch (err) {
      return sendJson(res, err.message === 'Forbidden' ? 403 : 400, { error: err.message });
    }
  }

  // --- API: AMAN GIRLS ---
  if (pathname === '/api/girls/library' && method === 'GET') {
    const items = girlsService.getLibrary({
      ageGroup: parsedUrl.query.ageGroup || '',
      category: parsedUrl.query.category || ''
    });
    return sendJson(res, 200, { success: true, items });
  }

  if (pathname === '/api/girls/quizzes' && method === 'GET') {
    return sendJson(res, 200, { success: true, quizzes: girlsService.getQuizzes() });
  }

  if (pathname === '/api/girls/specialist-request' && method === 'POST') {
    if (!security.checkRateLimit(clientIp, 15, 60000)) {
      return sendJson(res, 429, { error: 'rate_limited' });
    }
    try {
      const payload = await readJsonBody(req);
      const report = girlsService.requestSpecialistChat(payload);
      return sendJson(res, 201, {
        success: true,
        report,
        availability: 'Mon-Fri 08:30-16:30 (Pilot) · Emergency: 19 / 177 / 8350'
      });
    } catch (err) {
      return sendJson(res, 400, { error: err.message });
    }
  }

  // --- API: HEALTH CHECK ---
  if (pathname === '/api/health') {
    const postCount = db.prepare('SELECT COUNT(*) as count FROM posts').get().count;
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify({
      status: 'ok',
      service: 'AMAN Institutional Platform',
      database: 'SQLite 3 (WAL mode)',
      persistedPosts: postCount,
      geminiConfigured: Boolean(process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY),
      uptime: process.uptime(),
      time: new Date().toISOString()
    }));
    return;
  }

  // --- STATIC FILE SERVING ---
  let safePath = path.normalize(pathname).replace(/^(\.\.[\/\\])+/, '');
  if (safePath === '/' || safePath === '\\') safePath = '/index.html';

  const filePath = path.join(PUBLIC_DIR, safePath);

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      const indexPath = path.join(PUBLIC_DIR, 'index.html');
      fs.readFile(indexPath, (readErr, content) => {
        if (readErr) {
          res.writeHead(404, { 'Content-Type': 'text/plain' });
          res.end('Not Found');
        } else {
          res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
          res.end(content);
        }
      });
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    if (ext === '.html') {
      res.setHeader('Cache-Control', 'no-cache');
    } else if (['.png', '.jpg', '.jpeg', '.svg', '.woff2'].includes(ext)) {
      res.setHeader('Cache-Control', 'public, max-age=86400');
    }

    res.writeHead(200, { 'Content-Type': contentType });
    fs.createReadStream(filePath).pipe(res);
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`===============================================`);
  console.log(`AMAN Platform Server (Native SQLite Layer)`);
  console.log(`URL: http://localhost:${PORT}`);
  console.log(`Database: SQLite (WAL Mode, Persisted)`);
  console.log(`Emergency Hub: 19 (Police) | 177 (Gendarmerie) | 8350 (UNFM)`);
  console.log(`===============================================`);
});
