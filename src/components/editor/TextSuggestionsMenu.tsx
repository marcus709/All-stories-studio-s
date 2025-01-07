import React from 'react';
import { Editor } from '@tiptap/react';
import { Button } from '../ui/button';
import {
  Wand2,
  BookOpen,
  Scissors,
  Minimize2,
  Maximize2,
  SpellCheck2,
} from 'lucide-react';
import { useAI } from '@/hooks/useAI';
import { useToast } from '../ui/use-toast';

interface TextSuggestionsMenuProps {
  editor: Editor;
  isOpen: boolean;
  top: number;
  left: number;
}

export function TextSuggestionsMenu({ editor, isOpen, top, left }: TextSuggestionsMenuProps) {
  const { generateContent, isLoading } = useAI();
  const { toast } = useToast();

  if (!isOpen) return null;

  const getSelectedText = () => {
    return editor?.state.doc.cut(
      editor.state.selection.from,
      editor.state.selection.to
    ).textContent;
  };

  const handleSuggestion = async (type: string) => {
    const selectedText = getSelectedText();
    if (!selectedText) return;

    try {
      const prompt = `${type} the following text while maintaining its context and meaning: ${selectedText}`;
      const improvedText = await generateContent(prompt, 'suggestions');
      
      if (improvedText) {
        editor
          .chain()
          .focus()
          .setTextSelection({
            from: editor.state.selection.from,
            to: editor.state.selection.to,
          })
          .insertContent(improvedText)
          .run();

        toast({
          title: "Success",
          description: "Text has been updated",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate suggestion",
        variant: "destructive",
      });
    }
  };

  return (
    <div
      className="absolute z-50 bg-white rounded-lg shadow-lg border p-1 flex gap-1"
      style={{
        top: `${top}px`,
        left: `${left}px`,
      }}
    >
      <Button
        variant="ghost"
        size="sm"
        className="flex items-center gap-1 text-xs"
        onClick={() => handleSuggestion('Improve')}
        disabled={isLoading}
      >
        <Wand2 className="h-3 w-3" />
        Improve
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className="flex items-center gap-1 text-xs"
        onClick={() => handleSuggestion('Enhance readability of')}
        disabled={isLoading}
      >
        <BookOpen className="h-3 w-3" />
        Enhance
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className="flex items-center gap-1 text-xs"
        onClick={() => handleSuggestion('Shorten')}
        disabled={isLoading}
      >
        <Minimize2 className="h-3 w-3" />
        Shorten
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className="flex items-center gap-1 text-xs"
        onClick={() => handleSuggestion('Simplify')}
        disabled={isLoading}
      >
        <Scissors className="h-3 w-3" />
        Simplify
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className="flex items-center gap-1 text-xs"
        onClick={() => handleSuggestion('Lengthen')}
        disabled={isLoading}
      >
        <Maximize2 className="h-3 w-3" />
        Lengthen
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className="flex items-center gap-1 text-xs"
        onClick={() => handleSuggestion('Fix grammar in')}
        disabled={isLoading}
      >
        <SpellCheck2 className="h-3 w-3" />
        Grammar
      </Button>
    </div>
  );
}