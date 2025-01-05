export type StoryIssueType = "plot_hole" | "timeline_inconsistency" | "pov_confusion" | "character_inconsistency";

export interface StoryIssue {
  id: string;
  issue_type: StoryIssueType;
  description: string;
  location: string;
  severity: number;
  status: "open" | "resolved";
}