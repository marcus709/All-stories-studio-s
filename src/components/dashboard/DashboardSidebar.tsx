import { useState } from "react";
import { 
  Book, Users, LineChart, Lightbulb, FileText, 
  AlertTriangle, Rewind, ChevronLeft, ChevronRight 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type View = "story" | "characters" | "plot" | "dream" | "ideas" | "docs" | "logic";

interface DashboardSidebarProps {
  currentView: View;
  setCurrentView: (view: View) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

const navigationItems = [
  { id: "story", icon: Book, label: "Story Editor" },
  { id: "characters", icon: Users, label: "Characters" },
  { id: "plot", icon: LineChart, label: "Formatting" },
  { id: "dream", icon: Rewind, label: "Backwards Planning" },
  { id: "ideas", icon: Lightbulb, label: "Story Ideas" },
  { id: "docs", icon: FileText, label: "Story Docs" },
  { id: "logic", icon: AlertTriangle, label: "Story Logic" },
] as const;

export const DashboardSidebar = ({ 
  currentView, 
  setCurrentView, 
  isCollapsed, 
  onToggleCollapse 
}: DashboardSidebarProps) => {
  return (
    <div 
      className={cn(
        "fixed left-0 top-16 h-[calc(100vh-4rem)] bg-white border-r transition-all duration-300",
        isCollapsed ? "w-12" : "w-72"
      )}
    >
      <div className="flex justify-end p-2 border-b">
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleCollapse}
          className="h-8 w-8"
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      <div className="p-2 space-y-2">
        {navigationItems.map(({ id, icon: Icon, label }) => (
          <Button
            key={id}
            variant={currentView === id ? "secondary" : "ghost"}
            className={cn(
              "w-full justify-start gap-2",
              isCollapsed ? "px-2" : "px-4"
            )}
            onClick={() => setCurrentView(id as View)}
          >
            <Icon className="h-5 w-5" />
            {!isCollapsed && <span>{label}</span>}
          </Button>
        ))}
      </div>
    </div>
  );
};