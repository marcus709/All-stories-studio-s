import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { useState, useEffect } from "react";

interface FocusAreaSelectProps {
  value: string;
  onChange: (value: string) => void;
}

export function FocusAreaSelect({ value, onChange }: FocusAreaSelectProps) {
  const [customFocusArea, setCustomFocusArea] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const isCustom = value.startsWith("custom:");
  const displayValue = isCustom ? value.replace("custom:", "") : value;

  const handleCustomSave = () => {
    if (customFocusArea.trim()) {
      onChange(`custom:${customFocusArea}`);
      setIsEditing(false);
    }
  };

  const handleSelectChange = (val: string) => {
    if (val === "custom") {
      setIsEditing(true);
      setCustomFocusArea("");
    } else {
      onChange(val);
      setIsEditing(false);
    }
  };

  return (
    <div className="space-y-2">
      <Label>Focus Area</Label>
      <Select 
        value={isCustom ? "custom" : value}
        onValueChange={handleSelectChange}
        open={isEditing ? true : undefined}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select focus area">
            {isCustom ? displayValue : undefined}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="custom">
            {isEditing ? (
              <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                <Input
                  autoFocus
                  value={customFocusArea}
                  onChange={(e) => setCustomFocusArea(e.target.value)}
                  className="w-[180px]"
                  placeholder="Describe your custom focus area..."
                />
                <Button 
                  size="sm"
                  onClick={handleCustomSave}
                  disabled={!customFocusArea.trim()}
                >
                  <Check className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              "Custom Focus Area"
            )}
          </SelectItem>
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