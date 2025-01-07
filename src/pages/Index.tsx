import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { FeaturesSection } from "@/components/FeaturesSection";
import { StoriesSection } from "@/components/StoriesSection";
import { PricingSection } from "@/components/PricingSection";
import { useState, useEffect } from "react";
import { AuthModals } from "@/components/auth/AuthModals";
import { useLocation } from "react-router-dom";
import Spline from '@splinetool/react-spline';

const Index = () => {
  const [showAuth, setShowAuth] = useState(false);
  const [authView, setAuthView] = useState<"signin" | "signup">("signup");
  const [splineError, setSplineError] = useState(false);
  const location = useLocation();

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
    console.error("Failed to load Spline scene");
    setSplineError(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
      {!splineError && (
        <div className="fixed inset-0 w-full h-full pointer-events-none z-0">
          <Spline 
            scene="https://prod.spline.design/worldplanetesimora-17c8bec8526f0397f17fad3e8ffb1eb4/scene.splinecode"
            onError={handleSplineError}
          />
        </div>
      )}
      <div className="relative">
        <Header />
        <main className="relative">
          <div className="absolute top-0 right-0 -translate-y-1/4">
            <div className="w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
          </div>
          <div className="absolute top-1/4 left-0 -translate-x-1/2">
            <div className="w-96 h-96 bg-pink-500/10 rounded-full blur-3xl" />
          </div>
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