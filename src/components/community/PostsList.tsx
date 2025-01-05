import { Post } from "./Post";

interface PostsListProps {
  posts: any[];
}

export const PostsList = ({ posts }: PostsListProps) => {
  if (!posts?.length) {
    return (
      <div className="text-center py-8 bg-white rounded-lg shadow">
        <p className="text-gray-500">No posts yet. Be the first to share something!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {posts.map((post) => (
        <Post key={post.id} post={post} />
      ))}
    </div>
  );
};