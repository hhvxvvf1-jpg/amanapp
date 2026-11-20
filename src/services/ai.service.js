function detectUrgency(message) {
  const text = (message || '').toLowerCase();
  const urgentKeywords = [
    'خطر', 'يضربني', 'قتل', 'انتحار', 'دم', 'سلاح', 'محتجزة', 'اغتصاب', 'طوارئ',
    'danger', 'frappe', 'tuer', 'suicide', 'urgence', 'viol', 'sang', 'enfermée',
    'emergency', 'kill', 'hurt', 'bleeding', 'trapped', 'rape', 'abuse now'
  ];
  return urgentKeywords.some((kw) => text.includes(kw));
}

function generateLocalExpertReply(message, history = [], replyLang = 'auto', uiLang = 'ar') {
  const isUrgent = detectUrgency(message);
  const lang = replyLang === 'auto' ? uiLang : replyLang;

  if (lang === 'fr') {
    if (isUrgent) {
      return `⚠️ Si vous êtes en danger immédiat, contactez tout de suite les services d'urgence au Maroc :\n• Police : 19\n• Gendarmerie Royale : 177\n• Protection Civile / SAMU : 15\n• Ligne d'écoute UNFM : 8350\n\nAMAN est une plateforme d'information et d'orientation, pas un service d'urgence. Vous pouvez aussi déposer une demande d'aide confidentielle dans l'espace Femmes, Filles ou Enfants pour qu'un professionnel qualifié vous accompagne.`;
    }
    return `Bonjour, je suis l'assistant d'orientation AMAN. Je ne suis ni médecin, ni juge, ni enquêteur, mais je peux vous aider à :\n1. Comprendre vos droits (ex. Loi 103-13 au Maroc).\n2. Trouver un centre d'écoute ou une association vérifiée dans l'annuaire AMAN.\n3. Déposer une demande d'aide confidentielle (écrite ou audio).\n\nEn cas d'urgence : 19 (Police) · 177 (Gendarmerie) · 15 (SAMU) · 8350 (UNFM).`;
  }

  if (lang === 'en') {
    if (isUrgent) {
      return `⚠️ If you are in immediate danger, please contact Moroccan emergency services right away:\n• Police: 19\n• Royal Gendarmerie: 177\n• Ambulance / Civil Protection: 15\n• UNFM Helpline: 8350\n\nAMAN is a guidance and coordination platform, not an emergency dispatch center. You can also submit a confidential help request in the Women, Girls, or Child space to connect with a trained human professional.`;
    }
    return `Hello, I am the AMAN guidance assistant. I am not a therapist, investigator, or emergency responder, but I can help you:\n1. Navigate AMAN and submit a confidential written or audio help request.\n2. Find verified support organizations in Morocco (starting with Laâyoune pilot and national services).\n3. Learn about general protection resources.\n\nEmergency numbers in Morocco: 19 (Police) · 177 (Gendarmerie) · 15 (SAMU) · 8350 (UNFM).`;
  }

  // Default: Arabic / Darija
  if (isUrgent) {
    return `⚠️ إذا كنتِ أو كان طفل في خطر فوري، المرجو الاتصال فوراً بأرقام الطوارئ المعتمدة في المغرب:\n• الشرطة: 19\n• الدرك الملكي: 177\n• الإسعاف / الوقاية المدنية: 15\n• خط الاستماع الوطني (UNFM): 8350\n\nمنصة أمان ليست خدمة شرطة أو إسعاف فوري، لكن يمكنكِ إرسال طلب مساعدة سري (مكتوب أو صوتي) ليتم توجيهه إلى مختص بشري مؤهل.`;
  }

  return `مرحباً بكِ في منصة أمان. أنا مساعد توجيهي ولست طبيباً ولا قاضياً ولا محققاً، ولا أتخذ قرارات الحماية النهائية. يمكنني مساعدتكِ في:\n1. التعرف على مساطر الحماية (مثل القانون 103-13).\n2. إرسال طلب مساعدة سري (كتابي أو صوتي) في فضاء النساء أو الفتيات أو الأطفال.\n3. البحث عن مراكز الاستماع والجمعيات الموثقة.\n\nأرقام الطوارئ في المغرب: 19 (الشرطة) · 177 (الدرك) · 15 (الإسعاف) · 8350 (خط المساندة).`;
}

async function processChat({ message, history = [], replyLang = 'auto', uiLang = 'ar' }) {
  return generateLocalExpertReply(message, history, replyLang, uiLang);
}

module.exports = {
  processChat,
  generateLocalExpertReply,
  detectUrgency
};
