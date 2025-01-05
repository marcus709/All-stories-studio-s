import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useStory } from "@/contexts/StoryContext";
import { useToast } from "@/hooks/use-toast";
import { AnalysisSection } from "./AnalysisSection";
import { IssuesTabs } from "./IssuesTabs";
import { useSession } from "@supabase/auth-helpers-react";
import { StoryIssueType } from "@/types/story";

export const StoryLogicView = () => {
  const { selectedStory } = useStory();
  const { toast } = useToast();
  const session = useSession();
  const [activeTab, setActiveTab] = useState<StoryIssueType>("plot_hole");

  const { data: documents, refetch: refetchDocuments } = useQuery({
    queryKey: ["documents", selectedStory?.id],
    queryFn: async () => {
      if (!selectedStory?.id) return [];
      const { data, error } = await supabase
        .from("documents")
        .select("*")
        .eq("story_id", selectedStory.id);
      
      if (error) throw error;
      return data;
    },
    enabled: !!selectedStory?.id,
  });

  const { data: storyAnalysis } = useQuery({
    queryKey: ["story-analysis", selectedStory?.id],
    queryFn: async () => {
      if (!selectedStory?.id) return null;
      const { data, error } = await supabase
        .from("story_analysis")
        .select("*")
        .eq("story_id", selectedStory.id)
        .maybeSingle();
      
      if (error && error.code !== 'PGRST116') throw error;
      return data;
    },
    enabled: !!selectedStory?.id,
  });

  const { data: storyIssues = [], isLoading } = useQuery({
    queryKey: ["story-issues", storyAnalysis?.id],
    queryFn: async () => {
      if (!storyAnalysis?.id) return [];
      const { data, error } = await supabase
        .from("story_issues")
        .select("*")
        .eq("analysis_id", storyAnalysis.id);
      
      if (error) throw error;
      
      // Ensure the returned data matches our StoryIssue type
      return (data as any[]).map(issue => ({
        ...issue,
        issue_type: issue.issue_type as StoryIssueType
      })) as StoryIssue[];
    },
    enabled: !!storyAnalysis?.id,
  });

  const analyzeStory = async () => {
    if (!documents?.length) {
      toast({
        title: "No Documents",
        description: "Please upload a document before analyzing.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Analysis Started",
      description: "Analyzing your story for potential issues...",
    });

    try {
      const documentContent = documents
        .map(doc => {
          if (typeof doc.content === 'string') return doc.content;
          return JSON.stringify(doc.content);
        })
        .join('\n\n');

      const response = await fetch('/api/analyze-story-logic', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token}`
        },
        body: JSON.stringify({
          storyId: selectedStory!.id,
          documentContent,
          user_id: session?.user?.id
        })
      });

      if (!response.ok) {
        throw new Error('Failed to analyze story');
      }

      toast({
        title: "Analysis Complete",
        description: "Your story has been analyzed for logical issues.",
      });
    } catch (error) {
      console.error('Analysis error:', error);
      toast({
        title: "Analysis Failed",
        description: error instanceof Error ? error.message : "Failed to analyze story",
        variant: "destructive"
      });
    }
  };

  const handleCustomAnalysis = async (customInput: string) => {
    // Custom analysis logic will be implemented here
    console.log("Custom analysis input:", customInput);
  };

  if (!selectedStory) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500">Please select a story to analyze</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Story Logic Analysis</h1>
      </div>

      <AnalysisSection
        hasDocuments={!!documents?.length}
        hasMinimalContent={documents?.some(doc => 
          doc.content && doc.content[0]?.content?.length > 100
        )}
        onAnalyze={analyzeStory}
        onCustomAnalysis={handleCustomAnalysis}
        storyId={selectedStory.id}
        onDocumentUpload={refetchDocuments}
      />

      <IssuesTabs
        activeTab={activeTab}
        setActiveTab={(value) => setActiveTab(value as StoryIssueType)}
        storyIssues={storyIssues}
        isLoading={isLoading}
      />
    </div>
  );
};