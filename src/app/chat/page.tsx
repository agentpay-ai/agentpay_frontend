"use client";

import { useState } from "react";
import { useWallet } from "@/hooks/useWallet";
import { useBalance } from "@/hooks/useBalance";
import { usePaidService } from "@/hooks/usePaidService";
import { useCanSwitchNetwork } from "@/hooks/useCanSwitchNetwork";
import { BalanceBar } from "@/components/BalanceBar";
import { ChatMarkdown } from "@/components/ChatMarkdown";
import { Bot, Send, Sparkles, Loader2, ArrowLeft, User, Wallet } from "lucide-react";
import Link from "next/link";

interface MessageItem {
  id: string;
  sender: "user" | "ai";
  text: string;
  timestamp: string;
  isError?: boolean;
}

export default function ChatPage() {
  const allowNetworkSwitch = useCanSwitchNetwork();
  const { disconnectWallet, switchOrAddBotChain } = useWallet();
  const {
    address,
    authenticated,
    connectWallet,
    isTestnet,
    currentChainId,
    runPaid,
    loading: paidLoading,
    error: paymentError,
  } = usePaidService("chat");
  const {
    botBalance,
    usdtBalance,
    bousdtBalance,
    loading: balanceLoading,
    refetch,
  } = useBalance(address, currentChainId);
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [loading, setLoading] = useState(false);

  async function handleSend() {
    if (!prompt.trim() || loading || paidLoading) return;
    const userPrompt = prompt.trim();
    setPrompt("");
    setLoading(true);

    const userMsg: MessageItem = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: userPrompt,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    setMessages((prev) => [...prev, userMsg]);

    try {
      const data = await runPaid<{ response?: string }>({ prompt: userPrompt });
      const aiText = data.response;
      if (!aiText) {
        throw new Error("No response received from AI");
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `ai-${Date.now()}`,
          sender: "ai",
          text: aiText,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
      refetch();
    } catch (err: unknown) {
      console.error("Chat error:", err);
      setMessages((prev) => [
        ...prev,
        {
          id: `error-${Date.now()}`,
          sender: "ai",
          text: err instanceof Error ? err.message : "Chat request failed",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          isError: true,
        },
      ]);
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
            <Bot className="w-5 h-5 text-amber-400" />
            <h1 className="font-bold text-white text-base">AI Text Assistant</h1>
          </div>
        </div>
        <span className="text-xs font-bold bg-slate-900 text-emerald-400 px-2.5 py-1 rounded-lg border border-slate-800">
          $0.01 USDT / prompt
        </span>
      </div>

      <div className="flex-1 p-4 space-y-4 overflow-y-auto">
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3.5 space-y-2 text-xs">
          <div className="flex items-center space-x-1.5 text-amber-400 font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Anthropic Claude AI Powered</span>
          </div>
          <p className="text-slate-400">
            Pay-per-prompt: each message is a $0.01 USDT on-chain transfer to the vault. Your wallet
            will ask you to confirm payment for every prompt.
          </p>
        </div>

        {!authenticated || !address ? (
          <div className="bg-purple-950/40 border border-purple-800/60 rounded-xl p-4 space-y-3 text-xs">
            <p className="text-purple-100 font-medium">Connect a wallet to pay with USDT</p>
            <p className="text-slate-400">
              AgentPay charges stablecoins only. Connect, then confirm a $0.01 USDT transfer for each
              prompt.
            </p>
            <button
              onClick={() => connectWallet()}
              className="w-full flex items-center justify-center space-x-2 bg-purple-500 hover:bg-purple-400 text-white font-semibold py-2.5 rounded-xl transition"
            >
              <Wallet className="w-4 h-4" />
              <span>Connect Wallet</span>
            </button>
          </div>
        ) : null}

        {paymentError && (
          <div className="bg-rose-950/40 border border-rose-800 text-rose-300 rounded-xl p-3 text-xs">
            {paymentError}
          </div>
        )}

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col space-y-1 text-xs animate-fade-in ${
              msg.sender === "user" ? "items-end" : "items-start"
            }`}
          >
            <div className="flex items-center space-x-1 text-[10px] text-slate-500 px-1">
              {msg.sender === "user" ? (
                <>
                  <span>You</span>
                  <User className="w-3 h-3 text-purple-400" />
                </>
              ) : (
                <>
                  <Bot className="w-3 h-3 text-amber-400" />
                  <span>AgentPay AI</span>
                </>
              )}
              <span>•</span>
              <span>{msg.timestamp}</span>
            </div>
            <div
              className={`p-3.5 rounded-2xl max-w-[85%] leading-relaxed ${
                msg.sender === "user"
                  ? "bg-purple-950/70 border border-purple-800/60 text-purple-100 rounded-tr-none"
                  : msg.isError
                    ? "bg-rose-950/40 border border-rose-800 text-rose-200 rounded-tl-none"
                    : "bg-slate-900 border border-amber-500/20 text-slate-200 rounded-tl-none"
              }`}
            >
              {msg.sender === "ai" && !msg.isError ? (
                <ChatMarkdown text={msg.text} />
              ) : (
                <p className="whitespace-pre-wrap">{msg.text}</p>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 border-t border-slate-900 bg-slate-950 space-y-2">
        <div className="relative">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder={
              authenticated && address
                ? "Type your AI prompt here... (Press Enter to send)"
                : "Connect wallet to send paid prompts…"
            }
            className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 pr-12 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-400/50 resize-none h-20"
          />
          <button
            onClick={handleSend}
            disabled={busy || !prompt.trim()}
            className="absolute bottom-3 right-3 p-2 bg-amber-400 hover:bg-amber-300 disabled:bg-slate-800 text-slate-950 rounded-lg transition"
          >
            {busy ? (
              <Loader2 className="w-4 h-4 animate-spin text-slate-400" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>
    </main>
  );
}
