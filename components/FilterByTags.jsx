"use client";

import { Button } from "@/components/ui/button";

export default function TagsFilter({
  randomTags,
  selectedTags,
  onTagClick,
  onClear,
}) {
  if (!randomTags || randomTags.length === 0) return null;

  return (
    <div className="py-4 border-t border-gray-100">
      <div className="flex flex-wrap gap-2 items-center">
        <span className="text-sm font-medium text-gray-700 mr-3">
          Filter by tags:
        </span>

        {/* Clear Filter button (only show if something is selected) */}
        {selectedTags.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClear}
            className="ml-3 text-xs text-gray-600 hover:text-white hover:bg-gray-400 transition-colors duration-200 hover:cursor-pointer"
          >
            Clear Filter ✕
          </Button>
        )}
        
        {/* Tags List */}
        {randomTags.map((tag) => (
          <Button
            key={tag.id}
            variant={selectedTags.includes(tag.id) ? "default" : "outline"}
            size="sm"
            onClick={() => onTagClick(tag)}
            className="text-xs hover:cursor-pointer hover:bg-[#E92628] hover:text-white transition-colors duration-200"
          >
            {tag.name} ({tag.count})
          </Button>
        ))}
      </div>
    </div>
  );
}
