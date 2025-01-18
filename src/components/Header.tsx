import { Link } from "react-router-dom";
import { BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UserMenu } from "@/components/ui/UserMenu";
import { Navigation } from "@/components/ui/Navigation";
import { useSession } from "@supabase/auth-helpers-react";

export const Header = () => {
  const session = useSession();

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
          <UserMenu />
        ) : (
          <>
            <Button
              variant="ghost"
              className="text-white hover:text-white/90"
              onClick={() => onShowAuth("signin")}
            >
              Sign In
            </Button>
            <Button
              className="bg-pink-500 hover:bg-pink-600 text-white"
              onClick={() => onShowAuth("signup")}
            >
              Sign Up
            </Button>
          </>
        )}
      </div>
    </div>
  );
};
