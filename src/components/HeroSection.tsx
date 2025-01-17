import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { useSession } from "@supabase/auth-helpers-react";
import { useToast } from "./ui/use-toast";

interface HeroSectionProps {
  onShowAuth?: (view: "signin" | "signup") => void;
}

export const HeroSection = ({ onShowAuth }: HeroSectionProps) => {
  const session = useSession();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleStartWriting = () => {
    if (session) {
      navigate("/dashboard");
    } else {
      if (onShowAuth) {
        onShowAuth("signup");
      } else {
        toast({
          title: "Authentication Required",
          description: "Please sign up to start writing.",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-6xl md:text-7xl font-bold mb-6 text-white leading-[1.1] tracking-tight">
            Transform your writing journey
          </h1>
          
          <p className="text-xl text-white/80 mb-10 mx-auto leading-relaxed">
            Create deeper characters, richer plots, and more engaging narratives with our AI-powered storytelling platform.
          </p>

          <Button 
            onClick={handleStartWriting}
            className="px-8 py-6 text-lg bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-full transition-all duration-300 hover:scale-105 backdrop-blur-sm"
          >
            Start Writing Now
          </Button>
        </div>
      </div>
    </div>
  );
};