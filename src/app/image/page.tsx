"use client";

import { useState } from "react";
import { useWallet } from "@/hooks/useWallet";
import { useBalance } from "@/hooks/useBalance";
import { usePaidService } from "@/hooks/usePaidService";
import { useCanSwitchNetwork } from "@/hooks/useCanSwitchNetwork";
import { BalanceBar } from "@/components/BalanceBar";
import { Image as ImageIcon, Sparkles, Loader2, ArrowLeft, Download, Wallet } from "lucide-react";
import Link from "next/link";

import { useApayPrice } from "@/hooks/useApayPrice";
import { formatApay } from "@/lib/pricing";

export default function ImagePage() {
  const allowNetworkSwitch = useCanSwitchNetwork();
  const { disconnectWallet, switchOrAddBotChain } = useWallet();
  const { servicePrices } = useApayPrice();
  const {
    address,
    authenticated,
    connectWallet,
    isTestnet,
    currentChainId,
    runPaid,
    loading: paidLoading,
    error: paymentError,
    paymentStep,
    formattedAmount,
  } = usePaidService("image");
  const {
    botBalance,
    apayBalance,
    usdtBalance,
    bousdtBalance,
    loading: balanceLoading,
    refetch,
  } = useBalance(address, currentChainId);
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleGenerate() {
    if (!prompt.trim() || loading || paidLoading) return;
    setLoading(true);
    setImageUrl(null);
    setError(null);

    try {
      const data = await runPaid<{ imageUrl?: string }>({ prompt });
      if (!data?.imageUrl) {
        throw new Error("No image returned from the server");
      }
      setImageUrl(data.imageUrl);
      refetch();
    } catch (err: unknown) {
      console.error("Image generation error:", err);
      setError(err instanceof Error ? err.message : "Image generation failed");
    } finally {
      setLoading(false);
    }
  }

  const busy = loading || paidLoading;

  return (
    <main className="flex flex-col min-h-screen max-w-md mx-auto bg-slate-950 text-slate-100 shadow-2xl border-x border-slate-800">
      <BalanceBar
        address={address}
        botBalance={botBalance}
        apayBalance={apayBalance}
        usdtBalance={usdtBalance}
        bousdtBalance={bousdtBalance}
        loading={balanceLoading}
        onRefresh={refetch}
        onDisconnect={disconnectWallet}
        currentChainId={currentChainId}
        isTestnet={isTestnet}
        onSwitchNetwork={(targetTestnet) => switchOrAddBotChain(targetTestnet)}
        allowNetworkSwitch={allowNetworkSwitch}
      />

      <div className="p-4 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Link
            href="/"
            className="p-1.5 bg-slate-900 text-slate-400 hover:text-white rounded-lg border border-slate-800"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div className="flex items-center space-x-2">
            <ImageIcon className="w-5 h-5 text-amber-400" />
            <h1 className="font-bold text-white text-base">AI Image Generator</h1>
          </div>
        </div>
        <span className="text-xs font-bold bg-slate-900 text-amber-400 px-2.5 py-1 rounded-lg border border-slate-800">
          {formatApay(servicePrices.image.amountTokens)} / prompt
        </span>
      </div>

      <div className="flex-1 p-4 space-y-4 overflow-y-auto">
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3.5 space-y-2 text-xs">
          <div className="flex items-center space-x-1.5 text-amber-400 font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>x402 Micropayments via BOF Facilitator</span>
          </div>
          <p className="text-slate-400">
            Pay-per-prompt: each image request uses EIP-3009 $APAY authorization. Sign in your wallet once
            (zero gas). BOF Facilitator verifies off-chain and settles on-chain.
          </p>
        </div>

        {!authenticated || !address ? (
          <div className="bg-purple-950/40 border border-purple-800/60 rounded-xl p-4 space-y-3 text-xs">
            <p className="text-purple-100 font-medium">Connect a wallet to pay with $APAY</p>
            <button
              onClick={() => connectWallet()}
              className="w-full flex items-center justify-center space-x-2 bg-purple-500 hover:bg-purple-400 text-white font-semibold py-2.5 rounded-xl transition"
            >
              <Wallet className="w-4 h-4" />
              <span>Connect Wallet</span>
            </button>
          </div>
        ) : null}

        {paymentStep === "signing" && (
          <div className="bg-amber-950/40 border border-amber-800/80 text-amber-300 rounded-xl p-3 text-xs flex items-center space-x-2 animate-pulse">
            <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
            <span>🔑 Sign {formattedAmount || "$APAY"} payment authorization in your wallet (0 gas)...</span>
          </div>
        )}

        {paymentStep === "verifying" && (
          <div className="bg-emerald-950/40 border border-emerald-800/80 text-emerald-300 rounded-xl p-3 text-xs flex items-center space-x-2 animate-pulse">
            <Loader2 className="w-4 h-4 animate-spin text-emerald-400" />
            <span>🔍 Authorization signed! Verifying payment with BOF Facilitator...</span>
          </div>
        )}

        {paymentError && (
          <div className="bg-rose-950/40 border border-rose-800 text-rose-300 rounded-xl p-3 text-xs">
            {paymentError}
          </div>
        )}

        {error && (
          <div className="bg-rose-950/40 border border-rose-800 text-rose-300 rounded-xl p-3 text-xs">
            {error}
          </div>
        )}

        {imageUrl && (
          <div className="bg-slate-900 border border-amber-500/20 rounded-xl p-4 space-y-3 animate-fade-in text-center">
            <img
              src={imageUrl}
              alt="AI Generated Visual"
              className="w-full h-64 object-cover rounded-lg border border-slate-800"
            />
            <div className="flex justify-center">
              <a
                href={imageUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center space-x-1.5 text-xs font-bold text-amber-400 hover:text-amber-300 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800"
              >
                <Download className="w-3.5 h-3.5" />
                <span>View High-Res Concept</span>
              </a>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 border-t border-slate-900 bg-slate-950 space-y-2">
        <div className="relative">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder={
              authenticated && address
                ? "Describe the image concept to generate..."
                : "Connect wallet to generate (USDT)…"
            }
            className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 pr-12 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-400/50 resize-none h-20"
          />
          <button
            onClick={handleGenerate}
            disabled={busy || !prompt.trim()}
            className="absolute bottom-3 right-3 p-2 bg-amber-400 hover:bg-amber-300 disabled:bg-slate-800 text-slate-950 rounded-lg transition"
          >
            {busy ? (
              <Loader2 className="w-4 h-4 animate-spin text-slate-400" />
            ) : (
              <Sparkles className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>
    </main>
  );
}
