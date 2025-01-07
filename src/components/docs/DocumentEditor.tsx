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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Label } from "../ui/label";

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
  const { session } = useSessionContext();

  useEffect(() => {
    if (document) {
      setTitle(document.title);
      setContent(document.content || "");
      setTimePeriod(document.time_period || "");
    }
  }, [document]);

  const handleSave = async () => {
    try {
      setIsSaving(true);
      console.log("Saving document with content:", content);

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

      console.log("Saved document:", data);

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
        body: { timePeriod },
      });

      if (error) throw error;

      const { contextInfo } = data;
      
      toast({
        title: "Time Period Context",
        description: (
          <div className="mt-2 space-y-2">
            <p><strong>Language:</strong> {contextInfo.language}</p>
            <p><strong>Culture:</strong> {contextInfo.culture}</p>
            <p><strong>Environment:</strong> {contextInfo.environment}</p>
          </div>
        ),
        duration: 10000,
      });

      // Save the context details to the document
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
      <div className="flex justify-end gap-2">
        <Dialog open={isTimeDialogOpen} onOpenChange={setIsTimeDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="gap-2">
              <Clock className="w-4 h-4" />
              Set Time Period
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Set Time Period</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="timePeriod">Time Period</Label>
                <Input
                  id="timePeriod"
                  placeholder="e.g., Victorian Era, Ancient Rome, 1920s"
                  value={timePeriod}
                  onChange={(e) => setTimePeriod(e.target.value)}
                />
              </div>
              <Button 
                onClick={getTimeContext}
                disabled={isLoadingContext}
                className="w-full"
              >
                {isLoadingContext ? "Getting Context..." : "Get Historical Context"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
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