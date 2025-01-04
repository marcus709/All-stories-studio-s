import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface FocusAreaSelectProps {
  value: string;
  onChange: (value: string) => void;
}

export function FocusAreaSelect({ value, onChange }: FocusAreaSelectProps) {
  return (
    <div className="space-y-2">
      <Label>Focus Area</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue placeholder="Select focus area" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="character_development">Character Development</SelectItem>
          <SelectItem value="plot_twists">Plot Twists</SelectItem>
          <SelectItem value="dialogue">Dialogue</SelectItem>
          <SelectItem value="world_building">World-Building</SelectItem>
          <SelectItem value="conflict_resolution">Conflict Resolution</SelectItem>
          <SelectItem value="timeline">Timeline/Structure</SelectItem>
        </SelectContent>
      </Select>
      <p className="text-sm text-gray-500">Select which aspect of the story the AI should focus on</p>
    </div>
  );
}