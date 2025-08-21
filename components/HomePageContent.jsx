// components/HomePageContent.jsx
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function HomePageContent() {
  const [posts, setPosts] = useState([]);
  const [tags, setTags] = useState([]);
  const [trendingPosts, setTrendingPosts] = useState([]);
  const [recentPosts, setRecentPosts] = useState([]);
  const [selectedTag, setSelectedTag] = useState(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const searchInputRef = useRef(null);

  useEffect(() => {
    async function fetchData() {
      const [allPosts, allTags, trending, recent] = await Promise.all([
        getPosts(),
        getTags(),
        getTrendingPosts(),
        getRecentPosts(),
      ]);
      setPosts(Array.isArray(allPosts) ? allPosts : []);
      setTags(Array.isArray(allTags) ? allTags : []);
      setTrendingPosts(Array.isArray(trending) ? trending : []);
      setRecentPosts(Array.isArray(recent) ? recent : []);
    }
    fetchData();
  }, []);

  const handleTagClick = (tag) => {
    setSelectedTag(tag);
    trackTagClick(tag?.name || "unknown");
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    trackSearch(searchQuery);
    const results = posts.filter((post) =>
      post.title?.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setSearchResults(results);
  };

  // ✅ safely filtered posts
  const filteredPosts = selectedTag
    ? posts.filter(
        (post) =>
          Array.isArray(post.tags) &&
          post.tags.some((t) => t.id === selectedTag.id)
      )
    : posts;

  return (
    <div className="min-h-screen flex flex-col">
      <BlogHeader
        onSearchClick={() => {
          setIsSearchOpen(true);
          trackEvent("search_modal_open");
        }}
      />

      {/* Tag Filters */}
      <div className="px-4 py-2 flex gap-2 overflow-x-auto">
        <Button
          variant={selectedTag === null ? "default" : "outline"}
          onClick={() => setSelectedTag(null)}
        >
          All
        </Button>
        {tags.map((tag) => (
          <Button
            key={tag.id}
            variant={selectedTag?.id === tag.id ? "default" : "outline"}
            onClick={() => handleTagClick(tag)}
          >
            {tag.name}
          </Button>
        ))}
      </div>

      {/* Posts Section */}
      <main className="flex-1 px-4 py-6 grid md:grid-cols-3 gap-4">
        {filteredPosts.length === 0 ? (
          <p>No posts found.</p>
        ) : (
          filteredPosts.map((post) => (
            <Card key={post.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle>{post.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{post.excerpt}</p>
              </CardContent>
            </Card>
          ))
        )}
      </main>

      {/* Search Modal */}
      <Suspense fallback={<div>Loading search...</div>}>
        {isSearchOpen && (
          <SearchModal
            isOpen={isSearchOpen}
            onClose={() => setIsSearchOpen(false)}
            query={searchQuery}
            setQuery={setSearchQuery}
            onSearch={handleSearch}
            results={searchResults}
            inputRef={searchInputRef}
          />
        )}
      </Suspense>

      <Footer />
    </div>
  );
}
