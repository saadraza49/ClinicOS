import type { Metadata } from "next";
import { blogPosts } from "@/data/blog";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata(
  { params }: Props
): Promise<Metadata> {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  const post = blogPosts.find((p) => p.slug === slug);
  
  if (!post) {
    return {
      title: "Not Found | LuminaHealth",
    };
  }

  // Handle case where title is just name for doctors, and excerpt/shortDescription for description
  const title = (post as any).title || (post as any).name || "Blog Article | LuminaHealth";
  const desc = (post as any).excerpt || (post as any).shortDescription || (post as any).bio || "Read the latest health articles and insights from LuminaHealth.";

  return {
    title: `${title} | LuminaHealth`,
    description: desc,
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
