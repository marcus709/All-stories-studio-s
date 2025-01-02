import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { PlotEvent } from "./PlotEvent";
import { AddEventForm } from "./AddEventForm";
import { PlotEventType } from "./types";

interface PlotStageProps {
  stage: string;
  events: PlotEventType[];
  activeStage: string | null;
  newEvent: {
    title: string;
    description: string;
  };
  onEventChange: (event: { title: string; description: string }) => void;
  onStageClick: (stage: string) => void;
  onCancel: () => void;
  onAddEvent: () => void;
}

export const PlotStage = ({
  stage,
  events,
  activeStage,
  newEvent,
  onEventChange,
  onStageClick,
  onCancel,
  onAddEvent,
}: PlotStageProps) => {
  return (
    <div className="border rounded-lg p-4 bg-white shadow-sm">
      <h3 className="font-semibold mb-4 text-lg">{stage}</h3>
      
      <div className="space-y-4">
        {events.map((event) => (
          <PlotEvent key={event.id} event={event} />
        ))}

        {activeStage === stage ? (
          <AddEventForm
            newEvent={newEvent}
            onEventChange={onEventChange}
            onCancel={onCancel}
            onSubmit={onAddEvent}
          />
        ) : (
          <Button
            variant="outline"
            className="w-full"
            onClick={() => onStageClick(stage)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Event
          </Button>
        )}
      </div>
    </div>
  );
};