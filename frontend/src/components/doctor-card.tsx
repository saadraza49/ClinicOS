import Link from "next/link";
import Image from "next/image";

interface DoctorCardProps {
  name: string;
  specialty: string;
  credentials: string;
  image: string;
  slug: string;
}

export default function DoctorCard({
  name,
  specialty,
  credentials,
  image,
  slug,
}: DoctorCardProps) {
  return (
    <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-ambient border border-transparent hover:-translate-y-1 hover:shadow-ambient-hover hover:border-secondary-container transition-all duration-300 flex flex-col items-center group">
      {/* Avatar Container */}
      <div className="w-32 h-32 rounded-full overflow-hidden mb-4 border-4 border-surface ring-2 ring-primary/10 group-hover:ring-secondary/30 transition-all relative">
        <Image
          src={image}
          alt={`Portrait of ${name}`}
          fill
          sizes="128px"
          className="object-cover"
        />
      </div>

      {/* Specialty Badge */}
      <div className="bg-primary/10 text-primary font-label-sm text-label-sm px-3 py-1 rounded-full mb-3 font-semibold">
        {specialty}
      </div>

      {/* Name and Credentials */}
      <h3 className="text-headline-sm text-on-surface text-center mb-1 font-semibold text-lg">
        {name}
      </h3>
      <p className="text-body-md text-on-surface-variant text-center mb-6 text-sm">
        {credentials}
      </p>

      {/* View Profile Button Link */}
      <Link
        href={`/doctors/${slug}`}
        className="w-full mt-auto py-2.5 rounded-full border border-outline-variant font-label-md text-label-md text-primary text-center group-hover:bg-primary group-hover:text-on-primary group-hover:border-primary transition-all duration-300 font-medium active:scale-98"
      >
        View Profile
      </Link>
    </div>
  );
}
