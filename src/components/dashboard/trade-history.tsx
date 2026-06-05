import { useState } from "react";
import { History, Trophy, XCircle, Clock } from "lucide-react";
import { useTradingStore } from "@/stores/trading-store";
import { SlideUp, AnimatedPopup } from "@/components/shared/animations";
import { motion } from "framer-motion";

type Filter = "all" | "win" | "loss";

export function TradeHistory() {
  const { trades, sessionPL } = useTradingStore();
  const [filter, setFilter] = useState<Filter>("all");

  const filteredTrades = trades.filter((t) => {
    if (filter === "win") return t.result === "win";
    if (filter === "loss") return t.result === "loss";
    return true;
  });

  const winCount = trades.filter((t) => t.result === "win").length;
  const lossCount = trades.filter((t) => t.result === "loss").length;

  return (
    <SlideUp delay={0.35}>
      <div className="w-full max-w-4xl mx-auto px-4 mt-4 mb-8">
        <div className="rounded-2xl bg-gradient-to-br from-white/[0.04] to-white/[0.01] backdrop-blur-xl shadow-2xl shadow-black/40 p-4 sm:p-5 relative overflow-hidden">
          {/* Top accent line */}
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-teal-400/20 to-transparent" />

          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-teal-500/12 rounded-xl flex items-center justify-center">
                <History size={16} className="text-teal-400" />
              </div>
              <div>
                <h3 className="text-white font-semibold text-sm tracking-tight">Trade History</h3>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[10px] text-gray-500 tabular-nums font-medium">{trades.length} trades</span>
                  {sessionPL !== 0 && (
                    <>
                      <span className="text-gray-700">·</span>
                      <span className={`text-[10px] tabular-nums font-semibold ${sessionPL >= 0 ? "text-teal-400" : "text-red-400"}`}>
                        P/L: {sessionPL >= 0 ? "+" : ""}{sessionPL.toFixed(2)}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Filter Tabs - borderless */}
            <div className="flex items-center bg-white/[0.04] rounded-xl p-1 gap-0.5">
              {([
                { key: "all" as Filter, label: "All", count: trades.length, icon: null },
                { key: "win" as Filter, label: "Win", count: winCount, icon: <Trophy size={10} /> },
                { key: "loss" as Filter, label: "Loss", count: lossCount, icon: <XCircle size={10} /> },
              ]).map((f) => (
                <motion.button
                  key={f.key}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setFilter(f.key)}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-medium transition-all flex items-center gap-1 cursor-pointer ${
                    filter === f.key
                      ? "bg-teal-500/15 text-teal-300"
                      : "text-gray-500 hover:text-gray-400"
                  }`}
                >
                  {f.icon}
                  {f.label}
                  <span className="text-gray-600">({f.count})</span>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Trades List */}
          <div className="max-h-72 overflow-y-auto custom-scrollbar space-y-2">
            {filteredTrades.length === 0 ? (
              <div className="text-center py-10">
                <Clock size={24} className="text-gray-700 mx-auto mb-2" />
                <p className="text-gray-600 text-sm">No trades yet. Execute a signal to get started.</p>
                <p className="text-gray-700 text-xs mt-1">Trades will appear here with real timestamps and P/L data.</p>
              </div>
            ) : (
              filteredTrades.map((trade, i) => (
                <motion.div
                  key={trade.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2, delay: i * 0.03 }}
                  className="flex items-center justify-between p-3.5 rounded-xl bg-white/[0.02] hover:bg-white/[0.04] transition-all"
                >
                  <div className="flex items-center gap-3">
                    {/* Status indicator */}
                    <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${
                      trade.result === "win" ? "bg-emerald-400 shadow-sm shadow-emerald-400/30"
                      : trade.result === "loss" ? "bg-red-400 shadow-sm shadow-red-400/30"
                      : trade.result === "open" ? "bg-amber-400 animate-pulse" : "bg-gray-600"
                    }`} />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-white text-xs font-semibold">{trade.direction}</span>
                        <span className="text-gray-600 text-[10px]">·</span>
                        <span className="text-gray-400 text-[11px]">{trade.marketLabel}</span>
                        {trade.contractId && (
                          <span className="text-gray-700 text-[9px] font-mono">#{trade.contractId}</span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-gray-600 text-[10px] tabular-nums">
                          {new Date(trade.timestamp).toLocaleTimeString()}
                        </span>
                        <span className="text-gray-700 text-[9px]">
                          {new Date(trade.timestamp).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`text-sm font-bold tabular-nums ${
                      trade.profit >= 0 ? "text-emerald-400" : "text-red-400"
                    }`}>
                      {trade.profit >= 0 ? "+" : ""}{trade.profit.toFixed(2)}
                    </span>
                    <div className="text-gray-600 text-[9px] tabular-nums mt-0.5">
                      {trade.stake.toFixed(2)} stake
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </div>
    </SlideUp>
  );
}
