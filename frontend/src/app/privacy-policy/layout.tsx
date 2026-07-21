import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | LuminaHealth",
  description: "Read how LuminaHealth protects your personal and medical information.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
