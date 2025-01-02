import { StoryCard } from "./StoryCard";
import { useStory } from "@/contexts/StoryContext";

interface StoriesGridProps {
  onStorySelect: (story: any) => void;
  onClose: () => void;
}

export const StoriesGrid = ({ onStorySelect, onClose }: StoriesGridProps) => {
  const { stories, selectedStory } = useStory();

  const handleStorySelect = (story: any) => {
    onStorySelect(story);
    onClose();
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {stories.map((story) => (
        <StoryCard
          key={story.id}
          story={story}
          isSelected={selectedStory?.id === story.id}
          onClick={() => handleStorySelect(story)}
        />
      ))}
    </div>
  );
};