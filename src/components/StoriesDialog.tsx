import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Plus, X } from "lucide-react";
import { useStory } from "@/contexts/StoryContext";
import { useToast } from "./ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CreateStoryForm } from "./stories/CreateStoryForm";
import { StoryCard } from "./stories/StoryCard";

export function StoriesDialog() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [showNewStory, setShowNewStory] = React.useState(false);
  const [newStory, setNewStory] = React.useState({ title: "", description: "" });
  const { stories, selectedStory, setSelectedStory } = useStory();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const createStoryMutation = useMutation({
    mutationFn: async (story: { title: string; description: string }) => {
      const session = await supabase.auth.getSession();
      if (!session.data.session?.user) {
        throw new Error("User must be logged in to create a story");
      }

      const { data, error } = await supabase
        .from("stories")
        .insert({
          title: story.title,
          description: story.description,
          user_id: session.data.session.user.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["stories"] });
      setSelectedStory(data);
      toast({
        title: "Story created",
        description: "Your new story has been created successfully.",
      });
      setShowNewStory(false);
      setNewStory({ title: "", description: "" });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create story",
        variant: "destructive",
      });
    },
  });

  const handleCreateStory = () => {
    createStoryMutation.mutate(newStory);
  };

  const handleStorySelect = (story: any) => {
    setSelectedStory(story);
    setIsOpen(false);
  };

  const handleNewStoryChange = (field: "title" | "description", value: string) => {
    setNewStory((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <div className="flex justify-between items-center">
              <DialogTitle className="text-2xl font-bold">Your Stories</DialogTitle>
              <Button
                variant="ghost"
                className="h-8 w-8 p-0"
                onClick={() => setIsOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogHeader>

          <Button
            onClick={() => {
              setIsOpen(false);
              setShowNewStory(true);
            }}
            variant="outline"
            className="w-full border-dashed border-2 py-8 mb-6 hover:border-purple-500 hover:text-purple-500 group"
          >
            <Plus className="mr-2 h-4 w-4 group-hover:text-purple-500" />
            Create New Story
          </Button>

          <div className="grid grid-cols-3 gap-4">
            {stories.map((story) => (
              <StoryCard
                key={story.id}
                story={story}
                isSelected={selectedStory?.id === story.id}
                onClick={() => handleStorySelect(story)}
              />
            ))}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showNewStory} onOpenChange={setShowNewStory}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <div className="flex justify-between items-center mb-6">
              <DialogTitle className="text-2xl font-bold">Create New Story</DialogTitle>
              <Button
                variant="ghost"
                className="h-8 w-8 p-0"
                onClick={() => setShowNewStory(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogHeader>

          <CreateStoryForm
            newStory={newStory}
            onClose={() => {
              setShowNewStory(false);
              setNewStory({ title: "", description: "" });
            }}
            onChange={handleNewStoryChange}
            onSubmit={handleCreateStory}
          />
        </DialogContent>
      </Dialog>

      <button 
        onClick={() => setIsOpen(true)}
        className={`w-full flex items-center gap-3 text-purple-600 px-4 py-2 rounded-lg hover:bg-purple-50 transition-colors ${
          selectedStory ? "font-medium" : ""
        }`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-5 w-5"
        >
          <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
          <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
        </svg>
        <span>{selectedStory ? selectedStory.title : "View All Stories"}</span>
      </button>
    </>
  );
}