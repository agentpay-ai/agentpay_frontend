export const TOKENS = {
  // BotChain Mainnet (Chain ID: 677)
  botChainMainnet: {
    APAY: "0x6A96C2755E8D88b1b369C9F3C6415B17B03eA44E" as `0x${string}`,
    USDT: "0xaBabc7Ddc03e501d190C676BF3d92ef0e6e87a3C" as `0x${string}`,
    BOUSDT: "0x118f7B25a0907577041F1c10d7E0cBD153986f66" as `0x${string}`,
  },
  // BotChain Testnet / Devnet (Chain ID: 968)
  botChainTestnet: {
    APAY: "0xFd7bF688d5a772A81DfE39da502F69FD99cE92c7" as `0x${string}`,
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
