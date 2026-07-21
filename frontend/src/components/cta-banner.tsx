import Link from "next/link";

interface CTABannerProps {
  title?: string;
  description?: string;
  buttonText?: string;
  buttonHref?: string;
  variant?: "primary" | "secondary";
}

export default function CTABanner({
  title = "Ready to prioritize your health?",
  description = "Schedule a consultation with one of our specialists today.",
  buttonText = "Book an Appointment",
  buttonHref = "/book-appointment",
  variant = "primary",
}: CTABannerProps) {
  const containerClasses =
    variant === "secondary"
      ? "bg-secondary-container rounded-2xl p-8 md:p-12 shadow-lg flex flex-col md:flex-row items-center justify-between text-center md:text-left border border-outline-variant/10 relative overflow-hidden"
      : "bg-primary-container rounded-2xl p-8 md:p-12 shadow-lg flex flex-col md:flex-row items-center justify-between text-center md:text-left relative overflow-hidden";

  const textClasses =
    variant === "secondary"
      ? "text-on-secondary-container"
      : "text-on-primary-container";

  const buttonClasses =
    variant === "secondary"
      ? "bg-surface-container-lowest text-secondary hover:bg-surface hover:scale-105 active:scale-95 transition-all duration-300 rounded-full px-8 py-3.5 font-label-md text-label-md font-medium shadow-md hover:shadow-lg whitespace-nowrap"
      : "bg-secondary text-on-secondary hover:bg-secondary-container hover:scale-105 active:scale-95 transition-all duration-300 rounded-full px-8 py-3.5 font-label-md text-label-md font-medium shadow-md hover:shadow-lg whitespace-nowrap";

  return (
    <div className={containerClasses}>
      {variant === "secondary" && (
        <div className="absolute -right-10 -top-10 w-40 h-40 bg-secondary opacity-10 rounded-full blur-2xl pointer-events-none"></div>
      )}
      <div className="mb-6 md:mb-0 md:mr-8 relative z-10">
        <h2 className={`text-headline-md mb-2 font-bold ${textClasses}`}>
          {title}
        </h2>
        <p className={`text-body-md ${variant === "secondary" ? "text-on-secondary-container/80" : "text-on-primary-container/80"}`}>
          {description}
        </p>
      </div>
      <Link href={buttonHref} className={`${buttonClasses} relative z-10`}>
        {buttonText}
      </Link>
    </div>
  );
}
