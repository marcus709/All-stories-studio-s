import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Community from "./pages/Community";
import InvitePage from "./pages/InvitePage";

export default function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/community/*" element={<Community />} />
        <Route path="/invite/:inviteId" element={<InvitePage />} />
      </Routes>
    </Router>
  );
}
