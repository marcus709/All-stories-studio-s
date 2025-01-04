import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";

interface AdvancedConfigProps {
  creativityLevel: number;
  suggestionComplexity: string;
  feedbackCycle: string;
  feedbackFormat: string;
  onCreativityLevelChange: (value: number) => void;
  onSuggestionComplexityChange: (value: string) => void;
  onFeedbackCycleChange: (value: string) => void;
  onFeedbackFormatChange: (value: string) => void;
}

export function AdvancedConfig({
  creativityLevel,
  suggestionComplexity,
  feedbackCycle,
  feedbackFormat,
  onCreativityLevelChange,
  onSuggestionComplexityChange,
  onFeedbackCycleChange,
  onFeedbackFormatChange,
}: AdvancedConfigProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label>AI Creativity Level ({creativityLevel})</Label>
        <Slider
          value={[creativityLevel]}
          onValueChange={(value) => onCreativityLevelChange(value[0])}
          min={1}
          max={10}
          step={1}
          className="py-4"
        />
        <p className="text-sm text-gray-500">
          Higher values make the output more creative but less predictable
        </p>
      </div>

      <div className="space-y-2">
        <Label>Suggestion Complexity</Label>
        <Select value={suggestionComplexity} onValueChange={onSuggestionComplexityChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select complexity" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="simple">Simple</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="complex">Complex</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Feedback Cycle</Label>
        <Select value={feedbackCycle} onValueChange={onFeedbackCycleChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select feedback cycle" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="suggest_and_wait">Suggest and Wait</SelectItem>
            <SelectItem value="auto_iterate">Auto-iterate</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Feedback Format</Label>
        <Select value={feedbackFormat} onValueChange={onFeedbackFormatChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select feedback format" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="bulleted_list">Bulleted List</SelectItem>
            <SelectItem value="full_scenes">Full Scenes</SelectItem>
            <SelectItem value="diagram">Diagrammatic Breakdown</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}