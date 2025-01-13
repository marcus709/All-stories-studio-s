import { ProfileSettingsDialog } from "@/components/ProfileSettingsDialog";
import { useNavigate } from "react-router-dom";

const Settings = () => {
  const navigate = useNavigate();

  const handleClose = () => {
    navigate("/dashboard");
  };

  return <ProfileSettingsDialog onClose={handleClose} />;
};

export default Settings;