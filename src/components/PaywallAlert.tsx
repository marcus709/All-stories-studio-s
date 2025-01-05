import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface PaywallAlertProps {
  isOpen: boolean;
  onClose: () => void;
  feature: string;
  requiredPlan: string;
}

export const PaywallAlert = ({ isOpen, onClose, feature, requiredPlan }: PaywallAlertProps) => {
  const navigate = useNavigate();

  const handleCancel = () => {
    onClose();
    navigate("/dashboard");
  };

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
            {feature} is only available on the {requiredPlan} plan or higher. Upgrade your plan to access this feature and many more!
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleCancel}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleViewPlans}>
            View Plans
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};