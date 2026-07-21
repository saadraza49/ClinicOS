"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { services } from "@/data/services";
import { doctors } from "@/data/doctors";
import Button from "@/components/button";
import Image from "next/image";

const timeSlots = [
  { value: "09:00", label: "09:00 AM", disabled: false },
  { value: "09:30", label: "09:30 AM", disabled: false },
  { value: "10:00", label: "10:00 AM", disabled: false },
  { value: "11:30", label: "11:30 AM", disabled: false },
  { value: "13:00", label: "01:00 PM", disabled: false },
  { value: "14:30", label: "02:30 PM", disabled: false },
  { value: "15:00", label: "03:00 PM", disabled: true }, // Disabled per Stitch design
  { value: "16:30", label: "04:30 PM", disabled: false },
];

function BookingForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const doctorQuery = searchParams.get("doctor");

  // Form State
  const [service, setService] = useState("");
  const [doctor, setDoctor] = useState("any");
  const [date, setDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");

  // Loading & Validation States
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [minDate, setMinDate] = useState("");

  // Pre-fill doctor from query parameter
  useEffect(() => {
    if (doctorQuery) {
      const foundDoctor = doctors.find((d) => d.id === doctorQuery || d.slug === doctorQuery);
      if (foundDoctor) {
        setDoctor(foundDoctor.id);
        // Set service to their specialty if available
        const matchedService = services.find(
          (s) => s.category.toLowerCase() === foundDoctor.specialty.toLowerCase()
        );
        if (matchedService) {
          setService(matchedService.id);
        }
      }
    }
  }, [doctorQuery]);

  // Set min date to today
  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    setMinDate(today);
  }, []);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!service) newErrors.service = "Please select a service";
    if (!date) newErrors.date = "Please select a date";
    if (!selectedTime) newErrors.time = "Please select a time slot";
    if (!name.trim()) newErrors.name = "Full name is required";
    if (!email.trim()) {
      newErrors.email = "Email address is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Please enter a valid email address";
    }
    if (!phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\+?[0-9\s-()]{7,15}$/.test(phone)) {
      newErrors.phone = "Please enter a valid phone number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);

    // Get selected service name
    const selectedServiceObj = services.find((s) => s.id === service);
    const serviceName = selectedServiceObj ? selectedServiceObj.name : "Consultation";

    // Get selected doctor name
    const selectedDoctorObj = doctors.find((d) => d.id === doctor);
    const doctorName = selectedDoctorObj ? selectedDoctorObj.name : "Any Available Doctor";

    // Find readable time
    const selectedTimeSlot = timeSlots.find((t) => t.value === selectedTime);
    const timeLabel = selectedTimeSlot ? selectedTimeSlot.label : selectedTime;

    // Simulate API Submission & Redirect with query parameters
    setTimeout(() => {
      const query = new URLSearchParams({
        name,
        email,
        phone,
        service: serviceName,
        doctor: doctorName,
        date,
        time: timeLabel,
      });
      router.push(`/book-appointment/confirmation?${query.toString()}`);
    }, 1500);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Step 1: Selection */}
      <div className="space-y-4">
        <h2 className="text-headline-md text-on-surface border-b border-surface-container-high pb-2 font-bold">
          1. Visit Details
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Service Dropdown */}
          <div className="flex flex-col gap-1">
            <label className="text-label-sm text-on-surface-variant" htmlFor="service">
              Select Service <span className="text-error">*</span>
            </label>
            <div className="relative">
              <select
                id="service"
                name="service"
                value={service}
                onChange={(e) => {
                  setService(e.target.value);
                  if (errors.service) setErrors((prev) => ({ ...prev, service: "" }));
                }}
                className={`w-full appearance-none bg-surface border rounded-lg px-4 py-3 text-body-md text-on-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-transparent transition-all ${
                  errors.service ? "border-error focus:ring-error" : "border-outline-variant"
                }`}
              >
                <option value="" disabled>
                  Choose a service
                </option>
                {services.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-on-surface-variant">
                <span className="material-symbols-outlined">expand_more</span>
              </div>
            </div>
            {errors.service && <p className="text-error text-xs mt-1">{errors.service}</p>}
          </div>

          {/* Doctor Dropdown */}
          <div className="flex flex-col gap-1">
            <label className="text-label-sm text-on-surface-variant" htmlFor="doctor">
              Select Doctor (Optional)
            </label>
            <div className="relative">
              <select
                id="doctor"
                name="doctor"
                value={doctor}
                onChange={(e) => setDoctor(e.target.value)}
                className="w-full appearance-none bg-surface border border-outline-variant rounded-lg px-4 py-3 text-body-md text-on-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-transparent transition-all"
              >
                <option value="any">Any Available Doctor</option>
                {doctors.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-on-surface-variant">
                <span className="material-symbols-outlined">expand_more</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Step 2: Date & Time */}
      <div className="space-y-4 pt-4">
        <h2 className="text-headline-md text-on-surface border-b border-surface-container-high pb-2 font-bold">
          2. Date &amp; Time
        </h2>
        <div className="flex flex-col gap-1">
          <label className="text-label-sm text-on-surface-variant" htmlFor="date">
            Preferred Date <span className="text-error">*</span>
          </label>
          <input
            id="date"
            name="date"
            type="date"
            min={minDate}
            value={date}
            onChange={(e) => {
              setDate(e.target.value);
              if (errors.date) setErrors((prev) => ({ ...prev, date: "" }));
            }}
            className={`w-full bg-surface border rounded-lg px-4 py-3 text-body-md text-on-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-transparent transition-all ${
              errors.date ? "border-error focus:ring-error" : "border-outline-variant"
            }`}
          />
          {errors.date && <p className="text-error text-xs mt-1">{errors.date}</p>}
        </div>

        {/* Time Slots */}
        <div className="flex flex-col gap-2 pt-2">
          <label className="text-label-sm text-on-surface-variant">
            Available Time Slots <span className="text-error">*</span>
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {timeSlots.map((slot) => (
              <div key={slot.value} className="relative">
                <input
                  type="radio"
                  id={`time-${slot.value}`}
                  name="time"
                  disabled={slot.disabled}
                  checked={selectedTime === slot.value}
                  onChange={() => {
                    setSelectedTime(slot.value);
                    if (errors.time) setErrors((prev) => ({ ...prev, time: "" }));
                  }}
                  className="sr-only peer"
                />
                {slot.disabled ? (
                  <span className="flex items-center justify-center w-full py-2.5 px-2 text-xs border border-outline-variant/30 bg-surface-container-low text-outline-variant/50 rounded-full text-center cursor-not-allowed select-none">
                    {slot.label}
                  </span>
                ) : (
                  <label
                    htmlFor={`time-${slot.value}`}
                    className={`flex items-center justify-center w-full py-2.5 px-2 text-xs border rounded-full text-center font-semibold cursor-pointer transition-all peer-focus-visible:ring-2 peer-focus-visible:ring-primary peer-focus-visible:ring-offset-2 ${
                      selectedTime === slot.value
                        ? "bg-primary text-on-primary border-primary shadow-sm scale-102"
                        : "border-outline-variant text-on-surface-variant hover:bg-surface-container-low hover:border-primary"
                    }`}
                  >
                    {slot.label}
                  </label>
                )}
              </div>
            ))}
          </div>
          {errors.time && <p className="text-error text-xs mt-1">{errors.time}</p>}
        </div>
      </div>

      {/* Step 3: Patient Details */}
      <div className="space-y-4 pt-4">
        <h2 className="text-headline-md text-on-surface border-b border-surface-container-high pb-2 font-bold">
          3. Your Details
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1 md:col-span-2">
            <label className="text-label-sm text-on-surface-variant" htmlFor="name">
              Full Name <span className="text-error">*</span>
            </label>
            <input
              id="name"
              name="name"
              placeholder="Jane Doe"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (errors.name) setErrors((prev) => ({ ...prev, name: "" }));
              }}
              className={`w-full bg-surface border rounded-lg px-4 py-3 text-body-md text-on-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-transparent transition-all placeholder:text-outline/50 ${
                errors.name ? "border-error focus:ring-error" : "border-outline-variant"
              }`}
              type="text"
            />
            {errors.name && <p className="text-error text-xs mt-1">{errors.name}</p>}
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-label-sm text-on-surface-variant" htmlFor="email">
              Email Address <span className="text-error">*</span>
            </label>
            <input
              id="email"
              name="email"
              placeholder="jane@example.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) setErrors((prev) => ({ ...prev, email: "" }));
              }}
              className={`w-full bg-surface border rounded-lg px-4 py-3 text-body-md text-on-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-transparent transition-all placeholder:text-outline/50 ${
                errors.email ? "border-error focus:ring-error" : "border-outline-variant"
              }`}
              type="email"
            />
            {errors.email && <p className="text-error text-xs mt-1">{errors.email}</p>}
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-label-sm text-on-surface-variant" htmlFor="phone">
              Phone Number <span className="text-error">*</span>
            </label>
            <input
              id="phone"
              name="phone"
              placeholder="(555) 123-4567"
              value={phone}
              onChange={(e) => {
                setPhone(e.target.value);
                if (errors.phone) setErrors((prev) => ({ ...prev, phone: "" }));
              }}
              className={`w-full bg-surface border rounded-lg px-4 py-3 text-body-md text-on-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-transparent transition-all placeholder:text-outline/50 ${
                errors.phone ? "border-error focus:ring-error" : "border-outline-variant"
              }`}
              type="tel"
            />
            {errors.phone && <p className="text-error text-xs mt-1">{errors.phone}</p>}
          </div>

          <div className="flex flex-col gap-1 md:col-span-2">
            <label className="text-label-sm text-on-surface-variant" htmlFor="notes">
              Reason for visit / Notes
            </label>
            <textarea
              id="notes"
              name="notes"
              placeholder="Briefly describe your symptoms or reason for visit..."
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-surface border border-outline-variant rounded-lg px-4 py-3 text-body-md text-on-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-transparent transition-all placeholder:text-outline/50 resize-none"
            />
          </div>
        </div>
      </div>

      {/* Submit Area */}
      <div className="pt-6 border-t border-surface-container-high flex flex-col items-center">
        <Button
          variant="primary"
          type="submit"
          disabled={isLoading}
          className="w-full md:w-auto min-w-[240px] flex items-center justify-center gap-2 relative overflow-hidden group"
        >
          {isLoading ? (
            <>
              <div className="spinner animate-spin border-3 border-t-white border-white/30 rounded-full w-5 h-5"></div>
              <span>Processing...</span>
            </>
          ) : (
            <>
              <span>Confirm Booking</span>
              <span className="material-symbols-outlined transition-transform group-hover:translate-x-1">
                arrow_forward
              </span>
            </>
          )}
        </Button>
        <div className="flex items-center gap-2 mt-4 text-on-surface-variant">
          <span className="material-symbols-outlined text-sm">lock</span>
          <p className="text-label-sm font-medium">Your information is secure and confidential.</p>
        </div>
      </div>
    </form>
  );
}

export default function BookAppointmentPage() {
  return (
    <div className="overflow-x-hidden">
      <main className="w-full max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Left Column: Reassurance & Copy */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-5 flex flex-col justify-center space-y-6"
          >
            <h1 className="text-display-lg-mobile md:text-display-lg text-on-background font-bold leading-tight">
              Ready to feel <span className="text-primary">better?</span>
            </h1>
            <p className="text-body-lg text-on-surface-variant leading-relaxed">
              Book your appointment in minutes. Our team of specialists is here to provide warm, personalized care tailored to your needs.
            </p>

            <div className="space-y-6 mt-4">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center flex-shrink-0 text-primary">
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                    calendar_today
                  </span>
                </div>
                <div>
                  <h3 className="text-headline-sm text-on-surface text-lg font-bold">Same-day availability</h3>
                  <p className="text-body-md text-on-surface-variant leading-relaxed">
                    For urgent non-emergency concerns, we often have slots available today.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center flex-shrink-0 text-primary">
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                    verified_user
                  </span>
                </div>
                <div>
                  <h3 className="text-headline-sm text-on-surface text-lg font-bold">Secure &amp; Confidential</h3>
                  <p className="text-body-md text-on-surface-variant leading-relaxed">
                    Your health data is protected with enterprise-grade clinical security.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center flex-shrink-0 text-primary">
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                    support_agent
                  </span>
                </div>
                <div>
                  <h3 className="text-headline-sm text-on-surface text-lg font-bold">Prefer to call?</h3>
                  <p className="text-body-md text-on-surface-variant leading-relaxed">
                    Our care team is ready to help at{" "}
                    <a className="text-primary font-bold hover:underline" href="tel:5551234567">
                      (555) 123-4567
                    </a>
                    .
                  </p>
                </div>
              </div>
            </div>

            {/* Decorative warm image */}
            <div className="mt-8 relative rounded-2xl overflow-hidden h-64 shadow-ambient">
              <Image
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBe8jqyDNc_WTmc1-3eDm8D9Owb-BHPnVTPr-XOoChSp_iyrPcwOMpA3aBike1-SLSwbEdsHyzyr_2-Dwkgkz9IuaGbPY5vjhR-436-qUuh7P3zt3DimyUIhLIKPV23Doy2BxJXaTyvZxhzAekONgKNri6KCocYPcrX73kBaQQX_oONuFuyk0ZZbi_BngVl6wA8BlsRibnyXEmcOEM8y6Ma5LYWxuck4c7EC6JLymKqLPxHKmse530lVE9l3M7b3HKWIbLMOJAYBbYQ"
                alt="Friendly female doctor smiling warmly"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
            </div>
          </motion.div>

          {/* Right Column: Booking Form Card */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7"
          >
            <div className="bg-surface-container-lowest rounded-3xl p-4 sm:p-6 md:p-8 shadow-ambient border border-outline-variant/10">
              <Suspense
                fallback={
                  <div className="py-20 flex flex-col items-center justify-center">
                    <div className="spinner animate-spin border-3 border-t-primary border-primary/30 rounded-full w-8 h-8 mb-4"></div>
                    <p className="text-body-md text-on-surface-variant font-medium">Loading booking form...</p>
                  </div>
                }
              >
                <BookingForm />
              </Suspense>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
