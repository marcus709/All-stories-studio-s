import { useState, useEffect } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAI } from "@/hooks/useAI";
import { useToast } from "@/hooks/use-toast";
import { Send } from "lucide-react";
import { Profile } from "@/integrations/supabase/types/tables.types";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { useStory } from "@/contexts/StoryContext";

export const HomeView = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const session = useSession();
  const { toast } = useToast();
  const { generateContent } = useAI();
  const [isLoading, setIsLoading] = useState(false);
  const { selectedStory } = useStory();

  useEffect(() => {
    if (session?.user?.id) {
      getProfile();
    }
  }, [session?.user?.id]);

  const getProfile = async () => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session?.user?.id)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A192F] text-white font-mono relative overflow-hidden">
      {/* Hero Section with Glowing Circle */}
      <div className="relative h-[70vh] flex items-center justify-center">
        {/* Glowing Circle */}
        <div className="absolute w-64 h-64 rounded-full border-2 border-[#64FFDA] blur-sm animate-pulse" />
        
        {/* Dark Sphere */}
        <div className="absolute w-32 h-32 bg-[#0A192F] rounded-full shadow-2xl transform translate-y-16" />
        
        {/* Platform */}
        <div className="absolute w-48 h-12 bg-[#112240] bottom-32 transform -translate-y-8" />

        {/* Username */}
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute bottom-16 left-16 text-6xl font-bold text-white"
        >
          {profile?.username || 'Writer'}
        </motion.h1>
      </div>

      {/* Content Section */}
      <div className="relative z-10 px-16 py-12 bg-[#112240]/80 backdrop-blur-lg">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-medium text-[#64FFDA] mb-4">Project overview</h2>
          <p className="text-gray-400 mb-8 leading-relaxed">
            Welcome to your writing dashboard. Here you can manage your stories, develop characters,
            and get AI-powered assistance for your creative process.
          </p>

          {/* Navigation Links */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            {['Overview', 'Market trends', 'Information architecture', 'Product strategy'].map((item) => (
              <div 
                key={item}
                className="px-4 py-2 text-sm text-gray-400 hover:text-[#64FFDA] transition-colors cursor-pointer"
              >
                {item}
              </div>
            ))}
          </div>

          {/* Role Tags */}
          <div className="mt-12">
            <h3 className="text-gray-400 mb-4 uppercase text-sm tracking-wider">Role</h3>
            <div className="flex flex-wrap gap-3">
              {['User interface', 'Branding', 'Website development', 'Product strategy'].map((tag) => (
                <span 
                  key={tag}
                  className="px-4 py-2 rounded-full border border-[#64FFDA] text-[#64FFDA] text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Background Gradient */}
      <div className="fixed inset-0 bg-gradient-to-b from-[#0A192F] to-[#112240] -z-10" />
    </div>
  );
};