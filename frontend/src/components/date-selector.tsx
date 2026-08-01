"use client";

import React, { useRef } from "react";

interface DateSelectorProps {
  value: string; // YYYY-MM-DD
  minDate: string; // YYYY-MM-DD
  onChange: (newDate: string) => void;
  error?: string;
}

export default function DateSelector({ value, minDate, onChange, error }: DateSelectorProps) {
  const dateInputRef = useRef<HTMLInputElement>(null);

  // Helper to parse YYYY-MM-DD string to local Date object without timezone shift
  const parseDateStr = (str: string): Date => {
    if (!str) return new Date();
    const [y, m, d] = str.split("-").map(Number);
    return new Date(y, m - 1, d);
  };

  // Helper to format Date object to YYYY-MM-DD string
  const formatDateToStr = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const currentDateObj = parseDateStr(value);
  const minDateObj = parseDateStr(minDate);

  // Compare if current value is today (or <= minDate)
  const isToday = value === minDate;
  const isPrevDisabled = value <= minDate;

  // Formatting day and date
  const dayNameLong = currentDateObj.toLocaleDateString("en-US", { weekday: "long" });
  const dayNameShort = currentDateObj.toLocaleDateString("en-US", { weekday: "short" });
  const formattedDate = currentDateObj.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const handlePrevDay = () => {
    if (isPrevDisabled) return;
    const prev = new Date(currentDateObj);
    prev.setDate(prev.getDate() - 1);
    const newStr = formatDateToStr(prev);
    if (newStr >= minDate) {
      onChange(newStr);
    }
  };

  const handleNextDay = () => {
    const next = new Date(currentDateObj);
    next.setDate(next.getDate() + 1);
    onChange(formatDateToStr(next));
  };

  const handleOpenCalendar = () => {
    const el = dateInputRef.current;
    if (!el) return;
    const inputEl = el as HTMLInputElement & { showPicker?: () => void };
    if (typeof inputEl.showPicker === "function") {
      try {
        inputEl.showPicker();
      } catch {
        inputEl.focus();
      }
    } else {
      inputEl.focus();
    }
  };

  // Generate quick chips (Today, Tomorrow, Day after)
  const quickDays = [0, 1, 2, 3].map((offset) => {
    const d = new Date(minDateObj);
    d.setDate(d.getDate() + offset);
    const dateStr = formatDateToStr(d);
    let label = "";
    if (offset === 0) label = "Today";
    else if (offset === 1) label = "Tomorrow";
    else label = d.toLocaleDateString("en-US", { weekday: "short", month: "numeric", day: "numeric" });
    return { dateStr, label };
  });

  return (
    <div className="flex flex-col gap-2">
      {/* Main Arrow Date Navigator Box */}
      <div
        className={`flex items-center justify-between gap-2 p-2 bg-surface-container-low border rounded-2xl shadow-2xs transition-all ${
          error ? "border-error focus-within:ring-2 focus-within:ring-error" : "border-outline-variant focus-within:border-primary"
        }`}
      >
        {/* Previous Day Arrow */}
        <button
          type="button"
          onClick={handlePrevDay}
          disabled={isPrevDisabled}
          aria-label="Previous day"
          className={`p-2.5 rounded-xl flex items-center justify-center transition-all ${
            isPrevDisabled
              ? "text-on-surface-variant/30 bg-surface-container/50 cursor-not-allowed opacity-50"
              : "text-primary hover:bg-primary/10 active:scale-95 cursor-pointer"
          }`}
          title={isPrevDisabled ? "Cannot select past dates" : "Previous day"}
        >
          <span className="material-symbols-outlined text-2xl font-bold select-none">chevron_left</span>
        </button>

        {/* Center Display: Day & Date */}
        <div className="flex-1 flex flex-col sm:flex-row items-center justify-center gap-1.5 text-center py-1 select-none">
          <div className="flex items-center justify-center gap-2">
            {isToday ? (
              <span className="px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider bg-primary/15 text-primary rounded-full">
                Today
              </span>
            ) : (
              <span className="px-2.5 py-0.5 text-xs font-semibold bg-surface-container-high text-on-surface-variant rounded-full">
                {dayNameShort}
              </span>
            )}
            <span className="text-body-lg font-bold text-on-surface">
              {dayNameLong}, {formattedDate}
            </span>
          </div>
        </div>

        {/* Next Day Arrow */}
        <button
          type="button"
          onClick={handleNextDay}
          aria-label="Next day"
          className="p-2.5 rounded-xl text-primary hover:bg-primary/10 active:scale-95 cursor-pointer flex items-center justify-center transition-all"
          title="Next day"
        >
          <span className="material-symbols-outlined text-2xl font-bold select-none">chevron_right</span>
        </button>

        {/* Calendar Picker Option */}
        <div className="relative flex items-center">
          <button
            type="button"
            onClick={handleOpenCalendar}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-primary bg-primary/10 hover:bg-primary/20 border border-primary/30 rounded-xl transition-all active:scale-95 cursor-pointer"
            title="Choose from calendar"
          >
            <span className="material-symbols-outlined text-lg select-none">calendar_month</span>
            <span className="hidden sm:inline">Calendar</span>
          </button>
          <input
            ref={dateInputRef}
            type="date"
            min={minDate}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="absolute inset-0 opacity-0 pointer-events-auto cursor-pointer w-full h-full"
            aria-label="Select date from calendar"
          />
        </div>
      </div>

      {/* Quick Day Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 no-scrollbar">
        <span className="text-xs text-on-surface-variant font-medium whitespace-nowrap">Quick Select:</span>
        {quickDays.map((qd) => {
          const isSelected = value === qd.dateStr;
          return (
            <button
              key={qd.dateStr}
              type="button"
              onClick={() => onChange(qd.dateStr)}
              className={`px-3 py-1 text-xs font-semibold rounded-full whitespace-nowrap transition-all cursor-pointer ${
                isSelected
                  ? "bg-primary text-on-primary shadow-2xs scale-102"
                  : "bg-surface-container border border-outline-variant/60 text-on-surface-variant hover:border-primary hover:text-primary"
              }`}
            >
              {qd.label}
            </button>
          );
        })}
      </div>

      {error && <p className="text-error text-xs mt-0.5">{error}</p>}
    </div>
  );
}
