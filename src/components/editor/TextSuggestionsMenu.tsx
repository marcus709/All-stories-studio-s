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
      className="absolute z-50 flex gap-2 p-2"
      style={{
        top: `${top}px`,
        left: `${left}px`,
      }}
    >
      <Button
        variant="ghost"
        size="sm"
        className="rounded-full bg-purple-50 text-purple-600 hover:bg-purple-100 transition-colors flex items-center gap-1.5 text-xs font-medium px-3"
        onClick={() => handleSuggestion('Improve')}
        disabled={isLoading}
      >
        <Wand2 className="h-3.5 w-3.5" />
        Improve
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className="rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors flex items-center gap-1.5 text-xs font-medium px-3"
        onClick={() => handleSuggestion('Enhance readability of')}
        disabled={isLoading}
      >
        <BookOpen className="h-3.5 w-3.5" />
        Enhance
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className="rounded-full bg-pink-50 text-pink-600 hover:bg-pink-100 transition-colors flex items-center gap-1.5 text-xs font-medium px-3"
        onClick={() => handleSuggestion('Shorten')}
        disabled={isLoading}
      >
        <Minimize2 className="h-3.5 w-3.5" />
        Shorten
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className="rounded-full bg-orange-50 text-orange-600 hover:bg-orange-100 transition-colors flex items-center gap-1.5 text-xs font-medium px-3"
        onClick={() => handleSuggestion('Simplify')}
        disabled={isLoading}
      >
        <Scissors className="h-3.5 w-3.5" />
        Simplify
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className="rounded-full bg-green-50 text-green-600 hover:bg-green-100 transition-colors flex items-center gap-1.5 text-xs font-medium px-3"
        onClick={() => handleSuggestion('Lengthen')}
        disabled={isLoading}
      >
        <Maximize2 className="h-3.5 w-3.5" />
        Lengthen
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className="rounded-full bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition-colors flex items-center gap-1.5 text-xs font-medium px-3"
        onClick={() => handleSuggestion('Fix grammar in')}
        disabled={isLoading}
      >
        <SpellCheck2 className="h-3.5 w-3.5" />
        Grammar
      </Button>
    </div>
  );
}