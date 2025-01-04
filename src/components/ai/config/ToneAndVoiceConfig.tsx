import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ToneAndVoiceConfigProps {
  tone: string;
  pointOfView: string;
  onToneChange: (value: string) => void;
  onPovChange: (value: string) => void;
}

export function ToneAndVoiceConfig({ tone, pointOfView, onToneChange, onPovChange }: ToneAndVoiceConfigProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Tone</Label>
        <Select value={tone} onValueChange={onToneChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select tone" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="formal">Formal</SelectItem>
            <SelectItem value="casual">Casual</SelectItem>
            <SelectItem value="dramatic">Dramatic</SelectItem>
            <SelectItem value="whimsical">Whimsical</SelectItem>
            <SelectItem value="dark">Dark/Serious</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label>Point of View</Label>
        <Select value={pointOfView} onValueChange={onPovChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select point of view" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="neutral">Neutral</SelectItem>
            <SelectItem value="protagonist">Protagonist's Perspective</SelectItem>
            <SelectItem value="antagonist">Antagonist's Perspective</SelectItem>
            <SelectItem value="omniscient">Omniscient Narrator</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}