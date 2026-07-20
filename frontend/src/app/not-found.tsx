"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import Button from "@/components/button";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 py-16 text-center bg-background">
      <div className="max-w-md w-full space-y-8 flex flex-col items-center">
        
        {/* Breathing Calming SVG Illustration */}
        <motion.div
          animate={{
            y: [0, -10, 0],
            scale: [1, 1.02, 1],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="w-40 h-40 text-primary/10 relative flex items-center justify-center"
        >
          {/* Background circle decorative blur */}
          <div className="absolute inset-0 bg-primary/5 rounded-full blur-xl"></div>
          
          {/* Medical Shield & Heart Outline */}
          <svg
            className="w-32 h-32 text-primary relative z-10"
            fill="none"
            viewBox="0 0 100 100"
            xmlns="http://www.w3.org/2000/svg"
          >
            <motion.path
              d="M50 15 C65 15, 80 20, 80 35 C80 55, 50 85, 50 85 C50 85, 20 55, 20 35 C20 20, 35 15, 50 15 Z"
              stroke="currentColor"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
            />
            {/* Pulsing Stethoscope symbol inside */}
            <motion.path
              d="M38 42 A 6 6 0 1 0 50 48 A 6 6 0 1 0 62 42"
              stroke="var(--color-secondary)"
              strokeWidth="3.5"
              strokeLinecap="round"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.5 }}
            />
            <motion.path
              d="M50 48 L50 62"
              stroke="var(--color-secondary)"
              strokeWidth="3.5"
              strokeLinecap="round"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.5 }}
            />
            <motion.circle
              cx="50"
              cy="64"
              r="4"
              fill="var(--color-secondary)"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.2, duration: 0.3 }}
            />
          </svg>
        </motion.div>

        {/* Text Details */}
        <div className="space-y-3">
          <h1 className="text-display-lg-mobile md:text-headline-md font-bold text-on-background">
            Page Not Found
          </h1>
          <p className="text-body-md text-on-surface-variant max-w-sm mx-auto leading-relaxed">
            Looks like this page took a wrong turn, but we're here to get you back on track to your wellness journey.
          </p>
        </div>

        {/* Buttons / Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center w-full pt-4">
          <Link href="/">
            <Button variant="primary" className="px-8 py-3.5 shadow-md">
              Back to Home
            </Button>
          </Link>
          <Link
            href="/contact"
            className="text-primary font-bold text-sm hover:underline py-2 block"
          >
            Contact Us
          </Link>
        </div>

      </div>
    </div>
  );
}
