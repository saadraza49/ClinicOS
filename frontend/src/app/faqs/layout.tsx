import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Frequently Asked Questions | LuminaHealth",
  description: "Find answers to common questions about appointments, insurance, and our clinical services.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
