import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SessionContextProvider } from "@supabase/auth-helpers-react";
import { StoryProvider } from "./contexts/StoryContext";
import { SubscriptionProvider } from "./contexts/SubscriptionContext";
import { Toaster } from "@/components/ui/toaster";
import AppRoutes from "./Routes";
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
    let mounted = true;

    // Get initial session
    const initializeSession = async () => {
      try {
        const { data: { session: initialSession }, error } = await supabase.auth.getSession();
        if (error) {
          console.error("Error fetching session:", error);
          throw error;
        }
        if (mounted) {
          setSession(initialSession);
        }
      } catch (error) {
        console.error("Error initializing session:", error);
        if (mounted) {
          toast({
            title: "Session Error",
            description: "There was an error loading your session. Please try signing in again.",
            variant: "destructive",
          });
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    initializeSession();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      console.log('Auth state changed:', _event);
      
      if (_event === 'SIGNED_OUT') {
        // Clear any local storage data
        queryClient.clear();
        localStorage.clear();
      }

      if (mounted) {
        setSession(session);
        setIsLoading(false);
      }
    });

    // Cleanup function
    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [toast]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
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
              <AppRoutes />
              <Toaster />
            </StoryProvider>
          </SubscriptionProvider>
        </SessionContextProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
}

export default App;