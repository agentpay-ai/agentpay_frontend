export const TOKENS = {
  // BotChain Mainnet (Chain ID: 677)
  botChainMainnet: {
    USDT: "0xaBabc7Ddc03e501d190C676BF3d92ef0e6e87a3C" as `0x${string}`,
    BOUSDT: "0x118f7B25a0907577041F1c10d7E0cBD153986f66" as `0x${string}`,
  },
  // BotChain Testnet / Devnet (Chain ID: 968)
  botChainTestnet: {
    USDT: "0x75edC9335175Fc0552D51D48439F229c10420fe3" as `0x${string}`,
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
] as const;
