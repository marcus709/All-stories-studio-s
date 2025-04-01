
import { Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Community from "./pages/Community";
import InvitePage from "./pages/InvitePage";
import { Header } from "./components/Header";
import Dashboard from "./pages/Dashboard";
import { ProfileSettings } from "./pages/ProfileSettings";
import { CharactersView } from "./components/CharactersView";
import { StoryDocsView } from "./components/docs/StoryDocsView";
import { CommunityFeed } from "./components/community/CommunityFeed";
import { UserProfileView } from "./components/community/chat/UserProfileView";
import { useState } from "react";

function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      {children}
    </>
  );
}

export default function AppRoutes() {
  // Temporary implementation - in a real app this would be handled with a proper router state
  const [selectedUser, setSelectedUser] = useState<any>(null);

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
        path="/dashboard/*"
        element={
          <AppLayout>
            <Dashboard />
          </AppLayout>
        }
      >
        <Route path="characters" element={<CharactersView />} />
        <Route path="docs" element={<StoryDocsView />} />
      </Route>
      <Route
        path="/community/*"
        element={
          <AppLayout>
            <Community />
          </AppLayout>
        }
      >
        <Route path="" element={<CommunityFeed />} />
        <Route 
          path="profile/:userId" 
          element={
            <UserProfileView 
              user={selectedUser} 
              onClose={() => setSelectedUser(null)} 
            />
          } 
        />
      </Route>
      <Route
        path="/invite/:inviteId"
        element={
          <AppLayout>
            <InvitePage />
          </AppLayout>
        }
      />
      <Route
        path="/profile/settings"
        element={
          <AppLayout>
            <ProfileSettings />
          </AppLayout>
        }
      />
    </Routes>
  );
}
