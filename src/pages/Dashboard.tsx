import { useState } from "react";
import { DashboardContent } from "@/components/dashboard/DashboardContent";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import type { View } from "@/types/story";

export default function Dashboard() {
  const [currentView, setCurrentView] = useState<View>("stories");
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleToggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className="flex h-screen">
      <DashboardSidebar 
        currentView={currentView} 
        setCurrentView={setCurrentView}
        isCollapsed={isCollapsed}
        onToggleCollapse={handleToggleCollapse}
      />
      <DashboardContent view={currentView} />
    </div>
  );
}