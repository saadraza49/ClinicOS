"use client";

import { use } from "react";
import Link from "next/link";
import { doctors } from "@/data/doctors";
import TestimonialCard from "@/components/testimonial-card";
import Button from "@/components/button";
import { motion } from "framer-motion";

interface DoctorProfilePageProps {
  params: Promise<{ slug: string }>;
}

export default function DoctorProfilePage({ params }: DoctorProfilePageProps) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;

  const doctor = doctors.find((d) => d.slug === slug);

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
                    {doctor.name}
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
              <img
                src={doctor.photo}
                alt={doctor.name}
                className="object-cover w-full h-full"
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
                  {doctor.specialtyIcon}
                </span>
                {doctor.specialty}
              </span>
              <span className="text-on-surface-variant text-body-md flex items-center gap-1 font-medium">
                <span className="material-symbols-outlined text-[18px] text-primary">
                  workspace_premium
                </span>
                {doctor.qualifications}
              </span>
              <span className="text-on-surface-variant text-body-md flex items-center gap-1 font-medium">
                <span className="material-symbols-outlined text-[18px] text-primary">
                  history
                </span>
                {doctor.yearsExperience} Years Experience
              </span>
            </div>

            {/* Doctor Name */}
            <h1 className="text-display-lg-mobile md:text-display-lg text-on-surface mb-4 font-bold leading-tight">
              {doctor.name}
            </h1>

            {/* Bio */}
            <p className="text-body-lg text-on-surface-variant mb-8 leading-relaxed">
              {doctor.bio}
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
                  {doctor.languages.map((lang) => (
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
                  {doctor.availableDays.map((day) => (
                    <span
                      key={day}
                      className="px-3 py-1 bg-surface-container border border-outline-variant/20 rounded-full text-label-sm text-on-surface-variant font-semibold"
                    >
                      {day}
                    </span>
                  ))}
                </div>
                <p className="text-label-sm text-on-surface-variant mt-2 pl-7 text-xs">
                  {doctor.availabilityTime}
                </p>
              </div>
            </div>

            {/* Book CTA button */}
            <div className="pt-4 border-t border-outline-variant/10">
              <Link href={`/book-appointment?doctor=${doctor.id}`} className="inline-block w-full sm:w-auto">
                <Button variant="primary" className="w-full sm:w-auto">
                  Book with {doctor.name}
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
                  {doctor.rating} ({doctor.reviewCount} reviews)
                </span>
              </div>
            </div>
            <button className="text-primary hover:text-primary-container text-label-md font-bold transition-colors">
              View all reviews
            </button>
          </div>

          {/* Testimonial Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {doctor.reviews.map((review, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
              >
                <TestimonialCard
                  quote={review.text}
                  author={review.author}
                  role="Verified Patient"
                  rating={review.rating}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
