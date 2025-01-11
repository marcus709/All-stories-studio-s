import { createBrowserRouter } from "react-router-dom";
import Index from "@/pages/Index";
import { Dashboard } from "@/pages/Dashboard";
import Community from "@/pages/Community";
import Settings from "@/pages/Settings";
import { ProfileSettings } from "@/pages/ProfileSettings";
import { PaymentSuccess } from "@/pages/PaymentSuccess";
import InvitePage from "@/pages/InvitePage";
import { UserProfilePage } from "@/components/community/UserProfilePage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Index />,
  },
  {
    path: "/dashboard",
    element: <Dashboard />,
  },
  {
    path: "/community",
    element: <Community />,
  },
  {
    path: "/community/profile/:id",
    element: <UserProfilePage />,
  },
  {
    path: "/settings",
    element: <Settings />,
  },
  {
    path: "/profile-settings",
    element: <ProfileSettings />,
  },
  {
    path: "/payment/success",
    element: <PaymentSuccess />,
  },
  {
    path: "/invite/:id",
    element: <InvitePage />,
  },
]);