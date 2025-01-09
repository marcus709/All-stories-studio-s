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
  isReadOnly?: boolean;
}

export function ValuesAndMoralsConfig({ values, onChange, isReadOnly }: ValuesAndMoralsConfigProps) {
  const handleValueChange = (field: string, value: number[]) => {
    if (!isReadOnly) {
      onChange({
        ...values,
        [field]: value[0]
      });
    }
  };

  const handleAlignmentChange = (field: string, value: number[]) => {
    if (!isReadOnly) {
      onChange({
        ...values,
        alignment: {
          ...values.alignment,
          [field]: value[0]
        }
      });
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <Label>Loyalty ({values.loyalty})</Label>
        <Slider
          value={[values.loyalty]}
          onValueChange={(value) => handleValueChange('loyalty', value)}
          min={0}
          max={100}
          step={1}
          disabled={isReadOnly}
        />
      </div>

      <div>
        <Label>Honesty ({values.honesty})</Label>
        <Slider
          value={[values.honesty]}
          onValueChange={(value) => handleValueChange('honesty', value)}
          min={0}
          max={100}
          step={1}
          disabled={isReadOnly}
        />
      </div>

      <div>
        <Label>Risk Taking ({values.risk_taking})</Label>
        <Slider
          value={[values.risk_taking]}
          onValueChange={(value) => handleValueChange('risk_taking', value)}
          min={0}
          max={100}
          step={1}
          disabled={isReadOnly}
        />
      </div>

      <div>
        <Label>Lawful vs Chaotic ({values.alignment.lawful_chaotic})</Label>
        <Slider
          value={[values.alignment.lawful_chaotic]}
          onValueChange={(value) => handleAlignmentChange('lawful_chaotic', value)}
          min={-100}
          max={100}
          step={1}
          disabled={isReadOnly}
        />
      </div>

      <div>
        <Label>Selfless vs Selfish ({values.alignment.selfless_selfish})</Label>
        <Slider
          value={[values.alignment.selfless_selfish]}
          onValueChange={(value) => handleAlignmentChange('selfless_selfish', value)}
          min={-100}
          max={100}
          step={1}
          disabled={isReadOnly}
        />
      </div>
    </div>
  );
}