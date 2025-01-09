import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useSession } from "@supabase/auth-helpers-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { PenLine } from "lucide-react";

export const DailyChallengeDialog = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [submission, setSubmission] = useState("");
  const session = useSession();
  const { toast } = useToast();

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

  const { data: existingSubmission } = useQuery({
    queryKey: ["challenge-submission", challenge?.id],
    queryFn: async () => {
      if (!challenge?.id || !session?.user?.id) return null;
      
      const { data, error } = await supabase
        .from("challenge_submissions")
        .select("*")
        .eq("challenge_id", challenge.id)
        .eq("user_id", session.user.id)
        .single();

      if (error && error.code !== "PGRST116") throw error;
      return data;
    },
    enabled: !!challenge?.id && !!session?.user?.id,
  });

  useEffect(() => {
    const lastCheck = localStorage.getItem("lastChallengeCheck");
    const today = new Date().toISOString().split("T")[0];
    
    if (lastCheck !== today && !existingSubmission && challenge) {
      setIsOpen(true);
      localStorage.setItem("lastChallengeCheck", today);
    }
  }, [challenge, existingSubmission]);

  const handleSubmit = async () => {
    if (!session?.user?.id || !challenge) return;

    try {
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
        description: "Your submission has been recorded.",
      });
      setIsOpen(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (!challenge) return null;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <PenLine className="w-6 h-6 text-purple-500" />
            Daily Writing Challenge
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 mt-4">
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

          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Save for Later
            </Button>
            <Button 
              onClick={handleSubmit}
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600"
            >
              Submit Challenge
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};