import { useState, useEffect, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useSession } from "@supabase/auth-helpers-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { PenLine, GripHorizontal } from "lucide-react";

interface DailyChallengeDialogProps {
  onOpenChange?: (open: boolean) => void;
  latestSubmission?: any;
}

export const DailyChallengeDialog = ({ onOpenChange, latestSubmission }: DailyChallengeDialogProps) => {
  const [isOpen, setIsOpen] = useState(true);
  const [submission, setSubmission] = useState("");
  const [height, setHeight] = useState(600);
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dragStartY = useRef<number>(0);
  const dragStartHeight = useRef<number>(0);
  const session = useSession();
  const { toast } = useToast();

  const handleClose = () => {
    setIsOpen(false);
    onOpenChange?.(false);
  };

  const handleDragStart = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(true);
    dragStartY.current = e.clientY;
    dragStartHeight.current = height;
  };

  useEffect(() => {
    const handleDrag = (e: MouseEvent) => {
      if (isDragging) {
        const deltaY = dragStartY.current - e.clientY;
        const newHeight = Math.max(400, Math.min(800, dragStartHeight.current + deltaY));
        setHeight(newHeight);
      }
    };

    const handleDragEnd = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleDrag);
      document.addEventListener('mouseup', handleDragEnd);
    }

    return () => {
      document.removeEventListener('mousemove', handleDrag);
      document.removeEventListener('mouseup', handleDragEnd);
    };
  }, [isDragging]);

  const { data: challenge } = useQuery({
    queryKey: ["daily-challenge"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("daily_challenges")
        .select("*")
        .eq("active_date", new Date().toISOString().split("T")[0])
        .single();

      if (error) throw error;
      return data;
    },
  });

  useEffect(() => {
    const lastCheck = localStorage.getItem("lastChallengeCheck");
    const today = new Date().toISOString().split("T")[0];
    
    if (lastCheck !== today && !latestSubmission && challenge) {
      setIsOpen(true);
      localStorage.setItem("lastChallengeCheck", today);
    }
  }, [challenge, latestSubmission]);

  const handleSubmit = async () => {
    if (!session?.user?.id || !challenge) return;

    try {
      setIsSubmitting(true);
      const wordCount = submission.trim().split(/\s+/).length;
      
      const { error } = await supabase
        .from("challenge_submissions")
        .insert({
          user_id: session.user.id,
          challenge_id: challenge.id,
          content: submission,
          word_count: wordCount,
        });

      if (error) throw error;

      toast({
        title: "Success!",
        description: "Your submission has been recorded. Check back in 5 minutes for feedback!",
      });
      handleClose();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!challenge) return null;

  if (latestSubmission?.score) {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold flex items-center gap-2">
              <PenLine className="w-6 h-6 text-purple-500" />
              Challenge Feedback
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg">{challenge.title}</h3>
              <p className="text-gray-600 mt-1">Here's how you did:</p>
            </div>

            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-purple-900">Score:</span>
                <span className="text-2xl font-bold text-purple-600">{latestSubmission.score}/100</span>
              </div>
              <p className="text-purple-800">{latestSubmission.feedback}</p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">Your Submission:</h4>
              <p className="text-gray-600">{latestSubmission.content}</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent 
        className="sm:max-w-[600px] overflow-hidden flex flex-col"
        style={{ height: `${height}px` }}
      >
        <div
          className="absolute top-0 left-0 right-0 h-8 cursor-ns-resize flex items-center justify-center bg-purple-50/50 hover:bg-purple-100/50 transition-colors"
          onMouseDown={handleDragStart}
        >
          <GripHorizontal className="h-4 w-4 text-purple-400" />
        </div>
        
        <DialogHeader className="mt-6">
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <PenLine className="w-6 h-6 text-purple-500" />
            Daily Writing Challenge
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 mt-4 flex-1 overflow-auto">
          <div>
            <h3 className="font-semibold text-lg">{challenge.title}</h3>
            <p className="text-gray-600 mt-1">{challenge.description}</p>
          </div>

          <div className="bg-purple-50 p-4 rounded-lg">
            <p className="font-medium text-purple-900">{challenge.prompt}</p>
          </div>

          {challenge.tips && challenge.tips.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-medium">Tips:</h4>
              <ul className="list-disc list-inside space-y-1 text-gray-600">
                {challenge.tips.map((tip, index) => (
                  <li key={index}>{tip}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="space-y-2">
            <label className="font-medium">
              Your Response {challenge.word_count_goal && `(Goal: ${challenge.word_count_goal} words)`}
            </label>
            <Textarea
              value={submission}
              onChange={(e) => setSubmission(e.target.value)}
              placeholder="Write your response here..."
              className="h-40"
            />
            <p className="text-sm text-gray-500">
              Word count: {submission.trim().split(/\s+/).filter(Boolean).length}
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t mt-4">
          <Button variant="outline" onClick={handleClose}>
            Save for Later
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600"
          >
            {isSubmitting ? "Submitting..." : "Submit Challenge"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};