"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
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
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [prevImageIndex, setPrevImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (isHovered) return;
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => {
        setPrevImageIndex(prev);
        return (prev + 1) % heroImages.length;
      });
    }, 4000);
    return () => clearInterval(interval);
  }, [isHovered]);

  const handleSelectSlide = (index: number) => {
    setCurrentImageIndex((prev) => {
      if (prev === index) return prev;
      setPrevImageIndex(prev);
      return index;
    });
  };

  return (
    <div className="bg-[#f5f5f5] min-h-screen font-sans pb-16">
      <div className="max-w-[1400px] mx-auto px-4 md:px-6 pt-4">
        {/* Main Hero Banner */}
        <section className="relative bg-[#2c336b] rounded-[2rem] overflow-hidden min-h-[520px] md:min-h-[580px] flex items-center justify-center mb-6 py-12 md:py-0">
          {/* Big background text */}
          <div className="absolute inset-0 flex items-center justify-center z-0 overflow-hidden pointer-events-none">
            <h1 
              className="font-black text-white/95 leading-none select-none tracking-tight text-center w-full px-2"
              style={{ 
                fontSize: 'clamp(2.5rem, 11vw, 9rem)', 
                transform: 'translateY(-8%)',
                textShadow: 'none',
                WebkitTextStroke: '0px transparent',
                WebkitFontSmoothing: 'antialiased',
              }}
            >
              Healthcare
            </h1>
          </div>
          
          {/* Main Doctor Image Carousel Container */}
          <div 
            className="relative z-10 w-[88%] sm:w-[80%] md:w-full max-w-lg h-[360px] sm:h-[420px] md:h-[480px] mt-8 md:mt-12 mx-auto rounded-[2rem] overflow-hidden shadow-2xl bg-[#2c336b]"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {/* Underlay Image (Previous slide for seamless crossfade) */}
            <div className="absolute inset-0 w-full h-full">
              <Image 
                src={heroImages[prevImageIndex].src} 
                alt={heroImages[prevImageIndex].alt} 
                fill
                quality={90}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 500px"
                className="object-cover"
                style={{ objectPosition: 'center top' }}
              />
            </div>

            {/* Active Fading Image */}
            <AnimatePresence mode="sync">
              <motion.div
                key={currentImageIndex}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, ease: "easeInOut" }}
                className="absolute inset-0 w-full h-full z-10"
              >
                <Image 
                  src={heroImages[currentImageIndex].src} 
                  alt={heroImages[currentImageIndex].alt} 
                  fill
                  priority={currentImageIndex === 0}
                  quality={90}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 500px"
                  className="object-cover"
                  style={{ objectPosition: 'center top' }}
                />
              </motion.div>
            </AnimatePresence>

            {/* Carousel Dots */}
            <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2.5 bg-black/30 backdrop-blur-md px-4 py-2 rounded-full border border-white/15">
              {heroImages.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleSelectSlide(i)}
                  className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                    i === currentImageIndex 
                      ? "w-7 bg-[#f3d2de] shadow-sm" 
                      : "w-2.5 bg-white/40 hover:bg-white/70"
                  }`}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Floating Badges */}
          <motion.div 
            className="absolute left-[4%] md:left-[8%] lg:left-[16%] top-[42%] md:top-[48%] z-20 bg-[#353d74] border border-[#48508a] rounded-full pl-2 pr-5 py-2 hidden md:flex items-center gap-3 shadow-xl"
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 3.2, ease: "easeInOut" }}
          >
             <div className="bg-[#a9c7fb] p-1.5 rounded-full">
                <RefreshCcw className="w-4 h-4 text-[#2c336b]" strokeWidth={2.5} />
             </div>
             <span className="text-[#a9c7fb] text-sm font-semibold tracking-wide">Reduced Uric Acid</span>
          </motion.div>

          <motion.div 
            className="absolute right-[4%] md:right-[8%] lg:right-[16%] top-[42%] md:top-[48%] z-20 bg-[#353d74] border border-[#48508a] rounded-full pl-2 pr-5 py-2 hidden md:flex items-center gap-3 shadow-xl"
            animate={{ y: [0, -12, 0] }}
            transition={{ repeat: Infinity, duration: 3.8, ease: "easeInOut", delay: 0.4 }}
          >
             <div className="bg-[#f3d2de] p-1.5 rounded-full">
                <Ban className="w-4 h-4 text-[#2c336b]" strokeWidth={2.5} />
             </div>
             <span className="text-[#f3d2de] text-sm font-semibold tracking-wide">No more tablets</span>
          </motion.div>

          {/* Bottom Left Text */}
          <div className="absolute bottom-10 left-10 z-20 max-w-[340px] hidden md:block">
             <p className="text-white/80 text-[11px] font-bold leading-[1.8] tracking-wider uppercase">
               If you're looking for a creative and easy<br/>way to build a website, branding face is<br/>the perfect solution.
             </p>
          </div>

          {/* Bottom Right Button */}
          <div className="absolute bottom-10 right-10 z-20">
             <Link href="/book-appointment">
               <button className="bg-[#f3d2de] text-[#2c336b] px-6 py-3.5 rounded-full font-bold text-[15px] flex items-center gap-4 hover:scale-105 transition shadow-xl cursor-pointer">
                 Book Appointment
                 <div className="bg-white rounded-full p-1.5 border border-black/5">
                   <ArrowRight className="w-4 h-4 text-[#2c336b]" strokeWidth={3} />
                 </div>
               </button>
             </Link>
          </div>
        </section>

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
