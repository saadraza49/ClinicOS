import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Health Blog & News | LuminaHealth",
  description: "Stay informed with expert medical advice, clinic updates, and wellness strategies from the LuminaHealth team.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
