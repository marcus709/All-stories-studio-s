import { useState } from "react";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { DashboardContent } from "@/components/dashboard/DashboardContent";
import { StoryProvider } from "@/contexts/StoryContext";
import { useToast } from "@/hooks/use-toast";
import { StudioAssistant } from "@/components/ai/StudioAssistant";

type View = "story" | "characters" | "plot" | "dream" | "docs" | "logic";

function DashboardLayout() {
  const [currentView, setCurrentView] = useState<View>("story");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <StoryProvider>
      <div className="flex h-[calc(100vh-4rem)]">
        <DashboardSidebar
          currentView={currentView}
          setCurrentView={setCurrentView}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        />
        <main className="flex-1 overflow-hidden">
          <DashboardContent currentView={currentView} />
        </main>
        <StudioAssistant />
      </div>
    </StoryProvider>
  );
}

export default DashboardLayout;