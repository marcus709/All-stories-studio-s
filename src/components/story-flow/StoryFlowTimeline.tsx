import { ViewMode } from "./types";

interface StoryFlowTimelineProps {
  viewMode: ViewMode;
}

export const StoryFlowTimeline = ({ viewMode }: StoryFlowTimelineProps) => {
  return (
    <div>
      {viewMode === "linear" && <div>Linear View</div>}
      {viewMode === "branching" && <div>Branching View</div>}
      {viewMode === "network" && <div>Network View</div>}
      {viewMode === "radial" && <div>Radial View</div>}
    </div>
  );
};
