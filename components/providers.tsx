"use client"

import { MiniKitProvider } from '@coinbase/onchainkit/minikit'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState } from 'react'
import { base } from 'viem/chains'

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient())

  return (
    <QueryClientProvider client={queryClient}>
      <MiniKitProvider
        projectId={process.env.NEXT_PUBLIC_MINIKIT_PROJECT_ID || 'default-project-id'}
        chain={base}
      >
        {children}
      </MiniKitProvider>
    </QueryClientProvider>
  )
}