import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

interface ValuesAndMoralsConfigProps {
  values: {
    loyalty: number;
    honesty: number;
    risk_taking: number;
    alignment: {
      lawful_chaotic: number;
      selfless_selfish: number;
    };
  };
  onChange: (values: any) => void;
}

export function ValuesAndMoralsConfig({ values, onChange }: ValuesAndMoralsConfigProps) {
  const handleValueChange = (field: string, value: number[]) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      onChange({
        ...values,
        [parent]: {
          ...values[parent as keyof typeof values],
          [child]: value[0]
        }
      });
    } else {
      onChange({
        ...values,
        [field]: value[0]
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label className="text-sm">Loyalty ({values.loyalty})</Label>
        <Slider
          value={[values.loyalty]}
          onValueChange={(value) => handleValueChange('loyalty', value)}
          max={100}
          step={1}
        />
      </div>

      <div className="space-y-2">
        <Label className="text-sm">Honesty ({values.honesty})</Label>
        <Slider
          value={[values.honesty]}
          onValueChange={(value) => handleValueChange('honesty', value)}
          max={100}
          step={1}
        />
      </div>

      <div className="space-y-2">
        <Label className="text-sm">Risk Taking ({values.risk_taking})</Label>
        <Slider
          value={[values.risk_taking]}
          onValueChange={(value) => handleValueChange('risk_taking', value)}
          max={100}
          step={1}
        />
      </div>

      <div className="space-y-4">
        <Label>Alignment</Label>
        
        <div className="space-y-2">
          <Label className="text-sm">Lawful vs Chaotic ({values.alignment.lawful_chaotic})</Label>
          <Slider
            value={[values.alignment.lawful_chaotic]}
            onValueChange={(value) => handleValueChange('alignment.lawful_chaotic', value)}
            min={-100}
            max={100}
            step={1}
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Lawful</span>
            <span>Chaotic</span>
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-sm">Selfless vs Selfish ({values.alignment.selfless_selfish})</Label>
          <Slider
            value={[values.alignment.selfless_selfish]}
            onValueChange={(value) => handleValueChange('alignment.selfless_selfish', value)}
            min={-100}
            max={100}
            step={1}
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Selfless</span>
            <span>Selfish</span>
          </div>
        </div>
      </div>
    </div>
  );
}