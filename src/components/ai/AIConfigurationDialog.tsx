import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useSession } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";

interface AIConfigurationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  configToEdit?: {
    id: string;
    name: string;
    model_type: 'gpt-4o' | 'gpt-4o-mini';
    system_prompt?: string;
    temperature: number;
    max_tokens: number;
  };
  onConfigSaved: () => void;
}

export function AIConfigurationDialog({ isOpen, onClose, configToEdit, onConfigSaved }: AIConfigurationDialogProps) {
  const session = useSession();
  const { toast } = useToast();
  const [loading, setLoading] = React.useState(false);
  const [config, setConfig] = React.useState({
    name: "",
    model_type: "gpt-4o-mini" as const,
    system_prompt: "",
    temperature: 0.7,
    max_tokens: 1000,
  });

  React.useEffect(() => {
    if (configToEdit) {
      setConfig({
        name: configToEdit.name,
        model_type: configToEdit.model_type,
        system_prompt: configToEdit.system_prompt || "",
        temperature: configToEdit.temperature,
        max_tokens: configToEdit.max_tokens,
      });
    } else {
      setConfig({
        name: "",
        model_type: "gpt-4o-mini",
        system_prompt: "",
        temperature: 0.7,
        max_tokens: 1000,
      });
    }
  }, [configToEdit]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user?.id) return;
    
    setLoading(true);
    try {
      if (configToEdit) {
        await supabase
          .from("ai_configurations")
          .update({
            name: config.name,
            model_type: config.model_type,
            system_prompt: config.system_prompt,
            temperature: config.temperature,
            max_tokens: config.max_tokens,
          })
          .eq("id", configToEdit.id);
      } else {
        await supabase.from("ai_configurations").insert({
          user_id: session.user.id,
          name: config.name,
          model_type: config.model_type,
          system_prompt: config.system_prompt,
          temperature: config.temperature,
          max_tokens: config.max_tokens,
        });
      }

      toast({
        title: "Success",
        description: `AI configuration ${configToEdit ? "updated" : "created"} successfully.`,
      });
      onConfigSaved();
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save AI configuration. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{configToEdit ? "Edit" : "Create"} AI Configuration</DialogTitle>
          <Button
            variant="ghost"
            className="absolute right-4 top-4"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Configuration Name</Label>
            <Input
              id="name"
              value={config.name}
              onChange={(e) => setConfig((prev) => ({ ...prev, name: e.target.value }))}
              placeholder="My AI Configuration"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="model">Model</Label>
            <Select
              value={config.model_type}
              onValueChange={(value: 'gpt-4o' | 'gpt-4o-mini') =>
                setConfig((prev) => ({ ...prev, model_type: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select model" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="gpt-4o-mini">GPT-4 Mini (Faster)</SelectItem>
                <SelectItem value="gpt-4o">GPT-4 (More Powerful)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="system_prompt">System Prompt</Label>
            <Textarea
              id="system_prompt"
              value={config.system_prompt}
              onChange={(e) =>
                setConfig((prev) => ({ ...prev, system_prompt: e.target.value }))
              }
              placeholder="You are a creative writing assistant..."
              className="min-h-[100px]"
            />
          </div>

          <div className="space-y-2">
            <Label>Temperature ({config.temperature})</Label>
            <Slider
              value={[config.temperature]}
              onValueChange={(value) =>
                setConfig((prev) => ({ ...prev, temperature: value[0] }))
              }
              max={1}
              step={0.1}
              className="py-4"
            />
            <p className="text-sm text-gray-500">
              Higher values make the output more creative but less predictable
            </p>
          </div>

          <div className="space-y-2">
            <Label>Max Tokens ({config.max_tokens})</Label>
            <Slider
              value={[config.max_tokens]}
              onValueChange={(value) =>
                setConfig((prev) => ({ ...prev, max_tokens: Math.round(value[0]) }))
              }
              max={2000}
              step={100}
              className="py-4"
            />
          </div>

          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save Configuration"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}