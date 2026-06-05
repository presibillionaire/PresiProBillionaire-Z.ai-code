import { Play, Wifi, WifiOff, Loader2, AlertTriangle } from "lucide-react";
import { useTradingStore } from "@/stores/trading-store";
import { AnimatedPopup, PulseScale } from "@/components/shared/animations";
import { motion } from "framer-motion";
import { useDerivTrade } from "@/hooks/use-deriv-trade";
import { useEffect, useRef, useState } from "react";

export function ExecuteButton() {
  const {
    direction, stake, marketData, selectedMarket,
    scanStatus, statusMessage, sessionPL, takeProfit,
    isTrading, wsConnected, trades,
    setIsTrading, setStatusMessage,
  } = useTradingStore();

  const { executeTrade } = useDerivTrade();
  const currentMarket = marketData[selectedMarket];
  const confidence = currentMarket?.confidence || 0;
  const canTrade = scanStatus === "ready" && confidence >= 50 && wsConnected && !isTrading;

  // Track session stats
  const winCount = trades.filter((t) => t.result === "win").length;
  const lossCount = trades.filter((t) => t.result === "loss").length;
  const totalClosed = winCount + lossCount;
  const winRate = totalClosed > 0 ? Math.round((winCount / totalClosed) * 100) : 0;

  // Take profit reached?
  const tpReached = sessionPL >= takeProfit && takeProfit > 0;
  const [cooldownActive, setCooldownActive] = useState(false);
  const cooldownTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleExecute = () => {
    if (!canTrade || cooldownActive || tpReached) return;

    // Set trading state before executing
    setIsTrading(true);
    setStatusMessage(`Initiating trade: ${direction} · ${currentMarket?.label || "Unknown"} · ${stake.toFixed(2)} USD`);

    // Execute via WebSocket — the hook handles the full proposal→buy→result flow
    executeTrade();
  };

  // Cooldown after each trade completes
  useEffect(() => {
    const prevTrading = useRef(isTrading);
    if (prevTrading.current && !isTrading) {
      // Trading just finished — start cooldown
      const cooldownSec = useTradingStore.getState().cooldown;
      if (cooldownSec > 0) {
        setCooldownActive(true);
        cooldownTimerRef.current = setTimeout(() => {
          setCooldownActive(false);
        }, cooldownSec * 1000);
      }
    }
    prevTrading.current = isTrading;
  }, [isTrading]);

  // Cleanup cooldown timer
  useEffect(() => {
    return () => {
      if (cooldownTimerRef.current) clearTimeout(cooldownTimerRef.current);
    };
  }, []);

  // Determine button state
  const getButtonState = () => {
    if (tpReached) return { disabled: true, label: "Take Profit Reached", sub: `${sessionPL.toFixed(2)} USD — session complete` };
    if (isTrading) return { disabled: true, label: "Executing Trade...", sub: "Waiting for Deriv response" };
    if (cooldownActive) return { disabled: true, label: "Cooldown Active", sub: "Waiting before next trade" };
    if (!wsConnected) return { disabled: true, label: "Not Connected", sub: "WebSocket disconnected" };
    if (scanStatus !== "ready") return { disabled: true, label: "Scanning Markets", sub: "Collecting tick data..." };
    if (confidence < 50) return { disabled: true, label: "Low Signal", sub: `${Math.round(confidence)}% — need 50%+ confidence` };
    return { disabled: false, label: "", sub: "" };
  };

  const btnState = getButtonState();

  return (
    <AnimatedPopup delay={0.3}>
      <div className="w-full max-w-4xl mx-auto px-4 mt-4">
        {/* Execute Button */}
        {!btnState.disabled ? (
          <PulseScale>
            <motion.button
              whileHover={{ scale: 1.01, boxShadow: "0 0 50px rgba(20, 184, 166, 0.4)" }}
              whileTap={{ scale: 0.98 }}
              onClick={handleExecute}
              className="w-full rounded-2xl py-4 font-bold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer bg-gradient-to-r from-teal-500 to-emerald-500 text-white shadow-2xl shadow-teal-500/40 relative overflow-hidden"
            >
              {/* Animated shine */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />
              <div className="relative flex items-center gap-2">
                <Play size={18} />
                {direction} · {currentMarket?.label || "Select Market"}
                <span className="opacity-70">· {Math.round(confidence)}% · ${stake.toFixed(2)}</span>
              </div>
            </motion.button>
          </PulseScale>
        ) : (
          <button
            disabled
            className="w-full rounded-2xl py-4 font-bold text-sm flex items-center justify-center gap-2 transition-all cursor-not-allowed bg-white/[0.03] border border-white/[0.06] text-white/20"
          >
            {isTrading ? (
              <Loader2 size={18} className="animate-spin" />
            ) : !wsConnected ? (
              <WifiOff size={18} />
            ) : (
              <Play size={18} />
            )}
            <span>{btnState.label}</span>
            {btnState.sub && <span className="text-white/10">· {btnState.sub}</span>}
          </button>
        )}

        {/* Status Message */}
        {statusMessage && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-3 rounded-xl px-4 py-2.5 flex items-center gap-2.5 bg-white/[0.03]"
          >
            <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
              statusMessage.includes("⚠") || statusMessage.includes("❌")
                ? "bg-red-400"
                : statusMessage.includes("✅") || statusMessage.includes("🎉")
                  ? "bg-emerald-400"
                  : "bg-teal-400 animate-pulse"
            }`} />
            <span className={`text-xs font-mono ${
              statusMessage.includes("⚠") || statusMessage.includes("❌")
                ? "text-red-400"
                : statusMessage.includes("✅") || statusMessage.includes("🎉")
                  ? "text-emerald-400"
                  : "text-gray-400"
            }`}>
              {statusMessage}
            </span>
          </motion.div>
        )}

        {/* Take Profit Warning */}
        {tpReached && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-2 rounded-xl px-4 py-2.5 flex items-center gap-2.5 bg-emerald-500/[0.08] border border-emerald-500/20"
          >
            <AlertTriangle className="text-emerald-400" size={14} />
            <span className="text-emerald-400 text-xs font-medium">
              Take Profit of ${takeProfit.toFixed(2)} reached! Session P/L: +{sessionPL.toFixed(2)} USD
            </span>
          </motion.div>
        )}

        {/* Quick Stats */}
        {totalClosed > 0 && (
          <div className="mt-3 flex items-center justify-center gap-4 text-[10px] text-gray-500">
            <span>Trades: <span className="text-white font-mono">{totalClosed}</span></span>
            <span className="text-gray-700">|</span>
            <span>Won: <span className="text-emerald-400 font-mono">{winCount}</span></span>
            <span className="text-gray-700">|</span>
            <span>Lost: <span className="text-red-400 font-mono">{lossCount}</span></span>
            <span className="text-gray-700">|</span>
            <span>Win Rate: <span className={`font-mono ${winRate >= 50 ? "text-emerald-400" : "text-red-400"}`}>{winRate}%</span></span>
          </div>
        )}
      </div>
    </AnimatedPopup>
  );
}
