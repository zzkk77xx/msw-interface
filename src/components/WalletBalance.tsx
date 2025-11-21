import { useAccount, useBalance } from 'wagmi'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { formatEther } from 'viem'

export function WalletBalance() {
  const { address, isConnected, chain } = useAccount()
  const { data: balance, isLoading } = useBalance({
    address: address,
  })

  if (!isConnected) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Wallet Balance</CardTitle>
          <CardDescription>
            Connect your wallet to see your balance
          </CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Wallet Balance</CardTitle>
        <CardDescription>
          {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : ''}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex flex-col space-y-2">
            <p className="text-sm text-muted-foreground">Network</p>
            <p className="text-lg font-semibold">{chain?.name || 'Unknown'}</p>
          </div>
          <div className="flex flex-col space-y-2">
            <p className="text-sm text-muted-foreground">Balance</p>
            {isLoading ? (
              <p className="text-lg font-semibold">Loading...</p>
            ) : balance ? (
              <div>
                <p className="text-3xl font-bold">
                  {parseFloat(formatEther(balance.value)).toFixed(4)} {balance.symbol}
                </p>
              </div>
            ) : (
              <p className="text-lg font-semibold">0 ETH</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
