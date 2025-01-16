import { Button } from "@/components/ui/button";
import { LampContainer } from "@/components/ui/lamp";
import { cn } from "@/lib/utils";

interface HeroSectionProps {
  onShowAuth: (view: "signin" | "signup") => void;
}

export const HeroSection = ({ onShowAuth }: HeroSectionProps) => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Left side content */}
          <div className="flex-1 text-left space-y-4">
            <h1 className="text-4xl md:text-6xl font-bold text-white">
              Craft Your Stories
              <br />
              With Precision
            </h1>
            <p className="text-xl text-white/80 max-w-[600px]">
              Transform your ideas into captivating narratives with our intelligent writing assistant.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <Button
                onClick={() => onShowAuth("signup")}
                className="bg-white text-slate-900 hover:bg-white/90"
                size="lg"
              >
                Get Started
              </Button>
              <Button
                variant="outline"
                onClick={() => onShowAuth("signin")}
                className="border-white text-white hover:bg-white/10"
                size="lg"
              >
                Sign In
              </Button>
            </div>
          </div>

          {/* Right side with lamp */}
          <div className="flex-1">
            <LampContainer className="w-full max-w-2xl">
              <div className="space-y-6 text-center">
                <p className="text-white text-xl font-light">
                  "The art of storytelling is the art of world-building."
                </p>
                <p className="text-white/80">
                  Join thousands of writers crafting their stories
                </p>
              </div>
            </LampContainer>
          </div>
        </div>
      </div>

      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-background to-background/20 pointer-events-none" />
    </section>
  );
};