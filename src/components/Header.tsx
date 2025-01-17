import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BookOpen, User } from "lucide-react";
import { AuthModals } from "./auth/AuthModals";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "./ui/use-toast";
import { useSession } from "@supabase/auth-helpers-react";
import { UserMenu } from "./header/UserMenu";
import { Profile } from "@/integrations/supabase/types/tables.types";
import { motion } from "framer-motion";

const transition = {
  type: "spring",
  mass: 0.5,
  damping: 11.5,
  stiffness: 100,
  restDelta: 0.001,
  restSpeed: 0.001,
};

export const Header = () => {
  const [showAuth, setShowAuth] = useState(false);
  const [authView, setAuthView] = useState<"signin" | "signup">("signin");
  const [profile, setProfile] = useState<Profile | null>(null);
  const [active, setActive] = useState<string | null>(null);
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

  const MenuItem = ({ item, onClick }: { item: string; onClick: () => void }) => {
    return (
      <div onMouseEnter={() => setActive(item)} className="relative">
        <motion.p
          transition={{ duration: 0.3 }}
          className="cursor-pointer text-white/80 hover:text-white"
          onClick={onClick}
        >
          {item}
        </motion.p>
      </div>
    );
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/30 backdrop-blur-md border-b border-white/5">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-6">
            <Link to="/" className="flex items-center space-x-2">
              <BookOpen className="h-5 w-5 text-white" />
              <span className="text-lg font-mono text-white">All Stories Studio</span>
            </Link>

            <nav className="flex items-center space-x-6">
              <MenuItem item="Features" onClick={() => scrollToSection('features')} />
              <MenuItem item="Pricing" onClick={() => scrollToSection('pricing')} />
              <MenuItem item="Dashboard" onClick={() => navigate('/dashboard')} />
              <MenuItem item="Community" onClick={handleCommunityClick} />
            </nav>
          </div>

          <UserMenu
            session={session}
            profile={profile}
            onSignOut={handleSignOut}
            onShowAuth={handleShowAuth}
          />
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