import { useState } from "react";
import { Link } from "react-router-dom";
import { BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
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
  const session = useSession();

  const handleShowAuth = (view: "signin" | "signup") => {
    setAuthView(view);
    setShowAuth(true);
  };

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      toast({
        title: "Success",
        description: "You have been signed out successfully.",
      });
    } catch (error) {
      console.error("Error signing out:", error);
      toast({
        title: "Error",
        description: "There was a problem signing out.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 h-20 bg-black/20 backdrop-blur-[2px]">
      <div className="flex items-center space-x-12">
        <Link to="/" className="flex items-center space-x-3">
          <BookOpen className="h-6 w-6 text-white" />
          <span className="text-xl font-semibold text-white">All Stories Studio</span>
        </Link>
        <Navigation />
      </div>

      <div className="flex items-center space-x-4">
        {session ? (
          <UserMenu 
            session={session}
            profile={profile}
            onSignOut={handleSignOut}
            onShowAuth={handleShowAuth}
          />
        ) : (
          <>
            <Button
              variant="ghost"
              className="text-white hover:text-white/90"
              onClick={() => handleShowAuth("signin")}
            >
              Sign In
            </Button>
            <Button
              className="bg-pink-500 hover:bg-pink-600 text-white"
              onClick={() => handleShowAuth("signup")}
            >
              Sign Up
            </Button>
          </>
        )}
      </div>

      <AuthModals
        isOpen={showAuth}
        onClose={() => setShowAuth(false)}
        defaultView={authView}
      />
    </div>
  );
};