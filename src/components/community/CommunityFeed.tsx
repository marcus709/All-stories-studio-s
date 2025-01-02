import { useState } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Post } from "./Post";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export const CommunityFeed = () => {
  const session = useSession();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [newPost, setNewPost] = useState("");
  const [tags, setTags] = useState("");

  const { data: profile } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session?.user?.id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!session?.user?.id,
  });

  const { data: posts, isLoading } = useQuery({
    queryKey: ["posts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("posts")
        .select(`
          *,
          profiles!posts_user_id_fkey (
            username,
            avatar_url
          ),
          post_likes (
            id,
            user_id
          ),
          comments (
            id,
            content,
            created_at,
            profiles!comments_user_id_fkey (
              username,
              avatar_url
            )
          )
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const createPost = useMutation({
    mutationFn: async (content: string) => {
      const { error: postError } = await supabase
        .from("posts")
        .insert({ content, user_id: session?.user?.id });

      if (postError) throw postError;

      // If there are tags, add them
      if (tags) {
        const tagArray = tags.split(",").map((tag) => tag.trim());
        const tagData = tagArray.map((tag) => ({
          post_id: posts?.[0]?.id,
          tag: tag.startsWith("#") ? tag : `#${tag}`,
        }));

        const { error: tagError } = await supabase
          .from("post_tags")
          .insert(tagData);

        if (tagError) throw tagError;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      setNewPost("");
      setTags("");
      toast({
        title: "Success",
        description: "Your post has been published.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create post. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPost.trim()) return;
    createPost.mutate(newPost);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
            {profile?.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt={profile.username}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <span className="text-purple-600 font-medium">
                {profile?.username?.[0]?.toUpperCase() || "U"}
              </span>
            )}
          </div>
          <span className="text-gray-500">@{profile?.username}</span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Textarea
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            placeholder="Share your thoughts with the community..."
            className="min-h-[100px]"
          />
          <Input
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="Add tags (comma-separated)..."
            className="mb-4"
          />
          <Button
            type="submit"
            disabled={!newPost.trim() || createPost.isPending}
            className="w-full bg-purple-600 hover:bg-purple-700"
          >
            Share
          </Button>
        </form>
      </div>

      <div className="space-y-6">
        {posts?.map((post) => (
          <Post key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
};