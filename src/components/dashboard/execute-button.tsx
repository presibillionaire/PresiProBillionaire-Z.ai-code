"use client";

import { useState, useEffect, useCallback } from "react";
import { Play } from "lucide-react";
import { useTradingStore } from "@/stores/trading-store";

export function ExecuteButton() {
  const {
    direction,
    stake,
    marketData,
    selectedMarket,
    scanStatus,
    statusMessage,
    sessionPL,
    takeProfit,
    setIsTrading,
    addTrade,
    setSessionPL,
    setStatusMessage,
  } = useTradingStore();

  const [executing, setExecuting] = useState(false);
  const currentMarket = marketData[selectedMarket];
  const confidence = currentMarket?.confidence || 0;
  const canTrade = scanStatus === "ready" && confidence >= 50;

  const handleExecute = useCallback(async () => {
    if (!canTrade || executing) return;

    setExecuting(true);
    setIsTrading(true);
    setStatusMessage(`Placing trade: ${direction} · ${currentMarket?.label} · ${stake.toFixed(2)} USD`);

    try {
      const res = await fetch("/api/execute-trade", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token: useTradingStore.getState().token,
          market: selectedMarket,
          direction,
          stake,
          tickDuration: useTradingStore.getState().tickDuration,
        }),
      });

      const data = await res.json();

      const trade = {
        id: data.tradeId || `trade-${Date.now()}`,
        market: selectedMarket,
        marketLabel: currentMarket?.label || "Unknown",
        direction: direction as "EVEN" | "ODD",
        stake,
        result: data.success ? ("win" as const) : ("loss" as const),
        profit: data.profit || 0,
        timestamp: Date.now(),
        contractId: data.contractId,
      };

      addTrade(trade);
      setSessionPL(sessionPL + trade.profit);
      setStatusMessage(
        `Trade ${data.success ? "won" : "lost"}: ${trade.profit >= 0 ? "+" : ""}${trade.profit.toFixed(2)} USD`
      );
    } catch {
      setStatusMessage("Trade execution failed. Retrying...");
    } finally {
      setExecuting(false);
      setIsTrading(false);
    }
  }, [canTrade, executing, direction, stake, selectedMarket, currentMarket, sessionPL, addTrade, setSessionPL, setStatusMessage, setIsTrading]);

  return (
    <div className="w-full max-w-4xl mx-auto px-4 mt-4">
      <button
        disabled={!canTrade || executing}
        onClick={handleExecute}
        className={`w-full rounded-xl py-3.5 font-bold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
          canTrade
            ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/50 hover:shadow-emerald-400/60 hover:-translate-y-0.5 active:scale-[0.98]"
            : "bg-gradient-to-r from-emerald-500/30 to-teal-500/30 text-white/40 opacity-30 cursor-not-allowed"
        }`}
      >
        {executing ? (
          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        ) : (
          <Play size={16} />
        )}
        {executing
          ? "Executing..."
          : `${direction} · ${currentMarket?.label || "Select Market"}`}
        {canTrade && (
          <span className="opacity-70">
            · {confidence}% · {stake.toFixed(2)} USD
          </span>
        )}
      </button>
      {statusMessage && (
        <p className="text-center text-gray-500 text-xs mt-2">{statusMessage}</p>
      )}
    </div>
  );
}
