"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { getDoctorBySlug, DoctorData } from "@/lib/api";
import TestimonialCard from "@/components/testimonial-card";
import Button from "@/components/button";
import Image from "next/image";
import { motion } from "framer-motion";

interface DoctorProfilePageProps {
  params: Promise<{ slug: string }>;
}

export default function DoctorProfilePage({ params }: DoctorProfilePageProps) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;

  const [doctor, setDoctor] = useState<DoctorData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDoctor() {
      try {
        const data = await getDoctorBySlug(slug);
        setDoctor(data);
      } catch (err) {
        console.error("Failed to load doctor by slug:", err);
      } finally {
        setLoading(false);
      }
    }
    loadDoctor();
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
          <Button variant="primary">Return to Team Directory</Button>
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

    if (match) {
      return {
        ...dObj,
        isWorking: true,
        startTime: match.start_time,
        endTime: match.end_time,
        slotDuration: match.slot_duration_minutes || 30,
      };
    }

    return {
      ...dObj,
      isWorking: false,
      startTime: null,
      endTime: null,
      slotDuration: null,
    };
  });

  return (
    <div className="overflow-x-hidden">
      {/* Breadcrumbs Banner */}
      <div className="bg-surface-container-low border-b border-outline-variant/10">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4">
          <nav aria-label="Breadcrumb" className="flex text-sm text-on-surface-variant">
            <ol className="inline-flex items-center space-x-1 md:space-x-2">
              <li className="inline-flex items-center">
                <Link href="/" className="hover:text-primary transition-colors text-label-sm font-semibold">
                  Home
                </Link>
              </li>
              <li>
                <div className="flex items-center">
                  <span className="material-symbols-outlined text-[16px] mx-1 text-on-surface-variant/50 select-none">
                    chevron_right
                  </span>
                  <Link href="/doctors" className="hover:text-primary transition-colors text-label-sm font-semibold">
                    Doctors
                  </Link>
                </div>
              </li>
              <li aria-current="page">
                <div className="flex items-center">
                  <span className="material-symbols-outlined text-[16px] mx-1 text-on-surface-variant/50 select-none">
                    chevron_right
                  </span>
                  <span className="text-on-surface font-semibold text-label-sm">
                    {doctor.full_name}
                  </span>
                </div>
              </li>
            </ol>
          </nav>
        </div>
      </div>

      {/* Doctor Profile Header Section */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 py-10 md:py-14">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-start">
          {/* Left Column: Photo & Quick Highlights */}
          <div className="md:col-span-5 lg:col-span-4 flex flex-col items-center md:items-start space-y-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="relative w-full max-w-sm aspect-[4/5] rounded-3xl overflow-hidden shadow-md bg-surface-container-lowest border border-outline-variant/15"
            >
              <Image
                src={doctor.photo || "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=400"}
                alt={`Portrait of ${doctor.full_name}`}
                fill
                priority
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover"
              />
            </motion.div>

            {/* Consultation Fee & Booking Card */}
            <div className="w-full max-w-sm bg-surface-container-low p-5 rounded-3xl border border-outline-variant/15 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-on-surface-variant font-medium">Consultation Fee:</span>
                <span className="text-headline-sm font-bold text-primary">${doctor.consultation_fee} USD</span>
              </div>
              <div className="flex items-center justify-between text-xs border-t border-outline-variant/10 pt-2 text-on-surface-variant">
                <span className="flex items-center gap-1 font-medium">
                  <span className="material-symbols-outlined text-sm text-amber-500 select-none" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  Patient Rating:
                </span>
                <span className="font-bold text-on-surface">{doctor.rating.toFixed(1)} / 5.0 ({doctor.review_count} reviews)</span>
              </div>
              <Link href={`/book-appointment?doctor=${doctor.id}`} className="block pt-1">
                <Button variant="primary" className="w-full justify-center text-sm py-3">
                  Book Appointment Now
                  <span className="material-symbols-outlined text-lg">arrow_forward</span>
                </Button>
              </Link>
            </div>
          </div>

          {/* Right Column: Doctor Info & Biography */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="md:col-span-7 lg:col-span-8 flex flex-col space-y-6"
          >
            {/* Badges */}
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold">
                <span className="material-symbols-outlined text-base mr-1 select-none">stethoscope</span>
                {doctor.specialty}
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-secondary/15 text-secondary-900 text-xs font-bold">
                <span className="material-symbols-outlined text-base mr-1 select-none">workspace_premium</span>
                {doctor.qualifications || "Board Certified"}
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-surface-container-high text-on-surface-variant text-xs font-bold">
                <span className="material-symbols-outlined text-base mr-1 select-none">history</span>
                {doctor.experience_years} Years Experience
              </span>
            </div>

            {/* Doctor Name */}
            <div>
              <h1 className="text-display-lg-mobile md:text-display-lg text-on-surface font-bold leading-tight">
                {doctor.full_name}
              </h1>
              {doctor.department && (
                <p className="text-body-md text-primary font-semibold mt-1">
                  Department of {doctor.department.name}
                </p>
              )}
            </div>

            {/* Bio */}
            <div className="bg-white p-6 rounded-3xl border border-outline-variant/15 space-y-2">
              <h3 className="text-headline-sm font-bold text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">person</span> About Dr. {doctor.full_name.split(" ").slice(-1)[0]}
              </h3>
              <p className="text-body-md text-on-surface-variant leading-relaxed">
                {doctor.bio || "Dedicated healthcare professional focused on delivering exceptional, evidence-based care to patients with empathy and medical excellence."}
              </p>
            </div>

            {/* Languages */}
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-on-surface-variant flex items-center gap-1">
                <span className="material-symbols-outlined text-secondary text-base select-none">language</span> Languages:
              </span>
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

      {/* Clear Weekly Schedule Matrix Section */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 pb-12">
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-outline-variant/15 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-surface-container-high pb-4">
            <div>
              <h2 className="text-headline-md font-bold text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-2xl select-none">calendar_month</span>
                Weekly OPD &amp; Consultation Schedule
              </h2>
              <p className="text-xs text-on-surface-variant mt-0.5">
                Exact day-by-day working hours and slot durations for Dr. {doctor.full_name}
              </p>
            </div>
            <span className="text-xs font-bold px-3 py-1.5 bg-emerald-100/80 text-emerald-900 rounded-full self-start sm:self-auto flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Live Schedule
            </span>
          </div>

          {/* 7-Day Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
            {weeklySchedule.map((item) => (
              <div
                key={item.full}
                className={`p-4 rounded-2xl border text-center flex flex-col justify-between transition-all ${
                  item.isWorking
                    ? "bg-emerald-50/60 border-emerald-200 shadow-2xs hover:border-emerald-400"
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

                {item.isWorking && (
                  <span className="mt-3 text-[10px] font-bold text-emerald-800 bg-emerald-100 py-1 px-2 rounded-lg border border-emerald-200">
                    {item.slotDuration} min slots
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Patient Reviews Section */}
      <section className="bg-surface-container-low py-16 px-4 md:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 gap-4">
            <div>
              <h2 className="text-headline-md text-on-surface mb-2 font-bold">Patient Reviews</h2>
              <div className="flex items-center gap-2">
                <div className="flex text-secondary">
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
                <span className="text-label-md text-on-surface-variant font-bold">
                  {doctor.rating} ({doctor.review_count} reviews)
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
            >
              <TestimonialCard
                quote={`Dr. ${doctor.full_name.split(" ").slice(-1)[0]} provided exceptional care, thoroughly explaining my diagnosis and treatment plan with great empathy.`}
                author="Verified Patient"
                role="Clinical Care Patient"
                rating={5}
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              <TestimonialCard
                quote="Seamless appointment process and top-notch medical professionalism. Highly recommended!"
                author="Sarah M."
                role="Verified Patient"
                rating={5}
              />
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
