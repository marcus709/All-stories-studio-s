import { useState, useEffect } from "react";
import { Bot, X, Send, Sparkles, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAI } from "@/hooks/useAI";
import { useToast } from "@/hooks/use-toast";
import { useSession } from "@supabase/auth-helpers-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Character } from "@/types/character";
import { useStory } from "@/contexts/StoryContext";

type MessageRole = "assistant" | "user";
type Message = {
  role: MessageRole;
  content: string;
  saveable?: {
    type: "character" | "timeline" | "document" | "idea";
    data: any;
  };
};

export const StudioAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [conversation, setConversation] = useState<Message[]>([]);
  const { generateContent, isLoading } = useAI();
  const { toast } = useToast();
  const session = useSession();
  const [isDragging, setIsDragging] = useState(false);
  const [height, setHeight] = useState(500);
  const { selectedStory } = useStory();
  const queryClient = useQueryClient();

  const { data: characters } = useQuery({
    queryKey: ["characters", session?.user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("characters")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Character[];
    },
    enabled: !!session?.user?.id,
  });

  const saveCharacterMutation = useMutation({
    mutationFn: async (characterData: any) => {
      const { error } = await supabase
        .from("characters")
        .insert({
          ...characterData,
          story_id: selectedStory?.id,
          user_id: session?.user?.id,
        });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["characters"] });
      toast({
        title: "Success",
        description: "Character saved successfully",
      });
    },
  });

  const saveTimelineMutation = useMutation({
    mutationFn: async (timelineData: any) => {
      const { error } = await supabase
        .from("timeline_events")
        .insert({
          ...timelineData,
          story_id: selectedStory?.id,
          position: 0,
        });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["timeline-events"] });
      toast({
        title: "Success",
        description: "Timeline event saved successfully",
      });
    },
  });

  const saveDocumentMutation = useMutation({
    mutationFn: async (documentData: any) => {
      const { error } = await supabase
        .from("documents")
        .insert({
          ...documentData,
          story_id: selectedStory?.id,
          user_id: session?.user?.id,
        });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["documents"] });
      toast({
        title: "Success",
        description: "Document saved successfully",
      });
    },
  });

  const saveIdeaMutation = useMutation({
    mutationFn: async (ideaData: any) => {
      const { error } = await supabase
        .from("story_ideas")
        .insert({
          ...ideaData,
          story_id: selectedStory?.id,
          user_id: session?.user?.id,
        });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["story-ideas"] });
      toast({
        title: "Success",
        description: "Story idea saved successfully",
      });
    },
  });

  const handleSaveContent = async (message: Message) => {
    if (!message.saveable || !selectedStory?.id) {
      toast({
        title: "Error",
        description: "Please select a story first",
        variant: "destructive",
      });
      return;
    }

    try {
      switch (message.saveable.type) {
        case "character":
          await saveCharacterMutation.mutateAsync(message.saveable.data);
          break;
        case "timeline":
          await saveTimelineMutation.mutateAsync(message.saveable.data);
          break;
        case "document":
          await saveDocumentMutation.mutateAsync(message.saveable.data);
          break;
        case "idea":
          await saveIdeaMutation.mutateAsync(message.saveable.data);
          break;
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save content. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || isLoading) return;

    const newMessage: Message = { role: "user", content: message };
    const newConversation = [...conversation, newMessage];
    setConversation(newConversation);
    
    try {
      const context = {
        characters: JSON.stringify(characters),
        storyId: selectedStory?.id,
        aiConfig: {
          temperature: 0.7,
          max_tokens: 150,
          model_type: "gpt-4o-mini" as const,
          system_prompt: `You are a friendly and helpful writing assistant. You have access to the user's characters and their traits. 
          Keep your responses concise and engaging. Feel free to ask follow-up questions to better understand the user's needs.
          When discussing characters, reference their specific traits and characteristics to provide personalized advice.
          After brainstorming content, offer to save it in the appropriate feature (characters, timeline, documents, or ideas).`
        }
      };

      const response = await generateContent(message, 'suggestions', context);
      
      if (response) {
        // Check if the response contains saveable content
        const saveableContent = extractSaveableContent(response);
        const assistantMessage: Message = { 
          role: "assistant", 
          content: response,
          ...(saveableContent && { saveable: saveableContent })
        };
        setConversation([...newConversation, assistantMessage]);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to get AI response. Please try again.",
        variant: "destructive",
      });
    }
    
    setMessage("");
  };

  const extractSaveableContent = (response: string) => {
    // This is a simple example - you might want to make this more sophisticated
    if (response.includes("character:")) {
      const characterData = {
        name: "New Character",
        description: response,
      };
      return { type: "character" as const, data: characterData };
    }
    // Add similar logic for timeline, documents, and ideas
    return null;
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const newHeight = window.innerHeight - e.clientY;
    setHeight(Math.max(300, Math.min(newHeight, window.innerHeight - 100)));
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove as any);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove as any);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  return (
    <>
      {!isOpen ? (
        <Button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-gradient-to-br from-violet-600/90 via-fuchsia-500/90 to-pink-500/90 hover:from-violet-700 hover:via-fuchsia-600 hover:to-pink-600 shadow-xl backdrop-blur-sm border border-white/20 transition-all duration-500 hover:scale-105 p-0 flex items-center justify-center group"
        >
          <Bot className="h-6 w-6 text-white transition-transform duration-300 group-hover:scale-110" />
          <div className="absolute -top-2 -right-2 h-4 w-4 rounded-full bg-violet-400 animate-pulse ring-4 ring-violet-400/30" />
        </Button>
      ) : (
        <div 
          style={{ height: `${height}px` }}
          className="fixed bottom-6 right-6 w-[420px] bg-gradient-to-br from-white/95 via-white/90 to-white/95 dark:from-gray-900/95 dark:via-gray-900/90 dark:to-gray-900/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 dark:border-gray-800/50 flex flex-col overflow-hidden transition-all duration-500 animate-in slide-in-from-bottom-6 z-50"
        >
          <div 
            onMouseDown={handleMouseDown}
            className="flex items-center justify-between p-4 border-b border-gray-200/50 dark:border-gray-800/50 bg-gradient-to-r from-violet-500/5 via-fuchsia-500/5 to-pink-500/5 cursor-ns-resize relative"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-violet-500/10 via-fuchsia-500/10 to-pink-500/10 opacity-50 blur-xl" />
            <div className="flex items-center gap-3 relative z-10">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-violet-500 via-fuchsia-500 to-pink-500 flex items-center justify-center shadow-lg ring-4 ring-violet-500/10">
                <Bot className="h-5 w-5 text-white" />
              </div>
              <div className="flex flex-col">
                <h3 className="font-semibold text-gray-900 dark:text-gray-100">Writing Assistant</h3>
                <span className="text-xs text-gray-500 dark:text-gray-400">Powered by AI</span>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setIsOpen(false)}
              className="relative z-10 hover:bg-gray-500/10"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-gray-200 hover:scrollbar-thumb-gray-300 scrollbar-track-transparent">
            {conversation.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.role === 'assistant' ? 'justify-start' : 'justify-end'} animate-in slide-in-from-bottom-2 duration-300`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl p-4 shadow-lg backdrop-blur-sm transition-all duration-300 hover:shadow-xl
                    ${msg.role === 'assistant' 
                      ? 'bg-gradient-to-br from-gray-50/90 via-white/90 to-gray-50/90 dark:from-gray-800/90 dark:via-gray-900/90 dark:to-gray-800/90 text-gray-800 dark:text-gray-200 rounded-tl-sm border border-violet-200/50 dark:border-violet-900/50' 
                      : 'bg-gradient-to-br from-violet-500 via-fuchsia-500 to-pink-500 text-white rounded-tr-sm'}`}
                >
                  {msg.role === 'assistant' && (
                    <div className="flex items-center justify-between mb-2">
                      <Sparkles className="h-4 w-4 text-violet-500" />
                      {msg.saveable && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleSaveContent(msg)}
                          className="ml-2 text-xs"
                        >
                          <Save className="h-3 w-3 mr-1" />
                          Save {msg.saveable.type}
                        </Button>
                      )}
                    </div>
                  )}
                  <div className="text-sm leading-relaxed">{msg.content}</div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start animate-in fade-in">
                <div className="bg-gradient-to-br from-gray-50/90 via-white/90 to-gray-50/90 dark:from-gray-800/90 dark:via-gray-900/90 dark:to-gray-800/90 rounded-2xl rounded-tl-sm p-4 max-w-[85%] shadow-lg border border-violet-200/50 dark:border-violet-900/50">
                  <div className="flex gap-1.5">
                    <div className="w-2 h-2 bg-violet-500/60 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-fuchsia-500/60 rounded-full animate-bounce [animation-delay:0.2s]" />
                    <div className="w-2 h-2 bg-pink-500/60 rounded-full animate-bounce [animation-delay:0.4s]" />
                  </div>
                </div>
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200/50 dark:border-gray-800/50 bg-gradient-to-r from-violet-500/5 via-fuchsia-500/5 to-pink-500/5">
            <div className="flex gap-2">
              <Textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Ask me anything about your story..."
                className="min-h-[60px] resize-none bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm border-gray-200/50 dark:border-gray-800/50 focus:border-violet-500/50 focus:ring-violet-500/30 rounded-xl transition-all duration-300"
              />
              <Button 
                type="submit" 
                size="icon"
                disabled={isLoading || !message.trim()}
                className="bg-gradient-to-br from-violet-500 via-fuchsia-500 to-pink-500 hover:from-violet-600 hover:via-fuchsia-600 hover:to-pink-600 shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl disabled:opacity-50"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </form>
        </div>
      )}
    </>
  );
};
