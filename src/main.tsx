import React from 'react';
import ReactDOM from 'react-dom/client';
import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import App from './App.tsx';
import { config } from './wagmi.ts';
import { ContractAddressProvider } from './contexts/ContractAddressContext.tsx';
import { ThemeProvider } from './contexts/ThemeContext.tsx';

import '@rainbow-me/rainbowkit/styles.css';
import './index.css';

const queryClient = new QueryClient();

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
              <App />
            </ContractAddressProvider>
          </RainbowKitProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </ThemeProvider>
  </React.StrictMode>
);
