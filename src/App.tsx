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
import { Loader2 } from "lucide-react";

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

    // Initialize session
    const initSession = async () => {
      try {
        const { data: { session: initialSession }, error } = await supabase.auth.getSession();
        if (error) throw error;
        
        if (mounted) {
          console.log("Initial session:", initialSession);
          setSession(initialSession);
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Error fetching initial session:", error);
        if (mounted) {
          toast({
            title: "Session Error",
            description: "There was an error loading your session. Please try signing in again.",
            variant: "destructive",
          });
          setIsLoading(false);
        }
      }
    };

    initSession();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log('Auth state changed:', _event, session);
      
      if (mounted) {
        setSession(session);
        
        if (_event === 'SIGNED_OUT') {
          // Clear any local storage data
          queryClient.clear();
          localStorage.clear();
        }
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [toast]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
          <p className="text-gray-600">Loading your experience...</p>
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