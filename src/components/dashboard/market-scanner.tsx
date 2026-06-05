import { Activity, RotateCcw, Wifi, WifiOff, Radio } from "lucide-react";
import { useTradingStore } from "@/stores/trading-store";
import { MARKETS } from "@/lib/markets";
import { useMemo } from "react";
import { PopInRight, AnimatedPopup } from "@/components/shared/animations";
import { motion } from "framer-motion";

export function MarketScanner() {
  const { marketData, scanProgress, scanStatus, wsConnected, lastTickTime, isScanning } = useTradingStore();

  const markets1s = MARKETS.filter((m) => m.is1s);
  const marketsStd = MARKETS.filter((m) => !m.is1s);

  const rankings = useMemo(() => {
    return Object.values(marketData)
      .filter((m) => m.quality > 0)
      .sort((a, b) => b.quality - a.quality)
      .slice(0, 10);
  }, [marketData]);

  const activeMarkets = MARKETS.filter(
    (m) => marketData[m.symbol]?.ticksCollected > 0
  ).length;

  const totalTicks = useMemo(() => {
    return Object.values(marketData).reduce((sum, m) => sum + m.ticksCollected, 0);
  }, [marketData]);

  const timeSinceTick = lastTickTime > 0 ? Math.floor((Date.now() - lastTickTime) / 1000) : -1;

  return (
    <PopInRight delay={0.25}>
      <div className="w-full max-w-4xl mx-auto px-4 mt-4">
        <div className="rounded-2xl bg-gradient-to-br from-white/[0.04] to-white/[0.01] backdrop-blur-xl p-4 sm:p-5 relative overflow-hidden">
          {/* Top accent line */}
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-teal-400/30 to-transparent" />

          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-teal-500/12 rounded-xl flex items-center justify-center">
                <Activity size={16} className="text-teal-400" />
              </div>
              <div>
                <h3 className="text-white font-semibold text-sm tracking-tight">Market Scanner</h3>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[10px] text-teal-400 font-medium tabular-nums">{activeMarkets}/{MARKETS.length} active</span>
                  <span className="text-gray-700">·</span>
                  <span className="text-[10px] text-gray-400 tabular-nums font-medium">{totalTicks.toLocaleString()} ticks</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {/* Live indicator - pill, no border */}
              <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full ${
                wsConnected
                  ? "bg-teal-500/12 text-teal-400"
                  : "bg-red-500/12 text-red-400"
              }`}>
                {wsConnected ? <Wifi size={11} /> : <WifiOff size={11} />}
                <span className="text-[9px] font-semibold">{wsConnected ? "LIVE" : "OFF"}</span>
              </div>
              <button className="text-[9px] text-gray-500 hover:text-teal-400 flex items-center gap-1 transition-colors cursor-pointer rounded-full px-2 py-1 hover:bg-white/[0.04]">
                <RotateCcw size={10} />
                Reset
              </button>
            </div>
          </div>

          {/* Tick Collection Progress */}
          {scanStatus === "scanning" && isScanning && (
            <AnimatedPopup delay={0}>
              <div className="bg-teal-500/[0.06] rounded-xl p-4 mb-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
                  <span className="text-teal-300 text-[11px] font-medium">
                    Collecting live ticks — {scanProgress}% complete
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { title: "1-Second Markets", markets: markets1s },
                    { title: "Standard Markets", markets: marketsStd },
                  ].map((group) => (
                    <div key={group.title} className="space-y-2">
                      <span className="text-[9px] text-gray-500 uppercase tracking-wider font-medium">{group.title}</span>
                      {group.markets.map((m) => {
                        const md = marketData[m.symbol];
                        return (
                          <div key={m.symbol} className="flex items-center gap-2">
                            <span className="text-[10px] text-gray-400 w-16 truncate">{m.label}</span>
                            <div className="flex-1 h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                              <motion.div
                                className="h-full bg-gradient-to-r from-teal-500 to-emerald-400 rounded-full"
                                animate={{ width: `${Math.min((md?.ticksCollected || 0) / 20 * 100, 100)}%` }}
                                transition={{ duration: 0.3 }}
                              />
                            </div>
                            <span className="text-[9px] font-mono text-gray-500 tabular-nums w-10 text-right">
                              {md?.ticksCollected || 0}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>
            </AnimatedPopup>
          )}

          {/* Market Rankings Table */}
          {rankings.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-[10px]">
                <thead>
                  <tr className="border-b border-white/[0.04]">
                    {["#", "Market", "Ticks", "Even Str", "Odd Str", "Gap", "Stab", "Qual"].map((h) => (
                      <th key={h} className={`py-2.5 text-gray-500 font-medium uppercase tracking-wider ${h !== "#" && h !== "Market" ? "text-right" : "text-left"}`}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rankings.map((m, i) => (
                    <motion.tr
                      key={m.symbol}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.2, delay: i * 0.03 }}
                      className="border-b border-white/[0.02] hover:bg-teal-500/[0.03] transition-colors"
                    >
                      <td className="py-2 text-gray-600 tabular-nums">{i + 1}</td>
                      <td className="py-2 text-white font-medium">{m.label}</td>
                      <td className="py-2 text-right text-gray-400 tabular-nums">{m.ticksCollected}</td>
                      <td className="py-2 text-right text-teal-400 tabular-nums">{m.evenStrength.toFixed(1)}%</td>
                      <td className="py-2 text-right text-violet-400 tabular-nums">{m.oddStrength.toFixed(1)}%</td>
                      <td className="py-2 text-right text-yellow-400 tabular-nums">{m.gap.toFixed(1)}</td>
                      <td className="py-2 text-right text-teal-400 tabular-nums">{m.stability.toFixed(1)}</td>
                      <td className="py-2 text-right text-amber-400 tabular-nums font-semibold">{m.quality.toFixed(1)}</td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8">
              <Radio size={24} className="text-gray-700 mx-auto mb-2" />
              <p className="text-gray-600 text-sm">
                {wsConnected ? "Waiting for tick data..." : "Connect to start scanning"}
              </p>
              {timeSinceTick > 0 && timeSinceTick < 60 && (
                <p className="text-gray-700 text-xs mt-1">Last tick: {timeSinceTick}s ago</p>
              )}
            </div>
          )}
        </div>
      </div>
    </PopInRight>
  );
}
