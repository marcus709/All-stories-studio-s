import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createClient } from "@supabase/supabase-js";
import { SessionContextProvider } from "@supabase/auth-helpers-react";
import { StoryProvider } from "./contexts/StoryContext";
import { SubscriptionProvider } from "./contexts/SubscriptionContext";
import { Toaster } from "@/components/ui/toaster";
import { Routes } from "./Routes";

// Initialize Supabase client with the URL from the client file
import { supabase } from "@/integrations/supabase/client";

const queryClient = new QueryClient();

function App() {
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <SessionContextProvider supabaseClient={supabase}>
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