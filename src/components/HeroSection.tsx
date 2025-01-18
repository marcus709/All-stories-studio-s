import { useState, useEffect } from "react";
import { Button } from "./ui/button";

interface HeroSectionProps {
  onShowAuth: (view: "signin" | "signup") => void;
}

export const HeroSection = ({ onShowAuth }: HeroSectionProps) => {
  const [splineError, setSplineError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isScrolling, setIsScrolling] = useState(false);
  const [lastMouseMove, setLastMouseMove] = useState(Date.now());
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [showScrollArea, setShowScrollArea] = useState(false);
  let scrollTimeout: NodeJS.Timeout;
  let mouseTimeout: NodeJS.Timeout;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolling(true);
      
      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }
      
      scrollTimeout = setTimeout(() => {
        setIsScrolling(false);
      }, 150);
    };

    const handleWheel = (e: WheelEvent) => {
      const timeSinceLastMove = Date.now() - lastMouseMove;
      if (timeSinceLastMove > 500) {
        window.scrollBy(0, e.deltaY);
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      setLastMouseMove(Date.now());
      setMousePosition({ x: e.clientX, y: e.clientY });
      setShowScrollArea(false);
      
      if (mouseTimeout) {
        clearTimeout(mouseTimeout);
      }
      
      mouseTimeout = setTimeout(() => {
        setShowScrollArea(true);
      }, 100);
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('wheel', handleWheel, { passive: true });
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('mousemove', handleMouseMove);
      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }
      if (mouseTimeout) {
        clearTimeout(mouseTimeout);
      }
    };
  }, [lastMouseMove]);

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
              src="https://my.spline.design/theshipwreck-84ac0ec99510c6c542c4c33a494be4d8/"
              style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                backgroundColor: 'transparent',
                zIndex: 0,
                pointerEvents: Date.now() - lastMouseMove > 500 ? 'none' : 'auto',
              }}
              allow="autoplay; fullscreen; xr-spatial-tracking"
              onLoad={handleSplineLoad}
              onError={handleSplineError}
            />
          </div>
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-900 to-gray-800" />
        )}
      </div>

      {/* Scroll Area under cursor */}
      {showScrollArea && (
        <div
          style={{
            position: 'fixed',
            left: mousePosition.x - 20,
            top: mousePosition.y - 20,
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            pointerEvents: 'none',
            zIndex: 1,
          }}
        />
      )}

      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-black/50 z-20 flex items-center justify-center pointer-events-none">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white" />
        </div>
      )}

      {/* Content */}
      <div className={`relative z-10 container mx-auto px-4 text-center ${isScrolling ? 'pointer-events-auto' : 'pointer-events-none'}`}>
        <div className="max-w-5xl mx-auto space-y-8">
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold text-white leading-tight tracking-tight">
            All Stories Studio
          </h1>
          <p className="text-2xl md:text-3xl lg:text-4xl text-white/90 font-light max-w-3xl mx-auto leading-relaxed">
            Even a shipwreck tells a story. We're here to help you write yours!
          </p>
          <div className="flex items-center justify-center gap-4 pt-8">
            <div className="pointer-events-auto">
              <Button
                size="lg"
                className="bg-white hover:bg-white/90 text-black text-lg px-8 py-6"
                onClick={() => onShowAuth("signup")}
              >
                Get Started →
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};