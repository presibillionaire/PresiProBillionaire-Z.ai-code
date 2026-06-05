import { LogOut, Wifi, WifiOff, Radio, TrendingUp, TrendingDown } from "lucide-react";
import { Logo } from "@/components/shared/logo";
import { useTradingStore } from "@/stores/trading-store";
import { SlideDown, GlowPulse } from "@/components/shared/animations";
import { motion } from "framer-motion";

export function DashboardHeader() {
  const { balance, accountType, logout, scanStatus, wsConnected, sessionPL, authorizeResponse } = useTradingStore();

  const displayName = (authorizeResponse as any)?.authorize?.fullname || "Demo User";
  const loginId = (authorizeResponse as any)?.authorize?.loginid || "VRTC0000000";

  return (
    <SlideDown>
      <header className="px-4 sm:px-6 py-3 flex items-center justify-between border-b border-white/[0.06] gap-3 bg-white/[0.02] backdrop-blur-xl">
        <Logo size="sm" />

        <div className="flex items-center gap-2 sm:gap-3 flex-wrap justify-end">
          {/* WebSocket Connection Status */}
          <GlowPulse color={wsConnected ? "teal" : "red"}>
            <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border ${
              wsConnected
                ? "bg-teal-500/10 border-teal-400/20 text-teal-400"
                : "bg-red-500/10 border-red-400/20 text-red-400"
            }`}>
              {wsConnected ? <Wifi size={11} /> : <WifiOff size={11} />}
              <span className="text-[10px] font-medium hidden sm:inline">{wsConnected ? "Connected" : "Disconnected"}</span>
            </div>
          </GlowPulse>

          {/* Account Type Badge */}
          <div className="bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-lg px-2.5 py-1 text-[10px] font-medium flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            <span className="hidden sm:inline">{accountType.toUpperCase()}</span>
            <span className="sm:hidden">{accountType.toUpperCase().slice(0, 1)}</span>
          </div>

          {/* Balance */}
          <motion.div
            className="bg-white/[0.04] border border-white/[0.08] rounded-xl px-3 py-1.5 flex items-center gap-2"
            whileHover={{ scale: 1.02 }}
          >
            <span className="text-[9px] font-medium uppercase tracking-wider text-gray-500 hidden sm:inline">
              Balance
            </span>
            <span className="text-teal-400 font-semibold text-sm tabular-nums">
              USD {balance.toFixed(2)}
            </span>
          </motion.div>

          {/* Session P/L */}
          {sessionPL !== 0 && (
            <motion.div
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border ${
                sessionPL >= 0
                  ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                  : "bg-red-500/10 border-red-500/20 text-red-400"
              }`}
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 0.3 }}
            >
              {sessionPL >= 0 ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
              <span className="text-[10px] font-semibold tabular-nums">
                {sessionPL >= 0 ? "+" : ""}{sessionPL.toFixed(2)}
              </span>
            </motion.div>
          )}

          {/* Live Indicator */}
          {scanStatus !== "idle" && wsConnected && (
            <GlowPulse color="teal">
              <div className="flex items-center gap-1.5 text-teal-400">
                <div className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
                <span className="text-[10px] font-medium hidden sm:inline">Live</span>
              </div>
            </GlowPulse>
          )}

          {/* Exit */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={logout}
            className="text-gray-400 hover:text-red-400 border border-white/[0.08] hover:border-red-500/20 rounded-xl px-2.5 py-1.5 flex items-center gap-1.5 text-[10px] font-medium transition-all cursor-pointer"
          >
            <LogOut size={12} />
            <span className="hidden sm:inline">Exit</span>
          </motion.button>
        </div>
      </header>
    </SlideDown>
  );
}
