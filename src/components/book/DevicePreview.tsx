import React from 'react';
import { cn } from "@/lib/utils";

interface DevicePreviewProps {
  device: 'kindle' | 'ipad' | 'phone' | 'print';
  content: string;
  zoomLevel: number;
}

const deviceDimensions = {
  kindle: { width: 600, height: 800, padding: '24px' },
  ipad: { width: 768, height: 1024, padding: '32px' },
  phone: { width: 375, height: 667, padding: '16px' }
};

const deviceStyles = {
  kindle: "bg-gray-100",
  ipad: "bg-gray-200",
  phone: "bg-black"
};

export const DevicePreview: React.FC<DevicePreviewProps> = ({
  device,
  content,
  zoomLevel
}) => {
  const dimensions = deviceDimensions[device];
  
  return (
    <div className="flex justify-center items-start overflow-auto p-8 bg-gray-100 rounded-lg" style={{ height: 'calc(100vh - 300px)' }}>
      <div 
        className={cn(
          "relative rounded-lg shadow-xl transition-all duration-300",
          deviceStyles[device]
        )}
        style={{
          width: dimensions.width,
          height: dimensions.height,
          transform: `scale(${zoomLevel / 100})`,
          transformOrigin: 'top center'
        }}
      >
        <div 
          className="bg-white h-full overflow-auto"
          style={{ padding: dimensions.padding }}
        >
          <div className="prose max-w-none">
            {content}
          </div>
        </div>
      </div>
    </div>
  );
};