import { Star, Radio, Hash } from "lucide-react";
import { useTradingStore } from "@/stores/trading-store";
import { useMemo } from "react";
import { PopInLeft, AnimatedPopup } from "@/components/shared/animations";
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

  return (
    <PopInLeft delay={0.2}>
      <div className="w-full max-w-4xl mx-auto px-4 mt-4">
        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-xl p-4 sm:p-5 relative overflow-hidden">
          {/* Top accent line */}
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet-400/20 to-transparent" />

          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-violet-500/10 border border-violet-400/20 rounded-lg flex items-center justify-center">
                <Hash size={14} className="text-violet-400" />
              </div>
              <div>
                <span className="text-[11px] font-medium uppercase tracking-wider text-gray-400">
                  Digit Strength
                </span>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[10px] text-gray-600">
                    {currentMarket?.label || "Vol 75 (1s)"}
                  </span>
                  <span className="text-gray-700">·</span>
                  <span className="text-[10px] text-gray-600 tabular-nums">
                    {currentMarket?.ticksCollected || 0} ticks
                  </span>
                  {lastDigit !== null && wsConnected && (
                    <>
                      <span className="text-gray-700">·</span>
                      <span className="text-[10px] text-teal-400 font-medium">Last: {lastDigit}</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Bar Chart */}
          <div className="flex items-end justify-between gap-1.5 h-36 px-1">
            {digitStrengths.map((d, i) => {
              const height = (d.strength / maxStrength) * 100;
              return (
                <AnimatedPopup key={d.digit} delay={i * 0.03}>
                  <div className="flex-1 flex flex-col items-center gap-1.5">
                    {/* Count label */}
                    {d.count > 0 && (
                      <span className="text-[9px] font-mono tabular-nums text-gray-500">
                        {d.count}
                      </span>
                    )}
                    {/* Strength percentage */}
                    {d.isTop && (
                      <span className="text-[9px] font-mono tabular-nums text-teal-400 font-semibold">
                        {d.strength.toFixed(0)}%
                      </span>
                    )}
                    {/* Bar */}
                    <div className="w-full flex flex-col justify-end h-20">
                      <motion.div
                        className={`w-full rounded-t-md ${
                          d.isTop
                            ? "bg-gradient-to-t from-teal-500 to-teal-300 shadow-lg shadow-teal-500/20"
                            : "bg-gradient-to-t from-gray-700/60 to-gray-600/40"
                        }`}
                        animate={{ height: `${Math.max(height, 4)}%` }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                      />
                    </div>
                    {/* Digit label */}
                    <div className="flex items-center gap-0.5">
                      <span className={`text-[11px] font-mono font-medium ${
                        d.isTop ? "text-teal-400" : lastDigit === d.digit && wsConnected ? "text-white" : "text-gray-500"
                      }`}>
                        {d.digit}
                      </span>
                      {d.isTop && (
                        <Star size={8} className="text-teal-400 fill-teal-400" />
                      )}
                    </div>
                  </div>
                </AnimatedPopup>
              );
            })}
          </div>
        </div>
      </div>
    </PopInLeft>
  );
}
