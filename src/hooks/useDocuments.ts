import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "./use-toast";
import { Document } from "@/types/story";
import { parseDocumentContent, extractTextFromFile } from "@/utils/documentUtils";
import { Json } from "@/integrations/supabase/types";

export const useDocuments = (storyId?: string) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: documents, isLoading, error } = useQuery({
    queryKey: ["documents", storyId],
    queryFn: async () => {
      if (!storyId) return [];
      
      const { data, error } = await supabase
        .from("documents")
        .select("*")
        .eq("story_id", storyId)
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Convert the data to match our Document type
      return (data as any[]).map(doc => ({
        ...doc,
        content: Array.isArray(doc.content) ? doc.content : []
      })) as Document[];
    },
    enabled: !!storyId,
  });

  const uploadMutation = useMutation({
    mutationFn: async ({ file, storyId }: { file: File; storyId: string }) => {
      const content = await extractTextFromFile(file);
      const parsedContent = parseDocumentContent(content);
      
      const { data, error } = await supabase
        .from("documents")
        .insert({
          title: file.name,
          content: [{ type: "text", content: parsedContent }],
          story_id: storyId,
          user_id: (await supabase.auth.getUser()).data.user?.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["documents"] });
      toast({
        title: "Success",
        description: "Document uploaded successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to upload document",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, content }: { id: string; content: string }) => {
      const parsedContent = parseDocumentContent(content);
      
      const { data, error } = await supabase
        .from("documents")
        .update({
          content: [{ type: "text", content: parsedContent }],
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["documents"] });
      toast({
        title: "Success",
        description: "Document updated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update document",
        variant: "destructive",
      });
    },
  });

  return {
    documents,
    isLoading,
    error,
    uploadDocument: uploadMutation.mutate,
    updateDocument: updateMutation.mutate,
    isUploading: uploadMutation.isPending,
    isUpdating: updateMutation.isPending,
  };
};