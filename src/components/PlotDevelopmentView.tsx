import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PlotStructureSelect } from "./plot/PlotStructureSelect";
import { PlotStage } from "./plot/PlotStage";
import { usePlotEvents } from "./plot/usePlotEvents";
import { PlotStructure } from "./plot/types";
import { Button } from "./ui/button";
import { Plus } from "lucide-react";

export const PlotDevelopmentView = () => {
  const [selectedStructure, setSelectedStructure] = useState<string | null>(null);
  const [newEvent, setNewEvent] = useState({ title: "", description: "" });
  const [activeStage, setActiveStage] = useState<string | null>(null);

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
    <div className="max-w-7xl mx-auto px-8 py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Plot Development</h1>
          <p className="text-gray-500">Plan and structure your story</p>
        </div>
        <Button className="bg-violet-500 hover:bg-violet-600">
          <Plus className="h-4 w-4 mr-2" />
          Add Plot Event
        </Button>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
        <h2 className="text-lg font-semibold mb-4">Story Structure</h2>
        <PlotStructureSelect
          plotStructures={plotStructures}
          selectedStructure={selectedStructure}
          onStructureChange={(value) => {
            setSelectedStructure(value);
            setActiveStage(null);
          }}
        />

        {selectedStructureData && (
          <div className="grid grid-cols-3 gap-4 mt-6">
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

      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h2 className="text-lg font-semibold mb-4">Plot Timeline</h2>
        {/* Timeline content will be implemented later */}
      </div>
    </div>
  );
};