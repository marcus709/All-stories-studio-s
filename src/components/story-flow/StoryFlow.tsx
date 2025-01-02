import { useState } from "react";
import { Button } from "@/components/ui/button";
import { UserPlus, Calendar, StickyNote, Wand2, ArrowRight, GitBranch, Network } from "lucide-react";
import { StoryFlowTimeline } from "./StoryFlowTimeline";

export const StoryFlow = () => {
  const [viewMode, setViewMode] = useState<"linear" | "branching" | "network">("linear");

  return (
    <div className="max-w-7xl mx-auto px-8 py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Story Flow</h1>
          <p className="text-gray-600">Visualize your story's timeline and character interactions</p>
        </div>
      </div>

      <div className="flex gap-3 mb-6">
        <Button variant="outline" className="gap-2">
          <UserPlus className="w-4 h-4" />
          Add Character
        </Button>
        <Button variant="outline" className="gap-2">
          <Calendar className="w-4 h-4" />
          Add Event
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
        <div className="border-b border-gray-100">
          <div className="p-4">
            <div className="flex flex-col gap-2">
              <button
                onClick={() => setViewMode("linear")}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm ${
                  viewMode === "linear"
                    ? "bg-violet-50 text-violet-600"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <ArrowRight className="w-4 h-4" />
                Linear
              </button>
              <button
                onClick={() => setViewMode("branching")}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm ${
                  viewMode === "branching"
                    ? "bg-violet-50 text-violet-600"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <GitBranch className="w-4 h-4" />
                Branching
              </button>
              <button
                onClick={() => setViewMode("network")}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm ${
                  viewMode === "network"
                    ? "bg-violet-50 text-violet-600"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <Network className="w-4 h-4" />
                Network
              </button>
            </div>
          </div>
        </div>
        
        <div className="relative">
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
      </div>
    </div>
  );
};