import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { useToast } from "@/hooks/use-toast";
import { Header } from "@/components/Header";
import { FeaturesSection } from "@/components/FeaturesSection";
import { StoriesSection } from "@/components/StoriesSection";
import { PricingSection } from "@/components/PricingSection";
import { AuthModals } from "@/components/auth/AuthModals";
import { Button } from "@/components/ui/button";
import Spline from '@splinetool/react-spline';

const Index = () => {
  const [showAuth, setShowAuth] = useState(false);
  const [authView, setAuthView] = useState<"signin" | "signup">("signup");
  const [splineError, setSplineError] = useState(false);
  const location = useLocation();
  const { toast } = useToast();
  const session = useSession();
  const navigate = useNavigate();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const scrollTo = searchParams.get('scrollTo');
    
    if (scrollTo === 'pricing') {
      const pricingSection = document.getElementById('pricing');
      if (pricingSection) {
        pricingSection.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [location]);

  const handleShowAuth = (view: "signin" | "signup") => {
    setAuthView(view);
    setShowAuth(true);
  };

  const handleStartWriting = () => {
    if (session) {
      navigate("/dashboard");
    } else {
      if (handleShowAuth) {
        handleShowAuth("signup");
      } else {
        toast({
          title: "Authentication Required",
          description: "Please sign up to start writing.",
          variant: "destructive",
        });
      }
    }
  };

  const handleSplineError = () => {
    setSplineError(true);
    toast({
      title: "Background Load Error",
      description: "Using fallback background",
      variant: "destructive",
    });
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Spline Scene Background */}
      <div className="fixed inset-0 -z-10">
        {!splineError ? (
          <Spline 
            scene="https://my.spline.design/retrofuturismbganimation-56a5ed935be4c635c1e05876981ad379/"
            onError={handleSplineError}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-purple-900 via-blue-900 to-black animate-gradient" />
        )}
      </div>
      
      <div className="relative">
        <Header />
        <main className="relative">
          <div className="min-h-screen flex items-center justify-center px-4">
            <div className="max-w-2xl mx-auto text-center">
              <h1 className="text-6xl md:text-7xl font-bold mb-6 text-white leading-[1.1] tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">
                Transform your writing journey
              </h1>
              
              <p className="text-lg text-white/80 mb-10 mx-auto leading-relaxed">
                Create deeper characters, richer plots, and more engaging narratives.
              </p>

              <Button 
                onClick={handleStartWriting}
                className="px-8 py-6 text-lg bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-full transition-all duration-300 hover:scale-105 backdrop-blur-sm"
              >
                Start Writing Now
              </Button>
            </div>
          </div>
          <FeaturesSection />
          <StoriesSection />
          <PricingSection />
        </main>
      </div>

      <AuthModals
        isOpen={showAuth}
        onClose={() => setShowAuth(false)}
        defaultView={authView}
      />
    </div>
  );
};

export default Index;