import { useState, useCallback } from "react";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";

export function useAuth() {
  const { session } = useSessionContext();
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [authView, setAuthView] = useState<"signin" | "signup">("signin");

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
  }, []);

  const showAuth = useCallback((view: "signin" | "signup") => {
    setAuthView(view);
    setShowAuthDialog(true);
  }, []);

  return {
    session,
    signOut,
    showAuth,
    showAuthDialog,
    setShowAuthDialog,
    authView,
  };
}