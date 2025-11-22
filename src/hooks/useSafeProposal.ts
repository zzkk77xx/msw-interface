import { useCallback, useState } from 'react';
import { Address, encodeFunctionData } from 'viem';
import { useAccount, useWalletClient } from 'wagmi';

interface TransactionRequest {
  to: Address;
  value?: bigint;
  data: `0x${string}`;
}

export function encodeContractCall(
  contractAddress: Address,
  abi: any[],
  functionName: string,
  args: any[] = []
): `0x${string}` {
  try {
    const functionAbi = abi.find((item) => item.type === 'function' && item.name === functionName);

    if (!functionAbi) {
      throw new Error(`Function ${functionName} not found in ABI`);
    }

    return encodeFunctionData({
      abi: [functionAbi],
      functionName,
      args,
    });
  } catch (error) {
    console.error('Error encoding function call:', {
      functionName,
      args,
      error,
    });
    throw new Error(
      `Failed to encode function call for ${functionName}: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

export function useSafeProposal() {
  const { data: walletClient } = useWalletClient();
  const { address } = useAccount();
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const proposeTransaction = useCallback(
    async (transactions: TransactionRequest[]) => {
      if (!walletClient || !address) {
        throw new Error('Wallet not connected');
      }

      setIsPending(true);
      setError(null);

      try {
        // In a real implementation, this would create a Safe transaction
        // For now, we'll simulate the transaction execution directly
        for (const tx of transactions) {
          const { to, value = 0n, data } = tx;

          const hash = await walletClient.sendTransaction({
            to,
            value,
            data,
            account: address,
          });

          console.log('Transaction sent:', { hash });
        }

        return { success: true };
      } catch (err) {
        console.error('Transaction failed:', err);
        setError(err instanceof Error ? err : new Error('Transaction failed'));
        return { success: false, error: err };
      } finally {
        setIsPending(false);
      }
    },
    [walletClient, address]
  );

  return {
    proposeTransaction,
    isPending,
    error,
  };
}
