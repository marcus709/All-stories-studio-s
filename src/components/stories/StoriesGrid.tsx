import { StoryCard } from "./StoryCard";
import { Story } from "@/types/story";
import { ScrollArea } from "@/components/ui/scroll-area";

interface StoriesGridProps {
  stories: Story[];
  onSelect: (story: Story) => void;
  isLoading: boolean;
  onClose: () => void;
}

export function StoriesGrid({ stories, onSelect, isLoading, onClose }: StoriesGridProps) {
  if (isLoading) {
    return (
      <div className="p-6">
        <p>Loading stories...</p>
      </div>
    );
  }

  if (!stories.length) {
    return (
      <div className="p-6">
        <p>No stories found. Create your first story!</p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-[500px] p-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {stories.map((story) => (
          <StoryCard
            key={story.id}
            story={story}
            onClick={() => {
              onSelect(story);
              onClose();
            }}
            onDelete={(e) => {
              e.stopPropagation();
              // Handle delete
            }}
            isSelected={false}
          />
        ))}
      </div>
    </ScrollArea>
  );
}