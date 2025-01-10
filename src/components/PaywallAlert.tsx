import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useNavigate } from "react-router-dom";
import { useSubscription } from "@/contexts/SubscriptionContext";

interface PaywallAlertProps {
  isOpen: boolean;
  onClose: () => void;
  feature: string;
  requiredPlan: string;
}

export const PaywallAlert = ({ isOpen, onClose, feature, requiredPlan }: PaywallAlertProps) => {
  const navigate = useNavigate();
  const { isTrialExpired } = useSubscription();

  const handleViewPlans = () => {
    onClose();
    navigate("/?scrollTo=pricing");
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Premium Feature</AlertDialogTitle>
          <AlertDialogDescription>
            {isTrialExpired ? (
              <>
                Your free trial has expired. {feature} is only available on the {requiredPlan} plan or higher. 
                Upgrade your plan to continue using this feature and many more!
              </>
            ) : (
              <>
                {feature} is only available on the {requiredPlan} plan or higher. 
                Upgrade your plan to access this feature and many more!
              </>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose}>Continue Browsing</AlertDialogCancel>
          <AlertDialogAction onClick={handleViewPlans}>
            View Plans
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};