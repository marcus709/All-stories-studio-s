import { useState } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Post } from "./Post";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export const CommunityFeed = () => {
  const session = useSession();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [newPost, setNewPost] = useState("");

  const { data: posts, isLoading } = useQuery({
    queryKey: ["posts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("posts")
        .select(`
          *,
          profiles (
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
            profiles (
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
      const { error } = await supabase
        .from("posts")
        .insert({ content, user_id: session?.user?.id });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      setNewPost("");
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
    <div className="flex-1 max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="mb-8">
        <Textarea
          value={newPost}
          onChange={(e) => setNewPost(e.target.value)}
          placeholder="What's on your mind?"
          className="mb-4"
        />
        <Button
          type="submit"
          disabled={!newPost.trim() || createPost.isPending}
          className="w-full bg-purple-600 hover:bg-purple-700"
        >
          Post
        </Button>
      </form>

      <div className="space-y-6">
        {posts?.map((post) => (
          <Post key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
};