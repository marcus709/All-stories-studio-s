import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PlotStructureSelect } from "./plot/PlotStructureSelect";
import { PlotStage } from "./plot/PlotStage";
import { usePlotEvents } from "./plot/usePlotEvents";
import { PlotStructure } from "./plot/types";
import { Button } from "./ui/button";
import { Plus, PanelLeftClose, PanelLeft } from "lucide-react";
import {
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

export const PlotDevelopmentView = () => {
  const [selectedStructure, setSelectedStructure] = useState<string | null>(null);
  const [newEvent, setNewEvent] = useState({ title: "", description: "" });
  const [activeStage, setActiveStage] = useState<string | null>(null);
  const [showSidebar, setShowSidebar] = useState(true);

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

  return (
    <div className="h-[calc(100vh-4rem)] overflow-hidden">
      <div className="flex items-center justify-between px-8 py-4 border-b">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold">Plot Development</h1>
          <p className="text-gray-500">Plan and structure your story</p>
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
            Add Plot Event
          </Button>
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
              <h2 className="font-semibold">Story Structure</h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowSidebar(false)}
                className="h-8 w-8"
              >
                <PanelLeftClose className="h-4 w-4" />
              </Button>
            </div>
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
          </ResizablePanel>
        )}
        
        <ResizablePanel defaultSize={75}>
          <div className="p-6">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="text-lg font-semibold mb-4">Plot Timeline</h2>
              {/* Timeline content will be implemented later */}
            </div>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};
