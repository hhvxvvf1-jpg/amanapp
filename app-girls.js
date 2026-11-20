/**
 * AMAN GIRLS — فضاء الفتيات
 * Dedicated Protection, Empowerment & Support Space for Girls (10-12, 13-15, 16-17)
 */
(function () {
  function langKey() {
    const l = typeof window.L === 'number' ? window.L : 0;
    return ['ar', 'fr', 'en'][l] || 'ar';
  }

  let selectedAge = localStorage.getItem('aman_girls_band') || '';

  window.amanGirlsSelectBand = function (age) {
    selectedAge = age;
    document.querySelectorAll('.girls-age-card').forEach((el) => {
      el.style.borderColor = el.dataset.age === age ? 'var(--ac,#4B176F)' : 'var(--bd,#e0d4eb)';
      el.style.background = el.dataset.age === age ? 'rgba(75,23,111,0.06)' : 'var(--card,#fff)';
    });
  };

  window.amanGirlsConfirmBand = function () {
    if (!selectedAge) selectedAge = '13-15';
    localStorage.setItem('aman_girls_band', selectedAge);
    if (typeof window.draw === 'function') window.draw();
  };

  window.amanGirlsSetAge = function (age) {
    selectedAge = age;
    localStorage.setItem('aman_girls_band', age);
    window.amanGirlsLoadLibrary();
    window.amanGirlsLoadQuizzes();
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
      const res = await fetch('/api/girls/quizzes?ageGroup=' + encodeURIComponent(selectedAge || '13-15'));
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
      const k = langKey();
      const activeBand = localStorage.getItem('aman_girls_band');
      if (!activeBand) {
        return `
          <section class="wrap" style="max-width:860px;margin:24px auto;padding:0 16px">
            <div class="card" style="text-align:center;padding:24px">
              <h1 style="margin-top:0;color:var(--ac,#4B176F)">مرحباً بك في فضاء الفتيات AMAN GIRLS</h1>
              <p>اختاري فئتك العمرية حتى نعرض لك المحتوى والأنشطة والمعلومات المناسبة لك.</p>
              <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:12px;margin:18px 0;text-align:start">
                <div class="card girls-age-card" data-age="10-12" onclick="amanGirlsSelectBand('10-12')" style="cursor:pointer;border:2px solid var(--bd,#e0d4eb)">
                  <strong>من 10 إلى 12 سنة</strong>
                  <p style="font-size:.9rem;margin:8px 0 0">فضاء مبسط للتعلم والتوعية واكتشاف الحقوق والسلامة الشخصية.</p>
                </div>
                <div class="card girls-age-card" data-age="13-15" onclick="amanGirlsSelectBand('13-15')" style="cursor:pointer;border:2px solid var(--bd,#e0d4eb)">
                  <strong>من 13 إلى 15 سنة</strong>
                  <p style="font-size:.9rem;margin:8px 0 0">معلومات وأنشطة حول الحقوق، الثقة بالنفس، العلاقات الصحية، الحماية والسلامة الرقمية.</p>
                </div>
                <div class="card girls-age-card" data-age="16-17" onclick="amanGirlsSelectBand('16-17')" style="cursor:pointer;border:2px solid var(--bd,#e0d4eb)">
                  <strong>من 16 إلى 17 سنة</strong>
                  <p style="font-size:.9rem;margin:8px 0 0">محتوى أكثر تفصيلاً حول الحقوق، الاستقلالية، التوجيه، الصحة، الحماية والتمكين.</p>
                </div>
              </div>
              <button type="button" class="btn d" style="padding:12px 28px" onclick="amanGirlsConfirmBand()">متابعة</button>
              <p style="margin-top:14px;font-weight:700;color:#b91c1c">19 (Police) · 177 (Gendarmerie) · 15 (SAMU) · 8350 (UNFM)</p>
            </div>
          </section>
        `;
      }
      selectedAge = activeBand;
      setTimeout(() => {
        window.amanGirlsLoadLibrary();
        window.amanGirlsLoadQuizzes();
      }, 50);
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
              <a class="btn d" href="#followup">${k === 'fr' ? 'Suivi' : k === 'en' ? 'Follow-Up' : 'متابعة الطلب'}</a>
              <a class="btn o" href="#map">${k === 'fr' ? 'Carte des services' : k === 'en' ? 'Services Map' : 'خريطة خدمات الدعم'}</a>
            </div>
          </div>

          <div class="card" style="margin-bottom:16px">
            <h2>🛡️ ${safetyTitle}</h2>
            <p>${safetyBody}</p>
          </div>

          <div class="card" style="margin-bottom:16px">
            <h2>💜 ${k === 'fr' ? 'Soutien psychologique & Bien-être' : k === 'en' ? 'Psychological Support & Wellbeing' : 'الدعم النفسي والمرافقة'}</h2>
            <p>${k === 'fr'
              ? 'Tu n’es pas seule. Si tu ressens de la peur, du stress ou de la tristesse, tu peux demander une écoute confidentielle avec une spécialiste qualifiée.'
              : k === 'en'
                ? 'You are not alone. If you feel scared, stressed, or sad, you can request confidential support from a trained specialist.'
                : 'لستِ وحدكِ أبداً. إذا كنتِ تشعرين بالخوف أو التوتر أو الحزن بسبب ما تمرين به، يمكنكِ طلب جلسة استماع ودعم نفسي سرية مع مختصة مؤهلة.'}</p>
          </div>

          <div class="card" style="margin-bottom:16px">
            <h2>📢 ${k === 'fr' ? 'Signaler une situation (Écrit ou Audio)' : k === 'en' ? 'Report a Situation (Written or Audio)' : 'أريد التبليغ أو طلب المساعدة (كتابي أو صوتي)'}</h2>
            <form onsubmit="return amanSubmitReport(event, 'girls')">
              <label>${k === 'fr' ? 'Type de situation' : k === 'en' ? 'Situation Type' : 'نوع الحالة'}</label>
              <select name="category" required style="width:100%;padding:10px;margin-bottom:10px">
                <option value="Bullying">${k === 'fr' ? 'Harcèlement scolaire / Cyberharcèlement' : k === 'en' ? 'School Bullying / Cyberbullying' : 'تنمر مدرسي أو إلكتروني'}</option>
                <option value="Online Blackmail">${k === 'fr' ? 'Chantage en ligne' : k === 'en' ? 'Online Blackmail' : 'ابتزاز أو تهديد إلكتروني'}</option>
                <option value="Family Violence">${k === 'fr' ? 'Violence familiale' : k === 'en' ? 'Family Violence' : 'عنف داخل الأسرة'}</option>
                <option value="Psychological Support">${k === 'fr' ? 'Besoin de soutien psychologique' : k === 'en' ? 'Psychological Support' : 'طلب دعم نفسي وتوجيه'}</option>
              </select>
              <label>${k === 'fr' ? 'Urgence' : k === 'en' ? 'Urgency' : 'درجة الاستعجال'}</label>
              <select name="urgency" style="width:100%;padding:10px;margin-bottom:10px">
                <option value="normal">${k === 'fr' ? 'Normal' : k === 'en' ? 'Normal' : 'عادي'}</option>
                <option value="high">${k === 'fr' ? 'Élevé' : k === 'en' ? 'High' : 'مستعجل'}</option>
                <option value="urgent">${k === 'fr' ? 'Danger immédiat' : k === 'en' ? 'Immediate Danger' : 'خطر فوري'}</option>
              </select>
              <textarea name="description" rows="3" placeholder="${k === 'fr' ? 'Explique ce qui s’est passé (facultatif)...' : k === 'en' ? 'Describe what happened (optional)...' : 'احكي لنا ما حدث باختصار (اختياري، ولا يلزمكِ كتابة اسمكِ الكامل)...'}" style="width:100%;padding:10px;margin-bottom:10px"></textarea>
              <div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center;margin-bottom:10px">
                <button type="button" class="btn o" onclick="amanStartAudio()">🎙️ ${k === 'fr' ? 'Enregistrer audio' : k === 'en' ? 'Record Audio' : 'تسجيل صوتي'}</button>
                <button type="button" class="btn o" onclick="amanStopAudio()">⏹️ ${k === 'fr' ? 'Arrêter' : k === 'en' ? 'Stop' : 'إيقاف'}</button>
                <button type="button" class="btn o" onclick="amanClearAudio()">🗑️ ${k === 'fr' ? 'Effacer' : k === 'en' ? 'Clear' : 'مسح'}</button>
                <span id="aman-rec-time">0s</span>
              </div>
              <audio id="aman-audio-preview" controls style="display:none;width:100%;margin-bottom:10px"></audio>
              <button type="submit" class="btn d" style="width:100%;padding:12px">${k === 'fr' ? 'Envoyer en toute confidentialité' : k === 'en' ? 'Submit Confidentially' : 'إرسال الطلب بسرية تامة'}</button>
              <div id="aman-report-status"></div>
            </form>
          </div>

          <div class="card" style="margin-bottom:16px">
            <h2>${k === 'fr' ? 'Bibliothèque éducative' : k === 'en' ? 'Educational Library' : 'اعرفي حقوقك ومعلومات ونصائح'}</h2>
            <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:10px">
              <button type="button" class="btn o" onclick="amanGirlsLoadLibrary('')">${k === 'fr' ? 'Tout' : k === 'en' ? 'All' : 'الكل'}</button>
              <button type="button" class="btn o" onclick="amanGirlsLoadLibrary('rights')">${k === 'fr' ? 'Droits' : k === 'en' ? 'Rights' : 'الحقوق والحماية'}</button>
              <button type="button" class="btn o" onclick="amanGirlsLoadLibrary('understanding_violence')">${k === 'fr' ? 'Violences' : k === 'en' ? 'Violence' : 'فهم العنف'}</button>
              <button type="button" class="btn o" onclick="amanGirlsLoadLibrary('digital_safety')">${k === 'fr' ? 'Sécurité numérique' : k === 'en' ? 'Digital Safety' : 'السلامة الرقمية'}</button>
              <button type="button" class="btn o" onclick="amanGirlsLoadLibrary('wellbeing')">${k === 'fr' ? 'Bien-être' : k === 'en' ? 'Wellbeing' : 'الصحة والرفاه'}</button>
              <button type="button" class="btn o" onclick="amanGirlsLoadLibrary('empowerment')">${k === 'fr' ? 'Éducation' : k === 'en' ? 'Empowerment' : 'التعليم والتمكين'}</button>
            </div>
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
    if (location.hash === '#girls' && typeof window.draw === 'function') {
      window.draw();
    }
  }
})();
