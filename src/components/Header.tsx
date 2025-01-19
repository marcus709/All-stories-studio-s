import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { BookOpen } from "lucide-react";
import { AuthModals } from "./auth/AuthModals";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "./ui/use-toast";
import { useSession } from "@supabase/auth-helpers-react";
import { Navigation } from "./header/Navigation";
import { UserMenu } from "./header/UserMenu";
import { Profile } from "@/integrations/supabase/types/tables.types";

export const Header = () => {
  const [showAuth, setShowAuth] = useState(false);
  const [authView, setAuthView] = useState<"signin" | "signup">("signin");
  const [profile, setProfile] = useState<Profile | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  const session = useSession();
  const location = useLocation();

  // Determine if we're on the landing page
  const isLandingPage = location.pathname === '/';

  useEffect(() => {
    if (session?.user) {
      fetchProfile(session.user.id);
    } else {
      setProfile(null);
    }
  }, [session]);

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select()
        .eq("id", userId)
        .maybeSingle();

      if (error) {
        console.error("Error fetching profile:", error);
        return;
      }
      
      setProfile(data);
    } catch (error) {
      console.error("Error in fetchProfile:", error);
    }
  };

  const handleSignOut = async () => {
    try {
      localStorage.clear();
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error("Error during sign out:", error);
        toast({
          title: "Warning",
          description: "Sign out completed with some warnings. Please refresh the page.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success",
          description: "You have been signed out successfully.",
        });
      }
      window.location.href = '/';
    } catch (error) {
      console.error("Unexpected error during sign out:", error);
      window.location.href = '/';
    }
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleCommunityClick = () => {
    if (!session) {
      setAuthView("signin");
      setShowAuth(true);
      toast({
        title: "Authentication Required",
        description: "Please sign in to access the community.",
      });
      return;
    }
    navigate("/community");
  };

  const handleShowAuth = (view: "signin" | "signup") => {
    setAuthView(view);
    setShowAuth(true);
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 h-16">
      <div className="flex items-center space-x-12">
        <Link to="/" className="flex items-center space-x-2">
          <BookOpen className={`h-5 w-5 ${isLandingPage ? 'text-white' : 'text-black'}`} />
          <span className={`text-lg font-mono ${isLandingPage ? 'text-white' : 'text-black'}`}>All Stories Studio</span>
        </Link>

        <Navigation 
          onScrollToSection={scrollToSection}
          onCommunityClick={handleCommunityClick}
        />
      </div>

      <UserMenu
        session={session}
        profile={profile}
        onSignOut={handleSignOut}
        onShowAuth={handleShowAuth}
      />

      <AuthModals
        isOpen={showAuth}
        onClose={() => setShowAuth(false)}
        defaultView={authView}
      />
    </div>
  );
};