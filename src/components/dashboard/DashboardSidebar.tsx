import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { StoriesDialog } from "@/components/StoriesDialog";
import { useStory } from "@/contexts/StoryContext";
import {
  Book,
  Users2,
  GitBranch,
  Cloud,
  FileText,
  BrainCircuit,
  ChevronLeft,
  ChevronRight,
  Plus,
} from "lucide-react";

type View = "story" | "characters" | "plot" | "dream" | "docs" | "logic";

interface DashboardSidebarProps {
  currentView: View;
  setCurrentView: (view: View) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export const DashboardSidebar = ({
  currentView,
  setCurrentView,
  isCollapsed,
  onToggleCollapse,
}: DashboardSidebarProps) => {
  const [showStoriesDialog, setShowStoriesDialog] = useState(false);
  const { selectedStory } = useStory();

  const handleViewChange = (view: View) => {
    if (!selectedStory) {
      setShowStoriesDialog(true);
      return;
    }
    setCurrentView(view);
  };

  return (
    <div className="flex flex-col h-full border-r bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-[52px] items-center justify-between px-4 py-2 border-b">
        <h2 className={`font-semibold ${isCollapsed ? "hidden" : "block"}`}>
          Dashboard
        </h2>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={onToggleCollapse}
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>
      <ScrollArea className="flex-1">
        <div className="space-y-2 p-2">
          <Button
            variant={currentView === "story" ? "secondary" : "ghost"}
            className="w-full justify-start"
            onClick={() => handleViewChange("story")}
          >
            <Book className="mr-2 h-4 w-4" />
            {!isCollapsed && "Story"}
          </Button>
          <Button
            variant={currentView === "characters" ? "secondary" : "ghost"}
            className="w-full justify-start"
            onClick={() => handleViewChange("characters")}
          >
            <Users2 className="mr-2 h-4 w-4" />
            {!isCollapsed && "Characters"}
          </Button>
          <Button
            variant={currentView === "plot" ? "secondary" : "ghost"}
            className="w-full justify-start"
            onClick={() => handleViewChange("plot")}
          >
            <GitBranch className="mr-2 h-4 w-4" />
            {!isCollapsed && "Plot"}
          </Button>
          <Button
            variant={currentView === "dream" ? "secondary" : "ghost"}
            className="w-full justify-start"
            onClick={() => handleViewChange("dream")}
          >
            <Cloud className="mr-2 h-4 w-4" />
            {!isCollapsed && "Dream to Story"}
          </Button>
          <Button
            variant={currentView === "docs" ? "secondary" : "ghost"}
            className="w-full justify-start"
            onClick={() => handleViewChange("docs")}
          >
            <FileText className="mr-2 h-4 w-4" />
            {!isCollapsed && "Documents"}
          </Button>
          <Button
            variant={currentView === "logic" ? "secondary" : "ghost"}
            className="w-full justify-start"
            onClick={() => handleViewChange("logic")}
          >
            <BrainCircuit className="mr-2 h-4 w-4" />
            {!isCollapsed && "Story Logic"}
          </Button>
        </div>
      </ScrollArea>

      <StoriesDialog />
    </div>
  );
};