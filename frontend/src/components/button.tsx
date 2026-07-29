import { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "secondary" | "outline";
  isLoading?: boolean;
}

export default function Button({
  children,
  variant = "primary",
  className = "",
  isLoading = false,
  disabled,
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
      disabled={disabled || isLoading}
      className={`${baseStyles} ${variants[variant]} ${isLoading || disabled ? "opacity-75 cursor-not-allowed pointer-events-none" : ""} ${className}`}
      {...props}
    >
      {isLoading ? (
        <>
          <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></span>
          <span>Processing...</span>
        </>
      ) : (
        children
      )}
    </button>
  );
}

