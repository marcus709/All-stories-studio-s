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
}

export function PsychologyConfig({ psychology, psychologicalTraits, onChange }: PsychologyConfigProps) {
  const handleTraitChange = (trait: string, value: number[]) => {
    onChange('psychological_traits', {
      ...psychologicalTraits,
      [trait]: value[0]
    });
  };

  const handlePsychologyChange = (field: string, value: string) => {
    const newValues = value.split(',').map(item => item.trim());
    onChange('psychology', {
      ...psychology,
      [field]: newValues
    });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label>Emotional Tendencies</Label>
        <Input
          placeholder="Enter emotional tendencies (comma-separated)"
          value={psychology.emotional_tendencies.join(', ')}
          onChange={(e) => handlePsychologyChange('emotional_tendencies', e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label>Fears</Label>
        <Input
          placeholder="Enter fears (comma-separated)"
          value={psychology.fears.join(', ')}
          onChange={(e) => handlePsychologyChange('fears', e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label>Coping Mechanisms</Label>
        <Input
          placeholder="Enter coping mechanisms (comma-separated)"
          value={psychology.coping_mechanisms.join(', ')}
          onChange={(e) => handlePsychologyChange('coping_mechanisms', e.target.value)}
        />
      </div>

      <div className="space-y-4">
        <Label>Psychological Traits</Label>
        
        <div className="space-y-6">
          <div className="space-y-2">
            <Label className="text-sm">Emotional Intelligence ({psychologicalTraits.emotional_intelligence})</Label>
            <Slider
              value={[psychologicalTraits.emotional_intelligence]}
              onValueChange={(value) => handleTraitChange('emotional_intelligence', value)}
              max={100}
              step={1}
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm">Impulsiveness ({psychologicalTraits.impulsiveness})</Label>
            <Slider
              value={[psychologicalTraits.impulsiveness]}
              onValueChange={(value) => handleTraitChange('impulsiveness', value)}
              max={100}
              step={1}
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm">Trust ({psychologicalTraits.trust})</Label>
            <Slider
              value={[psychologicalTraits.trust]}
              onValueChange={(value) => handleTraitChange('trust', value)}
              max={100}
              step={1}
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm">Resilience ({psychologicalTraits.resilience})</Label>
            <Slider
              value={[psychologicalTraits.resilience]}
              onValueChange={(value) => handleTraitChange('resilience', value)}
              max={100}
              step={1}
            />
          </div>
        </div>
      </div>
    </div>
  );
}