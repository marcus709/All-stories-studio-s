import { useState, useEffect } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAI } from "@/hooks/useAI";
import { useToast } from "@/hooks/use-toast";
import { MessageCircle, Send } from "lucide-react";
import { Profile } from "@/integrations/supabase/types/tables.types";

export const HomeView = () => {
  const session = useSession();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [message, setMessage] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { generateContent } = useAI();
  const { toast } = useToast();

  useEffect(() => {
    if (session?.user?.id) {
      getProfile();
    }
  }, [session?.user?.id]);

  const getProfile = async () => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session?.user?.id)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  const handleAskAI = async () => {
    if (!message.trim()) return;
    
    setIsLoading(true);
    try {
      const response = await generateContent(
        `As a writing assistant, help me plan my writing session today. Here's what I'm thinking about: ${message}`,
        'suggestions',
        {
          aiConfig: {
            temperature: 0.7,
            max_tokens: 500,
            model_type: "gpt-4o-mini",
            system_prompt: "You are a helpful writing assistant that provides structured, actionable advice for planning writing sessions. Focus on time management, feature recommendations, and specific steps to achieve the user's writing goals."
          }
        }
      );

      if (response) {
        setAiResponse(response);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to get AI response. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="space-y-8">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
            Welcome back, {profile?.username || 'Writer'}
          </h1>
          <p className="text-xl text-muted-foreground">
            What's the plan today?
          </p>
        </div>

        <div className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-lg rounded-xl p-6 space-y-4 border border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-2 text-muted-foreground">
            <MessageCircle className="h-5 w-5" />
            <span>Chat with your AI Assistant</span>
          </div>

          <div className="space-y-4">
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Tell me about your writing goals for today..."
              className="min-h-[100px] bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm"
            />

            <div className="flex justify-end">
              <Button
                onClick={handleAskAI}
                disabled={isLoading || !message.trim()}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
              >
                {isLoading ? (
                  "Thinking..."
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Get Suggestions
                  </>
                )}
              </Button>
            </div>

            {aiResponse && (
              <div className="mt-6 p-4 bg-white/30 dark:bg-gray-900/30 rounded-lg border border-gray-200 dark:border-gray-800">
                <div className="prose dark:prose-invert max-w-none">
                  {aiResponse}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};