import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Hash } from "lucide-react";

export const TrendingTopics = () => {
  const { data: topics } = useQuery({
    queryKey: ["trending-topics"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("post_tags")
        .select("tag, posts!inner(*)")
        .order("created_at", { ascending: false });

      if (error) throw error;

      const tagCounts = data.reduce((acc: Record<string, number>, curr) => {
        acc[curr.tag] = (acc[curr.tag] || 0) + 1;
        return acc;
      }, {});

      return Object.entries(tagCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5);
    },
  });

  return (
    <div className="w-72 shrink-0">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="font-semibold mb-4">Trending Topics</h2>
        <div className="space-y-3">
          {topics?.map(([tag, count]) => (
            <div key={tag} className="flex items-center gap-2">
              <Hash className="h-4 w-4 text-purple-500" />
              <span className="text-sm font-medium">{tag}</span>
              <span className="text-sm text-gray-500">({count} posts)</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};