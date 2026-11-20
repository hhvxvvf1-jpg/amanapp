const casesService = require('./cases.service');

const EDUCATIONAL_LIBRARY = [
  {
    id: 'girls_rights_1',
    category: 'rights',
    categoryAr: 'الحقوق والحماية',
    categoryFr: 'Droits et Protection',
    categoryEn: 'Rights & Protection',
    ageGroups: ['10-12', '13-15', '16-17'],
    titleAr: 'حقوق الفتيات في الحماية والتعليم والخصوصية',
    titleFr: 'Droits des filles à la protection, à l’éducation et à la vie privée',
    titleEn: 'Girls’ Rights to Protection, Education, and Privacy',
    bodyAr: 'لكل فتاة الحق في التعليم، والصحة، والخصوصية، والحماية من كل أشكال العنف، والحق في التعبير وطلب المساعدة من شخص بالغ موثوق أو جهة مختصة.',
    bodyFr: 'Chaque fille a droit à l’éducation, à la santé, à la vie privée, à la protection contre toute violence et au droit de demander de l’aide.',
    bodyEn: 'Every girl has the right to education, health, privacy, protection from all forms of violence, and the right to ask for help.',
    reviewStatus: 'reviewed'
  },
  {
    id: 'girls_violence_1',
    category: 'understanding_violence',
    categoryAr: 'فهم العنف',
    categoryFr: 'Comprendre la violence',
    categoryEn: 'Understanding Violence',
    ageGroups: ['10-12', '13-15', '16-17'],
    titleAr: 'التعرف على أشكال العنف: الجسدي، النفسي، اللفظي، والرقمي',
    titleFr: 'Reconnaître les formes de violence : physique, psychologique, verbale et numérique',
    titleEn: 'Recognizing Forms of Violence: Physical, Psychological, Verbal & Digital',
    bodyAr: 'العنف ليس فقط الضرب؛ بل يشمل الإهانة، التهديد، التنمر المدرسي، التحرش، الابتزاز، الاستغلال، والزواج القسري. لستِ مخطئة أبداً إذا تعرضتِ لأي من هذا.',
    bodyFr: 'La violence ne se limite pas aux coups : elle inclut les insultes, menaces, harcèlement scolaire, chantage et mariage forcé.',
    bodyEn: 'Violence is not only physical: it includes insults, threats, school bullying, harassment, blackmail, exploitation, and forced marriage.',
    reviewStatus: 'reviewed'
  },
  {
    id: 'girls_digital_1',
    category: 'digital_safety',
    categoryAr: 'السلامة الرقمية',
    categoryFr: 'Sécurité numérique',
    categoryEn: 'Digital Safety',
    ageGroups: ['10-12', '13-15', '16-17'],
    titleAr: 'حماية الحسابات ومواجهة الابتزاز والتنمر الإلكتروني',
    titleFr: 'Protéger ses comptes et faire face au chantage en ligne',
    titleEn: 'Account Protection & Dealing with Online Blackmail',
    bodyAr: 'استخدمي كلمات مرور قوية، لا تشاركي صورك الخاصة مع غرباء، واحفظي لقطات الشاشة عند التعرض للابتزاز أو التنمر الإلكتروني وأبلغي فوراً.',
    bodyFr: 'Utilisez des mots de passe forts, ne partagez jamais de photos intimes et conservez les preuves en cas de chantage.',
    bodyEn: 'Use strong passwords, never share private photos with strangers, save screenshots of threats, and report immediately.',
    reviewStatus: 'reviewed'
  },
  {
    id: 'girls_wellbeing_1',
    category: 'wellbeing',
    categoryAr: 'الصحة والرفاه',
    categoryFr: 'Santé et Bien-être',
    categoryEn: 'Health & Wellbeing',
    ageGroups: ['10-12', '13-15', '16-17'],
    titleAr: 'الحدود الشخصية والثقة بالنفس والعلاقات الصحية',
    titleFr: 'Limites personnelles, confiance en soi et relations saines',
    titleEn: 'Personal Boundaries, Self-Confidence & Healthy Relationships',
    bodyAr: 'من حقك قول "لا" لأي لمس أو طلب يجعلك غير مرتاحة. العلاقات الصحية تقوم على الاحترام والأمان وليس الخوف أو السيطرة.',
    bodyFr: 'Tu as le droit de dire NON à tout contact ou demande qui te met mal à l’aise. Une relation saine repose sur le respect.',
    bodyEn: 'You have the right to say NO to any touch or request that makes you uncomfortable. Healthy relationships are built on respect.',
    reviewStatus: 'reviewed'
  },
  {
    id: 'girls_empowerment_1',
    category: 'empowerment',
    categoryAr: 'التعليم والتمكين',
    categoryFr: 'Éducation et Autonomisation',
    categoryEn: 'Education & Empowerment',
    ageGroups: ['13-15', '16-17'],
    titleAr: 'التوجيه الدراسي وتطوير المهارات والقيادة',
    titleFr: 'Orientation scolaire, compétences et leadership',
    titleEn: 'Academic Guidance, Skill Building & Leadership',
    bodyAr: 'التعليم وتطوير مهاراتك الرقمية والشخصية يمنحك القوة والاستقلالية لبناء مستقبلك بثقة.',
    bodyFr: 'L’éducation et le développement de tes compétences te donnent les moyens de construire ton avenir avec confiance.',
    bodyEn: 'Education and building your skills give you the strength and independence to shape your future.',
    reviewStatus: 'reviewed'
  }
];

const INTERACTIVE_QUIZZES = [
  {
    id: 'quiz_1',
    type: 'true_false',
    questionAr: 'إذا تعرضتِ للابتزاز الإلكتروني، هل يجب حذف الرسائل فوراً أم الاحتفاظ بدليل (لقطة شاشة) وطلب المساعدة؟',
    questionFr: 'En cas de chantage en ligne, faut-il garder une preuve (capture d’écran) et demander de l’aide ?',
    questionEn: 'If you face online blackmail, should you keep a screenshot as evidence and ask for help?',
    options: [
      { id: 'a', labelAr: 'الاحتفاظ بالدليل وطلب المساعدة من مختصة أو شخص موثوق', labelFr: 'Garder la preuve et demander de l’aide', labelEn: 'Keep evidence and ask for help', correct: true },
      { id: 'b', labelAr: 'الاستسلام لطلبات المبتز', labelFr: 'Céder au chantage', labelEn: 'Give in to the blackmailer', correct: false }
    ],
    feedbackAr: 'صحيح! لا تستسلمي للابتزاز أبداً، احتفظي بالأدلة وتواصلي مع مختصة في أمان أو خط 8350.',
    feedbackFr: 'Exact ! Ne cédez jamais au chantage, gardez les preuves et contactez un professionnel.',
    feedbackEn: 'Correct! Never give in to blackmail. Keep evidence and reach out to a trusted professional.'
  },
  {
    id: 'quiz_2',
    type: 'true_false',
    questionAr: 'هل يحق لأي شخص إجبارك على مشاركة كلمة مرور هاتفك أو حساباتك؟',
    questionFr: 'Quelqu’un a-t-il le droit de t’obliger à partager tes mots de passe ?',
    questionEn: 'Does anyone have the right to force you to share your passwords?',
    options: [
      { id: 'a', labelAr: 'لا، الخصوصية حق شخصي', labelFr: 'Non, la vie privée est un droit', labelEn: 'No, privacy is a personal right', correct: true },
      { id: 'b', labelAr: 'نعم، دائماً', labelFr: 'Oui, toujours', labelEn: 'Yes, always', correct: false }
    ],
    feedbackAr: 'صحيح! خصوصيتك وأمانك الرقمي حق لك.',
    feedbackFr: 'Exact ! Ta vie privée et ta sécurité numérique sont tes droits.',
    feedbackEn: 'Correct! Your privacy and digital safety are your rights.'
  }
];

function getLibrary({ ageGroup = '', category = '' } = {}) {
  return EDUCATIONAL_LIBRARY.filter((item) => {
    if (ageGroup && !item.ageGroups.includes(ageGroup)) return false;
    if (category && item.category !== category) return false;
    return true;
  });
}

function getQuizzes() {
  return INTERACTIVE_QUIZZES;
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
  getQuizzes,
  requestSpecialistChat
};
