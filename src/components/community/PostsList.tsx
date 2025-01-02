import { Post } from "./Post";

interface PostsListProps {
  posts: any[];
}

export const PostsList = ({ posts }: PostsListProps) => {
  return (
    <div className="space-y-6">
      {posts?.map((post) => (
        <Post key={post.id} post={post} />
      ))}
    </div>
  );
};