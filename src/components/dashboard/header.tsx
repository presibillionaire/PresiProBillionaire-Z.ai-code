import { LogOut, Wifi, WifiOff, TrendingUp, TrendingDown } from "lucide-react";
import { Logo } from "@/components/shared/logo";
import { useTradingStore } from "@/stores/trading-store";
import { SlideDown } from "@/components/shared/animations";
import { motion } from "framer-motion";

export function DashboardHeader() {
  const { balance, accountType, logout, scanStatus, wsConnected, sessionPL } = useTradingStore();

  return (
    <SlideDown>
      <header className="px-4 sm:px-6 py-3 flex items-center justify-between gap-3 bg-white/[0.02] backdrop-blur-xl">
        <Logo size="sm" />

        <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap justify-end">
          {/* WebSocket Connection Status - pill, no border */}
          <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full ${
            wsConnected
              ? "bg-teal-500/15 text-teal-400"
              : "bg-red-500/15 text-red-400"
          }`}>
            {wsConnected ? <Wifi size={12} /> : <WifiOff size={12} />}
            <span className="text-[10px] font-medium hidden sm:inline">
              {wsConnected ? "Live" : "Offline"}
            </span>
          </div>

          {/* Account Type Badge - pill, no border */}
          <div className="bg-amber-500/12 text-amber-400 rounded-full px-2.5 py-1 text-[10px] font-semibold flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            <span>{accountType.toUpperCase()}</span>
          </div>

          {/* Balance - pill, no border */}
          <motion.div
            className="bg-white/[0.05] rounded-full px-3 py-1.5 flex items-center gap-2"
            whileHover={{ scale: 1.02 }}
          >
            <span className="text-[9px] font-medium uppercase tracking-wider text-gray-500 hidden sm:inline">
              Balance
            </span>
            <span className="text-teal-400 font-semibold text-sm tabular-nums">
              {balance.toFixed(2)}
            </span>
          </motion.div>

          {/* Session P/L - pill, no border */}
          {sessionPL !== 0 && (
            <motion.div
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full ${
                sessionPL >= 0
                  ? "bg-emerald-500/12 text-emerald-400"
                  : "bg-red-500/12 text-red-400"
              }`}
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 0.3 }}
            >
              {sessionPL >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
              <span className="text-[10px] font-semibold tabular-nums">
                {sessionPL >= 0 ? "+" : ""}{sessionPL.toFixed(2)}
              </span>
            </motion.div>
          )}

          {/* Live Indicator - no border */}
          {scanStatus !== "idle" && wsConnected && (
            <div className="flex items-center gap-1.5 text-teal-400">
              <div className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
              <span className="text-[10px] font-medium hidden sm:inline">Scanning</span>
            </div>
          )}

          {/* Exit button - subtle, no border */}
          <motion.button
            whileHover={{ scale: 1.05, backgroundColor: "rgba(248, 113, 113, 0.1)" }}
            whileTap={{ scale: 0.95 }}
            onClick={logout}
            className="text-gray-500 hover:text-red-400 rounded-full px-2.5 py-1.5 flex items-center gap-1.5 text-[10px] font-medium transition-colors cursor-pointer"
          >
            <LogOut size={13} />
            <span className="hidden sm:inline">Exit</span>
          </motion.button>
        </div>
      </header>
    </SlideDown>
  );
}
