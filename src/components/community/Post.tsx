import { useState } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { Heart, MessageSquare, Share2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { UserProfileDialog } from "./UserProfileDialog";
import { Profile } from "@/integrations/supabase/types/tables.types";

interface PostLike {
  id: string;
  post_id: string;
  user_id: string;
}

interface Comment {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  get_comment_profiles: Array<{
    username: string;
    avatar_url: string | null;
  }>;
}

interface PostProfile {
  username: string;
  avatar_url: string | null;
}

interface Post {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  post_likes: PostLike[];
  comments: Comment[];
  get_post_profiles: PostProfile[];
}

interface PostProps {
  post: Post;
}

export const Post = ({ post }: PostProps) => {
  const session = useSession();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);

  const isLiked = post.post_likes.some(
    (like) => like.user_id === session?.user?.id
  );

  const isOwnPost = post.user_id === session?.user?.id;

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

  const deletePost = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from("posts")
        .delete()
        .eq("id", post.id)
        .eq("user_id", session?.user?.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      toast({
        title: "Success",
        description: "Post deleted successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete post. Please try again.",
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

  // Get the username from the get_post_profiles function result
  const postUsername = post.get_post_profiles?.[0]?.username || "Anonymous";
  const postAvatarUrl = post.get_post_profiles?.[0]?.avatar_url;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <div 
          className="flex items-center gap-3 cursor-pointer hover:opacity-80"
          onClick={() => setSelectedProfile({ 
            id: post.user_id, 
            username: postUsername,
            avatar_url: postAvatarUrl,
            bio: null
          })}
        >
          <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
            {postAvatarUrl ? (
              <img
                src={postAvatarUrl}
                alt={postUsername}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <span className="text-purple-600 font-medium">
                {postUsername[0]?.toUpperCase() || "A"}
              </span>
            )}
          </div>
          <div>
            <h3 className="font-medium">@{postUsername}</h3>
            <p className="text-sm text-gray-500">
              {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
            </p>
          </div>
        </div>
        {isOwnPost && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => deletePost.mutate()}
            className="text-red-500 hover:text-red-700"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
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
            {post.comments.map((comment) => {
              const commentUsername = comment.get_comment_profiles?.[0]?.username || "Anonymous";
              const commentAvatarUrl = comment.get_comment_profiles?.[0]?.avatar_url;

              return (
                <div key={comment.id} className="flex gap-3">
                  <div 
                    className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center shrink-0 cursor-pointer"
                    onClick={() => setSelectedProfile({
                      id: comment.user_id,
                      username: commentUsername,
                      avatar_url: commentAvatarUrl,
                      bio: null
                    })}
                  >
                    {commentAvatarUrl ? (
                      <img
                        src={commentAvatarUrl}
                        alt={commentUsername}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-purple-600 text-sm font-medium">
                        {commentUsername[0]?.toUpperCase() || "A"}
                      </span>
                    )}
                  </div>
                  <div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p 
                        className="font-medium text-sm cursor-pointer hover:opacity-80"
                        onClick={() => setSelectedProfile({
                          id: comment.user_id,
                          username: commentUsername,
                          avatar_url: commentAvatarUrl,
                          bio: null
                        })}
                      >
                        @{commentUsername}
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
              );
            })}
          </div>
        </div>
      )}

      {selectedProfile && (
        <UserProfileDialog
          user={selectedProfile}
          isOpen={!!selectedProfile}
          onClose={() => setSelectedProfile(null)}
        />
      )}
    </div>
  );
};
