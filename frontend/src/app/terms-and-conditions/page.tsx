"use client";

import { motion } from "framer-motion";

export default function TermsAndConditionsPage() {
  const sections = [
    { id: "acceptance", label: "Acceptance of Terms" },
    { id: "medical-disclaimer", label: "Medical Advice Disclaimer" },
    { id: "appointments", label: "Appointments" },
    { id: "payments", label: "Payments & Billing" },
    { id: "liability", label: "Limitation of Liability" },
  ];

  return (
    <div className="overflow-x-hidden bg-[#FAFAF7]">
      {/* Page Header Banner */}
      <section className="bg-surface-container py-16 text-center px-4 md:px-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary via-transparent to-transparent pointer-events-none"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-display-lg-mobile md:text-display-lg text-primary mb-4 font-bold"
          >
            Terms &amp; Conditions
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-body-lg text-on-surface-variant font-semibold"
          >
            Last updated: October 20, 2023
          </motion.p>
        </div>
      </section>

      {/* Main Content Layout */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Sticky TOC (Left Column) */}
          <aside className="hidden lg:block lg:col-span-3 sticky top-28">
            <div className="bg-surface-container-lowest rounded-3xl p-6 shadow-ambient border border-outline-variant/10">
              <h3 className="text-label-sm uppercase text-primary tracking-wider mb-4 font-bold">
                Contents
              </h3>
              <nav className="flex flex-col gap-2.5 text-body-md">
                {sections.map((sec) => (
                  <a
                    key={sec.id}
                    href={`#${sec.id}`}
                    className="text-on-surface-variant hover:text-primary transition-all py-1.5 border-l-2 border-transparent hover:border-primary pl-3 font-semibold text-sm hover:translate-x-1 inline-block"
                  >
                    {sec.label}
                  </a>
                ))}
              </nav>
            </div>
          </aside>

          {/* Legal Text (Right Column) */}
          <article className="lg:col-span-9 bg-surface-container-lowest rounded-3xl p-6 md:p-12 shadow-ambient border border-outline-variant/10">
            <div className="space-y-12 text-on-surface-variant text-body-lg leading-relaxed">
              
              <p className="font-body-lg text-on-surface-variant leading-relaxed">
                Please read these Terms and Conditions carefully before using the LuminaHealth website or services. Your access to and use of our services is conditioned on your acceptance of and compliance with these Terms.
              </p>

              <section id="acceptance" className="scroll-mt-28">
                <h2 className="text-headline-sm text-primary mb-4 flex items-center gap-2 border-b border-outline-variant/10 pb-3 font-bold">
                  <span className="material-symbols-outlined text-secondary select-none" style={{ fontVariationSettings: "'FILL' 1" }}>
                    handshake
                  </span>
                  Acceptance of Terms
                </h2>
                <p>
                  By accessing our facilities or using our digital platforms, you agree to be bound by these terms. If you disagree with any part of the terms, you may not access our services.
                </p>
              </section>

              <section id="medical-disclaimer" className="scroll-mt-28">
                <h2 className="text-headline-sm text-primary mb-4 flex items-center gap-2 border-b border-outline-variant/10 pb-3 font-bold">
                  <span className="material-symbols-outlined text-secondary select-none" style={{ fontVariationSettings: "'FILL' 1" }}>
                    stethoscope
                  </span>
                  Medical Advice Disclaimer
                </h2>
                <p className="mb-4">
                  The content provided through LuminaHealth's digital platforms is for informational purposes only. It is not intended to be a substitute for professional medical advice, diagnosis, or treatment.
                </p>
                <div className="bg-surface-container-low p-4 rounded-xl border-l-4 border-secondary mt-4">
                  <p className="text-body-md text-on-surface-variant font-medium">
                    <strong className="text-on-surface">Emergency Notice:</strong> If you think you may have a medical emergency, call your doctor or local emergency services immediately.
                  </p>
                </div>
              </section>

              <section id="appointments" className="scroll-mt-28">
                <h2 className="text-headline-sm text-primary mb-4 flex items-center gap-2 border-b border-outline-variant/10 pb-3 font-bold">
                  <span className="material-symbols-outlined text-secondary select-none" style={{ fontVariationSettings: "'FILL' 1" }}>
                    calendar_month
                  </span>
                  Appointments
                </h2>
                <p className="mb-4">
                  When scheduling an appointment, you agree to provide accurate and current information. We reserve the right to cancel or reschedule appointments due to unforeseen clinical emergencies.
                </p>
                <ul className="list-disc pl-6 space-y-2 text-body-md text-on-surface-variant font-semibold">
                  <li>Cancellations must be made at least 24 hours in advance.</li>
                  <li>Late arrivals may result in reduced consultation time.</li>
                </ul>
              </section>

              <section id="payments" className="scroll-mt-28">
                <h2 className="text-headline-sm text-primary mb-4 flex items-center gap-2 border-b border-outline-variant/10 pb-3 font-bold">
                  <span className="material-symbols-outlined text-secondary select-none" style={{ fontVariationSettings: "'FILL' 1" }}>
                    credit_card
                  </span>
                  Payments &amp; Billing
                </h2>
                <p>
                  Payment is expected at the time of service unless prior arrangements have been made or insurance coverage has been verified.
                </p>
              </section>

              <section id="liability" className="scroll-mt-28">
                <h2 className="text-headline-sm text-primary mb-4 flex items-center gap-2 border-b border-outline-variant/10 pb-3 font-bold">
                  <span className="material-symbols-outlined text-secondary select-none" style={{ fontVariationSettings: "'FILL' 1" }}>
                    gavel
                  </span>
                  Limitation of Liability
                </h2>
                <p>
                  In no event shall LuminaHealth Clinic, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages.
                </p>
              </section>

            </div>
          </article>

        </div>
      </section>
    </div>
  );
}
