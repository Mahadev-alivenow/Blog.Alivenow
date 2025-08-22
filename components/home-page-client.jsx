"use client";

import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import dynamic from "next/dynamic";
import BlogHeader from "@/components/blog-header";
import Footer from "@/components/footer";
import PostsGrid from "@/components/posts-grid";
import Sidebar from "@/components/sidebar";
import { getPosts } from "@/lib/wordpress";
import { trackSearch, trackTagClick, trackEvent } from "@/components/analytics";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import { gsap } from "gsap";
import { useRouter, useSearchParams } from "next/navigation";

// Lazy load heavy components
const SearchModal = dynamic(() => import("@/components/search-modal"), {
  loading: () => <div>Loading search...</div>,
  ssr: false,
});

export default function HomePageClient({ serverData }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [posts, setPosts] = useState(serverData.initialPosts);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(serverData.initialPage);
  const [totalPages, setTotalPages] = useState(serverData.totalPages);
  const [searchQuery, setSearchQuery] = useState(serverData.initialSearch);
  const [selectedTags, setSelectedTags] = useState(
    serverData.initialSelectedTags
  );
  const [showSearchModal, setShowSearchModal] = useState(false);
  const heroRef = useRef(null);

  const perPage = 10;

  // Memoize random tags to prevent reshuffling
  // const randomTags = useMemo(() => {
  //   if (serverData.allTags.length > 0) {
  //     const shuffled = [...serverData.allTags].sort(() => 0.5 - Math.random());
  //     return shuffled.slice(0, 10);
  //   }
  //   return [];
  // }, [serverData.allTags]);
  // Generate random tags only once per page load
  const randomTagsRef = useRef(null);

  if (!randomTagsRef.current && serverData.allTags.length > 0) {
    const shuffled = [...serverData.allTags].sort(() => 0.5 - Math.random());
    randomTagsRef.current = shuffled.slice(0, 10);
  }

  const randomTags = randomTagsRef.current || [];

  // Update URL when filters change
  const updateURL = useCallback(
    (page, search, tags) => {
      const params = new URLSearchParams();
      if (page > 1) params.set("page", page.toString());
      if (search) params.set("search", search);
      if (tags.length > 0) params.set("tags", tags.join(","));

      const queryString = params.toString();
      const newUrl = queryString ? `?${queryString}` : "/";
      router.push(newUrl, { scroll: false });
    },
    [router]
  );

  // Load posts when filters change (client-side navigation)
  const loadPosts = useCallback(async (page, search, tags) => {
    setLoading(true);
    try {
      const postsData = await getPosts({
        page,
        perPage,
        search,
        tags,
      });

      setPosts(postsData.posts);
      setTotalPages(postsData.totalPages);

      if (search) {
        trackSearch(search, postsData.totalPosts);
      }
    } catch (error) {
      console.error("Error loading posts:", error);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Handle search
  const handleSearch = useCallback(
    (query) => {
      setSearchQuery(query);
      setCurrentPage(1);
      setShowSearchModal(false);
      updateURL(1, query, selectedTags);
      loadPosts(1, query, selectedTags);

      if (query) {
        trackEvent("search_initiated", { search_term: query });
      }
    },
    [selectedTags, updateURL, loadPosts]
  );

  // Handle tag filtering
  const handleTagFilter = useCallback(
    (tagIds) => {
      setSelectedTags(tagIds);
      setCurrentPage(1);
      updateURL(1, searchQuery, tagIds);
      loadPosts(1, searchQuery, tagIds);

      tagIds.forEach((tagId) => {
        const tag = serverData.allTags.find((t) => t.id === tagId);
        if (tag) {
          trackTagClick(tag.name, tag.id);
        }
      });
    },
    [searchQuery, serverData.allTags, updateURL, loadPosts]
  );

  // Handle tag click
  const handleTagClick = useCallback(
    (tag) => {
      const newSelectedTags = selectedTags.includes(tag.id)
        ? selectedTags.filter((id) => id !== tag.id)
        : [...selectedTags, tag.id];

      setSelectedTags(newSelectedTags);
      setCurrentPage(1);
      updateURL(1, searchQuery, newSelectedTags);
      loadPosts(1, searchQuery, newSelectedTags);
    },
    [selectedTags, searchQuery, updateURL, loadPosts]
  );

  // Handle pagination
  const handlePageChange = useCallback(
    (page) => {
      setCurrentPage(page);
      updateURL(page, searchQuery, selectedTags);
      loadPosts(page, searchQuery, selectedTags);
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    [searchQuery, selectedTags, updateURL, loadPosts]
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

  return (
    <div className="min-h-screen bg-gray-50">
      <BlogHeader
        onSearch={() => setShowSearchModal(true)}
        onTagFilter={handleTagFilter}
        tags={serverData.allTags}
      />

      {showSearchModal && (
        <SearchModal
          isOpen={showSearchModal}
          onClose={() => setShowSearchModal(false)}
          onSearch={handleSearch}
        />
      )}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 font-[Montserrat]">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3">
            <section className="mb-12" ref={heroRef}>
              <Image
                src="/BlogBanner.png"
                alt="Alivenow Blog Banner Image"
                className="w-full object-cover rounded-lg mb-6"
                width={800}
                height={200}
                priority
              />
            </section>

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

              {loading ? (
                <div className="text-center py-12">
                  <Loader2 className="h-12 w-12 animate-spin text-[#E92628] mx-auto" />
                  <p className="mt-4 text-gray-600">Loading posts...</p>
                </div>
              ) : (
                <PostsGrid
                  posts={posts}
                  searchQuery={searchQuery}
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              )}
            </section>
          </div>

          <div className="lg:col-span-1">
            <Sidebar
              recentPosts={serverData.recentPosts}
              randomTags={randomTags}
              selectedTags={selectedTags}
              onTagClick={handleTagClick}
              onClear={() => {
                setSelectedTags([]); // reset tags
                loadPosts(1, searchQuery, []); // also reload posts with no filters
                updateURL(1, searchQuery, []);
              }}
            />
          </div>
        </div>
      </main>

      <Footer
        trendingPosts={serverData.trendingPosts}
        recentPosts={serverData.recentPosts}
        tags={serverData.allTags}
      />
    </div>
  );
}
