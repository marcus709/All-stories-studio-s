import React from "react";
import { Dialog, DialogContent } from "./ui/dialog";
import { Button } from "./ui/button";
import { Plus, X, Book } from "lucide-react";
import { useStory } from "@/contexts/StoryContext";
import { useToast } from "./ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CreateStoryForm } from "./stories/CreateStoryForm";
import { StoriesDialogHeader } from "./stories/StoriesDialogHeader";
import { StoriesGrid } from "./stories/StoriesGrid";

export function StoriesDialog() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [showNewStory, setShowNewStory] = React.useState(false);
  const [newStory, setNewStory] = React.useState({ title: "", description: "" });
  const { selectedStory, setSelectedStory } = useStory();
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

  const handleNewStoryChange = (field: "title" | "description", value: string) => {
    setNewStory((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[800px]">
          <StoriesDialogHeader onClose={() => setIsOpen(false)} />

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

          <StoriesGrid
            onStorySelect={setSelectedStory}
            onClose={() => setIsOpen(false)}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={showNewStory} onOpenChange={setShowNewStory}>
        <DialogContent className="sm:max-w-[500px]">
          <StoriesDialogHeader onClose={() => setShowNewStory(false)} />

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

      <div className="space-y-2">
        <button 
          onClick={() => setIsOpen(true)}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg bg-purple-50 text-purple-600 hover:bg-purple-100 transition-colors"
        >
          <Book className="h-5 w-5" />
          <span className="flex-1 text-left font-medium">{selectedStory ? selectedStory.title : "View All Stories"}</span>
          <span className="text-purple-400">→</span>
        </button>

        <button 
          onClick={() => setShowNewStory(true)}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg border border-dashed border-gray-200 text-gray-700 hover:border-purple-400 hover:text-purple-600 transition-colors"
        >
          <Plus className="h-5 w-5" />
          <span className="font-medium">Create New Story</span>
          <span className="ml-auto">+</span>
        </button>
      </div>
    </>
  );
}