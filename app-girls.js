/**
 * AMAN GIRLS — فضاء الفتيات
 * Dedicated Protection, Empowerment & Support Space for Girls (10-12, 13-15, 16-17)
 */
(function () {
  function langKey() {
    const l = typeof window.L === 'number' ? window.L : 0;
    return ['ar', 'fr', 'en'][l] || 'ar';
  }

  let selectedAge = '13-15';

  window.amanGirlsSetAge = function (age) {
    selectedAge = age;
    window.amanGirlsLoadLibrary();
  };

  window.amanGirlsLoadLibrary = async function (category = '') {
    const out = document.getElementById('girls-library-out');
    if (!out) return;
    try {
      const res = await fetch(`/api/girls/library?ageGroup=${encodeURIComponent(selectedAge)}&category=${encodeURIComponent(category)}`);
      const data = await res.json();
      const k = langKey();
      out.innerHTML = data.items.map((item) => `
        <div class="card" style="margin-top:10px">
          <span class="tag">${k === 'fr' ? item.categoryFr : k === 'en' ? item.categoryEn : item.categoryAr}</span>
          <h3 style="margin:8px 0 4px">${k === 'fr' ? item.titleFr : k === 'en' ? item.titleEn : item.titleAr}</h3>
          <p>${k === 'fr' ? item.bodyFr : k === 'en' ? item.bodyEn : item.bodyAr}</p>
        </div>
      `).join('');
    } catch {
      out.innerHTML = '<p>Unable to load educational library.</p>';
    }
  };

  window.amanGirlsLoadQuizzes = async function () {
    const out = document.getElementById('girls-quiz-out');
    if (!out) return;
    try {
      const res = await fetch('/api/girls/quizzes');
      const data = await res.json();
      const k = langKey();
      out.innerHTML = data.quizzes.map((q) => `
        <div class="card" style="margin-top:10px">
          <p><strong>${k === 'fr' ? q.questionFr : k === 'en' ? q.questionEn : q.questionAr}</strong></p>
          <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:8px">
            ${q.options.map((opt) => `
              <button type="button" class="btn o" onclick="document.getElementById('qf-${q.id}').textContent='${(k === 'fr' ? q.feedbackFr : k === 'en' ? q.feedbackEn : q.feedbackAr).replace(/'/g, "\\'")}'">
                ${k === 'fr' ? opt.labelFr : k === 'en' ? opt.labelEn : opt.labelAr}
              </button>
            `).join('')}
          </div>
          <p id="qf-${q.id}" style="margin-top:8px;font-weight:600;color:var(--ac)"></p>
        </div>
      `).join('');
    } catch {
      out.innerHTML = '<p>Unable to load activities.</p>';
    }
  };

  window.amanGirlsSpecialistSubmit = async function (e) {
    e.preventDefault();
    const f = e.target;
    const out = document.getElementById('girls-spec-out');
    try {
      const res = await fetch('/api/girls/specialist-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          preferredLanguage: langKey(),
          topic: f.topic.value,
          safeContact: f.safeContact.value,
          message: f.message.value
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed');
      out.innerHTML = `<div class="card" style="margin-top:10px;border-color:var(--ac)"><strong>Reference:</strong> <code>${data.report.referenceCode}</code><br><small>${data.availability}</small></div>`;
      f.reset();
    } catch (err) {
      out.innerHTML = `<p style="color:#b91c1c">${err.message}</p>`;
    }
    return false;
  };

  if (window.P) {
    window.P.girls = function () {
      setTimeout(() => {
        window.amanGirlsLoadLibrary();
        window.amanGirlsLoadQuizzes();
      }, 50);

      const k = langKey();
      const title = k === 'fr' ? 'Bienvenue dans AMAN Filles' : k === 'en' ? 'Welcome to AMAN Girls' : 'مرحباً بك في فضاء الفتيات';
      const safetyTitle = k === 'fr' ? 'Centre de sécurité personnelle' : k === 'en' ? 'Personal Safety Center' : 'مركز الأمان الشخصي';
      const safetyBody = k === 'fr'
        ? 'Reconnaître les situations à risque, identifier des adultes de confiance, protéger sa vie privée en ligne. Ne te mets jamais en danger face à un agresseur.'
        : k === 'en'
          ? 'Recognize unsafe situations, identify trusted adults, stay safe online. Never confront an alleged perpetrator.'
          : 'تعرفي على المواقف غير الآمنة، وحددي الأشخاص البالغين الموثوقين، واحمي خصوصيتك على الإنترنت. لا تواجهي المعتدي أبداً إذا كان ذلك يعرضك للخطر.';

      return `
        <section class="wrap" style="max-width:920px;margin:24px auto;padding:0 16px">
          <div class="card" style="margin-bottom:16px">
            <h1 style="margin-top:0">${title}</h1>
            <p style="font-weight:700;color:#b91c1c">19 (Police) · 177 (Gendarmerie) · 15 (SAMU) · 8350 (UNFM)</p>
            <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:10px">
              <button type="button" class="btn o" onclick="amanGirlsSetAge('10-12')">10–12</button>
              <button type="button" class="btn o" onclick="amanGirlsSetAge('13-15')">13–15</button>
              <button type="button" class="btn o" onclick="amanGirlsSetAge('16-17')">16–17</button>
              <a class="btn d" href="#followup">🔍 ${k === 'fr' ? 'Suivi' : k === 'en' ? 'Follow-Up' : 'متابعة الطلب'}</a>
              <a class="btn o" href="#partners">📍 ${k === 'fr' ? 'Services' : k === 'en' ? 'Services' : 'خدمات الدعم القريبة'}</a>
            </div>
          </div>

          <div class="card" style="margin-bottom:16px">
            <h2>🛡️ ${safetyTitle}</h2>
            <p>${safetyBody}</p>
          </div>

          <div class="card" style="margin-bottom:16px">
            <h2>📚 ${k === 'fr' ? 'Bibliothèque éducative' : k === 'en' ? 'Educational Library' : 'اعرفي حقوقك ومعلومات ونصائح'}</h2>
            <div id="girls-library-out"></div>
          </div>

          <div class="card" style="margin-bottom:16px">
            <h2>🎯 ${k === 'fr' ? 'Apprentissage interactif' : k === 'en' ? 'Interactive Learning' : 'أنشطة تفاعلية'}</h2>
            <div id="girls-quiz-out"></div>
          </div>

          <div class="card" style="margin-bottom:16px">
            <h2>💬 ${k === 'fr' ? 'Parler à une spécialiste (Humain)' : k === 'en' ? 'Chat with a Human Specialist' : 'تحدثي مع مختصة (دعم بشري)'}</h2>
            <p class="note">${k === 'fr' ? 'Support humain qualifié (distinct de l’assistant IA).' : k === 'en' ? 'Qualified human support (distinct from AI assistant).' : 'دعم بشري مؤهل (منفصل عن المساعد الذكي).'}</p>
            <form onsubmit="return amanGirlsSpecialistSubmit(event)">
              <input name="topic" placeholder="Topic (e.g. Bullying, Safety)" required style="width:100%;padding:10px;margin-bottom:8px">
              <input name="safeContact" placeholder="Safe contact (optional)" style="width:100%;padding:10px;margin-bottom:8px">
              <textarea name="message" rows="3" placeholder="How can we help?" required style="width:100%;padding:10px;margin-bottom:8px"></textarea>
              <button class="btn d" type="submit">${k === 'fr' ? 'Envoyer' : k === 'en' ? 'Send Request' : 'إرسال الطلب'}</button>
              <div id="girls-spec-out"></div>
            </form>
          </div>
        </section>
      `;
    };
  }
})();
