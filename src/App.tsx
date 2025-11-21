import { ConnectButton } from '@rainbow-me/rainbowkit'
import { WalletBalance } from '@/components/WalletBalance'

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center space-y-8">
          {/* Header */}
          <div className="w-full max-w-4xl flex justify-between items-center">
            <h1 className="text-4xl font-bold tracking-tight">
              Web3 Wallet Balance
            </h1>
            <ConnectButton />
          </div>

          {/* Main Content */}
          <div className="w-full max-w-4xl flex justify-center">
            <WalletBalance />
          </div>

          {/* Footer */}
          <div className="text-center text-sm text-muted-foreground">
            <p>Connect your wallet to view your balance across different networks</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
