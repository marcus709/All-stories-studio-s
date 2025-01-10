import { Post } from "./Post";

interface PostsListProps {
  posts: any[];
  onInteraction?: () => void;
}

export const PostsList = ({ posts, onInteraction }: PostsListProps) => {
  return (
    <div className="space-y-6">
      {posts.map((post) => (
        <div key={post.id} onClick={onInteraction}>
          <Post post={post} />
        </div>
      ))}
    </div>
  );
};