import { useState } from "react";
import { RichTextEditor } from "./editor/RichTextEditor";
import { TextSuggestionsMenu } from "./editor/TextSuggestionsMenu";
import { useToast } from "@/hooks/use-toast";
import { Card } from "./ui/card";

export const BookCreatorView = () => {
  const [content, setContent] = useState("");
  const { toast } = useToast();

  const handleContentChange = (newContent: string) => {
    setContent(newContent);
  };

  const handleSuggestionSelect = (suggestion: string) => {
    toast({
      title: "AI Suggestion",
      description: "Generating suggestion... (This is a placeholder)",
    });
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Book Editor</h1>
        <TextSuggestionsMenu onSuggestionSelect={handleSuggestionSelect} />
      </div>

      <Card className="p-6">
        <RichTextEditor 
          content={content} 
          onChange={handleContentChange} 
        />
      </Card>
    </div>
  );
};