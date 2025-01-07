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

interface TimeAnalysisDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  timePeriod: string;
  setTimePeriod: (value: string) => void;
  onAnalyze: () => void;
  isLoading: boolean;
}

export function TimeAnalysisDialog({
  isOpen,
  onOpenChange,
  timePeriod,
  setTimePeriod,
  onAnalyze,
  isLoading,
}: TimeAnalysisDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Set Time Period</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="timePeriod">Time Period</Label>
            <Input
              id="timePeriod"
              placeholder="e.g., Victorian Era, Ancient Rome, 1920s"
              value={timePeriod}
              onChange={(e) => setTimePeriod(e.target.value)}
            />
          </div>
          <Button 
            onClick={onAnalyze}
            disabled={isLoading || !timePeriod.trim()}
            className="w-full gap-2"
          >
            <History className="w-4 h-4" />
            {isLoading ? "Analyzing..." : "Analyse Historical Context"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}