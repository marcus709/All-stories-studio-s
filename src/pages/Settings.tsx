import { ProfileSettingsDialog } from "@/components/ProfileSettingsDialog";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function Settings() {
  const navigate = useNavigate();

  // Redirect back to previous page when mounted
  useEffect(() => {
    const previousPath = window.history.state?.usr?.previousPath || "/";
    navigate(previousPath, { replace: true });
  }, [navigate]);

  return <ProfileSettingsDialog />;
}