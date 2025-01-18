import { Users, Activity } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const CommunityHome = () => {
  const { data: featuredGroups } = useQuery({
    queryKey: ["featured-groups"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("groups")
        .select("*")
        .limit(2)
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  const { data: popularGroups } = useQuery({
    queryKey: ["popular-groups"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("groups")
        .select("*")
        .limit(2)
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="space-y-8">
      {/* Hero Banner */}
      <div className="relative h-48 rounded-xl overflow-hidden bg-gradient-to-r from-purple-500 via-violet-500 to-indigo-500">
        <div className="absolute inset-0 flex items-center justify-center text-white">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-2">Find Your Community</h1>
            <p className="text-lg opacity-90">Connect with writers like you</p>
          </div>
        </div>
      </div>

      {/* Featured Communities */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Featured Communities</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {featuredGroups?.map((group) => (
            <Card key={group.id} className="p-6 relative overflow-hidden group cursor-pointer hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-xl font-semibold mb-2">{group.name}</h3>
                  <p className="text-muted-foreground">{group.description}</p>
                </div>
                {group.image_url ? (
                  <img src={group.image_url} alt={group.name} className="w-12 h-12 rounded-full" />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-violet-100 flex items-center justify-center">
                    <Users className="w-6 h-6 text-violet-500" />
                  </div>
                )}
              </div>
              <div className="mt-4 flex items-center text-sm text-muted-foreground">
                <Users className="w-4 h-4 mr-1" />
                <span>Active community</span>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Popular Right Now */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Popular Right Now</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {popularGroups?.map((group) => (
            <Card key={group.id} className="p-6 relative overflow-hidden group cursor-pointer hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-xl font-semibold mb-2">{group.name}</h3>
                  <p className="text-muted-foreground">{group.description}</p>
                </div>
                {group.image_url ? (
                  <img src={group.image_url} alt={group.name} className="w-12 h-12 rounded-full" />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-violet-100 flex items-center justify-center">
                    <Activity className="w-6 h-6 text-violet-500" />
                  </div>
                )}
              </div>
              <div className="mt-4 flex items-center text-sm text-muted-foreground">
                <Users className="w-4 h-4 mr-1" />
                <span>Growing community</span>
              </div>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
};