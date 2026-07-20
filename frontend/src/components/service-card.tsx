import Link from "next/link";

interface ServiceCardProps {
  title: string;
  description: string;
  icon: string;
  slug: string;
  accentColor?: "primary" | "secondary" | "tertiary";
  delayClass?: string;
}

export default function ServiceCard({
  title,
  description,
  icon,
  slug,
  accentColor = "primary",
  delayClass = "",
}: ServiceCardProps) {
  const badgeColors = {
    primary: "bg-primary/10 text-primary",
    secondary: "bg-secondary/10 text-secondary",
    tertiary: "bg-tertiary/10 text-tertiary",
  };

  return (
    <Link
      href={`/services/${slug}`}
      className={`bg-surface-container-lowest rounded-2xl p-6 shadow-ambient hover:shadow-ambient-hover hover:scale-105 transition-all duration-300 cursor-pointer group flex flex-col justify-between ${delayClass}`}
    >
      <div className="flex items-start gap-4">
        <div className={`p-3 rounded-xl shrink-0 ${badgeColors[accentColor]}`}>
          <span className="material-symbols-outlined text-2xl">{icon}</span>
        </div>
        <div>
          <h3 className="text-headline-sm text-on-background mb-2 text-lg font-semibold group-hover:text-primary transition-colors duration-200">
            {title}
          </h3>
          <p className="text-body-md text-on-surface-variant text-sm mb-4 leading-relaxed">
            {description}
          </p>
        </div>
      </div>
      <div className="pl-14 flex items-center gap-1.5 text-label-sm text-primary font-bold">
        <span>Learn More</span>
        <span className="material-symbols-outlined text-sm transition-transform duration-200 group-hover:translate-x-1">
          arrow_forward
        </span>
      </div>
    </Link>
  );
}
