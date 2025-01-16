import { useState, useEffect } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAI } from "@/hooks/useAI";
import { useToast } from "@/hooks/use-toast";
import { MessageCircle, Send, Sparkles } from "lucide-react";
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-gray-100">
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="space-y-12">
          {/* Header Section */}
          <div className="space-y-4">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-purple-500/10 border border-purple-400/20 mb-6">
              <Sparkles className="w-4 h-4 text-purple-400 mr-2" />
              <span className="text-sm text-purple-300">
                AI-Powered Writing Assistant
              </span>
            </div>
            
            <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400">
              I'm {profile?.username || 'Writer'}, crafting stories
              <br />
              from imagination's pulse.
            </h1>
            
            <p className="text-xl text-gray-400 max-w-2xl">
              I specialize in creating compelling narratives that captivate readers and leave lasting impressions.
            </p>
          </div>

          {/* AI Chat Section */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-8 border border-gray-700/50 space-y-6">
            <div className="flex items-center gap-2 text-purple-300">
              <MessageCircle className="h-5 w-5" />
              <span>Let's plan your writing session</span>
            </div>

            <div className="space-y-4">
              <Textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Tell me about your writing goals for today..."
                className="min-h-[100px] bg-gray-900/50 border-gray-700/50 focus:border-purple-500/50 text-gray-300 placeholder:text-gray-500"
              />

              <div className="flex justify-end">
                <Button
                  onClick={handleAskAI}
                  disabled={isLoading || !message.trim()}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6"
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
                <div className="mt-6 p-6 bg-gray-900/50 rounded-lg border border-gray-700/50">
                  <div className="prose prose-invert max-w-none">
                    {aiResponse}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-3 gap-8 pt-8">
            {[
              { label: 'Active Writers', value: '10,000+' },
              { label: 'Stories Created', value: '50,000+' },
              { label: 'AI Suggestions', value: '1M+' }
            ].map((stat, index) => (
              <div key={stat.label} className="text-center space-y-2">
                <div className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};