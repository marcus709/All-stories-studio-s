import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { useSession } from "@supabase/auth-helpers-react";
import { useToast } from "./ui/use-toast";
import { ChevronDown } from "lucide-react";

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
      {/* Background overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black pointer-events-none" />

      <div className="container mx-auto px-4 pt-32 pb-20 relative z-10">
        <div className="max-w-5xl mx-auto">
          <div className="space-y-8 text-center">
            <h1 className="hero-title">
              Story Creator
              <br />
              <span className="hero-subtitle">&amp; Writer</span>
            </h1>
            
            <p className="hero-description max-w-2xl mx-auto">
              Premium story creation tools and AI-powered writing assistance
              to help your stories come to life.
            </p>
            
            <div className="pt-8">
              <Button 
                onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                variant="ghost"
                className="rounded-full border border-[#E5DDD3]/20 text-[#E5DDD3] hover:bg-[#E5DDD3]/10"
              >
                <span className="mr-2">MY SERVICES</span>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Partner logos */}
          <div className="mt-32 grid grid-cols-2 md:grid-cols-6 gap-8 items-center opacity-50">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="flex items-center justify-center">
                <div className="w-24 h-8 bg-[#E5DDD3]/10 rounded" />
              </div>
            ))}
          </div>

          {/* Service cards */}
          <div className="mt-32 grid md:grid-cols-3 gap-8">
            {[
              { number: "01", title: "STORY CREATION", description: "Create compelling narratives with our intuitive story development tools." },
              { number: "02", title: "CHARACTER DEVELOPMENT", description: "Build deep, realistic characters with AI-powered assistance." },
              { number: "03", title: "PLOT & STRUCTURE", description: "Organize and perfect your story's structure with advanced plotting tools." }
            ].map((service) => (
              <div key={service.number} className="p-8 border border-[#E5DDD3]/10 rounded-lg bg-black/50 backdrop-blur-sm">
                <div className="text-sm text-[#E5DDD3]/50 mb-4">{service.number}</div>
                <h3 className="text-[#E5DDD3] text-lg font-medium mb-4">{service.title}</h3>
                <p className="text-[#E5DDD3]/70 text-sm leading-relaxed">{service.description}</p>
                <Button 
                  variant="ghost" 
                  className="mt-6 text-[#E5DDD3]/50 hover:text-[#E5DDD3] hover:bg-transparent p-0 h-auto"
                >
                  Learn More →
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};