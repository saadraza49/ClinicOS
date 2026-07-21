import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Specialized Services | LuminaHealth",
  description: "Comprehensive, human-centric healthcare tailored to your unique needs. Explore diagnostics, vaccinations, and more.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
