import { useState } from "react";
import { useStory } from "@/contexts/StoryContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AlertTriangle, Check, Clock, Users, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

type StoryIssueType = "plot_hole" | "timeline_inconsistency" | "pov_confusion" | "character_inconsistency";

interface StoryIssue {
  id: string;
  issue_type: StoryIssueType;
  description: string;
  location: string;
  severity: number;
  status: "open" | "resolved";
}

export const StoryLogicView = () => {
  const { selectedStory } = useStory();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<StoryIssueType>("plot_hole");
  const [showUploadDialog, setShowUploadDialog] = useState(false);

  // Query to fetch documents
  const { data: documents } = useQuery({
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

  // Query to fetch story issues
  const { data: storyIssues, isLoading } = useQuery({
    queryKey: ["story-issues", selectedStory?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("story_issues")
        .select("*")
        .eq("analysis_id", selectedStory?.id);

      if (error) throw error;
      return data as StoryIssue[];
    },
    enabled: !!selectedStory?.id,
  });

  const hasDocuments = documents && documents.length > 0;
  const hasMinimalContent = documents?.some(doc => 
    doc.content && JSON.parse(doc.content as string).length > 100
  );

  const analyzeStory = async () => {
    if (!hasDocuments) {
      setShowUploadDialog(true);
      return;
    }

    toast({
      title: "Analysis Started",
      description: "Analyzing your story for potential issues...",
    });

    // Here we would integrate with an AI service to analyze the story
    // For now, we'll just show a success message
    setTimeout(() => {
      toast({
        title: "Analysis Complete",
        description: "Your story has been analyzed for logical issues.",
      });
    }, 2000);
  };

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
        <Button onClick={analyzeStory}>
          Analyze Story
        </Button>
      </div>

      {!hasDocuments && (
        <Alert className="mb-6">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>No Documents Found</AlertTitle>
          <AlertDescription>
            Please upload a document or use the Story Docs feature to add content before analyzing your story.
          </AlertDescription>
        </Alert>
      )}

      {hasDocuments && !hasMinimalContent && (
        <Alert variant="warning" className="mb-6">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Limited Content</AlertTitle>
          <AlertDescription>
            Your story has very little content. The analysis might not be as comprehensive. Consider adding more content for better results.
          </AlertDescription>
        </Alert>
      )}

      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as StoryIssueType)}>
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
            ) : storyIssues?.filter(issue => issue.issue_type === type).length === 0 ? (
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

      <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload Document Required</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p>To use the Story Logic feature, you need to either:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Upload a document with your story content</li>
              <li>Use the Story Docs feature to write your story</li>
            </ul>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowUploadDialog(false)}>
                Cancel
              </Button>
              <Button onClick={() => {
                setShowUploadDialog(false);
                // Navigate to docs view
                // This would be handled by the parent component
              }}>
                Go to Story Docs
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};