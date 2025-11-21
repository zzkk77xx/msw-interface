export interface SubAccount {
  address: `0x${string}`
  hasDepositRole: boolean
  hasWithdrawRole: boolean
  addedAt?: number
}

export interface RoleEvent {
  member: `0x${string}`
  roleId: number
  timestamp: bigint
  txHash: string
  type: 'assigned' | 'revoked'
}

export interface PauseEvent {
  by: `0x${string}`
  timestamp: bigint
  txHash: string
  type: 'paused' | 'unpaused'
}
