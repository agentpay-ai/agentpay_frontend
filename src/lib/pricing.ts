/**
 * Service prices and stablecoin payment config.
 *
 * AgentPay charges only USDT (6 decimals) via x402 ExactEvmScheme / EIP-3009.
 * Native BOT is never accepted as payment — it may only cover network fees.
 */

export const PAYMENT_ASSET = "USDT" as const;
export const PAYMENT_DECIMALS = 6;

/** Per-service prices in USDT atomic units (6 decimals). Must match the API. */
export const SERVICE_PRICES = {
  chat: {
    amountAtomic: BigInt(10_000), // $0.01
    amountUsd: 0.01,
    label: "AI Text Assistant",
    path: "/api/chat",
  },
  image: {
    amountAtomic: BigInt(50_000), // $0.05
    amountUsd: 0.05,
    label: "AI Image Generator",
    path: "/api/image",
  },
  code: {
    amountAtomic: BigInt(20_000), // $0.02
    amountUsd: 0.02,
    label: "Smart Contract Auditor",
    path: "/api/code",
  },
  relay: {
    amountAtomic: BigInt(10_000), // $0.01
    amountUsd: 0.01,
    label: "BotChain Agent Relay",
    path: "/api/botchain/relay",
  },
} as const;

export type ServiceKey = keyof typeof SERVICE_PRICES;

/** Suggested spending budgets the user can pre-authorize (USD). */
export const BUDGET_PRESETS_USD = [0.5, 1, 5, 10] as const;

export function formatUsdt(amountUsd: number): string {
  if (Number.isInteger(amountUsd)) return `$${amountUsd.toFixed(2)} USDT`;
  // Keep sub-cent prices readable without trailing noise.
  const fixed = amountUsd < 0.1 ? amountUsd.toFixed(2) : amountUsd.toFixed(2);
  return `$${fixed} USDT`;
}

export function usdToAtomic(amountUsd: number): bigint {
  return BigInt(Math.round(amountUsd * 10 ** PAYMENT_DECIMALS));
}

export function atomicToUsd(amountAtomic: bigint): number {
  return Number(amountAtomic) / 10 ** PAYMENT_DECIMALS;
}

export function formatAtomicUsdt(amountAtomic: bigint): string {
  return formatUsdt(atomicToUsd(amountAtomic));
}
