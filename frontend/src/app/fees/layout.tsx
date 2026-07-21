import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Transparent Pricing & Fees | LuminaHealth",
  description: "High-quality care with no hidden costs. Explore our detailed service fees and membership plans.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
