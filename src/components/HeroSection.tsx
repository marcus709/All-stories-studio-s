import { useNavigate } from "react-router-dom";
import { useSession } from "@supabase/auth-helpers-react";
import { useToast } from "./ui/use-toast";
import { useState } from "react";
import Spline from '@splinetool/react-spline';

interface HeroSectionProps {
  onShowAuth?: (view: "signin" | "signup") => void;
}

export const HeroSection = ({ onShowAuth }: HeroSectionProps) => {
  const session = useSession();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);

  const handleSplineError = () => {
    setIsLoading(false);
    toast({
      title: "Error",
      description: "Failed to load 3D scene. Please refresh the page.",
      variant: "destructive",
    });
  };

  return (
    <div className="relative h-[90vh] w-full flex items-center justify-center overflow-hidden bg-black">
      {/* Loading State */}
      {isLoading && (
        <div className="absolute inset-0 z-50 flex items-center justify-center">
          <div className="text-white text-xl">Loading 3D Scene...</div>
        </div>
      )}
      
      {/* Background Scene */}
      <div className="absolute inset-0 w-full h-full">
        <Spline
          scene="https://my.spline.design/theshipwreck-b47b3f5b7727762a0d6ad2efe92792ae/"
          onLoad={() => setIsLoading(false)}
          onError={handleSplineError}
          style={{ width: '100%', height: '100%' }}
        />
      </div>
      
      {/* Content Container */}
      <div className="relative z-40 container mx-auto px-8 text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 drop-shadow-lg">
          Craft Your Story
        </h1>
        <p className="text-xl md:text-2xl text-gray-200 mb-8 max-w-2xl mx-auto drop-shadow-lg">
          Transform your ideas into captivating narratives with our AI-powered writing assistant
        </p>
        <button
          onClick={() => onShowAuth?.("signup")}
          className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-8 rounded-lg transition-colors"
        >
          Get Started
        </button>
      </div>
    </div>
  );
};