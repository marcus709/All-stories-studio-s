import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { FeaturesSection } from "@/components/FeaturesSection";
import { StoriesSection } from "@/components/StoriesSection";
import { PricingSection } from "@/components/PricingSection";
import { useState, useEffect } from "react";
import { AuthModals } from "@/components/auth/AuthModals";
import { useLocation } from "react-router-dom";

const Index = () => {
  const [showAuth, setShowAuth] = useState(false);
  const [authView, setAuthView] = useState<"signin" | "signup">("signup");
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white">
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
      <div className="relative">
        <Header />
        <main className="relative">
          {/* Decorative gradients */}
          <div className="absolute top-0 right-0 -translate-y-1/4 animate-pulse">
            <div className="w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-3xl" />
          </div>
          <div className="absolute top-1/3 left-0 -translate-x-1/2 animate-pulse delay-700">
            <div className="w-[500px] h-[500px] bg-pink-500/10 rounded-full blur-3xl" />
          </div>
          <div className="absolute bottom-0 right-1/4 translate-y-1/4 animate-pulse delay-1000">
            <div className="w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-3xl" />
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