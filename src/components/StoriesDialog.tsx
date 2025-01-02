import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Plus, X } from "lucide-react";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { useStory } from "@/contexts/StoryContext";
import { useToast } from "./ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function StoriesDialog() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [showNewStory, setShowNewStory] = React.useState(false);
  const [newStory, setNewStory] = React.useState({ title: "", description: "" });
  const { stories, selectedStory, setSelectedStory } = useStory();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const createStoryMutation = useMutation({
    mutationFn: async (story: { title: string; description: string }) => {
      const { data, error } = await supabase
        .from("stories")
        .insert([story])
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
  });

  const handleCreateStory = () => {
    createStoryMutation.mutate(newStory);
  };

  const handleStorySelect = (story: any) => {
    setSelectedStory(story);
    setIsOpen(false);
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
              <Card 
                key={story.id} 
                className={`bg-purple-50 p-8 flex flex-col items-center justify-center cursor-pointer hover:bg-purple-100 transition-colors ${
                  selectedStory?.id === story.id ? "ring-2 ring-purple-500" : ""
                }`}
                onClick={() => handleStorySelect(story)}
              >
                <div className="w-12 h-12 mb-4 text-purple-500">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                  </svg>
                </div>
                <h3 className="font-semibold mb-1">{story.title}</h3>
                <p className="text-sm text-gray-600 mb-2">{story.description}</p>
                <div className="text-xs text-gray-500">
                  Last edited {new Date(story.updated_at).toLocaleDateString()}
                </div>
              </Card>
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

          <div className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-medium">
                Title
              </label>
              <Input
                id="title"
                placeholder="Enter story title"
                value={newStory.title}
                onChange={(e) => setNewStory({ ...newStory, title: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium">
                Description
              </label>
              <Textarea
                id="description"
                placeholder="Enter story description"
                className="min-h-[120px]"
                value={newStory.description}
                onChange={(e) => setNewStory({ ...newStory, description: e.target.value })}
              />
            </div>

            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  setShowNewStory(false);
                  setNewStory({ title: "", description: "" });
                }}
              >
                Cancel
              </Button>
              <Button
                className="bg-purple-500 hover:bg-purple-600"
                onClick={handleCreateStory}
                disabled={!newStory.title.trim()}
              >
                Create Story
              </Button>
            </div>
          </div>
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