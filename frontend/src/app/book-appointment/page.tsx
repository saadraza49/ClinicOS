"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { getDoctors, getServices, getAvailableSlots, bookAppointment, DoctorData, ServiceData, TimeSlotData } from "@/lib/api";
import Button from "@/components/button";
import Image from "next/image";

function BookingForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const doctorQuery = searchParams.get("doctor");
  const serviceQuery = searchParams.get("service");

  // Dynamic Options from DB
  const [doctorsList, setDoctorsList] = useState<DoctorData[]>([]);
  const [servicesList, setServicesList] = useState<ServiceData[]>([]);
  const [availableSlots, setAvailableSlots] = useState<TimeSlotData[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);

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

  // Set min date to today
  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    setMinDate(today);
    setDate(today);
  }, []);

  // Fetch initial doctors & services from DB
  useEffect(() => {
    async function initData() {
      try {
        const [docs, svcs] = await Promise.all([getDoctors(), getServices()]);
        setDoctorsList(docs);
        setServicesList(svcs);

        if (serviceQuery) {
          const foundService = svcs.find((s) => s.id === serviceQuery || s.slug === serviceQuery);
          if (foundService) {
            setService(foundService.id);
          }
        }

        if (doctorQuery) {
          const foundDoctor = docs.find((d) => d.id === doctorQuery || d.slug === doctorQuery);
          if (foundDoctor) {
            setDoctor(foundDoctor.id);
            if (!serviceQuery) {
              const matchedService = svcs.find(
                (s) => s.department_id === foundDoctor.department?.id || s.name.toLowerCase().includes(foundDoctor.specialty.toLowerCase())
              );
              if (matchedService) {
                setService(matchedService.id);
              }
            }
          }
        }
      } catch (err) {
        console.error("Failed to fetch booking options from DB:", err);
      }
    }
    initData();
  }, [doctorQuery, serviceQuery]);

  // Fetch available slots from DB whenever date or doctor changes
  useEffect(() => {
    if (!date) return;
    async function loadSlots() {
      setLoadingSlots(true);
      try {
        const slots = await getAvailableSlots(doctor, date);
        setAvailableSlots(slots);
        // Reset selected time if previous selected time is no longer available
        if (selectedTime && !slots.some((s) => s.value === selectedTime && !s.disabled)) {
          setSelectedTime("");
        }
      } catch (err) {
        console.error("Failed to load time slots:", err);
      } finally {
        setLoadingSlots(false);
      }
    }
    loadSlots();
  }, [doctor, date]);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!service) newErrors.service = "Please select a service";
    if (!date) newErrors.date = "Please select a date";
    if (!selectedTime) newErrors.time = "Please select an available time slot";
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);

    try {
      const createdAppt = await bookAppointment({
        doctor_id: doctor,
        service_id: service || undefined,
        patient_name: name,
        patient_phone: phone,
        patient_email: email,
        appointment_date: date,
        appointment_time: selectedTime,
        reason_for_visit: notes || undefined,
      });

      const selectedServiceObj = servicesList.find((s) => s.id === service);
      const serviceName = selectedServiceObj ? selectedServiceObj.name : "Consultation";

      const selectedDoctorObj = doctorsList.find((d) => d.id === doctor);
      const doctorName = selectedDoctorObj ? selectedDoctorObj.full_name : "Any Available Doctor";

      const selectedTimeSlot = availableSlots.find((t) => t.value === selectedTime);
      const timeLabel = selectedTimeSlot ? selectedTimeSlot.label : selectedTime;

      const query = new URLSearchParams({
        id: createdAppt.id,
        name,
        email,
        phone,
        service: serviceName,
        doctor: doctorName,
        date,
        time: timeLabel,
      });
      router.push(`/book-appointment/confirmation?${query.toString()}`);
    } catch (err: any) {
      console.error("Booking error:", err);
      setErrors({ submit: err.message || "Failed to confirm appointment. Please try again." });
      setIsLoading(false);
    }
  };

  // Filter doctors by selected service department if applicable
  const selectedServiceObj = servicesList.find((s) => s.id === service);
  const relevantDoctors = selectedServiceObj && selectedServiceObj.department_id
    ? doctorsList.filter((d) => d.department?.id === selectedServiceObj.department_id || (d as any).department_id === selectedServiceObj.department_id)
    : doctorsList;

  const displayDoctorsList = relevantDoctors.length > 0 ? relevantDoctors : doctorsList;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {errors.submit && (
        <div className="bg-error/10 border border-error/30 text-error p-4 rounded-xl text-sm font-medium">
          {errors.submit}
        </div>
      )}

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
                {servicesList.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.price} USD)
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
                {displayDoctorsList.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.full_name} ({d.specialty})
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
          <label className="text-label-sm text-on-surface-variant flex justify-between items-center">
            <span>Available Time Slots <span className="text-error">*</span></span>
            {loadingSlots && <span className="text-xs text-primary font-medium animate-pulse">Checking DB schedule...</span>}
          </label>
          {loadingSlots ? (
            <div className="p-4 bg-surface-container rounded-xl text-center text-sm font-medium text-primary animate-pulse">
              Fetching available time slots from doctor schedule...
            </div>
          ) : availableSlots.length === 0 ? (
            <div className="p-4 bg-amber-50 border border-amber-200 text-amber-900 rounded-xl text-sm font-medium flex items-center gap-2">
              <span className="material-symbols-outlined text-amber-600 text-lg select-none">event_busy</span>
              <span>No working shifts available for this doctor on the selected date. Please pick another date or doctor.</span>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {availableSlots.map((slot) => (
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
                      {slot.label} (Booked)
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
          )}
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
              placeholder="+92 300 1234567"
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
              Additional Notes (Optional)
            </label>
            <textarea
              id="notes"
              name="notes"
              placeholder="Any symptoms, medical history, or specific requests..."
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-surface border border-outline-variant rounded-lg px-4 py-3 text-body-md text-on-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-transparent transition-all placeholder:text-outline/50"
            />
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="pt-4">
        <Button variant="primary" type="submit" isLoading={isLoading} className="w-full py-4 text-base font-bold shadow-md">
          Confirm Appointment
        </Button>
      </div>
    </form>
  );
}

export default function BookAppointmentPage() {
  return (
    <div className="overflow-x-hidden py-12 md:py-16 px-4 md:px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <span className="material-symbols-outlined text-primary text-5xl mb-2 select-none">
            calendar_clock
          </span>
          <h1 className="text-display-lg-mobile md:text-display-lg font-bold text-on-surface mb-3">
            Book an Appointment
          </h1>
          <p className="text-body-lg text-on-surface-variant max-w-xl mx-auto">
            Schedule a consultation with our experienced clinical team in under a minute.
          </p>
        </div>

        <div className="bg-surface-container-lowest border border-outline-variant/10 shadow-ambient rounded-3xl p-6 md:p-10">
          <Suspense fallback={<div className="p-8 text-center animate-pulse text-on-surface-variant">Loading booking system...</div>}>
            <BookingForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
