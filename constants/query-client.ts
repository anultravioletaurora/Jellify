import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            gcTime: (1000 * 60 * 60 * 24) * 5, // 5 days, for maximum cache-age
            staleTime: (1000 * 60 * 60 * 1), // 1 hour, this can be refreshed manually anyways
        }
    }
});