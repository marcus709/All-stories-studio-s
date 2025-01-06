import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useStory } from "@/contexts/StoryContext";

interface CreateStoryIdeaDialogProps {
  onIdeaCreated?: () => void;
}

export function CreateStoryIdeaDialog({ onIdeaCreated }: CreateStoryIdeaDialogProps) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tag, setTag] = useState("");
  const { toast } = useToast();
  const { selectedStory } = useStory();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedStory) {
      toast({
        title: "Error",
        description: "Please select a story first",
        variant: "destructive",
      });
      return;
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to create a story idea",
        variant: "destructive",
      });
      return;
    }

    const { error } = await supabase.from("story_ideas").insert({
      title,
      description,
      tag,
      story_id: selectedStory.id,
      user_id: user.id
    });

    if (error) {
      console.error("Error creating story idea:", error);
      toast({
        title: "Error",
        description: "Failed to create story idea",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Success",
      description: "Story idea created successfully",
    });

    setOpen(false);
    setTitle("");
    setDescription("");
    setTag("");
    onIdeaCreated?.();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default">Add Idea</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Idea</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="tags">Tags (comma-separated)</Label>
            <Input
              id="tags"
              value={tag}
              onChange={(e) => setTag(e.target.value)}
              placeholder="character, plot, setting"
            />
          </div>
          <Button type="submit" className="w-full">Create</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}