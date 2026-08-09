"use client";

import { Link } from "@/i18n/routing";
import Image from "next/image";
import { motion } from "framer-motion";
import { useLocale } from "next-intl";
import { getLocalizedServiceTitle, getLocalizedServiceDescription } from "@/lib/translations";

interface ServiceCardProps {
  title: string;
  description?: string;
  image: string;
  slug: string;
  icon?: string;
  price?: number;
  durationMinutes?: number;
  departmentName?: string;
  index?: number;
}

export default function ServiceCard({
  title,
  description,
  image,
  slug,
  icon,
  price,
  durationMinutes,
  departmentName,
  index = 0,
}: ServiceCardProps) {
  const locale = useLocale();
  const displayTitle = getLocalizedServiceTitle(title, locale);
  const displayDescription = description ? getLocalizedServiceDescription(description, title, locale) : "";
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
        className="group block h-full rounded-[2rem] overflow-hidden bg-white border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between cursor-pointer relative"
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
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/10"></div>

          {/* Top Badges */}
          <div className="absolute top-4 left-4 right-4 flex justify-between items-center pointer-events-none">
            {departmentName ? (
              <span className="bg-white/90 backdrop-blur-md text-[#2c336b] px-3 py-1 rounded-full text-xs font-bold shadow-sm">
                {departmentName}
              </span>
            ) : <span />}

            {price !== undefined && price > 0 && (
              <span className="bg-[#2c336b] text-white px-3 py-1 rounded-full text-xs font-extrabold shadow-sm">
                ${price}
              </span>
            )}
          </div>

          {/* Optional Center/Bottom Icon */}
          {icon && (
            <div className="absolute bottom-3 left-4 bg-white/90 backdrop-blur-md p-2 rounded-xl text-[#2c336b] shadow-sm flex items-center gap-1.5 text-xs font-bold">
              <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>
                {icon}
              </span>
              {durationMinutes && <span>{durationMinutes} min</span>}
            </div>
          )}
        </div>

        {/* Bottom Label Strip */}
        <div className="bg-[#2c336b] text-white p-5 flex flex-col items-center justify-center text-center flex-grow group-hover:bg-[#353d74] transition-colors duration-300 min-h-[95px]">
          <h3 className="text-white text-lg sm:text-[19px] font-extrabold tracking-wide leading-snug">
            {displayTitle}
          </h3>
          {displayDescription && (
            <p className="text-white/80 text-xs sm:text-sm mt-1.5 font-medium line-clamp-2 max-w-[95%]">
              {displayDescription}
            </p>
          )}
        </div>
      </Link>
    </motion.div>
  );
}

