import { useState, useEffect } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAI } from "@/hooks/useAI";
import { useToast } from "@/hooks/use-toast";
import { Target, Send, Brain } from "lucide-react";
import { Profile } from "@/integrations/supabase/types/tables.types";
import { motion } from "framer-motion";

export const HomeView = () => {
  const session = useSession();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [writingGoal, setWritingGoal] = useState("");
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

  const handlePlanSession = async () => {
    if (!writingGoal.trim()) return;
    
    setIsLoading(true);
    try {
      const response = await generateContent(
        `As a writing coach, help me plan my writing session today. Here's what I want to work on: ${writingGoal}`,
        'suggestions',
        {
          aiConfig: {
            temperature: 0.7,
            max_tokens: 500,
            model_type: "gpt-4o-mini",
            system_prompt: "You are a supportive writing coach that provides clear, actionable steps for planning writing sessions. Focus on time management, specific goals, and practical exercises. Keep responses concise and motivating."
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
    <div className="container mx-auto px-4 py-8 max-w-5xl space-y-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-8"
      >
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100">
            Welcome back, {profile?.username || 'Writer'}
          </h1>
          <p className="text-lg text-muted-foreground">
            Let's plan your writing session for today
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="col-span-2 p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm"
          >
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-purple-500 dark:text-purple-400">
                <Target className="h-5 w-5" />
                <h2 className="text-lg font-semibold">Today's Writing Plan</h2>
              </div>
              
              <Textarea
                value={writingGoal}
                onChange={(e) => setWritingGoal(e.target.value)}
                placeholder="What would you like to work on today? (e.g., 'I want to develop the conflict in chapter 3' or 'I need help brainstorming character motivations')"
                className="min-h-[120px] bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 resize-none"
              />

              <Button
                onClick={handlePlanSession}
                disabled={isLoading || !writingGoal.trim()}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-md"
              >
                {isLoading ? (
                  "Creating your plan..."
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Get Personalized Plan
                  </>
                )}
              </Button>
            </div>
          </motion.div>

          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="space-y-4"
          >
            <div className="p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm">
              <div className="flex items-center gap-2 text-pink-500 dark:text-pink-400 mb-3">
                <Brain className="h-5 w-5" />
                <h3 className="font-semibold">Writing Assistant</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Share your writing goals, and I'll help you create a focused plan for today's session.
              </p>
            </div>
          </motion.div>
        </div>

        {aiResponse && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/10 dark:to-pink-950/10 rounded-xl border border-purple-100 dark:border-purple-900/20"
          >
            <div className="prose dark:prose-invert max-w-none">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Brain className="h-5 w-5 text-purple-500" />
                Your Writing Plan
              </h3>
              <div className="whitespace-pre-wrap">
                {aiResponse}
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};