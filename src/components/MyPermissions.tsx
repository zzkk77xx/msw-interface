import { useAccount, useReadContract } from 'wagmi'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CONTRACT_ADDRESSES, DEFI_INTERACTOR_ABI, ROLES, ROLE_NAMES, ROLE_DESCRIPTIONS } from '@/lib/contracts'

export function MyPermissions() {
  const { address, isConnected } = useAccount()

  // Check which roles the connected address has
  const { data: hasDepositRole } = useReadContract({
    address: CONTRACT_ADDRESSES.DEFI_INTERACTOR,
    abi: DEFI_INTERACTOR_ABI,
    functionName: 'hasRole',
    args: address ? [address, ROLES.DEFI_DEPOSIT_ROLE] : undefined,
  })

  const { data: hasWithdrawRole } = useReadContract({
    address: CONTRACT_ADDRESSES.DEFI_INTERACTOR,
    abi: DEFI_INTERACTOR_ABI,
    functionName: 'hasRole',
    args: address ? [address, ROLES.DEFI_WITHDRAW_ROLE] : undefined,
  })

  if (!isConnected) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>My Permissions</CardTitle>
          <CardDescription>Connect wallet to view your permissions</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  const hasAnyRole = hasDepositRole || hasWithdrawRole

  return (
    <Card>
      <CardHeader>
        <CardTitle>My Permissions</CardTitle>
        <CardDescription>
          Your current roles and capabilities
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground mb-2">Active Roles</p>
            {hasAnyRole ? (
              <div className="flex flex-wrap gap-2">
                {hasDepositRole && (
                  <Badge className="bg-blue-100 text-blue-800">
                    {ROLE_NAMES[ROLES.DEFI_DEPOSIT_ROLE]}
                  </Badge>
                )}
                {hasWithdrawRole && (
                  <Badge className="bg-purple-100 text-purple-800">
                    {ROLE_NAMES[ROLES.DEFI_WITHDRAW_ROLE]}
                  </Badge>
                )}
              </div>
            ) : (
              <Badge variant="outline">No Roles</Badge>
            )}
          </div>

          {hasAnyRole && (
            <div className="space-y-3 mt-4">
              <p className="text-sm font-medium">Capabilities</p>

              {hasDepositRole && (
                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm font-medium text-blue-900">
                    {ROLE_NAMES[ROLES.DEFI_DEPOSIT_ROLE]} Role
                  </p>
                  <p className="text-xs text-blue-700 mt-1">
                    {ROLE_DESCRIPTIONS[ROLES.DEFI_DEPOSIT_ROLE]}
                  </p>
                </div>
              )}

              {hasWithdrawRole && (
                <div className="p-3 bg-purple-50 rounded-lg">
                  <p className="text-sm font-medium text-purple-900">
                    {ROLE_NAMES[ROLES.DEFI_WITHDRAW_ROLE]} Role
                  </p>
                  <p className="text-xs text-purple-700 mt-1">
                    {ROLE_DESCRIPTIONS[ROLES.DEFI_WITHDRAW_ROLE]}
                  </p>
                </div>
              )}
            </div>
          )}

          {!hasAnyRole && (
            <div className="p-3 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">
                You don't have any roles yet. A Safe owner needs to grant you permissions before
                you can execute DeFi operations.
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
