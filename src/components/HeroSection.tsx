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

  return (
    <div className="relative h-screen flex items-center overflow-hidden">
      {/* Loading State */}
      {isLoading && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-black">
          <div className="text-white">Loading 3D Scene...</div>
        </div>
      )}
      
      {/* Background Scene */}
      <div className="absolute inset-0 z-0">
        <iframe 
          src='https://my.spline.design/theshipwreck-b47b3f5b7727762a0d6ad2efe92792ae/' 
          frameBorder='0' 
          width='100%' 
          height='100%'
          onLoad={() => setIsLoading(false)}
          title="3D Scene Background"
        />
      </div>
      
      {/* Content Container */}
      <div className="relative z-10 container mx-auto px-8">
        {/* Empty container ready for new design */}
      </div>
    </div>
  );
};
