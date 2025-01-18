import { useState } from "react";
import Spline from "@splinetool/react-spline";
import { Button } from "./ui/button";

interface HeroSectionProps {
  onShowAuth: (view: "signin" | "signup") => void;
}

export const HeroSection = ({ onShowAuth }: HeroSectionProps) => {
  const [splineError, setSplineError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const handleSplineLoad = () => {
    setIsLoading(false);
  };

  const handleSplineError = () => {
    setSplineError(true);
    setIsLoading(false);
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center">
      {/* Background with Spline */}
      <div className="absolute inset-0 z-0">
        {!splineError ? (
          <div className="relative w-full h-full">
            <iframe
              src="https://my.spline.design/theshipwreck-bf9cd47c523a3d1014e08cb5b8e80639/"
              style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                backgroundColor: 'transparent',
                zIndex: 0,
                pointerEvents: 'none' // This allows scrolling through the iframe
              }}
              allow="autoplay; fullscreen; xr-spatial-tracking"
              onLoad={handleSplineLoad}
              onError={handleSplineError}
            />
            {/* Invisible overlay to handle 3D interactions */}
            <div 
              className="absolute inset-0"
              style={{ pointerEvents: 'auto' }}
              onWheel={(e) => {
                // Allow page scrolling
                e.stopPropagation();
              }}
            />
          </div>
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-900 to-gray-800" />
        )}
      </div>

      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-black/50 z-20 flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white" />
        </div>
      )}

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center pointer-events-none">
        <div className="max-w-5xl mx-auto space-y-8">
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold text-white leading-tight tracking-tight">
            All Stories Studio
          </h1>
          <p className="text-2xl md:text-3xl lg:text-4xl text-white/90 font-light max-w-3xl mx-auto leading-relaxed">
            Create, collaborate, and bring your stories to life with our AI-powered writing studio
          </p>
          <div className="flex items-center justify-center gap-4 pt-8">
            <Button
              size="lg"
              className="bg-white hover:bg-white/90 text-black text-lg px-8 py-6 pointer-events-auto"
              onClick={() => onShowAuth("signup")}
            >
              Get Started →
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};