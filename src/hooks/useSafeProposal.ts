import { useState } from 'react'
import { useAccount, useWalletClient } from 'wagmi'
import { useSafeAddress } from './useSafe'
import Safe from '@safe-global/protocol-kit'
import SafeApiKit from '@safe-global/api-kit'
import { encodeFunctionData } from 'viem'

interface ProposeTransactionParams {
  to: `0x${string}`
  value?: string
  data: `0x${string}`
}

export function useSafeProposal() {
  const { address } = useAccount()
  const { data: walletClient } = useWalletClient()
  const { data: safeAddress } = useSafeAddress()
  const [isPending, setIsPending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [txHash, setTxHash] = useState<string | null>(null)

  const proposeTransaction = async ({ to, value = '0', data }: ProposeTransactionParams) => {
    if (!safeAddress || !address || !walletClient) {
      setError('Wallet not connected or Safe address not available')
      return
    }

    setIsPending(true)
    setError(null)
    setTxHash(null)

    try {
      // Get the chain ID
      const chainId = await walletClient.getChainId()

      // Initialize Safe Protocol Kit
      const protocolKit = await Safe.init({
        provider: walletClient.transport.url || window.ethereum,
        signer: address,
        safeAddress: safeAddress as string,
      })

      // Create transaction
      const safeTransaction = await protocolKit.createTransaction({
        transactions: [{
          to,
          value,
          data,
        }]
      })

      // Get transaction hash
      const safeTxHash = await protocolKit.getTransactionHash(safeTransaction)

      // Sign transaction
      const signature = await protocolKit.signHash(safeTxHash)

      // Get the Safe API service URL based on chain ID
      const txServiceUrl = getTxServiceUrl(chainId)

      if (!txServiceUrl) {
        throw new Error(`Transaction service not available for chain ID ${chainId}`)
      }

      // Initialize API Kit
      const apiKit = new SafeApiKit({
        chainId: BigInt(chainId),
      })

      // Propose transaction to the Safe Transaction Service
      await apiKit.proposeTransaction({
        safeAddress: safeAddress as string,
        safeTransactionData: safeTransaction.data,
        safeTxHash,
        senderAddress: address,
        senderSignature: signature.data,
      })

      setTxHash(safeTxHash)
      setIsPending(false)
      return safeTxHash
    } catch (err) {
      console.error('Error proposing transaction:', err)
      setError(err instanceof Error ? err.message : 'Failed to propose transaction')
      setIsPending(false)
      throw err
    }
  }

  return {
    proposeTransaction,
    isPending,
    error,
    txHash,
  }
}

// Helper function to get transaction service URL based on chain ID
function getTxServiceUrl(chainId: number): string | null {
  const urls: Record<number, string> = {
    1: 'https://safe-transaction-mainnet.safe.global',
    11155111: 'https://safe-transaction-sepolia.safe.global',
    137: 'https://safe-transaction-polygon.safe.global',
    8453: 'https://safe-transaction-base.safe.global',
  }
  return urls[chainId] || null
}

// Helper function to encode contract function calls
export function encodeContractCall(
  abi: readonly any[],
  functionName: string,
  args: any[]
): `0x${string}` {
  return encodeFunctionData({
    abi: abi as any,
    functionName,
    args,
  })
}
