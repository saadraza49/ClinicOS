"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import Image from "next/image";
import TrustBar from "@/components/trust-bar";
import CTABanner from "@/components/cta-banner";

function Counter({ target, duration = 1.5 }: { target: number; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const end = target;
    const totalSteps = 40;
    const stepTime = (duration * 1000) / totalSteps;
    const increment = Math.ceil(end / totalSteps);

    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [isInView, target, duration]);

  return <span ref={ref}>{count.toLocaleString()}</span>;
}

const values = [
  {
    icon: "favorite",
    title: "Compassion",
    description: "We treat every patient with empathy, respect, and deep understanding, recognizing the human behind the health concern.",
  },
  {
    icon: "workspace_premium",
    title: "Excellence",
    description: "We are committed to the highest standards of medical care, continuously updating our practices with the latest research.",
  },
  {
    icon: "visibility",
    title: "Transparency",
    description: "Clear, honest communication about treatments, costs, and expectations is the foundation of the trust we build with you.",
  },
  {
    icon: "accessible_forward",
    title: "Accessibility",
    description: "We strive to make premium healthcare approachable, minimizing barriers to entry and ensuring our facilities are welcoming to all.",
  },
];

const galleryImages = [
  {
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuBfY-3iX2_JLieNItWuu5Tix7uiEz8VvvBRO6DtM9rwftEtUeK4DyJjbLb9sHN1gWwPR9Gthl9kFgv16UaQV5Zmu83m7bfzC4JsKaKRXlwXYzybPKCS8_ML3XfE_03R6Tbj7OokH52RwEj6atvKQW1CcyfI9qFrRPIKCE75f48fybP_tIxmbZZTYc-JfdDF7LfBpvlvPJge9yPYPRm-znxuy9GGFCi7GGFhE1RCmyWi57uwaRH6fzlRyC4VPtCO2GgB9YItJj8aqPPH",
    alt: "LuminaHealth Reception Area",
  },
  {
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuDIY7EUlpCGU3Hcpxj6CC1XluZxKi_TXmKtdo-vBHSvLI1BTHiiYzrmyIdoPYrLTZw0fp6WWr9WVogkYvTy4Pu5POZqD7o689cmRXVn656dgvKl1ClN0fAYN-imM1f1aKM-PhS4VK-29wvY6b0wiP9hMb2YTyIR6eCV3sdbzxRuffHE7Bcv4P8FLTjYn48N4Q_VzEkES0Wxka9tdzBga77lxJMR231slBh6js4VQLOHS5DDLkeLsUuAjfbcDXbFVAkUZNPx5J7QL9aW",
    alt: "Patient Consultation Room",
  },
  {
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuCBPwEDaXTPVis32PBxq056CN3qZjRYUChUli9oI0tf5l-pfAN10-dafyNhj6yTdcG8F8B7cZX19GmmSL04zzNzYkRvzOP87TdFC5do0q0Pplvrr6CP9Y97KHLwMZ5w-i4Y-zn01Clq3ji6MaasaJuEKXa8vcHnx7tysO-gi_lPjZRfYnkw3uEhnfQsH3tNdf7UGJcPsHepUWl5Y04BRPCo7BF12w0Oi9aUBsEDkyV4m8P-GeTkPsvAiAp3wcto-OqrVzdeFi30i1tq",
    alt: "Advanced Diagnostic Suite",
  },
  {
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuAO2e8Zh6iXSXsSEUrlxyDNvZRBzpAOClhlRqwOIdMkTKv1iSS98aV0EPSkivDBsTk5ULV6OqO3TU5_ICGR5Qg1urVsrB230uPSo3EmYSgNv3KOXhkMDKKrQk0kOjwzwf2OqAIRGqtHnSM-yb0wzd3bqtZH7QADN4q8GUrCvnGWeAZGc09UkXm2Kmaoc5jDtw5dOtCfuOI8umn3FQNc_QN2tF41-jk-vpVIDCD1u1OJAXaY8UEOHBrtXN-wrYwLvFvdx1PwUEcRasvE",
    alt: "Comfortable Recovery Alcove",
  },
];

export default function AboutPage() {
  return (
    <div className="overflow-x-hidden">
      {/* Page Header Banner */}
      <section className="bg-surface-container-low py-20 px-4 md:px-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-primary-container/20 via-transparent to-transparent pointer-events-none"></div>
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-display-lg-mobile md:text-display-lg text-primary mb-4 font-bold"
          >
            About LuminaHealth
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-body-lg text-on-surface-variant max-w-2xl mx-auto leading-relaxed"
          >
            Compassionate care rooted in excellence and human connection.
          </motion.p>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-20 px-4 md:px-6 bg-surface-container-lowest">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="order-2 md:order-1"
          >
            <h2 className="text-headline-md text-primary mb-6 font-bold">Our Story</h2>
            <p className="text-body-md text-on-surface-variant mb-6 leading-relaxed">
              Founded with a vision to redefine the healthcare experience, LuminaHealth was born out of a simple belief: healthcare should feel human. We recognize that stepping into a clinic can be daunting, which is why we've purposefully designed an environment that feels more like a welcoming sanctuary than a traditional medical facility.
            </p>
            <p className="text-body-md text-on-surface-variant leading-relaxed">
              Our mission is to provide accessible, high-quality healthcare that prioritizes your comfort, dignity, and personal health goals. From our state-of-the-art diagnostic tools to our warm, naturally lit waiting areas, every detail is engineered to support your wellness journey in a space where clinical excellence meets genuine compassion.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="order-1 md:order-2 rounded-2xl overflow-hidden shadow-ambient aspect-video md:aspect-[4/3] relative"
          >
            <Image
              className="object-cover transition-transform duration-500 hover:scale-105"
              alt="Bright modern LuminaHealth clinic interior"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCrhBMP_1QTD4zBE7bKZ-zbVlvaJb2VwAJKVWhkSN5g5dKE0ZdCEueeJaBSHPsXgnIHn8jHOo5ajFbWQa_ooSCChFlhFC0qOFFxBFvOuMSHOdzhkcqHoYDnLRYV-05n2OrVgenLe17G86Riwc0MUGZB9XcPtttkKhP-ohJmzLu7jLoUDT_KLnp9Ho-ExRoAvM2hbOYgGY58tgzOLnH5XbVXfSNpT-1g9sew_DLxPNnN9US7Fm3HGcrEymnEOvFlCJuj-ktFO2KA-RfI"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </motion.div>
        </div>
      </section>

      {/* Animated Stats Counter Row */}
      <section className="py-16 px-4 md:px-6 bg-primary text-on-primary">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-display-lg-mobile md:text-display-lg font-bold mb-2">
              <Counter target={15} />
            </div>
            <div className="text-label-md text-primary-fixed uppercase tracking-wider text-xs font-semibold">
              Years of Service
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="text-display-lg-mobile md:text-display-lg font-bold mb-2">
              <Counter target={25000} />+
            </div>
            <div className="text-label-md text-primary-fixed uppercase tracking-wider text-xs font-semibold">
              Patients Treated
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="text-display-lg-mobile md:text-display-lg font-bold mb-2">
              <Counter target={12} />
            </div>
            <div className="text-label-md text-primary-fixed uppercase tracking-wider text-xs font-semibold">
              Expert Doctors
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="text-display-lg-mobile md:text-display-lg font-bold mb-2">
              <Counter target={98} />%
            </div>
            <div className="text-label-md text-primary-fixed uppercase tracking-wider text-xs font-semibold">
              Patient Satisfaction
            </div>
          </motion.div>
        </div>
      </section>

      {/* Our Values Section */}
      <section className="py-20 px-4 md:px-6 bg-background">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-headline-md text-primary mb-3 font-bold"
            >
              Our Core Values
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-body-md text-on-surface-variant max-w-2xl mx-auto"
            >
              The principles that guide our everyday interactions and long-term vision.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((val, idx) => (
              <motion.div
                key={val.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: idx * 0.05 }}
                className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm border border-outline-variant/10 hover:shadow-ambient hover:-translate-y-1 transition-all duration-300 flex flex-col"
              >
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 text-primary">
                  <span className="material-symbols-outlined text-2xl">{val.icon}</span>
                </div>
                <h3 className="text-headline-sm text-on-surface mb-2 font-bold text-lg">{val.title}</h3>
                <p className="text-body-md text-on-surface-variant text-sm leading-relaxed">{val.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Facility Gallery */}
      <section className="py-20 px-4 md:px-6 bg-surface-container-lowest border-t border-outline-variant/10">
        <div className="max-w-7xl mx-auto">
          <div className="mb-10">
            <h2 className="text-headline-md text-primary mb-2 font-bold">Our Healing Environment</h2>
            <p className="text-body-md text-on-surface-variant">Designed for tranquility and efficiency.</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {galleryImages.map((img, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: idx * 0.05 }}
                className="overflow-hidden rounded-2xl aspect-square shadow-sm border border-outline-variant/10 relative group"
              >
                <Image
                  className="object-cover transition-transform duration-500 group-hover:scale-108 cursor-pointer"
                  alt={img.alt}
                  src={img.src}
                  fill
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-12 border-t border-outline-variant/10 bg-background">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <TrustBar />
        </div>
      </section>

      {/* Booking CTA Banner */}
      <section className="px-4 md:px-6 py-20 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <CTABanner
            title="Come experience care that puts you first"
            description="Schedule your consultation today and take the first step towards a healthier, brighter future with LuminaHealth."
            buttonText="Book Appointment"
            buttonHref="/book-appointment"
          />
        </motion.div>
      </section>
    </div>
  );
}
