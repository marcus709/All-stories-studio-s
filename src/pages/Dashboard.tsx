import { useState } from "react";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { DashboardContent, View } from "@/components/dashboard/DashboardContent";

export const Dashboard = () => {
  const [currentView, setCurrentView] = useState<View>("story");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <DashboardSidebar
        currentView={currentView}
        setCurrentView={setCurrentView}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />
      
      <main className={`flex-1 ${isSidebarCollapsed ? 'ml-12' : 'ml-72'}`}>
        <DashboardContent currentView={currentView} />
      </main>
    </div>
  );
};

// Add default export to fix the Routes.tsx import
export default Dashboard;