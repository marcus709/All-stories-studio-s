import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Share, Eye } from "lucide-react";
import { ShareDocumentDialog } from "@/components/community/chat/ShareDocumentDialog";
import { useDocuments } from "@/hooks/useDocuments";
import { useToast } from "@/hooks/use-toast";
import { WYSIWYGEditor } from "@/components/book/WYSIWYGEditor";
import { DocumentInsights } from "./DocumentInsights";
import { DocumentNavigation } from "./DocumentNavigation";
import { RemoteCursor } from "./RemoteCursor";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@supabase/auth-helpers-react";
import { cn } from "@/lib/utils";

const CURSOR_COLORS = [
  "#FF5733", "#33FF57", "#3357FF", "#FF33F5",
  "#33FFF5", "#F5FF33", "#FF3333", "#33FF33"
];

interface DocumentEditorProps {
  document: {
    id: string;
    title: string;
    content: string;
  };
  storyId: string;
  onSave: () => void;
}

interface CursorPosition {
  x: number;
  y: number;
  userId: string;
  username: string;
}

export const DocumentEditor = ({ document, storyId, onSave }: DocumentEditorProps) => {
  const [content, setContent] = useState(document.content);
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showInsights, setShowInsights] = useState(false);
  const [isNavigationCollapsed, setIsNavigationCollapsed] = useState(false);
  const [cursors, setCursors] = useState<Record<string, CursorPosition>>({});
  const { updateDocument } = useDocuments(storyId);
  const { toast } = useToast();
  const session = useSession();

  useEffect(() => {
    if (!document.id || !session?.user) return;

    const channel = supabase.channel(`document:${document.id}`)
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState();
        const newCursors: Record<string, CursorPosition> = {};
        
        Object.keys(state).forEach((key) => {
          const presence = state[key][0] as any;
          if (presence.userId !== session.user?.id) {
            newCursors[presence.userId] = presence;
          }
        });
        
        setCursors(newCursors);
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          const editorElement = document.querySelector('.ProseMirror');
          if (!editorElement) return;

          const trackCursor = (e: MouseEvent) => {
            const rect = editorElement.getBoundingClientRect();
            channel.track({
              userId: session.user?.id,
              username: session.user?.email?.split('@')[0] || 'Anonymous',
              x: e.clientX - rect.left,
              y: e.clientY - rect.top,
            });
          };

          editorElement.addEventListener('mousemove', trackCursor);
          return () => {
            editorElement.removeEventListener('mousemove', trackCursor);
          };
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [document.id, session?.user]);

  const handleContentChange = (newContent: string) => {
    setContent(newContent);
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await updateDocument({
        id: document.id,
        content: content
      });
      
      toast({
        title: "Success",
        description: "Document saved successfully",
      });
      
      onSave();
    } catch (error) {
      console.error("Error saving document:", error);
      toast({
        title: "Error",
        description: "Failed to save document",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="h-full flex flex-col bg-white">
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="text-lg font-semibold">{document.title}</h2>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={() => setShowInsights(!showInsights)}
          >
            <Eye className="h-4 w-4" />
            Insights
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={() => setIsShareDialogOpen(true)}
          >
            <Share className="h-4 w-4" />
            Share
          </Button>
          <Button 
            size="sm" 
            onClick={handleSave}
            disabled={isSaving}
            className="bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600"
          >
            {isSaving ? "Saving..." : "Save"}
          </Button>
        </div>
      </div>

      <div className="flex-1 flex">
        <DocumentNavigation 
          content={content}
          isCollapsed={isNavigationCollapsed}
          onToggleCollapse={() => setIsNavigationCollapsed(!isNavigationCollapsed)}
        />
        
        <ScrollArea className="flex-1 relative">
          <div className="max-w-4xl mx-auto p-8">
            <WYSIWYGEditor
              content={content}
              onChange={handleContentChange}
              className="min-h-[calc(100vh-12rem)] bg-white"
            />
            {Object.entries(cursors).map(([userId, cursor], index) => (
              <RemoteCursor
                key={userId}
                color={CURSOR_COLORS[index % CURSOR_COLORS.length]}
                position={{ x: cursor.x, y: cursor.y }}
                username={cursor.username}
              />
            ))}
          </div>
        </ScrollArea>

        {showInsights && (
          <div className="w-[400px] border-l">
            <DocumentInsights 
              content={content}
              onReplaceWord={() => {}}
              onJumpToLocation={() => {}}
            />
          </div>
        )}
      </div>

      <ShareDocumentDialog
        document={document}
        open={isShareDialogOpen}
        onOpenChange={setIsShareDialogOpen}
      />
    </div>
  );
};