"use client";

import { use } from "react";
import Link from "next/link";
import { blogPosts } from "@/data/blog";
import BlogCard from "@/components/blog-card";
import Button from "@/components/button";
import CTABanner from "@/components/cta-banner";
import Image from "next/image";
import { motion } from "framer-motion";

interface BlogDetailPageProps {
  params: Promise<{ slug: string }>;
}

const authorBios: Record<string, { role: string; bio: string; photo: string }> = {
  "Dr. Sarah Jenkins": {
    role: "Consultant Physician",
    bio: "Dr. Jenkins is a senior physician specializing in preventive health diagnostics and patient-first care maps. She has dedicated 12 years to community health development.",
    photo: "https://lh3.googleusercontent.com/aida-public/AB6AXuDn9dfNPnhao4mH0hlER2Lpm2JHTFAdhHVUslNCMht-T8tyojAt-qPlYPhXQWI4gVfsG9SZ8tkMbl9mGZ31wDCXi-EyIiDzygAf6bEPn_nlt4L59UpyMv2DvaWvLPDzXnslxXN0QSIFxfpVsbaN7HwHBfAW-M9vBp7W2up3Rk0zD1HBzlIlKwYOVMmhJ1-16TwoHk3z4HStTpKxDWiNp9R32EzDg3O6yBidZz94UW2b-KL3ZhQP43ZbctPTkXU62W_sMeP8z3dSv_-n",
  },
  "Dietitian Mark": {
    role: "Chief Nutritional Lead",
    bio: "Mark focuses on functional nutrition and metabolic support. He designs dietary strategies to help patients manage inflammation, weight, and improve physical performance.",
    photo: "https://lh3.googleusercontent.com/aida-public/AB6AXuDn9dfNPnhao4mH0hlER2Lpm2JHTFAdhHVUslNCMht-T8tyojAt-qPlYPhXQWI4gVfsG9SZ8tkMbl9mGZ31wDCXi-EyIiDzygAf6bEPn_nlt4L59UpyMv2DvaWvLPDzXnslxXN0QSIFxfpVsbaN7HwHBfAW-M9vBp7W2up3Rk0zD1HBzlIlKwYOVMmhJ1-16TwoHk3z4HStTpKxDWiNp9R32EzDg3O6yBidZz94UW2b-KL3ZhQP43ZbctPTkXU62W_sMeP8z3dSv_-n",
  },
  "Dr. E. Rossi": {
    role: "Lead Clinical Psychologist",
    bio: "Dr. Rossi specializes in cognitive behavioral therapy (CBT) and occupational stress recovery. She has 8+ years helping individuals navigate life changes and stress triggers.",
    photo: "https://lh3.googleusercontent.com/aida-public/AB6AXuDn9dfNPnhao4mH0hlER2Lpm2JHTFAdhHVUslNCMht-T8tyojAt-qPlYPhXQWI4gVfsG9SZ8tkMbl9mGZ31wDCXi-EyIiDzygAf6bEPn_nlt4L59UpyMv2DvaWvLPDzXnslxXN0QSIFxfpVsbaN7HwHBfAW-M9vBp7W2up3Rk0zD1HBzlIlKwYOVMmhJ1-16TwoHk3z4HStTpKxDWiNp9R32EzDg3O6yBidZz94UW2b-KL3ZhQP43ZbctPTkXU62W_sMeP8z3dSv_-n",
  },
  "Clinic Staff": {
    role: "Lumina Care Coordination",
    bio: "Our integrated care coordination team works around the clock to provide timely resources, vaccinations scheduling, and clinical assistance.",
    photo: "https://lh3.googleusercontent.com/aida-public/AB6AXuDn9dfNPnhao4mH0hlER2Lpm2JHTFAdhHVUslNCMht-T8tyojAt-qPlYPhXQWI4gVfsG9SZ8tkMbl9mGZ31wDCXi-EyIiDzygAf6bEPn_nlt4L59UpyMv2DvaWvLPDzXnslxXN0QSIFxfpVsbaN7HwHBfAW-M9vBp7W2up3Rk0zD1HBzlIlKwYOVMmhJ1-16TwoHk3z4HStTpKxDWiNp9R32EzDg3O6yBidZz94UW2b-KL3ZhQP43ZbctPTkXU62W_sMeP8z3dSv_-n",
  },
  "Lumina Management": {
    role: "Clinic Operations",
    bio: "The LuminaHealth management team is dedicated to designing premium clinical facilities and offering modern amenities for outstanding patient care.",
    photo: "https://lh3.googleusercontent.com/aida-public/AB6AXuDn9dfNPnhao4mH0hlER2Lpm2JHTFAdhHVUslNCMht-T8tyojAt-qPlYPhXQWI4gVfsG9SZ8tkMbl9mGZ31wDCXi-EyIiDzygAf6bEPn_nlt4L59UpyMv2DvaWvLPDzXnslxXN0QSIFxfpVsbaN7HwHBfAW-M9vBp7W2up3Rk0zD1HBzlIlKwYOVMmhJ1-16TwoHk3z4HStTpKxDWiNp9R32EzDg3O6yBidZz94UW2b-KL3ZhQP43ZbctPTkXU62W_sMeP8z3dSv_-n",
  },
  "Dr. James Wilson": {
    role: "Chief of General Medicine",
    bio: "Dr. Wilson specializes in preventative care and nutritional wellness. With over 15 years of experience, he is passionate about empowering patients to take charge of their health through holistic, evidence-based approaches.",
    photo: "https://lh3.googleusercontent.com/aida-public/AB6AXuD_xgUG4dwFPWY3ltsmQSFP5YuiTyShh7u4w4ilsIsaBNrwkD95lZN-0hhl2Bcvt-rSDCEGKmivfEUlM3xvGcyMCJW1bMm149X-TXjzwRFjr3VEAPl9oETiHSxXNvIcadzSBUKA6uozan9hapRd1r1lyPeafDiLFxrN2wR2Tx8y94nML1_7eQnsRZhTdLAkalT6JnEsPqpKEH3-1a4PmfCGUsf1uUDL8ncs1TMvXq9YRbfcD0sWOn8mTZ_Tx6vpJSROQgxbkmUPonLI",
  },
};

export default function BlogDetailPage({ params }: BlogDetailPageProps) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;

  const post = blogPosts.find((p) => p.slug === slug);

  if (!post) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
        <span className="material-symbols-outlined text-primary text-6xl mb-4 select-none">
          error_outline
        </span>
        <h1 className="text-headline-md font-bold mb-2">Article Not Found</h1>
        <p className="text-body-lg text-on-surface-variant max-w-md mb-8">
          We couldn't find the requested blog article. It may have been renamed or deleted.
        </p>
        <Link href="/blog">
          <Button variant="primary">Return to Blog</Button>
        </Link>
      </div>
    );
  }

  // Get author details (fallback if not in authorBios)
  const authorInfo = authorBios[post.author] || {
    role: "Medical Writer",
    bio: "Health writer dedicated to making clinical concepts accessible and actionable for everyday wellness.",
    photo: post.authorPhoto,
  };

  // Find related articles (same category, excluding this one)
  const relatedArticles = blogPosts
    .filter((p) => p.category === post.category && p.id !== post.id)
    .slice(0, 3);

  const handleShareAlert = (platform: string) => {
    alert(`Sharing this article via ${platform}!`);
  };

  return (
    <div className="overflow-x-hidden">
      <main className="max-w-7xl mx-auto px-4 md:px-6 py-12 relative">
        
        {/* Breadcrumbs */}
        <nav className="text-label-md text-on-surface-variant mb-8 flex items-center gap-1">
          <Link href="/" className="hover:text-primary transition-colors font-semibold">
            Home
          </Link>
          <span className="material-symbols-outlined text-[16px] text-on-surface-variant/40 select-none">
            chevron_right
          </span>
          <Link href="/blog" className="hover:text-primary transition-colors font-semibold">
            Blog
          </Link>
          <span className="material-symbols-outlined text-[16px] text-on-surface-variant/40 select-none">
            chevron_right
          </span>
          <span className="text-on-surface font-semibold truncate max-w-[200px] md:max-w-none">
            {post.title}
          </span>
        </nav>

        <article className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Sticky Social Share Sidebar (Desktop) */}
          <div className="hidden lg:block lg:col-span-1 lg:col-start-2 relative">
            <div className="sticky top-24 flex flex-col gap-4 items-center">
              <button
                onClick={() => handleShareAlert("Facebook/Twitter")}
                aria-label="Share"
                className="w-11 h-11 rounded-full bg-surface-container-lowest shadow-sm flex items-center justify-center text-primary hover:bg-primary hover:text-on-primary transition-colors border border-outline-variant/10 group cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px] group-hover:scale-108 transition-transform">
                  share
                </span>
              </button>
              <button
                onClick={() => handleShareAlert("Bookmarks")}
                aria-label="Bookmark"
                className="w-11 h-11 rounded-full bg-surface-container-lowest shadow-sm flex items-center justify-center text-primary hover:bg-primary hover:text-on-primary transition-colors border border-outline-variant/10 group cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px] group-hover:scale-108 transition-transform">
                  bookmark
                </span>
              </button>
              <button
                onClick={() => window.print()}
                aria-label="Print"
                className="w-11 h-11 rounded-full bg-surface-container-lowest shadow-sm flex items-center justify-center text-primary hover:bg-primary hover:text-on-primary transition-colors border border-outline-variant/10 group cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px] group-hover:scale-108 transition-transform">
                  print
                </span>
              </button>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-8 space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-surface-container-lowest rounded-3xl p-6 md:p-10 shadow-ambient border border-outline-variant/10"
            >
              
              {/* Header Title Block */}
              <header className="space-y-4 mb-8 text-center md:text-left border-b border-outline-variant/10 pb-6">
                <span className="inline-block bg-primary/10 text-primary px-3.5 py-1.5 rounded-full text-xs font-semibold border border-primary/20 select-none">
                  {post.category}
                </span>
                <h1 className="text-display-lg-mobile md:text-headline-md lg:text-display-lg-mobile text-on-background font-bold leading-tight">
                  {post.title}
                </h1>
                
                {/* Author Metadata */}
                <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4 pt-4">
                  <Image
                    className="rounded-full object-cover border border-outline-variant/20 shadow-sm"
                    alt={post.author}
                    src={post.authorPhoto}
                    width={48}
                    height={48}
                  />
                  <div className="text-center sm:text-left">
                    <p className="text-label-md font-bold text-on-surface">
                      {post.author}
                    </p>
                    <p className="text-xs text-on-surface-variant font-medium flex items-center justify-center sm:justify-start gap-1 mt-0.5">
                      <span>{post.date}</span>
                      <span>•</span>
                      <span className="flex items-center gap-[2px]">
                        <span className="material-symbols-outlined text-[14px]">schedule</span>
                        {post.readTime}
                      </span>
                    </p>
                  </div>
                </div>
              </header>

              {/* Large Featured Image */}
              <figure className="w-full relative rounded-2xl overflow-hidden shadow-sm mb-8 bg-surface-container-lowest border border-outline-variant/10">
                <Image
                  className="object-cover aspect-video"
                  alt={post.title}
                  src={post.featuredImage}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 66vw"
                />
              </figure>

              {/* Rich Text Body */}
              <div
                className="blog-content-wrapper font-body-lg text-body-lg text-on-surface-variant leading-relaxed"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />

              {/* Mobile share items row */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-6 mt-10 border-t border-b border-outline-variant/10 gap-4">
                <div className="flex flex-wrap gap-2">
                  <span className="bg-surface-container text-primary-container-on-primary px-3 py-1 rounded-full text-label-sm font-semibold border border-primary/10">
                    {post.category}
                  </span>
                  <span className="bg-surface-container text-primary-container-on-primary px-3 py-1 rounded-full text-label-sm font-semibold border border-primary/10">
                    Wellness
                  </span>
                </div>
                <div className="flex gap-3 lg:hidden">
                  <button
                    onClick={() => handleShareAlert("Social Networks")}
                    className="w-10 h-10 rounded-full bg-surface-container-low/50 shadow-sm flex items-center justify-center text-primary hover:bg-primary hover:text-on-primary transition-colors border border-outline-variant/10"
                  >
                    <span className="material-symbols-outlined text-[20px]">share</span>
                  </button>
                  <button
                    onClick={() => handleShareAlert("Bookmarks")}
                    className="w-10 h-10 rounded-full bg-surface-container-low/50 shadow-sm flex items-center justify-center text-primary hover:bg-primary hover:text-on-primary transition-colors border border-outline-variant/10"
                  >
                    <span className="material-symbols-outlined text-[20px]">bookmark</span>
                  </button>
                </div>
              </div>

              {/* Author Bio Card */}
              <div className="bg-surface-container-low/30 rounded-3xl p-6 md:p-8 border border-outline-variant/10 mt-10 flex flex-col sm:flex-row gap-6 items-center sm:items-start text-center sm:text-left">
                <Image
                  className="rounded-full object-cover flex-shrink-0 border border-outline-variant/20 shadow-sm"
                  alt={post.author}
                  src={authorInfo.photo}
                  width={80}
                  height={80}
                />
                <div className="space-y-2">
                  <h3 className="text-headline-sm font-bold text-on-background">
                    {post.author}
                  </h3>
                  <p className="text-xs text-primary font-bold tracking-wider uppercase">
                    {authorInfo.role}
                  </p>
                  <p className="text-body-md text-on-surface-variant text-sm leading-relaxed">
                    {authorInfo.bio}
                  </p>
                </div>
              </div>

            </motion.div>
          </div>

        </article>
      </main>

      {/* Related Articles Section */}
      {relatedArticles.length > 0 && (
        <section className="bg-surface-container-low/30 py-16 border-t border-outline-variant/10 px-4 md:px-6">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-headline-md text-on-background mb-8 text-center font-bold">
              Related Articles
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedArticles.map((article) => (
                <BlogCard key={article.id} post={article} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Consultation booking CTA Banner */}
      <section className="px-4 md:px-6 py-20 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <CTABanner
            title="Enjoyed this article?"
            description="Take the next step in your health journey. Book a consultation with one of our specialists today to discuss your personalized wellness plan."
            buttonText="Book a Consultation"
            buttonHref="/book-appointment"
          />
        </motion.div>
      </section>
    </div>
  );
}
