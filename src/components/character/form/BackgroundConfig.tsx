import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

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
  isReadOnly?: boolean;
}

export function BackgroundConfig({ 
  culturalBackground, 
  lifeEvents, 
  ancestry, 
  onChange,
  isReadOnly 
}: BackgroundConfigProps) {
  const handleArrayChange = (field: string, value: string) => {
    if (!isReadOnly) {
      onChange(field, value.split(',').map(item => item.trim()));
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label>Ancestry</Label>
          <Input
            value={ancestry || ''}
            onChange={(e) => onChange('ancestry', e.target.value)}
            disabled={isReadOnly}
          />
        </div>

        <div>
          <Label>Cultural Traditions (comma-separated)</Label>
          <Input
            value={culturalBackground.traditions.join(', ')}
            onChange={(e) => handleArrayChange('cultural_background.traditions', e.target.value)}
            disabled={isReadOnly}
          />
        </div>

        <div>
          <Label>Cultural Taboos (comma-separated)</Label>
          <Input
            value={culturalBackground.taboos.join(', ')}
            onChange={(e) => handleArrayChange('cultural_background.taboos', e.target.value)}
            disabled={isReadOnly}
          />
        </div>

        <div>
          <Label>Religious Beliefs (comma-separated)</Label>
          <Input
            value={culturalBackground.religious_beliefs.join(', ')}
            onChange={(e) => handleArrayChange('cultural_background.religious_beliefs', e.target.value)}
            disabled={isReadOnly}
          />
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <Label>Formative Events (comma-separated)</Label>
          <Input
            value={lifeEvents.formative.join(', ')}
            onChange={(e) => handleArrayChange('life_events.formative', e.target.value)}
            disabled={isReadOnly}
          />
        </div>

        <div>
          <Label>Turning Points (comma-separated)</Label>
          <Input
            value={lifeEvents.turning_points.join(', ')}
            onChange={(e) => handleArrayChange('life_events.turning_points', e.target.value)}
            disabled={isReadOnly}
          />
        </div>

        <div>
          <Label>Significant Losses (comma-separated)</Label>
          <Input
            value={lifeEvents.losses.join(', ')}
            onChange={(e) => handleArrayChange('life_events.losses', e.target.value)}
            disabled={isReadOnly}
          />
        </div>
      </div>
    </div>
  );
}