import { Button } from "@/components/ui/button";
import { CustomAnalysisInput } from "./CustomAnalysisInput";

interface AnalysisControlsProps {
  onAnalyze: () => void;
  onCustomAnalysis: (input: string) => void;
  hasDocuments: boolean;
}

export const AnalysisControls = ({ onAnalyze, onCustomAnalysis, hasDocuments }: AnalysisControlsProps) => {
  return (
    <div className="flex justify-between items-center gap-4">
      <Button onClick={onAnalyze} className="flex-1">
        Analyze Story
      </Button>
      <CustomAnalysisInput onSubmit={onCustomAnalysis} />
    </div>
  );
};