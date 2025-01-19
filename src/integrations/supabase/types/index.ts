export type GroupMember = {
  id: string;
  role: string;
  user: {
    id: string;
    username: string | null;
    avatar_url: string | null;
  } | null;
};