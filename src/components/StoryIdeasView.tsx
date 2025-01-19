import { useStory } from "@/contexts/StoryContext";

export const StoryIdeasView = () => {
  const { selectedStory } = useStory();

  if (!selectedStory) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
        <p className="text-muted-foreground">Please select a story to continue</p>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-4rem)] flex items-center justify-center">
      <div className="text-center space-y-4">
        <h1 className="text-2xl font-bold">World Builder</h1>
        <p className="text-muted-foreground">Coming Soon</p>
        <p className="text-sm text-muted-foreground max-w-md">
          The World Builder feature will help you create and organize your story's universe, 
          including locations, cultures, magic systems, and more.
        </p>
      </div>
    </div>
  );
};