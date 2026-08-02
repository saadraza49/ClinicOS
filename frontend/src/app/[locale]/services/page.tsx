"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "@/i18n/routing";
import { getServices, getDepartments, ServiceData, DepartmentData } from "@/lib/api";
import ServiceCard from "@/components/service-card";
import Button from "@/components/button";
import FilterPills from "@/components/filter-pills";
import { useTranslations, useLocale } from "next-intl";
import { getLocalizedSpecialty } from "@/lib/translations";

const categoryImages: Record<string, string> = {
  pediatrics: "/images/services/immunization-clinic.png",
  cardiology: "/images/services/routine-checkups.png",
  dermatology: "/images/services/hayfever-allergy.png",
  dentistry: "/images/services/nutritional-planning.png",
  neurology: "/images/services/cognitive-therapy.png",
  "primary-care": "/images/services/routine-checkups.png",
  ophthalmology: "/images/services/digital-imaging.png",
  orthopedics: "/images/services/digital-imaging.png",
};

function getServiceImage(service: ServiceData): string {
  const deptSlug = service.department?.slug?.toLowerCase() || service.department_id?.toLowerCase() || "";
  if (categoryImages[deptSlug]) return categoryImages[deptSlug];
  return "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=600";
}

export default function ServicesPage() {
  const t = useTranslations("ServicesPage");
  const locale = useLocale();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [servicesList, setServicesList] = useState<ServiceData[]>([]);
  const [departmentsList, setDepartmentsList] = useState<DepartmentData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [servicesData, deptsData] = await Promise.all([
          getServices(),
          getDepartments()
        ]);
        setServicesList(servicesData);
        setDepartmentsList(deptsData);
      } catch (err) {
        console.error("Failed to fetch services/departments:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const categories = [
    { id: "all", name: getLocalizedSpecialty("All Services", locale) },
    ...departmentsList.map(d => ({ id: d.slug, name: getLocalizedSpecialty(d.name, locale) }))
  ];

  const filteredServices = selectedCategory === "all"
    ? servicesList
    : servicesList.filter(s => {
        const deptSlug = s.department?.slug;
        if (deptSlug && deptSlug.toLowerCase() === selectedCategory.toLowerCase()) return true;
        return s.name.toLowerCase().includes(selectedCategory.toLowerCase()) || 
               (s.short_description && s.short_description.toLowerCase().includes(selectedCategory.toLowerCase()));
      });

  return (
    <div className="overflow-x-hidden">
      {/* Header Banner */}
      <header className="relative bg-surface-container py-16 px-4 md:px-6 overflow-hidden">
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
            {t("title")}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-body-lg text-on-surface-variant max-w-3xl mx-auto leading-relaxed"
          >
            {t("subtitle")}
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
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 min-h-[400px]">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-surface-container-lowest rounded-2xl h-80 animate-pulse p-6">
                <div className="w-full h-40 bg-surface-container rounded-xl mb-4"></div>
                <div className="w-2/3 h-6 bg-surface-container rounded mb-2"></div>
                <div className="w-full h-12 bg-surface-container rounded"></div>
              </div>
            ))}
          </div>
        ) : (
          <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 min-h-[400px]">
            <AnimatePresence mode="popLayout">
              {filteredServices.map((service, index) => (
                <ServiceCard
                  key={service.id}
                  title={service.name}
                  description={service.short_description || "Comprehensive clinical consultation and treatment service."}
                  image={getServiceImage(service)}
                  slug={service.slug}
                  icon={service.icon}
                  price={service.price}
                  durationMinutes={service.duration_minutes}
                  departmentName={service.department?.name ? getLocalizedSpecialty(service.department.name, locale) : undefined}
                  index={index}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
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
              {t("notSureTitle")}
            </h2>
            <p className="text-body-lg text-on-surface-variant leading-relaxed">
              {t("notSureDesc")}
            </p>
          </div>

          <div className="relative z-10 flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <Link href="/book-appointment" className="w-full sm:w-auto">
              <Button variant="primary" className="w-full sm:w-auto justify-center">
                {t("bookConsultation")}
              </Button>
            </Link>
            <Link href="/contact" className="w-full sm:w-auto">
              <Button variant="outline" className="w-full sm:w-auto justify-center bg-surface-container-lowest">
                <span className="material-symbols-outlined text-primary text-[20px]">chat</span>
                {t("messageUs")}
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
