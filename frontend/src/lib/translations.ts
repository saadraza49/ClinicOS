// Utility helper for translating dynamic DB data (Service titles & descriptions) seamlessly

interface TranslationEntry {
  title: Record<string, string>;
  description: Record<string, string>;
}

const SERVICE_TRANSLATIONS: Record<string, TranslationEntry> = {
  "Acne & Skin Consultation": {
    title: { en: "Acne & Skin Consultation", fr: "Consultation Acné & Peau", zh: "痤疮与皮肤专科门诊" },
    description: { en: "Professional Acne & Skin Consultation service.", fr: "Service professionnel de consultation pour l'acné et la peau.", zh: "专业的痤疮及皮肤问题诊疗服务。" }
  },
  "Cardiovascular Health Assessment": {
    title: { en: "Cardiovascular Health Assessment", fr: "Évaluation Santé Cardiovasculaire", zh: "心血管健康评估" },
    description: { en: "Professional Cardiovascular Health Assessment service.", fr: "Évaluation complète de la santé cardiovasculaire.", zh: "专业全面的心血管健康检查评估。" }
  },
  "Child Vaccination & Immunization": {
    title: { en: "Child Vaccination & Immunization", fr: "Vaccination & Immunisation Infantile", zh: "儿童疫苗接种与免疫" },
    description: { en: "Professional Child Vaccination & Immunization service.", fr: "Services complets de vaccination pour enfants.", zh: "专业的儿童基础疫苗及免疫计划服务。" }
  },
  "Comprehensive Vision & Eye Exam": {
    title: { en: "Comprehensive Vision & Eye Exam", fr: "Examen de la Vue & Soins Oculaires", zh: "全方位眼科与视力检查" },
    description: { en: "Professional Comprehensive Vision & Eye Exam service.", fr: "Examen complet de la vue et dépistage ophtalmique.", zh: "专业的视力检测与综合眼科健康检查。" }
  },
  "Dental Cleaning & Polishing": {
    title: { en: "Dental Cleaning & Polishing", fr: "Nettoyage & Polissage Dentaire", zh: "洁牙与牙齿抛光服务" },
    description: { en: "Professional Dental Cleaning & Polishing service.", fr: "Détartrage et nettoyage dentaire professionnel.", zh: "专业的牙齿清洁、去石与美白抛光。" }
  },
  "ECG & Heart Function Exam": {
    title: { en: "ECG & Heart Function Exam", fr: "ECG & Examen Cardiaque", zh: "心电图与心功能检查" },
    description: { en: "Professional ECG & Heart Function Exam service.", fr: "Examen électrocardiogramme et suivi de la fonction cardiaque.", zh: "心电图监测与心功能综合评估服务。" }
  },
  "General Pediatric Checkup": {
    title: { en: "General Pediatric Checkup", fr: "Bilan Pédiatrique Général", zh: "儿童常规体检" },
    description: { en: "Professional General Pediatric Checkup service.", fr: "Service professionnel de bilan pédiatrique général.", zh: "专业的儿童常规体检服务。" }
  },
  "Neurological Headaches & Sleep Exam": {
    title: { en: "Neurological Headaches & Sleep Exam", fr: "Examen Neurologique Maux de tête et Sommeil", zh: "神经性头痛与睡眠检查" },
    description: { en: "Professional Neurological Headaches & Sleep Exam service.", fr: "Service professionnel d'examen neurologique pour maux de tête et troubles du sommeil.", zh: "专业的神经性头痛与睡眠检查服务。" }
  },
  "Orthopedic Joint & Bone Exam": {
    title: { en: "Orthopedic Joint & Bone Exam", fr: "Examen Orthopédique des Articulations et Os", zh: "骨科关节与骨骼检查" },
    description: { en: "Professional Orthopedic Joint & Bone Exam service.", fr: "Service professionnel d'examen orthopédique.", zh: "专业的骨科关节与骨骼检查服务。" }
  },
  "Primary Care Annual Wellness Exam": {
    title: { en: "Primary Care Annual Wellness Exam", fr: "Examen de Santé Annuel de Soins Primaires", zh: "全科年度健康体检" },
    description: { en: "Professional Primary Care Annual Wellness Exam service.", fr: "Service professionnel d'examen de santé annuel.", zh: "专业的全科年度健康体检服务。" }
  }
};

const SPECIALTY_TRANSLATIONS: Record<string, Record<string, string>> = {
  "Pediatrics": { en: "Pediatrics", fr: "Pédiatrie", zh: "儿科" },
  "Cardiology": { en: "Cardiology", fr: "Cardiologie", zh: "心血管科" },
  "Dermatology": { en: "Dermatology", fr: "Dermatologie", zh: "皮肤科" },
  "Primary Care": { en: "Primary Care", fr: "Soins Primaires", zh: "全科医疗" },
  "Dentistry": { en: "Dentistry", fr: "Dentisterie", zh: "牙科" },
  "Neurology": { en: "Neurology", fr: "Neurologie", zh: "神经内科" },
  "Ophthalmology": { en: "Ophthalmology", fr: "Ophtalmologie", zh: "眼科" },
  "Orthopedics": { en: "Orthopedics", fr: "Orthopédie", zh: "骨科" },
  "ENT (Ear, Nose & Throat)": { en: "ENT (Ear, Nose & Throat)", fr: "ORL (Oto-rhino-laryngologie)", zh: "耳鼻喉科" },
  "Psychiatry": { en: "Psychiatry", fr: "Psychiatrie", zh: "精神科" },
  "All Services": { en: "All Services", fr: "Tous les Services", zh: "所有服务" }
};

export function getLocalizedSpecialty(specialty: string, locale: string): string {
  const normLocale = (locale || "en").toLowerCase();
  const found = SPECIALTY_TRANSLATIONS[specialty];
  if (found && found[normLocale]) {
    return found[normLocale];
  }
  return specialty;
}

export function getLocalizedServiceTitle(title: string, locale: string): string {
  const normLocale = (locale || "en").toLowerCase();
  const found = SERVICE_TRANSLATIONS[title];
  if (found && found.title[normLocale]) {
    return found.title[normLocale];
  }
  return title;
}

export function getLocalizedServiceDescription(description: string, title: string, locale: string): string {
  const normLocale = (locale || "en").toLowerCase();
  const found = SERVICE_TRANSLATIONS[title];
  if (found && found.description[normLocale]) {
    return found.description[normLocale];
  }
  return description;
}

const QUALIFICATION_TRANSLATIONS: Record<string, Record<string, string>> = {
  "MD, Family Medicine": { en: "MD, Family Medicine", fr: "MD, Médecine Familiale", zh: "医学博士，家庭医学" },
  "MD, FACC": { en: "MD, FACC", fr: "MD, FACC", zh: "医学博士，美国心脏病学会院士" },
  "MD, FAAD": { en: "MD, FAAD", fr: "MD, FAAD", zh: "医学博士，美国皮肤科学会院士" },
  "MD, Pediatric Specialist": { en: "MD, Pediatric Specialist", fr: "MD, Spécialiste Pédiatrique", zh: "医学博士，儿科专家" },
  "MD, Skincare Specialist": { en: "MD, Skincare Specialist", fr: "MD, Spécialiste Soins de la Peau", zh: "医学博士，皮肤护理专家" },
  "MD, PhD": { en: "MD, PhD", fr: "MD, PhD", zh: "医学博士、哲学博士" },
  "DDS, Implantology": { en: "DDS, Implantology", fr: "DDS, Implantologie", zh: "牙医学博士，种植牙学" },
  "Medical Specialist": { en: "Medical Specialist", fr: "Spécialiste Médical", zh: "医学专家" }
};

export function getLocalizedQualification(qual: string, locale: string): string {
  if (!qual) return "";
  const normLocale = (locale || "en").toLowerCase();
  const found = QUALIFICATION_TRANSLATIONS[qual];
  if (found && found[normLocale]) return found[normLocale];
  return qual;
}

const LANGUAGE_TRANSLATIONS: Record<string, Record<string, string>> = {
  "English": { en: "English", fr: "Anglais", zh: "英语" },
  "Spanish": { en: "Spanish", fr: "Espagnol", zh: "西班牙语" },
  "French": { en: "French", fr: "Français", zh: "法语" },
  "Chinese": { en: "Chinese", fr: "Chinois", zh: "中文" },
  "Urdu": { en: "Urdu", fr: "Ourdou", zh: "乌尔都语" },
  "Arabic": { en: "Arabic", fr: "Arabe", zh: "阿拉伯语" }
};

export function getLocalizedLanguage(lang: string, locale: string): string {
  if (!lang) return "";
  const normLocale = (locale || "en").toLowerCase();
  const found = LANGUAGE_TRANSLATIONS[lang];
  if (found && found[normLocale]) return found[normLocale];
  return lang;
}

const DAY_TRANSLATIONS: Record<string, Record<string, string>> = {
  "Monday": { en: "Monday", fr: "Lundi", zh: "周一" },
  "Tuesday": { en: "Tuesday", fr: "Mardi", zh: "周二" },
  "Wednesday": { en: "Wednesday", fr: "Mercredi", zh: "周三" },
  "Thursday": { en: "Thursday", fr: "Jeudi", zh: "周四" },
  "Friday": { en: "Friday", fr: "Vendredi", zh: "周五" },
  "Saturday": { en: "Saturday", fr: "Samedi", zh: "周六" },
  "Sunday": { en: "Sunday", fr: "Dimanche", zh: "周日" },
  "Mon": { en: "Mon", fr: "Lun", zh: "周一" },
  "Tue": { en: "Tue", fr: "Mar", zh: "周二" },
  "Wed": { en: "Wed", fr: "Mer", zh: "周三" },
  "Thu": { en: "Thu", fr: "Jeu", zh: "周四" },
  "Fri": { en: "Fri", fr: "Ven", zh: "周五" },
  "Sat": { en: "Sat", fr: "Sam", zh: "周六" },
  "Sun": { en: "Sun", fr: "Dim", zh: "周日" }
};

export function getLocalizedDay(day: string, locale: string): string {
  if (!day) return "";
  const normLocale = (locale || "en").toLowerCase();
  const found = DAY_TRANSLATIONS[day];
  if (found && found[normLocale]) return found[normLocale];
  return day;
}

const DOCTOR_BIO_MAP: Record<string, Record<string, string>> = {
  "Dr. Fatima Ali": {
    en: "Dr. Fatima Ali is a board-certified Primary Care specialist with 11 years of experience.",
    fr: "Dr. Fatima Ali est une spécialiste certifiée en soins primaires avec 11 ans d'expérience.",
    zh: "Fatima Ali 医生是一位资深的全科医师，拥有 11 年的丰富临床诊疗经验。"
  },
  "Dr. Elena Rodriguez": {
    en: "Dedicated pediatric specialist with over 8 years of clinical experience.",
    fr: "Spécialiste en pédiatrie dévouée avec plus de 8 ans d'expérience clinique.",
    zh: "致力于儿童健康关怀的儿科专科医生，拥有 8 年以上的临床经验。"
  },
  "Dr. Robert Miller": {
    en: "Experienced in newborn health, immunization, and common child development guidance.",
    fr: "Expérimenté en santé des nouveau-nés, vaccination et conseils en développement de l'enfant.",
    zh: "在新生儿健康、计划免疫及儿童发育评估与指导方面经验丰富。"
  },
  "Dr. Marcus Vance": {
    en: "Consultant cardiologist focusing on preventive heart healthcare and hypertension.",
    fr: "Cardiologue consultant axé sur la santé cardiaque préventive et l'hypertension.",
    zh: "资深心血管科专家，专注于心脏病预防、高血压管理及心血管健康维护。"
  },
  "Dr. Sarah Jenkins": {
    en: "Expert in clinical cardiology, cardiovascular diagnostics, and heart rhythm management.",
    fr: "Experte en cardiologie clinique, diagnostic cardiovasculaire et gestion du rythme cardiaque.",
    zh: "临床心血管精细化诊疗、心功能检测与心律失常管理专家。"
  },
  "Dr. Omar Al-Fayed": {
    en: "Specializes in skin conditions, cosmetic treatments, and allergy management.",
    fr: "Spécialisé dans les affections cutanées, les traitements cosmétiques et la gestion des allergies.",
    zh: "精通各种皮肤病诊治、医学美容护理及过敏性疾病综合管理。"
  },
  "Dr. Sophia Carter": {
    en: "Passionate dermatologist specializing in medical skin treatments and skincare routines.",
    fr: "Dermatologue passionnée spécialisée dans les traitements médicaux de la peau et les routines de soins.",
    zh: "资深皮肤科医生，专长于皮肤问题调理与个性化肤质管理方案。"
  },
  "Dr. James Wilson": {
    en: "General physician caring for broad chronic diseases and preventative family health.",
    fr: "Médecin généraliste s'occupant de maladies chroniques globales et de santé familiale préventive.",
    zh: "全科医师，专注于常见慢性病管理、家庭全员预防保健与全周期诊疗。"
  },
  "Dr. Bilal Ahmed": {
    en: "Implantologist and general dentist focusing on pain-free treatments and smile design.",
    fr: "Implantologue et dentiste généraliste axé sur les traitements sans douleur et la conception du sourire.",
    zh: "口腔种植专家与全科牙医，倡导无痛舒适化诊疗与个性化美学美牙。"
  },
  "Dr. Priya Patel": {
    en: "Neurologist focusing on stroke care, migraine control, and peripheral neuropathy.",
    fr: "Neurologue axée sur les soins des AVC, le contrôle des migraines et la neuropathie périphérique.",
    zh: "神经内科专科医师，精通卒中防治、偏头痛控制及周围神经病变诊治。"
  }
};

export function getLocalizedDoctorBio(name: string, bio: string, locale: string): string {
  const normLocale = (locale || "en").toLowerCase();
  if (DOCTOR_BIO_MAP[name] && DOCTOR_BIO_MAP[name][normLocale]) {
    return DOCTOR_BIO_MAP[name][normLocale];
  }
  return bio;
}

const FAQ_CATEGORY_TRANSLATIONS: Record<string, Record<string, string>> = {
  "Hours & Location": { en: "Hours & Location", fr: "Horaires & Emplacement", zh: "营业时间与位置" },
  "Appointments": { en: "Appointments", fr: "Rendez-vous", zh: "预约挂号" },
  "Billing & Insurance": { en: "Billing & Insurance", fr: "Facturation & Assurance", zh: "账单与保险" },
  "Emergency Care": { en: "Emergency Care", fr: "Soins d'Urgence", zh: "紧急医疗护理" },
  "General": { en: "General", fr: "Général", zh: "常规" },
  "Prescription Refills": { en: "Prescription Refills", fr: "Renouvellement d'Ordonnances", zh: "处方续签与开药" },
  "Pediatrics": { en: "Pediatrics", fr: "Pédiatrie", zh: "儿科诊疗" },
  "COVID-19 & Vaccines": { en: "COVID-19 & Vaccines", fr: "COVID-19 & Vaccins", zh: "新冠与疫苗接种" },
  "Parking & Accessibility": { en: "Parking & Accessibility", fr: "Parking & Accessibilité", zh: "停车与无障碍设施" }
};

export function getLocalizedFAQCategory(category: string, locale: string): string {
  if (!category) return "";
  const normLocale = (locale || "en").toLowerCase();
  const found = FAQ_CATEGORY_TRANSLATIONS[category];
  if (found && found[normLocale]) return found[normLocale];
  return category;
}

const FAQ_ITEMS_TRANSLATIONS: Record<string, { question: Record<string, string>; answer: Record<string, string> }> = {
  "What are your opening hours?": {
    question: { en: "What are your opening hours?", fr: "Quels sont vos horaires d'ouverture ?", zh: "诊所的营业时间是什么？" },
    answer: { en: "We are open Monday through Saturday from 9:00 AM to 9:00 PM. We are closed on Sundays.", fr: "Nous sommes ouverts du lundi au samedi de 9h00 à 21h00. Nous sommes fermés le dimanche.", zh: "我们的营业时间为周一至周六上午 9:00 至晚上 9:00，周日休息。" }
  },
  "How can I book an appointment?": {
    question: { en: "How can I book an appointment?", fr: "Comment puis-je prendre un rendez-vous ?", zh: "如何预约挂号就诊？" },
    answer: { en: "You can book an appointment online via our booking page, call us directly, or use our AI assistant.", fr: "Vous pouvez réserver en ligne via notre page de réservation, nous appeler directement ou utiliser notre assistant IA.", zh: "您可以直接通过官网在线预约挂号、拨打诊所电话预约，或通过 AI 智能助手进行快捷预约。" }
  },
  "Which insurance providers do you accept?": {
    question: { en: "Which insurance providers do you accept?", fr: "Quelles assurances acceptez-vous ?", zh: "诊所支持哪些医保和保险支付？" },
    answer: { en: "We accept most major healthcare insurance providers including BlueCross, Aetna, Cigna, and Medicare.", fr: "Nous acceptons la plupart des principales assurances de santé, notamment BlueCross, Aetna, Cigna et Medicare.", zh: "我们支持大部分主流医疗保险与报销通道，包括蓝十字、Aetna、Cigna 及 Medicare 等。" }
  },
  "What should I do in an emergency?": {
    question: { en: "What should I do in an emergency?", fr: "Que dois-je faire en cas d'urgence ?", zh: "遇到突发紧急情况应该怎么办？" },
    answer: { en: "In life-threatening situations, please dial emergency services immediately or visit the nearest ER hospital.", fr: "En cas d'urgence vitale, veuillez composer immédiatement les services d'urgence ou vous rendre aux urgences les plus proches.", zh: "如遇生命危险或重大急诊，请立即拨打当地急救电话或前往最近的医院急诊科。" }
  },
  "How do I request my medical records?": {
    question: { en: "How do I request my medical records?", fr: "Comment demander mes dossiers médicaux ?", zh: "如何申请获取我的个人病历与就诊记录？" },
    answer: { en: "You can request your medical records securely through the patient portal or by contacting our administration desk.", fr: "Vous pouvez demander vos dossiers médicaux en toute sécurité via le portail patient ou en contactant notre accueil.", zh: "您可以登录患者个人中心在线申请，或直接前往诊所行政前台联系工作人员办理。" }
  },
  "How do I request a prescription refill?": {
    question: { en: "How do I request a prescription refill?", fr: "Comment demander un renouvellement d'ordonnance ?", zh: "如何在线申请续开处方药物？" },
    answer: { en: "Contact your primary doctor via the portal or call our clinic hotline 24 hours in advance.", fr: "Contactez votre médecin traitant via le portail ou appelez notre ligne d'assistance 24h à l'avance.", zh: "您可以通过患者端联系您的主诊医生，或提前 24 小时拨打诊所客服热线申请续药。" }
  },
  "At what age should my child see a pediatrician?": {
    question: { en: "At what age should my child see a pediatrician?", fr: "À quel âge mon enfant doit-il consulter un pédiatre ?", zh: "孩子从几岁开始需要看儿科医生？" },
    answer: { en: "We recommend initial newborn wellness checkups within the first 3-5 days after birth.", fr: "Nous recommandons des bilans de santé initiaux pour nouveau-nés dans les 3 à 5 premiers jours suivant la naissance.", zh: "我们建议在宝宝出生后的前 3 到 5 天内安排第一次新生儿健康检查与发育评估。" }
  },
  "Are walk-in vaccinations available?": {
    question: { en: "Are walk-in vaccinations available?", fr: "Les vaccinations sans rendez-vous sont-elles disponibles ?", zh: "诊所是否提供无需预约的接种服务？" },
    answer: { en: "Yes, walk-in flu shots and routine immunizations are available Monday to Saturday during regular hours.", fr: "Oui, les vaccins contre la grippe et les immunisations de routine sans rendez-vous sont disponibles du lundi au samedi.", zh: "是的，周一至周六营业时间内均提供流感疫苗及常规疫苗的随到随接服务。" }
  },
  "Is free parking available at the clinic?": {
    question: { en: "Is free parking available at the clinic?", fr: "Un parking gratuit est-il disponible à la clinique ?", zh: "诊所是否为前来就诊的患者提供免费停车位？" },
    answer: { en: "Yes, we provide complimentary patient parking directly in front of the main entrance.", fr: "Oui, nous offrons un parking patient gratuit directement devant l'entrée principale.", zh: "是的，我们在诊所大楼正门前方为所有患者提供免费专用停车位。" }
  }
};

export function getLocalizedFAQQuestion(question: string, locale: string): string {
  const normLocale = (locale || "en").toLowerCase();
  const found = FAQ_ITEMS_TRANSLATIONS[question];
  if (found && found.question[normLocale]) return found.question[normLocale];
  return question;
}

export function getLocalizedFAQAnswer(answer: string, question: string, locale: string): string {
  const normLocale = (locale || "en").toLowerCase();
  const found = FAQ_ITEMS_TRANSLATIONS[question];
  if (found && found.answer[normLocale]) return found.answer[normLocale];
  return answer;
}

const BLOG_CATEGORY_TRANSLATIONS: Record<string, Record<string, string>> = {
  "All Topics": { en: "All Topics", fr: "Tous les Sujets", zh: "所有主题" },
  "General Health": { en: "General Health", fr: "Santé Générale", zh: "综合健康" },
  "Nutrition": { en: "Nutrition", fr: "Nutrition", zh: "营养饮食" },
  "Mental Health": { en: "Mental Health", fr: "Santé Mentale", zh: "心理健康" },
  "Vaccinations": { en: "Vaccinations", fr: "Vaccinations", zh: "疫苗接种" },
  "Clinic News": { en: "Clinic News", fr: "Actualités de la Clinique", zh: "诊所动态" },
  "Wellness": { en: "Wellness", fr: "Bien-être", zh: "健康养生" }
};

export function getLocalizedBlogCategory(category: string, locale: string): string {
  if (!category) return "";
  const normLocale = (locale || "en").toLowerCase();
  const found = BLOG_CATEGORY_TRANSLATIONS[category];
  if (found && found[normLocale]) return found[normLocale];
  return category;
}

const BLOG_POST_TRANSLATIONS: Record<string, { title: Record<string, string>; excerpt: Record<string, string> }> = {
  "LuminaHealth Unveils Wellness Suite": {
    title: { en: "LuminaHealth Unveils Wellness Suite", fr: "LuminaHealth Dévoile le Centre de Bien-Être", zh: "LuminaHealth 隆重推出全新综合健康诊疗中心" },
    excerpt: { en: "LuminaHealth has officially opened its new wellness diagnostic annex, bringing state-of-the-art ultrasound and imaging suites closer to our local community.", fr: "LuminaHealth a officiellement ouvert sa nouvelle annexe de diagnostic de bien-être, offrant des salles d'échographie et d'imagerie de pointe.", zh: "LuminaHealth 官方全新健康诊断翼楼现已正式启用，将先进的超声波与影像诊疗设备带到广大社区患者身边。" }
  },
  "The Importance of Annual Check-ups": {
    title: { en: "The Importance of Annual Check-ups", fr: "L'Importance des Bilans de Santé Annuels", zh: "年度全面体检的重要性" },
    excerpt: { en: "Regular health screenings are vital for early detection of potential issues. Learn why scheduling your yearly physical is the most crucial step you can take for long-term wellness.", fr: "Les dépistages réguliers sont essentiels pour la détection précoce des problèmes potentiels. Découvrez pourquoi le bilan annuel est l'étape la plus importante pour votre bien-être à long terme.", zh: "定期体检是早期发现疾病隐患的关键。了解为什么每年安排一次全面体检是保障长期健康的重中之重。" }
  },
  "Eating for Immunity This Winter": {
    title: { en: "Eating for Immunity This Winter", fr: "Manger pour l'Immunité cet Hiver", zh: "冬季增强免疫力的科学饮食指南" },
    excerpt: { en: "Discover the top 10 foods that naturally boost your immune system and help ward off seasonal colds and flu as the temperature drops.", fr: "Découvrez les 10 meilleurs aliments qui renforcent naturellement votre système immunitaire et vous aident à prévenir les rhumes et grippes saisonniers.", zh: "探索 10 种能天然提高免疫力的食物，助您在气温骤降的寒冬远离感冒与流感侵袭。" }
  },
  "Managing Workplace Stress": {
    title: { en: "Managing Workplace Stress", fr: "Gérer le Stress au Travail", zh: "职场压力管理与心理调节技巧" },
    excerpt: { en: "Practical techniques for maintaining boundaries, practicing mindfulness, and recognizing the signs of burnout before they affect your physical health.", fr: "Des techniques pratiques pour maintenir des limites, pratiquer la pleine conscience et reconnaître les signes d'épuisement professionnel.", zh: "助您设立工作边界、练习正念减压并在职业倦怠影响身体健康之前及时调整。" }
  },
  "Flu Season 2024 Guidelines": {
    title: { en: "Flu Season 2024 Guidelines", fr: "Directives pour la Saison de la Grippe 2024", zh: "2024 流感季权威预防指南" },
    excerpt: { en: "Everything you need to know about this year's flu vaccine, who should get it, and when is the best time to schedule your family's appointments.", fr: "Tout ce que vous devez savoir sur le vaccin contre la grippe de cette année, qui doit le recevoir et quel est le meilleur moment pour planifier vos rendez-vous.", zh: "全方位解答关于今年流感疫苗接种的所有常见疑问、适用人群以及家庭接种的最佳时间。" }
  }
};

export function getLocalizedBlogTitle(title: string, locale: string): string {
  const normLocale = (locale || "en").toLowerCase();
  const found = BLOG_POST_TRANSLATIONS[title];
  if (found && found.title[normLocale]) return found.title[normLocale];
  return title;
}

export function getLocalizedBlogExcerpt(excerpt: string, title: string, locale: string): string {
  const normLocale = (locale || "en").toLowerCase();
  const found = BLOG_POST_TRANSLATIONS[title];
  if (found && found.excerpt[normLocale]) return found.excerpt[normLocale];
  return excerpt;
}

const AUTHOR_ROLE_MAP: Record<string, Record<string, string>> = {
  "Consultant Physician": { en: "Consultant Physician", fr: "Médecin Consultant", zh: "资深全科门诊专家" },
  "Chief Nutritional Lead": { en: "Chief Nutritional Lead", fr: "Nutritionniste en Chef", zh: "首席临床营养专家" },
  "Lead Clinical Psychologist": { en: "Lead Clinical Psychologist", fr: "Psychologue Clinique Principal", zh: "资深临床心理学专家" },
  "Lumina Care Coordination": { en: "Lumina Care Coordination", fr: "Coordination des Soins Lumina", zh: "Lumina 护理协调团队" },
  "Clinic Operations": { en: "Clinic Operations", fr: "Opérations Cliniques", zh: "诊所运营团队" },
  "Chief of General Medicine": { en: "Chief of General Medicine", fr: "Chef de la Médecine Générale", zh: "全科医学科主任" },
};

export function getLocalizedAuthorRole(role: string, locale: string): string {
  const normLocale = (locale || "en").toLowerCase();
  const found = AUTHOR_ROLE_MAP[role];
  if (found && found[normLocale]) return found[normLocale];
  return role;
}

const DEPARTMENT_TRANSLATIONS: Record<string, Record<string, string>> = {
  "Dermatology": { en: "Dermatology", fr: "Dermatologie", zh: "皮肤科" },
  "Cardiology": { en: "Cardiology", fr: "Cardiologie", zh: "心血管内科" },
  "Pediatrics": { en: "Pediatrics", fr: "Pédiatrie", zh: "儿科" },
  "Ophthalmology": { en: "Ophthalmology", fr: "Ophtalmologie", zh: "眼科" },
  "Dentistry": { en: "Dentistry", fr: "Dentisterie", zh: "口腔科" },
  "Neurology": { en: "Neurology", fr: "Neurologie", zh: "神经内科" },
  "Orthopedics": { en: "Orthopedics", fr: "Orthopédie", zh: "骨科" },
  "Primary Care": { en: "Primary Care", fr: "Soins Primaires", zh: "全科医学" },
  "General Care": { en: "General Care", fr: "Soins Généraux", zh: "基础门诊" },
};

export function getLocalizedDepartmentName(dept: string, locale: string): string {
  if (!dept) return "";
  const normLocale = (locale || "en").toLowerCase();
  const found = DEPARTMENT_TRANSLATIONS[dept];
  if (found && found[normLocale]) return found[normLocale];
  return dept;
}

const PRICING_PLAN_TRANSLATIONS: Record<string, { name: Record<string, string>; desc: Record<string, string> }> = {
  "Basic": {
    name: { en: "Basic", fr: "Formule de Base", zh: "基础版套餐" },
    desc: { en: "Essential care for proactive individuals.", fr: "Soins essentiels pour personnes prévoyantes.", zh: "适合追求个人健康预防管理的用户。" }
  },
  "Standard": {
    name: { en: "Standard", fr: "Formule Standard", zh: "标准版套餐" },
    desc: { en: "Comprehensive care for growing families.", fr: "Soins complets pour familles grandissantes.", zh: "适合注重全家长期健康保障的家庭。" }
  },
  "Premium": {
    name: { en: "Premium", fr: "Formule Premium", zh: "尊享版套餐" },
    desc: { en: "Ultimate care and immediate clinical access.", fr: "Soins ultimes et accès clinique immédiat.", zh: "适合享有最高优先级就诊与全面保障的用户。" }
  }
};

export function getLocalizedPlanName(name: string, locale: string): string {
  const normLocale = (locale || "en").toLowerCase();
  const found = PRICING_PLAN_TRANSLATIONS[name];
  if (found && found.name[normLocale]) return found.name[normLocale];
  return name;
}

export function getLocalizedPlanDesc(desc: string, planName: string, locale: string): string {
  const normLocale = (locale || "en").toLowerCase();
  const found = PRICING_PLAN_TRANSLATIONS[planName];
  if (found && found.desc[normLocale]) return found.desc[normLocale];
  return desc;
}

const FEATURE_TRANSLATIONS: Record<string, Record<string, string>> = {
  "1 Free Consultation/yr": { en: "1 Free Consultation/yr", fr: "1 Consultation Gratuite/an", zh: "每年 1 次免费全科门诊咨询" },
  "3 Free Consultations/yr": { en: "3 Free Consultations/yr", fr: "3 Consultations Gratuites/an", zh: "每年 3 次免费全科门诊咨询" },
  "Unlimited Consultations": { en: "Unlimited Consultations", fr: "Consultations Illimitées", zh: "无限制免费全科门诊" },
  "10% off Diagnostics": { en: "10% off Diagnostics", fr: "10% de réduction sur Diagnostics", zh: "医学检验项目 9 折优惠" },
  "20% off Diagnostics": { en: "20% off Diagnostics", fr: "20% de réduction sur Diagnostics", zh: "医学检验项目 8 折优惠" },
  "50% off Diagnostics": { en: "50% off Diagnostics", fr: "50% de réduction sur Diagnostics", zh: "医学检验项目 5 折半价优惠" },
  "Telehealth Access": { en: "Telehealth Access", fr: "Accès Télépréservation", zh: "支持远程问诊与在线咨询" },
  "Priority Booking slots": { en: "Priority Booking slots", fr: "Créneaux Prioritaires", zh: "尊享优先预约绿色通道" }
};

export function getLocalizedFeatureText(text: string, locale: string): string {
  const normLocale = (locale || "en").toLowerCase();
  const found = FEATURE_TRANSLATIONS[text];
  if (found && found[normLocale]) return found[normLocale];
  return text;
}
