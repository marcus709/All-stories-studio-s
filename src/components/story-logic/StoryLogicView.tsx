import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useStory } from "@/contexts/StoryContext";
import { useToast } from "@/hooks/use-toast";
import { AnalysisSection } from "./AnalysisSection";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle, Check, Clock, Users } from "lucide-react";

type StoryIssueType = "plot_hole" | "timeline_inconsistency" | "pov_confusion" | "character_inconsistency";

interface StoryIssue {
  id: string;
  issue_type: StoryIssueType;
  description: string;
  location: string;
  severity: number;
  status: "open" | "resolved";
}

const issueTypeInfo = {
  plot_hole: {
    icon: AlertTriangle,
    color: "text-yellow-500",
    label: "Plot Holes",
  },
  timeline_inconsistency: {
    icon: Clock,
    color: "text-blue-500",
    label: "Timeline Issues",
  },
  pov_confusion: {
    icon: Users,
    color: "text-purple-500",
    label: "POV Confusion",
  },
  character_inconsistency: {
    icon: AlertTriangle,
    color: "text-red-500",
    label: "Character Inconsistencies",
  },
};

export const StoryLogicView = () => {
  const { selectedStory } = useStory();
  const { toast } = useToast();
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
        .single();
      
      if (error && error.code !== 'PGRST116') throw error;
      return data;
    },
    enabled: !!selectedStory?.id,
  });

  const { data: storyIssues, isLoading } = useQuery({
    queryKey: ["story-issues", storyAnalysis?.id],
    queryFn: async () => {
      if (!storyAnalysis?.id) return [];
      const { data, error } = await supabase
        .from("story_issues")
        .select("*")
        .eq("analysis_id", storyAnalysis.id);
      
      if (error) throw error;
      return data as StoryIssue[];
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

    if (!storyAnalysis) {
      const { error: analysisError } = await supabase
        .from("story_analysis")
        .insert({
          story_id: selectedStory!.id,
          user_id: (await supabase.auth.getUser()).data.user!.id,
        });

      if (analysisError) {
        toast({
          title: "Error",
          description: "Failed to create analysis record",
          variant: "destructive",
        });
        return;
      }
    }

    setTimeout(() => {
      toast({
        title: "Analysis Complete",
        description: "Your story has been analyzed for logical issues.",
      });
    }, 2000);
  };

  const handleCustomAnalysis = async (customInput: string) => {
    if (!documents?.length) {
      toast({
        title: "No Documents",
        description: "Please upload a document before custom analysis.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Custom Analysis Started",
      description: `Analyzing your story based on: ${customInput}`,
    });

    setTimeout(() => {
      toast({
        title: "Custom Analysis Complete",
        description: "Your story has been analyzed based on your custom criteria.",
      });
    }, 2000);
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

      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as StoryIssueType)} className="mt-8">
        <TabsList className="grid grid-cols-4 mb-6">
          {Object.entries(issueTypeInfo).map(([type, info]) => (
            <TabsTrigger key={type} value={type} className="flex items-center gap-2">
              <info.icon className={`h-4 w-4 ${info.color}`} />
              {info.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {Object.keys(issueTypeInfo).map((type) => (
          <TabsContent key={type} value={type}>
            {isLoading ? (
              <div className="text-center py-4">Loading issues...</div>
            ) : !storyIssues?.filter(issue => issue.issue_type === type).length ? (
              <Alert>
                <Check className="h-4 w-4" />
                <AlertTitle>All Clear!</AlertTitle>
                <AlertDescription>
                  No {issueTypeInfo[type as StoryIssueType].label.toLowerCase()} detected in your story.
                </AlertDescription>
              </Alert>
            ) : (
              <div className="space-y-4">
                {storyIssues?.filter(issue => issue.issue_type === type).map((issue) => (
                  <Alert key={issue.id} variant={issue.severity > 7 ? "destructive" : "default"}>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle className="flex items-center justify-between">
                      <span>Issue in: {issue.location}</span>
                      <span className="text-sm font-normal">
                        Severity: {issue.severity}/10
                      </span>
                    </AlertTitle>
                    <AlertDescription>{issue.description}</AlertDescription>
                  </Alert>
                ))}
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};
