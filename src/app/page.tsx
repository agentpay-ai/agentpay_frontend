"use client";

import { useState } from "react";
import Link from "next/link";
import { useWallet } from "@/hooks/useWallet";
import { useBalance } from "@/hooks/useBalance";
import { BalanceBar } from "@/components/BalanceBar";
import { AgentIdentityBadge } from "@/components/AgentIdentityBadge";
import { FeedbackModal } from "@/components/FeedbackModal";
import { Bot, Image as ImageIcon, Code, Sparkles, Smartphone, CheckCircle, Star, Cpu } from "lucide-react";

export default function Home() {
  const {
    address,
    inMiniPay,
    connecting,
    currentChainId,
    isTestnet,
    connectWallet,
    disconnectWallet,
    switchOrAddBotChain,
  } = useWallet();
  const {
    botBalance,
    usdtBalance,
    bousdtBalance,
    loading: balanceLoading,
    refetch,
  } = useBalance(address, currentChainId);
  const [feedbackOpen, setFeedbackOpen] = useState(false);

  function handleFeedbackSubmit(score: number, notes: string) {
    console.log("Feedback submitted:", { score, notes });
  }

  return (
    <main className="flex flex-col min-h-screen max-w-md mx-auto bg-slate-950 text-slate-100 shadow-2xl border-x border-slate-800">
      <BalanceBar
        address={address}
        botBalance={botBalance}
        usdtBalance={usdtBalance}
        bousdtBalance={bousdtBalance}
        loading={balanceLoading}
        onRefresh={refetch}
        onDisconnect={disconnectWallet}
        currentChainId={currentChainId}
        isTestnet={isTestnet}
        onSwitchNetwork={(targetTestnet) => switchOrAddBotChain(targetTestnet)}
      />

      <div className="flex-1 p-5 space-y-5">
        {/* Banner */}
        <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-purple-950/40 p-5 rounded-2xl border border-slate-800 space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center space-x-1.5 bg-amber-400/10 text-amber-400 text-xs font-semibold px-2.5 py-1 rounded-full border border-amber-400/20">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Google Gemini Flash Powered</span>
            </span>
            <span className="inline-flex items-center space-x-1 bg-purple-400/10 text-purple-400 text-xs font-medium px-2 py-0.5 rounded-full border border-purple-400/20">
              <Cpu className="w-3 h-3" />
              <span>BotChain Active</span>
            </span>
            {inMiniPay && (
              <span className="inline-flex items-center space-x-1 bg-emerald-400/10 text-emerald-400 text-xs font-medium px-2 py-0.5 rounded-full border border-emerald-400/20">
                <CheckCircle className="w-3 h-3" />
                <span>MiniPay</span>
              </span>
            )}
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-white">
            BotChain Autonomous AI
          </h1>
          <p className="text-slate-400 text-sm leading-relaxed">
            Pay-per-prompt AI access hub on BotChain EVM for text completions, image generation, and code security audits. Sub-cent USDT micro-transactions only — no subscriptions, no native BOT charged as payment.
          </p>

          {!address ? (
            <button
              onClick={connectWallet}
              disabled={connecting}
              className="w-full mt-2 bg-purple-500 hover:bg-purple-400 text-white font-semibold py-2.5 rounded-xl transition flex items-center justify-center space-x-2 text-sm shadow-lg shadow-purple-500/20"
            >
              <Smartphone className="w-4 h-4" />
              <span>{connecting ? "Connecting..." : "Connect Wallet"}</span>
            </button>
          ) : (
            <div className="flex items-center justify-between pt-1">
              <span className="text-xs text-emerald-400 font-medium flex items-center space-x-1">
                <CheckCircle className="w-3.5 h-3.5" />
                <span>Wallet Connected</span>
              </span>
              <button
                onClick={disconnectWallet}
                className="text-xs text-slate-400 hover:text-red-400 transition"
              >
                Disconnect
              </button>
            </div>
          )}
        </div>

        {/* ERC-8004 Agent Trust Badge */}
        <AgentIdentityBadge reputationScore={98} totalReviews={142} />

        {/* AI Tools Grid */}
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Available AI Tools
            </h2>
            <button
              onClick={() => setFeedbackOpen(true)}
              className="text-xs text-amber-400 hover:text-amber-300 flex items-center space-x-1 font-medium"
            >
              <Star className="w-3 h-3 fill-amber-400" />
              <span>Give Feedback</span>
            </button>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {/* Chat Tool */}
            <Link
              href="/chat"
              className="bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-slate-700 p-4 rounded-xl transition cursor-pointer flex items-center justify-between group"
            >
              <div className="flex items-center space-x-3.5">
                <div className="p-3 bg-amber-500/10 text-amber-400 rounded-xl border border-amber-500/20 group-hover:scale-105 transition">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-white text-sm">AI Text Assistant</h3>
                  <p className="text-xs text-slate-400">GPT / Gemini 2.5 Flash LLM</p>
                </div>
              </div>
              <span className="text-xs font-bold bg-slate-800 text-emerald-400 px-2.5 py-1 rounded-lg border border-slate-700">
                $0.01 USDT
              </span>
            </Link>

            {/* Image Gen Tool */}
            <Link
              href="/image"
              className="bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-slate-700 p-4 rounded-xl transition cursor-pointer flex items-center justify-between group"
            >
              <div className="flex items-center space-x-3.5">
                <div className="p-3 bg-purple-500/10 text-purple-400 rounded-xl border border-purple-500/20 group-hover:scale-105 transition">
                  <ImageIcon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-white text-sm">AI Image Creator</h3>
                  <p className="text-xs text-slate-400">High-res 512×512 generation</p>
                </div>
              </div>
              <span className="text-xs font-bold bg-slate-800 text-purple-400 px-2.5 py-1 rounded-lg border border-slate-700">
                $0.05 USDT
              </span>
            </Link>

            {/* Code Review Tool */}
            <Link
              href="/code"
              className="bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-slate-700 p-4 rounded-xl transition cursor-pointer flex items-center justify-between group"
            >
              <div className="flex items-center space-x-3.5">
                <div className="p-3 bg-sky-500/10 text-sky-400 rounded-xl border border-sky-500/20 group-hover:scale-105 transition">
                  <Code className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-white text-sm">AI Code Reviewer</h3>
                  <p className="text-xs text-slate-400">Bug & security audit</p>
                </div>
              </div>
              <span className="text-xs font-bold bg-slate-800 text-sky-400 px-2.5 py-1 rounded-lg border border-slate-700">
                $0.02 USDT
              </span>
            </Link>
          </div>
        </div>
      </div>

      <FeedbackModal
        isOpen={feedbackOpen}
        onClose={() => setFeedbackOpen(false)}
        onSubmit={handleFeedbackSubmit}
      />

      <footer className="p-4 text-center text-xs text-slate-500 border-t border-slate-900">
        AgentPay AI • Powered by BotChain Autonomous Agent Network, x402 & ERC-8004
      </footer>
    </main>
  );
}
