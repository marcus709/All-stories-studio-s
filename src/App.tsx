import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SessionContextProvider } from "@supabase/auth-helpers-react";
import { StoryProvider } from "./contexts/StoryContext";
import { SubscriptionProvider } from "./contexts/SubscriptionContext";
import { Toaster } from "@/components/ui/toaster";
import { Routes } from "./Routes";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Session } from "@supabase/supabase-js";
import { useToast } from "@/components/ui/use-toast";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});

function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Get initial session
    const initializeSession = async () => {
      try {
        const { data: { session: initialSession }, error } = await supabase.auth.getSession();
        if (error) throw error;
        setSession(initialSession);
      } catch (error) {
        console.error("Error fetching session:", error);
        toast({
          title: "Session Error",
          description: "There was an error loading your session. Please try signing in again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    initializeSession();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (_event === 'TOKEN_REFRESHED') {
        console.log('Token refreshed successfully');
      }
      
      if (_event === 'SIGNED_OUT') {
        // Clear any local storage data
        queryClient.clear();
        localStorage.removeItem('supabase.auth.token');
      }

      setSession(session);
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [toast]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <SessionContextProvider
          supabaseClient={supabase}
          initialSession={session}
        >
          <SubscriptionProvider>
            <StoryProvider>
              <Routes />
              <Toaster />
            </StoryProvider>
          </SubscriptionProvider>
        </SessionContextProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
}

export default App;