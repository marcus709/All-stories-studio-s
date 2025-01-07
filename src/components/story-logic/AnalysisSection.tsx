import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import { DocumentsGrid } from "./DocumentsGrid";
import { DocumentUpload } from "./DocumentUpload";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useState } from "react";

interface AnalysisSectionProps {
  hasDocuments: boolean;
  hasMinimalContent: boolean;
  onAnalyze: (documentId: string) => void;
  onCustomAnalysis: (input: string) => void;
  storyId: string;
  onDocumentUpload: () => void;
}

export const AnalysisSection = ({
  hasDocuments,
  hasMinimalContent,
  onAnalyze,
  onCustomAnalysis,
  storyId,
  onDocumentUpload,
}: AnalysisSectionProps) => {
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [selectedDocumentId, setSelectedDocumentId] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Documents Analysis</h2>
        <div className="flex gap-2">
          <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">Upload Document</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Upload Story Document</DialogTitle>
              </DialogHeader>
              <DocumentUpload 
                storyId={storyId} 
                onUploadComplete={() => {
                  setIsUploadOpen(false);
                  onDocumentUpload();
                }}
              />
            </DialogContent>
          </Dialog>
          <Button 
            onClick={() => selectedDocumentId && onAnalyze(selectedDocumentId)} 
            disabled={!selectedDocumentId}
          >
            Analyze Story
          </Button>
          <Button 
            variant="outline" 
            onClick={() => onCustomAnalysis("")}
            disabled={!hasDocuments}
          >
            Custom Analysis
          </Button>
        </div>
      </div>

      {!hasDocuments && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>No Documents Found</AlertTitle>
          <AlertDescription>
            Please upload a document using the Upload Document button above to start analyzing your story.
          </AlertDescription>
        </Alert>
      )}

      {hasDocuments && !hasMinimalContent && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Limited Content</AlertTitle>
          <AlertDescription>
            Your story has very little content. The analysis might not be as comprehensive. Consider adding more content for better results.
          </AlertDescription>
        </Alert>
      )}

      {!selectedDocumentId && hasDocuments && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>No Document Selected</AlertTitle>
          <AlertDescription>
            Please select a document from the grid below to analyze.
          </AlertDescription>
        </Alert>
      )}

      <DocumentsGrid onSelectDocument={setSelectedDocumentId} selectedDocumentId={selectedDocumentId} />
    </div>
  );
};