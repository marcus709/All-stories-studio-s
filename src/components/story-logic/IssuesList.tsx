import { AlertTriangle, Check } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { StoryIssue } from "@/types/story";

interface IssuesListProps {
  issues: StoryIssue[];
  issueType: string;
  isLoading: boolean;
}

export const IssuesList = ({ issues, issueType, isLoading }: IssuesListProps) => {
  const filteredIssues = issues.filter(issue => issue.issue_type === issueType);

  if (isLoading) {
    return <div className="text-center py-4">Loading issues...</div>;
  }

  if (!filteredIssues.length) {
    return (
      <Alert>
        <Check className="h-4 w-4" />
        <AlertTitle>All Clear!</AlertTitle>
        <AlertDescription>
          No issues of this type detected in your story.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-4">
      {filteredIssues.map((issue) => (
        <Alert key={issue.id} variant={issue.severity > 7 ? "destructive" : "default"}>
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle className="flex items-center justify-between">
            <span>Issue in: {issue.location}</span>
            <span className="text-sm font-normal">
              Severity: {issue.severity}/10
            </span>
          </AlertTitle>
          <AlertDescription>{issue.description}</AlertDescription>
        </Alert>
      ))}
    </div>
  );
};