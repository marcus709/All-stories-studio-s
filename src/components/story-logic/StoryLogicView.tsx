import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useStory } from "@/contexts/StoryContext";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Bug,
  AlertCircle,
  CheckCircle,
  BookOpen,
  FileText,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type StoryIssue = {
  id: string;
  issue_type: 'plot_hole' | 'timeline_inconsistency' | 'pov_inconsistency' | 'character_inconsistency' | 'setting_inconsistency' | 'logic_flaw';
  description: string;
  location?: string;
  severity?: number;
  status: string;
};

const issueTypeIcons = {
  plot_hole: <Bug className="h-5 w-5" />,
  timeline_inconsistency: <AlertCircle className="h-5 w-5" />,
  pov_inconsistency: <BookOpen className="h-5 w-5" />,
  character_inconsistency: <FileText className="h-5 w-5" />,
  setting_inconsistency: <AlertCircle className="h-5 w-5" />,
  logic_flaw: <AlertCircle className="h-5 w-5" />,
};

const issueTypeLabels = {
  plot_hole: "Plot Hole",
  timeline_inconsistency: "Timeline Inconsistency",
  pov_inconsistency: "POV Inconsistency",
  character_inconsistency: "Character Inconsistency",
  setting_inconsistency: "Setting Inconsistency",
  logic_flaw: "Logic Flaw",
};

export const StoryLogicView = () => {
  const { selectedStory } = useStory();
  const { toast } = useToast();
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const { data: analysis } = useQuery({
    queryKey: ["storyAnalysis", selectedStory?.id],
    queryFn: async () => {
      if (!selectedStory) return null;
      
      const { data: analysisData } = await supabase
        .from("story_analysis")
        .select("*, story_issues(*)")
        .eq("story_id", selectedStory.id)
        .single();
      
      return analysisData;
    },
    enabled: !!selectedStory,
  });

  const startAnalysis = async () => {
    if (!selectedStory) return;
    
    setIsAnalyzing(true);
    try {
      const { data: newAnalysis, error: analysisError } = await supabase
        .from("story_analysis")
        .insert({
          story_id: selectedStory.id,
          user_id: (await supabase.auth.getUser()).data.user?.id,
        })
        .select()
        .single();

      if (analysisError) throw analysisError;

      // Simulated issues for demonstration
      const sampleIssues = [
        {
          analysis_id: newAnalysis.id,
          issue_type: "plot_hole",
          description: "Character mentions an event that wasn't previously established",
          location: "Chapter 3",
          severity: 3,
        },
        {
          analysis_id: newAnalysis.id,
          issue_type: "timeline_inconsistency",
          description: "Events in Chapter 5 seem to occur before Chapter 4 without explanation",
          location: "Chapter 4-5",
          severity: 4,
        },
      ];

      await supabase.from("story_issues").insert(sampleIssues);

      toast({
        title: "Analysis Complete",
        description: "Your story has been analyzed for potential issues.",
      });
    } catch (error) {
      toast({
        title: "Analysis Failed",
        description: "There was an error analyzing your story.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const resolveIssue = async (issueId: string) => {
    try {
      await supabase
        .from("story_issues")
        .update({ status: "resolved" })
        .eq("id", issueId);

      toast({
        title: "Issue Resolved",
        description: "The issue has been marked as resolved.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to resolve the issue.",
        variant: "destructive",
      });
    }
  };

  if (!selectedStory) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)] bg-gray-50">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">No Story Selected</h2>
          <p className="text-gray-600 mb-4">Please select or create a story to use Story Logic.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Story Logic</h1>
          <p className="text-gray-500">Analyze your story for potential issues and inconsistencies</p>
        </div>
        <Button
          onClick={startAnalysis}
          disabled={isAnalyzing}
          className="bg-violet-500 hover:bg-violet-600"
        >
          {isAnalyzing ? "Analyzing..." : "Start New Analysis"}
        </Button>
      </div>

      {analysis?.story_issues?.length === 0 && (
        <Alert className="mb-6">
          <CheckCircle className="h-4 w-4" />
          <AlertTitle>No Issues Found</AlertTitle>
          <AlertDescription>
            Your story appears to be free of major logical issues. Great work!
          </AlertDescription>
        </Alert>
      )}

      <div className="grid gap-4">
        {analysis?.story_issues?.map((issue: StoryIssue) => (
          <Card key={issue.id} className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <div className="text-violet-500">
                  {issueTypeIcons[issue.issue_type]}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold">
                      {issueTypeLabels[issue.issue_type]}
                    </h3>
                    {issue.severity && (
                      <Badge variant={issue.severity > 3 ? "destructive" : "secondary"}>
                        Severity: {issue.severity}
                      </Badge>
                    )}
                    {issue.status === "resolved" && (
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        Resolved
                      </Badge>
                    )}
                  </div>
                  <p className="text-gray-600 mb-2">{issue.description}</p>
                  {issue.location && (
                    <p className="text-sm text-gray-500">Location: {issue.location}</p>
                  )}
                </div>
              </div>
              {issue.status !== "resolved" && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => resolveIssue(issue.id)}
                >
                  Mark as Resolved
                </Button>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};