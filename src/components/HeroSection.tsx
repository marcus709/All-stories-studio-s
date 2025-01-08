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
    <section className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center pt-16 md:pt-32 pb-12 md:pb-20 overflow-hidden px-4">
      <div className="container mx-auto relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-purple-50 border border-purple-100 mb-8 animate-fade-in max-w-full overflow-x-auto">
            <Sparkles className="w-4 h-4 text-purple-600 mr-2 flex-shrink-0" />
            <span className="text-xs md:text-sm text-purple-600 font-medium whitespace-nowrap">
              Where Stories Come to Life - Join Our Creative Community
            </span>
          </div>
          
          <h1 className="text-3xl sm:text-4xl md:text-7xl font-bold mb-6 md:mb-8 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 animate-text px-4">
            Transform Your Writing Journey
          </h1>
          
          <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed animate-fade-in opacity-0 px-4" style={{ animationDelay: '300ms' }}>
            Create deeper characters, richer plots, and more engaging narratives with our AI-powered storytelling platform.
          </p>
          
          <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row items-center justify-center sm:space-x-4 px-4">
            <Button 
              size="lg"
              onClick={handleStartWriting}
              className="relative group w-full sm:w-auto px-6 md:px-8 py-4 md:py-6 overflow-hidden rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-xl transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 hover:scale-105 hover:from-purple-500 hover:to-pink-500"
            >
              <span className="relative z-10 text-base md:text-lg font-medium">
                Start Writing Now
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </Button>
            
            <Button 
              size="lg"
              variant="outline"
              onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
              className="w-full sm:w-auto px-6 md:px-8 py-4 md:py-6 rounded-full text-base md:text-lg hover:bg-purple-50 transition-colors duration-300"
            >
              Explore Features
            </Button>
          </div>
          
          <div className="mt-12 md:mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-8 max-w-3xl mx-auto text-center animate-fade-in opacity-0 px-4" style={{ animationDelay: '900ms' }}>
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