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
    <section className="relative pt-32 pb-16 overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-6xl md:text-7xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600">
            Unleash Your Story's Full Potential
          </h1>
          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
            Transform your writing with AI-powered storytelling tools. Create deeper characters,
            richer plots, and more engaging narratives.
          </p>
          <Button 
            size="lg"
            onClick={handleStartWriting}
            className="relative group px-8 py-6 overflow-hidden rounded-full bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 text-white shadow-xl transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
          >
            <span className="relative z-10 text-lg font-medium">
              Start Writing Now →
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-orange-600 via-pink-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </Button>
        </div>
      </div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(147,51,234,0.1),transparent_70%),radial-gradient(circle_at_bottom_left,rgba(236,72,153,0.1),transparent_70%)]" />
    </section>
  );
};