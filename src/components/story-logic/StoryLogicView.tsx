import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { StoryIssue, StoryIssueType } from "@/types/story";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useStory } from "@/contexts/StoryContext";
import { Plus, Loader2 } from "lucide-react";
import { AnalysisSection } from "./AnalysisSection";
import { useSession } from "@supabase/auth-helpers-react";

export const StoryLogicView = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [description, setDescription] = useState("");
  const [issueType, setIssueType] = useState<StoryIssueType>("plot_hole");
  const { selectedStory } = useStory();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const session = useSession();

  const { data: storyAnalysis, isError: analysisError } = useQuery({
    queryKey: ["story-analysis", selectedStory?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("story_analysis")
        .select("*")
        .eq("story_id", selectedStory?.id)
        .order('created_at', { ascending: false })
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    enabled: !!selectedStory?.id,
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

  const createIssueMutation = useMutation({
    mutationFn: async (newIssue: { description: string; type: StoryIssueType }) => {
      if (!storyAnalysis?.id) {
        throw new Error("No analysis exists for this story yet");
      }

      const { data, error } = await supabase
        .from("story_issues")
        .insert({
          description: newIssue.description,
          issue_type: newIssue.type,
          analysis_id: storyAnalysis.id,
          status: "open",
          severity: 1,
          location: ""
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["story-issues"] });
      setIsOpen(false);
      setDescription("");
      toast({
        title: "Success",
        description: "Story issue created successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create issue",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createIssueMutation.mutate({
      description,
      type: issueType,
    });
  };

  const handleAnalyze = async (documentId: string) => {
    if (!selectedStory?.id || !session?.user?.id) {
      toast({
        title: "Error",
        description: "Please select a story first",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data, error } = await supabase.functions.invoke('analyze-story', {
        body: { 
          documentId,
          storyId: selectedStory.id,
          userId: session.user.id
        },
      });

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ["story-analysis"] });
      queryClient.invalidateQueries({ queryKey: ["story-issues"] });

      toast({
        title: "Success",
        description: "Story analyzed successfully",
      });
    } catch (error) {
      console.error('Analysis error:', error);
      toast({
        title: "Error",
        description: "Failed to analyze story. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Story Logic Analysis</h1>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button disabled={!storyAnalysis}>
              <Plus className="h-4 w-4 mr-2" />
              Add Issue
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Issue</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="type">Issue Type</Label>
                <select
                  id="type"
                  value={issueType}
                  onChange={(e) => setIssueType(e.target.value as StoryIssueType)}
                  className="w-full border rounded-md p-2"
                >
                  <option value="plot_hole">Plot Hole</option>
                  <option value="timeline_inconsistency">Timeline Inconsistency</option>
                  <option value="pov_inconsistency">POV Inconsistency</option>
                  <option value="character_inconsistency">Character Inconsistency</option>
                  <option value="setting_inconsistency">Setting Inconsistency</option>
                  <option value="logic_flaw">Logic Flaw</option>
                </select>
              </div>
              <Button type="submit" className="w-full">
                Create Issue
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {selectedStory?.id && (
        <AnalysisSection
          storyId={selectedStory.id}
          hasDocuments={true}
          hasMinimalContent={false}
          onAnalyze={handleAnalyze}
          onCustomAnalysis={() => {}}
          onDocumentUpload={() => {
            queryClient.invalidateQueries({ queryKey: ["documents"] });
          }}
        />
      )}

      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-4">Story Issues</h2>
        {!storyAnalysis && (
          <div className="text-center text-gray-500 py-8">
            No analysis has been created for this story yet. Use the analysis section above to create one.
          </div>
        )}
        <div className="space-y-4">
          {storyIssues?.map((issue) => (
            <div
              key={issue.id}
              className="bg-white p-4 rounded-lg border shadow-sm"
            >
              <div className="flex justify-between items-start">
                <div>
                  <span className="inline-block px-2 py-1 text-xs font-medium rounded bg-gray-100 text-gray-800 mb-2">
                    {issue.issue_type.replace(/_/g, " ")}
                  </span>
                  <p className="text-gray-700">{issue.description}</p>
                  {issue.location && (
                    <p className="text-sm text-gray-500 mt-1">
                      Location: {issue.location}
                    </p>
                  )}
                  {issue.severity && (
                    <p className="text-sm text-gray-500">
                      Severity: {issue.severity}/10
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};