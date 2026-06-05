"use client";

import { Star } from "lucide-react";
import { useTradingStore } from "@/stores/trading-store";
import { useMemo } from "react";
import { PopInLeft, AnimatedPopup } from "@/components/shared/animations";

export function DigitChart() {
  const { marketData, selectedMarket } = useTradingStore();
  const currentMarket = marketData[selectedMarket];

  const digitStrengths = useMemo(() => {
    if (!currentMarket?.lastDigits || currentMarket.lastDigits.length === 0) {
      return Array.from({ length: 10 }, (_, i) => ({ digit: i, strength: 0 }));
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

  return (
    <PopInLeft delay={0.2}>
      <div className="w-full max-w-4xl mx-auto px-4 mt-4">
        <div className="rounded-2xl border border-white/[0.06] bg-gray-900/60 backdrop-blur-xl p-4 sm:p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="text-[9px] font-medium uppercase tracking-wider text-gray-500">
                Digit Strength
              </span>
              <span className="text-[10px] text-gray-600">
                {currentMarket?.label || "Vol 100 (1s)"}
              </span>
            </div>
          </div>

          {/* Bar Chart */}
          <div className="flex items-end justify-between gap-1.5 h-32 px-2">
            {digitStrengths.map((d, i) => {
              const height = (d.strength / maxStrength) * 100;
              return (
                <AnimatedPopup key={d.digit} delay={i * 0.03}>
                  <div className="flex-1 flex flex-col items-center gap-1.5">
                    <span className="text-[9px] font-mono tabular-nums text-gray-400">
                      {d.strength.toFixed(0)}%
                    </span>
                    <div className="w-full flex flex-col justify-end h-20">
                      <div
                        className={`w-full rounded-t-sm transition-all duration-500 ${
                          d.isTop
                            ? "bg-gradient-to-t from-teal-500 to-teal-300"
                            : "bg-gray-700/60"
                        } ${d.isTop ? "shadow-lg shadow-teal-500/20" : ""}`}
                        style={{ height: `${Math.max(height, 4)}%` }}
                      />
                    </div>
                    <div className="flex items-center gap-0.5">
                      <span className="text-[10px] font-mono text-gray-400">{d.digit}</span>
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
