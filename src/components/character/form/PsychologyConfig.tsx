import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";

interface PsychologyConfigProps {
  psychology: {
    emotional_tendencies: string[];
    fears: string[];
    coping_mechanisms: string[];
    mental_health: string | null;
  };
  psychologicalTraits: {
    emotional_intelligence: number;
    impulsiveness: number;
    trust: number;
    resilience: number;
  };
  onChange: (field: string, value: any) => void;
  isReadOnly?: boolean;
}

export function PsychologyConfig({ psychology, psychologicalTraits, onChange, isReadOnly }: PsychologyConfigProps) {
  const handleArrayChange = (field: string, value: string) => {
    if (!isReadOnly) {
      onChange(field, value.split(',').map(item => item.trim()));
    }
  };

  const handleTraitChange = (trait: string, value: number[]) => {
    if (!isReadOnly) {
      onChange('psychological_traits', {
        ...psychologicalTraits,
        [trait]: value[0]
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label>Emotional Tendencies (comma-separated)</Label>
          <Input
            value={psychology.emotional_tendencies.join(', ')}
            onChange={(e) => handleArrayChange('psychology.emotional_tendencies', e.target.value)}
            disabled={isReadOnly}
          />
        </div>

        <div>
          <Label>Fears (comma-separated)</Label>
          <Input
            value={psychology.fears.join(', ')}
            onChange={(e) => handleArrayChange('psychology.fears', e.target.value)}
            disabled={isReadOnly}
          />
        </div>

        <div>
          <Label>Coping Mechanisms (comma-separated)</Label>
          <Input
            value={psychology.coping_mechanisms.join(', ')}
            onChange={(e) => handleArrayChange('psychology.coping_mechanisms', e.target.value)}
            disabled={isReadOnly}
          />
        </div>

        <div>
          <Label>Mental Health Notes</Label>
          <Input
            value={psychology.mental_health || ''}
            onChange={(e) => onChange('psychology.mental_health', e.target.value)}
            disabled={isReadOnly}
          />
        </div>
      </div>

      <div className="space-y-8">
        <div>
          <Label>Emotional Intelligence ({psychologicalTraits.emotional_intelligence})</Label>
          <Slider
            value={[psychologicalTraits.emotional_intelligence]}
            onValueChange={(value) => handleTraitChange('emotional_intelligence', value)}
            min={0}
            max={100}
            step={1}
            disabled={isReadOnly}
          />
        </div>

        <div>
          <Label>Impulsiveness ({psychologicalTraits.impulsiveness})</Label>
          <Slider
            value={[psychologicalTraits.impulsiveness]}
            onValueChange={(value) => handleTraitChange('impulsiveness', value)}
            min={0}
            max={100}
            step={1}
            disabled={isReadOnly}
          />
        </div>

        <div>
          <Label>Trust ({psychologicalTraits.trust})</Label>
          <Slider
            value={[psychologicalTraits.trust]}
            onValueChange={(value) => handleTraitChange('trust', value)}
            min={0}
            max={100}
            step={1}
            disabled={isReadOnly}
          />
        </div>

        <div>
          <Label>Resilience ({psychologicalTraits.resilience})</Label>
          <Slider
            value={[psychologicalTraits.resilience]}
            onValueChange={(value) => handleTraitChange('resilience', value)}
            min={0}
            max={100}
            step={1}
            disabled={isReadOnly}
          />
        </div>
      </div>
    </div>
  );
}