"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MapPin, ChevronDown, Globe, Menu, X, Calendar, User, LogOut } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [selectedLang, setSelectedLang] = useState<{ code: string; label: string; flag: string }>({
    code: "EN",
    label: "English",
    flag: "🇺🇸",
  });
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  // Scroll listener to toggle navbar size with safe hysteresis thresholds to prevent jitter
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 120) {
        setIsScrolled(true);
      } else if (window.scrollY < 30) {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const langDropdownRef = useRef<HTMLDivElement>(null);

  // Click outside listener for language dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (langDropdownRef.current && !langDropdownRef.current.contains(event.target as Node)) {
        setIsLangOpen(false);
      }
    };
    if (isLangOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isLangOpen]);

  // Prevent background scroll when mobile hamburger drawer or logout modal popup is open
  useEffect(() => {
    const shouldLockScroll = Boolean(isMobileMenuOpen || isLogoutModalOpen);
    document.body.style.overflow = shouldLockScroll ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen, isLogoutModalOpen]);

  const languages = [
    { code: "EN", label: "English", flag: "🇺🇸" },
    { code: "ES", label: "Español", flag: "🇪🇸" },
    { code: "FR", label: "Français", flag: "🇫🇷" },
  ];

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Services", href: "/services" },
    { name: "Doctors", href: "/doctors" },
    { name: "Fees", href: "/fees" },
    { name: "FAQs", href: "/faqs" },
    { name: "Blog", href: "/blog" },
    { name: "Contact", href: "/contact" },
  ];

  if (
    pathname === "/book-appointment/confirmation" ||
    pathname === "/login" ||
    pathname === "/signup"
  ) return null;

  return (
    <header className={`sticky top-0 w-full z-50 transition-all duration-300 ease-in-out ${
      isScrolled ? "pt-3 px-4 md:px-6" : "pt-0 px-0"
    }`}>
      <div className={`relative z-50 backdrop-blur-md flex items-center justify-between transition-all duration-300 ease-in-out ${
        isScrolled 
          ? "max-w-[1400px] mx-auto rounded-full border border-white/10 py-2 px-4 shadow-md bg-white/70" 
          : "w-full max-w-full rounded-none border-b border-gray-200/50 py-3.5 px-6 md:px-10 shadow-sm bg-white/95"
      }`}>
        <div className="flex items-center gap-2 sm:gap-4 lg:gap-5">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 pl-1 group">
            <div className={`relative flex items-center justify-center rounded-xl bg-gradient-to-tr from-[#2c336b] to-[#4c549b] shadow-md transition-all duration-300 ${isScrolled ? "w-7.5 h-7.5" : "w-8.5 h-8.5"
              }`}>
              <svg width={isScrolled ? "14" : "16"} height={isScrolled ? "14" : "16"} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white shrink-0">
                <circle cx="12" cy="4" r="3" fill="currentColor" />
                <circle cx="4" cy="12" r="3" fill="#a9c7fb" />
                <circle cx="12" cy="12" r="3" fill="currentColor" />
                <circle cx="20" cy="12" r="3" fill="currentColor" />
                <circle cx="12" cy="20" r="3" fill="currentColor" />
              </svg>
            </div>
            <span className={`font-extrabold text-[#2c336b] tracking-tight hover:opacity-90 transition-all duration-300 ${
              isScrolled ? "text-sm sm:text-base lg:text-lg" : "text-base sm:text-lg lg:text-xl"
            }`}>WeCare</span>
          </Link>

          <div className="hidden md:block w-px h-5 bg-gray-200"></div>

          {/* Our Location Map Button */}
          <a
            href="https://maps.google.com/?q=123+Healing+Way,+Wellness+District,+CA+90210"
            target="_blank"
            rel="noopener noreferrer"
            className={`hidden md:flex items-center gap-1.5 rounded-full bg-[#f3faff] text-[#2c336b] border border-[#2c336b]/10 hover:border-[#2c336b]/30 hover:bg-[#2c336b]/10 transition-all duration-300 shadow-sm group ${
              isScrolled ? "px-3 py-1 text-[11px]" : "px-3.5 py-1.5 text-[11px] lg:text-[11px] xl:px-4 xl:py-2 xl:text-xs"
            }`}
          >
            <MapPin className="w-3.5 h-3.5 text-[#2c336b] group-hover:translate-y-[-2px] transition-transform duration-300" />
            <span className="font-bold tracking-wide">Our Location</span>
          </a>
        </div>

        {/* Navigation Links - Desktop */}
        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = pathname === link.href || (link.href !== "/" && pathname?.startsWith(link.href));
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative px-2 xl:px-3 py-1.5 text-[11px] xl:text-[12px] font-semibold transition-colors duration-300 rounded-full z-10 ${
                  isActive 
                    ? "text-[#2c336b]" 
                    : "text-gray-600 hover:text-[#2c336b] hover:bg-[#2c336b]/4"
                }`}
              >
                <span className="relative z-10">{link.name}</span>
                {isActive && (
                  <motion.span
                    layoutId="activeNavPill"
                    className="absolute inset-0 bg-[#2c336b]/8 rounded-full -z-10"
                    transition={{ type: "spring", stiffness: 380, damping: 28 }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right Section Actions */}
        <div className="flex items-center gap-2 sm:gap-3 pr-1">
          {/* Language Selector Dropdown */}
          <div className="relative" ref={langDropdownRef}>
            <button
              onClick={() => setIsLangOpen(!isLangOpen)}
              className={`flex items-center gap-1 sm:gap-1.5 text-[9px] sm:text-xs font-bold text-gray-700 hover:text-[#2c336b] bg-gray-100/80 hover:bg-gray-200/50 rounded-full transition-all cursor-pointer ${
                isScrolled ? "px-1.5 py-0.5 sm:px-3 sm:py-1.5" : "px-2 py-1 sm:px-3.5 sm:py-2"
              }`}
            >
              <Globe className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#2c336b]" />
              <span>{selectedLang.code}</span>
              <ChevronDown className={`w-3 h-3 text-gray-500 transition-transform duration-300 hidden sm:block ${isLangOpen ? "rotate-180" : ""}`} />
            </button>

            <AnimatePresence>
              {isLangOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.98 }}
                  transition={{ duration: 0.15, ease: "easeOut" }}
                  className="absolute right-0 mt-2 w-32 bg-white rounded-xl shadow-xl border border-gray-200/80 py-1 z-50"
                >
                  {languages.map((lang) => {
                    const isSelected = selectedLang.code === lang.code;
                    return (
                      <button
                        key={lang.code}
                        onClick={() => {
                          setSelectedLang(lang);
                          setIsLangOpen(false);
                        }}
                        className={`w-full text-left px-3.5 py-2 text-xs font-semibold flex items-center transition cursor-pointer rounded-lg ${
                          isSelected 
                            ? "text-[#2c336b] bg-[#2c336b]/5 font-bold" 
                            : "text-gray-600 hover:bg-gray-50 hover:text-[#2c336b]"
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <span>{lang.flag}</span>
                          <span>{lang.label}</span>
                        </span>
                      </button>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Login / User Account Action (Desktop & Mobile) */}
          {user ? (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#2c336b]/10 text-[#2c336b] text-xs font-bold border border-[#2c336b]/20">
                <User className="w-3.5 h-3.5 text-[#2c336b]" />
                <span className="max-w-[120px] truncate">{user.full_name}</span>
              </div>
              <button
                onClick={() => setIsLogoutModalOpen(true)}
                className="p-1.5 rounded-full text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <>
              {/* Login / Register Button (Desktop) */}
              <Link
                href="/login"
                className={`hidden lg:flex items-center gap-1.5 rounded-full border border-[#2c336b]/20 text-[#2c336b] hover:bg-[#2c336b]/5 font-bold transition-all duration-300 ${
                  isScrolled ? "px-3 py-1 text-[11px]" : "px-3 py-1.5 text-[11px] xl:px-4 xl:py-2 xl:text-xs"
                }`}
              >
                <User className="w-3.5 h-3.5" />
                <span>Login / Register</span>
              </Link>

              {/* Login / Register Button (Mobile/Tablet Icon) */}
              <Link
                href="/login"
                className={`flex lg:hidden items-center justify-center rounded-full bg-gray-100/80 text-gray-700 hover:text-[#2c336b] hover:bg-gray-200/50 transition-all ${
                  isScrolled ? "w-6.5 h-6.5 sm:w-7.5 sm:h-7.5" : "w-7.5 h-7.5 sm:w-8.5 sm:h-8.5"
                }`}
                aria-label="Login / Register"
              >
                <User className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#2c336b]" />
              </Link>
            </>
          )}

          {/* Book Appointment CTA Button */}
          <Link
            href="/book-appointment"
            className={`hidden md:flex items-center gap-1.5 rounded-full bg-[#2c336b] text-white hover:bg-[#3d468e] font-bold shadow-md transition-all duration-300 group ${
              isScrolled ? "px-3.5 py-1 text-[11px]" : "px-4 py-1.5 text-[11px] xl:px-5 xl:py-2 xl:text-xs"
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Book Appointment</span>
          </Link>

          {/* Mobile Menu Button with Animated Icon Morph */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-1.5 sm:p-2 rounded-full text-gray-700 hover:text-[#2c336b] hover:bg-gray-100 transition-colors cursor-pointer flex items-center justify-center"
            aria-label="Toggle Menu"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-4.5 h-4.5 sm:w-5.5 sm:h-5.5 text-[#2c336b]"
            >
              <motion.line
                x1="4"
                y1="6"
                x2="20"
                y2="6"
                animate={isMobileMenuOpen ? { x1: 5, y1: 5, x2: 19, y2: 19 } : { x1: 4, y1: 6, x2: 20, y2: 6 }}
                transition={{ duration: 0.25, ease: "easeInOut" }}
              />
              <motion.line
                x1="4"
                y1="12"
                x2="20"
                y2="12"
                animate={isMobileMenuOpen ? { opacity: 0 } : { opacity: 1 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
              />
              <motion.line
                x1="4"
                y1="18"
                x2="20"
                y2="18"
                animate={isMobileMenuOpen ? { x1: 5, y1: 19, x2: 19, y2: 5 } : { x1: 4, y1: 18, x2: 20, y2: 18 }}
                transition={{ duration: 0.25, ease: "easeInOut" }}
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer & Backdrop */}
      <AnimatePresence>
        {isMobileMenuOpen && [
          /* Full-screen Blurred Backdrop */
          <motion.div
            key="mobile-menu-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-md z-40 lg:hidden cursor-pointer"
            onClick={() => setIsMobileMenuOpen(false)}
          />,

          /* Slide-down Mobile Menu Drawer */
          <motion.div
            key="mobile-menu-drawer"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="relative z-50 lg:hidden overflow-y-auto max-h-[calc(100vh-100px)] w-full mt-2 bg-white/95 backdrop-blur-md rounded-[2rem] border border-white/10 shadow-xl"
          >
            <div className="p-4 sm:p-5 flex flex-col gap-3">
              <nav className="flex flex-col gap-1 sm:gap-1.5">
                {navLinks.map((link) => {
                  const isActive = pathname === link.href || (link.href !== "/" && pathname?.startsWith(link.href));
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`px-4 py-1.5 sm:py-2 rounded-xl text-[12px] sm:text-[13px] font-semibold transition-all ${isActive
                        ? "bg-[#f3faff] text-[#2c336b] pl-6"
                        : "text-gray-600 hover:bg-gray-50 hover:text-[#2c336b]"
                        }`}
                    >
                      {link.name}
                    </Link>
                  );
                })}
              </nav>

              <hr className="border-gray-100 my-1 sm:my-1.5" />

              <div className="flex flex-col gap-2">
                {user ? (
                  <div className="flex flex-col gap-2 p-2 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="flex items-center justify-between px-3 py-2 text-xs font-bold text-[#2c336b]">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-[#2c336b]" />
                        <span className="truncate max-w-[150px]">{user.full_name}</span>
                      </div>
                      <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-md bg-[#2c336b]/10 text-[#2c336b] font-extrabold">
                        {user.role}
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        setIsLogoutModalOpen(true);
                      }}
                      className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-red-50 text-red-600 border border-red-100 font-bold text-xs hover:bg-red-100 transition-all cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <Link
                    href="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex lg:hidden items-center justify-center gap-2 w-full py-2.5 sm:py-3 rounded-xl bg-gray-50 text-gray-700 border border-gray-100 hover:bg-gray-100 transition-all font-bold text-xs"
                  >
                    <User className="w-3.5 h-3.5 text-[#2c336b]" />
                    Login / Register
                  </Link>
                )}

                <a
                  href="https://maps.google.com/?q=123+Healing+Way,+Wellness+District,+CA+90210"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex md:hidden items-center justify-center gap-2 w-full py-2.5 sm:py-3 rounded-xl bg-gray-50 text-gray-700 border border-gray-100 hover:bg-gray-100 transition-all font-semibold text-xs"
                >
                  <MapPin className="w-3.5 h-3.5 text-[#2c336b]" />
                  Our Location
                </a>

                <Link
                  href="/book-appointment"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex md:hidden items-center justify-center gap-2 w-full py-2.5 sm:py-3 rounded-xl bg-[#2c336b] text-white hover:bg-[#3d468e] transition-all font-bold text-xs shadow-md"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  Book Appointment
                </Link>
              </div>
            </div>
          </motion.div>
        ]}
      </AnimatePresence>

      {/* Logout Confirmation Modal Popup */}
      <AnimatePresence>
        {isLogoutModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsLogoutModalOpen(false)}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm cursor-pointer"
            />

            {/* Modal Dialog */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ type: "spring", duration: 0.3 }}
              className="relative bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full shadow-2xl border border-slate-100 text-center z-10 space-y-5"
            >
              {/* Alert Icon */}
              <div className="w-14 h-14 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center mx-auto text-red-600 shadow-inner">
                <LogOut className="w-7 h-7" />
              </div>

              {/* Title & Description */}
              <div className="space-y-1.5">
                <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">
                  Confirm Sign Out
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 font-medium leading-relaxed">
                  Are you sure you want to log out of your <span className="font-bold text-slate-700">LuminaHealth</span> account?
                </p>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsLogoutModalOpen(false)}
                  className="py-3 px-4 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold transition-all cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsLogoutModalOpen(false);
                    logout();
                  }}
                  className="py-3 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-md shadow-red-200 transition-all cursor-pointer"
                >
                  Yes, Log Out
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </header>
  );
}
