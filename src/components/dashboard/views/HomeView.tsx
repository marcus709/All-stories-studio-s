import { useState, useEffect } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAI } from "@/hooks/useAI";
import { useToast } from "@/hooks/use-toast";
import { Target, Send, Brain, FileText, Users, Clock, ArrowRight, Layers, Palette, Code } from "lucide-react";
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-12 gap-6">
          {/* Left Sidebar - Glassmorphic */}
          <div className="col-span-2">
            <div className="backdrop-blur-md bg-white/10 rounded-2xl p-6 border border-white/20 shadow-xl">
              <nav className="space-y-4">
                {['Overview', 'Documents', 'Characters', 'Settings'].map((item) => (
                  <button
                    key={item}
                    className="w-full text-left px-4 py-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200"
                  >
                    {item}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="col-span-8">
            {/* Hero Section */}
            <div className="relative mb-12">
              <div className="absolute -top-20 -right-20 w-64 h-64">
                <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute inset-8 bg-gray-900 rounded-full"></div>
                <div className="absolute inset-0 border-2 border-blue-500/50 rounded-full animate-spin-slow"></div>
              </div>
              <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-600 mb-4">
                Welcome back, {profile?.username || 'Writer'}
              </h1>
              <p className="text-gray-400 max-w-2xl">
                Your creative workspace awaits. Let's bring your stories to life with advanced AI assistance
                and powerful writing tools.
              </p>
            </div>

            {/* AI Interaction Area */}
            <Card className="backdrop-blur-md bg-white/5 border-white/20 mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-400">
                  <Brain className="h-5 w-5" />
                  Writing Assistant
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  value={writingGoal}
                  onChange={(e) => setWritingGoal(e.target.value)}
                  placeholder="What would you like to work on today?"
                  className="min-h-[120px] bg-gray-900/50 border-gray-700 text-gray-300 resize-none focus:ring-blue-500"
                />
                <Button
                  onClick={handlePlanSession}
                  disabled={isLoading || !writingGoal.trim()}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/20"
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

            {/* Project Overview */}
            <div className="grid grid-cols-2 gap-6 mb-8">
              <Card className="backdrop-blur-md bg-white/5 border-white/20">
                <CardHeader>
                  <CardTitle className="text-blue-400">Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[200px]">
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
                  </ScrollArea>
                </CardContent>
              </Card>

              <Card className="backdrop-blur-md bg-white/5 border-white/20">
                <CardHeader>
                  <CardTitle className="text-blue-400">Project Stats</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentCharacters?.map((character) => (
                      <div key={character.id} className="flex items-center gap-2 text-gray-400">
                        <Users className="h-4 w-4 text-green-500" />
                        <span className="text-sm">{character.name}</span>
                      </div>
                    ))}
                    {(!recentCharacters || recentCharacters.length === 0) && (
                      <p className="text-sm text-muted-foreground text-center py-4">
                        No recent characters
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="col-span-2">
            <div className="space-y-6">
              {/* Table of Contents */}
              <Card className="backdrop-blur-md bg-white/5 border-white/20">
                <CardHeader>
                  <CardTitle className="text-sm text-blue-400">Contents</CardTitle>
                </CardHeader>
                <CardContent>
                  <nav className="space-y-2 text-sm">
                    {['Introduction', 'Characters', 'Plot', 'Settings'].map((item) => (
                      <a
                        key={item}
                        href="#"
                        className="block text-gray-400 hover:text-blue-400 transition-colors"
                      >
                        {item}
                      </a>
                    ))}
                  </nav>
                </CardContent>
              </Card>

              {/* Project Roles */}
              <Card className="backdrop-blur-md bg-white/5 border-white/20">
                <CardHeader>
                  <CardTitle className="text-sm text-blue-400">Project Roles</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { icon: Code, label: 'User Interface' },
                      { icon: Palette, label: 'Branding' },
                      { icon: Layers, label: 'Architecture' }
                    ].map((role) => (
                      <div key={role.label} className="flex items-center gap-2 text-gray-400">
                        <role.icon className="h-4 w-4 text-blue-400" />
                        <span className="text-sm">{role.label}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* AI Response Section */}
        {aiResponse && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6"
          >
            <Card className="backdrop-blur-md bg-white/5 border-white/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-400">
                  <Brain className="h-5 w-5" />
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
  );
};
