export const SCOREBOARD_ADDRESS = '0x4573CdA7ec24743366ceBB2d3aA851B202463fE6' as const

export const SCOREBOARD_ABI = [
  {
    type: 'function',
    name: 'recordWin',
    inputs: [{ name: 'currentStreak', type: 'uint256' }],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'recordLoss',
    inputs: [],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'getPlayer',
    inputs: [{ name: 'player', type: 'address' }],
    outputs: [
      { name: 'score', type: 'uint256' },
      { name: 'streak', type: 'uint256' },
      { name: 'games', type: 'uint256' },
      { name: 'correct', type: 'uint256' },
    ],
    stateMutability: 'view',
  },
] as const
