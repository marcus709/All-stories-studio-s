import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { FeaturesSection } from "@/components/FeaturesSection";
import { useState, useEffect } from "react";
import { AuthModals } from "@/components/auth/AuthModals";
import { useLocation } from "react-router-dom";
import { PricingDialog } from "@/components/pricing/PricingDialog";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import { PricingSection } from "@/components/PricingSection";
import { Button } from "@/components/ui/button";
import { MessageSquarePlus } from "lucide-react";
import { FeedbackDialog } from "@/components/FeedbackDialog";

const Index = () => {
  const [showAuth, setShowAuth] = useState(false);
  const [showPricing, setShowPricing] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [authView, setAuthView] = useState<"signin" | "signup">("signup");
  const location = useLocation();
  const session = useSession();
  const supabase = useSupabaseClient();

  useEffect(() => {
    const checkNewUser = async () => {
      if (!session?.user) return;

      try {
        const { data: existingActivity } = await supabase
          .from('user_activity_counts')
          .select('*')
          .eq('user_id', session.user.id)
          .maybeSingle();

        if (!existingActivity && !localStorage.getItem('pricingShown')) {
          setShowPricing(true);
          localStorage.setItem('pricingShown', 'true');
        }
      } catch (error) {
        console.error('Error checking user activity:', error);
      }
    };

    checkNewUser();
  }, [session, supabase]);

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
          <PricingSection />
        </main>
      </div>

      {/* Feedback Button */}
      <div className="fixed bottom-4 left-4 z-50">
        <Button
          onClick={() => setShowFeedback(true)}
          className="rounded-full px-4 py-2 bg-purple-600 hover:bg-purple-700"
        >
          <MessageSquarePlus className="mr-2 h-4 w-4" />
          Feedback
        </Button>
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
      <FeedbackDialog
        isOpen={showFeedback}
        onClose={() => setShowFeedback(false)}
      />
    </div>
  );
};

export default Index;