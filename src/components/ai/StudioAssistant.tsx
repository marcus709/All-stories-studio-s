import { useState } from "react";
import { Bot, X, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAI } from "@/hooks/useAI";
import { useToast } from "@/hooks/use-toast";
import { useSession } from "@supabase/auth-helpers-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Character } from "@/types/character";

type MessageRole = "assistant" | "user";
type Message = {
  role: MessageRole;
  content: string;
};

export const StudioAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [conversation, setConversation] = useState<Message[]>([]);
  const { generateContent, isLoading } = useAI();
  const { toast } = useToast();
  const session = useSession();
  const [isDragging, setIsDragging] = useState(false);
  const [height, setHeight] = useState(500); // Increased default height

  // Fetch user's characters for context
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || isLoading) return;

    const newMessage: Message = { role: "user", content: message };
    const newConversation = [...conversation, newMessage];
    setConversation(newConversation);
    
    try {
      const context = {
        characters: JSON.stringify(characters),
        aiConfig: {
          temperature: 0.7,
          max_tokens: 150,
          model_type: "gpt-4o-mini" as const,
          system_prompt: `You are a friendly and helpful writing assistant. You have access to the user's characters and their traits. 
          Keep your responses concise and engaging. Feel free to ask follow-up questions to better understand the user's needs.
          When discussing characters, reference their specific traits and characteristics to provide personalized advice.`
        }
      };

      const response = await generateContent(message, 'suggestions', context);
      
      if (response) {
        const assistantMessage: Message = { role: "assistant", content: response };
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

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const newHeight = window.innerHeight - e.clientY;
    setHeight(Math.max(300, Math.min(newHeight, window.innerHeight - 100))); // Min 300px, max window height - 100px
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

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-gradient-to-r from-purple-500/90 to-pink-500/90 hover:from-purple-600 hover:to-pink-600 shadow-xl backdrop-blur-sm border border-white/20 transition-all duration-300 hover:scale-105 p-0 flex items-center justify-center"
      >
        <Bot className="h-6 w-6 text-white" />
      </Button>
    );
  }

  return (
    <div 
      style={{ height: `${height}px` }}
      className="fixed bottom-6 right-6 w-96 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 dark:border-gray-800/50 flex flex-col overflow-hidden transition-all duration-300 animate-in slide-in-from-bottom-6"
    >
      <div 
        onMouseDown={handleMouseDown}
        className="flex items-center justify-between p-4 border-b border-gray-200/50 dark:border-gray-800/50 bg-gradient-to-r from-purple-500/10 to-pink-500/10 cursor-ns-resize"
      >
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
            <Bot className="h-4 w-4 text-white" />
          </div>
          <h3 className="font-semibold text-gray-900 dark:text-gray-100">Studio Assistant</h3>
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => setIsOpen(false)}
          className="hover:bg-gray-500/10"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-gray-200 hover:scrollbar-thumb-gray-300 scrollbar-track-transparent">
        {conversation.map((msg, index) => (
          <div
            key={index}
            className={`flex ${msg.role === 'assistant' ? 'justify-start' : 'justify-end'}`}
          >
            <div
              className={`max-w-[80%] rounded-2xl p-3.5 shadow-sm
                ${msg.role === 'assistant' 
                  ? 'bg-gray-100/80 dark:bg-gray-800/80 text-gray-800 dark:text-gray-200 rounded-tl-sm' 
                  : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-tr-sm'}`}
            >
              {msg.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100/80 dark:bg-gray-800/80 rounded-2xl rounded-tl-sm p-4 max-w-[80%] shadow-sm">
              <div className="flex gap-1.5">
                <div className="w-2 h-2 bg-purple-500/60 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-purple-500/60 rounded-full animate-bounce [animation-delay:0.2s]" />
                <div className="w-2 h-2 bg-purple-500/60 rounded-full animate-bounce [animation-delay:0.4s]" />
              </div>
            </div>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200/50 dark:border-gray-800/50 bg-gradient-to-r from-purple-500/5 to-pink-500/5">
        <div className="flex gap-2">
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Ask me anything about your story..."
            className="min-h-[60px] resize-none bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm border-gray-200/50 dark:border-gray-800/50 focus:border-purple-500/50 focus:ring-purple-500/30"
          />
          <Button 
            type="submit" 
            size="icon"
            disabled={isLoading || !message.trim()}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 shadow-md hover:shadow-lg transition-all duration-300"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </div>
  );
};