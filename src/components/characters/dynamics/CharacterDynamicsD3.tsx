import { useState, useEffect } from 'react';
import { Character } from '@/integrations/supabase/types/tables.types';
import { Button } from '@/components/ui/button';
import { Play, Pause } from 'lucide-react';
import { ForceGraph } from './ForceGraph';
import { Timeline } from './Timeline';
import { CharacterNode } from './types';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface CharacterDynamicsD3Props {
  characters: Character[];
}

export const CharacterDynamicsD3 = ({ characters }: CharacterDynamicsD3Props) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [timelinePosition, setTimelinePosition] = useState(0);
  const [synergy, setSynergy] = useState(75);

  // Add x and y coordinates to characters for D3
  const characterNodes: CharacterNode[] = characters.map(character => ({
    ...character,
    x: 0,
    y: 0
  }));

  const { data: relationships } = useQuery({
    queryKey: ['relationships', characters.map(c => c.id)],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('character_relationships')
        .select('*')
        .in('character1_id', characters.map(c => c.id));
      if (error) throw error;
      return data;
    },
    enabled: characters.length > 0,
  });

  // Calculate group synergy based on relationships
  useEffect(() => {
    if (relationships && relationships.length > 0) {
      const totalStrength = relationships.reduce((sum, rel) => sum + (rel.strength || 0), 0);
      const avgStrength = totalStrength / relationships.length;
      setSynergy(Math.round(avgStrength));
    }
  }, [relationships]);

  // Handle timeline playback
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isPlaying) {
      interval = setInterval(() => {
        setTimelinePosition(prev => {
          if (prev >= 100) {
            setIsPlaying(false);
            return 100;
          }
          return prev + 1;
        });
      }, 100);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isPlaying]);

  const togglePlayback = () => {
    setIsPlaying(!isPlaying);
  };

  const handleTimelineChange = (value: number[]) => {
    setTimelinePosition(value[0]);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between bg-white p-4 rounded-lg shadow-sm">
        <div className="flex items-center gap-4">
          <div className="text-lg font-semibold">Group Synergy</div>
          <div className="text-2xl font-bold text-purple-600">{synergy}%</div>
        </div>
        <Button variant="outline" onClick={togglePlayback} className="gap-2">
          {isPlaying ? (
            <>
              <Pause className="h-4 w-4" /> Pause
            </>
          ) : (
            <>
              <Play className="h-4 w-4" /> Play Timeline
            </>
          )}
        </Button>
      </div>

      <div className="h-[500px] bg-white rounded-xl shadow-sm relative">
        <ForceGraph 
          characters={characterNodes}
          relationships={relationships?.map(rel => ({
            source: characterNodes.find(c => c.id === rel.character1_id)!,
            target: characterNodes.find(c => c.id === rel.character2_id)!,
            type: rel.relationship_type,
            strength: rel.strength || 50
          })) || []}
        />
      </div>

      <Timeline 
        position={timelinePosition}
        onPositionChange={handleTimelineChange}
      />
    </div>
  );
};