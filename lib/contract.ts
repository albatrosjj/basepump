export const SCOREBOARD_ADDRESS = '0xCE10A7E9cD982B86D25d14e31963012bDcf5A5a0' as const

export const SCOREBOARD_ABI = [
  {
    type: 'function',
    name: 'makePrediction',
    inputs: [
      { name: 'price', type: 'uint256' },
      { name: 'direction', type: 'bool' },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'resolvePrediction',
    inputs: [{ name: 'finalPrice', type: 'uint256' }],
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
    ],
    stateMutability: 'view',
  },
] as const
