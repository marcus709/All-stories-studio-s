import { useNavigate } from "react-router-dom";
import { useSession } from "@supabase/auth-helpers-react";
import { useToast } from "./ui/use-toast";
import Spline from '@splinetool/react-spline';

interface HeroSectionProps {
  onShowAuth?: (view: "signin" | "signup") => void;
}

export const HeroSection = ({ onShowAuth }: HeroSectionProps) => {
  const session = useSession();
  const navigate = useNavigate();
  const { toast } = useToast();

  return (
    <div className="relative h-screen flex items-center overflow-hidden">
      {/* Spline Background */}
      <div className="absolute inset-0 z-0">
        <Spline 
          scene="https://my.spline.design/theshipwreck-b47b3f5b7727762a0d6ad2efe92792ae/" 
          className="w-full h-full"
        />
      </div>
      
      {/* Content Container */}
      <div className="relative z-10 container mx-auto px-8">
        {/* Empty container ready for new design */}
      </div>
    </div>
  );
};