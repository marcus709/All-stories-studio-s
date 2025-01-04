import { useState, useEffect } from "react";
import { Search, Plus, Tag, Clock, Pencil, Trash2, PanelLeftClose, PanelLeft } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { CreateStoryIdeaDialog } from "./CreateStoryIdeaDialog";
import { useToast } from "./ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useStory } from "@/contexts/StoryContext";
import {
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { IdeaList } from "./ideas/IdeaList";
import { IdeaDialogs } from "./ideas/IdeaDialogs";

export const StoryIdeasView = () => {
  const [ideas, setIdeas] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [ideaToDelete, setIdeaToDelete] = useState<any>(null);
  const [editingIdea, setEditingIdea] = useState<any>(null);
  const [showSidebar, setShowSidebar] = useState(true);
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
    <div className="h-[calc(100vh-4rem)] overflow-hidden">
      <div className="flex items-center justify-between px-8 py-4 border-b">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold">Story Ideas</h1>
          <p className="text-gray-500">Capture and organize your creative ideas</p>
        </div>
        <div className="flex items-center gap-2">
          {!showSidebar && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowSidebar(true)}
              className="h-9 w-9"
            >
              <PanelLeft className="h-5 w-5" />
            </Button>
          )}
          <CreateStoryIdeaDialog onIdeaCreated={fetchIdeas} />
        </div>
      </div>

      <ResizablePanelGroup direction="horizontal" className="h-[calc(100vh-12rem)]">
        {showSidebar && (
          <ResizablePanel 
            defaultSize={30} 
            minSize={20} 
            maxSize={50}
            className="border-r"
          >
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="font-semibold">Ideas List</h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowSidebar(false)}
                className="h-8 w-8"
              >
                <PanelLeftClose className="h-4 w-4" />
              </Button>
            </div>
            <div className="p-4">
              <div className="relative mb-6">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search ideas..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <IdeaList 
                ideas={filteredIdeas}
                onEdit={setEditingIdea}
                onDelete={setIdeaToDelete}
              />
            </div>
          </ResizablePanel>
        )}
        
        <ResizablePanel defaultSize={70}>
          <div className="p-6">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="text-lg font-semibold mb-4">Idea Details</h2>
              {/* Idea details content will be implemented later */}
            </div>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>

      <IdeaDialogs
        ideaToDelete={ideaToDelete}
        editingIdea={editingIdea}
        onDeleteClose={() => setIdeaToDelete(null)}
        onEditClose={() => setEditingIdea(null)}
        onDelete={handleDelete}
        onUpdate={handleUpdate}
        onRefresh={fetchIdeas}
      />
    </div>
  );
};
