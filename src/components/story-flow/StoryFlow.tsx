import { useState } from "react";
import { Button } from "@/components/ui/button";
import { UserPlus, Calendar, StickyNote, Wand2, ArrowRight, GitBranch, Network, Circle, Clock, Grid, Boxes, Spiral, Tree, FlowChart, Map, Target, Hexagon, Star, Route, Layers, Sphere, Box } from "lucide-react";
import { StoryFlowTimeline } from "./StoryFlowTimeline";
import { CharacterRelationshipMap } from "./CharacterRelationshipMap";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useStory } from "@/contexts/StoryContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { ScrollArea } from "@/components/ui/scroll-area";

type ViewMode = "linear" | "branching" | "network" | "radial" | "timeline" | "cluster" | 
                "grid" | "spiral" | "tree" | "flowchart" | "mindmap" | "concentric" | 
                "hexagonal" | "starburst" | "pathway" | "layered" | "sphere" | "fractal";

const viewModeIcons = {
  linear: ArrowRight,
  branching: GitBranch,
  network: Network,
  radial: Circle,
  timeline: Clock,
  cluster: Boxes,
  grid: Grid,
  spiral: Spiral,
  tree: Tree,
  flowchart: FlowChart,
  mindmap: Map,
  concentric: Target,
  hexagonal: Hexagon,
  starburst: Star,
  pathway: Route,
  layered: Layers,
  sphere: Sphere,
  fractal: Box
};

const viewModeLabels: Record<ViewMode, string> = {
  linear: "Linear",
  branching: "Branching",
  network: "Network",
  radial: "Radial",
  timeline: "Timeline",
  cluster: "Cluster",
  grid: "Grid",
  spiral: "Spiral",
  tree: "Tree (Collapsible)",
  flowchart: "Flowchart",
  mindmap: "Mind Map",
  concentric: "Concentric Circles",
  hexagonal: "Hexagonal Web",
  starburst: "Starburst",
  pathway: "Pathway",
  layered: "Layered",
  sphere: "Interactive 3D Sphere",
  fractal: "Fractal"
};

export const StoryFlow = () => {
  const [viewMode, setViewMode] = useState<ViewMode>("linear");
  const [activeView, setActiveView] = useState<"timeline" | "relationships">("timeline");
  const [isGenerating, setIsGenerating] = useState(false);
  const { selectedStory } = useStory();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleGetSuggestions = async () => {
    if (!selectedStory) {
      toast({
        title: "No story selected",
        description: "Please select a story first to get AI suggestions.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-story-flow-suggestions', {
        body: { 
          storyId: selectedStory.id,
          type: activeView
        },
      });

      if (error) throw error;

      if (activeView === 'timeline') {
        // Add suggested plot events
        for (const suggestion of data.suggestions) {
          await supabase
            .from('plot_events')
            .insert({
              story_id: selectedStory.id,
              title: suggestion.title,
              description: suggestion.description,
              stage: suggestion.stage,
              user_id: (await supabase.auth.getUser()).data.user?.id,
              order_index: 0,
            });
        }
        queryClient.invalidateQueries({ queryKey: ['plotEvents', selectedStory.id] });
      } else {
        // Add suggested relationships
        for (const suggestion of data.suggestions) {
          await supabase
            .from('character_relationships')
            .insert({
              story_id: selectedStory.id,
              character1_id: suggestion.character1,
              character2_id: suggestion.character2,
              relationship_type: suggestion.relationshipType,
              description: suggestion.description,
            });
        }
        queryClient.invalidateQueries({ queryKey: ['relationships', selectedStory.id] });
      }

      toast({
        title: "Success",
        description: `Generated new ${activeView === 'timeline' ? 'plot events' : 'character relationships'} suggestions!`,
      });
    } catch (error) {
      console.error('Error generating suggestions:', error);
      toast({
        title: "Error",
        description: "Failed to generate suggestions. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

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
        <Button 
          className="bg-violet-500 hover:bg-violet-600 gap-2 ml-auto"
          onClick={handleGetSuggestions}
          disabled={isGenerating || !selectedStory}
        >
          <Wand2 className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
          {isGenerating ? 'Generating...' : 'AI Suggestions'}
        </Button>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {activeView === "timeline" ? (
          <div className="relative">
            <div className="absolute left-4 top-4 z-10">
              <Select value={viewMode} onValueChange={(value: ViewMode) => setViewMode(value)}>
                <SelectTrigger className="w-[180px] bg-white">
                  <SelectValue>
                    {viewModeLabels[viewMode]}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <ScrollArea className="h-[400px] w-[350px] rounded-md">
                    {(Object.keys(viewModeLabels) as ViewMode[]).map((mode) => (
                      <SelectItem key={mode} value={mode}>
                        <div className="flex items-center gap-2 py-1">
                          {viewModeIcons[mode] && React.createElement(viewModeIcons[mode], { className: "w-4 h-4" })}
                          <span>{viewModeLabels[mode]}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </ScrollArea>
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