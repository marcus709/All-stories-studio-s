import { ProfileSettingsDialog } from "@/components/ProfileSettingsDialog";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function Settings() {
  const navigate = useNavigate();

  const handleClose = () => {
    navigate("/dashboard");
  };

  return <ProfileSettingsDialog onClose={handleClose} />;
}