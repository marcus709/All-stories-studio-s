import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { BookOpen, User } from "lucide-react";
import { AuthModals } from "./auth/AuthModals";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "./ui/use-toast";

export const Header = () => {
  const [showAuth, setShowAuth] = useState(false);
  const [authView, setAuthView] = useState<"signin" | "signup">("signin");
  const { toast } = useToast();

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "You have been signed out successfully.",
      });
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-sm border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <BookOpen className="h-6 w-6 text-purple-600" />
            <span className="text-xl font-bold">All Stories Studio</span>
          </Link>
          
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/features" className="text-gray-600 hover:text-gray-900">Features</Link>
            <Link to="/pricing" className="text-gray-600 hover:text-gray-900">Pricing</Link>
            <Link to="/dashboard" className="text-gray-600 hover:text-gray-900">Dashboard</Link>
            <Link to="/community" className="text-gray-600 hover:text-gray-900">Community</Link>
          </nav>

          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost"
              onClick={() => {
                setAuthView("signin");
                setShowAuth(true);
              }}
            >
              Sign In
            </Button>
            <Button 
              className="bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600"
              onClick={() => {
                setAuthView("signup");
                setShowAuth(true);
              }}
            >
              Sign Up
            </Button>
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