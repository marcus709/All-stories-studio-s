import { useEffect } from "react";
import { Slider } from "@/components/ui/slider";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useStory } from "@/contexts/StoryContext";
import { TensionPoint } from "./types";

interface TimelineProps {
  position: number;
  onPositionChange: (value: number[]) => void;
}

export function Timeline({ position, onPositionChange }: TimelineProps) {
  const { selectedStory } = useStory();

  const { data: tensionPoints = [] } = useQuery({
    queryKey: ['timeline-tension-points', selectedStory?.id],
    queryFn: async () => {
      if (!selectedStory?.id) return [];
      
      const { data, error } = await supabase
        .from('timeline_tension_points')
        .select('*')
        .eq('story_id', selectedStory.id)
        .order('position');

      if (error) throw error;
      return (data || []) as TensionPoint[];
    },
    enabled: !!selectedStory?.id,
  });

  // Define default tension points if none exist
  const defaultTensionPoints: TensionPoint[] = [
    { id: '1', story_id: selectedStory?.id || '', position: 0, tension_level: 70, description: "High Initial Tension", type: 'rising' },
    { id: '2', story_id: selectedStory?.id || '', position: 30, tension_level: 40, description: "Building Conflict", type: 'rising' },
    { id: '3', story_id: selectedStory?.id || '', position: 50, tension_level: 80, description: "Major Crisis", type: 'climax' },
    { id: '4', story_id: selectedStory?.id || '', position: 70, tension_level: 60, description: "Rising Action", type: 'falling' },
    { id: '5', story_id: selectedStory?.id || '', position: 85, tension_level: 90, description: "Climax", type: 'climax' },
    { id: '6', story_id: selectedStory?.id || '', position: 100, tension_level: 30, description: "Resolution", type: 'resolution' },
  ];

  const points = tensionPoints.length > 0 ? tensionPoints : defaultTensionPoints;

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="text-sm font-medium mb-4 flex justify-between">
        <span>Timeline Progress</span>
        <span className="text-gray-500">Tension Level</span>
      </div>
      
      {/* Tension gradient background */}
      <div className="relative mb-8">
        <div className="absolute inset-0 h-3 rounded-full bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 opacity-25" />
        
        {/* Tension points */}
        <div className="relative h-3">
          {points.map((point) => (
            <div
              key={point.id}
              className="absolute w-3 h-3 bg-white border-2 rounded-full transform -translate-y-1/4 -translate-x-1/2 cursor-pointer group"
              style={{ 
                left: `${point.position}%`,
                borderColor: point.tension_level > 70 ? '#ef4444' : 
                           point.tension_level > 40 ? '#f59e0b' : '#22c55e'
              }}
            >
              {/* Tooltip */}
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 -translate-y-2 hidden group-hover:block z-50">
                <div className="bg-gray-900 text-white text-xs rounded py-1 px-2 whitespace-nowrap">
                  {point.description}
                  <br />
                  Tension: {point.tension_level}%
                  <br />
                  Type: {point.type}
                </div>
              </div>
            </div>
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
      
      <div className="flex justify-between text-sm text-gray-500 mt-4">
        <div className="flex flex-col items-start">
          <span className="font-medium">Story Start</span>
          <span className="text-xs text-red-500">High Tension</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="font-medium">Midpoint</span>
          <span className="text-xs text-yellow-500">Building</span>
        </div>
        <div className="flex flex-col items-end">
          <span className="font-medium">Resolution</span>
          <span className="text-xs text-green-500">Low Tension</span>
        </div>
      </div>
    </div>
  );
}