"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import Button from "@/components/button";
import ServiceCard from "@/components/service-card";
import TrustBar from "@/components/trust-bar";

// Services Data from Stitch Design
const services = [
  {
    title: "General Practice",
    description: "Routine check-ups, preventative care, and managing common illnesses.",
    icon: "medical_services",
    slug: "general-practice",
    accentColor: "primary" as const,
  },
  {
    title: "Pediatrics",
    description: "Specialized care for infants, children, and adolescents in a welcoming setting.",
    icon: "child_care",
    slug: "pediatrics",
    accentColor: "secondary" as const,
  },
  {
    title: "Cardiology",
    description: "Expert diagnosis and management of heart and cardiovascular conditions.",
    icon: "favorite",
    slug: "cardiology",
    accentColor: "primary" as const,
  },
  {
    title: "Dental Care",
    description: "Comprehensive dentistry for a healthy, confident smile.",
    icon: "dentistry", // Note: dentistry maps to dentist-style icon in Material symbols, if not dentistry is also a valid text key.
    slug: "dental-care",
    accentColor: "primary" as const,
  },
  {
    title: "Wellness",
    description: "Holistic approaches including nutrition counseling and stress management.",
    icon: "spa",
    slug: "wellness",
    accentColor: "secondary" as const,
  },
  {
    title: "Diagnostics",
    description: "State-of-the-art imaging and laboratory services for accurate results.",
    icon: "science",
    slug: "diagnostics",
    accentColor: "primary" as const,
  },
];

// Why Choose Us Data
const features = [
  {
    title: "Same-day Care",
    description: "Because your health can't always wait. We prioritize urgent needs.",
    icon: "calendar_clock",
  },
  {
    title: "Experienced Doctors",
    description: "Board-certified professionals dedicated to continuous learning.",
    icon: "stethoscope",
  },
  {
    title: "Transparent Pricing",
    description: "No hidden fees. Clear communication about costs before treatment.",
    icon: "receipt_long",
  },
  {
    title: "Modern Facility",
    description: "Equipped with the latest technology in a calming, clean environment.",
    icon: "apartment",
  },
];

export default function Home() {
  return (
    <div className="overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative pt-12 pb-20 px-4 md:px-6 max-w-7xl mx-auto overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-surface-container-high rounded-full mb-6 shadow-sm">
              <span className="material-symbols-outlined text-primary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
                verified
              </span>
              <span className="text-label-md text-primary font-medium">Top Rated Clinic 2026</span>
            </div>
            <h1 className="text-display-lg-mobile md:text-display-lg text-on-background mb-6 max-w-lg leading-tight font-bold">
              Your Health, <br />
              <span className="text-primary">Our Heart.</span>
            </h1>
            <p className="text-body-lg text-on-surface-variant mb-8 max-w-md">
              Compassionate, modern care for you and your family. Experience healthcare designed around your comfort and well-being.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/book-appointment">
                <Button variant="primary">Book Appointment</Button>
              </Link>
              <a href="tel:+15551234567">
                <Button variant="outline">Call Now</Button>
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
            className="relative"
          >
            {/* Main Doctor Image */}
            <div className="relative w-full aspect-[4/5] md:aspect-square rounded-[2rem] overflow-hidden shadow-ambient">
              <img
                className="w-full h-full object-cover"
                alt="Doctor smiling warmly at patient"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCrxcvCmpCjISwmEnXT08rlKGREMO9Ebd64CE5d-fx2bWVaTN97wwa11eKWdimNq8f8C7-2BbBdTv3wcvWxTMiEI14yWFqriYP7KEcl9qwocwXnx_ivfA8Ns0aKuySw0xZFkCAG9vcR_NdJ8umGPZLmNn7r0K6glnSCG1HfahXY2K8TuOlbeg1OEyuIIWPbnBWukH-VYjcO_82UgtrbaYSjNwlr95vm4cVpBFYsocA81d5s8b_pVeJ7B2L_4Qy_6kpzz7ClGZ-93eLr"
              />
            </div>
            {/* Floating Satisfaction Badge */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="absolute -bottom-6 -left-6 bg-surface-container-lowest p-6 rounded-2xl shadow-ambient hidden md:flex items-center gap-4 border border-outline-variant/10"
            >
              <div className="w-12 h-12 rounded-full bg-primary-container flex items-center justify-center">
                <span className="material-symbols-outlined text-on-primary-container" style={{ fontVariationSettings: "'FILL' 1" }}>
                  star
                </span>
              </div>
              <div>
                <p className="text-headline-sm text-on-background font-bold">4.9/5</p>
                <p className="text-label-sm text-on-surface-variant">Patient Satisfaction</p>
              </div>
            </motion.div>
          </motion.div>
        </div>

        <TrustBar className="mt-20 pt-12 border-t border-outline-variant/30" />
      </section>

      {/* Why Choose Us */}
      <section className="py-20 px-4 md:px-6 bg-surface-container-lowest">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-headline-md text-on-background mb-4 font-bold">Why Choose LuminaHealth</h2>
            <p className="text-body-lg text-on-surface-variant max-w-2xl mx-auto">
              We blend cutting-edge medical expertise with genuine human warmth to provide an unparalleled healthcare experience.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-surface-container-lowest rounded-2xl p-8 shadow-ambient hover:shadow-ambient-hover transition-all duration-300 hover:-translate-y-2 group border border-outline-variant/10"
              >
                <div className="w-14 h-14 rounded-full bg-surface-container flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <span className="material-symbols-outlined text-primary text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                    {feature.icon}
                  </span>
                </div>
                <h3 className="text-headline-sm text-on-background mb-3 font-semibold">{feature.title}</h3>
                <p className="text-body-md text-on-surface-variant leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Preview */}
      <section className="py-20 px-4 md:px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="flex flex-col md:flex-row justify-between items-end mb-12"
          >
            <div>
              <h2 className="text-headline-md text-on-background mb-4 font-bold">Comprehensive Services</h2>
              <p className="text-body-lg text-on-surface-variant max-w-xl">
                From routine check-ups to specialized care, we offer a full spectrum of health services under one roof.
              </p>
            </div>
            <Link
              href="/services"
              className="hidden md:inline-flex items-center gap-2 text-label-md text-primary hover:text-primary-container transition-colors duration-200 mt-6 md:mt-0 font-bold"
            >
              View All Services
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </Link>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <ServiceCard
                  title={service.title}
                  description={service.description}
                  icon={service.icon}
                  slug={service.slug}
                  accentColor={service.accentColor}
                />
              </motion.div>
            ))}
          </div>

          <div className="md:hidden flex justify-center mt-10">
            <Link
              href="/services"
              className="inline-flex items-center gap-2 text-label-md text-primary font-bold"
            >
              View All Services
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
