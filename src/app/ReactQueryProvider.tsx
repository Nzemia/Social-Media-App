"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

export default function ReactQueryProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [client] = useState(new QueryClient());

  return (
    <QueryClientProvider client={client}>
      {children}
      {/* added this to always see cache . also, this is only seen in development. remember also to add it to the root layout  */}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
