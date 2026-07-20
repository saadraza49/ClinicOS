"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  if (pathname === "/book-appointment/confirmation") return null;

  return (
    <div className="fixed bottom-8 right-8 z-50 flex flex-col items-end">
      {/* Chat Window Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="mb-4 w-80 bg-surface-container-lowest border border-outline-variant/30 rounded-2xl shadow-xl overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="bg-primary text-on-primary p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-surface-container-lowest flex items-center justify-center text-primary relative">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                  support_agent
                </span>
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border border-primary"></span>
              </div>
              <div>
                <p className="text-label-md font-bold leading-tight">Lumina Support</p>
                <p className="text-label-sm text-primary-fixed-dim/80 text-xs">Typically replies in 5 mins</p>
              </div>
            </div>

            {/* Chat Area */}
            <div className="h-64 p-4 overflow-y-auto bg-surface-container-low flex flex-col gap-3">
              {/* Incoming Msg */}
              <div className="flex gap-2 items-start max-w-[85%]">
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs shrink-0 mt-0.5">
                  <span className="material-symbols-outlined text-xs">support_agent</span>
                </div>
                <div className="bg-surface-container-lowest p-3 rounded-2xl rounded-tl-none shadow-sm text-sm text-on-background">
                  Hello! Welcome to LuminaHealth. How can I help you today?
                </div>
              </div>
            </div>

            {/* Footer Form */}
            <div className="p-3 bg-surface-container-lowest border-t border-outline-variant/20 flex gap-2">
              <input
                type="text"
                placeholder="Type your message..."
                disabled
                className="flex-1 px-4 py-2 bg-surface-container-low border border-outline-variant/20 rounded-full text-sm outline-none cursor-not-allowed opacity-60"
              />
              <button
                disabled
                className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center cursor-not-allowed opacity-60"
              >
                <span className="material-symbols-outlined text-md">send</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Trigger Button */}
      <div className="relative group">
        {/* Tooltip */}
        {!isOpen && (
          <div className="absolute bottom-full right-0 mb-4 bg-surface-container-highest p-4 rounded-xl shadow-lg w-48 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none border border-outline-variant/10">
            <p className="text-label-md font-bold text-on-background mb-1">How can we help?</p>
            <p className="text-label-sm text-on-surface-variant mb-2">Typical reply time: 5 mins</p>
            <span className="text-label-sm text-primary font-bold">Start Chat</span>
          </div>
        )}

        {/* Floating Chat Action Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Chat Support"
          className="w-16 h-16 rounded-full bg-primary text-on-primary flex items-center justify-center shadow-lg hover:scale-110 hover:shadow-xl transition-all duration-300 active:scale-95 relative cursor-pointer"
        >
          <span className="material-symbols-outlined text-3xl">
            {isOpen ? "close" : "chat_bubble"}
          </span>
          {/* Notification Dot */}
          {!isOpen && (
            <span className="absolute top-0 right-0 w-4 h-4 bg-secondary rounded-full border-2 border-surface-container-lowest animate-pulse"></span>
          )}
        </button>
      </div>
    </div>
  );
}
