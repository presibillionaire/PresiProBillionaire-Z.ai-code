"use client";

import { Activity, RotateCcw } from "lucide-react";
import { useTradingStore } from "@/stores/trading-store";
import { MARKETS } from "@/lib/markets";
import { useMemo } from "react";

export function MarketScanner() {
  const { marketData, scanProgress, scanStatus } = useTradingStore();

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

  return (
    <div className="w-full max-w-4xl mx-auto px-4 mt-4">
      <div className="rounded-2xl border border-white/[0.06] bg-gray-900/60 backdrop-blur-xl p-4 sm:p-5">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Activity size={14} className="text-gray-400" />
            <span className="text-[9px] font-medium uppercase tracking-wider text-gray-500">
              Market Scanner
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[9px] font-medium uppercase tracking-wider text-gray-500">
              All
            </span>
            <span className="text-[10px] text-gray-500">
              {activeMarkets}/{MARKETS.length} active
            </span>
            <button className="text-[9px] text-gray-600 hover:text-gray-400 flex items-center gap-1 transition-colors cursor-pointer">
              <RotateCcw size={10} />
              Reset
            </button>
          </div>
        </div>

        {/* Tick Collection Progress */}
        {scanStatus === "scanning" && (
          <div className="bg-blue-500/5 border border-blue-500/20 rounded-lg p-3 mb-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
              <span className="text-blue-300 text-[10px] font-medium">
                Collecting ticks ({scanProgress}/20 min)
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {/* 1s Markets */}
              <div className="space-y-2">
                <span className="text-[9px] text-gray-500 uppercase tracking-wider">
                  1s Markets
                </span>
                {markets1s.map((m) => {
                  const md = marketData[m.symbol];
                  return (
                    <div key={m.symbol} className="flex items-center gap-2">
                      <span className="text-[10px] text-gray-400 w-16 truncate">
                        {m.label}
                      </span>
                      <div className="flex-1 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-500 rounded-full transition-all duration-300"
                          style={{
                            width: `${Math.min((md?.ticksCollected || 0) / 20 * 100, 100)}%`,
                          }}
                        />
                      </div>
                      <span className="text-[9px] font-mono text-gray-500 tabular-nums w-8 text-right">
                        {md?.ticksCollected || 0}/20
                      </span>
                    </div>
                  );
                })}
              </div>
              {/* Standard Markets */}
              <div className="space-y-2">
                <span className="text-[9px] text-gray-500 uppercase tracking-wider">
                  Standard
                </span>
                {marketsStd.map((m) => {
                  const md = marketData[m.symbol];
                  return (
                    <div key={m.symbol} className="flex items-center gap-2">
                      <span className="text-[10px] text-gray-400 w-16 truncate">
                        {m.label}
                      </span>
                      <div className="flex-1 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-500 rounded-full transition-all duration-300"
                          style={{
                            width: `${Math.min((md?.ticksCollected || 0) / 20 * 100, 100)}%`,
                          }}
                        />
                      </div>
                      <span className="text-[9px] font-mono text-gray-500 tabular-nums w-8 text-right">
                        {md?.ticksCollected || 0}/20
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Market Rankings Table */}
        {rankings.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full text-[10px]">
              <thead>
                <tr className="border-b border-white/[0.04]">
                  <th className="text-left py-2 text-gray-500 font-medium uppercase tracking-wider">
                    #
                  </th>
                  <th className="text-left py-2 text-gray-500 font-medium uppercase tracking-wider">
                    Market
                  </th>
                  <th className="text-right py-2 text-gray-500 font-medium uppercase tracking-wider">
                    Even Str
                  </th>
                  <th className="text-right py-2 text-gray-500 font-medium uppercase tracking-wider">
                    Odd Str
                  </th>
                  <th className="text-right py-2 text-gray-500 font-medium uppercase tracking-wider">
                    Gap
                  </th>
                  <th className="text-right py-2 text-gray-500 font-medium uppercase tracking-wider">
                    Stab
                  </th>
                  <th className="text-right py-2 text-gray-500 font-medium uppercase tracking-wider">
                    Qual
                  </th>
                </tr>
              </thead>
              <tbody>
                {rankings.map((m, i) => (
                  <tr
                    key={m.symbol}
                    className="border-b border-white/[0.02] hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="py-2 text-gray-600 tabular-nums">{i + 1}</td>
                    <td className="py-2 text-white font-medium">{m.label}</td>
                    <td className="py-2 text-right text-emerald-400 tabular-nums">
                      {m.evenStrength.toFixed(1)}%
                    </td>
                    <td className="py-2 text-right text-violet-400 tabular-nums">
                      {m.oddStrength.toFixed(1)}%
                    </td>
                    <td className="py-2 text-right text-yellow-400 tabular-nums">
                      {m.gap.toFixed(1)}
                    </td>
                    <td className="py-2 text-right text-emerald-400 tabular-nums">
                      {m.stability.toFixed(1)}
                    </td>
                    <td className="py-2 text-right text-amber-400 tabular-nums">
                      {m.quality.toFixed(1)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
