import { Route, Routes as RouterRoutes } from "react-router-dom";
import { Header } from "./components/Header";
import Index from "./pages/Index";
import Community from "./pages/Community";
import Settings from "./pages/Settings";
import { PaymentSuccess } from "./pages/PaymentSuccess";
import { Dashboard } from "./pages/Dashboard";
import { PrivateChat } from "./components/community/chat/PrivateChat";
import { ProfileSettings } from "./pages/ProfileSettings";

export const Routes = () => {
  return (
    <>
      <Header />
      <RouterRoutes>
        <Route path="/" element={<Index />} />
        <Route path="/dashboard/*" element={<Dashboard />} />
        <Route path="/community/*" element={<Community />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/profile/settings" element={<ProfileSettings />} />
        <Route path="/payment/success" element={<PaymentSuccess />} />
      </RouterRoutes>
    </>
  );
};