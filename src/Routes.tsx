import { Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Community from "./pages/Community";
import InvitePage from "./pages/InvitePage";
import { Header } from "./components/Header";
import { Dashboard } from "./pages/Dashboard";

function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      {children}
    </>
  );
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <AppLayout>
            <Index />
          </AppLayout>
        }
      />
      <Route
        path="/dashboard"
        element={
          <AppLayout>
            <Dashboard />
          </AppLayout>
        }
      />
      <Route
        path="/community/*"
        element={
          <AppLayout>
            <Community />
          </AppLayout>
        }
      />
      <Route
        path="/invite/:inviteId"
        element={
          <AppLayout>
            <InvitePage />
          </AppLayout>
        }
      />
    </Routes>
  );
}