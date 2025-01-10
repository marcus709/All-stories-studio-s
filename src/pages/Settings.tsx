import { ProfileSettingsDialog } from "@/components/ProfileSettingsDialog";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";

export default function Settings() {
  const navigate = useNavigate();

  const handleClose = () => {
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 pt-20">
        <div className="max-w-[500px] mx-auto">
          <ProfileSettingsDialog onClose={handleClose} />
        </div>
      </div>
    </div>
  );
}