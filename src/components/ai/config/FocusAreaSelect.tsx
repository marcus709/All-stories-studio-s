import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useState } from "react";

interface FocusAreaSelectProps {
  value: string;
  onChange: (value: string) => void;
}

export function FocusAreaSelect({ value, onChange }: FocusAreaSelectProps) {
  const [customFocusArea, setCustomFocusArea] = useState("");
  const isCustom = value === "custom";

  return (
    <div className="space-y-2">
      <Label>Focus Area</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue placeholder="Select focus area" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="custom">Custom Focus Area</SelectItem>
          <SelectItem value="character_development">Character Development</SelectItem>
          <SelectItem value="plot_twists">Plot Twists</SelectItem>
          <SelectItem value="dialogue">Dialogue</SelectItem>
          <SelectItem value="world_building">World-Building</SelectItem>
          <SelectItem value="conflict_resolution">Conflict Resolution</SelectItem>
          <SelectItem value="timeline">Timeline/Structure</SelectItem>
        </SelectContent>
      </Select>
      {isCustom && (
        <Input
          placeholder="Describe your custom focus area..."
          value={customFocusArea}
          onChange={(e) => {
            setCustomFocusArea(e.target.value);
            onChange(e.target.value);
          }}
          className="mt-2"
        />
      )}
      <p className="text-sm text-gray-500">Select which aspect of the story the AI should focus on</p>
    </div>
  );
}