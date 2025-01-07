import React, { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Document } from "@/types/story";
import { RichTextEditor } from "../editor/RichTextEditor";
import { Input } from "../ui/input";
import { useQueryClient } from "@tanstack/react-query";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { TimeAnalysisDialog } from "./TimeAnalysisDialog";
import { HistoricalAnalysis } from "./HistoricalAnalysis";
import { DocumentToolbar } from "./DocumentToolbar";

interface DocumentEditorProps {
  document?: Document;
  storyId: string;
  onSave?: () => void;
}

export function DocumentEditor({ document, storyId, onSave }: DocumentEditorProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isSaving, setIsSaving] = useState(false);
  const [isTimeDialogOpen, setIsTimeDialogOpen] = useState(false);
  const [isLoadingContext, setIsLoadingContext] = useState(false);
  const { session } = useSessionContext();
  
  // Individual state for each document
  const [title, setTitle] = useState(document?.title || "");
  const [content, setContent] = useState(document?.content || "");
  const [timePeriod, setTimePeriod] = useState(document?.time_period || "");
  const [analysisResults, setAnalysisResults] = useState(document?.time_period_details || null);

  // Update state when document changes
  useEffect(() => {
    if (document) {
      setTitle(document.title);
      setContent(document.content || "");
      setTimePeriod(document.time_period || "");
      setAnalysisResults(document.time_period_details || null);
    }
  }, [document?.id]); // Only update when document ID changes

  const handleSave = async () => {
    try {
      setIsSaving(true);

      if (!title.trim()) {
        throw new Error("Title is required");
      }

      if (!session?.user?.id) {
        throw new Error("User must be logged in to save documents");
      }

      const documentData = {
        title,
        content,
        time_period: timePeriod,
        updated_at: new Date().toISOString()
      };

      const { data, error } = document?.id
        ? await supabase
            .from("documents")
            .update(documentData)
            .eq("id", document.id)
            .select()
            .maybeSingle()
        : await supabase
            .from("documents")
            .insert({
              ...documentData,
              story_id: storyId,
              user_id: session.user.id
            })
            .select()
            .maybeSingle();

      if (error) throw error;

      if (data) {
        toast({
          title: "Success",
          description: "Document saved successfully",
        });

        // Only invalidate the specific document query
        if (document?.id) {
          queryClient.invalidateQueries({ 
            queryKey: ["documents", storyId, document.id],
          });
        } else {
          queryClient.invalidateQueries({ 
            queryKey: ["documents", storyId],
          });
        }
        
        onSave?.();
      }
    } catch (error) {
      console.error("Error saving document:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save document",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const getTimeContext = async () => {
    if (!timePeriod) {
      toast({
        title: "Error",
        description: "Please enter a time period first",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoadingContext(true);
      const { data, error } = await supabase.functions.invoke('get-time-period-context', {
        body: { 
          timePeriod,
          documentContent: content 
        },
      });

      if (error) throw error;

      const { contextInfo } = data;
      setAnalysisResults(contextInfo);

      if (document?.id) {
        const { error: updateError } = await supabase
          .from("documents")
          .update({
            time_period_details: contextInfo,
          })
          .eq("id", document.id);

        if (updateError) throw updateError;
      }
    } catch (error) {
      console.error("Error getting time period context:", error);
      toast({
        title: "Error",
        description: "Failed to get time period context",
        variant: "destructive",
      });
    } finally {
      setIsLoadingContext(false);
      setIsTimeDialogOpen(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      <div className="flex-1 overflow-y-auto space-y-4 px-4">
        <Input
          placeholder="Document Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="text-lg font-medium"
        />
        <div className="min-h-[500px] border rounded-lg">
          <RichTextEditor
            content={content}
            onChange={setContent}
            className="min-h-[500px]"
          />
        </div>

        <HistoricalAnalysis 
          isLoading={isLoadingContext}
          results={analysisResults}
        />
      </div>

      <TimeAnalysisDialog
        isOpen={isTimeDialogOpen}
        onOpenChange={setIsTimeDialogOpen}
        timePeriod={timePeriod}
        setTimePeriod={setTimePeriod}
        onAnalyze={getTimeContext}
        isLoading={isLoadingContext}
      />

      <DocumentToolbar
        onSave={handleSave}
        onTimeAnalysis={() => setIsTimeDialogOpen(true)}
        isSaving={isSaving}
      />
    </div>
  );
}