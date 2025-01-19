import { ArrowLeft, Send } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAI } from "@/hooks/useAI";
import { useToast } from "@/hooks/use-toast";

interface DocumentInsightsProps {
  content: string;
  onReplaceWord?: (oldWord: string, newWord: string, index: number) => void;
  onJumpToLocation?: (index: number) => void;
}

type MessageRole = "assistant" | "user";
type Message = {
  role: MessageRole;
  content: string;
};

export function DocumentInsights({ content, onReplaceWord, onJumpToLocation }: DocumentInsightsProps) {
  const [message, setMessage] = useState("");
  const [conversation, setConversation] = useState<Message[]>([]);
  const { generateContent, isLoading } = useAI();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || isLoading) return;

    const newMessage: Message = { role: "user", content: message };
    const newConversation = [...conversation, newMessage];
    setConversation(newConversation);
    
    try {
      const context = {
        documentContent: content,
        aiConfig: {
          temperature: 0.7,
          max_tokens: 150,
          model_type: "gpt-4o-mini" as const,
          system_prompt: `You are a helpful writing assistant analyzing a document. 
          Help users understand their text better by providing insights about word usage, 
          suggesting synonyms, and analyzing writing patterns. Keep your responses concise and focused.`
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

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="p-4 border-b bg-white">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Document Analysis Assistant</h3>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
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
            placeholder="Ask about word usage, request synonyms, or get writing suggestions..."
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
  );
}