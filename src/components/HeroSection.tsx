import { useState } from "react";

interface HeroSectionProps {
  onShowAuth?: (view: "signin" | "signup") => void;
}

export const HeroSection = ({ onShowAuth }: HeroSectionProps) => {
  const [isLoading, setIsLoading] = useState(true);

  const handleIframeLoad = () => {
    setIsLoading(false);
  };

  return (
    <div className="relative h-[90vh] w-full flex items-center justify-center overflow-hidden bg-black">
      {/* Loading State */}
      {isLoading && (
        <div className="absolute inset-0 z-50 flex items-center justify-center">
          <div className="text-white text-xl">Loading 3D Scene...</div>
        </div>
      )}
      
      {/* Background Scene */}
      <div className="absolute inset-0 w-full h-full">
        <iframe 
          src="https://my.spline.design/theshipwreck-b47b3f5b7727762a0d6ad2efe92792ae/"
          frameBorder="0"
          width="100%"
          height="100%"
          onLoad={handleIframeLoad}
          title="3D Scene"
        />
      </div>
    </div>
  );
};