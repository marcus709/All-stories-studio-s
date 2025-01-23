import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

export default function Dashboard() {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    toast({
      title: "Coming Soon",
      description: "The dashboard feature is currently under development. Stay tuned!",
      variant: "default",
    });
    navigate("/");
  }, [navigate, toast]);

  return null;
}