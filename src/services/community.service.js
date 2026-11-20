const crypto = require('node:crypto');
const { db } = require('../db/database');
const security = require('../middleware/security');

function getFeed({ category = '', search = '', page = 0, limit = 20 }) {
  const offset = Math.max(0, Number(page) || 0) * limit;
  let query = 'SELECT id, author_name as author, is_anonymous as isAnonymous, category, title, body, image_url as image, likes_count as likes, created_at as createdAt FROM posts WHERE 1=1';
  const params = [];

  if (category && category !== 'all') {
    query += ' AND category = ?';
    params.push(category);
  }
  if (search) {
    query += ' AND (title LIKE ? OR body LIKE ?)';
    const likeTerm = `%${search}%`;
    params.push(likeTerm, likeTerm);
  }

  query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
  params.push(limit, offset);

  return db.prepare(query).all(...params);
}

function createPost({ authorName, isAnonymous = true, category = 'general', title, body, imageUrl = null }) {
  if (!title || !body) {
    throw new Error('Title and body are required');
  }
  const id = 'post_' + crypto.randomUUID().slice(0, 12);
  const displayAuthor = isAnonymous ? 'مشاركة (هوية محفوظة)' : (authorName || 'مشاركة');

  db.prepare(`
    INSERT INTO posts (id, author_name, is_anonymous, category, title, body, image_url)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(id, displayAuthor, isAnonymous ? 1 : 0, category, title, body, imageUrl);

  return db.prepare('SELECT id, author_name as author, is_anonymous as isAnonymous, category, title, body, image_url as image, likes_count as likes, created_at as createdAt FROM posts WHERE id = ?').get(id);
}

function toggleLike(postId, clientIp) {
  const ipHash = security.hashIp(clientIp);
  const existing = db.prepare('SELECT 1 FROM post_likes WHERE post_id = ? AND ip_hash = ?').get(postId, ipHash);

  if (existing) {
    db.prepare('DELETE FROM post_likes WHERE post_id = ? AND ip_hash = ?').run(postId, ipHash);
    db.prepare('UPDATE posts SET likes_count = MAX(0, likes_count - 1) WHERE id = ?').run(postId);
  } else {
    db.prepare('INSERT INTO post_likes (post_id, ip_hash) VALUES (?, ?)').run(postId, ipHash);
    db.prepare('UPDATE posts SET likes_count = likes_count + 1 WHERE id = ?').run(postId);
  }

  const post = db.prepare('SELECT likes_count as likes FROM posts WHERE id = ?').get(postId);
  return { success: true, liked: !existing, likes: post ? post.likes : 0 };
}

function addComment(postId, { authorName, text, isAnonymous = true }) {
  if (!postId || !text) {
    throw new Error('Post ID and text are required');
  }
  const id = 'cmt_' + crypto.randomUUID().slice(0, 12);
  const displayAuthor = isAnonymous ? 'مشاركة (هوية محفوظة)' : (authorName || 'مشاركة');

  db.prepare(`
    INSERT INTO comments (id, post_id, author_name, text, is_anonymous)
    VALUES (?, ?, ?, ?, ?)
  `).run(id, postId, displayAuthor, text, isAnonymous ? 1 : 0);

  return db.prepare('SELECT id, author_name as author, text, is_anonymous, created_at FROM comments WHERE id = ?').get(id);
}

module.exports = {
  getFeed,
  createPost,
  toggleLike,
  addComment
};
