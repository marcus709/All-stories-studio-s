import { StoryView } from "./views/StoryView";
import { CharactersView } from "@/components/CharactersView";
import { FormattingView } from "@/components/FormattingView";
import { PlotDevelopmentView } from "@/components/PlotDevelopmentView";
import { StoryIdeasView } from "@/components/StoryIdeasView";
import { StoryDocsView } from "@/components/docs/StoryDocsView";
import { StoryLogicView } from "@/components/story-logic/StoryLogicView";
import { HomeView } from "./views/HomeView";

type View = "home" | "story" | "characters" | "plot" | "dream" | "ideas" | "docs" | "logic";

interface DashboardContentProps {
  currentView: View;
}

export const DashboardContent = ({ currentView }: DashboardContentProps) => {
  const renderContent = () => {
    switch (currentView) {
      case "home":
        return <HomeView />;
      case "story":
        return <StoryView />;
      case "characters":
        return <CharactersView />;
      case "plot":
        return <FormattingView />;
      case "dream":
        return <PlotDevelopmentView />;
      case "ideas":
        return <StoryIdeasView />;
      case "docs":
        return <StoryDocsView />;
      case "logic":
        return <StoryLogicView />;
      default:
        return <HomeView />;
    }
  };

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-gray-50/50 dark:bg-gray-900/50">
      {renderContent()}
    </main>
  );
};