const casesService = require('./cases.service');

const EDUCATIONAL_LIBRARY = [
  {
    id: 'girls_10_12_rights',
    category: 'rights',
    categoryAr: 'الحقوق والحماية',
    categoryFr: 'Droits et Protection',
    categoryEn: 'Rights & Protection',
    minAge: 10,
    maxAge: 12,
    ageGroups: ['10-12'],
    sensitivityLevel: 'low',
    publicationStatus: 'published',
    reviewStatus: 'reviewed',
    reviewer: 'Child Safeguarding Specialist',
    lastReviewDate: '2026-10-01',
    titleAr: 'ما هي حقوقي؟ وكيف أقول لا؟',
    titleFr: 'Quels sont mes droits ? Comment dire NON ?',
    titleEn: 'What Are My Rights? How to Say NO',
    bodyAr: 'لكل طفلة الحق في الأمان، التعليم، اللعب، والخصوصية. من حقكِ أن تقولي "لا" لأي تصرف يجعلكِ غير مرتاحة، وأن تطلبي المساعدة من شخص بالغ موثوق.',
    bodyFr: 'Chaque fille a droit à la sécurité, à l’éducation et au respect. Tu as le droit de dire NON si quelque chose te met mal à l’aise.',
    bodyEn: 'Every girl has the right to safety, education, and respect. You have the right to say NO if anything makes you uncomfortable.'
  },
  {
    id: 'girls_10_12_safety',
    category: 'digital_safety',
    categoryAr: 'السلامة الشخصية والرقمية',
    categoryFr: 'Sécurité personnelle et numérique',
    categoryEn: 'Personal & Digital Safety',
    minAge: 10,
    maxAge: 12,
    ageGroups: ['10-12'],
    sensitivityLevel: 'low',
    publicationStatus: 'published',
    reviewStatus: 'reviewed',
    reviewer: 'Child Safeguarding Specialist',
    lastReviewDate: '2026-10-01',
    titleAr: 'من هو الشخص البالغ الموثوق؟ والتنمر في المدرسة',
    titleFr: 'Qui est un adulte de confiance ? Faire face au harcèlement scolaire',
    titleEn: 'Who Is a Trusted Adult? Dealing with School Bullying',
    bodyAr: 'إذا شعرتِ بالخوف أو تعرضتِ للتنمر في المدرسة أو على الإنترنت، أخبري أماً أو أباً موثوقاً، أو معلمة، أو اطلبي المساعدة عبر أمان.',
    bodyFr: 'Si tu as peur ou subis du harcèlement à l’école ou en ligne, parle à un adulte de confiance ou demande de l’aide sur AMAN.',
    bodyEn: 'If you feel scared or face bullying at school or online, tell a trusted adult or ask for help on AMAN.'
  },
  {
    id: 'girls_13_15_boundaries',
    category: 'wellbeing',
    categoryAr: 'الثقة بالنفس والحدود الشخصية',
    categoryFr: 'Confiance en soi et limites personnelles',
    categoryEn: 'Self-Confidence & Personal Boundaries',
    minAge: 13,
    maxAge: 15,
    ageGroups: ['13-15'],
    sensitivityLevel: 'medium',
    publicationStatus: 'published',
    reviewStatus: 'reviewed',
    reviewer: 'Adolescent Psychologist',
    lastReviewDate: '2026-10-15',
    titleAr: 'احترام الحدود الشخصية والعلاقات الصحية',
    titleFr: 'Respect des limites personnelles et relations saines',
    titleEn: 'Respecting Personal Boundaries & Healthy Relationships',
    bodyAr: 'العلاقات الصحية تقوم على الاحترام المتبادل والأمان. لا يحق لأي شخص الضغط عليكِ أو مراقبة هاتفكِ أو إهانتكِ.',
    bodyFr: 'Les relations saines reposent sur le respect mutuel. Personne n’a le droit de te contrôler ou de te faire pression.',
    bodyEn: 'Healthy relationships are built on mutual respect. No one has the right to pressure, control, or demean you.'
  },
  {
    id: 'girls_13_15_digital',
    category: 'digital_safety',
    categoryAr: 'السلامة الرقمية والابتزاز',
    categoryFr: 'Sécurité numérique et chantage',
    categoryEn: 'Digital Safety & Blackmail',
    minAge: 13,
    maxAge: 15,
    ageGroups: ['13-15'],
    sensitivityLevel: 'medium',
    publicationStatus: 'published',
    reviewStatus: 'reviewed',
    reviewer: 'Digital Safety Specialist',
    lastReviewDate: '2026-10-15',
    titleAr: 'مواجهة الابتزاز الإلكتروني وحماية الخصوصية',
    titleFr: 'Faire face au chantage en ligne et protéger sa vie privée',
    titleEn: 'Dealing with Online Blackmail & Protecting Privacy',
    bodyAr: 'لا تشاركي صوراً خاصة أبداً. إذا تعرضتِ للابتزاز، احتفظي بلقطات الشاشة، لا تستسلمي للتهديد، وتواصلي مع مختصة فوراً.',
    bodyFr: 'Ne partage jamais de photos intimes. En cas de chantage, garde les preuves et contacte une spécialiste immédiatement.',
    bodyEn: 'Never share private photos. If blackmailed, keep screenshots, never give in, and contact a specialist right away.'
  },
  {
    id: 'girls_16_17_legal',
    category: 'rights',
    categoryAr: 'الحقوق القانونية والتمكين',
    categoryFr: 'Droits juridiques et autonomisation',
    categoryEn: 'Legal Rights & Empowerment',
    minAge: 16,
    maxAge: 17,
    ageGroups: ['16-17'],
    sensitivityLevel: 'medium',
    publicationStatus: 'published',
    reviewStatus: 'reviewed',
    reviewer: 'Legal & Safeguarding Advisor',
    lastReviewDate: '2026-11-01',
    titleAr: 'الحقوق القانونية للفتيات والوصول إلى المساعدة القانونية والاجتماعية',
    titleFr: 'Droits juridiques des adolescentes et accès à l’aide légale et sociale',
    titleEn: 'Legal Rights for Adolescent Girls & Accessing Legal/Social Aid',
    bodyAr: 'يكفل القانون المغربي (مثل القانون 103-13) الحماية من التحرش والعنف الرقمي والاستغلال. يمكنكِ الوصول إلى خلايا التكفل والجمعيات الموثقة.',
    bodyFr: 'La loi marocaine (Loi 103-13) protège contre le harcèlement, la violence numérique et l’exploitation.',
    bodyEn: 'Moroccan law (Law 103-13) protects against harassment, digital violence, and exploitation.'
  },
  {
    id: 'girls_16_17_career',
    category: 'empowerment',
    categoryAr: 'التوجيه المهني والقيادة',
    categoryFr: 'Orientation professionnelle et leadership',
    categoryEn: 'Career Orientation & Leadership',
    minAge: 16,
    maxAge: 17,
    ageGroups: ['16-17'],
    sensitivityLevel: 'low',
    publicationStatus: 'published',
    reviewStatus: 'reviewed',
    reviewer: 'Education Specialist',
    lastReviewDate: '2026-11-01',
    titleAr: 'التوجيه الدراسي والمهني والاستقلالية المالية الأساسية',
    titleFr: 'Orientation scolaire/professionnelle et autonomie financière de base',
    titleEn: 'Academic/Career Guidance & Basic Financial Independence',
    bodyAr: 'تطوير مهاراتكِ الرقمية والمهنية والمشاركة المجتمعية يفتح لكِ آفاقاً واسعة للاستقلالية وبناء مستقبلكِ بأمان.',
    bodyFr: 'Développer tes compétences numériques et professionnelles ouvre la voie à ton autonomie.',
    bodyEn: 'Building your digital and professional skills opens pathways to independence and a safe future.'
  }
];

const INTERACTIVE_QUIZZES = [
  {
    id: 'quiz_10_12',
    ageGroups: ['10-12'],
    questionAr: 'إذا طلب منكِ شخص غريب على الإنترنت إرسال صورتكِ، ماذا تفعلين؟',
    questionFr: 'Si un inconnu en ligne te demande ta photo, que fais-tu ?',
    questionEn: 'If a stranger online asks for your photo, what should you do?',
    options: [
      { id: 'a', labelAr: 'أرفض وأخبر شخصاً بالغاً موثوقاً', labelFr: 'Je refuse et j’en parle à un adulte de confiance', labelEn: 'Refuse and tell a trusted adult', correct: true },
      { id: 'b', labelAr: 'أرسلها له', labelFr: 'Je l’envoie', labelEn: 'Send it', correct: false }
    ],
    feedbackAr: 'أحسنتِ! لا نشارك صورنا مع الغرباء أبداً.',
    feedbackFr: 'Bravo ! On ne partage jamais ses photos avec des inconnus.',
    feedbackEn: 'Great job! Never share photos with strangers.'
  },
  {
    id: 'quiz_13_15',
    ageGroups: ['13-15', '16-17'],
    questionAr: 'إذا تعرضتِ للابتزاز الإلكتروني، هل يجب حذف الرسائل أم الاحتفاظ بلقطة شاشة وطلب المساعدة؟',
    questionFr: 'En cas de chantage en ligne, faut-il garder une capture d’écran et demander de l’aide ?',
    questionEn: 'If you face online blackmail, should you keep a screenshot and ask for help?',
    options: [
      { id: 'a', labelAr: 'الاحتفاظ بالدليل وطلب المساعدة من مختصة', labelFr: 'Garder la preuve et demander de l’aide', labelEn: 'Keep evidence and ask for help', correct: true },
      { id: 'b', labelAr: 'الاستسلام للتهديد', labelFr: 'Céder à la menace', labelEn: 'Give in to the threat', correct: false }
    ],
    feedbackAr: 'صحيح! احتفظي بالأدلة وتواصلي مع مختصة في أمان أو خط 8350.',
    feedbackFr: 'Exact ! Garde les preuves et contacte une spécialiste.',
    feedbackEn: 'Correct! Keep evidence and contact a specialist.'
  }
];

function getLibrary({ ageGroup = '', category = '', q = '' } = {}) {
  return EDUCATIONAL_LIBRARY.filter((item) => {
    if (item.publicationStatus !== 'published' || item.reviewStatus !== 'reviewed') return false;
    if (ageGroup && !item.ageGroups.includes(ageGroup)) return false;
    if (category && item.category !== category) return false;
    if (q) {
      const hay = `${item.titleAr} ${item.bodyAr} ${item.titleFr} ${item.titleEn}`.toLowerCase();
      if (!hay.includes(q.toLowerCase())) return false;
    }
    return true;
  });
}

function getContentById(id, ageGroup) {
  const item = EDUCATIONAL_LIBRARY.find((x) => x.id === id);
  if (!item) return { status: 404, error: 'Not found' };
  if (!ageGroup || !item.ageGroups.includes(ageGroup)) {
    return { status: 403, error: 'Content not permitted for this age group' };
  }
  return { status: 200, item };
}

function getQuizzes({ ageGroup = '' } = {}) {
  return INTERACTIVE_QUIZZES.filter((q) => !ageGroup || q.ageGroups.includes(ageGroup));
}

function requestSpecialistChat({ preferredLanguage = 'ar', topic = 'general', safeContact = '', message = '' }) {
  return casesService.submitHelpRequest({
    beneficiaryGroup: 'girls',
    category: `Specialist Chat: ${topic}`,
    urgency: 'normal',
    preferredLanguage,
    submissionMethod: 'written',
    description: message,
    safeContact
  });
}

module.exports = {
  getLibrary,
  getContentById,
  getQuizzes,
  requestSpecialistChat
};
