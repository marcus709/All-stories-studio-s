import { useState, useEffect } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAI } from "@/hooks/useAI";
import { useToast } from "@/hooks/use-toast";
import { Send } from "lucide-react";
import { Profile } from "@/integrations/supabase/types/tables.types";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { useStory } from "@/contexts/StoryContext";
import { Document } from "@/types/story";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const HomeView = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [writingGoal, setWritingGoal] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { generateContent } = useAI();
  const { toast } = useToast();
  const { selectedStory } = useStory();
  const navigate = useNavigate();
  const session = useSession();

  useEffect(() => {
    if (session?.user?.id) {
      getProfile();
    }
  }, [session?.user?.id]);

  const { data: recentDocuments } = useQuery({
    queryKey: ["recent-documents", selectedStory?.id],
    queryFn: async () => {
      if (!selectedStory?.id) return [];
      const { data, error } = await supabase
        .from("documents")
        .select("*")
        .eq("story_id", selectedStory.id)
        .order("updated_at", { ascending: false })
        .limit(3);

      if (error) throw error;
      return data as Document[];
    },
    enabled: !!selectedStory?.id,
  });

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
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-mono">
      <div className="container mx-auto px-4 py-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          <div className="relative mb-12">
            <div className="absolute inset-0 bg-zinc-900/50 blur-3xl rounded-full" />
            <div className="relative">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-zinc-100 to-zinc-400 bg-clip-text text-transparent">
                Welcome back, {profile?.username || 'Writer'}
              </h1>
              <p className="text-zinc-400 mt-2">
                Here's an overview of your writing progress
              </p>
            </div>
          </div>

          <Card className="bg-zinc-900/50 border-zinc-800 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-zinc-100">
                Today's Writing Plan
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                value={writingGoal}
                onChange={(e) => setWritingGoal(e.target.value)}
                placeholder="What would you like to work on today?"
                className="min-h-[120px] bg-zinc-800/50 border-zinc-700 text-zinc-100 placeholder:text-zinc-500 resize-none"
              />
              <Button
                onClick={handlePlanSession}
                disabled={isLoading || !writingGoal.trim()}
                className="w-full bg-zinc-800 hover:bg-zinc-700 text-zinc-100 border border-zinc-700 transition-all duration-300"
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
            </CardContent>
          </Card>

          {aiResponse && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="bg-zinc-900/50 border-zinc-800 backdrop-blur-xl">
                <CardHeader>
                  <CardTitle className="text-zinc-100">
                    Your Writing Plan
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose dark:prose-invert max-w-none">
                    <div className="whitespace-pre-wrap text-zinc-300">
                      {aiResponse}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};