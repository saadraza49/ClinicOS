"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function PrivacyPolicyPage() {
  const sections = [
    { id: "introduction", label: "Introduction" },
    { id: "data-collection", label: "Data Collection" },
    { id: "usage", label: "Usage of Information" },
    { id: "security", label: "Data Security" },
    { id: "rights", label: "Your Rights" },
    { id: "contact", label: "Contact Us" },
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
            Privacy Policy
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
                Table of Contents
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
              
              <section id="introduction" className="scroll-mt-28">
                <p>
                  At LuminaHealth Clinic, we are committed to providing you with the highest quality healthcare while respecting your privacy and protecting your personal and medical information. This Privacy Policy outlines our practices concerning the collection, use, and safeguarding of your data when you interact with our services, both in-person and online.
                </p>
              </section>

              <section id="data-collection" className="scroll-mt-28">
                <h2 className="text-headline-md text-on-surface mb-6 border-b border-outline-variant/10 pb-3 font-bold">
                  Data Collection
                </h2>
                <p className="mb-4">
                  We collect information that is necessary to provide you with medical care, process payments, and improve our services. This may include:
                </p>
                <ul className="list-disc pl-6 space-y-3 mb-4 font-medium text-body-md text-on-surface-variant">
                  <li>
                    <strong className="text-on-surface">Personal Identification Information:</strong> Name, date of birth, contact details, and government-issued IDs.
                  </li>
                  <li>
                    <strong className="text-on-surface">Medical History &amp; Records:</strong> Previous diagnoses, current symptoms, treatment plans, and laboratory test results.
                  </li>
                  <li>
                    <strong className="text-on-surface">Financial Information:</strong> Insurance details, billing addresses, and payment transaction metadata.
                  </li>
                  <li>
                    <strong className="text-on-surface">Technical Access Logs:</strong> Portal login timestamps, IP addresses, cookie preferences, and screen resolution metrics.
                  </li>
                </ul>
              </section>

              <section id="usage" className="scroll-mt-28">
                <h2 className="text-headline-md text-on-surface mb-6 border-b border-outline-variant/10 pb-3 font-bold">
                  Usage of Information
                </h2>
                <p className="mb-4">
                  Your information is utilized strictly for care coordination and clinic operations:
                </p>
                <ul className="list-disc pl-6 space-y-3 font-medium text-body-md text-on-surface-variant">
                  <li>To deliver and personalize healthcare services, treatments, and prescriptions.</li>
                  <li>To communicate with you regarding appointments, test results, and critical clinic announcements.</li>
                  <li>To process insurance billing, direct billing collections, and administrative clearances.</li>
                  <li>To comply with regulatory standards (e.g., CQC guidance, HIPAA, and medical audit practices).</li>
                </ul>
              </section>

              <section id="security" className="scroll-mt-28">
                <h2 className="text-headline-md text-on-surface mb-6 border-b border-outline-variant/10 pb-3 font-bold">
                  Data Security
                </h2>
                <p>
                  We implement robust physical and digital security protocols to secure your records. Patient records are encrypted both at rest and in transit, and access controls restrict information to licensed care staff directly involved in your treatment plan. Regular audits are conducted to identify and mitigate operational vulnerabilities.
                </p>
              </section>

              <section id="rights" className="scroll-mt-28">
                <h2 className="text-headline-md text-on-surface mb-6 border-b border-outline-variant/10 pb-3 font-bold">
                  Your Rights
                </h2>
                <p className="mb-4">
                  As a LuminaHealth patient, you hold key rights regarding your data:
                </p>
                <ul className="list-disc pl-6 space-y-3 font-medium text-body-md text-on-surface-variant">
                  <li>
                    <strong className="text-on-surface">Right to Access:</strong> Request a complete copy of your digital medical health file.
                  </li>
                  <li>
                    <strong className="text-on-surface">Right to Correction:</strong> Request corrections to any outdated or incomplete records.
                  </li>
                  <li>
                    <strong className="text-on-surface">Right to Deletion:</strong> Request removal of portal account details (excluding legal medical archives).
                  </li>
                </ul>
              </section>

              <section id="contact" className="scroll-mt-28 bg-surface-container-low p-6 rounded-2xl border border-primary/20">
                <h2 className="text-headline-sm text-primary mb-4 flex items-center gap-2 font-bold">
                  <span className="material-symbols-outlined select-none" style={{ fontVariationSettings: "'FILL' 1" }}>
                    contact_support
                  </span>
                  Contact Us
                </h2>
                <p className="mb-4 text-body-md font-medium text-on-surface-variant">
                  If you have questions, concerns, or requests regarding this Privacy Policy or your personal data, please contact our Data Protection Officer:
                </p>
                <div className="flex flex-col gap-2 font-medium text-body-md text-on-surface">
                  <p>
                    <strong className="text-on-surface-variant">Email:</strong> privacy@luminahealth.com
                  </p>
                  <p>
                    <strong className="text-on-surface-variant">Phone:</strong> +1 (555) 123-4567
                  </p>
                  <p>
                    <strong className="text-on-surface-variant">Address:</strong> 123 Healing Way, Wellness District, CA 90210
                  </p>
                </div>
              </section>

            </div>
          </article>

        </div>
      </section>
    </div>
  );
}
