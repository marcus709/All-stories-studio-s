import { useState, useEffect } from "react";
import { Search, Plus, Tag, Clock, Pencil, Trash2 } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { CreateStoryIdeaDialog } from "./CreateStoryIdeaDialog";
import { useToast } from "./ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useStory } from "@/contexts/StoryContext";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";

export const StoryIdeasView = () => {
  const [ideas, setIdeas] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [ideaToDelete, setIdeaToDelete] = useState<any>(null);
  const [editingIdea, setEditingIdea] = useState<any>(null);
  const { toast } = useToast();
  const { selectedStory } = useStory();

  const fetchIdeas = async () => {
    if (!selectedStory) return;

    const { data, error } = await supabase
      .from("story_ideas")
      .select("*")
      .eq("story_id", selectedStory.id)
      .order("created_at", { ascending: false });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to fetch story ideas",
        variant: "destructive",
      });
      return;
    }

    setIdeas(data);
  };

  useEffect(() => {
    fetchIdeas();
  }, [selectedStory]);

  const handleDelete = async () => {
    if (!ideaToDelete) return;

    const { error } = await supabase
      .from("story_ideas")
      .delete()
      .eq("id", ideaToDelete.id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to delete story idea",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Success",
      description: "Story idea deleted successfully",
    });

    setIdeaToDelete(null);
    fetchIdeas();
  };

  const handleUpdate = async () => {
    if (!editingIdea) return;

    const { error } = await supabase
      .from("story_ideas")
      .update({
        title: editingIdea.title,
        description: editingIdea.description,
        tag: editingIdea.tag,
      })
      .eq("id", editingIdea.id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update story idea",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Success",
      description: "Story idea updated successfully",
    });

    setEditingIdea(null);
    fetchIdeas();
  };

  const filteredIdeas = ideas.filter(
    (idea) =>
      idea.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      idea.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      idea.tag?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-5xl mx-auto px-8 py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Story Ideas</h1>
          <p className="text-gray-500">Capture and organize your creative ideas</p>
        </div>
        <CreateStoryIdeaDialog onIdeaCreated={fetchIdeas} />
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          placeholder="Search ideas..."
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="space-y-4">
        {filteredIdeas.map((idea) => (
          <div key={idea.id} className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
                <div className="text-purple-500">
                  {idea.title.charAt(0).toUpperCase()}
                </div>
              </div>
              <div className="flex-1">
                <h3 className="font-medium mb-1">{idea.title}</h3>
                <p className="text-gray-600 text-sm mb-2">{idea.description}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    {idea.tag && (
                      <div className="flex items-center gap-1">
                        <Tag className="w-4 h-4" />
                        <span>{idea.tag}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>
                        Created {new Date(idea.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setEditingIdea(idea)}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIdeaToDelete(idea)}
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <AlertDialog open={!!ideaToDelete} onOpenChange={() => setIdeaToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the story
              idea.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={!!editingIdea} onOpenChange={() => setEditingIdea(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Story Idea</DialogTitle>
          </DialogHeader>
          {editingIdea && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={editingIdea.title}
                  onChange={(e) =>
                    setEditingIdea({ ...editingIdea, title: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={editingIdea.description}
                  onChange={(e) =>
                    setEditingIdea({
                      ...editingIdea,
                      description: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <Label htmlFor="tag">Tags</Label>
                <Input
                  id="tag"
                  value={editingIdea.tag || ""}
                  onChange={(e) =>
                    setEditingIdea({ ...editingIdea, tag: e.target.value })
                  }
                  placeholder="character, plot, setting"
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setEditingIdea(null)}>
                  Cancel
                </Button>
                <Button onClick={handleUpdate}>Save Changes</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};