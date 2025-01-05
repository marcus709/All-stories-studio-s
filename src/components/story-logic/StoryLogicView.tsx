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
import { Plus, AlertTriangle, CheckCircle2, XCircle } from "lucide-react";

export const StoryLogicView = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [description, setDescription] = useState("");
  const [issueType, setIssueType] = useState<StoryIssueType>("plot_hole");
  const { selectedStory } = useStory();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: storyAnalysis } = useQuery({
    queryKey: ["story-analysis", selectedStory?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("story_analysis")
        .select("*")
        .eq("story_id", selectedStory?.id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!selectedStory?.id,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });

  const { data: storyIssues } = useQuery({
    queryKey: ["story-issues", storyAnalysis?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("story_issues")
        .select("*")
        .eq("analysis_id", storyAnalysis.id);
      
      if (error) throw error;
      return data as StoryIssue[];
    },
    enabled: !!storyAnalysis?.id,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });

  const createIssueMutation = useMutation({
    mutationFn: async (newIssue: { description: string; type: StoryIssueType }) => {
      const { data, error } = await supabase
        .from("story_issues")
        .insert({
          description: newIssue.description,
          issue_type: newIssue.type,
          analysis_id: storyAnalysis?.id,
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

  const getIssueTypeIcon = (type: StoryIssueType) => {
    switch (type) {
      case "plot_hole":
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case "timeline_inconsistency":
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case "character_inconsistency":
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Story Logic</h1>
          <p className="text-gray-500">Track and resolve story issues</p>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button>
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {storyIssues?.map((issue) => (
          <div
            key={issue.id}
            className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-2 mb-3">
              {getIssueTypeIcon(issue.issue_type)}
              <span className="text-sm font-medium text-gray-500">
                {issue.issue_type.replace("_", " ")}
              </span>
            </div>
            <p className="text-gray-600 text-sm">{issue.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};