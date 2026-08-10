export const TOKENS = {
  // BotChain Mainnet (Chain ID: 677) - Set via env vars when deployed
  botChainMainnet: {
    APAY: (process.env.NEXT_PUBLIC_APAY_TOKEN_ADDRESS_MAINNET || "") as `0x${string}`,
    USDT: (process.env.NEXT_PUBLIC_USDT_TOKEN_ADDRESS_MAINNET || "") as `0x${string}`,
    BOUSDT: (process.env.NEXT_PUBLIC_BOUSDT_TOKEN_ADDRESS_MAINNET || "") as `0x${string}`,
  },
  // BotChain Testnet / Devnet (Chain ID: 968)
  botChainTestnet: {
    APAY: (process.env.NEXT_PUBLIC_APAY_TOKEN_ADDRESS_TESTNET || "0xFd7bF688d5a772A81DfE39da502F69FD99cE92c7") as `0x${string}`,
    USDT: (process.env.NEXT_PUBLIC_USDT_TOKEN_ADDRESS_TESTNET || "0x75edC9335175Fc0552D51D48439F229c10420fe3") as `0x${string}`,
  },
};

export const ERC20_ABI = [
  {
    name: "balanceOf",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "account", type: "address" }],
    outputs: [{ type: "uint256" }],
  },
  {
    name: "decimals",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [{ type: "uint8" }],
  },
  {
    name: "symbol",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [{ type: "string" }],
  },
  {
    name: "transfer",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "to", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    outputs: [{ type: "bool" }],
  },
  {
    name: "authorizationState",
    type: "function",
    stateMutability: "view",
    inputs: [
      { name: "authorizer", type: "address" },
      { name: "nonce", type: "bytes32" },
    ],
    outputs: [{ type: "bool" }],
  },
] as const;
