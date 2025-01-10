import { StoryView } from "./views/StoryView";
import { CharactersView } from "@/components/CharactersView";
import { PlotDevelopmentView } from "@/components/PlotDevelopmentView";
import { BackwardsStoryPlanningView } from "@/components/BackwardsStoryPlanningView";
import { StoryIdeasView } from "@/components/StoryIdeasView";
import { StoryDocsView } from "@/components/docs/StoryDocsView";
import { StoryLogicView } from "@/components/story-logic/StoryLogicView";

interface DashboardContentProps {
  currentView: "story" | "characters" | "plot" | "dream" | "ideas" | "docs" | "logic";
}

export const DashboardContent = ({ currentView }: DashboardContentProps) => {
  const getContent = () => {
    switch (currentView) {
      case "story":
        return <StoryView />;
      case "characters":
        return <CharactersView />;
      case "plot":
        return <PlotDevelopmentView />;
      case "dream":
        return <BackwardsStoryPlanningView />;
      case "ideas":
        return <StoryIdeasView />;
      case "docs":
        return <StoryDocsView />;
      case "logic":
        return <StoryLogicView />;
      default:
        return <StoryView />;
    }
  };

  return <main>{getContent()}</main>;
};