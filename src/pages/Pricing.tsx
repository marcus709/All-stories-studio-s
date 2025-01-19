import { Header } from "@/components/Header";
import { PricingSection } from "@/components/PricingSection";

const Pricing = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 to-black text-white">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <PricingSection />
      </main>
    </div>
  );
};

export default Pricing;