"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MapPin, Search, ChevronDown, Percent, ShoppingCart, Globe } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const [selectedLang, setSelectedLang] = useState<{ code: string; label: string; flag: string }>({
    code: "EN",
    label: "English",
    flag: "🇺🇸",
  });
  const [isLangOpen, setIsLangOpen] = useState(false);

  const languages = [
    { code: "EN", label: "English", flag: "🇺🇸" },
    { code: "ES", label: "Español", flag: "🇪🇸" },
    { code: "FR", label: "Français", flag: "🇫🇷" },
  ];

  if (pathname === "/book-appointment/confirmation") return null;

  return (
    <header className="w-full pt-4 px-4 md:px-6 relative z-50">
      <div className="max-w-[1400px] mx-auto bg-white rounded-[2rem] flex items-center justify-between p-3 shadow-sm">
        <div className="flex items-center gap-6">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 pl-2">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
              <circle cx="12" cy="4" r="3" fill="#2c336b"/>
              <circle cx="4" cy="12" r="3" fill="#a9c7fb"/>
              <circle cx="12" cy="12" r="3" fill="#2c336b"/>
              <circle cx="20" cy="12" r="3" fill="#2c336b"/>
              <circle cx="12" cy="20" r="3" fill="#2c336b"/>
            </svg>
            <span className="font-bold text-lg text-[#2c336b]">WeCare</span>
          </Link>
          
          <div className="hidden md:block w-px h-8 bg-gray-200"></div>

          {/* Location */}
          <div className="hidden md:flex items-center gap-2 cursor-pointer group">
            <MapPin className="w-5 h-5 text-gray-500" strokeWidth={2} />
            <div className="flex flex-col">
              <span className="text-[10px] text-gray-400 font-medium tracking-wide">Select location</span>
              <div className="flex items-center gap-1 text-sm font-semibold text-gray-700 group-hover:text-black transition">
                San Francisco
                <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
              </div>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="flex-grow max-w-xl mx-4 hidden lg:block">
          <div className="relative flex items-center bg-gray-100/80 rounded-full px-2 py-2">
            <div className="bg-[#f4df82] rounded-full p-1.5 mr-2">
              <Search className="w-4 h-4 text-[#2c336b]" strokeWidth={3} />
            </div>
            <input 
              type="text" 
              placeholder="Medicine and healthcare products" 
              className="bg-transparent border-none outline-none text-[15px] w-full placeholder:text-gray-400 text-gray-700 font-medium"
            />
          </div>
        </div>

        {/* Right Links */}
        <div className="flex items-center gap-5 pr-2">
          <Link href="/services" className="hidden md:flex items-center gap-1 text-[15px] font-semibold text-gray-700 hover:text-[#2c336b] transition">
            Healthcare Services
            <ChevronDown className="w-4 h-4 text-gray-400" />
            <span className="bg-[#f1692f] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-sm uppercase tracking-wider ml-1 relative -top-2 -left-2">New</span>
          </Link>
          
          <Link href="/discounts" className="hidden md:flex items-center gap-2 text-[15px] font-semibold text-gray-700 hover:text-[#2c336b] transition">
            <div className="bg-[#feece4] p-1.5 rounded-full">
              <Percent className="w-3.5 h-3.5 text-[#f1692f]" strokeWidth={3} />
            </div>
            Discounts
          </Link>

          {/* Language Selector Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsLangOpen(!isLangOpen)}
              className="flex items-center gap-1.5 text-[14px] font-semibold text-gray-700 hover:text-[#2c336b] bg-gray-100/80 px-3 py-1.5 rounded-full transition cursor-pointer"
            >
              <Globe className="w-4 h-4 text-[#2c336b]" />
              <span>{selectedLang.code}</span>
              <ChevronDown className={`w-3.5 h-3.5 text-gray-500 transition-transform ${isLangOpen ? "rotate-180" : ""}`} />
            </button>

            {isLangOpen && (
              <div className="absolute right-0 mt-2 w-36 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50 animate-in fade-in zoom-in-95">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      setSelectedLang(lang);
                      setIsLangOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-xs font-semibold flex items-center justify-between hover:bg-gray-50 transition cursor-pointer ${
                      selectedLang.code === lang.code ? "text-[#2c336b] bg-gray-50" : "text-gray-600"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span>{lang.flag}</span>
                      <span>{lang.label}</span>
                    </span>
                    {selectedLang.code === lang.code && (
                      <span className="w-1.5 h-1.5 rounded-full bg-[#2c336b]"></span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          <Link href="/cart" className="flex items-center gap-2 text-[15px] font-semibold text-gray-700 hover:text-[#2c336b] transition">
            <ShoppingCart className="w-5 h-5 text-[#2c336b]" />
            Cart
          </Link>
        </div>
      </div>
    </header>
  );
}
