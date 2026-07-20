"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { services } from "@/data/services";
import PricingTierCard, { PricingFeature } from "@/components/pricing-tier-card";
import CTABanner from "@/components/cta-banner";

const categories = [
  {
    id: "general",
    title: "General Consultations",
    description: "Standard checkups, routine health screenings, and preventative care consultations.",
    range: "$50 - $150",
    icon: "stethoscope",
  },
  {
    id: "diagnostics",
    title: "Diagnostics & Labs",
    description: "Laboratory blood tests, modern digital x-ray imaging, and ultrasounds.",
    range: "$80 - $300",
    icon: "biotech",
  },
  {
    id: "vaccinations",
    title: "Vaccinations",
    description: "Pediatric schedules, travel immunizations, and annual influenza vaccines.",
    range: "$25 - $100",
    icon: "vaccines",
  },
  {
    id: "wellness",
    title: "Health & Wellness",
    description: "Specialized lifestyle assessments, dietary plans, and preventive care programs.",
    range: "$100 - $400",
    icon: "monitor_heart",
  },
];

const plans = [
  {
    name: "Basic",
    price: "$29",
    description: "Essential care for proactive individuals.",
    isPopular: false,
    features: [
      { text: "1 Free Consultation/yr", included: true },
      { text: "10% off Diagnostics", included: true },
      { text: "24/7 Telehealth Access", included: false },
      { text: "Priority Booking slots", included: false },
    ] as PricingFeature[],
  },
  {
    name: "Standard",
    price: "$59",
    description: "Comprehensive care for growing families.",
    isPopular: true,
    features: [
      { text: "3 Free Consultations/yr", included: true },
      { text: "20% off Diagnostics", included: true },
      { text: "24/7 Telehealth Access", included: true },
      { text: "Priority Booking slots", included: false },
    ] as PricingFeature[],
  },
  {
    name: "Premium",
    price: "$99",
    description: "Ultimate care and immediate clinical access.",
    isPopular: false,
    features: [
      { text: "Unlimited Consultations", included: true },
      { text: "50% off Diagnostics", included: true },
      { text: "24/7 Telehealth Access", included: true },
      { text: "Priority Booking slots", included: true },
    ] as PricingFeature[],
  },
];

export default function FeesPage() {
  const handleChoosePlan = (planName: string) => {
    alert(`You selected the ${planName} Plan. Booking consultation is next step!`);
  };

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
          Transparent Pricing
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-body-lg text-on-surface-variant max-w-2xl mx-auto leading-relaxed"
        >
          High-quality care with no hidden costs. We believe in providing clear, upfront pricing so you can focus on what matters most—your health.
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
            Prices may vary based on consultation complexity —{" "}
            <Link href="/contact" className="text-primary font-bold hover:underline">
              contact us
            </Link>{" "}
            for a personalized quote.
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
          <h2 className="text-headline-md text-on-surface mb-6 font-bold">Detailed Service Fees</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-outline-variant/30 text-label-sm text-on-surface-variant">
                  <th className="py-4 px-2">Service Name</th>
                  <th className="py-4 px-2">Category</th>
                  <th className="py-4 px-2 text-right">Standard Fee</th>
                </tr>
              </thead>
              <tbody>
                {services.map((service) => (
                  <tr
                    key={service.id}
                    className="border-b border-outline-variant/10 hover:bg-surface-container-low/20 transition-colors"
                  >
                    <td className="py-4 px-2 font-semibold text-on-surface">{service.name}</td>
                    <td className="py-4 px-2 text-on-surface-variant capitalize text-sm">{service.category}</td>
                    <td className="py-4 px-2 text-right font-bold text-primary">{service.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </section>

      {/* Membership Plans Section */}
      <section className="bg-surface-container-low py-20 px-4 md:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-headline-md text-on-surface mb-3 font-bold">Membership Plans</h2>
            <p className="text-body-lg text-on-surface-variant max-w-xl mx-auto">
              Choose a plan that fits your healthcare needs and enjoy premium benefits.
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
                  name={plan.name}
                  price={plan.price}
                  description={plan.description}
                  features={plan.features}
                  isPopular={plan.isPopular}
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
