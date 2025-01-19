import { Dialog, DialogContent } from "@/components/ui/dialog";
import { PricingTable } from "@/components/blocks/pricing-table";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

interface PricingDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const features = [
  { name: "Unlimited prompts", included: "starter" },
  { name: "1 story maximum", included: "starter" },
  { name: "5 characters maximum", included: "starter" },
  { name: "Basic story enhancement", included: "starter" },
  { name: "Full community access", included: "starter" },
  { name: "5 stories maximum", included: "pro" },
  { name: "15 characters maximum", included: "pro" },
  { name: "Full community access (5 groups max)", included: "pro" },
  { name: "1 custom AI", included: "pro" },
  { name: "Unlimited story docs", included: "pro" },
  { name: "Story logic checker", included: "pro" },
  { name: "Unlimited stories", included: "all" },
  { name: "Unlimited characters", included: "all" },
  { name: "Full community access", included: "all" },
  { name: "5 custom AIs", included: "all" },
  { name: "Priority feature access", included: "all" },
];

const plans = [
  {
    name: "Free Trial",
    price: { monthly: 0, yearly: 0 },
    level: "starter",
  },
  {
    name: "Creator",
    price: { monthly: 9.99, yearly: 99.99 },
    level: "pro",
    popular: true,
  },
  {
    name: "Professional",
    price: { monthly: 14.99, yearly: 149.99 },
    level: "all",
  },
];

export function PricingDialog({ isOpen, onClose }: PricingDialogProps) {
  const session = useSession();
  const supabase = useSupabaseClient();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handlePlanSelect = async (plan: string) => {
    if (!session) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to subscribe to a plan.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const priceId = getPriceId(plan);
      
      if (!priceId) {
        // Handle free trial
        const { data: existingTrial, error: trialCheckError } = await supabase
          .from('user_trials')
          .select('*')
          .eq('user_id', session.user.id)
          .maybeSingle();

        if (trialCheckError) throw trialCheckError;

        if (existingTrial) {
          toast({
            title: "Trial Already Used",
            description: "You've already used your free trial. Please choose a paid plan to continue.",
            variant: "destructive",
          });
          return;
        }

        const { error: createTrialError } = await supabase
          .from('user_trials')
          .insert([{ 
            user_id: session.user.id,
            trial_start_date: new Date().toISOString(),
            trial_end_date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
            is_active: true
          }]);

        if (createTrialError) throw createTrialError;

        toast({
          title: "Trial Started",
          description: "Your 5-day free trial has started. Enjoy full access to our community features!",
        });
        onClose();
        return;
      }

      const { data, error } = await supabase.functions.invoke('create-checkout-session', {
        body: { 
          priceId,
          successUrl: `${window.location.origin}/payment/success`,
          cancelUrl: `${window.location.origin}/?scrollTo=pricing`
        }
      });

      if (error) throw error;
      if (!data?.url) throw new Error('No checkout URL received');

      window.location.href = data.url;
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to process subscription. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getPriceId = (plan: string): string | null => {
    switch (plan) {
      case "starter":
        return null;
      case "pro":
        return "price_1QcuXCEYIZGXbokupYo0Y6j2";
      case "all":
        return "price_1QcuYKEYIZGXbokuvrWFAB9u";
      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[850px]">
        <PricingTable
          features={features}
          plans={plans}
          defaultPlan="pro"
          defaultInterval="monthly"
          onPlanSelect={handlePlanSelect}
          containerClassName="py-8"
          buttonClassName={`${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
        />
      </DialogContent>
    </Dialog>
  );
}