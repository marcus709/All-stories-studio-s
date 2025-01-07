import { StoryIssue } from "@/types/story";
import { AlertTriangle, Clock, Users, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface AnalysisResultsProps {
  issues: StoryIssue[];
  isLoading: boolean;
  analysisExists?: boolean;
}

export const AnalysisResults = ({ issues, isLoading, analysisExists }: AnalysisResultsProps) => {
  const issueTypes = [
    { 
      type: "plot_hole", 
      label: "Plot Holes",
      icon: AlertTriangle,
      color: "text-yellow-500 bg-yellow-50",
      borderColor: "border-yellow-200"
    },
    { 
      type: "timeline_inconsistency", 
      label: "Timeline Issues",
      icon: Clock,
      color: "text-blue-500 bg-blue-50",
      borderColor: "border-blue-200"
    },
    { 
      type: "pov_confusion", 
      label: "POV Confusion",
      icon: Users,
      color: "text-purple-500 bg-purple-50",
      borderColor: "border-purple-200"
    },
    { 
      type: "character_inconsistency", 
      label: "Character Inconsistencies",
      icon: AlertCircle,
      color: "text-red-500 bg-red-50",
      borderColor: "border-red-200"
    }
  ];

  if (!analysisExists) {
    return (
      <div className="text-center text-gray-500 py-12 bg-white/50 backdrop-blur-sm rounded-lg border shadow-sm">
        No analysis has been created for this story yet. Use the analysis section above to create one.
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="text-center text-gray-500 py-12 bg-white/50 backdrop-blur-sm rounded-lg border shadow-sm">
        <Clock className="h-6 w-6 animate-spin mx-auto mb-2" />
        Analyzing story...
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {issueTypes.map((issueType) => {
        const typeIssues = issues.filter(issue => issue.issue_type === issueType.type);
        const Icon = issueType.icon;
        
        return (
          <div 
            key={issueType.type}
            className={cn(
              "p-4 rounded-lg border transition-all hover:shadow-md",
              issueType.borderColor,
              typeIssues.length > 0 ? "bg-white/50 backdrop-blur-sm" : "bg-gray-50/50"
            )}
          >
            <div className="flex items-center gap-2 mb-3">
              <div className={cn("p-2 rounded-lg", issueType.color)}>
                <Icon className="h-4 w-4" />
              </div>
              <h3 className="font-medium">{issueType.label}</h3>
            </div>
            
            {typeIssues.length > 0 ? (
              <div className="space-y-2">
                {typeIssues.map((issue) => (
                  <div 
                    key={issue.id} 
                    className="text-sm text-gray-600 border-l-2 pl-3 py-1 hover:bg-gray-50/50 rounded-r transition-colors"
                    style={{ borderColor: issueType.color.split(" ")[0].replace("text", "border") }}
                  >
                    {issue.description}
                    {issue.location && (
                      <span className="block text-xs text-gray-500 mt-1">
                        Location: {issue.location}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">
                No {issueType.label.toLowerCase()} found
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
};