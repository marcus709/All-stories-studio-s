import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useSession } from "@supabase/auth-helpers-react";
import { StoryIssue } from "@/types/story";

export const useStoryAnalysis = (storyId: string | undefined) => {
  const { toast } = useToast();
  const session = useSession();
  const queryClient = useQueryClient();

  const { data: storyAnalysis, isError: analysisError } = useQuery({
    queryKey: ["story-analysis", storyId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("story_analysis")
        .select("*")
        .eq("story_id", storyId)
        .order('created_at', { ascending: false })
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    enabled: !!storyId,
  });

  const { data: storyIssues } = useQuery({
    queryKey: ["story-issues", storyAnalysis?.id],
    queryFn: async () => {
      if (!storyAnalysis?.id) return [];
      
      const { data, error } = await supabase
        .from("story_issues")
        .select("*")
        .eq("analysis_id", storyAnalysis.id)
        .order('severity', { ascending: false });
      
      if (error) throw error;
      return data as StoryIssue[];
    },
    enabled: !!storyAnalysis?.id,
  });

  const analyzeMutation = useMutation({
    mutationFn: async (documentId: string) => {
      if (!storyId || !session?.user?.id) {
        throw new Error("Please select a story first");
      }

      // First verify we can access the document
      const { data: document, error: docError } = await supabase
        .from("documents")
        .select("content")
        .eq("id", documentId)
        .single();

      if (docError || !document) {
        throw new Error("Could not access document content");
      }

      const { data, error } = await supabase.functions.invoke('analyze-story', {
        body: { 
          documentId,
          storyId,
          userId: session.user.id
        },
      });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["story-analysis"] });
      queryClient.invalidateQueries({ queryKey: ["story-issues"] });
      toast({
        title: "Success",
        description: "Story analyzed successfully",
      });
    },
    onError: (error) => {
      console.error('Analysis error:', error);
      toast({
        title: "Error",
        description: "Failed to analyze story. Please try again.",
        variant: "destructive",
      });
    },
  });

  return {
    storyAnalysis,
    storyIssues,
    analysisError,
    analyzeStory: analyzeMutation.mutate,
    isAnalyzing: analyzeMutation.isPending
  };
};