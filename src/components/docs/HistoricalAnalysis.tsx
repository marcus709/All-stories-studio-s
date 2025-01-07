import { Clock } from "lucide-react";

interface HistoricalAnalysisProps {
  isLoading: boolean;
  results: {
    language?: string;
    culture?: string;
    environment?: string;
  } | null;
}

export function HistoricalAnalysis({ isLoading, results }: HistoricalAnalysisProps) {
  if (!isLoading && !results) return null;

  return (
    <div className="bg-purple-50 rounded-lg p-6 relative">
      <h3 className="text-xl font-semibold text-purple-900 mb-4">Historical Analysis</h3>
      {isLoading ? (
        <div className="flex items-center gap-2 text-purple-600">
          <Clock className="h-5 w-5 animate-spin" />
          <span>Analyzing historical context...</span>
        </div>
      ) : (
        <div className="prose prose-purple max-w-none space-y-4">
          <div>
            <h4 className="text-lg font-semibold text-purple-800">Language Analysis</h4>
            <p className="text-purple-700">{results?.language}</p>
          </div>
          <div>
            <h4 className="text-lg font-semibold text-purple-800">Cultural Context</h4>
            <p className="text-purple-700">{results?.culture}</p>
          </div>
          <div>
            <h4 className="text-lg font-semibold text-purple-800">Environmental Details</h4>
            <p className="text-purple-700">{results?.environment}</p>
          </div>
        </div>
      )}
    </div>
  );
}