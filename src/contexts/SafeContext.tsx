import { SafeProvider, createConfig } from '@safe-global/safe-react-hooks'
import { useWalletClient, usePublicClient, useAccount } from 'wagmi'
import { useSafeAddress } from '@/hooks/useSafe'
import { useMemo } from 'react'

export function SafeContextProvider({ children }: { children: React.ReactNode }) {
  const { data: walletClient } = useWalletClient()
  const publicClient = usePublicClient()
  const { chain } = useAccount()
  const { data: safeAddress } = useSafeAddress()

  const safeConfig = useMemo(() => {
    if (!safeAddress || !walletClient || !publicClient || !chain) {
      return null
    }

    return createConfig({
      chain: {
        id: chain.id,
      },
      safeAddress: safeAddress as string,
      provider: (window as any).ethereum,
      signer: walletClient.account.address,
    })
  }, [safeAddress, walletClient, publicClient, chain])

  if (!safeConfig) {
    return <>{children}</>
  }

  return (
    <SafeProvider config={safeConfig}>
      {children}
    </SafeProvider>
  )
}
