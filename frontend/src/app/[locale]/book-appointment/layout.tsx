import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Book an Appointment | LuminaHealth",
  description: "Schedule your consultation in minutes. Same-day availability for urgent non-emergency concerns.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
