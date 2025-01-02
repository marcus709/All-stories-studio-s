import { Button } from "@/components/ui/button";
import { PlotEvent } from "./PlotEvent";
import { AddEventForm } from "./AddEventForm";
import { PlotEventType } from "./types";

interface PlotStageProps {
  stage: string;
  stageNumber: number;
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
  stageNumber,
  events,
  activeStage,
  newEvent,
  onEventChange,
  onStageClick,
  onCancel,
  onAddEvent,
}: PlotStageProps) => {
  return (
    <div className="bg-violet-50/50 rounded-lg p-4">
      <h3 className="font-semibold mb-2 text-violet-700">
        {stageNumber}. {stage}
      </h3>
      
      <div className="space-y-4 min-h-[100px]">
        {events.map((event) => (
          <PlotEvent key={event.id} event={event} />
        ))}

        {events.length === 0 && (
          <p className="text-violet-400 text-sm text-center py-4">
            Drop plot events here
          </p>
        )}

        {activeStage === stage ? (
          <AddEventForm
            newEvent={newEvent}
            onEventChange={onEventChange}
            onCancel={onCancel}
            onSubmit={onAddEvent}
          />
        ) : null}
      </div>
    </div>
  );
};