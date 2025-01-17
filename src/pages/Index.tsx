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
        <Spline 
          scene="https://prod.spline.design/ZZf9MfaGeuYgfCzd/scene.splinecode"
          onError={handleSplineError}
        />
      </div>
      
      <div className="relative">
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