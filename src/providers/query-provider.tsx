"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useEffect, useState } from "react";

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  useEffect(() => {
    if (typeof window !== "undefined") {
      const handler = () => {
        fetch("/api/analytics/usage", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          keepalive: true,
          body: JSON.stringify({
            event: "route_change",
            properties: { path: window.location.pathname },
          }),
        }).catch(() => {});
      };
      window.addEventListener("popstate", handler);
      handler();
      return () => window.removeEventListener("popstate", handler);
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
