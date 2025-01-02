import { useState } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { Heart, MessageSquare, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";

interface PostProps {
  post: any;
}

export const Post = ({ post }: PostProps) => {
  const session = useSession();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState("");

  const isLiked = post.post_likes.some(
    (like: any) => like.user_id === session?.user?.id
  );

  const toggleLike = useMutation({
    mutationFn: async () => {
      if (isLiked) {
        const { error } = await supabase
          .from("post_likes")
          .delete()
          .eq("post_id", post.id)
          .eq("user_id", session?.user?.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("post_likes")
          .insert({ post_id: post.id, user_id: session?.user?.id });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update like. Please try again.",
        variant: "destructive",
      });
    },
  });

  const addComment = useMutation({
    mutationFn: async (content: string) => {
      const { error } = await supabase
        .from("comments")
        .insert({ content, post_id: post.id, user_id: session?.user?.id });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      setNewComment("");
      toast({
        title: "Success",
        description: "Your comment has been added.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add comment. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    addComment.mutate(newComment);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
          {post.profiles?.avatar_url ? (
            <img
              src={post.profiles.avatar_url}
              alt={post.profiles.username}
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            <span className="text-purple-600 font-medium">
              {post.profiles?.username?.[0]?.toUpperCase() || "U"}
            </span>
          )}
        </div>
        <div>
          <h3 className="font-medium">{post.profiles?.username || "Anonymous"}</h3>
          <p className="text-sm text-gray-500">
            {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
          </p>
        </div>
      </div>

      <p className="mb-4">{post.content}</p>

      <div className="flex items-center gap-4 mb-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => toggleLike.mutate()}
          className={`gap-2 ${isLiked ? "text-red-500" : "text-gray-500"}`}
        >
          <Heart className="h-4 w-4" />
          {post.post_likes.length}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowComments(!showComments)}
          className="gap-2 text-gray-500"
        >
          <MessageSquare className="h-4 w-4" />
          {post.comments.length}
        </Button>
        <Button variant="ghost" size="sm" className="gap-2 text-gray-500">
          <Share2 className="h-4 w-4" />
          Share
        </Button>
      </div>

      {showComments && (
        <div className="space-y-4">
          <form onSubmit={handleComment}>
            <Textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a comment..."
              className="mb-2"
            />
            <Button
              type="submit"
              size="sm"
              disabled={!newComment.trim() || addComment.isPending}
            >
              Comment
            </Button>
          </form>

          <div className="space-y-4 mt-4">
            {post.comments.map((comment: any) => (
              <div key={comment.id} className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center shrink-0">
                  {comment.profiles?.avatar_url ? (
                    <img
                      src={comment.profiles.avatar_url}
                      alt={comment.profiles.username}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-purple-600 text-sm font-medium">
                      {comment.profiles?.username?.[0]?.toUpperCase() || "U"}
                    </span>
                  )}
                </div>
                <div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="font-medium text-sm">
                      {comment.profiles?.username || "Anonymous"}
                    </p>
                    <p className="text-sm">{comment.content}</p>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {formatDistanceToNow(new Date(comment.created_at), {
                      addSuffix: true,
                    })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};