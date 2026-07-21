import { motion } from "framer-motion";
import Button from "@/components/button";

export interface PricingFeature {
  text: string;
  included: boolean;
}

interface PricingTierCardProps {
  name: string;
  price: string;
  period?: string;
  description: string;
  features: PricingFeature[];
  isPopular?: boolean;
  buttonText?: string;
  onChoose?: () => void;
}

export default function PricingTierCard({
  name,
  price,
  period = "/mo",
  description,
  features,
  isPopular = false,
  buttonText = "Choose Plan",
  onChoose,
}: PricingTierCardProps) {
  return (
    <div
      className={`bg-surface-container-lowest rounded-3xl p-8 shadow-ambient hover:shadow-interactive hover:-translate-y-1 transition-all duration-300 flex flex-col relative border h-full ${isPopular ? "border-2 border-primary scale-102 z-10" : "border-outline-variant/20"
        }`}
    >
      {isPopular && (
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-secondary text-on-secondary px-4 py-1 rounded-full text-label-sm font-semibold tracking-wider whitespace-nowrap shadow-sm select-none">
          Most Popular
        </div>
      )}

      {/* Plan Header */}
      <div className="mb-6">
        <h3 className="text-headline-sm text-on-surface mb-2 font-bold">{name}</h3>
        <div className="flex items-baseline gap-1 mb-3">
          <span className="text-display-lg-mobile md:text-display-lg font-bold text-primary">
            {price}
          </span>
          <span className="text-on-surface-variant font-medium text-body-md">
            {period}
          </span>
        </div>
        <p className="text-body-md text-on-surface-variant leading-relaxed">
          {description}
        </p>
      </div>

      {/* Plan Features */}
      <ul className="space-y-4 mb-8 flex-grow">
        {features.map((feature, idx) => (
          <li
            key={idx}
            className={`flex items-start gap-3 text-body-md ${feature.included ? "text-on-surface" : "text-on-surface-variant/40"
              }`}
          >
            <span
              className={`material-symbols-outlined text-sm mt-1 select-none ${feature.included ? "text-primary" : "text-on-surface-variant/30"
                }`}
              style={{ fontVariationSettings: feature.included ? "'FILL' 1" : "'FILL' 0" }}
            >
              {feature.included ? "check_circle" : "cancel"}
            </span>
            <span className="leading-tight">{feature.text}</span>
          </li>
        ))}
      </ul>

      {/* Button */}
      <div className="mt-auto">
        <Button
          variant={isPopular ? "primary" : "outline"}
          onClick={onChoose}
          className="w-full justify-center text-label-md"
        >
          {buttonText}
        </Button>
      </div>
    </div>
  );
}
