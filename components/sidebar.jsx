"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { Card } from "@/components/ui/card";
import { Clock, Loader2 } from "lucide-react";
import Link from "next/link";
import { formatDate } from "@/utils/helpers";

// Lazy load TagsFilter
const TagsFilter = dynamic(() => import("@/components/FilterByTags"), {
  loading: () => <div className="animate-pulse bg-gray-100 h-20 rounded"></div>,
  ssr: false,
});

// Optimized Image Component for Recent Posts
function LazyImage({ src, alt, className, imgSize, aspectRatio = "" }) {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className={`${aspectRatio} overflow-hidden relative ${className}`}>
      {!isLoaded && (
        <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse flex items-center justify-center">
          <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
        </div>
      )}
      <img
        src={src}
        alt={alt}
        className={`w-full h-full ${imgSize} transition-all duration-300 ${
          isLoaded ? "opacity-100 group-hover:scale-105" : "opacity-0"
        }`}
        onLoad={() => setIsLoaded(true)}
        loading="lazy"
      />
    </div>
  );
}

// Recent Post Card Component
const RecentPostCard = ({ post, index }) => (
  <Link href={`/${post.slug}`}>
    <Card className="p-0 hover:shadow-lg transition-all duration-300 cursor-pointer group overflow-hidden my-4 hover:border-l-[#E92628] hover:border-b-[#E92628] hover:-translate-y-1 bg-white">
      <div className="flex">
        <LazyImage
          src={post.featuredImage.url}
          alt={post.featuredImage.alt || post.title}
          className="w-20 h-20 flex-shrink-0"
          imgSize="object-cover"
        />
        <div className="p-4 flex-1">
          <h4
            className="font-semibold line-clamp-2 mb-2 group-hover:text-[#E92628] transition-colors duration-200 text-sm leading-tight"
            dangerouslySetInnerHTML={{ __html: post.title }}
          />
          <div className="text-xs text-gray-500">{formatDate(post.date)}</div>
        </div>
      </div>
    </Card>
  </Link>
);

export default function Sidebar({
  recentPosts,
  randomTags,
  selectedTags,
  onTagClick,
  onClear, // ✅ accept onClear from parent
}) {
  return (
    <section className="mb-8 sticky top-20">
      <div className="flex items-center mb-6 p-3 bg-gradient-to-r from-gray-50 to-red-50 rounded-lg">
        <Clock className="h-6 w-6 mr-3 text-[#E92628]" />
        <h3 className="text-lg font-bold text-gray-900">Recent Posts</h3>
      </div>

      <div className="space-y-4">
        {recentPosts.length > 0 ? (
          recentPosts.map((post, index) => (
            <RecentPostCard key={post.id} post={post} index={index} />
          ))
        ) : (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="animate-pulse bg-gray-100 h-20 rounded"
              ></div>
            ))}
          </div>
        )}

        {randomTags.length > 0 && (
          <TagsFilter
            randomTags={randomTags}
            selectedTags={selectedTags}
            onTagClick={onTagClick}
            onClear={onClear} // ✅ use parent's handler
          />
        )}
      </div>
    </section>
  );
}
  
