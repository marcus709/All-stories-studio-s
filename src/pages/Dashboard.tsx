import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { DashboardContent } from "@/components/dashboard/DashboardContent";
import { StoryProvider } from "@/contexts/StoryContext";
import { useSession } from "@supabase/auth-helpers-react";
import { useToast } from "@/components/ui/use-toast";

type View = "story" | "characters" | "plot" | "flow" | "ideas" | "docs" | "logic";

function DashboardLayout() {
  const [currentView, setCurrentView] = useState<View>("story");
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

  // Don't render anything while checking session
  if (!session) {
    return null;
  }

  const handleViewChange = (view: View) => {
    setCurrentView(view);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <DashboardSidebar currentView={currentView} setCurrentView={handleViewChange} />
      <div className="ml-72 pt-16">
        <DashboardContent currentView={currentView} />
      </div>
    </div>
  );
}

export const Dashboard = () => {
  return (
    <StoryProvider>
      <DashboardLayout />
    </StoryProvider>
  );
};

export default Dashboard;