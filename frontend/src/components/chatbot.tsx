"use client";

import { useState, useEffect, useRef } from "react";
import { useTranslations, useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/routing";
import { motion, AnimatePresence } from "framer-motion";
import { useLocationModal } from "@/context/LocationContext";

interface Message {
  id: string;
  sender: "user" | "bot";
  text: string;
  timestamp: string;
  isReviewAction?: boolean;
  appointmentDetails?: Record<string, string>;
  isBookingSuccessMsg?: boolean;
  isBookingCardForm?: boolean;
  isCancelled?: boolean;
  isEditingForm?: boolean;
  isSubmitted?: boolean;
}



const COUNTRY_CODES = [
  { code: "+92", iso: "PK", name: "Pakistan", label: "Pakistan (+92)" },
  { code: "+1", iso: "US", name: "United States / Canada", label: "USA / Canada (+1)" },
  { code: "+44", iso: "GB", name: "United Kingdom", label: "UK (+44)" },
  { code: "+971", iso: "AE", name: "United Arab Emirates", label: "UAE (+971)" },
  { code: "+966", iso: "SA", name: "Saudi Arabia", label: "Saudi Arabia (+966)" },
  { code: "+974", iso: "QA", name: "Qatar", label: "Qatar (+974)" },
  { code: "+91", iso: "IN", name: "India", label: "India (+91)" },
  { code: "+49", iso: "DE", name: "Germany", label: "Germany (+49)" },
  { code: "+33", iso: "FR", name: "France", label: "France (+33)" },
  { code: "+61", iso: "AU", name: "Australia", label: "Australia (+61)" },
  { code: "+81", iso: "JP", name: "Japan", label: "Japan (+81)" },
  { code: "+86", iso: "CN", name: "China", label: "China (+86)" },
  { code: "+90", iso: "TR", name: "Turkey", label: "Turkey (+90)" },
  { code: "+60", iso: "MY", name: "Malaysia", label: "Malaysia (+60)" },
  { code: "+62", iso: "ID", name: "Indonesia", label: "Indonesia (+62)" },
  { code: "+20", iso: "EG", name: "Egypt", label: "Egypt (+20)" },
  { code: "+880", iso: "BD", name: "Bangladesh", label: "Bangladesh (+880)" },
  { code: "+968", iso: "OM", name: "Oman", label: "Oman (+968)" },
  { code: "+965", iso: "KW", name: "Kuwait", label: "Kuwait (+965)" },
  { code: "+973", iso: "BH", name: "Bahrain", label: "Bahrain (+973)" }
];

export const isPhoneNumberValidForCountry = (rawInput: string, countryCode: string): boolean => {
  const digitsOnly = rawInput.replace(/\D/g, '');
  if (!digitsOnly) return false;

  if (countryCode === "+92") return digitsOnly.length === 10 || (digitsOnly.length === 11 && digitsOnly.startsWith("0"));
  if (countryCode === "+1") return digitsOnly.length === 10;
  if (countryCode === "+44") return digitsOnly.length === 10;
  if (countryCode === "+971" || countryCode === "+966") return digitsOnly.length === 9;
  if (countryCode === "+974") return digitsOnly.length === 8;
  if (countryCode === "+91") return digitsOnly.length === 10;
  if (countryCode === "+49") return digitsOnly.length >= 10 && digitsOnly.length <= 11;
  if (countryCode === "+33" || countryCode === "+61") return digitsOnly.length === 9;

  return digitsOnly.length >= 7 && digitsOnly.length <= 12;
};




const DEFAULT_QUICK_REPLIES: string[] = [];


const WELCOME_CARDS = [
  {
    icon: "calendar_month",
    titleKey: "bookAppt",
    descKey: "bookApptDesc",
    text: "📅 Book Appointment",
    bgClass: "bg-[#eecbd8]/35 hover:bg-[#eecbd8]/65 border-[#eecbd8]/40 text-[#2c336b]",
    iconClass: "text-[#2c336b]"
  },
  {
    icon: "stethoscope",
    titleKey: "findDoctor",
    descKey: "findDoctorDesc",
    text: "👨‍⚕️ Find a Doctor",
    bgClass: "bg-[#f4df82]/35 hover:bg-[#f4df82]/65 border-[#f4df82]/40 text-[#2c336b]",
    iconClass: "text-[#2c336b]"
  },
  {
    icon: "medical_services",
    titleKey: "clinicServices",
    descKey: "clinicServicesDesc",
    text: "🩺 Clinic Services",
    bgClass: "bg-[#bce4cd]/35 hover:bg-[#bce4cd]/65 border-[#bce4cd]/40 text-[#2c336b]",
    iconClass: "text-[#2c336b]"
  },
  {
    icon: "schedule",
    titleKey: "clinicTimings",
    descKey: "clinicTimingsDesc",
    text: "⏰ Clinic Timings",
    bgClass: "bg-[#a9c7fb]/35 hover:bg-[#a9c7fb]/65 border-[#a9c7fb]/40 text-[#2c336b]",
    iconClass: "text-[#2c336b]"
  },
  {
    icon: "payments",
    titleKey: "consultationFee",
    descKey: "consultationFeeDesc",
    text: "💳 Consultation Fee",
    bgClass: "bg-[#f3d2de]/35 hover:bg-[#f3d2de]/65 border-[#f3d2de]/40 text-[#2c336b]",
    iconClass: "text-[#2c336b]"
  },
  {
    icon: "call",
    titleKey: "emergencyContact",
    descKey: "emergencyDesc",
    text: "📞 Emergency Contact",
    bgClass: "bg-red-50/60 hover:bg-red-100/70 border-red-100 text-red-700",
    iconClass: "text-red-600"
  }
];

const DOCTORS_DATABASE = [
  {
    id: 1,
    name: "Dr. Elena Rodriguez",
    specialty: "Pediatrics",
    gender: "Female",
    fee: "2,500 PKR",
    rating: "4.9 (120+ reviews)",
    availability: "Mon - Wed (10am - 2pm)",
    image: "/images/doctors/doctor_female.png",
    bio: "Dedicated pediatric specialist with over 8 years of clinical experience."
  },
  {
    id: 2,
    name: "Dr. Robert Miller",
    specialty: "Pediatrics",
    gender: "Male",
    fee: "2,500 PKR",
    rating: "4.8 (95+ reviews)",
    availability: "Thu - Sat (2pm - 6pm)",
    image: "/images/doctors/doctor_male.png",
    bio: "Experienced in newborn health, immunization, and common child development guidance."
  },
  {
    id: 3,
    name: "Dr. Marcus Vance",
    specialty: "Cardiology",
    gender: "Male",
    fee: "2,500 PKR",
    rating: "4.9 (210+ reviews)",
    availability: "Mon, Wed, Fri (9am - 12pm)",
    image: "/images/doctors/doctor_male.png",
    bio: "Consultant cardiologist focusing on preventive heart healthcare and hypertension."
  },
  {
    id: 4,
    name: "Dr. Sarah Jenkins",
    specialty: "Cardiology",
    gender: "Female",
    fee: "2,500 PKR",
    rating: "4.7 (150+ reviews)",
    availability: "Tue, Thu (3pm - 7pm)",
    image: "/images/doctors/doctor_female.png",
    bio: "Expert in clinical cardiology, cardiovascular diagnostics, and heart rhythm management."
  },
  {
    id: 5,
    name: "Dr. Omar Al-Fayed",
    specialty: "Dermatology",
    gender: "Male",
    fee: "2,500 PKR",
    rating: "4.8 (180+ reviews)",
    availability: "Mon - Sat (5pm - 8pm)",
    image: "/images/doctors/doctor_male.png",
    bio: "Specializes in skin conditions, cosmetic treatments, and allergy management."
  },
  {
    id: 6,
    name: "Dr. Sophia Carter",
    specialty: "Dermatology",
    gender: "Female",
    fee: "2,500 PKR",
    rating: "4.9 (135+ reviews)",
    availability: "Tue, Thu, Sat (10am - 1pm)",
    image: "/images/doctors/doctor_female.png",
    bio: "Passionate dermatologist specializing in medical skin treatments and skincare routines."
  },
  {
    id: 7,
    name: "Dr. James Wilson",
    specialty: "Primary Care",
    gender: "Male",
    fee: "1,500 PKR",
    rating: "4.9 (320+ reviews)",
    availability: "Mon - Sat (9am - 3pm)",
    image: "/images/doctors/doctor_male.png",
    bio: "General physician caring for broad chronic diseases and preventative family health."
  },
  {
    id: 8,
    name: "Dr. Fatima Ali",
    specialty: "Primary Care",
    gender: "Female",
    fee: "1,500 PKR",
    rating: "4.8 (280+ reviews)",
    availability: "Mon - Sat (3pm - 9pm)",
    image: "/images/doctors/doctor_female.png",
    bio: "Compassionate primary care physician with extensive experience in women's health."
  },
  {
    id: 9,
    name: "Dr. Bilal Ahmed",
    specialty: "Dentistry",
    gender: "Male",
    fee: "2,500 PKR",
    rating: "4.7 (110+ reviews)",
    availability: "Mon, Wed, Sat (11am - 4pm)",
    image: "/images/doctors/doctor_male.png",
    bio: "Implantologist and general dentist focusing on pain-free treatments and smile design."
  },
  {
    id: 10,
    name: "Dr. Priya Patel",
    specialty: "Neurology",
    gender: "Female",
    fee: "2,500 PKR",
    rating: "4.9 (90+ reviews)",
    availability: "Wed, Fri (12pm - 4pm)",
    image: "/images/doctors/doctor_female.png",
    bio: "Neurologist focusing on stroke care, migraine control, and peripheral neuropathy."
  }
];

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api/v1";

// 6-Hour session expiration constants
const SIX_HOURS_SEC = 6 * 60 * 60;
const SIX_HOURS_MS = SIX_HOURS_SEC * 1000;

function setCookie(name: string, value: string, maxAgeSeconds: number) {
  if (typeof document !== "undefined") {
    document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${maxAgeSeconds}; SameSite=Lax`;
  }
}

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const matches = document.cookie.match(
    new RegExp("(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, "\\$1") + "=([^;]*)")
  );
  return matches ? decodeURIComponent(matches[1]) : null;
}

export default function Chatbot() {
  const t = useTranslations("Chatbot");
  const locale = useLocale();
  const [isOpen, setIsOpen] = useState(false);

  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCountryCode, setSelectedCountryCode] = useState("+92");
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
  const [countrySearchQuery, setCountrySearchQuery] = useState("");

  const [messages, setMessages] = useState<Message[]>([]);
  const [quickReplies, setQuickReplies] = useState<string[]>(DEFAULT_QUICK_REPLIES);

  const lastBotMsg = messages.filter(m => m.sender === "bot").slice(-1)[0];
  const lastBotTextLower = lastBotMsg ? lastBotMsg.text.toLowerCase() : "";
  const isAskingPhone = lastBotMsg ? (
    (
      lastBotTextLower.includes("enter your phone") ||
      lastBotTextLower.includes("provide your phone") ||
      lastBotTextLower.includes("enter your contact phone number") ||
      lastBotTextLower.includes("contact phone number to finalize") ||
      lastBotTextLower.includes("what is your phone") ||
      lastBotTextLower.includes("please enter your mobile") ||
      lastBotTextLower.includes("enter phone number") ||
      lastBotTextLower.includes("provide phone number")
    ) &&
    !lastBotTextLower.includes("tell me your age") &&
    !lastBotTextLower.includes("need your age") &&
    !lastBotTextLower.includes("your age") &&
    !lastBotTextLower.includes("• age") &&
    !lastBotTextLower.includes("• gender") &&
    !lastBotTextLower.includes("• full name") &&
    !lastBotTextLower.includes("• reason")
  ) : false;





  const filteredCountries = COUNTRY_CODES.filter(c =>
    c.name.toLowerCase().includes(countrySearchQuery.toLowerCase()) ||
    c.code.includes(countrySearchQuery) ||
    c.iso.toLowerCase().includes(countrySearchQuery.toLowerCase())
  );



  const [isBookingFlowActive, setIsBookingFlowActive] = useState(false);
  const [showDoctorsDirectory, setShowDoctorsDirectory] = useState(false);
  const [selectedSpecialtyFilter, setSelectedSpecialtyFilter] = useState("All");
  const [isDoctorsPanelOpen, setIsDoctorsPanelOpen] = useState(true);
  const [showMapPanel, setShowMapPanel] = useState(false);
  const [isMapPanelOpen, setIsMapPanelOpen] = useState(false);
  const [doctorsList, setDoctorsList] = useState<any[]>(DOCTORS_DATABASE);

  useEffect(() => {
    async function fetchRealDoctors() {
      try {
        const res = await fetch(`${API_BASE_URL}/doctors`);
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            const mapped = data.map((d: any) => ({
              id: d.id,
              name: d.full_name,
              specialty: d.specialty,
              gender: d.gender || "Unspecified",
              fee: `${d.consultation_fee} PKR`,
              rating: `${d.rating || 5.0} (${d.review_count || 0}+ reviews)`,
              availability: "Available for booking",
              image: d.photo || (d.gender === "Female" ? "/images/doctors/doctor_female.png" : "/images/doctors/doctor_male.png"),
              bio: d.bio || `${d.specialty} Specialist`
            }));
            setDoctorsList(mapped);
          }
        }
      } catch (err) {
        console.warn("Could not fetch real-time doctors for chatbot side panel:", err);
      }
    }
    fetchRealDoctors();
  }, []);

  const specialties = ["All", ...Array.from(new Set(doctorsList.map((d) => d.specialty)))];

  const lastUserMsgText = messages.filter(m => m.sender === "user").slice(-1)[0]?.text.toLowerCase() || "";
  const lastBotMsgText = messages.filter(m => m.sender === "bot").slice(-1)[0]?.text.toLowerCase() || "";

  const filteredDoctors = (selectedSpecialtyFilter === "All"
    ? doctorsList
    : doctorsList.filter((d) => d.specialty.toLowerCase() === selectedSpecialtyFilter.toLowerCase())
  ).slice().sort((a, b) => {
    const specA = a.specialty.toLowerCase();
    const specB = b.specialty.toLowerCase();
    const nameA = a.name.toLowerCase().replace("dr. ", "");
    const nameB = b.name.toLowerCase().replace("dr. ", "");
    
    const isARelevant = lastUserMsgText.includes(specA) || lastBotMsgText.includes(specA) || lastUserMsgText.includes(nameA) || lastBotMsgText.includes(nameA);
    const isBRelevant = lastUserMsgText.includes(specB) || lastBotMsgText.includes(specB) || lastUserMsgText.includes(nameB) || lastBotMsgText.includes(nameB);
    
    if (isARelevant && !isBRelevant) return -1;
    if (!isARelevant && isBRelevant) return 1;

    const rA = parseFloat(a.rating.split(" ")[0]) || 0;
    const rB = parseFloat(b.rating.split(" ")[0]) || 0;
    return rB - rA;
  });



  const pathname = usePathname();
  const router = useRouter();
  const messagesEndRef = useRef<HTMLDivElement>(null);


  // Check 6-hour expiration on client mount
  useEffect(() => {
    const cookieHistory = getCookie("lumina_chat_history");
    const storedTimestamp = localStorage.getItem("lumina_chat_timestamp");
    const storedLocale = getCookie("lumina_chat_locale");
    const now = Date.now();

    const isExpired = !storedTimestamp || (now - parseInt(storedTimestamp, 10) > SIX_HOURS_MS);
    const localeChanged = storedLocale !== locale;

    if (localeChanged || isExpired) {
      resetFreshSession(now);
      setCookie("lumina_chat_locale", locale, SIX_HOURS_SEC);
      return;
    }

    if (cookieHistory) {
      try {
        const parsed = JSON.parse(cookieHistory);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setMessages(parsed);
        } else {
          resetFreshSession(now);
        }
      } catch (e) {
        resetFreshSession(now);
      }
    } else {
      resetFreshSession(now);
    }

    const cookieReplies = getCookie("lumina_quick_replies");
    if (cookieReplies && !isExpired && !localeChanged) {
      try {
        setQuickReplies(JSON.parse(cookieReplies));
      } catch (e) {
        setQuickReplies(DEFAULT_QUICK_REPLIES);
      }
    }
  }, [locale]);

  const resetFreshSession = (timestampMs: number) => {
    setMessages([]); // Empty session initially to trigger clean welcome hero screen
    setQuickReplies(DEFAULT_QUICK_REPLIES);
    setCookie("lumina_chat_history", JSON.stringify([]), SIX_HOURS_SEC);
    setCookie("lumina_quick_replies", JSON.stringify(DEFAULT_QUICK_REPLIES), SIX_HOURS_SEC);
    localStorage.setItem("lumina_chat_timestamp", timestampMs.toString());
  };

  // Save history on changes
  useEffect(() => {
    setCookie("lumina_chat_history", JSON.stringify(messages), SIX_HOURS_SEC);
    setCookie("lumina_quick_replies", JSON.stringify(quickReplies), SIX_HOURS_SEC);
    if (!localStorage.getItem("lumina_chat_timestamp")) {
      localStorage.setItem("lumina_chat_timestamp", Date.now().toString());
    }
  }, [messages, quickReplies]);

  // Detect if booking flow is active and if doctors panel should be shown
  useEffect(() => {
    if (messages.length === 0) {
      setIsBookingFlowActive(false);
      setShowDoctorsDirectory(false);
      return;
    }

    // 1. Is booking active?
    const hasBookingTrigger = messages.some(msg => {
      const textLower = msg.text.toLowerCase();
      if (textLower.includes("redirecting you to the confirmation page") || textLower.includes("success! your appointment")) {
        return false;
      }
      return textLower.includes("book appointment") ||
        textLower.includes("appointment request") ||
        textLower.includes("mini appointment form") ||
        textLower.includes("patient name");
    });

    const lastMsg = messages[messages.length - 1];
    const lastBotMsg = messages.filter(m => m.sender === "bot").slice(-1)[0];
    const lastUserMsg = messages.filter(m => m.sender === "user").slice(-1)[0];

    const lastBotText = lastBotMsg ? lastBotMsg.text.toLowerCase() : "";
    const lastUserText = lastUserMsg ? lastUserMsg.text.toLowerCase() : "";

    const isBookingCompleted = lastMsg && lastMsg.sender === "bot" && (lastMsg.isBookingSuccessMsg || lastMsg.text.includes("Success! Your appointment form has been submitted"));

    if (isBookingCompleted) {
      setIsBookingFlowActive(false);
      setShowDoctorsDirectory(false);
      setIsDoctorsPanelOpen(false);
    } else {
      setIsBookingFlowActive(hasBookingTrigger);
    }

    // 2. Should we show doctors list?
    // Trigger when user or bot is talking about doctors OR when at the specialty / doctor selection stages in booking.
    const isDoctorBookingStage =
      lastBotText.includes("preferred doctor") ||
      lastBotText.includes("doctor preference") ||
      lastBotText.includes("prefer a male or female") ||
      lastBotText.includes("doctor's gender") ||
      lastBotText.includes("would you like to see") ||
      lastBotText.includes("works for you") ||
      lastBotText.includes("suggest another") ||
      lastBotText.includes("doctor by name") ||
      lastBotText.includes("specialty") ||
      lastBotText.includes("specialist") ||
      lastBotText.includes("department") ||
      lastBotText.includes("dr.") ||
      lastBotText.includes("recommend") ||
      lastBotText.includes("date and time") ||
      lastBotText.includes("choose a time") ||
      lastBotText.includes("select a date") ||
      lastUserText.includes("headache") ||
      lastUserText.includes("fever") ||
      lastUserText.includes("pain") ||
      lastUserText.includes("cough") ||
      lastUserText.includes("symptom") ||
      lastUserText.includes("reason") ||
      lastUserText.includes("visit") ||
      lastUserText.includes("checkup") ||
      lastUserText.includes("consultation");


    const isChattingAboutDoctors =
      lastUserText.includes("find a doctor") ||
      lastUserText.includes("who is the doctor") ||
      lastUserText.includes("available doctors") ||
      lastUserText.includes("list of doctors") ||
      lastUserText.includes("specialists") ||
      lastUserText.includes("dermatologist") ||
      lastUserText.includes("pediatrician") ||
      lastUserText.includes("cardiologist") ||
      lastUserText.includes("dentist") ||
      lastUserText.includes("neurologist") ||
      lastUserText.includes("doctor");

    const isChattingAboutLocation =
      lastUserText.includes("location") ||
      lastUserText.includes("where") ||
      lastUserText.includes("address") ||
      lastUserText.includes("open map") ||
      lastUserText.includes("show map") ||
      lastUserText.includes("open the map") ||
      lastUserText.includes("open the location") ||
      lastBotText.includes("located at") ||
      lastBotText.includes("map");

    // Automatically expand the panel if we hit a trigger stage
    const shouldShowDocs = !isBookingCompleted && (hasBookingTrigger ? (isDoctorBookingStage || isChattingAboutDoctors) : isChattingAboutDoctors);
    const shouldShowMap = isBookingCompleted || isChattingAboutLocation;


    if (shouldShowMap) {
      setShowMapPanel(true);
      setIsMapPanelOpen(true);
      setIsDoctorsPanelOpen(false);
    } else if (shouldShowDocs) {
      setShowDoctorsDirectory(true);
      setIsDoctorsPanelOpen(true);
      setIsMapPanelOpen(false);
    }


    // Smart Close Panel commands
    const isCloseCommand =
      lastUserText === "close it" ||
      lastUserText === "close" ||
      lastUserText.includes("close map") ||
      lastUserText.includes("hide map") ||
      lastUserText.includes("close panel") ||
      lastUserText.includes("close doctors") ||
      lastUserText.includes("hide doctors") ||
      lastUserText.includes("close directory") ||
      lastUserText.includes("hide directory");

    if (isCloseCommand) {
      setIsMapPanelOpen(false);
      setIsDoctorsPanelOpen(false);
    }
  }, [messages]);

  // Smooth auto-scroll
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isLoading, isOpen]);

  // Lock background scroll when chatbot is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleCloseChatbot = () => {
    if (isDoctorsPanelOpen || isMapPanelOpen) {
      setIsDoctorsPanelOpen(false);
      setIsMapPanelOpen(false);
      setTimeout(() => {
        setIsOpen(false);
      }, 300);
    } else {
      setIsOpen(false);
    }
  };

  if (
    pathname === "/book-appointment/confirmation" ||
    pathname === "/login" ||
    pathname === "/signup"
  ) return null;

  // Local fallback response generator if FastAPI server is offline
  const getLocalFallback = (text: string): { reply: string; quickReplies: string[] } => {
    const cleaned = text.toLowerCase();
    if (cleaned.includes("skin") || cleaned.includes("dermatologist")) {
      return {
        reply: "I recommend consulting a Dermatologist.",
        quickReplies: ["Book Appointment", "Clinic Services"]
      };
    }
    if (cleaned.includes("time") || cleaned.includes("hours")) {
      return {
        reply: "LuminaHealth Clinic is open Monday to Saturday, 9:00 AM – 9:00 PM (Closed on Sundays).",
        quickReplies: ["Book Appointment", "Clinic Location"]
      };
    }
    if (cleaned.includes("location") || cleaned.includes("address") || cleaned.includes("where")) {
      return {
        reply: "We are located at 31.487555, 73.076189 (LuminaHealth Care Center).\n\nGoogle Maps Location: https://maps.app.goo.gl/MRgu6Fdbd9PhaGmu7",
        quickReplies: ["Clinic Timings", "Book Appointment"]
      };
    }
    if (cleaned.includes("fee") || cleaned.includes("price") || cleaned.includes("cost")) {
      return {
        reply: "Our consultation fees are:\n- General Physician: 1,500 PKR\n- Medical Specialists: 2,500 PKR",
        quickReplies: ["Book Appointment", "Find a Doctor"]
      };
    }
    if (cleaned.includes("emergency")) {
      return {
        reply: "For medical emergencies, please call our 24/7 emergency hotline at +92 300 1234567 immediately.",
        quickReplies: ["Clinic Timings", "Book Appointment"]
      };
    }
    return {
      reply: "⚠️ The AI backend server is currently offline. To use the smart appointment booking system, please start your FastAPI backend server on port 8000.",
      quickReplies: []
    };
  };

  const extractAppointmentDetails = (text: string, rawJson?: any): Record<string, string> => {
    if (rawJson && rawJson.details && typeof rawJson.details === "object") {
      return rawJson.details;
    }
    const getMatch = (pattern: RegExp) => {
      const m = text.match(pattern);
      return m ? m[1].trim() : "";
    };
    return {
      name: getMatch(/Full Name:\s*(.*)/i),
      phone: getMatch(/Phone(?: Number)?:\s*(.*)/i),
      age: getMatch(/Age:\s*(.*)/i),
      gender: getMatch(/Gender:\s*(.*)/i),
      doctor: getMatch(/Doctor:\s*(.*)/i),
      specialty: getMatch(/Specialty:\s*(.*)/i),
      symptoms: getMatch(/Reason(?: \/ Symptoms)?:\s*(.*)/i),
      date: getMatch(/Preferred Date:\s*(.*)/i),
      time: getMatch(/Preferred Time:\s*(.*)/i),
    };
  };

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    if (text.toLowerCase().includes("yes, cancel")) {
      const userMessage: Message = {
        id: Math.random().toString(),
        sender: "user",
        text: text,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      };
      const cancelMessage: Message = {
        id: Math.random().toString(),
        sender: "bot",
        text: "Your appointment booking has been cancelled. How else can I help you today?",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      };
      setMessages((prev) => [...prev, userMessage, cancelMessage]);
      setQuickReplies([]);
      setInputValue("");
      return;
    }

    if (text.toLowerCase().includes("no, continue")) {
      const userMessage: Message = {
        id: Math.random().toString(),
        sender: "user",
        text: text,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      };
      const continueMessage: Message = {
        id: Math.random().toString(),
        sender: "bot",
        text: "Great! Please enter your contact phone number to finalize your appointment:",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      };
      setMessages((prev) => [...prev, userMessage, continueMessage]);
      setQuickReplies([]);
      setInputValue("");
      return;
    }

    let textToSend = text.trim();
    if (isAskingPhone && /^\d[\d\s-]{5,}$/.test(textToSend) && !textToSend.startsWith("+")) {
      textToSend = `${selectedCountryCode} ${textToSend}`;
    }


    const userMessage: Message = {
      id: Math.random().toString(),
      sender: "user",
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);
    setQuickReplies([]);

    try {
      console.log("SENDING LOCALE TO BACKEND:", locale);
      const res = await fetch(`${API_BASE_URL}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          message: textToSend,
          history: messages.map((m) => ({
            role: m.sender === "user" ? "user" : "assistant",
            content: m.text
          })),
          locale: locale
        })
      });


      if (res.ok) {
        const data = await res.json();

        let replyText = data.reply;
        let isReviewAction = false;
        let appointmentDetails: Record<string, string> | undefined = undefined;

        // Robust JSON block extraction (supports SHOW_APPOINTMENT_REVIEW or any appointment JSON block)
        let jsonStartIndex = replyText.indexOf('{');
        if (jsonStartIndex !== -1) {
          let braceCount = 0;
          let jsonEndIndex = -1;
          let inString = false;
          let escape = false;

          for (let i = jsonStartIndex; i < replyText.length; i++) {
            const char = replyText[i];
            if (escape) {
              escape = false;
              continue;
            }
            if (char === '\\') {
              escape = true;
              continue;
            }
            if (char === '"') {
              inString = !inString;
              continue;
            }
            if (!inString) {
              if (char === '{') braceCount++;
              else if (char === '}') {
                braceCount--;
                if (braceCount === 0) {
                  jsonEndIndex = i;
                  break;
                }
              }
            }
          }

          if (jsonEndIndex !== -1) {
            const jsonString = replyText.substring(jsonStartIndex, jsonEndIndex + 1);
            try {
              const parsed = JSON.parse(jsonString);
              if (parsed && (parsed.action === "SHOW_APPOINTMENT_REVIEW" || parsed.name || parsed.doctor || parsed.phone || parsed.symptoms || parsed.date)) {
                isReviewAction = true;
                appointmentDetails = extractAppointmentDetails(replyText, parsed);
                replyText = replyText.replace(jsonString, '');
              }
            } catch (e) {
              console.error("Failed to parse JSON string:", jsonString, e);
            }
            replyText = replyText
              .replace(/```json\s*```/gi, '')
              .replace(/```\s*```/gi, '')
              .replace(/```json/gi, '')
              .replace(/```/gi, '')
              .trim();
          }
        }


        const isBookingCardForm = !isReviewAction && (
          text.toLowerCase().includes("book") ||
          text.toLowerCase().includes("appointment") ||
          replyText.toLowerCase().includes("book appointment") ||
          replyText.toLowerCase().includes("appointment details") ||
          replyText.toLowerCase().includes("preferred doctor")
        );

        const botMessage: Message = {
          id: Math.random().toString(),
          sender: "bot",
          text: replyText,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          isReviewAction,
          appointmentDetails,
          isBookingCardForm
        };
        setMessages((prev) => [...prev, botMessage]);
        setQuickReplies(data.quickReplies || []);



      } else {
        throw new Error("API error");
      }
    } catch (error) {
      const fallback = getLocalFallback(text);
      const botMessage: Message = {
        id: Math.random().toString(),
        sender: "bot",
        text: fallback.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      };
      setMessages((prev) => [...prev, botMessage]);
      setQuickReplies(fallback.quickReplies);
    } finally {
      setIsLoading(false);
    }
  };

  return (

    <>
      {/* Expandable Chat Panel */}

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 220 }}
            className="fixed right-0 top-0 bottom-0 h-screen w-full sm:w-[450px] md:w-[500px] lg:w-[45%] bg-transparent z-[70] flex flex-row"
          >
            {/* Side Doctors Directory (Desktop Sidebar) */}
            <AnimatePresence>
              {showDoctorsDirectory && isDoctorsPanelOpen && (
                <motion.div
                  initial={{ x: 120, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: 120, opacity: 0 }}
                  transition={{ type: "spring", damping: 25, stiffness: 200 }}
                  className="absolute right-[100%] top-0 bottom-0 h-full w-[360px] bg-slate-50/98 backdrop-blur-md border-r border-slate-200/80 shadow-2xl hidden md:flex flex-col z-[65] overflow-hidden rounded-none"
                >
                  {/* Header */}
                  <div className="px-5 py-4.5 border-b border-slate-200/60 bg-white flex items-center justify-between shrink-0">
                    <div>
                      <h3 className="text-sm font-extrabold text-slate-900 tracking-tight flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[#2c336b] text-lg font-bold">medical_services</span>
                        Doctors Directory ({filteredDoctors.length}/{doctorsList.length})
                      </h3>
                      <p className="text-[10px] text-slate-500 font-bold mt-0.5">Click any doctor card to select them</p>
                    </div>
                    <button
                      onClick={() => setIsDoctorsPanelOpen(false)}
                      className="text-slate-400 hover:text-slate-600 p-1 hover:bg-slate-100 rounded-none transition-colors cursor-pointer"
                      title="Hide panel"
                    >
                      <span className="material-symbols-outlined text-lg">chevron_right</span>
                    </button>
                  </div>

                  {/* Specialty Filter Chips */}
                  <div className="px-4 py-3 border-b border-slate-200/60 bg-white/60 shrink-0 flex items-center gap-1.5 overflow-x-auto whitespace-nowrap [&::-webkit-scrollbar]:hidden [scrollbar-width:none] [-ms-overflow-style:none]">
                    {specialties.map(spec => (
                      <button
                        key={spec}
                        onClick={() => setSelectedSpecialtyFilter(prev => prev === spec ? "All" : spec)}
                        className={`px-3 py-1.5 rounded-none text-[10px] font-extrabold border transition-all cursor-pointer ${selectedSpecialtyFilter === spec
                          ? "bg-[#2c336b] text-white border-[#2c336b] shadow-xs"
                          : "bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:text-slate-800"
                          }`}
                      >
                        {spec} {spec === "All" ? `(${doctorsList.length})` : ""}
                      </button>
                    ))}
                  </div>


                  {/* Scrollable list */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-3.5 [&::-webkit-scrollbar]:hidden [scrollbar-width:none] [-ms-overflow-style:none]">
                    {filteredDoctors.map(doc => (
                      <div
                        key={doc.id}
                        onClick={() => handleSendMessage(doc.name)}
                        className="bg-white border border-slate-100 p-3.5 rounded-none shadow-2xs hover:shadow-xs hover:border-[#2c336b]/20 transition-all flex gap-3 cursor-pointer group active:scale-[0.98]"
                      >
                        <div className="w-14 h-14 rounded-none overflow-hidden shrink-0 border border-slate-100 bg-slate-50 relative">
                          <img
                            src={doc.image}
                            alt={doc.name}
                            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-200 rounded-none"
                          />
                          <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 border border-white rounded-full"></div>
                        </div>

                        <div className="flex-1 min-w-0">
                          <h4 className="font-extrabold text-xs text-slate-800 group-hover:text-[#2c336b] transition-colors truncate">
                            {doc.name}
                          </h4>
                          <p className="text-[10px] font-bold text-slate-500 mt-0.5 truncate">
                            {doc.specialty} • {doc.gender}
                          </p>

                          <div className="flex items-center gap-2 mt-1.5">
                            <span className="text-[9px] font-bold bg-[#f4df82]/35 text-slate-800 px-1.5 py-0.5 rounded-none flex items-center gap-0.5">
                              <span className="material-symbols-outlined text-[10px] text-amber-500" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                              {doc.rating.split(" ")[0]}
                            </span>
                            <span className="text-[9px] font-bold text-[#2c336b]">{doc.fee}</span>
                          </div>

                          <p className="text-[9px] text-slate-400 font-semibold mt-1.5 flex items-center gap-1.5">
                            <span className="material-symbols-outlined text-[11px]">schedule</span>
                            {doc.availability}
                          </p>
                        </div>
                      </div>
                    ))}
                    {filteredDoctors.length === 0 && (
                      <div className="text-center py-8">
                        <p className="text-xs font-bold text-slate-400">No doctors found in this specialty</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Side Map Panel (Desktop Sidebar) */}
            <AnimatePresence>
              {showMapPanel && isMapPanelOpen && (
                <motion.div
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: 450, opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  transition={{ type: "spring", damping: 25, stiffness: 200 }}
                  className="absolute right-[100%] top-0 bottom-0 h-full bg-slate-50/98 backdrop-blur-md border-r border-slate-200/80 shadow-2xl hidden md:flex flex-col z-[65] overflow-hidden rounded-none"
                >
                  <div className="w-[450px] h-full flex flex-col shrink-0">
                    <div className="px-3.5 py-2.5 border-b border-slate-200/60 bg-white flex items-center justify-between shrink-0">
                      <div>
                        <h3 className="text-sm font-extrabold text-slate-900 tracking-tight flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-[#2c336b] text-lg font-bold">location_on</span>
                          Clinic Location
                        </h3>
                        <p className="text-[10px] text-slate-500 font-bold mt-0.5">31.487555, 73.076189 • LuminaHealth Care Center</p>
                      </div>
                      <div className="flex items-center gap-1">
                        <a
                          href="https://maps.app.goo.gl/MRgu6Fdbd9PhaGmu7"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[10px] font-bold bg-[#2c336b]/10 hover:bg-[#2c336b] text-[#2c336b] hover:text-white px-2 py-1 rounded transition-colors flex items-center gap-1"
                        >
                          <span>Open Maps</span>
                          <span className="material-symbols-outlined text-xs">open_in_new</span>
                        </a>
                        <button
                          onClick={() => setIsMapPanelOpen(false)}
                          className="text-slate-400 hover:text-slate-600 p-1 hover:bg-slate-100 rounded transition-colors cursor-pointer"
                          title="Hide panel"
                        >
                          <span className="material-symbols-outlined text-lg">chevron_right</span>
                        </button>
                      </div>
                    </div>
                    <div className="flex-1 w-full bg-slate-200 relative">
                       <iframe 
                         title="Chatbot Clinic Location Map"
                         src="https://maps.google.com/maps?q=31.487555,73.076189&hl=en&z=16&output=embed" 
                         width="100%" 
                         height="100%" 
                         style={{ border: 0 }} 
                         allowFullScreen={true} 
                         loading="lazy" 
                         referrerPolicy="no-referrer-when-downgrade"
                       ></iframe>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Main Chat Panel Container */}
            <div className="h-full flex-1 flex flex-row overflow-hidden bg-white shadow-2xl relative z-10">
              {/* Left Sidebar inside Chat Panel */}
              <div className="w-14 sm:w-16 bg-slate-50 border-r border-slate-100 flex flex-col justify-between items-center py-6 shrink-0">
                <div className="flex flex-col items-center gap-6 w-full">
                  {/* Top: Clinic Icon */}
                  <div className="w-9 h-9 rounded-xl bg-[#2c336b]/5 flex items-center justify-center text-[#2c336b]">
                    <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>
                      support_agent
                    </span>
                  </div>

                  {/* Middle: Doctors & Map Toggle Icons */}
                  <button
                    onClick={() => {
                      if (isDoctorsPanelOpen) {
                        setIsDoctorsPanelOpen(false);
                      } else {
                        setShowDoctorsDirectory(true);
                        setIsDoctorsPanelOpen(true);
                        setIsMapPanelOpen(false);
                      }
                    }}
                    className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all cursor-pointer active:scale-95 ${isDoctorsPanelOpen
                      ? "bg-[#2c336b] text-white shadow-xs"
                      : "bg-[#2c336b]/5 text-[#2c336b] hover:bg-[#2c336b]/10"
                      }`}
                    title="Toggle Doctors Directory"
                  >
                    <span className="material-symbols-outlined text-lg">groups</span>
                  </button>

                  <button
                    onClick={() => {
                      if (isMapPanelOpen) {
                        setIsMapPanelOpen(false);
                      } else {
                        setShowMapPanel(true);
                        setIsMapPanelOpen(true);
                        setIsDoctorsPanelOpen(false);
                      }
                    }}
                    className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all cursor-pointer active:scale-95 ${isMapPanelOpen
                      ? "bg-[#2c336b] text-white shadow-xs"
                      : "bg-[#2c336b]/5 text-[#2c336b] hover:bg-[#2c336b]/10"
                      }`}
                    title="Toggle Clinic Map"
                  >
                    <span className="material-symbols-outlined text-lg">location_on</span>
                  </button>

                </div>

                {/* Middle-Bottom: Vertically rotated text */}
                <div className="text-[9px] font-extrabold text-slate-400 uppercase tracking-[0.2em] [writing-mode:vertical-lr] rotate-180 select-none pb-2">
                  {t("poweredBy")}
                </div>

                {/* Bottom: Circular Brand Logo/Mark */}
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#2c336b] text-white flex items-center justify-center font-bold text-xs shadow-sm">
                  LH
                </div>
              </div>

              {/* Main Chat Content */}
              <div className="flex-1 h-full flex flex-col min-w-0 bg-white">
                {/* Header */}
                <div className="border-b border-slate-100 px-5 py-4 flex items-center justify-between shrink-0 bg-white">
                  <div className="flex items-center gap-2.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 border border-white animate-pulse"></div>
                    <div>
                      <h3 className="text-sm font-extrabold text-slate-900 leading-tight tracking-tight">{t("headerTitle")}</h3>
                      <p className="text-[10px] text-slate-500 font-bold">{t("headerSubtitle")}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => resetFreshSession(Date.now())}
                      title="Reset conversation"
                      className="text-slate-400 hover:text-[#2c336b] p-1.5 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-lg">refresh</span>
                    </button>
                    <button
                      onClick={handleCloseChatbot}
                      className="text-slate-400 hover:text-slate-600 p-1.5 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer"
                      aria-label="Close chat"
                    >
                      <span className="material-symbols-outlined text-xl">close</span>
                    </button>
                  </div>
                </div>

                {/* Chat Content Body */}
                <div className="flex-1 min-h-0 p-5 overflow-y-auto bg-slate-50/30 flex flex-col gap-4 [&::-webkit-scrollbar]:hidden [scrollbar-width:none] [-ms-overflow-style:none]">

                  {/* Initial Clean Welcome Hero (Shown when session is empty) */}
                  {messages.length === 0 ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                      className="flex-1 flex flex-col justify-start pt-4 pb-4"
                    >
                      <div className="flex flex-col items-center text-center mt-3 mb-6">
                        <div className="w-12 h-12 rounded-2xl bg-[#2c336b]/10 flex items-center justify-center text-[#2c336b] mb-4">
                          <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                            support_agent
                          </span>
                        </div>
                        <h4 className="text-base font-extrabold text-[#2c336b] tracking-tight">{t("welcomeTitle")}</h4>
                        <p className="text-xs text-gray-500 mt-2 max-w-[280px] mx-auto leading-relaxed font-semibold">
                          {t("welcomeSub")}
                        </p>
                      </div>

                      {/* 1-Click Ready Action Cards Grid */}
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        {WELCOME_CARDS.map((card) => (
                          <button
                            key={card.titleKey}
                            onClick={() => handleSendMessage(t(card.titleKey as any))}
                            className={`px-3.5 py-3 rounded-2xl border transition-all text-left group cursor-pointer active:scale-95 flex flex-col justify-between h-[76px] shadow-2xs hover:shadow-xs ${card.bgClass}`}
                          >
                            <div className="flex items-center justify-between w-full">
                              <span className={`material-symbols-outlined text-base ${card.iconClass || 'text-[#2c336b]'}`}>
                                {card.icon}
                              </span>
                              <span className="material-symbols-outlined text-xs opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all text-[#2c336b] shrink-0">
                                arrow_forward
                              </span>
                            </div>
                            <div>
                              <p className="text-[11px] font-extrabold tracking-tight leading-tight">
                                {t(card.titleKey as any)}
                              </p>
                              <p className="text-[9px] opacity-85 font-semibold mt-0.5 line-clamp-1">
                                {t(card.descKey as any)}
                              </p>
                            </div>
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  ) : (
                    /* Active Conversation Thread */
                    messages.map((msg) => (
                      <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, y: 12, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ duration: 0.25, ease: "easeOut" }}
                        className={`flex gap-2.5 items-start max-w-[88%] ${msg.sender === "user" ? "self-end flex-row-reverse" : "self-start"
                          }`}
                      >
                        {msg.sender === "bot" && (
                          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#2c336b] to-[#3d468e] flex items-center justify-center text-white shrink-0 mt-0.5 shadow-xs">
                            <span className="material-symbols-outlined text-sm">support_agent</span>
                          </div>
                        )}
                        <div className="flex flex-col gap-0.5">
                          <div
                            className={`p-3.5 rounded-2xl text-xs sm:text-[13px] leading-relaxed whitespace-pre-line shadow-[0_2px_8px_rgba(0,0,0,0.01)] ${msg.sender === "user"
                              ? "bg-gradient-to-tr from-[#2c336b] to-[#3d468e] text-white font-semibold rounded-tr-none"
                              : "bg-white text-slate-800 border border-slate-100 rounded-tl-none"
                              }`}
                          >
                            {msg.text}
                          </div>







                          {msg.isReviewAction && (
                            <div className="mt-3.5 p-4 bg-gradient-to-br from-white to-[#f3faff] border border-[#2c336b]/10 rounded-2xl shadow-sm space-y-3">
                              <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                                <div className="flex items-center gap-1.5">
                                  <span className="material-symbols-outlined text-[#2c336b] text-base">assignment_turned_in</span>
                                  <h5 className="text-[11px] font-extrabold text-[#2c336b] uppercase tracking-wider">Mini Appointment Form</h5>
                                </div>
                                <div className="flex items-center gap-1.5">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setMessages((prev) =>
                                        prev.map((m) =>
                                          m.id === msg.id ? { ...m, isEditingForm: !m.isEditingForm } : m
                                        )
                                      );
                                    }}
                                    className="px-2 py-0.5 rounded-full bg-slate-100 hover:bg-[#2c336b] text-slate-600 hover:text-white border border-slate-200/80 hover:border-[#2c336b] text-[9px] font-black flex items-center gap-1 transition-all cursor-pointer active:scale-95 shadow-2xs"
                                    title={msg.isEditingForm ? "Cancel editing" : "Edit appointment details"}
                                  >
                                    <span className="material-symbols-outlined text-[11px]">{msg.isEditingForm ? "close" : "edit"}</span>
                                    <span>{msg.isEditingForm ? "Cancel" : "Edit"}</span>
                                  </button>
                                  <span className="text-[9px] font-bold bg-[#2c336b]/10 text-[#2c336b] px-2 py-0.5 rounded-full uppercase tracking-wider">Filled</span>
                                </div>

                              </div>

                              {msg.isEditingForm ? (
                                <div className="space-y-2.5 text-xs pt-1">
                                  <div>
                                    <label className="text-[9px] text-[#2c336b]/80 font-extrabold uppercase block mb-1">Patient Name</label>
                                    <input
                                      type="text"
                                      value={msg.appointmentDetails?.name || ""}
                                      onChange={(e) => {
                                        const val = e.target.value;
                                        setMessages((prev) =>
                                          prev.map((m) =>
                                            m.id === msg.id
                                              ? { ...m, appointmentDetails: { ...m.appointmentDetails, name: val } }
                                              : m
                                          )
                                        );
                                      }}
                                      className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold outline-none focus:border-[#2c336b] text-slate-800 shadow-2xs"
                                      placeholder="Full Name"
                                    />
                                  </div>
                                  <div className="grid grid-cols-2 gap-2">
                                    <div>
                                      <label className="text-[9px] text-[#2c336b]/80 font-extrabold uppercase block mb-1">Phone</label>
                                      <input
                                        type="text"
                                        value={msg.appointmentDetails?.phone || ""}
                                        onChange={(e) => {
                                          const val = e.target.value;
                                          setMessages((prev) =>
                                            prev.map((m) =>
                                              m.id === msg.id
                                                ? { ...m, appointmentDetails: { ...m.appointmentDetails, phone: val } }
                                                : m
                                            )
                                          );
                                        }}
                                        className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold outline-none focus:border-[#2c336b] text-slate-800 shadow-2xs"
                                        placeholder="Phone Number"
                                      />
                                    </div>
                                    <div>
                                      <label className="text-[9px] text-[#2c336b]/80 font-extrabold uppercase block mb-1">Age</label>
                                      <input
                                        type="text"
                                        value={msg.appointmentDetails?.age || ""}
                                        onChange={(e) => {
                                          const val = e.target.value;
                                          setMessages((prev) =>
                                            prev.map((m) =>
                                              m.id === msg.id
                                                ? { ...m, appointmentDetails: { ...m.appointmentDetails, age: val } }
                                                : m
                                            )
                                          );
                                        }}
                                        className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold outline-none focus:border-[#2c336b] text-slate-800 shadow-2xs"
                                        placeholder="Age"
                                      />
                                    </div>
                                  </div>
                                  <div>
                                    <label className="text-[9px] text-[#2c336b]/80 font-extrabold uppercase block mb-1">Doctor / Specialty</label>
                                    <input
                                      type="text"
                                      value={msg.appointmentDetails?.doctor || msg.appointmentDetails?.specialty || ""}
                                      onChange={(e) => {
                                        const val = e.target.value;
                                        setMessages((prev) =>
                                          prev.map((m) =>
                                            m.id === msg.id
                                              ? { ...m, appointmentDetails: { ...m.appointmentDetails, doctor: val } }
                                              : m
                                          )
                                        );
                                      }}
                                      className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold outline-none focus:border-[#2c336b] text-slate-800 shadow-2xs"
                                      placeholder="Doctor Name"
                                    />
                                  </div>
                                  <div className="grid grid-cols-2 gap-2">
                                    <div>
                                      <label className="text-[9px] text-[#2c336b]/80 font-extrabold uppercase block mb-1">Date</label>
                                      <input
                                        type="text"
                                        value={msg.appointmentDetails?.date || ""}
                                        onChange={(e) => {
                                          const val = e.target.value;
                                          setMessages((prev) =>
                                            prev.map((m) =>
                                              m.id === msg.id
                                                ? { ...m, appointmentDetails: { ...m.appointmentDetails, date: val } }
                                                : m
                                            )
                                          );
                                        }}
                                        className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold outline-none focus:border-[#2c336b] text-slate-800 shadow-2xs"
                                        placeholder="Date"
                                      />
                                    </div>
                                    <div>
                                      <label className="text-[9px] text-[#2c336b]/80 font-extrabold uppercase block mb-1">Time</label>
                                      <input
                                        type="text"
                                        value={msg.appointmentDetails?.time || ""}
                                        onChange={(e) => {
                                          const val = e.target.value;
                                          setMessages((prev) =>
                                            prev.map((m) =>
                                              m.id === msg.id
                                                ? { ...m, appointmentDetails: { ...m.appointmentDetails, time: val } }
                                                : m
                                            )
                                          );
                                        }}
                                        className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold outline-none focus:border-[#2c336b] text-slate-800 shadow-2xs"
                                        placeholder="Time"
                                      />
                                    </div>
                                  </div>
                                  <div>
                                    <label className="text-[9px] text-[#2c336b]/80 font-extrabold uppercase block mb-1">Reason / Symptoms</label>
                                    <input
                                      type="text"
                                      value={msg.appointmentDetails?.symptoms || ""}
                                      onChange={(e) => {
                                        const val = e.target.value;
                                        setMessages((prev) =>
                                          prev.map((m) =>
                                            m.id === msg.id
                                              ? { ...m, appointmentDetails: { ...m.appointmentDetails, symptoms: val } }
                                              : m
                                          )
                                        );
                                      }}
                                      className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold outline-none focus:border-[#2c336b] text-slate-800 shadow-2xs"
                                      placeholder="Reason / Symptoms"
                                    />
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setMessages((prev) =>
                                        prev.map((m) =>
                                          m.id === msg.id ? { ...m, isEditingForm: false } : m
                                        )
                                      );
                                    }}
                                    className="w-full mt-2 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer active:scale-95"
                                  >
                                    <span className="material-symbols-outlined text-base">check_circle</span>
                                    Save Changes
                                  </button>
                                </div>
                              ) : (
                                /* Form Field Summary Cards */
                                <div className="grid grid-cols-2 gap-2 text-xs">
                                  <div className="bg-white p-2.5 rounded-xl border border-slate-100 shadow-2xs">
                                    <span className="text-[9px] text-[#2c336b]/60 font-bold block uppercase tracking-wider">Patient Name</span>
                                    <p className="font-extrabold text-slate-800 text-[11px] truncate mt-0.5">{msg.appointmentDetails?.name || "Provided"}</p>
                                  </div>
                                  <div className="bg-white p-2.5 rounded-xl border border-slate-100 shadow-2xs">
                                    <span className="text-[9px] text-[#2c336b]/60 font-bold block uppercase tracking-wider">Phone</span>
                                    <p className="font-extrabold text-slate-800 text-[11px] truncate mt-0.5">{msg.appointmentDetails?.phone || "Provided"}</p>
                                  </div>
                                  <div className="bg-white p-2.5 rounded-xl border border-slate-100 shadow-2xs">
                                    <span className="text-[9px] text-[#2c336b]/60 font-bold block uppercase tracking-wider">Doctor / Specialty</span>
                                    <p className="font-extrabold text-slate-800 text-[11px] truncate mt-0.5">{msg.appointmentDetails?.doctor || msg.appointmentDetails?.specialty || "Specialist"}</p>
                                  </div>
                                  <div className="bg-white p-2.5 rounded-xl border border-slate-100 shadow-2xs">
                                    <span className="text-[9px] text-[#2c336b]/60 font-bold block uppercase tracking-wider">Date & Time</span>
                                    <p className="font-extrabold text-slate-800 text-[11px] truncate mt-0.5">
                                      {msg.appointmentDetails?.date || "Selected"} {msg.appointmentDetails?.time ? `(${msg.appointmentDetails?.time})` : ""}
                                    </p>
                                  </div>
                                  {(msg.appointmentDetails?.symptoms || msg.appointmentDetails?.age) && (
                                    <div className="col-span-2 bg-white p-2.5 rounded-xl border border-slate-100 shadow-2xs">
                                      <span className="text-[9px] text-[#2c336b]/60 font-bold block uppercase tracking-wider">Age / Reason</span>
                                      <p className="font-extrabold text-slate-800 text-[11px] truncate mt-0.5">
                                        {msg.appointmentDetails?.age ? `Age: ${msg.appointmentDetails.age} • ` : ""}{msg.appointmentDetails?.symptoms || "Consultation"}
                                      </p>
                                    </div>
                                  )}
                                </div>
                              )}


                              {/* Form Action Buttons: Submit & Decline */}
                              <div className="flex gap-2 pt-1.5 border-t border-slate-100 mt-1">
                                <button
                                  onClick={() => {
                                    setMessages((prev) =>
                                      prev.map((m) =>
                                        m.id === msg.id ? { ...m, isReviewAction: false, isSubmitted: true } : m
                                      )
                                    );
                                    setMessages((prev) => [
                                      ...prev,
                                      {
                                        id: Math.random().toString(),
                                        sender: "user",
                                        text: `✅ ${t("submitApptBtn")}`,
                                        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                                      },
                                      {
                                        id: Math.random().toString(),
                                        sender: "bot",
                                        text: t("apptSuccessMsg"),
                                        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                                        isBookingSuccessMsg: true
                                      }
                                    ]);
                                    setQuickReplies([]);
                                    setIsLoading(false);

                                    // Build query params for redirection
                                    const name = msg.appointmentDetails?.name || "";
                                    const phone = msg.appointmentDetails?.phone || "";
                                    const service = msg.appointmentDetails?.specialty || msg.appointmentDetails?.doctor || "General Consultation";
                                    const doctor = msg.appointmentDetails?.doctor || "Any Available Doctor";
                                    const date = msg.appointmentDetails?.date || new Date().toISOString().split('T')[0];
                                    const time = msg.appointmentDetails?.time || "10:00 AM";

                                    const query = new URLSearchParams({
                                      name,
                                      phone,
                                      service,
                                      doctor,
                                      date,
                                      time
                                    });

                                    setTimeout(() => {
                                      router.push(`/book-appointment/confirmation?${query.toString()}`);
                                      setIsOpen(false);
                                    }, 2200);
                                  }}
                                  className="flex-1 py-2.5 px-3 rounded-xl bg-[#2c336b] hover:bg-[#3d468e] text-white font-extrabold text-xs shadow-sm transition-all flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer"
                                >
                                  <span className="material-symbols-outlined text-base">check_circle</span>
                                  Submit
                                </button>
                                <button
                                  onClick={() => {
                                    setMessages((prev) =>
                                      prev.map((m) =>
                                        m.id === msg.id ? { ...m, isReviewAction: false, isCancelled: true } : m
                                      )
                                    );
                                    const userMsg: Message = {
                                      id: Math.random().toString(),
                                      sender: "user",
                                      text: "❌ Appointment Booking Declined",
                                      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                                    };
                                    const botMsg: Message = {
                                      id: Math.random().toString(),
                                      sender: "bot",
                                      text: "Your appointment process has been cancelled and reset. How else can I assist you today?",
                                      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                                    };
                                    setMessages((prev) => [...prev, userMsg, botMsg]);
                                    setQuickReplies([]);
                                  }}
                                  className="px-3.5 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 hover:text-rose-600 border border-slate-200 font-extrabold text-xs transition-all flex items-center justify-center gap-1 active:scale-95 cursor-pointer"
                                >
                                  <span className="material-symbols-outlined text-base">cancel</span>
                                  Decline
                                </button>
                              </div>
                            </div>
                          )}

                          {msg.isSubmitted && (
                            <div className="mt-2.5 px-3.5 py-2.5 bg-emerald-50 border border-emerald-200/80 rounded-xl flex items-center gap-2 text-emerald-800 text-xs font-extrabold shadow-2xs">
                              <span className="material-symbols-outlined text-base text-emerald-600">check_circle</span>
                              <span>✅ Appointment Form Submitted & Confirmed!</span>
                            </div>
                          )}

                          {msg.isCancelled && (
                            <div className="mt-2.5 px-3 py-2 bg-rose-50 border border-rose-200/80 rounded-xl flex items-center gap-1.5 text-rose-700 text-xs font-bold shadow-2xs">
                              <span className="material-symbols-outlined text-base text-rose-600">cancel</span>
                              <span>Appointment Booking Cancelled</span>
                            </div>
                          )}



                          <span className={`text-[9px] text-slate-400 font-semibold px-1 mt-1 ${msg.sender === "user" ? "text-right" : "text-left"
                            }`}>
                            {msg.timestamp}
                          </span>
                        </div>
                      </motion.div>
                    ))
                  )}

                  {/* Animated Wave Typing Indicator */}
                  {isLoading && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex gap-2.5 items-start max-w-[86%]"
                    >
                      <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#2c336b] to-[#3d468e] flex items-center justify-center text-white shrink-0 mt-0.5 shadow-xs animate-pulse">
                        <span className="material-symbols-outlined text-sm">support_agent</span>
                      </div>
                      <div className="bg-white p-3.5 rounded-2xl rounded-tl-none border border-slate-100 shadow-[0_2px_8px_rgba(0,0,0,0.01)] flex gap-1.5 items-center">
                        <span className="w-1.5 h-1.5 bg-[#2c336b] rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></span>
                        <span className="w-1.5 h-1.5 bg-[#2c336b] rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></span>
                        <span className="w-1.5 h-1.5 bg-[#2c336b] rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></span>
                      </div>
                    </motion.div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                {/* Quick Reply Chips */}
                {quickReplies.length > 0 && messages.length > 0 && (
                  <div className="px-4 py-3 bg-slate-50 border-t border-slate-100 flex items-center gap-2 overflow-x-auto whitespace-nowrap shrink-0 [&::-webkit-scrollbar]:hidden [scrollbar-width:none] [-ms-overflow-style:none]">
                    {quickReplies.map((reply) => (
                      <button
                        key={reply}
                        onClick={() => handleSendMessage(reply)}
                        className="inline-flex items-center shrink-0 px-4 py-2 rounded-full bg-white text-slate-700 hover:bg-[#2c336b] hover:text-white hover:border-[#2c336b] border border-slate-200 text-xs font-semibold shadow-2xs transition-all duration-200 cursor-pointer active:scale-95"
                      >
                        {reply}
                      </button>
                    ))}
                  </div>
                )}

                {/* Footer Input Form */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendMessage(inputValue);
                  }}
                  className="p-4 bg-white border-t border-slate-100 flex gap-2 shrink-0"
                >
                  <div className="relative flex-1 flex items-center bg-slate-50 border border-slate-200/60 rounded-2xl focus-within:border-[#2c336b] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#2c336b]/5 transition-all pr-1.5">

                    {isAskingPhone && (
                      <div className="relative shrink-0 border-r border-slate-200/80">
                        <button
                          type="button"
                          onClick={() => setIsCountryDropdownOpen(!isCountryDropdownOpen)}
                          className="px-3 py-3.5 flex items-center gap-1.5 bg-slate-100/90 text-slate-800 font-extrabold text-xs cursor-pointer hover:bg-slate-200/70 transition-colors select-none"
                        >
                          <span className="material-symbols-outlined text-sm text-[#2c336b] font-bold">call</span>
                          <span>{selectedCountryCode}</span>
                          <span className="material-symbols-outlined text-xs text-slate-500">arrow_drop_down</span>
                        </button>

                        {isCountryDropdownOpen && (
                          <div className="absolute bottom-full left-0 mb-2 w-64 bg-white border border-slate-200 rounded-2xl shadow-2xl z-[120] p-2.5 flex flex-col gap-2">
                            <div className="relative flex items-center">
                              <span className="material-symbols-outlined absolute left-2.5 text-slate-400 text-sm">search</span>
                              <input
                                type="text"
                                value={countrySearchQuery}
                                onChange={(e) => setCountrySearchQuery(e.target.value)}
                                placeholder="Search country or code (+92)..."
                                className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#2c336b] text-slate-800 font-medium"
                                autoFocus
                              />
                            </div>
                            <div className="max-h-48 overflow-y-auto space-y-0.5 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-slate-200">
                              {filteredCountries.map((c) => (
                                <button
                                  key={c.code + c.iso}
                                  type="button"
                                  onClick={() => {
                                    setSelectedCountryCode(c.code);
                                    setIsCountryDropdownOpen(false);
                                    setCountrySearchQuery("");
                                  }}
                                  className={`w-full text-left px-2.5 py-1.5 text-xs rounded-lg flex items-center justify-between hover:bg-slate-100 transition-colors cursor-pointer ${selectedCountryCode === c.code ? "bg-[#2c336b]/10 text-[#2c336b] font-bold" : "text-slate-700 font-medium"}`}
                                >
                                  <span>{c.name}</span>
                                  <span className="font-mono text-[11px] text-slate-500 font-bold">{c.code}</span>
                                </button>
                              ))}
                              {filteredCountries.length === 0 && countrySearchQuery.trim() && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    const custom = countrySearchQuery.startsWith("+") ? countrySearchQuery : `+${countrySearchQuery}`;
                                    setSelectedCountryCode(custom);
                                    setIsCountryDropdownOpen(false);
                                    setCountrySearchQuery("");
                                  }}
                                  className="w-full text-left px-2.5 py-2 text-xs rounded-lg bg-emerald-50 text-emerald-700 font-bold hover:bg-emerald-100 transition-colors cursor-pointer"
                                >
                                  Use code "{countrySearchQuery.startsWith("+") ? countrySearchQuery : `+${countrySearchQuery}`}"
                                </button>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    )}


                    <input
                      type={isAskingPhone ? "tel" : "text"}
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder={isAskingPhone ? "e.g. 309 7812684" : t("inputPlaceholder")}
                      className="flex-1 px-4 py-3 bg-transparent border-none outline-none text-xs sm:text-[13px] text-slate-800 font-semibold placeholder-slate-400"
                    />

                    {isAskingPhone && (
                      <button
                        type="button"
                        onClick={() => {
                          const botMsg: Message = {
                            id: Math.random().toString(),
                            sender: "bot",
                            text: "Are you sure you want to cancel your appointment booking?",
                            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                          };
                          setMessages((prev) => [...prev, botMsg]);
                          setQuickReplies(["Yes, Cancel Booking", "No, Continue Booking"]);
                        }}
                        className="w-8 h-8 rounded-lg bg-rose-50 border border-rose-200 text-rose-600 hover:bg-rose-100 flex items-center justify-center transition-all cursor-pointer shrink-0 shadow-2xs mr-1 active:scale-95"
                        title="Cancel Appointment Booking"
                      >
                        <span className="material-symbols-outlined text-base font-extrabold">close</span>
                      </button>
                    )}

                    <button
                      type="submit"
                      disabled={isAskingPhone ? (!isPhoneNumberValidForCountry(inputValue, selectedCountryCode) || isLoading) : (!inputValue.trim() || isLoading)}
                      aria-label="Send message"
                      className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
                        (isAskingPhone ? isPhoneNumberValidForCountry(inputValue, selectedCountryCode) : inputValue.trim()) && !isLoading
                          ? "bg-[#2c336b] text-white hover:bg-[#3d468e] active:scale-95 shadow-sm"
                          : "bg-slate-100 text-slate-400 cursor-not-allowed opacity-60"
                      }`}
                    >
                      <span className="material-symbols-outlined text-lg">send</span>
                    </button>

                  </div>
                </form>

              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Doctors Directory (Bottom Sheet Drawer) */}
      <AnimatePresence>
        {isOpen && showDoctorsDirectory && isDoctorsPanelOpen && (
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed bottom-0 left-0 right-0 h-[65vh] bg-white rounded-none z-[80] shadow-[0_-8px_35px_rgba(0,0,0,0.15)] md:hidden flex flex-col overflow-hidden"
          >
            {/* Grab handle for sheet drawer */}
            <div className="w-12 h-1 bg-slate-200 rounded-none mx-auto my-3 shrink-0"></div>

            {/* Header */}
            <div className="px-5 pb-3 flex items-center justify-between shrink-0">
              <div>
                <h3 className="text-sm font-extrabold text-slate-900 tracking-tight flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[#2c336b] text-lg font-bold">medical_services</span>
                  Doctors Directory
                </h3>
                <p className="text-[10px] text-slate-500 font-bold">Tap a doctor card to select them</p>
              </div>
              <button
                onClick={() => setIsDoctorsPanelOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1.5 hover:bg-slate-100 rounded-none transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-xl">close</span>
              </button>
            </div>

            {/* Specialty Filter Chips */}
            <div className="px-4 py-2 bg-slate-50/50 shrink-0 flex items-center gap-1.5 overflow-x-auto whitespace-nowrap [&::-webkit-scrollbar]:hidden [scrollbar-width:none] [-ms-overflow-style:none]">
              {specialties.map(spec => (
                <button
                  key={spec}
                  onClick={() => setSelectedSpecialtyFilter(spec)}
                  className={`px-3 py-1.5 rounded-none text-[10px] font-extrabold border transition-all cursor-pointer ${selectedSpecialtyFilter === spec
                    ? "bg-[#2c336b] text-white border-[#2c336b] shadow-xs"
                    : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
                    }`}
                >
                  {spec}
                </button>
              ))}
            </div>

            {/* Scrollable List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-slate-50/20 [&::-webkit-scrollbar]:hidden [scrollbar-width:none] [-ms-overflow-style:none]">
              {filteredDoctors.map(doc => (
                <div
                  key={doc.id}
                  onClick={() => {
                    handleSendMessage(doc.name);
                    setIsDoctorsPanelOpen(false); // Close drawer after selection on mobile
                  }}
                  className="bg-white border border-slate-100 p-3.5 rounded-none shadow-2xs hover:shadow-xs hover:border-[#2c336b]/20 transition-all flex gap-3 active:scale-[0.98]"
                >
                  <div className="w-14 h-14 rounded-none overflow-hidden shrink-0 border border-slate-100 bg-slate-50 relative">
                    <img
                      src={doc.image}
                      alt={doc.name}
                      className="w-full h-full object-cover object-center rounded-none"
                    />
                    <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 border border-white rounded-full animate-pulse"></div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4 className="font-extrabold text-xs text-slate-800 truncate">
                      {doc.name}
                    </h4>
                    <p className="text-[10px] font-bold text-slate-500 mt-0.5 truncate">
                      {doc.specialty} • {doc.gender}
                    </p>

                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="text-[9px] font-bold bg-[#f4df82]/35 text-slate-800 px-1.5 py-0.5 rounded-none flex items-center gap-0.5">
                        <span className="material-symbols-outlined text-[10px] text-amber-500" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                        {doc.rating.split(" ")[0]}
                      </span>
                      <span className="text-[9px] font-bold text-[#2c336b]">{doc.fee}</span>
                    </div>

                    <p className="text-[9px] text-slate-400 font-semibold mt-1.5 flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[11px]">schedule</span>
                      {doc.availability}
                    </p>
                  </div>
                </div>
              ))}
              {filteredDoctors.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-xs font-bold text-slate-400">No doctors found in this specialty</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Persistent Animated Floating Trigger Button (Vertical Pill style) */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            transition={{ type: "spring", damping: 20, stiffness: 200 }}
            onClick={() => setIsOpen(true)}
            className="fixed right-0 top-1/2 -translate-y-1/2 z-[60] flex flex-col items-center gap-3.5 py-6 px-3 bg-gradient-to-b from-[#2c336b] to-[#3d468e] text-white border-l border-y border-white/20 rounded-l-3xl shadow-[0_4px_25px_rgba(44,51,107,0.3)] cursor-pointer select-none active:scale-95 transition-all duration-200 group hover:pr-4"
          >
            {/* Vertical rotated text */}
            <div className="font-extrabold tracking-[0.15em] text-[10px] uppercase [writing-mode:vertical-lr] rotate-180 select-none pb-1.5 text-white/90 group-hover:text-white whitespace-nowrap">
              {t("floatingTrigger")}
            </div>

            {/* Circle icon at bottom */}
            <div className="w-8 h-8 rounded-full bg-white text-[#2c336b] flex items-center justify-center shadow-md shrink-0 relative group-hover:scale-105 transition-transform duration-200">
              <span className="material-symbols-outlined text-base font-bold">support_agent</span>
              <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 rounded-full border border-white animate-pulse"></span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
