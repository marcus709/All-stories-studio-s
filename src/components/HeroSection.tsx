import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface HeroSectionProps {
  onShowAuth: (view: "signin" | "signup") => void;
}

export const HeroSection = ({ onShowAuth }: HeroSectionProps) => {
  const [splineError, setSplineError] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      return !!session;
    };

    const handleGetStarted = async () => {
      const isAuthenticated = await checkAuth();
      if (isAuthenticated) {
        navigate("/dashboard");
      } else {
        onShowAuth("signup");
      }
    };

    const getStartedButton = document.getElementById("get-started-button");
    if (getStartedButton) {
      getStartedButton.addEventListener("click", handleGetStarted);
    }

    return () => {
      const button = document.getElementById("get-started-button");
      if (button) {
        button.removeEventListener("click", handleGetStarted);
      }
    };
  }, [navigate, onShowAuth]);

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        <div
          className="absolute inset-0 z-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(0, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0.5) 50%, rgba(0, 0, 0, 0.7) 100%)",
          }}
        />
        {!splineError ? (
          <div className="relative w-full h-full">
            <iframe
              src="https://my.spline.design/theshipwreck-84ac0ec99510c6c542c4c33a494be4d8/"
              style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                border: 'none',
                overflow: 'hidden'
              }}
              onError={() => setSplineError(true)}
            />
          </div>
        ) : (
          <div className="w-full h-full bg-gradient-to-b from-gray-900 to-gray-800" />
        )}
      </div>

      <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6">
          All Stories Studio
        </h1>
        <p className="text-xl sm:text-2xl text-gray-200 mb-8">
          Even a shipwreck tells a story. We're here to help you write yours!
        </p>
        <Button
          id="get-started-button"
          size="lg"
          className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-lg text-lg font-semibold transition-colors duration-200"
        >
          Get Started
        </Button>
      </div>
    </div>
  );
};