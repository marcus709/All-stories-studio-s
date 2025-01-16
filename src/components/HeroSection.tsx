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
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-zinc-900 to-black z-0" />
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 pt-40 pb-20">
        <div className="max-w-5xl mx-auto">
          {/* Icon grid (decorative) */}
          <div className="grid grid-cols-7 gap-3 mb-12 opacity-20 max-w-[280px]">
            {Array.from({ length: 21 }).map((_, i) => (
              <div key={i} className="w-6 h-6 rounded-lg border border-gray-700" />
            ))}
          </div>

          {/* Main heading */}
          <h1 className="text-8xl md:text-9xl font-bold mb-10 bg-clip-text text-transparent bg-gradient-to-r from-[#ea384c] via-[#ea384c]/90 to-[#ea384c]/70 leading-[1.1] tracking-tight">
            Transform your writing journey
          </h1>
          
          <p className="text-2xl text-gray-400 mb-14 max-w-2xl leading-relaxed ml-1">
            Create deeper characters, richer plots, and more engaging narratives with our AI-powered storytelling platform.
          </p>

          {/* CTA Button */}
          <Button 
            onClick={handleStartWriting}
            className="px-10 py-8 text-xl bg-[#ea384c] hover:bg-[#ea384c]/90 text-white rounded-full transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-[#ea384c]/20"
          >
            Start Writing Now
          </Button>

          {/* Updated date */}
          <div className="mt-20 text-sm text-gray-500 ml-1">
            Updated {new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
          </div>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute bottom-20 right-20 bg-gray-800/50 backdrop-blur-sm rounded-xl p-8 hidden lg:block">
        <div className="text-7xl font-mono text-gray-300">
          AaBbCc
          <br />
          &?!.0123
        </div>
      </div>
    </div>
  );
};