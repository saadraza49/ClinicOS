"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

interface ServiceCardProps {
  title: string;
  description?: string;
  image: string;
  slug: string;
  index?: number;
}

export default function ServiceCard({
  title,
  description,
  image,
  slug,
  index = 0,
}: ServiceCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className="h-full"
    >
      <Link
        href={`/services/${slug}`}
        className="group block h-full rounded-[2rem] overflow-hidden bg-white border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between cursor-pointer"
      >
        {/* Top Image Container */}
        <div className="relative w-full h-[220px] sm:h-[240px] overflow-hidden bg-[#2c336b]/10">
          <Image
            src={image}
            alt={title}
            fill
            quality={90}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>

        {/* Bottom Label Strip */}
        <div className="bg-[#2c336b] text-white p-5 flex flex-col items-center justify-center text-center flex-grow group-hover:bg-[#353d74] transition-colors duration-300 min-h-[90px]">
          <h3 className="text-white text-lg sm:text-[19px] font-extrabold tracking-wide leading-snug">
            {title}
          </h3>
          {description && (
            <p className="text-white/80 text-xs sm:text-sm mt-1 font-medium line-clamp-2 max-w-[92%]">
              {description}
            </p>
          )}
        </div>
      </Link>
    </motion.div>
  );
}
