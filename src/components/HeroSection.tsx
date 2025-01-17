import { useNavigate } from "react-router-dom";
import { useSession } from "@supabase/auth-helpers-react";
import { useToast } from "./ui/use-toast";
import { useState } from "react";

interface HeroSectionProps {
  onShowAuth?: (view: "signin" | "signup") => void;
}

export const HeroSection = ({ onShowAuth }: HeroSectionProps) => {
  const session = useSession();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="relative h-[90vh] w-full flex items-center justify-center overflow-hidden bg-gradient-to-b from-black via-purple-900/20 to-black">
      {/* Loading State */}
      {isLoading && (
        <div className="absolute inset-0 z-50 flex items-center justify-center">
          <div className="text-white text-xl">Loading Experience...</div>
        </div>
      )}
      
      {/* Fallback Background */}
      <div className="absolute inset-0 w-full h-full bg-[url('/scenes/hands.jpg')] bg-cover bg-center opacity-50" />
      
      {/* Content Container */}
      <div className="relative z-40 container mx-auto px-8 text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
          Craft Your Story
        </h1>
        <p className="text-xl md:text-2xl text-gray-200 mb-8 max-w-2xl mx-auto">
          Transform your ideas into captivating narratives with our AI-powered writing assistant
        </p>
        <button
          onClick={() => onShowAuth?.("signup")}
          className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-8 rounded-lg transition-colors"
        >
          Get Started
        </button>
      </div>
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black opacity-60" />
    </div>
  );
};