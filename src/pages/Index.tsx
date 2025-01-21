import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { useState } from "react";
import { AuthModals } from "@/components/auth/AuthModals";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";

const Index = () => {
  const [showAuth, setShowAuth] = useState(false);
  const [authView, setAuthView] = useState<"signin" | "signup">("signup");
  const session = useSession();
  const supabase = useSupabaseClient();

  const handleShowAuth = (view: "signin" | "signup") => {
    setAuthView(view);
    setShowAuth(true);
  };

  return (
    <div className="min-h-screen text-white overflow-hidden">
      <div className="relative">
        <Header />
        <main className="relative">
          <HeroSection onShowAuth={handleShowAuth} />
        </main>
      </div>

      <AuthModals
        isOpen={showAuth}
        onClose={() => setShowAuth(false)}
        defaultView={authView}
      />
    </div>
  );
};

export default Index;