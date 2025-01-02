import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { CommunityPost } from "./CommunityPost";

export function CommunityFeed() {
  const [postContent, setPostContent] = useState("");
  const [tags, setTags] = useState("");

  return (
    <div className="space-y-6">
      {/* Create Post */}
      <div className="space-y-4">
        <Textarea
          placeholder="Share your thoughts with the community..."
          value={postContent}
          onChange={(e) => setPostContent(e.target.value)}
          className="min-h-[100px]"
        />
        <div className="flex gap-4">
          <Input
            placeholder="Add tags (comma-separated)..."
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="flex-1"
          />
          <Button className="bg-purple-500 hover:bg-purple-600">Share</Button>
        </div>
      </div>

      {/* Posts */}
      <div className="space-y-6">
        <CommunityPost
          author="Sarah Chen"
          date="Jan 2, 2024"
          content="Just finished outlining my new fantasy novel! Anyone have tips for world-building?"
          tags={["writing", "fantasy", "worldbuilding"]}
          likes={0}
          comments={5}
        />
        <CommunityPost
          author="Marcus Wright"
          date="Jan 2, 2024"
          content="Looking for feedback on my character development approach. How do you make your characters feel more authentic?"
          tags={["characters", "writing-tips"]}
          likes={0}
          comments={0}
        />
      </div>
    </div>
  );
}