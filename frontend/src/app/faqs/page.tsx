"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { faqs } from "@/data/faqs";
import Accordion from "@/components/accordion";
import CTABanner from "@/components/cta-banner";

const categories = [
  { id: "appointments", name: "Appointments" },
  { id: "billing", name: "Billing & Insurance" },
  { id: "services", name: "Services" },
  { id: "general", name: "General" },
];

export default function FAQsPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredFaqs = faqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const hasResults = filteredFaqs.length > 0;

  return (
    <div className="overflow-x-hidden">
      {/* Hero Section */}
      <section className="px-4 md:px-6 py-16 max-w-7xl mx-auto text-center">
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-display-lg-mobile md:text-display-lg text-on-background mb-4 font-bold"
        >
          Frequently Asked Questions
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-body-lg text-on-surface-variant max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          Find answers to common questions about appointments, insurance, and our clinical services to help you make informed healthcare decisions.
        </motion.p>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="max-w-xl mx-auto relative group"
        >
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline-variant group-focus-within:text-primary transition-colors select-none">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-4 rounded-full border border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary/20 bg-surface-container-lowest shadow-sm outline-none text-body-md text-on-background placeholder:text-outline transition-all"
            placeholder="Search for questions or topics..."
          />
        </motion.div>
      </section>

      {/* FAQs list section */}
      <section className="px-4 md:px-6 pb-20 max-w-3xl mx-auto min-h-[400px]">
        {hasResults ? (
          categories.map((category) => {
            const categoryFaqs = filteredFaqs.filter((f) => f.category === category.id);
            if (categoryFaqs.length === 0) return null;

            return (
              <div key={category.id} className="mb-10">
                <motion.h2
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  className="text-headline-md text-primary mb-6 border-b border-outline-variant/20 pb-2 font-bold"
                >
                  {category.name}
                </motion.h2>

                <div className="flex flex-col gap-4">
                  {categoryFaqs.map((faq, index) => (
                    <motion.div
                      key={faq.id}
                      initial={{ opacity: 0, y: 15 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: index * 0.05 }}
                    >
                      <Accordion variant="card" title={faq.question} content={faq.answer} />
                    </motion.div>
                  ))}
                </div>
              </div>
            );
          })
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <span className="material-symbols-outlined text-outline-variant text-5xl mb-4 select-none">
              search_off
            </span>
            <h3 className="text-headline-sm text-on-background font-bold mb-2">No matching questions</h3>
            <p className="text-body-md text-on-surface-variant max-w-md mx-auto">
              We couldn't find any FAQs matching your query "{searchQuery}". Try searching for other terms like "billing", "cancellation", or "location".
            </p>
          </motion.div>
        )}
      </section>

      {/* Still Have Questions CTA */}
      <section className="px-4 md:px-6 pb-20 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <CTABanner
            variant="secondary"
            title="Still have questions?"
            description="Our dedicated support team is here to help you with any additional inquiries."
            buttonText="Contact Us"
            buttonHref="/contact"
          />
        </motion.div>
      </section>
    </div>
  );
}
