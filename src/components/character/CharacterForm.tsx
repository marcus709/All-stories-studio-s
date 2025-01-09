import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";

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
  return (
    <div className="space-y-6">
      <div className="space-y-4">
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
      </div>

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