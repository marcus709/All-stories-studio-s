import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useState } from "react";

interface KeywordsConfigProps {
  includeKeywords: string[];
  avoidKeywords: string[];
  onIncludeKeywordsChange: (keywords: string[]) => void;
  onAvoidKeywordsChange: (keywords: string[]) => void;
}

export function KeywordsConfig({
  includeKeywords,
  avoidKeywords,
  onIncludeKeywordsChange,
  onAvoidKeywordsChange,
}: KeywordsConfigProps) {
  const [includeInput, setIncludeInput] = useState("");
  const [avoidInput, setAvoidInput] = useState("");
  const [goalInput, setGoalInput] = useState<string>("");

  const handleAddInclude = () => {
    if (includeInput.trim()) {
      const keyword = includeInput.trim();
      const goal = goalInput.trim() ? parseInt(goalInput.trim()) : undefined;
      
      onIncludeKeywordsChange([...includeKeywords, keyword]);
      setIncludeInput("");
      setGoalInput("");
    }
  };

  const handleAddAvoid = () => {
    if (avoidInput.trim()) {
      onAvoidKeywordsChange([...avoidKeywords, avoidInput.trim()]);
      setAvoidInput("");
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <Label>Keywords to Include</Label>
        <div className="flex gap-2">
          <Input
            value={includeInput}
            onChange={(e) => setIncludeInput(e.target.value)}
            placeholder="Add keyword"
            onKeyPress={(e) => e.key === "Enter" && handleAddInclude()}
            className="flex-1"
          />
          <Input
            type="number"
            value={goalInput}
            onChange={(e) => setGoalInput(e.target.value)}
            placeholder="Goal (optional)"
            onKeyPress={(e) => e.key === "Enter" && handleAddInclude()}
            className="w-32"
          />
          <Button type="button" onClick={handleAddInclude}>Add</Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {includeKeywords.map((keyword, index) => (
            <div key={index} className="flex items-center gap-1 bg-primary/10 px-2 py-1 rounded">
              <span>{keyword}</span>
              <button
                onClick={() => onIncludeKeywordsChange(includeKeywords.filter((_, i) => i !== index))}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      </div>
      <div className="space-y-4">
        <Label>Keywords to Avoid</Label>
        <div className="flex gap-2">
          <Input
            value={avoidInput}
            onChange={(e) => setAvoidInput(e.target.value)}
            placeholder="Add keyword to avoid"
            onKeyPress={(e) => e.key === "Enter" && handleAddAvoid()}
          />
          <Button type="button" onClick={handleAddAvoid}>Add</Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {avoidKeywords.map((keyword, index) => (
            <div key={index} className="flex items-center gap-1 bg-destructive/10 px-2 py-1 rounded">
              <span>{keyword}</span>
              <button
                onClick={() => onAvoidKeywordsChange(avoidKeywords.filter((_, i) => i !== index))}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}