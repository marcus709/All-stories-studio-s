
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { DashboardContent } from "@/components/dashboard/DashboardContent";
import { useState } from "react";

type View = "story" | "characters" | "plot" | "dream" | "ideas" | "docs" | "logic";

export default function Dashboard() {
  const [currentView, setCurrentView] = useState<View>("story");
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="flex">
      <DashboardSidebar
        currentView={currentView}
        setCurrentView={setCurrentView}
        isCollapsed={isCollapsed}
        onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
      />
      <main className={`flex-1 transition-all duration-200 ${isCollapsed ? 'ml-16' : 'ml-64'}`}>
        <DashboardContent currentView={currentView} />
      </main>
    </div>
  );
}
