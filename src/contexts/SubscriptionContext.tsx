import { createContext, useContext, useEffect, useState } from "react";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import { useToast } from "@/hooks/use-toast";
import { featureMatrix } from "@/utils/subscriptionUtils";
import { useQuery } from "@tanstack/react-query";

type SubscriptionPlan = 'free' | 'creator' | 'professional';

interface SubscriptionContextType {
  plan: SubscriptionPlan;
  isLoading: boolean;
  checkFeatureAccess: (feature: string) => boolean;
  isTrialExpired: boolean;
}

const SubscriptionContext = createContext<SubscriptionContextType>({
  plan: 'free',
  isLoading: true,
  checkFeatureAccess: () => false,
  isTrialExpired: false,
});

export const useSubscription = () => useContext(SubscriptionContext);

export const SubscriptionProvider = ({ children }: { children: React.ReactNode }) => {
  const [plan, setPlan] = useState<SubscriptionPlan>('free');
  const [isLoading, setIsLoading] = useState(true);
  const [isTrialExpired, setIsTrialExpired] = useState(false);
  const session = useSession();
  const supabase = useSupabaseClient();
  const { toast } = useToast();

  // Query to check trial status
  const { data: trialData } = useQuery({
    queryKey: ["trial-status", session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return null;
      
      // First try to get existing trial
      const { data: existingTrial, error: fetchError } = await supabase
        .from('user_trials')
        .select('*')
        .eq('user_id', session.user.id)
        .maybeSingle();

      if (fetchError && fetchError.code !== 'PGRST116') {
        console.error('Error fetching trial status:', fetchError);
        return null;
      }

      // If trial exists, return it
      if (existingTrial) {
        return existingTrial;
      }

      // If no trial exists, create one
      const { data: newTrial, error: createError } = await supabase
        .from('user_trials')
        .insert([
          { user_id: session.user.id }
        ])
        .select()
        .single();

      if (createError) {
        console.error('Error creating trial:', createError);
        return null;
      }

      return newTrial;
    },
    enabled: !!session?.user?.id,
  });

  useEffect(() => {
    const checkSubscription = async () => {
      if (!session) {
        setPlan('free');
        setIsLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase.functions.invoke('check-subscription');
        if (error) throw error;

        // If user has an active paid subscription, use that
        if (data.plan !== 'free') {
          setPlan(data.plan);
          setIsTrialExpired(false);
        } else {
          // Check trial status
          if (trialData) {
            const now = new Date();
            const trialEnd = new Date(trialData.trial_end_date);
            const isExpired = now > trialEnd && trialData.is_active;
            
            setIsTrialExpired(isExpired);
            
            if (isExpired) {
              toast({
                title: "Trial Expired",
                description: "Your free trial has ended. Please upgrade to continue using premium features.",
                variant: "destructive",
              });
            }
          }
        }
      } catch (error) {
        console.error('Error checking subscription:', error);
        toast({
          title: "Error",
          description: "Failed to check subscription status",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    checkSubscription();
  }, [session, supabase, toast, trialData]);

  const checkFeatureAccess = (feature: keyof typeof featureMatrix.free): boolean => {
    // If trial is expired and user is on free plan, deny access to premium features
    if (isTrialExpired && plan === 'free') {
      return false;
    }
    return !!featureMatrix[plan][feature];
  };

  return (
    <SubscriptionContext.Provider value={{ plan, isLoading, checkFeatureAccess, isTrialExpired }}>
      {children}
    </SubscriptionContext.Provider>
  );
};