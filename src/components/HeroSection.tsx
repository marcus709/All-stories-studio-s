import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { useSession } from "@supabase/auth-helpers-react";
import { useToast } from "./ui/use-toast";
import { useState } from "react";

interface HeroSectionProps {
  onShowAuth?: (view: "signin" | "signup") => void;
}

export const HeroSection = ({ onShowAuth }: HeroSectionProps) => {
  const session = useSession();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [splineError, setSplineError] = useState(false);

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

  const handleSplineError = () => {
    console.log('Spline scene failed to load');
    setSplineError(true);
  };

  return (
    <div className="relative min-h-screen flex items-center overflow-hidden">
      {/* Spline Scene Background */}
      <div className="fixed inset-0 w-full h-full">
        {!splineError ? (
          <iframe 
            src='https://my.spline.design/retrofuturismbganimation-27777570ee9ed2811d5f6419b01d90b4/' 
            frameBorder='0' 
            width='100%' 
            height='100%'
            className="w-full h-full"
            onError={handleSplineError}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-black via-purple-900 to-black" />
        )}
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-8">
        <div className="max-w-2xl text-left">
          {/* Main heading */}
          <h1 className="text-5xl md:text-6xl font-medium mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-200 via-white to-purple-200 font-['Space_Mono'] leading-[1.1] tracking-tight">
            Write Your Story
          </h1>
          
          <p className="text-lg md:text-xl text-purple-100/80 mb-8 font-['Instagram_Sans_Draft'] leading-relaxed max-w-xl">
            Create deeper characters, richer plots, and more engaging narratives with our AI-powered storytelling platform.
          </p>

          {/* CTA Button */}
          <Button 
            onClick={handleStartWriting}
            className="px-8 py-6 text-base bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white border border-white/20 rounded-full transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/20 group"
          >
            <span className="bg-gradient-to-r from-purple-200 to-white bg-clip-text text-transparent group-hover:text-white transition-colors font-['Instagram_Sans_Draft']">
              Start Writing Now
            </span>
          </Button>
        </div>
      </div>
    </div>
  );
};