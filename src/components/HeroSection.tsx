import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { useSession } from "@supabase/auth-helpers-react";
import { useToast } from "./ui/use-toast";
import Spline from '@splinetool/react-spline';
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

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Spline Scene Background */}
      <div className="absolute inset-0 w-full h-full z-0">
        {!splineError ? (
          <Spline
            scene="https://prod.spline.design/27777570ee9ed2811d5f6419b01d90b4/scene.splinecode"
            onError={() => setSplineError(true)}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-black via-purple-900 to-black" />
        )}
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center">
          {/* Main heading */}
          <h1 className="text-6xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70 leading-[1.1] tracking-tight">
            Transform your writing journey
          </h1>
          
          <p className="text-xl text-white/90 mb-10 mx-auto leading-relaxed">
            Create deeper characters, richer plots, and more engaging narratives with our AI-powered storytelling platform.
          </p>

          {/* CTA Button */}
          <Button 
            onClick={handleStartWriting}
            className="px-8 py-6 text-lg bg-white hover:bg-white/90 text-black rounded-full transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-white/20"
          >
            Start Writing Now
          </Button>
        </div>
      </div>
    </div>
  );
};