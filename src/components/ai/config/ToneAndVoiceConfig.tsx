import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";

interface ToneAndVoiceConfigProps {
  tone: string;
  pointOfView: string;
  onToneChange: (value: string) => void;
  onPovChange: (value: string) => void;
}

export function ToneAndVoiceConfig({ tone, pointOfView, onToneChange, onPovChange }: ToneAndVoiceConfigProps) {
  const [customTone, setCustomTone] = useState("");
  const [customPov, setCustomPov] = useState("");
  const isCustomTone = tone === "custom";
  const isCustomPov = pointOfView === "custom";

  // Update parent only when user stops typing for tone
  useEffect(() => {
    if (isCustomTone && customTone) {
      const timeoutId = setTimeout(() => {
        onToneChange(customTone);
      }, 500);
      return () => clearTimeout(timeoutId);
    }
  }, [customTone, isCustomTone, onToneChange]);

  // Update parent only when user stops typing for POV
  useEffect(() => {
    if (isCustomPov && customPov) {
      const timeoutId = setTimeout(() => {
        onPovChange(customPov);
      }, 500);
      return () => clearTimeout(timeoutId);
    }
  }, [customPov, isCustomPov, onPovChange]);

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Tone</Label>
        <Select 
          value={isCustomTone ? "custom" : tone} 
          onValueChange={(val) => {
            if (val !== "custom") {
              setCustomTone("");
              onToneChange(val);
            } else {
              onToneChange("custom");
            }
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select tone" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="custom">Custom Tone</SelectItem>
            <SelectItem value="formal">Formal</SelectItem>
            <SelectItem value="casual">Casual</SelectItem>
            <SelectItem value="dramatic">Dramatic</SelectItem>
            <SelectItem value="whimsical">Whimsical</SelectItem>
            <SelectItem value="dark">Dark/Serious</SelectItem>
          </SelectContent>
        </Select>
        {isCustomTone && (
          <Input
            placeholder="Describe your custom tone..."
            value={customTone}
            onChange={(e) => setCustomTone(e.target.value)}
            className="mt-2"
          />
        )}
      </div>
      <div className="space-y-2">
        <Label>Point of View</Label>
        <Select 
          value={isCustomPov ? "custom" : pointOfView} 
          onValueChange={(val) => {
            if (val !== "custom") {
              setCustomPov("");
              onPovChange(val);
            } else {
              onPovChange("custom");
            }
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select point of view" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="custom">Custom Point of View</SelectItem>
            <SelectItem value="neutral">Neutral</SelectItem>
            <SelectItem value="protagonist">Protagonist's Perspective</SelectItem>
            <SelectItem value="antagonist">Antagonist's Perspective</SelectItem>
            <SelectItem value="omniscient">Omniscient Narrator</SelectItem>
          </SelectContent>
        </Select>
        {isCustomPov && (
          <Input
            placeholder="Describe your custom point of view..."
            value={customPov}
            onChange={(e) => setCustomPov(e.target.value)}
            className="mt-2"
          />
        )}
      </div>
    </div>
  );
}