import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { DashboardContent } from "@/components/dashboard/DashboardContent";
import { StoryProvider } from "@/contexts/StoryContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

type View = "story" | "characters" | "plot" | "flow" | "ideas" | "docs";

function DashboardLayout() {
  const [currentView, setCurrentView] = useState<View>("story");
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast({
          title: "Authentication Required",
          description: "Please sign in to access the dashboard.",
        });
        navigate("/");
      }
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT" || !session) {
        navigate("/");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate, toast]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <DashboardSidebar currentView={currentView} setCurrentView={setCurrentView} />
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