import { useState, useEffect } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAI } from "@/hooks/useAI";
import { useToast } from "@/hooks/use-toast";
import { Target, Send, Brain, FileText, Users, Clock, ArrowRight } from "lucide-react";
import { Profile } from "@/integrations/supabase/types/tables.types";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { useStory } from "@/contexts/StoryContext";
import { Character } from "@/types/character";
import { Document } from "@/types/story";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const HomeView = () => {
  const session = useSession();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [writingGoal, setWritingGoal] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { generateContent } = useAI();
  const { toast } = useToast();
  const { selectedStory } = useStory();
  const navigate = useNavigate();

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

  const { data: recentCharacters } = useQuery({
    queryKey: ["recent-characters", selectedStory?.id],
    queryFn: async () => {
      if (!selectedStory?.id) return [];
      const { data, error } = await supabase
        .from("characters")
        .select("*")
        .eq("story_id", selectedStory.id)
        .order("updated_at", { ascending: false })
        .limit(3);

      if (error) throw error;
      return data as Character[];
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
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="container mx-auto px-4 py-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          <div className="relative mb-12">
            <div className="absolute inset-0 bg-blue-500/20 blur-3xl rounded-full" />
            <div className="relative">
              <h1 className="text-4xl font-bold font-mono bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
                Welcome back, {profile?.username || 'Writer'}
              </h1>
              <p className="text-zinc-400 mt-2 font-mono">
                Here's an overview of your writing progress
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="md:col-span-2 bg-zinc-900/50 border-zinc-800 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-zinc-100 font-mono">
                  <Target className="h-5 w-5 text-blue-500" />
                  Today's Writing Plan
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  value={writingGoal}
                  onChange={(e) => setWritingGoal(e.target.value)}
                  placeholder="What would you like to work on today? (e.g., 'I want to develop the conflict in chapter 3' or 'I need help brainstorming character motivations')"
                  className="min-h-[120px] bg-zinc-800/50 border-zinc-700 text-zinc-100 placeholder:text-zinc-500 resize-none font-mono"
                />
                <Button
                  onClick={handlePlanSession}
                  disabled={isLoading || !writingGoal.trim()}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white font-mono shadow-[0_0_15px_rgba(59,130,246,0.5)] transition-all duration-300"
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

            <Card className="bg-zinc-900/50 border-zinc-800 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-zinc-100 font-mono">
                  <Brain className="h-5 w-5 text-blue-500" />
                  Writing Assistant
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-zinc-400 font-mono">
                  Share your writing goals, and I'll help you create a focused plan for today's session.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-zinc-900/50 border-zinc-800 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="flex items-center justify-between text-zinc-100 font-mono">
                  <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-blue-500" />
                    Recent Documents
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => navigate('/dashboard/formatting')}
                    className="text-sm text-zinc-400 hover:text-zinc-100 font-mono"
                  >
                    View All
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[200px]">
                  <div className="space-y-2">
                    {recentDocuments?.map((doc) => (
                      <Button
                        key={doc.id}
                        variant="ghost"
                        className="w-full justify-start text-sm text-zinc-300 hover:text-zinc-100 hover:bg-blue-500/10 font-mono"
                        onClick={() => navigate(`/dashboard/formatting?doc=${doc.id}`)}
                      >
                        <FileText className="h-4 w-4 mr-2 text-blue-500" />
                        <div className="flex flex-col items-start">
                          <span className="font-medium">{doc.title}</span>
                          <span className="text-xs text-zinc-500">
                            <Clock className="h-3 w-3 inline mr-1" />
                            {new Date(doc.updated_at).toLocaleDateString()}
                          </span>
                        </div>
                      </Button>
                    ))}
                    {(!recentDocuments || recentDocuments.length === 0) && (
                      <p className="text-sm text-zinc-500 text-center py-4 font-mono">
                        No recent documents
                      </p>
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            <Card className="bg-zinc-900/50 border-zinc-800 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="flex items-center justify-between text-zinc-100 font-mono">
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-blue-500" />
                    Recent Characters
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => navigate('/dashboard/characters')}
                    className="text-sm text-zinc-400 hover:text-zinc-100 font-mono"
                  >
                    View All
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[200px]">
                  <div className="space-y-2">
                    {recentCharacters?.map((character) => (
                      <Button
                        key={character.id}
                        variant="ghost"
                        className="w-full justify-start text-sm text-zinc-300 hover:text-zinc-100 hover:bg-blue-500/10 font-mono"
                        onClick={() => navigate('/dashboard/characters')}
                      >
                        <Users className="h-4 w-4 mr-2 text-blue-500" />
                        <div className="flex flex-col items-start">
                          <span className="font-medium">{character.name}</span>
                          <span className="text-xs text-zinc-500">
                            {character.role || 'No role specified'}
                          </span>
                        </div>
                      </Button>
                    ))}
                    {(!recentCharacters || recentCharacters.length === 0) && (
                      <p className="text-sm text-zinc-500 text-center py-4 font-mono">
                        No recent characters
                      </p>
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          {aiResponse && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6"
            >
              <Card className="bg-zinc-900/50 border-zinc-800 backdrop-blur-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-zinc-100 font-mono">
                    <Brain className="h-5 w-5 text-blue-500" />
                    Your Writing Plan
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose dark:prose-invert max-w-none">
                    <div className="whitespace-pre-wrap text-zinc-300 font-mono">
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
