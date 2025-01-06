import { Route, Routes as RouterRoutes, useParams } from "react-router-dom";
import { Header } from "./components/Header";
import Index from "./pages/Index";
import Community from "./pages/Community";
import Settings from "./pages/Settings";
import { PaymentSuccess } from "./pages/PaymentSuccess";
import { Dashboard } from "./pages/Dashboard";
import { PrivateChat } from "./components/community/chat/PrivateChat";

const PrivateChatWrapper = () => {
  const { friendId } = useParams();
  return friendId ? <PrivateChat friendId={friendId} /> : null;
};

export const Routes = () => {
  return (
    <>
      <Header />
      <RouterRoutes>
        <Route path="/" element={<Index />} />
        <Route path="/dashboard/*" element={<Dashboard />} />
        <Route path="/community/*" element={<Community />} />
        <Route path="/community/chat/:friendId" element={<PrivateChatWrapper />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/payment/success" element={<PaymentSuccess />} />
      </RouterRoutes>
    </>
  );
};