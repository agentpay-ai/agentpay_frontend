"use client";

import { ReactNode, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { PrivyProvider } from "@privy-io/react-auth";
import { botChainTestnet, botChain, celo, celoSepolia } from "@/lib/chains";

export function WalletProvider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
  const appId = process.env.NEXT_PUBLIC_PRIVY_APP_ID || "clp1234567890123456789012";

  return (
    <PrivyProvider
      appId={appId}
      config={{
        appearance: {
          theme: "dark",
          accentColor: "#8b5cf6",
          logo: "https://agentpay-ai.vercel.app/icon.png",
          walletChainType: "ethereum-only",
        },
        loginMethods: ["wallet", "email"],
        supportedChains: [botChainTestnet, botChain, celo, celoSepolia],
        defaultChain: botChainTestnet,
        embeddedWallets: {
          createOnLogin: "users-without-wallets",
        },
        externalWallets: {
          walletConnect: {
            enabled: false,
          },
        },
      }}
    >
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </PrivyProvider>
  );
}
