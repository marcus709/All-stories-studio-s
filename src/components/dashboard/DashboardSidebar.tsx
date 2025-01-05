import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  Users,
  GitBranch,
  GitMerge, // Changed from GitFlow to GitMerge
  Lightbulb,
  FileText,
  Bug,
} from "lucide-react";
import { useStory } from "@/contexts/StoryContext";
import { StoriesDialog } from "../StoriesDialog";
import { useState } from "react";

export type View = "story" | "characters" | "plot" | "flow" | "ideas" | "docs" | "logic";

interface DashboardSidebarProps {
  currentView: View;
  setCurrentView: (view: View) => void;
}

export const DashboardSidebar = ({
  currentView,
  setCurrentView,
}: DashboardSidebarProps) => {
  const [isStoriesOpen, setIsStoriesOpen] = useState(false);
  const { selectedStory } = useStory();

  const navigation = [
    {
      name: "Story",
      icon: BookOpen,
      view: "story" as const,
    },
    {
      name: "Characters",
      icon: Users,
      view: "characters" as const,
    },
    {
      name: "Plot Development",
      icon: GitBranch,
      view: "plot" as const,
    },
    {
      name: "Story Flow",
      icon: GitMerge,
      view: "flow" as const,
    },
    {
      name: "Story Ideas",
      icon: Lightbulb,
      view: "ideas" as const,
    },
    {
      name: "Documentation",
      icon: FileText,
      view: "docs" as const,
    },
    {
      name: "Story Logic",
      icon: Bug,
      view: "logic" as const,
    },
  ];

  return (
    <>
      <div className="fixed inset-y-0 left-0 w-72 bg-white border-r pt-16">
        <div className="flex flex-col h-full">
          <div className="flex-1 flex flex-col gap-y-7">
            <div className="px-4 py-4 border-b">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => setIsStoriesOpen(true)}
              >
                <BookOpen className="mr-2 h-4 w-4" />
                {selectedStory?.title || "Select a Story"}
              </Button>
            </div>

            <nav className="flex-1 px-4">
              <ul role="list" className="flex flex-1 flex-col gap-1">
                {navigation.map((item) => (
                  <li key={item.name}>
                    <Button
                      variant="ghost"
                      className={cn(
                        "w-full justify-start",
                        currentView === item.view
                          ? "bg-violet-50 text-violet-600 hover:bg-violet-50 hover:text-violet-600"
                          : "text-gray-700 hover:bg-gray-50"
                      )}
                      onClick={() => setCurrentView(item.view)}
                    >
                      <item.icon className="mr-2 h-4 w-4" />
                      {item.name}
                    </Button>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
      </div>

      <StoriesDialog
        isOpen={isStoriesOpen}
        onOpenChange={setIsStoriesOpen}
      />
    </>
  );
};