"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getDoctors, DoctorData } from "@/lib/api";
import DoctorCard from "@/components/doctor-card";
import CTABanner from "@/components/cta-banner";

export default function DoctorsPage() {
  const [doctorsList, setDoctorsList] = useState<DoctorData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDoctors() {
      try {
        const data = await getDoctors();
        setDoctorsList(data);
      } catch (err) {
        console.error("Failed to fetch doctors from DB:", err);
      } finally {
        setLoading(false);
      }
    }
    loadDoctors();
  }, []);

  return (
    <div className="overflow-x-hidden">
      {/* Header Banner */}
      <section className="bg-surface-container-lowest py-20 px-4 md:px-6 relative overflow-hidden border-b border-outline-variant/10">
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
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-surface-container-lowest rounded-2xl p-6 h-80 animate-pulse flex flex-col items-center">
                <div className="w-32 h-32 rounded-full bg-surface-container mb-4"></div>
                <div className="w-24 h-6 bg-surface-container rounded-full mb-3"></div>
                <div className="w-36 h-5 bg-surface-container rounded mb-2"></div>
                <div className="w-28 h-4 bg-surface-container rounded mb-6"></div>
                <div className="w-full h-10 bg-surface-container rounded-full mt-auto"></div>
              </div>
            ))}
          </div>
        ) : doctorsList.length === 0 ? (
          <div className="bg-surface-container-lowest rounded-3xl p-12 text-center border border-outline-variant/10 flex flex-col items-center">
            <span className="material-symbols-outlined text-primary text-5xl mb-3 select-none">stethoscope</span>
            <h3 className="text-headline-sm font-bold text-on-surface mb-2">No Doctors Found in Database</h3>
            <p className="text-body-md text-on-surface-variant max-w-md">
              There are currently no doctor records available in the database. Please verify your backend server or database connection.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {doctorsList.map((doctor, index) => {
              const workingDays = doctor.schedules && doctor.schedules.length > 0
                ? doctor.schedules.map((s) => s.day_of_week)
                : ["Mon", "Wed", "Fri"];

              return (
                <motion.div
                  key={doctor.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                >
                  <DoctorCard
                    id={doctor.id}
                    name={doctor.full_name}
                    specialty={doctor.specialty}
                    credentials={doctor.qualifications || "Medical Specialist"}
                    image={doctor.photo || "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=400"}
                    slug={doctor.slug}
                    experience_years={doctor.experience_years}
                    consultation_fee={doctor.consultation_fee}
                    rating={doctor.rating}
                    review_count={doctor.review_count}
                    working_days={workingDays}
                  />
                </motion.div>
              );
            })}
          </div>
        )}
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
