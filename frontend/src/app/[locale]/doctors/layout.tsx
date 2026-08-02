import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Clinical Team | LuminaHealth",
  description: "Meet our diverse group of world-class healthcare professionals dedicated to your well-being.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
