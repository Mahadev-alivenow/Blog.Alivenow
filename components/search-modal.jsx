"use client";

import { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Search } from "lucide-react";
import { getSearchSuggestions } from "@/lib/wordpress";
import Link from "next/link";
import { stripHtml, formatDate } from "@/utils/helpers";

export default function SearchModal({ isOpen, onClose, onSearch }) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    const searchSuggestions = async () => {
      if (query.length < 2) {
        setSuggestions([]);
        return;
      }

      setLoading(true);
      try {
        const results = await getSearchSuggestions(query);
        setSuggestions(results);
      } catch (error) {
        console.error("Error fetching suggestions:", error);
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(searchSuggestions, 300);
    return () => clearTimeout(debounceTimer);
  }, [query]);

  const handleSearch = (searchQuery = query) => {
    if (searchQuery.trim()) {
      onSearch(searchQuery.trim());
      setQuery("");
      setSuggestions([]);
    }
  };

  const handleKeyPress = (e) => {
      if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Search Posts
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="relative">
            <Input
              ref={inputRef}
              type="text"
              placeholder="Search for posts, topics, or keywords..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              className="pr-10"
            />
            <Button
              size="sm"
              onClick={() => handleSearch()}
              className="absolute right-1 top-1 h-8 w-8 p-0"
            >
              <Search className="h-4 w-4" />
            </Button>
          </div>

          {loading && (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
            </div>
          )}

          {suggestions.length > 0 && (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              <h4 className="text-sm font-medium text-gray-700 mb-2">
                Suggestions:
              </h4>
              {suggestions.map((post) => (
                <Card
                  key={post.id}
                  className="p-3 hover:shadow-md transition-all duration-200 cursor-pointer"
                >
                  <Link
                    href={`/post/${post.slug}`}
                    onClick={() => {
                      onClose();
                      setQuery("");
                      setSuggestions([]);
                    }}
                  >
                    <div className="flex items-start gap-3">
                      {post.featuredImage?.url && (
                        <img
                          src={post.featuredImage.url || "/placeholder.svg"}
                          alt={post.featuredImage.alt}
                          className="w-16 h-12 object-cover rounded"
                        />
                      )}
                      <div className="flex-1">
                        <h5
                          className="font-medium line-clamp-1 hover:text-blue-600 transition-colors"
                          dangerouslySetInnerHTML={{ __html: post.title }}
                        >
                          {/* {post.title} */}
                        </h5>
                        <p className="text-sm text-gray-600 line-clamp-2 mt-1">
                          {stripHtml(post.excerpt)}
                        </p>
                        <div className="text-xs text-gray-500 mt-1">
                          {formatDate(post.date)}
                        </div>
                      </div>
                    </div>
                  </Link>
                </Card>
              ))}
            </div>
          )}

          {query.length >= 2 && !loading && suggestions.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <p>No suggestions found for "{query}"</p>
              <Button
                variant="outline"
                onClick={() => handleSearch()}
                className="mt-2"
              >
                Search anyway
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
