"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocationModal } from "@/context/LocationContext";
import { useTranslations } from "next-intl";

const MAP_EMBED_URL = "https://maps.google.com/maps?q=31.487555,73.076189&hl=en&z=16&output=embed";
const MAP_DIRECT_URL = "https://maps.app.goo.gl/MRgu6Fdbd9PhaGmu7";
const CLINIC_ADDRESS = "LuminaHealth Medical Center (31.487555, 73.076189)";

export default function LocationModal() {
  const { isLocationModalOpen, closeLocationModal } = useLocationModal();
  const [copied, setCopied] = useState(false);
  const t = useTranslations("LocationModal");

  // Lock body scroll when modal is active
  useEffect(() => {
    if (isLocationModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isLocationModalOpen]);

  // Handle ESC key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isLocationModalOpen) {
        closeLocationModal();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isLocationModalOpen, closeLocationModal]);

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(CLINIC_ADDRESS);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AnimatePresence>
      {isLocationModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={closeLocationModal}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm cursor-pointer"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 15 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-4xl bg-surface-container-lowest border border-outline-variant/20 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] z-10"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-outline-variant/15 bg-surface-container-low/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                    location_on
                  </span>
                </div>
                <div>
                  <h3 className="text-title-lg font-bold text-on-surface">{t("title")}</h3>
                  <p className="text-body-xs text-on-surface-variant">{t("subtitle")}</p>
                </div>
              </div>

              <button
                onClick={closeLocationModal}
                className="w-9 h-9 rounded-full bg-surface-container-high hover:bg-surface-container-highest flex items-center justify-center text-on-surface-variant hover:text-on-surface transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                aria-label="Close location modal"
              >
                <span className="material-symbols-outlined text-xl">close</span>
              </button>
            </div>

            {/* Content Body */}
            <div className="overflow-y-auto p-4 sm:p-6 space-y-6">
              {/* Interactive Google Maps Frame */}
              <div className="relative w-full h-[320px] sm:h-[400px] rounded-2xl overflow-hidden shadow-inner border border-outline-variant/20 bg-surface-container">
                <iframe
                  title="LuminaHealth Clinic Location Map"
                  src={MAP_EMBED_URL}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen={true}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full h-full"
                />
              </div>

              {/* Details & Actions Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 bg-surface-container-low/40 p-4 sm:p-5 rounded-2xl border border-outline-variant/10">
                {/* Left Info Column */}
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-primary text-xl mt-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>
                      place
                    </span>
                    <div>
                      <h4 className="text-label-md font-semibold text-on-surface-variant">{t("addressLabel")}</h4>
                      <p className="text-body-md font-medium text-on-surface">
                        {t("addressText")}
                      </p>
                      <p className="text-body-xs text-on-surface-variant font-mono mt-0.5">
                        {t("coordinates")}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-primary text-xl mt-0.5">
                      schedule
                    </span>
                    <div>
                      <h4 className="text-label-md font-semibold text-on-surface-variant">{t("timingsLabel")}</h4>
                      <p className="text-body-sm text-on-surface">
                        {t("timingsText")}
                      </p>
                      <p className="text-body-xs text-error font-medium">{t("closedText")}</p>
                    </div>
                  </div>
                </div>

                {/* Right Action Column */}
                <div className="flex flex-col justify-center gap-3">
                  <button
                    onClick={handleCopyAddress}
                    className="w-full py-2.5 px-4 rounded-xl border border-outline-variant/30 hover:border-primary/50 bg-surface-container-lowest hover:bg-primary/5 text-on-surface font-semibold text-sm flex items-center justify-center gap-2 transition-all duration-200 shadow-sm"
                  >
                    <span className="material-symbols-outlined text-lg text-primary">
                      {copied ? "check" : "content_copy"}
                    </span>
                    <span>{copied ? t("addressCopied") : t("copyAddress")}</span>
                  </button>

                  <a
                    href={MAP_DIRECT_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 px-4 rounded-xl bg-primary hover:bg-primary/90 text-on-primary font-bold text-sm flex items-center justify-center gap-2 transition-all duration-200 shadow-md group"
                  >
                    <span>{t("openDirections")}</span>
                    <span className="material-symbols-outlined text-lg group-hover:translate-x-1 transition-transform">
                      open_in_new
                    </span>
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
