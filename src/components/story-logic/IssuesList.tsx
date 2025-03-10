import { StoryIssue } from "@/types/story";

interface IssuesListProps {
  issues: StoryIssue[];
  issueType: string;
  isLoading: boolean;
  analysisExists?: boolean;
}

export const IssuesList = ({ issues, issueType, isLoading, analysisExists }: IssuesListProps) => {
  if (!analysisExists) {
    return (
      <div className="text-center text-gray-500 py-8">
        No analysis has been created for this story yet. Use the analysis section above to create one.
      </div>
    );
  }

  const filteredIssues = issues.filter(issue => issue.issue_type === issueType);

  if (isLoading) {
    return (
      <div className="text-center text-gray-500 py-8">
        Loading issues...
      </div>
    );
  }

  if (filteredIssues.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">
        No {issueType.replace(/_/g, " ")} issues found.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {filteredIssues.map((issue) => (
        <div
          key={issue.id}
          className="bg-white p-4 rounded-lg border shadow-sm"
        >
          <div className="flex justify-between items-start">
            <div>
              <span className="inline-block px-2 py-1 text-xs font-medium rounded bg-gray-100 text-gray-800 mb-2">
                {issue.issue_type.replace(/_/g, " ")}
              </span>
              <p className="text-gray-700">{issue.description}</p>
              {issue.location && (
                <p className="text-sm text-gray-500 mt-1">
                  Location: {issue.location}
                </p>
              )}
              {issue.severity && (
                <p className="text-sm text-gray-500">
                  Severity: {issue.severity}/10
                </p>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};