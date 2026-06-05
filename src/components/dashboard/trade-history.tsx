"use client";

import { useState } from "react";
import { History } from "lucide-react";
import { useTradingStore } from "@/stores/trading-store";
import { SlideUp, AnimatedPopup } from "@/components/shared/animations";

type Filter = "all" | "open" | "closed";

export function TradeHistory() {
  const { trades } = useTradingStore();
  const [filter, setFilter] = useState<Filter>("all");

  const filteredTrades = trades.filter((t) => {
    if (filter === "open") return t.result === "open" || t.result === "pending";
    if (filter === "closed") return t.result === "win" || t.result === "loss";
    return true;
  });

  return (
    <SlideUp delay={0.35}>
      <div className="w-full max-w-4xl mx-auto px-4 mt-4 mb-8">
        <div className="rounded-2xl border border-white/[0.06] bg-gray-900/60 backdrop-blur-xl shadow-2xl shadow-black/40 p-4 sm:p-5">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <History size={14} className="text-teal-400" />
              <span className="text-[9px] font-medium uppercase tracking-wider text-gray-500">
                Trade History
              </span>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center bg-white/[0.03] border border-gray-800 rounded-lg p-0.5">
              {(["all", "open", "closed"] as Filter[]).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-2.5 py-1 rounded-md text-[10px] font-medium transition-all capitalize cursor-pointer ${
                    filter === f
                      ? "bg-teal-500/20 text-teal-300 border border-teal-400/20"
                      : "text-gray-500 hover:text-gray-400"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* Trades List */}
          <div className="max-h-64 overflow-y-auto custom-scrollbar space-y-1.5">
            {filteredTrades.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-600 text-sm">No trades yet. Place a trade to get started.</p>
              </div>
            ) : (
              filteredTrades.map((trade, i) => (
                <AnimatedPopup key={trade.id} delay={i * 0.05}>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-gray-800/30 border border-white/[0.03] hover:bg-gray-800/50 hover:border-teal-500/10 transition-all">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${
                        trade.result === "win" ? "bg-teal-400"
                        : trade.result === "loss" ? "bg-red-400"
                        : "bg-amber-400 animate-pulse"
                      }`} />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-white text-xs font-medium">{trade.direction}</span>
                          <span className="text-gray-500 text-[10px]">·</span>
                          <span className="text-gray-400 text-[10px]">{trade.marketLabel}</span>
                        </div>
                        <span className="text-gray-600 text-[9px] tabular-nums">
                          {new Date(trade.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`text-xs font-semibold tabular-nums ${
                        trade.profit >= 0 ? "text-teal-400" : "text-red-400"
                      }`}>
                        {trade.profit >= 0 ? "+" : ""}{trade.profit.toFixed(2)}
                      </span>
                      <div className="text-gray-600 text-[9px] tabular-nums">
                        {trade.stake.toFixed(2)} stake
                      </div>
                    </div>
                  </div>
                </AnimatedPopup>
              ))
            )}
          </div>
        </div>
      </div>
    </SlideUp>
  );
}
