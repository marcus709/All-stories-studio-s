import { createBrowserRouter } from "react-router-dom";
import Index from "@/pages/Index";
import Dashboard from "@/pages/Dashboard";
import Community from "@/pages/Community";
import Settings from "@/pages/Settings";
import { ProfileSettings } from "@/pages/ProfileSettings";
import { PaymentSuccess } from "@/pages/PaymentSuccess";
import InvitePage from "@/pages/InvitePage";
import UserProfilePage from "@/pages/UserProfilePage";
import ErrorBoundary from "@/components/ErrorBoundary";
import { PrivateChat } from "@/components/community/chat/PrivateChat";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Index />,
    errorElement: <ErrorBoundary />,
  },
  {
    path: "/dashboard",
    element: <Dashboard />,
    errorElement: <ErrorBoundary />,
  },
  {
    path: "/community",
    element: <Community />,
    errorElement: <ErrorBoundary />,
  },
  {
    path: "/community/chat/:friendId",
    element: <PrivateChat />,
    errorElement: <ErrorBoundary />,
  },
  {
    path: "/community/profile/:userId",
    element: <UserProfilePage />,
    errorElement: <ErrorBoundary />,
  },
  {
    path: "/settings",
    element: <Settings />,
    errorElement: <ErrorBoundary />,
  },
  {
    path: "/profile-settings",
    element: <ProfileSettings />,
    errorElement: <ErrorBoundary />,
  },
  {
    path: "/payment/success",
    element: <PaymentSuccess />,
    errorElement: <ErrorBoundary />,
  },
  {
    path: "/invite/:inviteId",
    element: <InvitePage />,
    errorElement: <ErrorBoundary />,
  },
]);

export default router;