"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import BlogHeader from "@/components/blog-header";
import SearchModal from "@/components/search-modal";
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
import { Calendar, User, TrendingUp, Clock, Eye } from "lucide-react";
import Link from "next/link";
import { gsap } from "gsap";
import { stripHtml, formatDate } from "@/utils/helpers";

function PageLoadingFallback() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-amber-200 border-t-amber-600 mx-auto shadow-lg"></div>
            <div className="absolute inset-0 rounded-full h-16 w-16 border-4 border-transparent border-t-amber-400 mx-auto animate-pulse"></div>
          </div>
          <p className="mt-6 text-gray-700 text-lg font-medium animate-pulse">
            Loading ...
          </p>
        </div>
      </div>
    </div>
  );
}

function HomePageContent() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [tags, setTags] = useState([]);
  const [trendingPosts, setTrendingPosts] = useState([]);
  const [recentPosts, setRecentPosts] = useState([]);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const heroRef = useRef(null);
  const postsGridRef = useRef(null);
  const sidebarRef = useRef(null);
  const [randomTags, setRandomTags] = useState([]);

  useEffect(() => {
    if (tags.length > 0 && randomTags.length === 0) {
      // shuffle only once
      const shuffled = [...tags].sort(() => 0.5 - Math.random());
      setRandomTags(shuffled.slice(0, 10));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tags]); // remove randomTags from dependency to avoid reshuffle

  const perPage = 6;

  useEffect(() => {
    loadData();
  }, [currentPage, searchQuery, selectedTags]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [postsData, tagsData, trendingData, recentData] = await Promise.all(
        [
          getPosts({
            page: currentPage,
            perPage: perPage,
            search: searchQuery,
            tags: selectedTags,
          }),
          getTags(),
          getTrendingPosts(),
          getRecentPosts(),
        ]
      );

      setPosts(postsData.posts);
      setTotalPages(postsData.totalPages);
      setTags(tagsData);
      setTrendingPosts(trendingData);
      setRecentPosts(recentData);

      if (searchQuery) {
        trackSearch(searchQuery, postsData.totalPosts);
      }
    } catch (error) {
      console.error("Error loading data:", error);
      setPosts([]);
      setTags([]);
      setTrendingPosts([]);
      setRecentPosts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    setCurrentPage(1);
    setShowSearchModal(false);
    if (query) {
      trackEvent("search_initiated", { search_term: query });
    }
  };

  const handleTagFilter = (tagIds) => {
    setSelectedTags(tagIds);
    setCurrentPage(1);
    tagIds.forEach((tagId) => {
      const tag = tags.find((t) => t.id === tagId);
      if (tag) {
        trackTagClick(tag.name, tag.id);
      }
    });
  };

  useEffect(() => {
    if (heroRef.current) {
      gsap.fromTo(
        heroRef.current,
        { opacity: 0, y: 30, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1,
          ease: "power3.out",
        }
      );
    }
  }, []);

  useEffect(() => {
    if (postsGridRef.current && posts.length > 0) {
      const cards = postsGridRef.current.children;
      gsap.fromTo(
        cards,
        { opacity: 0, y: 40, scale: 0.9 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          stagger: 0.1,
          ease: "power2.out",
        }
      );
    }
  }, [posts]);

  useEffect(() => {
    if (
      sidebarRef.current &&
      (trendingPosts.length > 0 || recentPosts.length > 0)
    ) {
      const sections = sidebarRef.current.children;
      gsap.fromTo(
        sections,
        { opacity: 0, x: 30 },
        {
          opacity: 1,
          x: 0,
          duration: 0.8,
          stagger: 0.2,
          ease: "power2.out",
          delay: 0.3,
        }
      );
    }
  }, [trendingPosts, recentPosts]);

  const handleTagClick = (tag) => {
    const newSelectedTags = selectedTags.includes(tag.id)
      ? selectedTags.filter((id) => id !== tag.id)
      : [...selectedTags, tag.id];

    setSelectedTags(newSelectedTags);
    // onTagFilter(newSelectedTags);
  };

  if (loading && posts.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <BlogHeader
          onSearch={() => setShowSearchModal(true)}
          // onTagFilter={handleTagFilter}
          tags={tags}
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="relative">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-amber-200 border-t-amber-600 mx-auto shadow-lg"></div>
              <div className="absolute inset-0 rounded-full h-16 w-16 border-4 border-transparent border-t-amber-400 mx-auto animate-pulse"></div>
            </div>
            <p className="mt-6 text-gray-700 text-lg font-medium animate-pulse">
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
          className="px-4 py-2 hover:bg-amber-50 hover:border-amber-300 hover:text-amber-700 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 hover:cursor-pointer"
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
              className={`px-3 py-2 min-w-[40px] transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 hover:cursor-pointer ${
                currentPage === page
                  ? "bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 shadow-lg"
                  : "hover:bg-amber-50 hover:border-amber-300 hover:text-amber-700"
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
          className="px-4 py-2 hover:bg-amber-50 hover:border-amber-300 hover:text-amber-700 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 hover:cursor-pointer"
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

      <SearchModal
        isOpen={showSearchModal}
        onClose={() => setShowSearchModal(false)}
        onSearch={handleSearch}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3">
            {currentPage === 1 && !searchQuery && selectedTags.length === 0 && (
              <section className="mb-12" ref={heroRef}></section>
            )}

            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-bold text-gray-900 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text">
                  {searchQuery
                    ? `Search Results for "${searchQuery}"`
                    : "Latest Posts"}
                </h2>
                <div className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                  Showing {posts.length} of {totalPages * perPage} posts
                </div>
              </div>

              {posts.length > 0 ? (
                <div
                  className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8"
                  ref={postsGridRef}
                >
                  {posts.map((post, index) => (
                    <Link key={post.id} href={`/post/${post.slug}`}>
                      <Card className="overflow-hidden hover:shadow-2xl transition-all duration-500 group cursor-pointer border-0 shadow-lg hover:-translate-y-2 hover:scale-[1.02] bg-white/80 backdrop-blur-sm">
                        {post.featuredImage.url && (
                          <div className="aspect-video overflow-hidden relative">
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            <img
                              src={post.featuredImage.url || "/placeholder.svg"}
                              alt={post.featuredImage.alt}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                            />
                          </div>
                        )}

                        <CardHeader className="pb-3">
                          <div className="flex flex-wrap gap-2 mb-3">
                            {post.tags.slice(0, 3).map((tag) => (
                              <Badge
                                key={tag.id}
                                variant="secondary"
                                className="text-xs hover:bg-amber-100 hover:text-amber-800 hover:border-amber-300 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5"
                              >
                                {tag.name}
                              </Badge>
                            ))}
                          </div>

                          <h3
                            className="text-xl font-bold line-clamp-2 group-hover:text-amber-700 cursor-pointer transition-all duration-300 leading-tight"
                            dangerouslySetInnerHTML={{ __html: post.title }}
                          >
                            {/* {post.title} */}
                          </h3>
                        </CardHeader>

                        <CardContent>
                          <p
                            className="text-gray-600 mb-4 line-clamp-3 group-hover:text-gray-700 transition-colors duration-300"
                            dangerouslySetInnerHTML={{ __html: post.excerpt }}
                          >
                            {/* {stripHtml(post.excerpt)} */}
                          </p>

                          <div className="flex items-center justify-between text-sm text-gray-500">
                            <div className="flex items-center space-x-4">
                              <div className="flex items-center hover:text-amber-600 transition-colors duration-300">
                                <User className="h-4 w-4 mr-1" />
                                Author - AliveNow
                              </div>
                              <div className="flex items-center hover:text-amber-600 transition-colors duration-300">
                                <Calendar className="h-4 w-4 mr-1" />
                                {formatDate(post.date)}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
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

          <div className="lg:col-span-1" ref={sidebarRef}>
            <section className="mb-8 sticky top-20">
              <div className="flex items-center mb-6 p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg">
                <Clock className="h-6 w-6 mr-3 text-green-500" />
                <h3 className="text-lg font-bold text-gray-900">
                  Recent Posts
                </h3>
              </div>

              <div className="space-y-4">
                {recentPosts.map((post, index) => (
                  <Link key={post.id} href={`/post/${post.slug}`}>
                    <Card className="p-0 hover:shadow-xl transition-all duration-400 cursor-pointer group overflow-hidden my-4 hover:border-l-green-500 hover:-translate-y-1 hover:scale-[1.02] bg-white/90 backdrop-blur-sm">
                      <div className="flex">
                        <div className="w-20 h-20 flex-shrink-0 relative overflow-hidden">
                          <img
                            src={
                              post.featuredImage.url ||
                              "/placeholder.svg?height=80&width=80&query=recent blog post thumbnail" ||
                              "/placeholder.svg"
                            }
                            alt={post.featuredImage.alt || post.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </div>
                        <div className="p-4 flex-1">
                          <h4
                            className="font-semibold line-clamp-2 mb-2 group-hover:text-green-600 transition-colors duration-300 text-sm leading-tight"
                            dangerouslySetInnerHTML={{ __html: post.title }}
                          >
                            {/* {post.title} */}
                          </h4>
                          <div className="text-xs text-gray-500 group-hover:text-green-500 transition-colors duration-300">
                            {formatDate(post.date)}
                          </div>
                        </div>
                      </div>
                    </Card>
                  </Link>
                ))}

                {/* Tags Filter */}
                {randomTags.length > 0 && (
                  <div className="py-4 border-t border-gray-100">
                    <div className="flex flex-wrap gap-2">
                      <span className="text-sm font-medium text-gray-700 mr-3">
                        Filter by tags:
                      </span>
                      {randomTags.map((tag) => (
                        <Button
                          key={tag.id}
                          variant={
                            selectedTags.includes(tag.id)
                              ? "default"
                              : "outline"
                          }
                          size="sm"
                          onClick={() => handleTagClick(tag)}
                          className="text-xs"
                        >
                          {tag.name} ({tag.count})
                        </Button>
                      ))}
                    </div>
                  </div>
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
