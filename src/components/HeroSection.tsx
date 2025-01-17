import { useState } from "react";

interface HeroSectionProps {
  onShowAuth?: (view: "signin" | "signup") => void;
}

export const HeroSection = ({ onShowAuth }: HeroSectionProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const handleIframeLoad = () => {
    console.log("Iframe loaded successfully");
    setIsLoading(false);
    setHasError(false);
  };

  const handleIframeError = (error: any) => {
    console.error("Iframe loading error:", error);
    setIsLoading(false);
    setHasError(true);
  };

  return (
    <div className="relative h-screen w-full flex items-center justify-center overflow-hidden">
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
          <iframe 
            src="https://my.spline.design/retrofuturismbganimation-27777570ee9ed2811d5f6419b01d90b4/"
            frameBorder="0"
            width="100%"
            height="100%"
            onLoad={handleIframeLoad}
            onError={handleIframeError}
            title="3D Scene"
            style={{ 
              backgroundColor: 'transparent',
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%'
            }}
            allow="autoplay; fullscreen; xr-spatial-tracking"
          />
        </div>
      )}
    </div>
  );
};