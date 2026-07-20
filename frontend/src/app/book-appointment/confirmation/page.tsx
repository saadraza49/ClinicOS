"use client";

import { use, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import Button from "@/components/button";

function ConfirmationDetails() {
  const searchParams = useSearchParams();

  // Retrieve parameters from URL
  const name = searchParams.get("name");
  const service = searchParams.get("service") || "General Consultation";
  const doctor = searchParams.get("doctor") || "Dr. Elena Rodriguez";
  const dateRaw = searchParams.get("date");
  const time = searchParams.get("time") || "10:00 AM";

  // Graceful fallback if accessed directly without session data
  if (!name || !dateRaw) {
    return (
      <div className="max-w-md w-full mx-auto px-4 py-16 text-center space-y-6 flex flex-col items-center">
        <div className="w-16 h-16 bg-surface-container-low text-primary rounded-full flex items-center justify-center border border-outline-variant/10 shadow-sm mb-2">
          <span className="material-symbols-outlined text-3xl select-none">event_busy</span>
        </div>
        <h1 className="text-headline-sm md:text-headline-md text-on-background font-bold">
          No Booking Session Found
        </h1>
        <p className="text-body-md text-on-surface-variant leading-relaxed max-w-sm">
          It looks like you landed here without an active booking confirmation. If you need to schedule an appointment, please visit our booking page.
        </p>
        <Link href="/book-appointment" className="inline-block mt-2">
          <Button variant="primary">Book an Appointment</Button>
        </Link>
      </div>
    );
  }

  // Format date nicely (e.g. Friday, Oct 27, 2026)
  let formattedDate = dateRaw;
  try {
    const parsedDate = new Date(dateRaw + "T00:00:00");
    if (!isNaN(parsedDate.getTime())) {
      formattedDate = parsedDate.toLocaleDateString("en-US", {
        weekday: "long",
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    }
  } catch (e) {
    // fallback to raw date
  }

  return (
    <div className="max-w-2xl w-full mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-surface-container-lowest rounded-3xl shadow-ambient p-8 md:p-12 flex flex-col items-center text-center border border-outline-variant/10"
      >
        {/* Success Icon */}
        <div className="w-24 h-24 mb-6 relative">
          <div className="absolute inset-0 bg-primary/10 rounded-full animate-ping opacity-75 duration-1000"></div>
          <div className="absolute inset-0 bg-primary/10 rounded-full"></div>
          <svg
            className="w-full h-full text-primary relative z-10"
            fill="none"
            viewBox="0 0 50 50"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="25" cy="25" r="23" stroke="currentColor" strokeWidth="2"></circle>
            <motion.path
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeInOut" }}
              d="M15 25 L22 32 L35 18"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="3"
            ></motion.path>
          </svg>
        </div>

        {/* Title */}
        <h1 className="text-headline-md md:text-display-lg-mobile lg:text-headline-md text-primary mb-3 font-bold leading-tight">
          Your Appointment is Confirmed!
        </h1>
        <p className="text-body-lg text-on-surface-variant mb-8 max-w-lg mx-auto">
          We're looking forward to seeing you, {name}. A confirmation email and SMS have been sent to you.
        </p>

        {/* Summary Card */}
        <div className="w-full bg-surface-container-low rounded-2xl p-6 mb-8 text-left shadow-sm border border-outline-variant/20">
          <h3 className="text-headline-sm text-primary mb-4 border-b border-outline-variant/30 pb-2 font-bold text-lg">
            Booking Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start gap-3">
              <span className="material-symbols-outlined text-secondary mt-0.5" style={{ fontVariationSettings: "'FILL' 0" }}>
                stethoscope
              </span>
              <div>
                <p className="text-label-sm text-on-surface-variant uppercase tracking-wider text-xs">Service</p>
                <p className="text-body-md text-on-surface font-semibold">{service}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="material-symbols-outlined text-secondary mt-0.5" style={{ fontVariationSettings: "'FILL' 0" }}>
                medical_information
              </span>
              <div>
                <p className="text-label-sm text-on-surface-variant uppercase tracking-wider text-xs">Doctor</p>
                <p className="text-body-md text-on-surface font-semibold">{doctor}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="material-symbols-outlined text-primary mt-0.5" style={{ fontVariationSettings: "'FILL' 0" }}>
                calendar_month
              </span>
              <div>
                <p className="text-label-sm text-on-surface-variant uppercase tracking-wider text-xs">Date &amp; Time</p>
                <p className="text-body-md text-on-surface font-semibold">
                  {formattedDate}
                  <br />
                  {time}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="material-symbols-outlined text-primary mt-0.5" style={{ fontVariationSettings: "'FILL' 0" }}>
                location_on
              </span>
              <div>
                <p className="text-label-sm text-on-surface-variant uppercase tracking-wider text-xs">Location</p>
                <p className="text-body-md text-on-surface font-semibold">
                  123 Wellness Way
                  <br />
                  Suite 200
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
          <Button
            variant="outline"
            onClick={() => alert("Added to calendar!")}
            className="flex items-center justify-center gap-2 bg-surface-container-lowest"
          >
            <span className="material-symbols-outlined">edit_calendar</span>
            Add to Calendar
          </Button>
          <Link href="/" className="inline-block">
            <Button variant="primary" className="w-full">
              Return to Home
            </Button>
          </Link>
        </div>

        {/* Support Reassurance Footer */}
        <div className="mt-8 pt-6 border-t border-outline-variant/20 w-full text-center">
          <p className="text-body-md text-on-surface-variant flex items-center justify-center gap-1.5 text-sm">
            <span className="material-symbols-outlined text-secondary text-lg">info</span>
            Need to make changes? Call us at (555) 123-4567.
          </p>
        </div>
      </motion.div>
    </div>
  );
}

export default function ConfirmationPage() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-background py-8">
      <Suspense
        fallback={
          <div className="flex flex-col items-center justify-center">
            <div className="spinner animate-spin border-3 border-t-primary border-primary/30 rounded-full w-8 h-8 mb-4"></div>
            <p className="text-body-md text-on-surface-variant font-medium">Loading confirmation details...</p>
          </div>
        }
      >
        <ConfirmationDetails />
      </Suspense>
    </div>
  );
}
