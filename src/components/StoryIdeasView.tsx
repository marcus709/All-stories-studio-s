import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Lightbulb, Plus, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useStory } from "@/contexts/StoryContext";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { useToast } from "./ui/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

interface StoryIdea {
  id: string;
  title: string;
  description: string;
  tag: string;
}

export const StoryIdeasView = () => {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newIdea, setNewIdea] = useState({ title: "", description: "", tag: "" });
  const { selectedStory } = useStory();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: ideas = [] } = useQuery({
    queryKey: ["storyIdeas", selectedStory?.id],
    queryFn: async () => {
      if (!selectedStory) return [];
      const { data, error } = await supabase
        .from("story_ideas")
        .select("*")
        .eq("story_id", selectedStory.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as StoryIdea[];
    },
    enabled: !!selectedStory,
  });

  const createIdeaMutation = useMutation({
    mutationFn: async (idea: typeof newIdea) => {
      const session = await supabase.auth.getSession();
      if (!session.data.session?.user) {
        throw new Error("User must be logged in to create an idea");
      }

      const { data, error } = await supabase
        .from("story_ideas")
        .insert({
          ...idea,
          story_id: selectedStory!.id,
          user_id: session.data.session.user.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["storyIdeas"] });
      setShowCreateDialog(false);
      setNewIdea({ title: "", description: "", tag: "" });
      toast({
        title: "Success",
        description: "Story idea created successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create story idea",
        variant: "destructive",
      });
    },
  });

  const deleteIdeaMutation = useMutation({
    mutationFn: async (ideaId: string) => {
      const { error } = await supabase
        .from("story_ideas")
        .delete()
        .eq("id", ideaId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["storyIdeas"] });
      toast({
        title: "Success",
        description: "Story idea deleted successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete story idea",
        variant: "destructive",
      });
    },
  });

  if (!selectedStory) {
    return (
      <div className="flex items-center justify-center min-h-[400px] text-gray-500">
        Please select a story to view and manage story ideas
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-8 py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Story Ideas</h1>
          <p className="text-gray-500">Capture and organize your creative ideas</p>
        </div>
        <Button
          className="bg-purple-500 hover:bg-purple-600 gap-2"
          onClick={() => setShowCreateDialog(true)}
        >
          <Plus className="h-4 w-4" />
          Add Idea
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {ideas.map((idea) => (
          <div
            key={idea.id}
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 relative group"
          >
            <button
              onClick={() => deleteIdeaMutation.mutate(idea.id)}
              className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
            </button>
            <div className="flex items-start gap-4">
              <div className="bg-purple-100 p-2 rounded-lg">
                <Lightbulb className="h-5 w-5 text-purple-500" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold mb-2">{idea.title}</h3>
                <p className="text-sm text-gray-600 mb-3">{idea.description}</p>
                {idea.tag && (
                  <span className="inline-block px-2 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded">
                    {idea.tag}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Idea</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Title</label>
              <Input
                value={newIdea.title}
                onChange={(e) =>
                  setNewIdea((prev) => ({ ...prev, title: e.target.value }))
                }
                placeholder="Enter idea title"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Description</label>
              <Textarea
                value={newIdea.description}
                onChange={(e) =>
                  setNewIdea((prev) => ({ ...prev, description: e.target.value }))
                }
                placeholder="Describe your idea"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Tag</label>
              <Select
                value={newIdea.tag}
                onValueChange={(value) =>
                  setNewIdea((prev) => ({ ...prev, tag: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a tag" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="plot">Plot</SelectItem>
                  <SelectItem value="character">Character</SelectItem>
                  <SelectItem value="setting">Setting</SelectItem>
                  <SelectItem value="theme">Theme</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  setShowCreateDialog(false);
                  setNewIdea({ title: "", description: "", tag: "" });
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={() => createIdeaMutation.mutate(newIdea)}
                disabled={!newIdea.title}
              >
                Create Idea
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};