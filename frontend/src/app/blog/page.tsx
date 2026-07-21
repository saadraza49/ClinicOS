"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { blogPosts } from "@/data/blog";
import BlogCard from "@/components/blog-card";
import FilterPills from "@/components/filter-pills";
import Button from "@/components/button";

const categories = [
  { id: "all", name: "All Topics" },
  { id: "General Health", name: "General Health" },
  { id: "Nutrition", name: "Nutrition" },
  { id: "Mental Health", name: "Mental Health" },
  { id: "Vaccinations", name: "Vaccinations" },
  { id: "Clinic News", name: "Clinic News" },
];

export default function BlogListingPage() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [visibleCount, setVisibleCount] = useState(3);

  // Filter posts based on selected category
  const filteredPosts =
    selectedCategory === "all"
      ? blogPosts
      : blogPosts.filter((post) => post.category === selectedCategory);

  // Determine featured post:
  // 1. Check if there's an explicitly marked featured post in the filtered list
  // 2. If not, use the first post in the filtered list
  const featuredPost =
    filteredPosts.find((post) => post.isFeatured) || filteredPosts[0];

  // The rest of the posts go to the grid
  const gridPosts = featuredPost
    ? filteredPosts.filter((post) => post.id !== featuredPost.id)
    : filteredPosts;

  const hasMore = gridPosts.length > visibleCount;

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 3);
  };

  const handleCategoryChange = (catId: string) => {
    setSelectedCategory(catId);
    setVisibleCount(3); // Reset visible count on category change
  };

  return (
    <div className="overflow-x-hidden">
      {/* Page Header Banner */}
      <section className="pt-16 pb-10 px-4 md:px-6 max-w-7xl mx-auto text-center relative overflow-hidden">
        {/* Decorative background blur blob */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-full bg-surface-container-high rounded-full blur-3xl opacity-50 -z-10"></div>
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-display-lg-mobile md:text-display-lg text-on-background mb-4 font-bold"
        >
          Health Tips &amp; News
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-body-lg text-on-surface-variant max-w-2xl mx-auto leading-relaxed"
        >
          Stay informed with expert medical advice, clinic updates, and wellness strategies for you and your family.
        </motion.p>
      </section>

      {/* Category Filter Pills */}
      <section className="px-4 md:px-6 max-w-7xl mx-auto mb-16">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <FilterPills
            categories={categories}
            selectedId={selectedCategory}
            onSelect={handleCategoryChange}
          />
        </motion.div>
      </section>

      {/* Featured Post Card */}
      {featuredPost && (
        <section className="px-4 md:px-6 max-w-7xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-surface-container-lowest rounded-3xl shadow-ambient overflow-hidden flex flex-col md:flex-row group hover:shadow-interactive transition-all duration-300 border border-outline-variant/10"
          >
            {/* Featured Image */}
            <div className="md:w-1/2 relative h-64 md:h-auto overflow-hidden">
              <Image
                className="object-cover transition-transform duration-700 group-hover:scale-103"
                alt={featuredPost.title}
                src={featuredPost.featuredImage}
                fill
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="absolute top-4 left-4 bg-surface-container-lowest/90 backdrop-blur-md px-3.5 py-1.5 rounded-full text-primary font-bold text-xs shadow-sm flex items-center gap-1 border border-outline-variant/10 select-none">
                <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  star
                </span>{" "}
                Featured
              </div>
            </div>

            {/* Featured Info */}
            <div className="md:w-1/2 p-6 md:p-10 flex flex-col justify-center">
              <span className="text-secondary font-bold text-xs tracking-wider uppercase mb-3 block">
                {featuredPost.category}
              </span>
              <h2 className="text-headline-md text-on-background mb-4 font-bold group-hover:text-primary transition-colors leading-tight">
                {featuredPost.title}
              </h2>
              <p className="text-body-md text-on-surface-variant mb-6 leading-relaxed">
                {featuredPost.excerpt}
              </p>

              {/* Author & Read Link */}
              <div className="flex items-center justify-between mt-auto pt-4 border-t border-outline-variant/10">
                <div className="flex items-center gap-3">
                  <Image
                    className="rounded-full object-cover border border-outline-variant/20"
                    alt={featuredPost.author}
                    src={featuredPost.authorPhoto}
                    width={40}
                    height={40}
                  />
                  <div>
                    <p className="text-label-md font-bold text-on-surface">
                      {featuredPost.author}
                    </p>
                    <p className="text-xs text-on-surface-variant font-medium">
                      {featuredPost.date} • {featuredPost.readTime}
                    </p>
                  </div>
                </div>
                <Link
                  className="text-primary font-bold text-sm hover:underline flex items-center gap-1"
                  href={`/blog/${featuredPost.slug}`}
                >
                  Read Article{" "}
                  <span className="material-symbols-outlined text-[18px]">
                    arrow_forward
                  </span>
                </Link>
              </div>
            </div>
          </motion.div>
        </section>
      )}

      {/* Blog Cards Grid */}
      <section className="px-4 md:px-6 max-w-7xl mx-auto mb-16">
        <AnimatePresence mode="popLayout">
          {gridPosts.length > 0 ? (
            <motion.div
              layout
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 min-h-[250px]"
            >
              {gridPosts.slice(0, visibleCount).map((post, idx) => (
                <motion.div
                  key={post.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 10 }}
                  transition={{ duration: 0.4, delay: idx * 0.05 }}
                >
                  <BlogCard post={post} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            gridPosts.length === 0 && !featuredPost && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20 bg-surface-container-lowest rounded-3xl border border-outline-variant/10"
              >
                <span className="material-symbols-outlined text-outline-variant text-5xl mb-4 select-none">
                  article
                </span>
                <h3 className="text-headline-sm text-on-background font-bold mb-2">
                  No articles found
                </h3>
                <p className="text-body-md text-on-surface-variant max-w-md mx-auto">
                  We don't have any articles published under the "{selectedCategory}" category yet. Check back soon for updates!
                </p>
              </motion.div>
            )
          )}
        </AnimatePresence>
      </section>

      {/* Load More Button */}
      {hasMore && (
        <section className="px-4 md:px-6 mb-20 flex justify-center">
          <Button
            variant="outline"
            onClick={handleLoadMore}
            className="flex items-center gap-2 group min-w-[200px] justify-center"
          >
            <span className="material-symbols-outlined group-hover:rotate-180 transition-transform duration-500">
              refresh
            </span>
            <span>Load More Articles</span>
          </Button>
        </section>
      )}
    </div>
  );
}
