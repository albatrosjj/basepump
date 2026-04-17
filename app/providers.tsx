'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiProvider, createConfig, http } from 'wagmi'
import { base } from 'wagmi/chains'
import { farcasterFrame } from '@farcaster/miniapp-wagmi-connector'
import { type ReactNode } from 'react'

const config = createConfig({
  chains: [base],
  connectors: [
    farcasterFrame(),
  ],
  transports: {
    [base.id]: http('https://mainnet.base.org'),
  },
})

const queryClient = new QueryClient()

export function Providers({ children }: { children: ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  )
}
