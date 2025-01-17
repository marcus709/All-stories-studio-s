import { useState } from "react";

interface HeroSectionProps {
  onShowAuth?: (view: "signin" | "signup") => void;
}

export const HeroSection = ({ onShowAuth }: HeroSectionProps) => {
  const [isLoading, setIsLoading] = useState(true);

  const handleIframeLoad = () => {
    console.log("Iframe loaded");
    setIsLoading(false);
  };

  const handleIframeError = (error: any) => {
    console.error("Iframe loading error:", error);
  };

  return (
    <div className="relative h-screen w-full flex items-center justify-center overflow-hidden">
      {isLoading && (
        <div className="absolute inset-0 z-50 flex items-center justify-center">
          <div className="text-white text-xl">Loading 3D Scene...</div>
        </div>
      )}
      
      <div className="absolute inset-0 w-full h-full">
        <iframe 
          src="https://my.spline.design/theshipwreck-b47b3f5b7727762a0d6ad2efe92792ae/"
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
    </div>
  );
};