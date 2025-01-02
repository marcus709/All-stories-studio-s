import { Database } from "./database.types";

type Tables = Database["public"]["Tables"]

export type Character = Tables["characters"]["Row"]
export type Comment = Tables["comments"]["Row"]
export type Friendship = Tables["friendships"]["Row"]
export type GroupMember = Tables["group_members"]["Row"]
export type Group = Tables["groups"]["Row"]
export type PlotEvent = Tables["plot_events"]["Row"]
export type PlotStructure = Tables["plot_structures"]["Row"]
export type PostLike = Tables["post_likes"]["Row"]
export type PostTag = Tables["post_tags"]["Row"]
export type Post = Tables["posts"]["Row"]
export type Profile = Tables["profiles"]["Row"]
export type SavedPost = Tables["saved_posts"]["Row"]
export type Story = Tables["stories"]["Row"]
export type StoryIdea = Tables["story_ideas"]["Row"]
export type Topic = Tables["topics"]["Row"]