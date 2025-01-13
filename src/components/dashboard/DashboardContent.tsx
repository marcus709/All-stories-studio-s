import { StoryView } from "./views/StoryView";
import { CharactersView } from "../CharactersView";
import { PlotDevelopmentView } from "../PlotDevelopmentView";
import { DreamToStory } from "../dream-to-story/DreamToStory";
import { StoryDocsView } from "../docs/StoryDocsView";
import { StoryLogicView } from "../story-logic/StoryLogicView";
import { useStory } from "@/contexts/StoryContext";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface DashboardContentProps {
  currentView: string;
}

export const DashboardContent = ({ currentView }: DashboardContentProps) => {
  const { selectedStory } = useStory();

  if (!selectedStory) {
    return (
      <div className="p-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>No Story Selected</AlertTitle>
          <AlertDescription>
            Please select a story from the sidebar to start working.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const renderContent = () => {
    switch (currentView) {
      case "story":
        return <StoryView />;
      case "characters":
        return <CharactersView />;
      case "plot":
        return <PlotDevelopmentView />;
      case "dream":
        return <DreamToStory />;
      case "docs":
        return <StoryDocsView />;
      case "logic":
        return <StoryLogicView />;
      default:
        return <StoryView />;
    }
  };

  return <div className="min-h-[calc(100vh-4rem)]">{renderContent()}</div>;
};