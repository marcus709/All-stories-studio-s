import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { capitalize } from "lodash";

export const PaymentSuccess = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { plan } = useSubscription();

  useEffect(() => {
    // Show success toast
    toast({
      title: "Thank you for your subscription!",
      description: `You are now on the ${capitalize(plan)} plan. Enjoy the premium features!`,
      duration: 5000,
    });

    // Redirect to dashboard after 2 seconds
    const timeout = setTimeout(() => {
      navigate("/dashboard");
    }, 2000);

    return () => clearTimeout(timeout);
  }, [navigate, toast, plan]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-50 to-pink-50">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-gray-900">Thank You!</h1>
        <p className="text-gray-600">
          Your payment was successful. You are now subscribed to the {capitalize(plan)} plan.
        </p>
        <p className="text-sm text-gray-500">
          Redirecting you to the dashboard...
        </p>
      </div>
    </div>
  );
};