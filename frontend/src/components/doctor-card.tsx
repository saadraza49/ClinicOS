import Link from "next/link";
import Image from "next/image";

export interface DoctorCardProps {
  id?: string;
  name: string;
  specialty: string;
  credentials: string;
  image: string;
  slug: string;
  experience_years?: number;
  consultation_fee?: number;
  rating?: number;
  review_count?: number;
  working_days?: string[];
}

export default function DoctorCard({
  name,
  specialty,
  credentials,
  image,
  slug,
  experience_years,
  consultation_fee,
  rating = 5.0,
  review_count = 12,
  working_days = ["Mon", "Wed", "Fri"],
}: DoctorCardProps) {
  return (
    <div className="bg-surface-container-lowest rounded-3xl p-6 shadow-ambient border border-outline-variant/15 hover:-translate-y-1 hover:shadow-lg hover:border-primary/30 transition-all duration-300 flex flex-col items-center group relative overflow-hidden">
      {/* Top Badges: Fee & Rating */}
      <div className="w-full flex items-center justify-between gap-2 mb-3 text-xs">
        {rating !== undefined && (
          <span className="flex items-center gap-1 font-bold text-amber-900 bg-amber-50 border border-amber-200/60 px-2.5 py-0.5 rounded-full">
            <span className="material-symbols-outlined text-amber-500 text-sm select-none" style={{ fontVariationSettings: "'FILL' 1" }}>
              star
            </span>
            {rating.toFixed(1)} ({review_count})
          </span>
        )}
        {consultation_fee !== undefined && (
          <span className="font-bold text-primary bg-primary/10 px-2.5 py-0.5 rounded-full">
            ${consultation_fee} USD
          </span>
        )}
      </div>

      {/* Avatar Container */}
      <div className="w-28 h-28 rounded-full overflow-hidden mb-3 border-4 border-surface ring-2 ring-primary/10 group-hover:ring-primary/30 transition-all relative shadow-sm">
        <Image
          src={image}
          alt={`Portrait of ${name}`}
          fill
          sizes="112px"
          className="object-cover"
        />
      </div>

      {/* Specialty Badge */}
      <div className="bg-secondary/15 text-secondary-900 font-label-sm text-xs px-3 py-0.5 rounded-full mb-2 font-bold tracking-wide">
        {specialty}
      </div>

      {/* Name and Credentials */}
      <h3 className="text-headline-sm text-on-surface text-center mb-1 font-bold text-lg leading-snug">
        {name}
      </h3>
      <p className="text-body-md text-on-surface-variant text-center mb-3 text-xs line-clamp-1 font-medium">
        {credentials}
      </p>

      {/* Experience & Working Days */}
      <div className="w-full bg-surface-container-low p-2.5 rounded-2xl mb-4 text-xs space-y-1.5 border border-outline-variant/10">
        {experience_years !== undefined && (
          <div className="flex items-center justify-between text-on-surface-variant">
            <span className="font-medium flex items-center gap-1">
              <span className="material-symbols-outlined text-sm text-primary">history</span> Experience
            </span>
            <span className="font-bold text-on-surface">{experience_years}+ Years</span>
          </div>
        )}
        <div className="flex items-center justify-between text-on-surface-variant">
          <span className="font-medium flex items-center gap-1">
            <span className="material-symbols-outlined text-sm text-primary">calendar_today</span> Days
          </span>
          <span className="font-semibold text-primary text-[11px] truncate max-w-[120px]">
            {working_days.join(", ")}
          </span>
        </div>
      </div>

      {/* View Profile Button Link */}
      <div className="w-full grid grid-cols-2 gap-2 mt-auto">
        <Link
          href={`/doctors/${slug}`}
          className="w-full py-2 rounded-xl border border-outline-variant font-label-md text-xs text-on-surface text-center hover:bg-surface-container-high transition-all font-semibold"
        >
          View Profile
        </Link>
        <Link
          href={`/book-appointment?doctor=${slug}`}
          className="w-full py-2 rounded-xl bg-primary text-on-primary font-label-md text-xs text-center hover:bg-primary/90 transition-all font-bold shadow-2xs"
        >
          Book Visit
        </Link>
      </div>
    </div>
  );
}
