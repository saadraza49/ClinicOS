import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us | LuminaHealth",
  description: "Get in touch with LuminaHealth for questions, support, or to schedule a visit.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
