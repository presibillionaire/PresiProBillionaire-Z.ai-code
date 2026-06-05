import { Sparkles, Bot, BrainCircuit } from "lucide-react";
import { useTradingStore } from "@/stores/trading-store";
import { PopInRight, AnimatedPopup } from "@/components/shared/animations";
import { motion } from "framer-motion";

export function AIStrategist() {
  const { aiEnabled, toggleAI, activeStrategy } = useTradingStore();

  return (
    <PopInRight delay={0.15}>
      <div className="w-full max-w-4xl mx-auto px-4 mt-4">
        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-xl p-4 sm:p-5 relative overflow-hidden">
          {/* Ambient glow */}
          <div className="pointer-events-none absolute -top-10 right-10 h-32 w-32 rounded-full blur-3xl bg-violet-500/10 animate-pulse-glow" />

          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-violet-500/15 border border-violet-400/20 rounded-xl flex items-center justify-center">
                <BrainCircuit className="text-violet-400" size={20} />
              </div>
              <div>
                <h3 className="text-white font-semibold text-[13px] tracking-tight flex items-center gap-2">
                  DeepSeek AI Strategist
                  <Bot size={12} className="text-violet-400" />
                </h3>
                <p className="text-gray-500 text-[10px] mt-0.5">
                  {activeStrategy?.name || "M Pro"} · AI-powered analysis via DeepSeek · Direction override
                </p>
              </div>
            </div>

            {/* Toggle */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={toggleAI}
              className={`relative w-11 h-6 rounded-full transition-all cursor-pointer ${
                aiEnabled ? "bg-violet-500" : "bg-gray-700"
              }`}
            >
              <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all shadow-sm ${
                aiEnabled ? "left-[24px]" : "left-1"
              }`} />
            </motion.button>
          </div>

          {aiEnabled && (
            <AnimatedPopup delay={0}>
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="mt-4 pt-4 border-t border-white/[0.06]"
              >
                <div className="flex items-center gap-2 text-gray-500 text-xs">
                  <Sparkles size={14} className="text-violet-400" />
                  <span>DeepSeek AI will analyze market patterns on the next trade cycle for optimized direction recommendations.</span>
                  <div className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse ml-1 flex-shrink-0" />
                </div>
              </motion.div>
            </AnimatedPopup>
          )}
        </div>
      </div>
    </PopInRight>
  );
}
