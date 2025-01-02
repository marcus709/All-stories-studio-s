import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { X } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useStory } from "@/contexts/StoryContext";

interface CreateStoryIdeaDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateStoryIdeaDialog({ isOpen, onOpenChange }: CreateStoryIdeaDialogProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const { toast } = useToast();
  const { selectedStory } = useStory();

  const handleCreateIdea = async () => {
    if (!selectedStory) {
      toast({
        title: "Error",
        description: "Please select a story first",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from("story_ideas")
        .insert({
          title,
          description,
          tag: tags,
          story_id: selectedStory.id,
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Story idea created successfully",
      });

      // Reset form and close dialog
      setTitle("");
      setDescription("");
      setTags("");
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create story idea",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <div className="flex justify-between items-center">
            <DialogTitle className="text-2xl font-bold">Add New Idea</DialogTitle>
            <Button
              variant="ghost"
              className="h-8 w-8 p-0"
              onClick={() => onOpenChange(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-6 pt-4">
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium">
              Title
            </label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter idea title"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium">
              Description
            </label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter idea description"
              className="min-h-[100px]"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="tags" className="text-sm font-medium">
              Tags (comma-separated)
            </label>
            <Input
              id="tags"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="character, plot-twist, setting"
            />
          </div>

          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateIdea}
              className="bg-purple-500 hover:bg-purple-600"
              disabled={!title.trim()}
            >
              Save Idea
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}