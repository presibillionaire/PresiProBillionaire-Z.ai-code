import { Play, Wifi, WifiOff } from "lucide-react";
import { useTradingStore } from "@/stores/trading-store";
import { AnimatedPopup, PulseScale } from "@/components/shared/animations";
import { motion } from "framer-motion";
import { useDerivTrade } from "@/hooks/use-deriv-trade";

export function ExecuteButton() {
  const {
    direction, stake, marketData, selectedMarket,
    scanStatus, statusMessage, sessionPL, takeProfit,
    isTrading, wsConnected,
    setIsTrading, addTrade, setSessionPL, setStatusMessage,
  } = useTradingStore();

  const { executeTrade } = useDerivTrade();
  const currentMarket = marketData[selectedMarket];
  const confidence = currentMarket?.confidence || 0;
  const canTrade = scanStatus === "ready" && confidence >= 50 && wsConnected && !isTrading;

  const handleExecute = () => {
    if (!canTrade) return;

    const s = useTradingStore.getState();
    const market = s.marketData[selectedMarket];
    const trade = {
      id: `trade-${Date.now()}`,
      market: selectedMarket,
      marketLabel: market?.label || "Unknown",
      direction: direction as "EVEN" | "ODD",
      stake,
      result: "open" as const,
      profit: 0,
      timestamp: Date.now(),
    };

    setIsTrading(true);
    setStatusMessage(`Executing: ${direction} · ${market?.label} · ${stake.toFixed(2)} USD`);

    // Execute via WebSocket
    executeTrade();

    // Simulate trade result for demo (real WS would handle this)
    setTimeout(() => {
      const win = Math.random() > 0.4;
      const profit = win ? stake * 0.85 : -stake;
      addTrade({
        ...trade,
        id: `trade-${Date.now()}`,
        result: win ? "win" : "loss",
        profit,
        timestamp: Date.now(),
      });
      setSessionPL(sessionPL + profit);
      setStatusMessage(
        `Trade ${win ? "won" : "lost"}: ${profit >= 0 ? "+" : ""}${profit.toFixed(2)} USD`
      );
      setIsTrading(false);
    }, 3000);
  };

  return (
    <AnimatedPopup delay={0.3}>
      <div className="w-full max-w-4xl mx-auto px-4 mt-4">
        {canTrade ? (
          <PulseScale>
            <motion.button
              whileHover={{ scale: 1.01, boxShadow: "0 0 50px rgba(20, 184, 166, 0.4)" }}
              whileTap={{ scale: 0.98 }}
              disabled={!canTrade || isTrading}
              onClick={handleExecute}
              className="w-full rounded-2xl py-4 font-bold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer bg-gradient-to-r from-teal-500 to-emerald-500 text-white shadow-2xl shadow-teal-500/40 relative overflow-hidden"
            >
              {/* Animated shine */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />
              <div className="relative flex items-center gap-2">
                {isTrading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <Play size={18} />
                )}
                {isTrading ? "Executing..." : `${direction} · ${currentMarket?.label || "Select Market"}`}
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
              <div className="w-5 h-5 border-2 border-white/20 border-t-white/20 rounded-full animate-spin" />
            ) : (
              <Play size={18} />
            )}
            {!wsConnected ? (
              <span className="flex items-center gap-1.5"><WifiOff size={14} /> Waiting for connection…</span>
            ) : isTrading ? (
              "Executing..."
            ) : (
              <span>{direction} · {currentMarket?.label || "Select Market"} · Waiting for signal…</span>
            )}
          </button>
        )}
        {statusMessage && (
          <motion.p
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center text-gray-500 text-xs mt-3"
          >
            {statusMessage}
          </motion.p>
        )}
      </div>
    </AnimatedPopup>
  );
}
