import type { Metadata } from "next";
import { doctors } from "@/data/doctors";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata(
  { params }: Props
): Promise<Metadata> {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  const post = doctors.find((d) => d.slug === slug);
  
  if (!post) {
    return {
      title: "Not Found | LuminaHealth",
    };
  }

  // Handle case where title is just name for doctors, and excerpt/shortDescription for description
  const title = (post as any).title || (post as any).name || "Doctor Profile | LuminaHealth";
  const desc = (post as any).excerpt || (post as any).shortDescription || (post as any).bio || "Learn more about our clinical specialists at LuminaHealth.";

  return {
    title: `${title} | LuminaHealth`,
    description: desc,
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
