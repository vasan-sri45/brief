// src/lib/queryClient.js
import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient(
  {
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5 * 60 * 1000,
      gcTime: 30 * 60 * 1000,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    },
    mutations: {
      retry: 0,
    },
  },
}
);
