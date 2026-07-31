// Utility helper for translating dynamic DB data (Service titles & descriptions) seamlessly

interface TranslationEntry {
  title: Record<string, string>;
  description: Record<string, string>;
}

const SERVICE_TRANSLATIONS: Record<string, TranslationEntry> = {
  "Acne & Skin Consultation": {
    title: {
      en: "Acne & Skin Consultation",
      fr: "Consultation Acné & Peau",
      zh: "痤疮与皮肤专科门诊"
    },
    description: {
      en: "Professional Acne & Skin Consultation service.",
      fr: "Service professionnel de consultation pour l'acné et la peau.",
      zh: "专业的痤疮及皮肤问题诊疗服务。"
    }
  },
  "Cardiovascular Health Assessment": {
    title: {
      en: "Cardiovascular Health Assessment",
      fr: "Évaluation Santé Cardiovasculaire",
      zh: "心血管健康评估"
    },
    description: {
      en: "Professional Cardiovascular Health Assessment service.",
      fr: "Évaluation complète de la santé cardiovasculaire.",
      zh: "专业全面的心血管健康检查评估。"
    }
  },
  "Child Vaccination & Immunization": {
    title: {
      en: "Child Vaccination & Immunization",
      fr: "Vaccination & Immunisation Infantile",
      zh: "儿童疫苗接种与免疫"
    },
    description: {
      en: "Professional Child Vaccination & Immunization service.",
      fr: "Services complets de vaccination pour enfants.",
      zh: "专业的儿童基础疫苗及免疫计划服务。"
    }
  },
  "Comprehensive Vision & Eye Exam": {
    title: {
      en: "Comprehensive Vision & Eye Exam",
      fr: "Examen de la Vue & Soins Oculaires",
      zh: "全方位眼科与视力检查"
    },
    description: {
      en: "Professional Comprehensive Vision & Eye Exam service.",
      fr: "Examen complet de la vue et dépistage ophtalmique.",
      zh: "专业的视力检测与综合眼科健康检查。"
    }
  },
  "Dental Cleaning & Polishing": {
    title: {
      en: "Dental Cleaning & Polishing",
      fr: "Nettoyage & Polissage Dentaire",
      zh: "洁牙与牙齿抛光服务"
    },
    description: {
      en: "Professional Dental Cleaning & Polishing service.",
      fr: "Détartrage et nettoyage dentaire professionnel.",
      zh: "专业的牙齿清洁、去石与美白抛光。"
    }
  },
  "ECG & Heart Function Exam": {
    title: {
      en: "ECG & Heart Function Exam",
      fr: "ECG & Examen Cardiaque",
      zh: "心电图与心功能检查"
    },
    description: {
      en: "Professional ECG & Heart Function Exam service.",
      fr: "Examen électrocardiogramme et suivi de la fonction cardiaque.",
      zh: "心电图监测与心功能综合评估服务。"
    }
  }
};

const SPECIALTY_TRANSLATIONS: Record<string, Record<string, string>> = {
  "Pediatrics": { en: "Pediatrics", fr: "Pédiatrie", zh: "儿科" },
  "Cardiology": { en: "Cardiology", fr: "Cardiologie", zh: "心血管科" },
  "Dermatology": { en: "Dermatology", fr: "Dermatologie", zh: "皮肤科" },
  "Primary Care": { en: "Primary Care", fr: "Soins Primaires", zh: "全科医疗" },
  "Dentistry": { en: "Dentistry", fr: "Dentisterie", zh: "牙科" },
  "Neurology": { en: "Neurology", fr: "Neurologie", zh: "神经内科" }
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
