import { useState, useEffect } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import { Header } from "@/components/Header";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { DashboardContent } from "@/components/dashboard/DashboardContent";
import { StoryProvider } from "@/contexts/StoryContext";
import { useSession } from "@supabase/auth-helpers-react";
import { useToast } from "@/hooks/use-toast";

type View = "story" | "characters" | "plot" | "dream" | "ideas" | "docs" | "logic";

function DashboardLayout() {
  const [currentView, setCurrentView] = useState<View>("story");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const session = useSession();

  useEffect(() => {
    if (!session) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to access the dashboard.",
      });
      navigate("/");
    }
  }, [session, navigate, toast]);

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <DashboardSidebar 
        currentView={currentView} 
        setCurrentView={setCurrentView}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />
      <div className={`pt-16 transition-all duration-300 ${isSidebarCollapsed ? 'ml-12' : 'ml-72'}`}>
        <Outlet />
        {!window.location.pathname.includes("/dashboard/") && (
          <DashboardContent currentView={currentView} />
        )}
      </div>
    </div>
  );
}

export default function Dashboard() {
  return (
    <StoryProvider>
      <DashboardLayout />
    </StoryProvider>
  );
}