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
  // Helper function to get stage description
  const getStageDescription = (stage: string) => {
    const descriptions: { [key: string]: string } = {
      // Hero's Emotional Journey
      "Call to Adventure - Initial Emotional State": "Character's everyday life and emotional baseline",
      "Crossing the Threshold - Fear and Uncertainty": "First challenges create emotional tension",
      "Tests and Allies - Building Confidence": "Character develops emotional resilience",
      "Approach to Crisis - Rising Tension": "Emotional stakes intensify",
      "Ordeal - Emotional Climax": "Peak emotional challenge",
      "The Road Back - Processing Change": "Dealing with transformation",
      "Return - Emotional Growth": "Character's new emotional maturity",
      
      // Emotional Transformation Arc
      "Status Quo - Comfort Zone": "Initial emotional patterns",
      "Disruption - Emotional Trigger": "Event that challenges emotions",
      "Resistance - Internal Conflict": "Struggling with change",
      "Exploration - New Perspectives": "Opening to new emotional possibilities",
      "Crisis - Breaking Point": "Emotional transformation catalyst",
      "Acceptance - Emotional Shift": "Embracing new emotional truth",
      "Integration - New Normal": "Living with emotional growth",
      
      // Character Development Arc
      "Initial State - Core Beliefs": "Starting emotional framework",
      "Inciting Incident - Emotional Challenge": "First emotional test",
      "Rising Action - Internal Struggle": "Growing emotional conflict",
      "Midpoint - Revelation": "Key emotional insight",
      "Complications - Emotional Tests": "Challenges to growth",
      "Climax - Transformation": "Peak emotional change",
      "Resolution - Growth": "New emotional understanding",
    };
    
    return descriptions[stage] || "Add events to develop your story";
  };

  return (
    <div className="bg-violet-50/50 rounded-lg p-4">
      <h3 className="font-semibold mb-2 text-violet-700">
        {stageNumber}. {stage}
      </h3>
      <p className="text-sm text-violet-600 mb-4">{getStageDescription(stage)}</p>
      
      <div className="space-y-4 min-h-[100px]">
        {events.map((event) => (
          <PlotEvent key={event.id} event={event} />
        ))}

        {events.length === 0 && (
          <p className="text-violet-400 text-sm text-center py-4">
            Add plot events here
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