
import { useState, useEffect, useCallback } from "react";
import {
  Crown, Hash, Crosshair, Scan, Sparkles,
  BarChart2, ArrowUpDown, ChevronsUpDown, Shield,
  ChevronDown, Bot, CircleHelp, CheckCircle2, Lightbulb, Star,
} from "lucide-react";
import { useTradingStore } from "@/stores/trading-store";
import { STRATEGIES, MARKETS } from "@/lib/markets";
import { SlideLeft, AnimatedPopup } from "@/components/shared/animations";
import type { Strategy } from "@/lib/markets";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { motion, AnimatePresence } from "framer-motion";

const iconMap: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  crown: Crown, hash: Hash, crosshair: Crosshair, scan: Scan,
  sparkles: Sparkles, "bar-chart": BarChart2, "arrow-up-down": ArrowUpDown,
  "chevrons-up-down": ChevronsUpDown, shield: Shield,
};

const difficultyConfig = {
  beginner: { label: "Beginner", className: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20" },
  intermediate: { label: "Intermediate", className: "bg-amber-500/15 text-amber-400 border-amber-500/20" },
  advanced: { label: "Advanced", className: "bg-red-500/15 text-red-400 border-red-500/20" },
};

function HowToUseModal({ strategy, open, onOpenChange }: { strategy: Strategy | null; open: boolean; onOpenChange: (open: boolean) => void }) {
  if (!strategy) return null;

  const Icon = iconMap[strategy.icon] || Bot;
  const diffConfig = difficultyConfig[strategy.difficulty];
  const marketLabels = strategy.bestMarkets.map((sym) => MARKETS.find((m) => m.symbol === sym)?.label || sym);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <AnimatePresence>
        {open && (
          <DialogContent
            className="bg-gray-900 border-gray-700/60 sm:max-w-lg p-0 overflow-hidden"
            showCloseButton={true}
          >
            {/* Header with gradient */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-gradient-to-br from-gray-900 via-gray-900 to-teal-900/30 border-b border-gray-700/40 px-6 pt-6 pb-5"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-teal-500/15 border border-teal-400/25 rounded-xl flex items-center justify-center">
                  <Icon className="text-teal-400" size={20} />
                </div>
                <div className="flex-1">
                  <DialogTitle className="text-white text-lg font-bold">{strategy.name}</DialogTitle>
                  <p className="text-gray-400 text-xs mt-0.5">{strategy.description}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">
                  {strategy.winRate}% Win Rate
                </span>
                <span className={`inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full border ${diffConfig.className}`}>
                  {diffConfig.label}
                </span>
                {strategy.badge && (
                  <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${
                    strategy.badge === "NEW"
                      ? "bg-violet-500/10 text-violet-300 border border-violet-500/20"
                      : "bg-gray-700/50 text-gray-400 border border-gray-600/30"
                  }`}>
                    {strategy.badge}
                  </span>
                )}
              </div>
            </motion.div>

            {/* Scrollable content */}
            <div className="max-h-[60vh] overflow-y-auto px-6 py-5 space-y-6 custom-scrollbar">
              {/* Steps */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.08 }}
              >
                <h3 className="text-sm font-semibold text-white flex items-center gap-2 mb-3">
                  <div className="w-5 h-5 bg-teal-500/15 rounded-md flex items-center justify-center">
                    <span className="text-teal-400 text-[10px] font-bold">✓</span>
                  </div>
                  Step-by-Step Guide
                </h3>
                <div className="space-y-2.5">
                  {strategy.howToUse.steps.map((step, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.1 + i * 0.05 }}
                      className="flex items-start gap-3"
                    >
                      <div className="flex-shrink-0 w-6 h-6 bg-gray-800 border border-gray-700/60 rounded-full flex items-center justify-center mt-0.5">
                        <span className="text-[10px] font-bold text-teal-400">{i + 1}</span>
                      </div>
                      <p className="text-gray-300 text-[13px] leading-relaxed">{step}</p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Tips */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.18 }}
              >
                <h3 className="text-sm font-semibold text-white flex items-center gap-2 mb-3">
                  <Lightbulb size={14} className="text-amber-400" />
                  Pro Tips
                </h3>
                <div className="space-y-2">
                  {strategy.howToUse.tips.map((tip, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.2 + i * 0.05 }}
                      className="flex items-start gap-2.5 bg-amber-500/[0.04] border border-amber-500/10 rounded-lg px-3 py-2"
                    >
                      <Lightbulb size={12} className="text-amber-400 flex-shrink-0 mt-0.5" />
                      <p className="text-gray-300 text-[13px] leading-relaxed">{tip}</p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Recommended Markets */}
              {marketLabels.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: 0.25 }}
                >
                  <h3 className="text-sm font-semibold text-white flex items-center gap-2 mb-3">
                    <Star size={14} className="text-teal-400" />
                    Recommended Markets
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {marketLabels.map((label, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-1.5 text-[12px] font-medium px-2.5 py-1 rounded-lg bg-teal-500/10 text-teal-300 border border-teal-500/15"
                      >
                        <Star size={10} className="text-teal-400" />
                        {label}
                      </span>
                    ))}
                  </div>
                  <p className="text-gray-500 text-xs mt-3 italic">💡 {strategy.howToUse.recommended}</p>
                </motion.div>
              )}
            </div>
          </DialogContent>
        )}
      </AnimatePresence>
    </Dialog>
  );
}

export function StrategySelector() {
  const { activeStrategy, setActiveStrategy, strategySelectorOpen, toggleStrategySelector } =
    useTradingStore();
  const [open, setOpen] = useState(strategySelectorOpen);
  const [howToUseStrategy, setHowToUseStrategy] = useState<Strategy | null>(null);

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

  const handleHowToUse = useCallback((e: React.MouseEvent, strategy: Strategy) => {
    e.stopPropagation();
    setHowToUseStrategy(strategy);
  }, []);

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
                const diffConfig = difficultyConfig[strategy.difficulty];

                return (
                  <AnimatedPopup key={strategy.id} delay={idx * 0.05}>
                    <button
                      disabled={isDisabled}
                      onClick={() => handleSelect(strategy)}
                      className={`relative flex flex-col items-start gap-2 p-3.5 rounded-xl border text-left transition-all cursor-pointer group ${
                        isDisabled
                          ? "opacity-45 cursor-not-allowed bg-gray-900/40 border-gray-800/40"
                          : isActive
                          ? "ring-2 ring-teal-400/40 bg-teal-500/10 border-teal-400/20 shadow-lg shadow-teal-500/5"
                          : "bg-gray-900/60 border-white/[0.06] hover:bg-gray-900/80 hover:border-teal-500/20 hover:scale-[1.02]"
                      }`}
                    >
                      {/* Top row: icon + badges */}
                      <div className="flex items-center justify-between w-full">
                        <div className="w-8 h-8 bg-gray-800/80 border border-gray-700/50 rounded-lg flex items-center justify-center">
                          <Icon
                            className={isActive ? "text-teal-400" : "text-gray-400"}
                            size={16}
                          />
                        </div>
                        <div className="flex items-center gap-1.5">
                          {/* Win rate badge */}
                          {strategy.winRate > 0 && (
                            <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">
                              {strategy.winRate}%
                            </span>
                          )}
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
                      </div>

                      {/* Name & description */}
                      <div className="flex-1 min-w-0">
                        <h4 className="text-white font-semibold text-[13px] tracking-tight">
                          {strategy.name}
                        </h4>
                        <p className="text-gray-500 text-[10px] leading-snug mt-0.5 truncate">
                          {strategy.description}
                        </p>
                      </div>

                      {/* Bottom row: difficulty + How to Use button */}
                      <div className="flex items-center justify-between w-full gap-2">
                        <span className={`text-[9px] font-medium px-1.5 py-0.5 rounded-md border ${diffConfig.className}`}>
                          {diffConfig.label}
                        </span>
                        {!isDisabled && (
                          <span
                            onClick={(e) => handleHowToUse(e, strategy)}
                            className="inline-flex items-center gap-1 text-[10px] font-medium text-teal-400 border border-teal-500/25 rounded-md px-1.5 py-0.5 hover:bg-teal-500/10 transition-colors"
                          >
                            <CircleHelp size={10} />
                            How to Use
                          </span>
                        )}
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

        {/* How to Use Modal */}
        <HowToUseModal
          strategy={howToUseStrategy}
          open={!!howToUseStrategy}
          onOpenChange={(val) => !val && setHowToUseStrategy(null)}
        />
      </div>
    </SlideLeft>
  );
}
