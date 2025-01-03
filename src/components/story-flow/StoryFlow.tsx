import { useState } from "react";
import { Button } from "@/components/ui/button";
import { UserPlus, Calendar, StickyNote, Wand2, ArrowRight, GitBranch, Network } from "lucide-react";
import { StoryFlowTimeline } from "./StoryFlowTimeline";
import { CharacterRelationshipMap } from "./CharacterRelationshipMap";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type ViewMode = "timeline" | "relationships";

export const StoryFlow = () => {
  const [viewMode, setViewMode] = useState<"linear" | "branching" | "network">("linear");
  const [activeView, setActiveView] = useState<ViewMode>("timeline");

  return (
    <div className="max-w-7xl mx-auto px-8 py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Story Flow</h1>
          <p className="text-gray-600">Visualize your story's timeline and character interactions</p>
        </div>
      </div>

      <div className="flex gap-3 mb-6">
        <Button 
          variant={activeView === "timeline" ? "default" : "outline"} 
          className="gap-2"
          onClick={() => setActiveView("timeline")}
        >
          <Calendar className="w-4 h-4" />
          Timeline
        </Button>
        <Button 
          variant={activeView === "relationships" ? "default" : "outline"} 
          className="gap-2"
          onClick={() => setActiveView("relationships")}
        >
          <Network className="w-4 h-4" />
          Relationships
        </Button>
        <Button variant="outline" className="gap-2">
          <StickyNote className="w-4 h-4" />
          Add Note
        </Button>
        <Button className="bg-violet-500 hover:bg-violet-600 gap-2 ml-auto">
          <Wand2 className="w-4 h-4" />
          AI Suggestions
        </Button>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {activeView === "timeline" ? (
          <div className="relative">
            <div className="absolute left-4 top-4 z-10">
              <Select value={viewMode} onValueChange={(value: "linear" | "branching" | "network") => setViewMode(value)}>
                <SelectTrigger className="w-[180px] bg-white">
                  <SelectValue>
                    {viewMode === "linear" && (
                      <div className="flex items-center gap-2">
                        <ArrowRight className="w-4 h-4" />
                        Linear
                      </div>
                    )}
                    {viewMode === "branching" && (
                      <div className="flex items-center gap-2">
                        <GitBranch className="w-4 h-4" />
                        Branching
                      </div>
                    )}
                    {viewMode === "network" && (
                      <div className="flex items-center gap-2">
                        <Network className="w-4 h-4" />
                        Network
                      </div>
                    )}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="linear">
                    <div className="flex items-center gap-2">
                      <ArrowRight className="w-4 h-4" />
                      Linear
                    </div>
                  </SelectItem>
                  <SelectItem value="branching">
                    <div className="flex items-center gap-2">
                      <GitBranch className="w-4 h-4" />
                      Branching
                    </div>
                  </SelectItem>
                  <SelectItem value="network">
                    <div className="flex items-center gap-2">
                      <Network className="w-4 h-4" />
                      Network
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="absolute right-4 top-4 flex flex-col gap-2 z-10">
              <Button variant="outline" size="icon" className="bg-white">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-4 h-4"
                >
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.3-4.3" />
                </svg>
              </Button>
              <Button variant="outline" size="icon" className="bg-white">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-4 h-4"
                >
                  <path d="M12 5v14" />
                  <path d="M5 12h14" />
                </svg>
              </Button>
              <Button variant="outline" size="icon" className="bg-white">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-4 h-4"
                >
                  <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                  <path d="M3 3v5h5" />
                  <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
                  <path d="M16 16h5v5" />
                </svg>
              </Button>
              <div className="bg-white text-xs font-medium text-center py-1 px-2 rounded border">
                100%
              </div>
            </div>
            
            <div className="h-[600px] relative">
              <StoryFlowTimeline viewMode={viewMode} />
            </div>
          </div>
        ) : (
          <CharacterRelationshipMap />
        )}
      </div>
    </div>
  );
};