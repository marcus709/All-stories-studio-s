import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { StoriesDialog } from "@/components/StoriesDialog";
import { useStory } from "@/contexts/StoryContext";
import { cn } from "@/lib/utils";
import {
  BookOpen,
  Users,
  GitBranch,
  Cloud,
  FileText,
  BrainCircuit,
  PanelLeftClose,
  PanelLeft,
  Plus,
} from "lucide-react";

interface DashboardSidebarProps {
  currentView: string;
  setCurrentView: (view: string) => void;
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
  const { selectedStory, clearSelectedStory } = useStory();
  const navigate = useNavigate();

  const handleViewChange = (view: string) => {
    if (!selectedStory) {
      setShowStoriesDialog(true);
      return;
    }
    setCurrentView(view);
  };

  const handleStorySelect = () => {
    setShowStoriesDialog(false);
    // The view will update automatically through the story context
  };

  return (
    <div
      className={cn(
        "fixed left-0 top-16 h-[calc(100vh-4rem)] bg-white border-r transition-all duration-300 z-10",
        isCollapsed ? "w-12" : "w-72"
      )}
    >
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className={cn("font-semibold", isCollapsed && "hidden")}>
          {selectedStory?.title || "Select a Story"}
        </h2>
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleCollapse}
          className="h-8 w-8"
        >
          {isCollapsed ? (
            <PanelLeft className="h-4 w-4" />
          ) : (
            <PanelLeftClose className="h-4 w-4" />
          )}
        </Button>
      </div>

      <ScrollArea className="h-[calc(100vh-8rem)]">
        <div className="space-y-2 p-2">
          <Button
            variant="ghost"
            className={cn(
              "w-full justify-start gap-2",
              !isCollapsed && "px-2",
              isCollapsed && "justify-center px-0"
            )}
            onClick={() => setShowStoriesDialog(true)}
          >
            <Plus className="h-4 w-4" />
            {!isCollapsed && "Switch Story"}
          </Button>

          <Button
            variant={currentView === "story" ? "secondary" : "ghost"}
            className={cn(
              "w-full justify-start gap-2",
              !isCollapsed && "px-2",
              isCollapsed && "justify-center px-0"
            )}
            onClick={() => handleViewChange("story")}
          >
            <BookOpen className="h-4 w-4" />
            {!isCollapsed && "Write"}
          </Button>

          <Button
            variant={currentView === "characters" ? "secondary" : "ghost"}
            className={cn(
              "w-full justify-start gap-2",
              !isCollapsed && "px-2",
              isCollapsed && "justify-center px-0"
            )}
            onClick={() => handleViewChange("characters")}
          >
            <Users className="h-4 w-4" />
            {!isCollapsed && "Characters"}
          </Button>

          <Button
            variant={currentView === "plot" ? "secondary" : "ghost"}
            className={cn(
              "w-full justify-start gap-2",
              !isCollapsed && "px-2",
              isCollapsed && "justify-center px-0"
            )}
            onClick={() => handleViewChange("plot")}
          >
            <GitBranch className="h-4 w-4" />
            {!isCollapsed && "Plot"}
          </Button>

          <Button
            variant={currentView === "dream" ? "secondary" : "ghost"}
            className={cn(
              "w-full justify-start gap-2",
              !isCollapsed && "px-2",
              isCollapsed && "justify-center px-0"
            )}
            onClick={() => handleViewChange("dream")}
          >
            <Cloud className="h-4 w-4" />
            {!isCollapsed && "Dream to Story"}
          </Button>

          <Button
            variant={currentView === "docs" ? "secondary" : "ghost"}
            className={cn(
              "w-full justify-start gap-2",
              !isCollapsed && "px-2",
              isCollapsed && "justify-center px-0"
            )}
            onClick={() => handleViewChange("docs")}
          >
            <FileText className="h-4 w-4" />
            {!isCollapsed && "Documents"}
          </Button>

          <Button
            variant={currentView === "logic" ? "secondary" : "ghost"}
            className={cn(
              "w-full justify-start gap-2",
              !isCollapsed && "px-2",
              isCollapsed && "justify-center px-0"
            )}
            onClick={() => handleViewChange("logic")}
          >
            <BrainCircuit className="h-4 w-4" />
            {!isCollapsed && "Story Logic"}
          </Button>
        </div>
      </ScrollArea>

      <StoriesDialog
        open={showStoriesDialog}
        onOpenChange={setShowStoriesDialog}
        onStorySelect={handleStorySelect}
      />
    </div>
  );
}