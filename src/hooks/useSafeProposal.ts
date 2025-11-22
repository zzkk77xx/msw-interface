import { useCallback, useState } from 'react';
import { Address, encodeFunctionData } from 'viem';
import { useAccount, useWalletClient, usePublicClient } from 'wagmi';
import Safe from '@safe-global/protocol-kit';
import { MetaTransactionData } from '@safe-global/safe-core-sdk-types';
import { createEip1193Provider } from '@/lib/viemToEip1193';
import { useSafeAddress } from './useSafe';

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
  const publicClient = usePublicClient();
  const { address } = useAccount();
  const { data: safeAddress } = useSafeAddress();
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const proposeTransaction = useCallback(
    async (transaction: TransactionRequest | TransactionRequest[]) => {
      if (!walletClient || !address) {
        throw new Error('Wallet not connected');
      }

      if (!safeAddress) {
        throw new Error('Safe address not found');
      }

      if (!publicClient) {
        throw new Error('Public client not available');
      }

      setIsPending(true);
      setError(null);

      try {
        // Create EIP-1193 provider from viem clients
        const provider = createEip1193Provider(publicClient, walletClient);

        // Initialize Safe Protocol Kit with signer
        const protocolKit = await Safe.init({
          provider,
          safeAddress: safeAddress as string,
          signer: address,
        });

        // Convert transactions to Safe format
        const transactions = Array.isArray(transaction) ? transaction : [transaction];
        const safeTransactions: MetaTransactionData[] = transactions.map((tx) => ({
          to: tx.to,
          value: (tx.value || 0n).toString(),
          data: tx.data,
        }));

        // Create Safe transaction
        const safeTransaction = await protocolKit.createTransaction({
          transactions: safeTransactions,
        });

        // Get transaction hash
        const safeTxHash = await protocolKit.getTransactionHash(safeTransaction);
        console.log('Safe transaction hash:', safeTxHash);

        // Sign the transaction
        const signedTransaction = await protocolKit.signTransaction(safeTransaction);
        console.log('Transaction signed');

        // Execute the transaction
        const executeTxResponse = await protocolKit.executeTransaction(signedTransaction);
        console.log('Transaction executed:', executeTxResponse);

        // Get transaction hash from response
        const txHash = executeTxResponse.hash;
        console.log('Transaction hash:', txHash);

        return {
          success: true,
          safeTxHash,
          transactionHash: txHash
        };
      } catch (err) {
        console.error('Safe transaction failed:', err);
        const errorMessage = err instanceof Error ? err.message : 'Transaction failed';
        setError(err instanceof Error ? err : new Error(errorMessage));
        return { success: false, error: err };
      } finally {
        setIsPending(false);
      }
    },
    [walletClient, address, safeAddress, publicClient]
  );

  return {
    proposeTransaction,
    isPending,
    error,
  };
}
