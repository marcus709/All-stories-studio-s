import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import {
  BookOpen,
  Users,
  PanelLeft,
  Home,
  BookText,
  Brain,
  Wand2,
  Scale,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface DashboardSidebarProps {
  currentView: string;
  setCurrentView: (view: string) => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export const DashboardSidebar = ({
  currentView,
  setCurrentView,
  isCollapsed = false,
  onToggleCollapse,
}: DashboardSidebarProps) => {
  const [showTooltip, setShowTooltip] = useState(false);

  const items = [
    { id: "home", label: "Home", icon: Home, path: "/dashboard" },
    { id: "story", label: "Story", icon: BookOpen, path: "/dashboard/story" },
    { id: "characters", label: "Characters", icon: Users, path: "/dashboard/characters" },
    { id: "plot", label: "Plot", icon: BookText, path: "/dashboard/plot" },
    { id: "dream", label: "Dream to Story", icon: Brain, path: "/dashboard/dream" },
    { 
      id: "ideas", 
      label: "World Builder", 
      icon: Wand2, 
      path: "/dashboard/ideas",
      comingSoon: true 
    },
    { 
      id: "docs", 
      label: "Formatting", 
      icon: Scale, 
      path: "/dashboard/docs",
      comingSoon: true 
    },
  ];

  return (
    <TooltipProvider>
      <div
        className={cn(
          "fixed left-0 top-0 z-20 flex h-screen w-72 flex-col border-r bg-background pt-16 transition-all duration-300",
          isCollapsed && "w-12"
        )}
      >
        <div className="flex items-center justify-end border-b px-2 py-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleCollapse}
            className="h-7 w-7"
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
            {items.map((item) => (
              <Tooltip key={item.id}>
                <TooltipTrigger asChild>
                  <Link
                    to={item.comingSoon ? "#" : item.path}
                    onClick={(e) => {
                      if (item.comingSoon) {
                        e.preventDefault();
                      }
                    }}
                  >
                    <Button
                      variant={currentView === item.id ? "secondary" : "ghost"}
                      className={cn(
                        "w-full justify-start",
                        item.comingSoon && "opacity-50 cursor-not-allowed"
                      )}
                      disabled={item.comingSoon}
                    >
                      <item.icon className="mr-2 h-4 w-4" />
                      {!isCollapsed && (
                        <>
                          <span>{item.label}</span>
                          {item.comingSoon && (
                            <Badge variant="outline" className="ml-auto">
                              Coming Soon
                            </Badge>
                          )}
                        </>
                      )}
                    </Button>
                  </Link>
                </TooltipTrigger>
                {isCollapsed && (
                  <TooltipContent side="right">
                    <p>{item.label}</p>
                    {item.comingSoon && <p className="text-xs">Coming Soon</p>}
                  </TooltipContent>
                )}
              </Tooltip>
            ))}
          </div>
        </ScrollArea>
      </div>
    </TooltipProvider>
  );
};