"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { getDoctorBySlug, getDoctorReviews, DoctorData, ReviewData } from "@/lib/api";
import TestimonialCard from "@/components/testimonial-card";
import ReviewModal from "@/components/review-modal";
import Button from "@/components/button";
import Image from "next/image";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { useTranslations, useLocale } from "next-intl";
import {
  getLocalizedSpecialty,
  getLocalizedQualification,
  getLocalizedDoctorBio,
  getLocalizedLanguage,
  getLocalizedDay
} from "@/lib/translations";

interface DoctorProfilePageProps {
  params: Promise<{ slug: string }>;
}

export default function DoctorProfilePage({ params }: DoctorProfilePageProps) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;
  const { user } = useAuth();
  const t = useTranslations("DoctorProfilePage");
  const locale = useLocale();

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
      console.error("Failed to load doctor details:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDoctorData();
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-20 animate-pulse space-y-8">
        <div className="h-10 bg-surface-container rounded w-1/4"></div>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          <div className="md:col-span-5 h-96 bg-surface-container rounded-3xl"></div>
          <div className="md:col-span-7 space-y-4">
            <div className="h-8 bg-surface-container rounded w-1/3"></div>
            <div className="h-12 bg-surface-container rounded w-2/3"></div>
            <div className="h-24 bg-surface-container rounded w-full"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <span className="material-symbols-outlined text-error text-6xl">person_off</span>
        <h1 className="text-headline-md font-bold text-on-surface">Doctor Not Found</h1>
        <p className="text-body-md text-on-surface-variant">
          The requested specialist profile could not be located.
        </p>
        <Link href="/doctors">
          <Button variant="primary">View All Doctors</Button>
        </Link>
      </div>
    );
  }

  // Formatting working days matrix
  const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const doctorSchedules = doctor.schedules || [];
  const weeklySchedule = daysOfWeek.map((day) => {
    const matched = doctorSchedules.find(
      (s) => s.day_of_week.toLowerCase().slice(0, 3) === day.toLowerCase()
    );
    return {
      day,
      full: getLocalizedDay(day, locale),
      isWorking: !!matched,
      startTime: matched?.start_time || "",
      endTime: matched?.end_time || "",
    };
  });

  const languagesList: string[] = Array.isArray(doctor.languages)
    ? doctor.languages
    : typeof doctor.languages === "string"
    ? (doctor.languages as string).split(",").map((s) => s.trim())
    : ["English", "Urdu"];

  return (
    <div className="overflow-x-hidden space-y-12 pb-20">
      {/* Breadcrumb */}
      <nav className="max-w-7xl mx-auto px-4 md:px-6 pt-6">
        <div className="flex items-center gap-2 text-xs font-semibold text-on-surface-variant">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <span>/</span>
          <Link href="/doctors" className="hover:text-primary transition-colors">Doctors</Link>
          <span>/</span>
          <span className="text-on-surface font-bold truncate">{doctor.full_name}</span>
        </div>
      </nav>

      {/* Main Profile Hero Section */}
      <section className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-start">
          {/* Left Column: Doctor Portrait Photo */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="md:col-span-5"
          >
            <div className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-lg border-4 border-surface ring-1 ring-outline-variant/15">
              <Image
                src={doctor.photo || "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=800"}
                alt={doctor.full_name}
                fill
                priority
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <span className="text-xs font-bold bg-emerald-500/90 text-white px-3 py-1 rounded-full backdrop-blur-sm">
                  Verified OPD Specialist
                </span>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Bio & Fast Details */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="md:col-span-7 space-y-6"
          >
            <div>
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <span className="text-label-md text-secondary font-bold uppercase tracking-wider bg-secondary/10 px-3 py-1 rounded-full">
                  {getLocalizedSpecialty(doctor.specialty, locale)}
                </span>
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
                {getLocalizedQualification(doctor.qualifications || "", locale) || "Medical Specialist"} • {doctor.experience_years} Years Experience
              </p>
            </div>

            {/* Real-time Rating Badge */}
            <div className="flex items-center gap-4 py-3 px-4 bg-surface-container-low rounded-2xl border border-outline-variant/15 w-fit flex-wrap">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-amber-500 text-xl font-bold" style={{ fontVariationSettings: "'FILL' 1" }}>
                  star
                </span>
                <span className="text-headline-sm font-extrabold text-on-surface">{doctor.rating.toFixed(1)}</span>
              </div>
              <div className="h-6 w-px bg-outline-variant/30 hidden sm:block"></div>
              <div>
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

              <div className="flex gap-3 pt-2 flex-col sm:flex-row">
                <Link href={`/book-appointment?doctor=${doctor.id}`} className="flex-1">
                  <Button variant="primary" className="w-full py-3.5 text-base font-bold shadow-md">
                    Book Appointment Now
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  onClick={() => setIsReviewModalOpen(true)}
                  className="py-3.5 px-4 text-xs font-bold flex items-center justify-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-base">rate_review</span>
                  Write Review
                </Button>
              </div>
            </div>

            {/* Biography */}
            <div className="space-y-2">
              <h3 className="text-headline-sm font-bold text-on-surface">About Dr. {doctor.full_name.split(" ").slice(-1)[0]}</h3>
              <p className="text-body-md text-on-surface-variant leading-relaxed">
                {getLocalizedDoctorBio(doctor.full_name, doctor.bio || "", locale) || `${doctor.full_name} is a dedicated ${doctor.specialty} specialist with ${doctor.experience_years} years of clinical excellence, committed to providing compassionate, evidence-based patient care.`}
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
                    {getLocalizedLanguage(lang, locale)}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

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
            <span className="text-xs font-bold px-3 py-1.5 bg-emerald-100/80 text-emerald-900 rounded-full flex items-center gap-1 w-fit">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Live Schedule
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
            {weeklySchedule.map((item) => (
              <div
                key={item.day}
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
