import Link from "next/link";
import Image from "next/image";
import { BlogPost } from "@/data/blog";

interface BlogCardProps {
  post: BlogPost;
}

export default function BlogCard({ post }: BlogCardProps) {
  return (
    <article className="bg-surface-container-lowest rounded-3xl overflow-hidden shadow-ambient hover:shadow-interactive hover:-translate-y-1.5 transition-all duration-300 flex flex-col h-full border border-outline-variant/10 group">
      {/* Post Image Container */}
      <div className="h-48 overflow-hidden relative">
        <Image
          className="object-cover transition-transform duration-500 group-hover:scale-103"
          alt={post.title}
          src={post.featuredImage}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        {/* Category Tag overlay */}
        <span className="absolute top-4 left-4 bg-primary/15 backdrop-blur-md px-3.5 py-1.5 rounded-full text-primary font-semibold text-xs border border-primary/20">
          {post.category}
        </span>
      </div>

      {/* Post Content */}
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-headline-sm font-bold text-on-surface mb-3 group-hover:text-primary transition-colors line-clamp-2">
          {post.title}
        </h3>
        <p className="text-body-md text-on-surface-variant mb-6 line-clamp-3 text-sm leading-relaxed">
          {post.excerpt}
        </p>

        {/* Post Meta / Link row */}
        <div className="mt-auto pt-4 border-t border-outline-variant/10 flex items-center justify-between">
          <div className="text-on-surface-variant font-semibold text-xs">
            By {post.author}
          </div>
          <Link
            href={`/blog/${post.slug}`}
            className="text-primary font-bold text-sm hover:underline flex items-center gap-1 group-hover:text-primary-container transition-colors"
          >
            Read More
            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </Link>
        </div>
      </div>
    </article>
  );
}
