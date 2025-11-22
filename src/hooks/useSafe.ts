import { useAccount, useReadContract, usePublicClient } from 'wagmi'
import { useContractAddresses } from '@/contexts/ContractAddressContext'
import { DEFI_INTERACTOR_ABI, SAFE_ABI, ROLES } from '@/lib/contracts'
import { useEffect, useState } from 'react'
import type { SubAccount } from '@/types'

/**
 * Hook to read the target Safe address from the DeFi Interactor contract
 */
export function useSafeAddress() {
  const { addresses } = useContractAddresses()

  return useReadContract({
    address: addresses.defiInteractor,
    abi: DEFI_INTERACTOR_ABI,
    functionName: 'target',
  })
}

/**
 * Hook to fetch the list of Safe owners
 */
export function useSafeOwners() {
  const { data: safeAddress } = useSafeAddress()

  return useReadContract({
    address: safeAddress,
    abi: SAFE_ABI,
    functionName: 'getOwners',
    query: {
      enabled: Boolean(safeAddress),
    },
  })
}

/**
 * Hook to check if the connected address is a Safe owner (signer)
 */
export function useIsSafeOwner() {
  const { address: connectedAddress } = useAccount()
  const { data: safeAddress } = useSafeAddress()
  const { data: owners, isLoading } = useSafeOwners()

  const isSafeOwner =
    connectedAddress &&
    owners &&
    owners.some(
      (owner) => owner.toLowerCase() === connectedAddress.toLowerCase()
    )

  return {
    isSafeOwner: Boolean(isSafeOwner),
    isLoading,
    safeAddress,
    connectedAddress,
    owners,
  }
}

/**
 * Hook to read the portfolio value from the DeFi Interactor contract
 */
export function usePortfolioValue() {
  const { addresses } = useContractAddresses()

  return useReadContract({
    address: addresses.defiInteractor,
    abi: DEFI_INTERACTOR_ABI,
    functionName: 'getPortfolioValue',
  })
}

/**
 * Hook to read sub-account limits for a given address
 */
export function useSubAccountLimits(subAccountAddress?: `0x${string}`) {
  const { addresses } = useContractAddresses()

  return useReadContract({
    address: addresses.defiInteractor,
    abi: DEFI_INTERACTOR_ABI,
    functionName: 'getSubAccountLimits',
    args: subAccountAddress ? [subAccountAddress] : undefined,
  })
}

/**
 * Hook to check if an address has a specific role
 */
export function useHasRole(member?: `0x${string}`, roleId?: number) {
  const { addresses } = useContractAddresses()

  return useReadContract({
    address: addresses.defiInteractor,
    abi: DEFI_INTERACTOR_ABI,
    functionName: 'hasRole',
    args: member && roleId !== undefined ? [member, roleId] : undefined,
  })
}

/**
 * Hook to read deposit window data for a sub-account
 */
export function useDepositWindow(subAccountAddress?: `0x${string}`) {
  const { addresses } = useContractAddresses()

  return useReadContract({
    address: addresses.defiInteractor,
    abi: DEFI_INTERACTOR_ABI,
    functionName: 'getDepositWindow',
    args: subAccountAddress ? [subAccountAddress] : undefined,
  })
}

/**
 * Hook to read withdraw window data for a sub-account
 */
export function useWithdrawWindow(subAccountAddress?: `0x${string}`) {
  const { addresses } = useContractAddresses()

  return useReadContract({
    address: addresses.defiInteractor,
    abi: DEFI_INTERACTOR_ABI,
    functionName: 'getWithdrawWindow',
    args: subAccountAddress ? [subAccountAddress] : undefined,
  })
}

/**
 * Hook to read transfer window data for a sub-account
 */
export function useTransferWindow(subAccountAddress?: `0x${string}`) {
  const { addresses } = useContractAddresses()

  return useReadContract({
    address: addresses.defiInteractor,
    abi: DEFI_INTERACTOR_ABI,
    functionName: 'getTransferWindow',
    args: subAccountAddress ? [subAccountAddress] : undefined,
  })
}

/**
 * Hook to check if a target address is allowed for a sub-account
 */
export function useIsAddressAllowed(
  subAccount?: `0x${string}`,
  target?: `0x${string}`
) {
  const { addresses } = useContractAddresses()

  return useReadContract({
    address: addresses.defiInteractor,
    abi: DEFI_INTERACTOR_ABI,
    functionName: 'allowedAddresses',
    args: subAccount && target ? [subAccount, target] : undefined,
  })
}

/**
 * Hook to fetch all managed accounts from the contract using view functions
 * Returns a list of all addresses that have been granted roles
 */
export function useManagedAccounts() {
  const { addresses } = useContractAddresses()
  const publicClient = usePublicClient()
  const [accounts, setAccounts] = useState<SubAccount[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    async function fetchManagedAccounts() {
      if (!addresses.defiInteractor || !publicClient) {
        setIsLoading(false)
        return
      }

      try {
        setIsLoading(true)
        setError(null)

        // Fetch accounts for each role using the contract's getter functions
        const [depositAccounts, withdrawAccounts] = await Promise.all([
          publicClient.readContract({
            address: addresses.defiInteractor,
            abi: DEFI_INTERACTOR_ABI,
            functionName: 'getSubaccountsByRole',
            args: [ROLES.DEFI_DEPOSIT_ROLE],
          }) as Promise<`0x${string}`[]>,
          publicClient.readContract({
            address: addresses.defiInteractor,
            abi: DEFI_INTERACTOR_ABI,
            functionName: 'getSubaccountsByRole',
            args: [ROLES.DEFI_WITHDRAW_ROLE],
          }) as Promise<`0x${string}`[]>,
        ])

        // Build a map of addresses and their roles
        const accountMap = new Map<`0x${string}`, { depositRole: boolean; withdrawRole: boolean }>()

        // Add deposit role accounts
        for (const address of depositAccounts) {
          accountMap.set(address, {
            depositRole: true,
            withdrawRole: false,
          })
        }

        // Add withdraw role accounts
        for (const address of withdrawAccounts) {
          const existing = accountMap.get(address)
          if (existing) {
            existing.withdrawRole = true
          } else {
            accountMap.set(address, {
              depositRole: false,
              withdrawRole: true,
            })
          }
        }

        // Convert map to array
        const accountList: SubAccount[] = Array.from(accountMap.entries()).map(
          ([address, roles]) => ({
            address,
            hasDepositRole: roles.depositRole,
            hasWithdrawRole: roles.withdrawRole,
          })
        )

        setAccounts(accountList)
      } catch (err) {
        console.error('Error fetching managed accounts:', err)
        setError(err instanceof Error ? err : new Error('Failed to fetch managed accounts'))
      } finally {
        setIsLoading(false)
      }
    }

    fetchManagedAccounts()
  }, [addresses.defiInteractor, publicClient])

  return { accounts, isLoading, error, refetch: () => setIsLoading(true) }
}
