import { MessageSquare, Heart, Bookmark, Share2 } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

interface CommunityPostProps {
  author: string;
  date: string;
  content: string;
  tags: string[];
  likes: number;
  comments: number;
}

export function CommunityPost({
  author,
  date,
  content,
  tags,
  likes,
  comments,
}: CommunityPostProps) {
  return (
    <div className="space-y-4">
      {/* Author Info */}
      <div className="flex items-center gap-3">
        <Avatar className="w-10 h-10 bg-purple-500">
          <span className="text-lg font-medium text-white">
            {author[0].toUpperCase()}
          </span>
        </Avatar>
        <div>
          <h3 className="font-medium">{author}</h3>
          <p className="text-sm text-gray-500">{date}</p>
        </div>
      </div>

      {/* Content */}
      <p className="text-gray-800">{content}</p>

      {/* Tags */}
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <span
            key={tag}
            className="text-sm text-purple-600 bg-purple-50 px-2 py-1 rounded-full"
          >
            #{tag}
          </span>
        ))}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-6">
        <Button variant="ghost" size="sm" className="text-gray-500">
          <Heart className="h-4 w-4 mr-2" />
          {likes}
        </Button>
        <Button variant="ghost" size="sm" className="text-gray-500">
          <MessageSquare className="h-4 w-4 mr-2" />
          {comments}
        </Button>
        <Button variant="ghost" size="sm" className="text-gray-500">
          <Bookmark className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm" className="text-gray-500 ml-auto">
          <Share2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}