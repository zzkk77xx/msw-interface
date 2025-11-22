import { useSendTransaction } from '@safe-global/safe-react-hooks'
import { encodeFunctionData } from 'viem'

interface ProposeTransactionParams {
  to: `0x${string}`
  value?: string
  data: `0x${string}`
}

export function useSafeProposal() {
  const {
    sendTransactionAsync,
    isPending,
    error,
    data
  } = useSendTransaction()

  const proposeTransaction = async ({ to, value = '0', data }: ProposeTransactionParams) => {
    try {
      console.log('Proposing transaction to Safe:', { to, value, data })

      const result = await sendTransactionAsync({
        transactions: [{
          to,
          value,
          data,
        }]
      })

      console.log('Transaction proposed successfully:', result)

      // SafeClientResult can have different shapes depending on operation type
      return (result as any)?.safeTxHash || (result as any)?.hash || null
    } catch (err) {
      console.error('Error proposing transaction:', err)
      throw err
    }
  }

  return {
    proposeTransaction,
    isPending,
    error: error?.message || null,
    txHash: (data as any)?.safeTxHash || (data as any)?.hash || null,
  }
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
