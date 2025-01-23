import { useState } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { Heart, MessageSquare, Share2, Trash2, MoreHorizontal, Link2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { Profile } from "@/integrations/supabase/types/tables.types";
import { useNavigate } from "react-router-dom";

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
  metadata?: {
    link?: {
      title: string;
      description: string;
    };
  } | null;
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
  const navigate = useNavigate();

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

  const handleProfileClick = (userId: string) => {
    navigate(`/community/profile/${userId}`);
  };

  const postUsername = post.get_post_profiles?.[0]?.username || "Anonymous";
  const postAvatarUrl = post.get_post_profiles?.[0]?.avatar_url;

  return (
    <div className="bg-white rounded-3xl shadow-sm p-6">
      <div className="flex items-start justify-between mb-4">
        <div 
          className="flex items-center gap-3 cursor-pointer hover:opacity-80"
          onClick={() => handleProfileClick(post.user_id)}
        >
          <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
            {postAvatarUrl ? (
              <img
                src={postAvatarUrl}
                alt={postUsername}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-gray-600 font-medium">
                {postUsername[0]?.toUpperCase() || "A"}
              </span>
            )}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{postUsername}</h3>
            <p className="text-sm text-gray-500">
              @{postUsername.toLowerCase()} · {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
            </p>
          </div>
        </div>
        {isOwnPost ? (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => deletePost.mutate()}
            className="text-gray-400 hover:text-red-500"
          >
            <Trash2 className="h-5 w-5" />
          </Button>
        ) : (
          <Button variant="ghost" size="icon" className="text-gray-400">
            <MoreHorizontal className="h-5 w-5" />
          </Button>
        )}
      </div>

      <p className="text-gray-800 mb-4 whitespace-pre-wrap">{post.content}</p>

      {post.metadata?.link && (
        <div className="mb-4 rounded-xl border border-gray-100 p-4 hover:bg-gray-50 cursor-pointer">
          <div className="flex items-center gap-3">
            <Link2 className="h-5 w-5 text-blue-500" />
            <div>
              <h4 className="font-medium text-gray-900">{post.metadata.link.title}</h4>
              <p className="text-sm text-gray-500">{post.metadata.link.description}</p>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center gap-6 text-gray-500">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => toggleLike.mutate()}
          className={`gap-2 hover:text-red-500 ${isLiked ? "text-red-500" : ""}`}
        >
          <Heart className={`h-5 w-5 ${isLiked ? "fill-current" : ""}`} />
          <span className="text-sm font-medium">{post.post_likes.length}</span>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowComments(!showComments)}
          className="gap-2 hover:text-blue-500"
        >
          <MessageSquare className="h-5 w-5" />
          <span className="text-sm font-medium">{post.comments.length}</span>
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          className="gap-2 hover:text-green-500"
        >
          <Share2 className="h-5 w-5" />
          <span className="text-sm font-medium">Share</span>
        </Button>
      </div>

      {showComments && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <form onSubmit={handleComment} className="mb-4">
            <Textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a comment..."
              className="mb-2 resize-none"
              rows={2}
            />
            <Button
              type="submit"
              size="sm"
              disabled={!newComment.trim() || addComment.isPending}
              className="bg-blue-500 hover:bg-blue-600"
            >
              Comment
            </Button>
          </form>

          <div className="space-y-4">
            {post.comments.map((comment) => {
              const commentUsername = comment.get_comment_profiles?.[0]?.username || "Anonymous";
              const commentAvatarUrl = comment.get_comment_profiles?.[0]?.avatar_url;

              return (
                <div key={comment.id} className="flex gap-3">
                  <div 
                    className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center shrink-0 cursor-pointer overflow-hidden"
                    onClick={() => handleProfileClick(comment.user_id)}
                  >
                    {commentAvatarUrl ? (
                      <img
                        src={commentAvatarUrl}
                        alt={commentUsername}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-gray-600 text-sm font-medium">
                        {commentUsername[0]?.toUpperCase() || "A"}
                      </span>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="bg-gray-50 rounded-2xl p-3">
                      <p 
                        className="font-medium text-sm cursor-pointer hover:opacity-80"
                        onClick={() => handleProfileClick(comment.user_id)}
                      >
                        {commentUsername}
                      </p>
                      <p className="text-sm text-gray-800">{comment.content}</p>
                    </div>
                    <p className="text-xs text-gray-500 mt-1 ml-3">
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
    </div>
  );
};