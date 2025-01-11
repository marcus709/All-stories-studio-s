import { Link } from "react-router-dom";
import { Navigation } from "./header/Navigation";
import { UserMenu } from "./header/UserMenu";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import type { Profile } from "@/integrations/supabase/types";

export function Header() {
  const { session, signOut, showAuth } = useAuth();
  const { profile } = useProfile();

  const handleSignOut = async () => {
    await signOut();
  };

  const handleShowAuth = (view: "signin" | "signup") => {
    showAuth(view);
  };

  const handleScrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleCommunityClick = () => {
    // Handle community click logic here
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <Link to="/" className="mr-6 flex items-center space-x-2">
          <span className="hidden font-bold sm:inline-block">
            Lovable
          </span>
        </Link>
        <Navigation 
          onScrollToSection={handleScrollToSection}
          onCommunityClick={handleCommunityClick}
        />
        <div className="flex flex-1 items-center justify-end space-x-4">
          <UserMenu
            session={session}
            profile={profile}
            onSignOut={handleSignOut}
            onShowAuth={handleShowAuth}
          />
        </div>
      </div>
    </header>
  );
}
