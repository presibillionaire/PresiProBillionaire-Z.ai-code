"use client";

import { Zap, RefreshCw, Bot, Settings } from "lucide-react";
import { useTradingStore } from "@/stores/trading-store";
import type { Direction } from "@/stores/trading-store";
import { ConfidenceGauge } from "./confidence-gauge";
import { useState } from "react";
import { TickDurationSlider } from "./settings-panel";

export function StrategyPanel() {
  const {
    activeStrategy,
    direction,
    mode,
    stake,
    tickDuration,
    signalThreshold,
    cooldown,
    confirmCycles,
    trendAgreement,
    takeProfit,
    marketData,
    selectedMarket,
    sessionPL,
    scanStatus,
    statusMessage,
    settingsOpen,
    toggleSettings,
    setDirection,
    setMode,
    setStake,
    setTickDuration,
    setSignalThreshold,
    setCooldown,
    setConfirmCycles,
    setTrendAgreement,
    setTakeProfit,
  } = useTradingStore();

  const currentMarket = marketData[selectedMarket];
  const confidence = currentMarket?.confidence || 0;

  const directions: { key: Direction; label: string; icon: React.ReactNode }[] = [
    { key: "EVEN", label: "EVEN", icon: null },
    { key: "ODD", label: "ODD", icon: null },
    { key: "MIX", label: "MIX", icon: null },
    { key: "AUTO", label: "AUTO", icon: <Bot size={12} /> },
  ];

  const statusLabel =
    scanStatus === "scanning"
      ? "SCANNING"
      : scanStatus === "ready"
      ? "LOCKED ON"
      : scanStatus === "trading"
      ? "TRADING"
      : "WAITING";

  return (
    <div className="relative w-full max-w-4xl mx-auto px-4 mt-4">
      <div className="rounded-2xl border border-white/[0.06] bg-gray-900/60 backdrop-blur-xl shadow-2xl shadow-black/40 overflow-hidden">
        {/* Top accent line */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />

        {/* Ambient glow */}
        <div className="pointer-events-none absolute -top-20 left-1/3 h-44 w-72 rounded-full blur-3xl bg-sky-500/20 animate-pulse-glow" />

        <div className="relative p-4 sm:p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-500/10 border border-emerald-400/20 rounded-xl flex items-center justify-center">
                <Zap className="text-emerald-400" size={20} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-white font-semibold text-[15px] tracking-tight">
                    {activeStrategy?.name || "M Pro"}
                  </h2>
                  <div
                    className={`px-2 py-0.5 rounded-full text-[9px] font-medium ${
                      scanStatus === "scanning"
                        ? "bg-blue-500/10 border border-blue-400/20 text-blue-300"
                        : scanStatus === "ready"
                        ? "bg-emerald-500/10 border border-emerald-400/20 text-emerald-300"
                        : "bg-gray-500/10 border border-gray-400/20 text-gray-300"
                    }`}
                  >
                    {statusLabel}
                  </div>
                </div>
                <p className="text-gray-500 text-[10px] mt-0.5">
                  {activeStrategy?.description || "Even/Odd confidence reactor · 10-market"}
                </p>
              </div>
            </div>
            <button
              onClick={toggleSettings}
              className={`p-2 rounded-lg transition-all cursor-pointer ${
                settingsOpen
                  ? "bg-sky-500/10 border border-sky-400/20 text-sky-400"
                  : "text-gray-400 hover:text-white hover:bg-white/[0.03] border border-white/[0.06]"
              }`}
            >
              <Settings size={16} />
            </button>
          </div>

          {/* Confidence Gauge + Direction Buttons */}
          <div className="flex flex-col items-center gap-6">
            <div className="relative">
              <ConfidenceGauge
                confidence={confidence}
                direction={currentMarket?.direction || "NEUTRAL"}
                market={currentMarket?.label || "Vol 75"}
                status={statusLabel}
              />
            </div>

            {/* Direction Buttons */}
            <div className="flex gap-2">
              {directions.map((dir) => (
                <button
                  key={dir.key}
                  onClick={() => setDirection(dir.key)}
                  className={`px-4 py-2 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                    direction === dir.key
                      ? "bg-emerald-500/10 border border-emerald-400/20 ring-1 ring-emerald-400/40 text-emerald-300"
                      : "bg-white/[0.03] border border-white/[0.06] text-gray-500 hover:bg-white/[0.06] hover:text-gray-300"
                  }`}
                >
                  {dir.icon}
                  {dir.label}
                </button>
              ))}
            </div>

            {/* Mode Toggle */}
            <div className="flex items-center bg-white/[0.03] border border-white/[0.06] rounded-lg p-0.5">
              <button
                onClick={() => setMode("standard")}
                className={`px-3 py-1.5 rounded-md text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
                  mode === "standard"
                    ? "bg-emerald-500/20 text-emerald-300"
                    : "text-gray-500"
                }`}
              >
                <Zap size={12} />
                Standard
              </button>
              <button
                onClick={() => setMode("reverse")}
                className={`px-3 py-1.5 rounded-md text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
                  mode === "reverse"
                    ? "bg-emerald-500/20 text-emerald-300"
                    : "text-gray-500"
                }`}
              >
                <RefreshCw size={12} />
                Reverse
              </button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full">
              <StatCard
                label="Session P/L"
                value={`${sessionPL >= 0 ? "+" : ""}${sessionPL.toFixed(2)}`}
                detail={`target ${takeProfit} USD`}
                positive={sessionPL >= 0}
              />
              <StatCard
                label="Stake"
                value={stake.toFixed(2)}
                detail={`base ${stake.toFixed(2)}`}
                neutral
              />
              <StatCard label="Cooldown" value="Ready" detail="cycle gate" positive />
              <StatCard label="Guard" value="—" detail="manual" neutral />
            </div>

            {/* Status Message */}
            {statusMessage && (
              <div className="w-full bg-blue-500/5 border border-blue-500/20 rounded-lg px-4 py-2.5 flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                <span className="text-blue-300 text-xs font-mono">{statusMessage}</span>
              </div>
            )}
          </div>

          {/* Settings Panel (collapsible) */}
          {settingsOpen && (
            <div className="border-t border-white/[0.06] pt-5 space-y-5 animate-slide-up">
              <h3 className="text-sm text-gray-200 font-semibold uppercase tracking-wider">
                Settings
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Stake */}
                <div className="space-y-1.5">
                  <label className="text-[9px] font-medium uppercase tracking-wider text-gray-500">
                    Stake (USD)
                  </label>
                  <input
                    type="number"
                    value={stake}
                    onChange={(e) => setStake(parseFloat(e.target.value) || 0)}
                    className="w-full bg-gray-800 border border-gray-700 text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-sky-500 tabular-nums"
                  />
                </div>

                {/* Take Profit */}
                <div className="space-y-1.5">
                  <label className="text-[9px] font-medium uppercase tracking-wider text-gray-500">
                    Take Profit (USD)
                  </label>
                  <input
                    type="number"
                    value={takeProfit}
                    onChange={(e) => setTakeProfit(parseFloat(e.target.value) || 0)}
                    className="w-full bg-gray-800 border border-gray-700 text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-sky-500 tabular-nums"
                  />
                </div>
              </div>

              {/* Signal Threshold */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-[9px] font-medium uppercase tracking-wider text-gray-500">
                    Signal Threshold
                  </label>
                  <span className="text-xs text-white tabular-nums">{signalThreshold}%</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="95"
                  value={signalThreshold}
                  onChange={(e) => setSignalThreshold(parseInt(e.target.value))}
                  className="w-full accent-sky-500"
                />
              </div>

              {/* Cooldown */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-[9px] font-medium uppercase tracking-wider text-gray-500">
                    Cooldown
                  </label>
                  <span className="text-xs text-white tabular-nums">{cooldown}s</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="30"
                  value={cooldown}
                  onChange={(e) => setCooldown(parseInt(e.target.value))}
                  className="w-full accent-sky-500"
                />
              </div>

              {/* Confirm Cycles */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-[9px] font-medium uppercase tracking-wider text-gray-500">
                    Confirm Cycles
                  </label>
                  <span className="text-xs text-white tabular-nums">{confirmCycles}</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={confirmCycles}
                  onChange={(e) => setConfirmCycles(parseInt(e.target.value))}
                  className="w-full accent-sky-500"
                />
              </div>

              {/* Trend Agreement */}
              <div className="flex items-center justify-between">
                <label className="text-[9px] font-medium uppercase tracking-wider text-gray-500">
                  Trend Agreement
                </label>
                <button
                  onClick={() => setTrendAgreement(!trendAgreement)}
                  className={`relative w-10 h-5 rounded-full transition-all cursor-pointer ${
                    trendAgreement ? "bg-sky-500" : "bg-gray-700"
                  }`}
                >
                  <div
                    className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${
                      trendAgreement ? "left-[22px]" : "left-0.5"
                    }`}
                  />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  detail,
  positive,
  neutral,
}: {
  label: string;
  value: string;
  detail: string;
  positive?: boolean;
  neutral?: boolean;
}) {
  return (
    <div className="bg-gray-800/50 border border-white/[0.04] rounded-lg p-3">
      <div className="text-[9px] font-medium uppercase tracking-wider text-gray-500 mb-1">
        {label}
      </div>
      <div
        className={`text-base font-bold tabular-nums ${
          neutral
            ? "text-white"
            : positive
            ? "text-emerald-400"
            : "text-red-400"
        }`}
      >
        {value}
      </div>
      <div className="text-[10px] text-gray-600 mt-0.5">{detail}</div>
    </div>
  );
}
