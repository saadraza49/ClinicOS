import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Booking Confirmed | LuminaHealth",
  description: "Your appointment at LuminaHealth is confirmed.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
