import { Zap, RefreshCw, Bot, Settings, Wifi, WifiOff, TrendingUp, Target, DollarSign, Shield } from "lucide-react";
import { useTradingStore } from "@/stores/trading-store";
import type { Direction } from "@/stores/trading-store";
import { ConfidenceGauge } from "./confidence-gauge";
import { AnimatedPopup, SlideUp, PopIn } from "@/components/shared/animations";
import { motion } from "framer-motion";

export function StrategyPanel() {
  const {
    activeStrategy, direction, mode, stake,
    signalThreshold, cooldown, confirmCycles,
    trendAgreement, takeProfit, marketData, selectedMarket,
    sessionPL, scanStatus, statusMessage, settingsOpen,
    wsConnected, lastTickTime,
    toggleSettings, setDirection, setMode, setStake,
    setSignalThreshold, setCooldown, setConfirmCycles,
    setTrendAgreement, setTakeProfit, setSelectedMarket,
  } = useTradingStore();

  const currentMarket = marketData[selectedMarket];
  const confidence = currentMarket?.confidence || 0;
  const lastDigit = currentMarket?.lastDigits?.length > 0 ? currentMarket.lastDigits[currentMarket.lastDigits.length - 1] : null;

  const directions: { key: Direction; label: string; icon: React.ReactNode }[] = [
    { key: "EVEN", label: "EVEN", icon: null },
    { key: "ODD", label: "ODD", icon: null },
    { key: "MIX", label: "MIX", icon: null },
    { key: "AUTO", label: "AUTO", icon: <Bot size={12} /> },
  ];

  const statusLabel =
    scanStatus === "scanning" ? "SCANNING"
    : scanStatus === "ready" ? "LOCKED ON"
    : scanStatus === "trading" ? "TRADING"
    : "WAITING";

  const winCount = useTradingStore((s) => s.trades.filter((t) => t.result === "win").length);
  const totalClosed = useTradingStore((s) => s.trades.filter((t) => t.result === "win" || t.result === "loss").length);
  const winRate = totalClosed > 0 ? Math.round((winCount / totalClosed) * 100) : 0;

  return (
    <AnimatedPopup delay={0.05}>
      <div className="relative w-full max-w-4xl mx-auto px-4 mt-4">
        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-xl shadow-2xl shadow-black/40 overflow-hidden">
          {/* Top accent line */}
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-teal-400/40 to-transparent" />

          {/* Ambient glow */}
          <div className="pointer-events-none absolute -top-20 left-1/3 h-44 w-72 rounded-full blur-3xl bg-teal-500/10 animate-pulse-glow" />

          <div className="relative p-4 sm:p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 bg-teal-500/10 border border-teal-400/20 rounded-xl flex items-center justify-center">
                  <Zap className="text-teal-400" size={20} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-white font-semibold text-[15px] tracking-tight">
                      {activeStrategy?.name || "M Pro"}
                    </h2>
                    <div
                      className={`px-2.5 py-0.5 rounded-full text-[9px] font-medium ${
                        scanStatus === "scanning" || scanStatus === "ready"
                          ? "bg-teal-500/10 border border-teal-400/20 text-teal-300"
                          : scanStatus === "trading"
                          ? "bg-amber-500/10 border border-amber-400/20 text-amber-300"
                          : "bg-gray-500/10 border border-gray-400/20 text-gray-300"
                      }`}
                    >
                      <div className="flex items-center gap-1.5">
                        <div className={`w-1.5 h-1.5 rounded-full ${
                          scanStatus === "scanning" ? "bg-teal-400 animate-pulse" :
                          scanStatus === "ready" ? "bg-emerald-400" :
                          scanStatus === "trading" ? "bg-amber-400 animate-pulse" :
                          "bg-gray-500"
                        }`} />
                        {statusLabel}
                      </div>
                    </div>
                    {wsConnected && (
                      <div className="flex items-center gap-1 text-[9px] text-teal-400">
                        <Wifi size={10} />
                        <span>Live</span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <p className="text-gray-500 text-[10px]">
                      {activeStrategy?.description?.substring(0, 60)}…
                    </p>
                    {lastDigit !== null && (
                      <span className="text-[10px] text-gray-600">Last digit: <span className="text-white font-mono">{lastDigit}</span></span>
                    )}
                  </div>
                </div>
              </div>
              <button
                onClick={toggleSettings}
                className={`p-2.5 rounded-xl transition-all cursor-pointer hover:scale-110 active:scale-95 ${
                  settingsOpen
                    ? "bg-teal-500/10 border border-teal-400/20 text-teal-400"
                    : "text-gray-400 hover:text-white bg-white/[0.03] border border-white/[0.08]"
                }`}
              >
                <Settings size={16} />
              </button>
            </div>

            {/* Market selector */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[9px] font-medium uppercase tracking-wider text-gray-500">Market:</span>
              {[
                { symbol: "1HZ10V", label: "Vol 10" },
                { symbol: "1HZ25V", label: "Vol 25" },
                { symbol: "1HZ50V", label: "Vol 50" },
                { symbol: "1HZ75V", label: "Vol 75" },
                { symbol: "1HZ100V", label: "Vol 100" },
              ].map((m) => (
                <button
                  key={m.symbol}
                  onClick={() => setSelectedMarket(m.symbol)}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-medium transition-all cursor-pointer ${
                    selectedMarket === m.symbol
                      ? "bg-teal-500/15 border border-teal-400/25 text-teal-300"
                      : "bg-white/[0.03] border border-white/[0.06] text-gray-500 hover:text-gray-300 hover:border-white/[0.12]"
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>

            {/* Confidence Gauge */}
            <div className="flex flex-col items-center gap-6">
              <PopIn delay={0.1}>
                <div className="relative">
                  <ConfidenceGauge
                    confidence={Math.round(confidence)}
                    direction={currentMarket?.direction || "NEUTRAL"}
                    market={currentMarket?.label || "Vol 75"}
                    status={statusLabel}
                  />
                </div>
              </PopIn>

              {/* Direction Buttons */}
              <div className="flex gap-2">
                {directions.map((dir, i) => (
                  <AnimatedPopup key={dir.key} delay={0.15 + i * 0.04}>
                    <motion.button
                      onClick={() => setDirection(dir.key)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`px-5 py-2.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                        direction === dir.key
                          ? "bg-teal-500/15 border border-teal-400/25 ring-1 ring-teal-400/40 text-teal-300 shadow-lg shadow-teal-500/10"
                          : "bg-white/[0.03] border border-white/[0.08] text-gray-500 hover:bg-white/[0.06] hover:text-gray-300"
                      }`}
                    >
                      {dir.icon}
                      {dir.label}
                    </motion.button>
                  </AnimatedPopup>
                ))}
              </div>

              {/* Mode Toggle */}
              <div className="flex items-center bg-white/[0.03] border border-white/[0.08] rounded-xl p-1">
                <button
                  onClick={() => setMode("standard")}
                  className={`px-4 py-2 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
                    mode === "standard" ? "bg-teal-500/20 text-teal-300 shadow-md" : "text-gray-500 hover:text-gray-300"
                  }`}
                >
                  <Zap size={12} />
                  Standard
                </button>
                <button
                  onClick={() => setMode("reverse")}
                  className={`px-4 py-2 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
                    mode === "reverse" ? "bg-violet-500/20 text-violet-300 shadow-md" : "text-gray-500 hover:text-gray-300"
                  }`}
                >
                  <RefreshCw size={12} />
                  Reverse
                </button>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full">
                {[
                  {
                    label: "Session P/L",
                    value: `${sessionPL >= 0 ? "+" : ""}${sessionPL.toFixed(2)}`,
                    detail: `target ${takeProfit} USD`,
                    positive: sessionPL >= 0,
                    icon: <DollarSign size={12} />,
                  },
                  {
                    label: "Stake",
                    value: `$${stake.toFixed(2)}`,
                    detail: `per trade`,
                    neutral: true,
                    icon: <Target size={12} />,
                  },
                  {
                    label: "Signal",
                    value: `${confidence.toFixed(0)}%`,
                    detail: `confidence`,
                    positive: confidence >= 60,
                    icon: <TrendingUp size={12} />,
                  },
                  {
                    label: "Win Rate",
                    value: `${winRate}%`,
                    detail: `${winCount}/${totalClosed} trades`,
                    positive: winRate >= 50,
                    neutral: totalClosed === 0,
                    icon: <Shield size={12} />,
                  },
                ].map((stat, i) => (
                  <AnimatedPopup key={stat.label} delay={0.2 + i * 0.04}>
                    <StatCard {...stat} />
                  </AnimatedPopup>
                ))}
              </div>

              {/* Status Message */}
              {statusMessage && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="w-full bg-teal-500/[0.06] border border-teal-500/15 rounded-xl px-4 py-3 flex items-center gap-2.5"
                >
                  <div className="w-2 h-2 rounded-full bg-teal-400 animate-pulse flex-shrink-0" />
                  <span className="text-teal-300 text-xs font-mono">{statusMessage}</span>
                </motion.div>
              )}
            </div>

            {/* Settings Panel */}
            {settingsOpen && (
              <SlideUp delay={0}>
                <div className="border-t border-white/[0.06] pt-5 space-y-5">
                  <h3 className="text-sm text-gray-200 font-semibold uppercase tracking-wider flex items-center gap-2">
                    <Settings size={14} className="text-gray-500" />
                    Settings
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[9px] font-medium uppercase tracking-wider text-gray-500">Stake (USD)</label>
                      <input type="number" value={stake} onChange={(e) => setStake(parseFloat(e.target.value) || 0)}
                        className="w-full bg-gray-800/80 border border-white/[0.08] text-white text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:border-teal-500/50 focus:ring-1 focus:ring-teal-500/20 tabular-nums transition-all" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[9px] font-medium uppercase tracking-wider text-gray-500">Take Profit (USD)</label>
                      <input type="number" value={takeProfit} onChange={(e) => setTakeProfit(parseFloat(e.target.value) || 0)}
                        className="w-full bg-gray-800/80 border border-white/[0.08] text-white text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:border-teal-500/50 focus:ring-1 focus:ring-teal-500/20 tabular-nums transition-all" />
                    </div>
                  </div>

                  {[
                    { label: "Signal Threshold", value: signalThreshold, min: 50, max: 95, unit: "%", set: setSignalThreshold },
                    { label: "Cooldown", value: cooldown, min: 1, max: 30, unit: "s", set: setCooldown },
                    { label: "Confirm Cycles", value: confirmCycles, min: 1, max: 10, unit: "", set: setConfirmCycles },
                  ].map((s) => (
                    <div key={s.label} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-[9px] font-medium uppercase tracking-wider text-gray-500">{s.label}</label>
                        <span className="text-xs text-white tabular-nums font-medium">{s.value}{s.unit}</span>
                      </div>
                      <input type="range" min={s.min} max={s.max} value={s.value}
                        onChange={(e) => s.set(parseInt(e.target.value))}
                        className="w-full accent-teal-500 h-1.5" />
                    </div>
                  ))}

                  <div className="flex items-center justify-between">
                    <label className="text-[9px] font-medium uppercase tracking-wider text-gray-500">Trend Agreement</label>
                    <button onClick={() => setTrendAgreement(!trendAgreement)}
                      className={`relative w-11 h-6 rounded-full transition-all cursor-pointer ${trendAgreement ? "bg-teal-500" : "bg-gray-700"}`}>
                      <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all shadow-sm ${trendAgreement ? "left-[24px]" : "left-1"}`} />
                    </button>
                  </div>
                </div>
              </SlideUp>
            )}
          </div>
        </div>
      </div>
    </AnimatedPopup>
  );
}

function StatCard({ label, value, detail, positive, neutral, icon }: {
  label: string; value: string; detail: string; positive?: boolean; neutral?: boolean; icon?: React.ReactNode;
}) {
  return (
    <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-3.5 hover:border-teal-500/10 transition-all group">
      <div className="flex items-center gap-1.5 mb-1.5">
        <span className="text-gray-600 group-hover:text-teal-400 transition-colors">{icon}</span>
        <span className="text-[9px] font-medium uppercase tracking-wider text-gray-500">{label}</span>
      </div>
      <div className={`text-lg font-bold tabular-nums ${
        neutral ? "text-white" : positive ? "text-teal-400" : "text-red-400"
      }`}>{value}</div>
      <div className="text-[10px] text-gray-600 mt-0.5">{detail}</div>
    </div>
  );
}
