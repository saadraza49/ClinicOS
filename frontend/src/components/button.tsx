import { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "secondary" | "outline";
}

export default function Button({
  children,
  variant = "primary",
  className = "",
  ...props
}: ButtonProps) {
  const baseStyles =
    "font-label-md text-label-md px-8 py-3.5 rounded-full transition-all duration-300 font-medium active:scale-95 shadow-sm hover:shadow-md outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 flex items-center justify-center gap-2 cursor-pointer";

  const variants = {
    primary:
      "bg-primary text-on-primary hover:bg-primary-container hover:shadow-lg hover:-translate-y-0.5",
    secondary:
      "bg-secondary text-on-secondary hover:bg-secondary-container hover:shadow-lg hover:-translate-y-0.5",
    outline:
      "border border-outline text-on-surface hover:bg-surface-container-low",
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
