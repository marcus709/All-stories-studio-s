import { PricingDialog } from "@/components/pricing/PricingDialog";
import { useState } from "react";

const PricingPreview = () => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 to-black text-white">
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center min-h-[calc(100vh-4rem)]">
          <PricingDialog 
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
          />
        </div>
      </main>
    </div>
  );
};

export default PricingPreview;