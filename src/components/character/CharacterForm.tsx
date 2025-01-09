import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2 } from "lucide-react";
import { BackgroundConfig } from "./form/BackgroundConfig";
import { PsychologyConfig } from "./form/PsychologyConfig";
import { ValuesAndMoralsConfig } from "./form/ValuesAndMoralsConfig";

interface CharacterFormProps {
  formData: any;
  handleInputChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  isSubmitting?: boolean;
  onCancel: () => void;
  onSubmit?: () => void;
  isReadOnly?: boolean;
}

export function CharacterForm({ 
  formData, 
  handleInputChange, 
  isSubmitting, 
  onCancel, 
  onSubmit,
  isReadOnly 
}: CharacterFormProps) {
  const handleFieldChange = (field: string, value: any) => {
    if (handleInputChange && !isReadOnly) {
      handleInputChange({
        target: {
          id: field,
          value
        }
      } as any);
    }
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="psychology">Psychology</TabsTrigger>
          <TabsTrigger value="values">Values & Morals</TabsTrigger>
          <TabsTrigger value="background">Background</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-4 mt-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={handleInputChange}
              disabled={isSubmitting || isReadOnly}
              readOnly={isReadOnly}
            />
          </div>

          <div>
            <Label htmlFor="role">Role</Label>
            <Input
              id="role"
              value={formData.role || ''}
              onChange={handleInputChange}
              disabled={isSubmitting || isReadOnly}
              readOnly={isReadOnly}
            />
          </div>

          <div>
            <Label htmlFor="traits">Traits (comma-separated)</Label>
            <Input
              id="traits"
              value={Array.isArray(formData.traits) ? formData.traits.join(', ') : formData.traits}
              onChange={handleInputChange}
              disabled={isSubmitting || isReadOnly}
              readOnly={isReadOnly}
            />
          </div>

          <div>
            <Label htmlFor="goals">Goals</Label>
            <Textarea
              id="goals"
              value={formData.goals || ''}
              onChange={handleInputChange}
              disabled={isSubmitting || isReadOnly}
              readOnly={isReadOnly}
            />
          </div>

          <div>
            <Label htmlFor="backstory">Backstory</Label>
            <Textarea
              id="backstory"
              value={formData.backstory || ''}
              onChange={handleInputChange}
              disabled={isSubmitting || isReadOnly}
              readOnly={isReadOnly}
            />
          </div>
        </TabsContent>

        <TabsContent value="psychology" className="mt-4">
          <PsychologyConfig
            psychology={formData.psychology || {
              emotional_tendencies: [],
              fears: [],
              coping_mechanisms: [],
              mental_health: null
            }}
            psychologicalTraits={formData.psychological_traits || {
              emotional_intelligence: 50,
              impulsiveness: 50,
              trust: 50,
              resilience: 50
            }}
            onChange={handleFieldChange}
            isReadOnly={isReadOnly}
          />
        </TabsContent>

        <TabsContent value="values" className="mt-4">
          <ValuesAndMoralsConfig
            values={formData.values_and_morals || {
              loyalty: 50,
              honesty: 50,
              risk_taking: 50,
              alignment: {
                lawful_chaotic: 0,
                selfless_selfish: 0
              }
            }}
            onChange={(values) => handleFieldChange('values_and_morals', values)}
            isReadOnly={isReadOnly}
          />
        </TabsContent>

        <TabsContent value="background" className="mt-4">
          <BackgroundConfig
            culturalBackground={formData.cultural_background || {
              traditions: [],
              taboos: [],
              religious_beliefs: []
            }}
            lifeEvents={formData.life_events || {
              formative: [],
              turning_points: [],
              losses: []
            }}
            ancestry={formData.ancestry || ''}
            onChange={handleFieldChange}
            isReadOnly={isReadOnly}
          />
        </TabsContent>
      </Tabs>

      <div className="flex justify-end gap-4">
        <Button variant="outline" onClick={onCancel}>
          {isReadOnly ? 'Close' : 'Cancel'}
        </Button>
        {!isReadOnly && (
          <Button 
            onClick={onSubmit} 
            disabled={isSubmitting}
            className="bg-purple-500 hover:bg-purple-600"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              'Create Character'
            )}
          </Button>
        )}
      </div>
    </div>
  );
}