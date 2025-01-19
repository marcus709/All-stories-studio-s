import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { FeaturesSection } from "@/components/FeaturesSection";
import { StoriesSection } from "@/components/StoriesSection";
import { useState, useEffect } from "react";
import { AuthModals } from "@/components/auth/AuthModals";
import { useLocation } from "react-router-dom";
import { PricingDialog } from "@/components/pricing/PricingDialog";
import { useSession } from "@supabase/auth-helpers-react";

const Index = () => {
  const [showAuth, setShowAuth] = useState(false);
  const [showPricing, setShowPricing] = useState(false);
  const [authView, setAuthView] = useState<"signin" | "signup">("signup");
  const location = useLocation();
  const session = useSession();

  useEffect(() => {
    // Show pricing dialog when user first signs up
    if (session?.user && !localStorage.getItem('pricingShown')) {
      setShowPricing(true);
      localStorage.setItem('pricingShown', 'true');
    }
  }, [session]);

  const handleShowAuth = (view: "signin" | "signup") => {
    setAuthView(view);
    setShowAuth(true);
  };

  return (
    <div className="min-h-screen text-white overflow-hidden">
      <div className="relative">
        <Header />
        <main className="relative">
          <HeroSection onShowAuth={handleShowAuth} />
          <FeaturesSection />
          <StoriesSection />
        </main>
      </div>
      <AuthModals
        isOpen={showAuth}
        onClose={() => setShowAuth(false)}
        defaultView={authView}
      />
      <PricingDialog 
        isOpen={showPricing} 
        onClose={() => setShowPricing(false)} 
      />
    </div>
  );
};

export default Index;