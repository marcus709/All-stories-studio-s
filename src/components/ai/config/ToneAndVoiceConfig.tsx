import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { useState } from "react";

interface ToneAndVoiceConfigProps {
  tone: string;
  pointOfView: string;
  onToneChange: (value: string) => void;
  onPovChange: (value: string) => void;
}

export function ToneAndVoiceConfig({ tone, pointOfView, onToneChange, onPovChange }: ToneAndVoiceConfigProps) {
  const [customTone, setCustomTone] = useState("");
  const [customPov, setCustomPov] = useState("");
  const [isEditingTone, setIsEditingTone] = useState(false);
  const [isEditingPov, setIsEditingPov] = useState(false);
  
  const isCustomTone = tone.startsWith("custom:");
  const isCustomPov = pointOfView.startsWith("custom:");
  const displayTone = isCustomTone ? tone.replace("custom:", "") : tone;
  const displayPov = isCustomPov ? pointOfView.replace("custom:", "") : pointOfView;

  const handleCustomToneSave = () => {
    if (customTone.trim()) {
      onToneChange(`custom:${customTone}`);
      setIsEditingTone(false);
    }
  };

  const handleCustomPovSave = () => {
    if (customPov.trim()) {
      onPovChange(`custom:${customPov}`);
      setIsEditingPov(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Tone</Label>
        <Select 
          value={isCustomTone ? "custom" : tone}
          onValueChange={(val) => {
            if (val === "custom") {
              setIsEditingTone(true);
              setCustomTone("");
            } else {
              onToneChange(val);
              setIsEditingTone(false);
            }
          }}
          open={isEditingTone ? true : undefined}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select tone">
              {isCustomTone ? displayTone : undefined}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="custom">
              {isEditingTone ? (
                <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                  <Input
                    autoFocus
                    value={customTone}
                    onChange={(e) => setCustomTone(e.target.value)}
                    className="w-[180px]"
                    placeholder="Describe your custom tone..."
                  />
                  <Button 
                    size="sm"
                    onClick={handleCustomToneSave}
                    disabled={!customTone.trim()}
                  >
                    <Check className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                "Custom Tone"
              )}
            </SelectItem>
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
        <Select 
          value={isCustomPov ? "custom" : pointOfView}
          onValueChange={(val) => {
            if (val === "custom") {
              setIsEditingPov(true);
              setCustomPov("");
            } else {
              onPovChange(val);
              setIsEditingPov(false);
            }
          }}
          open={isEditingPov ? true : undefined}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select point of view">
              {isCustomPov ? displayPov : undefined}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="custom">
              {isEditingPov ? (
                <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                  <Input
                    autoFocus
                    value={customPov}
                    onChange={(e) => setCustomPov(e.target.value)}
                    className="w-[180px]"
                    placeholder="Describe your custom point of view..."
                  />
                  <Button 
                    size="sm"
                    onClick={handleCustomPovSave}
                    disabled={!customPov.trim()}
                  >
                    <Check className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                "Custom Point of View"
              )}
            </SelectItem>
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