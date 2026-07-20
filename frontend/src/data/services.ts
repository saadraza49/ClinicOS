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
    name: "Routine Checkups",
    category: "general",
    shortDescription: "Comprehensive annual exams to monitor your overall health and catch potential issues early.",
    longDescription: "Our Routine Checkups offer a comprehensive diagnostic review of your current health status. Led by experienced primary care doctors, we discuss your concerns in detail, assess vital statistics, and formulate a proactive health roadmap.",
    tagline: "Thorough health evaluations for peace of mind.",
    icon: "stethoscope",
    price: "$150",
    duration: "30 mins",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuASNkdNTQQVQYFWQF_QwAmpQV9ar9OCWw7etOTTzX5RouuF1HOOD3saJSGCaWViC4IfbV4dlTH0P4-uQr382o6Fl_NT-t7D7uwohJ-4MseBLNIai3qq-lPDww0mdYfrX5jzvPpNblbR-jiP17Byz9Xp9zpbGqmWPMGZeW5q2zjaAGdEO5ShYCSQ1aFfYUJ80jXUFwl7ihD1G4HyjBFM1k8c0NBRJ9U8NeOhraK_KzKBNFGU3hsK-0qX3YUzopJWhU9miB-XC_efOsRe",
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
    name: "Advanced Blood Panels",
    category: "diagnostics",
    shortDescription: "Detailed laboratory testing to provide precise insights into your metabolic and cellular health.",
    longDescription: "Get a detailed picture of your metabolic function, hormone levels, inflammatory markers, lipid subgroups, and nutritional deficiencies. Our advanced panel offers actionable insights for optimization.",
    tagline: "Precise cellular and metabolic insights.",
    icon: "biotech",
    price: "$250",
    duration: "15 mins",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCUZeIkI8mzTS1U9Xnh0fN9NiymQs-PlRRJlJIPShiXZxD5mSJACrA6Tybbl_7T8pHNo7ZMW8KlWZbZ-4VFQQgIT8CfEGFzfNTrKPhhkkpcjDB6IwD7aOnPUhv8iJvmETOOV2PJmSdywBfcw-K4OmVRk1wzIk-zCY1caTvGxi45WghMakJ31d_7wB3zTcNR0gO2QGZeS05dEKrHoe96zjDDaohwuiLlatFfMKrsaGhV7au-8gPj6Um5TaSuG7LnGQjzFfDscuAVLo5Y",
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
    id: "cognitive-therapy",
    slug: "cognitive-therapy",
    name: "Cognitive Therapy",
    category: "mental-health",
    shortDescription: "Evidence-based counseling services designed to build resilience and support mental well-being.",
    longDescription: "Work one-on-one with board-certified cognitive therapists to develop constructive patterns, manage stress, treat anxiety or depression, and build emotional resilience in a supportive environment.",
    tagline: "Evidence-based support for emotional resilience.",
    icon: "psychology",
    price: "$180",
    duration: "50 mins",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCSoxONfw2S4tJD64BPFL5nIoW1E8lQGWvDuhiwNvsb77k67hg_24CrjP3kfWQLG9EHrxRuoSybm4ldN3ahos33wAV6O8bBLiWAPD_CCKwI7PhZp_dhgY9JwkPFuFUHyQh2DfOi0bUfhoR0363zp16EB0KSymRm2cl0et2HUGVMFB4N45-P4rHjcQ1dLPrUg3e5arHYHO3bGNLYuxZ8p8KBG-v9j2tUTU8st3eeAoudGN6k9KjhzIN0TYVFR7QWBjvuYm33jTGjtwYO",
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
    name: "Nutritional Planning",
    category: "wellness",
    shortDescription: "Personalized dietary strategies crafted by specialists to optimize your energy and recovery.",
    longDescription: "Receive custom nutrition guidance based on your bio-markers, health goals, and lifestyle. Perfect for managing chronic conditions, weight, or boosting physical performance.",
    tagline: "Personalized dietary plans for energy and recovery.",
    icon: "nutrition",
    price: "$120",
    duration: "45 mins",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCSoxONfw2S4tJD64BPFL5nIoW1E8lQGWvDuhiwNvsb77k67hg_24CrjP3kfWQLG9EHrxRuoSybm4ldN3ahos33wAV6O8bBLiWAPD_CCKwI7PhZp_dhgY9JwkPFuFUHyQh2DfOi0bUfhoR0363zp16EB0KSymRm2cl0et2HUGVMFB4N45-P4rHjcQ1dLPrUg3e5arHYHO3bGNLYuxZ8p8KBG-v9j2tUTU8st3eeAoudGN6k9KjhzIN0TYVFR7QWBjvuYm33jTGjtwYO",
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
    id: "immunization-clinic",
    slug: "immunization-clinic",
    name: "Immunization Clinic",
    category: "vaccinations",
    shortDescription: "Complete vaccination schedules for families, including seasonal flu shots and travel requirements.",
    longDescription: "Ensure your family is protected with up-to-date immunizations. We offer pediatric schedules, booster shots, travel vaccines, and annual influenza/pneumonia immunizations.",
    tagline: "Safe, up-to-date immunizations for the whole family.",
    icon: "vaccines",
    price: "$90",
    duration: "15 mins",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCrZZBTOjMWvHbcEDlNG1CIAlJVuTTnhN-tkYZnjhQp5ciBuPp4ewB9CWl6SDYNxx4Ty-nUUngBBaEb0nHbJ23P0xPIhFlQwnEekmhJrkE_CaAWUk21VKxyjpRvgFeGxO_ab8SOi9Wyo5ZLzofrpp-qg1-yVS-yu94U_ftpZ9T1cAur7iUWkvyxih9XklusKoBJ6MYowQYOYvI_mOn3aS5yt1grlh5V0dp2MVW3CPxxreVhgxUgXIG_liEyo5TMBOnXc4ISXlcI0VeZ",
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
    id: "digital-imaging",
    slug: "digital-imaging",
    name: "Digital Imaging",
    category: "diagnostics",
    shortDescription: "State-of-the-art X-ray and ultrasound facilities providing rapid, high-resolution diagnostic results.",
    longDescription: "Our high-resolution imaging facility delivers low-radiation X-rays and non-invasive ultrasounds. Results are read rapidly by board-certified radiologists for accurate treatment planning.",
    tagline: "State-of-the-art X-ray and ultrasound facilities.",
    icon: "radiology",
    price: "$200",
    duration: "20 mins",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCUZeIkI8mzTS1U9Xnh0fN9NiymQs-PlRRJlJIPShiXZxD5mSJACrA6Tybbl_7T8pHNo7ZMW8KlWZbZ-4VFQQgIT8CfEGFzfNTrKPhhkkpcjDB6IwD7aOnPUhv8iJvmETOOV2PJmSdywBfcw-K4OmVRk1wzIk-zCY1caTvGxi45WghMakJ31d_7wB3zTcNR0gO2QGZeS05dEKrHoe96zjDDaohwuiLlatFfMKrsaGhV7au-8gPj6Um5TaSuG7LnGQjzFfDscuAVLo5Y",
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
];
