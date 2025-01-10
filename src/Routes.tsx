import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Community from "./pages/Community";
import InvitePage from "./pages/InvitePage";

export default function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/community/*" element={<Community />} />
        <Route path="/invite/:inviteId" element={<InvitePage />} />
      </Routes>
    </Router>
  );
}