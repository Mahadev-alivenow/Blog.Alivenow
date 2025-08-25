"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, User, Loader2 } from "lucide-react";
import Link from "next/link";
import { gsap } from "gsap";
import { authorMap, formatDate } from "@/utils/helpers";

// Optimized Image Component with Lazy Loading
function LazyImage({
  src,
  alt,
  className,
  imgSize,
  aspectRatio = "aspect-video",
  priority = false,
}) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef(null);
  const [imageSrc, setImageSrc] = useState(src);

  useEffect(() => {
    if (!priority && imgRef.current) {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            // Image is in view, we can start loading if not already
            observer.disconnect();
          }
        },
        { rootMargin: "50px" }
      );

      observer.observe(imgRef.current);
      return () => observer.disconnect();
    }
  }, [priority]);

  return (
    <div
      ref={imgRef}
      className={`${aspectRatio} overflow-hidden relative ${className}`}
    >
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        </div>
      )}
      {hasError && (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
          <div className="text-gray-400 text-center">
            <div className="text-2xl mb-2">📷</div>
            <div className="text-xs">Image not available</div>
          </div>
        </div>
      )}
      <img
        src={imageSrc || "/placeholder.svg"}
        alt={alt}
        className={`w-full h-full ${imgSize} transition-all duration-700 ${
          isLoaded ? "opacity-100 group-hover:scale-110" : "opacity-0"
        }`}
        onLoad={() => setIsLoaded(true)}
        onError={() => {
          setHasError(true);
          setIsLoaded(false);
        }}
        loading={priority ? "eager" : "lazy"}
      />
    </div>
  );
}

// Memoized Post Card Component
const PostCard = ({ post, index }) => {
  const cardRef = useRef(null);

  useEffect(() => {
    if (cardRef.current) {
      gsap.fromTo(
        cardRef.current,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.4,
          delay: index * 0.05,
          ease: "power2.out",
        }
      );
    }
  }, [index]);

  return (
    <Link href={`/${post.slug}`}>
      <Card
        ref={cardRef}
        className="eachcard overflow-hidden hover:shadow-2xl transition-all duration-300 group cursor-pointer border-0 shadow-lg hover:-translate-y-1 hover:scale-[1.01] bg-white pt-0"
      >
        <LazyImage
          src={post.featuredImage.url}
          alt={post.featuredImage.alt}
          imgSize={"object-fill"}
          priority={index < 2}
        />

        <CardHeader className="pb-3">
          <div className="flex flex-wrap gap-2 mb-3">
            {post.tags.slice(0, 3).map((tag) => (
              <Badge
                key={tag.id}
                variant="secondary"
                className="text-xs hover:bg-red-100 hover:text-[#E92628] transition-colors duration-200"
              >
                {tag.name}
              </Badge>
            ))}
          </div>

          <h3
            className="text-xl font-bold line-clamp-2 group-hover:text-[#E92628] transition-colors duration-200 leading-tight"
            dangerouslySetInnerHTML={{ __html: post.title }}
          />
        </CardHeader>

        <CardContent>
          <p
            className="text-gray-600 mb-4 line-clamp-3 group-hover:text-gray-700 transition-colors duration-200"
            dangerouslySetInnerHTML={{ __html: post.excerpt }}
          />

          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <User className="h-4 w-4 mr-1" />
                {/* Author - AliveNow */}
                <span>Author - {authorMap[post.author.name] || post.author.name}</span>
              </div>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                {formatDate(post.date)}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default function PostsGrid({
  posts,
  searchQuery,
  currentPage,
  totalPages,
  onPageChange,
}) {
  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const getVisiblePages = () => {
      const delta = 2;
      const range = [];
      const rangeWithDots = [];

      for (
        let i = Math.max(2, currentPage - delta);
        i <= Math.min(totalPages - 1, currentPage + delta);
        i++
      ) {
        range.push(i);
      }

      if (currentPage - delta > 2) {
        rangeWithDots.push(1, "...");
      } else {
        rangeWithDots.push(1);
      }

      rangeWithDots.push(...range);

      if (currentPage + delta < totalPages - 1) {
        rangeWithDots.push("...", totalPages);
      } else {
        rangeWithDots.push(totalPages);
      }

      return rangeWithDots;
    };

    return (
      <div className="flex justify-center items-center space-x-2 mt-8">
        <Button
          variant="outline"
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="px-4 py-2 hover:bg-red-50 hover:border-red-700 transition-all duration-200 hover:cursor-pointer"
        >
          Previous
        </Button>

        {getVisiblePages().map((page, index) =>
          page === "..." ? (
            <span key={`dots-${index}`} className="px-3 py-2 text-gray-500">
              ...
            </span>
          ) : (
            <Button
              key={`page-${page}-${index}`}
              variant={currentPage === page ? "default" : "outline"}
              onClick={() => onPageChange(page)}
              className={`px-3 py-2 min-w-[40px] transition-all duration-200 hover:cursor-pointer ${
                currentPage === page
                  ? "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700"
                  : "hover:bg-red-50 hover:border-red-700 hover:text-red-700"
              }`}
            >
              {page}
            </Button>
          )
        )}

        <Button
          variant="outline"
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className="px-4 py-2 hover:bg-red-50 hover:border-red-700 transition-all duration-200 hover:cursor-pointer"
        >
          Next
        </Button>
      </div>
    );
  };

  if (posts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 text-lg">No posts found.</p>
        {searchQuery && (
          <p className="text-gray-500 mt-2">Try adjusting your search terms.</p>
        )}
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {posts.map((post, index) => (
          <PostCard key={post.id} post={post} index={index} />
        ))}
      </div>
      {renderPagination()}
    </>
  );
}
