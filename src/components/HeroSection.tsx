import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { useSession } from "@supabase/auth-helpers-react";
import { useToast } from "./ui/use-toast";
import { Sparkles } from "lucide-react";

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
    <section className="relative pt-20 md:pt-32 pb-12 md:pb-20 overflow-hidden px-4">
      <div className="container mx-auto relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-purple-50 border border-purple-100 mb-8 animate-fade-in">
            <Sparkles className="w-4 h-4 text-purple-600 mr-2" />
            <span className="text-xs md:text-sm text-purple-600 font-medium">
              Where Stories Come to Life - Join Our Creative Community
            </span>
          </div>
          
          <h1 className="text-4xl md:text-7xl font-bold mb-6 md:mb-8 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 animate-text px-4">
            Transform Your Writing Journey
          </h1>
          
          <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed animate-fade-in opacity-0 px-4" style={{ animationDelay: '300ms' }}>
            Create deeper characters, richer plots, and more engaging narratives with our AI-powered storytelling platform.
          </p>
          
          <Button 
            size="lg"
            onClick={handleStartWriting}
            className="relative group px-6 md:px-8 py-4 md:py-6 mb-8 md:mb-12 overflow-hidden rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-xl transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 hover:scale-105 hover:from-purple-500 hover:to-pink-500 w-full md:w-auto"
          >
            <span className="relative z-10 text-base md:text-lg font-medium">
              Start Writing Now
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </Button>
          
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 animate-fade-in opacity-0" style={{ animationDelay: '600ms' }}>
            <Button 
              size="lg"
              variant="outline"
              onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-6 md:px-8 py-4 md:py-6 rounded-full text-base md:text-lg hover:bg-purple-50 transition-colors duration-300 w-full md:w-auto"
            >
              Explore Features
            </Button>
          </div>
          
          <div className="mt-12 md:mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-3xl mx-auto text-center animate-fade-in opacity-0 px-4" style={{ animationDelay: '900ms' }}>
            {[
              { label: 'Active Writers', value: '10,000+' },
              { label: 'Stories Created', value: '50,000+' },
              { label: 'AI Suggestions', value: '1M+' }
            ].map((stat, index) => (
              <div key={stat.label} className="space-y-2">
                <div className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">
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