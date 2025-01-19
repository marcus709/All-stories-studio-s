import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Plus, Tag, Clock, Pencil, Trash2, PanelLeftClose, PanelLeft, MessageSquare } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useStory } from "@/contexts/StoryContext";
import { useSession } from "@supabase/auth-helpers-react";
import { useAI } from "@/hooks/useAI";
import { CreateStoryIdeaDialog } from "@/components/CreateStoryIdeaDialog";
import { IdeaList } from "@/components/ideas/IdeaList";
import { IdeaDialogs } from "@/components/ideas/IdeaDialogs";

export const StoryView = () => {
  const [ideas, setIdeas] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [ideaToDelete, setIdeaToDelete] = useState<any>(null);
  const [editingIdea, setEditingIdea] = useState<any>(null);
  const [showSidebar, setShowSidebar] = useState(true);
  const [isChatMode, setIsChatMode] = useState(true);
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant', content: string }[]>([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const { toast } = useToast();
  const { selectedStory } = useStory();
  const session = useSession();
  const { generateContent, isLoading } = useAI();

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

  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentMessage.trim()) return;

    const newMessage = { role: 'user' as const, content: currentMessage };
    const updatedMessages = [...messages, newMessage];
    setMessages(updatedMessages);
    setCurrentMessage('');

    try {
      const aiResponse = await generateContent(
        currentMessage,
        'suggestions',
        {
          storyDescription: selectedStory?.description || "",
          aiConfig: {
            model_type: 'gpt-4o-mini',
            system_prompt: "You are a creative writing assistant helping with brainstorming and story development. Be concise, encouraging, and specific in your suggestions.",
            temperature: 0.7,
            max_tokens: 1000
          }
        }
      );

      if (aiResponse) {
        setMessages([...updatedMessages, { role: 'assistant', content: aiResponse }]);
      }
    } catch (error) {
      console.error('Error getting AI response:', error);
      toast({
        title: "Error",
        description: "Failed to get AI response. Please try again.",
        variant: "destructive",
      });
    }
  };

  const filteredIdeas = ideas.filter(
    (idea) =>
      idea.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      idea.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      idea.tag?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!selectedStory) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)] text-gray-500">
        Please select a story to continue
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-4rem)] overflow-hidden">
      <div className="flex items-center justify-between px-8 py-4 border-b">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold">Story Editor</h1>
          <p className="text-gray-500">Write and organize your story</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Switch
              checked={isChatMode}
              onCheckedChange={setIsChatMode}
              className="data-[state=checked]:bg-purple-500"
            />
            <MessageSquare className="h-4 w-4" />
            Chat Mode
          </div>
          {!isChatMode && (
            <>
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
            </>
          )}
        </div>
      </div>

      {isChatMode ? (
        <div className="flex flex-col h-[calc(100vh-8rem)]">
          <div className="flex-1 overflow-y-auto mb-4 space-y-4 p-6">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex w-full ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-6 py-3 ${
                    message.role === "user"
                      ? "bg-purple-500 text-white ml-auto"
                      : "bg-gray-100 text-gray-900"
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))}
          </div>
          <form 
            onSubmit={handleChatSubmit}
            className="sticky bottom-0 bg-white p-4 border-t"
          >
            <div className="flex gap-2">
              <Input
                value={currentMessage}
                onChange={(e) => setCurrentMessage(e.target.value)}
                placeholder="Share your ideas or ask for writing suggestions..."
                className="flex-1"
              />
              <Button
                type="submit"
                disabled={!currentMessage.trim() || isLoading}
                className="bg-purple-500 hover:bg-purple-600"
              >
                Send
              </Button>
            </div>
          </form>
        </div>
      ) : (
        <div className="flex h-[calc(100vh-8rem)]">
          {showSidebar && (
            <div className="w-72 border-r flex-shrink-0">
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
            </div>
          )}
          
          <div className="flex-1 p-6">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="text-lg font-semibold mb-4">Idea Details</h2>
              {/* Idea details content will be implemented later */}
            </div>
          </div>
        </div>
      )}

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
