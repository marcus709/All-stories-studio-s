import { Button } from "./ui/button";

export const HeroSection = () => {
  return (
    <section className="pt-32 pb-16 px-4 bg-gradient-to-br from-pink-50 to-purple-50">
      <div className="container mx-auto text-center">
        <h1 className="text-5xl md:text-6xl font-bold mb-6">
          Unleash Your Story's{" "}
          <span className="bg-gradient-to-r from-purple-600 to-pink-600 text-transparent bg-clip-text">
            Full Potential
          </span>
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Transform your writing with AI-powered storytelling tools. Create deeper characters,
          richer plots, and more engaging narratives.
        </p>
        <Button 
          size="lg"
          className="bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600 text-white px-8"
        >
          Start Writing Now →
        </Button>
      </div>
    </section>
  );
};