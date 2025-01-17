import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { FeaturesSection } from "@/components/FeaturesSection";
import { StoriesSection } from "@/components/StoriesSection";
import { PricingSection } from "@/components/PricingSection";
import { useState, useEffect } from "react";
import { AuthModals } from "@/components/auth/AuthModals";
import { useLocation } from "react-router-dom";
import Spline from '@splinetool/react-spline';
import { useToast } from "@/components/ui/use-toast";

const Index = () => {
  const [showAuth, setShowAuth] = useState(false);
  const [authView, setAuthView] = useState<"signin" | "signup">("signup");
  const [splineError, setSplineError] = useState(false);
  const location = useLocation();
  const { toast } = useToast();

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

  const handleSplineError = () => {
    setSplineError(true);
    toast({
      title: "Background Load Error",
      description: "Unable to load 3D background. Using fallback background.",
      variant: "destructive",
    });
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Spline Background */}
      <div className={`fixed inset-0 w-full h-full z-0 ${splineError ? 'bg-gradient-to-br from-black to-gray-900' : ''}`}>
        {!splineError && (
          <Spline 
            scene="https://prod.spline.design/27777570ee9ed2811d5f6419b01d90b4/scene.splinecode"
            style={{ width: '100%', height: '100%' }}
            onError={handleSplineError}
          />
        )}
      </div>

      {/* Content */}
      <div className="relative z-10">
        <Header />
        <main className="relative">
          <HeroSection onShowAuth={handleShowAuth} />
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