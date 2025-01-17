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
    <div className="min-h-screen bg-[#0A0F1C]">
      <div className="container mx-auto px-8">
        {/* Main Content Area */}
        <div className="grid grid-cols-12 gap-8 pt-8">
          {/* Left Sidebar - Navigation */}
          <div className="col-span-2 space-y-8">
            <div className="space-y-6">
              <div className="space-y-2">
                <h3 className="text-xs uppercase tracking-wider text-gray-400">Main</h3>
                <nav className="space-y-2">
                  {['Explore', 'Projects', 'Explorations', 'Blog', 'About'].map((item) => (
                    <button
                      key={item}
                      className="w-full text-left px-4 py-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                    >
                      {item}
                    </button>
                  ))}
                </nav>
              </div>

              <div className="space-y-2">
                <h3 className="text-xs uppercase tracking-wider text-gray-400">Social</h3>
                <nav className="space-y-2">
                  {['LinkedIn', 'Twitter', 'Dribbble', 'Instagram'].map((item) => (
                    <button
                      key={item}
                      className="w-full text-left px-4 py-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                    >
                      {item}
                    </button>
                  ))}
                </nav>
              </div>
            </div>
          </div>

          {/* Main Content - Center */}
          <div className="col-span-7">
            <div className="space-y-8">
              {/* Hero Section with Glowing Circle */}
              <div className="relative h-[400px] rounded-2xl bg-gradient-to-b from-[#1a2436] to-[#0A0F1C] overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                  <div className="w-40 h-40 rounded-full bg-[#33C3F0] blur-2xl opacity-20"></div>
                </div>
                <div className="absolute bottom-8 left-8">
                  <h1 className="text-4xl font-bold text-white mb-4">
                    {profile?.username || 'Writer'}
                  </h1>
                  <p className="text-gray-400 max-w-xl">
                    Welcome to your writing dashboard. Here's an overview of your creative journey.
                  </p>
                </div>
              </div>

              {/* Project Overview Section */}
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-white">Project Overview</h2>
                <Card className="bg-[#1a2436]/50 border-0 backdrop-blur-xl">
                  <CardContent className="p-6">
                    <Textarea
                      value={writingGoal}
                      onChange={(e) => setWritingGoal(e.target.value)}
                      placeholder="What would you like to work on today?"
                      className="min-h-[120px] bg-[#0A0F1C]/50 border-gray-800 text-gray-300 resize-none focus:ring-[#33C3F0]"
                    />
                    <Button
                      onClick={handlePlanSession}
                      disabled={isLoading || !writingGoal.trim()}
                      className="w-full mt-4 bg-[#33C3F0] hover:bg-[#1EAEDB] text-white"
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
              </div>

              {/* AI Response Section */}
              {aiResponse && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Card className="bg-[#1a2436]/50 border-0 backdrop-blur-xl">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center gap-2">
                        <Brain className="h-5 w-5 text-[#33C3F0]" />
                        Your Writing Plan
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="prose prose-invert max-w-none">
                        <div className="whitespace-pre-wrap text-gray-300">
                          {aiResponse}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </div>
          </div>

          {/* Right Sidebar - Quick Access */}
          <div className="col-span-3 space-y-8">
            {/* Recent Activity Cards */}
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-blue-500" />
                      Recent Documents
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => navigate('/dashboard/formatting')}
                      className="text-sm text-muted-foreground hover:text-primary"
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
                          className="w-full justify-start text-sm"
                          onClick={() => navigate(`/dashboard/formatting?doc=${doc.id}`)}
                        >
                          <FileText className="h-4 w-4 mr-2 text-blue-500" />
                          <div className="flex flex-col items-start">
                            <span className="font-medium">{doc.title}</span>
                            <span className="text-xs text-muted-foreground">
                              <Clock className="h-3 w-3 inline mr-1" />
                              {new Date(doc.updated_at).toLocaleDateString()}
                            </span>
                          </div>
                        </Button>
                      ))}
                      {(!recentDocuments || recentDocuments.length === 0) && (
                        <p className="text-sm text-muted-foreground text-center py-4">
                          No recent documents
                        </p>
                      )}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-green-500" />
                      Recent Characters
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => navigate('/dashboard/characters')}
                      className="text-sm text-muted-foreground hover:text-primary"
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
                          className="w-full justify-start text-sm"
                          onClick={() => navigate('/dashboard/characters')}
                        >
                          <Users className="h-4 w-4 mr-2 text-green-500" />
                          <div className="flex flex-col items-start">
                            <span className="font-medium">{character.name}</span>
                            <span className="text-xs text-muted-foreground">
                              {character.role || 'No role specified'}
                            </span>
                          </div>
                        </Button>
                      ))}
                      {(!recentCharacters || recentCharacters.length === 0) && (
                        <p className="text-sm text-muted-foreground text-center py-4">
                          No recent characters
                        </p>
                      )}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};