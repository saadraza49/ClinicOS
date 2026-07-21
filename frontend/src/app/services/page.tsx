"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { services } from "@/data/services";
import ServiceCard from "@/components/service-card";
import Button from "@/components/button";
import FilterPills from "@/components/filter-pills";

const categories = [
  { id: "all", name: "All Services" },
  { id: "general", name: "General" },
  { id: "diagnostics", name: "Diagnostics" },
  { id: "vaccinations", name: "Vaccinations" },
  { id: "mental-health", name: "Mental Health" },
  { id: "wellness", name: "Wellness" },
];

export default function ServicesPage() {
  const [selectedCategory, setSelectedCategory] = useState("all");

  const filteredServices =
    selectedCategory === "all"
      ? services
      : services.filter((s) => s.category === selectedCategory);

  return (
    <div className="overflow-x-hidden">
      {/* Header Banner */}
      <header className="relative bg-surface-container py-16 px-4 md:px-6 overflow-hidden">
        {/* Subtle abstract medical background pattern */}
        <div
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage:
              "url('https://lh3.googleusercontent.com/aida-public/AB6AXuA0Z1CVgJ2ymGecmTuiwa0sb6qGs9CL_y7dHdzdoNbgxiAabMqC_tANDlyfP6vGm5pmmosbeuBS1lwigj217jdrnu074Yo427RlWnz0KGiSpt24ujUV-vZzj1TJiQUs8l8GI0ItDEb8WVYW4Cp3-9nzVTLJSM0lXLzce127bX04wIqa9EwoOzbdTXsLvyc9XTrrJ3Zp0_B3xPlvQ2989mQqWR6L0d7XcENiPCEW-iNOFSGa-ejFaFdtU1ZXKE2n1sII13eOrX_DiK2R')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        ></div>
        <div className="max-w-7xl mx-auto relative z-10 text-center flex flex-col items-center">
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="material-symbols-outlined text-primary text-[48px] mb-4 select-none"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            medical_services
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-display-lg-mobile md:text-display-lg text-on-background mb-4 max-w-2xl font-bold"
          >
            Our Specialized Services
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-body-lg text-on-surface-variant max-w-3xl mx-auto leading-relaxed"
          >
            Comprehensive, human-centric healthcare tailored to your unique needs. We blend clinical excellence with a compassionate approach to support every stage of your health journey.
          </motion.p>
        </div>
      </header>

      {/* Services Grid Section */}
      <section className="py-12 px-4 md:px-6 max-w-7xl mx-auto">
        {/* Category Filters */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mb-12"
        >
          <FilterPills
            categories={categories}
            selectedId={selectedCategory}
            onSelect={setSelectedCategory}
          />
        </motion.div>

        {/* Services Grid */}
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 min-h-[400px]">
          <AnimatePresence mode="popLayout">
            {filteredServices.map((service, index) => (
              <motion.div
                key={service.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 10 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
              >
                <ServiceCard
                  title={service.name}
                  description={service.shortDescription}
                  icon={service.icon}
                  slug={service.slug}
                  accentColor={service.accentColor}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </section>

      {/* Coordinator Help Banner */}
      <section className="px-4 md:px-6 pb-20 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="bg-surface-container rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden border border-outline-variant/10"
        >
          <div className="absolute -right-20 -top-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute -left-10 -bottom-10 w-48 h-48 bg-secondary/5 rounded-full blur-2xl pointer-events-none"></div>

          <div className="relative z-10 max-w-xl text-center md:text-left">
            <h2 className="text-headline-md text-on-background mb-4 font-bold">
              Not sure which service you need?
            </h2>
            <p className="text-body-lg text-on-surface-variant leading-relaxed">
              Our care coordinators are available to help you navigate our offerings and find the right specialist for your symptoms.
            </p>
          </div>

          <div className="relative z-10 flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <Link href="/book-appointment" className="w-full sm:w-auto">
              <Button variant="primary" className="w-full sm:w-auto justify-center">
                Book a Consultation
              </Button>
            </Link>
            <Link href="/contact" className="w-full sm:w-auto">
              <Button variant="outline" className="w-full sm:w-auto justify-center bg-surface-container-lowest">
                <span className="material-symbols-outlined text-primary text-[20px]">chat</span>
                Message Us
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
