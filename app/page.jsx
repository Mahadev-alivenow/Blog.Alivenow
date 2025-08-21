"use client";

import {
  useState,
  useEffect,
  useRef,
  Suspense,
  useMemo,
  useCallback,
} from "react";
import dynamic from "next/dynamic";
import BlogHeader from "@/components/blog-header";
import Footer from "@/components/footer";
import {
  getPosts,
  getTags,
  getTrendingPosts,
  getRecentPosts,
} from "@/lib/wordpress";
import { trackSearch, trackTagClick, trackEvent } from "@/components/analytics";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, User, Clock, Loader2 } from "lucide-react";
import Link from "next/link";
import { gsap } from "gsap";
import { stripHtml, formatDate } from "@/utils/helpers";
import Image from "next/image";

// Lazy load heavy components
const SearchModal = dynamic(() => import("@/components/search-modal"), {
  loading: () => <div>Loading search...</div>,
  ssr: false,
});

const TagsFilter = dynamic(() => import("@/components/FilterByTags"), {
  loading: () => <div className="animate-pulse bg-gray-100 h-20 rounded"></div>,
  ssr: false,
});

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
  const [isInView, setIsInView] = useState(priority);
  const imgRef = useRef(null);
  const [imageSrc, setImageSrc] = useState(priority ? src : null);

  useEffect(() => {
    if (priority) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          setImageSrc(src);
          observer.disconnect();
        }
      },
      { rootMargin: "50px" }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [src, priority]);

  return (
    <div
      ref={imgRef}
      className={`${aspectRatio} overflow-hidden relative ${className}`}
    >
      {!isLoaded && (
        <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        </div>
      )}
      {imageSrc && (
        <img
          src={imageSrc}
          alt={alt}
          className={`w-full h-full ${imgSize} transition-all duration-700 ${
            isLoaded ? "opacity-100 group-hover:scale-110" : "opacity-0"
          }`}
          onLoad={() => setIsLoaded(true)}
          loading={priority ? "eager" : "lazy"}
        />
      )}
    </div>
  );
}

// Memoized Post Card Component
const PostCard = ({ post, index }) => {
  const cardRef = useRef(null);

  useEffect(() => {
    if (cardRef.current) {
      // Simplified animation with better performance
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
          priority={index < 2} // Priority load for first 2 images
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
                Author - AliveNow
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

// Memoized Recent Post Component
const RecentPostCard = ({ post, index }) => (
  <Link href={`/${post.slug}`}>
    <Card className="p-0 hover:shadow-lg transition-all duration-300 cursor-pointer group overflow-hidden my-4 hover:border-l-[#E92628] hover:border-b-[#E92628] hover:-translate-y-1 bg-white">
      <div className="flex">
        <LazyImage
          src={post.featuredImage.url}
          alt={post.featuredImage.alt || post.title}
          className="w-20 h-20 flex-shrink-0"
          imgSize="object-cover"
          aspectRatio=""
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

function PageLoadingFallback() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <Loader2 className="h-16 w-16 animate-spin text-[#E92628] mx-auto" />
          <p className="mt-4 text-gray-700 text-lg font-medium">Loading ...</p>
        </div>
      </div>
    </div>
  );
}

function HomePageContent() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarLoading, setSidebarLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [tags, setTags] = useState([]);
  const [trendingPosts, setTrendingPosts] = useState([]);
  const [recentPosts, setRecentPosts] = useState([]);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [randomTags, setRandomTags] = useState([]);
  const heroRef = useRef(null);
  const postsGridRef = useRef(null);

  const perPage = 10;

  // Memoize random tags to prevent reshuffling
  const memoizedRandomTags = useMemo(() => {
    if (tags.length > 0) {
      const shuffled = [...tags].sort(() => 0.5 - Math.random());
      return shuffled.slice(0, 10);
    }
    return [];
  }, [tags]);

  useEffect(() => {
    setRandomTags(memoizedRandomTags);
  }, [memoizedRandomTags]);

  // Load critical data first (posts and tags)
  useEffect(() => {
    loadCriticalData();
  }, [currentPage, searchQuery, selectedTags]);

  // Load sidebar data separately to avoid blocking main content
  useEffect(() => {
    loadSidebarData();
  }, []);

  const loadCriticalData = async () => {
    setLoading(true);
    try {
      const [postsData, tagsData] = await Promise.all([
        getPosts({
          page: currentPage,
          perPage: perPage,
          search: searchQuery,
          tags: selectedTags,
        }),
        currentPage === 1 && !searchQuery && selectedTags.length === 0
          ? getTags()
          : Promise.resolve(tags.length > 0 ? tags : []),
      ]);

      setPosts(postsData.posts);
      setTotalPages(postsData.totalPages);

      if (Array.isArray(tagsData) && tagsData.length > 0) {
        setTags(tagsData);
      }

      if (searchQuery) {
        trackSearch(searchQuery, postsData.totalPosts);
      }
    } catch (error) {
      console.error("Error loading critical data:", error);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  const loadSidebarData = async () => {
    try {
      const [trendingData, recentData] = await Promise.all([
        getTrendingPosts(),
        getRecentPosts(),
      ]);

      setTrendingPosts(trendingData);
      setRecentPosts(recentData);
    } catch (error) {
      console.error("Error loading sidebar data:", error);
      setTrendingPosts([]);
      setRecentPosts([]);
    } finally {
      setSidebarLoading(false);
    }
  };

  const handleSearch = useCallback((query) => {
    setSearchQuery(query);
    setCurrentPage(1);
    setShowSearchModal(false);
    if (query) {
      trackEvent("search_initiated", { search_term: query });
    }
  }, []);

  const handleTagFilter = useCallback(
    (tagIds) => {
      setSelectedTags(tagIds);
      setCurrentPage(1);
      tagIds.forEach((tagId) => {
        const tag = tags.find((t) => t.id === tagId);
        if (tag) {
          trackTagClick(tag.name, tag.id);
        }
      });
    },
    [tags]
  );

  const handleTagClick = useCallback(
    (tag) => {
      const newSelectedTags = selectedTags.includes(tag.id)
        ? selectedTags.filter((id) => id !== tag.id)
        : [...selectedTags, tag.id];

      setSelectedTags(newSelectedTags);
    },
    [selectedTags]
  );

  // Simplified hero animation
  useEffect(() => {
    if (heroRef.current) {
      gsap.fromTo(
        heroRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }
      );
    }
  }, []);

  if (loading && posts.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <BlogHeader onSearch={() => setShowSearchModal(true)} tags={tags} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <Loader2 className="h-16 w-16 animate-spin text-[#E92628] mx-auto" />
            <p className="mt-4 text-gray-700 text-lg font-medium">
              Loading ...
            </p>
          </div>
        </div>
      </div>
    );
  }

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
          onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
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
              onClick={() => setCurrentPage(page)}
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
          onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className="px-4 py-2 hover:bg-red-50 hover:border-red-700 transition-all duration-200 hover:cursor-pointer"
        >
          Next
        </Button>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <BlogHeader
        onSearch={() => setShowSearchModal(true)}
        onTagFilter={handleTagFilter}
        tags={tags}
      />

      {showSearchModal && (
        <SearchModal
          isOpen={showSearchModal}
          onClose={() => setShowSearchModal(false)}
          onSearch={handleSearch}
        />
      )}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3">
            {/* {currentPage === 1 && !searchQuery && selectedTags.length === 0 && ( */}
            <section className="mb-12" ref={heroRef}>
              {/* Hero content can be added here */}
              <Image
                src="/BlogBanner.png"
                alt="Alivenow Blog Banner Image"
                className="w-full object-cover rounded-lg mb-6"
                width={100}
                height={100}
                priority
              />
            </section>
            {/* )} */}

            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-bold text-gray-900">
                  {searchQuery
                    ? `Search Results for "${searchQuery}"`
                    : "Latest Posts"}
                </h2>
                <div className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                  Showing {posts.length} posts
                </div>
              </div>

              {posts.length > 0 ? (
                <div
                  className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8"
                  ref={postsGridRef}
                >
                  {posts.map((post, index) => (
                    <PostCard key={post.id} post={post} index={index} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-600 text-lg">No posts found.</p>
                  {searchQuery && (
                    <p className="text-gray-500 mt-2">
                      Try adjusting your search terms.
                    </p>
                  )}
                </div>
              )}

              {renderPagination()}
            </section>
          </div>

          <div className="lg:col-span-1">
            <section className="mb-8 sticky top-20">
              <div className="flex items-center mb-6 p-3 bg-gradient-to-r from-gray-50 to-red-50 rounded-lg">
                <Clock className="h-6 w-6 mr-3 text-[#E92628]" />
                <h3 className="text-lg font-bold text-gray-900">
                  Recent Posts
                </h3>
              </div>

              <div className="space-y-4">
                {sidebarLoading ? (
                  <div className="space-y-4">
                    {[...Array(5)].map((_, i) => (
                      <div
                        key={i}
                        className="animate-pulse bg-gray-100 h-20 rounded"
                      ></div>
                    ))}
                  </div>
                ) : (
                  recentPosts.map((post, index) => (
                    <RecentPostCard key={post.id} post={post} index={index} />
                  ))
                )}

                {!sidebarLoading && randomTags.length > 0 && (
                  <TagsFilter
                    randomTags={randomTags}
                    selectedTags={selectedTags}
                    onTagClick={handleTagClick}
                  />
                )}
              </div>
            </section>
          </div>
        </div>
      </main>

      <Footer
        trendingPosts={trendingPosts}
        recentPosts={recentPosts}
        tags={tags}
      />
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={<PageLoadingFallback />}>
      <HomePageContent />
    </Suspense>
  );
}
