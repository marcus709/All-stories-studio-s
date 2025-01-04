import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ResponseStyleSelectProps {
  value: string;
  onChange: (value: string) => void;
}

export function ResponseStyleSelect({ value, onChange }: ResponseStyleSelectProps) {
  return (
    <div className="space-y-2">
      <Label>Response Style</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue placeholder="Select response style" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="concise">Concise</SelectItem>
          <SelectItem value="descriptive">Descriptive</SelectItem>
          <SelectItem value="analytical">Analytical</SelectItem>
          <SelectItem value="creative">Creative</SelectItem>
          <SelectItem value="humor">Humor-infused</SelectItem>
        </SelectContent>
      </Select>
      <p className="text-sm text-gray-500">Choose how detailed or creative the AI's responses should be</p>
    </div>
  );
}