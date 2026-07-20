"use client";

import { motion } from "framer-motion";
import { doctors } from "@/data/doctors";
import DoctorCard from "@/components/doctor-card";
import CTABanner from "@/components/cta-banner";

export default function DoctorsPage() {
  return (
    <div className="overflow-x-hidden">
      {/* Header Banner */}
      <section className="bg-surface-container-lowest py-20 px-4 md:px-6 relative overflow-hidden border-b border-outline-variant/10">
        {/* Subtle atmospheric blobs for human warmth */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-secondary/5 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4 pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-display-lg-mobile md:text-display-lg text-on-surface mb-4 font-bold"
          >
            Meet Our Clinical Team
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-body-lg text-on-surface-variant max-w-2xl mx-auto leading-relaxed"
          >
            A diverse group of world-class healthcare professionals dedicated to providing you with compassionate, personalized, and exceptional care.
          </motion.p>
        </div>
      </section>

      {/* Team Grid */}
      <section className="px-4 md:px-6 py-20 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {doctors.map((doctor, index) => (
            <motion.div
              key={doctor.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
            >
              <DoctorCard
                name={doctor.name}
                specialty={doctor.specialty}
                credentials={doctor.qualifications}
                image={doctor.photo}
                slug={doctor.slug}
              />
            </motion.div>
          ))}
        </div>
      </section>

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
