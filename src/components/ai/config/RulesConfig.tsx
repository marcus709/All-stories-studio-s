import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

interface RulesConfigProps {
  characterRules: string[];
  plotRules: string[];
  onCharacterRulesChange: (rules: string[]) => void;
  onPlotRulesChange: (rules: string[]) => void;
}

export function RulesConfig({
  characterRules,
  plotRules,
  onCharacterRulesChange,
  onPlotRulesChange,
}: RulesConfigProps) {
  const characterRuleOptions = [
    { id: "protagonist_success", label: "The protagonist must always succeed" },
    { id: "no_death", label: "Characters cannot die" },
    { id: "consistent_motivation", label: "Maintain consistent character motivations" },
  ];

  const plotRuleOptions = [
    { id: "three_act", label: "Follow a three-act structure" },
    { id: "no_deus_ex", label: "Avoid deus ex machina resolutions" },
    { id: "tie_loose_ends", label: "Ensure all loose ends are tied by the conclusion" },
  ];

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <Label>Character Rules</Label>
        {characterRuleOptions.map((rule) => (
          <div key={rule.id} className="flex items-center space-x-2">
            <Checkbox
              id={rule.id}
              checked={characterRules.includes(rule.id)}
              onCheckedChange={(checked) => {
                if (checked) {
                  onCharacterRulesChange([...characterRules, rule.id]);
                } else {
                  onCharacterRulesChange(characterRules.filter((r) => r !== rule.id));
                }
              }}
            />
            <label htmlFor={rule.id} className="text-sm">{rule.label}</label>
          </div>
        ))}
      </div>
      <div className="space-y-4">
        <Label>Plot Rules</Label>
        {plotRuleOptions.map((rule) => (
          <div key={rule.id} className="flex items-center space-x-2">
            <Checkbox
              id={rule.id}
              checked={plotRules.includes(rule.id)}
              onCheckedChange={(checked) => {
                if (checked) {
                  onPlotRulesChange([...plotRules, rule.id]);
                } else {
                  onPlotRulesChange(plotRules.filter((r) => r !== rule.id));
                }
              }}
            />
            <label htmlFor={rule.id} className="text-sm">{rule.label}</label>
          </div>
        ))}
      </div>
    </div>
  );
}