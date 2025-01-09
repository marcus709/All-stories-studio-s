import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@supabase/auth-helpers-react";

interface BackgroundConfigProps {
  culturalBackground: {
    traditions: string[];
    taboos: string[];
    religious_beliefs: string[];
  };
  lifeEvents: {
    formative: string[];
    turning_points: string[];
    losses: string[];
  };
  ancestry: string;
  onChange: (field: string, value: any) => void;
}

export function BackgroundConfig({
  culturalBackground,
  lifeEvents,
  ancestry,
  onChange,
}: BackgroundConfigProps) {
  const session = useSession();

  const { data: characters } = useQuery({
    queryKey: ["characters", session?.user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("characters")
        .select("id, name")
        .order("name");

      if (error) throw error;
      return data;
    },
    enabled: !!session?.user?.id,
  });

  const handleArrayChange = (category: string, subcategory: string, value: string) => {
    const newValues = value.split(',').map((item) => item.trim());
    onChange(category, {
      ...(category === 'cultural_background' ? culturalBackground : lifeEvents),
      [subcategory]: newValues,
    });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <Label>Cultural Background</Label>
        
        <div className="space-y-2">
          <Label className="text-sm">Traditions</Label>
          <Input
            placeholder="Enter traditions (comma-separated)"
            value={culturalBackground.traditions.join(', ')}
            onChange={(e) => handleArrayChange('cultural_background', 'traditions', e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label className="text-sm">Taboos</Label>
          <Input
            placeholder="Enter cultural taboos (comma-separated)"
            value={culturalBackground.taboos.join(', ')}
            onChange={(e) => handleArrayChange('cultural_background', 'taboos', e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label className="text-sm">Religious Beliefs</Label>
          <Input
            placeholder="Enter religious beliefs (comma-separated)"
            value={culturalBackground.religious_beliefs.join(', ')}
            onChange={(e) => handleArrayChange('cultural_background', 'religious_beliefs', e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-4">
        <Label>Life Events</Label>
        
        <div className="space-y-2">
          <Label className="text-sm">Formative Events</Label>
          <Textarea
            placeholder="Enter formative events (comma-separated)"
            value={lifeEvents.formative.join(', ')}
            onChange={(e) => handleArrayChange('life_events', 'formative', e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label className="text-sm">Turning Points</Label>
          <Textarea
            placeholder="Enter turning points (comma-separated)"
            value={lifeEvents.turning_points.join(', ')}
            onChange={(e) => handleArrayChange('life_events', 'turning_points', e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label className="text-sm">Significant Losses</Label>
          <Textarea
            placeholder="Enter significant losses (comma-separated)"
            value={lifeEvents.losses.join(', ')}
            onChange={(e) => handleArrayChange('life_events', 'losses', e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Ancestry</Label>
        <div className="flex gap-4">
          <div className="flex-1">
            <Input
              placeholder="Enter character's ancestry"
              value={ancestry}
              onChange={(e) => onChange('ancestry', e.target.value)}
            />
          </div>
          {characters && characters.length > 0 && (
            <Select onValueChange={(value) => onChange('ancestry', value)}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select a character" />
              </SelectTrigger>
              <SelectContent>
                {characters.map((character) => (
                  <SelectItem key={character.id} value={character.name}>
                    {character.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
      </div>
    </div>
  );
}