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
      className="absolute z-50 flex flex-col gap-2 p-4 bg-black/80 backdrop-blur-sm rounded-xl shadow-lg border border-purple-500/20"
      style={{
        top: `${top}px`,
        left: `${left}px`,
      }}
    >
      <Button
        variant="ghost"
        size="sm"
        className="rounded-lg bg-purple-500/10 text-purple-200 hover:bg-purple-500/20 hover:text-purple-100 transition-colors flex items-center gap-1.5 text-xs font-medium px-3 w-full justify-start"
        onClick={() => handleSuggestion('Improve')}
        disabled={isLoading}
      >
        <Wand2 className="h-3.5 w-3.5" />
        Improve
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className="rounded-lg bg-blue-500/10 text-blue-200 hover:bg-blue-500/20 hover:text-blue-100 transition-colors flex items-center gap-1.5 text-xs font-medium px-3 w-full justify-start"
        onClick={() => handleSuggestion('Shorten')}
        disabled={isLoading}
      >
        <Minimize2 className="h-3.5 w-3.5" />
        Shorten
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className="rounded-lg bg-pink-500/10 text-pink-200 hover:bg-pink-500/20 hover:text-pink-100 transition-colors flex items-center gap-1.5 text-xs font-medium px-3 w-full justify-start"
        onClick={() => handleSuggestion('Enhance readability of')}
        disabled={isLoading}
      >
        <BookOpen className="h-3.5 w-3.5" />
        Enhance
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className="rounded-lg bg-orange-500/10 text-orange-200 hover:bg-orange-500/20 hover:text-orange-100 transition-colors flex items-center gap-1.5 text-xs font-medium px-3 w-full justify-start"
        onClick={() => handleSuggestion('Simplify')}
        disabled={isLoading}
      >
        <Scissors className="h-3.5 w-3.5" />
        Simplify
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className="rounded-lg bg-green-500/10 text-green-200 hover:bg-green-500/20 hover:text-green-100 transition-colors flex items-center gap-1.5 text-xs font-medium px-3 w-full justify-start"
        onClick={() => handleSuggestion('Lengthen')}
        disabled={isLoading}
      >
        <Maximize2 className="h-3.5 w-3.5" />
        Lengthen
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className="rounded-lg bg-indigo-500/10 text-indigo-200 hover:bg-indigo-500/20 hover:text-indigo-100 transition-colors flex items-center gap-1.5 text-xs font-medium px-3 w-full justify-start"
        onClick={() => handleSuggestion('Fix grammar in')}
        disabled={isLoading}
      >
        <SpellCheck2 className="h-3.5 w-3.5" />
        Grammar
      </Button>
    </div>
  );
}