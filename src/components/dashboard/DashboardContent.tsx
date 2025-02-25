
import { StoryView } from "./views/StoryView";
import { CharactersView } from "@/components/CharactersView";
import { PlotDevelopmentView } from "@/components/PlotDevelopmentView";
import { StoryIdeasView } from "@/components/StoryIdeasView";
import { StoryDocsView } from "@/components/docs/StoryDocsView";
import { StoryLogicView } from "@/components/story-logic/StoryLogicView";
import { AlertTriangle } from "lucide-react";

type View = "story" | "characters" | "plot" | "dream" | "ideas" | "docs" | "logic";

interface DashboardContentProps {
  currentView: View;
}

const ComingSoonView = ({ feature }: { feature: string }) => {
  return (
    <div className="flex flex-col items-center justify-center h-[calc(100vh-4rem)] text-gray-500 space-y-4">
      <AlertTriangle className="w-12 h-12 text-yellow-500" />
      <h2 className="text-2xl font-semibold">{feature} - Coming Soon</h2>
      <p>We're working hard to bring you this feature. Stay tuned!</p>
    </div>
  );
};

export const DashboardContent = ({ currentView }: DashboardContentProps) => {
  const renderContent = () => {
    switch (currentView) {
      case "story":
        return <StoryView />;
      case "characters":
        return <CharactersView />;
      case "plot":
        return <PlotDevelopmentView />;
      case "dream":
        return <PlotDevelopmentView />;
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

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-gray-50/50 dark:bg-gray-900/50">
      {renderContent()}
    </main>
  );
};
