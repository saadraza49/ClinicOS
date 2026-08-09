"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { getDoctors, getServices, getAvailableSlots, bookAppointment, DoctorData, ServiceData, TimeSlotData } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import Button from "@/components/button";
import DateSelector from "@/components/date-selector";
import SearchableSelect from "@/components/searchable-select";
import Image from "next/image";
import { useTranslations } from "next-intl";

function BookingForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const doctorQuery = searchParams.get("doctor");
  const serviceQuery = searchParams.get("service");
  const { user } = useAuth();
  const t = useTranslations("BookAppointmentPage");

  const stepperTopRef = useRef<HTMLDivElement>(null);

  // Step 1: Service & Doctor, Step 2: Date & Time, Step 3: Patient Info, Step 4: Pass Review & Confirm
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Dynamic Options from DB
  const [doctorsList, setDoctorsList] = useState<DoctorData[]>([]);
  const [servicesList, setServicesList] = useState<ServiceData[]>([]);
  const [availableSlots, setAvailableSlots] = useState<TimeSlotData[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);

  // Form State
  const [service, setService] = useState("");
  const [doctor, setDoctor] = useState("any");
  const [date, setDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");

  // Loading & Validation States
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [minDate, setMinDate] = useState("");

  // Auto-fill details from logged-in user profile
  useEffect(() => {
    if (user) {
      if (user.full_name && !name) setName(user.full_name);
      if (user.email && !email) setEmail(user.email);
      if (user.phone && !phone) setPhone(user.phone);
    }
  }, [user]);

  // Helper to compute local browser date in YYYY-MM-DD format
  const getLocalTodayStr = (): string => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // Set min date to local today
  useEffect(() => {
    const today = getLocalTodayStr();
    setMinDate(today);
    setDate((prev) => (!prev || prev < today ? today : prev));
  }, []);

  // Fetch initial doctors & services from DB
  useEffect(() => {
    async function initData() {
      try {
        const [docs, svcs] = await Promise.all([getDoctors(), getServices()]);
        setDoctorsList(docs);
        setServicesList(svcs);

        if (serviceQuery) {
          const foundService = svcs.find((s) => s.id === serviceQuery || s.slug === serviceQuery);
          if (foundService) {
            setService(foundService.id);
          }
        }

        if (doctorQuery) {
          const foundDoctor = docs.find((d) => d.id === doctorQuery || d.slug === doctorQuery);
          if (foundDoctor) {
            setDoctor(foundDoctor.id);
            if (!serviceQuery) {
              const matchedService = svcs.find(
                (s) => s.department_id === foundDoctor.department?.id || s.name.toLowerCase().includes(foundDoctor.specialty.toLowerCase())
              );
              if (matchedService) {
                setService(matchedService.id);
              }
            }
          }
        }
      } catch (err) {
        console.error("Failed to fetch booking options from DB:", err);
      }
    }
    initData();
  }, [doctorQuery, serviceQuery]);

  // Fetch available slots from DB whenever date or doctor changes
  useEffect(() => {
    if (!date) return;
    async function loadSlots() {
      setLoadingSlots(true);
      try {
        const slots = await getAvailableSlots(doctor, date);
        setAvailableSlots(slots);
        if (selectedTime && !slots.some((s) => s.value === selectedTime && !s.disabled)) {
          setSelectedTime("");
        }
      } catch (err) {
        console.error("Failed to load time slots:", err);
      } finally {
        setLoadingSlots(false);
      }
    }
    loadSlots();
  }, [doctor, date]);

  // Smooth scroll up to top of stepper whenever currentStep changes
  useEffect(() => {
    if (stepperTopRef.current) {
      const yOffset = -80;
      const y = stepperTopRef.current.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  }, [currentStep]);

  // Validation per step
  const validateStep1 = () => {
    const newErrors: Record<string, string> = {};
    if (!service) newErrors.service = "Please choose a medical service to proceed";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors: Record<string, string> = {};
    if (!date) newErrors.date = "Please select an appointment date";
    if (!selectedTime) newErrors.time = "Please pick a time slot";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep3 = () => {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = "Full name is required";
    if (!email.trim()) {
      newErrors.email = t("emailReq");
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = t("emailInvalid");
    }
    if (!phone.trim()) {
      newErrors.phone = t("phoneReq");
    } else if (!/^\+?[0-9\s-()]{7,15}$/.test(phone)) {
      newErrors.phone = t("phoneInvalid");
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (currentStep === 1 && !validateStep1()) return;
    if (currentStep === 2 && !validateStep2()) return;
    if (currentStep === 3 && !validateStep3()) return;
    setCurrentStep((prev) => Math.min(prev + 1, 4));
  };

  const handlePrevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep1() || !validateStep2() || !validateStep3()) return;

    setIsLoading(true);

    try {
      const createdAppt = await bookAppointment({
        doctor_id: doctor,
        service_id: service || undefined,
        patient_name: name,
        patient_phone: phone,
        patient_email: email,
        appointment_date: date,
        appointment_time: selectedTime,
        reason_for_visit: notes || undefined,
      });

      const selectedServiceObj = servicesList.find((s) => s.id === service);
      const serviceName = selectedServiceObj ? selectedServiceObj.name : "Consultation";

      const selectedDoctorObj = doctorsList.find((d) => d.id === doctor);
      const doctorName = selectedDoctorObj ? selectedDoctorObj.full_name : "Any Available Doctor";

      const selectedTimeSlot = availableSlots.find((t) => t.value === selectedTime);
      const timeLabel = selectedTimeSlot ? selectedTimeSlot.label : selectedTime;

      const query = new URLSearchParams({
        id: createdAppt.id,
        name,
        email,
        phone,
        service: serviceName,
        doctor: doctorName,
        date,
        time: timeLabel,
      });
      router.push(`/book-appointment/confirmation?${query.toString()}`);
    } catch (err: any) {
      console.error("Booking error:", err);
      setErrors({ submit: err.message || "Failed to confirm appointment. Please try again." });
      setIsLoading(false);
    }
  };

  const selectedServiceObj = servicesList.find((s) => s.id === service);
  const selectedDoctorObj = doctorsList.find((d) => d.id === doctor);

  const relevantDoctors = selectedServiceObj && selectedServiceObj.department_id
    ? doctorsList.filter((d) => d.department?.id === selectedServiceObj.department_id || (d as any).department_id === selectedServiceObj.department_id)
    : doctorsList;

  const displayDoctorsList = relevantDoctors.length > 0 ? relevantDoctors : doctorsList;

  const serviceOptions = servicesList.map((s) => ({
    id: s.id,
    label: s.name,
    sublabel: s.short_description || `${s.duration_minutes || 30} mins consultation`,
    price: s.price,
  }));

  const doctorOptions = [
    { id: "any", label: "Any Available Doctor", sublabel: "First available specialist" },
    ...displayDoctorsList.map((d) => ({
      id: d.id,
      label: d.full_name,
      sublabel: `${d.specialty} • ${d.qualifications || "Specialist"} • ★ ${d.rating.toFixed(1)}`,
      price: d.consultation_fee,
    })),
  ];

  // Helper to check if slot time is in the past for selected date
  const isSlotPastLocal = (slotVal: string, targetDateStr: string): boolean => {
    const todayStr = getLocalTodayStr();
    if (targetDateStr < todayStr) return true;
    if (targetDateStr > todayStr) return false;

    const now = new Date();
    try {
      const clean = slotVal.trim().toUpperCase();
      let hours = 0;
      let minutes = 0;

      if (clean.includes("AM") || clean.includes("PM")) {
        const [timePart, ampm] = clean.split(" ");
        const [hStr, mStr] = timePart.split(":");
        hours = parseInt(hStr, 10);
        minutes = parseInt(mStr, 10) || 0;
        if (ampm === "PM" && hours < 12) hours += 12;
        if (ampm === "AM" && hours === 12) hours = 0;
      } else {
        const [hStr, mStr] = clean.split(":");
        hours = parseInt(hStr, 10);
        minutes = parseInt(mStr, 10) || 0;
      }

      const slotDateTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes);
      return slotDateTime <= now;
    } catch (e) {
      return false;
    }
  };

  // Map slots to include real-time past disabling
  const processedAvailableSlots = availableSlots.map((s) => {
    const isPast = isSlotPastLocal(s.value, date);
    return {
      ...s,
      disabled: s.disabled || isPast,
      isPast,
    };
  });

  // Split time slots into Morning & Afternoon/Evening for clean UX
  const morningSlots = processedAvailableSlots.filter((s) => {
    const val = s.value.toLowerCase();
    return val.includes("am") || val.startsWith("09:") || val.startsWith("10:") || val.startsWith("11:");
  });
  const afternoonSlots = processedAvailableSlots.filter((s) => !morningSlots.includes(s));

  const stepsList = [
    { number: 1, title: "Service & Doctor", icon: "medical_services" },
    { number: 2, title: "Date & Time", icon: "calendar_month" },
    { number: 3, title: "Patient Details", icon: "person" },
    { number: 4, title: "Review Pass", icon: "confirmation_number" },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Left Column: Interactive Wizard Steps (8 Cols) */}
      <div className="lg:col-span-8 space-y-6">
        {/* Floating Glassmorphic Stepper Progress Header */}
        <div ref={stepperTopRef} className="bg-white/80 backdrop-blur-md p-4 rounded-3xl border border-outline-variant/15 shadow-sm">
          <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1 no-scrollbar">
            {stepsList.map((step) => {
              const isActive = currentStep === step.number;
              const isCompleted = currentStep > step.number;

              return (
                <div key={step.number} className="flex items-center gap-2 min-w-max">
                  <button
                    type="button"
                    onClick={() => {
                      if (isCompleted) setCurrentStep(step.number);
                    }}
                    disabled={!isCompleted && !isActive}
                    className={`flex items-center gap-2.5 px-3.5 py-2 rounded-2xl transition-all select-none ${
                      isCompleted ? "cursor-pointer hover:bg-primary/10" : isActive ? "bg-primary/10" : "opacity-60 cursor-not-allowed"
                    }`}
                  >
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-extrabold transition-all shadow-2xs ${
                        isCompleted
                          ? "bg-emerald-500 text-white"
                          : isActive
                          ? "bg-primary text-on-primary ring-2 ring-primary/30 scale-105"
                          : "bg-surface-container-high text-on-surface-variant"
                      }`}
                    >
                      {isCompleted ? (
                        <span className="material-symbols-outlined text-base font-bold">check</span>
                      ) : (
                        <span className="material-symbols-outlined text-base">{step.icon}</span>
                      )}
                    </div>
                    <div className="text-left">
                      <p className="text-[10px] uppercase tracking-wider font-extrabold text-on-surface-variant/70 leading-none">
                        Step 0{step.number}
                      </p>
                      <p className={`text-xs font-bold whitespace-nowrap leading-tight mt-0.5 ${isActive ? "text-primary" : "text-on-surface"}`}>
                        {step.title}
                      </p>
                    </div>
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {errors.submit && (
          <div className="bg-error/10 border border-error/30 text-error p-4 rounded-2xl text-xs font-bold flex items-center gap-2">
            <span className="material-symbols-outlined text-base">error</span>
            <span>{errors.submit}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <AnimatePresence mode="wait">
            {/* STEP 1: Custom Searchable Select Dropdowns */}
            {currentStep === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="space-y-6 bg-white p-6 md:p-8 rounded-3xl border border-outline-variant/15 shadow-sm"
              >
                <div className="border-b border-surface-container-high pb-4">
                  <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-extrabold rounded-full">
                    Step 1 of 4
                  </span>
                  <h2 className="text-headline-md font-bold text-on-surface mt-2 flex items-center gap-2">
                    Select Specialty &amp; Doctor
                  </h2>
                  <p className="text-xs text-on-surface-variant mt-1">
                    Search and select from 100+ clinical services and medical specialists.
                  </p>
                </div>

                <div className="space-y-5">
                  {/* Searchable Service Dropdown */}
                  <SearchableSelect
                    label={t("selectService")}
                    options={serviceOptions}
                    value={service}
                    onChange={(val) => {
                      setService(val);
                      if (errors.service) setErrors((prev) => ({ ...prev, service: "" }));
                    }}
                    placeholder={t("searchServicePlaceholder")}
                    error={errors.service}
                    iconName="medical_services"
                  />

                  {/* Searchable Doctor Dropdown */}
                  <SearchableSelect
                    label={t("selectDoctor")}
                    options={doctorOptions}
                    value={doctor}
                    onChange={(val) => setDoctor(val)}
                    placeholder={t("searchDoctorPlaceholder")}
                    iconName="stethoscope"
                  />
                </div>

                <div className="flex justify-end pt-4 border-t border-surface-container-high">
                  <Button
                    type="button"
                    variant="primary"
                    onClick={handleNextStep}
                    disabled={!service}
                    className="text-xs py-3 px-6 font-bold shadow-sm"
                  >
                    Next: Date &amp; Time
                    <span className="material-symbols-outlined text-base">arrow_forward</span>
                  </Button>
                </div>
              </motion.div>
            )}

            {/* STEP 2: Interactive Date & Time Slots */}
            {currentStep === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="space-y-6 bg-white p-6 md:p-8 rounded-3xl border border-outline-variant/15 shadow-sm"
              >
                <div className="border-b border-surface-container-high pb-4">
                  <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-extrabold rounded-full">
                    Step 2 of 4
                  </span>
                  <h2 className="text-headline-md font-bold text-on-surface mt-2 flex items-center gap-2">
                    Pick Preferred Date &amp; Time
                  </h2>
                  <p className="text-xs text-on-surface-variant mt-1">
                    Use our interactive date navigator to select a date, then pick an available slot.
                  </p>
                </div>

                {/* Date Selector */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-on-surface block">
                    1. Select Date <span className="text-error">*</span>
                  </label>
                  <DateSelector
                    value={date}
                    minDate={minDate}
                    onChange={(newDate) => {
                      setDate(newDate);
                      if (errors.date) setErrors((prev) => ({ ...prev, date: "" }));
                    }}
                    error={errors.date}
                  />
                </div>

                {/* Categorized Time Slots */}
                <div className="space-y-4 pt-2">
                  <label className="text-xs font-bold text-on-surface flex justify-between items-center">
                    <span>2. Available Consultation Time Slots <span className="text-error">*</span></span>
                    {loadingSlots && <span className="text-xs text-primary font-medium animate-pulse">Checking DB schedule...</span>}
                  </label>

                  {loadingSlots ? (
                    <div className="p-8 bg-surface-container rounded-3xl text-center text-xs font-medium text-primary animate-pulse flex flex-col items-center">
                      <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin mb-2"></div>
                      Fetching available time slots from doctor schedule...
                    </div>
                  ) : (availableSlots.length === 0 || availableSlots.every((s) => s.disabled)) ? (
                    <div className="p-5 bg-amber-50 border border-amber-200 text-amber-900 rounded-3xl text-xs font-semibold flex items-center gap-3">
                      <span className="material-symbols-outlined text-amber-600 text-3xl select-none">event_busy</span>
                      <div>
                        <p className="font-bold text-amber-950 text-sm">No slots available on {date}.</p>
                        <p className="text-xs text-amber-800 font-normal mt-0.5">Use the arrows above to check another day or pick another doctor.</p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {/* Morning Slots */}
                      {morningSlots.length > 0 && (
                        <div>
                          <span className="text-xs font-bold text-on-surface-variant flex items-center gap-1 mb-2">
                            <span className="material-symbols-outlined text-amber-500 text-sm">wb_sunny</span> Morning Sessions
                          </span>
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                            {morningSlots.map((slot) => (
                              <button
                                key={slot.value}
                                type="button"
                                disabled={slot.disabled}
                                onClick={() => {
                                  setSelectedTime(slot.value);
                                  if (errors.time) setErrors((prev) => ({ ...prev, time: "" }));
                                }}
                                className={`py-2.5 px-3 text-xs font-semibold rounded-2xl border transition-all cursor-pointer ${
                                  slot.disabled
                                    ? "opacity-40 cursor-not-allowed bg-surface-container-low text-on-surface-variant/50 border-outline-variant/30"
                                    : selectedTime === slot.value
                                    ? "bg-primary text-on-primary border-primary shadow-md scale-102 font-bold"
                                    : "border-outline-variant/60 text-on-surface-variant hover:border-primary hover:bg-primary/5"
                                }`}
                              >
                                {slot.label} {slot.disabled ? (slot.isPast ? "(Past)" : "(Booked)") : ""}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Afternoon / Evening Slots */}
                      {afternoonSlots.length > 0 && (
                        <div>
                          <span className="text-xs font-bold text-on-surface-variant flex items-center gap-1 mb-2">
                            <span className="material-symbols-outlined text-indigo-500 text-sm">nights_stay</span> Afternoon &amp; Evening Sessions
                          </span>
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                            {afternoonSlots.map((slot) => (
                              <button
                                key={slot.value}
                                type="button"
                                disabled={slot.disabled}
                                onClick={() => {
                                  setSelectedTime(slot.value);
                                  if (errors.time) setErrors((prev) => ({ ...prev, time: "" }));
                                }}
                                className={`py-2.5 px-3 text-xs font-semibold rounded-2xl border transition-all cursor-pointer ${
                                  slot.disabled
                                    ? "opacity-40 cursor-not-allowed bg-surface-container-low text-on-surface-variant/50 border-outline-variant/30"
                                    : selectedTime === slot.value
                                    ? "bg-primary text-on-primary border-primary shadow-md scale-102 font-bold"
                                    : "border-outline-variant/60 text-on-surface-variant hover:border-primary hover:bg-primary/5"
                                }`}
                              >
                                {slot.label} {slot.disabled ? (slot.isPast ? "(Past)" : "(Booked)") : ""}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                  {errors.time && <p className="text-error text-xs font-semibold mt-1">{errors.time}</p>}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-surface-container-high">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handlePrevStep}
                    className="text-xs py-2.5 px-5"
                  >
                    <span className="material-symbols-outlined text-base">arrow_back</span>
                    Back
                  </Button>
                  <Button
                    type="button"
                    variant="primary"
                    onClick={handleNextStep}
                    disabled={!date || !selectedTime}
                    className="text-xs py-3 px-6 font-bold shadow-sm"
                  >
                    Next: Patient Details
                    <span className="material-symbols-outlined text-base">arrow_forward</span>
                  </Button>
                </div>
              </motion.div>
            )}

            {/* STEP 3: Patient Information */}
            {currentStep === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="space-y-6 bg-white p-6 md:p-8 rounded-3xl border border-outline-variant/15 shadow-sm"
              >
                <div className="border-b border-surface-container-high pb-4">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-extrabold rounded-full">
                      Step 3 of 4
                    </span>
                    {user && (
                      <span className="text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1 rounded-full flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm text-emerald-600">check_circle</span>
                        Pre-filled from Profile
                      </span>
                    )}
                  </div>
                  <h2 className="text-headline-md font-bold text-on-surface mt-2 flex items-center gap-2">
                    Patient Contact &amp; Details
                  </h2>
                  <p className="text-xs text-on-surface-variant mt-1">
                    Enter your contact details so we can issue your official confirmation and digital pass.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5 md:col-span-2">
                    <label className="text-xs font-bold text-on-surface flex items-center gap-1" htmlFor="name">
                      <span className="material-symbols-outlined text-sm text-primary">person</span>
                      Full Name <span className="text-error">*</span>
                    </label>
                    <input
                      id="name"
                      name="name"
                      placeholder={t("patientNamePlaceholder")}
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
                        if (errors.name) setErrors((prev) => ({ ...prev, name: "" }));
                      }}
                      className={`w-full bg-surface border rounded-2xl px-4 py-3 text-sm text-on-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary transition-all ${
                        errors.name ? "border-error focus:ring-error" : "border-outline-variant/60"
                      }`}
                      type="text"
                    />
                    {errors.name && <p className="text-error text-xs font-semibold mt-0.5">{errors.name}</p>}
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-on-surface flex items-center gap-1" htmlFor="email">
                      <span className="material-symbols-outlined text-sm text-primary">mail</span>
                      {t("emailAddress")} <span className="text-error">*</span>
                    </label>
                    <input
                      id="email"
                      name="email"
                      placeholder={t("patientEmailPlaceholder")}
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (errors.email) setErrors((prev) => ({ ...prev, email: "" }));
                      }}
                      className={`w-full bg-surface border rounded-2xl px-4 py-3 text-sm text-on-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary transition-all ${
                        errors.email ? "border-error focus:ring-error" : "border-outline-variant/60"
                      }`}
                      type="email"
                    />
                    {errors.email && <p className="text-error text-xs font-semibold mt-0.5">{errors.email}</p>}
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-on-surface flex items-center gap-1" htmlFor="phone">
                      <span className="material-symbols-outlined text-sm text-primary">call</span>
                      {t("phoneNumber")} <span className="text-error">*</span>
                    </label>
                    <input
                      id="phone"
                      name="phone"
                      placeholder={t("patientPhonePlaceholder")}
                      value={phone}
                      onChange={(e) => {
                        setPhone(e.target.value);
                        if (errors.phone) setErrors((prev) => ({ ...prev, phone: "" }));
                      }}
                      className={`w-full bg-surface border rounded-2xl px-4 py-3 text-sm text-on-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary transition-all ${
                        errors.phone ? "border-error focus:ring-error" : "border-outline-variant/60"
                      }`}
                      type="tel"
                    />
                    {errors.phone && <p className="text-error text-xs font-semibold mt-0.5">{errors.phone}</p>}
                  </div>

                  <div className="flex flex-col gap-1.5 md:col-span-2">
                    <label className="text-xs font-bold text-on-surface flex items-center gap-1" htmlFor="notes">
                      <span className="material-symbols-outlined text-sm text-primary">notes</span>
                      {t("additionalNotes")}
                    </label>
                    <textarea
                      id="notes"
                      name="notes"
                      placeholder={t("symptomsPlaceholder")}
                      rows={3}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="w-full bg-surface border border-outline-variant/60 rounded-2xl px-4 py-3 text-sm text-on-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary transition-all"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-surface-container-high">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handlePrevStep}
                    className="text-xs py-2.5 px-5"
                  >
                    <span className="material-symbols-outlined text-base">arrow_back</span>
                    Back
                  </Button>
                  <Button
                    type="button"
                    variant="primary"
                    onClick={handleNextStep}
                    disabled={!name || !email || !phone}
                    className="text-xs py-3 px-6 font-bold shadow-sm"
                  >
                    Next: Review Digital Pass
                    <span className="material-symbols-outlined text-base">arrow_forward</span>
                  </Button>
                </div>
              </motion.div>
            )}

            {/* STEP 4: Premium Digital Appointment Ticket Pass Review */}
            {currentStep === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="space-y-6 bg-white p-6 md:p-8 rounded-3xl border border-outline-variant/15 shadow-sm"
              >
                <div className="border-b border-surface-container-high pb-4">
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-extrabold rounded-full">
                    Final Step 4 of 4
                  </span>
                  <h2 className="text-headline-md font-bold text-on-surface mt-2 flex items-center gap-2">
                    Review Your Digital Pass
                  </h2>
                  <p className="text-xs text-on-surface-variant mt-1">
                    Please verify all appointment details before finalizing your booking.
                  </p>
                </div>

                {/* Digital Ticket Pass Card */}
                <div className="relative bg-gradient-to-br from-primary/10 via-surface-container-lowest to-secondary/10 border-2 border-primary/30 rounded-3xl p-6 md:p-8 shadow-md overflow-hidden space-y-6">
                  {/* Decorative Elements */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-2xl pointer-events-none"></div>

                  <div className="flex items-center justify-between border-b border-outline-variant/20 pb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-primary text-on-primary flex items-center justify-center font-bold text-xl shadow-xs">
                        🏥
                      </div>
                      <div>
                        <h3 className="font-extrabold text-sm text-on-surface">Lumina Health System</h3>
                        <p className="text-[11px] text-on-surface-variant font-medium">Official OPD Consultation Pass</p>
                      </div>
                    </div>
                    <span className="px-3 py-1 bg-emerald-500 text-white font-extrabold text-xs rounded-full shadow-2xs">
                      READY TO CONFIRM
                    </span>
                  </div>

                  {/* Scheduled Date & Time Banner */}
                  <div className="bg-white/90 backdrop-blur-xs p-4 rounded-2xl border border-primary/20 flex flex-col sm:flex-row justify-between items-center gap-3 shadow-2xs">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-primary block">Selected Date</span>
                      <span className="text-base font-extrabold text-on-surface block mt-0.5">{date}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-primary block">Time Slot</span>
                      <span className="text-base font-extrabold text-emerald-600 block mt-0.5">{selectedTime}</span>
                    </div>
                  </div>

                  {/* Details Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div className="bg-white p-3.5 rounded-2xl border border-outline-variant/15">
                      <span className="text-on-surface-variant font-semibold block text-[10px] uppercase">Service</span>
                      <span className="font-bold text-on-surface text-sm block mt-0.5">{selectedServiceObj?.name || "Consultation"}</span>
                      <span className="text-primary font-extrabold block mt-0.5">${selectedServiceObj?.price || 150} USD</span>
                    </div>

                    <div className="bg-white p-3.5 rounded-2xl border border-outline-variant/15">
                      <span className="text-on-surface-variant font-semibold block text-[10px] uppercase">Specialist</span>
                      <span className="font-bold text-on-surface text-sm block mt-0.5">{selectedDoctorObj?.full_name || "Any Available Doctor"}</span>
                      <span className="text-on-surface-variant block text-[11px] mt-0.5">{selectedDoctorObj?.specialty || "General Specialist"}</span>
                    </div>

                    <div className="sm:col-span-2 bg-white p-3.5 rounded-2xl border border-outline-variant/15">
                      <span className="text-on-surface-variant font-semibold block text-[10px] uppercase">Patient Details</span>
                      <span className="font-bold text-on-surface block mt-0.5">{name} ({phone})</span>
                      <span className="text-on-surface-variant block text-[11px]">{email}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-surface-container-high">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handlePrevStep}
                    className="text-xs py-2.5 px-5"
                  >
                    <span className="material-symbols-outlined text-base">arrow_back</span>
                    Back
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    isLoading={isLoading}
                    className="text-xs py-3.5 px-8 font-extrabold shadow-lg scale-102 hover:scale-105 transition-all"
                  >
                    Confirm &amp; Issue Appointment Pass
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </form>
      </div>

      {/* Right Column: Live Booking Summary Sidebar (4 Cols) */}
      <div className="lg:col-span-4 sticky top-24 space-y-4">
        <div className="bg-white p-6 rounded-3xl border border-outline-variant/15 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-surface-container-high pb-3">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-xl select-none">receipt_long</span>
              <h3 className="text-headline-sm font-bold text-on-surface text-sm">Live Booking Pass</h3>
            </div>
            <span className="text-[10px] font-bold px-2.5 py-0.5 bg-primary/10 text-primary rounded-full">
              LIVE
            </span>
          </div>

          <div className="space-y-3.5 text-xs">
            {/* Service */}
            <div className="flex items-center justify-between">
              <span className="text-on-surface-variant font-medium">Service:</span>
              <span className="font-bold text-on-surface max-w-[160px] truncate text-right">
                {selectedServiceObj ? selectedServiceObj.name : "Not selected"}
              </span>
            </div>

            {/* Doctor */}
            <div className="flex items-center justify-between">
              <span className="text-on-surface-variant font-medium">Specialist:</span>
              <span className="font-bold text-on-surface max-w-[160px] truncate text-right">
                {selectedDoctorObj ? selectedDoctorObj.full_name : doctor === "any" ? "Any Available" : "Not selected"}
              </span>
            </div>

            {/* Date */}
            <div className="flex items-center justify-between">
              <span className="text-on-surface-variant font-medium">Date:</span>
              <span className="font-bold text-on-surface">
                {date || "Not selected"}
              </span>
            </div>

            {/* Time */}
            <div className="flex items-center justify-between">
              <span className="text-on-surface-variant font-medium">Time Slot:</span>
              <span className="font-extrabold text-emerald-600">
                {selectedTime || "Not selected"}
              </span>
            </div>

            {/* Price Total */}
            <div className="border-t border-outline-variant/20 pt-3 flex items-center justify-between">
              <span className="font-bold text-on-surface">Total Fee:</span>
              <span className="text-lg font-extrabold text-primary">
                ${selectedServiceObj ? selectedServiceObj.price : 150} USD
              </span>
            </div>
          </div>
        </div>

        {/* Guarantees Box */}
        <div className="bg-emerald-50/80 p-4.5 rounded-3xl border border-emerald-200/80 space-y-2 text-xs text-emerald-950">
          <div className="flex items-center gap-2 font-bold text-emerald-900">
            <span className="material-symbols-outlined text-emerald-600 text-lg select-none">verified</span>
            <span>Clinic Satisfaction Guarantee</span>
          </div>
          <ul className="space-y-1 text-[11px] text-emerald-800 list-disc pl-4 font-medium">
            <li>Instant email &amp; SMS digital pass</li>
            <li>Free cancellation &amp; rescheduling up to 2h</li>
            <li>Instant PDF appointment slip download</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default function BookAppointmentPage() {
  const t = useTranslations("BookAppointmentPage");
  return (
    <div className="overflow-x-hidden py-10 md:py-14 px-4 md:px-6 bg-surface-container-lowest min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <span className="px-3.5 py-1 bg-primary/10 text-primary font-extrabold text-xs rounded-full inline-block mb-3">
            {t("bookingBadge")}
          </span>
          <h1 className="text-display-lg-mobile md:text-display-lg font-bold text-on-surface mb-2">
            {t("title")}
          </h1>
          <p className="text-body-lg text-on-surface-variant max-w-xl mx-auto text-sm">
            {t("subtitle")}
          </p>
        </div>

        <Suspense fallback={<div className="p-12 text-center animate-pulse text-on-surface-variant font-medium">{t("loadingPortal")}</div>}>
          <BookingForm />
        </Suspense>
      </div>
    </div>
  );
}
