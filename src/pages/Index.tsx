import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { FeaturesSection } from "@/components/FeaturesSection";
import { StoriesSection } from "@/components/StoriesSection";
import { PricingSection } from "@/components/PricingSection";
import { SupabaseTest } from "@/components/SupabaseTest";

const Index = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <SupabaseTest />
      <main>
        <HeroSection />
        <FeaturesSection />
        <StoriesSection />
        <PricingSection />
      </main>
    </div>
  );
};

export default Index;