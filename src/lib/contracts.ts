// DeFiInteractor contract ABI (role management functions only)
export const DEFI_INTERACTOR_ABI = [
  // Read Functions
  {
    inputs: [
      { name: 'member', type: 'address' },
      { name: 'roleId', type: 'uint16' }
    ],
    name: 'hasRole',
    outputs: [{ name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'paused',
    outputs: [{ name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'safe',
    outputs: [{ name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'DEFI_DEPOSIT_ROLE',
    outputs: [{ name: '', type: 'uint16' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'DEFI_WITHDRAW_ROLE',
    outputs: [{ name: '', type: 'uint16' }],
    stateMutability: 'view',
    type: 'function'
  },

  // Write Functions
  {
    inputs: [
      { name: 'member', type: 'address' },
      { name: 'roleId', type: 'uint16' }
    ],
    name: 'grantRole',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      { name: 'member', type: 'address' },
      { name: 'roleId', type: 'uint16' }
    ],
    name: 'revokeRole',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [],
    name: 'pause',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [],
    name: 'unpause',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },

  // Events
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: 'member', type: 'address' },
      { indexed: true, name: 'roleId', type: 'uint16' },
      { indexed: false, name: 'timestamp', type: 'uint256' }
    ],
    name: 'RoleAssigned',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: 'member', type: 'address' },
      { indexed: true, name: 'roleId', type: 'uint16' },
      { indexed: false, name: 'timestamp', type: 'uint256' }
    ],
    name: 'RoleRevoked',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: 'by', type: 'address' },
      { indexed: false, name: 'timestamp', type: 'uint256' }
    ],
    name: 'EmergencyPaused',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: 'by', type: 'address' },
      { indexed: false, name: 'timestamp', type: 'uint256' }
    ],
    name: 'EmergencyUnpaused',
    type: 'event'
  }
] as const

// Contract addresses - update these with your deployed addresses
export const CONTRACT_ADDRESSES = {
  DEFI_INTERACTOR: (import.meta.env.VITE_DEFI_INTERACTOR_ADDRESS || '0x') as `0x${string}`,
  SAFE: (import.meta.env.VITE_SAFE_ADDRESS || '0x') as `0x${string}`,
} as const

// Role constants
export const ROLES = {
  DEFI_DEPOSIT_ROLE: 1,
  DEFI_WITHDRAW_ROLE: 2,
} as const

export const ROLE_NAMES = {
  [ROLES.DEFI_DEPOSIT_ROLE]: 'Deposit',
  [ROLES.DEFI_WITHDRAW_ROLE]: 'Withdraw',
} as const

export const ROLE_DESCRIPTIONS = {
  [ROLES.DEFI_DEPOSIT_ROLE]: 'Can deposit to Morpho Vaults (10% of balance per 24h)',
  [ROLES.DEFI_WITHDRAW_ROLE]: 'Can withdraw from Morpho Vaults (5% of position per 24h)',
} as const
