import { motion } from "framer-motion";

interface TrustBarProps {
  className?: string;
  animate?: boolean;
}

export default function TrustBar({ className = "", animate = true }: TrustBarProps) {
  const Tag = animate ? motion.div : "div";

  const motionProps = animate
    ? {
        initial: { opacity: 0, y: 15 },
        whileInView: { opacity: 0.7, y: 0 },
        viewport: { once: true },
        transition: { duration: 0.6 },
      }
    : {};

  return (
    <Tag
      {...motionProps}
      className={`flex flex-wrap justify-center items-center gap-8 md:gap-16 grayscale hover:grayscale-0 transition-all duration-500 ${className}`}
    >
      <div className="flex items-center gap-2 text-on-surface-variant font-semibold text-label-md select-none">
        <span className="material-symbols-outlined text-2xl text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>
          verified
        </span>
        <span className="tracking-wider uppercase">ISO Certified</span>
      </div>
      <div className="flex items-center gap-2 text-on-surface-variant font-semibold text-label-md select-none">
        <span className="material-symbols-outlined text-2xl text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>
          health_and_safety
        </span>
        <span className="tracking-wider uppercase">National Medical Board</span>
      </div>
      <div className="flex items-center gap-2 text-on-surface-variant font-semibold text-label-md select-none">
        <span className="material-symbols-outlined text-2xl text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>
          star
        </span>
        <span className="tracking-wider uppercase">Top Tier Care Award</span>
      </div>
    </Tag>
  );
}
