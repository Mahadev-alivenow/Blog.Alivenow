"use client";

import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";

export default function TagsFilter({ randomTags }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get selected tags from URL
  const selectedTags = searchParams.get("tags")?.split(",") || [];

  const handleTagClick = (tagId) => {
    const params = new URLSearchParams(searchParams.toString());

    if (selectedTags.includes(tagId.toString())) {
      // remove tag if already selected
      const newTags = selectedTags.filter((t) => t !== tagId.toString());
      if (newTags.length > 0) {
        params.set("tags", newTags.join(","));
      } else {
        params.delete("tags"); // clean URL if no tags left
      }
    } else {
      // add tag
      params.set("tags", [...selectedTags, tagId].join(","));
    }

    router.push(`/?${params.toString()}`);
  };

  if (!randomTags || randomTags.length === 0) return null;

  return (
    <div className="py-4 border-t border-gray-100">
      <div className="flex flex-wrap gap-2">
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
        {randomTags.map((tag) => (
          <Button
            key={tag.id}
            variant={
              selectedTags.includes(tag.id.toString()) ? "default" : "outline"
            }
            size="sm"
            onClick={() => handleTagClick(tag.id)}
            className="text-xs hover:cursor-pointer hover:bg-[#E92628] hover:text-white transition-colors duration-200"
          >
            {tag.name} ({tag.count})
          </Button>
        ))}
      </div>
    </div>
  );
}
