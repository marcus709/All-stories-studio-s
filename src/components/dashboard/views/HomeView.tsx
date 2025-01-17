import { useState, useEffect } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import { Profile } from "@/integrations/supabase/types/tables.types";
import { Linkedin, Twitter, Instagram, Dribbble } from "lucide-react";
import { cn } from "@/lib/utils";

export const HomeView = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const session = useSession();

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
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Left Sidebar */}
      <div className="w-64 bg-background/60 backdrop-blur-xl border-r border-border/40 p-6 flex flex-col justify-between">
        <div>
          <div className="text-center mb-8">
            <div className="w-20 h-20 rounded-full bg-primary/10 mx-auto mb-3 flex items-center justify-center text-lg font-medium text-primary">
              {profile?.username?.[0]?.toUpperCase() || "?"}
            </div>
            <h3 className="font-medium text-foreground">{profile?.username || "Loading..."}</h3>
            <p className="text-sm text-muted-foreground">{session?.user?.email}</p>
          </div>
          
          <nav className="space-y-2">
            {["Explore", "Projects", "Explorations", "Blog", "About"].map((item) => (
              <a
                key={item}
                href="#"
                className="block px-4 py-2 text-sm text-foreground hover:bg-accent rounded-lg transition-colors"
              >
                {item}
              </a>
            ))}
          </nav>
        </div>

        <div className="flex justify-center gap-4">
          <Linkedin className="w-5 h-5 text-muted-foreground hover:text-foreground transition-colors cursor-pointer" />
          <Twitter className="w-5 h-5 text-muted-foreground hover:text-foreground transition-colors cursor-pointer" />
          <Dribbble className="w-5 h-5 text-muted-foreground hover:text-foreground transition-colors cursor-pointer" />
          <Instagram className="w-5 h-5 text-muted-foreground hover:text-foreground transition-colors cursor-pointer" />
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="relative">
          <div className="aspect-[2.5/1] bg-accent/50 rounded-lg m-6">
            {/* Placeholder for hero image */}
          </div>
          <h1 className="absolute bottom-12 left-1/2 -translate-x-1/2 text-4xl font-bold text-foreground">
            {profile?.username || "Welcome"}
          </h1>
        </div>

        <div className="p-6">
          <h2 className="text-2xl font-semibold mb-4">Project Overview</h2>
          <p className="text-muted-foreground leading-relaxed mb-6">
            The objective of the project is to enhance the current try-on feature within the NFT e-commerce platform. 
            In the past, users were required to upload a personal image and manually indicate their eye positions using 
            X markers on the screen.
          </p>
          
          <div className="aspect-[2/1] bg-accent/50 rounded-lg">
            {/* Placeholder for secondary image */}
          </div>
        </div>
      </main>

      {/* Right Sidebar */}
      <div className="w-64 bg-background/60 backdrop-blur-xl border-l border-border/40 p-6">
        <div className="mb-8">
          <h3 className="text-lg font-medium mb-3">Contents</h3>
          <ul className="space-y-2">
            {["Overview", "Market Trends", "Information Architecture"].map((item) => (
              <li key={item} className="text-muted-foreground hover:text-foreground cursor-pointer">
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-medium mb-3">Role</h3>
          <div className="flex flex-wrap gap-2">
            {[
              "User Interface",
              "Branding",
              "Website Development",
              "Product Strategy"
            ].map((tag) => (
              <span
                key={tag}
                className={cn(
                  "px-3 py-1 rounded-full text-xs",
                  "bg-accent/50 text-foreground"
                )}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};