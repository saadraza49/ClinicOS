"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  if (pathname === "/book-appointment/confirmation") return null;

  const navLinks = [
    { name: "Services", href: "/services" },
    { name: "Doctors", href: "/doctors" },
    { name: "About", href: "/about" },
    { name: "FAQs", href: "/faqs" },
    { name: "Blog", href: "/blog" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <header className="sticky top-0 w-full z-50 shadow-sm bg-surface-container-lowest/90 backdrop-blur-md">
      <div className="flex justify-between items-center px-4 md:px-6 py-4 max-w-7xl mx-auto">
        {/* Logo */}
        <Link
          href="/"
          className="text-headline-sm font-bold text-primary flex items-center gap-2 transition-transform duration-200 hover:scale-105"
        >
          <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
            favorite
          </span>
          LuminaHealth
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => {
            const isActive = pathname.startsWith(link.href);
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`transition-colors duration-200 text-label-md ${
                  isActive
                    ? "text-primary font-semibold"
                    : "text-on-surface-variant hover:text-primary"
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Support & CTA Button (Desktop) */}
        <div className="hidden md:flex items-center gap-4">
          <a
            href="tel:+15551234567"
            className="text-label-md text-on-surface-variant hover:text-primary transition-colors duration-200 flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-lg">call</span>
            Call Support
          </a>
          <Link
            href="/book-appointment"
            className="bg-primary text-on-primary text-label-md px-6 py-2.5 rounded-full hover:scale-105 transition-transform duration-200 active:scale-95 shadow-sm hover:shadow-md font-medium"
          >
            Book Appointment
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-primary p-2 focus:outline-none"
          aria-label="Toggle Menu"
        >
          <span className="material-symbols-outlined text-3xl">
            {isOpen ? "close" : "menu"}
          </span>
        </button>
      </div>

      {/* Mobile Navigation Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="md:hidden bg-surface-container-lowest border-t border-outline-variant/30 overflow-hidden"
          >
            <div className="flex flex-col p-6 gap-4">
              {navLinks.map((link) => {
                const isActive = pathname.startsWith(link.href);
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className={`transition-colors duration-200 text-label-md py-2 border-b border-outline-variant/10 ${
                      isActive
                        ? "text-primary font-semibold"
                        : "text-on-surface-variant hover:text-primary"
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
              <div className="flex flex-col gap-4 mt-2">
                <a
                  href="tel:+15551234567"
                  className="text-label-md text-on-surface-variant hover:text-primary transition-colors duration-200 flex items-center gap-2 py-2"
                >
                  <span className="material-symbols-outlined text-lg">call</span>
                  Call Support: (555) 123-4567
                </a>
                <Link
                  href="/book-appointment"
                  onClick={() => setIsOpen(false)}
                  className="bg-primary text-on-primary text-label-md px-6 py-3 rounded-full hover:scale-102 transition-transform duration-200 text-center font-medium shadow-sm active:scale-98"
                >
                  Book Appointment
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
