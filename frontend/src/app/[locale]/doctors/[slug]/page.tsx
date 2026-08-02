"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { getDoctorBySlug, getDoctorReviews, DoctorData, ReviewData } from "@/lib/api";
import TestimonialCard from "@/components/testimonial-card";
import ReviewModal from "@/components/review-modal";
import Button from "@/components/button";
import Image from "next/image";
import { motion } from "framer-motion";
<<<<<<< HEAD:frontend/src/app/doctors/[slug]/page.tsx
import { useAuth } from "@/context/AuthContext";
=======
import { useTranslations, useLocale } from "next-intl";
import {
  getLocalizedSpecialty,
  getLocalizedQualification,
  getLocalizedDoctorBio,
  getLocalizedLanguage,
  getLocalizedDay
} from "@/lib/translations";
>>>>>>> feature_language_module:frontend/src/app/[locale]/doctors/[slug]/page.tsx

interface DoctorProfilePageProps {
  params: Promise<{ slug: string }>;
}

export default function DoctorProfilePage({ params }: DoctorProfilePageProps) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;
<<<<<<< HEAD:frontend/src/app/doctors/[slug]/page.tsx
  const { user } = useAuth();
=======
  const t = useTranslations("DoctorProfilePage");
  const locale = useLocale();
>>>>>>> feature_language_module:frontend/src/app/[locale]/doctors/[slug]/page.tsx

  const [doctor, setDoctor] = useState<DoctorData | null>(null);
  const [reviews, setReviews] = useState<ReviewData[]>([]);
  const [loading, setLoading] = useState(true);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  const loadDoctorData = async () => {
    try {
      const data = await getDoctorBySlug(slug);
      setDoctor(data);
      if (data?.id) {
        const revs = await getDoctorReviews(data.id);
        setReviews(revs);
      }
    } catch (err) {
      console.error("Failed to load doctor by slug:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDoctorData();
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-20 animate-pulse">
        <div className="h-10 bg-surface-container w-1/3 rounded mb-8"></div>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          <div className="md:col-span-5 h-96 bg-surface-container rounded-2xl"></div>
          <div className="md:col-span-7 flex flex-col gap-4">
            <div className="h-8 bg-surface-container w-1/4 rounded"></div>
            <div className="h-12 bg-surface-container w-3/4 rounded"></div>
            <div className="h-24 bg-surface-container w-full rounded"></div>
            <div className="h-12 bg-surface-container w-1/2 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
        <span className="material-symbols-outlined text-primary text-6xl mb-4 select-none">
          error_outline
        </span>
        <h1 className="text-headline-md font-bold mb-2">Doctor Profile Not Found</h1>
        <p className="text-body-lg text-on-surface-variant max-w-md mb-8">
          We couldn't find a profile for the requested doctor. They may have relocated or changed specialties.
        </p>
        <Link href="/doctors">
          <Button variant="primary">{t("returnToDirectory")}</Button>
        </Link>
      </div>
    );
  }

  const languagesList = doctor.languages ? doctor.languages.split(",").map(s => s.trim()) : ["English"];

  const ALL_DAYS = [
    { full: "Monday", short: "Mon" },
    { full: "Tuesday", short: "Tue" },
    { full: "Wednesday", short: "Wed" },
    { full: "Thursday", short: "Thu" },
    { full: "Friday", short: "Fri" },
    { full: "Saturday", short: "Sat" },
    { full: "Sunday", short: "Sun" },
  ];

  const weeklySchedule = ALL_DAYS.map((dObj) => {
    if (!doctor.schedules || doctor.schedules.length === 0) {
      const isDefaultWork = ["Mon", "Wed", "Fri"].includes(dObj.short);
      return {
        ...dObj,
        isWorking: isDefaultWork,
        startTime: isDefaultWork ? "09:00 AM" : null,
        endTime: isDefaultWork ? "05:00 PM" : null,
        slotDuration: 30,
      };
    }

    const match = doctor.schedules.find(
      (s) =>
        s.is_active &&
        (s.day_of_week.toLowerCase().includes(dObj.short.toLowerCase()) ||
          s.day_of_week.toLowerCase().includes(dObj.full.toLowerCase()))
    );

    return {
      ...dObj,
      isWorking: !!match,
      startTime: match ? match.start_time : null,
      endTime: match ? match.end_time : null,
      slotDuration: match ? match.slot_duration_minutes : 30,
    };
  });

  return (
    <div className="bg-background min-h-screen">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Left: Doctor Photo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="md:col-span-5 relative"
          >
            <div className="relative aspect-[3/4] w-full rounded-3xl overflow-hidden shadow-ambient border border-outline-variant/10">
              <Image
                src={doctor.photo || "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=800"}
                alt={doctor.full_name}
                fill
                sizes="(max-width: 768px) 100vw, 40vw"
                className="object-cover"
                priority
              />
              <div className="absolute top-4 left-4 bg-surface-container-lowest/90 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-outline-variant/20 shadow-sm flex items-center gap-1.5">
                <span className="material-symbols-outlined text-secondary text-sm">verified</span>
                <span className="text-xs font-bold text-on-surface">Verified Practitioner</span>
              </div>
            </div>
          </motion.div>

          {/* Right: Doctor Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="md:col-span-7 space-y-6"
          >
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-label-md text-secondary font-bold uppercase tracking-wider bg-secondary/10 px-3 py-1 rounded-full">
                  {doctor.specialty}
                </span>
<<<<<<< HEAD:frontend/src/app/doctors/[slug]/page.tsx
                {doctor.department && (
                  <span className="text-label-md text-on-surface-variant font-medium bg-surface-container px-3 py-1 rounded-full">
                    {doctor.department.name}
                  </span>
                )}
              </div>
              <h1 className="text-display-md md:text-display-lg font-bold text-on-surface mb-2">
                {doctor.full_name}
              </h1>
              <p className="text-body-lg text-on-surface-variant font-medium">
                {doctor.qualifications || "Medical Specialist"} • {doctor.experience_years} Years Experience
              </p>
            </div>

            {/* Real-time Rating Badge */}
            <div className="flex items-center gap-4 py-3 px-4 bg-surface-container-low rounded-2xl border border-outline-variant/15 w-fit">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-amber-500 text-xl font-bold" style={{ fontVariationSettings: "'FILL' 1" }}>
                  star
                </span>
                <span className="text-headline-sm font-extrabold text-on-surface">{doctor.rating.toFixed(1)}</span>
=======
                {getLocalizedSpecialty(doctor.specialty, locale)}
              </span>
              <span className="text-on-surface-variant text-body-md flex items-center gap-1 font-medium">
                <span className="material-symbols-outlined text-[18px] text-primary">
                  workspace_premium
                </span>
                {getLocalizedQualification(doctor.qualifications, locale) || t("medicalSpecialist")}
              </span>
              <span className="text-on-surface-variant text-body-md flex items-center gap-1 font-medium">
                <span className="material-symbols-outlined text-[18px] text-primary">
                  history
                </span>
                {t("yearsExperience", { years: doctor.experience_years })}
              </span>
            </div>

            {/* Doctor Name */}
            <h1 className="text-display-lg-mobile md:text-display-lg text-on-surface mb-4 font-bold leading-tight">
              {doctor.full_name}
            </h1>

            {/* Bio */}
            <p className="text-body-lg text-on-surface-variant mb-8 leading-relaxed">
              {getLocalizedDoctorBio(doctor.full_name, doctor.bio || "", locale) || t("defaultBio")}
            </p>

            {/* Langs and Availability tags */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10 border-t border-outline-variant/10 pt-6">
              <div>
                <h3 className="text-label-md font-bold text-on-surface mb-3 flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary text-lg">
                    language
                  </span>
                  {t("languagesSpoken")}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {languagesList.map((lang) => (
                    <span
                      key={lang}
                      className="px-3 py-1 bg-surface-container border border-outline-variant/20 rounded-full text-label-sm text-on-surface-variant font-medium"
                    >
                      {getLocalizedLanguage(lang, locale)}
                    </span>
                  ))}
                </div>
>>>>>>> feature_language_module:frontend/src/app/[locale]/doctors/[slug]/page.tsx
              </div>
              <div className="h-6 w-px bg-outline-variant/30"></div>
              <div>
<<<<<<< HEAD:frontend/src/app/doctors/[slug]/page.tsx
                <p className="text-xs font-bold text-on-surface">{doctor.review_count} Verified Reviews</p>
                <p className="text-[11px] text-emerald-700 font-bold">100% Real-time Patient Feedback</p>
              </div>
            </div>

            {/* Fee & Booking CTA */}
            <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/20 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-label-sm text-on-surface-variant uppercase tracking-wider text-xs">Consultation Fee</p>
                  <p className="text-headline-md font-bold text-primary">${doctor.consultation_fee} USD</p>
                </div>
                <div className="text-right">
                  <p className="text-label-sm text-on-surface-variant uppercase tracking-wider text-xs">Status</p>
                  <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full inline-block mt-1">
                    Accepting Patients
                  </span>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <Link href={`/book-appointment?doctor=${doctor.id}`} className="flex-1">
                  <Button variant="primary" className="w-full py-3.5 text-base font-bold shadow-md">
                    Book Appointment Now
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  onClick={() => setIsReviewModalOpen(true)}
                  className="py-3.5 px-4 text-xs font-bold flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-base">rate_review</span>
                  Write Review
=======
                <h3 className="text-label-md font-bold text-on-surface mb-3 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-lg">
                    calendar_month
                  </span>
                  {t("availability")}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {availableDays.map((day) => (
                    <span
                      key={day}
                      className="px-3 py-1 bg-surface-container border border-outline-variant/20 rounded-full text-label-sm text-on-surface-variant font-semibold"
                    >
                      {getLocalizedDay(day, locale)}
                    </span>
                  ))}
                </div>
                <p className="text-label-sm text-on-surface-variant mt-2 pl-7 text-xs">
                  {scheduleTime}
                </p>
              </div>
            </div>

            {/* Book CTA button */}
            <div className="mt-8">
              <Link href={`/book-appointment?doctor=${encodeURIComponent(doctor.full_name)}&service=${encodeURIComponent(doctor.specialty)}`} className="inline-block w-full sm:w-auto">
                <Button variant="primary" className="w-full sm:w-auto flex items-center justify-center gap-2 shadow-md hover:shadow-lg">
                  {t("bookWith", { name: doctor.full_name })}
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
>>>>>>> feature_language_module:frontend/src/app/[locale]/doctors/[slug]/page.tsx
                </Button>
              </div>
            </div>

            {/* Biography */}
            <div className="space-y-2">
              <h3 className="text-headline-sm font-bold text-on-surface">About Dr. {doctor.full_name.split(" ").slice(-1)[0]}</h3>
              <p className="text-body-md text-on-surface-variant leading-relaxed">
                {doctor.bio || `${doctor.full_name} is a dedicated ${doctor.specialty} specialist with ${doctor.experience_years} years of clinical excellence, committed to providing compassionate, evidence-based patient care.`}
              </p>
            </div>

            {/* Languages */}
            <div className="space-y-2">
              <h4 className="text-label-lg font-bold text-on-surface uppercase tracking-wider text-xs">Languages Spoken</h4>
              <div className="flex flex-wrap gap-2">
                {languagesList.map((lang) => (
                  <span
                    key={lang}
                    className="px-3 py-0.5 bg-surface-container border border-outline-variant/20 rounded-full text-xs text-on-surface-variant font-semibold"
                  >
                    {lang}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

<<<<<<< HEAD:frontend/src/app/doctors/[slug]/page.tsx
      {/* Weekly Schedule Matrix */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 pb-12">
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-outline-variant/15 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-surface-container-high pb-4">
            <div>
              <h2 className="text-headline-md font-bold text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-2xl select-none">calendar_month</span>
                Weekly OPD Schedule
              </h2>
              <p className="text-xs text-on-surface-variant mt-0.5">
                Working hours &amp; slot durations for {doctor.full_name}
              </p>
            </div>
            <span className="text-xs font-bold px-3 py-1.5 bg-emerald-100/80 text-emerald-900 rounded-full flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Live Schedule
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
            {weeklySchedule.map((item) => (
              <div
                key={item.full}
                className={`p-4 rounded-2xl border text-center flex flex-col justify-between transition-all ${
                  item.isWorking
                    ? "bg-emerald-50/60 border-emerald-200 shadow-2xs"
                    : "bg-surface-container-low border-outline-variant/15 opacity-60"
                }`}
              >
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-on-surface-variant block mb-1.5">
                    {item.full}
                  </span>
                  {item.isWorking ? (
                    <div className="space-y-0.5">
                      <span className="text-xs font-bold text-emerald-950 block">
                        {item.startTime}
                      </span>
                      <span className="text-[11px] font-semibold text-emerald-700 block">
                        to {item.endTime}
                      </span>
                    </div>
                  ) : (
                    <span className="text-xs font-semibold text-on-surface-variant/70 block py-1.5">
                      Off / Closed
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Real-time Patient Reviews Section */}
      <section className="bg-surface-container-low py-16 px-4 md:px-6">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 border-b border-outline-variant/20 pb-6">
            <div>
              <span className="px-3 py-1 bg-amber-100 text-amber-900 text-xs font-extrabold rounded-full">
                VERIFIED PATIENT FEEDBACK
              </span>
              <h2 className="text-headline-md text-on-surface font-bold mt-2">
                Real-Time Ratings &amp; Reviews
              </h2>
              <div className="flex items-center gap-2 mt-1">
                <div className="flex text-amber-500">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <span
                      key={index}
                      className="material-symbols-outlined text-lg"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      star
                    </span>
                  ))}
                </div>
                <span className="text-label-md text-on-surface font-extrabold">
                  {doctor.rating.toFixed(1)} / 5.0 ({doctor.review_count} reviews)
                </span>
              </div>
            </div>

            <Button
              variant="primary"
              onClick={() => setIsReviewModalOpen(true)}
              className="py-3 px-6 text-xs font-bold shadow-md flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-base">rate_review</span>
              Leave a Review
            </Button>
          </div>

          {/* Real Reviews Cards */}
          {reviews.length === 0 ? (
            <div className="p-8 bg-white rounded-3xl text-center space-y-3 border border-outline-variant/15">
              <span className="material-symbols-outlined text-amber-500 text-4xl">grade</span>
              <h4 className="font-bold text-on-surface text-base">Be the First to Review!</h4>
              <p className="text-xs text-on-surface-variant max-w-sm mx-auto">
                No reviews recorded for {doctor.full_name} yet. Click above to submit your rating!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {reviews.map((rev) => (
                <motion.div
                  key={rev.id}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4 }}
                >
                  <TestimonialCard
                    quote={rev.review_text || "Excellent clinical treatment and professional diagnosis."}
                    author={rev.reviewer_name || "Verified Patient"}
                    role={`Rating: ${rev.rating} ★`}
                    rating={rev.rating}
                  />
                </motion.div>
              ))}
            </div>
          )}
=======
      {/* Patient Reviews Section */}
      <section className="bg-surface-container-lowest py-20 border-t border-outline-variant/10">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="flex items-center gap-3 mb-10">
            <span className="material-symbols-outlined text-primary text-3xl">reviews</span>
            <h2 className="text-headline-md font-bold text-on-surface">{t("patientReviews")}</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
            >
              <TestimonialCard
                quote={t("reviewQuote1", { lastName: doctor.full_name.split(" ").slice(-1)[0] })}
                author={t("verifiedPatient")}
                role={t("clinicalCarePatient")}
                rating={5}
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <TestimonialCard
                quote={t("reviewQuote2")}
                author="Sarah M."
                role={t("verifiedPatient")}
                rating={5}
              />
            </motion.div>
          </div>
>>>>>>> feature_language_module:frontend/src/app/[locale]/doctors/[slug]/page.tsx
        </div>
      </section>

      {/* Review Modal */}
      <ReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        doctorId={doctor.id}
        doctorName={doctor.full_name}
        defaultReviewerName={user?.full_name || ""}
        onReviewSubmitted={() => {
          loadDoctorData();
        }}
      />
    </div>
  );
}
