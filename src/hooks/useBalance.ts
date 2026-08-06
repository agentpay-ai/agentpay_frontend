"use client";

import { useEffect, useState, useCallback } from "react";
import { formatUnits } from "viem";
import {
  publicClientBotChain,
  publicClientBotChainTestnet,
} from "@/lib/chains";
import { TOKENS, ERC20_ABI } from "@/lib/tokens";

export function useBalance(address: string | null, chainId: number = 968) {
  const [botBalance, setBotBalance] = useState<string>("0.00");
  const [usdtBalance, setUsdtBalance] = useState<string>("0.00");
  const [bousdtBalance, setBousdtBalance] = useState<string>("0.00");
  const [loading, setLoading] = useState<boolean>(false);

  const fetchBalances = useCallback(async () => {
    if (!address) return;
    setLoading(true);
    try {
      const isMainnet = chainId === 677;
      const botClient = isMainnet ? publicClientBotChain : publicClientBotChainTestnet;
      const tokenConfig = isMainnet ? TOKENS.botChainMainnet : TOKENS.botChainTestnet;

      const [botRaw, usdtRaw, bousdtRaw] = await Promise.all([
        botClient.getBalance({ address: address as `0x${string}` }).catch(() => BigInt(0)),
        botClient
          .readContract({
            address: tokenConfig.USDT,
            abi: ERC20_ABI,
            functionName: "balanceOf",
            args: [address as `0x${string}`],
          })
          .catch(() => BigInt(0)),
        isMainnet && TOKENS.botChainMainnet.BOUSDT
          ? botClient
              .readContract({
                address: TOKENS.botChainMainnet.BOUSDT,
                abi: ERC20_ABI,
                functionName: "balanceOf",
                args: [address as `0x${string}`],
              })
              .catch(() => BigInt(0))
          : Promise.resolve(BigInt(0)),
      ]);

      setBotBalance(Number(formatUnits(botRaw, 18)).toFixed(2));
      setUsdtBalance(Number(formatUnits(usdtRaw, 6)).toFixed(2));
      setBousdtBalance(Number(formatUnits(bousdtRaw, 6)).toFixed(2));
    } catch (err) {
      console.error("Error reading balances:", err);
    } finally {
      setLoading(false);
    }
  }, [address, chainId]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (address) {
        fetchBalances();
      }
    }, 0);
    const interval = setInterval(() => {
      if (address) fetchBalances();
    }, 15000);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [address, fetchBalances]);

  return {
    botBalance,
    usdtBalance,
    bousdtBalance,
    loading,
    refetch: fetchBalances,
  };
}
