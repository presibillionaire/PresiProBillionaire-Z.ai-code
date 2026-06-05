"use client";

import { useState, useEffect } from "react";
import {
  Crown, Hash, Crosshair, Scan, Sparkles,
  BarChart2, ArrowUpDown, ChevronsUpDown, Shield,
  ChevronDown, Bot,
} from "lucide-react";
import { useTradingStore } from "@/stores/trading-store";
import { STRATEGIES } from "@/lib/markets";
import { SlideLeft, AnimatedPopup } from "@/components/shared/animations";
import type { Strategy } from "@/lib/markets";

const iconMap: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  crown: Crown, hash: Hash, crosshair: Crosshair, scan: Scan,
  sparkles: Sparkles, "bar-chart": BarChart2, "arrow-up-down": ArrowUpDown,
  "chevrons-up-down": ChevronsUpDown, shield: Shield,
};

export function StrategySelector() {
  const { activeStrategy, setActiveStrategy, strategySelectorOpen, toggleStrategySelector } =
    useTradingStore();
  const [open, setOpen] = useState(strategySelectorOpen);

  useEffect(() => {
    setOpen(strategySelectorOpen);
  }, [strategySelectorOpen]);

  const handleToggle = () => {
    setOpen(!open);
    toggleStrategySelector();
  };

  const handleSelect = (strategy: Strategy) => {
    setActiveStrategy(strategy);
  };

  const activeCount = STRATEGIES.filter((s) => s.status === "active").length;

  return (
    <SlideLeft>
      <div className="w-full max-w-4xl mx-auto px-4">
        {/* Accordion Trigger */}
        <AnimatedPopup>
          <button
            onClick={handleToggle}
            className="w-full flex items-center justify-between bg-gray-900/60 border border-white/[0.06] rounded-xl px-4 py-3 hover:bg-gray-900/80 transition-all cursor-pointer hover:border-teal-500/20"
          >
            <div className="flex items-center gap-3">
              {activeStrategy && (
                <>
                  {(() => {
                    const Icon = iconMap[activeStrategy.icon] || Bot;
                    return (
                      <div className="w-8 h-8 bg-teal-500/10 border border-teal-400/20 rounded-lg flex items-center justify-center">
                        <Icon className="text-teal-400" size={16} />
                      </div>
                    );
                  })()}
                  <div className="text-left">
                    <span className="text-white font-semibold text-sm">{activeStrategy.name}</span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[9px] text-gray-500 uppercase tracking-wider">
                        {activeCount} bots active
                      </span>
                    </div>
                  </div>
                </>
              )}
            </div>
            <ChevronDown
              size={16}
              className={`text-gray-400 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
            />
          </button>
        </AnimatedPopup>

        {/* Accordion Content */}
        <div
          className={`grid transition-all duration-500 ease-out ${
            open ? "grid-rows-[1fr] mt-3 opacity-100" : "grid-rows-[0fr] opacity-0"
          }`}
        >
          <div className="overflow-hidden">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 p-1">
              {STRATEGIES.map((strategy, idx) => {
                const isActive = activeStrategy?.id === strategy.id;
                const isDisabled = strategy.status === "disabled";
                const Icon = iconMap[strategy.icon] || Bot;

                return (
                  <AnimatedPopup key={strategy.id} delay={idx * 0.05}>
                    <button
                      disabled={isDisabled}
                      onClick={() => handleSelect(strategy)}
                      className={`relative flex flex-col items-start gap-2 p-3 rounded-xl border text-left transition-all cursor-pointer ${
                        isDisabled
                          ? "opacity-45 cursor-not-allowed bg-gray-900/40 border-gray-800/40"
                          : isActive
                          ? "ring-2 ring-teal-400/40 bg-teal-500/10 border-teal-400/20 shadow-lg shadow-teal-500/5"
                          : "bg-gray-900/60 border-white/[0.06] hover:bg-gray-900/80 hover:border-teal-500/20 hover:scale-[1.02]"
                      }`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <div className="w-8 h-8 bg-gray-800/80 border border-gray-700/50 rounded-lg flex items-center justify-center">
                          <Icon
                            className={isActive ? "text-teal-400" : "text-gray-400"}
                            size={16}
                          />
                        </div>
                        {strategy.badge && (
                          <span
                            className={`text-[9px] font-medium px-1.5 py-0.5 rounded-full ${
                              strategy.badge === "NEW"
                                ? "bg-violet-500/10 text-violet-300"
                                : "bg-amber-500/15 text-amber-400"
                            }`}
                          >
                            {strategy.badge}
                          </span>
                        )}
                      </div>
                      <div>
                        <h4 className="text-white font-semibold text-[13px] tracking-tight">
                          {strategy.name}
                        </h4>
                        <p className="text-gray-500 text-[10px] leading-snug mt-0.5">
                          {strategy.description}
                        </p>
                      </div>
                      {isActive && (
                        <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
                      )}
                    </button>
                  </AnimatedPopup>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </SlideLeft>
  );
}
