"use client";

import { LogOut, Zap } from "lucide-react";
import { Logo } from "@/components/shared/logo";
import { useTradingStore } from "@/stores/trading-store";

export function DashboardHeader() {
  const { balance, accountType, logout, scanStatus } = useTradingStore();

  return (
    <header className="px-4 sm:px-6 py-3 flex items-center justify-between border-b border-gray-800/50 gap-3">
      <Logo size="sm" />

      <div className="flex items-center gap-2 sm:gap-3">
        {/* Account Type Badge */}
        <div className="bg-amber-500/15 text-amber-400 border border-amber-500/25 rounded-full px-2.5 py-1 text-[10px] font-medium flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
          <span className="hidden sm:inline">{accountType.toUpperCase()}</span>
          <span className="sm:hidden">{accountType.toUpperCase().slice(0, 1)}</span>
        </div>

        {/* Balance */}
        <div className="bg-gray-800/70 border border-gray-700/60 rounded-lg px-3 py-1.5 flex items-center gap-2">
          <span className="text-[9px] font-medium uppercase tracking-wider text-gray-500 hidden sm:inline">
            Balance
          </span>
          <span className="text-emerald-400 font-semibold text-sm tabular-nums">
            USD {balance.toFixed(2)}
          </span>
        </div>

        {/* Live Indicator */}
        {scanStatus !== "idle" && (
          <div className="flex items-center gap-1.5 text-emerald-400">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10px] font-medium hidden sm:inline">Live</span>
          </div>
        )}

        {/* Exit */}
        <button
          onClick={logout}
          className="text-gray-400 hover:text-red-400 border border-gray-700/60 hover:border-red-900/60 rounded-lg px-2.5 py-1.5 flex items-center gap-1.5 text-[10px] font-medium transition-all cursor-pointer"
        >
          <LogOut size={12} />
          <span className="hidden sm:inline">Exit</span>
        </button>
      </div>
    </header>
  );
}
