
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface TimelineDialogProps {
  isOpen: boolean;
  onClose: () => void;
  storyId: string;
  onEventAdded?: () => void;
}

export const TimelineDialog = ({ isOpen, onClose, storyId, onEventAdded }: TimelineDialogProps) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [year, setYear] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) {
      toast({
        title: "Error",
        description: "Please provide a title for the event",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // Get last position to place new event at the end
      const { data: lastEvents } = await supabase
        .from('timeline_events')
        .select('position')
        .eq('story_id', storyId)
        .order('position', { ascending: false })
        .limit(1);

      const nextPosition = lastEvents && lastEvents.length > 0 
        ? lastEvents[0].position + 1 
        : 0;

      const { error } = await supabase
        .from('timeline_events')
        .insert({
          story_id: storyId,
          title,
          description: description || null,
          year: year || null,
          position: nextPosition
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Timeline event added successfully",
      });

      // Reset form
      setTitle('');
      setDescription('');
      setYear('');
      
      // Notify parent
      if (onEventAdded) onEventAdded();
      
      // Close dialog
      onClose();
    } catch (error) {
      console.error('Error adding timeline event:', error);
      toast({
        title: "Error",
        description: "Failed to add timeline event",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Add Timeline Event</DialogTitle>
          <DialogDescription>
            Create a new event for your story timeline. These events will help map character positions and relationships over time.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="title">Event Title</Label>
            <Input 
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Battle of Winterfell"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="year">Year/Period</Label>
            <Input 
              id="year"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              placeholder="302 AC"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea 
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what happens in this event..."
              rows={4}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              disabled={isSubmitting || !title}
              className="bg-purple-500 hover:bg-purple-600"
            >
              {isSubmitting ? 'Adding...' : 'Add Event'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
