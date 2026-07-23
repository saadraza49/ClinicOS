"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Pill, Stethoscope, Smartphone, User, TestTube, RefreshCcw, Ban, Calendar, Award, Receipt, ShieldCheck } from "lucide-react";
import ServiceCard from "@/components/service-card";
import TrustBar from "@/components/trust-bar";

import { services } from "@/data/services";

// Why Choose Us Data
const features = [
  {
    title: "Same-day Care",
    description: "Because your health can't always wait. We prioritize urgent needs.",
    Icon: Calendar,
    bg: "bg-[#eecbd8]",
  },
  {
    title: "Experienced Doctors",
    description: "Board-certified professionals dedicated to continuous learning.",
    Icon: Award,
    bg: "bg-[#f4df82]",
  },
  {
    title: "Transparent Pricing",
    description: "No hidden fees. Clear communication about costs before treatment.",
    Icon: Receipt,
    bg: "bg-[#bce4cd]",
  },
  {
    title: "Modern Facility",
    description: "Equipped with the latest technology in a calming, clean environment.",
    Icon: ShieldCheck,
    bg: "bg-[#a9c7fb]",
  },
];

// Preserved hero images for future reference or fallback
const heroImages = [
  {
    src: "/images/hero/hero-1.png",
    alt: "General doctor consulting patient",
  },
  {
    src: "/images/hero/hero-2.png",
    alt: "Modern clinic waiting lounge",
  },
  {
    src: "/images/hero/hero-3.png",
    alt: "Friendly healthcare medical team",
  },
  {
    src: "/images/hero/hero-4.png",
    alt: "Clean general medical examination room",
  },
];

export default function Home() {
  return (
    <div className="bg-[#f5f5f5] min-h-screen font-sans pb-16">
      {/* Main Hero Banner - Full Width Wall-to-Wall Video */}
      <section className="relative w-full bg-[#2c336b] overflow-hidden min-h-[580px] md:min-h-[640px] lg:min-h-[700px] flex items-center mb-6">
        {/* Full-width Video Background */}
        <div className="absolute inset-0 w-full h-full z-0 overflow-hidden">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
          >
            <source src="/videos/hero-section-video.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>

          {/* Dark Gradient Overlay for Maximum Text Contrast & Readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/60 to-black/30 z-10 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40 z-10 pointer-events-none" />
        </div>

        {/* Hero Content Container - Vertically Centered Left-Aligned Block */}
        <div className="relative z-20 w-full max-w-[1400px] mx-auto px-4 md:px-8 py-16 md:py-24 flex items-center min-h-[580px] md:min-h-[640px] lg:min-h-[700px]">
          <div className="max-w-2xl text-left flex flex-col items-start">
            {/* Main Heading */}
            <h1 className="text-white text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.1] mb-5 drop-shadow-md">
              World-Class <br className="hidden sm:inline" />Medical Care
            </h1>

            {/* Supporting Subtext */}
            <p className="text-white/90 text-base sm:text-lg md:text-xl font-normal leading-relaxed mb-8 max-w-xl drop-shadow-sm">
              Expert doctors, personalized care, and same-day appointments when you need them most.
            </p>

            {/* CTA Button Group */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto">
              {/* Primary CTA Button */}
              <Link href="/book-appointment" className="w-full sm:w-auto">
                <button className="w-full sm:w-auto bg-[#f3d2de] text-[#2c336b] px-7 py-4 rounded-full font-bold text-[15px] sm:text-base flex items-center justify-center gap-4 hover:scale-[1.03] active:scale-95 transition-all duration-200 shadow-xl cursor-pointer group">
                  <span>Book Appointment</span>
                  <div className="bg-white rounded-full p-1.5 border border-black/5 group-hover:translate-x-0.5 transition-transform">
                    <ArrowRight className="w-4 h-4 text-[#2c336b]" strokeWidth={3} />
                  </div>
                </button>
              </Link>

              {/* Secondary Ghost CTA Button */}
              <Link href="/services" className="w-full sm:w-auto">
                <button className="w-full sm:w-auto bg-white/10 hover:bg-white/20 border border-white/30 hover:border-white/60 text-white backdrop-blur-md px-7 py-4 rounded-full font-bold text-[15px] sm:text-base flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer">
                  <span>Explore Our Services</span>
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-[1400px] mx-auto px-4 md:px-6">

        {/* 4 Cards Grid Section */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {/* Card 1 */}
          <Link href="/services/general-practice" className="bg-[#eecbd8] rounded-[2rem] p-8 relative overflow-hidden h-[280px] flex flex-col justify-between group cursor-pointer hover:-translate-y-1 transition-transform shadow-sm">
             <div className="relative z-10 mt-2">
               <h3 className="text-[#2c336b] text-[26px] font-extrabold mb-3 leading-tight">24/7<br/>Medicines</h3>
               <p className="text-[#2c336b]/80 text-[15px] font-medium leading-relaxed">Essentials at your doorstep</p>
             </div>
             <div className="absolute bottom-4 right-4 opacity-[0.15] group-hover:scale-110 group-hover:opacity-[0.25] transition-all duration-500 origin-bottom-right">
               <Pill className="w-36 h-36 text-[#2c336b] -rotate-45" strokeWidth={1} />
             </div>
             <div className="bg-[#2c336b] text-white w-10 h-10 rounded-full flex items-center justify-center relative z-10 shadow-lg mt-auto">
               <ArrowRight className="w-5 h-5" strokeWidth={2.5} />
             </div>
          </Link>
          
          {/* Card 2 */}
          <Link href="/services/general-practice" className="bg-[#f4df82] rounded-[2rem] p-8 relative overflow-hidden h-[280px] flex flex-col justify-between group cursor-pointer hover:-translate-y-1 transition-transform shadow-sm">
             <div className="relative z-10 mt-2">
               <h3 className="text-[#2c336b] text-[26px] font-extrabold mb-3 leading-tight">Instant Video<br/>Consultation</h3>
               <p className="text-[#2c336b]/80 text-[15px] font-medium leading-relaxed">Connect within 60 seconds</p>
             </div>
             <div className="absolute bottom-4 right-4 opacity-[0.15] group-hover:scale-110 group-hover:opacity-[0.25] transition-all duration-500 origin-bottom-right flex items-end">
               <Smartphone className="w-20 h-20 text-[#2c336b]" strokeWidth={1} />
               <Stethoscope className="w-28 h-28 text-[#2c336b] -ml-8 -mb-6" strokeWidth={1} />
             </div>
             <div className="bg-[#2c336b] text-white w-10 h-10 rounded-full flex items-center justify-center relative z-10 shadow-lg mt-auto">
               <ArrowRight className="w-5 h-5" strokeWidth={2.5} />
             </div>
          </Link>

          {/* Card 3 */}
          <Link href="/doctors" className="bg-[#bce4cd] rounded-[2rem] p-8 relative overflow-hidden h-[280px] flex flex-col justify-between group cursor-pointer hover:-translate-y-1 transition-transform shadow-sm">
             <div className="relative z-10 mt-2">
               <h3 className="text-[#2c336b] text-[26px] font-extrabold mb-3 leading-tight">Find Doctors<br/>near you</h3>
               <p className="text-[#2c336b]/80 text-[15px] font-medium leading-relaxed">Confirmed appointments</p>
             </div>
             <div className="absolute -bottom-6 right-2 opacity-[0.15] group-hover:scale-110 group-hover:opacity-[0.25] transition-all duration-500 origin-bottom-right">
               <User className="w-40 h-40 text-[#2c336b]" strokeWidth={1} />
             </div>
             <div className="bg-[#2c336b] text-white w-10 h-10 rounded-full flex items-center justify-center relative z-10 shadow-lg mt-auto">
               <ArrowRight className="w-5 h-5" strokeWidth={2.5} />
             </div>
          </Link>

          {/* Card 4 */}
          <Link href="/services/diagnostics" className="bg-[#a9c7fb] rounded-[2rem] p-8 relative overflow-hidden h-[280px] flex flex-col justify-between group cursor-pointer hover:-translate-y-1 transition-transform shadow-sm">
             <div className="relative z-10 mt-2">
               <h3 className="text-[#2c336b] text-[26px] font-extrabold mb-3 leading-tight">Lab<br/>Tests</h3>
               <p className="text-[#2c336b]/80 text-[15px] font-medium leading-relaxed">Sample pickup at your home</p>
             </div>
             <div className="absolute -bottom-4 right-2 opacity-[0.15] group-hover:scale-110 group-hover:opacity-[0.25] transition-all duration-500 origin-bottom-right">
               <TestTube className="w-40 h-40 text-[#2c336b] rotate-12" strokeWidth={1} />
             </div>
             <div className="bg-[#2c336b] text-white w-10 h-10 rounded-full flex items-center justify-center relative z-10 shadow-lg mt-auto">
               <ArrowRight className="w-5 h-5" strokeWidth={2.5} />
             </div>
          </Link>
        </section>

        {/* Trust Bar */}
        <div className="bg-white rounded-[2rem] p-8 shadow-sm mb-16">
          <TrustBar />
        </div>

        {/* Why Choose Us Section */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-[#2c336b] mb-4">Why Choose WeCare</h2>
            <p className="text-gray-500 max-w-2xl mx-auto font-medium text-base">
              We blend cutting-edge medical expertise with genuine human warmth to provide an unparalleled healthcare experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const { Icon } = feature;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100 hover:-translate-y-1 transition-all duration-300 group"
                >
                  <div className={`w-14 h-14 rounded-2xl ${feature.bg} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-7 h-7 text-[#2c336b]" strokeWidth={2} />
                  </div>
                  <h3 className="text-xl text-[#2c336b] mb-3 font-extrabold">{feature.title}</h3>
                  <p className="text-gray-500 text-sm font-medium leading-relaxed">{feature.description}</p>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* Services Preview Section */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#2c336b] mb-4">Comprehensive Services</h2>
            <p className="text-gray-500 max-w-2xl mx-auto font-medium text-base">
              From routine check-ups to specialized diagnostic care, we offer a full spectrum of health services tailored to your unique needs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {services.slice(0, 6).map((service, index) => (
              <ServiceCard
                key={service.id}
                title={service.name}
                description={service.shortDescription}
                image={service.image}
                slug={service.slug}
              />
            ))}
          </div>

          <div className="flex justify-center mt-12">
            <Link href="/services">
              <button className="bg-[#f3d2de] text-[#2c336b] px-8 py-4 rounded-full font-bold text-[15px] flex items-center gap-4 hover:scale-105 transition shadow-lg cursor-pointer">
                <span>View All Services</span>
                <div className="bg-white rounded-full p-1.5 border border-black/5">
                  <ArrowRight className="w-4 h-4 text-[#2c336b]" strokeWidth={3} />
                </div>
              </button>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
