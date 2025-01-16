import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { useSession } from "@supabase/auth-helpers-react";
import { useToast } from "./ui/use-toast";
import { Sparkles } from "lucide-react";
import { AuroraBackground } from "./ui/aurora-background";

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
    <div className="min-h-screen bg-[#0A0118] flex flex-col items-center justify-center relative overflow-hidden">
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0A0118]/50 to-[#0A0118]" />
      
      {/* Content */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8 backdrop-blur-sm">
            <Sparkles className="w-4 h-4 text-purple-300 mr-2" />
            <span className="text-sm text-purple-200 font-medium">
              Welcome to Our Platform
            </span>
          </div>
          
          <h1 className="text-6xl md:text-7xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-white via-purple-200 to-pink-200">
            Transform your ideas into beautiful digital experiences
          </h1>
          
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
            Transform your ideas into reality with our comprehensive suite of development tools and resources.
          </p>
          
          <Button 
            size="lg"
            onClick={handleStartWriting}
            className="relative group px-8 py-6 overflow-hidden rounded-full bg-gradient-to-r from-purple-600/80 to-pink-600/80 text-white shadow-xl transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 hover:scale-105 hover:from-purple-500/90 hover:to-pink-500/90 backdrop-blur-sm"
          >
            <span className="relative z-10 text-lg font-medium">
              Get Started
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-pink-600/80 to-purple-600/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </Button>
          
          <div className="mt-16 grid grid-cols-3 gap-8 max-w-3xl mx-auto text-center">
            {[
              { label: 'Active Writers', value: '10,000+' },
              { label: 'Stories Created', value: '50,000+' },
              { label: 'AI Suggestions', value: '1M+' }
            ].map((stat, index) => (
              <div key={stat.label} className="space-y-2">
                <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-pink-300">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Background decorative elements */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
      <div className="absolute top-0 right-0 -translate-y-1/4">
        <div className="w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-3xl" />
      </div>
      <div className="absolute bottom-0 left-0 translate-y-1/4">
        <div className="w-[500px] h-[500px] bg-pink-500/10 rounded-full blur-3xl" />
      </div>
    </div>
  );
};