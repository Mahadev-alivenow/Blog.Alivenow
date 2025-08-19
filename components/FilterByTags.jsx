"use client";

import { Button } from "@/components/ui/button";

export default function TagsFilter({ randomTags, selectedTags, onTagClick }) {
  if (!randomTags || randomTags.length === 0) return null;

  return (
    <div className="py-4 border-t border-gray-100">
      <div className="flex flex-wrap gap-2">
        <span className="text-sm font-medium text-gray-700 mr-3">
          Filter by tags:
        </span>
        {randomTags.map((tag) => (
          <Button
            key={tag.id}
            variant={selectedTags.includes(tag.id) ? "default" : "outline"}
            size="sm"
            onClick={() => onTagClick(tag)}
            className="text-xs hover:cursor-pointer"
          >
            {tag.name} ({tag.count})
          </Button>
        ))}
      </div>
    </div>
  );
}
