import { useState } from "react";
import Spline from '@splinetool/react-spline';

interface HeroSectionProps {
  onShowAuth?: (view: "signin" | "signup") => void;
}

export const HeroSection = ({ onShowAuth }: HeroSectionProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const handleSplineLoad = () => {
    console.log("Spline scene loaded successfully");
    setIsLoading(false);
    setHasError(false);
  };

  const handleSplineError = (error: any) => {
    console.error("Spline loading error:", error);
    setIsLoading(false);
    setHasError(true);
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center">
      {isLoading && (
        <div className="absolute inset-0 z-50 flex items-center justify-center">
          <div className="text-white text-xl">Loading 3D Scene...</div>
        </div>
      )}
      
      {hasError ? (
        <div className="absolute inset-0 z-40 flex items-center justify-center bg-gradient-to-b from-gray-900 to-black">
          <div className="text-white text-center">
            <h1 className="text-4xl font-bold mb-4">Welcome to Story Writing Assistant</h1>
            <p className="text-xl">Your creative journey begins here</p>
          </div>
        </div>
      ) : (
        <div className="absolute inset-0 w-full h-full">
          <Spline
            scene="https://prod.spline.design/kbIdKZrhiKaVR2bt/scene.splinecode"
            onLoad={handleSplineLoad}
            onError={handleSplineError}
            style={{ 
              width: '100%',
              height: '100%',
              backgroundColor: 'transparent'
            }}
          />
        </div>
      )}
    </div>
  );
};