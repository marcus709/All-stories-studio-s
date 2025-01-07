import { useState, useEffect } from "react";
import { Document } from "@/types/story";

export function useDocumentState(document: Document | undefined) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [timePeriod, setTimePeriod] = useState("");
  const [analysisResults, setAnalysisResults] = useState<any>(null);
  const [documentId, setDocumentId] = useState<string | undefined>(undefined);

  // Reset state when switching documents
  useEffect(() => {
    if (document?.id !== documentId) {
      setDocumentId(document?.id);
      setTitle(document?.title ?? "");
      setContent(document?.content ?? "");
      setTimePeriod(document?.time_period ?? "");
      setAnalysisResults(document?.time_period_details ?? null);
    }
  }, [document?.id, documentId]);

  return {
    title,
    setTitle,
    content,
    setContent,
    timePeriod,
    setTimePeriod,
    analysisResults,
    setAnalysisResults,
    documentId
  };
}