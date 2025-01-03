import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Slider } from '../ui/slider';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { RelationshipType } from '@/types/relationships';

interface Character {
  id: string;
  name: string;
}

interface AddRelationshipDialogProps {
  isOpen: boolean;
  onClose: () => void;
  storyId: string;
}

const RELATIONSHIP_TYPES: RelationshipType[] = [
  'ally',
  'rival',
  'family',
  'friend',
  'enemy',
  'mentor',
  'student',
];

export const AddRelationshipDialog = ({ 
  isOpen, 
  onClose,
  storyId,
}: AddRelationshipDialogProps) => {
  const [character1, setCharacter1] = useState<string>('');
  const [character2, setCharacter2] = useState<string>('');
  const [relationshipType, setRelationshipType] = useState<RelationshipType>('ally');
  const [strength, setStrength] = useState<number>(50);
  const [description, setDescription] = useState<string>('');
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch characters for the current story
  const { data: characters = [] } = useQuery({
    queryKey: ['characters', storyId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('characters')
        .select('id, name')
        .eq('story_id', storyId)
        .order('name');
      
      if (error) throw error;
      return data;
    },
    enabled: !!storyId,
  });

  const createRelationshipMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from('character_relationships')
        .insert({
          story_id: storyId,
          character1_id: character1,
          character2_id: character2,
          relationship_type: relationshipType,
          strength,
          description,
        });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['relationships'] });
      toast({
        title: 'Success',
        description: 'Relationship created successfully',
      });
      onClose();
      resetForm();
    },
  });

  const resetForm = () => {
    setCharacter1('');
    setCharacter2('');
    setRelationshipType('ally');
    setStrength(50);
    setDescription('');
  };

  const handleSubmit = () => {
    if (!character1 || !character2 || !relationshipType) {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }
    createRelationshipMutation.mutate();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Character Relationship</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <label htmlFor="character1" className="text-sm font-medium">
              First Character
            </label>
            <Select
              value={character1}
              onValueChange={setCharacter1}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select character" />
              </SelectTrigger>
              <SelectContent>
                {characters.map((char) => (
                  <SelectItem key={char.id} value={char.id}>
                    {char.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <label htmlFor="character2" className="text-sm font-medium">
              Second Character
            </label>
            <Select
              value={character2}
              onValueChange={setCharacter2}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select character" />
              </SelectTrigger>
              <SelectContent>
                {characters
                  .filter((char) => char.id !== character1)
                  .map((char) => (
                    <SelectItem key={char.id} value={char.id}>
                      {char.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <label htmlFor="relationshipType" className="text-sm font-medium">
              Relationship Type
            </label>
            <Select
              value={relationshipType}
              onValueChange={(value: RelationshipType) => setRelationshipType(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                {RELATIONSHIP_TYPES.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <label htmlFor="strength" className="text-sm font-medium">
              Relationship Strength: {strength}
            </label>
            <Slider
              value={[strength]}
              onValueChange={(value) => setStrength(value[0])}
              max={100}
              step={1}
            />
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit}
            className="bg-violet-500 hover:bg-violet-600"
            disabled={createRelationshipMutation.isPending}
          >
            {createRelationshipMutation.isPending ? 'Creating...' : 'Create'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
