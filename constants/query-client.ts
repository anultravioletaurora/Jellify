import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            gcTime: Infinity, // disable
            staleTime: (1000 * 60) * 60 // 1 hour, users can manually refresh stuff too!
        }
    }
});