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
  "All Services": { en: "All Services", fr: "Tous les Services", zh: "所有服务" },
  "All Specialists": { en: "All Specialists", fr: "Tous les Spécialistes", zh: "所有专家" }
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

export function getLocalizedWorkingDays(days: string[], locale: string): string {
  if (!days || days.length === 0) return "";
  return days.map((d) => getLocalizedDay(d, locale)).join(", ");
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
  "Parking & Accessibility": { en: "Parking & Accessibility", fr: "Parking & Accessibilité", zh: "停车与无障碍设施" },
  "Virtual Consultations": { en: "Virtual Consultations", fr: "Consultations Virtuelles", zh: "在线远程诊疗" },
  "Medical Records": { en: "Medical Records", fr: "Dossiers Médicaux", zh: "病历与就诊记录" }
};

export function getLocalizedFAQCategory(category: string, locale: string): string {
  if (!category) return "";
  const normLocale = (locale || "en").toLowerCase();
  const found = FAQ_CATEGORY_TRANSLATIONS[category];
  if (found && found[normLocale]) return found[normLocale];
  return category;
}

const FAQ_ITEMS_TRANSLATIONS: Record<string, { question: Record<string, string>; answer: Record<string, string> }> = {
  "Do you offer online telehealth appointments?": {
    question: { en: "Do you offer online telehealth appointments?", fr: "Proposez-vous des rendez-vous de télémédecine en ligne ?", zh: "诊所是否提供在线远程视频问诊服务？" },
    answer: { en: "Yes, we offer virtual video consultations for general follow-ups, prescription renewals, and non-emergency advice.", fr: "Oui, nous proposons des consultations vidéo virtuelles pour le suivi général, le renouvellement d'ordonnances et les conseils non urgents.", zh: "是的，我们为复诊病情跟踪、处方续签及非紧急健康咨询提供便捷的高清在线视频问诊服务。" }
  },
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

const AUTHOR_BIO_MAP: Record<string, Record<string, string>> = {
  "Dr. Sarah Jenkins": {
    en: "Dr. Jenkins is a senior physician specializing in preventive health diagnostics and patient-first care maps. She has dedicated 12 years to community health development.",
    fr: "Le Dr Jenkins est une médecin sénior spécialisée dans le diagnostic de santé préventif et les soins axés sur le patient. Elle a consacré 12 ans au développement de la santé communautaire.",
    zh: "Jenkins 医生是一位资深全科门诊专家，专长于疾病早期诊断与预防性全周期健康管理，拥有 12 年社区临床医疗服务经验。"
  },
  "Dietitian Mark": {
    en: "Mark focuses on functional nutrition and metabolic support. He designs dietary strategies to help patients manage inflammation, weight, and improve physical performance.",
    fr: "Mark se concentre sur la nutrition fonctionnelle et le soutien métabolique. Il conçoit des stratégies alimentaires pour aider les patients à gérer l'inflammation, le poids et les performances physiques.",
    zh: "Mark 致力于临床功能营养与新陈代谢调理，擅长通过科学膳食干预帮助患者控制慢性炎症、管理体重并提升体能素质。"
  },
  "Dr. E. Rossi": {
    en: "Dr. Rossi specializes in cognitive behavioral therapy (CBT) and occupational stress recovery. She has 8+ years helping individuals navigate life changes and stress triggers.",
    fr: "Le Dr Rossi est spécialisée dans la thérapie cognitivo-comportementale (TCC) et la récupération après un stress professionnel. Elle possède plus de 8 ans d'expérience dans l'accompagnement des patients.",
    zh: "Rossi 医生专长于认知行为疗法 (CBT) 与职业压力心理康复，拥有 8 年以上帮扶患者应对生活变故与压力源的丰富诊疗经验。"
  },
  "Clinic Staff": {
    en: "Our integrated care coordination team works around the clock to provide timely resources, vaccinations scheduling, and clinical assistance.",
    fr: "Notre équipe intégrée de coordination des soins travaille 24h/24 et 7j/7 pour fournir des ressources opportunes, la planification des vaccinations et une assistance clinique.",
    zh: "我们的综合护理协调团队全天候在线，为广大患者提供快捷的门诊资源调配、疫苗接种预约以及临床辅助支持服务。"
  },
  "Lumina Management": {
    en: "The LuminaHealth management team is dedicated to designing premium clinical facilities and offering modern amenities for outstanding patient care.",
    fr: "L'équipe de direction de LuminaHealth s'engage à concevoir des installations cliniques haut de gamme et à offrir des équipements modernes pour des soins d'exception.",
    zh: "LuminaHealth 管理团队致力于打造国际化高品质诊疗设施与现代化就医环境，全方位提升患者就诊关怀与满意度。"
  },
  "Dr. James Wilson": {
    en: "Dr. Wilson specializes in preventative care and nutritional wellness. With over 15 years of experience, he is passionate about empowering patients to take charge of their health through holistic, evidence-based approaches.",
    fr: "Le Dr Wilson est spécialisé dans les soins préventifs et le bien-être nutritionnel. Avec plus de 15 ans d'expérience, il s'assure d'offrir une prise en charge globale et éprouvée.",
    zh: "Wilson 医生专注于全科预防医学与营养健康管理，拥有 15 年以上的丰富临床经验，擅长运用循证医学方法协助患者管理身体健康。"
  }
};

export function getLocalizedAuthorBio(bio: string, author: string, locale: string): string {
  const normLocale = (locale || "en").toLowerCase();
  const found = AUTHOR_BIO_MAP[author];
  if (found && found[normLocale]) return found[normLocale];
  return bio;
}

const BLOG_CONTENT_TRANSLATIONS: Record<string, Record<string, string>> = {
  "The Importance of Annual Check-ups": {
    fr: `
      <p>Les examens de santé réguliers sont essentiels pour la détection précoce des problèmes potentiels. Travailler en étroite collaboration avec votre médecin de famille vous permet de maintenir un bien-être optimal et de prévenir les complications.</p>
      <h3>Pourquoi le bilan annuel est essentiel</h3>
      <p>De nombreuses maladies chroniques, telles que l'hypertension artérielle et le diabète de type 2, se développent progressivement sans symptômes évidents au début. Lors du bilan annuel, votre médecin surveille vos constantes vitales, votre cholestérol et votre glycémie.</p>
      <h3>Partenariat de santé</h3>
      <p>Un bilan annuel offre l'occasion d'établir une relation de confiance durable avec votre professionnel de santé pour aborder vos habitudes de vie, votre sommeil et votre bien-être mental.</p>
    `,
    zh: `
      <p>定期健康体检是早期发现潜在健康隐患的关键。与您的家庭医生保持密切沟通，有助于建立个人健康档案并维持身体最佳状态。安排年度体检是保障长期健康最具前瞻性的一步。</p>
      <h3>为什么年度体检至关重要</h3>
      <p>许多慢性疾病（如高血压和 2 型糖尿病）在早期发展阶段往往没有任何明显症状。在年度体检中，医生会全面检测血压、血脂及血糖等核心指标，做到早发现、早干预。</p>
      <h3>建立长期的健康信任伙伴关系</h3>
      <p>年度体检不仅是一项例行检查，更是与您的主治医师建立深度信任的良好契机。您可以从容地交流日常生活习惯、睡眠质量、心理压力及家族病史等关切问题。</p>
    `
  },
  "Eating for Immunity This Winter": {
    fr: `
      <p>À l'approche des mois d'hiver, notre système immunitaire est confronté aux virus saisonniers et au froid. Bien qu'aucun aliment ne garantisse une immunité totale, une alimentation riche en nutriments renforce naturellement vos défenses.</p>
      <h3>Piliers nutritionnels de l'immunité</h3>
      <p>Privilégiez les aliments complets riches en vitamines et minéraux essentiels :</p>
      <ul>
        <li><strong>Vitamine C :</strong> Agrumes, poivrons et épinards favorisent la protection cellulaire.</li>
        <li><strong>Zinc :</strong> Viandes maigres, graines et lentilles soutiennent le développement immunitaire.</li>
        <li><strong>Probiotiques :</strong> Les aliments fermentés renforcent le microbiote intestinal.</li>
      </ul>
    `,
    zh: `
      <p>随著冬季气温降低，我们的免疫系统面临严峻的季节性病毒考验。虽然没有某种单一食物能包治百病，但富含维生素与矿物质的均衡营养饮食是维持身体免疫屏障的关键。</p>
      <h3>免疫支持的四大关键营养要素</h3>
      <p>为了支持白细胞的正常免疫应答，请优先摄入以下富含关键微量营养素的天然食物：</p>
      <ul>
        <li><strong>维生素 C：</strong>柑橘类水果、彩椒及菠菜富含天然抗氧化剂，有效保护细胞免疫。</li>
        <li><strong>锌元素：</strong>瘦肉、坚果及豆类对免疫细胞的分化与发育至关重要。</li>
        <li><strong>益生菌：</strong>酸奶及发酵食物能滋养肠道菌群，构筑强健的肠道免疫网络。</li>
      </ul>
    `
  },
  "Managing Workplace Stress": {
    fr: `
      <p>Les exigences professionnelles peuvent facilement déborder sur le temps personnel, entraînant une hausse du taux de cortisol et un stress systémique. À la longue, le stress professionnel chronique peut se manifester par des maux de tête, de la fatigue ou une tension cardiovasculaire. Apprendre à gérer le stress est essentiel pour préserver son bien-être physique et émotionnel.</p>
      <h3>Reconnaître les signes d'épuisement professionnel</h3>
      <p>Soyez attentif aux indicateurs émotionnels et comportementaux qui révèlent un surmenage : fatigue persistante, irritabilité envers les collègues, sentiment de détachement et baisse de la productivité globale.</p>
      <h3>Stratégies d'adaptation concrètes</h3>
      <p>Incorporez de petites habitudes de bien-être dans votre routine quotidienne pour rester équilibré :</p>
      <ul>
        <li><strong>Gestion par blocs de temps :</strong> Définissez des plages horaires strictes et protégez vos pauses déjeuner loin des écrans.</li>
        <li><strong>Pauses de pleine conscience :</strong> Prenez des pauses de 3 à 5 minutes pour faire des exercices de respiration entre les réunions.</li>
        <li><strong>Fixer des limites claires :</strong> Éteignez les applications de communication professionnelle après le travail pour permettre une récupération cognitive.</li>
      </ul>
    `,
    zh: `
      <p>职场生活中的高强度需求极易侵占个人生活时间，导致体内皮质醇水平升高并引发慢性累积性压力。长此以往，慢性职业压力会通过头痛、持续疲劳或心血管负担等生理症状显现。学会科学管理职场压力是维持身心健康的重中之重。</p>
      <h3>识别职业倦怠预警信号</h3>
      <p>警惕以下提示超负荷的心理与行为标志：持续性身心俱疲、对同事产生易怒情绪、社交异化与疏离感以及整体工作效率的明显下降。</p>
      <h3>高效实用的压力应对策略</h3>
      <p>将以下微健康习惯融入您的日常作息，保持身心动态平衡：</p>
      <ul>
        <li><strong>时间块管理：</strong>为各项工作任务设定严格的时间界限，并在午休期间远离电子屏幕。</li>
        <li><strong>正念小憩：</strong>在连续会议之间安排 3-5 分钟的深呼吸练习与正念冥想。</li>
        <li><strong>设立清晰的工作边界：</strong>下班后主动关闭工作通讯软件通知，给大脑留出充分的认知恢复时间。</li>
      </ul>
    `
  },
  "Flu Season 2024 Guidelines": {
    fr: `
      <p>La grippe demeure un risque sanitaire majeur pendant la saison froide. Le vaccin antigrippal annuel est recommandé à partir de 6 mois pour réduire la gravité des symptômes et limiter la transmission au sein de la communauté.</p>
      <h3>Moment idéal pour se faire vacciner</h3>
      <p>Pour une protection optimale, planifiez votre vaccination dès le début de l'automne, permettant à votre corps de produire les anticorps nécessaires.</p>
    `,
    zh: `
      <p>流行性感冒在秋冬寒冷季节依旧是影响公众健康的重要传染病。建议 6 个月以上的全人群接种年度流感疫苗，以显著降低重症发生率与社区传播风险。</p>
      <h3>接种疫苗的最佳时机</h3>
      <p>为在流感高发期来临前获得充足的保护力，权威卫生机构建议在秋季早中期完成接种，以便免疫系统产生足够的抗体屏障。</p>
    `
  },
  "LuminaHealth Unveils Wellness Suite": {
    fr: `
      <p>Nous sommes ravis d'annoncer l'inauguration de notre nouveau centre de diagnostic et de bien-être. Cette nouvelle aile clinique marque une étape importante dans notre engagement à fournir des services de diagnostic rapides et performants.</p>
      <h3>Imagerie de haute précision sur place</h3>
      <p>L'espace est équipé de radiologie numérique et d'échographie 4D avancée, permettant des résultats d'imagerie immédiats sans déplacement supplémentaire.</p>
    `,
    zh: `
      <p>我们非常荣幸地宣布 LuminaHealth 全新综合健康诊断中心正式启用。这一新建翼楼标志着诊所在一站式提供高效、精准现代化医学影像检查方面的全新里程碑。</p>
      <h3>院内即时高清影像诊断</h3>
      <p>诊疗中心配备全数字放射线成像系统与四维彩超设备，患者无需跨院奔波即可在现场完成关键影像检查与报告评估。</p>
    `
  }
};

export function getLocalizedBlogContent(content: string, title: string, locale: string): string {
  const normLocale = (locale || "en").toLowerCase();
  const found = BLOG_CONTENT_TRANSLATIONS[title];
  if (found && found[normLocale]) return found[normLocale];
  return content;
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
