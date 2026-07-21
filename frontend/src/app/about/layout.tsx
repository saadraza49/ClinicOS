import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us | LuminaHealth",
  description: "Learn about LuminaHealth, our story, core values, and our commitment to compassionate, excellent healthcare.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
