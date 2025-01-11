import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
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
      
      const profileData: Profile = {
        id: data.id,
        username: data.username,
        avatar_url: data.avatar_url,
        bio: data.bio,
        genres: data.genres || null,
        skills: data.skills || null,
        pinned_work: data.pinned_work || null,
        social_links: data.social_links || null
      };
      
      setProfile(profileData);
    } catch (error) {
      console.error("Error in fetchProfile:", error);
    }
  };

  const handleSignOut = async () => {
    try {
      // First, clear local data
      localStorage.clear();
      
      // Attempt to sign out from Supabase
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

      // Force a page refresh to clear any remaining state
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
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-sm border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <BookOpen className="h-6 w-6 text-purple-600" />
            <span className="text-xl font-bold">All Stories Studio</span>
          </Link>

          <div className="flex items-center space-x-6">
            <Navigation 
              onScrollToSection={scrollToSection}
              onCommunityClick={handleCommunityClick}
            />
            <UserMenu
              session={session}
              profile={profile}
              onSignOut={handleSignOut}
              onShowAuth={handleShowAuth}
            />
          </div>
        </div>
      </div>

      <AuthModals
        isOpen={showAuth}
        onClose={() => setShowAuth(false)}
        defaultView={authView}
      />
    </header>
  );
};
