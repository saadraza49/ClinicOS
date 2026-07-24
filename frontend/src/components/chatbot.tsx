 "use client";

import { useState, useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

interface Message {
  id: string;
  sender: "user" | "bot";
  text: string;
  timestamp: string;
  isReviewAction?: boolean;
  appointmentDetails?: Record<string, string>;
}

const DEFAULT_QUICK_REPLIES = [
  "📅 Book Appointment",
  "👨‍⚕️ Find a Doctor",
  "🩺 Clinic Services",
  "⏰ Clinic Timings",
  "📍 Clinic Location",
  "💳 Consultation Fee",
  "📞 Emergency Contact",
  "💬 Ask Anything"
];

const WELCOME_CARDS = [
  { 
    icon: "calendar_month", 
    title: "Book Appointment", 
    desc: "Schedule a specialist", 
    text: "📅 Book Appointment",
    bgClass: "bg-[#eecbd8]/35 hover:bg-[#eecbd8]/65 border-[#eecbd8]/40 text-[#2c336b]",
    iconClass: "text-[#2c336b]"
  },
  { 
    icon: "stethoscope", 
    title: "Find a Doctor", 
    desc: "Match your symptoms", 
    text: "👨‍⚕️ Find a Doctor",
    bgClass: "bg-[#f4df82]/35 hover:bg-[#f4df82]/65 border-[#f4df82]/40 text-[#2c336b]",
    iconClass: "text-[#2c336b]"
  },
  { 
    icon: "medical_services", 
    title: "Clinic Services", 
    desc: "Explore specialties", 
    text: "🩺 Clinic Services",
    bgClass: "bg-[#bce4cd]/35 hover:bg-[#bce4cd]/65 border-[#bce4cd]/40 text-[#2c336b]",
    iconClass: "text-[#2c336b]"
  },
  { 
    icon: "schedule", 
    title: "Clinic Timings", 
    desc: "Mon - Sat (9am - 9pm)", 
    text: "⏰ Clinic Timings",
    bgClass: "bg-[#a9c7fb]/35 hover:bg-[#a9c7fb]/65 border-[#a9c7fb]/40 text-[#2c336b]",
    iconClass: "text-[#2c336b]"
  },
  { 
    icon: "payments", 
    title: "Consultation Fee", 
    desc: "View pricing details", 
    text: "💳 Consultation Fee",
    bgClass: "bg-[#f3d2de]/35 hover:bg-[#f3d2de]/65 border-[#f3d2de]/40 text-[#2c336b]",
    iconClass: "text-[#2c336b]"
  },
  { 
    icon: "call", 
    title: "Emergency Line", 
    desc: "24/7 hotline care", 
    text: "📞 Emergency Contact",
    bgClass: "bg-red-50/60 hover:bg-red-100/70 border-red-100 text-red-700",
    iconClass: "text-red-600"
  }
];

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

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
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [quickReplies, setQuickReplies] = useState<string[]>(DEFAULT_QUICK_REPLIES);

  const pathname = usePathname();
  const router = useRouter();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Check 6-hour expiration on client mount
  useEffect(() => {
    const cookieHistory = getCookie("lumina_chat_history");
    const storedTimestamp = localStorage.getItem("lumina_chat_timestamp");
    const now = Date.now();

    const isExpired = !storedTimestamp || (now - parseInt(storedTimestamp, 10) > SIX_HOURS_MS);

    if (cookieHistory && !isExpired) {
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
    if (cookieReplies && !isExpired) {
      try {
        setQuickReplies(JSON.parse(cookieReplies));
      } catch (e) {
        setQuickReplies(DEFAULT_QUICK_REPLIES);
      }
    }
  }, []);

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
    if (cleaned.includes("location") || cleaned.includes("address")) {
      return {
        reply: "We are located at 123 Healing Way, Wellness District, CA 90210.",
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

    const userMessage: Message = {
      id: Math.random().toString(),
      sender: "user",
      text: text,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);
    setQuickReplies([]);

    try {
      const res = await fetch(`${API_BASE_URL}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          message: text,
          history: messages.map((m) => ({
            role: m.sender === "user" ? "user" : "assistant",
            content: m.text
          }))
        })
      });

      if (res.ok) {
        const data = await res.json();
        
        let replyText = data.reply;
        let isReviewAction = false;
        let appointmentDetails: Record<string, string> | undefined = undefined;
        
        // Find the index of the review action trigger in the response text
        const triggerIndex = replyText.indexOf('"SHOW_APPOINTMENT_REVIEW"');
        if (triggerIndex !== -1) {
          // Look backwards to find the opening brace '{' of the JSON block
          let jsonStartIndex = -1;
          for (let i = triggerIndex; i >= 0; i--) {
            if (replyText[i] === '{') {
              jsonStartIndex = i;
              break;
            }
          }

          if (jsonStartIndex !== -1) {
            // Count matching braces from jsonStartIndex to extract full JSON block
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
              isReviewAction = true;
              try {
                const parsed = JSON.parse(jsonString);
                appointmentDetails = extractAppointmentDetails(replyText, parsed);
              } catch (e) {
                console.error("Failed to parse JSON string:", jsonString, e);
                appointmentDetails = extractAppointmentDetails(replyText);
              }
              // Remove the JSON string from the bot's reply text
              replyText = replyText.replace(jsonString, '');
              
              // Clean up any empty markdown code blocks left behind
              replyText = replyText
                .replace(/```json\s*```/gi, '')
                .replace(/```\s*```/gi, '')
                .replace(/```json/gi, '')
                .replace(/```/gi, '')
                .trim();
            }
          }
        }

        const botMessage: Message = {
          id: Math.random().toString(),
          sender: "bot",
          text: replyText,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          isReviewAction,
          appointmentDetails
        };
        setMessages((prev) => [...prev, botMessage]);
        setQuickReplies(data.quickReplies || DEFAULT_QUICK_REPLIES);
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
      {/* Background Dim & Blur Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-slate-900/15 backdrop-blur-[2px] z-[60]"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-[70] flex flex-col items-end max-w-[calc(100vw-2rem)] pointer-events-none">
        <div className="flex flex-col items-end pointer-events-auto">
      {/* Expandable Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9, originX: 1, originY: 1 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="mb-3 w-[calc(100vw-2rem)] sm:w-[390px] md:w-[410px] h-[min(540px,calc(100vh-140px))] bg-white/95 backdrop-blur-md border border-[#2c336b]/10 rounded-[2rem] shadow-[0_12px_40px_rgba(44,51,107,0.18)] overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="bg-gradient-to-tr from-[#2c336b] to-[#3d468e] text-white px-5 py-4 flex items-center justify-between shrink-0 shadow-sm relative overflow-hidden">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-white shrink-0 relative shadow-inner">
                  <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                    support_agent
                  </span>
                  <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 rounded-full border border-[#2c336b] animate-pulse"></span>
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-white leading-tight tracking-tight">WeCare AI Support</h3>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <p className="text-[10px] text-white/70 font-semibold">Online • 24/7 Virtual Assistant</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => resetFreshSession(Date.now())}
                  title="Reset conversation"
                  className="text-white/80 hover:text-white p-1.5 hover:bg-white/10 rounded-xl transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-lg">refresh</span>
                </button>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="text-white/80 hover:text-white p-1.5 hover:bg-white/10 rounded-xl transition-colors cursor-pointer"
                  aria-label="Close chat"
                >
                  <span className="material-symbols-outlined text-xl">close</span>
                </button>
              </div>
            </div>

            {/* Chat Content Body */}
            <div className="flex-1 min-h-0 p-4 overflow-y-auto bg-slate-50/50 flex flex-col gap-3.5 [&::-webkit-scrollbar]:hidden [scrollbar-width:none] [-ms-overflow-style:none]">
              
              {/* Initial Clean Welcome Hero (Shown when session is empty) */}
              {messages.length === 0 ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className="flex-1 flex flex-col justify-start pt-2 pb-4"
                >
                  <div className="flex flex-col items-center text-center mt-3 mb-5">
                    <h4 className="text-base font-extrabold text-[#2c336b] tracking-tight">How can we help today?</h4>
                    <p className="text-[11px] text-gray-500 mt-1.5 max-w-[260px] mx-auto leading-relaxed font-semibold">
                      Ask any health query, explore clinic services, or book an appointment in under 2 minutes.
                    </p>
                  </div>

                  {/* 1-Click Ready Action Cards Grid */}
                  <div className="grid grid-cols-2 gap-1.5">
                    {WELCOME_CARDS.map((card) => (
                      <button
                        key={card.title}
                        onClick={() => handleSendMessage(card.text)}
                        className={`px-2.5 py-2 rounded-2xl border transition-all text-left group cursor-pointer active:scale-95 flex flex-col justify-between h-[68px] shadow-2xs hover:shadow-xs ${card.bgClass}`}
                      >
                        <div className="flex items-center justify-between w-full">
                          <span className={`material-symbols-outlined text-sm ${card.iconClass || 'text-[#2c336b]'}`}>
                            {card.icon}
                          </span>
                          <span className="material-symbols-outlined text-[11px] opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all text-[#2c336b] shrink-0">
                            arrow_forward
                          </span>
                        </div>
                        <div>
                          <p className="text-[10.5px] font-extrabold tracking-tight leading-tight">
                            {card.title}
                          </p>
                          <p className="text-[8.5px] opacity-85 font-semibold mt-0.5 line-clamp-1">
                            {card.desc}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                </motion.div>
              ) : (
                /* Active Conversation Thread with Animated Entrance */
                messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 12, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                    className={`flex gap-2.5 items-start max-w-[86%] ${
                      msg.sender === "user" ? "self-end flex-row-reverse" : "self-start"
                    }`}
                  >
                    {msg.sender === "bot" && (
                      <div className="w-7.5 h-7.5 rounded-lg bg-gradient-to-tr from-[#2c336b] to-[#3d468e] flex items-center justify-center text-white shrink-0 mt-0.5 shadow-xs">
                        <span className="material-symbols-outlined text-sm">support_agent</span>
                      </div>
                    )}
                    <div className="flex flex-col gap-0.5">
                      <div
                        className={`p-3.5 rounded-2xl text-xs sm:text-[13px] leading-relaxed whitespace-pre-line shadow-[0_2px_8px_rgba(0,0,0,0.02)] ${
                          msg.sender === "user"
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
                            <span className="text-[9px] font-bold bg-[#2c336b]/10 text-[#2c336b] px-2.5 py-0.5 rounded-full uppercase tracking-wider">Filled</span>
                          </div>

                          {/* Form Field Summary Cards */}
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

                          {/* Form Action Buttons: Submit & Decline */}
                          <div className="flex gap-2 pt-1.5 border-t border-slate-100 mt-1">
                            <button
                              onClick={() => {
                                setMessages((prev) => [
                                  ...prev,
                                  {
                                    id: Math.random().toString(),
                                    sender: "user",
                                    text: "✅ Submit Appointment Form",
                                    timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                                  },
                                  {
                                    id: Math.random().toString(),
                                    sender: "bot",
                                    text: "🎉 Success! Your appointment form has been submitted and confirmed by WeCare Clinic. Redirecting you to the confirmation page...",
                                    timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                                  }
                                ]);
                                setQuickReplies(["Back to Menu", "Clinic Services"]);
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
                              onClick={() => handleSendMessage("I want to decline and change my appointment details.")}
                              className="px-3.5 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 hover:text-[#2c336b] border border-slate-200 font-extrabold text-xs transition-all flex items-center justify-center gap-1 active:scale-95 cursor-pointer"
                            >
                              <span className="material-symbols-outlined text-base">cancel</span>
                              Decline
                            </button>
                          </div>
                        </div>
                      )}

                      <span className={`text-[9px] text-slate-400 font-semibold px-1 mt-1 ${
                        msg.sender === "user" ? "text-right" : "text-left"
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
                  <div className="w-7.5 h-7.5 rounded-lg bg-gradient-to-tr from-[#2c336b] to-[#3d468e] flex items-center justify-center text-white shrink-0 mt-0.5 shadow-xs animate-pulse">
                    <span className="material-symbols-outlined text-sm">support_agent</span>
                  </div>
                  <div className="bg-white p-3.5 rounded-2xl rounded-tl-none border border-slate-100 shadow-[0_2px_8px_rgba(0,0,0,0.02)] flex gap-1.5 items-center">
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
              <div className="px-3 py-2.5 bg-slate-50 border-t border-slate-100 flex items-center gap-2 overflow-x-auto whitespace-nowrap shrink-0 [&::-webkit-scrollbar]:hidden [scrollbar-width:none] [-ms-overflow-style:none]">
                {quickReplies.map((reply) => (
                  <button
                    key={reply}
                    onClick={() => handleSendMessage(reply)}
                    className="inline-flex items-center shrink-0 px-3.5 py-1.5 rounded-full bg-white text-[#2c336b] hover:bg-[#2c336b] hover:text-white border border-[#2c336b]/10 text-xs font-semibold shadow-2xs transition-all duration-200 cursor-pointer active:scale-95"
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
              className="p-3 bg-white border-t border-slate-100 flex gap-2 shrink-0"
            >
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask about appointments, timings, doctors..."
                className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200/60 rounded-full text-xs sm:text-[13px] outline-none focus:border-[#2c336b] focus:bg-white focus:ring-2 focus:ring-[#2c336b]/5 transition-all text-slate-800 font-semibold"
              />
              <button
                type="submit"
                disabled={!inputValue.trim() || isLoading}
                aria-label="Send message"
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                  inputValue.trim() && !isLoading
                    ? "bg-[#2c336b] text-white hover:bg-[#3d468e] hover:scale-105 active:scale-95 shadow-sm"
                    : "bg-slate-100 text-slate-400 cursor-not-allowed"
                }`}
              >
                <span className="material-symbols-outlined text-lg">send</span>
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Persistent Animated Floating Trigger Button */}
      <motion.button
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.94 }}
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? "Close chat support" : "Open chat support"}
        className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full text-white flex items-center justify-center shadow-xl transition-all duration-300 relative cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2c336b] ${
          isOpen ? "bg-slate-800 hover:bg-slate-900" : "bg-gradient-to-tr from-[#2c336b] to-[#4c549b]"
        }`}
      >
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="material-symbols-outlined text-2xl sm:text-3xl"
        >
          {isOpen ? "close" : "chat_bubble"}
        </motion.span>
        {!isOpen && (
          <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-emerald-400 rounded-full border-2 border-white animate-pulse"></span>
        )}
      </motion.button>
        </div>
      </div>
    </>
  );
}
