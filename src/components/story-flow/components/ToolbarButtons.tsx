import React from 'react';
import { Button } from "@/components/ui/button";
import { Calendar, Network, StickyNote, Wand2 } from "lucide-react";

interface ToolbarButtonsProps {
  activeView: "timeline" | "relationships";
  onViewChange: (view: "timeline" | "relationships") => void;
  onGetSuggestions: () => void;
  isGenerating: boolean;
  selectedStory: any;
}

export const ToolbarButtons = ({
  activeView,
  onViewChange,
  onGetSuggestions,
  isGenerating,
  selectedStory
}: ToolbarButtonsProps) => {
  return (
    <div className="flex gap-3 mb-6">
      <Button 
        variant={activeView === "timeline" ? "default" : "outline"} 
        className="gap-2"
        onClick={() => onViewChange("timeline")}
      >
        <Calendar className="w-4 h-4" />
        Timeline
      </Button>
      <Button 
        variant={activeView === "relationships" ? "default" : "outline"} 
        className="gap-2"
        onClick={() => onViewChange("relationships")}
      >
        <Network className="w-4 h-4" />
        Relationships
      </Button>
      <Button variant="outline" className="gap-2">
        <StickyNote className="w-4 h-4" />
        Add Note
      </Button>
      <Button 
        className="bg-violet-500 hover:bg-violet-600 gap-2 ml-auto"
        onClick={onGetSuggestions}
        disabled={isGenerating || !selectedStory}
      >
        <Wand2 className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
        {isGenerating ? 'Generating...' : 'AI Suggestions'}
      </Button>
    </div>
  );
};