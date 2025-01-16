import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { useSession } from "@supabase/auth-helpers-react";
import { useToast } from "./ui/use-toast";
import { AuroraBackground } from "./ui/aurora-background";

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
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/50 to-black/20 z-0" />
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 pt-32 pb-20">
        <div className="max-w-4xl mx-auto">
          {/* Icon grid (decorative) */}
          <div className="grid grid-cols-7 gap-4 mb-16 opacity-20 max-w-xs">
            {Array.from({ length: 21 }).map((_, i) => (
              <div key={i} className="w-8 h-8 rounded-lg border border-gray-700" />
            ))}
          </div>

          {/* Main heading */}
          <h1 className="text-7xl md:text-8xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-[#ea384c] to-[#ea384c]/80 leading-tight">
            Transform your writing journey
          </h1>
          
          <p className="text-xl text-gray-400 mb-12 max-w-2xl leading-relaxed">
            Create deeper characters, richer plots, and more engaging narratives with our AI-powered storytelling platform.
          </p>

          {/* CTA Button */}
          <Button 
            onClick={handleStartWriting}
            className="px-8 py-6 text-lg bg-[#ea384c] hover:bg-[#ea384c]/90 text-white rounded-full transition-all duration-300 hover:scale-105"
          >
            Start Writing Now
          </Button>

          {/* Updated date */}
          <div className="mt-16 text-sm text-gray-500">
            Updated {new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
          </div>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute bottom-10 right-10 bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 hidden lg:block">
        <div className="text-6xl font-mono text-gray-300">
          AaBbCc
          <br />
          &?!.0123
        </div>
      </div>
    </div>
  );
};