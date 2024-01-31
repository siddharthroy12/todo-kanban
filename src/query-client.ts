import { MutationCache, QueryClient } from "@tanstack/react-query";
import { toast } from "./hooks/use-toast";

import { QueryCache } from "@tanstack/react-query";

const queryCache = new QueryCache({
  onError: () => {
    toast({
      title: "Failed",
      description: "Failed to fetch data from server",
      variant: "destructive",
    });
  },
});

const mutationCache = new MutationCache({
  onError: () => {
    toast({
      title: "Action failed",
      description: "Your last action has failed",
      variant: "destructive",
    });
  },
});

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      retry: 1,
    },
  },
  queryCache: queryCache,
  mutationCache: mutationCache,
});
