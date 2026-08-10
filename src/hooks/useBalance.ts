"use client";

import { useEffect, useState, useCallback } from "react";
import { createPublicClient, formatUnits, http } from "viem";
import { botChainTestnet, botChain } from "@/lib/chains";
import { TOKENS, ERC20_ABI } from "@/lib/tokens";
import { getEnvironment } from "@/lib/environment";

export interface BalanceState {
  botBalance: string;
  apayBalance: string;
  usdtBalance: string;
  bousdtBalance: string;
  isLoading: boolean;
  loading: boolean;
  refetch: () => Promise<void>;
}

export function useBalance(address: string | null | undefined, _chainId?: number): BalanceState {
  const [botBalance, setBotBalance] = useState<string>("0.00");
  const [apayBalance, setApayBalance] = useState<string>("0.00");
  const [usdtBalance, setUsdtBalance] = useState<string>("0.00");
  const [bousdtBalance, setBousdtBalance] = useState<string>("0.00");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchBalances = useCallback(async () => {
    if (!address || typeof window === "undefined") return;

    setIsLoading(true);

    try {
      const isMainnet = getEnvironment() === "production";
      const chain = isMainnet ? botChain : botChainTestnet;
      const tokenConfig = isMainnet ? TOKENS.botChainMainnet : TOKENS.botChainTestnet;

      const client = createPublicClient({
        chain,
        transport: http(),
      });

      const [botRaw, apayRaw, usdtRaw, bousdtRaw] = await Promise.all([
        client.getBalance({ address: address as `0x${string}` }),
        client.readContract({
          address: tokenConfig.APAY,
          abi: ERC20_ABI,
          functionName: "balanceOf",
          args: [address as `0x${string}`],
        }),
        client.readContract({
          address: tokenConfig.USDT,
          abi: ERC20_ABI,
          functionName: "balanceOf",
          args: [address as `0x${string}`],
        }),
        isMainnet && TOKENS.botChainMainnet.BOUSDT
          ? client.readContract({
              address: TOKENS.botChainMainnet.BOUSDT,
              abi: ERC20_ABI,
              functionName: "balanceOf",
              args: [address as `0x${string}`],
            })
          : Promise.resolve(BigInt(0)),
      ]);

      setBotBalance(Number(formatUnits(botRaw, 18)).toFixed(4));
      setApayBalance(Number(formatUnits(apayRaw, 18)).toFixed(2));
      setUsdtBalance(Number(formatUnits(usdtRaw, 6)).toFixed(2));
      setBousdtBalance(Number(formatUnits(bousdtRaw, 6)).toFixed(2));
    } catch (err) {
      console.error("[useBalance] Error fetching balances:", err);
    } finally {
      setIsLoading(false);
    }
  }, [address]);

  useEffect(() => {
    fetchBalances();
    const interval = setInterval(fetchBalances, 15000);
    return () => clearInterval(interval);
  }, [fetchBalances]);

  return {
    botBalance,
    apayBalance,
    usdtBalance,
    bousdtBalance,
    isLoading,
    loading: isLoading,
    refetch: fetchBalances,
  };
}
