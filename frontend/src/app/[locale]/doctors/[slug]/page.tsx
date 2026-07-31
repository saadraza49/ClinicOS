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
  const availableDays = doctor.schedules && doctor.schedules.length > 0
    ? doctor.schedules.map(s => s.day_of_week)
    : ["Monday", "Wednesday", "Friday"];
  const scheduleTime = doctor.schedules && doctor.schedules.length > 0
    ? `${doctor.schedules[0].start_time} - ${doctor.schedules[0].end_time}`
    : "09:00 AM - 05:00 PM";

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

      {/* Doctor Profile Section */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-start">
          {/* Left Column: Photo */}
          <div className="md:col-span-5 lg:col-span-4 flex flex-col items-center md:items-start">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="relative w-full max-w-sm aspect-[4/5] rounded-2xl overflow-hidden shadow-ambient bg-surface-container-lowest border border-outline-variant/10"
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
          </div>

          {/* Right Column: Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="md:col-span-7 lg:col-span-8 flex flex-col"
          >
            {/* Badges and Quick Stats */}
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary font-label-sm text-label-sm font-semibold">
                <span className="material-symbols-outlined text-[16px] mr-1">
                  stethoscope
                </span>
                {doctor.specialty}
              </span>
              <span className="text-on-surface-variant text-body-md flex items-center gap-1 font-medium">
                <span className="material-symbols-outlined text-[18px] text-primary">
                  workspace_premium
                </span>
                {doctor.qualifications || "Medical Specialist"}
              </span>
              <span className="text-on-surface-variant text-body-md flex items-center gap-1 font-medium">
                <span className="material-symbols-outlined text-[18px] text-primary">
                  history
                </span>
                {doctor.experience_years} Years Experience
              </span>
            </div>

            {/* Doctor Name */}
            <h1 className="text-display-lg-mobile md:text-display-lg text-on-surface mb-4 font-bold leading-tight">
              {doctor.full_name}
            </h1>

            {/* Bio */}
            <p className="text-body-lg text-on-surface-variant mb-8 leading-relaxed">
              {doctor.bio || "Dedicated healthcare professional focused on delivering exceptional, evidence-based care to patients."}
            </p>

            {/* Langs and Availability tags */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10 border-t border-outline-variant/10 pt-6">
              <div>
                <h3 className="text-label-md font-bold text-on-surface mb-3 flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary text-lg">
                    language
                  </span>
                  Languages Spoken
                </h3>
                <div className="flex flex-wrap gap-2">
                  {languagesList.map((lang) => (
                    <span
                      key={lang}
                      className="px-3 py-1 bg-surface-container border border-outline-variant/20 rounded-full text-label-sm text-on-surface-variant font-medium"
                    >
                      {lang}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-label-md font-bold text-on-surface mb-3 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-lg">
                    calendar_month
                  </span>
                  Availability
                </h3>
                <div className="flex flex-wrap gap-2">
                  {availableDays.map((day) => (
                    <span
                      key={day}
                      className="px-3 py-1 bg-surface-container border border-outline-variant/20 rounded-full text-label-sm text-on-surface-variant font-semibold"
                    >
                      {day}
                    </span>
                  ))}
                </div>
                <p className="text-label-sm text-on-surface-variant mt-2 pl-7 text-xs">
                  {scheduleTime}
                </p>
              </div>
            </div>

            {/* Book CTA button */}
            <div className="pt-4 border-t border-outline-variant/10">
              <Link href={`/book-appointment?doctor=${doctor.id}`} className="inline-block w-full sm:w-auto">
                <Button variant="primary" className="w-full sm:w-auto">
                  Book with {doctor.full_name}
                  <span className="material-symbols-outlined">arrow_forward</span>
                </Button>
              </Link>
            </div>
          </motion.div>
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
