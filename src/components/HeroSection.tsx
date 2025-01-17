import { useNavigate } from "react-router-dom";
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
  const [isLoading, setIsLoading] = useState(true);

  const handleIframeError = () => {
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
        <iframe 
          src="https://my.spline.design/theshipwreck-b47b3f5b7727762a0d6ad2efe92792ae/"
          frameBorder="0" 
          width="100%" 
          height="100%"
          onLoad={() => setIsLoading(false)}
          onError={handleIframeError}
          title="3D Scene Background"
          className="w-full h-full"
          style={{ 
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0
          }}
        />
      </div>
      
      {/* Content Container */}
      <div className="relative z-40 container mx-auto px-8">
        {/* Empty container ready for new design */}
      </div>
    </div>
  );
};