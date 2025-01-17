import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { AuthModals } from "@/components/auth/AuthModals";
import { useToast } from "@/hooks/use-toast";

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
          <spline-viewer
            url="https://my.spline.design/retrofuturismbganimation-27777570ee9ed2811d5f6419b01d90b4/"
            className="w-full h-full"
            loading-anim
            events-target="global"
            onError={handleSplineError}
          ></spline-viewer>
        )}
      </div>

      {/* Content */}
      <div className="relative z-10">
        <Header />
        <main className="relative">
          <HeroSection onShowAuth={handleShowAuth} />
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