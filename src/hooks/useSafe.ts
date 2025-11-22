import { useAccount, useReadContract } from 'wagmi'
import { useContractAddresses } from '@/contexts/ContractAddressContext'
import { DEFI_INTERACTOR_ABI, SAFE_ABI } from '@/lib/contracts'

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
