import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { useSession } from "@supabase/auth-helpers-react";
import { useToast } from "./ui/use-toast";
import { ArrowRight } from "lucide-react";

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
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black text-white">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-zinc-900 to-black" />
      
      <div className="container mx-auto px-4 relative z-10 py-32">
        <div className="max-w-5xl mx-auto text-center space-y-8">
          <h1 className="text-7xl md:text-8xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-500 animate-text">
            Write Your Story.
            <br />
            Make it Legendary.
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-400 max-w-2xl mx-auto leading-relaxed animate-fade-in opacity-0" 
             style={{ animationDelay: '300ms' }}>
            Craft deeper characters, richer plots, and more engaging narratives with our AI-powered storytelling platform.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-8 animate-fade-in opacity-0"
               style={{ animationDelay: '600ms' }}>
            <Button 
              size="lg"
              onClick={handleStartWriting}
              className="relative group px-8 py-6 overflow-hidden rounded-full bg-white text-black hover:bg-gray-100 transition-all duration-300"
            >
              <span className="relative z-10 text-lg font-medium flex items-center gap-2">
                Start Writing Now
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </Button>
            
            <Button 
              variant="outline"
              size="lg"
              onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-8 py-6 rounded-full text-lg border-white/20 hover:bg-white/10 transition-colors duration-300"
            >
              Explore Features
            </Button>
          </div>
          
          <div className="grid grid-cols-3 gap-8 max-w-3xl mx-auto pt-24 animate-fade-in opacity-0 border-t border-white/10"
               style={{ animationDelay: '900ms' }}>
            {[
              { label: 'Active Writers', value: '10,000+' },
              { label: 'Stories Created', value: '50,000+' },
              { label: 'AI Suggestions', value: '1M+' }
            ].map((stat) => (
              <div key={stat.label} className="space-y-2">
                <div className="text-3xl font-bold text-white">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};