import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import Chatbot from "@/components/chatbot";
import { AuthProvider } from "@/context/AuthContext";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-display",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LuminaHealth - Your Health, Our Heart",
  description: "Compassionate, modern care for you and your family. Experience healthcare designed around your comfort and well-being.",
  openGraph: {
    title: "LuminaHealth - Your Health, Our Heart",
    description: "Compassionate, modern care for you and your family.",
    url: "https://luminahealth.com",
    siteName: "LuminaHealth",
    images: [
      {
        url: "https://lh3.googleusercontent.com/aida-public/AB6AXuCrhBMP_1QTD4zBE7bKZ-zbVlvaJb2VwAJKVWhkSN5g5dKE0ZdCEueeJaBSHPsXgnIHn8jHOo5ajFbWQa_ooSCChFlhFC0qOFFxBFvOuMSHOdzhkcqHoYDnLRYV-05n2OrVgenLe17G86Riwc0MUGZB9XcPtttkKhP-ohJmzLu7jLoUDT_KLnp9Ho-ExRoAvM2hbOYgGY58tgzOLnH5XbVXfSNpT-1g9sew_DLxPNnN9US7Fm3HGcrEymnEOvFlCJuj-ktFO2KA-RfI", // using the clinic interior image
        width: 1200,
        height: 630,
        alt: "LuminaHealth Clinic Interior",
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${plusJakartaSans.variable} h-full antialiased scroll-smooth`}
    >
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body suppressHydrationWarning className="min-h-full flex flex-col bg-background text-on-background font-body-md selection:bg-primary-container selection:text-on-primary-container">
        <AuthProvider>
          <Navbar />
          <main className="flex-grow">{children}</main>
          <Footer />
          <Chatbot />
        </AuthProvider>
      </body>
    </html>
  );
}

