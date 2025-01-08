import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PlotStructureSelect } from "./plot/PlotStructureSelect";
import { PlotStage } from "./plot/PlotStage";
import { EmotionTracker } from "./plot/EmotionTracker";
import { usePlotEvents } from "./plot/usePlotEvents";
import { PlotStructure } from "./plot/types";
import { Button } from "./ui/button";
import { Plus, PanelLeftClose, PanelLeft } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import {
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { ScrollArea } from "@/components/ui/scroll-area";

export const PlotDevelopmentView = () => {
  const [selectedStructure, setSelectedStructure] = useState<string | null>(null);
  const [newEvent, setNewEvent] = useState({ title: "", description: "" });
  const [activeStage, setActiveStage] = useState<string | null>(null);
  const [showSidebar, setShowSidebar] = useState(true);
  const [selectedDocument, setSelectedDocument] = useState<string | null>(null);

  const { data: plotStructures } = useQuery({
    queryKey: ["plotStructures"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("plot_structures")
        .select("*");
      if (error) throw error;
      return data as PlotStructure[];
    },
  });

  const { plotEvents, addEventMutation } = usePlotEvents(selectedStructure);

  const handleAddEvent = () => {
    if (!activeStage) return;
    addEventMutation.mutate({
      ...newEvent,
      stage: activeStage,
    });
    setNewEvent({ title: "", description: "" });
    setActiveStage(null);
  };

  const selectedStructureData = plotStructures?.find(
    (structure) => structure.id === selectedStructure
  );

  // Calculate plot development score based on events
  const plotScore = plotEvents ? Math.min(Math.floor((plotEvents.length / 10) * 100), 100) : 0;

  return (
    <div className="h-[calc(100vh-4rem)] overflow-hidden">
      <div className="flex items-center justify-between px-8 py-4 border-b">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold font-instagram-draft">Plot Development</h1>
        </div>
        <div className="flex items-center gap-2">
          {!showSidebar && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowSidebar(true)}
              className="h-9 w-9"
            >
              <PanelLeft className="h-5 w-5" />
            </Button>
          )}
          <Button className="bg-violet-500 hover:bg-violet-600">
            <Plus className="h-4 w-4 mr-2" />
            Add Plot Point
          </Button>
        </div>
      </div>

      <div className="p-6 bg-gray-50">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-instagram-draft">Plot Development Score</h2>
              <span className="text-lg font-instagram-draft text-violet-600">{plotScore}/100</span>
            </div>
            <Progress 
              value={plotScore} 
              className="h-2 bg-violet-100 [&>div]:bg-violet-500" 
            />
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="font-instagram-draft text-gray-600 mb-2">Improvement Tips:</h3>
            <ul className="space-y-2 text-gray-500">
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-violet-500"></div>
                Integrate characters into your plot points to create more engaging story arcs
              </li>
            </ul>
          </div>

          <div className="flex justify-between items-center mt-8">
            <div className="flex items-center gap-8">
              <div className="text-center">
                <div className="w-4 h-4 rounded-full bg-blue-500 mx-auto mb-2"></div>
                <p className="text-sm font-instagram-draft">Opening Scene</p>
              </div>
              <div className="text-center">
                <div className="w-4 h-4 rounded-full bg-yellow-500 mx-auto mb-2"></div>
                <p className="text-sm font-instagram-draft">First Challenge</p>
              </div>
              <div className="text-center">
                <div className="w-4 h-4 rounded-full bg-red-500 mx-auto mb-2"></div>
                <p className="text-sm font-instagram-draft">Major Confrontation</p>
              </div>
              <div className="text-center">
                <div className="w-4 h-4 rounded-full bg-green-500 mx-auto mb-2"></div>
                <p className="text-sm font-instagram-draft">Story Conclusion</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 mt-8">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="font-instagram-draft text-lg mb-4">Story Structure</h3>
              <p className="text-gray-500">
                Follow your story's progression through setup, conflict, climax, and resolution.
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="font-instagram-draft text-lg mb-4">Pacing Analysis</h3>
              <p className="text-gray-500">
                The plot points are well-distributed, maintaining steady pacing throughout the story.
              </p>
            </div>
          </div>
        </div>
      </div>

      <ResizablePanelGroup direction="horizontal" className="h-[calc(100vh-12rem)]">
        {showSidebar && (
          <ResizablePanel 
            defaultSize={25} 
            minSize={20} 
            maxSize={40}
            className="border-r"
          >
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="font-semibold font-instagram-draft">Story Structure</h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowSidebar(false)}
                className="h-8 w-8"
              >
                <PanelLeftClose className="h-4 w-4" />
              </Button>
            </div>
            <ScrollArea className="h-[calc(100vh-16rem)]">
              <div className="p-4">
                <PlotStructureSelect
                  plotStructures={plotStructures}
                  selectedStructure={selectedStructure}
                  onStructureChange={(value) => {
                    setSelectedStructure(value);
                    setActiveStage(null);
                  }}
                />

                {selectedStructureData && (
                  <div className="grid grid-cols-1 gap-4 mt-6">
                    {selectedStructureData.stages.map((stage, index) => (
                      <PlotStage
                        key={stage}
                        stage={stage}
                        stageNumber={index + 1}
                        events={plotEvents?.filter((event) => event.stage === stage) || []}
                        activeStage={activeStage}
                        newEvent={newEvent}
                        onEventChange={setNewEvent}
                        onStageClick={setActiveStage}
                        onCancel={() => {
                          setActiveStage(null);
                          setNewEvent({ title: "", description: "" });
                        }}
                        onAddEvent={handleAddEvent}
                      />
                    ))}
                  </div>
                )}
              </div>
            </ScrollArea>
          </ResizablePanel>
        )}
        
        <ResizablePanel defaultSize={75}>
          <div className="p-6 h-full overflow-y-auto">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <EmotionTracker
                plotEvents={plotEvents || []}
                selectedDocument={selectedDocument}
                onDocumentSelect={setSelectedDocument}
              />
            </div>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};