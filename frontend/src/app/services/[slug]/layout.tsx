import type { Metadata } from "next";
import { services } from "@/data/services";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata(
  { params }: Props
): Promise<Metadata> {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  const post = services.find((s) => s.slug === slug);
  
  if (!post) {
    return {
      title: "Not Found | LuminaHealth",
    };
  }

  // Handle case where title is just name for doctors, and excerpt/shortDescription for description
  const title = (post as any).title || (post as any).name || "Service Details | LuminaHealth";
  const desc = (post as any).excerpt || (post as any).shortDescription || (post as any).bio || "Learn more about our specialized health services.";

  return {
    title: `${title} | LuminaHealth`,
    description: desc,
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
