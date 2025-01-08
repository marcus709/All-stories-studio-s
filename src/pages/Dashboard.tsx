import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { DashboardContent } from "@/components/dashboard/DashboardContent";
import { StoryProvider } from "@/contexts/StoryContext";
import { useSession } from "@supabase/auth-helpers-react";
import { useToast } from "@/hooks/use-toast";

type View = "story" | "characters" | "plot" | "dream" | "ideas" | "docs" | "logic";

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

  if (!session) {
    return null;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Header className="fixed top-0 left-0 right-0 z-50" />
      <DashboardSidebar currentView={currentView} setCurrentView={setCurrentView} />
      <main className="flex-1 overflow-hidden pt-16 pl-72">
        <DashboardContent currentView={currentView} />
      </main>
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