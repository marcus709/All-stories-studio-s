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
          scene="https://prod.spline.design/b47b3f5b7727762a0d6ad2efe92792ae/scene.splinecode"
          onLoad={() => setIsLoading(false)}
          onError={handleSplineError}
          style={{ width: '100%', height: '100%' }}
        />
      </div>
      
      {/* Content Container */}
      <div className="relative z-40 container mx-auto px-8">
        {/* Empty container ready for new design */}
      </div>
    </div>
  );
};