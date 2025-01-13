import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { History } from "lucide-react";
import { Textarea } from "../ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

interface TimeAnalysisDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  timePeriod: string;
  setTimePeriod: (value: string) => void;
  onAnalyze: () => void;
  isLoading: boolean;
  analysisConfig: {
    focusAreas: string[];
    customInstructions: string;
    analysisDepth: string;
  };
  onConfigChange: (config: {
    focusAreas: string[];
    customInstructions: string;
    analysisDepth: string;
  }) => void;
}

export function TimeAnalysisDialog({
  isOpen,
  onOpenChange,
  timePeriod,
  setTimePeriod,
  onAnalyze,
  isLoading,
  analysisConfig,
  onConfigChange,
}: TimeAnalysisDialogProps) {
  const handleFocusAreaChange = (area: string) => {
    const newAreas = analysisConfig.focusAreas.includes(area)
      ? analysisConfig.focusAreas.filter(a => a !== area)
      : [...analysisConfig.focusAreas, area];
    
    onConfigChange({
      ...analysisConfig,
      focusAreas: newAreas
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Historical Context Analysis</DialogTitle>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="timePeriod">Time Period</Label>
            <Input
              id="timePeriod"
              placeholder="e.g., Victorian Era, Ancient Rome, 1920s"
              value={timePeriod}
              onChange={(e) => setTimePeriod(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Analysis Focus Areas</Label>
            <div className="flex flex-wrap gap-2">
              {["Language", "Culture", "Technology", "Social Norms", "Politics", "Fashion"].map((area) => (
                <Button
                  key={area}
                  variant={analysisConfig.focusAreas.includes(area) ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleFocusAreaChange(area)}
                  className="rounded-full"
                >
                  {area}
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="analysisDepth">Analysis Depth</Label>
            <Select 
              value={analysisConfig.analysisDepth}
              onValueChange={(value) => onConfigChange({ ...analysisConfig, analysisDepth: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select analysis depth" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="basic">Basic Overview</SelectItem>
                <SelectItem value="detailed">Detailed Analysis</SelectItem>
                <SelectItem value="comprehensive">Comprehensive Study</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="customInstructions">Custom Instructions (Optional)</Label>
            <Textarea
              id="customInstructions"
              placeholder="Add any specific aspects you want the analysis to focus on..."
              value={analysisConfig.customInstructions}
              onChange={(e) => onConfigChange({ ...analysisConfig, customInstructions: e.target.value })}
              className="min-h-[100px]"
            />
          </div>

          <Button 
            onClick={onAnalyze}
            disabled={isLoading || !timePeriod.trim()}
            className="w-full gap-2"
          >
            <History className="w-4 h-4" />
            {isLoading ? "Analyzing..." : "Analyze Historical Context"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}