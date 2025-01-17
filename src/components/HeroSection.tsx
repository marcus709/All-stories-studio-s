import { useNavigate } from "react-router-dom";
import { useSession } from "@supabase/auth-helpers-react";
import { useToast } from "./ui/use-toast";

interface HeroSectionProps {
  onShowAuth?: (view: "signin" | "signup") => void;
}

export const HeroSection = ({ onShowAuth }: HeroSectionProps) => {
  const session = useSession();
  const navigate = useNavigate();
  const { toast } = useToast();

  return (
    <div className="relative h-screen flex items-center overflow-hidden">
      {/* Background Pattern */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none opacity-10" />
      
      {/* Content Container */}
      <div className="relative z-10 container mx-auto px-8">
        {/* Empty container ready for new design */}
      </div>
    </div>
  );
};
