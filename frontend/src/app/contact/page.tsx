"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "@/components/button";
import Image from "next/image";

export default function ContactPage() {
  // Form State
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [subject, setSubject] = useState("General Inquiry");
  const [message, setMessage] = useState("");

  // UI States
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = "Full name is required";
    if (!email.trim()) {
      newErrors.email = "Email address is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Please enter a valid email address";
    }
    if (!phone.trim()) {
      newErrors.phone = "Phone number is required";
    }
    if (!message.trim()) newErrors.message = "Message cannot be empty";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);

    // Simulate API Submission
    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);

      // Clear Form after success
      setName("");
      setEmail("");
      setPhone("");
      setSubject("General Inquiry");
      setMessage("");
    }, 1500);
  };

  return (
    <div className="overflow-x-hidden">
      {/* Header Banner */}
      <section className="py-16 px-4 md:px-6 text-center max-w-7xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-display-lg-mobile md:text-display-lg text-primary mb-4 font-bold"
        >
          Get in Touch
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-body-lg text-on-surface-variant max-w-2xl mx-auto leading-relaxed"
        >
          We're here to help you on your health journey. Reach out with any questions, concerns, or to schedule a visit.
        </motion.p>
      </section>

      {/* Quick Contact Icons */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 mb-16">
        <div className="flex justify-center gap-8 md:gap-12 flex-wrap">
          <motion.a
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            href="tel:1234567890"
            className="flex flex-col items-center gap-2 group cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-xl"
          >
            <div className="w-16 h-16 rounded-full bg-surface-container-low flex items-center justify-center text-primary group-hover:scale-110 group-hover:bg-primary group-hover:text-on-primary transition-all duration-300 shadow-ambient border border-outline-variant/10">
              <span className="material-symbols-outlined text-3xl">call</span>
            </div>
            <span className="text-label-md font-semibold text-on-surface-variant group-hover:text-primary transition-colors">
              Call
            </span>
          </motion.a>

          <motion.a
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            href="https://wa.me/1234567890"
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center gap-2 group cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-xl"
          >
            <div className="w-16 h-16 rounded-full bg-surface-container-low flex items-center justify-center text-primary group-hover:scale-110 group-hover:bg-primary group-hover:text-on-primary transition-all duration-300 shadow-ambient border border-outline-variant/10">
              <span className="material-symbols-outlined text-3xl">chat</span>
            </div>
            <span className="text-label-md font-semibold text-on-surface-variant group-hover:text-primary transition-colors">
              WhatsApp
            </span>
          </motion.a>

          <motion.a
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.4 }}
            href="mailto:hello@luminahealth.com"
            className="flex flex-col items-center gap-2 group cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-xl"
          >
            <div className="w-16 h-16 rounded-full bg-surface-container-low flex items-center justify-center text-primary group-hover:scale-110 group-hover:bg-primary group-hover:text-on-primary transition-all duration-300 shadow-ambient border border-outline-variant/10">
              <span className="material-symbols-outlined text-3xl">mail</span>
            </div>
            <span className="text-label-md font-semibold text-on-surface-variant group-hover:text-primary transition-colors">
              Email
            </span>
          </motion.a>
        </div>
      </section>

      {/* Two Column Grid */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-start">
          {/* Contact Form Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-surface-container-lowest rounded-3xl p-4 sm:p-6 md:p-8 shadow-ambient border border-outline-variant/10"
          >
            <h2 className="text-headline-sm md:text-headline-md text-on-surface mb-6 font-bold">
              Send a Message
            </h2>

            <AnimatePresence mode="wait">
              {isSuccess ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="bg-primary/10 border border-primary/20 rounded-2xl p-6 text-center space-y-4"
                >
                  <div className="w-12 h-12 bg-primary text-on-primary rounded-full flex items-center justify-center mx-auto shadow-sm">
                    <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                      check_circle
                    </span>
                  </div>
                  <h3 className="text-headline-sm font-bold text-primary">Message Sent Successfully!</h3>
                  <p className="text-body-md text-on-surface-variant leading-relaxed">
                    Thank you for reaching out. A clinic care coordinator will review your request and contact you shortly.
                  </p>
                  <Button variant="outline" onClick={() => setIsSuccess(false)} className="mt-2">
                    Send another message
                  </Button>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  onSubmit={handleSubmit}
                  className="space-y-5"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="flex flex-col gap-1">
                      <label className="text-label-sm font-semibold text-on-surface-variant" htmlFor="name">
                        Full Name <span className="text-error">*</span>
                      </label>
                      <input
                        id="name"
                        value={name}
                        onChange={(e) => {
                          setName(e.target.value);
                          if (errors.name) setErrors((prev) => ({ ...prev, name: "" }));
                        }}
                        className={`rounded-lg border bg-surface-container-lowest text-body-md py-3 px-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-transparent transition-all placeholder:text-outline/50 ${
                          errors.name ? "border-error focus:ring-error" : "border-outline-variant"
                        }`}
                        placeholder="Jane Doe"
                        type="text"
                      />
                      {errors.name && <p className="text-error text-xs mt-1">{errors.name}</p>}
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-label-sm font-semibold text-on-surface-variant" htmlFor="email">
                        Email Address <span className="text-error">*</span>
                      </label>
                      <input
                        id="email"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          if (errors.email) setErrors((prev) => ({ ...prev, email: "" }));
                        }}
                        className={`rounded-lg border bg-surface-container-lowest text-body-md py-3 px-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-transparent transition-all placeholder:text-outline/50 ${
                          errors.email ? "border-error focus:ring-error" : "border-outline-variant"
                        }`}
                        placeholder="jane@example.com"
                        type="email"
                      />
                      {errors.email && <p className="text-error text-xs mt-1">{errors.email}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="flex flex-col gap-1">
                      <label className="text-label-sm font-semibold text-on-surface-variant" htmlFor="phone">
                        Phone Number <span className="text-error">*</span>
                      </label>
                      <input
                        id="phone"
                        value={phone}
                        onChange={(e) => {
                          setPhone(e.target.value);
                          if (errors.phone) setErrors((prev) => ({ ...prev, phone: "" }));
                        }}
                        className={`rounded-lg border bg-surface-container-lowest text-body-md py-3 px-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-transparent transition-all placeholder:text-outline/50 ${
                          errors.phone ? "border-error focus:ring-error" : "border-outline-variant"
                        }`}
                        placeholder="(555) 123-4567"
                        type="tel"
                      />
                      {errors.phone && <p className="text-error text-xs mt-1">{errors.phone}</p>}
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-label-sm font-semibold text-on-surface-variant" htmlFor="subject">
                        Subject
                      </label>
                      <div className="relative">
                        <select
                          id="subject"
                          value={subject}
                          onChange={(e) => setSubject(e.target.value)}
                          className="w-full appearance-none rounded-lg border border-outline-variant bg-surface-container-lowest text-body-md py-3 px-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-transparent transition-all"
                        >
                          <option>General Inquiry</option>
                          <option>Appointments</option>
                          <option>Billing</option>
                          <option>Feedback</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-on-surface-variant">
                          <span className="material-symbols-outlined">expand_more</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-label-sm font-semibold text-on-surface-variant" htmlFor="message">
                      Your Message <span className="text-error">*</span>
                    </label>
                    <textarea
                      id="message"
                      value={message}
                      onChange={(e) => {
                        setMessage(e.target.value);
                        if (errors.message) setErrors((prev) => ({ ...prev, message: "" }));
                      }}
                      className={`rounded-lg border bg-surface-container-lowest text-body-md py-3 px-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-transparent transition-all placeholder:text-outline/50 resize-none ${
                        errors.message ? "border-error focus:ring-error" : "border-outline-variant"
                      }`}
                      placeholder="How can we help you?"
                      rows={4}
                    />
                    {errors.message && <p className="text-error text-xs mt-1">{errors.message}</p>}
                  </div>

                  <div className="pt-2">
                    <Button
                      variant="secondary"
                      type="submit"
                      disabled={isLoading}
                      className="w-full md:w-auto min-w-[180px] flex items-center justify-center gap-2 relative overflow-hidden"
                    >
                      {isLoading ? (
                        <>
                          <div className="spinner animate-spin border-3 border-t-white border-white/30 rounded-full w-5 h-5"></div>
                          <span>Sending...</span>
                        </>
                      ) : (
                        <span>Send Message</span>
                      )}
                    </Button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Clinic Details Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-surface-container-lowest rounded-3xl p-4 sm:p-6 md:p-8 shadow-ambient flex flex-col h-full border border-outline-variant/10"
          >
            <h2 className="text-headline-sm md:text-headline-md text-on-surface mb-6 font-bold">
              Clinic Information
            </h2>
            
            <div className="space-y-6 mb-8 flex-grow">
              <div className="flex items-start gap-4">
                <div className="p-2.5 bg-surface-container-low rounded-xl text-primary flex-shrink-0">
                  <span className="material-symbols-outlined text-[24px]">location_on</span>
                </div>
                <div>
                  <p className="text-label-sm font-semibold text-on-surface-variant mb-1">Address</p>
                  <p className="text-body-md text-on-surface font-medium leading-relaxed">
                    123 Healing Way
                    <br />
                    Wellness District, CA 90210
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-2.5 bg-surface-container-low rounded-xl text-primary flex-shrink-0">
                  <span className="material-symbols-outlined text-[24px]">schedule</span>
                </div>
                <div className="w-full">
                  <p className="text-label-sm font-semibold text-on-surface-variant mb-2">Working Hours</p>
                  <div className="grid grid-cols-2 gap-y-2 text-body-md text-on-surface font-semibold max-w-[280px]">
                    <span>Mon - Fri</span> <span className="text-right text-primary">8:00 AM - 6:00 PM</span>
                    <span>Saturday</span> <span className="text-right text-primary">9:00 AM - 2:00 PM</span>
                    <span>Sunday</span> <span className="text-right text-on-surface-variant font-normal">Closed</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Placeholder for Map */}
            <div className="w-full h-48 bg-surface-container rounded-2xl overflow-hidden relative shadow-sm border border-outline-variant/10 group">
              <Image
                className="object-cover opacity-80 transition-transform duration-500 group-hover:scale-103"
                alt="Clinic Map Location"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCqeGvaCOn3kKJk-w4T5Zy0_2iGH95h0gZxv0YFGyxFaYelFMsItaons8_A3mnUZ3uk9gLAs50Mf-dtikIfgA6G-wtai1sevWOTrMzHrP87PoLagaXJ6yDhdSmzQF6xFuX-Yt_Opw70n4GWLfsxc4o0LQ6PX-0orovvFClT7BAnrPrcoKhlQe-kf8lTIPzH9N6Orq8U1-cj0Cv25X7m2cVj2jp-AZ76a_v_ONmj0LGhkmvHQmhV313m_1pcWNZDnqBByZni_azwdR_Y"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/5">
                <span className="material-symbols-outlined text-primary text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                  location_on
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
