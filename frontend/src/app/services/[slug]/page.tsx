"use client";

import { use } from "react";
import Link from "next/link";
import { services } from "@/data/services";
import ServiceCard from "@/components/service-card";
import Button from "@/components/button";
import CTABanner from "@/components/cta-banner";
import Image from "next/image";
import { motion } from "framer-motion";

interface ServiceDetailPageProps {
  params: Promise<{ slug: string }>;
}

export default function ServiceDetailPage({ params }: ServiceDetailPageProps) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;

  const service = services.find((s) => s.slug === slug);

  if (!service) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
        <span className="material-symbols-outlined text-primary text-6xl mb-4 select-none">
          error_outline
        </span>
        <h1 className="text-headline-md font-bold mb-2">Service Not Found</h1>
        <p className="text-body-lg text-on-surface-variant max-w-md mb-8">
          We couldn't find the requested medical service. It may have been renamed or relocated.
        </p>
        <Link href="/services">
          <Button variant="primary">Return to Services</Button>
        </Link>
      </div>
    );
  }

  // Find related services from their slugs
  const relatedServices = services.filter(
    (s) => service.relatedSlugs?.includes(s.slug) && s.id !== service.id
  ).slice(0, 3);

  return (
    <div className="overflow-x-hidden">
      {/* Page Header Banner */}
      <section className="bg-surface-container py-16 px-4 md:px-6 relative overflow-hidden">
        {/* Decorative background ellipse */}
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary via-transparent to-transparent pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          {/* Breadcrumbs */}
          <nav aria-label="Breadcrumb" className="flex text-on-surface-variant text-label-sm mb-6">
            <ol className="inline-flex items-center space-x-1 md:space-x-2">
              <li className="inline-flex items-center">
                <Link href="/" className="hover:text-primary transition-colors font-semibold">
                  Home
                </Link>
              </li>
              <li>
                <div className="flex items-center">
                  <span className="material-symbols-outlined text-sm mx-1 text-on-surface-variant/50 select-none">
                    chevron_right
                  </span>
                  <Link href="/services" className="hover:text-primary transition-colors font-semibold">
                    Services
                  </Link>
                </div>
              </li>
              <li aria-current="page">
                <div className="flex items-center">
                  <span className="material-symbols-outlined text-sm mx-1 text-on-surface-variant/50 select-none">
                    chevron_right
                  </span>
                  <span className="text-primary font-semibold">
                    {service.name}
                  </span>
                </div>
              </li>
            </ol>
          </nav>

          <h1 className="text-display-lg-mobile md:text-display-lg text-on-surface mb-4 font-bold leading-tight">
            {service.name}
          </h1>
          <p className="text-body-lg text-on-surface-variant max-w-2xl leading-relaxed">
            {service.tagline}
          </p>
        </div>
      </section>

      {/* Two-column Content Section */}
      <section className="py-12 md:py-16 px-4 md:px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 items-start">
          
          {/* Left Column: Detailed Description */}
          <div className="lg:col-span-8 space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-surface-container-lowest rounded-3xl p-6 md:p-8 shadow-ambient border border-outline-variant/10"
            >
              {/* Service Hero Image */}
              <div className="w-full h-64 md:h-96 rounded-2xl overflow-hidden mb-8 relative">
                <Image
                  src={service.image}
                  alt={`Hero image for ${service.name}`}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 66vw"
                  className="object-cover"
                />
              </div>

              {/* Long description text */}
              <h2 className="text-headline-sm md:text-headline-md text-on-surface mb-4 font-bold">
                What it includes
              </h2>
              <p className="text-on-surface-variant mb-8 leading-relaxed">
                {service.longDescription}
              </p>

              {/* Checklist details with icons */}
              <ul className="space-y-6">
                {service.includes.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-4">
                    <div className="bg-primary/10 p-2.5 rounded-full text-primary shrink-0 mt-0.5 select-none">
                      <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>
                        {item.icon}
                      </span>
                    </div>
                    <div>
                      <strong className="block text-on-surface text-label-md font-bold mb-1">
                        {item.title}
                      </strong>
                      <span className="text-on-surface-variant text-sm leading-relaxed">
                        {item.description}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>

              <hr className="border-outline-variant/10 my-8" />

              {/* Who it is for */}
              <div>
                <h2 className="text-headline-sm text-on-surface mb-4 font-bold">
                  Who it's for
                </h2>
                <p className="text-on-surface-variant mb-6 leading-relaxed">
                  This health offering is ideal for individuals experiencing or seeking:
                </p>
                <div className="flex flex-wrap gap-2">
                  {service.whosItFor.map((tag) => (
                    <span
                      key={tag}
                      className="bg-surface-container text-primary-container-on-primary px-3 py-1.5 rounded-full text-label-sm border border-primary/15 font-semibold"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Column: Sticky Summary Card */}
          <div className="lg:col-span-4 relative">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="lg:sticky lg:top-24 bg-surface-container-lowest rounded-3xl p-6 shadow-ambient border border-outline-variant/10 flex flex-col gap-6"
            >
              <div className="flex justify-between items-end border-b border-outline-variant/10 pb-4">
                <div>
                  <span className="block text-on-surface-variant text-label-sm uppercase tracking-wider mb-1 font-semibold text-xs">
                    Price
                  </span>
                  <span className="text-display-lg-mobile md:text-headline-md lg:text-display-lg-mobile text-primary font-bold">
                    {service.price}
                  </span>
                </div>
                <div className="text-right">
                  <span className="block text-on-surface-variant text-label-sm uppercase tracking-wider mb-1 font-semibold text-xs">
                    Duration
                  </span>
                  <span className="text-headline-sm text-on-surface font-bold">
                    {service.duration}
                  </span>
                </div>
              </div>

              {/* Bullet Features checklist */}
              <ul className="space-y-3 text-sm text-on-surface-variant font-medium">
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-base select-none">check_circle</span>
                  In-person clinic visit
                </li>
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-base select-none">check_circle</span>
                  Same-day availability
                </li>
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-base select-none">check_circle</span>
                  Digital consultation notes
                </li>
              </ul>

              {/* Book Button */}
              <Link href={`/book-appointment?service=${service.id}`} className="w-full">
                <Button variant="primary" className="w-full justify-center py-3.5 gap-2">
                  Book This Service
                  <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </Button>
              </Link>

              {/* Trust Tag */}
              <div className="flex items-center justify-center gap-2 text-on-surface-variant text-xs mt-2 bg-surface-container-low/40 p-3 rounded-xl border border-outline-variant/10">
                <span className="material-symbols-outlined text-secondary text-lg select-none" style={{ fontVariationSettings: "'FILL' 1" }}>
                  verified_user
                </span>
                <span className="font-semibold text-xs">CQC Registered &amp; Confidential</span>
              </div>
            </motion.div>
          </div>

        </div>
      </section>

      {/* What to Expect Section */}
      <section className="py-20 bg-surface-container-lowest border-y border-outline-variant/10 px-4 md:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-headline-md text-on-surface mb-3 font-bold"
            >
              What to Expect
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-body-lg text-on-surface-variant max-w-2xl mx-auto"
            >
              A streamlined, stress-free journey from booking to follow-up care.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {service.steps.map((step, idx) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="flex flex-col items-center text-center p-6 bg-surface-container-low/40 rounded-2xl border border-outline-variant/10 relative overflow-hidden group hover:-translate-y-1 transition-all duration-300"
              >
                <div className="absolute -right-4 -top-4 w-24 h-24 bg-primary/5 rounded-full group-hover:scale-150 transition-transform duration-500 pointer-events-none"></div>
                
                {/* Step Circle Badge */}
                <div className="w-12 h-12 bg-surface-container-lowest text-primary rounded-full flex items-center justify-center shadow-sm mb-4 relative z-10 text-xl font-bold select-none border border-outline-variant/10">
                  {step.step}
                </div>

                <div className="mb-3 text-secondary p-2 bg-surface-container-lowest rounded-full shadow-sm relative z-10 select-none border border-outline-variant/5">
                  <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                    {step.icon}
                  </span>
                </div>

                <h3 className="text-label-md text-on-surface font-bold mb-2 relative z-10">
                  {step.title}
                </h3>
                <p className="text-on-surface-variant text-sm relative z-10 leading-relaxed">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Related Services Grid */}
      {relatedServices.length > 0 && (
        <section className="py-20 max-w-7xl mx-auto px-4 md:px-6">
          <h2 className="text-headline-md text-on-surface mb-8 font-bold">Related Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedServices.map((relatedService) => (
              <ServiceCard
                key={relatedService.id}
                title={relatedService.name}
                description={relatedService.shortDescription}
                icon={relatedService.icon}
                slug={relatedService.slug}
                accentColor={relatedService.accentColor}
              />
            ))}
          </div>
        </section>
      )}

      {/* Booking CTA Banner */}
      <section className="px-4 md:px-6 pb-20 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <CTABanner />
        </motion.div>
      </section>
    </div>
  );
}
