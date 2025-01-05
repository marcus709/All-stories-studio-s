import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import { DocumentsGrid } from "./DocumentsGrid";

interface AnalysisSectionProps {
  hasDocuments: boolean;
  hasMinimalContent: boolean;
  onAnalyze: () => void;
  onCustomAnalysis: (input: string) => void;
}

export const AnalysisSection = ({
  hasDocuments,
  hasMinimalContent,
  onAnalyze,
  onCustomAnalysis,
}: AnalysisSectionProps) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Documents Analysis</h2>
        <div className="flex gap-2">
          <Button onClick={onAnalyze} disabled={!hasDocuments}>
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
            Please upload a document or use the Story Docs feature to add content before analyzing your story.
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

      <DocumentsGrid />
    </div>
  );
};