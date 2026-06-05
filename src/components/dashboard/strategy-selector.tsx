import { useState, useEffect, useCallback } from "react";
import {
  Crown, Hash, Crosshair, Scan, Sparkles,
  BarChart2, ArrowUpDown, ChevronsUpDown, Shield,
  ChevronDown, Bot, CircleHelp, CheckCircle2, Lightbulb, Star,
} from "lucide-react";
import { useTradingStore } from "@/stores/trading-store";
import { STRATEGIES, MARKETS } from "@/lib/markets";
import { SlideLeft, AnimatedPopup, PopIn } from "@/components/shared/animations";
import type { Strategy } from "@/lib/markets";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { motion, AnimatePresence } from "framer-motion";

const iconMap: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  crown: Crown, hash: Hash, crosshair: Crosshair, scan: Scan,
  sparkles: Sparkles, "bar-chart": BarChart2, "arrow-up-down": ArrowUpDown,
  "chevrons-up-down": ChevronsUpDown, shield: Shield,
};

const difficultyConfig = {
  beginner: { label: "Beginner", className: "bg-emerald-500/15 text-emerald-400" },
  intermediate: { label: "Intermediate", className: "bg-amber-500/15 text-amber-400" },
  advanced: { label: "Advanced", className: "bg-red-500/15 text-red-400" },
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
            className="bg-gray-900/95 backdrop-blur-xl border-gray-700/40 sm:max-w-lg p-0 overflow-hidden"
            showCloseButton={true}
          >
            {/* Header with gradient */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="relative bg-gradient-to-br from-gray-900 via-gray-900 to-teal-900/20 px-6 pt-6 pb-5 overflow-hidden"
            >
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-teal-400/40 to-transparent" />
              <div className="flex items-center gap-3 mb-3">
                <div className="w-11 h-11 bg-teal-500/15 rounded-xl flex items-center justify-center">
                  <Icon className="text-teal-400" size={22} />
                </div>
                <div className="flex-1">
                  <DialogTitle className="text-white text-lg font-bold">{strategy.name}</DialogTitle>
                  <p className="text-gray-400 text-xs mt-0.5 leading-relaxed">{strategy.description}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-400">
                  {strategy.winRate}% Win Rate
                </span>
                <span className={`inline-flex items-center gap-1 text-[11px] font-medium px-2.5 py-1 rounded-full ${diffConfig.className}`}>
                  {diffConfig.label}
                </span>
                {strategy.badge && (
                  <span className={`text-[11px] font-medium px-2.5 py-1 rounded-full ${
                    strategy.badge === "NEW"
                      ? "bg-violet-500/10 text-violet-300"
                      : "bg-gray-700/50 text-gray-400"
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
                <h3 className="text-sm font-semibold text-white flex items-center gap-2 mb-4">
                  <div className="w-5 h-5 bg-teal-500/15 rounded-md flex items-center justify-center">
                    <CheckCircle2 size={12} className="text-teal-400" />
                  </div>
                  Step-by-Step Guide
                </h3>
                <div className="space-y-3">
                  {strategy.howToUse.steps.map((step, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.1 + i * 0.05 }}
                      className="flex items-start gap-3"
                    >
                      <div className="flex-shrink-0 w-7 h-7 bg-gradient-to-br from-teal-500/20 to-teal-500/5 rounded-full flex items-center justify-center mt-0.5">
                        <span className="text-[11px] font-bold text-teal-400">{i + 1}</span>
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
                <h3 className="text-sm font-semibold text-white flex items-center gap-2 mb-4">
                  <Lightbulb size={15} className="text-amber-400" />
                  Pro Tips
                </h3>
                <div className="space-y-2.5">
                  {strategy.howToUse.tips.map((tip, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.2 + i * 0.05 }}
                      className="flex items-start gap-2.5 bg-amber-500/[0.04] rounded-xl px-3.5 py-2.5"
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
                  <h3 className="text-sm font-semibold text-white flex items-center gap-2 mb-4">
                    <Star size={15} className="text-teal-400" />
                    Recommended Markets
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {marketLabels.map((label, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-1.5 text-[12px] font-medium px-3 py-1.5 rounded-xl bg-teal-500/10 text-teal-300"
                      >
                        <Star size={10} className="text-teal-400 fill-teal-400/30" />
                        {label}
                      </span>
                    ))}
                  </div>
                  <p className="text-gray-500 text-xs mt-3 italic leading-relaxed">{strategy.howToUse.recommended}</p>
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
  const { activeStrategy, setActiveStrategy, strategySelectorOpen, toggleStrategySelector, wsConnected } =
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
      <div className="w-full max-w-4xl mx-auto px-4 pt-4">
        {/* Accordion Trigger - borderless */}
        <PopIn>
          <button
            onClick={handleToggle}
            className="w-full flex items-center justify-between bg-white/[0.04] backdrop-blur-xl rounded-2xl px-4 py-3.5 hover:bg-white/[0.07] transition-all cursor-pointer group"
          >
            <div className="flex items-center gap-3">
              {activeStrategy && (
                <>
                  {(() => {
                    const Icon = iconMap[activeStrategy.icon] || Bot;
                    return (
                      <div className="w-9 h-9 bg-teal-500/12 rounded-xl flex items-center justify-center">
                        <Icon className="text-teal-400" size={16} />
                      </div>
                    );
                  })()}
                  <div className="text-left">
                    <span className="text-white font-semibold text-sm">{activeStrategy.name}</span>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[10px] text-gray-500 uppercase tracking-wider">
                        {activeCount} strategies active
                      </span>
                      {wsConnected && (
                        <span className="flex items-center gap-1 text-[10px] text-teal-400">
                          <div className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
                          Live
                        </span>
                      )}
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
        </PopIn>

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
                    <motion.button
                      disabled={isDisabled}
                      onClick={() => handleSelect(strategy)}
                      whileHover={!isDisabled ? { scale: 1.02 } : {}}
                      whileTap={!isDisabled ? { scale: 0.98 } : {}}
                      className={`relative flex flex-col gap-2.5 p-4 rounded-2xl text-left transition-all cursor-pointer group overflow-hidden ${
                        isDisabled
                          ? "opacity-45 cursor-not-allowed bg-white/[0.02]"
                          : isActive
                          ? "ring-2 ring-teal-400/25 bg-teal-500/[0.08] shadow-xl shadow-teal-500/10"
                          : "bg-white/[0.04] backdrop-blur-xl hover:bg-white/[0.07]"
                      }`}
                    >
                      {/* Top row: icon + badges */}
                      <div className="flex items-center justify-between w-full">
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                          isActive
                            ? "bg-teal-500/20"
                            : "bg-white/[0.06]"
                        }`}>
                          <Icon
                            className={isActive ? "text-teal-400" : "text-gray-400"}
                            size={16}
                          />
                        </div>
                        <div className="flex items-center gap-1.5">
                          {strategy.winRate > 0 && (
                            <span className="text-[9px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400">
                              {strategy.winRate}%
                            </span>
                          )}
                          {strategy.badge && (
                            <span
                              className={`text-[9px] font-medium px-2 py-0.5 rounded-full ${
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
                        <p className="text-gray-500 text-[10px] leading-snug mt-0.5 line-clamp-2">
                          {strategy.description}
                        </p>
                      </div>

                      {/* Bottom row: difficulty + How to Use */}
                      <div className="flex items-center justify-between w-full gap-2">
                        <span className={`text-[9px] font-medium px-2 py-0.5 rounded-lg ${diffConfig.className}`}>
                          {diffConfig.label}
                        </span>
                        {!isDisabled && (
                          <span
                            onClick={(e) => handleHowToUse(e, strategy)}
                            className="inline-flex items-center gap-1 text-[10px] font-medium text-teal-400 bg-teal-500/10 rounded-lg px-2 py-0.5 hover:bg-teal-500/15 transition-colors cursor-pointer"
                          >
                            <CircleHelp size={10} />
                            How to Use
                          </span>
                        )}
                      </div>

                      {/* Active indicator */}
                      {isActive && (
                        <div className="absolute top-3 right-3 flex items-center justify-center">
                          <div className="w-2.5 h-2.5 rounded-full bg-teal-400 animate-pulse" />
                          <div className="absolute w-4 h-4 rounded-full ring-2 ring-teal-400/30 animate-ping" />
                        </div>
                      )}
                    </motion.button>
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
