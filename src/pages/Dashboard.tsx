import { useState } from "react";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { DashboardContent, View } from "@/components/dashboard/DashboardContent";

export const Dashboard = () => {
  const [currentView, setCurrentView] = useState<View>("story");

  return (
    <div className="flex h-screen pt-16"> {/* Added pt-16 for navbar height */}
      <aside className="w-64 border-r bg-white">
        <DashboardSidebar
          currentView={currentView}
          onViewChange={setCurrentView}
        />
      </aside>
      <main className="flex-1 overflow-auto bg-gray-50">
        <DashboardContent currentView={currentView} />
      </main>
    </div>
  );
};

// Add default export to fix the Routes.tsx import
export default Dashboard;