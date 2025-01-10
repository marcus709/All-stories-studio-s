import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PanelLeftClose, PanelLeft } from "lucide-react";
import {
  BookOpen,
  Users,
  GitBranch,
  Lightbulb,
  FileText,
  AlertTriangle,
  Rewind,
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
  const items = [
    {
      id: "story",
      label: "Story",
      icon: BookOpen,
    },
    {
      id: "characters",
      label: "Characters",
      icon: Users,
    },
    {
      id: "plot",
      label: "Plot",
      icon: GitBranch,
    },
    {
      id: "dream",
      label: "Backwards Planning",
      icon: Rewind,
    },
    {
      id: "ideas",
      label: "Ideas",
      icon: Lightbulb,
    },
    {
      id: "docs",
      label: "Documents",
      icon: FileText,
    },
    {
      id: "logic",
      label: "Story Logic",
      icon: AlertTriangle,
    },
  ];

  return (
    <aside
      className={cn(
        "fixed left-0 top-16 z-30 h-[calc(100vh-4rem)] w-72 border-r bg-white transition-all duration-300",
        isCollapsed && "w-12"
      )}
    >
      <div className="flex h-full flex-col">
        <div className="flex items-center justify-end p-2">
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
        <ScrollArea className="flex-1">
          <div className="space-y-1 p-2">
            {items.map((item) => (
              <Button
                key={item.id}
                variant={currentView === item.id ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start",
                  isCollapsed && "justify-center"
                )}
                onClick={() => setCurrentView(item.id)}
              >
                <item.icon className="mr-2 h-4 w-4" />
                {!isCollapsed && <span>{item.label}</span>}
              </Button>
            ))}
          </div>
        </ScrollArea>
      </div>
    </aside>
  );
};