import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Index from "@/pages/Index";
import Dashboard from "@/pages/Dashboard";
import Community from "@/pages/Community";
import Settings from "@/pages/Settings";
import { PaymentSuccess } from "@/pages/PaymentSuccess";
import InvitePage from "@/pages/InvitePage";

const router = createBrowserRouter([
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
    path: "/settings",
    element: <Settings />,
  },
  {
    path: "/payment/success",
    element: <PaymentSuccess />,
  },
  {
    path: "/invite/:inviteId",
    element: <InvitePage />,
  },
]);

const Routes = () => {
  return <RouterProvider router={router} />;
};

export default Routes;