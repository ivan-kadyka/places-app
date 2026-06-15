'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { PropsWithChildren, useState } from 'react'

export default function ReactQueryProvider({ children }: PropsWithChildren) {
  // Use useState to ensure proper React lifecycle management instead of module-scope singleton
  // This prevents memory leaks from stale references
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60000,
            // Client-side can cache longer than server for better UX (10 minutes)
            gcTime: 10 * 60 * 1000,
            // Disable refetch on window focus to reduce unnecessary network requests
            refetchOnWindowFocus: false,
            // Reduce retries to minimize memory usage
            retry: 3
          }
        },
      })
  )

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}
