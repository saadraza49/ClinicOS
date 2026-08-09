"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { getServices, ServiceData } from "@/lib/api";
import PricingTierCard, { PricingFeature } from "@/components/pricing-tier-card";
import CTABanner from "@/components/cta-banner";
import { getLocalizedDepartmentName, getLocalizedServiceTitle, getLocalizedPlanName, getLocalizedPlanDesc, getLocalizedFeatureText } from "@/lib/translations";



const plans = [
  {
    name: "Basic",
    price: "2,500 PKR",
    description: "Essential care for proactive individuals.",
    isPopular: false,
    features: [
      { text: "1 Free Consultation/yr", included: true },
      { text: "10% off Diagnostics", included: true },
      { text: "Telehealth Access", included: false },
      { text: "Priority Booking slots", included: false },
    ] as PricingFeature[],
  },
  {
    name: "Standard",
    price: "5,000 PKR",
    description: "Comprehensive care for growing families.",
    isPopular: true,
    features: [
      { text: "3 Free Consultations/yr", included: true },
      { text: "20% off Diagnostics", included: true },
      { text: "Telehealth Access", included: true },
      { text: "Priority Booking slots", included: false },
    ] as PricingFeature[],
  },
  {
    name: "Premium",
    price: "9,500 PKR",
    description: "Ultimate care and immediate clinical access.",
    isPopular: false,
    features: [
      { text: "Unlimited Consultations", included: true },
      { text: "50% off Diagnostics", included: true },
      { text: "Telehealth Access", included: true },
      { text: "Priority Booking slots", included: true },
    ] as PricingFeature[],
  },
];

export default function FeesPage() {
  const t = useTranslations("FeesPage");
  const locale = useLocale();
  const [servicesList, setServicesList] = useState<ServiceData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadServices() {
      try {
        const data = await getServices();
        setServicesList(data);
      } catch (err) {
        console.error("Failed to fetch services for fee table:", err);
      } finally {
        setLoading(false);
      }
    }
    loadServices();
  }, []);

  const handleChoosePlan = (planName: string) => {
    alert(`You selected the ${planName} Plan. Booking consultation is next step!`);
  };

  const categories = [
    {
      id: "general",
      title: t("generalTitle"),
      description: t("generalDesc"),
      range: "1,500 PKR",
      icon: "stethoscope",
    },
    {
      id: "diagnostics",
      title: t("diagnosticsTitle"),
      description: t("diagnosticsDesc"),
      range: "2,000 PKR - 5,000 PKR",
      icon: "biotech",
    },
    {
      id: "vaccinations",
      title: t("vaccinationsTitle"),
      description: t("vaccinationsDesc"),
      range: "1,000 PKR - 3,500 PKR",
      icon: "vaccines",
    },
    {
      id: "wellness",
      title: t("specialistTitle"),
      description: t("specialistDesc"),
      range: "2,500 PKR",
      icon: "monitor_heart",
    },
  ];

  return (
    <div className="overflow-x-hidden">
      {/* Header Banner */}
      <section className="py-20 px-4 md:px-6 max-w-7xl mx-auto text-center">
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-display-lg-mobile md:text-display-lg text-on-surface mb-6 font-bold"
        >
          {t("title")}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-body-lg text-on-surface-variant max-w-2xl mx-auto leading-relaxed"
        >
          {t("subtitle")}
        </motion.p>
      </section>

      {/* Important Note Banner */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 mb-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-surface-container-high rounded-2xl p-5 flex items-start sm:items-center gap-3 border border-outline-variant/10 shadow-sm"
        >
          <span className="material-symbols-outlined text-primary text-2xl flex-shrink-0 select-none">
            info
          </span>
          <p className="text-body-md text-on-surface leading-relaxed">
            {t("infoNote")}
            <Link href="/contact" className="text-primary font-bold hover:underline">
              {t("contactLink")}
            </Link>{" "}
            {t("forQuote")}
          </p>
        </motion.div>
      </div>

      {/* Service Pricing Categories Grid */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 mb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat, idx) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: idx * 0.05 }}
              className="bg-surface-container-lowest rounded-3xl p-6 shadow-ambient hover:shadow-interactive hover:-translate-y-1 transition-all duration-300 border border-outline-variant/10 flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4 text-primary">
                  <span className="material-symbols-outlined text-2xl">{cat.icon}</span>
                </div>
                <h3 className="text-headline-sm text-on-surface mb-2 font-bold text-lg">{cat.title}</h3>
                <p className="text-body-md text-on-surface-variant mb-6 text-sm leading-relaxed">
                  {cat.description}
                </p>
              </div>
              <div className="mt-auto pt-4 border-t border-outline-variant/5">
                <span className="text-headline-sm font-bold text-primary">{cat.range}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Detailed Services Pricing Table */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 mb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-surface-container-lowest rounded-3xl p-6 md:p-8 shadow-ambient border border-outline-variant/10"
        >
          <h2 className="text-headline-md text-on-surface mb-6 font-bold">{t("detailedFeesTitle")}</h2>
          
          {loading ? (
            <div className="space-y-4 animate-pulse py-4">
              <div className="h-8 bg-surface-container rounded w-full"></div>
              <div className="h-8 bg-surface-container rounded w-full"></div>
              <div className="h-8 bg-surface-container rounded w-full"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-outline-variant/30 text-label-sm text-on-surface-variant">
                    <th className="py-4 px-2">{t("serviceNameHeader")}</th>
                    <th className="py-4 px-2">{t("departmentHeader")}</th>
                    <th className="py-4 px-2">{t("durationHeader")}</th>
                    <th className="py-4 px-2 text-right">{t("standardFeeHeader")}</th>
                  </tr>
                </thead>
                <tbody>
                  {servicesList.map((service) => (
                    <tr
                      key={service.id}
                      className="border-b border-outline-variant/10 hover:bg-surface-container-low/20 transition-colors"
                    >
                      <td className="py-4 px-2 font-semibold text-on-surface">
                        {getLocalizedServiceTitle(service.name, locale)}
                      </td>
                      <td className="py-4 px-2 text-on-surface-variant capitalize text-sm">
                        {getLocalizedDepartmentName(service.department?.name || "General Care", locale)}
                      </td>
                      <td className="py-4 px-2 text-on-surface-variant text-sm">
                        {service.duration_minutes} {t("minsUnit")}
                      </td>
                      <td className="py-4 px-2 text-right font-bold text-primary">
                        {service.price.toLocaleString()} PKR
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      </section>

      {/* Membership Plans Section */}
      <section className="bg-surface-container-low py-20 px-4 md:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-headline-md text-on-surface mb-3 font-bold">{t("membershipPlansTitle")}</h2>
            <p className="text-body-lg text-on-surface-variant max-w-xl mx-auto">
              {t("membershipPlansSubtitle")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center max-w-5xl mx-auto">
            {plans.map((plan, idx) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className="h-full"
              >
                <PricingTierCard
                  name={getLocalizedPlanName(plan.name, locale)}
                  price={plan.price}
                  description={getLocalizedPlanDesc(plan.description, plan.name, locale)}
                  features={plan.features.map((f) => ({ ...f, text: getLocalizedFeatureText(f.text, locale) }))}
                  isPopular={plan.isPopular}
                  popularText={t("mostPopular")}
                  buttonText={t("choosePlan")}
                  onChoose={() => handleChoosePlan(plan.name)}
                />
              </motion.div>
            ))}
          </div>
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
          <CTABanner />
        </motion.div>
      </section>
    </div>
  );
}
