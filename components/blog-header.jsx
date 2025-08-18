"use client";

import { useState, useEffect } from "react";
import { Search, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import Link from "next/link";

export default function BlogHeader({ onSearch, onTagFilter, tags = [] }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [randomTags, setRandomTags] = useState([]);

  useEffect(() => {
    if (tags.length > 0 && randomTags.length === 0) {
      // shuffle only once
      const shuffled = [...tags].sort(() => 0.5 - Math.random());
      setRandomTags(shuffled.slice(0, 10));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tags]); // remove randomTags from dependency to avoid reshuffle

  const handleSearchClick = () => {
    onSearch();
  };

  const handleSearchKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      onSearch();
    }
  };

  const handleTagClick = (tag) => {
    const newSelectedTags = selectedTags.includes(tag.id)
      ? selectedTags.filter((id) => id !== tag.id)
      : [...selectedTags, tag.id];

    setSelectedTags(newSelectedTags);
    onTagFilter(newSelectedTags);
  };

  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Header */}
        <div className="flex items-center justify-between h-16 my-2 ">
          {/* Logo */}
          <div className="flex-shrink-0">
          <Link href="/" className="block">
            <Image
              src="/alivenow.svg"
              alt="AliveNow icon"
              width={100}
              height={100}
              className="h-16 w-auto"
            />
          </Link>
          </div>

          {/* Search Bar */}
          <div className="hidden md:block">
            <div className="relative">
              <Input
                type="text"
                placeholder="Search posts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onClick={handleSearchClick}
                onKeyPress={handleSearchKeyPress}
                className="w-64 pl-10 pr-4 cursor-pointer"
                readOnly
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            </div>
          </div>

          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </Button>
        </div>

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
                    selectedTags.includes(tag.id) ? "default" : "outline"
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
    </header>
  );
}
