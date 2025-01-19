import { StoryView } from "./views/StoryView";
import { CharactersView } from "@/components/CharactersView";
import { FormattingView } from "@/components/FormattingView";
import { PlotDevelopmentView } from "@/components/PlotDevelopmentView";
import { StoryIdeasView } from "@/components/StoryIdeasView";
import { StoryDocsView } from "@/components/docs/StoryDocsView";
import { StoryLogicView } from "@/components/story-logic/StoryLogicView";
import { HomeView } from "./views/HomeView";
import { ComingSoonView } from "@/components/ComingSoonView";

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
        return <ComingSoonView 
          title="World Builder" 
          description="The World Builder feature will help you create and organize your story's universe, including locations, cultures, magic systems, and more."
        />;
      case "dream":
        return <PlotDevelopmentView />;
      case "ideas":
        return <StoryIdeasView />;
      case "docs":
        return <StoryDocsView />;
      case "logic":
        return <ComingSoonView 
          title="Formatting" 
          description="Advanced formatting tools are coming soon to help you prepare your story for publication."
        />;
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