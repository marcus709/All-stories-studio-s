import { PricingDialog } from "@/components/pricing/PricingDialog";

const PricingPreview = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 to-black text-white">
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center min-h-[calc(100vh-4rem)]">
          <PricingDialog defaultOpen={true} />
        </div>
      </main>
    </div>
  );
};

export default PricingPreview;