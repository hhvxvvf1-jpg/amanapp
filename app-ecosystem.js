/**
 * AMAN Ecosystem Module
 * Women, Girls, Child Protection, Audio Reporting, Follow-Up, Response Dashboard & Partners
 */
(function () {
  const TXT = {
    ar: {
      womenTitle: 'فضاء أمان للنساء',
      womenSub: 'مساحة آمنة وسرية لطلب المساعدة والتوجيه القانوني والاجتماعي. لستِ وحدكِ.',
      girlsTitle: 'فضاء أمان للفتيات',
      girlsSub: 'معلومات مبسطة وآمنة لمواجهة التنمر والتحرش، وطلب المساعدة من مختصين موثوقين.',
      childTitle: 'فضاء أمان للأطفال',
      childSub: 'أنتَ في أمان هنا. لا تحتاج لكتابة اسمك الكامل أو عنوانك. يمكنك التحدث أو الكتابة لطلب المساعدة.',
      childNext: 'ماذا يحدث بعد إرسال الطلب؟ سيقرأ طلبك مختص بشري مدرب لحماية الأطفال وسيوضح لك الخطوة الآمنة التالية.',
      emergencyNote: 'في حالة الخطر الفوري: الشرطة 19 · الدرك 177 · الإسعاف 15 · خط المساندة 8350',
      category: 'نوع الدعم أو الحماية',
      urgency: 'درجة الاستعجال',
      urgNormal: 'عادي',
      urgHigh: 'مستعجل',
      urgUrgent: 'خطر فوري',
      desc: 'اشرحي/اشرح ما حدث (اختياري)',
      safeContact: 'وسيلة تواصل آمنة (اختياري - فقط إذا كان ذلك آمناً)',
      city: 'المدينة (مثال: العيون)',
      recordStart: 'بدء التسجيل الصوتي',
      recordStop: 'إيقاف التسجيل',
      recordDelete: 'حذف وإعادة التسجيل',
      submitBtn: 'إرسال الطلب بسرية',
      submittedOk: 'تم استلام طلبك بنجاح. احتفظي/احتفظ برمز المتابعة:',
      followupTitle: 'متابعة حالة الطلب',
      followupPlaceholder: 'أدخلي رمز المتابعة (مثال: AMW-...)',
      followupBtn: 'تحقق من الحالة',
      partnersTitle: 'بوابة الشركاء ودليل الخدمات (العيون - المغرب)',
      responseTitle: 'لوحة التدخل المهني (AMAN Response)',
      loginBtn: 'تسجيل الدخول المهني',
      email: 'البريد المهني',
      password: 'كلمة المرور'
    },
    fr: {
      womenTitle: 'Espace AMAN Femmes',
      womenSub: 'Un espace sûr et confidentiel pour demander de l’aide et une orientation juridique et sociale.',
      girlsTitle: 'Espace AMAN Filles',
      girlsSub: 'Ressources adaptées contre le harcèlement et les violences, et accès à des professionnels de confiance.',
      childTitle: 'Espace AMAN Enfants',
      childSub: 'Tu es en sécurité ici. Tu n’es pas obligé(e) de donner ton nom complet ou ton adresse.',
      childNext: 'Que se passe-t-il après ? Un professionnel qualifié en protection de l’enfance examinera ta demande.',
      emergencyNote: 'Danger immédiat : Police 19 · Gendarmerie 177 · SAMU 15 · Ligne UNFM 8350',
      category: 'Catégorie de soutien',
      urgency: 'Niveau d’urgence',
      urgNormal: 'Normal',
      urgHigh: 'Élevé',
      urgUrgent: 'Urgence immédiate',
      desc: 'Décrivez la situation (facultatif)',
      safeContact: 'Contact sûr (facultatif - uniquement si sans danger)',
      city: 'Ville (ex: Laâyoune)',
      recordStart: 'Enregistrer un message vocal',
      recordStop: 'Arrêter l’enregistrement',
      recordDelete: 'Supprimer et réenregistrer',
      submitBtn: 'Envoyer confidentiellement',
      submittedOk: 'Demande enregistrée. Conservez votre code de suivi :',
      followupTitle: 'Suivi de demande',
      followupPlaceholder: 'Code de suivi (ex: AMW-...)',
      followupBtn: 'Vérifier le statut',
      partnersTitle: 'Portail Partenaires & Annuaire (Pilote Laâyoune)',
      responseTitle: 'Tableau de bord professionnel (AMAN Response)',
      loginBtn: 'Connexion professionnelle',
      email: 'Email professionnel',
      password: 'Mot de passe'
    },
    en: {
      womenTitle: 'AMAN Women Space',
      womenSub: 'A safe, confidential space to request support, legal guidance, and referrals.',
      girlsTitle: 'AMAN Girls Space',
      girlsSub: 'Age-appropriate resources against bullying and harassment, and access to trusted professionals.',
      childTitle: 'AMAN Child Protection',
      childSub: 'You are safe here. You do not have to share your full name or address to ask for help.',
      childNext: 'What happens next? A trained child-protection professional will review your request.',
      emergencyNote: 'Immediate danger: Police 19 · Gendarmerie 177 · Ambulance 15 · UNFM 8350',
      category: 'Support Category',
      urgency: 'Urgency Level',
      urgNormal: 'Normal',
      urgHigh: 'High',
      urgUrgent: 'Immediate Danger',
      desc: 'Describe what happened (optional)',
      safeContact: 'Safe contact (optional - only if safe)',
      city: 'City (e.g. Laâyoune)',
      recordStart: 'Start Voice Recording',
      recordStop: 'Stop Recording',
      recordDelete: 'Delete & Re-record',
      submitBtn: 'Submit Confidentially',
      submittedOk: 'Request received. Save your follow-up reference code:',
      followupTitle: 'Case Follow-Up',
      followupPlaceholder: 'Enter reference code (e.g. AMW-...)',
      followupBtn: 'Check Status',
      partnersTitle: 'Partner Portal & Services Directory (Laâyoune Pilot)',
      responseTitle: 'Professional Case Management (AMAN Response)',
      loginBtn: 'Professional Login',
      email: 'Professional Email',
      password: 'Password'
    }
  };

  function langKey() {
    const l = typeof window.L === 'number' ? window.L : 0;
    return ['ar', 'fr', 'en'][l] || 'ar';
  }
  function tr(k) {
    return (TXT[langKey()] && TXT[langKey()][k]) || TXT.ar[k] || k;
  }

  let mediaRecorder = null;
  let audioChunks = [];
  let recordedBase64 = null;
  let recordedMime = 'audio/webm';
  let recordSeconds = 0;
  let recordTimer = null;

  window.amanStartAudio = async function () {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunks = [];
      recordedBase64 = null;
      recordSeconds = 0;
      mediaRecorder = new MediaRecorder(stream);
      mediaRecorder.ondataavailable = (e) => { if (e.data.size > 0) audioChunks.push(e.data); };
      mediaRecorder.onstop = () => {
        clearInterval(recordTimer);
        stream.getTracks().forEach((t) => t.stop());
        const blob = new Blob(audioChunks, { type: mediaRecorder.mimeType || 'audio/webm' });
        recordedMime = blob.type || 'audio/webm';
        const reader = new FileReader();
        reader.onloadend = () => {
          recordedBase64 = String(reader.result).split(',')[1];
          const prev = document.getElementById('aman-audio-preview');
          if (prev) {
            prev.src = URL.createObjectURL(blob);
            prev.style.display = 'block';
          }
        };
        reader.readAsDataURL(blob);
      };
      mediaRecorder.start();
      recordTimer = setInterval(() => {
        recordSeconds += 1;
        const el = document.getElementById('aman-rec-time');
        if (el) el.textContent = recordSeconds + 's';
      }, 1000);
    } catch (e) {
      alert('Microphone access is required for voice reporting.');
    }
  };

  window.amanStopAudio = function () {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      mediaRecorder.stop();
    }
  };

  window.amanClearAudio = function () {
    recordedBase64 = null;
    recordSeconds = 0;
    const prev = document.getElementById('aman-audio-preview');
    if (prev) { prev.src = ''; prev.style.display = 'none'; }
    const el = document.getElementById('aman-rec-time');
    if (el) el.textContent = '0s';
  };

  window.amanSubmitReport = async function (e, group) {
    e.preventDefault();
    const f = e.target;
    const statusEl = document.getElementById('aman-report-status');
    const payload = {
      beneficiaryGroup: group,
      category: f.category.value,
      urgency: f.urgency.value,
      preferredLanguage: langKey(),
      submissionMethod: recordedBase64 ? 'audio' : 'written',
      description: f.description.value,
      safeContact: f.safeContact ? f.safeContact.value : '',
      city: f.city ? f.city.value : ''
    };

    try {
      const res = await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed');

      if (recordedBase64 && data.report && data.report.id) {
        await fetch('/api/reports/audio', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            caseId: data.report.id,
            base64Audio: recordedBase64,
            mimeType: recordedMime,
            durationSeconds: recordSeconds,
            language: langKey()
          })
        });
      }

      statusEl.innerHTML = `<div class="card" style="border-color:var(--ac);margin-top:12px"><strong>${tr('submittedOk')}</strong> <code style="font-size:1.1em">${data.report.referenceCode}</code></div>`;
      f.reset();
      window.amanClearAudio();
    } catch (err) {
      statusEl.textContent = 'Error: ' + err.message;
    }
    return false;
  };

  function renderReportPage(group, titleKey, subKey, categories) {
    const isChild = group === 'child';
    return `
      <section class="wrap" style="max-width:760px;margin:24px auto;padding:0 16px">
        <div class="card" style="margin-bottom:16px">
          <h1 style="margin-top:0">${tr(titleKey)}</h1>
          <p>${tr(subKey)}</p>
          ${isChild ? `<p class="note">${tr('childNext')}</p>` : ''}
          <p style="font-weight:700;color:#b91c1c">${tr('emergencyNote')}</p>
        </div>
        <form class="card" onsubmit="return amanSubmitReport(event, '${group}')">
          <label>${tr('category')}</label>
          <select name="category" required style="width:100%;padding:10px;margin-bottom:12px">
            ${categories.map((c) => `<option value="${c}">${c}</option>`).join('')}
          </select>
          <label>${tr('urgency')}</label>
          <select name="urgency" style="width:100%;padding:10px;margin-bottom:12px">
            <option value="normal">${tr('urgNormal')}</option>
            <option value="high">${tr('urgHigh')}</option>
            <option value="urgent">${tr('urgUrgent')}</option>
          </select>
          <label>${tr('desc')}</label>
          <textarea name="description" rows="4" maxlength="2000" style="width:100%;padding:10px;margin-bottom:12px"></textarea>
          ${!isChild ? `<label>${tr('safeContact')}</label><input type="text" name="safeContact" maxlength="150" style="width:100%;padding:10px;margin-bottom:12px">` : ''}
          <label>${tr('city')}</label>
          <input type="text" name="city" placeholder="Laâyoune" maxlength="100" style="width:100%;padding:10px;margin-bottom:12px">
          <div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center;margin:12px 0">
            <button type="button" class="btn o" onclick="amanStartAudio()">🎙️ ${tr('recordStart')}</button>
            <button type="button" class="btn o" onclick="amanStopAudio()">⏹️ ${tr('recordStop')}</button>
            <button type="button" class="btn o" onclick="amanClearAudio()">🗑️ ${tr('recordDelete')}</button>
            <span id="aman-rec-time">0s</span>
          </div>
          <audio id="aman-audio-preview" controls style="display:none;width:100%;margin-bottom:12px"></audio>
          <button type="submit" class="btn d" style="width:100%;padding:14px;font-size:1.05em">${tr('submitBtn')}</button>
          <div id="aman-report-status"></div>
        </form>
      </section>
    `;
  }

  window.amanCheckFollowUp = async function (e) {
    e.preventDefault();
    const code = e.target.refCode.value.trim();
    const out = document.getElementById('aman-followup-out');
    try {
      const res = await fetch('/api/followup/' + encodeURIComponent(code));
      const data = await res.json();
      if (!res.ok) throw new Error('Not found');
      out.innerHTML = `<div class="card" style="margin-top:12px"><p><strong>Code:</strong> ${data.followup.referenceCode}</p><p><strong>Status:</strong> <span class="tag">${data.followup.status}</span></p><p><strong>Updated:</strong> ${data.followup.updatedAt}</p></div>`;
    } catch {
      out.innerHTML = `<p style="color:#b91c1c;margin-top:10px">Reference code not found.</p>`;
    }
    return false;
  };

  window.amanStaffLogin = async function (e) {
    e.preventDefault();
    const out = document.getElementById('aman-response-out');
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: e.target.email.value, password: e.target.password.value })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Login failed');
      localStorage.setItem('aman_staff_token', data.token);
      window.amanLoadCases();
    } catch (err) {
      out.innerHTML = `<p style="color:#b91c1c">${err.message}</p>`;
    }
    return false;
  };

  window.amanUpdateCaseStatus = async function (caseId, status) {
    const token = localStorage.getItem('aman_staff_token');
    if (!token) return;
    await fetch(`/api/cases/${encodeURIComponent(caseId)}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token },
      body: JSON.stringify({ status })
    });
    window.amanLoadCases();
  };

  window.amanLoadCases = async function () {
    const token = localStorage.getItem('aman_staff_token');
    const out = document.getElementById('aman-response-out');
    if (!token || !out) return;
    try {
      const [casesRes, statsRes] = await Promise.all([
        fetch('/api/cases', { headers: { Authorization: 'Bearer ' + token } }),
        fetch('/api/analytics', { headers: { Authorization: 'Bearer ' + token } })
      ]);
      const data = await casesRes.json();
      if (!casesRes.ok) throw new Error(data.error || 'Unauthorized');

      let statsHtml = '';
      if (statsRes.ok) {
        const s = (await statsRes.json()).stats;
        statsHtml = `<div class="card" style="margin-bottom:12px"><strong>Analytics</strong>: Total ${s.totalRequests} · New ${s.newRequests} · Urgent ${s.urgentRequests} · Resolved ${s.resolvedCases}</div>`;
      }

      out.innerHTML = statsHtml + (data.cases.length
        ? data.cases.map((c) => `
          <div class="card" style="margin-top:10px">
            <strong>${c.reference_code}</strong> · <span class="tag">${c.beneficiary_group}</span> · <span class="tag">${c.status}</span>
            <p>${c.category} (${c.urgency})</p>
            <div style="display:flex;gap:6px;flex-wrap:wrap">
              <button type="button" class="btn o" onclick="amanUpdateCaseStatus('${c.id}','INITIAL_REVIEW')">Review</button>
              <button type="button" class="btn o" onclick="amanUpdateCaseStatus('${c.id}','FOLLOW_UP')">Follow-Up</button>
              <button type="button" class="btn d" onclick="amanUpdateCaseStatus('${c.id}','RESOLVED')">Resolve</button>
            </div>
          </div>`).join('')
        : '<p>No cases assigned.</p>');
    } catch (err) {
      out.innerHTML = `<p>${err.message}</p>`;
    }
  };

  window.amanLoadMap = async function () {
    const city = (document.getElementById('map-city') || {}).value || '';
    const cat = (document.getElementById('map-cat') || {}).value || '';
    const out = document.getElementById('aman-map-list');
    if (!out) return;
    try {
      const res = await fetch(`/api/directory?city=${encodeURIComponent(city)}&category=${encodeURIComponent(cat)}`);
      const data = await res.json();
      const k = langKey();
      out.innerHTML = data.organizations.length
        ? data.organizations.map((o) => `
          <div class="card" style="margin-top:10px">
            <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:6px">
              <strong>${k === 'fr' ? o.name_fr : k === 'en' ? o.name_en : o.name_ar}</strong>
              <span class="tag">${o.city} · ${o.region}</span>
            </div>
            <p style="margin:6px 0">${o.address || ''} · ${o.phone || ''}</p>
            <small>${o.operating_hours || ''} · ${o.accessibility_info || ''}</small>
            ${o.latitude && o.longitude ? `<div style="margin-top:8px"><a class="btn o" target="_blank" rel="noopener" href="https://www.openstreetmap.org/?mlat=${o.latitude}&mlon=${o.longitude}#map=15/${o.latitude}/${o.longitude}">${k === 'fr' ? 'Itinéraire' : k === 'en' ? 'Directions' : 'الاتجاهات'}</a></div>` : ''}
          </div>
        `).join('')
        : '<p>No verified services found for this filter.</p>';
    } catch {
      out.innerHTML = '<p>Error loading services map.</p>';
    }
  };

  window.amanLoadDirectory = async function () {
    const city = (document.getElementById('aman-dir-city') || {}).value || '';
    const out = document.getElementById('aman-dir-list');
    if (!out) return;
    try {
      const res = await fetch('/api/directory?city=' + encodeURIComponent(city));
      const data = await res.json();
      out.innerHTML = data.organizations.length
        ? data.organizations.map((o) => `
          <div class="card" style="margin-top:10px">
            <strong>${langKey() === 'fr' ? o.name_fr : langKey() === 'en' ? o.name_en : o.name_ar}</strong>
            <span class="tag">${o.city}</span>
            <p>${o.address || ''} · ${o.phone || ''}</p>
            <small>${o.operating_hours || ''} · ${o.accessibility_info || ''}</small>
          </div>
        `).join('')
        : '<p>No verified services found.</p>';
    } catch {
      out.innerHTML = '<p>Error loading directory.</p>';
    }
  };

  window.amanRegisterPartner = async function (e) {
    e.preventDefault();
    const f = e.target;
    const out = document.getElementById('aman-partner-status');
    try {
      const res = await fetch('/api/partners/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nameAr: f.nameAr.value,
          nameFr: f.nameFr.value,
          category: f.category.value,
          city: f.city.value,
          phone: f.phone.value,
          email: f.email.value
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed');
      out.innerHTML = `<p style="color:green">Submitted for verification (ID: ${data.organization.id}).</p>`;
      f.reset();
    } catch (err) {
      out.innerHTML = `<p style="color:#b91c1c">${err.message}</p>`;
    }
    return false;
  };

  // Register routes into existing P object if available
  if (window.P) {
    window.P.home = () => {
      const k = langKey();
      const title = k === 'fr' ? 'AMAN — Protection, Prévention & Soutien' : k === 'en' ? 'AMAN — Protection, Prevention & Support' : 'أمان — الحماية، الوقاية، والدعم';
      const sub = k === 'fr'
        ? 'Vous n’êtes pas seule. Accédez à une orientation fiable, un soutien psychologique et des services vérifiés au Maroc.'
        : k === 'en'
          ? 'You are not alone. Access trusted guidance, psychological support, and verified services in Morocco.'
          : 'لستِ وحدكِ. منصة أمان توفر لكِ التوجيه الموثوق، الدعم النفسي والاجتماعي، والوصول الآمن لخدمات الحماية في المغرب.';
      return `
        <section class="wrap">
          <div class="card" style="text-align:center;margin-bottom:16px">
            <img src="logo.png" alt="AMAN" style="width:76px;height:76px;object-fit:contain;margin:0 auto 10px;display:block">
            <h1 style="margin:0 0 8px;color:var(--ac,#4B176F)">${title}</h1>
            <p style="margin:0 0 14px">${sub}</p>
            <div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap">
              <a class="btn d" href="#women">${k === 'fr' ? 'Espace Femmes' : k === 'en' ? 'Women Space' : 'فضاء النساء'}</a>
              <a class="btn d" href="#girls">${k === 'fr' ? 'Espace Filles' : k === 'en' ? 'Girls Space' : 'فضاء الفتيات'}</a>
              <a class="btn o" href="#child">${k === 'fr' ? 'Espace Enfants' : k === 'en' ? 'Child Space' : 'فضاء الأطفال'}</a>
            </div>
          </div>

          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:14px;margin-bottom:16px">
            <div class="card">
              <img src="aman.jpg" alt="AMAN Support" style="width:100%;height:130px;object-fit:cover;border-radius:12px;margin-bottom:10px">
              <h3 style="margin:0 0 6px">${k === 'fr' ? 'Signalement confidentiel' : k === 'en' ? 'Confidential Reporting' : 'تبليغ سري وآمن'}</h3>
              <p style="margin:0 0 10px;font-size:.92rem">${k === 'fr' ? 'Envoyez une demande écrite ou vocale en toute confidentialité.' : k === 'en' ? 'Submit a written or voice request confidentially.' : 'أرسلي طلب مساعدة مكتوباً أو صوتياً بسرية تامة مع رمز متابعة.'}</p>
              <a class="btn o" href="#followup">${k === 'fr' ? 'Suivi de demande' : k === 'en' ? 'Track Request' : 'متابعة طلب'}</a>
            </div>
            <div class="card">
              <img src="unfm.jpg" alt="Support Services" style="width:100%;height:130px;object-fit:cover;border-radius:12px;margin-bottom:10px">
              <h3 style="margin:0 0 6px">${k === 'fr' ? 'Services vérifiés' : k === 'en' ? 'Verified Services' : 'خدمات الدعم الموثقة'}</h3>
              <p style="margin:0 0 10px;font-size:.92rem">${k === 'fr' ? 'Centres d’écoute et associations vérifiées (Pilote Laâyoune).' : k === 'en' ? 'Verified listening centers and NGOs (Laâyoune Pilot).' : 'مراكز الاستماع والجمعيات الموثقة (العيون والمغرب).'}</p>
              <a class="btn o" href="#map">${k === 'fr' ? 'Voir la carte' : k === 'en' ? 'View Map' : 'خريطة الخدمات'}</a>
            </div>
          </div>

          <div class="card" style="text-align:center">
            <strong style="color:#b91c1c">${k === 'fr' ? 'Urgences Maroc : Police 19 · Gendarmerie 177 · SAMU 15 · UNFM 8350' : k === 'en' ? 'Morocco Emergencies: Police 19 · Gendarmerie 177 · Ambulance 15 · UNFM 8350' : 'أرقام الطوارئ في المغرب: الشرطة 19 · الدرك 177 · الإسعاف 15 · خط المساندة 8350'}</strong>
          </div>
        </section>
      `;
    };
    window.P.women = () => renderReportPage('women', 'womenTitle', 'womenSub', ['Domestic Violence', 'Physical Violence', 'Psychological Violence', 'Economic Violence', 'Digital Harassment', 'Workplace Harassment']);
    window.P.girls = () => renderReportPage('girls', 'girlsTitle', 'girlsSub', ['Bullying', 'Cyberbullying', 'Harassment', 'Family Violence', 'School Violence']);
    window.P.child = () => renderReportPage('child', 'childTitle', 'childSub', ['Physical Abuse', 'Psychological Abuse', 'Neglect', 'Bullying', 'Online Exploitation', 'School Violence']);
    window.P.followup = () => `
      <section class="wrap" style="max-width:600px;margin:24px auto;padding:0 16px">
        <div class="card">
          <h1>${tr('followupTitle')}</h1>
          <form onsubmit="return amanCheckFollowUp(event)">
            <input type="text" name="refCode" placeholder="${tr('followupPlaceholder')}" required style="width:100%;padding:10px;margin-bottom:12px">
            <button class="btn d" type="submit">${tr('followupBtn')}</button>
          </form>
          <div id="aman-followup-out"></div>
        </div>
      </section>
    `;
    window.P.map = () => {
      setTimeout(() => window.amanLoadMap(), 50);
      const k = langKey();
      return `
        <section class="wrap" style="max-width:900px;margin:24px auto;padding:0 16px">
          <div class="card" style="margin-bottom:16px">
            <h1 style="margin-top:0">${k === 'fr' ? 'AMAN MAP — Annuaire des services vérifiés' : k === 'en' ? 'AMAN MAP — Verified Services Directory' : 'خريطة أمان — دليل الخدمات الموثقة (العيون والمغرب)'}</h1>
            <p class="note">${k === 'fr' ? 'Confidentialité : aucune localisation de bénéficiaire ou de refuge confidentiel n’est affichée.' : k === 'en' ? 'Privacy: no beneficiary or confidential shelter locations are ever displayed.' : 'الخصوصية: لا يتم أبداً عرض مواقع المستفيدات أو الأطفال أو دور الإيواء السرية.'}</p>
            <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:10px">
              <input id="map-city" type="text" placeholder="Laâyoune / Rabat..." value="Laâyoune" style="flex:1;min-width:160px;padding:10px">
              <select id="map-cat" style="padding:10px">
                <option value="">All Categories</option>
                <option value="women_support">Women Support</option>
                <option value="child_protection">Child Protection</option>
                <option value="ngo">NGO</option>
              </select>
              <button type="button" class="btn d" onclick="amanLoadMap()">${k === 'fr' ? 'Filtrer' : k === 'en' ? 'Filter' : 'بحث'}</button>
            </div>
            <div id="aman-map-list" style="margin-top:12px"></div>
          </div>
        </section>
      `;
    };
    window.P.partners = () => {
      setTimeout(() => window.amanLoadDirectory(), 50);
      return `
        <section class="wrap" style="max-width:860px;margin:24px auto;padding:0 16px">
          <div class="card" style="margin-bottom:16px">
            <h1>${tr('partnersTitle')}</h1>
            <div style="display:flex;gap:8px;margin-top:10px">
              <input id="aman-dir-city" type="text" placeholder="Laâyoune / Rabat..." style="flex:1;padding:10px">
              <button type="button" class="btn d" onclick="amanLoadDirectory()">Search</button>
            </div>
            <div id="aman-dir-list" style="margin-top:12px"></div>
          </div>
          <div class="card">
            <h2>Partner Registration (Pending Verification)</h2>
            <form onsubmit="return amanRegisterPartner(event)">
              <input name="nameAr" placeholder="Organization Name (AR)" required style="width:100%;padding:10px;margin-bottom:8px">
              <input name="nameFr" placeholder="Organization Name (FR)" required style="width:100%;padding:10px;margin-bottom:8px">
              <select name="category" style="width:100%;padding:10px;margin-bottom:8px">
                <option value="ngo">NGO</option>
                <option value="women_support">Women Support Center</option>
                <option value="child_protection">Child Protection</option>
                <option value="legal_aid">Legal Aid</option>
                <option value="health">Health Service</option>
              </select>
              <input name="city" placeholder="City (e.g. Laâyoune)" required style="width:100%;padding:10px;margin-bottom:8px">
              <input name="phone" placeholder="Phone" style="width:100%;padding:10px;margin-bottom:8px">
              <input name="email" type="email" placeholder="Official Email" style="width:100%;padding:10px;margin-bottom:8px">
              <button class="btn d" type="submit">Register Organization</button>
              <div id="aman-partner-status" style="margin-top:8px"></div>
            </form>
          </div>
        </section>
      `;
    };
    window.P.response = () => `
      <section class="wrap" style="max-width:800px;margin:24px auto;padding:0 16px">
        <div class="card">
          <h1>${tr('responseTitle')}</h1>
          <form onsubmit="return amanStaffLogin(event)">
            <label>${tr('email')}</label><input type="email" name="email" required style="width:100%;padding:10px;margin-bottom:10px">
            <label>${tr('password')}</label><input type="password" name="password" required style="width:100%;padding:10px;margin-bottom:10px">
            <button class="btn d" type="submit">${tr('loginBtn')}</button>
          </form>
          <div id="aman-response-out" style="margin-top:16px"></div>
        </div>
      </section>
    `;
  }
  // Remove duplicate SOS buttons even if injected dynamically later
  const dedupeSos = () => {
    const sosBtns = [...document.querySelectorAll('button, a')].filter((el) => /\bSOS\b/i.test(el.textContent || ''));
    sosBtns.slice(1).forEach((el) => el.remove());
  };
  dedupeSos();
  new MutationObserver(dedupeSos).observe(document.body, { childList: true, subtree: true });

  // Privacy & anti-screenshot/print deterrents across devices
  document.body.classList.add('aman-privacy-lock');
  document.addEventListener('contextmenu', (e) => e.preventDefault());
  document.addEventListener('keydown', (e) => {
    if (e.key === 'PrintScreen' || ((e.ctrlKey || e.metaKey) && ['p', 'P', 's', 'S'].includes(e.key))) {
      e.preventDefault();
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText('').catch(() => {});
      }
    }
  });
  document.addEventListener('visibilitychange', () => {
    document.body.style.filter = document.hidden ? 'blur(14px)' : '';
  });
  document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.shiftKey && (e.key === 'X' || e.key === 'x')) {
      e.preventDefault();
      document.body.style.filter = document.body.style.filter ? '' : 'blur(18px)';
    }
  });

  window.amanOpenSosModal = function () {
    const existing = document.getElementById('aman-sos-modal');
    if (existing) existing.remove();
    const k = langKey();
    const modal = document.createElement('div');
    modal.id = 'aman-sos-modal';
    modal.style.cssText = 'position:fixed;inset:0;z-index:9999;background:rgba(26,13,36,0.85);display:flex;align-items:center;justify-content:center;padding:16px;';
    modal.innerHTML = `
      <div class="card" style="max-width:440px;width:100%;background:var(--card,#fff);border:2px solid #b91c1c">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px">
          <strong style="color:#b91c1c;font-size:1.1rem">${k === 'fr' ? 'Urgence SOS — Maroc' : k === 'en' ? 'SOS Emergency — Morocco' : 'طوارئ SOS — المغرب'}</strong>
          <button type="button" class="btn o" onclick="document.getElementById('aman-sos-modal').remove()">✕</button>
        </div>
        <p style="font-size:.9rem;margin:0 0 12px">${k === 'fr' ? 'En cas de danger immédiat, appelez directement :' : k === 'en' ? 'In immediate danger, call directly:' : 'في حالة الخطر الفوري، اتصلي مباشرة:'}</p>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:14px">
          <a class="btn d" style="background:#b91c1c;border-color:#b91c1c" href="tel:19">19 · ${k === 'fr' ? 'Police' : k === 'en' ? 'Police' : 'الشرطة'}</a>
          <a class="btn d" style="background:#b91c1c;border-color:#b91c1c" href="tel:177">177 · ${k === 'fr' ? 'Gendarmerie' : k === 'en' ? 'Gendarmerie' : 'الدرك'}</a>
          <a class="btn o" href="tel:15">15 · ${k === 'fr' ? 'SAMU' : k === 'en' ? 'Ambulance' : 'الإسعاف'}</a>
          <a class="btn o" href="tel:8350">8350 · UNFM</a>
        </div>
        <button type="button" class="btn d" style="width:100%" onclick="amanQuickSosAlert()">${k === 'fr' ? 'Envoyer une alerte confidentielle AMAN' : k === 'en' ? 'Send Confidential AMAN Alert' : 'إرسال طلب استغاثة سري عبر أمان'}</button>
        <div id="aman-sos-status" style="margin-top:10px;font-size:.9rem"></div>
      </div>
    `;
    document.body.appendChild(modal);
  };

  window.amanQuickSosAlert = async function () {
    const out = document.getElementById('aman-sos-status');
    try {
      const res = await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          beneficiaryGroup: localStorage.getItem('aman_age_group') === 'child' ? 'child' : localStorage.getItem('aman_age_group') === 'girls' ? 'girls' : 'women',
          category: 'SOS Urgent Alert',
          urgency: 'urgent',
          preferredLanguage: langKey(),
          submissionMethod: 'written',
          description: 'Urgent SOS alert triggered'
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed');
      out.innerHTML = `<strong style="color:green">Code:</strong> <code>${data.report.referenceCode}</code>`;
    } catch (err) {
      out.textContent = err.message;
    }
  };

  window.amanSelectAge = function (group) {
    localStorage.setItem('aman_age_group', group);
    const gate = document.getElementById('aman-onboarding-gate');
    if (gate) gate.remove();
    location.hash = group;
    if (typeof window.draw === 'function') window.draw();
  };

  if (typeof window.draw === 'function') {
    window.draw();
  }
})();
