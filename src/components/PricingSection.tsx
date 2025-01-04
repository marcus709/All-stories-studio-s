import { Check, XCircle } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader } from "./ui/card";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import { useToast } from "@/hooks/use-toast";

const plans = [
  {
    name: "Curious",
    price: "0",
    features: [
      "2 AI prompts to try",
      "1 story maximum",
      "5 characters maximum",
      "Basic story enhancement",
      { text: "Community Access", available: false }
    ],
    buttonText: "Try for Free",
    buttonVariant: "outline" as const,
    priceId: null
  },
  {
    name: "Creator",
    price: "9.99",
    features: [
      "Unlimited prompts",
      "10 stories maximum",
      "25 characters maximum",
      "Full community access",
      "1 custom AI",
      "Backward story planning"
    ],
    popular: true,
    buttonText: "Choose Creator",
    buttonVariant: "default" as const,
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
      "Priority feature access"
    ],
    buttonText: "Choose Professional",
    buttonVariant: "outline" as const,
    priceId: "price_1QcuYKEYIZGXbokuvrWFAB9u"
  }
];

export const PricingSection = () => {
  const session = useSession();
  const supabase = useSupabaseClient();
  const { toast } = useToast();

  const handleSubscription = async (priceId: string | null) => {
    if (!priceId) return; // Free plan
    
    if (!session) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to subscribe to a plan.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data, error } = await supabase.functions.invoke('create-checkout-session', {
        body: { priceId }
      });

      if (error) throw error;

      if (data?.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to start checkout process",
        variant: "destructive",
      });
    }
  };

  return (
    <section id="pricing" className="py-20 px-4 bg-white scroll-mt-16">
      <div className="container mx-auto">
        <h2 className="text-4xl font-bold text-center mb-16">
          Choose Your Creative Journey
        </h2>
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
                  {plan.features.map((feature) => {
                    const isObject = typeof feature === 'object';
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
                >
                  {plan.buttonText}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};