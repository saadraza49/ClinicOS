"use client";

import React, { useState, useRef, useEffect } from "react";
import { useLocale } from "next-intl";

export interface SelectOption {
  id: string;
  label: string;
  sublabel?: string;
  price?: number;
  badge?: string;
  icon?: string;
}

interface SearchableSelectProps {
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  iconName?: string;
}

export default function SearchableSelect({
  options,
  value,
  onChange,
  placeholder = "Search or select an option...",
  label,
  error,
  iconName = "medical_services",
}: SearchableSelectProps) {
  const locale = useLocale();
  const filterPlaceholder = locale === "fr" ? "Taper pour filtrer..." : locale === "zh" ? "输入关键词筛选..." : "Type to filter...";
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  const selectedOption = options.find((o) => o.id === value);

  const filteredOptions = options.filter((o) => {
    const q = searchQuery.toLowerCase();
    return (
      o.label.toLowerCase().includes(q) ||
      (o.sublabel && o.sublabel.toLowerCase().includes(q)) ||
      (o.badge && o.badge.toLowerCase().includes(q))
    );
  });

  return (
    <div ref={containerRef} className="relative w-full flex flex-col gap-1.5">
      {label && (
        <label className="text-xs font-bold text-on-surface flex justify-between items-center select-none">
          <span>{label}</span>
          {selectedOption && (
            <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-1">
              <span className="material-symbols-outlined text-xs">check_circle</span>
              Selected
            </span>
          )}
        </label>
      )}

      {/* Select Box Trigger */}
      <div
        onClick={() => setIsOpen((prev) => !prev)}
        className={`w-full bg-surface border rounded-2xl px-4 py-3.5 flex items-center justify-between gap-3 cursor-pointer transition-all shadow-2xs select-none ${
          error
            ? "border-error focus:ring-2 focus:ring-error"
            : isOpen
            ? "border-primary ring-2 ring-primary/20 bg-primary/5"
            : "border-outline-variant/60 hover:border-primary/50 hover:bg-surface-container-low"
        }`}
      >
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
            <span className="material-symbols-outlined text-lg select-none">{iconName}</span>
          </div>
          {selectedOption ? (
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <span className="font-bold text-sm text-on-surface truncate">{selectedOption.label}</span>
                {selectedOption.price !== undefined && (
                  <span className="text-xs font-extrabold text-primary bg-primary/10 px-2.5 py-0.5 rounded-full flex-shrink-0">
                    ${selectedOption.price} USD
                  </span>
                )}
              </div>
              {selectedOption.sublabel && (
                <span className="text-xs text-on-surface-variant truncate block">{selectedOption.sublabel}</span>
              )}
            </div>
          ) : (
            <span className="text-sm font-semibold text-on-surface-variant/60">{placeholder}</span>
          )}
        </div>

        <span
          className={`material-symbols-outlined text-on-surface-variant transition-transform duration-200 select-none ${
            isOpen ? "rotate-180 text-primary" : ""
          }`}
        >
          expand_more
        </span>
      </div>

      {/* Floating Searchable Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 z-50 bg-white border border-outline-variant/20 rounded-3xl shadow-2xl p-3 space-y-2 animate-fadeIn max-h-80 flex flex-col">
          {/* Search Box */}
          <div className="relative flex items-center">
            <span className="material-symbols-outlined absolute left-3 text-on-surface-variant text-base select-none">
              search
            </span>
            <input
              ref={searchInputRef}
              type="text"
              placeholder={filterPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-surface-container-low border border-outline-variant/30 rounded-xl pl-9 pr-4 py-2 text-xs font-semibold text-on-surface focus:outline-none focus:ring-2 focus:ring-primary placeholder:text-outline-variant"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3 text-on-surface-variant hover:text-on-surface text-xs font-bold"
              >
                ✕
              </button>
            )}
          </div>

          {/* Options List */}
          <div className="overflow-y-auto flex-1 space-y-1 pr-1 max-h-60 no-scrollbar">
            {filteredOptions.length === 0 ? (
              <div className="p-6 text-center text-xs text-on-surface-variant/70 font-medium">
                No matching results found for "{searchQuery}"
              </div>
            ) : (
              filteredOptions.map((opt) => {
                const isSelected = opt.id === value;
                return (
                  <div
                    key={opt.id}
                    onClick={() => {
                      onChange(opt.id);
                      setIsOpen(false);
                      setSearchQuery("");
                    }}
                    className={`p-3 rounded-2xl cursor-pointer transition-all flex items-center justify-between gap-3 ${
                      isSelected
                        ? "bg-primary text-on-primary font-bold shadow-xs"
                        : "hover:bg-primary/5 text-on-surface"
                    }`}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-bold text-xs truncate">{opt.label}</span>
                        {opt.price !== undefined && (
                          <span
                            className={`text-[11px] font-extrabold px-2 py-0.5 rounded-full flex-shrink-0 ${
                              isSelected ? "bg-white/20 text-white" : "bg-primary/10 text-primary"
                            }`}
                          >
                            ${opt.price} USD
                          </span>
                        )}
                      </div>
                      {opt.sublabel && (
                        <p
                          className={`text-[11px] truncate mt-0.5 ${
                            isSelected ? "text-on-primary/80 font-medium" : "text-on-surface-variant"
                          }`}
                        >
                          {opt.sublabel}
                        </p>
                      )}
                    </div>
                    {isSelected && (
                      <span className="material-symbols-outlined text-sm font-bold flex-shrink-0">
                        check
                      </span>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {error && <p className="text-error text-xs font-semibold mt-0.5">{error}</p>}
    </div>
  );
}
