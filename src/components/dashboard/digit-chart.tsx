import { Hash, TrendingUp, Activity, Clock } from "lucide-react";
import { useTradingStore } from "@/stores/trading-store";
import { useMemo } from "react";
import { PopInLeft } from "@/components/shared/animations";
import { motion } from "framer-motion";

export function DigitChart() {
  const { marketData, selectedMarket, wsConnected } = useTradingStore();
  const currentMarket = marketData[selectedMarket];

  const digitStrengths = useMemo(() => {
    if (!currentMarket?.lastDigits || currentMarket.lastDigits.length === 0) {
      return Array.from({ length: 10 }, (_, i) => ({ digit: i, strength: 0, count: 0, isTop: false }));
    }
    const counts = Array(10).fill(0);
    currentMarket.lastDigits.forEach((d) => { if (d >= 0 && d <= 9) counts[d]++; });
    const total = currentMarket.lastDigits.length;
    const maxCount = Math.max(...counts);
    return counts.map((count, digit) => ({
      digit, strength: total > 0 ? (count / total) * 100 : 0, count,
      isTop: count === maxCount && count > 0,
    }));
  }, [currentMarket]);

  const maxStrength = Math.max(...digitStrengths.map((d) => d.strength), 1);
  const lastDigit = currentMarket?.lastDigits?.length > 0 ? currentMarket.lastDigits[currentMarket.lastDigits.length - 1] : null;
  const totalTicks = currentMarket?.ticksCollected || 0;

  // Calculate even/odd split
  const evenTotal = digitStrengths.filter((d) => d.digit % 2 === 0).reduce((s, d) => s + d.count, 0);
  const oddTotal = digitStrengths.filter((d) => d.digit % 2 !== 0).reduce((s, d) => s + d.count, 0);
  const allTotal = evenTotal + oddTotal;
  const evenPct = allTotal > 0 ? ((evenTotal / allTotal) * 100).toFixed(1) : "50.0";
  const oddPct = allTotal > 0 ? ((oddTotal / allTotal) * 100).toFixed(1) : "50.0";

  return (
    <PopInLeft delay={0.2}>
      <div className="w-full max-w-4xl mx-auto px-4 mt-4">
        <div className="rounded-2xl bg-gradient-to-br from-white/[0.04] to-white/[0.01] backdrop-blur-xl p-4 sm:p-5 relative overflow-hidden">
          {/* Top accent line */}
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-teal-400/30 to-transparent" />

          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-teal-500/12 rounded-xl flex items-center justify-center">
                <Hash size={16} className="text-teal-400" />
              </div>
              <div>
                <h3 className="text-white font-semibold text-sm tracking-tight">Digit Strength</h3>
                <p className="text-[10px] text-gray-500 mt-0.5">
                  {currentMarket?.label || "Vol 75 (1s)"}
                </p>
              </div>
            </div>

            {/* Stats row - no borders */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 bg-white/[0.04] rounded-full px-2.5 py-1">
                <Activity size={11} className="text-teal-400" />
                <span className="text-[10px] text-gray-300 font-medium tabular-nums">{totalTicks} ticks</span>
              </div>
              {lastDigit !== null && wsConnected && (
                <div className="flex items-center gap-1.5 bg-teal-500/12 rounded-full px-2.5 py-1">
                  <span className="text-[10px] text-teal-400 font-medium">Last</span>
                  <span className="text-sm text-white font-bold font-mono tabular-nums">{lastDigit}</span>
                </div>
              )}
              {!wsConnected && (
                <div className="flex items-center gap-1.5 bg-red-500/10 rounded-full px-2.5 py-1">
                  <Clock size={11} className="text-red-400" />
                  <span className="text-[10px] text-red-400 font-medium">Waiting</span>
                </div>
              )}
            </div>
          </div>

          {/* Even/Odd split bar */}
          {allTotal > 0 && (
            <div className="mb-5">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-teal-400" />
                  <span className="text-[11px] text-gray-300 font-medium">EVEN <span className="text-teal-400 font-semibold">{evenPct}%</span></span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-gray-300 font-medium">ODD <span className="text-violet-400 font-semibold">{oddPct}%</span></span>
                  <div className="w-2 h-2 rounded-full bg-violet-400" />
                </div>
              </div>
              <div className="h-2 rounded-full bg-white/[0.06] overflow-hidden flex">
                <motion.div
                  className="h-full bg-gradient-to-r from-teal-500 to-teal-400 rounded-l-full"
                  animate={{ width: `${Number(evenPct)}%` }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                />
                <motion.div
                  className="h-full bg-gradient-to-r from-violet-500 to-violet-400 rounded-r-full"
                  animate={{ width: `${Number(oddPct)}%` }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                />
              </div>
            </div>
          )}

          {/* Digit Grid */}
          <div className="grid grid-cols-10 gap-1.5 sm:gap-2">
            {digitStrengths.map((d, i) => {
              const height = (d.strength / maxStrength) * 100;
              const isLast = lastDigit === d.digit && wsConnected;
              return (
                <motion.div
                  key={d.digit}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.03 }}
                  className="flex flex-col items-center gap-1"
                >
                  {/* Percentage label */}
                  {d.strength > 0 && (
                    <span className={`text-[8px] sm:text-[9px] font-mono tabular-nums ${
                      d.isTop ? "text-teal-400 font-semibold" : "text-gray-600"
                    }`}>
                      {d.strength.toFixed(0)}%
                    </span>
                  )}

                  {/* Bar container */}
                  <div className="w-full flex flex-col justify-end h-20 sm:h-24 bg-white/[0.02] rounded-lg overflow-hidden">
                    <motion.div
                      className={`w-full rounded-t-md ${
                        d.isTop
                          ? "bg-gradient-to-t from-teal-500 to-teal-300"
                          : d.digit % 2 === 0
                          ? "bg-gradient-to-t from-teal-500/40 to-teal-500/20"
                          : "bg-gradient-to-t from-violet-500/40 to-violet-500/20"
                      }`}
                      animate={{ height: `${Math.max(height, 4)}%` }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                    />
                  </div>

                  {/* Count label */}
                  {d.count > 0 && (
                    <span className="text-[8px] sm:text-[9px] font-mono tabular-nums text-gray-500">
                      {d.count}
                    </span>
                  )}

                  {/* Digit label */}
                  <div className={`w-6 h-6 sm:w-7 sm:h-7 rounded-lg flex items-center justify-center text-[11px] sm:text-xs font-mono font-bold transition-all ${
                    isLast
                      ? "bg-teal-400 text-white shadow-lg shadow-teal-500/30 scale-110"
                      : d.isTop
                      ? "bg-teal-500/15 text-teal-400 ring-1 ring-teal-400/30"
                      : d.digit % 2 === 0
                      ? "bg-teal-500/[0.06] text-teal-400/70"
                      : "bg-violet-500/[0.06] text-violet-400/70"
                  }`}>
                    {d.digit}
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Legend */}
          <div className="flex items-center justify-center gap-4 mt-3">
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-sm bg-gradient-to-t from-teal-500 to-teal-400" />
              <span className="text-[9px] text-gray-500">Even digits</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-sm bg-gradient-to-t from-violet-500 to-violet-400" />
              <span className="text-[9px] text-gray-500">Odd digits</span>
            </div>
            <div className="flex items-center gap-1.5">
              <TrendingUp size={10} className="text-teal-400" />
              <span className="text-[9px] text-gray-500">Dominant</span>
            </div>
          </div>
        </div>
      </div>
    </PopInLeft>
  );
}
