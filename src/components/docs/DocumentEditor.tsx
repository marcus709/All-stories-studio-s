import React, { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Document } from "@/types/story";
import { RichTextEditor } from "../editor/RichTextEditor";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useQueryClient } from "@tanstack/react-query";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { Clock, Save } from "lucide-react";
import { TimeAnalysisDialog } from "./TimeAnalysisDialog";

interface DocumentEditorProps {
  document?: Document;
  storyId: string;
  onSave?: () => void;
}

export function DocumentEditor({ document, storyId, onSave }: DocumentEditorProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [title, setTitle] = useState(document?.title || "");
  const [content, setContent] = useState(document?.content || "");
  const [isSaving, setIsSaving] = useState(false);
  const [timePeriod, setTimePeriod] = useState(document?.time_period || "");
  const [isTimeDialogOpen, setIsTimeDialogOpen] = useState(false);
  const [isLoadingContext, setIsLoadingContext] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<any>(document?.time_period_details || null);
  const { session } = useSessionContext();

  useEffect(() => {
    if (document) {
      setTitle(document.title);
      setContent(document.content || "");
      setTimePeriod(document.time_period || "");
      setAnalysisResults(document.time_period_details);
    }
  }, [document]);

  const handleSave = async () => {
    try {
      setIsSaving(true);

      if (!title.trim()) {
        throw new Error("Title is required");
      }

      if (!session?.user?.id) {
        throw new Error("User must be logged in to save documents");
      }

      const { data, error } = document?.id 
        ? await supabase
            .from("documents")
            .update({
              title,
              content,
              time_period: timePeriod,
              updated_at: new Date().toISOString()
            })
            .eq("id", document.id)
            .select()
            .single()
        : await supabase
            .from("documents")
            .insert({
              title,
              content,
              time_period: timePeriod,
              story_id: storyId,
              user_id: session.user.id
            })
            .select()
            .single();

      if (error) throw error;

      toast({
        title: "Success",
        description: "Document saved successfully",
      });

      queryClient.invalidateQueries({ queryKey: ["documents", storyId] });
      onSave?.();
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
    <div className="space-y-4">
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

      {(isLoadingContext || analysisResults) && (
        <div className="bg-purple-50 rounded-lg p-6 relative">
          <h3 className="text-xl font-semibold text-purple-900 mb-4">Historical Analysis</h3>
          {isLoadingContext ? (
            <div className="flex items-center gap-2 text-purple-600">
              <Clock className="h-5 w-5 animate-spin" />
              <span>Analyzing historical context...</span>
            </div>
          ) : (
            <div className="prose prose-purple max-w-none space-y-4">
              <div>
                <h4 className="text-lg font-semibold text-purple-800">Language Analysis</h4>
                <p className="text-purple-700">{analysisResults?.language}</p>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-purple-800">Cultural Context</h4>
                <p className="text-purple-700">{analysisResults?.culture}</p>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-purple-800">Environmental Details</h4>
                <p className="text-purple-700">{analysisResults?.environment}</p>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="flex justify-end gap-2">
        <TimeAnalysisDialog
          isOpen={isTimeDialogOpen}
          onOpenChange={setIsTimeDialogOpen}
          timePeriod={timePeriod}
          setTimePeriod={setTimePeriod}
          onAnalyze={getTimeContext}
          isLoading={isLoadingContext}
        />
        <Button variant="outline" onClick={() => setIsTimeDialogOpen(true)} className="gap-2">
          <Clock className="w-4 h-4" />
          Analyze Time Period
        </Button>
        <Button
          onClick={handleSave}
          disabled={isSaving}
          className="bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600 gap-2"
        >
          <Save className="w-4 h-4" />
          {isSaving ? "Saving..." : "Save Document"}
        </Button>
      </div>
    </div>
  );
}