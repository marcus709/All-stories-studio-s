import { useState, useEffect } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import { Profile } from "@/integrations/supabase/types/tables.types";

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
    <div className="h-screen flex flex-col">
      {/* Top 50% - Spline Scene */}
      <div className="relative h-1/2 bg-[#0A192F]">
        <iframe 
          src='https://my.spline.design/meeet-3297991fed630b67cf47d1939f53d502/' 
          frameBorder='0' 
          width='100%' 
          height='100%'
          className="absolute inset-0"
        />
        <div className="absolute bottom-4 left-6 text-white font-mono">
          <span className="text-lg">@{profile?.username || 'loading...'}</span>
        </div>
      </div>

      {/* Bottom 50% - Scrollable Content */}
      <div className="h-1/2 overflow-y-auto bg-[#0A192F] text-white font-mono">
        <div className="max-w-[1400px] mx-auto px-8 py-12">
          {/* Project Overview Section */}
          <div className="relative">
            <h1 className="text-4xl font-bold mb-6">Project overview</h1>
            
            <p className="text-gray-400 max-w-[800px] text-lg leading-relaxed mb-16">
              The objective of the project is to enhance the current try-on feature within the NFT e-commerce platform. 
              In the past, users were required to upload a personal image and manually indicate their eye positions using X markers on the screen. 
              Sadly, the outcomes were underwhelming.
            </p>

            {/* Content Navigation */}
            <div className="absolute right-0 top-0 text-right">
              <h2 className="text-gray-500 uppercase text-sm tracking-wider mb-4">CONTENTS</h2>
              <nav className="space-y-2">
                {['Overview', 'Market trends', 'Information architecture'].map((item) => (
                  <div key={item} className="text-gray-400 hover:text-white cursor-pointer">
                    {item}
                  </div>
                ))}
              </nav>

              {/* Role Tags Section */}
              <div className="mt-16">
                <h2 className="text-gray-500 uppercase text-sm tracking-wider mb-4">ROLE</h2>
                <div className="flex flex-wrap gap-2 justify-end">
                  {[
                    'User interface',
                    'Branding',
                    'Website development',
                    'Product strategy'
                  ].map((tag) => (
                    <span
                      key={tag}
                      className="px-4 py-1 rounded-full border border-gray-700 text-gray-400 text-sm hover:border-gray-500 hover:text-white transition-colors cursor-pointer"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};