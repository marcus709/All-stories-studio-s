import { Slider } from "@/components/ui/slider";

interface TimelineProps {
  position: number;
  onPositionChange: (value: number[]) => void;
}

export function Timeline({ position, onPositionChange }: TimelineProps) {
  // Define tension points for the gradient
  const tensionPoints = [
    { position: 0, color: "from-red-400" },
    { position: 30, color: "via-red-300" },
    { position: 50, color: "via-green-300" },
    { position: 70, color: "via-green-400" },
    { position: 85, color: "via-blue-300" },
    { position: 100, color: "to-blue-400" },
  ];

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm">
      <div className="text-sm font-medium mb-4 flex justify-between">
        <span>Timeline</span>
        <span className="text-gray-500">Tension Level</span>
      </div>
      
      {/* Tension gradient background */}
      <div className="relative mb-6">
        <div className="absolute inset-0 h-2 rounded-full bg-gradient-to-r from-red-400 via-green-400 to-blue-400" />
        
        {/* Tension points */}
        <div className="relative h-2">
          {tensionPoints.map((point, index) => (
            <div
              key={index}
              className="absolute w-1.5 h-1.5 bg-white border border-gray-300 rounded-full transform -translate-y-1/4"
              style={{ left: `${point.position}%` }}
            />
          ))}
        </div>
      </div>

      <Slider
        value={[position]}
        onValueChange={onPositionChange}
        max={100}
        step={1}
        className="w-full"
      />
      
      <div className="flex justify-between text-sm text-gray-500 mt-2">
        <span>Story Start</span>
        <span>Current Event</span>
        <span>Story End</span>
      </div>

      {/* Tension indicators */}
      <div className="flex justify-between text-xs text-gray-400 mt-4">
        <span>High Tension</span>
        <span>Building</span>
        <span>Resolution</span>
      </div>
    </div>
  );
}