export interface ServiceInclude {
  title: string;
  description: string;
  icon: string;
}

export interface ServiceStep {
  step: number;
  title: string;
  icon: string;
  description: string;
}

export interface Service {
  id: string;
  slug: string;
  name: string;
  category: "general" | "diagnostics" | "mental-health" | "wellness" | "vaccinations";
  shortDescription: string;
  longDescription: string;
  tagline: string;
  icon: string;
  price: string;
  duration: string;
  image: string;
  accentColor: "primary" | "secondary" | "tertiary";
  includes: ServiceInclude[];
  whosItFor: string[];
  steps: ServiceStep[];
  relatedSlugs: string[];
}

export const services: Service[] = [
  {
    id: "routine-checkups",
    slug: "routine-checkups",
    name: "Private GP & Consultations",
    category: "general",
    shortDescription: "Comprehensive annual exams and private GP consultations to monitor overall health.",
    longDescription: "Our Routine Checkups & Private GP consultations offer a comprehensive diagnostic review of your health status. Led by experienced primary care doctors, we discuss your concerns in detail without feeling rushed.",
    tagline: "Thorough health evaluations for peace of mind.",
    icon: "stethoscope",
    price: "$150",
    duration: "30 mins",
    image: "/images/services/routine-checkups.png",
    accentColor: "primary",
    includes: [
      {
        title: "Comprehensive Assessment",
        description: "Detailed discussion of your medical history, symptoms, and concerns without feeling rushed.",
        icon: "stethoscope",
      },
      {
        title: "Vital Statistics Check",
        description: "Review of blood pressure, heart rate, height, weight, and key metabolic metrics.",
        icon: "monitor_heart",
      },
      {
        title: "Personalized Wellness Report",
        description: "A summary of advice, lifestyle recommendations, and diagnostic goals from your physician.",
        icon: "clinical_notes",
      },
    ],
    whosItFor: ["Annual Checkups", "Preventative Care", "Vital Sign Monitoring", "Lifestyle Advice"],
    steps: [
      {
        step: 1,
        title: "Book Online",
        icon: "calendar_month",
        description: "Select a time that suits your schedule through our secure portal.",
      },
      {
        step: 2,
        title: "Consultation",
        icon: "forum",
        description: "Meet with your doctor in a private, comfortable clinic setting.",
      },
      {
        step: 3,
        title: "Follow-up",
        icon: "medical_services",
        description: "Receive digital notes and any necessary ongoing care plans.",
      },
    ],
    relatedSlugs: ["advanced-blood-panels", "immunization-clinic", "digital-imaging"],
  },
  {
    id: "advanced-blood-panels",
    slug: "advanced-blood-panels",
    name: "Blood Tests & Health Screens",
    category: "diagnostics",
    shortDescription: "Detailed laboratory testing for precise insights into your metabolic bio-markers.",
    longDescription: "Get a detailed picture of your metabolic function, hormone levels, inflammatory markers, lipid subgroups, and nutritional deficiencies with fast results.",
    tagline: "Precise cellular and metabolic insights.",
    icon: "biotech",
    price: "$250",
    duration: "15 mins",
    image: "/images/services/advanced-blood-panels.png",
    accentColor: "secondary",
    includes: [
      {
        title: "50+ Bio-marker Analysis",
        description: "Detailed analysis of metabolic indicators, organ functions, lipid subgroups, and key hormones.",
        icon: "biotech",
      },
      {
        title: "Phlebotomy Service",
        description: "Clean, comfortable blood draw administered by expert phlebotomists in our quiet diagnostic suite.",
        icon: "vaccines",
      },
      {
        title: "Physician Consultation",
        description: "Includes a follow-up review of findings and custom advice with a primary care doctor.",
        icon: "stethoscope",
      },
    ],
    whosItFor: ["Chronic fatigue", "Hormonal imbalances", "Cardiovascular checks", "Fitness optimization"],
    steps: [
      {
        step: 1,
        title: "Schedule Draw",
        icon: "calendar_month",
        description: "Select a morning appointment slot for fasting blood draw.",
      },
      {
        step: 2,
        title: "Lab Analysis",
        icon: "biotech",
        description: "Our certified laboratory analyzes your sample for 50+ key metabolic bio-markers.",
      },
      {
        step: 3,
        title: "Physician Review",
        icon: "forum",
        description: "Review findings and receive a personalized optimization plan.",
      },
    ],
    relatedSlugs: ["routine-checkups", "nutritional-planning", "digital-imaging"],
  },
  {
    id: "immunization-clinic",
    slug: "immunization-clinic",
    name: "Vaccinations & Travel Shots",
    category: "vaccinations",
    shortDescription: "Complete vaccination schedules for families, travel vaccines, and booster shots.",
    longDescription: "Ensure your family is protected with up-to-date immunizations. We offer pediatric schedules, booster shots, travel vaccines, and annual influenza shots.",
    tagline: "Safe, up-to-date immunizations for the whole family.",
    icon: "vaccines",
    price: "$90",
    duration: "15 mins",
    image: "/images/services/immunization-clinic.png",
    accentColor: "secondary",
    includes: [
      {
        title: "Clinical History Audit",
        description: "Verification of immunizations records, vaccine safety clearance, and clinical consult by a nurse.",
        icon: "stethoscope",
      },
      {
        title: "Gentle Administration",
        description: "Careful and gentle vaccine delivery using advanced, fine-needle systems.",
        icon: "vaccines",
      },
      {
        title: "Digital Certifications",
        description: "Instant updates to your medical records and digital travel/school immunization certificates.",
        icon: "clinical_notes",
      },
    ],
    whosItFor: ["Childhood schedules", "Travel planning", "Seasonal flu protection", "School / Work boosters"],
    steps: [
      {
        step: 1,
        title: "Check Schedule",
        icon: "calendar_month",
        description: "Book your slot and input any travel/school vaccine requirements.",
      },
      {
        step: 2,
        title: "Gentle Administration",
        icon: "vaccines",
        description: "Our nurses administer vaccines in a relaxing, reassuring room.",
      },
      {
        step: 3,
        title: "Digital Record",
        icon: "clinical_notes",
        description: "Your immunization record is uploaded to your Patient Portal instantly.",
      },
    ],
    relatedSlugs: ["routine-checkups", "advanced-blood-panels", "cognitive-therapy"],
  },
  {
    id: "hayfever-allergy",
    slug: "hayfever-allergy",
    name: "Hayfever & Allergy Care",
    category: "general",
    shortDescription: "Targeted allergy testing, immunotherapy, and fast-acting hayfever relief plans.",
    longDescription: "Breathe easier with expert diagnosis and custom treatment plans for seasonal allergies, hayfever, dust sensitivities, and allergic rhinitis.",
    tagline: "Effective relief from seasonal allergies.",
    icon: "spa",
    price: "$130",
    duration: "25 mins",
    image: "/images/services/hayfever-allergy.png",
    accentColor: "primary",
    includes: [
      {
        title: "Allergy Profiling",
        description: "Identification of environmental and seasonal triggers through targeted panel reviews.",
        icon: "biotech",
      },
      {
        title: "Prescription Relief",
        description: "Tailored antihistamine, nasal spray, or injection therapy options for rapid symptom control.",
        icon: "vaccines",
      },
      {
        title: "Long-term Immunotherapy",
        description: "Guidance on desensitization treatments for lasting allergen tolerance.",
        icon: "clinical_notes",
      },
    ],
    whosItFor: ["Seasonal Hayfever", "Pollen Allergies", "Dust & Pet Sensitivities", "Chronic Rhinitis"],
    steps: [
      {
        step: 1,
        title: "Symptom Assessment",
        icon: "calendar_month",
        description: "Outline your seasonal triggers and history.",
      },
      {
        step: 2,
        title: "Physician Review",
        icon: "forum",
        description: "Consult with our specialist to determine the ideal medication protocol.",
      },
      {
        step: 3,
        title: "Rapid Relief",
        icon: "medical_services",
        description: "Receive your tailored prescription and management plan.",
      },
    ],
    relatedSlugs: ["routine-checkups", "advanced-blood-panels", "nutritional-planning"],
  },
  {
    id: "cognitive-therapy",
    slug: "cognitive-therapy",
    name: "Cognitive Therapy & Mental Health",
    category: "mental-health",
    shortDescription: "Evidence-based counseling to build emotional resilience and support mental well-being.",
    longDescription: "Work one-on-one with board-certified cognitive therapists to manage stress, build emotional resilience, and treat anxiety or depression in a supportive space.",
    tagline: "Evidence-based support for emotional resilience.",
    icon: "psychology",
    price: "$180",
    duration: "50 mins",
    image: "/images/services/cognitive-therapy.png",
    accentColor: "tertiary",
    includes: [
      {
        title: "One-on-One Session",
        description: "A dedicated, confidential consultation session with a board-certified behavioral therapist.",
        icon: "psychology",
      },
      {
        title: "Actionable Coping Skills",
        description: "Evidence-based cognitive drills and relaxation techniques designed for everyday use.",
        icon: "clinical_notes",
      },
      {
        title: "Mental Wellness Journal",
        description: "Guided worksheets and exercises to support structured progression between sessions.",
        icon: "edit_document",
      },
    ],
    whosItFor: ["Anxiety & Stress", "Mood disorders", "Life transitions", "Resilience building"],
    steps: [
      {
        step: 1,
        title: "Initial Consultation",
        icon: "forum",
        description: "Meet with your therapist to outline goals and establish comfort.",
      },
      {
        step: 2,
        title: "Weekly Sessions",
        icon: "psychology",
        description: "Participate in structured, evidence-based therapy sessions.",
      },
      {
        step: 3,
        title: "Progress Review",
        icon: "clinical_notes",
        description: "Evaluate improvements and adjust long-term wellness plans.",
      },
    ],
    relatedSlugs: ["routine-checkups", "nutritional-planning", "immunization-clinic"],
  },
  {
    id: "nutritional-planning",
    slug: "nutritional-planning",
    name: "Nutritional Planning & Weight Management",
    category: "wellness",
    shortDescription: "Personalized dietary strategies to optimize energy, recovery, and healthy weight management.",
    longDescription: "Receive custom nutrition guidance based on your bio-markers, health goals, and lifestyle. Perfect for weight management, chronic conditions, or boosting physical energy.",
    tagline: "Personalized dietary plans for energy and recovery.",
    icon: "nutrition",
    price: "$120",
    duration: "45 mins",
    image: "/images/services/nutritional-planning.png",
    accentColor: "primary",
    includes: [
      {
        title: "Dietary Baseline Assessment",
        description: "Thorough review of your food logs, lifestyle factors, allergies, and specific bio-markers.",
        icon: "stethoscope",
      },
      {
        title: "Custom Meal Layouts",
        description: "Tailored recipe collections and eating schedules aligned to your metabolic calorie targets.",
        icon: "clinical_notes",
      },
      {
        title: "Nutrient Optimization advice",
        description: "Expert guidelines regarding vitamin/mineral supplementation and dietary recovery habits.",
        icon: "biotech",
      },
    ],
    whosItFor: ["Weight management", "Digestive health", "Athletic training", "Anti-inflammatory diets"],
    steps: [
      {
        step: 1,
        title: "Intake & Diary",
        icon: "clinical_notes",
        description: "Log your dietary intake for three days prior to your session.",
      },
      {
        step: 2,
        title: "Consultation",
        icon: "forum",
        description: "Discuss your habits, challenges, and goals with our nutritionist.",
      },
      {
        step: 3,
        title: "Personalized Plan",
        icon: "nutrition",
        description: "Receive your custom meal guide, caloric breakdown, and supplements list.",
      },
    ],
    relatedSlugs: ["routine-checkups", "advanced-blood-panels", "cognitive-therapy"],
  },
  {
    id: "digital-imaging",
    slug: "digital-imaging",
    name: "Digital Imaging & Diagnostics",
    category: "diagnostics",
    shortDescription: "State-of-the-art X-ray and ultrasound facilities providing rapid, high-resolution results.",
    longDescription: "Our high-resolution imaging facility delivers low-radiation X-rays and non-invasive ultrasounds. Results are read rapidly by board-certified radiologists.",
    tagline: "State-of-the-art X-ray and ultrasound facilities.",
    icon: "radiology",
    price: "$200",
    duration: "20 mins",
    image: "/images/services/digital-imaging.png",
    accentColor: "primary",
    includes: [
      {
        title: "High-Resolution Scan",
        description: "Precision diagnostic scanning completed using modern, ultra-low dosage digital imaging machines.",
        icon: "radiology",
      },
      {
        title: "Certified Imaging Report",
        description: "Rapid review and expert clinical diagnostic reporting provided by board-certified radiologists.",
        icon: "clinical_notes",
      },
      {
        title: "Immediate Consult Review",
        description: "Covers immediate routing of records and a follow-up review with your doctor.",
        icon: "stethoscope",
      },
    ],
    whosItFor: ["Injury diagnosis", "Joint pain investigation", "Abdominal evaluations", "Ultrasounds"],
    steps: [
      {
        step: 1,
        title: "Safe Prep",
        icon: "calendar_month",
        description: "Receive preparing guidelines (fasting, clothing) before your imaging slot.",
      },
      {
        step: 2,
        title: "Scanning Session",
        icon: "radiology",
        description: "Our experienced technologists complete your scan in our private suite.",
      },
      {
        step: 3,
        title: "Rapid Results",
        icon: "clinical_notes",
        description: "Images are reviewed immediately and sent to your doctor within hours.",
      },
    ],
    relatedSlugs: ["routine-checkups", "advanced-blood-panels", "immunization-clinic"],
  },
  {
    id: "sexual-health",
    slug: "sexual-health",
    name: "Sexual Health & Confidential Screenings",
    category: "diagnostics",
    shortDescription: "Discrete, confidential STI testing, consultations, and preventative health screenings.",
    longDescription: "Fast, confidential STI testing and sexual health consultations conducted in a supportive, judgment-free medical environment with rapid lab turnarounds.",
    tagline: "Discreet and compassionate sexual health care.",
    icon: "favorite",
    price: "$160",
    duration: "20 mins",
    image: "/images/services/sexual-health.png",
    accentColor: "tertiary",
    includes: [
      {
        title: "Full Screen Panel",
        description: "Discreet laboratory screening for common infections and reproductive health indicators.",
        icon: "biotech",
      },
      {
        title: "Confidential Consultation",
        description: "Private discussion with a compassionate GP to review symptoms, prevention, or treatment.",
        icon: "forum",
      },
      {
        title: "Fast Digital Results",
        description: "Results delivered securely via encrypted portal within 24-48 hours.",
        icon: "clinical_notes",
      },
    ],
    whosItFor: ["Routine Screenings", "Symptom Checks", "Partner Health", "Preventative Care"],
    steps: [
      {
        step: 1,
        title: "Private Booking",
        icon: "calendar_month",
        description: "Choose a discreet slot online with zero hassle.",
      },
      {
        step: 2,
        title: "Sample Collection",
        icon: "biotech",
        description: "Quick, comfortable sample collection in a private suite.",
      },
      {
        step: 3,
        title: "Encrypted Results",
        icon: "clinical_notes",
        description: "Receive your confidential lab report and prescription if needed.",
      },
    ],
    relatedSlugs: ["advanced-blood-panels", "routine-checkups", "immunization-clinic"],
  },
  {
    id: "occupational-health",
    slug: "occupational-health",
    name: "Occupational Health & Medicals",
    category: "wellness",
    shortDescription: "Pre-employment medicals, fitness-for-work assessments, and corporate health checks.",
    longDescription: "Comprehensive health evaluations for employees and businesses. From fitness-to-work certifications to workplace ergonomic assessments.",
    tagline: "Empowering workforce safety and health.",
    icon: "medical_services",
    price: "$175",
    duration: "35 mins",
    image: "/images/services/occupational-health.png",
    accentColor: "secondary",
    includes: [
      {
        title: "Workplace Health Exam",
        description: "Full physical checkup tailored to industry-specific employment requirements.",
        icon: "stethoscope",
      },
      {
        title: "Fitness Certification",
        description: "Official medical fitness certificate issued promptly upon completion.",
        icon: "clinical_notes",
      },
      {
        title: "Corporate Support",
        description: "Direct reporting and compliance documentation for employers.",
        icon: "forum",
      },
    ],
    whosItFor: ["Pre-employment Check", "Annual Corporate Health", "Executive Screenings", "Safety Critical Roles"],
    steps: [
      {
        step: 1,
        title: "Appointment Booking",
        icon: "calendar_month",
        description: "Schedule your occupational medical assessment.",
      },
      {
        step: 2,
        title: "Physical Assessment",
        icon: "stethoscope",
        description: "Complete your physical exam and vital checks.",
      },
      {
        step: 3,
        title: "Certificate Issue",
        icon: "clinical_notes",
        description: "Receive your verified fitness-to-work documentation.",
      },
    ],
    relatedSlugs: ["routine-checkups", "advanced-blood-panels", "digital-imaging"],
  },
];
