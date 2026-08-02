import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms & Conditions | LuminaHealth",
  description: "Terms and conditions for using LuminaHealth services and digital platforms.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
