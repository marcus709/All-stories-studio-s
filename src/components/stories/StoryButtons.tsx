import React from "react";
import { Book, Plus } from "lucide-react";
import { Story } from "@/types/story";

interface StoryButtonsProps {
  selectedStory: Story | null;
  isLoading: boolean;
  onOpenStories: () => void;
  onNewStory: () => void;
  createMutationPending: boolean;
}

export function StoryButtons({ 
  selectedStory, 
  isLoading, 
  onOpenStories, 
  onNewStory,
  createMutationPending 
}: StoryButtonsProps) {
  return (
    <div className="space-y-2">
      <button 
        onClick={onOpenStories}
        className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg bg-purple-50 text-purple-600 hover:bg-purple-100 transition-colors"
        disabled={isLoading}
      >
        <Book className="h-5 w-5" />
        <span className="flex-1 text-left font-medium">
          {isLoading ? "Loading..." : selectedStory ? selectedStory.title : "View All Stories"}
        </span>
        <span className="text-purple-400">→</span>
      </button>

      <button 
        onClick={onNewStory}
        className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg border border-dashed border-gray-200 text-gray-700 hover:border-purple-400 hover:text-purple-600 transition-colors"
        disabled={createMutationPending}
      >
        <Plus className="h-5 w-5" />
        <span className="font-medium">Create New Story</span>
        <span className="ml-auto">+</span>
      </button>
    </div>
  );
}