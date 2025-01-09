import { Slider } from "@/components/ui/slider";

interface TimelineProps {
  position: number;
  onPositionChange: (value: number[]) => void;
}

export function Timeline({ position, onPositionChange }: TimelineProps) {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm">
      <div className="text-sm font-medium mb-2">Timeline</div>
      <Slider
        value={[position]}
        onValueChange={onPositionChange}
        max={100}
        step={1}
        className="w-full"
      />
      <div className="flex justify-between text-sm text-gray-500 mt-1">
        <span>Story Start</span>
        <span>Current Event</span>
        <span>Story End</span>
      </div>
    </div>
  );
}