/**
 * Service prices and $APAY utility token payment config.
 *
 * AgentPay charges $APAY (18 decimals) via x402 ExactEvmScheme / EIP-3009.
 */

export const PAYMENT_ASSET = "APAY" as const;
export const PAYMENT_DECIMALS = 18;

/** Per-service prices in APAY atomic units (18 decimals). Must match the API gateway. */
export const SERVICE_PRICES = {
  chat: {
    amountAtomic: BigInt("1000000000000000000"), // 1.0 APAY
    amountTokens: 1.0,
    label: "AI Text Assistant",
    path: "/api/chat",
  },
  image: {
    amountAtomic: BigInt("5000000000000000000"), // 5.0 APAY
    amountTokens: 5.0,
    label: "AI Image Generator",
    path: "/api/image",
  },
  code: {
    amountAtomic: BigInt("2000000000000000000"), // 2.0 APAY
    amountTokens: 2.0,
    label: "Smart Contract Auditor",
    path: "/api/code",
  },
  relay: {
    amountAtomic: BigInt("1000000000000000000"), // 1.0 APAY
    amountTokens: 1.0,
    label: "BotChain Agent Relay",
    path: "/api/botchain/relay",
  },
} as const;

export type ServiceKey = keyof typeof SERVICE_PRICES;

/** Suggested spending budgets the user can pre-authorize (APAY). */
export const BUDGET_PRESETS_TOKENS = [10, 50, 100, 500] as const;

export function formatApay(tokens: number): string {
  return `${tokens.toFixed(1)} $APAY`;
}

export function tokensToAtomic(tokens: number): bigint {
  return BigInt(Math.round(tokens * 10 ** PAYMENT_DECIMALS));
}

export function atomicToTokens(amountAtomic: bigint): number {
  return Number(amountAtomic) / 10 ** PAYMENT_DECIMALS;
}

export function formatAtomicApay(amountAtomic: bigint): string {
  return formatApay(atomicToTokens(amountAtomic));
}

// Backward compatibility helpers
export const BUDGET_PRESETS_USD = BUDGET_PRESETS_TOKENS;
export const formatUsdt = formatAtomicApay;
export const formatAtomicUsdt = formatAtomicApay;
export const usdToAtomic = tokensToAtomic;
export const atomicToUsd = atomicToTokens;
