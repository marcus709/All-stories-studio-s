import { useState, useEffect } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAI } from "@/hooks/useAI";
import { useToast } from "@/hooks/use-toast";
import { MessageCircle, Send, BookOpen, Users, Brain, Sparkles } from "lucide-react";
import { Profile } from "@/integrations/supabase/types/tables.types";
import { motion } from "framer-motion";

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
    <div className="container mx-auto px-4 py-8 max-w-6xl space-y-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        <div className="space-y-2">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 bg-clip-text text-transparent">
            Welcome back, {profile?.username || 'Writer'}
          </h1>
          <p className="text-xl text-muted-foreground">
            Let's make today's writing session productive
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="p-6 rounded-2xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 backdrop-blur-xl"
          >
            <BookOpen className="h-8 w-8 text-purple-500 mb-3" />
            <h3 className="font-semibold text-lg mb-1">Story Editor</h3>
            <p className="text-sm text-muted-foreground">Continue crafting your narrative</p>
          </motion.div>

          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="p-6 rounded-2xl bg-gradient-to-br from-pink-500/10 to-purple-500/10 border border-pink-500/20 backdrop-blur-xl"
          >
            <Users className="h-8 w-8 text-pink-500 mb-3" />
            <h3 className="font-semibold text-lg mb-1">Characters</h3>
            <p className="text-sm text-muted-foreground">Develop your cast</p>
          </motion.div>

          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="p-6 rounded-2xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 backdrop-blur-xl"
          >
            <Brain className="h-8 w-8 text-purple-500 mb-3" />
            <h3 className="font-semibold text-lg mb-1">Plot Development</h3>
            <p className="text-sm text-muted-foreground">Structure your story</p>
          </motion.div>

          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="p-6 rounded-2xl bg-gradient-to-br from-pink-500/10 to-purple-500/10 border border-pink-500/20 backdrop-blur-xl"
          >
            <Sparkles className="h-8 w-8 text-pink-500 mb-3" />
            <h3 className="font-semibold text-lg mb-1">Story Ideas</h3>
            <p className="text-sm text-muted-foreground">Capture inspiration</p>
          </motion.div>
        </div>

        <div className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-xl rounded-2xl p-8 space-y-6 border border-purple-500/20">
          <div className="flex items-center gap-3 text-muted-foreground">
            <MessageCircle className="h-6 w-6 text-purple-500" />
            <span className="text-lg font-medium">Writing Assistant</span>
          </div>

          <div className="space-y-4">
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Tell me about your writing goals for today..."
              className="min-h-[100px] bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm border-purple-500/20 focus:border-purple-500/40 resize-none"
            />

            <div className="flex justify-end">
              <Button
                onClick={handleAskAI}
                disabled={isLoading || !message.trim()}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg hover:shadow-xl transition-all duration-300"
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
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 p-6 bg-gradient-to-br from-purple-500/5 to-pink-500/5 rounded-xl border border-purple-500/20"
              >
                <div className="prose dark:prose-invert max-w-none">
                  {aiResponse}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};