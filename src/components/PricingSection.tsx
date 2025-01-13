import { Check, XCircle } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader } from "./ui/card";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { Input } from "./ui/input";

type Feature = string | {
  text: string;
  available: boolean;
};

type Plan = {
  name: string;
  price: string;
  features: Feature[];
  buttonText: string;
  buttonVariant: "outline" | "default";
  priceId: string | null;
  popular?: boolean;
};

const plans: Plan[] = [
  {
    name: "5-Day Free Trial",
    price: "0",
    features: [
      "Unlimited prompts",
      "1 story maximum",
      "5 characters maximum",
      "Basic story enhancement",
      "Full community access"
    ],
    buttonText: "Start Free Trial",
    buttonVariant: "outline",
    priceId: null
  },
  {
    name: "Creator",
    price: "9.99",
    features: [
      "Unlimited prompts",
      "5 stories maximum",
      "15 characters maximum",
      "Full community access (5 groups max)",
      "1 custom AI",
      "Unlimited story docs",
      "Story logic checker"
    ],
    popular: true,
    buttonText: "Choose Creator",
    buttonVariant: "default",
    priceId: "price_1QcuXCEYIZGXbokupYo0Y6j2"
  },
  {
    name: "Professional",
    price: "14.99",
    features: [
      "Unlimited prompts",
      "Unlimited stories",
      "Unlimited characters",
      "Full community access",
      "5 custom AIs",
      "Priority feature access",
      "Unlimited story docs",
      "Story logic checker"
    ],
    buttonText: "Choose Professional",
    buttonVariant: "outline",
    priceId: "price_1QcuYKEYIZGXbokuvrWFAB9u"
  }
];

export const PricingSection = () => {
  const session = useSession();
  const supabase = useSupabaseClient();
  const { toast } = useToast();
  const [promotionCode, setPromotionCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [processingPlanId, setProcessingPlanId] = useState<string | null>(null);

  const handleSubscription = async (priceId: string | null) => {
    if (!priceId) {
      if (!session) {
        toast({
          title: "Authentication Required",
          description: "Please sign in to start your free trial.",
          variant: "destructive",
        });
        return;
      }

      // Start free trial
      try {
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
          .insert([
            { 
              user_id: session.user.id,
              trial_start_date: new Date().toISOString(),
              trial_end_date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
              is_active: true
            }
          ]);

        if (createTrialError) throw createTrialError;

        toast({
          title: "Trial Started",
          description: "Your 5-day free trial has started. Enjoy full access to our community features!",
        });
        return;
      } catch (error) {
        console.error('Error starting trial:', error);
        toast({
          title: "Error",
          description: "Failed to start your trial. Please try again.",
          variant: "destructive",
        });
        return;
      }
    }
    
    if (!session) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to subscribe to a plan.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setProcessingPlanId(priceId);
    
    try {
      const { data, error } = await supabase.functions.invoke('create-checkout-session', {
        body: { 
          priceId,
          promotionCode: promotionCode.trim() || undefined,
          successUrl: `${window.location.origin}/payment/success`,
          cancelUrl: `${window.location.origin}/?scrollTo=pricing`
        }
      });

      if (error) {
        console.error('Checkout error:', error);
        throw error;
      }

      if (!data?.url) {
        throw new Error('No checkout URL received');
      }

      window.location.href = data.url;
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Payment Error",
        description: error instanceof Error ? error.message : "Failed to start checkout process. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setProcessingPlanId(null);
    }
  };

  return (
    <section id="pricing" className="py-20 px-4 bg-white scroll-mt-16">
      <div className="container mx-auto">
        <h2 className="text-4xl font-bold text-center mb-16">
          Choose Your Creative Journey
        </h2>
        <div className="max-w-sm mx-auto mb-8">
          <Input
            type="text"
            placeholder="Have a coupon code?"
            value={promotionCode}
            onChange={(e) => setPromotionCode(e.target.value)}
            className="w-full"
          />
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <Card 
              key={plan.name}
              className={`relative ${plan.popular ? 'border-purple-400 shadow-lg' : ''}`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="bg-purple-600 text-white px-4 py-1 rounded-full text-sm">
                    Most Popular
                  </span>
                </div>
              )}
              <CardHeader className="p-6">
                <h3 className="text-2xl font-bold">{plan.name}</h3>
                <div className="mt-4">
                  <span className="text-4xl font-bold">${plan.price}</span>
                  <span className="text-gray-600 ml-2">/month</span>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <ul className="space-y-4">
                  {plan.features.map((feature, index) => {
                    const isObject = typeof feature === 'object' && feature !== null;
                    return (
                      <li 
                        key={isObject ? feature.text : feature} 
                        className="flex items-center space-x-3"
                      >
                        {isObject ? (
                          feature.available ? (
                            <Check className="h-5 w-5 text-green-500" />
                          ) : (
                            <XCircle className="h-5 w-5 text-red-500" />
                          )
                        ) : (
                          <Check className="h-5 w-5 text-green-500" />
                        )}
                        <span>{isObject ? feature.text : feature}</span>
                      </li>
                    );
                  })}
                </ul>
                <Button 
                  variant={plan.buttonVariant}
                  className="w-full mt-8"
                  onClick={() => handleSubscription(plan.priceId)}
                  disabled={isLoading || processingPlanId === plan.priceId}
                >
                  {processingPlanId === plan.priceId ? "Processing..." : plan.buttonText}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};