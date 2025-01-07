import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { EmotionChart } from "./emotion-tracker/EmotionChart";
import { DocumentSelector } from "./emotion-tracker/DocumentSelector";

interface EmotionTrackerProps {
  plotEvents: any[];
  selectedDocument: string | null;
  onDocumentSelect: (id: string) => void;
}

export const EmotionTracker = ({ plotEvents, selectedDocument, onDocumentSelect }: EmotionTrackerProps) => {
  const [showDocumentSelector, setShowDocumentSelector] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: documents } = useQuery({
    queryKey: ["documents"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("documents")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const { data: emotions, isLoading: isLoadingEmotions } = useQuery({
    queryKey: ["plotEmotions", selectedDocument],
    queryFn: async () => {
      if (!selectedDocument) return null;
      
      const { data, error } = await supabase
        .from("plot_emotions")
        .select("*")
        .eq("document_id", selectedDocument);
      if (error) throw error;
      return data;
    },
    enabled: !!selectedDocument,
  });

  const analyzeEmotionsMutation = useMutation({
    mutationFn: async () => {
      if (!selectedDocument) return;
      
      const response = await supabase.functions.invoke('analyze-document-emotions', {
        body: { 
          documentId: selectedDocument,
          plotEvents,
        },
      });

      if (response.error) throw response.error;
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["plotEmotions"] });
      toast({
        title: "Success",
        description: "Document analyzed successfully",
      });
    },
    onError: (error) => {
      console.error("Analysis error:", error);
      toast({
        title: "Error",
        description: "Failed to analyze document. Please try again.",
        variant: "destructive",
      });
    },
  });

  const emotionData = plotEvents.map((event) => {
    const eventEmotion = emotions?.find((e) => e.plot_event_id === event.id);
    return {
      stage: event.stage,
      characterEmotion: eventEmotion?.intensity || 0,
      readerEmotion: eventEmotion?.intensity || 0,
    };
  });

  const handleDocumentSelect = async (docId: string) => {
    onDocumentSelect(docId);
    setShowDocumentSelector(false);
    analyzeEmotionsMutation.mutate();
  };

  const handleUploadComplete = () => {
    toast({
      title: "Success",
      description: "Document uploaded successfully",
    });
    setShowDocumentSelector(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Emotional Arc</h3>
        <DocumentSelector
          documents={documents || []}
          showDocumentSelector={showDocumentSelector}
          setShowDocumentSelector={setShowDocumentSelector}
          handleDocumentSelect={handleDocumentSelect}
          handleUploadComplete={handleUploadComplete}
        />
      </div>

      <div className="relative w-full aspect-[2/1] min-h-[400px] bg-violet-50/50 rounded-lg p-4">
        <EmotionChart
          isLoading={isLoadingEmotions || analyzeEmotionsMutation.isPending}
          emotions={emotions}
          emotionData={emotionData}
          selectedDocument={selectedDocument}
        />
      </div>
    </div>
  );
};