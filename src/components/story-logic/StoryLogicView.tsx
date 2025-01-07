import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import { StoryIssueType } from "@/types/story";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useStory } from "@/contexts/StoryContext";
import { Plus } from "lucide-react";
import { AnalysisSection } from "./AnalysisSection";
import { useStoryAnalysis } from "@/hooks/useStoryAnalysis";
import { IssuesList } from "./IssuesList";

export const StoryLogicView = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [description, setDescription] = useState("");
  const [issueType, setIssueType] = useState<StoryIssueType>("plot_hole");
  const { selectedStory } = useStory();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const {
    storyAnalysis,
    storyIssues,
    analyzeStory,
    isAnalyzing
  } = useStoryAnalysis(selectedStory?.id);

  const handleAnalyze = () => {
    if (!selectedStory?.id) {
      toast({
        title: "Error",
        description: "Please select a story first",
        variant: "destructive",
      });
      return;
    }
    analyzeStory("");
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
            <form onSubmit={(e) => {
              e.preventDefault();
              createIssueMutation.mutate({
                description,
                type: issueType,
              });
            }} className="space-y-4">
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
        <IssuesList 
          issues={storyIssues || []} 
          analysisExists={!!storyAnalysis}
        />
      </div>
    </div>
  );
};