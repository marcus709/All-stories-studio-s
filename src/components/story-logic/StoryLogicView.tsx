import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useStory } from "@/contexts/StoryContext";
import { Plus } from "lucide-react";
import { AnalysisSection } from "./AnalysisSection";
import { useStoryAnalysis } from "@/hooks/useStoryAnalysis";
import { IssuesTabs } from "./IssuesTabs";

export const StoryLogicView = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("plot_hole");
  const { selectedStory } = useStory();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const {
    storyAnalysis,
    storyIssues,
    analyzeStory,
    isAnalyzing
  } = useStoryAnalysis(selectedStory?.id);

  const handleAnalyze = (documentId: string) => {
    if (!selectedStory?.id) {
      toast({
        title: "Error",
        description: "Please select a story first",
        variant: "destructive",
      });
      return;
    }
    analyzeStory(documentId);
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

      <IssuesTabs
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        storyIssues={storyIssues || []}
        isLoading={isAnalyzing}
      />
    </div>
  );
};