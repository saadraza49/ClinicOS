"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface AccordionProps {
  title: string;
  content: string;
  variant?: "line" | "card";
}

export default function Accordion({ title, content, variant = "line" }: AccordionProps) {
  const [isOpen, setIsOpen] = useState(false);

  const containerStyles =
    variant === "card"
      ? "bg-surface-container-lowest rounded-2xl border border-outline-variant/20 shadow-sm overflow-hidden mb-4 transition-all duration-300 hover:shadow-ambient"
      : "border-b border-outline-variant/30 py-4";

  const buttonStyles =
    variant === "card"
      ? "w-full flex justify-between items-center text-left px-6 py-5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-2xl focus:bg-surface-container-low/30 transition-colors group cursor-pointer"
      : "w-full flex justify-between items-center text-left py-2 font-headline-sm text-headline-sm text-on-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-md group cursor-pointer";

  const titleStyles =
    variant === "card"
      ? "text-label-md font-bold text-on-background group-hover:text-primary transition-colors duration-200"
      : "group-hover:text-primary transition-colors duration-200";

  const chevronStyles =
    variant === "card"
      ? "material-symbols-outlined text-outline group-hover:text-primary text-2xl select-none"
      : "material-symbols-outlined text-primary text-2xl select-none";

  const contentStyles =
    variant === "card"
      ? "px-6 pb-5 pt-2 bg-surface-container-low/10"
      : "pt-2 pb-4";

  return (
    <div className={containerStyles}>
      <button onClick={() => setIsOpen(!isOpen)} className={buttonStyles}>
        <span className={titleStyles}>{title}</span>
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className={chevronStyles}
        >
          expand_more
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className={contentStyles}>
              <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                {content}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
