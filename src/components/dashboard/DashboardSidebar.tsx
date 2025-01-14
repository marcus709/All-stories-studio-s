import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Book,
  Users,
  FileText,
  Lightbulb,
  ChevronRight,
  ChevronLeft,
  Brain,
  Pencil,
} from "lucide-react";

type View = "story" | "characters" | "plot" | "ideas" | "docs" | "logic";

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
  return (
    <div
      className={cn(
        "fixed left-0 top-16 z-30 h-[calc(100vh-4rem)] w-72 border-r bg-white transition-all duration-300",
        isCollapsed && "w-12"
      )}
    >
      <div className="flex h-full flex-col">
        <Button
          variant="ghost"
          size="icon"
          className="absolute -right-4 top-4 z-50 h-8 w-8 rounded-full border bg-white"
          onClick={onToggleCollapse}
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-2">
            <Button
              variant={currentView === "story" ? "default" : "ghost"}
              className={cn(
                "w-full justify-start",
                isCollapsed && "justify-center"
              )}
              onClick={() => setCurrentView("story")}
            >
              <Book className="mr-2 h-4 w-4" />
              {!isCollapsed && "Story"}
            </Button>
            <Button
              variant={currentView === "characters" ? "default" : "ghost"}
              className={cn(
                "w-full justify-start",
                isCollapsed && "justify-center"
              )}
              onClick={() => setCurrentView("characters")}
            >
              <Users className="mr-2 h-4 w-4" />
              {!isCollapsed && "Characters"}
            </Button>
            <Button
              variant={currentView === "plot" ? "default" : "ghost"}
              className={cn(
                "w-full justify-start",
                isCollapsed && "justify-center"
              )}
              onClick={() => setCurrentView("plot")}
            >
              <Pencil className="mr-2 h-4 w-4" />
              {!isCollapsed && "Plot Development"}
            </Button>
            <Button
              variant={currentView === "ideas" ? "default" : "ghost"}
              className={cn(
                "w-full justify-start",
                isCollapsed && "justify-center"
              )}
              onClick={() => setCurrentView("ideas")}
            >
              <Lightbulb className="mr-2 h-4 w-4" />
              {!isCollapsed && "Ideas"}
            </Button>
            <Button
              variant={currentView === "docs" ? "default" : "ghost"}
              className={cn(
                "w-full justify-start",
                isCollapsed && "justify-center"
              )}
              onClick={() => setCurrentView("docs")}
            >
              <FileText className="mr-2 h-4 w-4" />
              {!isCollapsed && "Documents"}
            </Button>
            <Button
              variant={currentView === "logic" ? "default" : "ghost"}
              className={cn(
                "w-full justify-start",
                isCollapsed && "justify-center"
              )}
              onClick={() => setCurrentView("logic")}
            >
              <Brain className="mr-2 h-4 w-4" />
              {!isCollapsed && "Story Logic"}
            </Button>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};