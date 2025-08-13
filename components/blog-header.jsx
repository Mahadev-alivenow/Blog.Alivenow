"use client";

import { useState } from "react";
import { Search, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";

export default function BlogHeader({ onSearch, onTagFilter, tags = [] }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);

  const handleSearchClick = () => {
    onSearch(); // This will open the search modal
  };

  const handleSearchKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      onSearch(); // This will open the search modal
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
            {/* <h1 className="text-2xl font-bold text-gray-900">AliveNow</h1> */}
            {/* <img src="/alivenow.svg" alt="AliveNow icon" /> */}
            <Image
              src="/alivenow.svg"
              alt="AliveNow icon"
              width={100}
              height={100}
              // className="h-40 w-auto py-2"
              className="h-16 w-auto"
            />
          </div>

          {/* Desktop Navigation */}
          {/* <nav className="hidden md:flex space-x-8">
            <a
              href="#"
              className="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium"
            >
              Home
            </a>
            <a
              href="#"
              className="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium"
            >
              Categories
            </a>
            <a
              href="#"
              className="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium"
            >
              About
            </a>
            <a
              href="#"
              className="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium"
            >
              Contact
            </a>
          </nav> */}

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
        <div className="py-4 border-t border-gray-100">
          <div className="flex flex-wrap gap-2">
            <span className="text-sm font-medium text-gray-700 mr-3">
              Filter by tags:
            </span>
            {tags.slice(0, 10).map((tag) => (
              <Button
                key={tag.id}
                variant={selectedTags.includes(tag.id) ? "default" : "outline"}
                size="sm"
                onClick={() => handleTagClick(tag)}
                className="text-xs"
              >
                {tag.name} ({tag.count})
              </Button>
            ))}
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-100">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <div className="mb-4">
                <div className="relative">
                  <Input
                    type="text"
                    placeholder="Search posts..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onClick={handleSearchClick}
                    onKeyPress={handleSearchKeyPress}
                    className="w-full pl-10 pr-4 cursor-pointer"
                    readOnly
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                </div>
              </div>

              <a
                href="#"
                className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900"
              >
                Home
              </a>
              <a
                href="#"
                className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900"
              >
                Categories
              </a>
              <a
                href="#"
                className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900"
              >
                About
              </a>
              <a
                href="#"
                className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900"
              >
                Contact
              </a>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
