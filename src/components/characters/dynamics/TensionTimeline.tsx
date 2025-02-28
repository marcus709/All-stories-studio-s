
import { useState } from 'react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useStory } from '@/contexts/StoryContext';
import { useQueryClient } from '@tanstack/react-query';

interface TensionPoint {
  id: string;
  position: number;
  tension_level: number;
  type: 'rising' | 'falling' | 'climax' | 'resolution';
  description?: string;
}

interface TensionTimelineProps {
  tensionPoints: TensionPoint[];
}

export const TensionTimeline = ({ tensionPoints }: TensionTimelineProps) => {
  const [isAddingPoint, setIsAddingPoint] = useState(false);
  const { toast } = useToast();
  const { selectedStory } = useStory();
  const queryClient = useQueryClient();

  const chartData = tensionPoints.map((point) => ({
    position: point.position,
    tension: point.tension_level,
    type: point.type,
    description: point.description || '',
  }));

  const addTensionPoint = async () => {
    if (!selectedStory?.id) return;
    
    setIsAddingPoint(true);
    try {
      // Get the max position to add a new point after it
      const maxPosition = tensionPoints.length > 0 
        ? Math.max(...tensionPoints.map(p => p.position)) 
        : -1;
      
      // Default tension level based on pattern
      let defaultTension = 50;
      let defaultType: 'rising' | 'falling' | 'climax' | 'resolution' = 'rising';
      
      if (tensionPoints.length > 0) {
        const lastPoint = tensionPoints.reduce((max, point) => 
          point.position > max.position ? point : max, tensionPoints[0]);
          
        if (lastPoint.type === 'rising') {
          defaultTension = Math.min(lastPoint.tension_level + 20, 100);
          defaultType = defaultTension >= 90 ? 'climax' : 'rising';
        } else if (lastPoint.type === 'climax') {
          defaultTension = lastPoint.tension_level - 10;
          defaultType = 'falling';
        } else if (lastPoint.type === 'falling') {
          defaultTension = Math.max(lastPoint.tension_level - 15, 10);
          defaultType = defaultTension <= 20 ? 'resolution' : 'falling';
        } else {
          defaultTension = 30;
          defaultType = 'rising';
        }
      }

      const { error } = await supabase
        .from('timeline_tension_points')
        .insert({
          story_id: selectedStory.id,
          position: maxPosition + 1,
          tension_level: defaultTension,
          type: defaultType,
          description: `Tension point ${maxPosition + 2}`
        });

      if (error) throw error;

      // Refetch the tension points
      queryClient.invalidateQueries({ queryKey: ['timeline_tension_points'] });
      
      toast({
        title: "Success",
        description: "Added new tension point",
      });
    } catch (error) {
      console.error('Error adding tension point:', error);
      toast({
        title: "Error",
        description: "Failed to add tension point",
        variant: "destructive",
      });
    } finally {
      setIsAddingPoint(false);
    }
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-800 p-3 rounded-md border border-gray-700 text-white text-sm">
          <p className="font-medium">{`Tension: ${payload[0].value}`}</p>
          <p className="text-gray-300">{`Type: ${payload[0].payload.type}`}</p>
          {payload[0].payload.description && (
            <p className="text-gray-300">{payload[0].payload.description}</p>
          )}
        </div>
      );
    }
    return null;
  };

  const getAreaColor = (type: string) => {
    switch (type) {
      case 'rising':
        return "#8884d8";
      case 'climax':
        return "#ff5722";
      case 'falling':
        return "#82ca9d";
      case 'resolution':
        return "#4caf50";
      default:
        return "#8884d8";
    }
  };

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex justify-between items-center px-4 py-2">
        <h3 className="text-white font-medium">Story Tension Timeline</h3>
        <Button
          size="sm"
          onClick={addTensionPoint}
          disabled={isAddingPoint || !selectedStory}
          className="bg-purple-500 hover:bg-purple-600 h-8 gap-1"
        >
          <Plus className="h-4 w-4" />
          Add Point
        </Button>
      </div>
      
      <div className="flex-1">
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                {tensionPoints.map((point) => (
                  <linearGradient 
                    key={point.id} 
                    id={`color-${point.type}`} 
                    x1="0" y1="0" x2="0" y2="1"
                  >
                    <stop offset="5%" stopColor={getAreaColor(point.type)} stopOpacity={0.8}/>
                    <stop offset="95%" stopColor={getAreaColor(point.type)} stopOpacity={0.2}/>
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#444" />
              <XAxis dataKey="position" stroke="#aaa" />
              <YAxis stroke="#aaa" domain={[0, 100]} />
              <Tooltip content={<CustomTooltip />} />
              <Area 
                type="monotone" 
                dataKey="tension" 
                stroke="#8884d8" 
                fillOpacity={1}
                fill="url(#color-rising)"
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex items-center justify-center text-gray-400">
            <p>No tension points added yet. Add your first point to start tracking narrative tension.</p>
          </div>
        )}
      </div>
    </div>
  );
};
