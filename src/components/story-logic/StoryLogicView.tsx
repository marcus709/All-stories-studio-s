import { useState, useEffect } from "react";
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
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [issueType, setIssueType] = useState<StoryIssueType>("PLOT_HOLE");
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
    cacheTime: 30 * 60 * 1000,
  });

  const { data: storyIssues } = useQuery({
    queryKey: ["story-issues", storyAnalysis?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("story_issues")
        .select("*")
        .eq("analysis_id", storyAnalysis.id);
      
      if (error) throw error;
      
      return (data as any[]).map(issue => ({
        ...issue,
        issue_type: issue.issue_type as StoryIssueType
      })) as StoryIssue[];
    },
    enabled: !!storyAnalysis?.id,
    staleTime: 5 * 60 * 1000,
    cacheTime: 30 * 60 * 1000,
  });

  const createIssueMutation = useMutation({
    mutationFn: async (newIssue: { title: string; description: string; type: StoryIssueType }) => {
      const { data, error } = await supabase
        .from("story_issues")
        .insert({
          title: newIssue.title,
          description: newIssue.description,
          issue_type: newIssue.type,
          analysis_id: storyAnalysis?.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["story-issues"] });
      setIsOpen(false);
      setTitle("");
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
      title,
      description,
      type: issueType,
    });
  };

  const getIssueTypeIcon = (type: StoryIssueType) => {
    switch (type) {
      case "PLOT_HOLE":
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case "CONSISTENCY":
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case "CHARACTER":
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
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>
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
                  <option value="PLOT_HOLE">Plot Hole</option>
                  <option value="CONSISTENCY">Consistency Issue</option>
                  <option value="CHARACTER">Character Issue</option>
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
            <h3 className="font-semibold mb-2">{issue.title}</h3>
            <p className="text-gray-600 text-sm">{issue.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};