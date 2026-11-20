const test = require('node:test');
const assert = require('node:assert/strict');

const BASE_URL = 'http://127.0.0.1:3000';

test('GET /api/health returns ok and SQLite status', async () => {
  const res = await fetch(`${BASE_URL}/api/health`);
  assert.equal(res.status, 200);
  const data = await res.json();
  assert.equal(data.status, 'ok');
  assert.match(data.database, /SQLite/);
});

test('POST /api/chat returns safeguarding-compliant response', async () => {
  const res = await fetch(`${BASE_URL}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: 'Emergency danger', uiLang: 'en' })
  });
  assert.equal(res.status, 200);
  const data = await res.json();
  assert.equal(data.success, true);
  assert.match(data.reply, /19/);
  assert.match(data.reply, /8350/);
});

test('POST /api/reports & GET /api/followup/:ref work end-to-end', async () => {
  const res = await fetch(`${BASE_URL}/api/reports`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      beneficiaryGroup: 'child',
      category: 'Bullying',
      urgency: 'high',
      preferredLanguage: 'ar',
      submissionMethod: 'written',
      description: 'Synthetic test case for child protection',
      city: 'Laâyoune'
    })
  });
  assert.equal(res.status, 201);
  const data = await res.json();
  assert.equal(data.success, true);
  assert.ok(data.report.referenceCode.startsWith('AMC-'));

  const followRes = await fetch(`${BASE_URL}/api/followup/${data.report.referenceCode}`);
  assert.equal(followRes.status, 200);
  const followData = await followRes.json();
  assert.equal(followData.followup.status, 'NEW');
  assert.equal(followData.followup.beneficiaryGroup, 'child');
});

test('Unauthorized access to /api/cases and /api/analytics is blocked (401)', async () => {
  const casesRes = await fetch(`${BASE_URL}/api/cases`);
  assert.equal(casesRes.status, 401);

  const analyticsRes = await fetch(`${BASE_URL}/api/analytics`);
  assert.equal(analyticsRes.status, 401);
});

test('GET /api/directory returns verified Laâyoune pilot organizations', async () => {
  const res = await fetch(`${BASE_URL}/api/directory?city=La%C3%A2youne`);
  assert.equal(res.status, 200);
  const data = await res.json();
  assert.equal(data.success, true);
  assert.ok(data.organizations.length >= 1);
  assert.equal(data.organizations[0].is_verified, 1);
});

test('AMAN GIRLS endpoints (/api/girls/library, quizzes, specialist-request) work', async () => {
  const libRes = await fetch(`${BASE_URL}/api/girls/library?ageGroup=13-15`);
  assert.equal(libRes.status, 200);
  const libData = await libRes.json();
  assert.ok(libData.items.length >= 1);

  const quizRes = await fetch(`${BASE_URL}/api/girls/quizzes`);
  assert.equal(quizRes.status, 200);
  const quizData = await quizRes.json();
  assert.ok(quizData.quizzes.length >= 1);

  const specRes = await fetch(`${BASE_URL}/api/girls/specialist-request`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ preferredLanguage: 'ar', topic: 'Digital Safety', message: 'Synthetic test' })
  });
  assert.equal(specRes.status, 201);
  const specData = await specRes.json();
  assert.ok(specData.report.referenceCode.startsWith('AMG-'));
});
