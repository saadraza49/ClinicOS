"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, Pill, Stethoscope, Smartphone, User, TestTube, RefreshCcw, Ban, Calendar, Award, Receipt, ShieldCheck } from "lucide-react";
import ServiceCard from "@/components/service-card";
import TrustBar from "@/components/trust-bar";

// Services Data
const services = [
  {
    title: "General Practice",
    description: "Routine check-ups, preventative care, and managing common illnesses.",
    icon: "medical_services",
    slug: "general-practice",
  },
  {
    title: "Pediatrics",
    description: "Specialized care for infants, children, and adolescents in a welcoming setting.",
    icon: "child_care",
    slug: "pediatrics",
  },
  {
    title: "Cardiology",
    description: "Expert diagnosis and management of heart and cardiovascular conditions.",
    icon: "favorite",
    slug: "cardiology",
  },
  {
    title: "Dental Care",
    description: "Comprehensive dentistry for a healthy, confident smile.",
    icon: "dentistry",
    slug: "dental-care",
  },
  {
    title: "Wellness",
    description: "Holistic approaches including nutrition counseling and stress management.",
    icon: "spa",
    slug: "wellness",
  },
  {
    title: "Diagnostics",
    description: "State-of-the-art imaging and laboratory services for accurate results.",
    icon: "science",
    slug: "diagnostics",
  },
];

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

export default function Home() {
  return (
    <div className="bg-[#f5f5f5] min-h-screen font-sans pb-16">
      <div className="max-w-[1400px] mx-auto px-4 md:px-6 pt-4">
        {/* Main Hero Banner */}
        <section className="relative bg-[#2c336b] rounded-[2rem] overflow-hidden min-h-[520px] flex items-center justify-center mb-6">
          {/* Big background text */}
          <div className="absolute inset-0 flex items-center justify-center z-0 overflow-hidden pointer-events-none" style={{ top: '-10%' }}>
            <h1 className="text-[17vw] font-black text-white/95 leading-none select-none tracking-tight">
              Healthcare
            </h1>
          </div>
          
          {/* Main Doctor Image */}
          <div className="relative z-10 w-full max-w-lg h-[480px] mt-12 flex justify-center">
            <Image 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCrxcvCmpCjISwmEnXT08rlKGREMO9Ebd64CE5d-fx2bWVaTN97wwa11eKWdimNq8f8C7-2BbBdTv3wcvWxTMiEI14yWFqriYP7KEcl9qwocwXnx_ivfA8Ns0aKuySw0xZFkCAG9vcR_NdJ8umGPZLmNn7r0K6glnSCG1HfahXY2K8TuOlbeg1OEyuIIWPbnBWukH-VYjcO_82UgtrbaYSjNwlr95vm4cVpBFYsocA81d5s8b_pVeJ7B2L_4Qy_6kpzz7ClGZ-93eLr" 
              alt="Doctor" 
              fill
              priority
              className="object-cover drop-shadow-2xl"
              style={{ objectPosition: 'center top' }}
            />
          </div>

          {/* Floating Badges */}
          <div className="absolute left-[10%] md:left-[20%] top-[48%] z-20 bg-[#353d74] border border-[#48508a] rounded-full pl-2 pr-5 py-2 hidden md:flex items-center gap-3 shadow-lg">
             <div className="bg-[#a9c7fb] p-1.5 rounded-full">
                <RefreshCcw className="w-4 h-4 text-[#2c336b]" strokeWidth={2.5} />
             </div>
             <span className="text-[#a9c7fb] text-sm font-semibold tracking-wide">Reduced Uric Acid</span>
          </div>

          <div className="absolute right-[10%] md:right-[20%] top-[48%] z-20 bg-[#353d74] border border-[#48508a] rounded-full pl-2 pr-5 py-2 hidden md:flex items-center gap-3 shadow-lg">
             <div className="bg-[#f3d2de] p-1.5 rounded-full">
                <Ban className="w-4 h-4 text-[#2c336b]" strokeWidth={2.5} />
             </div>
             <span className="text-[#f3d2de] text-sm font-semibold tracking-wide">No more tablets</span>
          </div>

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
        <section className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-10">
            <div>
              <h2 className="text-3xl font-extrabold text-[#2c336b] mb-3">Comprehensive Services</h2>
              <p className="text-gray-500 max-w-xl font-medium text-base">
                From routine check-ups to specialized care, we offer a full spectrum of health services under one roof.
              </p>
            </div>
            <Link
              href="/services"
              className="hidden md:inline-flex items-center gap-2 text-[#2c336b] hover:text-[#353d74] transition-colors font-bold text-sm mt-4 md:mt-0"
            >
              <span>View All Services</span>
              <ArrowRight className="w-4 h-4 text-[#2c336b]" strokeWidth={2.5} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <ServiceCard
                key={service.title}
                title={service.title}
                description={service.description}
                icon={service.icon}
                slug={service.slug}
              />
            ))}
          </div>

          <div className="md:hidden flex justify-center mt-8">
            <Link
              href="/services"
              className="inline-flex items-center gap-2 text-[#2c336b] font-bold text-sm"
            >
              <span>View All Services</span>
              <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
