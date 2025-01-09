import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Play, Pause, UserPlus } from 'lucide-react';
import { ForceGraph } from './ForceGraph';
import { Timeline } from './Timeline';
import { CharacterNode, Relationship } from './types';
import { AddCharacterToMapDialog } from './AddCharacterToMapDialog';

interface CharacterDynamicsD3Props {
  characters: CharacterNode[];
  relationships: Relationship[];
}

export const CharacterDynamicsD3 = ({ characters, relationships }: CharacterDynamicsD3Props) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [timelinePosition, setTimelinePosition] = useState(0);
  const [synergy, setSynergy] = useState(75);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [displayedCharacters, setDisplayedCharacters] = useState<CharacterNode[]>([]);

  // Initialize with first few characters
  useEffect(() => {
    if (characters.length > 0 && displayedCharacters.length === 0) {
      setDisplayedCharacters(characters.slice(0, 3));
    }
  }, [characters]);

  // Calculate group synergy based on relationships
  useEffect(() => {
    if (relationships && relationships.length > 0) {
      const totalStrength = relationships.reduce((sum, rel) => sum + rel.strength, 0);
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

  const handleAddCharacter = (character: CharacterNode) => {
    setDisplayedCharacters(prev => [...prev, character]);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between bg-white p-4 rounded-lg shadow-sm">
        <div className="flex items-center gap-4">
          <div className="text-lg font-semibold">Group Synergy</div>
          <div className="text-2xl font-bold text-purple-600">{synergy}%</div>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => setShowAddDialog(true)}
            className="gap-2"
          >
            <UserPlus className="h-4 w-4" />
            Add Character
          </Button>
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
      </div>

      <div className="h-[500px] bg-white rounded-xl shadow-sm relative">
        <ForceGraph 
          characters={displayedCharacters}
          relationships={relationships.filter(rel => 
            displayedCharacters.some(c => c.id === rel.source.id) && 
            displayedCharacters.some(c => c.id === rel.target.id)
          )}
        />
      </div>

      <Timeline 
        position={timelinePosition}
        onPositionChange={handleTimelineChange}
      />

      <AddCharacterToMapDialog
        isOpen={showAddDialog}
        onClose={() => setShowAddDialog(false)}
        onAddCharacter={handleAddCharacter}
        characters={characters}
        existingCharacters={displayedCharacters}
      />
    </div>
  );
};