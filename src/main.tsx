import React from 'react'
import ReactDOM from 'react-dom/client'
import { http, useAccount, WagmiProvider } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RainbowKitProvider } from '@rainbow-me/rainbowkit'
import App from './App.tsx'
import { config } from './wagmi.ts'
import { ContractAddressProvider } from './contexts/ContractAddressContext.tsx'
import { ThemeProvider } from './contexts/ThemeContext.tsx'
import { injected } from 'wagmi/connectors'

import '@rainbow-me/rainbowkit/styles.css'
import './index.css'

import { SafeProvider, createConfig } from '@safe-global/safe-react-hooks'
import { sepolia } from 'viem/chains'

const queryClient = new QueryClient()

const SafeProviderWrapper = () => {
  const { address } = useAccount()
  const safeConfig = createConfig({
    chain: sepolia,
    // sepolia rpc
    provider: 'https://sepolia.drpc.org',
    signer: address,
  })
  return (
    <SafeProvider config={safeConfig}>
      <App />
    </SafeProvider>
  )
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider
      defaultTheme="system"
      storageKey="msw-ui-theme"
    >
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <RainbowKitProvider>
            <ContractAddressProvider>
              <SafeProviderWrapper />
            </ContractAddressProvider>
          </RainbowKitProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </ThemeProvider>
  </React.StrictMode>
)
